import { cx } from "../cx";

export type CategoryItemProps = {
  className?: string;
  icon?: string;
  image?: string;
  label: string;
  onPress: () => void;
  selected?: boolean;
  size?: "md" | "lg";
  variant?: "round" | "tile";
};

/**
 * Category shortcut: media above a short label. `round` puts the media in a
 * circle (Delivery); `tile` wraps both in a white card (Garçom home).
 */
export function CategoryItem({ className, icon, image, label, onPress, selected = false, size = "md", variant = "round" }: CategoryItemProps) {
  return (
    <button aria-pressed={selected} className={cx("wa-category-item", `wa-category-item--${size}`, `wa-category-item--${variant}`, selected && "wa-category-item--selected", className)} onClick={onPress} type="button">
      <span aria-hidden="true" className="wa-category-item__media">
        {image ? <img alt="" src={image} /> : icon}
      </span>
      <span className="wa-category-item__label">{label}</span>
    </button>
  );
}
