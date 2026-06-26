import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

const daysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const formSchema = z
  .object({
    enabled: z.boolean(),
    daysOfTheWeek: z.array(z.enum(daysOfTheWeek)),
  })
  .refine(
    ({ enabled, daysOfTheWeek }) => {
      return !enabled || daysOfTheWeek.length > 0;
    },
    {
      path: ["daysOfTheWeek"],
      error:
        "You must select at least one day of the week when notifications are enabled.",
    },
  );

type FormSchema = z.infer<typeof formSchema>;

export default function NotificationForm() {
  const form = useForm<FormSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: false,
      daysOfTheWeek: [],
    },
  });

  const isEnabled = form.watch("enabled");

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="enabled"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Email notification</FieldLabel>
              <FieldDescription>
                Emails about pending testimonials will be sent to your email
                address.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={field.name}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </Field>
        )}
      />
      {isEnabled && (
        <Controller
          control={form.control}
          name="daysOfTheWeek"
          disabled={!isEnabled}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend variant="label">Notification Frequency</FieldLegend>
              <FieldDescription>
                Choose at least one day of the week to receive notifications.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {daysOfTheWeek.map((day) => (
                  <Field key={day} orientation="horizontal">
                    <Checkbox
                      name={field.name}
                      id={`${field.name}-${day}`}
                      checked={field.value.includes(day)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, day]
                          : field.value.filter((value) => value !== day);
                        field.onChange(newValue);
                      }}
                    />
                    <FieldLabel htmlFor={`${field.name}-${day}`}>
                      {day}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      )}
      <Button
        className="place-self-start"
        type="submit"
        disabled={
          form.formState.isSubmitting ||
          !form.formState.isDirty ||
          !form.formState.isValid
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
