export type CatalogGroup = "base" | "blocks";
export type PreviewKind = string;
export type CatalogItem = { id: string; name: string; group: CatalogGroup; description: string; source: string; route: string; preview: PreviewKind; snippet: string };
export const groupLabels: Record<CatalogGroup, string> = { base: "Base", blocks: "Blocks" };
export const catalog: CatalogItem[] = [
  {
    "id": "Button",
    "name": "Button",
    "group": "base",
    "description": "Ações com variantes primária, secundária, discreta, inversa e glass.",
    "source": "src/components/base/Button.tsx",
    "preview": "Button",
    "route": "/garcom",
    "snippet": "import { Button } from \"../components/base\";"
  },
  {
    "id": "Card",
    "name": "Card",
    "group": "base",
    "description": "Superfície com os cantos e a sombra do Garçom.",
    "source": "src/components/base/Card.tsx",
    "preview": "Card",
    "route": "/garcom",
    "snippet": "import { Card } from \"../components/base\";"
  },
  {
    "id": "CategoryItem",
    "name": "CategoryItem",
    "group": "base",
    "description": "Atalho de categoria: `tile` em card branco com anel no selecionado (Garçom) ou `round` com mídia circular (Delivery).",
    "source": "src/components/base/CategoryItem.tsx",
    "preview": "CategoryItem",
    "route": "/garcom",
    "snippet": "import { CategoryItem } from \"../components/base\";"
  },
  {
    "id": "CountBadge",
    "name": "CountBadge",
    "group": "base",
    "description": "Contagem compacta de itens ou pedidos.",
    "source": "src/components/base/CountBadge.tsx",
    "preview": "CountBadge",
    "route": "/garcom",
    "snippet": "import { CountBadge } from \"../components/base\";"
  },
  {
    "id": "DeviceStatusBar",
    "name": "DeviceStatusBar",
    "group": "base",
    "description": "Barra de estado simulada com variantes clara e escura.",
    "source": "src/components/base/DeviceChrome.tsx",
    "preview": "DeviceStatusBar",
    "route": "/garcom",
    "snippet": "import { DeviceStatusBar } from \"../components/base\";"
  },
  {
    "id": "EmptyState",
    "name": "EmptyState",
    "group": "base",
    "description": "Título, descrição e ícone para ausência de conteúdo.",
    "source": "src/components/base/EmptyState.tsx",
    "preview": "EmptyState",
    "route": "/garcom",
    "snippet": "import { EmptyState } from \"../components/base\";"
  },
  {
    "id": "FilterChip",
    "name": "FilterChip",
    "group": "base",
    "description": "Filtro selecionável com rótulo e complemento opcional.",
    "source": "src/components/base/FilterChip.tsx",
    "preview": "FilterChip",
    "route": "/delivery",
    "snippet": "import { FilterChip } from \"../components/base\";"
  },
  {
    "id": "HomeIndicator",
    "name": "HomeIndicator",
    "group": "base",
    "description": "Indicador inferior das telas móveis.",
    "source": "src/components/base/DeviceChrome.tsx",
    "preview": "HomeIndicator",
    "route": "/garcom",
    "snippet": "import { HomeIndicator } from \"../components/base\";"
  },
  {
    "id": "IconButton",
    "name": "IconButton",
    "group": "base",
    "description": "Ação com ícone, nome acessível e contador opcional.",
    "source": "src/components/base/IconButton.tsx",
    "preview": "IconButton",
    "route": "/garcom",
    "snippet": "import { IconButton } from \"../components/base\";"
  },
  {
    "id": "InlineNotice",
    "name": "InlineNotice",
    "group": "base",
    "description": "Aviso contextual com fechamento opcional.",
    "source": "src/components/base/InlineNotice.tsx",
    "preview": "InlineNotice",
    "route": "/garcom",
    "snippet": "import { InlineNotice } from \"../components/base\";"
  },
  {
    "id": "NavItem",
    "name": "NavItem",
    "group": "base",
    "description": "Item de navegação com ponto ativo; só ícone na barra inferior, com rótulo no trilho e na lateral.",
    "source": "src/components/base/NavItem.tsx",
    "preview": "NavItem",
    "route": "/garcom",
    "snippet": "import { NavItem } from \"../components/base\";"
  },
  {
    "id": "QuantityStepper",
    "name": "QuantityStepper",
    "group": "base",
    "description": "Controle de quantidade com limite mínimo.",
    "source": "src/components/base/QuantityStepper.tsx",
    "preview": "QuantityStepper",
    "route": "/garcom",
    "snippet": "import { QuantityStepper } from \"../components/base\";"
  },
  {
    "id": "SearchField",
    "name": "SearchField",
    "group": "base",
    "description": "Busca com ação de limpar: `filled` em pílula branca sem borda (Garçom) ou `outlined` (Delivery).",
    "source": "src/components/base/SearchField.tsx",
    "preview": "SearchField",
    "route": "/garcom",
    "snippet": "import { SearchField } from \"../components/base\";"
  },
  {
    "id": "SegmentedControl",
    "name": "SegmentedControl",
    "group": "base",
    "description": "Escolha exclusiva entre alternativas.",
    "source": "src/components/base/SegmentedControl.tsx",
    "preview": "SegmentedControl",
    "route": "/delivery",
    "snippet": "import { SegmentedControl } from \"../components/base\";"
  },
  {
    "id": "StatusBadge",
    "name": "StatusBadge",
    "group": "base",
    "description": "Situação com texto e ponto de cor compartilhada.",
    "source": "src/components/base/StatusBadge.tsx",
    "preview": "StatusBadge",
    "route": "/garcom",
    "snippet": "import { StatusBadge } from \"../components/base\";"
  },
  {
    "id": "Tabs",
    "name": "Tabs",
    "group": "base",
    "description": "Abas para seções do web app.",
    "source": "src/components/base/Tabs.tsx",
    "preview": "Tabs",
    "route": "/cozinha",
    "snippet": "import { Tabs } from \"../components/base\";"
  },
  {
    "id": "Tag",
    "name": "Tag",
    "group": "base",
    "description": "Rótulo de destaque, oferta ou informação.",
    "source": "src/components/base/Tag.tsx",
    "preview": "Tag",
    "route": "/garcom",
    "snippet": "import { Tag } from \"../components/base\";"
  },
  {
    "id": "TextField",
    "name": "TextField",
    "group": "base",
    "description": "Campo de texto com label, tipos de entrada e validação nativa.",
    "source": "src/components/base/TextField.tsx",
    "preview": "TextField",
    "route": "/garcom",
    "snippet": "import { TextField } from \"../components/base\";"
  },
  {
    "id": "Thumbnail",
    "name": "Thumbnail",
    "group": "base",
    "description": "Imagem com tamanhos consistentes e fallback.",
    "source": "src/components/base/Thumbnail.tsx",
    "preview": "Thumbnail",
    "route": "/garcom",
    "snippet": "import { Thumbnail } from \"../components/base\";"
  },
  {
    "id": "Toast",
    "name": "Toast",
    "group": "base",
    "description": "Confirmação temporária com fechamento e progresso opcionais.",
    "source": "src/components/base/Toast.tsx",
    "preview": "Toast",
    "route": "/garcom",
    "snippet": "import { Toast } from \"../components/base\";"
  },
  {
    "id": "Wordmark",
    "name": "Wordmark",
    "group": "base",
    "description": "Marca do Garçom, completa ou compacta.",
    "source": "src/components/base/Wordmark.tsx",
    "preview": "Wordmark",
    "route": "/garcom",
    "snippet": "import { Wordmark } from \"../components/base\";"
  },
  {
    "id": "AppNavigation",
    "name": "AppNavigation",
    "group": "blocks",
    "description": "Barra inferior flutuante com glass e itens só com ícone; trilho e lateral para Cozinha e Delivery.",
    "source": "src/components/blocks/AppNavigation.tsx",
    "preview": "AppNavigation",
    "route": "/garcom",
    "snippet": "import { AppNavigation } from \"../components/blocks\";"
  },
  {
    "id": "CategoryRail",
    "name": "CategoryRail",
    "group": "blocks",
    "description": "Trilho horizontal de categorias com rolagem; repassa a variante `tile` ou `round` aos itens.",
    "source": "src/components/blocks/CategoryRail.tsx",
    "preview": "CategoryRail",
    "route": "/garcom",
    "snippet": "import { CategoryRail } from \"../components/blocks\";"
  },
  {
    "id": "CheckoutBar",
    "name": "CheckoutBar",
    "group": "blocks",
    "description": "Total e ação principal, fixos no mobile ou dentro de painéis.",
    "source": "src/components/blocks/CheckoutBar.tsx",
    "preview": "CheckoutBar",
    "route": "/garcom",
    "snippet": "import { CheckoutBar } from \"../components/blocks\";"
  },
  {
    "id": "FeedbackScreen",
    "name": "FeedbackScreen",
    "group": "blocks",
    "description": "Tela de abertura e confirmação com fundo da marca.",
    "source": "src/components/blocks/FeedbackScreen.tsx",
    "preview": "FeedbackScreen",
    "route": "/garcom",
    "snippet": "import { FeedbackScreen } from \"../components/blocks\";"
  },
  {
    "id": "IngredientList",
    "name": "IngredientList",
    "group": "blocks",
    "description": "Ingredientes do detalhe de produto.",
    "source": "src/components/blocks/IngredientList.tsx",
    "preview": "IngredientList",
    "route": "/garcom",
    "snippet": "import { IngredientList } from \"../components/blocks\";"
  },
  {
    "id": "OpenOrdersCard",
    "name": "OpenOrdersCard",
    "group": "blocks",
    "description": "Acesso aos pedidos em aberto com contagem e interação por teclado.",
    "source": "src/components/blocks/OpenOrdersCard.tsx",
    "route": "/garcom",
    "preview": "OpenOrdersCard",
    "snippet": "import { OpenOrdersCard } from \"../components/blocks\";"
  },
  {
    "id": "OrderBoardColumn",
    "name": "OrderBoardColumn",
    "group": "blocks",
    "description": "Coluna de pedidos com estados vazio e de arraste.",
    "source": "src/components/blocks/OrderBoardColumn.tsx",
    "preview": "OrderBoardColumn",
    "route": "/cozinha",
    "snippet": "import { OrderBoardColumn } from \"../components/blocks\";"
  },
  {
    "id": "OrderLine",
    "name": "OrderLine",
    "group": "blocks",
    "description": "Item de pedido com imagem, quantidade, preço e controles.",
    "source": "src/components/blocks/OrderLine.tsx",
    "preview": "OrderLine",
    "route": "/garcom",
    "snippet": "import { OrderLine } from \"../components/blocks\";"
  },
  {
    "id": "OrderSummaryCard",
    "name": "OrderSummaryCard",
    "group": "blocks",
    "description": "Pedido em moldura com a cor do status, mesa e selo no topo e itens com foto num card branco.",
    "source": "src/components/blocks/OrderSummaryCard.tsx",
    "preview": "OrderSummaryCard",
    "route": "/garcom",
    "snippet": "import { OrderSummaryCard } from \"../components/blocks\";"
  },
  {
    "id": "PageHeader",
    "name": "PageHeader",
    "group": "blocks",
    "description": "Título, apoio e ações de página ou seção.",
    "source": "src/components/blocks/PageHeader.tsx",
    "preview": "PageHeader",
    "route": "/garcom",
    "snippet": "import { PageHeader } from \"../components/blocks\";"
  },
  {
    "id": "PerformanceSummary",
    "name": "PerformanceSummary",
    "group": "blocks",
    "description": "Indicadores de atendimento com seleção de período.",
    "source": "src/components/blocks/PerformanceSummary.tsx",
    "preview": "PerformanceSummary",
    "route": "/garcom",
    "snippet": "import { PerformanceSummary } from \"../components/blocks\";"
  },
  {
    "id": "ProductCard",
    "name": "ProductCard",
    "group": "blocks",
    "description": "Item do cardápio: `row` flat com raio de 18 px e foto na altura do card; `tile` com imagem no topo.",
    "source": "src/components/blocks/ProductCard.tsx",
    "preview": "ProductCard",
    "route": "/garcom",
    "snippet": "import { ProductCard } from \"../components/blocks\";"
  },
  {
    "id": "ProductTable",
    "name": "ProductTable",
    "group": "blocks",
    "description": "Tabela responsiva de produtos para a Cozinha.",
    "source": "src/components/blocks/ProductTable.tsx",
    "preview": "ProductTable",
    "route": "/cozinha",
    "snippet": "import { ProductTable } from \"../components/blocks\";"
  },
  {
    "id": "ProfileEditor",
    "name": "ProfileEditor",
    "group": "blocks",
    "description": "Edição de nome e telefone no painel compartilhado, com validação.",
    "source": "src/components/blocks/ProfileEditor.tsx",
    "preview": "ProfileEditor",
    "route": "/garcom",
    "snippet": "import { ProfileEditor } from \"../components/blocks\";"
  },
  {
    "id": "ProfileSummary",
    "name": "ProfileSummary",
    "group": "blocks",
    "description": "Identidade com avatar ilustrado ou iniciais, telefone e ação de editar.",
    "source": "src/components/blocks/ProfileSummary.tsx",
    "preview": "ProfileSummary",
    "route": "/garcom",
    "snippet": "import { ProfileSummary } from \"../components/blocks\";"
  },
  {
    "id": "PromoBanner",
    "name": "PromoBanner",
    "group": "blocks",
    "description": "Oferta com imagem, rótulo, descrição e ação.",
    "source": "src/components/blocks/PromoBanner.tsx",
    "preview": "PromoBanner",
    "route": "/delivery",
    "snippet": "import { PromoBanner } from \"../components/blocks\";"
  },
  {
    "id": "RestaurantCard",
    "name": "RestaurantCard",
    "group": "blocks",
    "description": "Restaurante com avaliação, prazo, taxa e favorito.",
    "source": "src/components/blocks/RestaurantCard.tsx",
    "preview": "RestaurantCard",
    "route": "/delivery",
    "snippet": "import { RestaurantCard } from \"../components/blocks\";"
  },
  {
    "id": "SidePanel",
    "name": "SidePanel",
    "group": "blocks",
    "description": "Painel modal de pedido ou carrinho com Escape e controle de foco.",
    "source": "src/components/blocks/SidePanel.tsx",
    "preview": "SidePanel",
    "route": "/garcom",
    "snippet": "import { SidePanel } from \"../components/blocks\";"
  },
  {
    "id": "TableSelect",
    "name": "TableSelect",
    "group": "blocks",
    "description": "Seleção de mesa do pedido do Garçom.",
    "source": "src/components/blocks/TableSelect.tsx",
    "preview": "TableSelect",
    "route": "/garcom",
    "snippet": "import { TableSelect } from \"../components/blocks\";"
  }
];
export const foundationNav = [
  { id: "tokens", label: "Overview" }, { id: "cores", label: "Colors" },
  { id: "tipografia", label: "Typography" }, { id: "espacamento", label: "Spacing" }, { id: "raios", label: "Radii" },
];
export const principleNav = [{ id: "principios", label: "Principles" }, { id: "regras", label: "Rules and open decisions" }];
