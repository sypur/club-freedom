"use node";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v } from "convex/values";
import { extension as getExtension } from "mime-types";
import { createR2Client } from "@/lib/r2";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { r2 } from "./r2";
import { posthog } from "./libs/posthog";

export const generateMediaDownloadUrl = action({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    try {
      const canDownload = await ctx.runQuery(api.auth.checkUserPermissions, {
        permissions: { testimonial: ["download"] },
      });
      if (!canDownload) {
        throw new Error("Testimonial Download Forbidden");
      }
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        { id },
      );

      if (!testimonial?.storageId) {
        throw new Error(`Testimonial not found or has no media for id ${id}`);
      }

      const r2Client = createR2Client(r2.config);

      const fileName = `${Math.floor(testimonial._creationTime)}-${testimonial.name}-${testimonial.storageId}`;
      const metadata = await r2.getMetadata(ctx, testimonial.storageId);
      const extension = getExtension(metadata?.contentType || "") ?? "webm";
      const file = `${fileName}.${extension}`;

      const url: string = await getSignedUrl(
        r2Client,
        new GetObjectCommand({
          Bucket: r2.config.bucket,
          Key: testimonial.storageId,
          ResponseContentDisposition: `attachment; filename="${file}"`,
          ResponseContentType: metadata?.contentType,
        }),
        { expiresIn: 900 }, // URL valid for 15 minutes
      );

      return url;
    } catch (e) {
      posthog.captureException(ctx, {
        distinctId: `generateMediaDownloadUrl-${id}`,
        error: {
          id: id,
        }
      });
      return undefined;
    }
  },
});

export const deleteMedia = action({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    await ctx.runMutation(api.r2.deleteObject, {
      key: storageId,
    });
  },
});
