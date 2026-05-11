import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { env } from "../env/client";
import { db } from "../lib/offline/db";
import type {
  MediaWorkerIncomingMessage,
  MediaWorkerOutgoingMessage,
} from "../utils/upload-worker-types";

const client = new ConvexHttpClient(env.VITE_CONVEX_URL);

async function retryUpload() {
  const medias = await db.media.toArray();
  for (const media of medias) {
    if (media.status === "done") {
      await db.media.delete(media.id);
    }
    await uploadMedia(media.id);
  }
}

async function uploadMedia(testimonialId: string) {
  const result = await db.media.get(testimonialId);
  if (!result) {
    return;
  }

  const file = new File([result.blob], `testimonial-${testimonialId}`, {
    type: result.blob.type,
  });

  try {
    await db.media.update(testimonialId, { status: "uploading" });

    // Upload to R2
    const { key, url } = await client.mutation(
      api.uploadTempFile.generateTempUploadUrl,
      {
        organizationId: result.organizationId,
      },
    );

    console.log("[Worker] Generate custom upload URL");

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = progressEvent.loaded / progressEvent.total;
          console.log(`[Worker] Upload progress: ${progress}`);
          self.postMessage({
            action: "progress",
            id: testimonialId,
            progress,
          } satisfies MediaWorkerOutgoingMessage);
        }
      },
    });

    console.log("[Worker] Media uploaded to R2");

    await client.mutation(api.r2.syncMetadata, {
      key,
    });

    console.log("[Worker] Sync metadata with R2");

    // Update to the database
    await client.mutation(api.testimonials.updateTestimonial, {
      _id: testimonialId as Id<"testimonials">,
      storageId: key,
    });

    console.log("[Worker] Save media into the remote database");

    await db.media.update(testimonialId, { status: "done" });
    await db.media.delete(testimonialId);
    console.log("[Worker] Delete media from local database");
  } catch (error) {
    console.error("[Worker]", error);
    await db.media.update(testimonialId, { status: "error" });
  }
}

self.onmessage = async (e: MessageEvent<MediaWorkerIncomingMessage>) => {
  const message = e.data;

  switch (message.action) {
    case "upload":
      await uploadMedia(message.id);
      break;
    case "retry":
      await retryUpload();
      break;
  }
};
