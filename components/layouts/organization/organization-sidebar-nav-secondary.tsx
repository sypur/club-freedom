import { useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  ChevronDown,
  ExternalLink,
  Settings,
  SwatchBook,
  UserRoundCog,
} from "lucide-react";
import type { ComponentProps } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    Settings
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to="/o/$orgSlug/dashboard/settings/organization"
                          params={{ orgSlug: organization.slug }}
                          className="[&.active]:not-hover:bg-muted"
                        >
                          <span>Organization</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to="/o/$orgSlug/dashboard/settings/notification"
                          params={{ orgSlug: organization.slug }}
                          className="[&.active]:not-hover:bg-muted"
                        >
                          <span>Notification</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
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
