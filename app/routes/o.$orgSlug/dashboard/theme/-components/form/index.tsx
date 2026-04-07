import type { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import ColorInput from "./color-input";
import type { Theme } from "./schema";

export default function ThemeCustomizationForm({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) {
  const form = useFormContext<Theme>();

  return (
    <form
      className={cn("grid gap-4", className)}
      {...props}
      onSubmit={form.handleSubmit(console.log)}
    >
      <Accordion
        defaultValue="primary"
        type="single"
        collapsible
        className="w-full rounded-lg border"
      >
        <AccordionItem value="primary">
          <AccordionTrigger className="px-4">Primary Colors</AccordionTrigger>
          <AccordionContent className="px-4 space-y-4">
            <Controller
              control={form.control}
              name="primary"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Primary</FieldLabel>
                  <ColorInput name="primary" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="primaryForeground"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Primary Foreground
                  </FieldLabel>
                  <ColorInput name="primaryForeground" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        defaultValue="secondary"
        type="single"
        collapsible
        className="w-full rounded-lg border"
      >
        <AccordionItem value="secondary">
          <AccordionTrigger className="px-4">Secondary Colors</AccordionTrigger>
          <AccordionContent className="px-4 space-y-4">
            <Controller
              control={form.control}
              name="secondary"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Secondary</FieldLabel>
                  <ColorInput name="secondary" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="secondaryForeground"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Secondary Foreground
                  </FieldLabel>
                  <ColorInput name="secondaryForeground" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full rounded-lg border">
        <AccordionItem value="accent">
          <AccordionTrigger className="px-4">Accent Colors</AccordionTrigger>
          <AccordionContent className="px-4 space-y-4">
            <Controller
              control={form.control}
              name="accent"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Accent</FieldLabel>
                  <ColorInput name="accent" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="accentForeground"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Foreground</FieldLabel>
                  <ColorInput name="accentForeground" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full rounded-lg border">
        <AccordionItem value="base">
          <AccordionTrigger className="px-4">Base Colors</AccordionTrigger>
          <AccordionContent className="px-4 space-y-4">
            <Controller
              control={form.control}
              name="background"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Background</FieldLabel>
                  <ColorInput name="background" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="foreground"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Foreground</FieldLabel>
                  <ColorInput name="foreground" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Controller
        control={form.control}
        name="destructive"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Error</FieldLabel>
            <ColorInput name="destructive" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-2 place-self-start">
        <Button type="submit">Apply</Button>
        <Button variant="outline" type="reset" onClick={() => form.reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}
