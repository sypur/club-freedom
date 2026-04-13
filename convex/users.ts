import { v } from "convex/values";
import { action } from "./_generated/server";
import { components } from "./_generated/api";
import { authComponent, createAuth } from "./auth";

export const findOrCreateUserByEmail = action({
  args: v.object({
    email: v.string(),
  }),
  returns: v.string(),
  handler: async (ctx, { email }) => {
    const existing = await ctx.runQuery(
      components.betterAuth.auth.findUserByEmail,
      { email },
    );
    if (existing) return existing._id;

    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const { user } = await auth.api.createUser({
      headers,
      body: {
        name: "",
        email,
        password: Math.random().toString(36).substring(2, 12),
      },
    });

    await auth.api.requestPasswordReset({
      body: {
        email,
      },
    });

    return user.id;
  },
});
