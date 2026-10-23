import type { ReactNode } from "react";
import { Chip } from "@heroui/react";
import { cx } from "../cx";

/** Short descriptive label, such as an offer or highlight. Use StatusBadge for order states. */
export function Tag({ children, className, tone = "brand" }: { children: ReactNode; className?: string; tone?: "brand" | "neutral" | "inverse" }) {
  return (
    <Chip className={cx("wa-tag", `wa-tag--${tone}`, className)} size="sm" variant="soft">
      {children}
    </Chip>
  );
}
