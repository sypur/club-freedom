import { Pin } from "lucide-react";
import type { ComponentProps, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { cn } from "@/lib/utils";
import { useTestimonialIdParam } from "./hook";

type TestimonialCardShellProps = ComponentProps<typeof Card> & {
  isPublic?: boolean;
};

export default function TestimonialCardShell({
  className,
  children,
  ...props
}: TestimonialCardShellProps) {
  const { testimonial } = useTestimonialContext();
  const { testimonialId, setTestimonialId } = useTestimonialIdParam();

  const handleNavigation = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }
    setTestimonialId(testimonial._id as string);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation();
    }
  };

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      className={cn(className, "hover:bg-muted/25 cursor-pointer relative", {
        "bg-muted/25": testimonial._id === testimonialId,
      })}
      {...props}
    >
      {testimonial.pinnedAt && (
        <Pin className="absolute size-4 top-2 right-2 pointer-events-none" />
      )}
      {children}
    </Card>
  );
}
