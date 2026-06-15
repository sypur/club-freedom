import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventSchema } from "../schema";
import EventDateEditor from "./event-date-editor";
import EventNameEditor from "./event-name-editor";

type Props = {
  event: EventSchema;
  handleChange: (event: EventSchema) => void;
  onDelete?: () => void;
  hasError?: boolean;
};
export default function EventEditor({
  event,
  handleChange,
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
