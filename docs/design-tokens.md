# Tokens do Waiterapp

A fonte única é `tokens/tokens.json`. Cores, espaçamentos e tipografia das telas e do playground partem desse arquivo. Não edite os valores em `src/styles/tokens.css` ou `src/styles/tokens.ts`: ambos são gerados.

## Editar e aplicar

1. Altere um `$value` ou uma referência em `tokens/tokens.json`.
2. Rode `npm run tokens`.
3. Confira o resultado em `/playground#cores`, `#tipografia` e `#espacamento` e nas telas de produto.

`npm run tokens:check` verifica se os arquivos gerados estão em dia, valida referências e procura usos de variáveis de tokens inexistentes no código. Esse comando também roda antes do build. `npm run tokens` não fica observando o JSON: execute-o a cada alteração.

## Estrutura

| Caminho no JSON | Função | Exemplo CSS |
| --- | --- | --- |
| `color` | Paletas primitivas nomeadas pela cor | `--color-red-600` |
| `semantic.color` | Papéis de interface | `--color-text-primary`, `--color-bg-surface` |
| `font` | Família, tamanho, peso, entrelinha e tracking | `--font-size-16`, `--font-weight-semibold` |
| `semantic.typography` | 13 papéis em três contextos | `.type-heading-xl`, `.type-body-md` |
| `space` | Escala de espaçamento | `--space-200` = 16px |
| `radius` | Escala reutilizável de cantos | `--radius-md` |
| `$extensions.waiterapp.adapters.heroui` | Nomes exigidos pela biblioteca apontando para tokens | `--accent` → `--color-brand` |

Cores têm apenas duas camadas: primitiva e semântica. Não crie tokens de cor por componente ou por área do produto.

Para mudar a marca inteira, edite `color.red.600.$value`. Para mudar só o papel de ação principal, altere a referência de `semantic.color.brand.default`, por exemplo de `{color.red.600}` para `{color.red.700}`. Os consumidores usam `var(--color-brand)`.

## Espaçamento

O nome representa o múltiplo de 8px × 100. Exemplos: `025` = 2px, `050` = 4px, `100` = 8px, `200` = 16px, `300` = 24px, `1500` = 120px. Meios e quartos de passo atendem os controles compactos existentes. A escala não obriga todo valor a ser múltiplo de 4px.

Padding, margin e gap foram migrados nos estilos globais, playground, Base, Blocks e layouts por superfície. Valores locais foram aproximados para o passo disponível mais próximo. Dimensões estruturais (largura/altura), posições, bordas, sombras, percentuais, vw e ajustes de 1px não fazem parte dessa migração.

Para alterar um passo, mantenha a unidade em px no JSON. Se criar outro tamanho, use um nome coerente com a régua e execute o gerador. Não renomeie um token sem atualizar os consumidores: o verificador apontará os nomes antigos.

## Raios

`radius.sm` = 8px, `radius.md` = 12px, `radius.lg` = 18px e `radius.pill` = 999px. O token pequeno foi padronizado de 7px para 8px em 23/10/2026; os consumidores de `--radius-sm` atualizam juntos.

## Tipografia

General Sans é a família principal. Os tamanhos são guardados em px e publicados em rem. As famílias e os pesos ficam em `font`; o import da fonte no início de `src/styles.css` precisa disponibilizar os pesos usados. A simulação da barra iOS mantém medidas próprias e a família de sistema.

Os mesmos 13 papéis existem nos contextos `app`, `webapp` e `site`. O contexto altera tamanho e entrelinha, preservando o significado do papel:

```tsx
<main data-type-context="webapp">
  <h1 className="type-heading-xl">Pedidos</h1>
  <p className="type-body-md">Pedidos em andamento</p>
  <button className="type-label-md">Confirmar</button>
</main>
```

Sem atributo, o padrão é `app`. Garçom usa `app`; Cozinha e Delivery usam `webapp`. Componentes Base e Blocks usam os papéis `--type-*`; estilos legados ainda podem consumir primitivos da mesma fonte.

No contexto `site`, alguns papéis crescem entre 360 e 1280px com `clamp()` em rem e cqi. O intervalo está em `semantic.typography.$extensions.waiterapp.fluid`; o máximo de cada papel está em sua extensão `waiterapp.typography.maxFontSize`. Use um contêiner com `container-type: inline-size` para responder à largura dele; sem contêiner, cqi usa a viewport. O playground oferece uma régua para conferir o resultado.

Para app nativo, resolva as referências em `semantic.typography.app`. O tamanho fica em px; a entrelinha é um multiplicador e o tracking está em em. Converta para as unidades da plataforma: `lineHeight = fontSize × lineHeight`, `letterSpacing = fontSize × tracking`.

## Limites desta etapa

A migração centraliza valores e preserva o comportamento das telas. Ela aproxima cores locais aos papéis existentes, então fundos e status podem mudar de tom. Os raios estão catalogados; não houve uma migração completa de cantos legados. O catálogo de componentes é mantido por outro trabalho no mesmo repositório.
