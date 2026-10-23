// Gera uma família de cor 50–950 em OKLCH a partir de uma cor âncora.
// Uso: npm run tokens:scale -- <família> <#hex> [passo] [deslocamento-de-matiz]
// Ex.: npm run tokens:scale -- orange "#D76C30"
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { hexToOklch, oklchToHex } from "./oklch.ts";
import { SOURCE_PATH } from "./build.ts";

export const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
export type Step = (typeof STEPS)[number];

/** Luminosidade OKLCH de cada passo. É a mesma régua das famílias red, green e rust. */
export const LIGHTNESS = [0.971, 0.94, 0.88, 0.8, 0.72, 0.64, 0.578, 0.49, 0.41, 0.33, 0.249];
/** Croma relativo ao pico (passo 600), média das famílias existentes. */
const CHROMA_PROFILE = [0.1, 0.2, 0.37, 0.6, 0.82, 0.95, 1, 0.93, 0.8, 0.65, 0.48];

export function nearestStep(hex: string): Step {
  const { l } = hexToOklch(hex);
  let best = 0;
  LIGHTNESS.forEach((value, index) => { if (Math.abs(value - l) < Math.abs(LIGHTNESS[best] - l)) best = index; });
  return STEPS[best];
}

/**
 * A âncora mantém o valor exato no seu passo. Os outros passos seguem a régua
 * de luminosidade, com croma proporcional e redução automática para caber no sRGB.
 * `hueShift` gira a matiz nos passos escuros (útil para amarelos não ficarem oliva).
 */
export function generateScale(anchor: string, step: Step = nearestStep(anchor), hueShift = 0): Record<Step, string> {
  const base = hexToOklch(anchor);
  const anchorIndex = STEPS.indexOf(step);
  const peak = base.c / CHROMA_PROFILE[anchorIndex];
  const result = {} as Record<Step, string>;
  STEPS.forEach((key, index) => {
    if (index === anchorIndex) { result[key] = anchor.toUpperCase(); return; }
    const darkness = index > anchorIndex ? (index - anchorIndex) / (STEPS.length - 1 - anchorIndex) : 0;
    result[key] = oklchToHex({ l: LIGHTNESS[index], c: peak * CHROMA_PROFILE[index], h: (base.h + hueShift * darkness + 360) % 360 });
  });
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [family, anchor, stepArg, shiftArg] = process.argv.slice(2);
  if (!family || !/^#[0-9a-f]{6}$/i.test(anchor ?? "")) {
    console.error('Uso: npm run tokens:scale -- <família> <#hex> [passo] [deslocamento-de-matiz]');
    process.exit(1);
  }
  const step = (stepArg as Step | undefined) ?? nearestStep(anchor);
  if (!STEPS.includes(step)) { console.error(`Passo inválido: ${step}`); process.exit(1); }
  const source = JSON.parse(readFileSync(SOURCE_PATH, "utf8"));
  const scale = generateScale(anchor, step, Number(shiftArg ?? 0));
  const group = source.color[family] ?? { $type: "color" };
  for (const key of STEPS) group[key] = { ...group[key], $value: scale[key] };
  group.$description = group.$description ?? `Escala gerada a partir de ${anchor.toUpperCase()} no passo ${step}.`;
  source.color[family] = group;
  writeFileSync(SOURCE_PATH, JSON.stringify(source, null, 2) + "\n");
  console.log(`color.${family}: ${STEPS.map((key) => `${key} ${scale[key]}`).join(" · ")}`);
}
