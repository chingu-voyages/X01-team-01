import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";

export function PopOverInfoIcon() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent p-0">
          <InfoIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverDescription>
            US-006 — Per-field help text As Adaeze, a professional unfamiliar
            with the Pentagram methodology, I want to expand help text for each
            field individually so that I understand what to write without
            leaving the page or consulting external documentation
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
