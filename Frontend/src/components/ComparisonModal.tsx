import { FieldId } from "@/const/fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScoringResponse } from "@/app/utils/scoringUtils";

interface ComparisonModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  suggestion: ScoringResponse["suggestion"];
  onApply: (field: FieldId, value: string) => void;
}

export default function ComparisonModal({
  isModalOpen,
  onClose,
  suggestion,
  onApply,
}: ComparisonModalProps) {
  function handleApplyClick() {
    if (suggestion?.field && suggestion?.improved) {
      onApply(suggestion.field, suggestion.improved);
    }
  }

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-2 pb-2">
            <DialogTitle className="text-2xl font-medium mb-4 uppercase italic text-slate-700">
              Review suggested change - {suggestion?.field}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {suggestion?.explanation}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm lg:text-base font-semibold uppercase text-slate-700">
                  Your original text
                </h3>
                <div className="p-4 rounded-md border bg-muted/50 min-h-32 text-sm lg:text-base">
                  {suggestion?.original}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm lg:text-base font-semibold uppercase text-slate-700">
                  Suggestion
                </h3>
                <div className="p-4 rounded-md border bg-muted/50 min-h-32 text-sm lg:text-base">
                  {suggestion?.improved}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 justify-around">
            <button
              onClick={() => onClose()}
              className="w-full md:w-auto px-4 py-2 border rounded-md"
            >
              Keep original
            </button>
            <button
              onClick={handleApplyClick}
              className="w-full md:w-auto px-4 py-2 bg-slate-500 text-white rounded-md"
            >
              Apply suggestion
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
