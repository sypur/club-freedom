import { Migrations } from "@convex-dev/migrations";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { components } from "./_generated/api";


export const migrations = new Migrations<DataModel>(components.migrations);

export const setDefaultApprovedValue = migrations.define({
  table: "testimonials",
  migrateOne: () => ({ approved: true }),
});

export const setTestimonialOrganizationId = internalMutation({
  args: { organizationId: v.optional(v.string()) },
  handler: async (ctx, { organizationId }) => {
    const testimonials = await ctx.db.query("testimonials").collect();
    for (const testimonial of testimonials) {
      await ctx.db.patch(testimonial._id, { organizationId });
    }
  },
});

export const backFillSearchText = migrations.define({
  table: "testimonials",
  migrateOne(_, doc) {
    if (doc.searchText) {
      return {};
    }
    const email = doc.email || "";
    const name = doc.name || "";
    const summary = doc.summary || "";
    const text = doc.testimonialText || "";
    const title = doc.title || "";
    const eventName = doc.eventName || "";
    const searchText = [email, name, summary, text, title, eventName].join(" ");
    return { searchText };
  },
});

export const runMigration = migrations.runner([
  internal.migrations.fillProcessingStatus,
]);

export const undoMigration = migrations.runner([
  internal.migrations.unsetProcessingStatus,
]);

export const fillProcessingStatus = migrations.define({
  table: "testimonials",
  migrateOne: (_, doc) => {
    if (doc.processingStatus) {
      return {};
    }

    if (!doc.testimonialText || !doc.title || !doc.summary) {
      return { processingStatus: "error" as const };
    }

    return { processingStatus: "completed" as const };
  },
});

export const unsetProcessingStatus = migrations.define({
  table: "testimonials",
  migrateOne: () => {
    return { processingStatus: undefined };
  },
});
