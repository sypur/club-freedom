import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Route } from "../$id";

export default function TestimonialDetail() {
  const { id } = Route.useParams();
  const { organization } = Route.useRouteContext();
  const { testimonial: preloadTestimonial } = Route.useLoaderData();
  const { data: liveTestimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
      id: id,
      orgId: organization._id,
    }),
  );

  const testimonial = liveTestimonial || preloadTestimonial;

  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      <div className="flex flex-col gap-8">
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
