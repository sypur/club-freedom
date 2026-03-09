import { zodResolver } from "@hookform/resolvers/zod";
import {
  useLoaderData,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { api } from "@/convex/_generated/api";
import ActivateFormPreference from "../actions/activate";
import RemoveFormPreference from "../actions/remove";
import AgreementsField from "./fields/agreements";
import FormatsField from "./fields/formats";
import NameField from "./fields/name";
import { defaultAgreement, type FormSchema, formSchema } from "./schema";

export const FORM_ID = "form-preference-edit-form";

export default function FormPreferenceEditForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { formPreference } = useLoaderData({
    from: "/o/$orgSlug/dashboard/form-preferences/$id",
  });

  const formats = useMemo(() => {
    const result = [] as ("video" | "audio" | "text")[];
    if (formPreference.videoEnabled) {
      result.push("video");
    }
    if (formPreference.audioEnabled) {
      result.push("audio");
    }
    if (formPreference.textEnabled) {
      result.push("text");
    }
    return result;
  }, [formPreference]);

  const updateFormPreference = useMutation(
    api.formPreferences.updateFormPreference,
  );
  const router = useRouter();

  const form = useForm<FormSchema>({
    defaultValues: {
      name: formPreference.name,
      formats,
      agreements: formPreference.agreements?.map((value) => ({ value })) || [
        { value: defaultAgreement },
      ],
    },
    resolver: zodResolver(formSchema),
  });

  const handleUpdateForm = async (data: FormSchema) => {
    try {
      await updateFormPreference({
        _id: formPreference._id,
        name: data.name,
        textEnabled: data.formats.includes("text"),
        audioEnabled: data.formats.includes("audio"),
        videoEnabled: data.formats.includes("video"),
        agreements: data.agreements.map((a) => a.value),
      });
      toast.success("Form preference updated successfully!");
      await router.navigate({
        to: "/o/$orgSlug/dashboard/form-preferences",
        params: { orgSlug: organization.slug },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to update form preference", {
        description: message,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8"
        id={FORM_ID}
        onSubmit={form.handleSubmit(handleUpdateForm)}
      >
        <NameField />
        <FormatsField />
        <FieldSet>
          <FieldLegend>Agreements</FieldLegend>
          <FieldDescription>Add or remove agreements</FieldDescription>
          <AgreementsField />
        </FieldSet>

        <div className="flex gap-2">
          <ActivateFormPreference variant="outline" />
          <RemoveFormPreference variant="destructive" />
          <Button type="submit">Update</Button>
        </div>
      </form>
    </FormProvider>
  );
}
