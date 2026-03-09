import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";
import FormPreferenceEditForm from "./-components/form/edit";

export const Route = createFileRoute(
  "/o/$orgSlug/dashboard/form-preferences/$id",
)({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const formPreference = await context.queryClient.ensureQueryData(
      convexQuery(api.formPreferences.getFormPreferenceByIdAndOrgId, {
        id: params.id,
        orgId: context.organization._id,
      }),
    );

    if (!formPreference) {
      throw notFound();
    }

    return { formPreference };
  },
});

function RouteComponent() {
  const { formPreference } = Route.useLoaderData();

  return (
    <FormPreferenceContext.Provider
      value={{
        formPreference,
      }}
    >
      <div className="grid max-w-3xl w-full gap-8 mx-auto p-4 pt-8">
        <div>
          <Button asChild variant="link" className="px-0! self-start">
            <Link to="..">
              <ChevronLeft /> Back
            </Link>
          </Button>
        </div>
        <FormPreferenceEditForm />
      </div>
    </FormPreferenceContext.Provider>
  );
}
