export type StoredOrderStatus = "waiting" | "production" | "ready";

export type StoredOrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type StoredOrder = {
  id: string;
  table: string;
  items: StoredOrderItem[];
  status: StoredOrderStatus;
  createdAt: string;
};

const ORDERS_STORAGE_KEY = "waiterapp.orders";

export function readStoredOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed as StoredOrder[] : [];
  } catch {
    return [];
  }
}

function writeStoredOrders(orders: StoredOrder[]) {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent("waiterapp:orders-changed"));
}

export function createStoredOrder(input: Omit<StoredOrder, "id" | "createdAt" | "status">) {
  const order: StoredOrder = {
    ...input,
    createdAt: new Date().toISOString(),
    id: `order-${Date.now()}`,
    status: "waiting",
  };

  writeStoredOrders([...readStoredOrders(), order]);
  return order;
}

export function updateStoredOrderStatus(id: string, status: StoredOrderStatus) {
  writeStoredOrders(
    readStoredOrders().map((order) => order.id === id ? { ...order, status } : order),
  );
}

export function removeStoredOrder(id: string) {
  writeStoredOrders(readStoredOrders().filter((order) => order.id !== id));
}

export function clearStoredOrders() {
  writeStoredOrders([]);
}

export const ordersChangedEvent = "waiterapp:orders-changed";
