import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { EventSchema } from "../schema";

type Props = {
  event: EventSchema;
  handleChange: (event: EventSchema) => void;
  hasError?: boolean;
};
export default function EventNameEditor({
  event,
  handleChange,
  hasError = false,
}: Props) {
  const { id, name } = event;
  return (
    <Field data-invalid={hasError}>
    <FieldLabel htmlFor={id}>Name</FieldLabel>
    <FieldDescription>Give a name for your event</FieldDescription>
    <Input
        value={name}
        id={id}
        aria-invalid={hasError}
        placeholder="Event name"
        onChange={(e) =>
        handleChange({
            ...event,
            name: e.target.value,
        })
        }
    />
    </Field>
  );
}
