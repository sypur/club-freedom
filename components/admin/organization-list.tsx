import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Building } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Spinner } from "../ui/spinner";

export default function OrganizationList() {
  const { isLoading, data, error } = useQuery(
    convexQuery(api.admin.listAllOrganizations),
  );

  if (isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Loading...</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  if (error || !data) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>An error occurred</EmptyTitle>
          {error?.message && (
            <EmptyDescription>{error.message}</EmptyDescription>
          )}
        </EmptyHeader>
      </Empty>
    );
  }

  if (data.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building />
          </EmptyMedia>
          <EmptyTitle>No organizations</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((organization) => (
        <Card key={organization._id} className="py-4">
          <CardHeader>
            <CardTitle>
              <Link
                to="/o/$orgSlug"
                params={{ orgSlug: organization.slug }}
                className="hover:underline hover:underline-offset-2"
              >
                {organization.name}
              </Link>
            </CardTitle>
            <CardDescription>{organization.slug}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
