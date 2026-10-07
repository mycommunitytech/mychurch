/* Інвентаризація — чотири великі речі й троє людей (дані: src/content/modules/resources.ts →
   inventory.mock: проєктор у Андрія, мікрофон у Дмитра, ноутбук для трансляції в Ірини,
   намет на складі). Адміністратор перетягує проєктор на картку Андрія — у картці
   з'являється «Проєктор · повернути до сб», плитка — «Видано: Андрій», на руках 8 → 9.
   П'ятниця — нагадування в Telegram. Субота — проєктор летить назад на свою плитку:
   «На складі ✓ Повернуто», на руках знову 8. */
// icons: send, check, clock, calendar
(function () {
  const W = 880, H = 910;
  const CUR = "#7c3aed";                           // курсор адміністратора
  const TW = 430, TH = 270, GAP = 20, TY0 = 100;
  const tilePos = (i) => ({ x: (i % 2) * (TW + GAP), y: TY0 + Math.floor(i / 2) * (TH + GAP) });
  const PY = 690, PW = 280, PB = 120, PG = 100;    // картки людей: верх, ширина, висота, приріст

  // Мить за миттю: кожен стан тримається ≥ 1,5 с.
  const IN = 1500, GRAB = 2250, DROP = 3400, FRI = 5500, TG = 5700, SAT = 7400, RET = 7700, LAND = 8500;
  const DUR = 11500;
  const AWAY_D = SAT + 450 - (TG - 300);            // скільки Олена й Марко поступаються місцем

  // ───── ілюстрації (300×190), пласкі й великі
  const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="168" rx="${rx}" ry="10" fill="rgba(15,23,42,0.08)"/>`;
  const ART = {
    projector: `${shadow(170, 112)}
      <polygon points="92,92 8,44 8,164 92,122" fill="rgba(250,204,21,0.28)"/>
      <rect x="70" y="60" width="206" height="96" rx="24" fill="#cbd5e1"/>
      <rect x="82" y="66" width="182" height="20" rx="10" fill="#e2e8f0"/>
      <circle cx="120" cy="110" r="32" fill="#334155"/><circle cx="120" cy="110" r="19" fill="#0f172a"/><circle cx="113" cy="103" r="7" fill="#93c5fd"/>
      <rect x="196" y="100" width="56" height="6" rx="3" fill="#94a3b8"/><rect x="196" y="114" width="56" height="6" rx="3" fill="#94a3b8"/><rect x="196" y="128" width="56" height="6" rx="3" fill="#94a3b8"/>
      <circle cx="254" cy="80" r="5" fill="#22c55e"/>
      <rect x="92" y="152" width="18" height="10" rx="3" fill="#64748b"/><rect x="236" y="152" width="18" height="10" rx="3" fill="#64748b"/>`,
    mics: shadow(150, 118) + [66, 122, 178, 234].map((x) => `
      <circle cx="${x}" cy="52" r="24" fill="#475569"/><circle cx="${x}" cy="52" r="17" fill="none" stroke="#94a3b8" stroke-width="3"/>
      <path d="M${x - 17} 52h34M${x} 35v34" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="${x - 15}" y="76" width="30" height="9" rx="3" fill="#1e293b"/>
      <path d="M${x - 12} 85 L${x - 7} 160 Q${x} 166 ${x + 7} 160 L${x + 12} 85 Z" fill="#1f2937"/>
      <rect x="${x - 3}" y="108" width="6" height="14" rx="3" fill="#64748b"/>`).join(""),
    laptop: `${shadow(150, 124)}
      <rect x="66" y="18" width="168" height="116" rx="12" fill="#1f2937"/>
      <rect x="77" y="29" width="146" height="94" rx="5" fill="#3b82f6"/>
      <rect x="86" y="37" width="36" height="16" rx="5" fill="#ef4444"/><circle cx="94" cy="45" r="3.5" fill="#fff"/>
      <path d="M140 60 L170 77 L140 94 Z" fill="#fff"/>
      <path d="M44 136 H256 L270 156 H30 Z" fill="#cbd5e1"/><rect x="128" y="136" width="44" height="7" rx="3" fill="#94a3b8"/>`,
    tent: `${shadow(150, 128)}
      <path d="M150 20 L140 6 M150 20 L160 6" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
      <polygon points="150,22 268,160 32,160" fill="#14b8a6"/>
      <polygon points="150,22 268,160 150,160" fill="#0d9488"/>
      <polygon points="150,70 190,160 110,160" fill="#134e4a"/>
      <path d="M22 160 H278" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`,
  };
  const AW = 221, AH = 140;                          // розмір ілюстрації на плитці
  const art = (k, cls = "art", extra = "") => `<svg class="${cls}" ${extra} viewBox="0 0 300 190" aria-hidden="true">${ART[k]}</svg>`;

  const ITEMS = [
    { k: "projector", name: "Проєктор" },
    { k: "mics", name: "Мікрофони ×4", who: "Дмитро" },
    { k: "laptop", name: "Ноутбук для трансляції", who: "Ірина" },
    { k: "tent", name: "Намет" },
  ];
  const out = (who, extra = "") => `<span class="st out">${TV.avatar(who, 32)}Видано${extra}</span>`;
  const inStock = `<span class="st in">На складі</span>`;

  // Плитка проєктора: три стани підпису шаром один над одним.
  const projChips = `
    <span class="cl"><span class="a-outf" style="--d:${DROP}ms">${inStock}</span></span>
    <span class="cl"><span class="a-outf" style="--d:${LAND}ms"><span class="a-pop" style="--d:${DROP + 60}ms">${out("Андрій", ": Андрій")}</span></span></span>
    <span class="cl"><span class="a-pop" style="--d:${LAND + 60}ms">${inStock}<span class="ok">${TV.icon("check", 24, "#fff", 3)}Повернуто</span></span></span>`;

  const tiles = ITEMS.map((it, i) => {
    const p = tilePos(i);
    const chips = i === 0 ? projChips : `<span class="cl">${it.who ? out(it.who) : inStock}</span>`;
    return `<div class="tile a-up" style="left:${p.x}px;top:${p.y}px;--d:${420 + i * 90}ms">
      ${art(it.k, "art", i === 0 ? `id="inv-art"` : "")}<b class="nm">${it.name}</b><div class="chips">${chips}</div></div>`;
  }).join("");

  const PEOPLE = ["Андрій", "Олена", "Марко"];
  const people = PEOPLE.map((n, i) => `
    <div class="pp a-up" style="left:${i * (PW + GAP)}px;--d:${760 + i * 90}ms"><div class="pc${i ? " away" : ""}" ${i === 0 ? `id="inv-card"` : ""}>
      <div class="ph">${TV.avatar(n, 72)}<b>${n}</b></div>
      ${i === 0 ? `<div class="line" id="inv-line"><div class="l1">${art("projector", "mini", `id="inv-mini"`)}<b>Проєктор</b></div>
        <span class="due">${TV.icon("clock", 22, "currentColor", 2.4)}повернути до сб</span></div>` : ""}
    </div></div>`).join("");

  // Точки руху (координати макета).
  const A0 = { x: AW / 2 + (TW - AW) / 2, y: TY0 + 14 + AH / 2 };     // центр ілюстрації на плитці
  const CARD = { x: PW / 2, y: PY + 62 };                            // куди кидаємо
  const MINI = { x: 18 + 30, y: PY + PB + 18 };                      // міні-проєктор у картці
  const cur = (x, y) => [x - 10, y - 6];
  const keys = [[IN, 1000, 900], [GRAB - 50, ...cur(A0.x, A0.y)], [GRAB + 100, ...cur(A0.x, A0.y)], [DROP - 50, ...cur(CARD.x, CARD.y)], [DROP + 100, ...cur(CARD.x, CARD.y)], [DROP + 650, 620, 980]];

  const day = (text, dIn, dOut) => {
    const inn = `<span class="dt ${dIn ? "a-up" : ""}" style="--d:${dIn}ms">${text}</span>`;
    return `<span class="dl">${dOut ? `<span class="a-outf" style="--d:${dOut}ms">${inn}</span>` : inn}</span>`;
  };

  const X = `[data-scene="inventory"]`;
  TV.scene({
    id: "inventory",
    dur: DUR,
    bg: "light",
    css: `
${X} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 0.98; --vs-port: 1.02; }
${X} .hd { position: absolute; left: 0; right: 0; top: 0; height: 80px; display: flex; align-items: center; }
${X} .ttl b { display: block; font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
${X} .ttl span { display: block; margin-top: 4px; font-size: 22px; font-weight: 550; color: var(--ink-3); }
${X} .day { margin-left: auto; position: relative; height: 64px; width: 136px; border-radius: 999px; background: #fff;
  box-shadow: 0 0 0 1.5px var(--hairline-strong); display: flex; align-items: center; padding-left: 22px; gap: 10px; color: var(--ink-2); }
${X} .dl { position: absolute; left: 64px; top: 0; height: 64px; display: flex; align-items: center; }
${X} .dt { display: block; font-size: 30px; font-weight: 750; color: var(--ink); }
${X} .cnt { margin-left: 16px; height: 64px; border-radius: 999px; background: var(--brand-soft); display: flex; align-items: center; gap: 12px; padding: 0 26px;
  font-size: 24px; font-weight: 600; color: var(--brand-deep); white-space: nowrap; }
${X} .cnt b { display: inline-block; font-size: 42px; font-weight: 800; color: var(--brand); font-variant-numeric: tabular-nums; animation: inv-bump 520ms var(--e-spring) var(--d) both; }
${X} .cnt .bw { display: inline-block; animation: inv-bump 520ms var(--e-spring) var(--d) both; }
@keyframes inv-bump { 40% { transform: scale(1.3); } }
${X} .tile { position: absolute; width: ${TW}px; height: ${TH}px; border-radius: 28px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card); }
${X} .art { position: absolute; left: ${(TW - AW) / 2}px; top: 14px; width: ${AW}px; height: ${AH}px; }
${X} .nm { position: absolute; left: 26px; right: 16px; top: 164px; font-size: 28px; font-weight: 750; letter-spacing: -0.02em; white-space: nowrap; }
${X} .chips { position: absolute; left: 26px; top: 208px; height: 46px; }
${X} .cl { position: absolute; left: 0; top: 0; white-space: nowrap; }
${X} .cl > span { display: inline-flex; gap: 10px; }
${X} .st, ${X} .ok { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 20px; border-radius: 999px; font-size: 24px; font-weight: 700; white-space: nowrap; }
${X} .st.in { background: var(--green-soft); color: #0f7a3d; }
${X} .st.out { background: var(--brand-soft); color: var(--brand-deep); padding-left: 7px; }
${X} .ok { background: var(--green); color: #fff; padding-left: 14px; }
${X} .pp { position: absolute; top: ${PY}px; width: ${PW}px; }
${X} .pc { position: relative; height: ${PB}px; border-radius: 26px; background: #fff; overflow: hidden; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card); }
${X} .ph { position: absolute; left: 18px; top: 24px; display: flex; align-items: center; gap: 16px; }
${X} .ph b { font-size: 30px; font-weight: 750; letter-spacing: -0.02em; }
${X} .line { position: absolute; left: 18px; right: 14px; top: ${PB}px; opacity: 0; }
${X} .l1 { display: flex; align-items: center; gap: 10px; }
${X} .l1 b { font-size: 26px; font-weight: 750; letter-spacing: -0.015em; }
${X} .mini { width: 60px; height: 38px; }
${X} .due { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; height: 40px; padding: 0 14px 0 10px; border-radius: 999px;
  background: var(--amber-soft); color: #b45309; font-size: 22px; font-weight: 700; white-space: nowrap; }
${X} .fly { position: absolute; left: 0; top: 0; width: ${AW}px; height: ${AH}px; margin: -${AH / 2}px 0 0 -${AW / 2}px; z-index: 25; opacity: 0;
  filter: drop-shadow(0 18px 24px rgba(15, 23, 42, 0.25)); }
/* П'ятниця: Олена й Марко на мить гаснуть — на їхньому місці стоїть нагадування, текст не налазить на текст. */
${X} .pc.away { animation: inv-away ${AWAY_D}ms linear ${TG - 300}ms both; }
@keyframes inv-away { 0% { opacity: 1; } ${(300 / AWAY_D * 100).toFixed(2)}% { opacity: 0; } ${((SAT + 150 - (TG - 300)) / AWAY_D * 100).toFixed(2)}% { opacity: 0; } 100% { opacity: 1; } }
${X} .tg { position: absolute; left: ${PW + GAP}px; top: ${PY - 2}px; z-index: 15; }
${X} .tg > div > div { position: relative; display: flex; align-items: center; gap: 20px; padding: 22px 30px 22px 22px; border-radius: 32px; background: #fff;
  box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop); }
${X} .tg > div > div::before { content: ""; position: absolute; left: -9px; top: 50%; width: 20px; height: 20px; margin-top: -10px; background: #fff; transform: rotate(45deg);
  box-shadow: -1px 1px 0 0 var(--hairline); }
${X} .tg .ico { flex: none; width: 72px; height: 72px; border-radius: 50%; background: #229ed9; display: flex; align-items: center; justify-content: center; }
${X} .tg .tx { display: flex; flex-direction: column; gap: 6px; }
${X} .tg .tx span { font-size: 22px; font-weight: 600; color: var(--ink-3); }
${X} .tg .tx b { font-size: 31px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Інвентаризація" })}
  <div class="vis"><div class="mock">
    <div class="hd a-up" style="--d:300ms">
      <div class="ttl"><b>Обладнання</b><span>146 предметів</span></div>
      <div class="day">${TV.icon("calendar", 28, "currentColor", 2.2)}${day("Чт", 0, FRI)}${day("Пт", FRI, SAT)}${day("Сб", SAT, 0)}</div>
      <div class="cnt">На руках<span class="bw" style="--d:${LAND}ms"><b class="n" style="--d:${DROP + 100}ms">8</b></span></div>
    </div>
    ${tiles}
    ${people}
    <div class="tg"><div class="a-out" style="--d:${SAT}ms"><div class="a-up" style="--d:${TG}ms">
      <span class="ico">${TV.icon("send", 34, "#fff", 2.2)}</span>
      <span class="tx"><span>Telegram · нагадування</span><b>Завтра повернути проєктор</b></span>
    </div></div></div>
    ${art("projector", "fly", `id="inv-fly"`)}
    ${TV.tap(A0.x, A0.y, GRAB, CUR)}${TV.tap(CARD.x, CARD.y, DROP, CUR)}
    ${TV.cursor("Оксана", CUR, "inv-c", "Адміністратор")}
  </div></div>
</div>`,
    tick(t, el) {
      const P = TV.prog, mix = TV.mix;
      const n = el.querySelector(".n"), v = String(t >= DROP + 100 && t < LAND ? 9 : 8);
      if (n && n.textContent !== v) n.textContent = v;

      // Плитка проєктора сіріє, поки він на руках.
      const g = P(t, GRAB, GRAB + 250) - P(t, LAND - 100, LAND + 200);
      const a = el.querySelector("#inv-art");
      if (a) a.style.filter = `grayscale(${g}) opacity(${1 - 0.65 * g})`;

      // Картка Андрія виростає на рядок «Проєктор · повернути до сб».
      const grow = P(t, DROP + 50, DROP + 450) - P(t, RET, RET + 400);
      const card = el.querySelector("#inv-card");
      if (card) card.style.height = `${PB + PG * grow}px`;
      const line = el.querySelector("#inv-line");
      if (line) line.style.opacity = String(grow);
      const mini = el.querySelector("#inv-mini");
      if (mini) mini.style.opacity = String(P(t, DROP + 250, DROP + 450) - P(t, RET, RET + 80));

      // Великий проєктор: їде під курсором, у картці стискається; у суботу летить назад.
      const fly = el.querySelector("#inv-fly");
      if (fly) {
        let x = A0.x, y = A0.y, s = 1, r = 0, o = 0;
        if (t >= GRAB && t < DROP) {
          const c = TV.path(t, keys); x = c.x + 10; y = c.y + 6;
          const lift = P(t, GRAB, GRAB + 250); s = 1 + 0.3 * lift; r = -5 * lift; o = 1;
        } else if (t >= DROP && t < DROP + 450) {
          const k = P(t, DROP, DROP + 400);
          x = mix(CARD.x, MINI.x, k); y = mix(CARD.y, MINI.y, k); s = mix(1.3, 60 / AW, k); r = -5 * (1 - k);
          o = 1 - P(t, DROP + 250, DROP + 450);
        } else if (t >= RET && t < LAND + 150) {
          const k = P(t, RET, LAND, TV.ease.inout);
          x = mix(MINI.x, A0.x, k); y = mix(MINI.y, A0.y, k) - 140 * Math.sin(Math.PI * k); s = mix(60 / AW, 1, k);
          o = Math.min(P(t, RET, RET + 120), 1 - P(t, LAND, LAND + 150));
        }
        fly.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
        fly.style.opacity = String(o);
      }

      TV.moveCursor(el.querySelector("#inv-c"), t, { keys, show: [IN, DROP + 680], clicks: [GRAB, DROP] });
    },
  });
})();
