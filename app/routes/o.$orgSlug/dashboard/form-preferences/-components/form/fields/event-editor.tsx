import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import type { EventSchema } from "../schema";
import EventNameEditor from "./event-name-editor";

type Props = {
  event: EventSchema;
  handleChange: (event: EventSchema) => void;
  //   onDateChange: (date: Date) => void;
  onDelete?: () => void;
  hasError?: boolean;
};
export default function EventEditor({
  event,
  handleChange,
  // onDateChange,
  onDelete,
  hasError = false,
}: Props) {
  const { id, name /*, date*/ } = event;

  return (
    <div className="flex gap-4">
      <EventNameEditor
        event={event}
        handleChange={handleChange}
        hasError={hasError}
      />
      <Field data-invalid={hasError}>
        <FieldLabel>Date</FieldLabel>
        <FieldDescription>Set the date for your event</FieldDescription>

      </Field>

      <Button
        variant="destructive"
        size="sm"
        className="size-8 ml-auto"
        onClick={onDelete}
      >
        <Trash />
      </Button>
    </div>
  );
}
