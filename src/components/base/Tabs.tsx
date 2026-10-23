import type { Key } from "react";
import { Tabs as HeroTabs } from "@heroui/react";
import { cx } from "../cx";

export type TabItem = { disabled?: boolean; id: string; label: string };

/** Section tabs for web app workspaces. */
export function Tabs({ className, defaultSelectedKey, items, label, onSelectionChange }: { className?: string; defaultSelectedKey?: string; items: TabItem[]; label: string; onSelectionChange?: (key: Key) => void }) {
  return (
    <HeroTabs className={cx("wa-tabs", className)} defaultSelectedKey={defaultSelectedKey ?? items[0]?.id} onSelectionChange={onSelectionChange} variant="primary">
      <HeroTabs.List aria-label={label}>
        {items.map((item) => (
          <HeroTabs.Tab className="wa-tabs__tab" id={item.id} isDisabled={item.disabled} key={item.id}>
            {item.label}
          </HeroTabs.Tab>
        ))}
      </HeroTabs.List>
    </HeroTabs>
  );
}
