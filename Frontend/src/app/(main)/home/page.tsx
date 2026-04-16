"use client";
import FormSection from "@/components/FormSection";
import ProgressLoader from "@/components/ProgressLoader";
import SubmitButton from "@/components/SubmitButton";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Home() {
  // const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    resetField,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      persona: "",
      context: "",
      task: "",
      output: "",
      constraint: "",
    },
  });

  async function onSubmit(data: Record<FieldId, string>) {
  setIsLoading(true);

  const prompt = `
    Persona: ${data.persona}
    Context: ${data.context}
    Task: ${data.task}
    Output: ${data.output}
    Constraint: ${data.constraint}
  `;

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await res.json();

    console.log("Gemini response:", result.text);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
      <section className="container  section-padding">
        <FormSection control={control} resetField={resetField} watch={watch} />
        <ProgressLoader />
        <SubmitButton
          isValid={isValid}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </section>
    </>
  );
}
