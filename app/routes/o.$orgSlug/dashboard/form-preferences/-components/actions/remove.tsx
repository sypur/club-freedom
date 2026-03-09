import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import type { ComponentProps } from "react";
import { toast } from "sonner";
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
import { useFormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";

export default function RemoveFormPreference(
  props: ComponentProps<typeof Button>,
) {
  const { formPreference } = useFormPreferenceContext();
  const deleteFormPreference = useMutation(
    api.formPreferences.deleteFormPreference,
  );
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const navigate = useNavigate();

  async function handleDelete() {
    try {
      await deleteFormPreference({ id: formPreference._id });
      toast.success("Form Preference deleted successfully");
      await navigate({
        to: "/o/$orgSlug/dashboard/form-preferences",
        params: { orgSlug: organization.slug },
      });
    } catch (_err) {
      toast.error("Failed to delete form preference", {
        description: _err instanceof Error ? _err.message : undefined,
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props}>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{formPreference.name}</strong> will be no longer a form
            preference of <strong>{organization.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
