import { useQuery } from "convex/react";
import { CircleAlert } from "lucide-react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Spinner } from "../ui/spinner";

export default function TestimonialMedia() {
  const { testimonial } = useTestimonialContext();
  const mediaUrl = useQuery(api.testimonials.getTestimonialMediaUrlById, {
    id: testimonial._id,
  });

  if (mediaUrl === undefined) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Loading {testimonial.media_type}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  if (mediaUrl === null) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <CircleAlert />
          </EmptyMedia>
          <EmptyTitle>No {testimonial.media_type} available</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  if (testimonial.media_type === "audio") {
    return (
      <audio
        controls
        className="w-full"
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  if (testimonial.media_type === "video") {
    return (
      <video
        src={mediaUrl}
        controls
        className="w-full"
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  return null;
}
