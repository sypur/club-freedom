import { createFileRoute } from "@tanstack/react-router";
import FormPreferenceForm from "./-components/form/add";

export const Route = createFileRoute(
  "/o/$orgSlug/dashboard/form-preferences/new",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-8 mx-auto p-4 pt-8">
      <h2 className="font-semibold">New testimonial form</h2>
      <FormPreferenceForm />
    </div>
  );
}
