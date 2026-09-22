import { type DragEvent, useEffect, useRef, useState } from "react";
import { Button, Card, Chip, Tabs } from "@heroui/react";
import { CheckCircle2, ClipboardList, Home, LogOut, Minus, Pencil, Plus, RefreshCw, Trash2, UserRound, UsersRound, UtensilsCrossed, X } from "lucide-react";
import chickenImage from "../assets/figma/dish-2.jpeg";
import cheeseImage from "../assets/figma/dish-4.jpeg";
import kitchenWebActiveIndicator from "../assets/figma/kitchen-web-active-indicator.svg";
import { clearStoredOrders, ordersChangedEvent, readStoredOrders, removeStoredOrder, updateStoredOrderStatus } from "../lib/order-store";

type OrderStatus = "waiting" | "production" | "ready";
type KitchenSection = "home" | "menu";

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
  image: string;
};

const columns: Array<{
  status: OrderStatus;
  icon: string;
  label: string;
}> = [
  { status: "waiting", icon: "🕑", label: "Fila de espera" },
  { status: "production", icon: "👩‍🍳", label: "Em produção" },
  { status: "ready", icon: "✅", label: "Pronto" },
];

const orders: Order[] = [
  { id: "waiting-table-2", table: "Mesa 2", itemCount: "2 itens", status: "waiting" },
  { id: "production-table-2", table: "Mesa 2", itemCount: "2 itens", status: "production" },
  { id: "ready-table-2", table: "Mesa 2", itemCount: "1 item", status: "ready" },
];

const initialItems: OrderItem[] = [
  { id: "chicken", name: "Frango com Catupiry", quantity: 1, price: 40, image: chickenImage },
  { id: "cheese", name: "Quatro Queijos", quantity: 2, price: 40, image: cheeseImage },
];

type MenuProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const initialMenuProducts: MenuProduct[] = [
  { id: "quatro-queijos-1", name: "Quatro Queijos", price: 40, image: cheeseImage },
  { id: "quatro-queijos-2", name: "Quatro Queijos", price: 40, image: cheeseImage },
  { id: "quatro-queijos-3", name: "Quatro Queijos", price: 40, image: cheeseImage },
];

function readOrdersForKitchen(): Order[] {
  return readStoredOrders().map((order) => {
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      id: `stored-${order.id}`,
      itemCount: `${quantity} ${quantity === 1 ? "item" : "itens"}`,
      sourceId: order.id,
      status: order.status,
      table: order.table,
    };
  });
}

const TOAST_DURATION = 4500;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function KitchenSidebar({
  active,
  onNavigate,
}: {
  active: KitchenSection;
  onNavigate: (section: KitchenSection) => void;
}) {
  const mainMenu = [
    { id: "home" as const, label: "Home", icon: Home, enabled: true },
    { id: "history" as const, label: "Histórico", icon: ClipboardList, enabled: false },
    { id: "menu" as const, label: "Cardápio", icon: UtensilsCrossed, enabled: true },
    { id: "users" as const, label: "Usuários", icon: UsersRound, enabled: false },
  ];

  return (
    <aside aria-label="Navegação principal" className="kitchen-sidebar">
      <div className="kitchen-sidebar__top">
        <div aria-label="Waiterapp" className="kitchen-sidebar__brand">
          <strong>W</strong><span>A</span>
        </div>
        <nav className="kitchen-sidebar__main-nav">
          {mainMenu.map((item) => (
            <Button
              aria-current={active === item.id ? "page" : undefined}
              className={`kitchen-sidebar__item ${active === item.id ? "kitchen-sidebar__item--active" : ""}`}
              isDisabled={!item.enabled}
              onPress={() => item.enabled && onNavigate(item.id === "menu" ? "menu" : "home")}
              key={item.label}
              variant="ghost"
            >
              <item.icon aria-hidden="true" size={22} strokeWidth={1.8} />
              <span>{item.label}</span>
              {active === item.id ? <img alt="" className="kitchen-sidebar__active-indicator" src={kitchenWebActiveIndicator} /> : null}
            </Button>
          ))}
        </nav>
      </div>
      <div className="kitchen-sidebar__bottom">
        <Button className="kitchen-sidebar__item" isDisabled variant="ghost">
          <UserRound aria-hidden="true" size={22} strokeWidth={1.8} />
          <span>Meu Perfil</span>
        </Button>
        <Button className="kitchen-sidebar__item" isDisabled variant="ghost">
          <LogOut aria-hidden="true" size={22} strokeWidth={1.8} />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
}

function KitchenWorkspaceHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="kitchen-workspace-header">
      <div className="kitchen-workspace-header__title">
        <div className="kitchen-workspace-header__heading">
          <Home aria-hidden="true" size={22} strokeWidth={1.8} />
          <h1>Home</h1>
        </div>
        <p>Acompanhe os pedidos dos clientes</p>
      </div>
      <Button className="kitchen-reset-day" onPress={onReset} variant="ghost">
        <RefreshCw aria-hidden="true" size={18} strokeWidth={1.8} />
        Reiniciar o dia
      </Button>
    </header>
  );
}

function KitchenMenuPage() {
  const [menuProducts, setMenuProducts] = useState(initialMenuProducts);
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="kitchen-menu-workspace">
      <header className="kitchen-menu-header">
        <div className="kitchen-menu-header__heading">
          <UtensilsCrossed aria-hidden="true" size={22} strokeWidth={1.8} />
          <h1>Cardápio</h1>
        </div>
        <p>Gerencie os produtos do seu estabelecimento</p>
      </header>

      <main className="kitchen-menu-main">
        <Tabs className="kitchen-menu-tabs" defaultSelectedKey="products" variant="primary">
          <Tabs.List>
            <Tabs.Tab className="kitchen-menu-tab kitchen-menu-tab--active" id="products">Produtos</Tabs.Tab>
            <Tabs.Tab className="kitchen-menu-tab" id="categories" isDisabled>Categorias</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <section aria-labelledby="menu-products-heading" className="kitchen-menu-products">
          <div className="kitchen-menu-products__heading">
            <div className="kitchen-menu-products__title">
              <h2 id="menu-products-heading">Produtos</h2>
              <span>{menuProducts.length}</span>
            </div>
            <Button className="kitchen-menu-new-product" onPress={() => setFeedback("Cadastro de produto em breve.")} variant="primary">
              Novo Produto
            </Button>
          </div>

          <Card className="kitchen-menu-table" role="table" variant="default">
            <div className="kitchen-menu-table__row kitchen-menu-table__row--header" role="row">
              <span role="columnheader">Imagem</span>
              <span role="columnheader">Nome</span>
              <span role="columnheader">Categoria</span>
              <span role="columnheader">Preço</span>
              <span role="columnheader">Ações</span>
            </div>
            {menuProducts.map((product) => (
              <div className="kitchen-menu-table__row" key={product.id} role="row">
                <span className="kitchen-menu-table__image" role="cell">
                  <img alt="" src={product.image} />
                </span>
                <span role="cell">{product.name}</span>
                <span className="kitchen-menu-table__category" role="cell"><span aria-hidden="true">🍕</span> Pizza</span>
                <span role="cell">{formatCurrency(product.price)}</span>
                <span className="kitchen-menu-table__actions" role="cell">
                  <Button aria-label={`Editar ${product.name}`} isIconOnly onPress={() => setFeedback(`Edição de ${product.name} em breve.`)} variant="ghost">
                    <Pencil aria-hidden="true" size={18} strokeWidth={1.8} />
                  </Button>
                  <Button aria-label={`Excluir ${product.name}`} isIconOnly onPress={() => setMenuProducts((current) => current.filter((item) => item.id !== product.id))} variant="ghost">
                    <Trash2 aria-hidden="true" size={18} strokeWidth={1.8} />
                  </Button>
                </span>
              </div>
            ))}
          </Card>
        </section>
      </main>

      {feedback ? <div aria-live="polite" className="kitchen-menu-feedback" role="status">{feedback}</div> : null}
    </div>
  );
}

function OrderColumn({
  column,
  columnOrders,
  isDropTarget,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  draggedOrderId,
  lastMovedOrderId,
}: {
  column: (typeof columns)[number];
  columnOrders: Order[];
  isDropTarget: boolean;
  onSelect: (order: Order) => void;
  onDragStart: (order: Order, event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onDragOver: (status: OrderStatus, event: DragEvent<HTMLElement>) => void;
  onDragLeave: (status: OrderStatus, event: DragEvent<HTMLElement>) => void;
  onDrop: (status: OrderStatus, event: DragEvent<HTMLElement>) => void;
  draggedOrderId: string | null;
  lastMovedOrderId: string | null;
}) {
  return (
    <section
      aria-labelledby={`${column.status}-heading`}
      className={`kitchen-column kitchen-column--${column.status} ${isDropTarget ? "kitchen-column--drop-target" : ""}`}
      onDragLeave={(event) => onDragLeave(column.status, event)}
      onDragOver={(event) => onDragOver(column.status, event)}
      onDrop={(event) => onDrop(column.status, event)}
    >
      <div className="kitchen-column__status" id={`${column.status}-heading`}>
        <span aria-hidden="true">{column.icon}</span>
        <strong>{column.label}</strong>
        <Chip className="kitchen-column__count" size="sm" variant="soft">{columnOrders.length}</Chip>
      </div>
      {isDropTarget ? <div className="kitchen-column__drop-hint">Solte aqui para iniciar preparo</div> : null}
      {columnOrders.length === 0 && !isDropTarget ? (
        <div className="kitchen-column__empty">
          <span aria-hidden="true">{column.status === "waiting" ? "✓" : "—"}</span>
          <p>{column.status === "waiting" ? "A fila está livre" : `Nenhum pedido ${column.status === "production" ? "em preparo" : "pronto"}`}</p>
        </div>
      ) : null}
      {columnOrders.map((order) => (
        <Card
          aria-grabbed={draggedOrderId === order.id}
          className={`kitchen-order-card ${order.status === "waiting" ? "kitchen-order-card--draggable" : ""} ${
            draggedOrderId === order.id ? "kitchen-order-card--dragging" : ""
          } ${lastMovedOrderId === order.id ? "kitchen-order-card--entered" : ""}`}
          draggable={order.status === "waiting"}
          key={order.id}
          onClick={() => onSelect(order)}
          onDragEnd={onDragEnd}
          onDragStart={(event) => onDragStart(order, event)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(order);
            }
          }}
          role="button"
          tabIndex={0}
          variant="default"
        >
          <span>{order.table}</span>
          <small>{order.itemCount}</small>
        </Card>
      ))}
    </section>
  );
}

function KitchenToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div aria-live="polite" className="kitchen-toast" role="status">
      <CheckCircle2 aria-hidden="true" className="kitchen-toast__success-icon" size={24} strokeWidth={2} />
      <p>{message}</p>
      <Button aria-label="Fechar notificação" className="kitchen-toast__close" isIconOnly onPress={onClose} variant="ghost">
        <X aria-hidden="true" size={20} strokeWidth={1.8} />
      </Button>
      <div aria-hidden="true" className="kitchen-toast__progress" />
    </div>
  );
}

function OrderDrawer({
  order,
  items,
  onClose,
  onAction,
  onCancel,
  onUpdateQuantity,
}: {
  order: Order;
  items: OrderItem[];
  onClose: () => void;
  onAction: () => void;
  onCancel: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const statusDetails: Record<OrderStatus, { icon: string; label: string; action: string }> = {
    waiting: { icon: "🕑", label: "Fila de espera", action: "Iniciar preparo" },
    production: { icon: "👩‍🍳", label: "Em produção", action: "Concluir Pedido" },
    ready: { icon: "✅", label: "Pronto!", action: "Pedido concluído" },
  };
  const currentStatus = statusDetails[order.status];

  return (
    <>
      <Button aria-label="Fechar detalhes do pedido" className="kitchen-drawer__backdrop" onPress={onClose} variant="ghost" />
      <aside aria-label={`Detalhes do pedido da ${order.table}`} className="kitchen-drawer">
        <div className="kitchen-drawer__topline">
          <h2>{order.table}</h2>
          <Button aria-label="Fechar detalhes" className="kitchen-drawer__close" isIconOnly onPress={onClose} variant="ghost">
            <X aria-hidden="true" size={22} strokeWidth={1.8} />
          </Button>
        </div>

        <div className="kitchen-drawer__section">
          <span className="kitchen-drawer__label">Status do Pedido</span>
          <div className="kitchen-drawer__status">
            <span aria-hidden="true">{currentStatus.icon}</span>
            <strong>{currentStatus.label}</strong>
          </div>
        </div>

        <div className="kitchen-drawer__section kitchen-drawer__items">
          <span className="kitchen-drawer__label">Itens</span>
          <div className="kitchen-drawer__item-list">
            {items.map((item) => (
              <div className="kitchen-drawer__item" key={item.id}>
                <img alt="" src={item.image} />
                <div className="kitchen-drawer__item-main">
                  <div className="kitchen-drawer__item-copy">
                    <span>{item.quantity}x</span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{formatCurrency(item.price)}</small>
                    </div>
                  </div>
                  <div className="kitchen-drawer__quantity" aria-label={`Quantidade de ${item.name}`}>
                    <Button
                      aria-label={`Adicionar ${item.name}`}
                      isIconOnly
                      onPress={() => onUpdateQuantity(item.id, 1)}
                      variant="ghost"
                    >
                      <Plus aria-hidden="true" size={18} strokeWidth={2} />
                    </Button>
                    <Button
                      aria-label={`Remover ${item.name}`}
                      isDisabled={item.quantity <= 1}
                      isIconOnly
                      onPress={() => onUpdateQuantity(item.id, -1)}
                      variant="ghost"
                    >
                      <Minus aria-hidden="true" size={18} strokeWidth={2} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="kitchen-drawer__total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </div>

        <div className="kitchen-drawer__actions">
          <Button
            className="kitchen-drawer__complete"
            isDisabled={order.status === "ready"}
            onPress={onAction}
            variant="primary"
          >
            <span aria-hidden="true">{order.status === "waiting" ? "👩‍🍳" : "✅"}</span>
            {currentStatus.action}
          </Button>
          <Button className="kitchen-drawer__cancel" onPress={onCancel} variant="ghost">
            Cancelar Pedido
          </Button>
        </div>
      </aside>
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

  function updateQuantity(id: string, delta: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
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

  function startDragging(order: Order, event: DragEvent<HTMLElement>) {
    if (order.status !== "waiting") return;

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

  if (activeSection === "menu") {
    return (
      <div className="kitchen-page">
        <KitchenSidebar active="menu" onNavigate={setActiveSection} />
        <KitchenMenuPage />
      </div>
    );
  }

  return (
    <div className="kitchen-page">
      <KitchenSidebar active="home" onNavigate={setActiveSection} />
      <div className="kitchen-workspace">
        <KitchenWorkspaceHeader onReset={resetDay} />
        <main className="kitchen-main">
          <div className="kitchen-orders-grid">
            {columns.map((column) => (
              <OrderColumn
                column={column}
                columnOrders={
                  orderList.filter((order) => order.status === column.status)
                }
                draggedOrderId={draggedOrderId}
                isDropTarget={dragOverStatus === column.status}
                key={column.status}
                lastMovedOrderId={lastMovedOrderId}
                onDragEnd={stopDragging}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDragStart={startDragging}
                onDrop={handleDrop}
                onSelect={(order) => setSelectedOrderId(order.id)}
              />
            ))}
          </div>
        </main>
      </div>

      {selectedOrder ? (
        <OrderDrawer
          order={selectedOrder}
          items={items}
          onAction={() => {
            if (selectedOrder.status === "waiting") {
              moveSelectedOrder("production", `O preparo do pedido da ${selectedOrder.table} iniciou.`);
            } else if (selectedOrder.status === "production") {
              moveSelectedOrder("ready", `O pedido da ${selectedOrder.table} foi concluído.`);
            }
          }}
          onCancel={cancelSelectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onUpdateQuantity={updateQuantity}
        />
      ) : null}

      {toastMessage ? (
        <KitchenToast key={toastMessage} message={toastMessage} onClose={() => setToastMessage(null)} />
      ) : null}
    </div>
  );
}
