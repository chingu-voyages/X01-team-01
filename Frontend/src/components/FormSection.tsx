import { FieldId, FIELDS } from "@/const/fields";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormResetField,
  useWatch,
} from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { PopOverInfoIcon } from "./PopOverInfoIcon";
import { RotateCcw } from "lucide-react";

type FormValues = Record<FieldId, string>;

interface FormSectionProps {
  control: Control<FormValues>;
  resetField: UseFormResetField<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
}

export default function FormSection({
  control,
  resetField,
  onSubmit,
  handleSubmit,
}: FormSectionProps) {
  const values = useWatch({ control });

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4"
      id="pentagram-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {FIELDS.map((field, id) => (
        <Card
          key={field.id}
          className={`  ${id === 2 ? "md:col-span-2 " : ""} bg-white rounded-xl shadow-sm border border-neutral-200 `}
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={field.id}
                  className="text-xs font-semibold mb-1 block  uppercase"
                >
                  {field.label}
                </Label>
                <PopOverInfoIcon />
              </div>

              <Button
                onClick={() => resetField(field.id)}
                disabled={!values[field.id]}
                variant="ghost"
                className="hover:bg-transparent"
              >
                <RotateCcw size={14} />
                <p className="text-xs">Reset</p>
              </Button>
            </div>

            <Controller
              name={field.id}
              control={control}
              rules={{ required: `${field.label} is required.` }}
              render={({ field: f, fieldState }) => (
                <>
                  <Textarea
                    {...f}
                    id={field.id}
                    placeholder={field.placeholder}
                    className="resize-none h-24 "
                    autoFocus={field.id === "persona"}
                    aria-invalid={fieldState.error ? true : false}
                  />

                  <p
                    className={` text-xs text-destructive mt-1 ${fieldState?.error ? "visible" : "invisible"} h-6 `}
                  >
                    {fieldState.error?.message}
                  </p>
                </>
              )}
            />
          </CardContent>
        </Card>
      ))}
    </form>
  );
}
