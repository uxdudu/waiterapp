# Waiterapp

Base do Waiterapp com React, HeroUI, Express e SQLite.

## Desenvolvimento

```bash
npm install
npm run dev
```

O cliente roda em `http://localhost:5173` quando a porta está livre. A API
roda em `http://localhost:3001` e o Vite encaminha as chamadas `/api` para ela.

Se a porta 5173 estiver ocupada, o Vite escolhe a próxima porta disponível. O
backend persiste o banco local em `data/waiterapp.db`, que não é versionado.

## Rotas iniciais

- `/` — shell inicial do produto
- `/garcom` — App Garçom mobile first
- `/cozinha` — web app da Cozinha
- `/delivery` — experiência web de descoberta, cardápio e carrinho para delivery
- `/playground` — inventário navegável do design system, com tokens, princípios e fichas dos componentes em uso
- `/api/health` — saúde da API e do banco
- `/api/meta` — metadados da versão do schema

## Editar tokens

A fonte única de cores, espaçamento e tipografia é `tokens/tokens.json`.
Depois de alterar os valores, execute `npm run tokens`. O comando gera o CSS
usado pelo produto e os dados exibidos no playground. `npm run tokens:check`
verifica a sincronização e referências inexistentes; também roda no build.

Tipografia tem 13 papéis em três contextos: app, web app e site.
O guia de estrutura, exemplos e manutenção está em
[docs/design-tokens.md](docs/design-tokens.md).

## Playground do design system

O App Garçom define a linguagem visual das três superfícies. O sistema possui apenas dois níveis de componentes:

- **Base** (`src/components/base`): controles, superfícies, estados, imagens e marca.
- **Blocks** (`src/components/blocks`): produtos, pedidos, navegação, painéis e checkout compostos de Base.

As páginas importam essas APIs compartilhadas. HeroUI fica dentro de Base; layouts específicos ficam em `src/app/surfaces`. Cores e tipografia usam a fonte central em `tokens/tokens.json`.

Acesse `/playground#componentes` para consultar os 35 componentes, testar as prévias reais e localizar suas implementações. Cores, tipografia, espaçamento e raios continuam nas seções de fundamentos. Veja [docs/design-system-inventory.md](docs/design-system-inventory.md) para responsabilidades e regras de uso.

## Fluxo simulado do Garçom

O App Garçom já possui um catálogo de demonstração com categorias de pizzas,
bebidas, lanches, sobremesas e promoções. É possível buscar produtos, filtrar
por categoria, escolher a mesa, adicionar quantidades ao pedido e confirmar o
envio para a cozinha.

Os pedidos criados durante a demonstração são persistidos no `localStorage`
com a chave `waiterapp.orders`. Isso permite que as telas `/garcom` e `/cozinha`
compartilhem o fluxo entre abas enquanto a API de pedidos definitiva ainda é
modelada.

## Fluxo simulado do Delivery App

A rota `/delivery` usa a mesma identidade visual do Waiterapp em uma experiência
web responsiva: busca focada em comidas, categorias, filtros aplicáveis,
restaurantes como contexto, favoritos, modo entrega ou retirada, histórico de
pedidos e carrinho lateral com alteração de quantidades. O checkout é
demonstrativo e exibe a confirmação sem transação real.

## Decisão de backend

Não havia uma sessão autenticada nem um projeto Supabase disponível pela CLI
neste ambiente. Por isso, a primeira versão usa SQLite local atrás de uma API
Express. A interface fala apenas com `src/lib/api.ts`, mantendo a troca por
Supabase isolada quando houver um projeto e credenciais definidos.

## Validação

```bash
npm run lint
npm run build
```
