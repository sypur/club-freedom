import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { v } from "convex/values";
import { adminRBAC } from "@/lib/auth/permissions/admin";
import {
  type OrganizationPermissionCheck,
  organizationRBAC,
} from "@/lib/auth/permissions/organization";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { env, query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";
import { sendInvite, sendResetPassword } from "./email";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: false,
  },
);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  // For static schema generation (when ctx is empty {}), use placeholder values
  // For runtime execution, use actual environment variables
  const siteUrl = env.SITE_URL;
  const secret = env.BETTER_AUTH_SECRET;

  return {
    baseURL: siteUrl,
    secret: secret,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPassword(requireActionCtx(ctx), {
          to: user.email,
          url,
        });
      },
    },
    user: {
      additionalFields: {
        timezone: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
      admin(adminRBAC),
      organization({
        ...organizationRBAC,
        // HACK: Required when disable ID generation by Better Auth
        requireEmailVerificationOnInvitation: false,
        schema: {
          organization: {
            additionalFields: {
              icon: {
                type: "string",
                required: false,
              },
            },
          },
        },
        sendInvitationEmail: async ({ id, organization, email }) => {
          await sendInvite(requireActionCtx(ctx), {
            to: email,
            subject: `You're invited to ${organization.name}`,
            url: `${siteUrl}/accept-invite/${id}`,
            organization: organization,
          });
        },
        organizationHooks: {
          afterAcceptInvitation: async (data) => {
            try {
              const actionCtx = requireActionCtx(ctx);
              await actionCtx.runMutation(
                components.betterAuth.organization.deleteInvitation,
                {
                  invitationId: data.invitation.id,
                },
              );
            } catch (error) {
              console.error("Failed to delete invitation after accept", error);
            }
          },
          afterCancelInvitation: async (data) => {
            try {
              const actionCtx = requireActionCtx(ctx);
              await actionCtx.runMutation(
                components.betterAuth.organization.deleteInvitation,
                {
                  invitationId: data.invitation.id,
                },
              );
            } catch (error) {
              console.error("Failed to delete invitation after accept", error);
            }
          },
        },
      }),
    ],
    trustedOrigins: [siteUrl],

    /**
     * HACK: Let Convex handle ID generation instead of Better Auth
     * This fix comes from this issue: https://github.com/get-convex/better-auth/issues/407
     */
    advanced: {
      database: { generateId: false },
    },
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch (err: unknown) {
      // If the call failed because the user is not signed in, return null so client code can handle it.
      // Be conservative: only swallow unauthenticated errors; rethrow unexpected errors.
      const message = (err as any)?.message ?? "";
      if (
        message.toString().toLowerCase().includes("unauthenticated") ||
        (err as any)?.name === "Unauthenticated"
      ) {
        return null;
      }
      throw err;
    }
  },
});

// Get a user by their Better Auth user id with Local Install
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.user.getUser, {
      userId: args.userId,
    });
  },
});

export const checkUserPermissions = query({
  handler: async (
    ctx,
    args: {
      permissions?: OrganizationPermissionCheck;
      organizationId?: string;
    },
  ) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    try {
      const { success } = await auth.api.hasPermission({
        headers,
        body: {
          permissions: args.permissions || {},
          organizationId: args.organizationId,
        },
      });
      return success;
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }

    return false;
  },
});

export const getMemeberRole = query({
  args: v.object({
    organizationId: v.string(),
  }),
  handler: async (ctx, { organizationId }) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    try {
      const { role } = await auth.api.getActiveMemberRole({
        headers,
        query: {
          organizationId,
        },
      });
      return role;
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      return null;
    }
  },
});

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.runQuery(components.betterAuth.user.checkEmailExists, {
      email: args.email,
    });
  },
});
