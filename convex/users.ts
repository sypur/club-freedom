import { v } from "convex/values";
import { components } from "./_generated/api";
import { action } from "./_generated/server";
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

    const { auth: newUserAuth, headers: newUserHeaders } =
      await authComponent.getAuth(
        (ctx) => createAuth(ctx, { isNewUser: true }),
        ctx,
      );

    await newUserAuth.api.requestPasswordReset({
      body: {
        email,
      },
      headers: newUserHeaders,
    });

    return user.id;
  },
});
