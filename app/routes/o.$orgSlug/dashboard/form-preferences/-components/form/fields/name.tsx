import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormSchema } from "../schema";

export default function NameField() {
  const form = useFormContext<FormSchema>();

  return (
    <Controller
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Title</FieldLabel>
          <FieldDescription>
            Give a name for your testimonial form
          </FieldDescription>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder="Testimonial form name"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
