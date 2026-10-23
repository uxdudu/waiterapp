import type { ComponentProps } from "react";
import { Button as HeroButton } from "@heroui/react";
import { cx } from "../cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "glass";
export type ButtonSize = "md" | "lg";

export type ButtonProps = Omit<ComponentProps<typeof HeroButton>, "className" | "size" | "variant" | "isIconOnly"> & {
  className?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const heroVariant = { glass: "outline", ghost: "ghost", inverse: "ghost", primary: "primary", secondary: "outline" } as const;

/** Pill action from the Garçom app. Primary is the brand action; ghost is the brand text link. */
export function Button({ className, fullWidth = false, size = "md", variant = "primary", ...props }: ButtonProps) {
  return (
    <HeroButton
      {...props}
      className={cx("wa-button", `wa-button--${variant}`, `wa-button--${size}`, fullWidth && "wa-button--full", className)}
      variant={heroVariant[variant]}
    />
  );
}
