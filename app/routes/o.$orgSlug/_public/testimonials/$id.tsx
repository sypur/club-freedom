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
import NotFound from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { hasPermissionQuery } from "@/lib/query";
import TestimonialDetail from "./-components/testimonial-detail";

export const Route = createFileRoute("/o/$orgSlug/_public/testimonials/$id")({
  ssr: false,
  component: Component,
  notFoundComponent: NotFound,
  loader: async ({ context, params }) => {
    const testimonial = await context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
        id: params.id,
        orgId: context.organization._id,
      }),
    );

    if (!testimonial) {
      throw notFound();
    }

    const canView = await context.queryClient.ensureQueryData(
      hasPermissionQuery(
        {
          testimonial: ["view"],
        },
        context.organization._id,
      ),
    );

    if (!canView && !testimonial.approved) {
      throw notFound();
    }

    return { testimonial };
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
        <TestimonialDetail />
      </Suspense>
    </div>
  );
}
