import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { authComponent } from "./auth";
import { api } from "./betterAuth/_generated/api";
import type { Id } from "./betterAuth/_generated/dataModel";
import { mutation } from "./functions";
import { getNextScheduleTime } from "./utils";

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

    await ctx.scheduler.runAfter(
      0,
      internal.notification.sendNotificationEmail,
      {
        organizationId: preference.organizationId,
        userId: preference.userId,
      },
    );

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
      scheduledId: nextScheduledId,
    });
  },
});

export const sendNotificationEmail = internalAction({
  args: {
    userId: v.string(),
    organizationId: v.string(),
  },
  handler: async (ctx, { userId, organizationId }) => {
    const date = new Date();
    console.log("Sending at", date.toISOString());

    const user = await ctx.runQuery(api.auth.getUser, {
      userId: userId as Id<"user">,
    });

    if (!user) return;

    const organization = await ctx.runQuery(
      api.organization.getOrganizationById,
      {
        organizationId,
      },
    );

    if (!organization) return;

    const testimonialCount = await ctx.runQuery(
      internal.testimonials.countPendingTestimonials,
      { organizationId },
    );

    console.log("Testimonial count", testimonialCount);
  },
});
