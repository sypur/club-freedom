import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EventSchema } from "../schema";

type Props = {
  event: EventSchema;
  handleChange: (event: EventSchema) => void;
  hasError?: boolean;
};
export default function EventDateEditor({
  event,
  handleChange,
  hasError = false,
}: Props) {
  const { date } = event;

  return (
    <Field data-invalid={hasError}>
      <FieldLabel>Date</FieldLabel>
      <FieldDescription>Set the date for your event</FieldDescription>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) =>
              handleChange({
                ...event,
                date: selectedDate ?? date ?? new Date(),
              })
            }
            defaultMonth={date ?? new Date()}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
