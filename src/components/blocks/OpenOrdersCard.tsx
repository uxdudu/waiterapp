import { ReceiptText } from "lucide-react";
import { Card, CountBadge } from "../base";

/** Compact, keyboard-accessible entry to the current order list. */
export function OpenOrdersCard({ count, onOpen }: { count: number; onOpen: () => void }) {
  return (
    <Card aria-label={`Ver pedidos em aberto, ${count} ${count === 1 ? "pedido" : "pedidos"}`} className="wa-open-orders" elevation="flat" onClick={onOpen} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); }
    }} radius="lg" role="button" tabIndex={0}>
      <div className="wa-open-orders__heading">
        <h2><ReceiptText aria-hidden="true" size={24} strokeWidth={1.8} />Pedidos em aberto</h2>
        <CountBadge tone="neutral" value={count} />
      </div>
      <p>{count === 0 ? "Tudo em dia! Você não tem pedidos em aberto." : `${count} ${count === 1 ? "pedido aguardando" : "pedidos aguardando"} conclusão. Acompanhe o preparo e a entrega.`}</p>
    </Card>
  );
}
