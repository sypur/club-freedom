import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { query } from "./_generated/server";
import schema from "./schema";

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
