import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { CircleAlert } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useQuery } from "convex/react";

export default function TestimonialCardMedia() {
  const { testimonial } = useTestimonialContext();
  const mediaUrl = useQuery(api.testimonials.getTestimonialMediaUrlById, {
    id: testimonial._id,
  });

  if (mediaUrl === undefined) {
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading...</EmptyTitle>
      </EmptyHeader>
    </Empty>;
  }

  if (mediaUrl === null) {
    return (
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyMedia>
            <CircleAlert />
          </EmptyMedia>
          <EmptyTitle>Media not found</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  if (testimonial.media_type === "audio")
    return (
      <audio
        className="w-full"
        controls
        src={mediaUrl}
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );

  if (testimonial.media_type === "video")
    return (
      <video
        className="w-full"
        controls
        src={mediaUrl}
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    );

  return null;
}
