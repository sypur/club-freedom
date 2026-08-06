import { useTestimonialContext } from "@/contexts/testimonial-context";
import { Button } from "../ui/button";
import { Pin, PinOff } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function TestimonialPin() {
  const { testimonial } = useTestimonialContext();
  const isPinned = !!testimonial.pinnedAt;
  const pinTestimonial = useMutation(api.testimonials.pinTestimonial);

  async function handlePin() {
    try {
      await pinTestimonial({
        id: testimonial._id,
        pinned: !isPinned
      });
      toast.success(isPinned ? "Testimonial unpinned successfully" : "Testimonial pinned successfully");
    } catch (e) {
      toast.error(isPinned ? "Failed to unpin testimonial" : "Failed to pin testimonial");
    }
  }

  return <Button variant="outline" onClick={handlePin}>
    {isPinned ? <PinOff /> : <Pin />}
    <span className="sr-only sm:not-sr-only">{isPinned ? "Unpin" : "Pin"}</span>
  </Button>
}
