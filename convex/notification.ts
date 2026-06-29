import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { authComponent } from "./auth";
import { getNextScheduleTime } from "./utils";
import { internal } from "./_generated/api";

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

export const sendScheduledNotification = internalMutation({
  args: { preferenceId: v.id("notificationPreferences") },
  handler: async (ctx, args) => {
    const preference = await ctx.db.get(args.preferenceId);

    if (
      !preference ||
      !preference.enabled ||
      preference.daysOfTheWeek.length === 0
    )
      return;

    // TODO: Add notification action here

    const nextRun = getNextScheduleTime(
      preference.daysOfTheWeek,
      preference.hour,
    );

    const nextScheduledId = await ctx.scheduler.runAt(
      nextRun.getTime(),
      internal.notification.sendScheduledNotification,
      { preferenceId: preference._id },
    );

    await ctx.db.patch("notificationPreferences", preference._id, {
      scheduleId: nextScheduledId,
    });
  },
});
