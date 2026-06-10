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
import { usePentagram } from "@/redux/hooks/usePentagram";

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

  const { values, setFieldValue } = usePentagram();

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-linear-to-b from-gray-100 to-primary border-l border-r border-primary/20 shadow-xs mt-2">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {FIELDS.map((field, index) => {
          const hasValue = values[field.id] !== "";

          return (
            <Card
              key={field.id}
              className={`${
                index === 2 ? "md:col-span-2 " : ""
              } bg-white/45 backdrop-blur-md rounded-xl shadow-xs border border-white-40 transition-all duration-200 relative overflow-hidden ${
                hasValue
                  ? "border-primary/30 shadow-xs"
                  : "hover:border-gray-300"
              }`}
            >
              <CardContent className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={field.id}
                      className="text-xs font-bold  block  uppercase tracking-wider text-gray-700"
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
                    onClick={() => {
                      setFieldValue(field.id, "");
                      resetField(field.id, { defaultValue: "" });
                    }}
                    disabled={values[field.id] === ""}
                    variant="ghost"
                    className="h-7 px-2 hover:bg-gray-300 text-gray-600 disabled:opacity-30 hover:text-gray-600 transition-colors gap-1 rounded-md"
                  >
                    <RotateCcw size={14} />
                    <span className="text-xs font-medium">Reset</span>
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
                        value={values[field.id]}
                        onChange={(e) => {
                          f.onChange(e);
                          setFieldValue(field.id, e.target.value);
                        }}
                        id={field.id}
                        placeholder={field.placeholder}
                        className="resize-none h-28 bg-white border border-gray-200 shadow-inner rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-gray-400 text-gray-800 leading-relaxed font-sans"
                        aria-invalid={fieldState.error ? true : false}
                      />

                      <p
                        className={`text-xs font-medium text-destructive transition-all ${
                          fieldState?.error
                            ? "opacity-100 mt-1"
                            : "opacity-0 h-0 overflow-hidden"
                        }`}
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
          );
        })}
      </form>
    </div>
  );
}
