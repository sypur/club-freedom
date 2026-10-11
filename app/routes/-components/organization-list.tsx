import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Building, Home, LayoutDashboard, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";

export default function OrganizationList() {
  const {
    isPending,
    data: organizations,
    refetch,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list();
      if (error) throw error;
      return data;
    },
  });

  if (isPending) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <PendingOrganizationCard />
        <PendingOrganizationCard />
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle className="text-destructive">
            Cannot fetch your organizations
          </EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            {error.message}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => refetch()}>Retry</Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (organizations.length === 0) {
    return (
      <Empty className="bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building />
          </EmptyMedia>
          <EmptyTitle>You are not in any organizations</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            You need invitations in order to join any organizations in Sypur.
            Check your emails for more details.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {organizations.map((organization) => (
        <Card
          key={organization.slug}
          className="relative group hover:bg-muted/50 isolate"
        >
          <CardHeader>
            <CardTitle>
              <Link
                to="/o/$orgSlug"
                params={{ orgSlug: organization.slug }}
                className="after:absolute after:inset-0"
              >
                {organization.name}
              </Link>
            </CardTitle>
            <CardDescription className="font-mono">
              {organization.slug}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link
              to="/o/$orgSlug"
              params={{ orgSlug: organization.slug }}
              className={buttonVariants({
                variant: "default",
                className: "relative z-10",
              })}
            >
              <Home data-icon="inline-start" />
              Home
            </Link>
            <Link
              to="/o/$orgSlug/dashboard"
              params={{ orgSlug: organization.slug }}
              className={buttonVariants({
                variant: "outline",
                className: "relative z-10",
              })}
            >
              <LayoutDashboard data-icon="inline-start" />
              Dashboard
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PendingOrganizationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Skeleton className="h-9 w-full md:w-20" />
        <Skeleton className="h-9 w-full md:w-20" />
      </CardContent>
    </Card>
  );
}
