"use strict";
const DATA_PROVA = null; // coloque new Date(ano, mês-1, dia) para mostrar a contagem até a prova
const CHAVE = "anatomia.v1";
const TAM_RODADA = 7, TAM_SIMULADO = 20, ACERTOS_DESARME = 2;
const HORA = 3600e3;
// A bomba desarmada volta a armar depois deste tempo, conforme a sequência de acertos.
const REARME = { 2: 6 * HORA, 3: 18 * HORA };

// ---------- utilidades ----------
const $ = (s) => document.querySelector(s);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
function embaralhar(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
function vibrar(ms) { try { if (E.vib && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

Q.forEach((q) => { q.id = q.s + "-" + hash(q.q + (q.o ? q.o[0] : "") + (q.pares ? q.pares[0][1] : "") + q.p); });
const POR_ID = Object.fromEntries(Q.map((q) => [q.id, q]));

// ---------- estado salvo no celular ----------
const NOVO = () => ({ q: {}, pts: 0, rev: {}, vib: true, rodada: null, melhorCombo: 0, alb: {}, simHist: [] });
let E = NOVO();
let semMemoria = false;
function carregar() { try { const b = localStorage.getItem(CHAVE); if (b) E = Object.assign(NOVO(), JSON.parse(b)); } catch (e) { semMemoria = true; } }
function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) { semMemoria = true; } }

const reg = (id) => E.q[id] || (E.q[id] = { seq: 0, vistas: 0, erros: 0, ult: 0, errou: false });
function desarmada(id, agora = Date.now()) {
  const r = E.q[id]; if (!r || r.seq < ACERTOS_DESARME) return false;
  const t = REARME[r.seq]; return !t || agora - r.ult < t;
}
function rearmada(id, agora = Date.now()) { const r = E.q[id]; return !!r && r.seq >= ACERTOS_DESARME && !desarmada(id, agora); }
function comErro(id) { const r = E.q[id]; return !!r && r.errou; }
function registrar(id, ok) {
  const r = reg(id); r.vistas++; r.ult = Date.now();
  if (ok) { r.seq++; r.errou = false; } else { r.seq = 0; r.erros++; r.errou = true; }
}
const pct = (lista) => (lista.length ? Math.round((100 * lista.filter((q) => desarmada(q.id)).length) / lista.length) : 0);
function patente(p) { return p >= 90 ? "Mestre em Anatomia" : p >= 70 ? "Instrutora" : p >= 40 ? "Monitora" : p >= 15 ? "Estudante" : "Iniciante"; }

// ---------- montagem da rodada ----------
function bombasPrimeiro(l) { return embaralhar(l).sort((a, b) => (a.n === b.n ? 0 : a.n === "b" ? -1 : 1)); }
function montar(pool, tam) {
  const erros = embaralhar(pool.filter((q) => comErro(q.id)));
  const rearm = embaralhar(pool.filter((q) => !comErro(q.id) && rearmada(q.id)));
  const novas = bombasPrimeiro(pool.filter((q) => !E.q[q.id]));
  const armadas = bombasPrimeiro(pool.filter((q) => E.q[q.id] && !comErro(q.id) && !rearmada(q.id) && !desarmada(q.id)));
  const resto = embaralhar(pool.filter((q) => desarmada(q.id)));
  const fila = [];
  const pega = (lista, n) => { for (const q of lista) { if (fila.length >= tam || n <= 0) break; if (!fila.includes(q)) { fila.push(q); n--; } } };
  pega(erros, Math.ceil(tam * 0.3));
  pega(rearm, Math.ceil(tam * 0.2));
  pega(armadas, Math.ceil(tam * 0.2));
  pega(novas, tam);
  pega(armadas, tam); pega(erros, tam); pega(rearm, tam); pega(resto, tam);
  return embaralhar(fila);
}

// ---------- telas ----------
const app = () => $("#app");
const COR = { oss: "#b5793a", ner: "#7d4bc2", dig: "#d98a12", car: "#c9324f", res: "#2b9fb3", imu: "#2b6cf6", rep: "#c0398e" };
function limpar(jogo, cor) {
  app().innerHTML = "";
  $("#nav").innerHTML = "";
  $("#nav").className = "";
  document.querySelectorAll(".fb,.veu").forEach((x) => x.remove());
  document.body.classList.toggle("jogo", !!jogo);
  document.documentElement.style.setProperty("--cor", cor || "#c9324f");
  window.scrollTo(0, 0);
}
function html(tag, cls, inner) { const e = el(tag, cls); e.innerHTML = inner; return e; }
function diasProva() { const h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((DATA_PROVA - h) / 864e5); }

function home() {
  limpar();
  const a = app();
  const bombas = Q.filter((q) => q.n === "b");
  const p = pct(bombas);
  const head = el("header", "topo");
  head.append(html("div", "logo", 'Corpo em Jogo<small>Anatomia</small>'));
  if (DATA_PROVA) { const d = diasProva(); if (d >= 0) head.append(el("div", "conta", d === 0 ? "É hoje!" : d === 1 ? "Prova amanhã" : `Prova em ${d} dias`)); }
  a.append(head);

  const card = el("section", "quartel");
  const anel = el("div", "anel"); anel.style.setProperty("--p", p); anel.append(el("span", "", p + "%"));
  const info = el("div");
  info.append(el("div", "q-t", patente(p)), el("div", "q-s", "do conteúdo-chave dominado"));
  const rearm = Q.filter((q) => rearmada(q.id)).length;
  if (rearm) info.append(el("div", "aviso", `${rearm} ponto${rearm > 1 ? "s" : ""} voltou pra revisão`));
  card.append(anel, info);
  a.append(card);

  const lin = el("div", "chips");
  const nErros = Q.filter((q) => comErro(q.id)).length;
  const hist = E.simHist || [];
  const chip = (t, s, fn, off, id) => { const b = el("button", "chip"); b.id = id; b.append(el("b", "", t), el("span", "", s)); b.onclick = fn; b.disabled = !!off; return b; };
  const subSim = hist.length ? `melhor nota ${nfmt(Math.max(...hist.map((h) => h.nota)))}` : `${TAM_SIMULADO} questões, nota no fim`;
  lin.append(
    chip("Meus erros", nErros ? `${nErros} para refazer` : "Nenhum por enquanto", () => iniciar(Q.filter((q) => comErro(q.id)), "erros"), !nErros, "b-erros"),
    chip("Simulado", subSim, simulado, false, "b-simulado")
  );
  if (hist.length) lin.append(chip("Histórico", `${hist.length} simulado${hist.length > 1 ? "s" : ""}`, historico, false, "b-historico"));
  a.append(lin);

  // Card de foco: aponta a trilha onde a aluna mais erra, pra treinar direcionado.
  const foco = trilhaFoco();
  if (foco) {
    const fc = el("section", "foco-card");
    fc.append(el("div", "foco-t", "📌 Foque aqui"), el("div", "foco-n", `${foco.nome} — ${Math.round(foco.taxa * 100)}% de erro`));
    const bt = el("button", "btn b-princ"); bt.append(el("span", "b-t", `Treinar ${foco.nome}`)); bt.onclick = () => iniciar(Q.filter((q) => q.s === foco.k), "setor");
    fc.append(bt); a.append(fc);
  }

  a.append(el("h2", "tit-cam", "Trilhas do corpo"));
  a.append(caminho());

  const rod = el("footer", "rodape");
  const vb = el("button", "link", E.vib ? "Vibração ligada" : "Vibração desligada");
  vb.onclick = () => { E.vib = !E.vib; salvar(); home(); };
  const rs = el("button", "link", "Reiniciar e embaralhar"); rs.id = "b-reiniciar";
  rs.onclick = () => {
    if (rs.dataset.ok) { const vib = E.vib; E = NOVO(); E.vib = vib; salvar(); home(); return; }
    rs.dataset.ok = "1"; rs.textContent = "Toque de novo: apaga o progresso"; rs.classList.add("perigo");
  };
  rod.append(vb, rs, el("div", "nota", `${Q.length} questões. Fonte: apostila de Anatomia. Feito com carinho pra Pâmela estudar.`));
  if (semMemoria) rod.append(el("div", "aviso", "Este navegador não está salvando o progresso. Abra o link no Chrome ou Safari."));
  a.append(rod);
  nav();
}
function nav() {
  const n = $("#nav"); n.className = "nav"; n.innerHTML = "";
  const g = el("div");
  const item = (rot, ic, fn, id) => { const b = el("button", "nav-b"); b.id = id; b.innerHTML = `<div class="ic">${fig(ic)}</div>`; b.append(el("span", "", rot)); b.onclick = fn; return b; };
  const lidos = REVISAO.filter((r) => E.rev[r.id]).length;
  const j = el("button", "jogar"); j.id = "b-jogar";
  if (E.rodada) { j.append(el("span", "", "Continuar rodada"), el("small", "", `questão ${E.rodada.i + 1} de ${E.rodada.fila.length}`)); j.onclick = retomar; }
  else { j.append(el("span", "", "Rodada rápida"), el("small", "", `${TAM_RODADA} questões, 2 min`)); j.onclick = () => iniciar(Q, "rapida"); }
  const terceiro = REVISAO.length
    ? item(`Revisar ${lidos}/${REVISAO.length}`, "musculo", revisao, "b-revisao")
    : item("Simulado", "patela", simulado, "b-simulado2");
  g.append(item(`Álbum ${Object.keys(E.alb).length}/${ordemF.length}`, "cranio", album, "b-album"), j, terceiro);
  n.append(g);
}
function caminho() {
  const ks = Object.keys(SETORES);
  const c = el("div", "caminho");
  c.style.height = 104 * ks.length + "px";
  // O caminho serpenteia entre as trilhas.
  const Alt = 104, W = 100, y = (i) => Alt * i + 46;
  let d = `M28 ${y(0)}`;
  for (let i = 1; i < ks.length; i++) { const xA = i % 2 ? 28 : 72, xB = i % 2 ? 72 : 28; d += ` C${xA} ${y(i - 1) + 60} ${xB} ${y(i) - 60} ${xB} ${y(i)}`; }
  const H = Alt * ks.length;
  c.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="${INK}" stroke-width="34" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#c9324f" stroke-width="28" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#ffffff55" stroke-width="10" stroke-dasharray="2 22" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
  ks.forEach((k, i) => {
    const lista = Q.filter((q) => q.s === k), pc = pct(lista), s = SETORES[k];
    const vazia = lista.length === 0;
    const b = el("button", "setor " + (i % 2 ? "dir" : "esq") + (vazia ? " trava" : ""));
    b.id = "s-" + k;
    b.style.top = Alt * i + "px";
    b.setAttribute("aria-label", `${s.nome}, ${vazia ? "em breve" : pc + " por cento"}`);
    const med = el("div", "med"); med.style.setProperty("--p", pc); med.style.setProperty("--c", COR[k]);
    med.innerHTML = `<div>${fig(MASCOTE[k])}</div>`;
    const tx = el("div"); tx.append(el("span", "s-nome", s.nome), el("span", "s-pct", vazia ? "🔒 em breve" : pc + "% dominado"));
    b.append(med, tx);
    if (vazia) b.disabled = true; else b.onclick = () => iniciar(lista, "setor");
    c.append(b);
  });
  return c;
}
function barra(p) { const b = el("div", "barra"); const f = el("div", "barra-f"); f.style.width = p + "%"; b.append(f); return b; }
function botao(tit, cls, fn) { const b = el("button", "btn " + cls); b.append(el("span", "b-t", tit)); b.onclick = fn; return b; }

// ---------- álbum ----------
function album() {
  limpar();
  const a = app();
  const cab = el("div", "cab");
  const x = el("button", "fechar", "✕"); x.setAttribute("aria-label", "Voltar"); x.onclick = home;
  cab.append(x, el("h1", "", `Álbum: ${Object.keys(E.alb).length} de ${ordemF.length}`));
  a.append(cab, el("p", "rev-intro", "Acertou uma questão, ganhou a figurinha. Toque em qualquer uma para estudar."));
  Object.entries(SETORES).forEach(([k, s]) => {
    a.append(el("h2", "album-s", s.nome));
    const g = el("div", "cartas");
    ordemF.filter((f) => F[f][1] === k).forEach((f) => {
      const b = el("button", "carta" + (E.alb[f] ? "" : " fora"));
      b.innerHTML = fig(f); b.append(el("span", "", F[f][0]));
      b.onclick = () => ficha(f);
      g.append(b);
    });
    a.append(g);
  });
}
function ficha(f) {
  const v = el("div", "veu"); v.onclick = (e) => { if (e.target === v) v.remove(); };
  const c = el("div", "ficha");
  c.innerHTML = fig(f);
  c.append(el("h2", "", F[f][0]), el("div", "", F[f][2]), el("div", "rev-tag", `Slide p.${F[f][3]}${E.alb[f] ? "" : " · ainda não coletada"}`));
  const b = el("button", "btn b-princ"); b.append(el("span", "b-t", "Fechar")); b.onclick = () => v.remove();
  c.append(b); v.append(c); document.body.append(v);
}

// ---------- rodada ----------
let R = null; // {modo, fila:[ids], i, ok, erro, combo, repetidas:{}, simRes:[]}
function iniciar(pool, modo) {
  const fila = montar(pool, TAM_RODADA).map((q) => q.id);
  if (!fila.length) return home();
  R = { modo, fila, i: 0, ok: 0, erro: 0, combo: 0, maxCombo: 0, repetidas: {}, simRes: [] };
  E.rodada = R; salvar(); pergunta();
}
function retomar() { R = E.rodada; R.fila = R.fila.filter((id) => POR_ID[id]); if (R.i >= R.fila.length) return fim(); pergunta(); }
// Simulado: tira questões de TODAS as trilhas (cobertura garantida) e muda a cada tentativa.
function simulado() {
  const trilhas = Object.keys(SETORES).filter((k) => Q.some((q) => q.s === k));
  const base = Math.floor(TAM_SIMULADO / trilhas.length); // quantas por trilha, no mínimo
  const fila = [];
  const add = (lista, n) => { for (const q of lista) { if (n <= 0 || fila.length >= TAM_SIMULADO) break; if (!fila.includes(q)) { fila.push(q); n--; } } };
  // 1) garante cobertura: pega exatamente `base` de cada trilha, o conteúdo-chave primeiro
  embaralhar(trilhas).forEach((k) => {
    const qs = embaralhar(Q.filter((q) => q.s === k));
    add([...qs.filter((q) => q.n === "b"), ...qs], base); // b primeiro; completa com contexto se faltar
  });
  // 2) completa até o total com qualquer trilha (80% chave / 20% contexto), sempre embaralhado
  add(embaralhar(Q.filter((q) => q.n === "b")), TAM_SIMULADO);
  add(embaralhar(Q), TAM_SIMULADO);
  R = { modo: "simulado", fila: embaralhar(fila).slice(0, TAM_SIMULADO).map((q) => q.id), i: 0, ok: 0, erro: 0, combo: 0, maxCombo: 0, repetidas: {}, simRes: [] };
  E.rodada = R; salvar(); pergunta();
}
function pergunta() {
  const q = POR_ID[R.fila[R.i]];
  limpar(true, COR[q.s]);
  const a = app();
  const ar = el("div", "arena"); ar.id = "arena";
  const x = el("button", "fechar", "✕"); x.setAttribute("aria-label", "Sair e continuar depois"); x.onclick = home;
  const her = html("div", "heroi", fig(MASCOTE[q.s]));
  const pav = el("div", "pavio");
  const pf = el("div", "pavio-f"); pf.style.width = (100 * R.i) / R.fila.length + "%";
  pav.append(pf, el("div", "contador", R.combo >= 2 ? `${R.combo} seguidas` : `${R.i + 1} de ${R.fila.length}`));
  ar.append(x, her, pav, html("div", "bomba", figBomba()));
  ar.append(html("div", "estouro", `<svg class="fig" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 L60 30 L88 16 L76 42 L98 52 L72 60 L84 88 L58 74 L46 98 L38 72 L10 84 L24 58 L2 46 L28 38 L16 12 L42 28Z" fill="#ffb340" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M50 30 L56 44 L72 42 L60 54 L66 70 L50 60 L36 70 L40 54 L28 44 L44 44Z" fill="#fff4b8"/></svg>`));
  a.append(ar);
  a.append(el("div", "tag", `${SETORES[q.s].nome} · p.${q.p}`), el("h1", "enunc", q.q));
  const area = el("div", "area"); a.append(area);
  ({ m: rM, v: rV, p: rP, s: rS, o: rO, i: rI, d: rD, n: rN })[q.t](q, area);
}
function responder(q, ok, certaTxt) {
  registrar(q.id, ok);
  if (ok) { R.ok++; R.combo++; R.maxCombo = Math.max(R.maxCombo, R.combo); E.pts += 10 + Math.min(R.combo, 5) * 2; vibrar(20); }
  else { R.erro++; R.combo = 0; vibrar([60, 40, 60]); }
  if (R.modo === "simulado") {
    R.simRes.push({ id: q.id, ok, certa: certaTxt });
    salvar(); return proxima();
  }
  // Errou: a questão volta 3 posições à frente, embaralhada de novo (uma vez por rodada).
  if (!ok && !R.repetidas[q.id] && R.modo !== "simulado") {
    R.repetidas[q.id] = 1;
    R.fila.splice(Math.min(R.i + 3, R.fila.length), 0, q.id);
  }
  const f = figDaQuestao(q);
  const nova = ok && F[f] && !E.alb[f];
  if (nova) E.alb[f] = 1;
  salvar();
  const a = app();
  $("#arena").classList.add(ok ? "acertou" : "errou");
  if (!ok) { a.classList.remove("treme"); void a.offsetWidth; a.classList.add("treme"); }
  const fb = el("div", "fb " + (ok ? "fb-ok" : "fb-er"));
  const g = el("div");
  const topo = el("div", "fb-topo");
  const tx = el("div");
  tx.append(el("div", "fb-t", ok ? ["Acertou!", "Isso aí!", "Mandou bem!"][R.i % 3] : "Quase!"));
  if (!ok && certaTxt) tx.append(el("div", "fb-c", "Certo: " + certaTxt));
  if (q.e) tx.append(el("div", "fb-e", q.e));
  tx.append(el("div", "fb-nome", F[f][0]));
  topo.append(html("div", "fb-fig", fig(f)), tx);
  g.append(topo);
  if (nova) g.append(el("div", "fb-novo", `Figurinha nova no álbum: ${F[f][0]}`));
  const n = el("button", "btn b-princ"); n.append(el("span", "b-t", "Próxima")); n.onclick = proxima;
  g.append(n);
  fb.append(g);
  document.body.append(fb);
}
function proxima() {
  document.querySelectorAll(".fb").forEach((x) => x.remove());
  R.i++;
  if (R.i >= R.fila.length) return fim();
  salvar(); pergunta();
}

// múltipla escolha
function rM(q, area) {
  const certa = q.o[0];
  const simu = R.modo === "simulado";
  embaralhar(q.o).forEach((t) => {
    const b = el("button", "op", t);
    b.onclick = () => {
      area.querySelectorAll("button").forEach((x) => { x.disabled = true; if (!simu && x.textContent === certa) x.classList.add("certa"); });
      if (!simu && t !== certa) b.classList.add("errada");
      responder(q, t === certa, certa);
    };
    area.append(b);
  });
}
// verdadeiro ou falso
function rV(q, area) {
  const g = el("div", "vf");
  [[true, "✅ Verdadeiro"], [false, "❌ Falso"]].forEach(([val, txt]) => {
    const b = el("button", "op op-vf", txt);
    b.onclick = () => {
      const ok = val === q.a;
      g.querySelectorAll("button").forEach((x) => (x.disabled = true));
      if (R.modo !== "simulado") b.classList.add(ok ? "certa" : "errada");
      responder(q, ok, q.a ? "Verdadeiro" : "Falso");
    };
    g.append(b);
  });
  area.append(g);
}
// pares: no máximo 4 por vez, sorteados, para caber na tela
function rP(q, area) {
  const pares = embaralhar(q.pares).slice(0, 4);
  let sel = null, erros = 0, feitos = 0;
  area.append(el("div", "dica", "Toque em um item de cada lado"));
  const g = el("div", "pares"), esq = el("div", "col"), dir = el("div", "col");
  const dirBtns = [];
  embaralhar(pares).forEach((par) => {
    const b = el("button", "par", par[0]); b.dataset.k = par[1];
    b.onclick = () => { if (sel) sel.classList.remove("sel"); sel = b; b.classList.add("sel"); };
    esq.append(b);
  });
  embaralhar(pares).forEach((par) => {
    const b = el("button", "par par-d", par[1]);
    b.onclick = () => {
      if (!sel) { b.classList.add("pisca"); setTimeout(() => b.classList.remove("pisca"), 300); return; }
      if (sel.dataset.k === par[1]) {
        [sel, b].forEach((x) => { x.classList.remove("sel"); x.classList.add("feito"); x.disabled = true; });
        sel = null; feitos++; vibrar(15);
        if (feitos === pares.length) responder(q, erros === 0, erros ? `${pares.length} pares ligados, com ${erros} tropeço${erros > 1 ? "s" : ""}` : null);
      } else {
        erros++; vibrar(50);
        const s = sel; [s, b].forEach((x) => x.classList.add("errada"));
        setTimeout(() => [s, b].forEach((x) => x.classList.remove("errada")), 350);
      }
    };
    dirBtns.push(b); dir.append(b);
  });
  g.append(esq, dir); area.append(g);
}
// separar: um item por vez, no máximo 5
function rS(q, area) {
  const itens = embaralhar(q.itens).slice(0, 5);
  let i = 0, erros = 0;
  const corpo = el("div", "sep");
  const item = el("div", "sep-item"), prog = el("div", "dica");
  const btns = el("div", "sep-cats");
  const mostra = () => { item.textContent = itens[i][0]; prog.textContent = `${i + 1} de ${itens.length}`; };
  q.cats.forEach((c, idx) => {
    const b = el("button", "op op-cat", c);
    b.onclick = () => {
      const certo = itens[i][1] === idx;
      if (!certo) { erros++; vibrar(50); }
      const alvo = btns.children[itens[i][1]];
      alvo.classList.add("certa"); if (!certo) b.classList.add("errada");
      [...btns.children].forEach((x) => (x.disabled = true));
      setTimeout(() => {
        [...btns.children].forEach((x) => { x.disabled = false; x.classList.remove("certa", "errada"); });
        i++;
        if (i >= itens.length) { btns.remove(); item.remove(); prog.remove(); responder(q, erros === 0, erros ? `${itens.length - erros} de ${itens.length} no lugar certo` : null); }
        else mostra();
      }, certo ? 280 : 750);
    };
    btns.append(b);
  });
  mostra(); corpo.append(prog, item, btns); area.append(corpo);
}
// ordem: toque na sequência certa
function rO(q, area) {
  let prox = 0, erros = 0;
  area.append(el("div", "dica", "Toque do primeiro para o último"));
  embaralhar(q.passos).forEach((t) => {
    const b = el("button", "op", t);
    b.onclick = () => {
      if (t === q.passos[prox]) {
        b.disabled = true; b.classList.add("certa"); prox++; b.textContent = prox + ". " + t; vibrar(15);
        if (prox === q.passos.length) responder(q, erros === 0, erros ? q.passos.join(" → ") : null);
      } else {
        erros++; vibrar(50); b.classList.add("errada"); setTimeout(() => b.classList.remove("errada"), 350);
      }
    };
    area.append(b);
  });
}

// escolher a imagem: o nome só aparece depois de responder
function rI(q, area) {
  const g = el("div", "imgs" + (q.op.length === 3 ? " tres" : ""));
  const certa = q.op[0];
  embaralhar(q.op).forEach((k, n) => {
    const b = el("button", "op-img"); b.dataset.k = k;
    b.setAttribute("aria-label", "Imagem " + (n + 1));
    b.innerHTML = fig(k); const nome = el("span"); b.append(nome);
    b.onclick = () => {
      g.querySelectorAll("button").forEach((x) => { x.disabled = true; x.querySelector("span").textContent = F[x.dataset.k][0]; if (x.dataset.k === certa) x.classList.add("certa"); });
      if (k !== certa) b.classList.add("errada");
      responder(q, k === certa, F[certa][0]);
    };
    g.append(b);
  });
  area.append(g);
}
// apontar: imagem real; a pessoa toca no osso pedido (vence o ponto mais próximo)
function rD(q, area) {
  const rg = REGIOES[q.regiao];
  area.append(el("div", "alvo-nome", rg.nomes[q.alvo]));
  const box = el("div", "imgmap toque");
  box.innerHTML = `<img src="${IMG[rg.img]}" alt="${rg.rotulo}">`;
  area.append(box);
  const img = box.querySelector("img");
  let feito = false;
  box.addEventListener("click", (e) => {
    if (feito) return; feito = true;
    const r = img.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100, py = ((e.clientY - r.top) / r.height) * 100;
    let perto = null, dmin = Infinity;
    for (const k in rg.hot) { const [hx, hy] = rg.hot[k]; const d = (hx - px) ** 2 + (hy - py) ** 2; if (d < dmin) { dmin = d; perto = k; } }
    const ok = perto === q.alvo;
    const marca = (x, y, cls) => { const m = el("div", "marcador " + cls); m.style.left = x + "%"; m.style.top = y + "%"; box.append(m); };
    marca(rg.hot[q.alvo][0], rg.hot[q.alvo][1], "certo");
    if (!ok) marca(px, py, "errado");
    responder(q, ok, rg.nomes[q.alvo]);
  });
}

// gera 4 opções: o nome certo + 3 distratores. Usa primeiro os nomes da MESMA região;
// se faltar, completa com nomes da mesma categoria (osso ou órgão), nunca mistura.
function opcoesNome(regiao, alvo) {
  const rg = REGIOES[regiao];
  const certa = rg.nomes[alvo];
  const daRegiao = Object.values(rg.nomes);
  const mesma = embaralhar(daRegiao.filter((x) => x !== certa));
  const pool = OSSO_REGS.has(regiao) ? NOMES_OSSO : NOMES_ORGAO;
  const geral = embaralhar(pool.filter((x) => x !== certa && !daRegiao.includes(x)));
  const ops = [certa];
  for (const x of [...mesma, ...geral]) { if (ops.length >= 4) break; if (!ops.includes(x)) ops.push(x); }
  return { certa, ops: embaralhar(ops) };
}
// nomear: imagem real com marcador no osso; a pessoa escolhe o nome
function rN(q, area) {
  const rg = REGIOES[q.regiao];
  const box = el("div", "imgmap");
  const [x, y] = rg.hot[q.alvo];
  box.innerHTML = `<img src="${IMG[rg.img]}" alt="${rg.rotulo}"><div class="marcador" style="left:${x}%;top:${y}%"></div>`;
  area.append(box);
  const { certa, ops } = opcoesNome(q.regiao, q.alvo);
  const simu = R.modo === "simulado";
  ops.forEach((t) => {
    const b = el("button", "op", t);
    b.onclick = () => {
      area.querySelectorAll("button").forEach((z) => { z.disabled = true; if (!simu && z.textContent === certa) z.classList.add("certa"); });
      if (!simu && t !== certa) b.classList.add("errada");
      responder(q, t === certa, certa);
    };
    area.append(b);
  });
}

// ---------- fim ----------
function fim() {
  const r = R; E.rodada = null; E.melhorCombo = Math.max(E.melhorCombo, r.maxCombo); salvar();
  limpar();
  const a = app();
  if (r.modo === "simulado") return fimSimulado(r);
  const tot = r.ok + r.erro;
  a.append(html("div", "fim-ico", r.ok >= r.erro ? fig(MASCOTE[POR_ID[r.fila[0]].s]) : figBomba()));
  a.append(el("h1", "enunc centro", r.erro === 0 ? "Rodada limpa!" : r.ok >= r.erro ? "Bom trabalho!" : "Vamos de novo?"));
  const res = el("section", "painel");
  res.append(el("div", "pct", `${r.ok}/${tot}`), el("div", "pct-txt", `acertos · melhor sequência: ${r.maxCombo}`));
  const pB = pct(Q.filter((q) => q.n === "b"));
  res.append(el("div", "pct-txt", `${pB}% das bombas desarmadas · ${E.pts} pontos · álbum ${Object.keys(E.alb).length}/${ordemF.length}`), barra(pB));
  a.append(res);
  const m = r.modo;
  a.append(botao("Mais uma", "b-princ", () => iniciar(m === "setor" ? Q.filter((q) => q.s === POR_ID[r.fila[0]].s) : Q, m === "setor" ? "setor" : "rapida")));
  a.append(botao("Início", "b-sec", home));
}
const nfmt = (n) => n.toFixed(1).replace(".", ",");
// Guarda a nota do simulado no histórico (com o detalhamento por trilha).
function registrarSimulado(r) {
  const nota = (r.ok * 10) / r.simRes.length;
  const trilhas = {};
  Object.keys(SETORES).forEach((k) => {
    const l = r.simRes.filter((x) => POR_ID[x.id].s === k);
    if (l.length) trilhas[k] = [l.filter((x) => x.ok).length, l.length];
  });
  const reg = { t: Date.now(), nota: +nota.toFixed(2), ok: r.ok, tot: r.simRes.length, trilhas };
  E.simHist = (E.simHist || []).concat(reg).slice(-30);
  salvar();
  return reg;
}
// Estatística de acerto/erro por trilha, somando todos os modos de jogo.
function statTrilha(k) {
  const qs = Q.filter((q) => q.s === k);
  let vistas = 0, erros = 0, resp = 0;
  qs.forEach((q) => { const r = E.q[q.id]; if (r && r.vistas) { vistas += r.vistas; erros += r.erros; resp++; } });
  return { k, nome: SETORES[k].nome, dom: pct(qs), vistas, erros, resp, total: qs.length, taxa: vistas ? erros / vistas : 0 };
}
// Trilha onde a aluna mais erra (com dados suficientes) = onde focar.
function trilhaFoco() {
  const sts = Object.keys(SETORES).map(statTrilha).filter((s) => s.resp >= 3 && s.vistas >= 5);
  if (!sts.length) return null;
  sts.sort((a, b) => (b.taxa - a.taxa) || (a.dom - b.dom));
  return sts[0].taxa > 0 ? sts[0] : null;
}
function fimSimulado(r) {
  const reg = registrarSimulado(r);
  const hist = E.simHist;
  const notas = hist.map((h) => h.nota);
  const melhor = Math.max(...notas), pior = Math.min(...notas);
  const a = app();
  const nota = reg.nota;
  a.append(html("div", "fim-ico", fig(nota >= 7 ? "linfT" : "cisto")));
  a.append(el("h1", "enunc centro", "Nota " + nfmt(nota)));
  if (hist.length > 1) {
    const ant = hist[hist.length - 2].nota;
    const dif = nota - ant;
    a.append(el("div", "pct-txt centro", dif > 0 ? `↑ subiu ${nfmt(dif)} desde a última (${nfmt(ant)})` : dif < 0 ? `↓ caiu ${nfmt(-dif)} desde a última (${nfmt(ant)})` : `igual à última (${nfmt(ant)})`));
    a.append(el("div", "pct-txt centro", `🏆 melhor ${nfmt(melhor)} · 📉 menor ${nfmt(pior)} · ${hist.length} simulados`));
  }
  const pan = el("section", "painel");
  Object.entries(SETORES).forEach(([k, s]) => {
    const l = r.simRes.filter((x) => POR_ID[x.id].s === k);
    if (!l.length) return;
    const ok = l.filter((x) => x.ok).length;
    const li = el("div", "sim-lin"); li.append(el("span", "", s.nome), el("span", ok === l.length ? "verde" : ok === 0 ? "vermelho" : "", `${ok}/${l.length}`));
    pan.append(li);
  });
  a.append(pan);
  // Onde focar (trilha com mais erro no geral)
  const foco = trilhaFoco();
  if (foco) {
    const fc = el("div", "foco-card");
    fc.append(el("div", "foco-t", "📌 Foque aqui"), el("div", "foco-n", `${foco.nome} — você erra ${Math.round(foco.taxa * 100)}% das questões dessa trilha`));
    const bt = el("button", "btn b-princ"); bt.append(el("span", "b-t", `Treinar ${foco.nome}`)); bt.onclick = () => iniciar(Q.filter((q) => q.s === foco.k), "setor");
    fc.append(bt); a.append(fc);
  }
  const errs = r.simRes.filter((x) => !x.ok);
  if (errs.length) {
    a.append(el("h2", "claro", "O que você errou"));
    errs.forEach((x) => {
      const q = POR_ID[x.id];
      const c = el("div", "rev-card");
      c.append(el("div", "rev-tag", `${SETORES[q.s].nome} · p.${q.p}`), el("div", "rev-q", q.q), el("div", "rev-ok", "Certo: " + x.certa));
      if (q.e) c.append(el("div", "fb-e", q.e));
      a.append(c);
    });
  }
  a.append(botao("Novo simulado", "b-princ", simulado));
  if (hist.length > 1) a.append(botao("Ver histórico", "b-sec", historico));
  a.append(botao("Início", "b-sec", home));
}
// Tela de histórico de simulados: melhor, menor, média e a lista com gráfico simples.
function historico() {
  limpar();
  const a = app();
  const cab = el("div", "cab");
  const x = el("button", "fechar", "✕"); x.setAttribute("aria-label", "Voltar"); x.onclick = home;
  cab.append(x, el("h1", "", "Histórico de simulados"));
  a.append(cab);
  const hist = (E.simHist || []).slice();
  if (!hist.length) { a.append(el("p", "rev-intro", "Você ainda não fez nenhum simulado. Faça um e acompanhe sua evolução aqui.")); a.append(botao("Fazer simulado", "b-princ", simulado)); return; }
  const notas = hist.map((h) => h.nota);
  const media = notas.reduce((s, n) => s + n, 0) / notas.length;
  const pan = el("section", "painel");
  const lin = (rot, val, cls) => { const d = el("div", "sim-lin"); d.append(el("span", "", rot), el("span", cls || "", val)); return d; };
  pan.append(lin("🏆 Melhor nota", nfmt(Math.max(...notas)), "verde"), lin("📉 Menor nota", nfmt(Math.min(...notas)), "vermelho"), lin("Média", nfmt(media)), lin("Simulados feitos", String(hist.length)));
  a.append(pan);
  // barrinhas das últimas notas
  a.append(el("h2", "claro", "Evolução (do mais antigo ao mais novo)"));
  const graf = el("div", "graf");
  hist.forEach((h) => {
    const col = el("div", "graf-col");
    const b = el("div", "graf-b"); b.style.height = Math.max(4, h.nota * 10) + "%";
    b.style.background = h.nota >= 7 ? "#2e9e5b" : h.nota >= 5 ? "#d9a21a" : "#c9324f";
    const d = new Date(h.t);
    col.append(el("span", "graf-v", nfmt(h.nota)), b, el("span", "graf-d", `${d.getDate()}/${d.getMonth() + 1}`));
    graf.append(col);
  });
  a.append(graf);
  // dificuldade por trilha
  const sts = Object.keys(SETORES).map(statTrilha).filter((s) => s.vistas > 0).sort((p, q) => q.taxa - p.taxa);
  if (sts.length) {
    a.append(el("h2", "claro", "Seu desempenho por trilha"));
    const pan2 = el("section", "painel");
    sts.forEach((s) => {
      const acerto = Math.round((1 - s.taxa) * 100);
      pan2.append(lin(s.nome, `${acerto}% de acerto`, acerto >= 70 ? "verde" : acerto >= 50 ? "" : "vermelho"));
    });
    a.append(pan2);
  }
  a.append(botao("Novo simulado", "b-princ", simulado));
  a.append(botao("Início", "b-sec", home));
}

// ---------- sessão final ----------
function revisao() {
  limpar();
  const a = app();
  const bar = el("div", "cab");
  const x = el("button", "fechar", "✕"); x.setAttribute("aria-label", "Voltar"); x.onclick = home;
  bar.append(x, el("h1", "", "Revisar com a professora"));
  a.append(bar);
  a.append(el("p", "rev-intro", "Estes pontos do material parecem conflitar com a literatura ou com outro slide. Eles não contam ponto nem entram no jogo. Confirme com a professora o que vale para a prova."));
  REVISAO.slice().sort((p, q) => (q.bomba ? 1 : 0) - (p.bomba ? 1 : 0)).forEach((r) => {
    const c = el("div", "rev-card");
    c.append(el("div", "rev-tag", `${r.bomba ? "💣" : "🧨"} p.${r.pag}`), el("div", "rev-q", r.pergunta));
    const ver = el("button", "op", "Ver o que conferir");
    const corpo = el("div", "rev-corpo");
    corpo.hidden = true;
    const bloco = (t, txt, cls) => { const d = el("div", "rev-b " + cls); d.append(el("strong", "", t), el("span", "", txt)); return d; };
    corpo.append(bloco("O slide diz", r.slide, "b-sl"), bloco("Conferência", r.conferencia, "b-cf"), bloco("Revisão indicada", r.indicacao, "b-in"));
    ver.onclick = () => { corpo.hidden = !corpo.hidden; ver.textContent = corpo.hidden ? "Ver o que conferir" : "Fechar"; if (!E.rev[r.id]) { E.rev[r.id] = 1; salvar(); } };
    c.append(ver, corpo);
    a.append(c);
  });
  a.append(botao("Início", "b-princ", home));
}

carregar();
home();
if ("serviceWorker" in navigator && location.protocol === "https:") { navigator.serviceWorker.register("sw.js").catch(() => {}); }
