import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";
import TestimonialDelete from "@/components/testimonial-detail/testimonial-delete";
import TestimonialDownload from "@/components/testimonial-detail/testimonial-download";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { hasPermissionQuery } from "@/lib/query";

type Props = {
  testimonialId: string;
};

export default function TestimonialDetail({ testimonialId }: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { data: testimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialByIdAndOrgId, {
      id: testimonialId,
      orgId: organization._id,
    }),
  );

  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery(
      {
        testimonial: ["approve"],
      },
      organization._id,
    ),
  );

  const { data: canDownload } = useSuspenseQuery(
    hasPermissionQuery(
      {
        testimonial: ["download"],
      },
      organization._id,
    ),
  );

  const { data: canDelete } = useSuspenseQuery(
    hasPermissionQuery(
      {
        testimonial: ["delete"],
      },
      organization._id,
    ),
  );

  if (!testimonial) {
    return (
      <Empty>
        <EmptyTitle>Testimonial not found.</EmptyTitle>
        <EmptyDescription>
          The testimonial you are looking for could not be found. Please choose
          another one.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      <div className="flex flex-col gap-8 pb-16">
        {testimonial.processingStatus === "error" && (
          <TestimonialProcessingError />
        )}
        <TestimonialTitle />
        {testimonial.media_type !== "text" && <TestimonialMedia />}
        <div className="flex flex-wrap gap-2">
          {canApprove && testimonial.processingStatus === "completed" && (
            <TestimonialApproval />
          )}
          {canDownload && <TestimonialDownload />}
          {canDelete && <TestimonialDelete />}
        </div>
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
