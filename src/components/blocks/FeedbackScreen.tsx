import type { ReactNode } from "react";
import { DeviceStatusBar, HomeIndicator } from "../base";

/** Full brand screen for moments like app start and order confirmation. */
export function FeedbackScreen({ action, children, description, label, media, title }: { action?: ReactNode; children?: ReactNode; description?: ReactNode; label?: string; media?: ReactNode; title: ReactNode }) {
  return (
    <div aria-label={label} className="wa-feedback-screen" role="status">
      <DeviceStatusBar tone="light" />
      <main className="wa-feedback-screen__content">
        {media}
        <div className="wa-feedback-screen__copy">
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children}
        {action}
      </main>
      <HomeIndicator tone="light" />
    </div>
  );
}
