import { useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { FileText, MessageSquare, Users2 } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { hasPermissionQuery } from "@/lib/query";

export default function OrganizationSidebarNav(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data: canApprove } = useQuery(
    hasPermissionQuery(
      {
        testimonial: ["approve"],
      },
      organization._id,
    ),
  );

  const { data: canManageMembers } = useQuery(
    hasPermissionQuery(
      {
        member: ["create", "update", "delete"],
      },
      organization._id,
    ),
  );

  const { data: canUpdateOrganization } = useQuery(
    hasPermissionQuery({ organization: ["update"] }, organization._id),
  );
  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        <SidebarMenuItem>
          {canApprove && (
            <SidebarMenuButton tooltip="Testimonials" asChild>
              <Link
                to="/o/$orgSlug/dashboard/testimonials"
                params={{ orgSlug: organization.slug }}
                className="[&.active]:not-hover:bg-muted"
              >
                <MessageSquare />
                <span>Testimonials</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        <SidebarMenuItem>
          {canManageMembers && (
            <SidebarMenuButton tooltip="Members" asChild>
              <Link
                to="/o/$orgSlug/dashboard/members"
                params={{ orgSlug: organization.slug }}
                className="[&.active]:not-hover:bg-muted"
              >
                <Users2 />
                <span>Members</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        <SidebarMenuItem>
          {canUpdateOrganization && (
            <SidebarMenuButton tooltip="Form Preferences" asChild>
              <Link
                to="/o/$orgSlug/dashboard/form-preferences"
                params={{ orgSlug: organization.slug }}
                className="[&.active]:not-hover:bg-muted"
              >
                <FileText />
                <span>Form Preferences</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
