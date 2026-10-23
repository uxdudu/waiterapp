import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

export type SearchFieldProps = {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  /** `outlined` has a border and radius.sm; `filled` is a borderless white pill. */
  variant?: "outlined" | "filled";
};

/** Search input from the Garçom menu, with a clear action once there is a value. */
export function SearchField({ className, label, onChange, placeholder = label, value, variant = "outlined" }: SearchFieldProps) {
  return (
    <div className={cx("wa-search-field", `wa-search-field--${variant}`, className)}>
      <Search aria-hidden="true" className="wa-search-field__icon" size={18} strokeWidth={2} />
      <Input
        aria-label={label}
        className="wa-search-field__input"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
        variant="secondary"
      />
      {value ? (
        <IconButton className="wa-search-field__clear" label="Limpar busca" onPress={() => onChange("")} size="sm">
          <X aria-hidden="true" size={18} strokeWidth={2} />
        </IconButton>
      ) : null}
    </div>
  );
}
