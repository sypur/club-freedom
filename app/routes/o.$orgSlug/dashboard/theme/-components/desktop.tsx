import type { ComponentProps } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeCustomizationForm from "./form";
import ThemePreview from "./theme-preview";

export default function ThemeCustomizationDesktopView({
  ...props
}: ComponentProps<"div">) {
  return (
    <div {...props}>
      <ScrollArea className="w-90 h-full border-r">
        <ThemeCustomizationForm className="p-4" />
      </ScrollArea>
      <ScrollArea className="flex-1 h-full">
        <ThemePreview className="min-h-[calc(100vh-4rem)]" />
      </ScrollArea>
    </div>
  );
}
