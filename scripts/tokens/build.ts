// Gera src/styles/tokens.css e src/styles/tokens.ts a partir de tokens/tokens.json.
// Uso: npm run tokens          → escreve os arquivos
//      npm run tokens:check    → falha se os arquivos gerados estiverem desatualizados
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contrastRatio, hexToRgb } from "./oklch.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const SOURCE_PATH = resolve(ROOT, "tokens/tokens.json");
const CSS_PATH = resolve(ROOT, "src/styles/tokens.css");
const TS_PATH = resolve(ROOT, "src/styles/tokens.ts");

type Json = Record<string, unknown>;
type RawToken = { path: string; type: string; value: unknown; description?: string; alpha?: number; typography?: { maxFontSize?: string; textTransform?: string } };
export type TokenRecord = {
  path: string;
  group: string;
  name: string;
  cssVar: string;
  type: string;
  css: string;
  reference?: string;
  resolved: string;
  description?: string;
  contrastOnSurface?: number;
};

const REF = /^\{([^}]+)\}$/;
const isGroupKey = (key: string) => key.startsWith("$");

function collect(node: Json, path: string[], inheritedType: string | undefined, out: RawToken[]) {
  const type = (node.$type as string | undefined) ?? inheritedType;
  if ("$value" in node) {
    const extensions = node.$extensions as Json | undefined;
    const alpha = extensions?.["waiterapp.alpha"] as number | undefined;
    const typography = extensions?.["waiterapp.typography"] as RawToken["typography"];
    out.push({ path: path.join("."), type: type ?? "unknown", value: node.$value, description: node.$description as string | undefined, alpha, typography });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (isGroupKey(key) || typeof child !== "object" || child === null) continue;
    collect(child as Json, [...path, key], type, out);
  }
}

/** semantic.color.brand.default → --color-brand · font.line-height.tight → --line-height-tight */
export function cssVarFor(path: string): string {
  let parts = path.split(".");
  if (parts[0] === "semantic") parts = parts.slice(1);
  if (parts[0] === "font" && (parts[1] === "line-height" || parts[1] === "letter-spacing")) parts = parts.slice(1);
  if (parts[0] === "typography") parts = ["typography", ...parts.slice(1)];
  return "--" + parts.filter((part) => part !== "default").join("-");
}

const fontStack = (value: unknown) => (value as string[]).map((name) => (/\s/.test(name) ? `"${name}"` : name)).join(", ");
const pxToRem = (value: string) => {
  const match = /^(-?[\d.]+)px$/.exec(value);
  return match ? `${+(Number(match[1]) / 16).toFixed(4)}rem` : value;
};

function rgbaFrom(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex).map((v) => Math.round(v * 255));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type TokenGroup = { path: string; description?: string; anchors?: string[] };

function collectGroups(node: Json, path: string[], out: TokenGroup[]) {
  if ("$value" in node) return;
  const anchors = (node.$extensions as Json | undefined)?.["waiterapp.anchors"] as string[] | undefined;
  if (path.length && (node.$description || anchors)) out.push({ path: path.join("."), description: node.$description as string | undefined, anchors });
  for (const [key, child] of Object.entries(node)) {
    if (!isGroupKey(key) && typeof child === "object" && child !== null) collectGroups(child as Json, [...path, key], out);
  }
}

export function buildTokens({ check = false } = {}) {
  const source = JSON.parse(readFileSync(SOURCE_PATH, "utf8")) as Json;
  const raw: RawToken[] = [];
  for (const key of ["color", "font", "space", "radius", "semantic"]) collect(source[key] as Json, [key], undefined, raw);
  const byPath = new Map(raw.map((token) => [token.path, token]));
  const groups: TokenGroup[] = [];
  for (const key of ["color", "font", "space", "radius", "semantic"]) collectGroups(source[key] as Json, [key], groups);

  const seen = new Map<string, string>();
  for (const token of raw) {
    const name = cssVarFor(token.path);
    if (seen.has(name)) throw new Error(`Nome duplicado ${name}: ${seen.get(name)} e ${token.path}`);
    seen.set(name, token.path);
  }

  const refTarget = (value: string, from: string) => {
    const path = REF.exec(value)?.[1];
    if (!path) return undefined;
    if (!byPath.has(path)) throw new Error(`Referência inexistente {${path}} em ${from}`);
    return path;
  };

  const resolveRaw = (token: RawToken, depth = 0): string => {
    if (depth > 10) throw new Error(`Referência circular em ${token.path}`);
    if (typeof token.value === "string") {
      const target = refTarget(token.value, token.path);
      if (target) {
        const value = resolveRaw(byPath.get(target)!, depth + 1);
        return token.alpha !== undefined ? rgbaFrom(value, token.alpha) : value;
      }
      return token.value;
    }
    if (Array.isArray(token.value)) return fontStack(token.value);
    if (typeof token.value === "object" && token.value) {
      const parts = token.value as Record<string, string>;
      const get = (key: string) => resolveRaw({ path: `${token.path}.${key}`, type: "", value: parts[key] }, depth + 1);
      return `${get("fontWeight")} ${get("fontSize")}/${get("lineHeight")} · ${get("letterSpacing")}`;
    }
    return String(token.value);
  };

  const cssValue = (token: RawToken, value: unknown = token.value): string => {
    if (typeof value === "string") {
      const target = refTarget(value, token.path);
      if (target) {
        const ref = `var(${cssVarFor(target)})`;
        return token.alpha !== undefined ? `color-mix(in srgb, ${ref} ${Math.round(token.alpha * 100)}%, transparent)` : ref;
      }
      if (token.path.startsWith("font.size.")) return pxToRem(value);
      if (value === "0em") return "0";
      return value;
    }
    if (Array.isArray(value)) return fontStack(value);
    return String(value);
  };

  const records: TokenRecord[] = raw.map((token) => {
    const segments = token.path.split(".");
    const cssVar = cssVarFor(token.path);
    const reference = typeof token.value === "string" ? REF.exec(token.value)?.[1] : undefined;
    const resolved = resolveRaw(token);
    const group = segments.slice(0, -1).join(".");
    const record: TokenRecord = { path: token.path, group, name: segments.at(-1)!, cssVar, type: token.type, css: token.type === "typography" ? "" : cssValue(token), resolved, description: token.description };
    if (reference) record.reference = cssVarFor(reference);
    return record;
  });

  const surface = records.find((record) => record.path === "semantic.color.bg.surface")!.resolved;
  for (const record of records) {
    if (record.group === "semantic.color.text" && record.resolved.startsWith("#") && record.name !== "inverse") record.contrastOnSurface = +contrastRatio(record.resolved, surface).toFixed(2);
  }

  const line = (name: string, value: string) => `  ${name}: ${value};`;
  const section = (title: string, prefix: string) => {
    const items = records.filter((record) => record.path.startsWith(prefix) && record.type !== "typography");
    return items.length ? [`  /* ${title} */`, ...items.map((record) => line(record.cssVar, record.css)), ""] : [];
  };

  // Tipografia por contexto. Cada contexto redeclara as variáveis do papel, porque um composto
  // definido em :root resolve os var() lá e não muda quando um descendente troca de contexto.
  const typeSource = (source.semantic as Json).typography as Json;
  const fluid = (typeSource.$extensions as Json)["waiterapp.fluid"] as { minWidth: number; maxWidth: number };
  const typeContexts = Object.keys(typeSource).filter((key) => !isGroupKey(key));
  const pxOf = (path: string) => Number.parseFloat(resolveRaw(byPath.get(path)!));
  const typeStyles = raw.filter((token) => token.type === "typography").map((token) => {
    const [, , context, role] = token.path.split(".");
    const parts = token.value as Record<string, string>;
    const ref = (value: string) => refTarget(value, token.path)!;
    const sizePath = ref(parts.fontSize);
    const maxPath = token.typography?.maxFontSize ? ref(token.typography.maxFontSize) : undefined;
    const size = pxOf(sizePath);
    const maxSize = maxPath ? pxOf(maxPath) : undefined;
    let sizeCss = `var(${cssVarFor(sizePath)})`;
    if (maxPath && maxSize !== undefined) {
      const slope = (maxSize - size) / (fluid.maxWidth - fluid.minWidth);
      const round = (value: number) => Number(value.toFixed(4));
      sizeCss = `clamp(${sizeCss}, ${round((size - slope * fluid.minWidth) / 16)}rem + ${round(slope * 100)}cqi, var(${cssVarFor(maxPath)}))`;
    }
    const record = records.find((item) => item.path === token.path)!;
    record.css = sizeCss;
    return {
      context,
      role,
      description: token.description ?? "",
      size,
      maxSize,
      weight: Number(resolveRaw(byPath.get(ref(parts.fontWeight))!)),
      leading: Number(resolveRaw(byPath.get(ref(parts.lineHeight))!)),
      tracking: Number.parseFloat(resolveRaw(byPath.get(ref(parts.letterSpacing))!)),
      uppercase: token.typography?.textTransform === "uppercase",
      vars: {
        size: cssVarFor(sizePath),
        maxSize: maxPath ? cssVarFor(maxPath) : undefined,
        weight: cssVarFor(ref(parts.fontWeight)),
        leading: cssVarFor(ref(parts.lineHeight)),
        tracking: cssVarFor(ref(parts.letterSpacing)),
      },
      css: { family: cssValue(token, parts.fontFamily), size: sizeCss, weight: cssValue(token, parts.fontWeight), leading: cssValue(token, parts.lineHeight), tracking: cssValue(token, parts.letterSpacing) },
    };
  });
  const typeRoles = [...new Set(typeStyles.map((style) => style.role))];
  const contextSelector = (context: string, index: number) => (index === 0 ? `:root,\n[data-type-context="${context}"]` : `[data-type-context="${context}"]`);
  const contextBlocks = typeContexts.flatMap((context, index) => [
    `/* Contexto ${context}${index === 0 ? " (padrão)" : ""} */`,
    `${contextSelector(context, index)} {`,
    ...typeStyles.filter((style) => style.context === context).flatMap((style) => [
      line(`--type-${style.role}-size`, style.css.size),
      line(`--type-${style.role}-leading`, style.css.leading),
      line(`--type-${style.role}-weight`, style.css.weight),
      line(`--type-${style.role}-tracking`, style.css.tracking),
    ]),
    "}",
    "",
  ]);
  const roleClasses = typeRoles.flatMap((role) => {
    const style = typeStyles.find((item) => item.role === role)!;
    return [
      `.type-${role} {`,
      `  font-family: ${style.css.family};`,
      `  font-size: var(--type-${role}-size);`,
      `  font-weight: var(--type-${role}-weight);`,
      `  letter-spacing: var(--type-${role}-tracking);`,
      `  line-height: var(--type-${role}-leading);`,
      ...(style.uppercase ? ["  text-transform: uppercase;"] : []),
      ...(role === "display" || role.startsWith("heading") ? ["  text-wrap: balance;"] : []),
      "}",
      "",
    ];
  });

  const adapters = ((source.$extensions as Json)?.["waiterapp.adapters"] as Json | undefined)?.heroui as Record<string, string> | undefined;
  const adapterLines = Object.entries(adapters ?? {})
    .filter(([key]) => !isGroupKey(key))
    .map(([name, value]) => line(name, cssValue({ path: `adapter ${name}`, type: "", value })));

  const css = [
    "/* Arquivo gerado por `npm run tokens`. Não edite: altere tokens/tokens.json. */",
    "",
    ":root {",
    ...section("Primitivos · cor", "color."),
    ...section("Primitivos · família tipográfica", "font.family."),
    ...section("Primitivos · tamanho de fonte", "font.size."),
    ...section("Primitivos · peso", "font.weight."),
    ...section("Primitivos · altura de linha", "font.line-height."),
    ...section("Primitivos · espaçamento entre letras", "font.letter-spacing."),
    ...section("Primitivos · espaço", "space."),
    ...section("Primitivos · raio", "radius."),
    ...section("Semânticos · cor", "semantic.color."),
    "}",
    "",
    "/* Adaptador HeroUI: a biblioteca lê estes nomes; os valores vêm da camada semântica. */",
    ":root {",
    ...adapterLines,
    "}",
    "",
    "/* Tipografia: papéis por contexto. Use data-type-context=\"app\" | \"webapp\" | \"site\" na raiz da superfície. */",
    ...contextBlocks,
    ...roleClasses,
    "/* Valores que mudam (preço, tempo, contagem) sem deslocar o layout. */",
    ".type-tabular { font-variant-numeric: tabular-nums; }",
    "",
  ].join("\n");

  const ts = [
    "// Arquivo gerado por `npm run tokens`. Não edite: altere tokens/tokens.json.",
    "",
    "export type TokenRecord = {",
    "  path: string;",
    "  group: string;",
    "  name: string;",
    "  cssVar: string;",
    "  type: string;",
    "  css: string;",
    "  reference?: string;",
    "  resolved: string;",
    "  description?: string;",
    "  contrastOnSurface?: number;",
    "};",
    "",
    `export const tokens: TokenRecord[] = ${JSON.stringify(records, null, 2)};`,
    "",
    "export type TokenGroup = { path: string; description?: string; anchors?: string[] };",
    `export const tokenGroups: TokenGroup[] = ${JSON.stringify(groups, null, 2)};`,
    "export const groupAt = (path: string) => tokenGroups.find((group) => group.path === path);",
    "",
    "export const tokensIn = (group: string) => tokens.filter((token) => token.group === group);",
    "export const tokenAt = (path: string) => tokens.find((token) => token.path === path);",
    "",
    `export const typeContexts = ${JSON.stringify(typeContexts)} as const;`,
    "export type TypeContext = (typeof typeContexts)[number];",
    `export const typeRoles = ${JSON.stringify(typeRoles)} as const;`,
    "export type TypeRole = (typeof typeRoles)[number];",
    "",
    "export type TypeStyle = {",
    "  context: TypeContext;",
    "  role: TypeRole;",
    "  description: string;",
    "  /** Tamanho em px. No site fluido, é o mínimo; é também o valor do app nativo. */",
    "  size: number;",
    "  /** Tamanho máximo em px, só nos papéis fluidos do site. */",
    "  maxSize?: number;",
    "  weight: number;",
    "  leading: number;",
    "  /** Espaçamento entre letras em em. */",
    "  tracking: number;",
    "  uppercase: boolean;",
    "  vars: { size: string; maxSize?: string; weight: string; leading: string; tracking: string };",
    "  css: { family: string; size: string; weight: string; leading: string; tracking: string };",
    "};",
    "",
    `export const fluidRange = { min: ${fluid.minWidth}, max: ${fluid.maxWidth} };`,
    `export const typeStyles: TypeStyle[] = ${JSON.stringify(typeStyles, null, 2)};`,
    "",
    "export const typeStyle = (context: TypeContext, role: TypeRole) => typeStyles.find((style) => style.context === context && style.role === role)!;",
    "",
    "/** Tamanho em px numa largura de contêiner, com a mesma fórmula do clamp() gerado. */",
    "export function typeSizeAt(style: TypeStyle, width: number) {",
    "  if (style.maxSize === undefined) return style.size;",
    "  const progress = (width - fluidRange.min) / (fluidRange.max - fluidRange.min);",
    "  return Math.min(style.maxSize, Math.max(style.size, style.size + (style.maxSize - style.size) * progress));",
    "}",
    "",
  ].join("\n");

  const outputs: [string, string][] = [[CSS_PATH, css], [TS_PATH, ts]];
  const stale = outputs.filter(([path, content]) => { try { return readFileSync(path, "utf8") !== content; } catch { return true; } });
  if (check) return { stale: stale.map(([path]) => path), count: records.length };
  for (const [path, content] of stale) writeFileSync(path, content);
  return { stale: stale.map(([path]) => path), count: records.length };
}

const TOKEN_PREFIXES = /^--(color|font-size|font-weight|font-family|line-height|letter-spacing|space|radius|type)-/;

/** Lista usos de var(--token) em src que não existem no tokens.css gerado (ex.: nome antigo após renomear). */
export function findUnknownTokenUses() {
  const generated = readFileSync(CSS_PATH, "utf8");
  const defined = new Set([...generated.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  const problems: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = resolve(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(css|tsx?)$/.test(entry) && path !== CSS_PATH && path !== TS_PATH) {
        readFileSync(path, "utf8").split("\n").forEach((text, index) => {
          for (const match of text.matchAll(/var\((--[\w-]+)/g)) {
            if (TOKEN_PREFIXES.test(match[1]) && !defined.has(match[1])) problems.push(`${path.replace(ROOT + "/", "")}:${index + 1} ${match[1]}`);
          }
        });
      }
    }
  };
  walk(resolve(ROOT, "src"));
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes("--check");
  try {
    const result = buildTokens({ check });
    if (check && result.stale.length) {
      console.error(`Tokens desatualizados: ${result.stale.join(", ")}. Rode npm run tokens.`);
      process.exit(1);
    }
    const unknown = findUnknownTokenUses();
    if (unknown.length) {
      console.error(`Tokens inexistentes usados no código:\n  ${unknown.join("\n  ")}`);
      process.exit(1);
    }
    console.log(`${result.count} tokens · ${check ? "arquivos em dia" : result.stale.length ? "gerados: " + result.stale.map((path) => path.replace(ROOT + "/", "")).join(", ") : "sem alterações"}`);
  } catch (error) {
    console.error(`Erro nos tokens: ${(error as Error).message}`);
    process.exit(1);
  }
}
