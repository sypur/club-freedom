import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import type { CSSTheme } from "@/lib/theme";
import ThemeCustomizationDesktopView from "./-components/desktop";
import { type Theme, themeSchema } from "./-components/form/schema";
import ThemeCustomizationMobileView from "./-components/mobile";

export const Route = createFileRoute("/o/$orgSlug/dashboard/theme/")({
  component: RouteComponent,
});

function getValueFromCSSVariable(stylings: CSSTheme, name: keyof CSSTheme) {
  const value = stylings[name];
  if (value) return value;
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function RouteComponent() {
  const { stylings } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const form = useForm<Theme>({
    defaultValues: {
      primary: getValueFromCSSVariable(stylings, "--primary"),
      primaryForeground: getValueFromCSSVariable(
        stylings,
        "--primary-foreground",
      ),
      secondary: getValueFromCSSVariable(stylings, "--secondary"),
      secondaryForeground: getValueFromCSSVariable(
        stylings,
        "--secondary-foreground",
      ),
      accent: getValueFromCSSVariable(stylings, "--accent"),
      accentForeground: getValueFromCSSVariable(
        stylings,
        "--accent-foreground",
      ),
      background: getValueFromCSSVariable(stylings, "--background"),
      foreground: getValueFromCSSVariable(stylings, "--foreground"),
      destructive: getValueFromCSSVariable(stylings, "--destructive"),
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
