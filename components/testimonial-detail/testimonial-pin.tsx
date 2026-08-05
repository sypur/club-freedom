import { useMutation, useQuery } from "convex/react";
import { Pin, PinOff } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";

export function usePinStatus(
  testimonialId: Id<"testimonials">,
): boolean | undefined {
  const pinStatus = useQuery(api.testimonials.getPinStatus, {
    id: testimonialId,
  });
  return pinStatus;
}

export function useTestimonialPin(
  testimonialId: Id<"testimonials">,
  pinStatus: boolean,
) {
  const pinTestimonial = useMutation(api.testimonials.pinTestimonial);

  const unpinTestimonial = useMutation(api.testimonials.unpinTestimonial);

  if (pinStatus) {
    return async () => {
      try {
        const unpinTest = await unpinTestimonial({
          id: testimonialId,
        });
        if (unpinTest.success) toast.success(unpinTest.message);
        else toast.error(unpinTest.message);
      } catch (_error) {
        toast.error("Failed to unpin testimonial.");
      }
    };
  } else {
    return async () => {
      try {
        const pinTest = await pinTestimonial({
          id: testimonialId,
        });
        if (pinTest.success) toast.success(pinTest.message);
        else toast.error(pinTest.message);
      } catch (_error) {
        toast.error("Failed to pin testimonial.");
      }
    };
  }
}

export default function TestimonialPin() {
  const { testimonial } = useTestimonialContext();
  const [isPending, startTransition] = useTransition();

  const pinStatus = usePinStatus(testimonial._id) || false;

  const togglePin = useTestimonialPin(testimonial._id, pinStatus);

  const handlePinChange = async () => {
    startTransition(async () => await togglePin());
  };

  return (
    <Button
      disabled={isPending}
      onClick={() => handlePinChange()}
      className="h-9 rounded-md border border-input bg-transparent text-accent-foreground hover:bg-transparent"
    >
      {pinStatus ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
    </Button>
  );
}
