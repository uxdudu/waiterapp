import type { ComponentProps, ReactNode } from "react";
import { Button as HeroButton } from "@heroui/react";
import { cx } from "../cx";
import { CountBadge } from "./CountBadge";

export type IconButtonVariant = "plain" | "surface" | "primary";

export type IconButtonProps = Omit<ComponentProps<typeof HeroButton>, "children" | "className" | "isIconOnly" | "size" | "variant" | "aria-label"> & {
  badge?: number;
  children: ReactNode;
  className?: string;
  label: string;
  size?: "sm" | "md";
  variant?: IconButtonVariant;
};

/** Icon-only action with a 44px target (36px when compact) and a required accessible label. */
export function IconButton({ badge, children, className, label, size = "md", variant = "plain", ...props }: IconButtonProps) {
  return (
    <HeroButton
      {...props}
      aria-label={label}
      className={cx("wa-icon-button", `wa-icon-button--${variant}`, `wa-icon-button--${size}`, className)}
      isIconOnly
      variant={variant === "primary" ? "primary" : "ghost"}
    >
      {children}
      {badge ? <CountBadge className="wa-icon-button__badge" value={badge} /> : null}
    </HeroButton>
  );
}
