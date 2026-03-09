import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import type { FormSchema } from "../schema";

export default function FormatsField() {
  const form = useFormContext<FormSchema>();

  return (
    <Controller
      control={form.control}
      name="formats"
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend>Formats</FieldLegend>
          <FieldDescription>
            Choose the formats you want to enable
          </FieldDescription>
          <FieldGroup className="flow-col @sm/dashboard:flex-row gap-2">
            {(["video", "audio", "text"] as const).map((format) => (
              <Field
                key={format}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`testimonial-format-${format}`}
                  name={field.name}
                  checked={field.value.includes(format)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...field.value, format]
                      : field.value.filter((f) => f !== format);
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel
                  htmlFor={`testimonial-format-${format}`}
                  className="font-normal"
                >
                  {format}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
