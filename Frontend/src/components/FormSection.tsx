"use client";
import { FieldId, FIELDS } from "@/const/fields";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import {
  Control,
  Controller,
  UseFormResetField,
  UseFormWatch,
} from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { HelpMessage } from "./HelpMessage";
import HelpButton from "./HelpButton";

type FormValues = Record<FieldId, string>;

interface FormSectionProps {
  control: Control<FormValues>;
  resetField: UseFormResetField<FormValues>;
  watch: UseFormWatch<FormValues>;
}

export default function FormSection({
  control,
  resetField,
  watch,
}: FormSectionProps) {
  const [openHelpId, setOpenHelpId] = useState<FieldId | null>(null);

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4">
      {FIELDS.map((field, index) => (
        <Card
          key={field.id}
          className={`${index === 2 ? "md:col-span-2 " : ""} bg-white rounded-xl shadow-sm border border-neutral-200`}
        >
          <CardContent className="mt-8 md:mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 justify-center">
                <Label
                  htmlFor={field.id}
                  className="text-xs font-semibold mb-1 block  uppercase"
                >
                  {field.label}
                </Label>
                <HelpButton
                  fieldId={field.id}
                  openHelpId={openHelpId}
                  setOpenHelpId={setOpenHelpId}
                />
              </div>
              <Button
                onClick={() => resetField(field.id)}
                disabled={watch(field.id) === ""}
                variant="ghost"
                className="hover:bg-transparent"
              >
                <RotateCcw size={14} />
                <span className="text-xs">Reset</span>
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
                    className="resize-none h-28"
                    aria-invalid={fieldState.error ? true : false}
                  />

                  <p
                    className={` text-xs text-destructive  ${fieldState?.error ? "visible" : "invisible"} h-6`}
                  >
                    {fieldState.error?.message}
                  </p>
                </>
              )}
            />
            <HelpMessage
              helpText={field.help}
              isHelpVisible={openHelpId === field.id}
            />
          </CardContent>
        </Card>
      ))}
    </form>
  );
}
