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
        <div className="mb-10 text-center">
          <h1 className="mb-2 tracking-tighter leading-tight font-medium">AI Helper</h1>
          <h2 className="mb-2 tracking-tighter font-light">
            Sculpt your intent into editorial-grade prompts using the Pentagram
            framework.
          </h2>
          <h3 className="tracking-tighter font-light">Precision architecture for advanced reasoning.</h3>
        </div>

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
