import { useTestimonialContext } from "@/contexts/testimonial-context";
import { useTransition } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Pin, PinOff } from "lucide-react";
import { Button } from "../ui/button";

export function useTestimonialPin(testimonialId: Id<"testimonials">) {
  const updateTestimonialApproval = useMutation(
    api.testimonials.pinTestimonial
  );

  return async (approved: boolean) => {
    try {
      await updateTestimonialApproval({
        id: testimonialId
      });
      if (approved) {
        toast.success("This testimonial has been pinned!");
      } else {
        toast.warning("This testimonial is no longer pinned!");
      }
    } catch (_error) {
      toast.error("Failed to pin testimonial.");
    }
  };
}

export default function TestimonialPin() {
  const { testimonial } = useTestimonialContext();
  const [isPending, startTransition] = useTransition();
  const isPinned = true;

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => { }}
    >
      {isPinned ? (
        <div>
          <PinOff className="mr-2 h-4 w-4" />
          Unpin
        </div>
      ) : (
        <div>
          <Pin className="mr-2 h-4 w-4" />
          Pin
        </div>
      )}
    </Button>
  );
}
