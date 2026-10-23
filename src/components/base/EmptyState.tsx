import type { ReactNode } from "react";
import { cx } from "../cx";

/** Calm empty result with a short next step. */
export function EmptyState({ className, description, icon, title }: { className?: string; description?: string; icon?: ReactNode; title: string }) {
  return (
    <div className={cx("wa-empty-state", className)}>
      {icon ? <span aria-hidden="true" className="wa-empty-state__icon">{icon}</span> : null}
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  );
}
