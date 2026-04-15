"use client";
import FormSection from "@/components/FormSection";
import ProgressLoader from "@/components/ProgressLoader";
import SubmitButton from "@/components/SubmitButton";
// import { useAppSelector } from "@/redux/hooks";
import { type FieldId } from "@/const/fields";
import { useForm } from "react-hook-form";

export default function Home() {
  // const user = useAppSelector((state) => state.auth.user);

  const {
    control,
    handleSubmit,
    resetField,
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

  async function onSubmit(data: Record<FieldId, string>) {
    console.log("Form submitted with values:", data);
  }

  return (
    <>
      <section className="container  section-padding">
        <FormSection control={control} resetField={resetField} watch={watch} />
        <ProgressLoader />
        <SubmitButton
          isValid={isValid}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={false}
        />
      </section>
    </>
  );
}
