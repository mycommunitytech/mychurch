/* «Для кожного в церкві» — дев'ять ролей великими плашками (як блок for-whom
   на головній): обличчя, коротка назва ролі й один рядок з i18n audience.roles.
   Ряди пливуть назустріч один одному — видно всіх, і ніхто не «головний». */
(function () {
  // Обличчя й кольори — ROLE_LOOKS і ROLE_ACCENTS з src/components/shared/role-icons.ts.
  const ROLES = [
    { name: "Пастор", line: "Бачить усю церкву", look: 3, c: "#007aff" },
    { name: "Лідер", line: "Своя група і явка за хвилину", look: 0, c: "#12a150" },
    { name: "Диякон", line: "Знає, кому потрібна допомога", look: 7, c: "#e11d48" },
    { name: "Служитель", line: "Свій графік у телефоні", look: 1, c: "#f59e0b" },
    { name: "Відвідувач", line: "Перший візит не загубиться", look: 5, c: "#0ea5e9" },
    { name: "Член церкви", line: "Події, група і своя картка", look: 0, c: "#f05b8b" },
    { name: "Адміністрація", line: "Оргструктура і запити", look: 1, c: "#8b5bf0" },
    { name: "Бухгалтер", line: "Кожна гривня на видноті", look: 3, c: "#0f766e" },
    { name: "Рецепція", line: "Прихід і гості за секунди", look: 5, c: "#f97316" },
  ];
  const PW = 560, GAP = 28;

  const plaque = (r, d) => `
<div class="pl a-scale" style="--c:${r.c};--d:${d}ms">
  ${TV.avatar(TV.LOOKS[r.look], 92)}
  <b>${r.name}</b>
  <span>${r.line}</span>
</div>`;

  // Ряд: плашки двічі поспіль, щоб рух не впирався в порожнечу.
  const row = (list, dir, d0, dist) => {
    const items = [...list, ...list].map((r, i) => plaque(r, d0 + Math.min(i, 4) * 70)).join("");
    return `<div class="row"><div class="track" style="--dist:${dist}px;animation-name:${dir}">${items}</div></div>`;
  };

  TV.scene({
    id: "roles",
    dur: 8600,
    bg: "light",
    css: `
[data-scene="roles"] .wrap { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; }
[data-scene="roles"] .head { text-align: center; margin-bottom: 70px; }
[data-scene="roles"] .t { font-size: 132px; }
[data-scene="roles"] .row { overflow: visible; margin: 0 0 ${GAP}px; height: 206px; }
[data-scene="roles"] .track { display: flex; gap: ${GAP}px; width: max-content; margin-left: 90px;
  animation: roles-l 8600ms linear 0ms both; }
@keyframes roles-l { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(calc(-1 * var(--dist)), 0, 0); } }
@keyframes roles-r { from { transform: translate3d(calc(-1 * var(--dist)), 0, 0); } to { transform: translate3d(0, 0, 0); } }
[data-scene="roles"] .pl { flex: none; width: ${PW}px; height: 206px; border-radius: 34px; padding: 30px 34px;
  display: grid; grid-template-columns: 92px 1fr; grid-template-rows: auto 1fr; column-gap: 24px; row-gap: 14px; align-content: start;
  background: linear-gradient(145deg, color-mix(in oklab, var(--c) 11%, #fff) 0%, color-mix(in oklab, var(--c) 4%, #fff) 50%, #fff 100%);
  box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--c) 22%, #fff), 0 20px 40px -26px color-mix(in oklab, var(--c) 60%, transparent); }
[data-scene="roles"] .pl .avatar { grid-row: 1 / span 2; box-shadow: 0 0 0 5px #fff, 0 0 0 7px color-mix(in oklab, var(--c) 30%, #fff); }
[data-scene="roles"] .pl b { align-self: end; font-size: 58px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin-top: 6px; white-space: nowrap; }
[data-scene="roles"] .pl span { font-size: 29px; font-weight: 550; color: var(--ink-2); line-height: 1.25; letter-spacing: -0.01em; }
[data-o="port"] [data-scene="roles"] .head { margin-bottom: 80px; padding: 0 60px; }
[data-o="port"] [data-scene="roles"] .t { font-size: 124px; }
[data-o="port"] [data-scene="roles"] .row { height: 236px; }
[data-o="port"] [data-scene="roles"] .pl { width: 620px; height: 236px; }
[data-o="port"] [data-scene="roles"] .pl b { font-size: 64px; }
[data-o="port"] [data-scene="roles"] .pl span { font-size: 32px; }
`,
    html: (o) => {
      const rows = o === "port"
        ? [ROLES.slice(0, 3), ROLES.slice(3, 6), ROLES.slice(6)]
        : [ROLES.slice(0, 5), ROLES.slice(5)];
      const title = o === "port" ? ["Для кожного", "в церкві"] : ["Для кожного в церкві"];
      return `
<div class="wrap">
  <div class="head">${TV.copy({ title, accent: "в церкві", d0: 100 })}</div>
  ${rows.map((r, i) => row(r, i % 2 ? "roles-r" : "roles-l", 450 + i * 120, o === "port" ? 700 : 900)).join("")}
</div>`;
    },
  });
})();
