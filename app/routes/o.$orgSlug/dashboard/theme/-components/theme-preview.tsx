import type { ComponentProps, CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Theme } from "./form/schema";
import { cn } from "@/lib/utils";

export default function ThemePreview({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useFormContext<Theme>();
  const style = form.watch() as CSSProperties;

  return (
    <div
      className={cn("p-4 bg-background", className)}
      style={{
        ...style,
      }}
      {...props}
    >
      <Button>Button</Button>
    </div>
  );
}
