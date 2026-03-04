import type { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import ColorInput from "./color-input";
import type { Theme } from "./schema";

export default function ThemeCustomizationForm({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) {
  const form = useFormContext<Theme>();

  return (
    <form
      className={cn("grid gap-4", className)}
      {...props}
      onSubmit={form.handleSubmit(console.log)}
    >
      <Controller
        control={form.control}
        name="--primary"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Primary</FieldLabel>
            <ColorInput name="--primary" />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="--primary-foreground"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Primary Foreground</FieldLabel>
            <ColorInput name="--primary-foreground" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="--secondary"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Secondary</FieldLabel>
            <ColorInput name="--secondary" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="--secondary-foreground"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Secondary Foreground</FieldLabel>
            <ColorInput name="--secondary-foreground" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="--destructive"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Destructive</FieldLabel>
            <ColorInput name="--destructive" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="place-self-start">
        Apply
      </Button>
    </form>
  );
}
