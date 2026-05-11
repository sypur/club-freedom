import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/schema/testimonials";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

type SignIn = z.infer<typeof signInSchema>;

export function SignInForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<SignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignIn) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        async onSuccess() {
          await queryClient.invalidateQueries();
          const { data: allOrganizations } =
            await authClient.organization.list();
          const firstOrganization =
            allOrganizations && allOrganizations.length > 0
              ? allOrganizations[0]
              : null;
          navigate({
            to: firstOrganization
              ? `/o/${firstOrganization.slug}/dashboard`
              : "/",
          });
        },
        onError(ctx) {
          toast.error("Failed to sign in", {
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
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Link
                to="/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              {...field}
              type="password"
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Spinner /> : "Sign in"}
      </Button>
    </form>
  );
}
