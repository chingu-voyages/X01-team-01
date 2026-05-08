import { toast } from "sonner";
import { type FieldId } from "@/const/fields";

interface ApplySuggestionToastProps {
  t: string | number;
  field: FieldId;
  onUndo: () => void;
}

export default function ApplySuggestionToast({
  t,
  field,
  onUndo,
}: ApplySuggestionToastProps) {
  return (
    <div className="flex w-95 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Prompt updated</h3>
        <p className="mt-1 text-sm text-slate-500 leading-relaxed">
          The{" "}
          <span className="font-bold text-slate-700 capitalize">{field}</span>{" "}
          field has been replaced.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
        <button
          onClick={() => toast.dismiss(t)}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t);
          }}
          className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-gray-400 active:scale-95 transition-all"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
