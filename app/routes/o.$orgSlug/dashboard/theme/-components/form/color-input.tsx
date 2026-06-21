import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { type FieldName, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Theme } from "./schema";

type Props = {
  name: FieldName<Theme>;
};

export default function ColorInput({ name }: Props) {
  const { field, fieldState } = useController<Theme>({
    name,
  });

  const { value, onChange, ...rest } = field;

  const [localValue, setLocalValue] = useState(() => value);
  const debouncedLocalValue = useDebounce(localValue, 50);

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  useEffect(() => {
    onChange(debouncedLocalValue);
  }, [onChange, debouncedLocalValue]);

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        className="shadow-lg relative cursor-pointer overflow-hidden"
        variant="outline"
        size="icon"
        style={{
          background: value,
        }}
      >
        <input
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          type="color"
          {...rest}
          value={localValue}
          onChange={handleColorInputChange}
          name={`${field.name}-picker`}
        />
      </Button>
      <Input
        id={field.name}
        {...rest}
        aria-invalid={fieldState.invalid}
        value={localValue}
        onChange={handleColorInputChange}
      />
    </div>
  );
}
