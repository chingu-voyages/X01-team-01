interface HelpMessageProps {
  helpText: string;
  isHelpVisible: boolean;
}

export function HelpMessage({ helpText, isHelpVisible }: HelpMessageProps) {
  return (
    <p
      className={`
    text-sm min-h-14 leading-tight text-accent-foreground py-2 
    transition-all duration-300 ease-in-out
    ${isHelpVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
  `}
    >
      {helpText}
    </p>
  );
}
