import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences")({
  component: Outlet,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      permissions: {
        forms: ["edit"],
      },
      organizationId: context.organization._id,
    });

    if (!data?.success) {
      throw new Error(
        "User does not have permission to make changes to form preferences.",
      );
    }
  },
});
