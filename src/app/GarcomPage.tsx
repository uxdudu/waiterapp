import { useEffect, useState } from "react";
import { Bell, Check, CircleUserRound, Home, ReceiptText, X } from "lucide-react";
import splashBackgroundComplete from "../assets/figma/splash-background-complete.svg";
import splashBackgroundSimple from "../assets/figma/splash-background-simple.svg";
import splashCharacterOne from "../assets/figma/splash-character-1.svg";
import splashCharacterTwo from "../assets/figma/splash-character-2.svg";
import splashShadow from "../assets/figma/splash-shadow.svg";
import { Button, DeviceStatusBar, EmptyState, IconButton, SearchField, Thumbnail, Toast, Wordmark } from "../components/base";
import { AppNavigation, CategoryRail, CheckoutBar, FeedbackScreen, IngredientList, OrderLine, OrderSummaryCard, PageHeader, ProductCard, ProfileEditor, TableSelect, type AppNavigationItem, type OrderSummaryData } from "../components/blocks";
import { formatItemCount } from "../lib/format";
import { orderStatus } from "../lib/order-status";
import { createStoredOrder, ordersChangedEvent, readStoredOrders, type StoredOrder } from "../lib/order-store";
import { categories, previousOrders, productImage, products, sampleOrdersInProgress, tables, type Product, type ProductCategory } from "./garcom-data";
import { GarcomProfile } from "./GarcomProfile";
import { sampleWaiterProfile } from "./garcom-profile-data";
import "./surfaces/garcom.css";

type GarcomTab = "home" | "orders" | "profile";

const navigationItems: AppNavigationItem<GarcomTab>[] = [
  { icon: Home, id: "home", label: "Home" },
  { icon: ReceiptText, id: "orders", label: "Pedidos" },
  { icon: CircleUserRound, id: "profile", label: "Meu Perfil" },
];

function storedOrderToSummary(order: StoredOrder): OrderSummaryData {
  return {
    items: order.items.map((item) => ({ image: productImage(item.name), name: item.name, quantity: item.quantity })),
    status: orderStatus[order.status],
    title: order.table,
  };
}

function formatOrderNumber(orderId?: string) {
  if (!orderId) return "confirmado";
  return `#${orderId.replace("order-", "").slice(-4)}`;
}

function filterProducts(category: ProductCategory, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
  return products.filter((product) => {
    const matchesSearch = !normalizedSearch || `${product.name} ${product.description}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    return product.category === category && matchesSearch;
  });
}

function SplashIllustration() {
  return (
    <div aria-hidden="true" className="garcom-splash-illustration">
      <img alt="" className="garcom-splash-illustration__background-complete" src={splashBackgroundComplete} />
      <img alt="" className="garcom-splash-illustration__background-simple" src={splashBackgroundSimple} />
      <img alt="" className="garcom-splash-illustration__shadow" src={splashShadow} />
      <img alt="" className="garcom-splash-illustration__character-one" src={splashCharacterOne} />
      <img alt="" className="garcom-splash-illustration__character-two" src={splashCharacterTwo} />
    </div>
  );
}

function MenuBrowser({ category, onAdd, onOpen, onSearchChange, onSelectCategory, searchTerm }: { category: ProductCategory; onAdd: (product: Product) => void; onOpen: (product: Product) => void; onSearchChange: (value: string) => void; onSelectCategory: (category: ProductCategory) => void; searchTerm: string }) {
  const visibleProducts = filterProducts(category, searchTerm);

  return (
    <>
      <div className="garcom-section">
        <CategoryRail items={categories} label="Categorias de produtos" onSelect={onSelectCategory} selectedId={category} variant="tile" />
        <SearchField label="Buscar no cardápio" onChange={onSearchChange} value={searchTerm} variant="filled" />
      </div>
      <main className="garcom-section garcom-product-list">
        {visibleProducts.length > 0 ? visibleProducts.map((product) => (
          <ProductCard key={product.id} onAdd={() => onAdd(product)} onOpen={() => onOpen(product)} product={product} />
        )) : <EmptyState description="Tente outra busca ou categoria." title="Nenhum item encontrado" />}
      </main>
    </>
  );
}

export function GarcomPage() {
  const [profile, setProfile] = useState(sampleWaiterProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("pizzas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTable, setSelectedTable] = useState("Mesa 3");
  const [tab, setTab] = useState<GarcomTab>("home");
  const [showOrder, setShowOrder] = useState(false);
  const [confirmationOrder, setConfirmationOrder] = useState<StoredOrder | null>(null);
  const [currentOrders, setCurrentOrders] = useState<OrderSummaryData[]>(sampleOrdersInProgress);

  const cartProducts = products.filter((product) => cartItems[product.id]);
  const itemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  const total = cartProducts.reduce((sum, product) => sum + product.price * (cartItems[product.id] ?? 0), 0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowSplash(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const syncOrders = () => setCurrentOrders([...sampleOrdersInProgress, ...readStoredOrders().map(storedOrderToSummary)]);

    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener(ordersChangedEvent, syncOrders);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener(ordersChangedEvent, syncOrders);
    };
  }, []);

  useEffect(() => {
    if (!profileSaved) return;
    const timeoutId = window.setTimeout(() => setProfileSaved(false), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [profileSaved]);

  function updateQuantity(productId: string, delta: number) {
    setCartItems((current) => {
      const next = { ...current };
      const quantity = (next[productId] ?? 0) + delta;
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  function cancelOrder() {
    setCartItems({});
    setShowOrder(false);
    setTab("home");
  }

  function confirmOrder() {
    const items = cartProducts.map((product) => ({ name: product.name, price: product.price, quantity: cartItems[product.id] ?? 0 }));
    setConfirmationOrder(createStoredOrder({ items, table: selectedTable }));
  }

  function finishConfirmation() {
    setCartItems({});
    setConfirmationOrder(null);
    setShowOrder(false);
    setTab("orders");
  }

  const navigation = <AppNavigation activeId={tab} items={navigationItems} onNavigate={setTab} variant="bottom" />;
  let screen;

  if (showSplash) {
    screen = <FeedbackScreen description="O App do Garçom" label="Waiterapp carregando" media={<SplashIllustration />} title={<Wordmark size="lg" tone="inverse" />} />;
  } else if (confirmationOrder) {
    const confirmedCount = confirmationOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    screen = (
      <FeedbackScreen
        action={<Button onPress={finishConfirmation} size="lg" variant="inverse">Ver pedidos</Button>}
        description={<>{confirmationOrder.table} · {formatItemCount(confirmedCount)}<br />O pedido já entrou na fila de produção!</>}
        title={<><Check aria-hidden="true" size={24} strokeWidth={2.4} />Pedido {formatOrderNumber(confirmationOrder.id)}</>}
      />
    );
  } else if (selectedProduct) {
    screen = (
      <div className="garcom-screen garcom-screen--detail">
        <div className="garcom-detail-hero">
          <Thumbnail fallback={selectedProduct.icon} size="hero" src={selectedProduct.image} />
          <IconButton className="garcom-detail-hero__close" label="Fechar detalhes do produto" onPress={() => setSelectedProduct(null)} variant="surface">
            <X aria-hidden="true" size={24} strokeWidth={1.8} />
          </IconButton>
        </div>
        <main className="garcom-section garcom-detail-content">
          <PageHeader description={selectedProduct.description} title={selectedProduct.name} />
          <IngredientList items={selectedProduct.ingredients} />
        </main>
        <CheckoutBar
          action={{ label: "Adicionar ao pedido", onPress: () => { updateQuantity(selectedProduct.id, 1); setSelectedProduct(null); } }}
          amount={selectedProduct.price}
          label="Preço"
        />
      </div>
    );
  } else if (showOrder) {
    screen = (
      <div className="garcom-screen garcom-screen--checkout">
        <DeviceStatusBar />
        <div className="garcom-section">
          <PageHeader actions={<Button onPress={cancelOrder} variant="ghost">cancelar pedido</Button>} title="Pedido" />
          <TableSelect onChange={setSelectedTable} options={tables} value={selectedTable} />
        </div>
        <MenuBrowser category={selectedCategory} onAdd={(product) => updateQuantity(product.id, 1)} onOpen={setSelectedProduct} onSearchChange={setSearchTerm} onSelectCategory={setSelectedCategory} searchTerm={searchTerm} />
        <CheckoutBar action={{ disabled: itemCount === 0, label: "Confirmar pedido", onPress: confirmOrder }} amount={total} emptyText="Seu carrinho está vazio">
          {cartProducts.length ? cartProducts.map((product) => (
            <OrderLine
              item={{ ...product, quantity: cartItems[product.id] ?? 0 }}
              key={product.id}
              onDecrement={() => updateQuantity(product.id, -1)}
              onIncrement={() => updateQuantity(product.id, 1)}
            />
          )) : null}
        </CheckoutBar>
      </div>
    );
  } else if (tab === "profile") {
    screen = (
      <div className="garcom-screen garcom-screen--nav garcom-screen--profile">
        <GarcomProfile onEdit={() => setEditingProfile(true)} onOpenOrders={() => setTab("orders")} openOrderCount={currentOrders.length} profile={profile} />
        {navigation}
      </div>
    );
  } else if (tab === "orders") {
    screen = (
      <div className="garcom-screen garcom-screen--nav">
        <main className="garcom-section garcom-history">
          <PageHeader title="Pedidos" />
          <section aria-labelledby="in-progress-heading" className="garcom-history__group">
            <h2 id="in-progress-heading">Em andamento</h2>
            <div className="garcom-history__list">
              {currentOrders.length ? currentOrders.map((order, index) => <OrderSummaryCard key={`${order.title}-${index}`} order={order} />) : <EmptyState title="Nenhum pedido em andamento." />}
            </div>
          </section>
          <section aria-labelledby="previous-heading" className="garcom-history__group">
            <h2 id="previous-heading">Anteriores</h2>
            <div className="garcom-history__list">
              {previousOrders.map((order, index) => <OrderSummaryCard key={`${order.title}-${index}`} order={order} />)}
            </div>
          </section>
        </main>
        {navigation}
      </div>
    );
  } else {
    screen = (
      <div className="garcom-screen garcom-screen--nav">
        <div className="garcom-section">
          <PageHeader
            actions={(
              <IconButton badge={itemCount} label={`Abrir pedidos${itemCount > 0 ? `, ${formatItemCount(itemCount)}` : ""}`} onPress={() => setShowOrder(true)}>
                <Bell aria-hidden="true" size={16} strokeWidth={2} />
              </IconButton>
            )}
            eyebrow="Bem-vindo(a) ao"
            title={<Wordmark />}
          />
        </div>
        <MenuBrowser category={selectedCategory} onAdd={(product) => updateQuantity(product.id, 1)} onOpen={setSelectedProduct} onSearchChange={setSearchTerm} onSelectCategory={setSelectedCategory} searchTerm={searchTerm} />
        {navigation}
      </div>
    );
  }

  return <div className="garcom-page" data-type-context="app">
    {screen}
    {editingProfile ? <ProfileEditor onClose={() => setEditingProfile(false)} onSave={(next) => { setProfile(next); setEditingProfile(false); setProfileSaved(true); }} profile={profile} /> : null}
    {profileSaved ? <Toast message="Perfil atualizado" onClose={() => setProfileSaved(false)} showProgress /> : null}
  </div>;
}
