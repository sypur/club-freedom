import type { CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Theme } from "./form/schema";

export default function ThemePreview() {
  const form = useFormContext<Theme>();
  const style = form.watch() as CSSProperties;

  return (
    <div
      className="p-4"
      style={{
        ...style,
      }}
    >
      <Button>Button</Button>
    </div>
  );
}
