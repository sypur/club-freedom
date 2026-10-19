import {
  createFileRoute,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import LoadingTestimonial from "./-components/loading-testimonial";
import TestimonialDetail from "./-components/testimonial-detail";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials/$id")({
  ssr: false,
  component: Component,
});

function Component() {
  const { id, orgSlug } = Route.useParams();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const router = useRouter();

  const handleBack = async () => {
    if (isRoot) {
      await router.navigate({
        to: "/o/$orgSlug/dashboard/testimonials",
        params: {
          orgSlug,
        },
      });
    } else {
      router.history.back();
    }
  };

  return (
    <div className="max-w-xl mx-auto py space-y-8 p-4">
      <Button variant="outline" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>
      <Suspense fallback={<LoadingTestimonial />}>
        <TestimonialDetail testimonialId={id} />
      </Suspense>
    </div>
  );
}
