import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TimerIcon } from "lucide-react";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Route } from "../tmp.$id";
import TestimonialUploadProgress from "@/components/testimonial-detail/testimonial-upload-progress";

export default function TempTestimonialDetail() {
  const { id } = Route.useParams();
  const { organization } = Route.useRouteContext();
  const { testimonial: preloadTestimonial, expirationDate } =
    Route.useLoaderData();
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
        {testimonial.media_type !== "text" && (
          <div className="space-y-2">
            <TestimonialMedia />
            <TestimonialUploadProgress />
          </div>
        )}
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
