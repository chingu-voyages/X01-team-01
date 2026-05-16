export interface Prompt {
  uid: string;
  date: string;
  prompt: string;
  persona: string;
  context: string;
  task: string;
  constraints: string;
  output: string;
  rating: number;
  words: number;
  score?: {
    clarity: number;
    guidance: number;
    overall: number;
    specificity: number;
  };
  isFavourite?: boolean;
}
