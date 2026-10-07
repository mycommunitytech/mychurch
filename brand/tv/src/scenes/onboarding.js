/* Онбординг — шлях одного новенького (content/modules/activities.ts → onboarding:
   pipeline). Марія Іщенко проходить чотири етапи: «Перший візит» → «Знайомство» →
   «У групі» → «Член церкви». На кожному етапі система робить свій крок (pipeline.auto)
   і він лишається видно. Двічі картку переносить відповідальна Олена К., останній
   крок — статус «член церкви» — система робить сама.
   Альбом: етапи зліва направо; портрет: згори вниз. Рух картки — лише зсув, без
   масштабу й повороту, щоб текст лишався чітким. */
// icons: zap, check, user-plus
(function () {
  const C = "#7c5cf0";                                   // MODULE_ACCENTS.onboarding
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const MARIA = TV.LOOKS[5];
  const STAGES = [
    ["Перший візит", "Привітання в Telegram"],
    ["Знайомство", "Нагадування відповідальному"],
    ["У групі", "Нотатки лідеру групи"],
    ["Член церкви", "Шлях — в історії людини"],
  ];
  // ── час
  const ARR = 1000;                                      // картка з'являється (анкета через QR)
  const MV = [[3900, 4700], [7300, 8100], [10000, 10700]];  // два перенесення Олени і крок системи
  const AT = [ARR, MV[0][1], MV[1][1], MV[2][1]];        // прибуття на етап
  const AUTO = AT.map((t) => t + 300);                   // автоматичний крок етапу
  const MEMBER = AT[3], BANNER = MEMBER + 300;

  // ── геометрія: альбом — колонки, портрет — рядки
  const G = {
    land: (() => {
      const W = 900, LG = 12, LW = (W - LG * 3) / 4, CW = LW - 24, CH = 232;
      const x = (i) => i * (LW + LG);
      return {
        W, H: 800, CW, CH, vertical: false,
        lane: (i) => ({ left: x(i), top: 70, width: LW, height: 606 }),
        node: (i) => [x(i) + LW / 2, 118],
        name: (i) => ({ left: x(i), top: 152, width: LW, height: 34, textAlign: "center" }),
        card: (i) => [x(i) + 12, 206],
        auto: (i) => ({ left: x(i) + 8, top: 470, width: LW - 16, height: 192 }),
        grab: [CW - 34, 30],                             // правий верхній кут картки: бірка курсора — у сусідній порожній колонці
        banner: 704,
      };
    })(),
    port: (() => {
      const W = 880, RH = 206, RG = 14, CW = 296, CH = 186;
      const y = (i) => 70 + i * (RH + RG);
      return {
        W, H: 1060, CW, CH, vertical: true,
        lane: (i) => ({ left: 0, top: y(i), width: W, height: RH }),
        node: (i) => [46, y(i) + RH / 2],
        name: (i) => ({ left: 86, top: y(i) + RH / 2 - 17, width: 170, height: 34, textAlign: "left" }),
        card: (i) => [254, y(i) + 10],
        auto: (i) => ({ left: 564, top: y(i) + 14, width: 302, height: RH - 28 }),
        grab: [34, CH - 30],                             // лівий нижній кут: бірка — під карткою, у порожньому наступному рядку
        banner: 964,
      };
    })(),
  };
  const px = (o) => Object.entries(o).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${typeof v === "number" ? v + "px" : v}`).join(";");

  function geo(o) {
    const g = G[o];
    if (g.KEYS) return g;
    const tip = (i) => { const [cx, cy] = g.card(i); return [cx + g.grab[0] - 10, cy + g.grab[1] - 6]; };
    const away = g.vertical ? [20, 150] : [90, 170];     // звідки курсор підходить: з порожнього місця
    const k = (t, i, dx = 0, dy = 0) => [t, tip(i)[0] + dx, tip(i)[1] + dy];
    g.KEYS = [
      k(MV[0][0] - 700, 0, ...away),
      k(MV[0][0] - 40, 0), k(MV[0][1] - 40, 1), k(MV[0][1] + 460, 1, 16, 16),
      k(MV[1][0] - 700, 1, ...away),
      k(MV[1][0] - 40, 1), k(MV[1][1] - 40, 2), k(MV[1][1] + 460, 2, 16, 16),
    ];
    g.WIN = [[MV[0][0] - 700, MV[0][1] + 460], [MV[1][0] - 700, MV[1][1] + 460]];
    return g;
  }

  const S = '[data-scene="onboarding"]';
  TV.scene({
    id: "onboarding",
    dur: 14000,
    bg: "light",
    css: `
${S} .mock { position: relative; --vs: 1; --vs-port: 1.02; }
${S} .hd { position: absolute; left: 6px; top: 8px; height: 44px; display: flex; align-items: center; gap: 12px; font-size: 23px; font-weight: 600; color: var(--ink-3); }
${S} .lane { position: absolute; border-radius: 26px; background: var(--surface-3); }
${S} .lane .on { position: absolute; inset: 0; border-radius: 26px; background: ${tint(9)}; box-shadow: inset 0 0 0 2.5px ${tint(40)}; }
${S} .lane .on.ok { background: #eefaf2; box-shadow: inset 0 0 0 2.5px rgba(18,161,80,0.45); }
${S} .rail { position: absolute; z-index: 1; background: rgba(0,0,0,0.1); border-radius: 3px; }
${S} .rail i { position: absolute; inset: 0; border-radius: 3px; background: ${C}; animation: onb-rail var(--t) cubic-bezier(0.65, 0, 0.35, 1) var(--d) both; }
${S} .rail.h i { transform-origin: 0 50%; } ${S} .rail.v i { transform-origin: 50% 0; }
@keyframes onb-rail { from { transform: scale(var(--sx, 1), var(--sy, 1)); } }
${S} .node { position: absolute; z-index: 2; width: 50px; height: 50px; margin: -25px 0 0 -25px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 3px rgba(0,0,0,0.14);
  display: flex; align-items: center; justify-content: center; font-size: 23px; font-weight: 750; color: var(--ink-3); }
${S} .node .f { position: absolute; inset: 0; border-radius: 50%; background: ${C}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px #fff; }
${S} .node .f.ok { background: var(--green); }
${S} .sn { position: absolute; font-size: 25px; font-weight: 750; letter-spacing: -0.02em; line-height: 34px; white-space: nowrap; color: var(--ink); }
${S} .auto { position: absolute; border-radius: 20px; background: #fff; box-shadow: 0 0 0 2px ${tint(35)}, 0 14px 30px -18px rgba(60,30,160,0.45);
  display: flex; align-items: center; gap: 14px; padding: 0 16px; }
${S} .auto.col { flex-direction: column; justify-content: center; text-align: center; padding: 0 10px; gap: 14px; }
${S} .auto .zp { flex: none; width: 56px; height: 56px; border-radius: 50%; background: ${C}; display: flex; align-items: center; justify-content: center; }
${S} .auto .at { font-size: 22px; font-weight: 700; letter-spacing: -0.015em; line-height: 1.22; color: var(--ink); }
${S} .auto .ck { position: absolute; right: -10px; top: -10px; width: 38px; height: 38px; border-radius: 50%; background: var(--green);
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px #fff; }
${S} .me { position: absolute; z-index: 10; }
${S} .me .cd { position: absolute; inset: 0; border-radius: 22px; background: #fff; box-shadow: 0 0 0 3px ${C}, 0 18px 36px -16px rgba(60,30,160,0.5); }
${S} .me .cd.ok { box-shadow: 0 0 0 3px var(--green), 0 18px 36px -16px rgba(18,161,80,0.55); }
${S} .me .body { position: absolute; inset: 0; }
${S} .me .avatar { position: absolute; }
${S} .me .nm { position: absolute; font-size: 28px; font-weight: 750; letter-spacing: -0.02em; line-height: 34px; }
${S} .me .dots { position: absolute; display: flex; align-items: center; gap: 7px; }
${S} .me .dots i { width: 15px; height: 15px; border-radius: 50%; background: ${tint(24)}; }
${S} .me .dots span { margin-left: 6px; font-size: 21px; font-weight: 750; color: ${C}; white-space: nowrap; font-variant-numeric: tabular-nums; }
${S} .member { position: absolute; left: 50%; height: 80px; display: flex; align-items: center; gap: 16px; padding: 0 34px 0 12px; border-radius: 999px;
  background: var(--green); color: #fff; font-size: 30px; font-weight: 700; letter-spacing: -0.015em; white-space: nowrap; transform: translateX(-50%);
  box-shadow: 0 20px 40px -18px rgba(18,161,80,0.7); z-index: 12; }
${S} .member .avatar { box-shadow: 0 0 0 3px rgba(255,255,255,0.6); }
${S} .member.a-pop { animation-name: onb-member; }
@keyframes onb-member { from { opacity: 0; transform: translateX(-50%) scale(0.7); } }
`,
    html: (o) => {
      const g = geo(o);
      const lanes = STAGES.map(([name, auto], i) => {
        const last = i === 3;
        const [nx, ny] = g.node(i);
        const a = g.auto(i);
        return `
<div class="lane a-up" style="${px(g.lane(i))};--d:${420 + i * 90}ms"><span class="on ${last ? "ok" : ""} a-fade" style="--d:${AT[i]}ms"></span></div>
<span class="node a-pop" style="left:${nx}px;top:${ny}px;--d:${520 + i * 90}ms">${i + 1}<span class="f ${last ? "ok" : ""} a-pop" style="--d:${AT[i] + 60}ms">${TV.icon("check", 26, "#fff", 3.2)}</span></span>
<span class="sn a-fade" style="${px(g.name(i))};--d:${560 + i * 90}ms">${name}</span>
<div class="auto ${g.vertical ? "" : "col"} a-up" style="${px(a)};--d:${AUTO[i]}ms">
  <span class="zp">${TV.icon("zap", 28, "#fff", 2.4)}</span><span class="at">${auto}</span>
  <span class="ck a-pop" style="--d:${AUTO[i] + 260}ms">${TV.icon("check", 22, "#fff", 3.4)}</span>
</div>`;
      }).join("");
      // Рейка між вузлами: кожен відрізок заповнюється, поки картка їде.
      const rails = [0, 1, 2].map((i) => {
        const [x1, y1] = g.node(i), [x2, y2] = g.node(i + 1);
        const box = g.vertical ? { left: x1 - 3, top: y1, width: 6, height: y2 - y1 } : { left: x1, top: y1 - 3, width: x2 - x1, height: 6 };
        return `<span class="rail ${g.vertical ? "v" : "h"} a-fade" style="${px(box)};--d:500ms"><i style="${g.vertical ? "--sy:0" : "--sx:0"};--d:${MV[i][0]}ms;--t:${MV[i][1] - MV[i][0]}ms"></i></span>`;
      }).join("");
      const [cx, cy] = g.card(0);
      const card = g.vertical
        ? `${TV.avatar(MARIA, 88).replace("<svg ", '<svg style="left:18px;top:18px" ')}
           <span class="nm" style="left:124px;top:22px">Марія<br>Іщенко</span>
           <span class="dots" style="left:124px;top:128px">${"<i></i>".repeat(5)}<span class="st">1 з 5</span></span>`
        : `${TV.avatar(MARIA, 96).replace("<svg ", `<svg style="left:${(g.CW - 96) / 2}px;top:18px" `)}
           <span class="nm" style="left:0;right:0;top:122px;text-align:center">Марія<br>Іщенко</span>
           <span class="dots" style="left:0;right:0;justify-content:center;top:196px">${"<i></i>".repeat(5)}<span class="st">1 з 5</span></span>`;
      return `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: "Онбординг", line: "Новенький не губиться між першим візитом і членством." })}
  <div class="vis"><div class="mock" style="width:${g.W}px;height:${g.H}px">
    <div class="hd a-fade" style="--d:300ms">${TV.icon("user-plus", 26, "currentColor", 2.2)}12 новеньких за місяць</div>
    ${lanes}${rails}
    <div class="me" id="ob-me" style="left:${cx}px;top:${cy}px;width:${g.CW}px;height:${g.CH}px">
      <div class="a-pop" style="position:absolute;inset:0;--d:${ARR}ms">
        <span class="cd"></span><span class="cd ok a-fade" style="--d:${MEMBER}ms"></span>
        <div class="body">${card}</div>
      </div>
    </div>
    <div class="member a-pop" style="top:${g.banner}px;--d:${BANNER}ms">${TV.avatar(MARIA, 56)}Марія Іщенко — член церкви</div>
    ${[0, 1].map((m) => TV.tap(g.card(m)[0] + g.grab[0], g.card(m)[1] + g.grab[1], MV[m][0], "#f05b8b")
      + TV.tap(g.card(m + 1)[0] + g.grab[0], g.card(m + 1)[1] + g.grab[1], MV[m][1], "#f05b8b")).join("")}
    ${TV.cursor("Олена", "#f05b8b", "ob-cur", "Олена К.")}
  </div></div>
</div>`;
    },
    tick(t, el, o) {
      const g = geo(o);
      const cur = el.querySelector("#ob-cur");
      TV.moveCursor(cur, t, { keys: g.KEYS, show: [0, 1e9], clicks: [MV[0][0], MV[0][1], MV[1][0], MV[1][1]] });
      if (cur) cur.style.opacity = String(Math.max(...g.WIN.map(([a, z]) => Math.min(TV.prog(t, a, a + 260, TV.ease.decel), 1 - TV.prog(t, z - 300, z, TV.ease.accel)))));
      // Картка: між кліками їде за курсором; третій крок — сама, рівною кривою.
      const me = el.querySelector("#ob-me");
      if (me) {
        const [x0, y0] = g.card(0);
        let [x, y] = g.card(0);
        for (let m = 0; m < 3; m++) {
          const [a, b] = MV[m];
          if (t >= b) [x, y] = g.card(m + 1);
          else if (t > a) {
            if (m < 2) { const p = TV.path(Math.min(t, b - 40), g.KEYS); x = p.x + 10 - g.grab[0]; y = p.y + 6 - g.grab[1]; }
            else { const p = TV.prog(t, a, b, TV.ease.inout); const [ax, ay] = g.card(2), [bx, by] = g.card(3); x = TV.mix(ax, bx, p); y = TV.mix(ay, by, p); }
            break;
          }
        }
        me.style.transform = `translate(${Math.round(x - x0)}px, ${Math.round(y - y0)}px)`;
      }
      const step = t >= MEMBER ? 5 : t >= MV[1][1] ? 4 : t >= MV[0][1] ? 3 : 1;
      const st = el.querySelector("#ob-me .st");
      const s = `${step} з 5`;
      if (st && st.textContent !== s) st.textContent = s;
      if (st) st.style.color = step === 5 ? "var(--green)" : "";
      el.querySelectorAll("#ob-me .dots i").forEach((d, i) => {
        const bg = i < step ? (step === 5 ? "var(--green)" : C) : "";
        if (d.style.background !== bg) d.style.background = bg;
      });
    },
  });
})();
