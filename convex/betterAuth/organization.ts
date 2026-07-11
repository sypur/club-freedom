import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { query } from "./_generated/server";
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
    const organizationId = await ctx.db.normalizeId(
      "organization",
      args.organizationId,
    );
    if (!organizationId) return null;
    return await ctx.db.get("organization", organizationId);
  },
});
