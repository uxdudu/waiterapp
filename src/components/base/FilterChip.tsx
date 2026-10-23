import type { ReactNode } from "react";
import { cx } from "../cx";

/** Toggleable pill for filters and quick choices, such as the table picker. */
export function FilterChip({ children, className, onPress, role, selected = false, trailing }: { children: ReactNode; className?: string; onPress: () => void; role?: "option"; selected?: boolean; trailing?: ReactNode }) {
  return (
    <button
      aria-pressed={role ? undefined : selected}
      aria-selected={role ? selected : undefined}
      className={cx("wa-filter-chip", selected && "wa-filter-chip--selected", className)}
      onClick={onPress}
      role={role}
      type="button"
    >
      {children}
      {trailing}
    </button>
  );
}
