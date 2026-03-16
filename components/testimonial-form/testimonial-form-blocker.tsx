import { useBlocker } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Testimonial } from "@/lib/schema/testimonials";

export default function TestimonialFormBlocker() {
  const form = useFormContext<Testimonial>();
  const hasUnsavedTestimonial = () => {
    const hasText = !!form.watch("writtenText");
    const hasMedia = !!form.watch("media");
    return hasText || hasMedia;
  };

  const { status, reset, proceed } = useBlocker({
    shouldBlockFn: hasUnsavedTestimonial,
    enableBeforeUnload: hasUnsavedTestimonial,
    withResolver: true,
  });

  return (
    <AlertDialog open={status === "blocked"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved testimonial</AlertDialogTitle>
          <AlertDialogDescription>
            Your testimonial will be lost if you leave this page. Are you sure
            you want to leave?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
