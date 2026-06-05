import { useAppSelector } from "@/redux/hooks";

export default function HeaderSection() {
  const { user, status } = useAppSelector((state) => state.auth);

  const displayName = user?.display_name?.trim();

  const emailPrefix = user?.email?.split("@")[0]?.trim();

  const greetingName = displayName
    ? displayName.split(" ")[0]
    : emailPrefix || null;

  return (
    <div className="mb-8 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary">
          AI Prompt Workspace
        </p>

        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900">
          {status === "guest"
            ? "Welcome to AI Helper."
            : greetingName
              ? `Welcome back, ${greetingName}`
              : "Welcome to AI Helper."}
        </h2>

        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
          {status === "guest"
            ? "Build prompts and explore the Pentagram framework."
            : "Continue refining prompts and generating higher-quality AI responses."}
        </p>
      </div>
    </div>
  );
}