export type FieldId = "persona" | "context" | "task" | "output" | "constraint";

interface PentagramData {
  persona: string;
  context: string;
  task: string;
  output: string;
  constraint: string;
}

interface PengtagramContextType {
  values: PentagramData;
  updateField: (id: FieldId, value: string) => void;
  resetForm: () => void;
}
