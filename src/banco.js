// Banco de questões do jogo de Anatomia. Fonte: apostila da professora (pasta pamela).
// nivel b = conteúdo-chave | nivel c = contexto/detalhe
// Tipos: m=múltipla (1ª opção certa) | v=V/F | p=pares | s=separar | o=ordem
//        n=nomear o osso destacado | d=tocar no osso pedido
const TRILHAS = {
  oss: { nome: "Ossos e Locomotor", ico: "🦴", pronta: true },
  ner: { nome: "Sistema Nervoso", ico: "🧠" },
  dig: { nome: "Sistema Digestório", ico: "🍽️" },
  car: { nome: "Cardio e Circulatório", ico: "❤️" },
  res: { nome: "Respiratório e Renal", ico: "🫁" },
  imu: { nome: "Imunológico", ico: "🛡️" },
  rep: { nome: "Sistema Reprodutor", ico: "⚧" },
};
// SETORES é o nome que o motor usa internamente.
const SETORES = TRILHAS;

const Q = [];
const m = (s, n, p, q, o, e) => Q.push({ t: "m", s, n, p, q, o, e });
const v = (s, n, p, q, a, e) => Q.push({ t: "v", s, n, p, q, a, e });
const pr = (s, n, p, q, pares, e) => Q.push({ t: "p", s, n, p, q, pares, e });
const so = (s, n, p, q, cats, itens, e) => Q.push({ t: "s", s, n, p, q, cats, itens, e });
const or = (s, n, p, q, passos, e) => Q.push({ t: "o", s, n, p, q, passos, e });
const im = (s, n, p, q, op, e) => Q.push({ t: "i", s, n, p, q, op, e, fig: op[0] });
// Regiões que são de fato ossos (esqueleto). As demais são órgãos/estruturas.
const REG_OSSO = new Set(["esqueleto", "mao", "pe", "coluna"]);
// nomear: mostra a imagem real com um marcador; a pessoa escolhe o nome (4 opções).
const no = (s, n, p, regiao, alvo, e) => Q.push({ t: "n", s, n, p, regiao, alvo, q: REG_OSSO.has(regiao) ? "Qual osso está marcado?" : "Qual estrutura está marcada?", e });
// apontar: dado o nome, a pessoa toca na estrutura certa na imagem.
const di = (s, n, p, regiao, alvo, e) => Q.push({ t: "d", s, n, p, regiao, alvo, q: REG_OSSO.has(regiao) ? "Toque no osso indicado:" : "Toque na estrutura indicada:", e });

/* ============ OSSOS — NOMEAR (memorização, imagem real) ============ */
// Esqueleto inteiro
no("oss", "b", 8, "esqueleto", "cranio", "Protege o encéfalo. Tem 22 ossos (8 do neurocrânio e 14 da face).");
no("oss", "b", 10, "esqueleto", "coluna", "Sustenta o corpo e protege a medula espinal. 26 ossos no adulto.");
no("oss", "b", 11, "esqueleto", "costelas", "São 24 ossos (12 pares). Protegem coração e pulmões.");
no("oss", "b", 11, "esqueleto", "esterno", "Osso plano no centro do peito. Tem manúbrio, corpo e processo xifoide.");
no("oss", "b", 12, "esqueleto", "clavicula", "Osso longo e fino do ombro, ligado ao esterno. Cintura escapular.");
no("oss", "b", 12, "esqueleto", "escapula", "Osso plano do ombro (a “omoplata”). Cintura escapular.");
no("oss", "b", 13, "esqueleto", "umero", "Osso longo do braço, entre o ombro e o cotovelo.");
no("oss", "b", 13, "esqueleto", "radio", "Osso do antebraço do lado do polegar.");
no("oss", "b", 13, "esqueleto", "ulna", "Osso do antebraço do lado do dedo mínimo.");
no("oss", "b", 15, "esqueleto", "coxal", "Osso do quadril. Vem da fusão de ílio, ísquio e púbis.");
no("oss", "b", 15, "esqueleto", "femur", "O osso mais longo e forte do corpo. Fica na coxa.");
no("oss", "b", 15, "esqueleto", "patela", "Osso sesamoide do joelho. Protege a articulação.");
no("oss", "b", 15, "esqueleto", "tibia", "Osso da perna que sustenta o peso (a “canela”).");
no("oss", "b", 15, "esqueleto", "fibula", "Osso fino da perna, ao lado da tíbia.");
// Mão
no("oss", "b", 14, "mao", "carpais", "8 ossos curtos do punho: formam o carpo.");
no("oss", "b", 14, "mao", "metacarpais", "5 ossos longos da palma da mão.");
no("oss", "b", 14, "mao", "proximais", "Primeiras falanges dos dedos, ligadas aos metacarpais.");
no("oss", "b", 14, "mao", "medias", "Falanges do meio dos dedos. O polegar não tem.");
no("oss", "b", 14, "mao", "distais", "Falanges das pontas dos dedos.");
// Pé
no("oss", "b", 16, "pe", "tarso", "7 ossos curtos do retropé (tálus, calcâneo e outros).");
no("oss", "b", 16, "pe", "metatarso", "5 ossos longos do meio do pé.");
no("oss", "b", 16, "pe", "falangespe", "Ossos dos dedos do pé. São 14.");
// Coluna
no("oss", "b", 10, "coluna", "cervical", "7 vértebras do pescoço.");
no("oss", "b", 10, "coluna", "toracica", "12 vértebras, uma para cada par de costelas.");
no("oss", "b", 10, "coluna", "lombar", "5 vértebras da região baixa das costas.");
no("oss", "b", 10, "coluna", "sacro", "Formado pela fusão de 5 vértebras sacrais.");
no("oss", "b", 10, "coluna", "coccix", "A ponta da coluna, da fusão de 4 vértebras.");

/* ============ OSSOS — APONTAR (dado o nome, imagem real) ============ */
di("oss", "c", 15, "esqueleto", "femur", "Fica na coxa: é o osso mais longo do corpo.");
di("oss", "c", 8, "esqueleto", "cranio", "No topo, protege o encéfalo.");
di("oss", "c", 13, "esqueleto", "umero", "O osso do braço, acima do cotovelo.");
di("oss", "c", 15, "esqueleto", "tibia", "A canela: osso que sustenta o peso na perna.");
di("oss", "c", 14, "mao", "carpais", "Os ossos curtos do punho.");
di("oss", "c", 14, "mao", "metacarpais", "Os ossos longos da palma.");
di("oss", "c", 10, "coluna", "cervical", "As vértebras do pescoço.");
di("oss", "c", 10, "coluna", "lombar", "As vértebras da região baixa das costas.");
di("oss", "c", 16, "pe", "tarso", "Os ossos do retropé.");
di("oss", "c", 16, "pe", "falangespe", "Os ossos dos dedos do pé.");

/* ============ OSSOS — FUNÇÕES E CLASSIFICAÇÃO ============ */
m("oss", "b", 3, "Qual destas NÃO é função dos ossos?", ["Produzir hormônios da tireoide", "Sustentar e dar forma ao corpo", "Proteger órgãos vitais", "Produzir células sanguíneas"], "Os ossos sustentam, protegem, produzem células do sangue e armazenam minerais.");
v("oss", "b", 3, "Os ossos produzem células sanguíneas (na medula óssea).", true, "Também armazenam minerais como o cálcio.");
m("oss", "b", 7, "Quantos ossos tem o esqueleto humano adulto?", ["206", "306", "112", "180"], "São 206 ossos: 80 axiais e 126 apendiculares.");
m("oss", "b", 7, "Quantos ossos formam o esqueleto axial?", ["80", "126", "206", "46"], "Axial: crânio, coluna, costelas e esterno.");
m("oss", "b", 7, "Quantos ossos formam o esqueleto apendicular?", ["126", "80", "206", "60"], "Apendicular: membros e as cinturas escapular e pélvica.");
so("oss", "b", 6, "Esqueleto axial ou apendicular?", ["Axial", "Apendicular"], [["Crânio", 0], ["Coluna vertebral", 0], ["Costelas", 0], ["Esterno", 0], ["Úmero", 1], ["Fêmur", 1], ["Clavícula", 1], ["Osso do quadril", 1]], "Axial = eixo central (cabeça e tronco). Apendicular = membros e cinturas.");
pr("oss", "b", 5, "Tipo de osso: ligue ao exemplo", [["Longo", "Fêmur"], ["Curto", "Ossos do punho"], ["Plano", "Escápula"], ["Irregular", "Vértebras"], ["Sesamoide", "Patela"]], "Longo = fêmur e úmero. Plano = escápula e esterno.");
so("oss", "b", 5, "Classifique o osso quanto ao tipo", ["Longo", "Curto", "Plano", "Irregular"], [["Fêmur", 0], ["Úmero", 0], ["Ossos do carpo", 1], ["Ossos do tarso", 1], ["Esterno", 2], ["Escápula", 2], ["Vértebras", 3], ["Mandíbula", 3]], "A forma define o tipo do osso.");
m("oss", "b", 5, "A patela é um exemplo de osso:", ["Sesamoide", "Longo", "Plano", "Pneumático"], "Sesamoides se formam dentro de tendões, como a patela.");
m("oss", "c", 5, "Ossos com cavidades de ar, como o frontal e o esfenoide, são:", ["Pneumáticos", "Sesamoides", "Longos", "Suturais"], "Pneumático lembra “pneu”, cheio de ar.");

/* ============ OSSOS — CRÂNIO, COLUNA, TÓRAX ============ */
m("oss", "b", 8, "Quantos ossos tem o crânio?", ["22", "12", "30", "8"], "São 22: 8 do neurocrânio e 14 da face.");
m("oss", "b", 8, "Quantos ossos formam o neurocrânio (que protege o encéfalo)?", ["8", "14", "22", "4"], "Frontal, 2 parietais, 2 temporais, occipital, esfenoide e etmoide.");
m("oss", "b", 8, "Quantos ossos formam o esqueleto da face?", ["14", "8", "22", "6"], "Inclui maxilas, zigomáticos, nasais, mandíbula, vômer e outros.");
m("oss", "b", 10, "Quantos ossos tem a coluna vertebral no adulto?", ["26", "33", "24", "12"], "No adulto, sacro e cóccix se fundem: ficam 26.");
m("oss", "b", 10, "Quantas vértebras cervicais existem?", ["7", "12", "5", "4"], "Cervicais = 7 (pescoço).");
m("oss", "b", 10, "Quantas vértebras torácicas existem?", ["12", "7", "5", "10"], "Torácicas = 12, uma para cada par de costelas.");
m("oss", "b", 10, "Quantas vértebras lombares existem?", ["5", "7", "12", "4"], "Lombares = 5, na região baixa das costas.");
or("oss", "c", 10, "Coloque as regiões da coluna de cima para baixo", ["Cervical", "Torácica", "Lombar", "Sacro", "Cóccix"], "Do pescoço (cervical) até a ponta (cóccix).");
m("oss", "c", 10, "O sacro é formado pela fusão de quantas vértebras?", ["5", "4", "7", "2"], "5 vértebras sacrais fundidas. O cóccix vem de 4 coccígeas.");
m("oss", "b", 11, "Quantas costelas temos no total?", ["24 (12 pares)", "12 (6 pares)", "20 (10 pares)", "26 (13 pares)"], "12 pares: 7 verdadeiras, 3 falsas e 2 flutuantes.");
pr("oss", "c", 11, "Tipo de costela: ligue à característica", [["Verdadeiras", "Ligam-se direto ao esterno (7 pares)"], ["Falsas", "Ligam-se ao esterno pela cartilagem da costela de cima (3 pares)"], ["Flutuantes", "Não se ligam ao esterno (2 pares)"]], "Verdadeiras 7, falsas 3, flutuantes 2.");
or("oss", "c", 11, "Partes do esterno, de cima para baixo", ["Manúbrio", "Corpo do esterno", "Processo xifoide"], "O esterno fica no centro do peito.");

/* ============ OSSOS — MEMBROS E CINTURAS ============ */
pr("oss", "b", 12, "Ossos das cinturas: ligue à descrição", [["Clavícula", "Osso do ombro ligado ao esterno (cintura escapular)"], ["Escápula", "Osso plano do ombro (cintura escapular)"], ["Osso coxal", "Osso do quadril (cintura pélvica)"]], "Escapular (clavícula + escápula) liga os braços; pélvica (coxais) liga as pernas.");
or("oss", "c", 13, "Ossos do braço para a mão, em ordem", ["Úmero", "Rádio e ulna", "Carpo", "Metacarpo", "Falanges"], "Do ombro até a ponta dos dedos.");
m("oss", "c", 14, "Quantos ossos formam o carpo (punho)?", ["8", "5", "14", "7"], "São 8 ossos curtos no punho.");
m("oss", "c", 14, "Quantas falanges existem em cada mão?", ["14", "8", "5", "10"], "14 falanges; o polegar tem só duas.");
pr("oss", "c", 15, "Membro inferior: ligue o osso à parte", [["Fêmur", "Coxa"], ["Patela", "Joelho"], ["Tíbia e fíbula", "Perna"], ["Tarso", "Pé (retropé)"]], "Da coxa ao pé.");
m("oss", "c", 15, "Entre tíbia e fíbula, qual sustenta o peso do corpo?", ["Tíbia", "Fíbula", "As duas igualmente", "Nenhuma"], "A tíbia é mais robusta; a fíbula é fina e lateral.");
m("oss", "c", 16, "Quantos ossos tem cada pé?", ["26", "14", "7", "33"], "Tarso 7, metatarso 5 e falanges 14.");

/* ============ OSSOS — ARTICULAÇÕES E MÚSCULOS ============ */
m("oss", "b", 18, "O que é uma articulação?", ["Ponto onde os ossos se encontram, permitindo união e movimento", "Um tipo de osso curto", "Um músculo do braço", "Uma célula do sangue"], "A cartilagem reduz o atrito; os ligamentos estabilizam.");
pr("oss", "b", 18, "Estrutura da articulação: ligue à função", [["Cartilagem", "Reduz o atrito e absorve impacto"], ["Ligamento", "Une osso a osso e estabiliza"], ["Líquido sinovial", "Lubrifica e facilita o movimento"]], "Trio das articulações móveis.");
so("oss", "b", 19, "Classifique a articulação pelo movimento", ["Móvel (sinovial)", "Semimóvel", "Fixa (sinartrose)"], [["Joelho", 0], ["Cotovelo", 0], ["Ombro", 0], ["Discos entre vértebras", 1], ["Sínfise púbica", 1], ["Suturas do crânio", 2]], "Móvel = sinovial. Semimóvel = anfiartrose. Fixa = sinartrose.");
m("oss", "c", 21, "As suturas do crânio são articulações:", ["Fixas (sinartroses)", "Móveis", "Semimóveis", "Sinoviais"], "Não permitem movimento.");
pr("oss", "b", 23, "Tipo de músculo: ligue à característica", [["Esquelético", "Voluntário, estriado, move os ossos"], ["Liso", "Involuntário, nos órgãos internos"], ["Cardíaco", "Involuntário e estriado, só no coração"]], "Esquelético = vontade. Liso e cardíaco = involuntários.");
m("oss", "b", 23, "O músculo esquelético é responsável por:", ["Movimentos voluntários e postura", "Bater o coração", "Mover o alimento no intestino", "Produzir urina"], "É estriado e se liga aos ossos por tendões.");
m("oss", "c", 23, "Quais proteínas fazem a contração muscular?", ["Actina e miosina", "Colágeno e queratina", "Insulina e glucagon", "Hemoglobina e ferro"], "Ficam nas miofibrilas das fibras musculares.");

/* ===================== SISTEMA NERVOSO ===================== */
m("ner", "b", 2, "Qual é a função geral do sistema nervoso?", ["Perceber o ambiente e elaborar respostas que adaptam o corpo", "Bombear o sangue pelo corpo", "Filtrar o sangue e formar a urina", "Produzir os hormônios sexuais"], "Ele ajusta o organismo às condições de dentro e de fora.");
so("ner", "b", 2, "É do sistema nervoso central (SNC) ou periférico (SNP)?", ["SNC", "SNP"], [["Encéfalo", 0], ["Medula espinhal", 0], ["Nervos cranianos", 1], ["Nervos raquidianos", 1], ["Gânglios nervosos", 1], ["Terminações nervosas", 1]], "SNC = encéfalo + medula. SNP = nervos, gânglios e terminações.");
m("ner", "b", 3, "O encéfalo é dividido em quais três partes?", ["Cérebro, cerebelo e tronco encefálico", "Córtex, medula e bulbo", "Tálamo, ponte e gânglios", "Dura-máter, aracnoide e pia-máter"], "Essas são as três partes do encéfalo.");
m("ner", "b", 4, "Qual estrutura é cerca de 90% da massa do encéfalo?", ["Cérebro", "Cerebelo", "Bulbo", "Ponte"], "O cérebro é a maior parte do encéfalo.");
v("ner", "c", 4, "No cérebro, a substância cinzenta (córtex) é formada pelos corpos dos neurônios.", true, "A substância branca tem axônios e dendritos.");
pr("ner", "b", 5, "Ligue a parte do encéfalo à sua função", [["Cérebro", "Pensamento, memória e movimentos voluntários"], ["Cerebelo", "Equilíbrio e coordenação dos movimentos"], ["Bulbo", "Controla batimentos, respiração e deglutição"]], "Cérebro pensa, cerebelo equilibra, bulbo controla o automático.");
m("ner", "b", 8, "Qual parte controla o equilíbrio e a coordenação dos movimentos?", ["Cerebelo", "Cérebro", "Bulbo", "Medula"], "Cerebelo = equilíbrio e coordenação.");
m("ner", "b", 9, "Quais são as três divisões do tronco encefálico?", ["Mesencéfalo, ponte e bulbo", "Cérebro, cerebelo e medula", "Tálamo, hipotálamo e hipófise", "Dura, aracnoide e pia"], "Mesencéfalo, ponte e bulbo.");
m("ner", "b", 12, "O bulbo controla, entre outras coisas:", ["Batimentos cardíacos, respiração e deglutição", "Apenas o pensamento", "A produção de urina", "A digestão das gorduras"], "Por isso é uma área vital.");
pr("ner", "c", 6, "Ligue a estrutura à função", [["Tálamo", "Organiza os estímulos e a percepção sensorial"], ["Hipotálamo", "Regula temperatura, fome e equilíbrio da água"], ["Cerebelo", "Equilíbrio e coordenação motora"]], "O hipotálamo é o regulador da homeostase.");
m("ner", "b", 15, "A medula espinhal é responsável pelos:", ["Atos reflexos", "Pensamentos conscientes", "Batimentos do coração", "Hormônios sexuais"], "Ela dá respostas rápidas sem passar pelo encéfalo.");
m("ner", "b", 15, "Encostar a mão em um ferro quente e puxar na hora é um:", ["Ato reflexo (reflexo medular)", "Ato voluntário", "Controle hormonal", "Movimento do cerebelo"], "A medula elabora a resposta rápida.");
m("ner", "b", 13, "Quantos pares de nervos raquidianos partem da medula?", ["31", "12", "26", "7"], "São 31 pares de nervos raquidianos (espinhais).");
m("ner", "b", 18, "Quantos pares de nervos cranianos existem?", ["12", "31", "24", "8"], "12 pares, ligados ao encéfalo.");
so("ner", "c", 18, "Classifique o nervo quanto ao tipo de neurônio", ["Sensitivo (aferente)", "Motor (eferente)", "Misto"], [["Leva a informação ao SNC", 0], ["Leva a ordem do SNC ao músculo", 1], ["Tem neurônios sensitivos e motores", 2]], "Aferente entra, eferente sai, misto faz os dois.");
or("ner", "c", 16, "Camadas das meninges, da mais externa para a mais interna", ["Dura-máter", "Aracnoide", "Pia-máter"], "As meninges protegem o SNC.");
m("ner", "b", 22, "O sistema nervoso somático (voluntário) comanda:", ["Ações conscientes, como andar e falar", "Os batimentos cardíacos", "A digestão", "A produção de urina"], "Controla a musculatura esquelética.");
m("ner", "b", 23, "O sistema nervoso autônomo controla ações:", ["Involuntárias, como digestão e batimentos", "Conscientes, como escrever", "Apenas reflexas da medula", "Apenas sensoriais"], "Atua em músculo liso, coração e glândulas.");
so("ner", "b", 24, "Simpático ou parassimpático?", ["Simpático", "Parassimpático"], [["Prepara para luta ou fuga (estresse)", 0], ["Acelera o coração no susto", 0], ["Estimula o repouso e o relaxamento", 1], ["Favorece a digestão no descanso", 1]], "São antagônicos: um acelera, o outro acalma.");
m("ner", "b", 31, "Cérebro, cerebelo e bulbo fazem parte do:", ["Sistema nervoso central", "Sistema nervoso periférico", "Sistema nervoso autônomo", "Sistema somático"], "São estruturas do SNC.");

/* ===================== CARDIO E CIRCULATÓRIO ===================== */
m("car", "b", 2, "O sistema cardiovascular é formado por:", ["Coração, vasos sanguíneos e sangue", "Apenas o coração", "Pulmões e brônquios", "Rins e bexiga"], "Trabalham juntos para circular o sangue.");
m("car", "b", 4, "Quantas câmaras tem o coração?", ["4 (2 átrios e 2 ventrículos)", "2", "3", "6"], "Dois átrios em cima e dois ventrículos embaixo.");
pr("car", "b", 5, "Ligue a câmara do coração à função", [["Átrio direito", "Recebe o sangue venoso do corpo"], ["Átrio esquerdo", "Recebe o sangue oxigenado dos pulmões"], ["Ventrículo direito", "Bombeia o sangue aos pulmões"], ["Ventrículo esquerdo", "Bombeia o sangue para todo o corpo"]], "Átrios recebem, ventrículos bombeiam.");
m("car", "b", 5, "Qual câmara bombeia o sangue para todo o corpo?", ["Ventrículo esquerdo", "Átrio direito", "Ventrículo direito", "Átrio esquerdo"], "Por isso tem a parede mais espessa.");
pr("car", "b", 8, "Ligue a camada da parede do coração à descrição", [["Endocárdio", "Revestimento interno das câmaras"], ["Miocárdio", "Camada muscular que faz a contração"], ["Epicárdio", "Camada externa do coração"], ["Pericárdio", "Membrana que envolve e protege"]], "Do interno ao externo: endo, mio, epi, pericárdio.");
m("car", "b", 8, "Qual camada é o músculo que faz o coração contrair?", ["Miocárdio", "Endocárdio", "Pericárdio", "Epicárdio"], "Mio = músculo.");
m("car", "b", 10, "Para que servem as válvulas cardíacas?", ["Impedir o refluxo (volta) do sangue", "Produzir o sangue", "Filtrar a urina", "Bombear sozinhas o sangue"], "Garantem fluxo em um sentido só.");
m("car", "c", 4, "Quais são as quatro válvulas do coração?", ["Tricúspide, pulmonar, mitral e aórtica", "Aorta, cava, jugular e femoral", "SA, AV, His e Purkinje", "Mitral, renal, hepática e porta"], "Duas de cada lado do coração.");
so("car", "b", 18, "É artéria, veia ou capilar?", ["Artéria", "Veia", "Capilar"], [["Leva o sangue para fora do coração", 0], ["Parede espessa, muscular e elástica", 0], ["Traz o sangue de volta ao coração", 1], ["Tem válvulas que evitam o refluxo", 1], ["Parede muito fina, de uma só camada", 2], ["Local das trocas de gases e nutrientes", 2]], "Artéria leva, veia traz, capilar troca.");
m("car", "b", 18, "Qual vaso tem parede fininha e é o local das trocas de gases e nutrientes?", ["Capilar", "Artéria", "Veia", "Aorta"], "Parede de uma única camada de células.");
m("car", "b", 17, "As artérias levam o sangue:", ["Do coração para o corpo", "Do corpo de volta ao coração", "Só dentro do coração", "Dos rins para a bexiga"], "Exceção: a artéria pulmonar leva sangue venoso.");
or("car", "c", 14, "Coloque em ordem o caminho do sangue pelo coração", ["Veias cavas", "Átrio direito", "Ventrículo direito", "Pulmões", "Átrio esquerdo", "Ventrículo esquerdo", "Aorta"], "Volta venoso, vai aos pulmões, volta oxigenado e sai pela aorta.");
so("car", "c", 14, "Pequena (pulmonar) ou grande (sistêmica) circulação?", ["Pequena (pulmonar)", "Grande (sistêmica)"], [["Coração → pulmões → coração", 0], ["Oxigena o sangue nos pulmões", 0], ["Coração → corpo → coração", 1], ["Leva sangue oxigenado aos tecidos", 1]], "Pequena vai só aos pulmões; grande vai ao corpo todo.");
pr("car", "b", 15, "Ligue a fase/estrutura do coração à função", [["Sístole", "Contração: ejeta o sangue"], ["Diástole", "Relaxamento: enche as câmaras"], ["Válvulas", "Impedem o refluxo do sangue"]], "Sístole aperta, diástole relaxa.");
m("car", "c", 16, "Qual é o marcapasso natural do coração (inicia o impulso)?", ["Nó sinoatrial (SA)", "Nó atrioventricular (AV)", "Feixe de His", "Fibras de Purkinje"], "O nó SA dispara cada batimento.");
or("car", "c", 16, "Ordem do impulso elétrico no coração", ["Nó sinoatrial (SA)", "Nó atrioventricular (AV)", "Feixe de His", "Fibras de Purkinje"], "SA → AV → His → Purkinje.");
m("car", "b", 19, "A aorta é:", ["A principal artéria do corpo", "A principal veia do corpo", "Uma válvula do coração", "Uma câmara do coração"], "Sai do ventrículo esquerdo.");
pr("car", "c", 20, "Ligue o pulso ao local onde é sentido", [["Pulso radial", "No punho, do lado do polegar"], ["Pulso carotídeo", "No pescoço, ao lado da traqueia"], ["Pulso femoral", "Na virilha"]], "Locais comuns para checar o pulso.");
m("car", "b", 20, "O que é a pressão arterial?", ["A força do sangue contra a parede das artérias", "O número de batimentos por minuto", "A quantidade de urina", "A temperatura do sangue"], "É medida com o esfigmomanômetro.");
pr("car", "c", 30, "Ligue a doença cardíaca ao mecanismo", [["Aterosclerose", "Placas de gordura estreitam as artérias"], ["Infarto do miocárdio", "Obstrução súbita de artéria coronária"], ["Hipertensão", "Pressão alta que sobrecarrega o coração"], ["Trombose venosa profunda", "Coágulo em veia profunda da perna"]], "Muitas vêm de problemas nos vasos.");
m("car", "c", 30, "Fatores de risco para doenças do coração incluem:", ["Tabagismo, colesterol alto e sedentarismo", "Beber água e caminhar", "Dormir bem", "Comer frutas e verduras"], "Também diabetes e hipertensão.");

/* ===================== RESPIRATÓRIO E RENAL ===================== */
m("res", "b", 2, "Qual é a principal função dos rins?", ["Filtrar o sangue e produzir a urina", "Bombear o sangue", "Digerir os alimentos", "Produzir espermatozoides"], "Também regulam água, sais e o equilíbrio ácido-base.");
or("res", "b", 3, "Caminho da urina, do rim até sair do corpo", ["Rins", "Ureteres", "Bexiga", "Uretra"], "Forma no rim, desce pelos ureteres, guarda na bexiga e sai pela uretra.");
pr("res", "b", 3, "Ligue a estrutura do sistema urinário à função", [["Rins", "Filtram o sangue e formam a urina"], ["Ureteres", "Levam a urina do rim à bexiga"], ["Bexiga", "Armazena a urina"], ["Uretra", "Elimina a urina para fora"]], "Cada parte tem um papel no caminho da urina.");
m("res", "b", 6, "Qual é a unidade funcional do rim, que filtra o sangue?", ["Néfron", "Alvéolo", "Neurônio", "Bexiga"], "O néfron filtra, reabsorve o útil e forma a urina.");
m("res", "c", 7, "Dentro do rim, qual estrutura filtra o sangue?", ["Glomérulo", "Bexiga", "Uretra", "Ureter"], "O glomérulo fica dentro do néfron.");
or("res", "c", 9, "Coloque em ordem as etapas da formação da urina", ["Filtração", "Reabsorção", "Secreção", "Excreção"], "Filtra, reabsorve o útil, secreta resíduos e elimina.");
v("res", "c", 5, "Os rins ajudam a controlar a pressão (pela renina) e produzem eritropoietina.", true, "Também ativam a vitamina D.");
m("res", "b", 10, "A insuficiência renal acontece quando os rins:", ["Perdem a capacidade de filtrar o sangue", "Produzem muito sangue", "Param de bater", "Enchem de ar"], "Acumula ureia e creatinina no sangue.");
pr("res", "c", 12, "Ligue a doença renal à descrição", [["Cálculo renal", "Pedra que pode bloquear a saída da urina"], ["Infecção urinária", "Pode subir e atingir o rim (pielonefrite)"], ["Glomerulonefrite", "Inflamação dos glomérulos"]], "Doenças que afetam a filtração.");
m("res", "b", 14, "Qual é a função do sistema respiratório?", ["Trocar gases: captar O₂ e eliminar CO₂", "Filtrar o sangue", "Bombear o sangue", "Digerir os alimentos"], "A troca gasosa acontece nos alvéolos.");
or("res", "b", 15, "Caminho do ar na respiração, do nariz aos alvéolos", ["Nariz e cavidade nasal", "Faringe e laringe", "Traqueia", "Brônquios", "Alvéolos"], "O ar entra pelo nariz e chega aos alvéolos.");
m("res", "b", 16, "Onde ocorre a troca gasosa (O₂ entra no sangue, CO₂ sai)?", ["Nos alvéolos", "Na traqueia", "Na faringe", "No nariz"], "Os alvéolos são envolvidos por capilares.");
m("res", "b", 16, "O nariz e a cavidade nasal servem para:", ["Filtrar, aquecer e umidificar o ar", "Fazer a troca gasosa", "Bombear o sangue", "Produzir a urina"], "Preparam o ar antes de ir aos pulmões.");
m("res", "b", 16, "Qual é o principal músculo da respiração?", ["Diafragma", "Coração", "Bíceps", "Miocárdio"], "Contrai na inspiração e relaxa na expiração.");
so("res", "b", 18, "É inspiração ou expiração?", ["Inspiração", "Expiração"], [["O diafragma contrai", 0], ["O ar entra nos pulmões", 0], ["O diafragma relaxa", 1], ["O ar sai dos pulmões", 1]], "Inspira: diafragma desce e o ar entra.");
pr("res", "c", 18, "Ligue a estrutura respiratória à função", [["Brônquios", "Conduzem o ar aos pulmões"], ["Alvéolos", "Fazem a troca gasosa"], ["Diafragma", "Músculo principal da respiração"]], "Cada parte ajuda o ar a chegar e trocar.");
pr("res", "c", 21, "Ligue a doença respiratória à descrição", [["Pneumonia", "Infecção dos pulmões"], ["Asma", "Inflamação das vias aéreas que dificulta respirar"], ["Enfisema", "Destruição dos alvéolos"], ["Bronquite", "Inflamação dos brônquios"]], "Doenças comuns do sistema respiratório.");
m("res", "c", 20, "No pneumotórax, entra ar no espaço pleural e o pulmão pode:", ["Colapsar (murchar)", "Encher de sangue", "Virar osso", "Produzir urina"], "A pressão pleural negativa é que mantém o pulmão aberto.");

/* ===================== IMUNOLÓGICO ===================== */
m("imu", "b", 2, "Qual é a função do sistema imunológico?", ["Defender o corpo, separando o próprio do estranho", "Bombear o sangue", "Filtrar a urina", "Digerir os alimentos"], "Ele defende, vigia e ajuda no equilíbrio.");
so("imu", "b", 3, "Órgão linfoide primário ou secundário?", ["Primário", "Secundário"], [["Medula óssea", 0], ["Timo", 0], ["Linfonodos", 1], ["Baço", 1]], "Primários: medula e timo. Secundários: linfonodos e baço.");
m("imu", "b", 4, "Qual órgão é a escola que amadurece os linfócitos T?", ["Timo", "Baço", "Fígado", "Rim"], "T de timo.");
m("imu", "b", 4, "Onde os linfócitos B se originam e amadurecem?", ["Medula óssea", "Timo", "Baço", "Linfonodos"], "A medula também produz as células do sangue.");
m("imu", "c", 5, "O que o baço faz?", ["Filtra o sangue e remove células velhas", "Filtra a linfa", "Produz a urina", "Bombeia o sangue"], "Organiza a defesa contra o que circula no sangue.");
so("imu", "b", 8, "É imunidade inata ou adaptativa?", ["Inata", "Adaptativa"], [["Rápida e inespecífica", 0], ["Barreiras, inflamação e fagócitos", 0], ["Específica e com memória", 1], ["Depende de linfócitos T, B e anticorpos", 1], ["A vacinação gera esse tipo", 1]], "Inata vem primeiro; adaptativa é específica e lembra.");
v("imu", "b", 8, "A imunidade inata é rápida e sem memória; a adaptativa é específica e cria memória.", true, "Por isso a vacina (adaptativa) protege no futuro.");
pr("imu", "b", 6, "Ligue a célula de defesa à função", [["Linfócito T", "Coordena e destrói células infectadas"], ["Linfócito B", "Produz anticorpos"], ["Macrófago", "Fagocita e sinaliza"], ["Neutrófilo", "Primeiro a chegar na infecção"]], "Cada célula tem sua especialidade.");
m("imu", "c", 7, "Qual leucócito é o mais numeroso no sangue (cerca de 60%)?", ["Neutrófilos", "Linfócitos", "Monócitos", "Basófilos"], "Neutrófilos ~60%, linfócitos ~30%.");
m("imu", "b", 9, "Antígeno é:", ["Uma estrutura reconhecida como alvo pelo sistema imune", "Uma célula do coração", "Um tipo de osso", "Um hormônio do rim"], "O anticorpo se liga a ele (chave-fechadura).");
m("imu", "b", 9, "Anticorpo é:", ["Proteína que neutraliza e marca o alvo para eliminação", "Um tipo de vírus", "Uma hemácia", "Um músculo"], "Produzido pelos plasmócitos (linfócitos B).");
or("imu", "c", 11, "Coloque em ordem as etapas da fagocitose", ["Quimiotaxia", "Adesão", "Englobamento", "Destruição"], "A célula migra, prende, engloba e degrada o invasor.");
m("imu", "b", 10, "Quais são os sinais clássicos da inflamação?", ["Rubor, calor, inchaço e dor", "Febre, tosse e espirro", "Fome e sede", "Sono e cansaço"], "Também pode haver perda de função.");
so("imu", "b", 13, "É vacina ou soro?", ["Vacina", "Soro"], [["Ensina o corpo e cria memória", 0], ["Proteção mais lenta e duradoura", 0], ["Fornece anticorpos prontos", 1], ["Proteção imediata, sem memória", 1]], "Vacina ensina; soro entrega pronto.");
m("imu", "b", 13, "Por que a vacina gera memória e o soro não?", ["A vacina estimula a resposta do próprio corpo; o soro só entrega anticorpos prontos", "Porque o soro é mais forte", "Porque a vacina tem sempre vírus vivo", "Porque o soro cria linfócitos"], "Memória é da resposta adaptativa.");
pr("imu", "c", 18, "Ligue a doença do sistema imune à descrição", [["Lúpus", "Doença autoimune que afeta vários órgãos"], ["Artrite reumatoide", "Inflamação autoimune das articulações"], ["HIV/AIDS", "Imunodeficiência com queda de linfócitos CD4"], ["Alergia", "Resposta exagerada a algo inofensivo"]], "Autoimunes atacam o próprio corpo.");

/* ===================== SISTEMA REPRODUTOR ===================== */
pr("rep", "b", 3, "Ligue o órgão reprodutor masculino à função", [["Testículos", "Produzem espermatozoides e testosterona"], ["Epidídimo", "Maturação e armazenamento dos espermatozoides"], ["Ductos deferentes", "Transportam os espermatozoides"], ["Próstata", "Produz parte do fluido seminal"]], "Cada estrutura tem um papel na reprodução masculina.");
m("rep", "b", 4, "Onde são produzidos os espermatozoides?", ["Nos túbulos seminíferos dos testículos", "Na próstata", "Na bexiga", "No pênis"], "A produção se chama espermatogênese.");
m("rep", "b", 3, "Qual hormônio masculino é produzido pelos testículos?", ["Testosterona", "Progesterona", "Insulina", "Adrenalina"], "Produzida pelas células de Leydig.");
m("rep", "c", 5, "O que é o sêmen (esperma)?", ["Mistura dos espermatozoides com secreções da próstata e vesículas seminais", "Apenas os espermatozoides", "Um tipo de urina", "Um hormônio"], "Várias glândulas contribuem para o líquido.");
pr("rep", "b", 7, "Ligue o órgão reprodutor feminino à função", [["Ovários", "Produzem óvulos e hormônios (estrogênio e progesterona)"], ["Tubas uterinas", "Local da fecundação; levam o óvulo"], ["Útero", "Recebe o embrião e abriga o feto"], ["Vagina", "Canal de parto e órgão de cópula"]], "Cada parte tem um papel na reprodução feminina.");
m("rep", "b", 12, "Onde normalmente ocorre a fecundação?", ["Na tuba uterina (trompa de Falópio)", "No útero", "Na vagina", "No ovário"], "Depois o embrião se implanta no útero.");
m("rep", "c", 12, "O encontro do espermatozoide com o óvulo forma o:", ["Zigoto", "Endométrio", "Folículo", "Corpo lúteo"], "O zigoto começa a se dividir.");
m("rep", "b", 7, "Quais hormônios os ovários produzem?", ["Estrogênio e progesterona", "Testosterona e insulina", "Adrenalina e cortisol", "GnRH e FSH"], "Regulam o ciclo e os caracteres femininos.");
or("rep", "c", 9, "Coloque em ordem as fases do ciclo menstrual", ["Fase menstrual", "Fase proliferativa", "Fase secretora"], "Ciclo médio de 28 dias.");
m("rep", "b", 9, "Sem fecundação, o que acontece no fim do ciclo menstrual?", ["Descamação do endométrio (menstruação)", "A ovulação", "A fecundação", "A gravidez"], "A queda da progesterona inicia a menstruação.");
m("rep", "c", 10, "Em um ciclo de 28 dias, a ovulação ocorre por volta do dia:", ["14", "1", "28", "5"], "No meio do ciclo.");
so("rep", "b", 15, "O órgão é do sistema reprodutor masculino ou feminino?", ["Masculino", "Feminino"], [["Testículos", 0], ["Próstata", 0], ["Epidídimo", 0], ["Ovários", 1], ["Útero", 1], ["Tubas uterinas", 1]], "Separe os órgãos de cada sistema.");
pr("rep", "c", 14, "Ligue a doença/tema à descrição", [["HPV", "Ligado ao câncer de colo do útero e de pênis"], ["HPB", "Aumento benigno da próstata"], ["Endometriose", "Tecido do endométrio fora do útero"], ["Candidíase", "Infecção pelo fungo Candida"]], "Prevenção e acompanhamento são essenciais.");
m("rep", "b", 14, "Um cuidado de enfermagem importante na saúde reprodutora é:", ["Orientar a vacina contra HPV e o uso de preservativo", "Suspender a higiene", "Evitar o exame preventivo", "Parar de beber água"], "Também acompanhamento ginecológico e exame preventivo.");

/* ===================== SISTEMA DIGESTÓRIO ===================== */
m("dig", "b", 3, "Qual é a função do sistema digestório?", ["Transformar o alimento, absorver nutrientes e eliminar dejetos", "Bombear o sangue", "Filtrar o sangue", "Trocar gases com o ar"], "Transforma, absorve e elimina.");
or("dig", "b", 3, "Caminho do alimento pelo tubo digestório", ["Boca", "Faringe", "Esôfago", "Estômago", "Intestino delgado", "Intestino grosso", "Ânus"], "O alimento vai da boca ao ânus.");
so("dig", "b", 13, "Faz parte do tubo digestório ou é órgão acessório?", ["Tubo digestório", "Órgão acessório"], [["Estômago", 0], ["Esôfago", 0], ["Intestino delgado", 0], ["Fígado", 1], ["Pâncreas", 1], ["Glândulas salivares", 1]], "O alimento passa pelo tubo; os acessórios só liberam secreções.");
m("dig", "b", 14, "A digestão começa em qual órgão?", ["Na boca", "No estômago", "No intestino", "No esôfago"], "Dentes fazem a parte mecânica e a saliva (amilase) a química.");
pr("dig", "b", 14, "Ligue a estrutura da boca à função", [["Dentes", "Cortam e trituram (digestão mecânica)"], ["Língua", "Mistura o alimento à saliva"], ["Saliva (amilase)", "Inicia a digestão do amido"]], "Forma-se o bolo alimentar.");
m("dig", "b", 7, "O que são os movimentos peristálticos?", ["Contrações que empurram o alimento pelo tubo", "Os batimentos do coração", "A filtração do sangue", "A troca de gases"], "Levam o bolo pelo esôfago até o estômago.");
m("dig", "c", 15, "A faringe é uma região comum a quais dois sistemas?", ["Digestório e respiratório", "Nervoso e ósseo", "Urinário e reprodutor", "Muscular e cardíaco"], "A epiglote protege a entrada da laringe na deglutição.");
m("dig", "c", 15, "Qual estrutura ajuda a evitar o refluxo do estômago para o esôfago?", ["O esfíncter esofágico inferior", "A epiglote", "O apêndice", "A vesícula biliar"], "Fica no fim do esôfago.");
m("dig", "b", 8, "O que o estômago produz para quebrar o alimento?", ["Suco gástrico (ácido clorídrico e enzimas)", "Bile", "Suco pancreático", "Saliva"], "Inicia principalmente a digestão das proteínas.");
m("dig", "b", 8, "No estômago, o bolo alimentar misturado ao suco gástrico passa a se chamar:", ["Quimo", "Bolo alimentar", "Bile", "Fezes"], "Depois segue para o intestino delgado.");
m("dig", "b", 9, "Qual é o principal local de digestão e absorção dos nutrientes?", ["Intestino delgado", "Estômago", "Intestino grosso", "Boca"], "Tem cerca de 6 m e vilosidades que aumentam a área.");
or("dig", "c", 9, "Partes do intestino delgado, na ordem", ["Duodeno", "Jejuno", "Íleo"], "O duodeno recebe a bile e o suco pancreático.");
m("dig", "b", 10, "Qual é a principal função do intestino grosso?", ["Absorver água e formar as fezes", "Produzir a bile", "Digerir as proteínas", "Fazer a troca gasosa"], "Divide-se em ceco, cólon e reto.");
pr("dig", "b", 19, "Ligue o órgão anexo à função", [["Fígado", "Produz a bile"], ["Vesícula biliar", "Armazena e concentra a bile"], ["Pâncreas", "Produz enzimas e bicarbonato"]], "O pâncreas também produz insulina e glucagon.");
m("dig", "b", 19, "A bile, produzida pelo fígado, serve para:", ["Emulsificar as gorduras (ela não é enzima)", "Digerir as proteínas", "Neutralizar o sangue", "Produzir a saliva"], "Facilita a ação das lipases sobre a gordura.");
pr("dig", "c", 21, "Ligue a enzima ao que ela digere", [["Amilase", "Carboidratos"], ["Pepsina", "Proteínas no estômago"], ["Lipase", "Gorduras"]], "Cada enzima quebra um tipo de nutriente.");
so("dig", "c", 20, "A digestão é mecânica ou química?", ["Mecânica", "Química"], [["Mastigação dos dentes", 0], ["Mistura do alimento", 0], ["Ação das enzimas", 1], ["Ação do ácido do estômago", 1]], "Mecânica tritura; química quebra por enzimas e ácido.");
or("dig", "c", 20, "Coloque em ordem as etapas da digestão", ["Ingestão", "Propulsão", "Digestão mecânica", "Digestão química", "Absorção", "Defecação"], "Do comer até eliminar as fezes.");
m("dig", "c", 21, "A deficiência da enzima lactase causa dificuldade de digerir:", ["A lactose (o açúcar do leite)", "As proteínas", "As gorduras", "A água"], "Causa gases, cólicas e desconforto.");

/* ============ IDENTIFICAÇÃO NAS IMAGENS (nomear / apontar) ============ */
// Encéfalo
no("ner", "b", 3, "encefalo", "cerebro", "A maior parte do encéfalo: pensamento, memória e movimentos voluntários.");
no("ner", "b", 8, "encefalo", "cerebelo", "Atrás e embaixo: controla o equilíbrio e a coordenação.");
no("ner", "b", 9, "encefalo", "tronco", "Liga o encéfalo à medula; o bulbo fica aqui (batimentos e respiração).");
di("ner", "c", 4, "encefalo", "cerebro", "A grande massa enrugada na frente e no alto.");
di("ner", "c", 8, "encefalo", "cerebelo", "A estrutura menor e enrugada, atrás e embaixo.");
// Coração
no("car", "b", 5, "coracao", "aorta", "A principal artéria do corpo, que sai do coração em forma de arco.");
no("car", "b", 5, "coracao", "atrioD", "Câmara de cima que recebe o sangue venoso do corpo.");
no("car", "b", 5, "coracao", "atrioE", "Câmara de cima que recebe o sangue oxigenado dos pulmões.");
no("car", "b", 5, "coracao", "ventriculoD", "Câmara de baixo que bombeia o sangue aos pulmões.");
no("car", "b", 5, "coracao", "ventriculoE", "Câmara de baixo que bombeia o sangue para todo o corpo.");
di("car", "c", 11, "coracao", "aorta", "O grande arco no topo do coração.");
di("car", "c", 5, "coracao", "ventriculoE", "A câmara de baixo com a parede mais espessa.");
// Digestório
no("dig", "b", 7, "digestorio", "esofago", "Tubo que leva o alimento da garganta ao estômago.");
no("dig", "b", 8, "digestorio", "estomago", "Bolsa onde o alimento vira quimo pelo suco gástrico.");
no("dig", "b", 19, "digestorio", "figado", "Órgão que produz a bile.");
no("dig", "b", 9, "digestorio", "intdelgado", "Parte mais longa e enrolada: maior absorção de nutrientes.");
no("dig", "b", 10, "digestorio", "intgrosso", "Parte final: absorve água e forma as fezes.");
di("dig", "c", 8, "digestorio", "estomago", "A bolsa logo abaixo do esôfago.");
di("dig", "c", 10, "digestorio", "intgrosso", "O tubo mais grosso que contorna o abdome.");
// Respiratório
no("res", "b", 15, "respiratorio", "nariz", "Por onde o ar entra; filtra, aquece e umidifica.");
no("res", "b", 16, "respiratorio", "traqueia", "Tubo que conduz o ar da garganta aos brônquios.");
no("res", "b", 16, "respiratorio", "bronquios", "Onde a traqueia se divide para cada pulmão.");
no("res", "b", 16, "respiratorio", "pulmoes", "Órgãos onde ocorre a troca gasosa.");
no("res", "b", 16, "respiratorio", "diafragma", "Principal músculo da respiração, embaixo dos pulmões.");
di("res", "c", 16, "respiratorio", "pulmoes", "Os dois órgãos cheios de ramificações (a árvore brônquica).");
di("res", "c", 16, "respiratorio", "traqueia", "O tubo central, acima dos brônquios.");
// Urinário
no("res", "b", 3, "urinario", "rins", "Órgãos que filtram o sangue e formam a urina.");
no("res", "b", 3, "urinario", "ureteres", "Tubos que levam a urina dos rins à bexiga.");
no("res", "b", 3, "urinario", "bexiga", "Onde a urina fica armazenada.");
no("res", "b", 3, "urinario", "uretra", "Canal por onde a urina sai do corpo.");
di("res", "c", 3, "urinario", "rins", "Os dois órgãos em forma de feijão.");
di("res", "c", 3, "urinario", "bexiga", "A bolsa embaixo, que guarda a urina.");
// Reprodutor feminino (esquema ilustrativo)
no("rep", "b", 7, "repfem", "utero", "Órgão onde o embrião se implanta e o feto se desenvolve.");
no("rep", "b", 7, "repfem", "ovarios", "Produzem os óvulos e os hormônios femininos.");
no("rep", "b", 7, "repfem", "trompas", "Levam o óvulo e são o local da fecundação.");
no("rep", "b", 7, "repfem", "vagina", "Canal de parto e órgão de cópula.");
di("rep", "c", 7, "repfem", "utero", "O órgão central, em forma de pera.");
di("rep", "c", 12, "repfem", "trompas", "Os tubos que ligam o útero aos ovários.");
// Reprodutor masculino (esquema ilustrativo)
no("rep", "b", 3, "repmasc", "testiculo", "Produzem os espermatozoides e a testosterona.");
no("rep", "b", 3, "repmasc", "epididimo", "Onde o espermatozoide amadurece e fica armazenado.");
no("rep", "b", 3, "repmasc", "prostata", "Glândula que produz parte do fluido seminal.");
no("rep", "b", 3, "repmasc", "penis", "Órgão copulador e também de saída da urina.");
di("rep", "c", 4, "repmasc", "testiculo", "Os órgãos que produzem os espermatozoides.");
di("rep", "c", 3, "repmasc", "prostata", "A glândula logo abaixo da bexiga.");

/* ============ COMPLEMENTO — OSSOS (classificação) ============ */
m("oss", "b", 5, "Fêmur, tíbia e úmero, com comprimento bem maior que a largura, são ossos do tipo:", ["Osso longo", "Osso curto", "Osso plano", "Osso irregular"], "O osso longo tem um corpo alongado (diáfise) e duas pontas arredondadas (epífises).");

/* ============ COMPLEMENTO — SISTEMA NERVOSO ============ */
m("ner", "b", 3, "Quanto pesa, em média, o encéfalo de um adulto?", ["Cerca de 1,4 kg", "Cerca de 5 kg", "Cerca de 300 g", "Cerca de 10 kg"], "Fica dentro da caixa craniana e pesa por volta de 1,4 kg.");
v("ner", "c", 4, "O cérebro é dividido em dois hemisférios: o direito e o esquerdo.", true, "A superfície pregueada aumenta a área do córtex.");
pr("ner", "c", 9, "Tronco encefálico: ligue a parte à função", [["Mesencéfalo", "Coordena a contração muscular e a postura"], ["Ponte", "Mantém a postura, o equilíbrio e o tônus muscular"], ["Bulbo", "Controla batimentos, respiração e deglutição"]], "As três divisões do tronco são mesencéfalo, ponte e bulbo.");
or("ner", "c", 17, "Sentido do impulso nervoso dentro do neurônio", ["Dendrito", "Corpo celular", "Axônio"], "O estímulo entra pelo dendrito, passa pelo corpo celular e sai pelo axônio.");
m("ner", "c", 19, "O que é um gânglio nervoso?", ["Um aglomerado de corpos de neurônios fora do SNC", "Um osso do crânio", "Uma glândula do pescoço", "Uma das camadas das meninges"], "Fica no sistema nervoso periférico.");
m("ner", "b", 20, "Para que servem as terminações nervosas?", ["Captar estímulos como dor, tato, calor e pressão", "Bombear o sangue", "Produzir a urina", "Digerir o alimento"], "Elas levam a informação de volta ao sistema nervoso central.");
m("ner", "c", 26, "No sistema nervoso autônomo, qual substância as fibras pré-ganglionares liberam (tanto no simpático quanto no parassimpático)?", ["Acetilcolina", "Adrenalina", "Insulina", "Dopamina"], "A diferença está na fibra pós-ganglionar: o simpático usa adrenalina; o parassimpático, acetilcolina.");
m("ner", "b", 31, "Um arco reflexo simples precisa, no mínimo, de:", ["Dois neurônios (um sensitivo e um motor) e a medula", "Apenas do cérebro", "Três gânglios e o cerebelo", "Apenas de um nervo craniano"], "Por isso a resposta é rápida e não passa pelo encéfalo.");

/* ============ COMPLEMENTO — SISTEMA IMUNOLÓGICO ============ */
m("imu", "b", 6, "Qual célula de defesa apresenta os antígenos para ativar a resposta imune?", ["Célula dendrítica", "Hemácia", "Plaqueta", "Neurônio"], "A dendrítica é a principal apresentadora de antígenos.");
m("imu", "b", 6, "Qual célula elimina células do corpo infectadas ou alteradas, sem precisar de anticorpo?", ["Célula Natural Killer (NK)", "Linfócito B", "Plaqueta", "Hemácia"], "A NK faz parte da imunidade inata.");
m("imu", "c", 7, "Ao saírem do sangue para os tecidos, os monócitos se transformam em:", ["Macrófagos", "Hemácias", "Plaquetas", "Neurônios"], "Macrófago é o monócito dentro do tecido: fagocita e sinaliza.");
m("imu", "b", 9, "Qual célula, derivada do linfócito B, fabrica os anticorpos?", ["Plasmócito", "Neutrófilo", "Hemácia", "Macrófago"], "O linfócito B ativado vira plasmócito, uma fábrica de anticorpos.");
m("imu", "c", 3, "Qual tecido linfoide protege as mucosas (boca, intestino, vias respiratórias)?", ["MALT", "Medula óssea", "Timo", "Baço"], "MALT = tecido linfoide associado às mucosas.");
pr("imu", "c", 12, "Sistema complemento: ligue a ação ao efeito", [["Opsonização", "Marca o patógeno para ser fagocitado"], ["Inflamação", "Recruta mais células de defesa"], ["Lise", "Perfura a membrana e destrói o micróbio"]], "O complemento é uma cascata que amplifica a defesa.");
so("imu", "c", 18, "Classifique a doença do sistema imune", ["Autoimune", "Imunodeficiência", "Alérgica"], [["Lúpus", 0], ["Diabetes tipo 1", 0], ["Esclerose múltipla", 0], ["HIV/AIDS", 1], ["Alergias", 2], ["Rinite alérgica", 2]], "Autoimune ataca o próprio corpo; imunodeficiência enfraquece a defesa; alérgica é resposta exagerada.");
pr("imu", "c", 18, "Doença autoimune: ligue ao alvo que o corpo ataca por engano", [["Diabetes tipo 1", "Células beta do pâncreas (que fazem insulina)"], ["Esclerose múltipla", "Mielina dos nervos do SNC"], ["Artrite reumatoide", "Articulações"], ["Doença celíaca", "Intestino, em reação ao glúten"]], "Na autoimunidade, a defesa ataca estruturas do próprio corpo.");
v("imu", "c", 15, "No cuidado ao paciente imunocomprometido, higienizar as mãos é uma das principais formas de prevenir infecções.", true, "Mãos limpas cortam a transmissão de micróbios.");

const REVISAO = [];

if (typeof module !== "undefined") module.exports = { Q, SETORES, TRILHAS, REVISAO };
