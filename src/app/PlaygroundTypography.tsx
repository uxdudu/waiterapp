import { useState } from "react";
import { Tabs } from "../components/base";
import { fluidRange, tokenAt, tokensIn, typeContexts, typeRoles, typeSizeAt, typeStyle, type TypeContext, type TypeRole, type TypeStyle } from "../styles/tokens";

const contextInfo: Record<TypeContext, { label: string; hint: string }> = {
  app: { label: "App", hint: "Mobile e toque, como o Garçom. Corpo em 16px." },
  webapp: { label: "Web app", hint: "Telas densas de operação, como a Cozinha. Corpo em 14px." },
  site: { label: "Site", hint: "Leitura e marketing. Títulos e corpo crescem entre 360 e 1280px de largura." },
};

const roleNames: Record<TypeRole, string> = {
  display: "Display",
  "heading-xl": "Título XL",
  "heading-lg": "Título LG",
  "heading-md": "Título MD",
  "heading-sm": "Título SM",
  "body-lg": "Corpo LG",
  "body-md": "Corpo MD",
  "body-sm": "Corpo SM",
  "label-lg": "Rótulo LG",
  "label-md": "Rótulo MD",
  "label-sm": "Rótulo SM",
  caption: "Legenda",
  overline: "Sobretítulo",
};

const samples: Record<TypeRole, string> = {
  display: "Uma base comum para cada tela.",
  "heading-xl": "Pedidos em andamento",
  "heading-lg": "Cardápio do dia",
  "heading-md": "Mesa 12 · 3 itens",
  "heading-sm": "Pizza Margherita",
  "body-lg": "Molho de tomate, muçarela de búfala e manjericão fresco.",
  "body-md": "Entrega estimada em 30 a 40 minutos para o seu endereço.",
  "body-sm": "O pedido pode ser alterado até a cozinha iniciar o preparo.",
  "label-lg": "Adicionar ao pedido",
  "label-md": "Em preparo",
  "label-sm": "3 itens",
  caption: "Atualizado há poucos segundos",
  overline: "Mais pedidos",
};

const primitive = (group: string) => tokensIn(group).map((token) => ({ name: token.name, cssVar: token.cssVar, value: Number.parseFloat(token.resolved) }));
const primitives = {
  family: tokenAt("font.family.sans")!.resolved.replaceAll('"', "").split(", "),
  sizes: primitive("font.size"),
  weights: primitive("font.weight"),
  leading: primitive("font.line-height"),
  tracking: primitive("font.letter-spacing"),
};
const px = (value: number) => `${Number(value.toFixed(1))}px`;
const tracking = (value: number) => (value === 0 ? "0" : `${value}em`);
const sizeRange = (style: TypeStyle) => (style.maxSize === undefined ? px(style.size) : `${style.size}–${style.maxSize}px`);

const webSnippet = `<!-- Uma vez, na raiz da superfície -->
<main data-type-context="webapp">
  <h1 class="type-heading-xl">Pedidos em andamento</h1>
  <p class="type-body-md">Mesa 12 · 3 itens</p>
  <button class="type-label-md">Marcar como pronto</button>
</main>

/* Em CSS próprio, use as variáveis do papel */
.order-title {
  font-size: var(--type-heading-md-size);
  line-height: var(--type-heading-md-leading);
}`;

const nativeSnippet = `// tokens/tokens.json → semantic.typography.app["body-md"]
// Em app nativo, line-height e letter-spacing viram pontos:
const bodyMd = {
  fontFamily: "General Sans",
  fontSize: 16,
  lineHeight: 24,      // 16 × 1.5
  fontWeight: "400",
  letterSpacing: 0,    // em × fontSize
};`;

export function PlaygroundTypography() {
  const [context, setContext] = useState<TypeContext>("app");
  const [width, setWidth] = useState(fluidRange.max);
  const fluid = context === "site";

  return <>
    <div className="ds-type-toolbar">
      <Tabs defaultSelectedKey={context} items={typeContexts.map((item) => ({ id: item, label: contextInfo[item].label }))} label="Contexto tipográfico" onSelectionChange={(key) => setContext(key as TypeContext)} />
      <p>{contextInfo[context].hint}</p>
      {fluid && <label className="ds-type-width">
        <span>Largura da prévia</span>
        <input aria-valuetext={`${width} pixels`} max={fluidRange.max} min={fluidRange.min} onChange={(event) => setWidth(Number(event.target.value))} step={10} type="range" value={width} />
        <output>{width}px</output>
      </label>}
    </div>

    <div className="ds-type-stage">
      <div className="ds-type-frame" data-type-context={context} style={fluid ? { width } : undefined}>
        <div className="ds-type-list">{typeRoles.map((role) => {
          const style = typeStyle(context, role);
          const size = fluid ? typeSizeAt(style, width) : style.size;
          return <article className="ds-type-row" key={role}>
            <div className="ds-type-row__meta"><strong>{roleNames[role]}</strong><code>.type-{role}</code><small>{style.description}</small></div>
            <div className="ds-type-row__content">
              <div className={`ds-type-row__sample type-${role}`}>{samples[role]}</div>
              <div className="ds-property-list">
                <span>Tamanho {sizeRange(style)}{style.maxSize !== undefined && <> · agora {px(size)}</>}</span>
                <span>Entrelinha {style.leading} · {px(size * style.leading)}</span>
                <span>Peso {style.weight}</span>
                <span>Letras {tracking(style.tracking)}</span>
                {style.uppercase && <span>Caixa alta via CSS</span>}
              </div>
            </div>
          </article>;
        })}</div>
      </div>
    </div>

    <div className="ds-section-intro ds-section-intro--spaced"><h2>Mesmo papel, três contextos</h2><p>Tamanho e entrelinha de cada papel.</p></div>
    <div className="ds-type-table-wrap">
      <table className="ds-type-table">
        <thead><tr><th scope="col">Papel</th>{typeContexts.map((item) => <th aria-current={context === item ? "true" : undefined} key={item} scope="col">{contextInfo[item].label}</th>)}</tr></thead>
        <tbody>{typeRoles.map((role) => <tr key={role}>
          <th scope="row"><strong>{roleNames[role]}</strong><code>{role}</code></th>
          {typeContexts.map((item) => { const style = typeStyle(item, role); return <td aria-current={context === item ? "true" : undefined} key={item}>{sizeRange(style)}<small>{style.leading} · {style.weight}</small></td>; })}
        </tr>)}</tbody>
      </table>
    </div>

    <div className="ds-section-intro ds-section-intro--spaced"><h2>Primitivos</h2><p>Os papéis apontam para estes valores. Telas usam os papéis.</p></div>
    <div className="ds-type-primitives">
      <div><strong>Família</strong><span>{primitives.family[0]}</span><code>--font-family-sans</code></div>
      <div><strong>Tamanhos · rem</strong><ul>{primitives.sizes.map((item) => <li key={item.name}><code>{item.cssVar}</code><span>{item.value / 16}rem · {item.value}px</span></li>)}</ul></div>
      <div><strong>Pesos</strong><ul>{primitives.weights.map((item) => <li key={item.name}><code>{item.cssVar}</code><span style={{ fontWeight: item.value }}>{item.value}</span></li>)}</ul></div>
      <div><strong>Entrelinha e letras</strong><ul>{primitives.leading.map((item) => <li key={item.name}><code>{item.cssVar}</code><span>{item.value}</span></li>)}{primitives.tracking.map((item) => <li key={item.name}><code>{item.cssVar}</code><span>{tracking(item.value)}</span></li>)}</ul></div>
    </div>

    <div className="ds-section-intro ds-section-intro--spaced"><h2>Como usar</h2><p>Mesmos nomes em todas as plataformas.</p></div>
    <div className="ds-type-usage">
      <div><strong>Web app e site</strong><p>Defina o contexto na raiz e aplique a classe do papel. O site usa clamp() com rem, então o texto também acompanha o tamanho de fonte escolhido pelo usuário.</p><pre><code>{webSnippet}</code></pre></div>
      <div><strong>App nativo</strong><p>Leia <code>tokens/tokens.json</code>. Cada papel em <code>semantic.typography.app</code> aponta para primitivos em px; converta entrelinha e letras para pontos.</p><pre><code>{nativeSnippet}</code></pre></div>
    </div>
    <ul className="ds-type-rules">
      <li>Escolha o papel pela função do texto. Um botão usa <code>label-*</code> mesmo quando o tamanho coincide com <code>body-*</code>.</li>
      <li>Combine <code>heading-xl</code> a <code>heading-sm</code> com h1 a h4 na ordem do documento; o tamanho desce com o nível em todos os contextos.</li>
      <li>Escreva o texto em caixa normal. O sobretítulo aplica a caixa alta por CSS.</li>
      <li>Use <code>.type-tabular</code> em preços, tempos e contadores que mudam.</li>
    </ul>
  </>;
}
