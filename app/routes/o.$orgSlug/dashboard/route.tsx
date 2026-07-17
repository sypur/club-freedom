import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import OrganizationLayout from "@/components/layouts/organization";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/dashboard")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  staleTime: 1000 * 60 * 60, // 1 hour
  beforeLoad: async ({ context }) => {
    const { organization, isAuthenticated } = context;

    if (!isAuthenticated) {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: organization.slug },
      });
    }
  },
  loader: async ({ context }) => {
    const { organization } = context;

    const { error } = await authClient.organization.setActive({
      organizationId: organization._id,
    });

    if (error) {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: organization.slug },
      });
    }

    const { data } = await authClient.getSession();

    // Timezone synchronization
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone !== data?.user.timezone) {
      await authClient.updateUser({
        timezone: timezone,
      });
    }
  },
});

function RouteComponent() {
  return (
    <OrganizationLayout>
      <Outlet />
    </OrganizationLayout>
  );
}

function PendingComponent() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-12 p-8">
      {organization.logo ? (
        <img
          src={organization.logo}
          alt={organization.name}
          className="w-full max-w-100"
        />
      ) : (
        `Accessing to ${organization.name}`
      )}
      <Spinner className="size-12" />
    </div>
  );
}
