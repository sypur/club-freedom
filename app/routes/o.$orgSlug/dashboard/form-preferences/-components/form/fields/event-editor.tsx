import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import type { EventSchema } from "../schema";
import EventNameEditor from "./event-name-editor";
import EventDateEditor from "./event-date-editor";

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

  return (
    <div className="flex gap-4">
      <EventNameEditor
        event={event}
        handleChange={handleChange}
        hasError={hasError}
      />
      <EventDateEditor
        event={event}
        handleChange={handleChange}
        hasError={hasError}
      />
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
