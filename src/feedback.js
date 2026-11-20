// Avaliação + contador de uso anônimo. Arquivo-mestre: apps-enfermagem-feedback/feedback.js
// Copiado para src/feedback.js de cada app; o build troca __APP__ pelo código do app.
(function () {
  var APP = "__APP__";
  var SERVIDOR = "https://apps-enfermagem.forjadoleao.workers.dev";
  var MINUTOS_ATE_PEDIR = 5;          // tempo de uso ativo antes do popup
  var PARADO = 120;                   // sem tocar na tela por 2 min = não conta tempo
  var K = "fbk." + APP;

  var S;
  try { S = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { S = {}; }
  if (!S.dev) S.dev = (Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12));
  S.dias = S.dias || {};
  function salvar() { try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) {} }
  function hoje() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function diaAtual() { var h = hoje(); return S.dias[h] || (S.dias[h] = { s: 0, a: 0 }); }
  function totalSeg() { var t = 0; for (var k in S.dias) t += S.dias[k].s || 0; return t; }

  // Guarda só os últimos 45 dias.
  var limite = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
  for (var k in S.dias) if (k < limite) delete S.dias[k];
  diaAtual().a++;
  salvar();

  // ---- tempo de uso ----
  var ultimoToque = Date.now();
  ["pointerdown", "keydown", "touchstart", "scroll", "wheel"].forEach(function (ev) {
    addEventListener(ev, function () { ultimoToque = Date.now(); }, { passive: true, capture: true });
  });
  var tique = 0;
  setInterval(function () {
    if (document.visibilityState !== "visible" || Date.now() - ultimoToque > PARADO * 1000) return;
    diaAtual().s++;
    tique++;
    if (tique % 10 === 0) salvar();
    if (tique % 60 === 0) enviar();
    if (!S.resp && !aberto && totalSeg() >= MINUTOS_ATE_PEDIR * 60) abrir();
  }, 1000);

  function enviar() {
    salvar();
    if (navigator.onLine === false) return;
    var corpo = JSON.stringify({ app: APP, dev: S.dev, dias: S.dias });
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon(SERVIDOR + "/u", corpo)))
        fetch(SERVIDOR + "/u", { method: "POST", body: corpo, keepalive: true }).catch(function () {});
    } catch (e) {}
    if (S.pend) mandarAvaliacao();
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") enviar(); });
  addEventListener("pagehide", enviar);
  addEventListener("online", enviar);
  setTimeout(enviar, 3000);

  function mandarAvaliacao() {
    if (!S.pend || navigator.onLine === false) return;
    var p = S.pend;
    fetch(SERVIDOR + "/f", { method: "POST", body: JSON.stringify(p) })
      .then(function (r) { if (r.ok && S.pend === p) { S.pend = null; salvar(); } })
      .catch(function () {});
  }

  // ---- popup ----
  var aberto = false;
  var CSS = "" +
    ".fbk-fundo{position:fixed;inset:0;z-index:2147483000;background:rgba(15,18,24,.62);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;animation:fbkIn .25s ease}" +
    ".fbk-caixa{background:#fff;color:#1f2328;width:100%;max-width:380px;border-radius:20px;padding:22px 20px 18px;box-shadow:0 20px 50px rgba(0,0,0,.3);max-height:calc(100vh - 32px);overflow-y:auto;animation:fbkSobe .3s ease}" +
    ".fbk-caixa h2{margin:0 0 4px;font-size:21px;line-height:1.25;text-align:center}" +
    ".fbk-caixa p{margin:0 0 14px;color:#5f6368;font-size:14.5px;text-align:center;line-height:1.4}" +
    ".fbk-est{display:flex;justify-content:center;gap:6px;margin:4px 0 4px}" +
    ".fbk-est button{all:unset;cursor:pointer;font-size:40px;line-height:1;color:#dadce0;transition:transform .12s,color .12s;padding:2px}" +
    ".fbk-est button.on{color:#f4b400}.fbk-est button:active{transform:scale(1.25)}" +
    ".fbk-rot{text-align:center;font-size:13px;color:#5f6368;min-height:18px;margin-bottom:12px}" +
    ".fbk-caixa label{display:block;font-size:13px;font-weight:600;margin:0 0 5px;color:#3c4043}" +
    ".fbk-caixa textarea,.fbk-caixa input{width:100%;box-sizing:border-box;border:1.5px solid #dadce0;border-radius:12px;padding:11px 12px;font:inherit;font-size:16px;color:#1f2328;background:#fff;outline:none;margin:0 0 4px}" +
    ".fbk-caixa textarea{resize:none;height:92px}" +
    ".fbk-caixa textarea:focus,.fbk-caixa input:focus{border-color:#16a2a0;box-shadow:0 0 0 3px rgba(22,162,160,.15)}" +
    ".fbk-cont{text-align:right;font-size:11.5px;color:#80868b;margin-bottom:10px}" +
    ".fbk-priv{font-size:11.5px;color:#80868b;margin:2px 0 12px}" +
    ".fbk-erro{color:#c5221f;font-size:13px;min-height:18px;margin:0 0 8px;text-align:center}" +
    ".fbk-btn{all:unset;box-sizing:border-box;display:block;width:100%;text-align:center;cursor:pointer;background:#16a2a0;color:#fff;font-weight:700;font-size:16px;padding:14px;border-radius:999px}" +
    ".fbk-btn:active{filter:brightness(.92)}" +
    ".fbk-ok{text-align:center;padding:8px 4px 4px}.fbk-ok .fbk-ic{font-size:54px;margin-bottom:6px}" +
    "@keyframes fbkIn{from{opacity:0}}@keyframes fbkSobe{from{transform:translateY(24px);opacity:0}}" +
    "@media (prefers-color-scheme:dark){.fbk-caixa{background:#202124;color:#e8eaed}.fbk-caixa p,.fbk-rot{color:#bdc1c6}.fbk-caixa label{color:#e8eaed}" +
    ".fbk-caixa textarea,.fbk-caixa input{background:#2b2c2f;color:#e8eaed;border-color:#5f6368}.fbk-est button{color:#5f6368}.fbk-est button.on{color:#fdd663}}";
  var ROTULOS = ["", "Ruim", "Pode melhorar", "Bom", "Muito bom", "Excelente!"];

  function abrir() {
    aberto = true;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var fundo = document.createElement("div");
    fundo.className = "fbk-fundo";
    fundo.setAttribute("role", "dialog"); fundo.setAttribute("aria-modal", "true");
    fundo.innerHTML =
      '<div class="fbk-caixa">' +
      '<h2>Gostou do app?</h2><p>Ajude-nos a melhor atender você.</p>' +
      '<div class="fbk-est" aria-label="Nota de 1 a 5 estrelas">' +
      [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-n="' + n + '" aria-label="' + n + ' estrela' + (n > 1 ? "s" : "") + '">★</button>'; }).join("") +
      '</div><div class="fbk-rot">Toque nas estrelas</div>' +
      '<label for="fbk-txt">Sua sugestão</label>' +
      '<textarea id="fbk-txt" maxlength="500" placeholder="Conte o que achou e o que podemos melhorar"></textarea>' +
      '<div class="fbk-cont">0/500</div>' +
      '<label for="fbk-mail">Seu melhor e-mail</label>' +
      '<input id="fbk-mail" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com">' +
      '<div class="fbk-priv">Usamos seu e-mail só para responder a sua sugestão.</div>' +
      '<div class="fbk-erro"></div>' +
      '<button type="button" class="fbk-btn">Enviar avaliação</button></div>';
    document.body.appendChild(fundo);
    // Bloqueia o app por trás até responder.
    fundo.addEventListener("keydown", function (e) { if (e.key === "Escape") e.preventDefault(); });

    var nota = 0, $ = function (s) { return fundo.querySelector(s); };
    var botoes = fundo.querySelectorAll(".fbk-est button");
    function pinta(n) { for (var i = 0; i < 5; i++) botoes[i].classList.toggle("on", i < n); $(".fbk-rot").textContent = n ? ROTULOS[n] : "Toque nas estrelas"; }
    for (var i = 0; i < 5; i++) botoes[i].addEventListener("click", function () { nota = +this.getAttribute("data-n"); pinta(nota); $(".fbk-erro").textContent = ""; });
    $("#fbk-txt").addEventListener("input", function () { $(".fbk-cont").textContent = this.value.length + "/500"; });

    $(".fbk-btn").addEventListener("click", function () {
      var texto = $("#fbk-txt").value.trim(), email = $("#fbk-mail").value.trim();
      var erro = !nota ? "Escolha de 1 a 5 estrelas." :
        texto.length < 3 ? "Escreva sua sugestão." :
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Digite um e-mail válido." : "";
      if (erro) { $(".fbk-erro").textContent = erro; return; }
      S.resp = true;
      S.pend = { app: APP, dev: S.dev, estrelas: nota, texto: texto, email: email };
      salvar();
      mandarAvaliacao();
      $(".fbk-caixa").innerHTML =
        '<div class="fbk-ok"><div class="fbk-ic">💚</div><h2>Muito obrigado!</h2>' +
        '<p>Sua opinião ajuda a deixar o app cada vez melhor para você e para toda a turma.</p>' +
        '<button type="button" class="fbk-btn">Continuar estudando</button></div>';
      $(".fbk-btn").addEventListener("click", function () { fundo.remove(); aberto = false; });
    });
  }

  // Para testar: abra o app com #avaliar no fim do link.
  if (location.hash === "#avaliar") setTimeout(abrir, 300);
})();
