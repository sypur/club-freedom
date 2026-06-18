import { useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { ExternalLink, Settings, SwatchBook, UserRoundCog } from "lucide-react";
import type { ComponentProps } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { hasPermissionQuery } from "@/lib/query";

export default function OrganizationSidebarNavSecondary(
  props: ComponentProps<typeof SidebarGroup>,
) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug/dashboard",
  });
  const { data } = authClient.useSession();
  const user = data?.user;

  const { data: canUpdateOrganization } = useQuery(
    hasPermissionQuery(
      {
        organization: ["update"],
      },
      organization._id,
    ),
  );

  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        {canUpdateOrganization && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Theme" asChild>
                <Link
                  to="/o/$orgSlug/dashboard/theme"
                  params={{ orgSlug: organization.slug }}
                  className="[&.active]:not-hover:bg-muted"
                >
                  <SwatchBook />
                  <span>Theme</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings" asChild>
                <Link
                  to="/o/$orgSlug/dashboard/settings"
                  params={{ orgSlug: organization.slug }}
                  className="[&.active]:not-hover:bg-muted"
                >
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
        {user?.role === "admin" && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: (
                  <p className="flex gap-2 items-center">
                    Admin <ExternalLink className="size-3" />
                  </p>
                ),
              }}
              asChild
            >
              <Link to="/admin">
                <UserRoundCog />
                <span>Admin</span>
                <ExternalLink className="ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
