import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";

export default function OrganizationInfo() {
  const { open, isMobile } = useSidebar();
  const { orgSlug } = useParams({
    from: "/o/$orgSlug",
  });
  const { organization: preloadOrganization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { data: liveOrganization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, { slug: orgSlug }),
  );

  if (open && !isMobile) {
    return null;
  }

  const organization = liveOrganization || preloadOrganization;

  if (organization.logo) {
    return (
      <div className="h-8">
        <img
          src={organization.logo}
          alt={organization.name}
          height={32}
          className="h-full"
        />
      </div>
    );
  }

  return <span>{organization.name}</span>;
}
