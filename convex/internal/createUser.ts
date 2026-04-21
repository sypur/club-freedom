import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { authComponent, createAuth } from "../auth";

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const { auth } = await authComponent.getAuth(createAuth, ctx);
    return await auth.api.createUser({
      body: {
        name: args.name,
        email: args.email,
        password: args.password,
        role: args.role,
      },
    });
  },
});
