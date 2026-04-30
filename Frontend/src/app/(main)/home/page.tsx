"use client";
import FormSection from "@/components/FormSection";
import ResultSkeleton from "@/components/ResultSkeleton";
// import ResponseCard from "@/components/ResponseCard";
import SubmitButton from "@/components/SubmitButton";
import ReactMarkdown from "react-markdown";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function Home() {
  // const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
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

  //scoring logic
  const [scores, setScores] = useState<{
    global_scores: {
      clarity: number;
      specificity: number;
      format_guidance: number;
    };
    overall: number;
    field_grades: {
      persona: number;
      context: number;
      task: number;
      output: number;
      constraint: number;
    };
    weakest_field: "persona" | "context" | "task" | "output" | "constraint";
    suggestion: {
      field: "persona" | "context" | "task" | "output" | "constraint";
      original: string;
      improved: string;
      explanation: string;
    } | null;
  } | null>(null);

  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  const formValues = watch();

useEffect(() => {
  setScores(null);
  setScoreError(null);
}, [
  formValues.persona,
  formValues.context,
  formValues.task,
  formValues.output,
  formValues.constraint
]);

//

  async function onSubmit(data: Record<FieldId, string>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000); // 50s timeout

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

  async function onScore(formData: Record<FieldId, string>) {
  setIsScoring(true);
  setScores(null);
  setScoreError(null);

  try {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        persona: formData.persona,
        context: formData.context,
        task: formData.task,
        output: formData.output,
        constraint: formData.constraint,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed: ${res.status} - ${text}`);
    }

    const result = await res.json();
    console.log("SCORE RESPONSE:", result);
    setScores(result);
  } catch (err) {
    console.error("Scoring error:", err);
    setScoreError("Unable to score your prompt. Please try again.");
  } finally {
    setIsScoring(false);
  }
}

/*async function onScore(formData: Record<FieldId, string>) {
  setIsScoring(true);
  setScores(null);
  setScoreError(null);

  const prompt = `
    Persona: ${formData.persona}
    Context: ${formData.context}
    Task: ${formData.task}
    Output: ${formData.output}
    Constraint: ${formData.constraint}
  `;

  try {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed: ${res.status} - ${text}`);
    }

    const result = await res.json();
    console.log("SCORE RESPONSE:", result);
    setScores(result);
  } catch (err) {
    console.error("Scoring error:", err);
    setScoreError("Unable to score your prompt. Please try again.");
  } finally {
    setIsScoring(false);
  }
}*/

function getColor(score: number) {
  if (score <= 4) return "text-red-500";
  if (score <= 7) return "text-yellow-500";
  return "text-green-500";
}

function parsePrompt(prompt: string) {
  const get = (label: string) => {
    const match = prompt.match(
      new RegExp(`${label}:([\\s\\S]*?)(?=\\n\\w+:|$)`)
    );
    return match ? match[1].trim() : "";
  };

  return {
    persona: get("Persona"),
    context: get("Context"),
    task: get("Task"),
    output: get("Output"),
    constraint: get("Constraint"),
  };
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

        <FormSection control={control} resetField={resetField} watch={watch} />

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

        <SubmitButton
          isValid={isValid}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        {/*<ResponseCard />*/}

        {result && (
          <button
            onClick={handleSubmit(onScore)}
            disabled={isScoring}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            {scores ? "Re-score prompt" : "Score Prompt"}
          </button>
        )}

        {isScoring && <ResultSkeleton />}

        {scores && !isScoring && (
          <div className="mt-6 p-4 border rounded bg-white">
            <p className={getColor(scores.global_scores.clarity)}>
              Clarity: {scores.global_scores.clarity}/10
            </p>

            <p className={getColor(scores.global_scores.specificity)}>
              Specificity: {scores.global_scores.specificity}/10
            </p>

            <p className={getColor(scores.global_scores.format_guidance)}>
              Format Guidance: {scores.global_scores.format_guidance}/10
            </p>

            <p className="mt-2 font-semibold">
              Overall: {scores.overall}/10
            </p>

            <p className="mt-2 text-gray-600">
              Weakest field: {scores.weakest_field}
            </p>
          </div>
        )}

        {scoreError && !isScoring && (
          <div className="mt-6 p-4 border rounded bg-red-50 text-red-600">
            <p>{scoreError}</p>
            <button
              onClick={handleSubmit(onScore)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}

        {scores && !isScoring && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Suggested improvement</h3>

            {scores.suggestion ? (
              <>
                <div className="p-3 bg-white border rounded mb-3 whitespace-pre-wrap">
                  {scores.suggestion.improved}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {scores.suggestion.explanation}
                </p>

                <button
                  onClick={() => {
                   reset({
                      ...watch(),
                      [scores.suggestion!.field]: scores.suggestion!.improved,
                    });
                    alert("Prompt updated.");
                  }}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Use This Prompt
                </button>
              </>
            ) : (
              <p className="text-gray-500 italic">
                No suggestion needed — prompt is strong enough.
              </p>
            )}
          </div>
        )}

      </section>
    </>
  );
}
