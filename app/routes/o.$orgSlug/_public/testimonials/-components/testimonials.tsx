import { useRouteContext, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TestimonialCardInfo from "@/components/testimonial-card/testimonial-card-info";
import TestimonialCardMedia from "@/components/testimonial-card/testimonial-card-media";
import TestimonialCardSummary from "@/components/testimonial-card/testimonial-card-summary";
import TestimonialCardText from "@/components/testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "@/components/testimonial-card/testimonial-card-title";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { useInfiniteTestimonialQuery } from "@/lib/query";
import TestimonialCardShell from "./testimonial-card-shell";

export default function Testimonials() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const query = useSearch({
    from: "/o/$orgSlug/_public/testimonials/",
  });

  const { results, loadMore, status, isLoading } = useInfiniteTestimonialQuery(
    organization._id,
    {
      ...query,
      statuses: ["published"],
    },
  );

  const { ref, inView } = useInView({
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && status === "CanLoadMore" && !isLoading) {
      console.log("Fetching next page...", Date.now());
      loadMore(5);
    }
  }, [inView, loadMore, status, isLoading]);

  return (
    <div className="grid gap-8">
      {results.map((testimonial) => (
        <TestimonialContext.Provider
          key={testimonial._id}
          value={{ testimonial }}
        >
          <TestimonialCardShell>
            <CardHeader>
              <TestimonialCardTitle />
              <TestimonialCardInfo />
            </CardHeader>
            <CardContent>
              {testimonial.media_type === "audio" ||
              testimonial.media_type === "video" ? (
                <div className="space-y-2">
                  <TestimonialCardMedia  />
                  <TestimonialCardSummary />
                </div>
              ) : (
                <TestimonialCardText />
              )}
            </CardContent>
          </TestimonialCardShell>
        </TestimonialContext.Provider>
      ))}
      <div ref={ref}>
        {status === "Exhausted" && !isLoading ? (
          <div className="text-center text-sm text-muted-foreground">
            No more testimonials to load.
          </div>
        ) : (
          <Spinner className="size-8 mx-auto" />
        )}
      </div>
    </div>
  );
}
