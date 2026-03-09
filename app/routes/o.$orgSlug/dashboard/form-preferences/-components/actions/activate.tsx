import { useRouteContext } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";

export default function ActivateFormPreference({
  disabled,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { formPreference } = useFormPreferenceContext();
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const activateFormPreference = useMutation(
    api.formPreferences.activateFormPreference,
  );

  async function handleActivate() {
    try {
      await activateFormPreference({
        id: formPreference._id,
        organizationId: organization._id,
      });
      toast.success("Form preference activated successfully");
    } catch (_err) {
      if (_err instanceof Error) {
        toast.error(`Failed to activate form preference`, {
          description: _err.message,
        });
      } else {
        toast.error(`Failed to activate form preference: ${_err}`);
      }
    }
  }

  return (
    <Button
      disabled={formPreference.activated}
      onClick={() => handleActivate()}
      {...props}
    >
      {formPreference.activated ? "Activated" : "Activate"}
    </Button>
  );
}
