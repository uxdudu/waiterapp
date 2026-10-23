import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Layers3, Menu, Palette, Puzzle, Ruler, Type, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PlaygroundPreview } from "./PlaygroundPreview";
import { PlaygroundTypography } from "./PlaygroundTypography";
import { groupAt, tokens, tokensIn, typeRoles, type TokenRecord } from "../styles/tokens";
import { catalog, foundationNav, groupLabels, principleNav, type CatalogGroup, type CatalogItem } from "./playground-catalog";
import { Button } from "../components/base";
import "./playground.css";

const colorFamilies = [...new Set(tokens.filter((token) => token.path.startsWith("color.")).map((token) => token.group.split(".")[1]))];
const semanticGroups = [...new Set(tokens.filter((token) => token.path.startsWith("semantic.color.")).map((token) => token.group))];
const spacing = tokensIn("space").sort((a, b) => Number.parseFloat(a.resolved) - Number.parseFloat(b.resolved));
const radii = tokensIn("radius");
const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const semanticName = (token: TokenRecord) => token.path.replace("semantic.color.", "").replace(".default", "").replaceAll(".", " · ");

const principles = [
  { title: "Estado legível", text: "Pedidos, conexão e ações usam texto junto com indicadores visuais. Os exemplos aparecem no Garçom, na Cozinha e no shell.", source: "StatusBadge · OrderSummaryCard · OrderBoardColumn" },
  { title: "Ação no contexto", text: "Adicionar, confirmar e atualizar aparecem perto do conteúdo afetado, como produto, pedido e carrinho.", source: "ProductCard · CheckoutBar · OrderLine" },
  { title: "Superfície adequada", text: "O Garçom usa navegação móvel; a Cozinha organiza etapas em colunas; o Delivery adapta catálogo e carrinho à largura disponível.", source: "GarcomPage · KitchenOrdersPage · DeliveryPage" },
];

const rules = [
  { title: "Estados com texto", status: "Observado", detail: "Chips, badges e toasts trazem um rótulo além da cor.", source: "GarcomPage · KitchenOrdersPage · App" },
  { title: "Ações indisponíveis", status: "Observado", detail: "Opções ainda não disponíveis usam o estado disabled nas navegações e abas.", source: "AppNavigation · NavItem · Tabs" },
  { title: "Fonte única", status: "Observado", detail: "Cores, tipografia, espaço e raios saem de tokens/tokens.json. O CSS e esta documentação são gerados com npm run tokens; o build falha se estiverem desatualizados.", source: "tokens/tokens.json · scripts/tokens/build.ts" },
  { title: "Papéis tipográficos nas telas", status: "Em revisão", detail: "Garçom usa o contexto app; Cozinha e Delivery usam webapp. Base e Blocks consomem os papéis tipográficos da fonte central.", source: "tokens.json · styles.css" },
  { title: "Raios", status: "Em revisão", detail: "Os quatro raios existem como tokens, mas as telas ainda usam valores locais de canto.", source: "tokens.json · styles.css" },
  { title: "Componentização", status: "Aplicado", detail: "Base reúne elementos reutilizáveis; Blocks compõe esses elementos. Garçom, Cozinha e Delivery importam as mesmas APIs.", source: "GarcomPage · KitchenOrdersPage · DeliveryPage" },
];

const catalogGroups: CatalogGroup[] = ["base", "blocks"];

function RouteLink({ id, children, active, onSelect }: { id: string; children: ReactNode; active: boolean; onSelect: () => void }) {
  return <Link aria-current={active ? "page" : undefined} className={"ds-nav-link" + (active ? " ds-nav-link--active" : "")} onClick={onSelect} to={"/playground#" + id}>{children}</Link>;
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="ds-page-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function InfoNote({ children }: { children: ReactNode }) {
  return <div className="ds-info-note"><BookOpen aria-hidden="true" size={18} /><p>{children}</p></div>;
}

function CatalogCard({ item }: { item: CatalogItem }) {
  return <article className="ds-catalog-card">
    <div className="ds-catalog-card__visual" inert><PlaygroundPreview compact kind={item.preview} /></div>
    <Link className="ds-catalog-card__body" to={"/playground#component-" + item.id}><span>{groupLabels[item.group]}</span><strong>{item.name}</strong><ArrowUpRight aria-hidden="true" size={17} /></Link>
  </article>;
}

export function PlaygroundPage() {
  const location = useLocation();
  const current = decodeURIComponent(location.hash.replace(/^#/, "")) || "tokens";
  const component = current.startsWith("component-") ? catalog.find((item) => item.id === current.slice(10)) : undefined;
  const [designOpen, setDesignOpen] = useState(true);
  const [principlesOpen, setPrinciplesOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(Boolean(component) || current === "componentes");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detailView, setDetailView] = useState<{ id?: string; tab: "preview" | "implementation" }>({ id: component?.id, tab: "preview" });
  const detailTab = detailView.id === component?.id ? detailView.tab : "preview";
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [current]);

  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch { setCopied(null); }
  }

  const closeMobile = () => setMobileOpen(false);
  const sectionName = component ? "Components" : principleNav.some((item) => item.id === current) ? "Principles & Rules" : "Design System";
  const currentName = component?.name || [...foundationNav, ...principleNav, { id: "componentes", label: "Overview" }].find((item) => item.id === current)?.label || "Overview";

  return <div className="ds-app">
    <div className="ds-mobile-bar"><button aria-label="Abrir navegação" onClick={() => setMobileOpen(true)} type="button"><Menu size={22} /></button><strong>Waiterapp / Playground</strong><Link to="/"><ArrowLeft size={19} aria-label="Voltar ao início" /></Link></div>
    {mobileOpen && <button aria-label="Close navigation" className="ds-sidebar-backdrop" onClick={closeMobile} type="button" />}
    <aside aria-label="Design system navigation" className={"ds-sidebar" + (mobileOpen ? " ds-sidebar--open" : "")}>
      <div className="ds-sidebar__brand"><div><span>Waiterapp</span><strong>Playground</strong></div><button aria-label="Close navigation" className="ds-sidebar__close" onClick={closeMobile} type="button"><X size={18} /></button></div>
      <nav className="ds-sidebar__nav">
        <div className="ds-nav-group">
          <button aria-expanded={designOpen} className="ds-nav-group__button" onClick={() => setDesignOpen((open) => !open)} type="button"><Layers3 size={16} aria-hidden="true" />Design System<ChevronDown aria-hidden="true" className={designOpen ? "ds-chevron--open" : ""} size={15} /></button>
          {designOpen && <div className="ds-nav-group__items">{foundationNav.map((item) => <RouteLink active={current === item.id} id={item.id} key={item.id} onSelect={closeMobile}>{item.label}</RouteLink>)}</div>}
        </div>
        <div className="ds-nav-group">
          <button aria-expanded={principlesOpen} className="ds-nav-group__button" onClick={() => setPrinciplesOpen((open) => !open)} type="button"><BookOpen size={16} aria-hidden="true" />Principles & Rules<ChevronDown aria-hidden="true" className={principlesOpen ? "ds-chevron--open" : ""} size={15} /></button>
          {principlesOpen && <div className="ds-nav-group__items">{principleNav.map((item) => <RouteLink active={current === item.id} id={item.id} key={item.id} onSelect={closeMobile}>{item.label}</RouteLink>)}</div>}
        </div>
        <div className="ds-nav-group">
          <button aria-expanded={componentsOpen} className="ds-nav-group__button" onClick={() => setComponentsOpen((open) => !open)} type="button"><Puzzle size={16} aria-hidden="true" />Components<span className="ds-nav-group__count">{catalog.length}</span><ChevronDown aria-hidden="true" className={componentsOpen ? "ds-chevron--open" : ""} size={15} /></button>
          {componentsOpen && <div className="ds-nav-group__items"><RouteLink active={current === "componentes"} id="componentes" onSelect={closeMobile}>Overview</RouteLink>{catalogGroups.map((group) => <div className="ds-nav-subgroup" key={group}><span>{groupLabels[group]}</span>{catalog.filter((item) => item.group === group).map((item) => <RouteLink active={current === "component-" + item.id} id={"component-" + item.id} key={item.id} onSelect={closeMobile}>{item.name}</RouteLink>)}</div>)}</div>}
        </div>
      </nav>
      <div className="ds-sidebar__footer"><span className="ds-sidebar__online" />Current code inventory</div>
    </aside>

    <main className="ds-main">
      <div className="ds-topline"><div><span>{sectionName}</span><ChevronDown size={13} aria-hidden="true" /><strong>{currentName}</strong></div><Link to="/">Voltar ao produto <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      <div className="ds-content">
        {current === "tokens" && <>
          <PageHeading eyebrow="Fundamentos" title="Design System" description="Um mapa do que o Waiterapp já usa. Valores centrais, decisões observadas e componentes em produção no protótipo." />
          <div className="ds-summary-strip"><div><strong>{colorFamilies.length}</strong><span>escalas de cor primitivas</span></div><div><strong>{tokens.filter((token) => token.path.startsWith("semantic.color.")).length}</strong><span>cores semânticas</span></div><div><strong>{typeRoles.length}</strong><span>papéis tipográficos</span></div></div>
          <div className="ds-section-intro"><h2>Tokens</h2><p>Selecione uma família para consultar valores e usos.</p></div>
          <div className="ds-foundation-grid"><Link to="/playground#cores"><Palette size={23} /><strong>Colors</strong><span>Primitives, semantics and usage</span><ArrowUpRight size={18} /></Link><Link to="/playground#tipografia"><Type size={23} /><strong>Tipografia</strong><span>13 papéis para app, web app e site</span><ArrowUpRight size={18} /></Link><Link to="/playground#espacamento"><Ruler size={23} /><strong>Espaçamento</strong><span>{spacing.length} passos de espaçamento</span><ArrowUpRight size={18} /></Link><Link to="/playground#raios"><Layers3 size={23} /><strong>Raios</strong><span>{radii.length} valores declarados</span><ArrowUpRight size={18} /></Link></div>
          <InfoNote>Fonte única: <code>tokens/tokens.json</code>. Depois de editar, rode <code>npm run tokens</code> para gerar <code>src/styles/tokens.css</code> e <code>src/styles/tokens.ts</code>, que alimentam as telas e esta documentação.</InfoNote>
        </>}

        {current === "cores" && <>
          <PageHeading eyebrow="Design System / Tokens" title="Colors" description="Primitive scales and semantic roles used by Waiterapp. The brand color #D73035 is red-600." />
          <div className="ds-section-intro"><h2>From primitive to interface</h2></div>
          <div className="ds-token-flow" aria-label="Primitive to semantic token to Button">
            <div><span>Primitive</span><strong><i style={{ background: "var(--color-red-600)" }} />--color-red-600</strong><small>#D73035</small></div>
            <b aria-hidden="true"><ArrowRight size={20} strokeWidth={1.5} /></b>
            <div><span>Semantic</span><strong><i style={{ background: "var(--color-brand)" }} />--color-brand</strong><small>--color-red-600</small></div>
            <b aria-hidden="true"><ArrowRight size={20} strokeWidth={1.5} /></b>
            <div><span>Interface</span><Button>Add item</Button><small>Primary Button</small></div>
          </div>
          {colorFamilies.map((family) => {
            const steps = tokensIn(`color.${family}`).sort((a, b) => Number(a.name) - Number(b.name));
            return <section className={`ds-palette-section ds-palette-section--${family}`} key={family} aria-labelledby={`palette-${family}`}>
              <div className="ds-section-intro ds-section-intro--spaced"><h2 id={`palette-${family}`}>{titleCase(family)} · {steps[0]?.name}–{steps.at(-1)?.name}</h2></div>
              <div className="ds-scale-grid">{steps.map((token) => <button aria-label={`Copy ${family} ${token.name}, ${token.resolved}`} className="ds-scale-step" key={token.name} onClick={() => void copyValue(token.cssVar, token.resolved)} type="button"><span style={{ background: `var(${token.cssVar})` }}>{copied === token.cssVar && <Check aria-label="Copied" size={20} />}</span><strong>{token.name}</strong><code>{token.resolved}</code></button>)}</div>
            </section>;
          })}
          <div className="ds-section-intro ds-section-intro--spaced"><h2>Semantic tokens</h2><p>Role, source token and resolved value. Text colors show contrast on the white surface.</p></div>
          {semanticGroups.map((groupPath) => <div className="ds-semantic-group" key={groupPath}>
            <h3>{groupPath === "semantic.color" ? "Foco e sombra" : groupAt(groupPath)?.description ?? titleCase(groupPath.split(".").at(-1)!)}</h3>
            <div className="ds-semantic-list">{tokensIn(groupPath).map((token) => <div className="ds-semantic-row" key={token.path}><i style={{ background: `var(${token.cssVar})` }} /><div><strong>{semanticName(token)}</strong><small>{token.description}{token.contrastOnSurface !== undefined && ` · ${token.contrastOnSurface}:1`}</small></div><code>{token.cssVar}</code><span aria-hidden="true">←</span><code>{token.reference}</code><span>{token.resolved}</span></div>)}</div>
          </div>)}
          <InfoNote>Edit colors only in <code>tokens/tokens.json</code>. To create or regenerate a family from one anchor, run <code>npm run tokens:scale -- &lt;family&gt; &lt;hex&gt; &lt;step&gt;</code>, then <code>npm run tokens</code>.</InfoNote>
        </>}

        {current === "tipografia" && <>
          <PageHeading eyebrow="Design System / Tokens" title="Tipografia" description="Treze papéis com os mesmos nomes no app, no web app e no site. O papel define o uso do texto; o contexto ajusta tamanho e entrelinha para a superfície." />
          <PlaygroundTypography />
          <InfoNote>Fonte única: <code>tokens/tokens.json</code>, em <code>semantic.typography</code>. O CSS em <code>src/styles/tokens.css</code> é gerado com <code>npm run tokens</code>. Garçom usa <code>app</code>; Cozinha e Delivery usam <code>webapp</code>. Os componentes Base e Blocks consomem os papéis dessa fonte.</InfoNote>
        </>}

        {current === "espacamento" && <>
          <PageHeading eyebrow="Design System / Tokens" title="Espaçamento" description="Escala em múltiplos de 8px, com meios e quartos de passo para ajustes finos. O nome é o múltiplo × 100: 100 = 8px, 050 = 4px, 250 = 20px." />
          <div className="ds-measure-list">{spacing.map((item) => <div className="ds-measure-row" key={item.cssVar}><code>{item.cssVar}</code><span className="ds-measure-row__track"><i style={{ width: `var(${item.cssVar})` }} /></span><strong>{item.resolved}</strong></div>)}</div>
          <InfoNote>Padding, margin e gap das telas usam esta escala. Recuos responsivos em vw, porcentagens e ajustes de 1px continuam locais.</InfoNote>
        </>}

        {current === "raios" && <>
          <PageHeading eyebrow="Design System / Tokens" title="Raios" description="Tokens para cantos de controles, painéis e elementos em formato de cápsula." />
          <div className="ds-radius-grid">{radii.map((item) => <div key={item.cssVar}><span style={{ borderRadius: `var(${item.cssVar})` }} /><strong>{item.cssVar}</strong><code>{item.resolved}</code></div>)}</div>
          <InfoNote>As telas de produto também incluem raios locais em CSS. Os exemplos acima exibem apenas os tokens declarados.</InfoNote>
        </>}

        {current === "principios" && <>
          <PageHeading eyebrow="Principles & Rules" title="Princípios observados" description="Padrões recorrentes identificados nas três experiências do produto. Eles descrevem a implementação atual." />
          <div className="ds-principle-list">{principles.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{item.title}</h2><p>{item.text}</p><small>Onde aparece: {item.source}</small></div></article>)}</div>
        </>}

        {current === "regras" && <>
          <PageHeading eyebrow="Principles & Rules" title="Regras e pendências" description="O que já se repete no código e o que precisa de uma decisão antes de virar padrão do sistema." />
          <div className="ds-rule-list">{rules.map((rule) => <article key={rule.title}><span className={"ds-rule-status" + (rule.status === "Em revisão" ? " ds-rule-status--review" : "")}>{rule.status}</span><h2>{rule.title}</h2><p>{rule.detail}</p><small>{rule.source}</small></article>)}</div>
        </>}

        {current === "componentes" && <>
          <PageHeading eyebrow="Components" title="Componentes no código" description="Dois níveis compartilhados pelas três superfícies. O App Garçom define a linguagem visual; Cozinha e Delivery adaptam o layout." />
          <InfoNote>Todas as prévias renderizam os componentes reais. Abra uma ficha para testar estados e ações, sem alterar dados das telas de produto.</InfoNote>
          {catalogGroups.map((group) => <section className="ds-catalog-section" key={group}><div className="ds-section-intro"><h2>{groupLabels[group]}</h2><p>{group === "base" ? "Elementos reutilizáveis com a linguagem visual do Garçom." : "Composições de Base para produtos, pedidos, navegação e checkout."}</p></div><div className="ds-catalog-grid">{catalog.filter((item) => item.group === group).map((item) => <CatalogCard item={item} key={item.id} />)}</div></section>)}
        </>}

        {component && <>
          <div className="ds-detail-back"><Link to="/playground#componentes"><ArrowLeft size={16} /> Todos os componentes</Link></div>
          <PageHeading eyebrow={"Components / " + groupLabels[component.group]} title={component.name} description={component.description} />
          <div className="ds-detail-meta"><span>{component.group === "base" ? "Componente Base" : "Composição de Base"}</span><span>{component.source}</span>{component.route && <Link target="_blank" rel="noreferrer" to={component.route}>Ver na tela <ArrowUpRight size={14} /></Link>}</div>
          <div className="ds-detail-panel"><div className="ds-detail-tabs" aria-label="Conteúdo do componente"><button aria-pressed={detailTab === "preview"} onClick={() => setDetailView({ id: component.id, tab: "preview" })} type="button">Prévia</button><button aria-pressed={detailTab === "implementation"} onClick={() => setDetailView({ id: component.id, tab: "implementation" })} type="button">Implementação</button></div>{detailTab === "preview" ? <div className="ds-detail-panel__preview"><PlaygroundPreview key={component.id} kind={component.preview} /></div> : <div className="ds-detail-panel__implementation"><p>Importe a API compartilhada nas páginas e em outras composições:</p><pre><code>{component.snippet}</code></pre><div className="ds-source-line"><span>Origem no código</span><code>{component.source}</code></div><div className="ds-source-line"><span>Exemplo em uso</span><code>{component.route}</code></div></div>}</div>
          <InfoNote>Base define controles, estados e superfícies. Blocks combina Base em padrões de produto; dados e regras de negócio ficam nas páginas.</InfoNote>
        </>}

        {!component && ![...foundationNav, ...principleNav, { id: "componentes" }].some((item) => item.id === current) && <><PageHeading eyebrow="Playground" title="Página não encontrada" description="Escolha uma seção na navegação lateral para continuar." /><Link className="ds-return-link" to="/playground#tokens">Abrir visão geral <ArrowUpRight size={16} /></Link></>}
        <footer className="ds-footer"><span>Waiterapp · inventário do design system</span><span>Fonte: código do projeto</span></footer>
      </div>
    </main>
  </div>;
}
