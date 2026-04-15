import { Field, FieldLabel } from "./ui/field";
import { Progress } from "./ui/progress";

export default function ProgressLoader() {
  return (
    <Field className="w-full mt-4">
      <FieldLabel htmlFor="progress-upload">
        <span>Creating your response</span>
        <span className="ml-auto">66%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload" />
    </Field>
  );
}
