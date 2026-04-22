import { HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { FieldId } from "@/const/fields";

interface HelpButtonProps {
  fieldId: FieldId;
  openHelpId: FieldId | null;
  setOpenHelpId: (id: FieldId | null) => void;
}

export default function HelpButton({
  fieldId,
  openHelpId,
  setOpenHelpId,
}: HelpButtonProps) {
  return (
    <Button
      variant="ghost"
      className="hover:bg-transparent p-0"
      type="button"
      onClick={() => setOpenHelpId(openHelpId === fieldId ? null : fieldId)}
    >
      <HelpCircle size={14} />
    </Button>
  );
}
