interface HelpMessageProps {
  helpText: string;
  isHelpVisible: boolean;
}

export function HelpMessage({ helpText, isHelpVisible }: HelpMessageProps) {
  return (
    <div
      className={`
    transition-all duration-300 ease-in-out
    ${
      isHelpVisible
        ? "opacity-100 max-h-24 mt-2 translate-y-0"
        : "opacity-0 max-h-0 overflow-hidden -translate-y-2 pointer-events-none"
    }
  `}
    >
      <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg flex items-start gap-2">
        <p className="text-xs sm:text-sm leading-relaxed text-neutral-800">{helpText}</p>
      </div>
    </div>
  );
}
