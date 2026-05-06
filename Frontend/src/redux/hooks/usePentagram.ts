import { useAppDispatch, useAppSelector } from "../hooks";
import { updateField, resetForm, FieldId } from "../features/pentagramSlice";

export const usePentagram = () => {
  const dispatch = useAppDispatch();

  //Grab all values
  const values = useAppSelector((state) => state.pentagram);

  //Helper to update a field
  const setFieldValue = (id: FieldId, value: string) => {
    dispatch(updateField({ id, value }));
  };

  //Helper to reset
  const clearAll = () => {
    dispatch(resetForm());
  };

  return {
    values,
    setFieldValue,
    clearAll,
  };
};
