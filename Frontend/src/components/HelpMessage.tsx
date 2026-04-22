interface HelpMessageProps {
  helpText: string;
  isHelpVisible: boolean;
}

export function HelpMessage({ helpText, isHelpVisible }: HelpMessageProps) {
  return (
    <>
      {isHelpVisible ? (
        <p className="text-xs h-14 leading-tight text-accent-foreground">
          {helpText}
        </p>
      ) : (
        <p className="h-14"></p>
      )}
    </>
  );
}
