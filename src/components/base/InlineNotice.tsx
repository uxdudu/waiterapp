import type { ReactNode } from "react";
import { Info, X } from "lucide-react";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

/** Persistent information inside the page flow. */
export function InlineNotice({ children, className, onClose }: { children: ReactNode; className?: string; onClose?: () => void }) {
  return (
    <div className={cx("wa-inline-notice", className)}>
      <Info aria-hidden="true" size={18} strokeWidth={1.8} />
      <span>{children}</span>
      {onClose ? (
        <IconButton label="Fechar aviso" onPress={onClose} size="sm">
          <X aria-hidden="true" size={18} strokeWidth={2} />
        </IconButton>
      ) : null}
    </div>
  );
}
