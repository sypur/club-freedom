import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { api } from "@/convex/_generated/api";
import AgreementsField from "./fields/agreements";
import FormatsField from "./fields/formats";
import NameField from "./fields/name";
import { defaultAgreement, type FormSchema, formSchema } from "./schema";

export default function FormPreferenceCreationForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const postFormPreference = useMutation(
    api.formPreferences.postFormPreference,
  );
  const router = useRouter();

  const form = useForm<FormSchema>({
    defaultValues: {
      name: "",
      formats: ["video", "audio", "text"],
      agreements: [{ value: defaultAgreement }],
    },
    resolver: zodResolver(formSchema),
  });

  const handleCreateForm = async (data: FormSchema) => {
    try {
      await postFormPreference({
        organizationId: organization._id,
        name: data.name,
        textEnabled: data.formats.includes("text"),
        audioEnabled: data.formats.includes("audio"),
        videoEnabled: data.formats.includes("video"),
        agreements: data.agreements.map((a) => a.value),
      });
      form.reset();
      toast.success("Form preference created successfully!", {
        description: "Thank you for creating a form preference.",
      });
      await router.navigate({
        to: "/o/$orgSlug/dashboard/form-preferences",
        params: { orgSlug: organization.slug },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to submit form preference", {
        description: message,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8"
        id="organization-form-preference"
        onSubmit={form.handleSubmit(handleCreateForm)}
      >
        <NameField />
        <FormatsField />
        <FieldSet>
          <FieldLegend>Agreements</FieldLegend>
          <FieldDescription>Add or remove agreements</FieldDescription>
          <AgreementsField />
        </FieldSet>

        <Button type="submit">Create</Button>
      </form>
    </FormProvider>
  );
}
