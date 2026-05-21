"use client";

import { Button } from "@/components/ui/button";
import EvaluationSkeleton from "./EvaluationSkeleton";

type Evaluation = {
  completeness: "Fully answered" | "Partially answered" | "Did not answer";
  format_compliance: string;

  missing_elements: {
    requirement: string;
    issue: string;
  }[];

  suggested_follow_up: string | null;
};

interface Props {
  evaluation: Evaluation | null;
  isEvaluating: boolean;
  error: string | null;
  onRetry: () => void;
  onUseFollowUp: (followUp: string) => void;
}

export default function EvaluationPanel({
  evaluation,
  isEvaluating,
  error,
  onRetry,
  onUseFollowUp,
}: Props) {
  if (isEvaluating) {
    return <EvaluationSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-6 p-4 border rounded bg-red-50 text-red-600">
        <p>{error}</p>

        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 rounded-md border border-red-300 bg-red-50 text-red-600 
          hover:bg-red-100 transition-all duration-150 active:scale-[0.98]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!evaluation) return null;

  return (
    <div className="mt-6 p-6 border-l-4 border-primary rounded-xl shadow-sm bg-secondary/50 space-y-6">
      {/* Card header */}
      <div className="flex items-center justify-between pb-2 border-b border-primary/40">
        <h3 className="font-semibold text-xl tracking-tight text-gray-900">
          Evaluation Analysis
        </h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-gray-800">
          Review Overview
        </span>
      </div>

      {/* Completeness and complience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-gray-600 mb-1">
            Completeness
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {evaluation.completeness}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-gray-600 mb-1">
            Format compliance
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {evaluation.format_compliance}
          </p>
        </div>
      </div>

      {/* Missing elements */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
          Identified Gaps
        </h4>

        {evaluation.missing_elements.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2">
            {evaluation.missing_elements.map((item, idx) => (
              <li
                key={idx}
                className="p-4 rounded-xl border-l-4 border-destructive bg-destructive/5 flex flex-col gap-1 shadow-xs"
              >
                <p className="font-semibold text-sm text-destructive-foreground">
                  Requirement: {item.requirement}
                </p>
                <p className="text-sm text-gray-600 leading-normal">
                  {item.issue}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
            <p className="text-sm text-emerald-800 font-medium flex justify-center items-center gap-1.5">
              ✨ All requirements met! No gaps identified.
            </p>
          </div>
        )}
      </div>

      {/* Follow-up */}
      {evaluation.suggested_follow_up && (
        <div className="pt-5 border-t border-gray-100 space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Suggested Follow-up
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Run this prompt with Gemini to patch the identified missing areas.
            </p>
          </div>

          <div className="p-4 bg-secondary border border-gray-400/60 rounded-xl relative group">
            <p className="text-sm font-mono text-gray-800 leading-relaxed select-all">
              "{evaluation.suggested_follow_up}"
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="secondary"
              className="w-full md:w-2xl h-12 text-base font-semibold shadow-sm hover:bg-secondary/80 transition-colors"
              onClick={() => onUseFollowUp(evaluation.suggested_follow_up!)}
            >
              Use Follow-up Prompt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
