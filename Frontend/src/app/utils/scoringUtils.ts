import { ScoringResponse } from "@/lib/mockScoringData";

export const shouldShowSuggestion = (data: ScoringResponse): boolean => {
  //Check global scores
  const hasLowGlobalScore = Object.values(data.global_scores).some(
    (score) => score <= 7,
  );

  //Check individual fields
  const hasLowFieldGrade = Object.values(data.field_grades).some(
    (score) => score <= 4,
  );

  //Either is true => show panel

  return hasLowGlobalScore || hasLowFieldGrade;
};
