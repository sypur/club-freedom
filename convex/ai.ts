"use node";

import { v } from "convex/values";
import { summarize } from "@/convex/libs/ai/summarize";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { posthog } from "./libs/posthog";

// Action to handle Gemini text summarization (runs in Node.js environment)
export const summarizeText = action({
  args: {
    testimonialId: v.id("testimonials"),
    text: v.string(),
  },
  handler: async (ctx, { testimonialId, text }) => {
    try {
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        { id: testimonialId },
      );
      if (testimonial) {
        const resp = await summarize(text, testimonial.name);
        await ctx.runMutation(api.testimonials.updateSummaryAndTitle, {
          id: testimonialId,
          summary: resp.summary,
          title: resp.title,
        });
        await ctx.runMutation(api.testimonials.updateProcessingStatus, {
          id: testimonialId,
          processingStatus: "completed",
        });
      } else {
        throw new Error("Testimonial not found");
      }
    } catch (error) {
      await ctx.runMutation(api.testimonials.updateProcessingStatus, {
        id: testimonialId,
        processingStatus: "error",
      });
      await posthog.captureException(ctx, {
        distinctId: `summarizeText`,
        error,
        additionalProperties: {
          testimonialId: testimonialId,
          text: text,
        },
      });
      return;
    }
  },
});
