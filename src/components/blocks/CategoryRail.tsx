import { CategoryItem } from "../base";
import { cx } from "../cx";

export type CategoryOption<T extends string = string> = { icon?: string; id: T; image?: string; label: string };

/** Horizontal category picker. Fills the width when there is room and scrolls when there is not. */
export function CategoryRail<T extends string>({ className, items, label, onSelect, selectedId, size = "md", variant = "round" }: { className?: string; items: CategoryOption<T>[]; label: string; onSelect: (id: T) => void; selectedId: T; size?: "md" | "lg"; variant?: "round" | "tile" }) {
  return (
    <nav aria-label={label} className={cx("wa-category-rail", `wa-category-rail--${size}`, `wa-category-rail--${variant}`, className)}>
      {items.map((item) => (
        <CategoryItem icon={item.icon} image={item.image} key={item.id} label={item.label} onPress={() => onSelect(item.id)} selected={item.id === selectedId} size={size} variant={variant} />
      ))}
    </nav>
  );
}
