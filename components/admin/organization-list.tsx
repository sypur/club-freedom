import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";

export default function OrganizationList() {
  const { isLoading, data, error } = useQuery(
    convexQuery(api.admin.listAllOrganizations),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 items-center p-4">
        <Spinner />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 text-destructive p-4">
        <AlertCircle />
        <span>{error?.message || "An error occurred"}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 bg-muted rounded-md">
        No organizations
      </div>
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
