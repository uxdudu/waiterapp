import type { HTMLAttributes, ReactNode } from "react";
import { Card as HeroCard } from "@heroui/react";
import { cx } from "../cx";

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> & {
  children: ReactNode;
  className?: string;
  elevation?: "flat" | "raised";
  interactive?: boolean;
  radius?: "sm" | "md" | "lg";
};

/** White surface with the Garçom radius and soft shadow. */
export function Card({ className, elevation = "raised", interactive = false, radius = "sm", ...props }: CardProps) {
  return <HeroCard {...props} className={cx("wa-card", `wa-card--${elevation}`, `wa-card--radius-${radius}`, interactive && "wa-card--interactive", className)} variant="default" />;
}
