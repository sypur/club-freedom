import { v } from "convex/values";
import { render } from "react-email";
import NotificationEmail from "@/emails/notification";
import { internal } from "./_generated/api";
import {
  env,
  internalAction,
  internalMutation,
  query,
} from "./_generated/server";
import { authComponent } from "./auth";
import { api as authApi } from "./betterAuth/_generated/api";
import type { Id } from "./betterAuth/_generated/dataModel";
import { resend } from "./email";
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

    const user = await ctx.runQuery(authApi.user.getUser, {
      userId: preference.userId,
    });

    if (!user) return;

    const nextRun = getNextScheduleTime(
      preference.daysOfTheWeek,
      preference.hour,
      user.timezone || undefined,
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

    const user = await ctx.runQuery(authApi.user.getUser, {
      userId: userId as Id<"user">,
    });

    if (!user) return;

    const organization = await ctx.runQuery(
      authApi.organization.getOrganizationById,
      {
        organizationId,
      },
    );

    if (!organization) return;

    const count = await ctx.runQuery(
      internal.testimonials.countPendingTestimonials,
      { organizationId },
    );

    if (count <= 0) {
      console.log("No testimonial count. Skipping email");
      return;
    }

    await resend.sendEmail(ctx, {
      from: `Sypur <${env.AUTH_EMAIL}>`,
      to: user.email,
      subject: `[${organization.name} on Sypur] You have ${count} testimonial${count !== 1 ? "s" : ""} pending for review`,
      html: await render(
        NotificationEmail({
          user,
          organization,
          testimonialsCount: count,
          siteUrl: `${env.SITE_URL}`,
        }),
      ),
    });
  },
});
