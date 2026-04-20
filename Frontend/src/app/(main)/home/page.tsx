"use client";
import FormSection from "@/components/FormSection";
import ResultSkeleton from "@/components/ResultSkeleton";
// import ResponseCard from "@/components/ResponseCard";
import SubmitButton from "@/components/SubmitButton";
import ReactMarkdown from "react-markdown";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import ScorePromptSection from "@/components/ScorePromptSection";
import EvaluateAiResponse from "@/components/EvaluateAiResponse";
import SavePrompt from "@/components/SavePropmt";

export interface FormValues {
  persona?: string | undefined;
  context?: string | undefined;
  task?: string | undefined;
  output?: string | undefined;
  constraint?: string | undefined;
}

export default function Home() {
  // const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    resetField,
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

  const formValues: FormValues = useWatch({ control });

  async function onSubmit(data: Record<FieldId, string>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // add moe time to test local ai if need it.

    const prompt = `
    Persona: ${data.persona}
    Context: ${data.context}
    Task: ${data.task}
    Output: ${data.output}
    Constraint: ${data.constraint}
  `;

    try {
      console.log("Sending prompt to API:", prompt);
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error("Server error. Please try again.");
      }

      const result = await res.json();
      setResult(result.text);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="container  section-padding">
        <div className="mb-10 text-center">
          <h1 className="mb-2 tracking-tighter leading-tight font-medium">
            AI Helper
          </h1>
          <h2 className="mb-2 tracking-tighter font-light">
            Sculpt your intent into editorial-grade prompts using the Pentagram
            framework.
          </h2>
          <h3 className="tracking-tighter font-light">
            Precision architecture for advanced reasoning.
          </h3>
        </div>
        <FormSection
          control={control}
          resetField={resetField}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
        <ScorePromptSection formValues={formValues} />
        <SubmitButton isValid={isValid} isLoading={isLoading} />
        {/* maybe add all this inside Response card ? */}
        {isLoading && (
          <>
            <ResultSkeleton />
          </>
        )}
        {!isLoading && result && (
          <div className="mt-6 p-4 border rounded bg-white prose">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        )}
        {!isLoading && error && (
          <div className="mt-6 p-4 border rounded bg-red-50 text-red-600">
            <p>{error}</p>
            <button
              onClick={handleSubmit(onSubmit)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !result && !error && (
          <div className="mt-6 text-gray-500 italic">
            Your generated response will appear here once you submit the form.
          </div>
        )}
        {/* maybe add all this inside Response card? */}
        {/* <ResponseCard /> */}
        <EvaluateAiResponse aiResponse={result || ""} />
        <SavePrompt prompt="pass the prompt" />
      </section>
    </>
  );
}
