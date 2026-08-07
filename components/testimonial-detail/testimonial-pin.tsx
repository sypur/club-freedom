import { useMutation, useQuery } from "convex/react";
import { Pin, PinOff } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function remainingPinnedTestimonialsMessage(count: number) {
  if (count > 1) return `You have ${count} testimonials left to pin`;
  if (count === 1) return `You have only 1 testimonial left to pin`;
  return `You reached the limit of pinned testimonials`;
}

export default function TestimonialPin() {
  const { testimonial } = useTestimonialContext();
  const [isPending, startTransition] = useTransition();
  const remainingPinnedTestimonials = useQuery(
    api.testimonials.remainingPinTestimonials,
    {
      organizationId: testimonial.organizationId,
    },
  );
  console.log(remainingPinnedTestimonials);
  const isPinned = !!testimonial.pinnedAt;
  const pinTestimonial = useMutation(api.testimonials.pinTestimonial);

  async function handlePin() {
    try {
      const remain = isPinned
        ? (remainingPinnedTestimonials || 0) + 1
        : (remainingPinnedTestimonials || 0) - 1;
      await pinTestimonial({
        id: testimonial._id,
        pinned: !isPinned,
      });
      toast.success(
        isPinned
          ? "Testimonial unpinned successfully"
          : "Testimonial pinned successfully",
        {
          description: remainingPinnedTestimonialsMessage(remain),
        },
      );
    } catch (e) {
      toast.error(
        isPinned ? "Failed to unpin testimonial" : "Failed to pin testimonial",
      );
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            onClick={() => startTransition(handlePin)}
            disabled={
              (!isPinned && (remainingPinnedTestimonials || 0) <= 0) ||
              isPending
            }
          >
            {isPinned ? <PinOff /> : <Pin />}
            <span className="sr-only sm:not-sr-only">
              {isPinned ? "Unpin" : "Pin"}
            </span>
          </Button>
        </TooltipTrigger>
        {!isPending &&
          !isPinned &&
          remainingPinnedTestimonials !== undefined && (
            <TooltipContent side="bottom">
              {remainingPinnedTestimonialsMessage(remainingPinnedTestimonials)}
            </TooltipContent>
          )}
      </Tooltip>
    </TooltipProvider>
  );
}
