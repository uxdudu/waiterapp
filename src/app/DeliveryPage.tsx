import { useEffect, useMemo, useState } from "react";
import { Button, CountBadge, EmptyState, FilterChip, InlineNotice, SearchField, SegmentedControl, Toast, Wordmark } from "../components/base";
import { AppNavigation, CategoryRail, CheckoutBar, OrderLine, OrderSummaryCard, PageHeader, ProductCard, PromoBanner, RestaurantCard, SidePanel } from "../components/blocks";
import "./surfaces/delivery.css";
import { ChevronDown, CircleHelp, CircleUserRound, ClipboardList, Home, MapPin, ShoppingCart, Store, Tag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import cheeseImage from "../assets/figma/garcom-raw-3.jpeg";
import margaritaImage from "../assets/figma/garcom-raw-2.jpeg";

const stockImages = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
  brownie: "https://images.unsplash.com/photo-1688279432554-16cd6de375ac?auto=format&fit=crop&w=1200&q=85",
  chicken: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=85",
};

type DeliveryCategory = "todos" | "pizzas" | "hamburgueres" | "brasileira" | "doces";

type MenuItem = {
  id: string;
  category: Exclude<DeliveryCategory, "todos">;
  name: string;
  description: string;
  price: number;
  image: string;
};

type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: string;
  reviews: string;
  distance: string;
  time: string;
  fee: string;
  feeValue: number;
  badge?: string;
  categories: Exclude<DeliveryCategory, "todos">[];
};

const categories: Array<{ id: DeliveryCategory; label: string; image: string }> = [
  { id: "todos", label: "Comidas", image: stockImages.burger },
  { id: "pizzas", label: "Pizza", image: margaritaImage },
  { id: "hamburgueres", label: "Hambúrguer", image: stockImages.burger },
  { id: "brasileira", label: "Frango", image: stockImages.chicken },
  { id: "doces", label: "Brownie", image: stockImages.brownie },
];

const restaurants: Restaurant[] = [
  {
    id: "forno-da-praca",
    name: "Forno da Praça",
    image: margaritaImage,
    rating: "4,8",
    reviews: "(1,2k)",
    distance: "1,4 km",
    time: "25–35 min",
    fee: "Entrega grátis acima de R$ 45",
    feeValue: 0,
    badge: "Mais pedido",
    categories: ["pizzas"],
  },
  {
    id: "casa-do-burger",
    name: "Casa do Burger",
    image: stockImages.burger,
    rating: "4,7",
    reviews: "(840)",
    distance: "2,1 km",
    time: "30–40 min",
    fee: "R$ 5,90 de entrega",
    feeValue: 5.9,
    badge: "10% OFF",
    categories: ["hamburgueres"],
  },
  {
    id: "brasa-e-brasil",
    name: "Brasa & Brasil",
    image: stockImages.chicken,
    rating: "4,9",
    reviews: "(560)",
    distance: "1,8 km",
    time: "35–45 min",
    fee: "R$ 4,90 de entrega",
    feeValue: 4.9,
    categories: ["brasileira"],
  },
  {
    id: "doce-pausa",
    name: "Doce Pausa",
    image: stockImages.brownie,
    rating: "4,6",
    reviews: "(310)",
    distance: "2,8 km",
    time: "20–30 min",
    fee: "Entrega grátis acima de R$ 30",
    feeValue: 0,
    badge: "Novidade",
    categories: ["doces"],
  },
  {
    id: "esquina-da-massa",
    name: "Esquina da Massa",
    image: cheeseImage,
    rating: "4,7",
    reviews: "(680)",
    distance: "3,2 km",
    time: "30–40 min",
    fee: "R$ 6,90 de entrega",
    feeValue: 6.9,
    categories: ["pizzas"],
  },
];

const menuItems: MenuItem[] = [
  { id: "pizza-familia", category: "pizzas", name: "Pizza Família", description: "Grande, borda tradicional e dois sabores", price: 59.9, image: margaritaImage },
  { id: "burger-casa", category: "hamburgueres", name: "Burger da Casa", description: "Blend 160g, queijo, bacon e molho especial", price: 31.9, image: stockImages.burger },
  { id: "combo-brasa", category: "brasileira", name: "Combo Brasa", description: "Frango grelhado, arroz, farofa e salada", price: 38.9, image: stockImages.chicken },
  { id: "brownie", category: "doces", name: "Brownie com sorvete", description: "Brownie de chocolate e sorvete de creme", price: 18.9, image: stockImages.brownie },
  { id: "dupla-pizzas", category: "pizzas", name: "Dupla de pizzas", description: "Duas pizzas grandes com sabores à escolha", price: 89.9, image: cheeseImage },
];

const navigation: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Início", icon: Home },
  { label: "Comidas", icon: UtensilsCrossed },
  { label: "Restaurantes", icon: Store },
  { label: "Ofertas", icon: Tag },
  { label: "Meus pedidos", icon: ClipboardList },
];

const filters = [
  { id: "free", label: "Entrega grátis" },
  { id: "rating", label: "Mais bem avaliados" },
  { id: "time", label: "Até 30 min" },
  { id: "price", label: "Preço" },
] as const;

const orders = [
  { id: "#1048", restaurant: "Forno da Praça", status: "Em preparo", time: "Hoje, 12:40", total: "R$ 59,90" },
  { id: "#1031", restaurant: "Doce Pausa", status: "Entregue", time: "Ontem, 19:12", total: "R$ 37,80" },
];

const TOAST_DURATION = 4500;


export function DeliveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<DeliveryCategory>("todos");
  const [query, setQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"] | null>(null);
  const [notice, setNotice] = useState("");
  const [showServiceNotice, setShowServiceNotice] = useState(true);
  const [activeNavigation, setActiveNavigation] = useState("Início");

  useEffect(() => {
    if (!notice) return;

    const toastTimer = window.setTimeout(() => setNotice(""), TOAST_DURATION);
    return () => window.clearTimeout(toastTimer);
  }, [notice]);

  const visibleRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchesCategory = selectedCategory === "todos" || restaurant.categories.includes(selectedCategory);
      const matchesQuery = !normalizedQuery || restaurant.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      const matchesFilter = activeFilter === null
        || (activeFilter === "free" && restaurant.feeValue === 0)
        || (activeFilter === "rating" && Number(restaurant.rating.replace(",", ".")) >= 4.8)
        || (activeFilter === "time" && Number.parseInt(restaurant.time, 10) <= 30)
        || (activeFilter === "price" && restaurant.feeValue <= 5.9);
      return matchesCategory && matchesQuery && matchesFilter;
    });

    return [...filteredRestaurants].sort((first, second) => {
      if (activeFilter === "rating") return Number(second.rating.replace(",", ".")) - Number(first.rating.replace(",", "."));
      if (activeFilter === "price") return first.feeValue - second.feeValue;
      return 0;
    });
  }, [activeFilter, query, selectedCategory]);

  const visibleMenuItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
      const matchesQuery = !normalizedQuery || `${item.name} ${item.description}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const cartLines = menuItems.filter((item) => cartItems[item.id]);
  const cartCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = cartLines.reduce((total, item) => total + item.price * (cartItems[item.id] ?? 0), 0);

  function addToCart(item: MenuItem) {
    setCartItems((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
    setNotice(`${item.name} adicionado ao carrinho`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function updateCart(itemId: string, delta: number) {
    setCartItems((current) => {
      const next = { ...current };
      const quantity = (next[itemId] ?? 0) + delta;
      if (quantity <= 0) delete next[itemId];
      else next[itemId] = quantity;
      return next;
    });
  }

  function toggleFavorite(restaurantId: string) {
    setFavorites((current) => current.includes(restaurantId) ? current.filter((id) => id !== restaurantId) : [...current, restaurantId]);
  }

  function checkout() {
    setNotice("Pedido simulado enviado para a cozinha");
    setShowCart(false);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function handleNavigation(label: string) {
    setActiveNavigation(label);
    if (label === "Meus pedidos") {
      setShowOrders(true);
      return;
    }

    const target = label === "Comidas" ? "delivery-food" : label === "Restaurantes" ? "delivery-restaurants" : label === "Ofertas" ? "delivery-promos" : "delivery-content-top";
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="delivery-page" data-type-context="webapp">
      <header className="delivery-header">
        <a aria-label="Waiterapp Delivery" href="/delivery"><Wordmark size="sm" /></a>
        <SearchField label="Buscar restaurantes ou pratos" onChange={setQuery} value={query} />
        <Button className="delivery-location" variant="ghost" isDisabled><MapPin aria-hidden="true" size={16} />Rua das Flores, 123</Button>
        <SegmentedControl label="Modo de recebimento" onChange={setDeliveryMode} options={[{ id: "delivery", label: "Entrega" }, { id: "pickup", label: "Retirada" }]} value={deliveryMode} />
        <Button onPress={() => setShowCart(true)} aria-label={`Abrir carrinho com ${cartCount} itens`}><ShoppingCart aria-hidden="true" size={20} />Carrinho<CountBadge tone="neutral" value={cartCount} /></Button>
      </header>
      <div className="delivery-layout">
        <AppNavigation
          activeId={activeNavigation}
          footerItems={[{ disabled: true, id: "Conta", label: "Conta", icon: CircleUserRound }, { disabled: true, id: "Ajuda", label: "Ajuda", icon: CircleHelp }]}
          items={navigation.map((item) => ({ ...item, id: item.label }))}
          label="Navegação do delivery"
          onNavigate={handleNavigation}
          variant="sidebar"
        />
        <main className="delivery-content" id="delivery-content-top">
          <CategoryRail items={categories} label="Categorias de comidas" onSelect={setSelectedCategory} selectedId={selectedCategory} size="lg" />
          <div className="delivery-filters">
            {filters.map((filter) => <FilterChip key={filter.id} onPress={() => setActiveFilter((current) => current === filter.id ? null : filter.id)} selected={activeFilter === filter.id} trailing={filter.id === "price" ? <ChevronDown aria-hidden="true" size={16} /> : undefined}>{filter.label}</FilterChip>)}
          </div>
          {showServiceNotice && <InlineNotice onClose={() => setShowServiceNotice(false)}>Taxa de serviço transparente. Você vê tudo antes de confirmar.</InlineNotice>}
          <section className="delivery-promos" id="delivery-promos" aria-label="Ofertas do dia">
            <PromoBanner action={<Button onPress={() => setSelectedCategory("todos")}>Ver ofertas</Button>} description={<>Use o código <strong>WAITER20</strong> e comece bem.</>} image={stockImages.burger} tag="Oferta de boas-vindas" title="20% OFF no primeiro pedido" />
            <PromoBanner action={<Button onPress={() => setSelectedCategory("todos")} variant="secondary">Explorar agora</Button>} description="Escolha restaurantes próximos e acompanhe cada etapa." image={margaritaImage} tag="Entrega especial" title="Chegue com sabor e calma" tone="success" />
          </section>
          <section className="delivery-section" id="delivery-food">
            <PageHeader eyebrow="Para pedir agora" title="O que você quer comer hoje?" />
            <div className="delivery-products">
              {visibleMenuItems.map((item) => <ProductCard key={item.id} layout="tile" onAdd={() => addToCart(item)} product={{ ...item, tag: item.category === "pizzas" ? "Mais pedido" : "Para experimentar" }} />)}
            </div>
            {!visibleMenuItems.length && <EmptyState description="Tente buscar por outro prato ou escolher outra categoria." title="Nenhuma comida encontrada" />}
          </section>
          <section className="delivery-section" id="delivery-restaurants">
            <PageHeader eyebrow="Escolha de onde pedir" level={2} title="Restaurantes perto de você" />
            <div className="delivery-restaurants">
              {visibleRestaurants.map((restaurant) => <RestaurantCard favorite={favorites.includes(restaurant.id)} key={restaurant.id} onToggleFavorite={() => toggleFavorite(restaurant.id)} restaurant={restaurant} />)}
            </div>
            {!visibleRestaurants.length && <EmptyState description="Tente buscar por outro nome ou limpar os filtros." title="Nenhum restaurante encontrado" />}
          </section>
        </main>
      </div>
      {showCart && <SidePanel eyebrow="Seu pedido" title="Seu carrinho" onClose={() => setShowCart(false)} footer={<CheckoutBar action={{ disabled: !cartCount, label: "Continuar para checkout", onPress: checkout }} amount={cartTotal} label="Subtotal" note="Checkout demonstrativo, sem pagamento ou envio real." placement="inline" />}>
        {cartLines.length ? cartLines.map((item) => <OrderLine item={{ ...item, quantity: cartItems[item.id] }} key={item.id} onDecrement={() => updateCart(item.id, -1)} onIncrement={() => updateCart(item.id, 1)} />) : <EmptyState description="Adicione algo gostoso para começar." icon={<ShoppingCart aria-hidden="true" />} title="Seu carrinho está vazio" />}
      </SidePanel>}
      {showOrders && <SidePanel eyebrow="Histórico demonstrativo" title="Meus pedidos" onClose={() => { setShowOrders(false); setActiveNavigation("Início"); }}>
        {orders.map((order) => <OrderSummaryCard key={order.id} order={{ title: order.restaurant, meta: `${order.id} · ${order.time}`, status: { label: order.status === "Em preparo" ? "Em produção" : order.status, tone: order.status === "Entregue" ? "ready" : "preparing" }, total: order.total }} action={<Button onPress={() => setNotice(`Repetição de pedido de ${order.restaurant} em breve.`)} variant="secondary">Pedir novamente</Button>} />)}
      </SidePanel>}
      {notice && <Toast message={notice} onClose={() => setNotice("")} showProgress />}
    </div>
  );
}
