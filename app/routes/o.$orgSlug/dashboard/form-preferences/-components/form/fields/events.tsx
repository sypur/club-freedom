import { PlusIcon } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { defaultEvent, type FormSchema } from "../schema";
import EventEditor from "./event-editor";

export default function EventsField() {
  const { control } = useFormContext<FormSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formEvents",
  });
  return (
    <div className="flex flex-col gap-4">
      {fields.map((item, index) => (
        <Controller
          key={item.id}
          control={control}
          name={`formEvents.${index}`}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <EventEditor
                event={field.value ?? defaultEvent}
                handleChange={field.onChange}
                onDelete={() => {
                  remove(index);
                }}
                hasError={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          )}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ ...defaultEvent })}
        className="border-dashed"
      >
        <PlusIcon /> Add event
      </Button>
    </div>
  );
}
