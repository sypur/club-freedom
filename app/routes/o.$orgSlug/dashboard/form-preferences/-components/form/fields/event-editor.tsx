import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { EventSchema } from "../schema";

type Props = {
  event: EventSchema;
  //   onNameChange: (name: string) => void;
  //   onDateChange: (date: Date) => void;
  onDelete?: () => void;
  hasError?: boolean;
};
export default function EventEditor({
  event,
  // onNameChange,
  // onDateChange,
  onDelete,
  hasError = false,
}: Props) {
  const { id, name /*, date*/ } = event;

  return (
    <div className="flex gap-4">
      <Field data-invalid={hasError}>
        <FieldLabel htmlFor={name}>Name</FieldLabel>
        <FieldDescription>Give a name for your event</FieldDescription>
        <Input
          value={name}
          id={id}
          aria-invalid={hasError}
          placeholder="Event name"
        />
      </Field>
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
