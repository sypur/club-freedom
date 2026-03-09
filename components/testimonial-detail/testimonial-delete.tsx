import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useTestimonialIdParam } from "@/app/routes/o.$orgSlug/dashboard/testimonials/-components/hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";

export default function TestimonialDelete() {
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });
  const { testimonial } = useTestimonialContext();
  const { setTestimonialId } = useTestimonialIdParam();

  const navigate = useNavigate();
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);
  async function handleDelete() {
    try {
      await deleteTestimonial({ id: testimonial._id });
      toast.success("Testimonial deleted successfully");
      await setTestimonialId(null);
      await navigate({
        to: "/o/$orgSlug/dashboard/testimonials",
        params: { orgSlug: organization.slug },
        search: true,
      });
    } catch (_err) {
      if (_err instanceof Error) {
        toast.error(`Failed to delete testimonial: ${_err.message}`);
      } else {
        toast.error(`Failed to delete testimonial: ${_err}`);
      }
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently the testimonial
            and testimonial media.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
