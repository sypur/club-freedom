import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { applyTheme, defaultThemeVariables } from "@/lib/utils";

function OrgOutlet() {
  const { stylings } = Route.useRouteContext();

  useEffect(() => {
    if (stylings && Object.keys(stylings).length > 0) {
      applyTheme(stylings);
    }
    return () => {
      applyTheme(defaultThemeVariables);
    };
  }, [stylings]);

  return <Outlet />;
}

export const Route = createFileRoute("/o/$orgSlug")({
  component: OrgOutlet,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );

    if (!organization) {
      throw notFound();
    }

    const stylings = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationStylings, {
        organizationId: String(organization._id),
      }),
    );

    return { organization, stylings };
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
