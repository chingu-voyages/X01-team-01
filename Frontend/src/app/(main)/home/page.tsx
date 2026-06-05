"use client";
import FormSection from "@/components/FormSection";
import ResultSkeleton from "@/components/ResultSkeleton";
import EvaluationPanel from "@/components/EvaluationPanel";
// import ResponseCard from "@/components/ResponseCard";
import SubmitButton from "@/components/SubmitButton";
import ComparisonModal from "@/components/ComparisonModal";
import ApplySuggestionToast from "@/components/ui/ApplySuggestionToast";
import { Button } from "@/components/ui/button";
import {
  ScoringResponse,
  shouldShowSuggestion,
} from "@/app/utils/scoringUtils";
import ReactMarkdown from "react-markdown";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { usePentagram } from "@/redux/hooks/usePentagram";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import Link from "next/link";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  limit,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import HeaderSection from "@/components/HeaderSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScoredValues, setLastScoredValues] = useState<Record<
    FieldId,
    string
  > | null>(null);

  const { values, setFieldValue } = usePentagram();

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      persona: "",
      context: "",
      task: "",
      output: "",
      constraint: "",
    },
  });

  //firestore
  const user = useAppSelector((state) => state.auth.user);

  const promptsCollection = collection(db, "prompts");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  const [draftReady, setDraftReady] = useState(false);

  const hasInitializedRef = useRef(false);

  const [saveError, setSaveError] = useState<string | null>(null);

  const [hasAssembled, setHasAssembled] = useState(false);

  //current user status
  const status = useAppSelector((state) => state.auth.status);

  const isGuest = status === "guest";

  //fire toast for guest users
  useEffect(() => {
    if (status === "guest") {
      toast.warning("You are logged in as a guest", {
        id: "guest-mode-warning",
        description: (
          <span>
            <Link
              href="/login"
              className="underline font-semibold hover:text-white transition-colors"
            >
              Sign in
            </Link>{" "}
            to save your prompts to history.
          </span>
        ),
        duration: 8000,
        style: {
          background: "#808080",
        },
      });
    }
  }, [status]);

  //scoring logic
  const [scores, setScores] = useState<{
    global_scores: {
      clarity: number;
      specificity: number;
      format_guidance: number;
    };
    overall: number;
    field_grades: {
      persona: number;
      context: number;
      task: number;
      output: number;
      constraint: number;
    };
    weakest_field: "persona" | "context" | "task" | "output" | "constraint";
    suggestion: {
      field: "persona" | "context" | "task" | "output" | "constraint";
      original: string;
      improved: string;
      explanation: string;
    } | null;
  } | null>(null);

  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formValues = watch();

  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  //checks if info is valid
  const canSubmit = isValid;

  const [hasHydrated, setHasHydrated] = useState(false);

  const PENTAGRAM_STORAGE_KEY = "pentagram_form";

  //Needed for redux rehydration so EvaluationButton doesnt think prompt fields are empty when they arn'tw
  useEffect(() => {
    if (!user) return; // IMPORTANT: don't load drafts without a user

    const saved = localStorage.getItem(PENTAGRAM_STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      reset(parsed);
      persistFormToRedux(parsed);

      setResult(parsed.gemini_result || null);
    }

    setHasHydrated(true);
  }, [reset, user]);

  //Helper function that centralizes redux writes so redux is updated on save only
  function persistFormToRedux(formData: Record<FieldId, string>) {
    Object.entries(formData).forEach(([field, value]) => {
      setFieldValue(field as FieldId, value);
    });
  }

  // Needed to check whether prompt is the same or has been changed
  const isSameAsLastScore =
    !!lastScoredValues &&
    (Object.keys(lastScoredValues) as FieldId[]).every(
      (key) => lastScoredValues[key] === formValues[key],
    );

  //watches for any changes in the 5 promptfields so that it can reset any active panels
  const watchedPersona = watch("persona");
  const watchedContext = watch("context");
  const watchedTask = watch("task");
  const watchedOutput = watch("output");
  const watchedConstraint = watch("constraint");

  useEffect(() => {
    if (!result && !scores && !evaluation) return;

    resetAnalysisPanels();
  }, [
    watchedPersona,
    watchedContext,
    watchedTask,
    watchedOutput,
    watchedConstraint,
  ]);

  //Sends prompt to api
  async function onSubmit(formData: Record<FieldId, string>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    resetAnalysisPanels(); // resets panels (score and evaluation panels etc..)

    persistFormToRedux(formData);

    //Logic-for-analytics
    const startTime = Date.now();

    async function markSuccess(durationMs: number) {
      if (!user) return;

      await updateDoc(doc(db, "analytics", user.id), {
        successful_requests: increment(1),
        total_requests: increment(1),
        total_response_time_ms: increment(durationMs),
        updated_at: serverTimestamp(),
      });
    }

    async function markFailure(durationMs: number) {
      if (!user) return;

      await updateDoc(doc(db, "analytics", user.id), {
        failed_requests: increment(1),
        total_requests: increment(1),
        total_response_time_ms: increment(durationMs),
        updated_at: serverTimestamp(),
      });
    }

    // --- DEMO MODE ---

    const isDemo =
      new URLSearchParams(window.location.search).get("demo") === "true";
    if (isDemo) {
      const manualPrompt = `Persona: ${formData.persona}
        Context: ${formData.context}
        Task: ${formData.task}
        Output: ${formData.output}
        Constraint: ${formData.constraint}`;

      setResult(manualPrompt);
      setIsLoading(false);

      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000); // 50s timeout

    //Use usePentagram values
    const prompt = `
      Persona: ${formData.persona}
      Context: ${formData.context}
      Task: ${formData.task}
      Output: ${formData.output}
      Constraint: ${formData.constraint}
      `;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error("Server error. Please try again.");
      }

      const result = await res.json();
      setResult(result.text);

      //Updates-analytics-on-success
      await markSuccess(Date.now() - startTime);

      if (currentDraftId) {
        await updateDoc(doc(db, "prompt_drafts", currentDraftId), {
          gemini_result: result.text,
          updated_at: serverTimestamp(),
        });
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;

      //Updates-analytics-on-fail
      try {
        await markFailure(duration);
      } catch (e) {
        console.error("Analytics failure tracking failed:", e);
      }

      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setHasAssembled(true);
      setIsLoading(false);
    }
  }

  // fetches score from api
  async function onScore(formData: Record<FieldId, string>) {
    setIsScoring(true);
    setScores(null);
    setScoreError(null);

    // --- DEMO MODE --- for sprint demo in case API is down
    const isDemo =
      new URLSearchParams(window.location.search).get("demo") === "true";

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockResult: ScoringResponse = {
        overall: 7,
        global_scores: {
          clarity: 8,
          specificity: 6,
          format_guidance: 9,
        },
        field_grades: {
          persona: 9,
          context: 8,
          task: 5, // Lower score to highlight the suggestion
          output: 8,
          constraint: 7,
        },
        weakest_field: "task",
        suggestion: {
          field: "task",
          original: formData.task || "Write a blog post about coffee.",
          improved:
            "Draft a 500-word educational blog post for home baristas focusing on the scientific benefits of manual pour-over brewing versus automatic drip machines.",
          explanation:
            "The current task is a bit vague. Specifying the target audience and the exact goal helps the AI generate more relevant content.",
        },
      };

      setScores(mockResult);
      setLastScoredValues({ ...formData });
      setIsScoring(false);
      return;
    }

    // --- END DEMO MODE ---

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: formData.persona,
          context: formData.context,
          task: formData.task,
          output: formData.output,
          constraint: formData.constraint,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }

      const result = await res.json();
      console.log("SCORE RESPONSE:", result);

      const values = {
        persona: formData.persona,
        context: formData.context,
        task: formData.task,
        output: formData.output,
        constraint: formData.constraint,
      };

      setScores(result);
      setLastScoredValues(values);
      //setHasChangedSinceScore(false);

      // 🔥 SAVE SCORES TO FIRESTORE HERE
      if (currentDraftId) {
        await updateDoc(doc(db, "prompt_drafts", currentDraftId), {
          score: {
            clarity: result.global_scores.clarity,
            specificity: result.global_scores.specificity,
            format_guidance: result.global_scores.format_guidance,
            overall: result.overall,
          },
          updated_at: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Scoring error:", err);
      setScoreError("Unable to score your prompt. Please try again.");
    } finally {
      setIsScoring(false);
    }
  }

  function getColor(score: number) {
    if (score <= 4) return "text-red-500";
    if (score <= 7) return "text-yellow-500";
    return "text-green-500";
  }

  const isRescoreDisabled = isScoring || isSameAsLastScore;

  async function onEvaluate(formData: Record<FieldId, string>) {
    // Guard against missing Gemini response
    if (!result) return;

    setIsEvaluating(true);
    setEvaluation(null);
    setEvaluationError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: formData.persona,
          context: formData.context,
          task: formData.task,
          output: formData.output,
          constraint: formData.constraint,
          response: result,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }

      const resultData = await res.json();

      console.log("EVALUATE RESPONSE:", resultData);

      setEvaluation(resultData);
    } catch (err) {
      console.error("Evaluation error:", err);

      setEvaluationError("Evaluation unavailable. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  }

  function handleUseFollowUp(followUp: string) {
    // update RHF only
    setValue("task", followUp, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // persist snapshot to Redux
    persistFormToRedux({
      ...watch(),
      task: followUp,
    });

    toast.success("Task field updated with follow-up.");
  }

  function handleApplySuggestion(field: FieldId, newValue: string) {
    //capture 'original' value before changing it
    const oldValue = watch(field);

    //UI and state update
    setValue(field as any, newValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
    //setFieldValue(field as FieldId, newValue);

    // persist checkpoint to Redux
    persistFormToRedux({
      ...watch(),
      [field]: newValue,
    });

    //undo function
    function handleUndo() {
      //revert Hook Form and Redux to old value
      setValue(field as any, oldValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      //setFieldValue(field, oldValue);
      persistFormToRedux({ ...watch(), [field]: oldValue });
    }

    //close modal
    setIsModalOpen(false);

    //fire toast component
    toast.custom(
      (t) => <ApplySuggestionToast t={t} field={field} onUndo={handleUndo} />,
      {
        duration: 6000,
        position: "bottom-right",
      },
    );
  }

  //this is temporary, only for testing
  const testData = {
    persona: `You are a flamboyant and eccentric Professor of Moral Philosophy who treats every lecture as a theatrical performance, specializing in high-stakes ethical dilemmas.`,
    context: `you are talking to first-year university students of philosophy`,
    task: `Explain the classic trolley problem, specifically describing the scenario of a runaway trolley, the bystander's choice to pull a lever, and the moral trade-off between the lives of five workers versus one worker.`,
    output: `The output must be structured as a four-verse rap with a recurring two-line chorus. Each verse should cover a different aspect of the dilemma (the setup, the utilitarian choice, the deontological conflict, and the conclusion).`,
    constraint: `you can only talk like Moira Rose`,
  } as const;

  // more temporary stuff ///////////////////////////////////////////////////////////////////////////////
  const mockEvaluationResponse = `
    Authentication works by verifying a user's identity.

    Users log in with a username and password.
    The server checks credentials against a database.
    If valid, the user gains access.

    JWT tokens can also be used for session management.
    `;
  //////////////////////////////////////////////////////////////////////////////////

  const handleFillTestData = () => {
    reset(testData);
    persistFormToRedux(testData);
  };

  //Helper function to delete panels on resubmitting a prompt or changing one of the 5 prompts
  function resetAnalysisPanels() {
    setScores(null);
    setEvaluation(null);
    setEvaluationError(null);
    setScoreError(null);
    setLastScoredValues(null);
  }

  //logic-for-checking-if-user-has-any-documents
  useEffect(() => {
    if (!user) return;

    async function initializeDraft() {
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;

      try {
        // ==========================
        // ANALYTICS INITIALIZATION
        // ==========================
        const analyticsRef = doc(db, "analytics", user!.id);

        const analyticsSnap = await getDoc(analyticsRef);

        if (!analyticsSnap.exists()) {
          await setDoc(analyticsRef, {
            user_id: user!.id,

            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),

            total_requests: 0,
            successful_requests: 0,
            failed_requests: 0,
            total_response_time_ms: 0,
          });
        }

        // ==========================
        // DRAFT INITIALIZATION
        // ==========================
        const q = query(
          collection(db, "prompt_drafts"),
          where("user_id", "==", user?.id),
          where("current_doc", "==", true),
          limit(1),
        );

        const snapshot = await getDocs(q);

        // USER HAS NO DRAFTS
        if (snapshot.empty) {
          const newDraft = await addDoc(collection(db, "prompt_drafts"), {
            user_id: user?.id,

            created_at: serverTimestamp(),

            updated_at: serverTimestamp(),

            title: "Untitled Prompt",

            fields: {
              persona: "",
              context: "",
              task: "",
              output: "",
              constraint: "",
            },

            score: {
              clarity: null,
              specificity: null,
              format_guidance: null,
              overall: null,
            },

            gemini_result: "",

            favorite: false,

            words: 0,

            current_doc: true,
          });

          await updateDoc(newDraft, {
            id: newDraft.id,
          });

          setCurrentDraftId(newDraft.id);
          setDraftReady(true);
        }

        // USER ALREADY HAS DRAFTS
        else {
          const existingDraft = snapshot.docs[0];

          setCurrentDraftId(existingDraft.id);
          setDraftReady(true);

          const data = existingDraft.data();

          if (data.fields) {
            reset(data.fields);
            persistFormToRedux(data.fields);
          }

          setResult(data.gemini_result || null);

          if (data.score?.overall != null) {
            setScores({
              global_scores: {
                clarity: data.score.clarity ?? 0,
                specificity: data.score.specificity ?? 0,
                format_guidance: data.score.format_guidance ?? 0,
              },
              overall: data.score.overall ?? 0,
              field_grades: {
                persona: 0,
                context: 0,
                task: 0,
                output: 0,
                constraint: 0,
              },
              weakest_field: "task",
              suggestion: null,
            });
          }
        }
      } catch (err) {
        console.error("Draft initialization failed:", err);

        setSaveError(
          "Your result is displayed but could not be saved. Please export or copy it now.",
        );
      }
    }

    initializeDraft();
  }, [user]);

  //firestore-document
  async function savePromptDraft(formData: Record<FieldId, string>) {
    if (!user || !currentDraftId) return;

    try {
      await setDoc(
        doc(db, "prompt_drafts", currentDraftId),
        {
          id: currentDraftId,

          user_id: user.id,

          title: formData.task || "Untitled Prompt",

          timestamp: serverTimestamp(),

          fields: {
            persona: formData.persona,
            context: formData.context,
            task: formData.task,
            output: formData.output,
            constraint: formData.constraint,
          },

          score: {
            clarity: scores?.global_scores?.clarity ?? null,
            specificity: scores?.global_scores?.specificity ?? null,
            format_guidance: scores?.global_scores?.format_guidance ?? null,
            overall: scores?.overall ?? null,
          },

          gemini_result: result || "",

          favorite: false,

          words: result ? result.trim().split(/\s+/).length : 0,

          current_doc: true,
        },
        { merge: true },
      );
    } catch (err) {
      console.error("Unable to save. Please try again. ", err);
    }
  }

  //resers-prompt-fields-on-new-user-login
  useEffect(() => {
    if (!user) {
      reset({
        persona: "",
        context: "",
        task: "",
        output: "",
        constraint: "",
      });

      localStorage.removeItem(PENTAGRAM_STORAGE_KEY);
    }
  }, [user]);

  function isEmptyPrompt(data: Record<FieldId, string>) {
    return Object.values(data).every((v) => !v || v.trim() === "");
  }

  //allows-for-automatic-saves
  useEffect(() => {
    if (!draftReady) return;
    if (!hasHydrated) return;
    if (!user || !currentDraftId) return;

    const data = {
      persona: watchedPersona,
      context: watchedContext,
      task: watchedTask,
      output: watchedOutput,
      constraint: watchedConstraint,
      gemini_result: result,
    };

    localStorage.setItem(PENTAGRAM_STORAGE_KEY, JSON.stringify(data));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (isEmptyPrompt(data)) return;
      savePromptDraft(data);
    }, 800);
  }, [
    hasHydrated,
    user,
    watchedPersona,
    watchedContext,
    watchedTask,
    watchedOutput,
    watchedConstraint,
    result,
  ]);

  //CREATE-A-NEW-DOCUMENT
  async function handleCreateNewDraft() {
    if (!user) return;

    try {
      // 🔥 1. RESET FORM
      reset({
        persona: "",
        context: "",
        task: "",
        output: "",
        constraint: "",
      });

      // 🔥 2. CLEAR LOCAL STORAGE (IMPORTANT)
      localStorage.removeItem(PENTAGRAM_STORAGE_KEY);

      // 🔥 3. CLEAR REDUX PENTAGRAM STATE
      persistFormToRedux({
        persona: "",
        context: "",
        task: "",
        output: "",
        constraint: "",
      });

      // 🔥 4. CLEAR UI STATE
      setResult(null);
      setScores(null);
      resetAnalysisPanels();
      setHasAssembled(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      toast.success("New draft created");
    } catch (uiErr) {
      console.error("Local UI reset failed:", uiErr);
      toast.error("Failed to create new draft");
    }

    try {
      const q = query(
        collection(db, "prompt_drafts"),
        where("user_id", "==", user.id),
      );

      const snapshot = await getDocs(q);

      await Promise.all(
        snapshot.docs.map((d) =>
          updateDoc(d.ref, {
            current_doc: false,
            updated_at: serverTimestamp(),
          }),
        ),
      );

      const newDraftRef = await addDoc(collection(db, "prompt_drafts"), {
        user_id: user.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        title: "Untitled Prompt",
        fields: {
          persona: "",
          context: "",
          task: "",
          output: "",
          constraint: "",
        },
        score: {
          clarity: null,
          specificity: null,
          format_guidance: null,
          overall: null,
        },
        gemini_result: "",
        favorite: false,
        words: 0,
        current_doc: true,
      });

      await updateDoc(newDraftRef, { id: newDraftRef.id });
      setCurrentDraftId(newDraftRef.id);
    } catch (err) {
      console.error("Database backup sync failed:", err);
      toast.error("Failed to save new draft to cloud database");
    }
  }

  return (
    <>
      <section className="container section-padding">
        <HeaderSection />

        {/* only for testing */}
        <div className="flex gap-4">
          <button type="button" onClick={handleFillTestData}>
            test prompt
          </button>
        </div>

        {/* only for testing */}
        <button
          type="button"
          onClick={() => {
            handleFillTestData();

            setResult(mockEvaluationResponse);

            setScores(null);
            setEvaluation(null);
          }}
        >
          test evaluate
        </button>
        {/* only for testing */}

        <FormSection control={control} resetField={resetField} watch={watch} />

        <SubmitButton
          isValid={canSubmit}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        {isLoading && <ResultSkeleton />}

        {!isLoading && !result && !error && (
          <div className="m-6 py-3 border-l-4 border-primary pl-6 pr-4 rounded-lg shadow-md bg-secondary/80 text-gray-800">
            Your generated response will appear here once you submit the form.
          </div>
        )}

        {/* GENERATED AI RESPONSE */}
        {!isLoading && result && (
          <div className="mt-6 py-1 border-l-4 border-primary pl-6 pr-4 rounded-xl shadow-md bg-secondary/80 text-justify">
            <h2 className="text-center uppercase my-4 font-light tracking-tight text-2xl underline underline-offset-4 decoration-primary decoration-2">
              AI response:
            </h2>
            <div className="prompt-content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-8 p-6 rounded-2xl bg-destructive/5 border border-destructive/20 shadow-xs flex flex-col items-center sm:items-start sm:flex-row gap-4 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
            {/* Alert symbol anchor */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive text-xl font-semibold">
              !
            </div>

            {/* Content tracking */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-destructive">
                Execution Error
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{error}</p>

              <div className="pt-2">
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold tracking-wide border border-destructive/20 bg-background text-destructive hover:bg-destructive/5 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* actions once prompt is assembled */}
        {!isGuest && result && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
            {/* action 1: Reset */}
            {hasAssembled && (
              <Button
                variant="secondary"
                onClick={handleCreateNewDraft}
                className="w-full h-12 text-base font-semibold shadow-sm transition-all duration-150"
              >
                New Prompt
              </Button>
            )}

            {/* action 2: Score */}
            <Button
              variant="secondary"
              className="w-full h-12 text-base font-semibold shadow-sm hover:bg-secondary/80 transition-colors"
              onClick={handleSubmit(onScore)}
              disabled={isRescoreDisabled}
            >
              {!scores
                ? "Score Prompt"
                : isSameAsLastScore
                  ? "Scored"
                  : "Re-score prompt"}
            </Button>

            {/* action 3: Evaluate */}
            <Button
              variant="secondary"
              className="w-full h-12 text-base font-semibold shadow-sm hover:bg-secondary/80 transition-colors"
              onClick={handleSubmit(onEvaluate)}
              disabled={isEvaluating}
            >
              {isEvaluating ? "Evaluating..." : "Evaluate Response"}
            </Button>
          </div>
        )}

        {/* placeholder for guests */}
        {isGuest && result && (
          <div className="mt-4 flex justify-center">
            <p className="text-base font-light text-black/70 text-center">
              <Link
                href="/login"
                className="underline font-semibold hover:text-slate-800 transition-colors"
              >
                Sign in
              </Link>{" "}
              if you would like your prompt to be scored and evaluated.
            </p>
          </div>
        )}

        {isScoring && <ResultSkeleton />}

        {/* SCORES CARD */}
        {scores && !isScoring && (
          <div className="mt-6 p-6 border-l-4 border-primary rounded-xl shadow-md bg-secondary/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="mb-4 text-center uppercase font-light tracking-tight text-2xl underline underline-offset-4 decoration-primary decoration-2">
                  Prompt Scoring
                </h3>
                {scores.suggestion ? (
                  <p className="text-sm text-gray-500">
                    Weakest field:{" "}
                    <span className="font-medium text-destructive capitalize">
                      {scores.weakest_field}
                    </span>
                  </p>
                ) : null}
              </div>
              {/* score badge */}
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl self-start md:self-auto">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Overall
                </span>
                <span className="text-2xl font-black">{scores.overall}/10</span>
              </div>

              {/* individual metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Clarity
                  </span>
                  <span
                    className={`text-2xl font-bold ${getColor(scores.global_scores.clarity)}`}
                  >
                    {scores.global_scores.clarity}
                    <span className="text-xs text-gray-400 font-normal">
                      /10
                    </span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Specificity
                  </span>
                  <span
                    className={`text-2xl font-bold ${getColor(scores.global_scores.specificity)}`}
                  >
                    {scores.global_scores.specificity}
                    <span className="text-xs text-gray-400 font-normal">
                      /10
                    </span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Format Guidance
                  </span>
                  <span
                    className={`text-2xl font-bold ${getColor(scores.global_scores.format_guidance)}`}
                  >
                    {scores.global_scores.format_guidance}
                    <span className="text-xs text-gray-400 font-normal">
                      /10
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {scoreError && !isScoring && (
          <div className="mt-8 p-6 rounded-2xl bg-destructive/5 border border-destructive/20 shadow-xs flex flex-col items-center sm:items-start sm:flex-row gap-4 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
            {/* Alert symbol anchor */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive text-xl font-semibold">
              !
            </div>

            {/* Content tracking */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-destructive">
                Execution Error
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {scoreError}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onScore}
                  className="h-9 px-4 rounded-xl text-xs font-semibold tracking-wide border border-destructive/20 bg-background text-destructive hover:bg-destructive/5 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Retry Request
                </button>
              </div>
            </div>
          </div>
        )}

        {saveError && (
          <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl text-xs font-medium text-amber-800 tracking-wide animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="leading-relaxed">{saveError}</p>
            </div>
          </div>
        )}

        <EvaluationPanel
          evaluation={evaluation}
          isEvaluating={isEvaluating}
          error={evaluationError}
          onRetry={handleSubmit(onEvaluate)}
          onUseFollowUp={handleUseFollowUp}
        />

        {isModalOpen && (
          <ComparisonModal
            isModalOpen={true}
            onClose={() => {
              setIsModalOpen(false);
            }}
            suggestion={scores?.suggestion || null}
            onApply={handleApplySuggestion}
          />
        )}
      </section>
    </>
  );
}
