/* Заставка: на синьому піднімаються «Моя» і «Церква» — словесний знак без
   жодного значка (2026-10-01: «не показуй М лого»), далі категорія. Плашки
   над знаком немає: «Ми досягаємо людей» власник назвав «тупо». Фінал петлі
   теж синій, тож шов між ними непомітний. */
(function () {
  TV.scene({
    id: "intro",
    dur: 5400,
    bg: "blue",
    css: `
[data-scene="intro"] .lock { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
[data-scene="intro"] .wordmark { overflow: hidden; display: block; }
/* Кожне слово знака — окремий контур; SVG сам обрізає все, що нижче рамки,
   тож слово виринає з-під краю, як заголовки решти сцен. */
[data-scene="intro"] .wp { animation: intro-word 1000ms var(--e-emph) var(--d) both; }
@keyframes intro-word { from { transform: translate(0, 150px); } }
[data-scene="intro"] .pos { margin-top: 30px; font-size: 48px; font-weight: 500; letter-spacing: -0.01em; color: rgba(255, 255, 255, 0.82); }
[data-scene="intro"] .pill { margin-bottom: 60px; font-size: 30px; background: rgba(255, 255, 255, 0.14); color: #fff; box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.28); }
[data-scene="intro"] .pill .dot { background: #fff; box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2); }
[data-o="port"] [data-scene="intro"] .pos { font-size: 46px; }
`,
    html: (o) => {
      let i = 0;
      const wm = TV.wordmark(o === "port" ? 140 : 168, "#fff", "#fff")
        .replace(/<path([^>]*)\/>/g, (m, a) => `<g class="wp" style="--d:${200 + 170 * i++}ms"><path${a}/></g>`);
      return `
<div class="lock">
  ${wm}
  <p class="pos a-up" style="--d:1150ms">Організація церковних процесів</p>
</div>`;
    },
  });
})();
