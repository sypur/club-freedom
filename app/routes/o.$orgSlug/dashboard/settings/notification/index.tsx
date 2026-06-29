import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationPreferenceForm from "./-components/notification-preference-form";
import { Suspense } from "react";
import { Empty, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

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
          <Suspense
            fallback={
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Spinner />
                  </EmptyMedia>
                </EmptyHeader>
              </Empty>
            }
          >
            <NotificationPreferenceForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
