import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import { applyTheme, defaultThemeVariables } from "@/lib/utils";

export const Route = createFileRoute("/o/$orgSlug")({
  component: Outlet,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );

    if (!organization) {
      throw notFound();
    }

    return { organization };
  },
  loader: async ({ context, params }) => {
    const { organization } = context;
    const stylings = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationStylings, {
        organizationId: String(organization._id),
      }),
    );

    if (stylings && Object.keys(stylings).length > 0) {
      applyTheme(stylings);
    }
  },
  onLeave: async () => {
    applyTheme(defaultThemeVariables);
  },
  head: ({ matches }) => {
    const routeMatch = matches.find((match) => match.routeId === "/o/$orgSlug");
    if (!routeMatch?.context?.organization) {
      return {};
    }
    const { organization } = routeMatch.context;

    return {
      meta: [{ title: organization.name }],
    };
  },
});
