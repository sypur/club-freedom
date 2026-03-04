import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import ThemeCustomizationDesktopView from "./-components/desktop";
import { type Theme, themeSchema } from "./-components/form/schema";
import ThemeCustomizationMobileView from "./-components/mobile";

export const Route = createFileRoute("/o/$orgSlug/dashboard/theme/")({
  component: RouteComponent,
});

function getValueFromCSSVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function RouteComponent() {
  const form = useForm<Theme>({
    defaultValues: {
      "--primary": getValueFromCSSVariable("--primary"),
      "--primary-foreground": getValueFromCSSVariable("--primary-foreground"),
      "--secondary": getValueFromCSSVariable("--secondary"),
      "--secondary-foreground": getValueFromCSSVariable(
        "--secondary-foreground",
      ),
      "--accent": getValueFromCSSVariable("--accent"),
      "--accent-foreground": getValueFromCSSVariable("--accent-foreground"),
      "--background": getValueFromCSSVariable("--background"),
      "--foreground": getValueFromCSSVariable("--foreground"),
      "--destructive": getValueFromCSSVariable("--destructive"),
    },
    resolver: zodResolver(themeSchema),
  });

  return (
    <FormProvider {...form}>
      <ThemeCustomizationMobileView className="min-h-[calc(100vh-4rem)] @4xl/dashboard:hidden" />
      <ThemeCustomizationDesktopView className="h-[calc(100vh-4rem)] hidden @4xl:flex" />
    </FormProvider>
  );
}
