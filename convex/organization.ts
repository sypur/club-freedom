import { v } from "convex/values";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { convertToCSSVar, themeSchema } from "@/lib/theme";
import { components } from "./_generated/api";
import { env, mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { r2 } from "./r2";

export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const organization = await ctx.runQuery(
      components.betterAuth.organization.getOrganization,
      { slug },
    );
    return organization as Doc<"organization"> | null;
  },
});
export const getAllOrganizations = query({
  handler: async (ctx) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    const organizations = auth.api.listOrganizations({
      headers,
    });
    return organizations;
  },
});

export const setActiveOrganization = mutation({
  args: {
    organizationSlug: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { headers, auth } = await authComponent.getAuth(createAuth, ctx);
    try {
      const data = await auth.api.setActiveOrganization({
        headers,
        body: {
          organizationId: args.organizationId,
          organizationSlug: args.organizationSlug,
        },
      });
      return data !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

export const generateLogoUploadUrl = mutation({
  args: {
    organizationId: v.string(),
    oldUrl: v.optional(v.string()),
  },
  handler: async (ctx, { organizationId, oldUrl }) => {
    // Remove old logo if exists
    if (oldUrl?.startsWith(env.R2_PUBLIC_URL)) {
      const oldKey = oldUrl.replace(`${env.R2_PUBLIC_URL}/`, "");
      await r2.deleteObject(ctx, oldKey);
    }

    const key = `assets/${organizationId}/logo-${Date.now()}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});

export const generateIconUploadUrl = mutation({
  args: {
    organizationId: v.string(),
    oldUrl: v.optional(v.string()),
  },
  handler: async (ctx, { organizationId, oldUrl }) => {
    if (oldUrl?.startsWith(env.R2_PUBLIC_URL)) {
      const oldKey = oldUrl.replace(`${env.R2_PUBLIC_URL}/`, "");
      await r2.deleteObject(ctx, oldKey);
    }
    const key = `assets/${organizationId}/icon-${Date.now()}`;
    const { url } = await r2.generateUploadUrl(key);
    const storageUrl = `${env.R2_PUBLIC_URL}/${key}`;
    return {
      url,
      key,
      storageUrl,
    };
  },
});

export const findInvitationById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.runQuery(
      components.betterAuth.organization.findInvitationById,
      {
        invitationId: args.id,
      },
    );
    return invitation;
  },
});

export const getOrganizationStylings = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const theme = await ctx.db
      .query("stylingPreferences")
      .withIndex("byOrganizationId", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();

    const stylings = theme?.cssVariables;

    if (stylings) {
      return convertToCSSVar(stylings);
    }

    return {};
  },
});

export const updateOrganizationStylings = mutation({
  args: {
    organizationId: v.string(),
    theme: themeSchema,
  },
  handler: async (ctx, { organizationId, theme }) => {
    const style = await ctx.db
      .query("stylingPreferences")
      .withIndex("byOrganizationId", (q) =>
        q.eq("organizationId", organizationId),
      )
      .first();

    if (!style) {
      return await ctx.db.insert("stylingPreferences", {
        organizationId,
        cssVariables: theme,
        themeName: "Theme",
      });
    } else {
      await ctx.db.patch(style._id, {
        cssVariables: theme,
      });
      return style._id;
    }
  },
});

export const getOrganizationPinnedSubmissions = query({
  args: { organizationId: v.string() },
  returns: v.number(),
  handler: async (ctx, { organizationId }) => {
    return await ctx.runQuery(components.betterAuth.organization.getOrganizationPinnedSubmissions, { organizationId });
  }
});

export const incrementOrganizationPinnedSubmissions = mutation({
  args: { increment: v.number(), organizationId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { increment, organizationId }) => {
    return await ctx.runMutation(components.betterAuth.organization.incrementOrganizationPinnedSubmissions, { increment, organizationId });
  }
});
