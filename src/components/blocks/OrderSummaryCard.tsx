import type { ReactNode } from "react";
import { Card, StatusBadge, Thumbnail, type StatusTone } from "../base";
import { cx } from "../cx";

export type OrderSummaryData = {
  items?: Array<{ image?: string; name: string; quantity: number }>;
  meta?: string;
  status: { label: string; tone: StatusTone };
  title: string;
  total?: string;
};

/**
 * Order overview from the Garçom history. A frame tinted by the status holds
 * the table and badge; the white card lists items with their photos.
 * Delivery reuses it for "Meus pedidos".
 */
export function OrderSummaryCard({ action, order }: { action?: ReactNode; order: OrderSummaryData }) {
  const hasBody = Boolean(order.items?.length || order.total || action);

  return (
    <article className={cx("wa-order-summary", `wa-order-summary--${order.status.tone}`)}>
      <div className="wa-order-summary__header">
        <span>
          <strong className="wa-order-summary__title">{order.title}</strong>
          {order.meta ? <small className="wa-order-summary__meta">{order.meta}</small> : null}
        </span>
        <StatusBadge tone={order.status.tone}>{order.status.label}</StatusBadge>
      </div>
      {hasBody ? (
        <Card className="wa-order-summary__body" elevation="flat" radius="lg">
          {order.items?.length ? (
            <ul className="wa-order-summary__items">
              {order.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <Thumbnail size="list" src={item.image} />
                  <span className="wa-order-summary__item"><span>{item.quantity}x</span>{item.name}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {order.total ? <div className="wa-order-summary__total"><span>Total do pedido</span><strong>{order.total}</strong></div> : null}
          {action ? <div className="wa-order-summary__action">{action}</div> : null}
        </Card>
      ) : null}
    </article>
  );
}
