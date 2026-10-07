/* База знань — документи церкви з пошуком по тексту (tools.ts → knowledge: mock,
   features, steps). Тарас, новий служитель звуку, пише в пошук «ключ від звукової»:
   плитки, де цього немає, гаснуть, у потрібній підсвічується саме це місце в тексті.
   Клік — документ розгортається з плитки, фраза підкреслюється маркером, далі
   рядок версії й замки доступу: що бачить служіння звуку, що — лише команда. */
// icons: book-open, search, hand-heart, briefcase, calendar-days, user-plus, lock, globe, play, history, chevron-right, list-checks, file-text, users-round
(function () {
  const C = "#b45309";
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const W = 900, H = 880;
  const SB = 260;                                  // ширина бічної панелі
  const MX = SB + 24, MW = W - SB - 48;            // основна область
  const TW = (MW - 16) / 2, TH = 300, TY = 196;
  const tile = (k) => [MX + (k % 2) * (TW + 16), TY + Math.floor(k / 2) * (TH + 16)];

  const Q = "ключ від звукової";
  const T = { focus: 2100, t0: 2250, t1: 3250, dim: 2800, open: 4450, mark: 5750, ver: 6950, lock: 8150 };
  const OPEN_D = 820;
  const DOC = [SB + 12, 96, W - SB - 24, H - 96 - 12];   // куди розгортається документ

  const TYPES = {
    check: ["Чек-лист", "#12a150", "list-checks"], instr: ["Інструкція", "#0069e0", "file-text"],
    rule: ["Регламент", "#8b5bf0", "file-text"], lock: ["Обмежений", "#d97706", "lock"],
  };
  const DOCS = [
    { title: "Зустріч гостей у неділю", who: "Ірина Шевчук", type: "check" },
    { title: "Звуковий пульт: інструкція", who: "Дмитро Лис", type: "instr", hit: true },
    { title: "Правила волонтерів табору", who: "Наталя Рудь", type: "rule" },
    { title: "Політика захисту дітей", who: "лише команда", type: "lock" },
  ];
  const HIT = DOCS.findIndex((d) => d.hit);

  const paper = (d, k) => {
    const lines = [0.92, 0.7, 0.84, 0.55].map((w, i) => `<i class="ln" style="top:${58 + i * 22}px;width:${Math.round(w * (TW - 48))}px"></i>`).join("");
    const snip = d.hit ? `<span class="snip a-pop" style="--d:${T.dim + 200}ms"><mark>Ключ від звукової</mark></span>` : "";
    const [lab, col, ic] = TYPES[d.type];
    return `<div class="pap"><span class="ty" style="color:${col};background:color-mix(in oklab, ${col} 13%, #fff)">${TV.icon(ic, 18, "currentColor", 2.4)}${lab}</span>${lines}${snip}</div>`;
  };
  const tiles = () => DOCS.map((d, k) => {
    const [x, y] = tile(k);
    const dim = d.hit ? "" : ` kn-dim" style="--d:${T.dim + k * 40}ms`;
    return `<div class="tl a-up" style="left:${x}px;top:${y}px;--d:${560 + k * 80}ms"><div class="tli${dim}">
      ${paper(d, k)}
      <div class="tt">${TV.esc(d.title)}</div>
      <div class="ta">${d.type === "lock" ? TV.icon("lock", 18, "currentColor", 2.4) : ""}${TV.esc(d.who)}</div>
      ${d.hit ? `<i class="hitr" style="--d:${T.dim + 120}ms"></i>` : ""}
    </div></div>`;
  }).join("");

  const SECTIONS = [
    { icon: "hand-heart", name: "Служіння", sub: "служіння звуку", subIcon: "users-round" },
    { icon: "briefcase", name: "Команда", sub: "лише команда", subIcon: "lock" },
    { icon: "calendar-days", name: "Події" },
    { icon: "user-plus", name: "Для новеньких", sub: "вся церква", subIcon: "globe" },
  ];
  const side = () => SECTIONS.map((s, k) => `
    <div class="sc" style="top:${24 + k * 92}px">
      ${k === 0 ? `<i class="act a-fade" style="--d:${T.open + 300}ms"></i>` : ""}
      <span class="si">${TV.icon(s.icon, 24, "currentColor", 2.2)}</span><span class="sn">${s.name}</span>
      ${s.sub ? `<span class="ss a-pop" style="--d:${T.lock + (k === 1 ? 0 : k === 0 ? 120 : 240)}ms">${TV.icon(s.subIcon, 17, "currentColor", 2.4)}${s.sub}</span>` : ""}
    </div>`).join("");

  const doc = () => `
    <div class="doc" id="kn-doc">
      <div class="dci">
        <div class="crumb">Служіння ${TV.icon("chevron-right", 18, "currentColor", 2.4)} Служіння звуку</div>
        <div class="dt">Звуковий пульт: інструкція</div>
        <div class="meta">
          <span class="ty" style="color:#0069e0;background:color-mix(in oklab, #0069e0 13%, #fff)">${TV.icon("file-text", 18, "currentColor", 2.4)}Інструкція</span>
          <span class="ver a-left" style="--d:${T.ver}ms">${TV.icon("history", 20, "currentColor", 2.3)}змінив ${TV.avatar("Дмитро", 30)}<b>Дмитро Лис</b> · 2 тижні тому</span>
        </div>
        <span class="acc a-pop" style="--d:${T.lock}ms">${TV.icon("lock", 20, "currentColor", 2.4)}бачить служіння звуку</span>
        <div class="bd">
          <div class="h2"><span class="mk" style="--d:${T.mark}ms"></span><span class="hx">Ключ від звукової</span></div>
          <i class="ln2" style="width:92%"></i><i class="ln2" style="width:71%"></i>
          <div class="h2">Як увімкнути проєктор</div>
          <i class="ln2" style="width:86%"></i><i class="ln2" style="width:58%"></i>
          <div class="vid"><span class="vp">${TV.icon("play", 34, "#fff", 2.2)}</span></div>
          <div class="vc">Відео для нових служителів</div>
        </div>
      </div>
    </div>`;

  const [hx, hy] = tile(HIT);
  const CLICKS = [[T.focus, MX + MW - 180, 140], [T.open, hx + TW / 2 + 40, hy + 120]];

  TV.scene({
    id: "knowledge",
    dur: 11000,
    bg: "light",
    css: `
[data-scene="knowledge"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="knowledge"] .win { position: absolute; inset: 0; overflow: hidden; }
[data-scene="knowledge"] .top { position: absolute; left: 0; right: 0; top: 0; height: 84px; display: flex; align-items: center; gap: 14px; padding: 0 28px;
  border-bottom: 1px solid var(--hairline); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
[data-scene="knowledge"] .top .ic { color: ${C}; }
[data-scene="knowledge"] .top .n { font-size: 22px; font-weight: 500; color: var(--ink-3); letter-spacing: 0; }
[data-scene="knowledge"] .side { position: absolute; left: 0; top: 84px; bottom: 0; width: ${SB}px; background: var(--surface-2); border-right: 1px solid var(--hairline); }
[data-scene="knowledge"] .sc { position: absolute; left: 14px; right: 14px; height: 80px; }
[data-scene="knowledge"] .act { position: absolute; inset: 0; border-radius: 16px; background: ${tint(12)}; box-shadow: inset 0 0 0 2px ${tint(30)}; }
[data-scene="knowledge"] .si { position: absolute; left: 16px; top: 14px; color: ${C}; }
[data-scene="knowledge"] .sn { position: absolute; left: 54px; top: 11px; font-size: 23px; font-weight: 650; letter-spacing: -0.01em; white-space: nowrap; }
[data-scene="knowledge"] .ss { position: absolute; left: 54px; top: 44px; display: inline-flex; align-items: center; gap: 6px; font-size: 19px; font-weight: 600; color: ${C}; white-space: nowrap; }
[data-scene="knowledge"] .srch { position: absolute; left: ${MX}px; top: 106px; width: ${MW}px; height: 66px; border-radius: 18px; background: var(--surface-3);
  display: flex; align-items: center; gap: 14px; padding: 0 22px; color: var(--ink-3); }
[data-scene="knowledge"] .srch .ring { position: absolute; inset: 0; border-radius: 18px; box-shadow: inset 0 0 0 2.5px ${C}, 0 0 0 5px ${tint(18)}; opacity: 0; }
[data-scene="knowledge"] .srch .phx { position: absolute; left: 62px; font-size: 24px; font-weight: 500; color: rgba(11,11,15,0.38); }
[data-scene="knowledge"] .srch .q { position: relative; font-size: 25px; font-weight: 600; color: var(--ink); white-space: nowrap; display: flex; align-items: center; }
[data-scene="knowledge"] .caret { display: inline-block; width: 2.5px; height: 30px; margin-left: 2px; border-radius: 2px; background: ${C}; opacity: 0; }
[data-scene="knowledge"] .tl { position: absolute; width: ${TW}px; height: ${TH}px; }
[data-scene="knowledge"] .tli { position: absolute; inset: 0; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.07); overflow: hidden; }
[data-scene="knowledge"] .kn-dim { animation: kn-dim 520ms var(--e-emph) var(--d) both; }
@keyframes kn-dim { to { opacity: 0.25; transform: scale(0.97); } }
[data-scene="knowledge"] .hitr { position: absolute; inset: 0; border-radius: 20px; box-shadow: inset 0 0 0 3px ${C}, 0 18px 36px -16px ${tint(80)}; animation: a-fade 500ms var(--e-std) var(--d) both; }
[data-scene="knowledge"] .pap { position: absolute; left: 12px; right: 12px; top: 12px; height: 148px; border-radius: 12px; background: #fbf8f3; overflow: hidden; }
[data-scene="knowledge"] .ty { position: absolute; left: 12px; top: 12px; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px 0 9px; border-radius: 999px;
  font-size: 19px; font-weight: 650; white-space: nowrap; }
[data-scene="knowledge"] .ln { position: absolute; left: 16px; height: 9px; border-radius: 5px; background: rgba(11,11,15,0.1); }
[data-scene="knowledge"] .snip { position: absolute; left: 12px; top: 95px; }
[data-scene="knowledge"] mark { background: #fde68a; color: var(--ink); font-size: 21px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
[data-scene="knowledge"] .tt { position: absolute; left: 18px; right: 16px; top: 174px; font-size: 23px; font-weight: 700; line-height: 1.22; letter-spacing: -0.015em; }
[data-scene="knowledge"] .ta { position: absolute; left: 18px; bottom: 18px; display: flex; align-items: center; gap: 6px; font-size: 20px; font-weight: 500; color: var(--ink-3); }

[data-scene="knowledge"] .doc { position: absolute; left: 0; top: 0; border-radius: 22px; background: #fff; overflow: hidden; opacity: 0;
  box-shadow: 0 0 0 1px var(--hairline), 0 24px 60px -24px rgba(10,30,70,0.35); z-index: 5; }
[data-scene="knowledge"] .dci { position: absolute; left: 0; top: 0; width: ${DOC[2]}px; height: ${DOC[3]}px; opacity: 0; }
[data-scene="knowledge"] .crumb { position: absolute; left: 32px; top: 28px; display: flex; align-items: center; gap: 6px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="knowledge"] .dt { position: absolute; left: 32px; right: 32px; top: 62px; font-size: 34px; font-weight: 800; letter-spacing: -0.025em; }
[data-scene="knowledge"] .meta { position: absolute; left: 32px; right: 32px; top: 120px; height: 40px; display: flex; align-items: center; gap: 16px; }
[data-scene="knowledge"] .meta .ty { position: static; }
[data-scene="knowledge"] .ver { display: inline-flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="knowledge"] .ver b { color: var(--ink); font-weight: 650; }
[data-scene="knowledge"] .acc { position: absolute; left: 32px; top: 178px; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px 0 12px; border-radius: 999px;
  background: ${tint(12)}; color: ${C}; font-size: 20px; font-weight: 650; }
[data-scene="knowledge"] .bd { position: absolute; left: 32px; right: 32px; top: 244px; border-top: 1px solid var(--hairline); padding-top: 26px; display: flex; flex-direction: column; }
[data-scene="knowledge"] .h2 { position: relative; align-self: flex-start; font-size: 27px; font-weight: 750; letter-spacing: -0.015em; margin: 0 0 16px; padding: 0 6px; }
[data-scene="knowledge"] .h2 .hx { position: relative; }
[data-scene="knowledge"] .mk { position: absolute; left: 0; right: 0; top: 4px; bottom: 0; border-radius: 6px; background: #fde68a; transform-origin: 0 50%;
  animation: kn-mark 620ms var(--e-emph) var(--d) both; }
@keyframes kn-mark { from { transform: scaleX(0); } }
[data-scene="knowledge"] .ln2 { display: block; height: 11px; border-radius: 6px; background: rgba(11,11,15,0.09); margin: 0 0 14px 6px; }
[data-scene="knowledge"] .ln2 + .h2 { margin-top: 18px; }
[data-scene="knowledge"] .vid { margin: 22px 0 0 6px; width: 300px; height: 168px; border-radius: 16px; background: linear-gradient(135deg, #2a1d10, #5b3a17);
  display: flex; align-items: center; justify-content: center; }
[data-scene="knowledge"] .vp { width: 68px; height: 68px; border-radius: 50%; background: rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center; padding-left: 4px; }
[data-scene="knowledge"] .vc { margin: 12px 0 0 6px; font-size: 21px; font-weight: 600; color: var(--ink-2); }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "База знань", line: "Інструкції й документи лежать там, де їх знайдуть." })}
  <div class="vis"><div class="mock">
    <div class="win card a-rise" style="--d:250ms">
      <div class="top">${TV.icon("book-open", 30, "currentColor", 2.2)}База знань<span class="n">64 документи · 9 розділів</span></div>
      <div class="side">${side()}</div>
      <div class="srch">${TV.icon("search", 28, "currentColor", 2.4)}<span class="phx">Пошук по всьому</span><span class="q"><span class="qt"></span><i class="caret"></i></span><i class="ring"></i></div>
      ${tiles()}
      ${doc()}
    </div>
    ${CLICKS.map(([t, x, y]) => TV.tap(x, y, t, C)).join("")}
    ${TV.cursor("Тарас", C, "kn-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = Math.round(Q.length * TV.clamp((t - T.t0) / (T.t1 - T.t0)));
      const s = Q.slice(0, n);
      const q = el.querySelector(".qt");
      if (q && q.textContent !== s) q.textContent = s;
      const ph = el.querySelector(".phx");
      if (ph) ph.style.opacity = n ? "0" : "1";
      const focus = TV.prog(t, T.focus, T.focus + 160, TV.ease.decel) * (1 - TV.prog(t, T.open - 60, T.open + 120, TV.ease.accel));
      const ring = el.querySelector(".srch .ring");
      if (ring) ring.style.opacity = String(focus);
      const caret = el.querySelector(".caret");
      const blink = t < T.t1 + 40 ? 1 : (Math.floor((t - T.t1) / 420) % 2 ? 0 : 1);
      if (caret) caret.style.opacity = t >= T.focus && t < T.open ? String(blink) : "0";
      // Документ розгортається з плитки на всю робочу область (контейнерний перехід).
      const p = TV.prog(t, T.open + 40, T.open + 40 + OPEN_D, TV.ease.emph);
      const from = [hx, hy, TW, TH], b = from.map((v, k) => v + (DOC[k] - v) * p);
      const d = el.querySelector("#kn-doc");
      if (d) {
        d.style.left = b[0] + "px"; d.style.top = b[1] + "px";
        d.style.width = b[2] + "px"; d.style.height = b[3] + "px";
        d.style.opacity = String(TV.prog(t, T.open + 40, T.open + 200, TV.ease.linear));
        d.style.borderRadius = 20 + 2 * p + "px";
        const inner = d.firstElementChild;
        if (inner) inner.style.opacity = String(TV.prog(t, T.open + 40 + OPEN_D * 0.5, T.open + 40 + OPEN_D, TV.ease.decel));
      }
      const k = CLICKS.map(([ct, x, y]) => [ct, x - 10, y - 6]);
      TV.moveCursor(el.querySelector("#kn-cur"), t, {
        keys: [
          [T.focus - 760, k[0][1] + 60, k[0][2] + 520],
          [T.focus - 40, k[0][1], k[0][2]],
          [T.t1 + 200, k[0][1], k[0][2]],
          [T.open - 40, k[1][1], k[1][2]],
          [T.open + 160, k[1][1], k[1][2]],
          [T.open + 760, k[1][1] + 80, k[1][2] + 380],
        ],
        show: [T.focus - 760, T.open + 620],
        clicks: CLICKS.map((c) => c[0]),
      });
    },
  });
})();
