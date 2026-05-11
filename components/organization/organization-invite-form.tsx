import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth/auth-client";
import { ALL_ROLES } from "@/lib/auth/permissions/organization";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { listInvitesQuery } from "./organization-invite-list";

const formSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
  role: z.literal(ALL_ROLES),
});

type FormSchema = z.infer<typeof formSchema>;

export default function OrganizationInviteForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      email: "",
      role: "viewer",
    },
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const queryKey = listInvitesQuery(organization).queryKey;

  const handleInvite = async (data: FormSchema) => {
    const { error } = await authClient.organization.inviteMember({
      email: data.email,
      role: data.role,
      organizationId: organization._id,
    });

    if (!error) {
      toast.success("Invitation email was sent successfully");
      form.reset();
      await queryClient.invalidateQueries({ queryKey });
    } else {
      toast.error("Failed to send invitation email");
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      id="organization-invite-form"
      onSubmit={form.handleSubmit(handleInvite)}
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              placeholder="name@sypur.io"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex-0 min-w-30">
            <FieldLabel htmlFor={field.name}>Role</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ALL_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </form>
  );
}
