import type { StatusTone } from "../components/base";

export type OrderStatus = "waiting" | "production" | "ready";

/* One vocabulary for order status across Garçom, Cozinha and Delivery. */
export const orderStatus: Record<OrderStatus, { label: string; tone: StatusTone; icon: string; action?: string }> = {
  waiting: { label: "Fila de espera", tone: "waiting", icon: "🕑", action: "Iniciar preparo" },
  production: { label: "Em produção", tone: "preparing", icon: "👩‍🍳", action: "Concluir pedido" },
  ready: { label: "Pronto", tone: "ready", icon: "✅" },
};
