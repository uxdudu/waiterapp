import { useState, type ReactNode } from "react";
import { Banknote, Bell, CircleUserRound, Home, ReceiptText, ShoppingCart, UsersRound } from "lucide-react";
import * as Base from "../components/base";
import * as Blocks from "../components/blocks";
import profileAvatar from "../assets/figma/garcom-profile-avatar.png";
import dishImage from "../assets/figma/garcom-raw-3.jpeg";
import type { PreviewKind } from "./playground-catalog";

const product = { description: "Pizza de quatro queijos com borda tradicional", image: dishImage, name: "Quatro Queijos", price: 40 };
const categoryItems = [{ id: "pizzas", icon: "🍕", label: "Pizzas" }, { id: "bebidas", icon: "🥤", label: "Bebidas" }, { id: "lanches", icon: "🍔", label: "Lanches" }];
const navItems = [{ id: "home", icon: Home, label: "Home" }, { id: "orders", icon: ReceiptText, label: "Pedidos" }, { id: "profile", icon: CircleUserRound, label: "Meu Perfil" }];

/** Every preview uses the actual exported component, including interactive state. */
export function PlaygroundPreview({ kind, compact = false }: { kind: PreviewKind; compact?: boolean }) {
  const [profile, setProfile] = useState<Blocks.ProfileData>({ avatar: profileAvatar, name: "Lucas Oliveira", phone: "(11) 99984-3210" });
  const [period, setPeriod] = useState<Blocks.PerformancePeriod>("month");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState("pizzas");
  const [nav, setNav] = useState("home");
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [table, setTable] = useState("Mesa 3");
  const add = () => setQuantity((value) => value + 1);
  const decrease = () => setQuantity((value) => Math.max(0, value - 1));
  let preview: ReactNode;
  switch (kind) {
    case "OpenOrdersCard": preview = <Blocks.OpenOrdersCard count={favorite ? 0 : 2} onOpen={() => setFavorite(!favorite)} />; break;
    case "TextField": preview = <Base.TextField label="Nome" onChange={setQuery} placeholder="Seu nome" value={query} />; break;
    case "ProfileSummary": preview = <Blocks.ProfileSummary onEdit={() => setProfileOpen(true)} profile={profile} role="Garçom" />; break;
    case "PerformanceSummary": preview = <Blocks.PerformanceSummary description={period === "month" ? "Este mês" : "Hoje"} metrics={[{ icon: Banknote, label: "Faturamento", value: period === "month" ? "R$ 18.450,00" : "R$ 1.245,00" }, { icon: UsersRound, label: "Atendimentos", value: period === "month" ? "186" : "14" }, { icon: ReceiptText, label: "Pedidos feitos", value: period === "month" ? "248" : "19" }]} onPeriodChange={setPeriod} period={period} />; break;
    case "ProfileEditor": preview = <Base.Button onPress={() => setProfileOpen(true)}>Editar perfil</Base.Button>; break;
    case "Button": preview = <div className="ds-preview__flow"><Base.Button onPress={add}>Adicionar item {quantity > 1 ? `(${quantity})` : ""}</Base.Button><Base.Button variant="secondary">Ver detalhes</Base.Button>{!compact && <><Base.Button variant="glass">Editar perfil</Base.Button><Base.Button variant="ghost">Cancelar</Base.Button><Base.Button isDisabled>Indisponível</Base.Button></>}</div>; break;
    case "IconButton": preview = <Base.IconButton badge={quantity} label="Adicionar notificação" onPress={add} variant="surface"><Bell size={22} /></Base.IconButton>; break;
    case "Card": preview = <div className="ds-live-stack"><Base.Card className="ds-live-card"><strong>Superfície do Garçom</strong><p>Base para produtos, pedidos e restaurantes.</p></Base.Card>{!compact && <Base.Card className="ds-live-card" elevation="flat" radius="lg"><strong>Superfície suave</strong><p>Cantos de 18 px e sem elevação, como no perfil.</p></Base.Card>}</div>; break;
    case "CategoryItem": preview = <div className="ds-preview__flow"><Base.CategoryItem icon="🍕" label="Pizzas" onPress={() => setFavorite(!favorite)} selected={favorite} variant="tile" />{!compact && <Base.CategoryItem icon="🍕" label="Pizzas" onPress={() => setFavorite(!favorite)} selected={favorite} />}</div>; break;
    case "CountBadge": preview = <Base.CountBadge value={quantity} />; break;
    case "DeviceStatusBar": preview = <Base.DeviceStatusBar />; break;
    case "HomeIndicator": preview = <Base.HomeIndicator />; break;
    case "EmptyState": preview = <Base.EmptyState description="Adicione algo para começar." icon={<ShoppingCart />} title="Seu carrinho está vazio" />; break;
    case "FilterChip": preview = <Base.FilterChip onPress={() => setFavorite(!favorite)} selected={favorite}>Entrega grátis</Base.FilterChip>; break;
    case "InlineNotice": preview = visible ? <Base.InlineNotice onClose={() => setVisible(false)}>Você vê todas as taxas antes de confirmar.</Base.InlineNotice> : <Base.Button onPress={() => setVisible(true)} variant="secondary">Mostrar aviso</Base.Button>; break;
    case "NavItem": preview = <div className="ds-live-stack"><div className="ds-preview__flow">{navItems.map((item) => <Base.NavItem active={nav === item.id} icon={item.icon} iconOnly key={item.id} label={item.label} onPress={() => setNav(item.id)} />)}</div>{!compact && <div className="ds-preview__flow">{navItems.map((item) => <Base.NavItem active={nav === item.id} icon={item.icon} key={item.id} label={item.label} onPress={() => setNav(item.id)} />)}</div>}</div>; break;
    case "QuantityStepper": preview = <Base.QuantityStepper itemName="Quatro Queijos" quantity={quantity} onDecrement={decrease} onIncrement={add} />; break;
    case "SearchField": preview = <div className="ds-live-stack"><Base.SearchField label="Buscar no cardápio" onChange={setQuery} value={query} variant="filled" />{!compact && <Base.SearchField label="Buscar restaurantes ou pratos" onChange={setQuery} value={query} />}</div>; break;
    case "SegmentedControl": preview = <Base.SegmentedControl label="Modo de recebimento" onChange={setSelected} options={[{ id: "pizzas", label: "Entrega" }, { id: "pickup", label: "Retirada" }]} value={selected} />; break;
    case "StatusBadge": preview = <div className="ds-preview__flow"><Base.StatusBadge tone="waiting">Fila de espera</Base.StatusBadge><Base.StatusBadge tone="preparing">Em produção</Base.StatusBadge><Base.StatusBadge tone="ready">Pronto</Base.StatusBadge></div>; break;
    case "Tabs": preview = <Base.Tabs items={[{ id: "products", label: "Produtos" }, { id: "categories", label: "Categorias" }]} label="Cardápio" />; break;
    case "Tag": preview = <div className="ds-preview__flow"><Base.Tag>Mais pedido</Base.Tag><Base.Tag tone="neutral">Novidade</Base.Tag></div>; break;
    case "Thumbnail": preview = <Base.Thumbnail src={dishImage} />; break;
    case "Toast": preview = visible ? <Base.Toast message="Pedido atualizado com sucesso" onClose={() => setVisible(false)} /> : <Base.Button onPress={() => setVisible(true)}>Mostrar notificação</Base.Button>; break;
    case "Wordmark": preview = <Base.Wordmark />; break;
    case "AppNavigation": preview = <Blocks.AppNavigation activeId={nav} items={navItems} onNavigate={setNav} variant="bottom" />; break;
    case "CategoryRail": preview = <Blocks.CategoryRail items={categoryItems} label="Categorias" onSelect={setSelected} selectedId={selected} variant="tile" />; break;
    case "CheckoutBar": preview = <Blocks.CheckoutBar action={{ label: "Confirmar pedido", onPress: () => setFavorite(!favorite) }} amount={40 * quantity} note={favorite ? "Pedido confirmado nesta prévia" : undefined} placement="inline" />; break;
    case "FeedbackScreen": preview = <Blocks.FeedbackScreen action={<Base.Button variant="inverse" onPress={() => setFavorite(!favorite)}>{favorite ? "Confirmado" : "Ver pedidos"}</Base.Button>} description="O pedido já entrou na fila de produção!" title="Pedido confirmado" />; break;
    case "IngredientList": preview = <Blocks.IngredientList items={["Prato", "Cheddar", "Mussarela", "Parmesão"]} />; break;
    case "OrderBoardColumn": preview = <Blocks.OrderBoardColumn emptyText="A fila está livre" icon="🕑" label="Fila de espera" onSelect={() => setPanelOpen(true)} tickets={[{ id: "sample", subtitle: "2 itens", title: "Mesa 3" }]} tone="waiting" />; break;
    case "OrderLine": preview = <Blocks.OrderLine item={{ ...product, quantity }} onDecrement={decrease} onIncrement={add} />; break;
    case "OrderSummaryCard": preview = <Blocks.OrderSummaryCard order={{ title: "Mesa 3", status: { label: "Em produção", tone: "preparing" }, items: [{ image: product.image, name: product.name, quantity }] }} />; break;
    case "PageHeader": preview = <Blocks.PageHeader actions={<Base.Button variant="secondary">Reiniciar o dia</Base.Button>} description="Acompanhe os pedidos dos clientes" icon={Home} title="Home" />; break;
    case "ProductCard": preview = <div className="ds-live-stack"><Blocks.ProductCard product={product} onAdd={add} onOpen={() => setPanelOpen(true)} />{!compact && <small>{quantity - 1} adicionados nesta prévia</small>}</div>; break;
    case "ProductTable": preview = <Blocks.ProductTable rows={visible ? [{ ...product, category: "Pizza", categoryIcon: "🍕", id: "sample" }] : []} onEdit={() => setPanelOpen(true)} onDelete={() => setVisible(false)} />; break;
    case "PromoBanner": preview = <Blocks.PromoBanner action={<Base.Button onPress={() => setFavorite(!favorite)}>{favorite ? "Oferta selecionada" : "Ver ofertas"}</Base.Button>} description="Use o código WAITER20." image={dishImage} tag="Boas-vindas" title="20% OFF no primeiro pedido" />; break;
    case "RestaurantCard": preview = <Blocks.RestaurantCard favorite={favorite} onToggleFavorite={() => setFavorite(!favorite)} restaurant={{ name: "Forno da Praça", image: dishImage, rating: "4,8", reviews: "(1,2k)", distance: "1,4 km", time: "25–35 min", fee: "Entrega grátis acima de R$ 45", badge: "Mais pedido" }} />; break;
    case "SidePanel": preview = <Base.Button onPress={() => setPanelOpen(true)}>Abrir carrinho</Base.Button>; break;
    case "TableSelect": preview = <Blocks.TableSelect onChange={setTable} options={["Mesa 1", "Mesa 2", "Mesa 3"]} value={table} />; break;
    default: preview = null;
  }
  return <div className={`ds-preview ds-live-preview ${compact ? "ds-preview--compact" : ""}`} data-type-context="app">
    {preview}
    {profileOpen && <Blocks.ProfileEditor onClose={() => setProfileOpen(false)} onSave={(next) => { setProfile(next); setProfileOpen(false); }} profile={profile} />}
    {panelOpen && <Blocks.SidePanel title="Detalhes da prévia" onClose={() => setPanelOpen(false)} footer={<Blocks.CheckoutBar action={{ label: "Confirmar pedido", onPress: () => setPanelOpen(false) }} amount={40 * quantity} placement="inline" />}><Blocks.OrderLine item={{ ...product, quantity }} onDecrement={decrease} onIncrement={add} /></Blocks.SidePanel>}
  </div>;
}
