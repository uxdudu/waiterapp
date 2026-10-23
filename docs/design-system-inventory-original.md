# Inventário do design system no código

Inventário inicial observado em 23/10/2026. A decisão de cor registrada abaixo foi aplicada depois deste levantamento. O `/playground#cores` mostra a documentação visual atual.

## Fundação existente

- `src/styles/tokens.css`: quatro escalas primitivas 50–950 (`red`, `neutral`, `green`, `rust`), `neutral-0`, 9 cores semânticas centrais, 6 tamanhos de texto, 8 passos de espaçamento e 4 raios. `--accent` e `--focus` ligam a cor principal ao HeroUI.
- `src/styles.css`: estilos globais e das três experiências de produto. Ainda contém valores locais de cor, tipografia, espaçamento e raio.
- Fonte principal: General Sans. A barra de estado simulada do Garçom usa fonte de sistema.
- As quatro escalas 50–950 foram criadas com progressão de luminosidade em OKLCH, preservando os valores existentes nos seus passos de origem. O passo `--color-red-600` é exatamente `#D73035`. A tabela completa está em `docs/color-tokens.md`.

## Componentes de biblioteca em uso

`Button`, `Input`, `Card`, `Chip` e `Tabs` são importados de `@heroui/react` pelas páginas. O código adiciona classes locais para adaptar cada experiência. A biblioteca oferece mais componentes, mas eles não fazem parte do inventário de uso atual.

## Componentes locais nomeados

| Superfície | Componentes declarados na página | Estado |
| --- | --- | --- |
| Shell | `ConnectionBadge` | Local a `App.tsx` |
| Garçom | `DeviceStatusBar`, `ConfirmationStatusBar`, `SplashIllustration`, `SplashScreen`, `CategoryNavigation`, `MenuSearch`, `HomeBottomNavigation`, `OrderHistoryCard`, `OrderHistoryPage`, `ProductCard`, `ItemDetailPage`, `OrderFooter`, `OrderPage`, `ConfirmationPage` | Locais a `GarcomPage.tsx` |
| Cozinha | `KitchenSidebar`, `KitchenWorkspaceHeader`, `KitchenMenuPage`, `OrderColumn`, `KitchenToast`, `OrderDrawer` | Locais a `KitchenOrdersPage.tsx` |
| Delivery | `DeliveryPage` contém busca, categorias, filtros, cards, carrinho, histórico e toast no próprio JSX | Padrões embutidos, ainda sem componente nomeado próprio |

`GarcomPage`, `KitchenOrdersPage` e `DeliveryPage` são páginas inteiras. `Shell`, `HomePage` e `AreaPlaceholder` são estruturas da navegação inicial. Não são classificados como primitivas compartilhadas.

## Pontos para revisão

1. A divergência entre `#E85D3F` e `#D73035` foi resolvida: `--color-brand` aponta para `--color-red-600`, que vale `#D73035`. O Button primary do HeroUI recebe `--accent: var(--color-brand)` e texto branco por `--accent-foreground`.
2. Vários valores locais de `#333`, `#666` e `#FFF` coexistem com `--color-ink`, `--color-muted` e `--color-surface`.
3. Os tokens de tipo e espaçamento ainda são pouco consumidos pelas telas de produto; catalogá-los não significa que a migração esteja concluída.
4. O Delivery tem padrões visuais próprios, mas grande parte deles está dentro de `DeliveryPage`, sem API de componente isolada.
5. Os componentes locais de Garçom e Cozinha têm dependências de dados e estado da página. As prévias do catálogo são representações de documentação, exceto as primitivas HeroUI renderizadas diretamente.
