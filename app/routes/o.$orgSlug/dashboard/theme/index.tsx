import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrganizationBrandColorsForm from "./-components/organization-brand-colors-form";

export const Route = createFileRoute("/o/$orgSlug/dashboard/theme/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationBrandColorsForm />
        </CardContent>
      </Card>
    </div>
  );
}
