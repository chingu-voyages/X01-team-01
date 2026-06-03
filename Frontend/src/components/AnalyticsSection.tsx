import AnalyticsCard from "./AnalyticsCard";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAppSelector } from "@/redux/hooks";

export default function AnalyticsSection() {
  //default is open as requested by PO
  const [isOpen, setIsOpen] = useState(true);
  //track whether localStorage was read - to prevent layout shift
  const [hasMounted, setHasMounted] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;

      try {
        const ref = doc(db, "analytics", user.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setAnalytics(snap.data());
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  const successRate =
    analytics?.total_requests
      ? (analytics.successful_requests / analytics.total_requests) * 100
      : 0;

  const avgResponseTime =
    analytics?.total_requests
      ? analytics.total_response_time_ms / analytics.total_requests / 1000
      : 0;

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
              value={analytics ? Number(successRate.toFixed(1)) : 0}
              suffix="%"
              hasData={!!analytics}
            />

            <AnalyticsCard
              title="Average response time"
              value={analytics ? Number(avgResponseTime.toFixed(2)) : 0}
              suffix="s"
              hasData={!!analytics}
            />

            <AnalyticsCard
              title="Prompts built"
              value={analytics?.total_requests || 0}
              hasData={!!analytics}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
