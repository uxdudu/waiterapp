import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { NavItem } from "../base";
import { cx } from "../cx";

export type AppNavigationItem<T extends string = string> = { disabled?: boolean; icon: LucideIcon; id: T; label: string };

/**
 * Primary navigation for every surface: floating glass bottom bar with
 * icon-only items (Garçom mobile), rail (Cozinha) and sidebar (Delivery).
 */
export function AppNavigation<T extends string>({ activeId, brand, className, footer, footerItems = [], items, label = "Navegação principal", onNavigate, variant }: { activeId: T; brand?: ReactNode; className?: string; footer?: ReactNode; footerItems?: AppNavigationItem<T>[]; items: AppNavigationItem<T>[]; label?: string; onNavigate: (id: T) => void; variant: "bottom" | "rail" | "sidebar" }) {
  const orientation = variant === "sidebar" ? "horizontal" : "vertical";
  const renderItem = (item: AppNavigationItem<T>) => (
    <NavItem active={item.id === activeId} disabled={item.disabled} icon={item.icon} iconOnly={variant === "bottom"} key={item.id} label={item.label} onPress={() => onNavigate(item.id)} orientation={orientation} />
  );

  return (
    <nav aria-label={label} className={cx("wa-app-nav", `wa-app-nav--${variant}`, className)}>
      {brand ? <div className="wa-app-nav__brand">{brand}</div> : null}
      <div className="wa-app-nav__items">{items.map(renderItem)}</div>
      {footerItems.length ? <div className="wa-app-nav__footer-items">{footerItems.map(renderItem)}</div> : null}
      {footer ? <div className="wa-app-nav__footer">{footer}</div> : null}
    </nav>
  );
}
