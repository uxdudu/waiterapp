import { useId, type ComponentProps } from "react";
import { Input } from "@heroui/react";

export type TextFieldProps = Omit<ComponentProps<typeof Input>, "className" | "id" | "onChange" | "variant"> & {
  label: string;
  onChange: (value: string) => void;
};

/** Labeled text input, sharing field tokens with SearchField. */
export function TextField({ label, onChange, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <label className="wa-text-field" htmlFor={id}>
      {label}
      <Input {...props} className="wa-text-field__input" id={id} onChange={(event) => onChange(event.target.value)} variant="secondary" />
    </label>
  );
}
