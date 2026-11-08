---
name: project_jogo_anatomia_pamela
description: "Jogo de estudo de Anatomia pra esposa Pâmela (técnico de enfermagem), baseado no esquadrao-antibomba"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6733c087-3956-4f10-b8e0-0b50351325e9
  modified: 2026-11-08T23:55:08.450Z
---

Jogo "Corpo em Jogo – Anatomia" pra Pâmela estudar (técnico de enfermagem). Baseado no motor do [[projeto_catequeseconectada]]... na verdade no jogo **esquadrao-antibomba** (microbiologia da mesma Pâmela) — mesmo motor: offline, celular, sem cadastro, repetição espaçada, álbum de figurinhas, simulado.

**Local:** `C:\Users\Jeferson\Desktop\pamela\jogo-anatomia\`. **PUBLICADO 08/11/2026** — GitHub PÚBLICO `tribourbanax-hue/corpo-em-jogo` + GitHub Pages: **https://tribourbanax-hue.github.io/corpo-em-jogo/** (link pra Pâmela abrir no celular). `git init` feito na pasta; `.gitignore` deixa `img/_*` de fora (arquivos de trabalho/node_modules não sobem). Rebuild+commit+push manual pra atualizar. OBS: usuário optou por publicar público MESMO com `pe.webp`/`coluna.webp` da apostila (eu avisei 3x que não recomendava; decisão informada dele, uso pessoal/educativo não comercial). Materiais-fonte da apostila em `Desktop\pamela\*.pdf/*.pptx`; texto extraído em `Desktop\pamela\_conteudo\*.txt` (via pymupdf + python-pptx, já instalados). Jogo-base clonado em `Desktop\pamela\_base`.

**Estrutura = TRILHAS** (uma por sistema), em `src/banco.js` objeto `TRILHAS`/`SETORES`: oss (Ossos/Locomotor), ner, dig, car, res, imu, rep. Trilha sem questão aparece "🔒 em breve" (travada).

**Mecânica de nomear os ossos (REVISADA 08/11):** o SVG vetorial do esqueleto ficou cru; trocado por **IMAGENS REAIS** parte por parte (feedback do usuário, que mandou a imagem da mão). Em `figuras.js` há `REGIOES` = {esqueleto, mao, pe, coluna}, cada uma com `img` (chave), `nomes{osso:Nome}` e `hot{osso:[x%,y%]}` (posição do marcador). Imagens em `img/*.webp`. **Esqueleto = DOMÍNIO PÚBLICO** (Wikimedia "Human skeleton front - no labels", LadyofHats) — trocado 08/11 a pedido do usuário por ser seguro pra publicar; coordenadas recalibradas. Pé/coluna = extraídos dos PDFs da apostila (pymupdf); mão = imagem do usuário (`Desktop\pamela\ossosdamao-cke.webp`). ATENÇÃO: mão/pé/coluna ainda são copyright de material didático — trocar por PD antes de publicar (ver CREDITOS.md; Wikimedia tem mão/pé/coluna PD). Arquivos de trabalho em `img/_*` (76MB `_extraidas`) estão no .gitignore. `build.js` embute as imagens como base64 (data URI) → `const IMG` no bundle (jogo single-file offline, index.html ~183KB). Tipos: `n` (nomear: imagem + marcador pulsante vermelho no osso → escolher nome; helper `no(s,n,p,regiao,alvo,e)`) e `d` (apontar: dado o nome, tocar na imagem; vence o hotspot mais próximo; helper `di(...)`; limitado a ossos bem separados). Coordenadas dos hotspots JÁ CALIBRADAS visualmente (ver `img/_extraidas/` tem 218 imagens reais extraídas p/ reaproveitar em outras regiões/trilhas). Extras: corpo humano de silhueta como background da tela de trilhas (CSS `.caminho` data-URI).

**Status (08/11/2026 — 2ª sessão) — 243 questões, 7 trilhas balanceadas.** Ossos 74, Nervoso 33, Digestório 26, Cardio 28, Respiratório/Renal 31, Imuno 25, Reprodutor 26. Build OK 607KB, zero erros de validação, `sem questão ligada: nenhuma`.

**AUDITORIA questão-a-questão / imagem-a-imagem feita nesta sessão (pedido do usuário "existe desconexão?"):**
1. **Texto "osso" em questão de órgão** — helpers `no()`/`di()` tinham "Qual osso está marcado?" fixo, reusado p/ encéfalo/coração/etc. Corrigido: `REG_OSSO` (esqueleto/mao/pe/coluna) usa "osso", o resto "Qual estrutura está marcada?" / "Toque na estrutura indicada:".
2. **Figurinha de outra trilha** (13 casos) — `figDaQuestao()` pescava palavra-chave na explicação (ex.: "sangue" → Coração numa questão de rim/imuno). Corrigido: só aceita figurinha da MESMA trilha (`F[k][1]===q.s`), senão cai no mascote. Auditoria: `scratchpad/audit.js`.
3. **Marcadores (hot) fora do lugar** — corrigidos em `figuras.js`: coxal (sacro→ilíaco [37,44]), tronco encefálico ([67,82]→[53,70]), rins ([42,31]→[31,33]), ureteres, estômago, útero/ovários/vagina, testículo/epidídimo/próstata. Verificado por overlay PIL (`scratchpad/overlay.py` + `zoom*.py` com grade %). Esqueleto/mão/pé/coluna/coração/respiratório já estavam certos.
4. **Distratores misturavam osso com órgão** (pergunta de reprodutor oferecia "ossos do carpo"). `opcoesNome()` sorteava do pool global. Corrigido: distrator vem da mesma região primeiro, depois da mesma CATEGORIA (`NOMES_OSSO`/`NOMES_ORGAO` em figuras.js). Verificado por `scratchpad/checkops.js`.

+18 questões novas (Imuno 16→25: dendrítica/NK/monócito/plasmócito/MALT/complemento/autoimunes; Nervoso 25→33: peso encéfalo/hemisférios/tronco-pares/neurônio-ordem/gânglio/terminações/acetilcolina/arco-reflexo) + 1 Osso (resolve figura órfã ossoLongoFig). Testado ao vivo via localhost (file:// bloqueado; screenshot trava no PC lento mas read_page/javascript_tool funcionam).

**Status (08/11/2026 — 3ª sessão) — 243 questões, 620KB. NOVAS FUNCIONALIDADES (app.js):**
- **Simulado cross-trilha + variado**: `simulado()` reescrito — amostragem estratificada garante ≥2 questões de cada uma das 7 trilhas (base=floor(20/7)), todos os tipos, 80/20 chave/contexto, embaralhado a cada tentativa. O `add()` tem teto `fila.length>=TAM_SIMULADO`. Testado: 300/300 cobrem as 7 trilhas, 300/300 combinações distintas.
- **Histórico de simulados**: `E.simHist` (últimos 30) com {t,nota,ok,tot,trilhas:{k:[ok,tot]}}. `registrarSimulado()` salva; `historico()` mostra melhor/menor/média + gráfico de barras por data + desempenho % por trilha. Botão/chip "Histórico" na home (aparece após 1º simulado); melhor nota no subtítulo do chip Simulado.
- **Mapa de dificuldade / foco**: `statTrilha(k)` (taxa de erro somando todos os modos via E.q), `trilhaFoco()` (maior taxa com ≥3 respondidas e ≥5 vistas). Card "📌 Foque aqui" na home + no fim do simulado, com botão "Treinar [trilha]". CSS novo: `.foco-card`, `.graf*`. Testado ao vivo (seed fake via javascript_tool → apontou Imuno 75% erro).
- **Revisão de conteúdo**: reli as 243 questões vs material-fonte (cardio/resp-renal/imuno/reprodutor/digestório/nervoso/ossos) — ZERO erros factuais.
- **Imagem da mão trocada por DOMÍNIO PÚBLICO**: `mao.webp` agora é "Scheme human hand bones - no text" (LadyofHats, PD, Wikimedia), colorida por região, setas/caixa removidas por processamento (resvg-js renderiza SVG em `img/_src/node_modules`; inpaint PIL tirou a caixa cinza; resta fantasma levíssimo no mínimo). Coords `hot.mao` recalibradas p/ [carpais 48,78 / metacarpais 47,60 / proximais 49,44 / medias 50,26 / distais 50,11]. CREDITOS.md atualizado.

Falta: **pe.webp e coluna.webp ainda copyright** (opções livres levantadas no CREDITOS.md mas são mais fracas que as atuais coloridas — usuário decidiu trocar só a mão agora, pé/coluna na hora de publicar); modo Revisão (`REVISAO=[]`) dormente; publicar no GitHub.

(Histórico) trilha de **Ossos COMPLETA e testada** (61 questões: 17 nomear + 8 apontar + funções/tipos/contagens/articulações/músculos). Build OK (`node build.js` → index.html 62KB). Testado no Chrome via localhost (file:// é bloqueado neste PC — subir `python -m http.server` e abrir localhost). **FALTA preencher as outras 6 trilhas** com o conteúdo dos PDFs (nervoso, digestório, cardio, respiratório/renal, imuno, reprodutor). Digestório: o .pptx deu erro de formato (SoftMaker), converter com soffice antes.

Usuário quer TODO o conteúdo da apostila no jogo (a modalidade "nomear osso" é só a especial dos ossos). Build: `cd jogo-anatomia && node build.js`. Ver [[feedback_pc_lento_nao_iniciar_programas]] — derrubar servidor de teste depois.
