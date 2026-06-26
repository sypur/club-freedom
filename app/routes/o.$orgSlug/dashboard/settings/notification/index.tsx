import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationForm from "./-components/notification-form";

export const Route = createFileRoute(
  "/o/$orgSlug/dashboard/settings/notification/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm />
        </CardContent>
      </Card>
    </div>
  );
}
