import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface SubmitButtonProps {
  isValid: boolean;
  isLoading?: boolean;
}

export default function SubmitButton({
  isValid,
  isLoading = false,
}: SubmitButtonProps) {
  return (
    <div className="mt-4 text-center ">
      <Button
        className="w-full md:w-full h-12 text-base font-bold relative overflow-hidden"
        disabled={!isValid || isLoading}
        variant="default"
        form="pentagram-form"
        type="submit"
      >
        {isLoading ? (
          <>
            <Spinner data-icon="inline-start" /> Creating Prompt...
          </>
        ) : (
          "Assemble Prompt"
        )}
      </Button>
    </div>
  );
}
