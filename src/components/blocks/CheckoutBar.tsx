import type { ReactNode } from "react";
import { Button, HomeIndicator } from "../base";
import { cx } from "../cx";
import { formatCurrency } from "../../lib/format";

export type CheckoutBarProps = {
  action: { disabled?: boolean; label: string; onPress: () => void };
  amount?: number;
  children?: ReactNode;
  className?: string;
  emptyText?: string;
  label?: string;
  note?: string;
  placement?: "fixed" | "inline";
};

/** Total plus the main action. Fixed at the bottom of mobile screens, inline inside panels. */
export function CheckoutBar({ action, amount, children, className, emptyText, label = "Total", note, placement = "fixed" }: CheckoutBarProps) {
  const showAmount = amount !== undefined && (amount > 0 || !emptyText);

  return (
    <div className={cx("wa-checkout-bar", `wa-checkout-bar--${placement}`, className)}>
      {children ? <div className="wa-checkout-bar__content">{children}</div> : null}
      <div className="wa-checkout-bar__row">
        {showAmount ? (
          <div className="wa-checkout-bar__total">
            <span>{label}</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
        ) : <p className="wa-checkout-bar__empty">{emptyText}</p>}
        <Button className="wa-checkout-bar__action" isDisabled={action.disabled} onPress={action.onPress} size="lg">{action.label}</Button>
      </div>
      {note ? <small className="wa-checkout-bar__note">{note}</small> : null}
      {placement === "fixed" ? <HomeIndicator /> : null}
    </div>
  );
}
