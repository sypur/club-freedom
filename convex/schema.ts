import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

export default defineSchema({
  testimonials: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    media_type: mediaTypeSchema,
    storageId: v.optional(v.string()),
    title: v.optional(v.string()),
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
    agreements: v.optional(v.array(v.string())),
    activated: v.boolean(),
  }).index("byOrganizationIdAndActivated", {
    fields: ["organizationId", "activated"],
  }),
  stylingPreferences: defineTable({
    organizationId: v.string(),
    themeName: v.string(),
    cssVariables: v.optional(
      v.object({
        background: v.optional(v.string()),
        foreground: v.optional(v.string()),
        card: v.optional(v.string()),
        cardForeground: v.optional(v.string()),
        popover: v.optional(v.string()),
        primary: v.optional(v.string()),
        primaryForeground: v.optional(v.string()),
        secondary: v.optional(v.string()),
        secondaryForeground: v.optional(v.string()),
        muted: v.optional(v.string()),
        mutedForeground: v.optional(v.string()),
        accent: v.optional(v.string()),
        accentForeground: v.optional(v.string()),
        destructive: v.optional(v.string()),
        destructiveForeground: v.optional(v.string()),
        radius: v.optional(v.string()),
        border: v.optional(v.string()),
        input: v.optional(v.string()),
        ring: v.optional(v.string()),
        chart1: v.optional(v.string()),
        chart2: v.optional(v.string()),
        chart3: v.optional(v.string()),
        chart4: v.optional(v.string()),
        chart5: v.optional(v.string()),
        sidebar: v.optional(v.string()),
        sidebarForeground: v.optional(v.string()),
        sidebarPrimary: v.optional(v.string()),
        sidebarPrimaryForeground: v.optional(v.string()),
        sidebarAccent: v.optional(v.string()),
        sidebarAccentForeground: v.optional(v.string()),
        sidebarBorder: v.optional(v.string()),
        sidebarRing: v.optional(v.string()),
      }),
    ),
  }).index("byOrganizationId", {
    fields: ["organizationId"],
  }),
});
