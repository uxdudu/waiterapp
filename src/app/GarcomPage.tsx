import { useEffect, useState } from "react";
import { Button, Card, Chip, Input } from "@heroui/react";
import { Bell, Check, ChevronDown, CircleUserRound, Home, Minus, Plus, ReceiptText, Search, X } from "lucide-react";
import cheeseDetailImage from "../assets/figma/garcom-raw-1.jpeg";
import batteryEnd from "../assets/figma/home-battery-end.svg";
import batteryFill from "../assets/figma/home-battery-fill.svg";
import batteryOutline from "../assets/figma/home-battery-outline.svg";
import divider from "../assets/figma/home-divider.svg";
import homeActiveIndicator from "../assets/figma/home-active-indicator.svg";
import mobileSignal from "../assets/figma/home-signal.svg";
import wifi from "../assets/figma/home-wifi.svg";
import chickenImage from "../assets/figma/garcom-raw-6.jpeg";
import cheeseImage from "../assets/figma/garcom-raw-3.jpeg";
import margaritaImage from "../assets/figma/garcom-raw-2.jpeg";
import confirmationBatteryEnd from "../assets/figma/confirmation-battery-end.svg";
import confirmationBatteryFill from "../assets/figma/confirmation-battery-fill.svg";
import confirmationBatteryOutline from "../assets/figma/confirmation-battery-outline.svg";
import confirmationSignal from "../assets/figma/confirmation-signal.svg";
import confirmationWifi from "../assets/figma/confirmation-wifi.svg";
import splashBackgroundComplete from "../assets/figma/splash-background-complete.svg";
import splashBackgroundSimple from "../assets/figma/splash-background-simple.svg";
import splashCharacterOne from "../assets/figma/splash-character-1.svg";
import splashCharacterTwo from "../assets/figma/splash-character-2.svg";
import splashShadow from "../assets/figma/splash-shadow.svg";
import { createStoredOrder, readStoredOrders, type StoredOrder, ordersChangedEvent } from "../lib/order-store";

type ProductCategory = "pizzas" | "bebidas" | "lanches" | "sobremesas" | "promocoes";

type Product = {
  id: string;
  category: ProductCategory;
  icon?: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image?: string;
};

const products: Product[] = [
  {
    id: "quatro-queijos",
    category: "pizzas",
    name: "Quatro Queijos",
    description: "Pizza de Quatro Queijos com borda tradicional",
    ingredients: ["Prato", "Cheddar", "Mussarela", "Parmesão", "Cebola"],
    price: 40,
    image: cheeseImage,
  },
  {
    id: "frango-catupiry",
    category: "pizzas",
    name: "Frango com Catupiry",
    description: "Pizza de Frango com Catupiry e borda tradicional",
    ingredients: ["Frango", "Catupiry", "Mussarela", "Orégano"],
    price: 45,
    image: chickenImage,
  },
  {
    id: "marguerita",
    category: "pizzas",
    name: "Marguerita",
    description: "Pizza de Marguerita no melhor estilo italiano",
    ingredients: ["Tomate", "Mussarela", "Manjericão", "Azeite"],
    price: 50,
    image: margaritaImage,
  },
  {
    id: "calabresa",
    category: "pizzas",
    name: "Calabresa Especial",
    description: "Calabresa fatiada, cebola roxa e azeitonas",
    ingredients: ["Calabresa", "Cebola roxa", "Azeitona", "Mussarela"],
    price: 42,
    image: cheeseImage,
  },
  {
    id: "portuguesa",
    category: "pizzas",
    name: "Portuguesa",
    description: "Presunto, ovo, cebola, ervilha e mussarela",
    ingredients: ["Presunto", "Ovo", "Cebola", "Ervilha", "Mussarela"],
    price: 46,
    image: chickenImage,
  },
  {
    id: "pepperoni",
    category: "pizzas",
    name: "Pepperoni",
    description: "Pepperoni artesanal e mussarela cremosa",
    ingredients: ["Pepperoni", "Mussarela", "Orégano"],
    price: 49,
    image: margaritaImage,
  },
  {
    id: "coca-cola",
    category: "bebidas",
    name: "Coca-Cola 350ml",
    description: "Refrigerante gelado em lata",
    ingredients: ["Coca-Cola"],
    price: 6,
    icon: "🥤",
  },
  {
    id: "guarana",
    category: "bebidas",
    name: "Guaraná Antarctica 350ml",
    description: "Refrigerante gelado em lata",
    ingredients: ["Guaraná Antarctica"],
    price: 6,
    icon: "🥤",
  },
  {
    id: "agua",
    category: "bebidas",
    name: "Água mineral",
    description: "Água mineral sem gás 500ml",
    ingredients: ["Água mineral"],
    price: 4,
    icon: "💧",
  },
  {
    id: "suco-laranja",
    category: "bebidas",
    name: "Suco de laranja",
    description: "Suco natural preparado na hora",
    ingredients: ["Laranja", "Gelo"],
    price: 9,
    icon: "🍊",
  },
  {
    id: "hamburguer",
    category: "lanches",
    name: "Burger da Casa",
    description: "Pão brioche, blend da casa, queijo e molho especial",
    ingredients: ["Pão brioche", "Blend 160g", "Queijo", "Molho especial"],
    price: 28,
    icon: "🍔",
  },
  {
    id: "batata",
    category: "lanches",
    name: "Batata com cheddar",
    description: "Batata frita crocante com cheddar cremoso",
    ingredients: ["Batata", "Cheddar", "Cebolinha"],
    price: 22,
    icon: "🍟",
  },
  {
    id: "frango-frito",
    category: "lanches",
    name: "Tiras de frango",
    description: "Tiras de frango crocantes com molho da casa",
    ingredients: ["Frango", "Farinha crocante", "Molho da casa"],
    price: 25,
    icon: "🍗",
  },
  {
    id: "brownie",
    category: "sobremesas",
    name: "Brownie com sorvete",
    description: "Brownie de chocolate servido com sorvete de creme",
    ingredients: ["Chocolate", "Castanhas", "Sorvete de creme"],
    price: 18,
    icon: "🍫",
  },
  {
    id: "pudim",
    category: "sobremesas",
    name: "Pudim de leite",
    description: "Pudim cremoso com calda de caramelo",
    ingredients: ["Leite", "Ovos", "Caramelo"],
    price: 14,
    icon: "🍮",
  },
  {
    id: "sorvete",
    category: "sobremesas",
    name: "Sorvete artesanal",
    description: "Duas bolas de sorvete do dia",
    ingredients: ["Sorvete artesanal"],
    price: 12,
    icon: "🍨",
  },
  {
    id: "combo-familia",
    category: "promocoes",
    name: "Combo Família",
    description: "Pizza grande, refrigerante 2L e sobremesa",
    ingredients: ["Pizza grande", "Refrigerante 2L", "Sobremesa"],
    price: 79,
    icon: "🏷",
  },
  {
    id: "dupla-pizzas",
    category: "promocoes",
    name: "Dupla de pizzas",
    description: "Duas pizzas grandes com sabores à escolha",
    ingredients: ["Duas pizzas grandes", "Borda tradicional"],
    price: 89,
    icon: "🏷",
  },
];

const categories = [
  { id: "pizzas" as const, icon: "🍕", label: "Pizzas" },
  { id: "bebidas" as const, icon: "🥤", label: "Bebidas" },
  { id: "lanches" as const, icon: "🍔", label: "Lanches" },
  { id: "sobremesas" as const, icon: "🍰", label: "Sobremesas" },
  { id: "promocoes" as const, icon: "🏷", label: "Promoções" },
];

type HistoryOrder = {
  table: string;
  status: string;
  tone: "ready" | "production" | "finished";
  items: Array<{ quantity: number; name: string }>;
};

const inProgressOrders: HistoryOrder[] = [
  {
    table: "Mesa 123",
    status: "Pronto!",
    tone: "ready",
    items: [
      { quantity: 1, name: "Frango com Catupiry" },
      { quantity: 2, name: "Quatro Queijos" },
    ],
  },
  {
    table: "Mesa 123",
    status: "Entrou em produção",
    tone: "production",
    items: [
      { quantity: 1, name: "Frango com Catupiry" },
      { quantity: 2, name: "Quatro Queijos" },
    ],
  },
];

const previousOrders: HistoryOrder[] = [
  {
    table: "Mesa 123",
    status: "Finalizado em 07/12/2022",
    tone: "finished",
    items: [
      { quantity: 1, name: "Frango com Catupiry" },
      { quantity: 2, name: "Quatro Queijos" },
    ],
  },
  {
    table: "Mesa 123",
    status: "Finalizado em 07/12/2022",
    tone: "finished",
    items: [
      { quantity: 1, name: "Frango com Catupiry" },
      { quantity: 2, name: "Quatro Queijos" },
    ],
  },
];

function storedOrderToHistory(order: StoredOrder): HistoryOrder {
  const statusByOrderStatus: Record<StoredOrder["status"], { label: string; tone: HistoryOrder["tone"] }> = {
    waiting: { label: "Enviado para a cozinha", tone: "production" },
    production: { label: "Entrou em produção", tone: "production" },
    ready: { label: "Pronto!", tone: "ready" },
  };
  const status = statusByOrderStatus[order.status];

  return {
    items: order.items.map((item) => ({ name: item.name, quantity: item.quantity })),
    status: status.label,
    table: order.table,
    tone: status.tone,
  };
}

function formatOrderNumber(orderId?: string) {
  if (!orderId) return "confirmado";
  return `#${orderId.replace("order-", "").slice(-4)}`;
}

function DeviceStatusBar() {
  return (
    <div aria-hidden="true" className="garcom-status-bar">
      <span className="garcom-status-bar__time">9:41</span>
      <div className="garcom-status-bar__indicators">
        <img alt="" src={mobileSignal} />
        <img alt="" src={wifi} />
        <span className="garcom-status-bar__battery">
          <img className="garcom-status-bar__battery-outline" alt="" src={batteryOutline} />
          <img className="garcom-status-bar__battery-fill" alt="" src={batteryFill} />
          <img className="garcom-status-bar__battery-end" alt="" src={batteryEnd} />
        </span>
      </div>
    </div>
  );
}

function ConfirmationStatusBar() {
  return (
    <div aria-hidden="true" className="garcom-status-bar garcom-confirmation-status-bar">
      <span className="garcom-status-bar__time">9:41</span>
      <div className="garcom-status-bar__indicators">
        <img alt="" src={confirmationSignal} />
        <img alt="" src={confirmationWifi} />
        <span className="garcom-status-bar__battery">
          <img className="garcom-status-bar__battery-outline" alt="" src={confirmationBatteryOutline} />
          <img className="garcom-status-bar__battery-fill" alt="" src={confirmationBatteryFill} />
          <img className="garcom-status-bar__battery-end" alt="" src={confirmationBatteryEnd} />
        </span>
      </div>
    </div>
  );
}

function SplashIllustration() {
  return (
    <div aria-hidden="true" className="garcom-splash-illustration">
      <img className="garcom-splash-illustration__background-complete" src={splashBackgroundComplete} />
      <img className="garcom-splash-illustration__background-simple" src={splashBackgroundSimple} />
      <img className="garcom-splash-illustration__shadow" src={splashShadow} />
      <img className="garcom-splash-illustration__character-one" src={splashCharacterOne} />
      <img className="garcom-splash-illustration__character-two" src={splashCharacterTwo} />
    </div>
  );
}

function SplashScreen() {
  return (
    <div aria-label="Waiterapp carregando" className="garcom-splash-screen" role="status">
      <ConfirmationStatusBar />
      <main className="garcom-splash-content">
        <SplashIllustration />
        <div className="garcom-splash-copy">
          <h1>
            <strong>Waiter</strong><span>App</span>
          </h1>
          <p>O App do Garçom</p>
        </div>
      </main>
      <div aria-hidden="true" className="garcom-confirmation-home-indicator" />
    </div>
  );
}

function CategoryNavigation({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}) {
  return (
    <nav aria-label="Categorias de produtos" className="garcom-categories">
      {categories.map((category) => (
        <Button
          className={`garcom-category ${selectedCategory === category.id ? "garcom-category--active" : ""}`}
          key={category.label}
          onPress={() => onSelectCategory(category.id)}
          variant="ghost"
        >
          <span aria-hidden="true" className="garcom-category__icon">
            {category.icon}
          </span>
          <span>{category.label}</span>
        </Button>
      ))}
    </nav>
  );
}

function MenuSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="garcom-menu-search">
      <Search aria-hidden="true" className="garcom-menu-search__icon" size={18} strokeWidth={2} />
      <Input
        aria-label="Buscar no cardápio"
        className="garcom-menu-search__input"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar no cardápio"
        value={value}
        variant="secondary"
      />
      {value ? (
        <Button aria-label="Limpar busca" className="garcom-menu-search__clear" isIconOnly onPress={() => onChange("")} variant="ghost">
          <X aria-hidden="true" size={18} strokeWidth={2} />
        </Button>
      ) : null}
    </div>
  );
}

function HomeBottomNavigation({
  active,
  onOpenHome,
  onOpenOrders,
}: {
  active: "home" | "orders";
  onOpenHome: () => void;
  onOpenOrders: () => void;
}) {
  const isHomeActive = active === "home";
  const isOrdersActive = active === "orders";

  return (
    <nav aria-label="Navegação principal" className="garcom-bottom-nav">
      <Button
        aria-current={isHomeActive ? "page" : undefined}
        className={`garcom-bottom-nav__item ${isHomeActive ? "garcom-bottom-nav__item--active" : ""}`}
        onPress={onOpenHome}
        variant="ghost"
      >
        <Home aria-hidden="true" size={24} strokeWidth={1.8} />
        <span>Home</span>
        {isHomeActive ? <img alt="" className="garcom-bottom-nav__active-indicator" src={homeActiveIndicator} /> : null}
      </Button>
      <Button
        aria-current={isOrdersActive ? "page" : undefined}
        className={`garcom-bottom-nav__item ${isOrdersActive ? "garcom-bottom-nav__item--active" : ""}`}
        onPress={onOpenOrders}
        variant="ghost"
      >
        <ReceiptText aria-hidden="true" size={24} strokeWidth={1.8} />
        <span>Pedidos</span>
        {isOrdersActive ? <img alt="" className="garcom-bottom-nav__active-indicator" src={homeActiveIndicator} /> : null}
      </Button>
      <Button aria-label="Meu Perfil (em breve)" className="garcom-bottom-nav__item" isDisabled variant="ghost">
        <CircleUserRound aria-hidden="true" size={24} strokeWidth={1.8} />
        <span>Meu Perfil</span>
      </Button>
      <div aria-hidden="true" className="garcom-home-indicator" />
    </nav>
  );
}

function OrderHistoryCard({ order }: { order: HistoryOrder }) {
  return (
    <Card className="garcom-history-card" variant="default">
      <div className="garcom-history-card__header">
        <span className="garcom-history-card__table">{order.table}</span>
        <Chip className={`garcom-history-status garcom-history-status--${order.tone}`} size="sm" variant="soft">
          <span aria-hidden="true" className="garcom-history-status__dot" />
          {order.status}
        </Chip>
      </div>
      <div className="garcom-history-card__items">
        {order.items.map((item) => (
          <div className="garcom-history-card__item" key={`${item.quantity}-${item.name}`}>
            <span>{item.quantity}x</span>
            <strong>{item.name}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OrderHistoryPage({
  currentOrders,
  onOpenHome,
  onOpenOrders,
}: {
  currentOrders: HistoryOrder[];
  onOpenHome: () => void;
  onOpenOrders: () => void;
}) {
  return (
    <div className="garcom-screen garcom-history-screen">
      <DeviceStatusBar />
      <h1 className="garcom-history-title">Pedidos</h1>
      <main className="garcom-history-content">
        <section className="garcom-history-section" aria-labelledby="in-progress-heading">
          <h2 id="in-progress-heading">Em andamento</h2>
          <div className="garcom-history-list">
            {currentOrders.length > 0 ? currentOrders.map((order, index) => <OrderHistoryCard key={`${order.status}-${order.table}-${index}`} order={order} />) : <div className="garcom-history-empty">Nenhum pedido em andamento.</div>}
          </div>
        </section>
        <section className="garcom-history-section" aria-labelledby="previous-heading">
          <h2 id="previous-heading">Anteriores</h2>
          <div className="garcom-history-list">
            {previousOrders.map((order, index) => <OrderHistoryCard key={`${order.status}-${index}`} order={order} />)}
          </div>
        </section>
      </main>
      <HomeBottomNavigation active="orders" onOpenHome={onOpenHome} onOpenOrders={onOpenOrders} />
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
  onOpen,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
}) {
  return (
    <Card className="garcom-product" variant="default">
      <Button className="garcom-product__details" onPress={() => onOpen(product)} variant="ghost">
        {product.image ? <img alt="" className="garcom-product__image" src={product.image} /> : <span aria-hidden="true" className="garcom-product__image garcom-product__image--placeholder">{product.icon}</span>}
        <div className="garcom-product__copy">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
        </div>
      </Button>
      <Button
        aria-label={`Adicionar ${product.name} ao pedido`}
        className="garcom-product__add"
        isIconOnly
        onPress={() => onAdd(product)}
        variant="ghost"
      >
        <Plus aria-hidden="true" size={20} strokeWidth={2} />
      </Button>
    </Card>
  );
}

function ItemDetailPage({
  product,
  onAdd,
  onClose,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onClose: () => void;
}) {
  return (
    <div className="garcom-screen garcom-detail-screen">
      <div className="garcom-detail-hero">
        {product.image ? <img alt="" src={product.id === "quatro-queijos" ? cheeseDetailImage : product.image} /> : <div aria-hidden="true" className="garcom-detail-hero__placeholder">{product.icon}</div>}
        <Button aria-label="Fechar detalhes do produto" className="garcom-detail-close" isIconOnly onPress={onClose} variant="ghost">
          <X aria-hidden="true" size={24} strokeWidth={1.8} />
        </Button>
      </div>

      <main className="garcom-detail-content">
        <div className="garcom-detail-heading">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
        </div>

        <section className="garcom-ingredients" aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading">Ingredientes</h2>
          <div className="garcom-ingredients__list">
            {product.ingredients.map((ingredient) => (
              <div className="garcom-ingredient" key={ingredient}>
                <span aria-hidden="true">🧀</span>
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="garcom-detail-bar">
        <div className="garcom-detail-price">
          <span>Preço</span>
          <strong>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
        </div>
        <Button
          className="garcom-detail-add"
          onPress={() => {
            onAdd(product);
            onClose();
          }}
          variant="primary"
        >
          Adicionar ao pedido
        </Button>
        <div aria-hidden="true" className="garcom-home-indicator" />
      </div>
    </div>
  );
}

function OrderFooter({
  cartItems,
  itemCount,
  onConfirm,
  onUpdateQuantity,
}: {
  cartItems: Record<string, number>;
  itemCount: number;
  onConfirm: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
}) {
  const hasItems = itemCount > 0;
  const cartProducts = products.filter((product) => cartItems[product.id]);
  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * (cartItems[product.id] ?? 0),
    0,
  );

  return (
    <div className={`garcom-order-footer ${hasItems ? "garcom-order-footer--has-items" : ""}`}>
      {hasItems ? (
        <div className="garcom-order-footer__items">
          {cartProducts.map((product) => (
            <div className="garcom-order-footer__item" key={product.id}>
              {product.image ? <img alt="" src={product.image} /> : <span aria-hidden="true" className="garcom-order-footer__item-image-placeholder">{product.icon}</span>}
              <div className="garcom-order-footer__item-main">
                <div className="garcom-order-footer__item-copy">
                  <span>{cartItems[product.id]}x</span>
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</small>
                  </div>
                </div>
                <div className="garcom-order-footer__item-controls">
                  <Button
                    aria-label={`Adicionar ${product.name}`}
                    isIconOnly
                    onPress={() => onUpdateQuantity(product.id, 1)}
                    variant="ghost"
                  >
                    <Plus aria-hidden="true" size={18} strokeWidth={2} />
                  </Button>
                  <Button
                    aria-label={`Remover ${product.name}`}
                    isIconOnly
                    onPress={() => onUpdateQuantity(product.id, -1)}
                    variant="ghost"
                  >
                    <Minus aria-hidden="true" size={18} strokeWidth={2} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="garcom-order-footer__row">
        {hasItems ? (
          <div className="garcom-order-footer__total">
            <span>Total</span>
            <strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
          </div>
        ) : <div className="garcom-order-footer__copy">Seu carrinho está vazio</div>}
        <Button className="garcom-order-footer__confirm" isDisabled={!hasItems} onPress={onConfirm} variant="primary">
          Confirmar pedido
        </Button>
      </div>
      <div aria-hidden="true" className="garcom-home-indicator" />
    </div>
  );
}

function OrderPage({
  cartItems,
  onAdd,
  onCancel,
  onConfirm,
  onOpenProduct,
  onSearchChange,
  onSelectCategory,
  onTableChange,
  onUpdateQuantity,
  searchTerm,
  selectedCategory,
  tableName,
}: {
  cartItems: Record<string, number>;
  onAdd: (product: Product) => void;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenProduct: (product: Product) => void;
  onSearchChange: (value: string) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onTableChange: (table: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  searchTerm: string;
  selectedCategory: ProductCategory;
  tableName: string;
}) {
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false);
  const itemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  const visibleProducts = products.filter((product) => {
    const matchesCategory = product.category === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch = !normalizedSearch || `${product.name} ${product.description}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="garcom-screen garcom-order-screen">
      <DeviceStatusBar />
      <header className="garcom-order-header">
        <h1>Pedido</h1>
        <Button className="garcom-order-cancel" onPress={onCancel} variant="ghost">
          cancelar pedido
        </Button>
      </header>
      <Button className="garcom-order-table" onPress={() => setIsTablePickerOpen((current) => !current)} variant="ghost">
        <span>{tableName}</span>
        <ChevronDown aria-hidden="true" className={`garcom-order-table__chevron ${isTablePickerOpen ? "garcom-order-table__chevron--open" : ""}`} size={18} strokeWidth={2} />
      </Button>
      {isTablePickerOpen ? (
        <div aria-label="Selecionar mesa" className="garcom-table-picker" role="listbox">
          {["Mesa 1", "Mesa 2", "Mesa 3", "Mesa 4", "Mesa 5", "Mesa 6"].map((table) => (
            <Button
              aria-selected={table === tableName}
              className={table === tableName ? "garcom-table-picker__option garcom-table-picker__option--selected" : "garcom-table-picker__option"}
              key={table}
              onPress={() => {
                onTableChange(table);
                setIsTablePickerOpen(false);
              }}
              variant={table === tableName ? "primary" : "secondary"}
            >
              {table}
            </Button>
          ))}
        </div>
      ) : null}
      <CategoryNavigation onSelectCategory={onSelectCategory} selectedCategory={selectedCategory} />
      <MenuSearch onChange={onSearchChange} value={searchTerm} />
      <main className="garcom-order-products">
        {visibleProducts.length > 0 ? visibleProducts.map((product, index) => (
          <div key={product.id}>
            <ProductCard onAdd={onAdd} onOpen={onOpenProduct} product={product} />
            {index < visibleProducts.length - 1 ? <img alt="" className="garcom-divider" src={divider} /> : null}
          </div>
        )) : <div className="garcom-menu-empty"><strong>Nenhum item encontrado</strong><span>Tente outra busca ou categoria.</span></div>}
      </main>
      <OrderFooter
        cartItems={cartItems}
        itemCount={itemCount}
        onConfirm={onConfirm}
        onUpdateQuantity={onUpdateQuantity}
      />
    </div>
  );
}

function ConfirmationPage({ itemCount, onOk, orderId, tableName }: { itemCount: number; onOk: () => void; orderId?: string; tableName: string }) {
  return (
    <div className="garcom-confirmation-screen">
      <ConfirmationStatusBar />
      <main className="garcom-confirmation-content">
        <div className="garcom-confirmation-copy">
          <div className="garcom-confirmation-heading">
            <Check aria-hidden="true" size={24} strokeWidth={2.4} />
            <h1>Pedido {orderId ?? "confirmado"}</h1>
          </div>
          <p>{tableName} · {itemCount} {itemCount === 1 ? "item" : "itens"}<br />O pedido já entrou na fila de produção!</p>
        </div>
        <Button className="garcom-confirmation-ok" onPress={onOk} variant="primary">
          Ver pedidos
        </Button>
      </main>
      <div aria-hidden="true" className="garcom-confirmation-home-indicator" />
    </div>
  );
}

export function GarcomPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("pizzas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTable, setSelectedTable] = useState("Mesa 3");
  const [showHistory, setShowHistory] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmationOrder, setConfirmationOrder] = useState<StoredOrder | null>(null);
  const [currentOrders, setCurrentOrders] = useState<HistoryOrder[]>(inProgressOrders);
  const itemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

  const visibleProducts = products.filter((product) => {
    const matchesCategory = product.category === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch = !normalizedSearch || `${product.name} ${product.description}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowSplash(false), 1800);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const syncOrders = () => {
      setCurrentOrders([...inProgressOrders, ...readStoredOrders().map(storedOrderToHistory)]);
    };

    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener(ordersChangedEvent, syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener(ordersChangedEvent, syncOrders);
    };
  }, []);

  function addProduct(product: Product) {
    setCartItems((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
  }

  function updateProductQuantity(productId: string, delta: number) {
    setCartItems((currentItems) => {
      const nextItems = { ...currentItems };
      const nextQuantity = (nextItems[productId] ?? 0) + delta;

      if (nextQuantity <= 0) {
        delete nextItems[productId];
      } else {
        nextItems[productId] = nextQuantity;
      }

      return nextItems;
    });
  }

  function cancelOrder() {
    setCartItems({});
    setShowOrder(false);
    setShowHistory(false);
  }

  function finishConfirmation() {
    setCartItems({});
    setOrderConfirmed(false);
    setShowOrder(false);
    setShowHistory(true);
  }

  function confirmOrder() {
    const orderItems = products
      .filter((product) => cartItems[product.id])
      .map((product) => ({
        name: product.name,
        price: product.price,
        quantity: cartItems[product.id] ?? 0,
      }));
    const createdOrder = createStoredOrder({ items: orderItems, table: selectedTable });

    setConfirmationOrder(createdOrder);
    setOrderConfirmed(true);
  }

  if (showSplash) {
    return (
      <div className="garcom-page">
        <SplashScreen />
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="garcom-page">
        <ConfirmationPage itemCount={confirmationOrder?.items.reduce((sum, item) => sum + item.quantity, 0) ?? itemCount} onOk={finishConfirmation} orderId={formatOrderNumber(confirmationOrder?.id)} tableName={confirmationOrder?.table ?? selectedTable} />
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="garcom-page">
        <ItemDetailPage
          onAdd={addProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="garcom-page">
      <OrderHistoryPage
        currentOrders={currentOrders}
        onOpenHome={() => setShowHistory(false)}
          onOpenOrders={() => setShowHistory(true)}
        />
      </div>
    );
  }

  if (showOrder) {
    return (
      <div className="garcom-page">
        <OrderPage
          cartItems={cartItems}
          onAdd={addProduct}
          onCancel={cancelOrder}
          onConfirm={confirmOrder}
          onOpenProduct={setSelectedProduct}
          onSearchChange={setSearchTerm}
          onSelectCategory={setSelectedCategory}
          onTableChange={setSelectedTable}
          onUpdateQuantity={updateProductQuantity}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          tableName={selectedTable}
        />
      </div>
    );
  }

  return (
    <div className="garcom-page">
      <div className="garcom-screen">
        <DeviceStatusBar />
        <header className="garcom-home-header">
          <div className="garcom-welcome">
            <p>Bem-vindo(a) ao</p>
            <h1>
              <strong>Waiter</strong><span>App</span>
            </h1>
          </div>
          <Button
            aria-label={`Abrir pedidos${itemCount > 0 ? `, ${itemCount} ${itemCount === 1 ? "item" : "itens"}` : ""}`}
            className="garcom-home-notifications"
            isIconOnly
            onPress={() => setShowOrder(true)}
            variant="ghost"
          >
            <Bell aria-hidden="true" size={24} strokeWidth={1.8} />
            {itemCount > 0 ? <span aria-hidden="true" className="garcom-home-notifications__count">{itemCount > 9 ? "9+" : itemCount}</span> : null}
          </Button>
        </header>
        <CategoryNavigation onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
        <MenuSearch onChange={setSearchTerm} value={searchTerm} />
        <main className="garcom-products">
          {visibleProducts.length > 0 ? visibleProducts.map((product) => (
            <div key={product.id}>
              <ProductCard onAdd={addProduct} onOpen={setSelectedProduct} product={product} />
            </div>
          )) : <div className="garcom-menu-empty"><strong>Nenhum item encontrado</strong><span>Tente outra busca ou categoria.</span></div>}
        </main>
        <HomeBottomNavigation
          active="home"
          onOpenHome={() => setShowHistory(false)}
          onOpenOrders={() => setShowHistory(true)}
        />
      </div>
    </div>
  );
}
