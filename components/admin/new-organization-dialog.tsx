import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import {
  type Organization,
  organizationSchema,
} from "@/lib/schema/organization";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type Props = {
  trigger: ReactNode;
} & ComponentProps<typeof Dialog>;

const convertNameToSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default function NewOrganizationDialog({ trigger, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const createOrganization = useAction(api.admin.createOrganization);

  const form = useForm<Organization>({
    defaultValues: {
      name: "",
      slug: "",
      email: "",
    },
    resolver: zodResolver(organizationSchema),
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue("name", name);
    if (form.getFieldState("slug").isDirty) {
      return;
    }
    const generatedSlug = convertNameToSlug(name);
    const currentSlug = form.getValues("slug");
    if (generatedSlug !== currentSlug) {
      form.setValue("slug", generatedSlug, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  };

  const onSubmit = async (data: Organization) => {
    const organization = await createOrganization({
      name: data.name.trim(),
      slug: data.slug.trim(),
      email: data.email.trim(),
    });
    if (organization) {
      toast.success("Organization created successfully");
      form.reset();
      setOpen(false);
      return;
    }
    toast.error("Failed to create organization");
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          id="create-organization"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  onChange={handleNameChange}
                  placeholder="Your organization name"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <FieldDescription>
                  This will be used in the organization URL.
                </FieldDescription>
                <Input
                  {...field}
                  placeholder="Your slug name"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <FieldDescription>
                  This email is for the organization owner.
                </FieldDescription>
                <Input
                  {...field}
                  placeholder="name@sypur.io"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            form="create-organization"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
