import type { ComponentProps } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ThemeCustomizationForm from "./form";
import ThemePreview from "./theme-preview";

export default function ThemeCustomizationMobileView({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn(className)} {...props}>
      <Tabs defaultValue="control">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="control">
          <ThemeCustomizationForm className="p-4" />
        </TabsContent>
        <TabsContent value="preview">
          <ThemePreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
