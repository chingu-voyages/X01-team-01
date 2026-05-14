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
    <div className="mt-6 p-4 border rounded bg-white space-y-4">
      <h3 className="font-semibold text-lg">Evaluation</h3>

      {/* Completeness */}
      <div>
        <p className="font-medium">Completeness</p>
        <p className="text-gray-700">{evaluation.completeness}</p>
      </div>

      {/* Format compliance */}
      <div>
        <p className="font-medium">Format compliance</p>
        <p className="text-gray-700">{evaluation.format_compliance}</p>
      </div>

      {/* Missing elements */}
      <div>
        <p className="font-medium">Missing elements</p>

        {evaluation.missing_elements.length > 0 ? (
          <ul className="list-disc ml-5 text-gray-700 space-y-2">
            {evaluation.missing_elements.map((item, idx) => (
              <li key={idx}>
                <p className="font-medium">
                  Requirement: {item.requirement}
                </p>
                <p className="text-sm text-gray-600">
                  {item.issue}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No gaps identified.</p>
        )}
      </div>

      {/* Follow-up */}
      {evaluation.suggested_follow_up && (
        <div className="pt-2 border-t">
          <p className="font-medium">Suggested follow-up</p>

          <p className="text-gray-700 mt-1">
            Ask Gemini: "{evaluation.suggested_follow_up}"
          </p>

          <Button
            variant="secondary"
            className="w-full md:w-full h-12 text-base font-bold relative overflow-hidden"
            onClick={() => onUseFollowUp(evaluation.suggested_follow_up!)}
          >
            Use follow-up
          </Button>
        </div>
      )}
    </div>
  );
}