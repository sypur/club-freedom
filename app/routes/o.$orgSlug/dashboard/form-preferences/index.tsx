import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import FormPreferenceList from "./-components/list";
import LoadingFormPreferenceList from "./-components/list/loading";

export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Button size="sm" className="ml-auto" asChild>
        <Link from={Route.fullPath} to="new">
          <PlusIcon /> New Form
        </Link>
      </Button>
      <Suspense fallback={<LoadingFormPreferenceList />}>
        <FormPreferenceList />
      </Suspense>
    </div>
  );
}
