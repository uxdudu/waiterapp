import { useMemo, useState } from "react";
import { Button, Card, Chip, Input } from "@heroui/react";
import { CheckCircle2, ChevronDown, CircleHelp, CircleUserRound, ClipboardList, Heart, Home, Info, MapPin, Minus, Plus, Search, ShoppingCart, Store, Tag, UtensilsCrossed, X, type LucideIcon } from "lucide-react";
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

const formatPrice = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    if (label === "Meus pedidos") {
      setShowOrders(true);
      return;
    }

    const target = label === "Comidas" ? "delivery-food" : label === "Restaurantes" ? "delivery-restaurants" : label === "Ofertas" ? "delivery-promos" : "delivery-content-top";
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="delivery-page">
      <header className="delivery-header">
        <a className="delivery-brand" href="/delivery">
          <span aria-hidden="true" className="delivery-brand__mark">W</span>
          <span>waiterapp</span>
        </a>
        <div className="delivery-search">
          <Search aria-hidden="true" className="delivery-search__icon" size={20} strokeWidth={2} />
          <Input aria-label="Buscar restaurantes ou pratos" className="delivery-search__input" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar restaurantes ou pratos" value={query} variant="secondary" />
        </div>
        <Button className="delivery-location" variant="ghost">
          <MapPin aria-hidden="true" size={16} strokeWidth={2} /> Rua das Flores, 123
        </Button>
        <div className="delivery-mode" role="group" aria-label="Modo de recebimento">
          <Button className={deliveryMode === "delivery" ? "delivery-mode__button delivery-mode__button--active" : "delivery-mode__button"} onPress={() => setDeliveryMode("delivery")} variant="ghost">Entrega</Button>
          <Button className={deliveryMode === "pickup" ? "delivery-mode__button delivery-mode__button--active" : "delivery-mode__button"} onPress={() => setDeliveryMode("pickup")} variant="ghost">Retirada</Button>
        </div>
        <Button aria-label={`Abrir carrinho com ${cartCount} itens`} className="delivery-cart-button" onPress={() => setShowCart(true)} variant="primary">
          <ShoppingCart aria-hidden="true" className="delivery-cart-button__icon" size={20} strokeWidth={2} /><span>Carrinho</span><span className="delivery-cart-button__count">{cartCount}</span>
        </Button>
      </header>

      <div className="delivery-layout">
        <aside className="delivery-sidebar">
          <nav aria-label="Navegação do delivery">
            {navigation.map((item, index) => (
              <Button className={`delivery-sidebar__item ${index === 0 ? "delivery-sidebar__item--active" : ""}`} key={item.label} onPress={() => handleNavigation(item.label)} variant="ghost">
                <item.icon aria-hidden="true" className="delivery-sidebar__icon" size={22} strokeWidth={1.8} />{item.label}
              </Button>
            ))}
          </nav>
          <div className="delivery-sidebar__rule" />
          <Button className="delivery-sidebar__item" variant="ghost"><CircleUserRound aria-hidden="true" className="delivery-sidebar__icon" size={22} strokeWidth={1.8} />Conta</Button>
          <Button className="delivery-sidebar__item" variant="ghost"><CircleHelp aria-hidden="true" className="delivery-sidebar__icon" size={22} strokeWidth={1.8} />Ajuda</Button>
          <div className="delivery-sidebar__footer">
            <span className="delivery-sidebar__avatar">EA</span>
            <span><strong>Eduardo</strong><small>Conta pessoal</small></span>
          </div>
        </aside>

        <main className="delivery-content" id="delivery-content-top">
          <div className="delivery-mobile-header">
            <strong>Entrega em</strong>
            <Button className="delivery-mobile-location" variant="ghost">Rua das Flores, 123</Button>
          </div>

          <section aria-label="Categorias" className="delivery-category-rail">
            {categories.map((category) => (
              <Button className={`delivery-category ${selectedCategory === category.id ? "delivery-category--active" : ""}`} key={category.id} onPress={() => setSelectedCategory(category.id)} variant="ghost">
                <span className="delivery-category__image"><img alt="" src={category.image} /></span>
                <span>{category.label}</span>
              </Button>
            ))}
          </section>

          <div className="delivery-filter-row">
            {filters.map((filter) => <Button className={`delivery-filter ${activeFilter === filter.id ? "delivery-filter--active" : ""}`} key={filter.id} onPress={() => setActiveFilter((current) => current === filter.id ? null : filter.id)} variant="secondary">{filter.label}{filter.id === "price" ? <ChevronDown aria-hidden="true" size={16} strokeWidth={2} /> : null}</Button>)}
          </div>

          <div className="delivery-note"><Info aria-hidden="true" size={17} strokeWidth={1.8} /><span>Taxa de serviço transparente. Você vê tudo antes de confirmar.</span><Button aria-label="Fechar aviso" className="delivery-note__close" isIconOnly onPress={() => setNotice("")} variant="ghost"><X aria-hidden="true" size={18} strokeWidth={2} /></Button></div>

          <section className="delivery-promo-grid" id="delivery-promos" aria-label="Ofertas do dia">
            <article className="delivery-promo delivery-promo--warm"><div><Chip size="sm" variant="soft">Oferta de boas-vindas</Chip><h2>20% OFF no primeiro pedido</h2><p>Use o código <strong>WAITER20</strong> e comece bem.</p><Button onPress={() => setSelectedCategory("todos")} variant="primary">Ver ofertas</Button></div><img alt="" className="delivery-promo__art" src={stockImages.burger} /></article>
            <article className="delivery-promo delivery-promo--mint"><div><Chip size="sm" variant="soft">Entrega especial</Chip><h2>Chegue com sabor e calma</h2><p>Escolha restaurantes próximos e acompanhe cada etapa.</p><Button onPress={() => setSelectedCategory("todos")} variant="secondary">Explorar agora</Button></div><img alt="" className="delivery-promo__art" src={margaritaImage} /></article>
          </section>

          <section className="delivery-section" id="delivery-food">
            <div className="delivery-section__heading"><div><span className="delivery-eyebrow">Para pedir agora</span><h1>O que você quer comer hoje?</h1></div><Button variant="ghost">Ver cardápio →</Button></div>
            <div className="delivery-food-grid">
              {visibleMenuItems.map((item) => (
                <Card className="delivery-food-card" key={item.id} variant="default">
                  <Card.Content className="delivery-food-card__image-wrap"><img alt="" src={item.image} /><Chip size="sm" variant="soft">{item.category === "pizzas" ? "Mais pedido" : "Para experimentar"}</Chip></Card.Content>
                  <Card.Header className="delivery-food-card__body"><Card.Title>{item.name}</Card.Title><Card.Description>{item.description}</Card.Description></Card.Header>
                  <Card.Footer className="delivery-food-card__footer"><strong>{formatPrice(item.price)}</strong><Button aria-label={`Adicionar ${item.name}`} className="delivery-menu-card__add" isIconOnly onPress={() => addToCart(item)} variant="primary"><Plus aria-hidden="true" size={20} strokeWidth={2} /></Button></Card.Footer>
                </Card>
              ))}
            </div>
            {visibleMenuItems.length === 0 ? <div className="delivery-empty"><strong>Nenhuma comida encontrada</strong><span>Tente buscar por outro prato ou escolher outra categoria.</span></div> : null}
          </section>

          <section className="delivery-section" id="delivery-restaurants">
            <div className="delivery-section__heading"><div><span className="delivery-eyebrow">Escolha de onde pedir</span><h1>Restaurantes perto de você</h1></div><Button variant="ghost">Ver todos →</Button></div>
            <div className="delivery-restaurant-grid">
              {visibleRestaurants.map((restaurant) => (
                <Card className="delivery-restaurant-card" key={restaurant.id} variant="default">
                  <Card.Content className="delivery-restaurant-card__image-wrap"><img alt="" className="delivery-restaurant-card__image" src={restaurant.image} />{restaurant.badge ? <Chip className="delivery-restaurant-card__badge" size="sm" variant="soft">{restaurant.badge}</Chip> : null}</Card.Content>
                  <Card.Header className="delivery-restaurant-card__body"><div className="delivery-restaurant-card__title"><div><Card.Title>{restaurant.name}</Card.Title><Card.Description><strong>★ {restaurant.rating}</strong> {restaurant.reviews} · {restaurant.distance} · {restaurant.time}</Card.Description></div><Button aria-label={`${favorites.includes(restaurant.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${restaurant.name}`} className={`delivery-favorite ${favorites.includes(restaurant.id) ? "delivery-favorite--active" : ""}`} isIconOnly onPress={() => toggleFavorite(restaurant.id)} variant="ghost"><Heart aria-hidden="true" fill={favorites.includes(restaurant.id) ? "currentColor" : "none"} size={21} strokeWidth={1.8} /></Button></div><p className="delivery-restaurant-card__fee">{restaurant.fee}</p></Card.Header>
                </Card>
              ))}
            </div>
            {visibleRestaurants.length === 0 ? <div className="delivery-empty"><strong>Nenhum restaurante encontrado</strong><span>Tente buscar por outro nome ou limpar os filtros.</span></div> : null}
          </section>
        </main>
      </div>

      {showCart ? <div className="delivery-cart-layer"><Button aria-label="Fechar carrinho" className="delivery-cart-backdrop" onPress={() => setShowCart(false)} variant="ghost" /><aside aria-label="Seu carrinho" className="delivery-cart-drawer"><div className="delivery-cart-drawer__header"><div><span className="delivery-eyebrow">Seu pedido</span><h2>Carrinho</h2></div><Button aria-label="Fechar carrinho" className="delivery-close-button" isIconOnly onPress={() => setShowCart(false)} variant="ghost"><X aria-hidden="true" size={24} strokeWidth={1.8} /></Button></div>{cartLines.length ? <div className="delivery-cart-lines">{cartLines.map((item) => <div className="delivery-cart-line" key={item.id}><img alt="" src={item.image} /><div><strong>{item.name}</strong><span>{formatPrice(item.price)}</span></div><div className="delivery-cart-line__quantity"><Button aria-label={`Remover uma unidade de ${item.name}`} isIconOnly onPress={() => updateCart(item.id, -1)} variant="ghost"><Minus aria-hidden="true" size={18} strokeWidth={2} /></Button><span>{cartItems[item.id]}</span><Button aria-label={`Adicionar uma unidade de ${item.name}`} isIconOnly onPress={() => updateCart(item.id, 1)} variant="ghost"><Plus aria-hidden="true" size={18} strokeWidth={2} /></Button></div></div>)}</div> : <div className="delivery-cart-empty"><span aria-hidden="true" className="delivery-cart-empty__mark">W</span><strong>Seu carrinho está vazio</strong><p>Adicione algo gostoso para começar.</p></div>}<div className="delivery-cart-drawer__footer"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><Button className="delivery-checkout" isDisabled={!cartCount} onPress={checkout} variant="primary">Continuar para checkout</Button><small>Você poderá revisar endereço e forma de pagamento na próxima etapa.</small></div></aside></div> : null}

      {showOrders ? <div className="delivery-cart-layer"><Button aria-label="Fechar meus pedidos" className="delivery-cart-backdrop" onPress={() => setShowOrders(false)} variant="ghost" /><aside aria-label="Meus pedidos" className="delivery-cart-drawer delivery-orders-drawer"><div className="delivery-cart-drawer__header"><div><span className="delivery-eyebrow">Histórico</span><h2>Meus pedidos</h2></div><Button aria-label="Fechar meus pedidos" className="delivery-close-button" isIconOnly onPress={() => setShowOrders(false)} variant="ghost"><X aria-hidden="true" size={24} strokeWidth={1.8} /></Button></div><div className="delivery-orders-list">{orders.map((order) => <Card className="delivery-order-card" key={order.id} variant="default"><Card.Header className="delivery-order-card__top"><div><Card.Title>{order.restaurant}</Card.Title><Card.Description>{order.id} · {order.time}</Card.Description></div><Chip className={order.status === "Entregue" ? "delivery-order-card__status delivery-order-card__status--done" : "delivery-order-card__status"} size="sm" variant="soft">{order.status}</Chip></Card.Header><Card.Content className="delivery-order-card__bottom"><span>Total do pedido</span><strong>{order.total}</strong></Card.Content><Card.Footer><Button className="delivery-order-card__repeat" onPress={() => setNotice(`Itens de ${order.restaurant} adicionados para repetir`)} variant="secondary">Pedir novamente</Button></Card.Footer></Card>)}</div></aside></div> : null}

      {notice ? <div aria-live="polite" className="delivery-toast"><CheckCircle2 aria-hidden="true" size={20} strokeWidth={2} />{notice}</div> : null}
    </div>
  );
}
