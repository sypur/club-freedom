import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Activity } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { Route } from "..";

const daysOfTheWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
] as const;

const availableTimes = Array.from({ length: 15 }, (_, i) => 7 + i);

const convertToAMPM = (time: number) => {
  const hours = time % 12 || 12;
  return `${hours}:00 ${time < 12 ? "AM" : "PM"}`;
};

const formSchema = z
  .object({
    enabled: z.boolean(),
    daysOfTheWeek: z.array(z.number()),
    hour: z.number(),
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

export default function NotificationPreferenceForm() {
  const { organization } = Route.useRouteContext();
  const { data: preference } = useSuspenseQuery(
    convexQuery(api.notification.getNotificationPreference, {
      organizationId: organization._id,
    }),
  );

  const form = useForm<FormSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: preference?.enabled || false,
      daysOfTheWeek: preference?.daysOfTheWeek || [],
      hour: preference?.hour || 9,
    },
  });

  const savePreference = useMutation(
    api.notification.upsertNotificationPreference,
  );

  const isEnabled = form.watch("enabled");

  const onSubmit = async (formData: FormSchema) => {
    const preference = formData.enabled
      ? {
          ...formData,
          enabled: true as const,
        }
      : {
          enabled: false as const,
        };

    try {
      await savePreference({
        preference,
        organizationId: organization._id,
      });
      toast.success("Email preference saved successfully");
      form.reset({
        ...preference,
      });
    } catch (error) {
      toast.error("Failed to save email preference");
    }
  };

  return (
    <form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="enabled"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Enable notification</FieldLabel>
              <FieldDescription>
                Notification about pending testimonials will be sent to your
                email address.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={field.name}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={form.formState.isSubmitting}
            />
          </Field>
        )}
      />
      <Activity mode={isEnabled ? "visible" : "hidden"}>
        <Controller
          control={form.control}
          name="daysOfTheWeek"
          disabled={!isEnabled}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend variant="label">Frequency</FieldLegend>
              <FieldDescription>
                Choose at least one day of the week to receive notifications.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {daysOfTheWeek.map((day) => (
                  <Field key={day.value} orientation="horizontal">
                    <Checkbox
                      name={field.name}
                      id={`${field.name}-${day.value}`}
                      disabled={form.formState.isSubmitting}
                      checked={field.value.includes(day.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, day.value]
                          : field.value.filter((value) => value !== day.value);
                        field.onChange(newValue);
                      }}
                    />
                    <FieldLabel htmlFor={`${field.name}-${day}`}>
                      {day.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />
      </Activity>
      <Activity mode={isEnabled ? "visible" : "hidden"}>
        <Controller
          control={form.control}
          name="hour"
          render={({ field }) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Send notification at
                </FieldLabel>
                <FieldDescription>
                  Choose the time of the day you want to receive notifications.
                </FieldDescription>
              </FieldContent>
              <Select
                name={field.name}
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={form.formState.isSubmitting}
              >
                <SelectTrigger className="min-w-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time.toString()}>
                      {convertToAMPM(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </Activity>
      <Button
        className="place-self-start"
        type="submit"
        disabled={form.formState.isSubmitting || !form.formState.isValid}
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
