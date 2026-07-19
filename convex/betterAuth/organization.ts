import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { mutation, query } from "./_generated/server";
import schema from "./schema";

export const getOrganization = query({
  args: { slug: v.string() },
  returns: v.union(v.null(), doc(schema, "organization")),
  handler: async (ctx, { slug }) => {
    const organization = await ctx.db
      .query("organization")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    return organization;
  },
});

export const getOrganizationById = query({
  args: { organizationId: v.string() },
  returns: v.union(v.null(), doc(schema, "organization")),
  handler: async (ctx, args) => {
    const organizationId = ctx.db.normalizeId(
      "organization",
      args.organizationId,
    );
    if (!organizationId) return null;
    return await ctx.db.get("organization", organizationId);
  },
});

export const findInvitationById = query({
  args: { invitationId: v.string() },
  returns: v.union(
    v.null(),
    doc(schema, "invitation").extend({
      organization: doc(schema, "organization"),
    }),
  ),
  handler: async (ctx, args) => {
    const invitationId = ctx.db.normalizeId("invitation", args.invitationId);
    if (!invitationId) {
      return null;
    }
    const invitation = await ctx.db.get("invitation", invitationId);
    if (!invitation) {
      return null;
    }

    const organizationId = ctx.db.normalizeId(
      "organization",
      invitation.organizationId,
    );
    if (!organizationId) {
      return null;
    }

    const organization = await ctx.db.get("organization", organizationId);
    if (!organization) {
      return null;
    }
    return {
      ...invitation,
      organization,
    };
  },
});

export const deleteInvitation = mutation({
  args: { invitationId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const invitationId = ctx.db.normalizeId("invitation", args.invitationId);
    if (!invitationId) {
      return null;
    }
    await ctx.db.delete(invitationId);
    return null;
  },
});
