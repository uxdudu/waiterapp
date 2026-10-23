import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "../base";

/** Right-side panel for order details, cart and history. Closes with Escape or the backdrop. */
export function SidePanel({ children, eyebrow, footer, onClose, title }: { children: ReactNode; eyebrow?: string; footer?: ReactNode; onClose: () => void; title: string }) {
  const panelRef = useRef<HTMLElement>(null);

  const close = useEffectEvent(onClose);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("[data-panel-close]")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab") return;
      const controls = [...(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]') ?? [])].filter((element) => element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <div className="wa-side-panel">
      <button aria-label={`Fechar ${title.toLocaleLowerCase("pt-BR")}`} className="wa-side-panel__backdrop" onClick={onClose} tabIndex={-1} type="button" />
      <aside aria-label={title} aria-modal="true" className="wa-side-panel__sheet" ref={panelRef} role="dialog">
        <header className="wa-side-panel__header">
          <div>
            {eyebrow ? <span className="wa-side-panel__eyebrow">{eyebrow}</span> : null}
            <h2>{title}</h2>
          </div>
          <IconButton data-panel-close label={`Fechar ${title.toLocaleLowerCase("pt-BR")}`} onPress={onClose}>
            <X aria-hidden="true" size={22} strokeWidth={1.8} />
          </IconButton>
        </header>
        <div className="wa-side-panel__body">{children}</div>
        {footer ? <footer className="wa-side-panel__footer">{footer}</footer> : null}
      </aside>
    </div>
  );
}
