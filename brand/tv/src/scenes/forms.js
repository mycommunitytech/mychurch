/* Форми — анкета гостя з QR на вході (дані з tools.ts → forms: mock, pipeline).
   Марія сама заповнює анкету на своєму телефоні: текст друкується, галочка,
   «Надіслати». Відповіді злітають з полів і сідають у нову картку людини
   в базі; картка отримує статус «гість», тег і задачу «подзвонити до вівторка». */
// icons: users, phone, map-pin, lock, tag, clock, check, user
(function () {
  const C = "#7c3aed";
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const W = 900, H = 880;

  // Телефон: 390×844, екран із відступом 11. Координати полів — у системі екрана.
  const PX = 0, PY = 18, SX = PX + 11, SY = PY + 11;
  const F = {
    name: { y: 200, text: "Марія Іщенко", click: 1200, t0: 1260, t1: 1900 },
    phone: { y: 320, text: "+380 67 123 45 67", click: 2400, t0: 2460, t1: 3100 },
    group: { y: 440, text: "Так, на Півночі", click: 3600 },
    pray: { y: 546, text: "Про нову роботу", click: 4800, t0: 4860, t1: 5500 },
  };
  // Кожна дія — щонайменше 1,2 с після попередньої, щоб око встигало.
  const SUBMIT = 6000;
  const typed = ["name", "phone", "pray"];

  // Картка людини праворуч.
  const CX = 430, CY = 64, CW = 470;
  const LAND = SUBMIT + 80;      // старт першого польоту
  const FLY = 860, STEP = 90;
  const order = ["name", "phone", "group", "pray"];
  const arrive = (k) => LAND + order.indexOf(k) * STEP + FLY;
  // Куди сідає кожна відповідь (координати макета) і що там показуємо.
  const DEST = {
    name: [CX + 150, CY + 100],
    phone: [CX + 28, CY + 262],
    group: [CX + 46 + 207, CY + 382],
    pray: [CX + 46, CY + 540],
  };
  const SRCPT = (k) => [SX + 26, SY + F[k].y + (k === "group" ? 6 : 8)];

  function flyer(k) {
    const [dx, dy] = DEST[k];
    const [sx, sy] = SRCPT(k);
    const d = LAND + order.indexOf(k) * STEP;
    const text = k === "group" ? "Північ" : F[k].text;
    return `<span class="fx" style="left:${dx}px;top:${dy}px;--fx:${sx - dx}px;--d:${d}ms"><span class="fy" style="--fy:${sy - dy}px;--d:${d}ms"><span class="fh" style="--d:${d}ms"><span class="fo" style="--d:${d}ms">${TV.esc(text)}</span></span></span></span>`;
  }

  const field = (k, label, inner, h = 58) => `
    <div class="lbl" style="top:${F[k].y - 30}px">${label}</div>
    <div class="box" style="top:${F[k].y}px;height:${h}px">${inner}<i class="ring" data-f="${k}"></i></div>`;

  const phoneScreen = () => `
    <div class="form a-outf" style="--d:${SUBMIT + 80}ms">
      <div class="ph-h">Анкета гостя</div>
      <div class="ph-s">Перший візит · QR на вході</div>
      ${field("name", "Ім'я та прізвище", `<span class="val"><span class="ty" data-k="name"></span><i class="caret" data-c="name"></i></span>`)}
      ${field("phone", "Телефон", `<span class="val num"><span class="ty" data-k="phone"></span><i class="caret" data-c="phone"></i></span>`)}
      <div class="lbl" style="top:${F.group.y - 30}px">Хочу в малу групу</div>
      <div class="chk" style="top:${F.group.y + 4}px"><span class="cb"><span class="cb on a-pop" style="--d:${F.group.click + 40}ms">${TV.icon("check", 22, "#fff", 3.4)}</span></span>
        <span class="ct"><span class="a-outf" style="--d:${F.group.click + 40}ms">${F.group.text}</span><span class="on a-fade" style="--d:${F.group.click + 40}ms">${F.group.text}</span></span></div>
      ${field("pray", "Молитовна потреба", `<span class="val top"><span class="ty" data-k="pray"></span><i class="caret" data-c="pray"></i></span>`, 86)}
      <div class="send" style="top:724px">Надіслати</div>
    </div>
    <div class="ok">
      <span class="okc a-pop" style="--d:${SUBMIT + 900}ms">${TV.icon("check", 64, "#fff", 3.2)}</span>
      <span class="okt a-up" style="--d:${SUBMIT + 1000}ms">Надіслано</span>
      <span class="oks a-up" style="--d:${SUBMIT + 1080}ms">Анкета гостя</span>
    </div>`;

  // Слот картки: сіра смужка до прильоту, значення — в мить прильоту.
  const slot = (k, w, value, cls = "") => {
    const a = typeof k === "number" ? k : arrive(k);
    return `<span class="sk a-outf" style="width:${w}px;--d:${a - 80}ms"></span><span class="v ${cls} a-fade" style="--d:${a - 60}ms">${value}</span><i class="flash" style="--d:${a - 80}ms"></i>`;
  };

  const card = () => `
    <div class="pc card a-rise" style="left:${CX}px;top:${CY}px;width:${CW}px;--d:450ms">
      <div class="pc-h">${TV.icon("users", 26, "currentColor", 2.2)}<span>Люди</span>
        <span class="new a-pop" style="--d:${arrive("name") - 40}ms">${TV.icon("user", 20, "currentColor", 2.4)}Нова картка</span></div>
      <div class="av"><span class="av0 a-outf" style="--d:${arrive("name") - 60}ms">${TV.icon("user", 48, "rgba(11,11,15,0.28)", 2)}</span>
        <span class="av1 a-pop" style="--d:${arrive("name") - 60}ms">${TV.avatar("Марія", 104)}</span></div>
      <div class="nm">${slot("name", 230, "Марія Іщенко")}</div>
      <span class="st a-pop" style="--d:${arrive("name") + 160}ms">гість</span>
      <div class="lab" style="top:222px">${TV.icon("phone", 20, "currentColor", 2.2)}Телефон</div>
      <div class="pn">${slot("phone", 270, "+380 67 123 45 67")}</div>
      <div class="tile" style="left:28px;top:318px"><div class="lab">Звідки</div><div class="tv">${slot(arrive("name") + 240, 150, "QR на вході")}</div></div>
      <div class="tile" style="left:235px;top:318px"><div class="lab">${TV.icon("map-pin", 20, "currentColor", 2.2)}Мала група</div><div class="tv">${slot("group", 140, "Північ")}</div></div>
      <div class="note" style="top:474px"><div class="lab">Молитовна потреба<span class="lock">${TV.icon("lock", 18, "currentColor", 2.4)}лише пастор</span></div>
        <div class="tv big">${slot("pray", 220, "Про нову роботу")}</div></div>
      <div class="foot">
        <span class="tg a-pop" style="--d:${arrive("pray") + 150}ms">${TV.icon("tag", 20, "currentColor", 2.3)}анкета гостя</span>
        <span class="task a-pop" style="--d:${arrive("pray") + 380}ms">${TV.icon("clock", 20, "currentColor", 2.3)}подзвонити до вівторка</span>
      </div>
    </div>`;

  // Шлях курсора Марії: точки кліків на екрані телефона.
  const CLICKS = [
    [F.name.click, 300, F.name.y + 30],
    [F.phone.click, 300, F.phone.y + 30],
    [F.group.click, 42, F.group.y + 22],
    [F.pray.click, 300, F.pray.y + 40],
    [SUBMIT, 250, 756],
  ].map(([t, x, y]) => [t, SX + x, SY + y]);

  TV.scene({
    id: "forms",
    dur: 10000,
    bg: "light",
    css: `
[data-scene="forms"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="forms"] .phone { position: absolute; width: 390px; height: 844px; border-radius: 56px; background: #0b0b0f;
  box-shadow: inset 0 0 0 2px #2c2c33, var(--shadow-card); }
[data-scene="forms"] .scr { position: absolute; inset: 11px; border-radius: 46px; background: #fff; overflow: hidden; }
[data-scene="forms"] .island { position: absolute; left: 50%; top: 12px; width: 116px; height: 34px; margin-left: -58px; border-radius: 20px; background: #0b0b0f; }
[data-scene="forms"] .home { position: absolute; left: 50%; bottom: 9px; width: 132px; height: 5px; margin-left: -66px; border-radius: 3px; background: rgba(0,0,0,0.78); }
[data-scene="forms"] .form { position: absolute; inset: 0; }
[data-scene="forms"] .ph-h { position: absolute; left: 26px; top: 72px; font-size: 32px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="forms"] .ph-s { position: absolute; left: 26px; top: 116px; font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="forms"] .lbl { position: absolute; left: 26px; font-size: 20px; font-weight: 550; color: var(--ink-2); }
[data-scene="forms"] .box { position: absolute; left: 26px; right: 26px; border-radius: 14px; background: #f7f6fb; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08); }
[data-scene="forms"] .ring { position: absolute; inset: 0; border-radius: 14px; box-shadow: inset 0 0 0 2.5px ${C}, 0 0 0 5px ${tint(18)}; opacity: 0; }
[data-scene="forms"] .val { position: absolute; left: 18px; right: 44px; top: 0; height: 58px; display: flex; align-items: center; white-space: nowrap;
  font-size: 23px; font-weight: 550; letter-spacing: -0.01em; }
[data-scene="forms"] .val.top { top: 14px; height: 32px; align-items: center; }
[data-scene="forms"] .val.num { font-variant-numeric: tabular-nums; }
[data-scene="forms"] .val.ph { color: rgba(11,11,15,0.35); }
[data-scene="forms"] .caret { display: inline-block; width: 2.5px; height: 28px; margin-left: 2px; background: ${C}; border-radius: 2px; opacity: 0; }
[data-scene="forms"] .chev { position: absolute; right: 16px; top: 16px; color: var(--ink-3); }
[data-scene="forms"] .chk { position: absolute; left: 26px; right: 26px; height: 44px; display: flex; align-items: center; gap: 14px; }
[data-scene="forms"] .cb { position: relative; flex: none; width: 34px; height: 34px; border-radius: 10px; background: #fff; box-shadow: inset 0 0 0 2.5px rgba(0,0,0,0.2); }
[data-scene="forms"] .cb.on { position: absolute; inset: 0; background: ${C}; box-shadow: none; display: flex; align-items: center; justify-content: center; }
[data-scene="forms"] .ct { position: relative; font-size: 22px; font-weight: 550; color: var(--ink-3); white-space: nowrap; }
[data-scene="forms"] .ct .on { position: absolute; left: 0; top: 0; color: var(--ink); }
[data-scene="forms"] .send { position: absolute; left: 26px; right: 26px; height: 64px; border-radius: 18px; background: ${C}; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 650; }
[data-scene="forms"] .ok { position: absolute; left: 0; right: 0; top: 270px; display: flex; flex-direction: column; align-items: center; }
[data-scene="forms"] .okc { width: 128px; height: 128px; border-radius: 50%; background: ${C}; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 14px ${tint(14)}; }
[data-scene="forms"] .okt { margin-top: 40px; font-size: 34px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="forms"] .oks { margin-top: 8px; font-size: 22px; font-weight: 500; color: var(--ink-3); }

[data-scene="forms"] .pc { position: absolute; height: 752px; }
[data-scene="forms"] .pc-h { position: absolute; left: 0; right: 0; top: 0; height: 72px; padding: 0 22px 0 28px; display: flex; align-items: center; gap: 12px;
  border-bottom: 1px solid var(--hairline); font-size: 26px; font-weight: 650; color: var(--ink); }
[data-scene="forms"] .pc-h .ic { color: ${C}; }
[data-scene="forms"] .new { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px 0 12px; border-radius: 999px;
  background: ${tint(14)}; color: ${C}; font-size: 20px; font-weight: 650; }
[data-scene="forms"] .av { position: absolute; left: 28px; top: 96px; width: 104px; height: 104px; }
[data-scene="forms"] .av0 { position: absolute; inset: 0; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; }
[data-scene="forms"] .av1 { position: absolute; inset: 0; }
[data-scene="forms"] .nm { position: absolute; left: 150px; top: 100px; height: 40px; width: 300px; }
[data-scene="forms"] .st { position: absolute; left: 150px; top: 152px; height: 36px; padding: 0 16px; border-radius: 999px; background: ${C}; color: #fff;
  display: inline-flex; align-items: center; font-size: 20px; font-weight: 650; }
[data-scene="forms"] .sk { position: absolute; left: 0; top: 50%; height: 22px; margin-top: -11px; border-radius: 8px; background: var(--surface-3); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04); }
[data-scene="forms"] .v { position: absolute; left: 0; top: 0; bottom: 0; display: flex; align-items: center; white-space: nowrap; }
[data-scene="forms"] .nm .v { font-size: 30px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="forms"] .flash { position: absolute; left: -12px; top: -6px; right: -12px; bottom: -6px; border-radius: 12px; background: ${tint(16)}; z-index: -1;
  animation: forms-flash 1100ms var(--e-std) var(--d) both; }
@keyframes forms-flash { 0% { opacity: 0; } 18% { opacity: 1; } 100% { opacity: 0; } }
[data-scene="forms"] .lab { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="forms"] .pc > .lab { position: absolute; left: 28px; }
[data-scene="forms"] .pn { position: absolute; left: 28px; top: 252px; height: 44px; width: 400px; }
[data-scene="forms"] .pn .v { font-size: 30px; font-weight: 650; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
[data-scene="forms"] .tile { position: absolute; width: 199px; height: 140px; border-radius: 20px; background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.07); padding: 18px; }
[data-scene="forms"] .tile .lab { gap: 6px; }
[data-scene="forms"] .tv { position: relative; margin-top: 14px; height: 60px; isolation: isolate; }
[data-scene="forms"] .tile .v { font-size: 23px; font-weight: 650; line-height: 1.2; white-space: normal; align-items: flex-start; }
[data-scene="forms"] .tile .sk { top: 14px; }
[data-scene="forms"] .note { position: absolute; left: 28px; right: 28px; height: 132px; border-radius: 20px; padding: 18px 20px; background: ${tint(7)};
  box-shadow: inset 0 0 0 2px ${tint(22)}; }
[data-scene="forms"] .note .lock { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; color: ${C}; font-weight: 600; }
[data-scene="forms"] .note .tv { height: 44px; }
[data-scene="forms"] .note .v { font-size: 27px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="forms"] .nm, [data-scene="forms"] .pn { isolation: isolate; }
[data-scene="forms"] .foot { position: absolute; left: 28px; right: 28px; top: 630px; display: flex; flex-wrap: wrap; gap: 12px; }
[data-scene="forms"] .tg, [data-scene="forms"] .task { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px 0 14px; border-radius: 999px;
  font-size: 21px; font-weight: 600; white-space: nowrap; }
[data-scene="forms"] .tg { background: ${tint(12)}; color: ${C}; }
[data-scene="forms"] .task { background: var(--amber-soft); color: #a16207; }

/* Політ відповіді: X і Y їдуть різними кривими, «горб» піднімає, прозорість гасне на посадці. */
[data-scene="forms"] .fx { position: absolute; z-index: 20; animation: forms-fx ${FLY}ms cubic-bezier(0.55, 0, 0.25, 1) var(--d) both; }
[data-scene="forms"] .fy { display: block; animation: forms-fy ${FLY}ms cubic-bezier(0.45, 0, 0.2, 1) var(--d) both; }
[data-scene="forms"] .fh { display: block; animation: forms-fh ${FLY}ms ease-in-out var(--d) both; }
[data-scene="forms"] .fo { display: block; white-space: nowrap; padding: 8px 16px; border-radius: 14px; background: ${C}; color: #fff;
  font-size: 22px; font-weight: 650; box-shadow: 0 14px 30px -10px ${tint(70)}; animation: forms-fo ${FLY}ms linear var(--d) both; }
@keyframes forms-fx { from { transform: translateX(var(--fx)); } }
@keyframes forms-fy { from { transform: translateY(var(--fy)); } }
@keyframes forms-fh { 0% { transform: translateY(0); } 45% { transform: translateY(-60px); } 100% { transform: translateY(0); } }
@keyframes forms-fo { 0% { opacity: 0; transform: scale(0.9); } 12% { opacity: 1; transform: scale(1.05); } 82% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.94); } }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Форми", line: "Анкета одразу в базі — нічого не переносити руками." })}
  <div class="vis"><div class="mock">
    <div class="phone a-rise" style="left:${PX}px;top:${PY}px;--d:300ms"><div class="scr">${phoneScreen()}<i class="island"></i><i class="home"></i></div></div>
    ${card()}
    ${order.map(flyer).join("")}
    ${CLICKS.map(([t, x, y]) => TV.tap(x, y, t, C)).join("")}
    ${TV.cursor("Марія", C, "fm-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      for (const k of typed) {
        const f = F[k];
        const n = Math.round(f.text.length * TV.clamp((t - f.t0) / (f.t1 - f.t0)));
        const s = f.text.slice(0, n);
        const ty = el.querySelector(`[data-k="${k}"]`);
        if (ty && ty.textContent !== s) ty.textContent = s;
        const c = el.querySelector(`[data-c="${k}"]`);
        const next = CLICKS.find((c2) => c2[0] > f.click + 1);
        const end = next ? next[0] : SUBMIT;
        const on = t >= f.click && t < end;
        const blink = t < f.t1 + 40 ? 1 : (Math.floor((t - f.t1) / 420) % 2 ? 0 : 1);
        if (c) c.style.opacity = on ? String(blink) : "0";
      }
      // Рамка фокуса — на полі, по якому клікнули, до наступного кліку.
      el.querySelectorAll(".ring").forEach((r) => {
        const f = F[r.dataset.f];
        const next = CLICKS.find((c2) => c2[0] > f.click + 1);
        const end = next ? next[0] : SUBMIT;
        const a = TV.prog(t, f.click, f.click + 160, TV.ease.decel) * (1 - TV.prog(t, end - 40, end + 120, TV.ease.accel));
        r.style.opacity = String(a);
      });
      // Курсор стоїть біля поля, поки текст друкується, і рушає до наступного перед кліком.
      const keys = [[CLICKS[0][0] - 640, SX + 330, SY + 440]];
      CLICKS.forEach(([ct, x, y], i) => {
        if (i) { const [pt, px, py] = CLICKS[i - 1]; keys.push([Math.max(pt + 80, ct - 480), px - 10, py - 6]); }
        keys.push([ct - 40, x - 10, y - 6]);
      });
      keys.push([SUBMIT + 160, CLICKS[CLICKS.length - 1][1] - 10, CLICKS[CLICKS.length - 1][2] - 6]);
      keys.push([SUBMIT + 720, SX + 330, SY + 860]);
      TV.moveCursor(el.querySelector("#fm-cur"), t, {
        keys,
        show: [CLICKS[0][0] - 640, SUBMIT + 560],
        clicks: CLICKS.map((c) => c[0]),
      });
    },
  });
})();
