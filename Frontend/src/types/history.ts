export interface Prompt {
  uid: string;

  user_id?: string;

  created_at: any;
  updated_at: any;

  title: string;

  fields: {
    persona: string;
    context: string;
    task: string;
    output: string;
    constraint: string;
  };

  score: {
    clarity: number | null;
    specificity: number | null;
    format_guidance: number | null;
    overall: number | null;
  };

  gemini_result: string;

  favorite: boolean;

  words: number;

  current_doc?: boolean;
}