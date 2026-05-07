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
}

export default function ComparisonModal({
  isModalOpen,
  onClose,
  suggestion,
}: ComparisonModalProps) {
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium mb-4">
              Review suggested change - {suggestion?.field}
            </DialogTitle>
            <DialogDescription className="text-xl mb-6">
              {suggestion?.explanation}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold uppercase">
                Your original text
              </h3>
              <div className="p-4 rounded-md border bg-muted/50 min-h-37.5">
                {suggestion?.original}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold uppercase">Suggestion</h3>
              <div className="p-4 rounded-md border bg-muted/50 min-h-37.5">
                {suggestion?.improved}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-around">
            <button onClick={() => onClose()} className="w-full md:w-auto px-4 py-2 border rounded-md">
              Keep original
            </button>
            <button className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md">
              Apply suggestion
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
