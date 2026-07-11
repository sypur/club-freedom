import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/dashboard/settings/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/o/$orgSlug/dashboard/settings/organization",
      params,
    });
  },
});
