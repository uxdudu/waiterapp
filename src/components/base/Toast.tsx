import { CheckCircle2, X } from "lucide-react";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

/** Temporary confirmation after an action. Announced politely to assistive technology. */
export function Toast({ className, message, onClose, showProgress = false }: { className?: string; message: string; onClose?: () => void; showProgress?: boolean }) {
  return (
    <div aria-live="polite" className={cx("wa-toast", className)} role="status">
      <CheckCircle2 aria-hidden="true" className="wa-toast__icon" size={20} strokeWidth={2} />
      <p>{message}</p>
      {onClose ? (
        <IconButton className="wa-toast__close" label="Fechar notificação" onPress={onClose} size="sm">
          <X aria-hidden="true" size={18} strokeWidth={2} />
        </IconButton>
      ) : null}
      {showProgress ? <span aria-hidden="true" className="wa-toast__progress" /> : null}
    </div>
  );
}
