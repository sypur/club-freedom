import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTestimonialSearchQuery } from "../hook";

type Props = {
  onSuccess?: () => void;
};

export default function AuthoutInput({ onSuccess }: Props) {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();
  const form = useForm({
    defaultValues: {
      author: searchQuery.author,
    },
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={form.handleSubmit(async (values) => {
        await setSearchQuery({ author: values.author });
        onSuccess?.();
      })}
    >
      <Controller
        control={form.control}
        name="author"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Author</FieldLabel>
            <Input {...field} id={field.name} placeholder="Author Name" />
          </Field>
        )}
      />
      <Button type="submit">Apply</Button>
    </form>
  );
}
