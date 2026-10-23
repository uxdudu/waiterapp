import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx } from "../cx";

/** Screen or section heading with optional icon, supporting text and actions. */
export function PageHeader({ actions, className, description, eyebrow, icon: Icon, level = 1, title }: { actions?: ReactNode; className?: string; description?: ReactNode; eyebrow?: string; icon?: LucideIcon; level?: 1 | 2; title: ReactNode }) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <header className={cx("wa-page-header", `wa-page-header--level-${level}`, className)}>
      <div className="wa-page-header__copy">
        {eyebrow ? <span className="wa-page-header__eyebrow">{eyebrow}</span> : null}
        <Heading className="wa-page-header__title">
          {Icon ? <Icon aria-hidden="true" size={24} strokeWidth={1.8} /> : null}
          {title}
        </Heading>
        {description ? <p className="wa-page-header__description">{description}</p> : null}
      </div>
      {actions ? <div className="wa-page-header__actions">{actions}</div> : null}
    </header>
  );
}
