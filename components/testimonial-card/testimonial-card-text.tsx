import { useEffect, useRef, useState } from "react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function TestimonialCardText() {
  const { testimonial } = useTestimonialContext();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      // Check if the text content exceeds 3 lines
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 3;
      setIsOverflowing(element.scrollHeight > maxHeight);
    }
  }, []);

  return (
    <div className="space-y-2">
      <p
        ref={textRef}
        className={cn({ "line-clamp-3": !expanded && isOverflowing })}
      >
        {testimonial.testimonialText}
      </p>
      {isOverflowing && (
        <Button
          size="sm"
          className="px-0 cursor-pointer"
          variant="link"
          onClick={(e) => {
            e.stopPropagation();
            if (expanded) {
              setExpanded(false);
              setTimeout(() => {
                textRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 0);
            } else {
              setExpanded(true);
            }
          }}
        >
          {expanded ? "View less" : "View more"}
        </Button>
      )}
    </div>
  );
}
