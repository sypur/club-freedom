import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import TestimonialForm from "@/components/testimonial-form";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug/_public/")({
  component: TestimonialSubmissionPage,
  loader: async ({ context }) => {
    const formPreferenceArray = await context.queryClient.ensureQueryData(
      convexQuery(api.formPreferences.getActiveFormPreferenceByOrgId, {
        organizationId: context.organization._id,
      }),
    );
    return { formPreferenceArray };
  },
});

function TestimonialSubmissionPage() {
  const { organization } = Route.useRouteContext();
  return (
    <main className="flex flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-secondary">{organization.name}</span>{" "}
          Testimonial
        </h1>
        <p className="mt-4 text-lg">Please share your testimonial with us!</p>
        <p className="mt-4 italic text-lg text-muted-foreground">
          "Let your light shine before others" – Matthew 5:16
        </p>
      </div>
      <TestimonialForm />
    </main>
  );
}
