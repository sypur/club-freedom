import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropDown from "@/components/user-dropdown";
import OrganizationInfo from "./organization-info";
import OrganizationSidebar from "./organization-sidebar";

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <OrganizationSidebar collapsible="icon" />
      <SidebarInset className="flex flex-col h-screen relative">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sticky top-0 bg-background isolate z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <OrganizationInfo />
          </div>
          <div className="ml-auto">
            <UserDropDown />
          </div>
        </header>
        <main className="@container/dashboard flex-1 min-h-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
