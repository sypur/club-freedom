import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { createAuth } from "../auth";
import { mutation, query } from "./_generated/server";
import schema from "./schema";

// Export a static instance for Better Auth schema generation
/* biome-ignore  lint: expected anu */
export const auth = createAuth({} as any);

// Example of an in-component function
// Feel free to edit, omit, etc.
export const getUser = query({
  args: { userId: v.string() },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    const userId = ctx.db.normalizeId("user", args.userId);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const checkEmailExists = query({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("email_name", (q) => q.eq("email", args.email))
      .first();
    return !!user;
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
