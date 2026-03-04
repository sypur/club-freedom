import { type FieldName, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Theme } from "./schema";
import { FieldError } from "@/components/ui/field";

type Props = {
  name: FieldName<Theme>;
};

export default function ColorInput({ name }: Props) {
  const { field, fieldState } = useController<Theme>({
    name,
  });

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        className="shadow-lg relative cursor-pointer overflow-hidden"
        variant="outline"
        size="icon"
        style={{
          background: field.value,
        }}
      >
        <input
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          type="color"
          {...field}
          name={`${field.name}-picker`}
        />
      </Button>
      <Input id={field.name} {...field} aria-invalid={fieldState.invalid} />
    </div>
  );
}
