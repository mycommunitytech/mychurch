/* Спільні шматки для сцен: обличчя, курсори, іконки, знак, слова з маскою,
   плавні криві для tick(). Жодних залежностей — усе рядками HTML. */
(function () {
  const TV = (window.TV = window.TV || {});
  TV.scenes = TV.scenes || {};
  TV.scene = (def) => { TV.scenes[def.id] = def; };

  // ───────────────────────────────────────── обличчя (як person-avatar.tsx)
  // Мальовані люди вигаданої церкви — жодних фото. Порядок той самий, що на сайті.
  const LOOKS = [
    { skin: "#f1c9a5", hair: "#3b2a1a", shirt: "#007aff", bg: "#dbeafe", style: "short", sex: "m" },
    { skin: "#e8b48f", hair: "#5a2d0c", shirt: "#f05b8b", bg: "#fde2ea", style: "long", sex: "f" },
    { skin: "#d9a066", hair: "#1f1f1f", shirt: "#12a150", bg: "#dcfce7", style: "curly", sex: "m" },
    { skin: "#f3d3b7", hair: "#8a5a2b", shirt: "#8b5bf0", bg: "#ede9fe", style: "short", sex: "m" },
    { skin: "#c68642", hair: "#2a1a0e", shirt: "#f59e0b", bg: "#fef3c7", style: "curly", sex: "f" },
    { skin: "#f6dcc4", hair: "#d9a441", shirt: "#0ea5e9", bg: "#e0f2fe", style: "long", sex: "f" },
    { skin: "#a3683f", hair: "#8c8c8c", shirt: "#ef4444", bg: "#fee2e2", style: "short", sex: "m" },
    { skin: "#ecc19c", hair: "#4a3320", shirt: "#14b8a6", bg: "#ccfbf1", style: "long", sex: "f" },
  ];
  TV.LOOKS = LOOKS;
  const MALE_ON_VOWEL = new Set(["микола", "павло", "данило", "марко", "ілля", "сава", "лука", "михайло"]);
  const TITLES = ["пастор", "лідер", "сестра", "брат", "родина", "команда"];
  TV.isFemale = (raw) => {
    const first = raw.trim().toLowerCase().split(/[\s,·]+/).filter((w) => !TITLES.includes(w))[0] || "";
    const name = first.replace(/[^а-яіїєґ']/g, "");
    if (!name || MALE_ON_VOWEL.has(name)) return false;
    return /[ая]$/.test(name);
  };
  TV.lookFor = (name) => {
    const pool = LOOKS.filter((l) => l.sex === (TV.isFemale(name) ? "f" : "m"));
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return pool[h % pool.length];
  };
  let uid = 0;
  // avatar("Олена", 64) або avatar(TV.LOOKS[2], 64)
  TV.avatar = (who, size = 56, extra = "") => {
    const l = typeof who === "string" ? TV.lookFor(who) : who;
    const id = "av" + ++uid;
    const long = l.style === "long"
      ? `<path d="M30 44 C30 22 40 17 50 17 C60 17 70 22 70 44 L73 78 L62 72 L60 42 C56 34 44 34 40 42 L38 72 L27 78 Z" fill="${l.hair}"/>` : "";
    const top = {
      short: `<path d="M32 40 C32 25 40 20 50 20 C60 20 68 25 68 40 C64 31 58 28 50 28 C42 28 36 31 32 40 Z" fill="${l.hair}"/>`,
      long: `<path d="M31 42 C31 24 40 19 50 19 C60 19 69 24 69 42 C65 32 58 29 50 29 C42 29 35 32 31 42 Z" fill="${l.hair}"/>`,
      curly: `<path d="M30 41 C28 22 40 16 50 17 C60 16 72 22 70 41 C68 32 61 27 50 27 C39 27 32 32 30 41 Z" fill="${l.hair}"/><circle cx="32" cy="34" r="5" fill="${l.hair}"/><circle cx="68" cy="34" r="5" fill="${l.hair}"/><circle cx="40" cy="24" r="5" fill="${l.hair}"/><circle cx="60" cy="24" r="5" fill="${l.hair}"/>`,
    }[l.style];
    return `<svg class="avatar" ${extra} width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><circle cx="50" cy="50" r="50" fill="${l.bg}"/><g clip-path="url(#${id})">${long}<path d="M14 104 C14 76 30 66 50 66 C70 66 86 76 86 104 Z" fill="${l.shirt}"/><rect x="42" y="50" width="16" height="18" rx="6" fill="${l.skin}"/><circle cx="50" cy="40" r="18" fill="${l.skin}"/>${top}<circle cx="44" cy="40" r="1.8" fill="#2b2118"/><circle cx="56" cy="40" r="1.8" fill="#2b2118"/><path d="M45 47 Q50 51 55 47" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></svg>`;
  };

  // ───────────────────────────────────────── іконки (контури lucide)
  // Словник TV.ICONS збирає `python3 brand/tv/build.py icons` з назв, які сцени
  // кличуть як TV.icon("назва"). Нова іконка = написати її тут і перезапустити.
  TV.icon = (name, size = 28, color = "currentColor", sw = 2) => {
    const body = (window.TV_ICONS || {})[name];
    if (!body) { console.warn("TV.icon: немає іконки", name); return ""; }
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  };

  // ───────────────────────────────────────── знак і словесний знак
  // Знак — з brand/gen.py: сім кружечків кільця і один поза ним (у вікні 100×100).
  TV.MARK = {
    ring: [[47.77, 21.52], [26.05, 30.52], [17.06, 52.23], [26.05, 73.95], [47.77, 82.94], [69.48, 73.95], [78.48, 52.23]],
    out: [82.94, 17.06],
    r: 11.06,
    d: "M41.31 30.50A11.06 11.06 0 1 0 36.85 19.75A2.76 2.76 0 0 1 32.51 21.55A11.06 11.06 0 0 0 17.08 36.98A2.76 2.76 0 0 1 15.28 41.32A11.06 11.06 0 0 0 15.28 63.15A2.76 2.76 0 0 1 17.08 67.49A11.06 11.06 0 0 0 32.51 82.92A2.76 2.76 0 0 1 36.85 84.72A11.06 11.06 0 0 0 58.68 84.72A2.76 2.76 0 0 1 63.02 82.92A11.06 11.06 0 0 0 78.45 67.49A2.76 2.76 0 0 1 80.25 63.15A11.06 11.06 0 1 0 69.50 58.69A2.76 2.76 0 0 1 67.70 63.04A11.06 11.06 0 0 0 58.57 72.17A2.76 2.76 0 0 1 54.23 73.97A11.06 11.06 0 0 0 41.31 73.97A2.76 2.76 0 0 1 36.96 72.17A11.06 11.06 0 0 0 27.83 63.04A2.76 2.76 0 0 1 26.03 58.69A11.06 11.06 0 0 0 26.03 45.77A2.76 2.76 0 0 1 27.83 41.43A11.06 11.06 0 0 0 36.96 32.30A2.76 2.76 0 0 1 41.31 30.50A11.06 11.06 0 0 0 41.31 30.50ZM71.89 17.06A11.06 11.06 0 1 0 94.00 17.06A11.06 11.06 0 1 0 71.89 17.06Z",
  };
  TV.mark = (size = 64, color = "var(--brand)") =>
    `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><path d="${TV.MARK.d}" fill="${color}"/></svg>`;
  // Словесний знак — контури з brand/out/social/lockup (TV_WORDMARK кладе build.py).
  // Кольори: .wm-a («Моя»), .wm-b («Церква»). Висота великої «М» = 100/129 висоти.
  TV.wordmark = (height = 80, a = "var(--brand)", b = "var(--ink)") =>
    (window.TV_WORDMARK || "")
      .replace("<svg ", `<svg class="wordmark" style="height:${height}px;width:auto;--wm-a:${a};--wm-b:${b}" `);

  // ───────────────────────────────────────── ассети (фото амбасадора)
  // У розробці — файли з public/, у зібраному tv.html — вбудовані data: URI.
  TV.asset = (p) => (window.TV_ASSETS && window.TV_ASSETS[p]) || "../../../public/" + p;

  // ───────────────────────────────────────── текст
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  TV.esc = esc;
  // Слова заголовка піднімаються з-під маски по черзі.
  // words("Малі групи", 200) → затримки 200, 270 … мс; cls — клас для всіх слів.
  TV.words = (text, d0 = 0, step = 70, cls = "") =>
    text.split(" ").map((w, i) => `<span class="w ${cls}"><span style="--d:${d0 + i * step}ms">${esc(w)}</span></span>`).join(" ");
  // Блок «заголовок + одне речення». title — рядок або масив рядків (кожен з нового рядка);
  // accent — слова, які фарбуються в синій (рядок, що точно є в title).
  TV.copy = ({ title, accent = "", line = "", d0 = 150, step = 70, extra = "" }) => {
    const lines = Array.isArray(title) ? title : [title];
    let i = 0;
    const html = lines.map((ln) => {
      const parts = ln.split(" ").map((w) => {
        const a = accent && accent.split(" ").includes(w) ? "acc" : "";
        return `<span class="w ${a}"><span style="--d:${d0 + i++ * step}ms">${esc(w)}</span></span>`;
      });
      return parts.join(" ");
    }).join("<br>");
    const s = line ? `<p class="s a-up" style="--d:${d0 + i * step + 280}ms">${esc(line)}</p>` : "";
    return `<div class="copy">${extra}<h1 class="t">${html}</h1>${s}</div>`;
  };

  // ───────────────────────────────────────── курсор людини
  // cursor("Олена", "#f05b8b") → HTML; рухати його в tick() через TV.place().
  const ARROW = "M4 2.2 17.4 13.1c.7.6.3 1.7-.6 1.8l-5.4.5a1 1 0 0 0-.8.6l-2.2 5a1 1 0 0 1-1.9-.2L3.3 3.2c-.2-.9.9-1.5 1.6-1z";
  TV.cursor = (name, color, id = "", role = "") => {
    const deep = `color-mix(in oklab, ${color} 80%, #04121f)`;
    return `<div class="cur" ${id ? `id="${id}"` : ""} style="opacity:0"><svg class="arrow" viewBox="0 0 22 24" fill="none"><path d="${ARROW}" fill="${color}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg><span class="cur-tag" style="background:${deep}">${TV.avatar(name, 38)}${esc(role || name)}</span></div>`;
  };

  // ───────────────────────────────────────── час і криві (для tick)
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  TV.clamp = clamp;
  // Кубічна Безьє як у CSS — щоб tick рухався тими самими кривими, що й keyframes.
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x, d = dx(t);
        if (Math.abs(e) < 1e-5) break;
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      return sy(clamp(t));
    };
  }
  TV.bezier = bezier;
  TV.ease = {
    emph: bezier(0.2, 0, 0, 1),
    decel: bezier(0.05, 0.7, 0.1, 1),
    accel: bezier(0.3, 0, 0.8, 0.15),
    inout: bezier(0.65, 0, 0.35, 1),
    spring: bezier(0.34, 1.56, 0.64, 1),
    linear: (x) => clamp(x),
  };
  // Частка шляху між t0 і t1 (мс) з кривою.
  TV.prog = (t, t0, t1, ease = TV.ease.emph) => ease(clamp((t - t0) / (t1 - t0)));
  TV.mix = (a, b, p) => a + (b - a) * p;
  // Лічильник: ціле число від a до b між t0 і t1.
  TV.count = (t, t0, t1, a, b, ease = TV.ease.emph) => Math.round(TV.mix(a, b, TV.prog(t, t0, t1, ease)));
  // Шлях за ключами [[мс, x, y], …]: між ключами — крива ease.
  TV.path = (t, keys, ease = TV.ease.inout) => {
    if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
    for (let i = 1; i < keys.length; i++) {
      const [t1, x1, y1] = keys[i];
      if (t <= t1) {
        const [t0, x0, y0] = keys[i - 1];
        const p = ease(clamp((t - t0) / (t1 - t0)));
        return { x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p };
      }
    }
    const k = keys[keys.length - 1];
    return { x: k[1], y: k[2] };
  };
  // Поставити курсор: шлях, поява/зникнення і натискання (масив мс кліків).
  // opts: { keys, show:[з, до], clicks:[мс…] }
  TV.moveCursor = (el, t, { keys, show, clicks = [] }) => {
    if (!el) return;
    const p = TV.path(t, keys);
    const fadeIn = TV.prog(t, show[0], show[0] + 260, TV.ease.decel);
    const fadeOut = 1 - TV.prog(t, show[1] - 260, show[1], TV.ease.accel);
    let press = 1;
    for (const c of clicks) {
      const dt = t - c;
      if (dt > -90 && dt < 170) press = Math.min(press, dt < 0 ? 1 - 0.22 * (1 + dt / 90) : 0.78 + 0.22 * (dt / 170));
    }
    el.style.opacity = String(Math.min(fadeIn, fadeOut));
    el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    const arrow = el.firstElementChild;
    if (arrow) arrow.style.transform = `scale(${press})`;
  };
  // Хвиля натискання в точці (x, y) у мить d — рендерити разом зі сценою.
  TV.tap = (x, y, d, color = "var(--brand)") =>
    `<span class="tap" style="left:${x}px;top:${y}px;--d:${d}ms;--c:${color}"></span>`;
})();
