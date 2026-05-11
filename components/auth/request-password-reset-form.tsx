import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env/client";
import { authClient } from "@/lib/auth/auth-client";
import { emailSchema } from "@/lib/schema/testimonials";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

type RequestPasswordReset = z.infer<typeof requestPasswordResetSchema>;

export function RequestPasswordResetForm() {
  const form = useForm<RequestPasswordReset>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordReset) => {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${env.VITE_SITE_URL}/reset-password`,
      },
      {
        onSuccess() {
          toast.success("Check your email for the reset password link!");
        },
        onError(ctx) {
          toast.error("Failed to send reset password email", {
            description: ctx.error.message,
          });
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              type="email"
              placeholder="name@sypur.io"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Spinner /> : "Request password reset"}
      </Button>
    </form>
  );
}
