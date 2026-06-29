import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getNotificationPreference = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const user = await authComponent.getAuthUser(ctx);

    return await ctx.db
      .query("notificationPreferences")
      .withIndex("byUserIdAndOrganizationId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id),
      )
      .first();
  },
});

export const upsertNotificationPreference = mutation({
  args: {
    organizationId: v.string(),
    preference: v.union(
      v.object({
        enabled: v.literal(false),
      }),
      v.object({
        enabled: v.literal(true),
        daysOfTheWeek: v.array(v.number()),
        hour: v.number(),
      }),
    ),
  },
  handler: async (ctx, { organizationId, preference }) => {
    const user = await authComponent.getAuthUser(ctx);
    const existing = await ctx.db
      .query("notificationPreferences")
      .withIndex("byUserIdAndOrganizationId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id),
      )
      .first();

    if (existing) {
      await ctx.db.patch("notificationPreferences", existing._id, preference);
      return existing._id;
    } else {
      const daysOfTheWeek = preference.enabled ? preference.daysOfTheWeek : [];
      const hour = preference.enabled ? preference.hour : 0;
      const newPreference = await ctx.db.insert("notificationPreferences", {
        userId: user._id,
        organizationId: organizationId,
        enabled: preference.enabled,
        daysOfTheWeek: daysOfTheWeek.toSorted((a, b) => a - b),
        hour,
      });
      return newPreference;
    }
  },
});
