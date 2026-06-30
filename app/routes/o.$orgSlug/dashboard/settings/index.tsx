import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import OrganizationEditForm from "./-components/organization-edit-form";
import OrganizationIconCropper from "./-components/organization-icon-cropper";
import OrganizationLogoForm from "./-components/organization-logo-form";

export const Route = createFileRoute("/o/$orgSlug/dashboard/settings/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      permissions: {
        organization: ["update"],
      },
      organizationId: context.organization._id,
    });

    if (!data?.success) {
      throw new Error("User does not have permission to manage organization");
    }
  },
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationEditForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationLogoForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationIconCropper />
        </CardContent>
      </Card>
    </div>
  );
}
