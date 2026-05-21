import AnalyticsCard from "./AnalyticsCard";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

export default function AnalyticsSection() {
  //default is open as requested by PO
  const [isOpen, setIsOpen] = useState(true);
  //track whether localStorage was read - to prevent layout shift
  const [hasMounted, setHasMounted] = useState(false);

  //check if there is a user preference
  useEffect(() => {
    const savedState = localStorage.getItem("analytics_section_open");
    if (savedState !== null) {
      setIsOpen(savedState === "true");
    }

    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  //save any changes
  function handleOpenChange(nextState: boolean) {
    setIsOpen(nextState);
    localStorage.setItem("analytics_section_open", String(nextState));
  }

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={`flex flex-col gap-2 mt-4 
          ${hasMounted ? "transition-all duration-100" : ""} 
          ${isOpen ? `mb-10 bg-linear-to-br from-gray-50 to-primary/50 p-4 rounded-2xl shadow-md` : `mb-4`}`}
      >
        <header
          className={`pl-6 flex justify-center gap-1 
            ${isOpen ? `mb-4` : `mb-0`}`}
        >
          <h1
            className={`text-center tracking-tighter font-light 
              ${hasMounted ? "transition-all duration-100" : ""} 
              ${isOpen ? `text-3xl sm:text-4xl` : `text-black/50 text-2xl`}`}
          >
            Session Analytics
          </h1>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`self-center 
                ${hasMounted ? "transition-all duration-100" : ""} 
                ${(hasMounted && isOpen) ? `text-black` : `text-black/50`}`}
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
