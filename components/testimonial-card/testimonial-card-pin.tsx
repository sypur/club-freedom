import { useTestimonialContext } from "@/contexts/testimonial-context";
import { CardIcon } from "../ui/card";
import { Pin } from "lucide-react";

export default function TestimonialCardPin() {
  const { testimonial } = useTestimonialContext();
  return (testimonial.pinned &&
    <CardIcon>
      <Pin className="w-5 h-5 rotate-15 translate-y-px"/>
    </CardIcon>);
}
