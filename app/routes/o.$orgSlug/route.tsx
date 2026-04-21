import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";

function buildThemeStyle(vars: Record<string, string>): string {
  if (!vars || Object.keys(vars).length === 0) return "";
  const declarations = Object.entries(vars)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");
  return `:root {\n${declarations}\n}`;
}

function OrgOutlet() {
  const { stylings } = Route.useRouteContext();
  const themeStyle = stylings ? buildThemeStyle(stylings) : "";

  return (
    <>
      {themeStyle && <style precedence="default">{themeStyle}</style>}
      <Outlet />
    </>
  );
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
