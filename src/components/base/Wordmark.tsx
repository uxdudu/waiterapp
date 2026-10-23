import { cx } from "../cx";

/** WAITERAPP logotype from the Garçom app. Compact shows the WA monogram. */
export function Wordmark({ className, compact = false, size = "md", tone = "default" }: { className?: string; compact?: boolean; size?: "sm" | "md" | "lg"; tone?: "default" | "inverse" }) {
  return (
    <span aria-label="Waiterapp" className={cx("wa-wordmark", `wa-wordmark--${size}`, `wa-wordmark--${tone}`, className)} role="img">
      <strong>{compact ? "W" : "Waiter"}</strong>
      <span>{compact ? "A" : "App"}</span>
    </span>
  );
}
