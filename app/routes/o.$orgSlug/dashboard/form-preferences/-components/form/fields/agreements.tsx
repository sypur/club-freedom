import { PlusIcon } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { defaultAgreement, type FormSchema } from "../schema";
import AgreementEditor from "./agreement-editor";

export default function AgreementsField() {
  const { control } = useFormContext<FormSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agreements",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((item, index) => (
        <Controller
          key={item.id}
          control={control}
          name={`agreements.${index}.value`}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <AgreementEditor
                markdown={field.value}
                onMarkdownChange={field.onChange}
                onDelete={
                  fields.length > 1
                    ? () => {
                        remove(index);
                      }
                    : undefined
                }
                hasError={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          )}
        />
      ))}
      {fields.length < 3 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ value: defaultAgreement })}
          className="border-dashed"
        >
          <PlusIcon /> Add agreement
        </Button>
      )}
    </div>
  );
}
