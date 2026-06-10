import { FieldId } from "@/const/fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScoringResponse } from "@/app/utils/scoringUtils";
import { Button } from "./ui/button";

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
        <DialogContent className="max-w-[90vw] md:max-w-2xl p-0 rounded-2xl overflow-hidden gap-0">
          {/* header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-md">
                  {suggestion?.field}
                </span>
                <span className="text-sm text-gray-400">Suggested Change</span>
              </div>
            </div>
            <DialogDescription className="text-sm text-gray-500 leading-relaxed">
              {suggestion?.explanation}
            </DialogDescription>
          </div>

          {/* comparison grid */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* original */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                  Original
                </span>
              </div>
              <div className="flex-1 p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500 leading-relaxed">
                {suggestion?.original}
              </div>
            </div>

            {/* suggestion */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium tracking-widest uppercase text-primary">
                  Suggestion
                </span>
              </div>
              <div className="flex-1 p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-gray-900 leading-relaxed">
                {suggestion?.improved}
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="px-5 pb-5 pt-1 flex justify-around gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 text-sm font-medium rounded-xl"
            >
              Keep original
            </Button>
            <Button
              variant="default"
              onClick={handleApplyClick}
              className="h-9 px-4 text-sm font-medium rounded-xl"
            >
              Apply suggestion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
