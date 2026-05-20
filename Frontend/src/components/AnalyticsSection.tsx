import AnalyticsCard from "./AnalyticsCard";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export default function AnalyticsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`flex flex-col gap-2 transition-all duration-100 ${isOpen ? `mb-10 bg-linear-to-br from-gray-50 to-emerald-200/50 p-4 rounded-2xl shadow-md` : `mb-4`}`}
      >
        <header
          className={`pl-6 flex justify-center gap-1 ${isOpen ? `mb-4` : `mb-0`}`}
        >
          <h1
            className={` text-center tracking-tighter font-light transition-all duration-100 ${isOpen ? `text-3xl sm:text-4xl` : `text-black/50 text-2xl`}`}
          >
            Session Analytics
          </h1>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`self-center ${isOpen ? `size-8` : `size-4 text-black/50`}`}
            >
              <ChevronsUpDown />
              <span className="sr-only">Toggle for session analytics</span>
            </Button>
          </CollapsibleTrigger>
        </header>

        <CollapsibleContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <AnalyticsCard
              title="Gemini success rate"
              value={96}
              suffix="%"
              hasData
            />
            <AnalyticsCard
              title="Average response time"
              value={9.7}
              suffix="seconds"
              hasData
            />
            <AnalyticsCard title="Prompts built" value={381} hasData={false} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
