import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getEmailPreference = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const user = await authComponent.getAuthUser(ctx);

    return await ctx.db
      .query("emailPreferences")
      .withIndex("byUserIdAndOrganizationId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id),
      )
      .first();
  },
});

export const upsertEmailPreference = mutation({
  args: {
    organizationId: v.string(),
    preference: v.union(
      v.object({
        enabled: v.literal(false),
      }),
      v.object({
        enabled: v.literal(true),
        days: v.array(v.number()),
        time: v.number(),
      }),
    ),
  },
  handler: async (ctx, { organizationId, preference }) => {
    const user = await authComponent.getAuthUser(ctx);
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("byUserIdAndOrganizationId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id),
      )
      .first();

    if (existing) {
      await ctx.db.patch("emailPreferences", existing._id, preference);
      return existing._id;
    } else {
      const days = preference.enabled ? preference.days : [];
      const time = preference.enabled ? preference.time : 0;
      const newPreference = await ctx.db.insert("emailPreferences", {
        userId: user._id,
        organizationId,
        enabled: preference.enabled,
        days: days.toSorted((a, b) => a - b),
        time,
      });
      return newPreference;
    }
  },
});
