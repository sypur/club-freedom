import { useTestimonialContext } from "@/contexts/testimonial-context";
import { useTransition } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Pin, PinOff } from "lucide-react";
import { Button } from "../ui/button";

export function getPinStatus(testimonialId: Id<"testimonials">): boolean {
  const pinStatus = useQuery(
    api.testimonials.getPinStatus,
    { id: testimonialId }
  );
  if (!pinStatus) return false;
  return pinStatus;
}

export function useTestimonialPin(testimonialId: Id<"testimonials">, pinStatus: boolean) {
  const pinTestimonial = useMutation(
    api.testimonials.pinTestimonial
  );

  const unpinTestimonial = useMutation(
    api.testimonials.unpinTestimonial
  );

    if (pinStatus) {
      return async () => {
        try {
          await unpinTestimonial({
            id: testimonialId
          });
          toast.success("This testimonial has been unpinned!");
        } catch (_error) {
          toast.error("Failed to unpin testimonial.");
        }
      }
    } else {
      return async () => {
        try {
          await pinTestimonial({
            id: testimonialId
          });
          toast.success("This testimonial has been pinned!");
        } catch (_error) {
          toast.error("Failed to pin testimonial.");
        }
      }
    }
}

export default function TestimonialPin() {
  const { testimonial } = useTestimonialContext();
  const [isPending, startTransition] = useTransition();

  const pinStatus = getPinStatus(testimonial._id);

  const usePin = useTestimonialPin(testimonial._id, pinStatus);
  const handlePinChange = async (pin: boolean) => {
    startTransition(async () => await usePin());
  };

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => handlePinChange(pinStatus)}
    >
      {pinStatus ? (
        <div>
          <PinOff className="mr-2 h-4 w-4" />
        </div>
      ) : (
        <div>
          <Pin className="mr-2 h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
