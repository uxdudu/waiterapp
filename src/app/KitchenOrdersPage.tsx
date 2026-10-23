import { type DragEvent, useEffect, useRef, useState } from "react";
import { ClipboardList, Home, LogOut, Plus, RefreshCw, UserRound, UsersRound, UtensilsCrossed } from "lucide-react";
import chickenImage from "../assets/figma/dish-2.jpeg";
import cheeseImage from "../assets/figma/dish-4.jpeg";
import { Button, CountBadge, StatusBadge, Tabs, Toast, Wordmark } from "../components/base";
import { AppNavigation, CheckoutBar, OrderBoardColumn, OrderLine, PageHeader, ProductTable, SidePanel, type AppNavigationItem, type BoardTicket, type ProductTableRow } from "../components/blocks";
import { formatItemCount } from "../lib/format";
import { orderStatus, type OrderStatus } from "../lib/order-status";
import { clearStoredOrders, ordersChangedEvent, readStoredOrders, removeStoredOrder, updateStoredOrderStatus } from "../lib/order-store";
import { products } from "./garcom-data";
import "./surfaces/cozinha.css";

type KitchenSection = "home" | "history" | "menu" | "users" | "profile" | "logout";

type Order = {
  id: string;
  sourceId?: string;
  table: string;
  itemCount: string;
  status: OrderStatus;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

const navigationItems: AppNavigationItem<KitchenSection>[] = [
  { icon: Home, id: "home", label: "Home" },
  { disabled: true, icon: ClipboardList, id: "history", label: "Histórico" },
  { icon: UtensilsCrossed, id: "menu", label: "Cardápio" },
  { disabled: true, icon: UsersRound, id: "users", label: "Usuários" },
];

const footerItems: AppNavigationItem<KitchenSection>[] = [
  { disabled: true, icon: UserRound, id: "profile", label: "Meu Perfil" },
  { disabled: true, icon: LogOut, id: "logout", label: "Sair" },
];

const columns: OrderStatus[] = ["waiting", "production", "ready"];

const emptyColumnText: Record<OrderStatus, string> = {
  waiting: "A fila está livre",
  production: "Nenhum pedido em preparo",
  ready: "Nenhum pedido pronto",
};

const orders: Order[] = [
  { id: "waiting-table-2", table: "Mesa 2", itemCount: "2 itens", status: "waiting" },
  { id: "production-table-2", table: "Mesa 2", itemCount: "2 itens", status: "production" },
  { id: "ready-table-2", table: "Mesa 2", itemCount: "1 item", status: "ready" },
];

const initialItems: OrderItem[] = [
  { id: "chicken", name: "Frango com Catupiry", quantity: 1, price: 40, image: chickenImage },
  { id: "cheese", name: "Quatro Queijos", quantity: 2, price: 40, image: cheeseImage },
];

const initialMenuProducts: ProductTableRow[] = [
  { category: "Pizza", categoryIcon: "🍕", id: "quatro-queijos-1", image: cheeseImage, name: "Quatro Queijos", price: 40 },
  { category: "Pizza", categoryIcon: "🍕", id: "quatro-queijos-2", image: cheeseImage, name: "Quatro Queijos", price: 40 },
  { category: "Pizza", categoryIcon: "🍕", id: "quatro-queijos-3", image: cheeseImage, name: "Quatro Queijos", price: 40 },
];

function readOrdersForKitchen(): Order[] {
  return readStoredOrders().map((order) => ({
    id: `stored-${order.id}`,
    itemCount: formatItemCount(order.items.reduce((sum, item) => sum + item.quantity, 0)),
    sourceId: order.id,
    status: order.status,
    table: order.table,
  }));
}

const TOAST_DURATION = 4500;

function KitchenMenu({ onFeedback }: { onFeedback: (message: string) => void }) {
  const [menuProducts, setMenuProducts] = useState(initialMenuProducts);

  return (
    <>
      <PageHeader description="Gerencie os produtos do seu estabelecimento" icon={UtensilsCrossed} title="Cardápio" />
      <main className="kitchen-main kitchen-menu">
        <Tabs items={[{ id: "products", label: "Produtos" }, { disabled: true, id: "categories", label: "Categorias" }]} label="Seções do cardápio" />
        <section aria-labelledby="menu-products-heading" className="kitchen-menu__products">
          <PageHeader
            actions={<Button onPress={() => onFeedback("Cadastro de produto em breve.")}><Plus aria-hidden="true" size={18} strokeWidth={2} />Novo Produto</Button>}
            level={2}
            title={<span className="kitchen-menu__title" id="menu-products-heading">Produtos <CountBadge tone="neutral" value={menuProducts.length} /></span>}
          />
          <ProductTable
            onDelete={(row) => setMenuProducts((current) => current.filter((item) => item.id !== row.id))}
            onEdit={(row) => onFeedback(`Edição de ${row.name} em breve.`)}
            rows={menuProducts}
          />
        </section>
      </main>
    </>
  );
}

export function KitchenOrdersPage() {
  const [activeSection, setActiveSection] = useState<KitchenSection>("home");
  const [orderList, setOrderList] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<OrderStatus | null>(null);
  const [lastMovedOrderId, setLastMovedOrderId] = useState<string | null>(null);
  const [items, setItems] = useState(initialItems);
  const moveFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOrder = orderList.find((order) => order.id === selectedOrderId) ?? null;

  useEffect(() => {
    setOrderList([...orders, ...readOrdersForKitchen()]);

    const syncStoredOrders = () => {
      setOrderList((currentOrders) => [
        ...currentOrders.filter((order) => !order.sourceId),
        ...readOrdersForKitchen(),
      ]);
    };

    window.addEventListener("storage", syncStoredOrders);
    window.addEventListener(ordersChangedEvent, syncStoredOrders);

    return () => {
      window.removeEventListener("storage", syncStoredOrders);
      window.removeEventListener(ordersChangedEvent, syncStoredOrders);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (moveFeedbackTimer.current) {
        clearTimeout(moveFeedbackTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const toastTimer = window.setTimeout(() => setToastMessage(null), TOAST_DURATION);
    return () => window.clearTimeout(toastTimer);
  }, [toastMessage]);

  function selectOrder(id: string) {
    const order = orderList.find((entry) => entry.id === id);
    const storedOrder = order?.sourceId ? readStoredOrders().find((entry) => entry.id === order.sourceId) : null;
    setItems(storedOrder ? storedOrder.items.map((item, index) => ({
      ...item,
      id: `${storedOrder.id}-${index}`,
      image: products.find((product) => product.name === item.name)?.image,
    })) : initialItems.map((item) => ({ ...item, quantity: 1 })).slice(0, order?.status === "ready" ? 1 : 2));
    setSelectedOrderId(id);
  }

  function updateQuantity(id: string, delta: number) {
    setItems((currentItems) =>
      currentItems.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item),
    );
  }

  function moveOrder(orderId: string, nextStatus: OrderStatus, message: string) {
    const movedOrder = orderList.find((order) => order.id === orderId);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setOrderList((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
    if (movedOrder?.sourceId) {
      updateStoredOrderStatus(movedOrder.sourceId, nextStatus);
    }
    setSelectedOrderId((currentId) => (currentId === orderId ? null : currentId));
    setToastMessage(message);
    setLastMovedOrderId(orderId);

    if (moveFeedbackTimer.current) {
      clearTimeout(moveFeedbackTimer.current);
    }
    moveFeedbackTimer.current = setTimeout(() => setLastMovedOrderId(null), 520);
  }

  function moveSelectedOrder(nextStatus: OrderStatus, message: string) {
    if (!selectedOrder) return;

    moveOrder(selectedOrder.id, nextStatus, message);
  }

  function cancelSelectedOrder() {
    if (!selectedOrder) return;

    setOrderList((currentOrders) => currentOrders.filter((order) => order.id !== selectedOrder.id));
    if (selectedOrder.sourceId) {
      removeStoredOrder(selectedOrder.sourceId);
    }
    setSelectedOrderId(null);
    setToastMessage(`O pedido da ${selectedOrder.table} foi cancelado.`);
  }

  function resetDay() {
    setOrderList(orders);
    clearStoredOrders();
    setItems(initialItems);
    setSelectedOrderId(null);
    setToastMessage("O dia foi reiniciado.");
  }

  function startDragging(ticket: BoardTicket, event: DragEvent<HTMLElement>) {
    const order = orderList.find((current) => current.id === ticket.id);
    if (order?.status !== "waiting") return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", order.id);
    setDraggedOrderId(order.id);
  }

  function stopDragging() {
    setDraggedOrderId(null);
    setDragOverStatus(null);
  }

  function handleDragOver(status: OrderStatus, event: DragEvent<HTMLElement>) {
    if (!draggedOrderId || status !== "production") return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  }

  function handleDragLeave(status: OrderStatus, event: DragEvent<HTMLElement>) {
    if (status !== "production") return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return;

    setDragOverStatus(null);
  }

  function handleDrop(status: OrderStatus, event: DragEvent<HTMLElement>) {
    event.preventDefault();

    if (!draggedOrderId || status !== "production") {
      stopDragging();
      return;
    }

    const draggedOrder = orderList.find((order) => order.id === draggedOrderId);
    if (draggedOrder?.status === "waiting") {
      moveOrder(draggedOrder.id, "production", `O preparo do pedido da ${draggedOrder.table} iniciou.`);
    }
    stopDragging();
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedStatus = selectedOrder ? orderStatus[selectedOrder.status] : null;

  function advanceSelectedOrder() {
    if (!selectedOrder) return;
    if (selectedOrder.status === "waiting") moveSelectedOrder("production", `O preparo do pedido da ${selectedOrder.table} iniciou.`);
    else if (selectedOrder.status === "production") moveSelectedOrder("ready", `O pedido da ${selectedOrder.table} foi concluído.`);
  }

  return (
    <div className="kitchen-page" data-type-context="webapp">
      <AppNavigation
        activeId={activeSection}
        brand={<Wordmark compact size="sm" />}
        footerItems={footerItems}
        items={navigationItems}
        onNavigate={(section) => { setSelectedOrderId(null); setActiveSection(section); }}
        variant="rail"
      />
      <div className="kitchen-workspace">
        {activeSection === "menu" ? <KitchenMenu onFeedback={setToastMessage} /> : (
          <>
            <PageHeader
              actions={<Button onPress={resetDay} variant="ghost"><RefreshCw aria-hidden="true" size={18} strokeWidth={1.8} />Reiniciar o dia</Button>}
              description="Acompanhe os pedidos dos clientes"
              icon={Home}
              title="Home"
            />
            <main className="kitchen-main kitchen-board">
              {columns.map((status) => (
                <OrderBoardColumn
                  draggedId={draggedOrderId}
                  dropHint="Solte aqui para iniciar preparo"
                  emptyText={emptyColumnText[status]}
                  highlightId={lastMovedOrderId}
                  icon={orderStatus[status].icon}
                  isDropTarget={dragOverStatus === status}
                  key={status}
                  label={orderStatus[status].label}
                  onDragEnd={stopDragging}
                  onDragLeave={(event) => handleDragLeave(status, event)}
                  onDragOver={(event) => handleDragOver(status, event)}
                  onDragStart={startDragging}
                  onDrop={(event) => handleDrop(status, event)}
                  onSelect={(ticket) => selectOrder(ticket.id)}
                  tickets={orderList.filter((order) => order.status === status).map((order) => ({ draggable: order.status === "waiting", id: order.id, subtitle: order.itemCount, title: order.table }))}
                  tone={orderStatus[status].tone}
                />
              ))}
            </main>
          </>
        )}
      </div>

      {selectedOrder && selectedStatus ? (
        <SidePanel
          eyebrow="Detalhes do pedido"
          footer={(
            <>
              <CheckoutBar
                action={{ disabled: !selectedStatus.action, label: selectedStatus.action ?? "Pedido concluído", onPress: advanceSelectedOrder }}
                amount={total}
                placement="inline"
              />
              <Button fullWidth onPress={cancelSelectedOrder} variant="ghost">Cancelar pedido</Button>
            </>
          )}
          onClose={() => setSelectedOrderId(null)}
          title={selectedOrder.table}
        >
          <section className="wa-panel-section">
            <h3>Status do pedido</h3>
            <StatusBadge tone={selectedStatus.tone}>{selectedStatus.label}</StatusBadge>
          </section>
          <section className="wa-panel-section">
            <h3>Itens</h3>
            {items.map((item) => (
              <OrderLine item={item} key={item.id} minQuantity={1} onDecrement={() => updateQuantity(item.id, -1)} onIncrement={() => updateQuantity(item.id, 1)} />
            ))}
          </section>
        </SidePanel>
      ) : null}

      {toastMessage ? <Toast key={toastMessage} message={toastMessage} onClose={() => setToastMessage(null)} showProgress /> : null}
    </div>
  );
}
