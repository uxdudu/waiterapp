import type { ReactNode } from "react";
import { cx } from "../cx";

export type StatusTone = "neutral" | "waiting" | "preparing" | "ready" | "danger";

/** Status label with a dot. The text always carries the meaning; color reinforces it. */
export function StatusBadge({ children, className, tone = "neutral" }: { children: ReactNode; className?: string; tone?: StatusTone }) {
  return (
    <span className={cx("wa-status-badge", `wa-status-badge--${tone}`, className)}>
      <span aria-hidden="true" className="wa-status-badge__dot" />
      {children}
    </span>
  );
}
