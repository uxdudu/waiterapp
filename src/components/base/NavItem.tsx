import type { LucideIcon } from "lucide-react";
import { cx } from "../cx";

export type NavItemProps = {
  active?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  iconOnly?: boolean;
  onPress?: () => void;
  orientation?: "vertical" | "horizontal";
};

/** Navigation destination. Active items use the brand color and a short indicator. */
export function NavItem({ active = false, disabled = false, icon: Icon, iconOnly = false, label, onPress, orientation = "vertical" }: NavItemProps) {
  return (
    <button
      aria-label={iconOnly ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cx("wa-nav-item", `wa-nav-item--${orientation}`, iconOnly && "wa-nav-item--icon-only", active && "wa-nav-item--active")}
      disabled={disabled}
      onClick={onPress}
      title={disabled ? `${label} (em breve)` : iconOnly ? label : undefined}
      type="button"
    >
      <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
      {!iconOnly ? <span>{label}</span> : null}
    </button>
  );
}
