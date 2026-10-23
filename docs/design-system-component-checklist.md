# Checklist de componentes

Revisão de implementação em 23/10/2026. O checklist percorre API, estados e estilos nos arquivos dos componentes e compara os valores de forma com `tokens/tokens.json`. As prévias de `InlineNotice`, `Card` e `CountBadge`, além do fechamento do Toast no Delivery, foram conferidas no navegador. Uma marcação indica que a fonte foi revisada; não significa que todos os estados foram submetidos a QA visual ou de acessibilidade no navegador.

## Resumo

- [x] 20 componentes Base revisados.
- [x] 15 componentes Blocks revisados.
- [x] `radius.sm` padronizado de 7px para 8px na fonte única e aplicado aos consumidores.
- [x] Halo decorativo removido do `CountBadge`.
- [x] Fechamento automático do `Toast` alinhado entre Cozinha e Delivery em 4,5 s.
- [ ] Decidir se os 4px de `StatusBadge` e `Tag` devem ser formalizados como um token de raio próprio ou aproximados de `radius.sm`.
- [ ] Resolver IDs fixos em `IngredientList` e `TableSelect` antes de usar mais de uma instância na mesma página.

## Base

| Revisado | Componente | Verificação e observação |
| --- | --- | --- |
| [x] | `Button` | Variantes, tamanho, largura e estado indisponível; formato pill. |
| [x] | `IconButton` | Variantes, tamanhos e estado indisponível; recebe `CountBadge` opcional. |
| [x] | `Card` | Elevação e hover; `radius.sm` agora resolve para 8px. O modo `interactive` fornece estilo, e quem compõe o card precisa fornecer semântica e interação. |
| [x] | `CategoryItem` | Tamanhos, seleção e mídia circular; o contorno é estado selecionado. |
| [x] | `CountBadge` | Tons brand/neutral e limite de contagem; halo decorativo removido conforme comentário. |
| [x] | `DeviceStatusBar` | Barra de status ilustrativa, marcada como decorativa para leitores de tela. |
| [x] | `HomeIndicator` | Indicador ilustrativo, marcado como decorativo para leitores de tela. |
| [x] | `EmptyState` | Ícone e descrição opcionais, borda tracejada e superfície com `radius.md`. |
| [x] | `FilterChip` | Estados selecionado e não selecionado; pode ser usado como botão ou opção de lista. |
| [x] | `InlineNotice` | Informação persistente no fluxo da página, com fechamento opcional; `radius.sm` agora é 8px. |
| [x] | `NavItem` | Orientações horizontal/vertical, modo `iconOnly`, ativo com ponto de 4 px e desabilitado; consome `radius.sm` no modo horizontal. |
| [x] | `QuantityStepper` | Incremento, limite mínimo, saída anunciada e rótulos por item. |
| [x] | `SearchField` | Campo controlado, limpeza e foco visível; consome `radius.sm`. O foco pertence ao input e permanece. |
| [x] | `SegmentedControl` | Escolha exclusiva com grupo e `aria-pressed`; formato pill. |
| [x] | `StatusBadge` | Texto e ponto de status; raio de 4px vem de token de espaçamento, não da escala `radius`. |
| [x] | `Tabs` | Abas da HeroUI com indicador de seleção; estados de tab delegados à biblioteca. |
| [x] | `Tag` | Tons brand/neutral/inverse; raio de 4px vem de token de espaçamento, não da escala `radius`. |
| [x] | `Thumbnail` | Tamanhos e fallback; tamanhos sm/md consomem `radius.sm`; tile/hero são quadrados para sangrar até a borda. |
| [x] | `Toast` | Confirmação temporária fixa, `role="status"`, fechamento/progresso opcionais; Cozinha e Delivery controlam a duração em 4,5 s. Usa `radius.md`. |
| [x] | `Wordmark` | Tamanhos, versão compacta e tom invertido; exposto como imagem com nome acessível. |

## Blocks

| Revisado | Componente | Verificação e observação |
| --- | --- | --- |
| [x] | `AppNavigation` | Navegação nomeada com variantes bottom (pílula glass, só ícones), rail e sidebar; reutiliza `NavItem`. |
| [x] | `CategoryRail` | Navegação nomeada e seleção por ID; reutiliza `CategoryItem`. |
| [x] | `CheckoutBar` | Modos fixed/inline, total vazio ou preenchido, nota e ação desabilitada. |
| [x] | `FeedbackScreen` | Tela de status com ação opcional; usa uma região `<main>`, então a composição deve ser a principal da página. |
| [x] | `IngredientList` | Lista nomeada; o ID `ingredients-heading` é fixo e pode duplicar em múltiplas instâncias. |
| [x] | `OrderBoardColumn` | Coluna nomeada, estado de arraste e seleção por teclado/clique; tickets recebem semântica de botão. |
| [x] | `OrderLine` | Dados do item e controles opcionais, renderizados quando ambos os callbacks existem. |
| [x] | `OrderSummaryCard` | Moldura com a cor do status (frame `5:1903`) envolvendo `Card` flat `radius.lg`; itens com `Thumbnail` `list` (62×50); metadados, total e ação opcionais. |
| [x] | `PageHeader` | Níveis h1/h2, ícone, descrição e ações opcionais. |
| [x] | `ProductCard` | Layout row/tile e ações separadas; detalhes só viram botão quando `onOpen` existe. |
| [x] | `ProductTable` | Linhas e colunas com papéis ARIA; ações de editar/excluir têm nomes por produto. |
| [x] | `PromoBanner` | Tons brand/success; imagem decorativa e ação fornecida pela composição. |
| [x] | `RestaurantCard` | Dados do restaurante e controle favorito com rótulo dinâmico. |
| [x] | `SidePanel` | Dialog modal com fechamento por Escape/backdrop, ciclo e restauração de foco. |
| [x] | `TableSelect` | Abre opções de mesa em listbox; o ID `table-options` é fixo e pode duplicar. A navegação por setas precisa de revisão se a lista crescer. |

## Diferença entre InlineNotice e Toast

Não são o mesmo componente. `InlineNotice` comunica informação contextual persistente dentro do fluxo da página; `Toast` confirma uma ação por pouco tempo, sobreposto no rodapé da tela, com anúncio de status. `Toast` não inicia seu próprio timer: a página consumidora controla a remoção. `KitchenOrdersPage` e `DeliveryPage` removem a notificação após 4,5 segundos.

## Ações da revisão

- [x] Alterar `radius.sm` na fonte `tokens/tokens.json` e regenerar `src/styles/tokens.css` e `src/styles/tokens.ts`.
- [x] Remover o `box-shadow` de `wa-count-badge--brand`; o foco visível de controles interativos não foi removido.
- [x] Aplicar ciclo de 4,5 s e barra de progresso ao `Toast` usado em `DeliveryPage`.
- [ ] Rever se os raios compactos de `StatusBadge` e `Tag` precisam de um token próprio.
- [ ] Tornar os IDs de `IngredientList` e `TableSelect` únicos por instância.
- [ ] Rever interação por teclado do `TableSelect` caso se mantenha a semântica de listbox.

## Adição do perfil do Garçom

- `TextField` (Base): label associado por ID único, input controlado, telefone e atributos de validação; encapsula HeroUI.
- `ProfileSummary` (Block): avatar de iniciais, dados pessoais e ação com Button; nome atualizado após salvar na prévia.
- `PerformanceSummary` (Block): alternância Hoje/Este mês com métricas fornecidas pela página; mudança de valores conferida na prévia.
- `ProfileEditor` (Block): edição com SidePanel e TextField, validação de telefone e salvamento conferidos; Escape descarta alterações e devolve foco ao botão de edição.

A tela `/garcom` foi conferida em desktop e em 390×844 e 320×740, sem overflow horizontal no perfil. O acesso de Meu Perfil para Pedidos, a edição, a validação e a troca de período foram exercitados no navegador. Lint, build (incluindo typecheck e tokens:check) e diff --check passaram. O build mantém o aviso de bundle acima de 500 kB.

## Perfil conforme Figma 4:1735

Refinamento visual: avatar local do frame, cards flat com raio de 18 px, seletor em largura total e AppNavigation flutuante com glass. Conferência no navegador em 430×1168, 320×740 e 1188×954. Avatar carregado com 96×96 px; cards sem sombra/borda; navegação com branco a 80% e backdrop-filter de 20 px. Troca de período, salvamento preservando avatar e acesso aos pedidos com Enter conferidos. A variante mantém nomes acessíveis para os ícones e fundo opaco sem suporte a backdrop-filter.

Home do Garçom alinhada ao frame `6:2102`: `CategoryItem`/`CategoryRail` ganharam a variante `tile` (card branco, raio de 18 px, anel de 2 px no selecionado), `SearchField` ganhou `filled` (pílula sem borda) e `ProductCard` `row` ficou flat com raio de 18 px e foto acompanhando a altura do card. Delivery mantém `round` e `outlined`.
