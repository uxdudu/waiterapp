# Cores do Waiterapp

Fonte única: `tokens/tokens.json`. A documentação visual em `/playground#cores` lê os dados gerados; mostra todas as escalas, referências semânticas e contraste do texto na superfície branca. O guia de manutenção está em [design-tokens.md](design-tokens.md).

## Camadas

`Primitivo → semântico → interface`. Não há tokens de cor por componente. Exemplo: `color.red.600` → `semantic.color.brand.default` → botão. O adaptador HeroUI traduz esse papel para `--accent`.

As seis famílias são `red`, `neutral`, `green`, `rust`, `orange` e `amber`, com passos 50–950. Neutral também tem o passo 0 (branco). As âncoras originais são preservadas e os demais passos seguem progressão de luminosidade em OKLCH, com redução de croma para caber em sRGB. A progressão preserva os pontos originais; não tem incrementos uniformes entre todos os passos.

| Família | Âncora | Uso |
| --- | --- | --- |
| red | 600 · #D73035 | Marca |
| neutral | 0, 50, 200, 500 e 900 | Texto, fundos e bordas |
| green | 600 · #3B8D5B | Sucesso e pronto |
| rust | 600 · #B04D3E | Erro |
| orange | 500 · #D76C30 | Em produção |
| amber | 300 · #E9B949 | Espera e aviso |

Os papéis semânticos se dividem em `text`, `bg`, `border`, `brand`, `feedback`, `status`, `focus-ring` e `shadow`. Use-os nos componentes; deixe primitivos para montar os mapeamentos. Cores transparentes usam `color-mix()` sobre um token, preservando a fonte central.

O branco sobre red-600 tem contraste aproximado de 4,81:1. `text.subtle` é destinado a elementos decorativos: não atende AA para texto pequeno sobre branco. Contraste depende do par de cores; o número exibido no playground usa apenas a superfície branca, não certifica todos os usos da interface.

## Gerar uma escala

```sh
npm run tokens:scale -- orange '#D76C30' 500
npm run tokens
```

O primeiro comando reescreve a família no JSON preservando o hex no passo informado; o segundo atualiza CSS e dados do playground. Um quarto argumento opcional ajusta a matiz nos passos escuros (exemplo do amber: `-28`). Regenerar uma família substitui os demais passos: revise os usos semânticos e o contraste depois.

As cores locais dos estilos globais e do playground foram mapeadas aos papéis semânticos. Isso muda alguns tons: fundo neutral-50, texto principal neutral-800, pronto green-600 e promoções ligadas às cores da escala. Cores em imagens e SVGs de ilustração permanecem nos próprios arquivos.
