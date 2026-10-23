import { cx } from "../cx";

export type SegmentedOption<T extends string> = { id: T; label: string };

/** Mutually exclusive choice with two or three short options. */
export function SegmentedControl<T extends string>({ className, fullWidth = false, label, onChange, options, value }: { className?: string; fullWidth?: boolean; label: string; onChange: (value: T) => void; options: SegmentedOption<T>[]; value: T }) {
  return (
    <div aria-label={label} className={cx("wa-segmented", fullWidth && "wa-segmented--full", className)} role="group">
      {options.map((option) => (
        <button
          aria-pressed={option.id === value}
          className={cx("wa-segmented__option", option.id === value && "wa-segmented__option--active")}
          key={option.id}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
