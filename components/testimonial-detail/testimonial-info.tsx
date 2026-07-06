import { format } from "date-fns";
import { useTestimonialContext } from "@/contexts/testimonial-context";

export default function TestimonialInfo() {
  const { testimonial } = useTestimonialContext();

  return (
    <div className="space-y-1">
      <h3 className="font-bold">Posted by {testimonial.name}</h3>
      <p className="text-muted-foreground">
        {format(testimonial._creationTime, "PPp")}
      </p>
      {testimonial.eventName && testimonial.eventDate && (
        <h3 className="font-bold">
          Event: {testimonial.eventName} -{" "}
          {new Date(testimonial.eventDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
      )}
    </div>
  );
}
