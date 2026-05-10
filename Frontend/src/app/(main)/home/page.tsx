"use client";
import FormSection from "@/components/FormSection";
import ResultSkeleton from "@/components/ResultSkeleton";
import EvaluationSkeleton from "@/components/EvaluationSkeleton";
import EvaluationPanel from "@/components/EvaluationPanel";
// import ResponseCard from "@/components/ResponseCard";
import SubmitButton from "@/components/SubmitButton";
import ReactMarkdown from "react-markdown";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  ScoringResponse,
  shouldShowSuggestion,
} from "@/app/utils/scoringUtils";
import { Button } from "@/components/ui/button";
import { usePentagram } from "@/redux/hooks/usePentagram";
import ComparisonModal from "@/components/ComparisonModal";
import { toast } from "sonner";
import ApplySuggestionToast from "@/components/ui/ApplySuggestionToast";

export default function Home() {
  // const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScoredValues, setLastScoredValues] = useState<Record<
    FieldId,
    string
  > | null>(null);

  const { values, setFieldValue } = usePentagram();

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formValues = watch();

  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  //Check if the form is valid and Redux has values
  const isReduxValid = Object.values(values).every((val) => val.trim() !== "");
  const canSubmit = isValid && isReduxValid;

  //Needed for redux rehydration so EvaluationButton doesnt think prompt fields are empty when they arn'tw
      useEffect(() => {
      reset(values);
    }, [values, reset]);

  // Needed to check whether prompt is the same or has been changed
  const isSameAsLastScore =
    !!lastScoredValues &&
    (Object.keys(lastScoredValues) as FieldId[]).every(
      (key) => lastScoredValues[key] === formValues[key],
    );

  //Sends prompt to api
  async function onSubmit() {
    setIsLoading(true);
    setResult(null);
    setError(null);

    // --- DEMO MODE ---

    const isDemo =
      new URLSearchParams(window.location.search).get("demo") === "true";
    if (isDemo) {
      const manualPrompt = `Persona: ${values.persona}
    Context: ${values.context}
    Task: ${values.task}
    Output: ${values.output}
    Constraint: ${values.constraint}`;

      setResult(manualPrompt);

      setIsLoading(false);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000); // 50s timeout

    //Use usePentagram values
    const prompt = `
    Persona: ${values.persona}
    Context: ${values.context}
    Task: ${values.task}
    Output: ${values.output}
    Constraint: ${values.constraint}
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

  // fetches score from api
  async function onScore(formData: Record<FieldId, string>) {
    setIsScoring(true);
    setScores(null);
    setScoreError(null);

    // --- DEMO MODE --- for sprint demo in case API is down
    const isDemo =
      new URLSearchParams(window.location.search).get("demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockResult: ScoringResponse = {
        overall: 7,
        global_scores: {
          clarity: 8,
          specificity: 6,
          format_guidance: 9,
        },
        field_grades: {
          persona: 9,
          context: 8,
          task: 5, // Lower score to highlight the suggestion
          output: 8,
          constraint: 7,
        },
        weakest_field: "task",
        suggestion: {
          field: "task",
          original: formData.task || "Write a blog post about coffee.",
          improved:
            "Draft a 500-word educational blog post for home baristas focusing on the scientific benefits of manual pour-over brewing versus automatic drip machines.",
          explanation:
            "The current task is a bit vague. Specifying the target audience and the exact goal helps the AI generate more relevant content.",
        },
      };

      setScores(mockResult);
      setLastScoredValues({ ...formData });
      setIsScoring(false);
      return;
    }

    // --- END DEMO MODE ---

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

      const values = {
        persona: formData.persona,
        context: formData.context,
        task: formData.task,
        output: formData.output,
        constraint: formData.constraint,
      };

      setScores(result);
      setLastScoredValues(values);
      //setHasChangedSinceScore(false);
    } catch (err) {
      console.error("Scoring error:", err);
      setScoreError("Unable to score your prompt. Please try again.");
    } finally {
      setIsScoring(false);
    }
  }

  function getColor(score: number) {
    if (score <= 4) return "text-red-500";
    if (score <= 7) return "text-yellow-500";
    return "text-green-500";
  }

  const isRescoreDisabled = isScoring || isSameAsLastScore;

  async function onEvaluate(formData: Record<FieldId, string>) {
  // Guard against missing Gemini response
  if (!result) return;

  setIsEvaluating(true);
  setEvaluation(null);
  setEvaluationError(null);

  try {
    const res = await fetch("/api/evaluate", {
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
        response: result
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed: ${res.status} - ${text}`);
    }

    const resultData = await res.json();

    console.log("EVALUATE RESPONSE:", resultData);

    setEvaluation(resultData);
  } catch (err) {
    console.error("Evaluation error:", err);

    setEvaluationError(
      "Evaluation unavailable. Please try again."
    );
  } finally {
    setIsEvaluating(false);
  }
  }

  function handleUseFollowUp(followUp: string) {
    reset({
      ...watch(),
      task: followUp,
    });

    setFieldValue("task", followUp);

    // optional UX feedback (matches your existing pattern)
    alert("Task field updated with follow-up.");
  }


  function handleApplySuggestion(field: FieldId, newValue: string) {
    //capture 'original' value before changing it
    const oldValue = values[field];

    //UI and state update
    setValue(field as any, newValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setFieldValue(field as FieldId, newValue);

    //undo function
    function handleUndo() {
      //revert Hook Form and Redux to old value
      setValue(field as any, oldValue, { shouldDirty: true });
      setFieldValue(field, oldValue);
    }

    //close modal
    setIsModalOpen(false);

    //fire toast component
    toast.custom(
      (t) => <ApplySuggestionToast t={t} field={field} onUndo={handleUndo} />,
      {
        duration: 6000,
        position: "bottom-right",
      },
    );
  }

  //this is temporary, only for testing
  const testData = {
    persona: `You are a flamboyant and eccentric Professor of Moral Philosophy who treats every lecture as a theatrical performance, specializing in high-stakes ethical dilemmas.`,
    context: `you are talking to first-year university students of philosophy`,
    task: `Explain the classic trolley problem, specifically describing the scenario of a runaway trolley, the bystander's choice to pull a lever, and the moral trade-off between the lives of five workers versus one worker.`,
    output: `The output must be structured as a four-verse rap with a recurring two-line chorus. Each verse should cover a different aspect of the dilemma (the setup, the utilitarian choice, the deontological conflict, and the conclusion).`,
    constraint: `you can only talk like Moira Rose`,
  } as const;

  ///////////////////////////////////////////////////////////////////////////////
  const mockEvaluationResponse = `
    Authentication works by verifying a user's identity.

    Users log in with a username and password.
    The server checks credentials against a database.
    If valid, the user gains access.

    JWT tokens can also be used for session management.
    `;
//////////////////////////////////////////////////////////////////////////////////

  const handleFillTestData = () => {
    Object.entries(testData).forEach(([field, value]) => {
      setFieldValue(field as any, value);
    });

    reset(testData);
  };

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

        {/* only for testing */}
        <div className="flex gap-4">
          <button type="button" onClick={handleFillTestData}>
            test prompt
          </button>
        </div>

 {/* only for testing */}
        <button
          type="button"
          onClick={() => {
            handleFillTestData();

            setResult(mockEvaluationResponse);

            setScores(null);
            setEvaluation(null);
          }}
        >
          test evaluate
        </button>
         {/* only for testing */}

        <FormSection control={control} resetField={resetField} watch={watch} />

        <SubmitButton
          isValid={canSubmit}
          handleSubmit={handleSubmit}
          onSubmit={() => onSubmit()}
          isLoading={isLoading}
        />

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
              className="mt-3 px-4 py-2 rounded-md border border-red-300 bg-red-50 text-red-600 
                hover:bg-red-100 transition-all duration-150 active:scale-[0.98]"
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

        {result && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              className="w-full md:w-full h-12 text-base font-bold relative overflow-hidden"
              onClick={handleSubmit(onScore)}
              disabled={isRescoreDisabled}
            >
              {!scores
                ? "Score Prompt"
                : isSameAsLastScore
                  ? "Scored"
                  : "Re-score prompt"}
            </Button>
          </div>
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

            <p className="mt-2 font-semibold">Overall: {scores.overall}/10</p>

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
              className="mt-3 px-4 py-2 rounded-md border border-red-300 bg-red-50 text-red-600 
                hover:bg-red-100 transition-all duration-150 active:scale-[0.98]"
            >
              Retry
            </button>
          </div>
        )}

        {scores && (
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

                <div className="flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full md:w-full h-12 text-base font-bold"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Review Suggestion
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">
                No suggestion needed — prompt is strong enough.
              </p>
            )}
          </div>
        )}

        {result && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full md:w-full h-12 text-base font-bold relative overflow-hidden"
                    onClick={handleSubmit(onEvaluate)}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? "Evaluating..." : "Evaluate response"}
                  </Button>
                </div>
              )}

              <EvaluationPanel
                evaluation={evaluation}
                isEvaluating={isEvaluating}
                error={evaluationError}
                onRetry={handleSubmit(onEvaluate)}
                onUseFollowUp={handleUseFollowUp}
              />

        {isModalOpen && (
          <ComparisonModal
            isModalOpen={true}
            onClose={() => {
              setIsModalOpen(false);
            }}
            suggestion={scores?.suggestion || null}
            onApply={handleApplySuggestion}
          />
        )}
      </section>
    </>
  );
}
