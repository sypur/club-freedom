import { v } from "convex/values";
import { api, components } from "./_generated/api";
import { action, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const listAllOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const { role } = await authComponent.getAuthUser(ctx);
    if (role !== "admin") {
      throw new Error("Unauthorized");
    }
    return ctx.runQuery(
      components.betterAuth.organization.listAllOrganizations,
    );
  },
});

export const createOrganization = action({
  args: v.object({
    name: v.string(),
    slug: v.string(),
    email: v.string(),
  }),
  handler: async (ctx, { name, slug, email }) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const session = await auth.api.getSession({
      headers,
    });

    if (session?.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const userId: string = await ctx.runAction(
      api.users.findOrCreateUserByEmail,
      {
        email,
      },
    );

    const organization = await auth.api.createOrganization({
      body: {
        name,
        slug,
        userId,
      },
    });

    return organization?.id ?? null;
  },
});
