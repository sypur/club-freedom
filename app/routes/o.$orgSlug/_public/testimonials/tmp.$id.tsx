import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  rootRouteId,
  useMatch,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, TimerIcon } from "lucide-react";
import { Suspense } from "react";
import NotFound from "@/components/not-found";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute(
  "/o/$orgSlug/_public/testimonials/tmp/$id",
)({
  ssr: false,
  component: Component,
  notFoundComponent: NotFound,
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

function TempTestimonialDetail() {
  const { id } = Route.useParams();
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const {
    testimonial: preloadTestimonial,
    expirationDate: preloadExpirationDate,
  } = Route.useLoaderData();
  const { data: liveTestimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
      id: id,
      orgId: organization._id,
    }),
  );
  const testimonial = liveTestimonial || preloadTestimonial;
  const liveExpirationDate = testimonial._creationTime + 900_000;
  const expirationDate = liveExpirationDate || preloadExpirationDate;
  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      <div className="flex flex-col gap-8">
        <Item variant="muted">
          <ItemMedia variant="icon">
            <TimerIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Recently Submitted Testimonial</ItemTitle>
            <ItemDescription>
              You can view this testimonial until{" "}
              {format(expirationDate, "PPp")}
            </ItemDescription>
          </ItemContent>
        </Item>
        {testimonial.processingStatus === "error" && (
          <TestimonialProcessingError />
        )}
        <TestimonialTitle />
        {testimonial.media_type !== "text" && <TestimonialMedia />}
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
