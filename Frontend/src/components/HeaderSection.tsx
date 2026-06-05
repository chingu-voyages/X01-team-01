import { useAppSelector } from "@/redux/hooks";

export default function HeaderSection() {
  const { user, status } = useAppSelector((state) => state.auth);

  const displayName = user?.display_name?.trim();

  const emailPrefix = user?.email?.split("@")[0]?.trim();

  const greetingName = displayName
    ? displayName.split(" ")[0]
    : emailPrefix || null;

  return (
    <>
      <div className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto space-y-4">
        {/* dynamic pill badge */}
        <h2 className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          {status === "guest"
            ? "Welcome to AI Helper."
            : greetingName
              ? `Welcome back, ${greetingName}`
              : "Welcome to AI Helper"}
        </h2>

        {/* main title */}
        <h1 className="tracking-tight text-4xl sm:text-6xl font-black text-gray-900 leading-none">
          AI{" "}
          <span className="text-primary bg-linear-to-r from-primary to-primary/70 bg-clip-text">
            Helper
          </span>
        </h1>

        {/* dynamic description paragraph */}
        <p className="text-base sm:text-xl text-gray-600 font-normal tracking-tight leading-relaxed max-w-2xl mx-auto">
          {status === "guest" ? (
            <>
              Sculpt your intent into{" "}
              <span className="font-semibold text-gray-900">
                editorial-grade prompts
              </span>{" "}
              using the Pentagram framework.
            </>
          ) : (
            <>
              Continue refining your intent into{" "}
              <span className="font-semibold text-gray-900">
                editorial-grade prompts
              </span>{" "}
              and generating higher-quality AI responses.
            </>
          )}
        </p>
      </div>
    </>
  );
}
