// Figuras em SVG. Fonte: apostila de Anatomia da Profa. (pasta pamela).
const INK = "#243244";
const BONE = "#f0e7d6", BONE2 = "#e4d8c0";
const TR = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const TF = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const olho = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${TF}/><circle cx="${x + 1}" cy="${y + 1}" r="${r * 0.5}" fill="${INK}"/>`;
const rosto = (x, y, d = 9, r = 5) => olho(x - d, y, r) + olho(x + d, y, r) + `<path d="M${x - 5} ${y + 9} q5 5 10 0" fill="none" ${TF}/>`;
const circ = (x, y, r, f, t = TR) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${t}/>`;
const pontos = (l, r, f) => l.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`).join("");

// osso longo estilizado (com as duas epífises arredondadas)
function ossoLongo(x, y1, y2, w = 9, c = BONE) {
  const r = w * 1.5;
  return `<path d="M${x - w} ${y1 + r} Q${x - w} ${y1} ${x - r} ${y1} Q${x} ${y1 - 3} ${x + r} ${y1} Q${x + w} ${y1} ${x + w} ${y1 + r} L${x + w} ${y2 - r} Q${x + w} ${y2} ${x + r} ${y2} Q${x} ${y2 + 3} ${x - r} ${y2} Q${x - w} ${y2} ${x - w} ${y2 - r} Z" fill="${c}" ${TF}/>`;
}

/* ===== REGIÕES COM IMAGEM REAL (jogo de nomear / apontar) =====
   Cada região tem: img (chave em IMG, injetado pelo build a partir de img/<chave>.webp),
   nomes {osso: "Nome"} e hot {osso: [x%, y%]} = posição do marcador sobre a imagem. */
const REGIOES = {
  esqueleto: {
    img: "esqueleto", rotulo: "Esqueleto inteiro",
    nomes: { cranio: "Crânio", coluna: "Coluna vertebral", costelas: "Costelas", esterno: "Esterno", clavicula: "Clavícula", escapula: "Escápula", umero: "Úmero", radio: "Rádio", ulna: "Ulna", coxal: "Osso do quadril (coxal)", femur: "Fêmur", patela: "Patela", tibia: "Tíbia", fibula: "Fíbula" },
    hot: { cranio: [50, 6], coluna: [50, 36], costelas: [37, 27], esterno: [50, 24], clavicula: [42, 19], escapula: [33, 21], umero: [26, 30], radio: [16, 42], ulna: [20, 42], coxal: [37, 44], femur: [43, 57], patela: [44, 69], tibia: [46, 80], fibula: [41, 80] },
  },
  mao: {
    img: "mao", rotulo: "Ossos da mão",
    nomes: { carpais: "Ossos do carpo (punho)", metacarpais: "Metacarpais", proximais: "Falanges proximais", medias: "Falanges médias", distais: "Falanges distais" },
    hot: { carpais: [48, 78], metacarpais: [47, 60], proximais: [49, 44], medias: [50, 26], distais: [50, 11] },
  },
  pe: {
    img: "pe", rotulo: "Ossos do pé",
    nomes: { tarso: "Ossos do tarso", metatarso: "Metatarsais", falangespe: "Falanges do pé" },
    hot: { tarso: [45, 20], metatarso: [48, 52], falangespe: [48, 82] },
  },
  coluna: {
    img: "coluna", rotulo: "Coluna vertebral",
    nomes: { cervical: "Vértebras cervicais", toracica: "Vértebras torácicas", lombar: "Vértebras lombares", sacro: "Sacro", coccix: "Cóccix" },
    hot: { cervical: [55, 9], toracica: [45, 34], lombar: [48, 58], sacro: [45, 80], coccix: [48, 94] },
  },
  encefalo: {
    img: "encefalo", rotulo: "Encéfalo (corte)",
    nomes: { cerebro: "Cérebro", cerebelo: "Cerebelo", tronco: "Tronco encefálico" },
    hot: { cerebro: [30, 20], cerebelo: [82, 61], tronco: [53, 70] },
  },
  coracao: {
    img: "coracao", rotulo: "Coração (corte)",
    nomes: { aorta: "Aorta", atrioD: "Átrio direito", atrioE: "Átrio esquerdo", ventriculoD: "Ventrículo direito", ventriculoE: "Ventrículo esquerdo" },
    hot: { aorta: [57, 15], atrioD: [30, 34], atrioE: [70, 28], ventriculoD: [33, 61], ventriculoE: [62, 73] },
  },
  digestorio: {
    img: "digestorio", rotulo: "Sistema digestório",
    nomes: { esofago: "Esôfago", estomago: "Estômago", figado: "Fígado", intdelgado: "Intestino delgado", intgrosso: "Intestino grosso" },
    hot: { esofago: [49, 30], estomago: [58, 52], figado: [32, 47], intdelgado: [48, 74], intgrosso: [71, 66] },
  },
  respiratorio: {
    img: "respiratorio", rotulo: "Sistema respiratório",
    nomes: { nariz: "Nariz e cavidade nasal", traqueia: "Traqueia", bronquios: "Brônquios", pulmoes: "Pulmões", diafragma: "Diafragma" },
    hot: { nariz: [38, 10], traqueia: [45, 42], bronquios: [46, 51], pulmoes: [33, 62], diafragma: [40, 80] },
  },
  urinario: {
    img: "urinario", rotulo: "Sistema urinário",
    nomes: { rins: "Rins", ureteres: "Ureteres", bexiga: "Bexiga", uretra: "Uretra" },
    hot: { rins: [31, 33], ureteres: [37, 53], bexiga: [48, 80], uretra: [48, 92] },
  },
  repfem: {
    img: "repfem", rotulo: "Sistema reprodutor feminino (esquema)",
    nomes: { utero: "Útero", ovarios: "Ovários", trompas: "Trompas de Falópio", vagina: "Vagina" },
    hot: { utero: [50, 31], ovarios: [19, 25], trompas: [30, 22], vagina: [50, 78] },
  },
  repmasc: {
    img: "repmasc", rotulo: "Sistema reprodutor masculino (esquema)",
    nomes: { penis: "Pênis", testiculo: "Testículos", epididimo: "Epidídimo", prostata: "Próstata" },
    hot: { penis: [24, 58], testiculo: [27, 74], epididimo: [32, 69], prostata: [44, 47] },
  },
};
// pool global de nomes, para completar as 4 opções quando a região tem poucos nomes.
// Separado por categoria para não misturar osso com órgão nas opções (evita desconexão).
const OSSO_REGS = new Set(["esqueleto", "mao", "pe", "coluna"]);
const NOMES_POOL = [...new Set(Object.values(REGIOES).flatMap((r) => Object.values(r.nomes)))];
const NOMES_OSSO = [...new Set([...OSSO_REGS].flatMap((k) => Object.values(REGIOES[k].nomes)))];
const NOMES_ORGAO = [...new Set(Object.entries(REGIOES).filter(([k]) => !OSSO_REGS.has(k)).flatMap(([, r]) => Object.values(r.nomes)))];

// ================= FIGURINHAS (álbum) =================
// nome: [rótulo, trilha, descrição, página, SVG]
const F = {
  /* ---- OSSOS ---- */
  esqueleto: ["Esqueleto", "oss", "206 ossos no adulto: 80 no esqueleto axial e 126 no apendicular.", 7,
    `<path d="M50 6 C42 6 38 12 38 19 C38 24 40 27 42 29 L42 34 C34 35 30 40 30 47 L30 60 L36 60 L37 49 L42 47 L42 55 L38 78 L34 92 L40 94 L45 80 L48 66 L52 66 L55 80 L60 94 L66 92 L62 78 L58 55 L58 47 L63 49 L64 60 L70 60 L70 47 C70 40 66 35 58 34 L58 29 C60 27 62 24 62 19 C62 12 58 6 50 6 Z" fill="${BONE}" ${TR}/><path d="M43 40 H57 M44 45 H56 M45 50 H55" stroke="${INK}" stroke-width="2"/><circle cx="45" cy="17" r="2.6" fill="${INK}"/><circle cx="55" cy="17" r="2.6" fill="${INK}"/>`],
  cranio: ["Crânio", "oss", "22 ossos: 8 do neurocrânio e 14 da face. Protege o encéfalo.", 8,
    `<path d="M26 44 C26 2 74 2 74 44 C74 66 62 74 58 84 L42 84 C38 74 26 66 26 44 Z" fill="${BONE}" ${TR}/><circle cx="40" cy="48" r="8" fill="${INK}"/><circle cx="60" cy="48" r="8" fill="${INK}"/><path d="M50 56 l-5 11 h10 Z" fill="${INK}"/><path d="M38 84 Q50 96 62 84" fill="none" ${TR}/>`],
  coluna: ["Coluna vertebral", "oss", "26 ossos no adulto: 7 cervicais, 12 torácicas, 5 lombares, sacro e cóccix.", 10,
    `${Array.from({ length: 7 }, (_, i) => `<rect x="38" y="${12 + i * 11}" width="24" height="8" rx="3" fill="${BONE}" ${TF}/><rect x="60" y="${13 + i * 11}" width="8" height="6" rx="2" fill="${BONE2}" ${TF}/>`).join("")}<path d="M46 90 L54 90 L58 98 L42 98 Z" fill="${BONE2}" ${TF}/>`],
  costela: ["Costelas", "oss", "24 ossos (12 pares): 7 verdadeiras, 3 falsas e 2 flutuantes.", 11,
    `<rect x="46" y="8" width="8" height="84" rx="3" fill="${BONE}" ${TF}/>${[0, 1, 2, 3, 4].map((i) => `<path d="M50 ${20 + i * 14} C${20 - i * 2} ${16 + i * 14} ${16} ${44 + i * 14} 50 ${50 + i * 14}" fill="none" stroke="${INK}" stroke-width="4"/><path d="M50 ${20 + i * 14} C${80 + i * 2} ${16 + i * 14} ${84} ${44 + i * 14} 50 ${50 + i * 14}" fill="none" stroke="${INK}" stroke-width="4"/>`).join("")}`],
  femur: ["Fêmur", "oss", "O osso mais longo e forte do corpo. Fica na coxa.", 15, ossoLongo(50, 8, 92, 13)],
  umero: ["Úmero", "oss", "Osso longo do braço, entre o ombro e o cotovelo.", 13, ossoLongo(50, 10, 90, 11)],
  patela: ["Patela", "oss", "Osso sesamoide do joelho. Protege a articulação.", 5,
    `<path d="M50 16 C72 16 72 52 50 84 C28 52 28 16 50 16 Z" fill="${BONE}" ${TR}/>`],
  ossoLongoFig: ["Osso longo", "oss", "Comprimento maior que a largura. Ex.: fêmur e úmero.", 5, ossoLongo(50, 10, 90, 10)],
  ossoCurto: ["Osso curto", "oss", "Tão largo quanto comprido. Ex.: ossos do carpo (punho) e do tarso.", 5,
    `${circ(42, 42, 16, BONE)}${circ(64, 40, 13, BONE2)}${circ(52, 64, 14, BONE)}${circ(72, 62, 11, BONE2)}`],
  ossoPlano: ["Osso plano", "oss", "Fino e largo, protege órgãos. Ex.: escápula, esterno e ossos do crânio.", 5,
    `<path d="M22 24 Q50 14 78 24 L72 76 Q50 86 28 76 Z" fill="${BONE}" ${TR}/>`],
  ossoIrregular: ["Osso irregular", "oss", "Forma complexa. Ex.: vértebras e mandíbula.", 5,
    `<path d="M30 20 L70 26 L80 50 L62 60 L70 82 L40 78 L24 58 L34 40 Z" fill="${BONE}" ${TR}/><circle cx="50" cy="48" r="8" fill="${BONE2}" ${TF}/>`],
  articulacao: ["Articulação", "oss", "Ponto onde dois ossos se encontram. A cartilagem reduz o atrito.", 18,
    `${ossoLongo(36, 8, 50, 8)}${ossoLongo(64, 50, 92, 8)}<path d="M28 48 Q50 40 72 48 L72 54 Q50 62 28 54 Z" fill="#8fd3c4" ${TF}/>`],
  musculo: ["Músculo esquelético", "oss", "Movimento voluntário. Fibras longas e estriadas, com actina e miosina.", 23,
    `<path d="M14 50 C8 30 30 30 50 30 C70 30 92 30 86 50 C92 70 70 70 50 70 C30 70 8 70 14 50 Z" fill="#e06377" ${TR}/><path d="M24 50 H76 M30 40 H70 M30 60 H70" stroke="#a83a4e" stroke-width="2.5"/>`],

  /* ---- MASCOTES DOS OUTROS SISTEMAS (ampliados ao montar cada trilha) ---- */
  cerebro: ["Encéfalo", "ner", "Centro de comando do sistema nervoso.", 1,
    `<path d="M50 14 C30 14 22 30 24 40 C14 46 18 64 30 66 C32 82 54 84 50 70 C46 84 68 82 70 66 C82 64 86 46 76 40 C78 30 70 14 50 14 Z" fill="#f2a9c4" ${TR}/><path d="M50 18 V72 M34 30 Q44 40 34 50 M66 30 Q56 40 66 50" fill="none" stroke="#c76a8c" stroke-width="2.5"/>`],
  estomago: ["Estômago", "dig", "Órgão do sistema digestório.", 1,
    `<path d="M40 16 C40 30 42 34 56 36 C78 40 82 70 56 80 C34 88 26 64 36 58 C30 54 30 20 40 16 Z" fill="#f0b27a" ${TR}/>`],
  coracao: ["Coração", "car", "Bomba do sistema cardiovascular.", 1,
    `<path d="M50 84 C12 56 18 22 42 22 C50 22 50 32 50 32 C50 32 50 22 58 22 C82 22 88 56 50 84 Z" fill="#e05566" ${TR}/>`],
  pulmao: ["Pulmão", "res", "Órgão da respiração.", 1,
    `<path d="M46 20 V44 L30 50 C18 56 16 78 30 82 C42 84 44 70 44 60 L46 20Z" fill="#f2a9c4" ${TR}/><path d="M54 20 V44 L70 50 C82 56 84 78 70 82 C58 84 56 70 56 60 L54 20Z" fill="#f2a9c4" ${TR}/><path d="M50 14 V44" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`],
  rim: ["Rim", "res", "Órgão do sistema urinário.", 1,
    `<path d="M58 18 C30 18 24 50 34 72 C44 90 70 84 68 62 C80 58 78 22 58 18 Z" fill="#9b5b4a" ${TR}/>`],
  escudo: ["Defesa", "imu", "Sistema imunológico: protege o organismo.", 1,
    `<path d="M50 12 L82 24 V52 C82 74 66 84 50 90 C34 84 18 74 18 52 V24 Z" fill="#5a8fd6" ${TR}/><path d="M38 50 l8 10 18 -22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`],
  reprodutor: ["Sistema reprodutor", "rep", "Responsável pela reprodução.", 1,
    `<circle cx="38" cy="58" r="20" fill="none" stroke="#c0398e" stroke-width="6"/><path d="M58 38 L84 12 M70 12 H84 V26" fill="none" stroke="#2b6cf6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="44" r="6" fill="#c0398e"/>`],
};

// Mascote de cada trilha (chave existente em F).
const MASCOTE = { oss: "esqueleto", ner: "cerebro", dig: "estomago", car: "coracao", res: "pulmao", imu: "escudo", rep: "reprodutor" };
const ordemF = Object.keys(F);

function fig(k, cls = "") { return `<svg class="fig ${cls}" viewBox="0 0 100 100" aria-hidden="true">${F[k] ? F[k][4] : ""}</svg>`; }
// Carta "estrutura ainda não dominada": aparece na arena e no fim.
const figBomba = (cls = "") => `<svg class="fig ${cls}" viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="14" width="72" height="72" rx="16" fill="#efe6d6" stroke="${INK}" stroke-width="3"/><text x="50" y="68" text-anchor="middle" font-size="48" font-weight="800" fill="${INK}" font-family="sans-serif">?</text></svg>`;

// Qual figurinha reforça cada resposta. A primeira regra que combinar vence.
const REGRAS = [
  [/fêmur/i, "femur"], [/úmero/i, "umero"], [/patela|sesamoid/i, "patela"], [/crânio|neurocrânio/i, "cranio"],
  [/coluna|vértebra|cervica|lombar|torácic|sacro|cóccix/i, "coluna"], [/costela|esterno/i, "costela"],
  [/osso longo/i, "ossoLongoFig"], [/osso curto|carpo|tarso/i, "ossoCurto"], [/osso plano|escápula/i, "ossoPlano"],
  [/osso irregular|mandíbula/i, "ossoIrregular"], [/articula|sinovia|cartilagem|ligamento/i, "articulacao"],
  [/múscul|actina|miosina|contração/i, "musculo"],
  [/encéfalo|cérebro|neurôni|nervo/i, "cerebro"], [/estômago|digest|intestino/i, "estomago"],
  [/coração|cardí|sangue|vaso|artéria|veia/i, "coracao"], [/pulmão|respirat|alvéolo/i, "pulmao"],
  [/ri[mn]s?\b|renal|urin|néfron|bexiga|uretra|ureter/i, "rim"], [/imun|defesa|anticorpo|linfócito/i, "escudo"],
  [/cerebelo|tronco encef|bulbo|encéfalo|cérebro/i, "cerebro"], [/aorta|átrio|ventrículo|coração/i, "coracao"],
  [/esôfago|estômago|fígado|intestino|digest/i, "estomago"], [/traqueia|brônquio|pulm|diafragma|nariz|respirat/i, "pulmao"],
  [/reprodut|ovário|testícul|útero|vagina|trompa|pênis|próstata|epidídimo|espermatozoide/i, "reprodutor"],
];
// Só vale a figurinha que for da MESMA trilha da pergunta (senão cai no mascote do sistema).
// Isso evita desconexão (ex.: questão de rim mostrando figurinha de coração porque citou "sangue").
function figDaQuestao(q) {
  if (q.fig) return q.fig;
  const daTrilha = (k) => F[k] && F[k][1] === q.s;
  if (q.t === "n" || q.t === "d") { const nome = (REGIOES[q.regiao] && REGIOES[q.regiao].nomes[q.alvo]) || ""; for (const [re, k] of REGRAS) if (daTrilha(k) && re.test(nome)) return k; return MASCOTE[q.s]; }
  const certa = q.t === "m" ? q.o[0] : "";
  for (const txt of [certa, q.q, q.e || ""]) { for (const [re, k] of REGRAS) if (txt && daTrilha(k) && re.test(txt)) return k; }
  return MASCOTE[q.s];
}

if (typeof module !== "undefined") module.exports = { F, REGIOES, NOMES_POOL, REGRAS, MASCOTE, figDaQuestao };
