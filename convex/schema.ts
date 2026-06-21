import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { themeSchema } from "@/lib/theme";

export const processingStatusSchema = v.union(
  v.literal("ongoing"),
  v.literal("completed"),
  v.literal("error"),
);

export const mediaTypeSchema = v.union(
  v.literal("text"),
  v.literal("video"),
  v.literal("audio"),
);

export const formEventSchema = v.object({
  id: v.string(),
  name: v.string(),
  date: v.number(),
});

export default defineSchema({
  testimonials: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    media_type: mediaTypeSchema,
    storageId: v.optional(v.string()),
    title: v.optional(v.string()),
    eventId: v.optional(v.string()),
    eventName: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    testimonialText: v.optional(v.string()),
    summary: v.optional(v.string()),
    searchText: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    approved: v.optional(v.boolean()),
    processingStatus: v.optional(processingStatusSchema),
  })
    .index("by_processingStatus_and_organizationId", {
      fields: ["processingStatus", "organizationId"],
    })
    .searchIndex("search_posts", {
      searchField: "searchText",
      filterFields: ["processingStatus", "organizationId"],
    }),
  formPreferences: defineTable({
    organizationId: v.string(),
    name: v.string(),
    branding: v.optional(v.string()),
    textInstructions: v.optional(v.string()),
    textEnabled: v.boolean(),
    audioInstructions: v.optional(v.string()),
    audioEnabled: v.boolean(),
    videoInstructions: v.optional(v.string()),
    videoEnabled: v.boolean(),
    formEvents: v.optional(v.array(formEventSchema)),
    agreements: v.optional(v.array(v.string())),
    activated: v.boolean(),
  }).index("byOrganizationIdAndActivated", {
    fields: ["organizationId", "activated"],
  }),
  stylingPreferences: defineTable({
    organizationId: v.string(),
    themeName: v.string(),
    cssVariables: themeSchema,
  }).index("byOrganizationId", {
    fields: ["organizationId"],
  }),
});
