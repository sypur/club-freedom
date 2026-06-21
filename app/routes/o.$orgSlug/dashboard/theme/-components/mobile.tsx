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
    <div className={cn(className, "flex relative")} {...props}>
      <Tabs defaultValue="control" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none sticky top-16 z-10">
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="control">
          <ThemeCustomizationForm className="p-4" />
        </TabsContent>
        <TabsContent value="preview" className="flex flex-1">
          <ThemePreview className="flex-1" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
