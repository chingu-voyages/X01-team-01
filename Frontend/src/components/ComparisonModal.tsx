import { Dialog } from "./ui/dialog";
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
    <>
      <Dialog></Dialog>
    </>
  );
}