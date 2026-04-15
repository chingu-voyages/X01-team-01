import { Button } from "./ui/button";
import { type FieldId } from "@/const/fields";
import { UseFormHandleSubmit } from "react-hook-form";
import { Spinner } from "./ui/spinner";

type FormValues = Record<FieldId, string>;

interface SubmitButtonProps {
  isValid: boolean;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function SubmitButton({
  isValid,
  handleSubmit,
  onSubmit,
  isLoading = false,
}: SubmitButtonProps) {
  return (
    <div className="mt-4 text-center ">
      <Button
        className="w-full md:w-full h-12 text-base font-bold relative overflow-hidden"
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid || isLoading}
        variant="default"
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
