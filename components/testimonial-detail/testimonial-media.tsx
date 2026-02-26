import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { CircleAlert } from "lucide-react";
import { Suspense } from "react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { db } from "@/lib/offline/db";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Spinner } from "../ui/spinner";

export default function TestimonialMedia() {
  const { testimonial } = useTestimonialContext();

  return (
    <Suspense
      fallback={
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Loading {testimonial.media_type}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      }
    >
      <SuspenseTestimonialMedia />
    </Suspense>
  );
}

function TestimonialMediaPlayer({ mediaUrl }: { mediaUrl: string }) {
  const { testimonial } = useTestimonialContext();

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

function RemoteTestimonialMedia() {
  const { testimonial } = useTestimonialContext();
  const { data: mediaUrl } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialMediaUrlById, {
      id: testimonial._id,
    }),
  );

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

  return <TestimonialMediaPlayer mediaUrl={mediaUrl} />;
}

function SuspenseTestimonialMedia() {
  const { testimonial } = useTestimonialContext();
  const data = useLiveQuery(() => db.media.get(testimonial._id));

  if (data) {
    return <TestimonialMediaPlayer mediaUrl={URL.createObjectURL(data.blob)} />;
  }

  return <RemoteTestimonialMedia />;
}
