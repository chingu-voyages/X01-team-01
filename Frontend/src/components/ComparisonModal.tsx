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
        <DialogContent className="max-w-[90vw] md:max-w-3xl flex flex-col max-h-[90vh] p-6 rounded-xl">

          {/* header */}
          <DialogHeader className="p-4 border-b border-primary/20">
            <DialogTitle className="text-xl md:text-2xl font-semibold tracking-tight text-center md:text-left mb-4 uppercase text-gray-900">
              Review suggested change  <span className="text-primary italic">- {suggestion?.field}</span> 
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg leading-snug sm:leading-relaxed text-gray-600 text-center md:text-left">
              {suggestion?.explanation}
            </DialogDescription>
          </DialogHeader>

          {/* comparison grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* original text */}
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                  Your original text
                </h3>
                <div className="h-full p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-sm md:text-base text-gray-700 sm:leading-relaxed">
                  {suggestion?.original}
                </div>
              </div>

              {/* suggestion text */}
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm lg:text-base font-semibold uppercase tracking-wider text-primary">
                  Suggestion
                </h3>
                <div className="h-full p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm lg:text-base text-gray-900 leading-relaxed">
                  {suggestion?.improved}
                </div>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-col md:flex-row gap-2 justify-around pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => onClose()}
              className="w-full md:w-auto px-5 h-11 rounded-xl text-sm font-semibold"
            >
              Keep original
            </Button>
            <Button
              variant="default"
              onClick={handleApplyClick}
              className="w-full md:w-auto px-5 h-11 rounded-xl text-sm font-semibold shadow-sm"
            >
              Apply suggestion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
