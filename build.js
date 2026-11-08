// Junta tudo em um único index.html e confere o banco de questões.
const fs = require("fs"), path = require("path");
const src = (f) => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
const { Q, SETORES, REVISAO } = require("./src/banco.js");
const { F, REGIOES, figDaQuestao } = require("./src/figuras.js");

// Imagens reais embutidas como data URI (jogo 100% offline, arquivo único).
const imgDir = path.join(__dirname, "img");
const IMG = {};
for (const f of fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []) {
  if (f.startsWith("_") || !/\.(webp|png|jpe?g)$/i.test(f)) continue;
  const ext = f.split(".").pop().toLowerCase();
  const mime = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
  IMG[f.replace(/\.[^.]+$/, "")] = "data:" + mime + ";base64," + fs.readFileSync(path.join(imgDir, f)).toString("base64");
}
for (const k in REGIOES) if (!IMG[REGIOES[k].img]) console.error("AVISO: falta a imagem img/" + REGIOES[k].img + ".webp");

const problemas = [];
const vistos = new Set();
for (const q of Q) {
  const nome = `[p.${q.p}] ${q.q}`;
  if (!SETORES[q.s]) problemas.push("trilha inválida: " + nome);
  if (!["b", "c"].includes(q.n)) problemas.push("nível inválido: " + nome);
  const chave = q.q + (q.o ? q.o[0] : "") + (q.pares ? q.pares[0][1] : "") + (q.alvo || "") + q.p;
  if (vistos.has(chave)) problemas.push("duplicada: " + nome);
  vistos.add(chave);
  if (!q.e) problemas.push("sem explicação: " + nome);
  if (q.t === "m") { if (q.o.length !== 4 || new Set(q.o).size !== 4) problemas.push("opções inválidas: " + nome); }
  if (q.t === "v" && typeof q.a !== "boolean") problemas.push("V/F inválido: " + nome);
  if (q.t === "p") {
    if (q.pares.length < 3) problemas.push("poucos pares: " + nome);
    if (new Set(q.pares.map((x) => x[1])).size !== q.pares.length) problemas.push("par repetido: " + nome);
    if (new Set(q.pares.map((x) => x[0])).size !== q.pares.length) problemas.push("par repetido: " + nome);
  }
  if (q.t === "s") q.itens.forEach((i) => { if (!q.cats[i[1]]) problemas.push("categoria inválida: " + nome); });
  if (q.t === "i") { q.op.forEach((k) => { if (!F[k]) problemas.push("figura inexistente " + k + ": " + nome); }); if (new Set(q.op).size !== q.op.length) problemas.push("imagem repetida: " + nome); }
  if ((q.t === "d" || q.t === "n") && !(REGIOES[q.regiao] && REGIOES[q.regiao].nomes[q.alvo] && REGIOES[q.regiao].hot[q.alvo])) problemas.push("região/osso inválido: " + nome);
  if (!F[figDaQuestao(q)]) problemas.push("sem figura: " + nome);
  if (q.t === "o" && new Set(q.passos).size !== q.passos.length) problemas.push("passo repetido: " + nome);
}
if (problemas.length) { console.error(problemas.join("\n")); process.exit(1); }

const html = `<!DOCTYPE html>
<html lang="pt-BR" translate="no">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google" content="notranslate">
<meta name="theme-color" content="#3a1d4f">
<title>Corpo em Jogo – Anatomia</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Nunito:wght@600;800&display=swap" rel="stylesheet">
<style>${src("style.css")}</style>
</head>
<body>
<main id="app"></main>
<nav id="nav"></nav>
<script>const IMG = ${JSON.stringify(IMG)};
${src("banco.js")}
${src("figuras.js")}
${src("app.js")}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, "index.html"), html);
const cont = (f) => Q.filter(f).length;
console.log(`OK: ${Q.length} questões | chave ${cont((q) => q.n === "b")} | contexto ${cont((q) => q.n === "c")} | ${Buffer.byteLength(html) >> 10} KB`);
for (const k in SETORES) console.log(`  ${SETORES[k].nome}: ${cont((q) => q.s === k)}`);
const dist = {}; Q.forEach((q) => { const k = figDaQuestao(q); dist[k] = (dist[k] || 0) + 1; });
console.log("  sem questão ligada:", Object.keys(F).filter((k) => !dist[k]).join(", ") || "nenhuma");
console.log("  tipos:", ["m", "v", "p", "s", "o", "i", "d", "n"].map((t) => `${t}=${cont((q) => q.t === t)}`).join(" "));
