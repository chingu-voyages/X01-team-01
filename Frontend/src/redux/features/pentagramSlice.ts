import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FieldId = "persona" | "context" | "task" | "output" | "constraint";

interface PentagramState {
  persona: string;
  context: string;
  task: string;
  output: string;
  constraint: string;
}

const initialState: PentagramState = {
  persona: "",
  context: "",
  task: "",
  output: "",
  constraint: "",
};

export const pentagramSlice = createSlice({
  name: "pentagram",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ id: FieldId; value: string }>,
    ) => {
      const { id, value } = action.payload;
      state[id] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = pentagramSlice.actions;

export default pentagramSlice.reducer;