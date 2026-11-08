# Corpo em Jogo — Anatomia · Contexto do projeto

Jogo de estudo de **Anatomia** para a **Pâmela** (curso técnico de enfermagem).
Mesmo motor do jogo *esquadrao-antibomba* (microbiologia): offline, feito para
celular, sem cadastro, repetição espaçada, álbum de figurinhas e simulado com nota.

- **Jogar:** https://tribourbanax-hue.github.io/corpo-em-jogo/
- **Repositório:** https://github.com/tribourbanax-hue/corpo-em-jogo (público)
- **Pasta local:** `C:\Users\Jeferson\Desktop\pamela\jogo-anatomia\`

Responder sempre em **português do Brasil**.

## Arquitetura

O jogo é **um único `index.html`** (offline, self-contained) **gerado** a partir de `src/` e das imagens de `img/`. Nunca editar `index.html` à mão — editar os fontes e rodar o build.

```
node build.js        # junta src/ + imagens → index.html (e valida o banco)
```

`build.js` embute cada imagem `img/*.webp` como base64 (data URI) numa `const IMG`, concatena `src/banco.js` + `src/figuras.js` + `src/app.js` dentro de `index.html`, e **valida o banco** (trilha/nível válidos, sem duplicata, toda questão com explicação e figura, região/osso existentes, etc.). Se achar problema, aborta com a lista.

### Arquivos
- `src/banco.js` — **banco de questões** (`const Q`) + trilhas (`TRILHAS`/`SETORES`). Helpers: `m` múltipla, `v` V/F, `pr` pares, `so` separar, `or` ordenar, `im` escolher figura, `no` nomear (imagem+marcador), `di` apontar (tocar na imagem). Nível `b`=conteúdo-chave, `c`=contexto.
- `src/figuras.js` — figurinhas SVG (`F`), regiões de imagem real (`REGIOES` com `img`, `nomes`, `hot[x%,y%]`), `figDaQuestao()` (qual figurinha mostrar — **só da mesma trilha**), `opcoesNome()` (distratores da mesma categoria: `NOMES_OSSO`/`NOMES_ORGAO`, nunca mistura osso com órgão).
- `src/app.js` — motor do jogo: estado salvo no `localStorage` (`E`), rodada rápida, simulado, álbum, telas. Repetição espaçada via `E.q[id]` (seq/vistas/erros/desarmada).
- `src/style.css` — estilo.
- `img/*.webp` — imagens reais das regiões. `img/_*` = arquivos de trabalho (ignorados no git).

### Trilhas (7 sistemas)
`oss` Ossos e Locomotor · `ner` Nervoso · `dig` Digestório · `car` Cardio/Circulatório · `res` Respiratório e Renal · `imu` Imunológico · `rep` Reprodutor. **243 questões** no total.

### Mecânicas especiais
- **Nomear / Apontar** (tipos `n`/`d`): mostram a **imagem real** da região com um marcador vermelho na posição `hot` (em %). Regiões de osso (`esqueleto, mao, pe, coluna`) perguntam "Qual osso…"; órgãos perguntam "Qual estrutura…". Ao adicionar/trocar imagem, **recalibrar `hot`** visualmente (gerar overlay com grade de %).
- **Simulado**: amostragem estratificada — garante ≥2 questões de **cada trilha**, todos os tipos, 80/20 chave/contexto, embaralhado a cada tentativa.
- **Histórico** (`E.simHist`, últimos 30): melhor/menor/média + gráfico + % por trilha.
- **Foco** (`trilhaFoco()`): aponta a trilha com maior taxa de erro, com botão "Treinar".

## Publicar / atualizar

Repo já inicializado com `git`, `gh` logado como **tribourbanax-hue**, GitHub Pages ligado (branch `main`, raiz). Para atualizar o jogo no ar:

```
node build.js
git add -A && git commit -m "..." && git push
```

O Pages reconstrói sozinho em ~1 min. `.gitignore` mantém `img/_*` (trabalho/node_modules) fora do repo. Encerrar a mensagem de commit com:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Imagens e direito autoral — ver `CREDITOS.md`
- **Domínio público (ok publicar):** `esqueleto.webp` e `mao.webp` (LadyofHats / Wikimedia).
- **Órgãos** (coração, digestório, encéfalo, repfem, repmasc, respiratório, urinário): origem Wikimedia (SVG), **licença não confirmada** nos arquivos — rastrear antes de depender disso.
- **Ainda fechadas:** `pe.webp` e `coluna.webp` (da apostila). O usuário **optou por publicar público mesmo assim** (uso pessoal/educativo). Trocar por versões de uso livre quando der (candidatas no `CREDITOS.md`); a coluna livre do SEER tem **texto que entrega a resposta** — evitar.

## Convenções deste ambiente
- **PC lento:** não iniciar dev servers / processos longos sem o usuário pedir; derrubar o servidor de teste depois.
- `file://` é **bloqueado** pela extensão do Chrome neste PC — para testar no navegador, subir `python -m http.server` e abrir `localhost`. Screenshot da extensão costuma travar (PC lento); `read_page` e `javascript_tool` funcionam.
- Renderizar SVG: `@resvg/resvg-js` está instalado em `img/_src/node_modules` (rodar o node de dentro de `img/_src`).

## Em aberto
- Trocar `pe.webp` e `coluna.webp` por imagens de uso livre coloridas por região (+ recalibrar `hot`).
- Modo "Revisar com a professora" (`REVISAO = []` em `banco.js`) está dormente.
- Enriquecer o álbum (hoje ~1 figurinha-mascote por sistema além dos ossos).

> Memória completa e histórico da construção em `memoria/`.
