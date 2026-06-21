import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Building } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";

export default function OrganizationSidebarHeader() {
  const { orgSlug } = useParams({
    from: "/o/$orgSlug",
  });

  const { data: organization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, {
      slug: orgSlug,
    }),
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link to="/o/$orgSlug" params={{ orgSlug }}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <span className="truncate font-medium">{organization?.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
