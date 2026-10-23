import { QuantityStepper, Thumbnail } from "../base";
import { formatCurrency } from "../../lib/format";

export type OrderLineData = { icon?: string; image?: string; name: string; price: number; quantity: number };

/** One item inside an order: image, quantity, name, unit price and optional quantity controls. */
export function OrderLine({ item, minQuantity = 0, onDecrement, onIncrement }: { item: OrderLineData; minQuantity?: number; onDecrement?: () => void; onIncrement?: () => void }) {
  return (
    <div className="wa-order-line">
      <Thumbnail fallback={item.icon} size="sm" src={item.image} />
      <span className="wa-order-line__quantity">{item.quantity}x</span>
      <span className="wa-order-line__copy">
        <strong>{item.name}</strong>
        <small>{formatCurrency(item.price)}</small>
      </span>
      {onIncrement && onDecrement ? (
        <QuantityStepper itemName={item.name} minQuantity={minQuantity} onDecrement={onDecrement} onIncrement={onIncrement} quantity={item.quantity} showValue={false} />
      ) : null}
    </div>
  );
}
