import { cx } from "../cx";

/** Compact numeric counter for carts, notifications and column totals. */
export function CountBadge({ className, tone = "brand", value }: { className?: string; tone?: "brand" | "neutral"; value: number }) {
  return (
    <span aria-hidden={tone === "brand" ? true : undefined} className={cx("wa-count-badge", `wa-count-badge--${tone}`, className)}>
      {value > 99 ? "99+" : tone === "brand" && value > 9 ? "9+" : value}
    </span>
  );
}
