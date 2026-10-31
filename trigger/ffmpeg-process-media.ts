import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { logger, task } from "@trigger.dev/sdk";
import { ConvexHttpClient } from "convex/browser";
import type { FunctionArgs } from "convex/server";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";
import { PostHog } from "posthog-node";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { env } from "@/env/trigger";
import { TEMP_TESTIMONIAL_FOLDER } from "@/lib/constants";

const convexHttpClient = new ConvexHttpClient(env.CONVEX_URL);

const s3Client = new S3Client({
  // How to authenticate to R2: https://developers.cloudflare.com/r2/api/s3/tokens/
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const postHogClient = new PostHog(env.POSTHOG_API_KEY, {
  host: env.POSTHOG_HOST,
});

const transcribeClient = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: `${env.AI_GATEWAY_ENDPOINT}/groq`,
  defaultHeaders: {
    "cf-aig-authorization": `Bearer ${env.AI_GATEWAY_API_TOKEN}`,
  },
});

export async function transcribeAudio(media_path: string) {
  const transcription = await transcribeClient.audio.transcriptions.create({
    file: fs.createReadStream(media_path),
    model: "whisper-large-v3",
    language: "en",
  });
  return transcription.text;
}

const ffmpegCompressionOptions = [
  "-preset veryslow", // Slowest preset for best compression
  "-b:a 64k", // Reduce audio bitrate to 64k
  "-ac 1", // Convert to mono audio
];

const ffmpegAudioCompressionptions = [
  ...ffmpegCompressionOptions,
  "-ar 16000", // Set audio sample rate to 16kHz
];

async function ffmpegCompressAudio(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        ...ffmpegAudioCompressionptions,
        "-c:a libopus", // Audio codec
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

async function ffmpegCompressVideo(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        ...ffmpegCompressionOptions,
        "-crf 28", // Constant Rate Factor for video quality
        "-c:v libvpx-vp9", // Video codec
        "-c:a libopus", // Audio codec
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

async function extractAudio(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        ...ffmpegAudioCompressionptions,
        "-c:a libopus", // Audio codec
        "-vn", // Disable video output
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

export const ffmpegProcessMedia = task({
  id: "ffmpeg-process-media",
  run: async (payload: {
    testimonialId: Id<"testimonials">;
    mediaKey: string;
  }) => {
    const { mediaKey, testimonialId } = payload;

    // Generate file names
    const tempDirectory = os.tmpdir();
    const isMediaTemp = mediaKey.includes(TEMP_TESTIMONIAL_FOLDER);
    const substringToRemove = /temp\//g;
    const slashRegex = /\//g;
    const compressionOutputPathWithSlash = isMediaTemp
      ? mediaKey.replace(substringToRemove, "")
      : mediaKey;
    const edittedMediaKey = isMediaTemp
      ? mediaKey.replace(substringToRemove, "").replace(slashRegex, "_")
      : mediaKey.replace(slashRegex, "_");
    const inputPath = path.join(tempDirectory, `input_${edittedMediaKey}`);
    const compressionOutputPath = path.join(
      tempDirectory,
      `compressed_${edittedMediaKey}.webm`,
    );
    const audioExtractionOutputPath = path.join(
      tempDirectory,
      `extracted_audio_${edittedMediaKey}.webm`,
    );

    const convexMutationArgs: FunctionArgs<
      typeof api.testimonials.updateTestimonial
    > = {
      _id: testimonialId,
    };

    try {
      // Retrieve file from r2 and save it locally
      const { Body, ContentType } = await s3Client.send(
        new GetObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: mediaKey,
        }),
      );
      if (!Body) {
        throw new Error("Failed to fetch media");
      }

      logger.info(`Media fetched from R2`);

      const isAudio = ContentType?.startsWith("audio/");
      const isVideo = ContentType?.startsWith("video/");

      const writeStream = fs
        .createWriteStream(inputPath)
        .on("error", (err) => logger.error(err.message));
      writeStream.write(await Body.transformToByteArray());

      //only compress if file from r2 is a temp file
      if (isMediaTemp) {
        if (isVideo) {
          await ffmpegCompressVideo(inputPath, compressionOutputPath);
          logger.info("Video compressed");
        }
        if (isAudio) {
          await ffmpegCompressAudio(inputPath, compressionOutputPath);
          logger.info("Audio compressed");
        }

        const compressedMedia = await fsPromises.readFile(
          compressionOutputPath,
        );

        const uploadParams = {
          Bucket: process.env.R2_BUCKET,
          Key: compressionOutputPathWithSlash,
          Body: compressedMedia,
          ContentType: isVideo ? "video/webm" : "audio/webm",
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        await convexHttpClient.mutation(api.r2.syncMetadata, {
          key: compressionOutputPathWithSlash,
        });
        convexMutationArgs.storageId = compressionOutputPathWithSlash;
        logger.info(`File uploaded to R2: ${compressionOutputPathWithSlash}`);
      }

      let transcribePath = isMediaTemp ? compressionOutputPath : inputPath;

      if (isVideo) {
        await extractAudio(transcribePath, audioExtractionOutputPath);
        transcribePath = audioExtractionOutputPath;
        logger.info("Audio extracted from video");
      }

      convexMutationArgs.testimonialText =
        await transcribeAudio(transcribePath);
      logger.info("Transcription completed");

      await convexHttpClient.mutation(
        api.testimonials.updateTestimonial,
        convexMutationArgs,
      );
      logger.info("Testimonial updated successfully");

      if (isMediaTemp) {
        await convexHttpClient.mutation(api.r2.deleteObject, {
          key: mediaKey,
        });
        logger.info("Old media deleted successfully");
      }
    } catch (err) {
      logger.error(
        `Error while compressing media: ${err instanceof Error ? err.message : null}`,
      );

      await convexHttpClient.mutation(api.testimonials.updateTestimonial, {
        _id: testimonialId,
        processingStatus: "error",
      });
      postHogClient.captureException(err, `media-process-${testimonialId}`, {
        testimonialId: testimonialId,
        mediaKey: mediaKey,
      });
    } finally {
      // Delete temporary files and the original object in parallel
      const deleteOutputPromise = fsPromises
        .unlink(compressionOutputPath)
        .catch((err) => logger.error(err.message));

      const deleteInputPromise = fsPromises
        .unlink(inputPath)
        .catch((err) => logger.error(err.message));

      const deleteExtractedAudioPromise = fsPromises
        .unlink(audioExtractionOutputPath)
        .catch((err) => logger.error(err.message));

      await Promise.all([
        deleteInputPromise,
        deleteOutputPromise,
        deleteExtractedAudioPromise,
      ]);
    }
    return;
  },
});
