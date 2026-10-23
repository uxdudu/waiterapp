# Componentes do Waiterapp

Organização em 23/10/2026. O **App Garçom é a referência visual** para Garçom, Cozinha e Delivery. As páginas adaptam a composição à tarefa e ao tamanho disponível, usando os mesmos controles, superfícies, estados e padrões.

## Dois níveis

| Nível | Responsabilidade | Origem |
| --- | --- | --- |
| Base | Elementos reutilizáveis: controles, imagens, estados, superfícies e marca | `src/components/base` |
| Blocks | Composições de Base para produtos, pedidos, navegação e checkout | `src/components/blocks` |

Não existem categorias de componentes por superfície. Uma diferença de layout vira uma variante quando mantém a mesma função: `ProductCard` usa `row` ou `tile`; `AppNavigation` usa `bottom`, `rail` ou `sidebar`; `CheckoutBar` usa `fixed` ou `inline`.

## Base

`Button`, `Card`, `CategoryItem`, `CountBadge`, `DeviceStatusBar`, `EmptyState`, `FilterChip`, `HomeIndicator`, `IconButton`, `InlineNotice`, `NavItem`, `QuantityStepper`, `SearchField`, `SegmentedControl`, `StatusBadge`, `Tabs`, `Tag`, `TextField`, `Thumbnail`, `Toast`, `Wordmark`.

HeroUI é uma dependência interna de Base. As páginas e os Blocks importam as APIs de Base, sem customizar HeroUI diretamente. Cores, espaço, raios e tipografia consomem os tokens centrais; não há uma camada de tokens de cor por componente.

## Blocks

`AppNavigation`, `CategoryRail`, `CheckoutBar`, `FeedbackScreen`, `IngredientList`, `OpenOrdersCard`, `OrderBoardColumn`, `OrderLine`, `OrderSummaryCard`, `PageHeader`, `PerformanceSummary`, `ProductCard`, `ProductTable`, `ProfileEditor`, `ProfileSummary`, `PromoBanner`, `RestaurantCard`, `SidePanel`, `TableSelect`.

Os Blocks recebem dados e callbacks. Não leem armazenamento nem executam operações de negócio. As páginas mantêm busca, filtros, seleção, pedidos e integração com o armazenamento.

## Aplicação nas superfícies

- **Garçom — contexto `app`:** produto em linha, categorias com rolagem, seleção de mesa, detalhe com ingredientes, checkout fixo, histórico, perfil do garçom e navegação inferior. As telas largas ampliam a grade mantendo os componentes.
- **Cozinha — contexto `webapp`:** navegação em trilho, quadro por etapa, painel de pedido, controle de quantidade, checkout com ação primária da marca e tabela responsiva de produtos.
- **Delivery — contexto `webapp`:** navegação lateral, busca, categorias com imagem, filtros, ofertas, produtos em grade, restaurantes, carrinho e histórico em painel.

O vocabulário dos estados de produção fica em `src/lib/order-status.ts`. `src/lib/format.ts` centraliza moeda e contagem de itens. `src/styles.css` contém apenas fundamentos globais e o shell inicial; `src/app/surfaces` posiciona as composições de cada página.

## Consulta e manutenção

O `/playground#componentes` tem somente **Base** e **Blocks**, com 40 componentes. Todas as prévias usam as exportações reais; na ficha, os estados são interativos e isolados dos dados do produto. A aba Implementação indica importação e arquivo de origem.

Para criar um padrão, consulte Base e Blocks primeiro. Ajustes de aparência reutilizável pertencem ao CSS do componente; apenas distribuição de tela pertence a `surfaces`. A fonte dos tokens é `tokens/tokens.json`, com arquivos gerados por `npm run tokens`.

## Limites dos protótipos

Garçom e Cozinha compartilham pedidos pelo `localStorage`. Delivery mantém o carrinho em memória e o checkout é demonstrativo, sem pagamento ou envio real. O histórico do Delivery contém dados de exemplo. Funções ainda indisponíveis continuam identificadas como tal.

## Perfil do Garçom

`ProfileSummary` compõe avatar ilustrado ou de iniciais, nome, cargo, telefone e edição com `Card`, `Tag` e `Button`. `PerformanceSummary` apresenta métricas fornecidas pela página e alterna o período com `SegmentedControl`. `ProfileEditor` compõe `SidePanel`, `TextField`, `InlineNotice` e `Button`, validando nome e telefone com DDD. `TextField` encapsula o input HeroUI em Base. Todos estão disponíveis no catálogo com prévias interativas.

Nome, telefone e indicadores usam mocks. Alterações de perfil ficam em memória na página e são descartadas ao recarregar. Pedidos em aberto refletem a mesma lista da aba Pedidos, incluindo os pedidos criados no protótipo; os totais demonstrativos de faturamento, atendimentos e pedidos feitos não são calculados a partir dessa lista.

## Refinamento a partir do Figma 4:1735

Perfil alinhado ao frame `4:1735` do arquivo Proto Playground: cards flat com `radius.lg` (18 px), avatar local do Figma com 96×96 px, seletor de período em largura total e navegação flutuante. A variante `bottom` de `AppNavigation` agora é a barra padrão do Garçom em todas as abas: pílula flutuante com glass e `NavItem` em modo `iconOnly`, mantendo os nomes acessíveis. O indicador ativo de `NavItem` é um ponto de 4 px em todas as orientações verticais. A navegação usa branco a 80%, blur de 20 px e saturação; `Button` tem variante `glass` com blur de 16 px. Ambos têm fundo opaco como fallback sem suporte a backdrop-filter.

`Card` aceita `radius` sem mudar seu padrão. `SegmentedControl` aceita `fullWidth`. `OpenOrdersCard` substitui o resumo anterior com ação de página inteira por clique, Enter ou Espaço. A edição preserva o avatar ao salvar os dados.
