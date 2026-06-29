import { Controller, useFormContext } from "react-hook-form";
import type { TestimonialFormEventSchema } from "@/app/routes/o.$orgSlug/dashboard/form-preferences/-components/form/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Testimonial } from "@/lib/schema/testimonials";
import { Field, FieldError, FieldLabel } from "../ui/field";

type Props = {
  formEvents: TestimonialFormEventSchema[];
};
export function EventPicker({ formEvents }: Props) {
  const form = useFormContext<Testimonial & { agreementsAccepted: string[] }>();
  return (
    <Controller
      control={form.control}
      name="formEvents"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} className="flex items-baseline">
            Event <small>(optional)</small>
          </FieldLabel>
          <Select
            value={field.value?.id || undefined}
            onValueChange={(id) => {
              const selectedEvent = formEvents.find((e) => e.id === id);
              field.onChange(selectedEvent);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {formEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name} -{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
