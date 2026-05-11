import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  notFound,
  rootRouteId,
  useMatch,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import TempTestimonialDetail from "./-components/temp-testimonial-detail";

export const Route = createFileRoute(
  "/o/$orgSlug/_public/testimonials/tmp/$id",
)({
  ssr: false,
  component: Component,
  loader: async ({ context, params }) => {
    const { _id } = context.organization;
    const testimonial = await context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
        id: params.id,
        orgId: _id,
      }),
    );

    if (!testimonial) {
      throw notFound();
    }

    // _creationTime is the milliseconds since unix epoch when the document was created
    const expirationDate = testimonial._creationTime + 900_000;
    if (Date.now() >= expirationDate) {
      throw notFound();
    }
    return { testimonial, expirationDate };
  },
});

function Component() {
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const router = useRouter();
  const handleBack = () => {
    if (isRoot) {
      router.navigate({
        to: "/o/$orgSlug/testimonials",
        params: {
          orgSlug: organization.slug,
        },
      });
    } else {
      router.history.back();
    }
  };
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>
      <Suspense fallback={<Spinner className="mx-auto block" />}>
        <TempTestimonialDetail />
      </Suspense>
    </div>
  );
}
