interface ScoringResponse {
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
}

export const shouldShowSuggestion = (data: ScoringResponse): boolean => {
  //Check global scores
  const hasLowOverall = data.overall <= 7;

  //Check individual fields
  const hasLowFieldGrade = Object.values(data.field_grades).some(
    (score) => score <= 4,
  );

  //Either is true => show panel

  return hasLowOverall || hasLowFieldGrade;
};
