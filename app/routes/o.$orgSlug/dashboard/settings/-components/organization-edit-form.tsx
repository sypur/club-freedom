import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";
import {
  type Organization,
  organizationSchema,
} from "@/lib/schema/organization";
import { Route } from "..";

export default function OrganizationEditForm() {
  const { orgSlug } = Route.useParams();
  const { data: organization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, {
      slug: orgSlug,
    }),
  );

  const form = useForm<Organization>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name,
      slug: organization?.slug,
    },
  });

  const router = useRouter();

  const onSubmit = async (formData: Organization) => {
    if (!organization?._id) {
      return;
    }

    const { data: updatedOrganization, error } =
      await authClient.organization.update({
        organizationId: organization._id,
        data: {
          name: formData.name,
          slug: formData.slug,
        },
      });

    if (error) {
      toast.error("Cannot update organization", {
        description: error.message,
      });
      return;
    }

    toast.success("Organization updated successfully");
    form.reset({
      name: updatedOrganization.name,
      slug: updatedOrganization.slug,
    });

    if (updatedOrganization.slug !== organization.slug) {
      await router.navigate({
        to: ".",
        params: { orgSlug: updatedOrganization.slug },
      });
      await router.invalidate();
    }
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              placeholder="Your organization name"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="slug"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
            <Input
              {...field}
              placeholder="your-organization-slug"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="place-self-start"
        type="submit"
        disabled={
          form.formState.isSubmitting ||
          !organization?._id ||
          !form.formState.isDirty
        }
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
