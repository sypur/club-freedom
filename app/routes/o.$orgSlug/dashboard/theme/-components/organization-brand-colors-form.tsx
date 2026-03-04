import { Controller, useForm } from "react-hook-form";
import z from "zod";
import HexColorPicker from "@/components/hex-color-picker";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const brandingColorSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

type BrandingColors = z.infer<typeof brandingColorSchema>;

export default function OrganizationBrandColorsForm() {
  const form = useForm<BrandingColors>({
    defaultValues: {
      primaryColor: "#000000",
      secondaryColor: "#000000",
    },
  });

  const onSubmit = form.handleSubmit(async (brand) => {
    console.log(brand);
  });

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <Controller
        control={form.control}
        name="primaryColor"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Primary color</FieldLabel>
            <HexColorPicker
              value={field.value}
              onValueChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="secondaryColor"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Secondary color</FieldLabel>
            <HexColorPicker
              value={field.value}
              onValueChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="place-self-start">
        Apply
      </Button>
    </form>
  );
}
