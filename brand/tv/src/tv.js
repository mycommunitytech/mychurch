/* Плеєр петлі.
   Живий режим: сцени йдуть по черзі без кінця; тло наступної сцени, якщо воно
   іншого кольору, розкривається колом. Клавіші: → / ← — наступна / попередня,
   пробіл — пауза, F — на весь екран, O — альбом / портрет.
   Адреса: ?scene=people — крутити одну сцену; ?only=intro,people — добірка;
   без параметрів — основна добірка (TV.LISTS.main), ?list=all — усі сцени;
   ?o=port — примусово портрет; ?speed=0.7 — темп (1 — як задумано).
   Темп: уся петля грає повільніше за задумане (TV.SPEED в order.js, 2026-10-01:
   «на презентації не встигаєш»). Клавіші − / + міняють його на ходу, 0 — назад.
   Режим запису (?render=1): нічого не грає само, build.py кличе TVR.mount/seek. */
(function () {
  const TV = window.TV;
  const q = new URLSearchParams(location.search);
  const RENDER = q.has("render");
  const tv = document.getElementById("tv");
  if (RENDER) document.body.classList.add("render");

  // Темп петлі: 0.8 = на чверть повільніше, ніж у сценах записано.
  let speed = parseFloat(q.get("speed")) || TV.SPEED || 1;

  const order = (TV.ORDER || Object.keys(TV.scenes)).filter((id) => TV.scenes[id]);
  // Без параметрів грає основна добірка (TV.LISTS.main); ?list=all — усі сцени.
  const lists = TV.LISTS || {};
  let list = lists.main ? lists.main.filter((id) => TV.scenes[id]) : order;
  if (q.get("scene")) list = [q.get("scene")];
  else if (q.get("list") === "all") list = order;
  else if (q.get("list") && lists[q.get("list")]) list = lists[q.get("list")].filter((id) => TV.scenes[id]);
  else if (q.get("only")) list = q.get("only").split(",").filter((id) => TV.scenes[id]);

  // ─────────────────────────────── розмір і орієнтація
  let forced = q.get("o");
  let o = "land";
  function fit() {
    const w = innerWidth, h = innerHeight;
    const next = forced || (w / h < 0.9 ? "port" : "land");
    const [W, H] = next === "port" ? [1080, 1920] : [1920, 1080];
    tv.style.setProperty("--k", Math.min(w / W, h / H));
    const changed = next !== o;
    o = next;
    tv.dataset.o = o;
    return changed;
  }

  // ─────────────────────────────── монтаж сцени
  let cur = null; // { def, el, bleed, start, i }
  function bleedHTML(bg) {
    return `<div class="grid"></div><div class="glow g1"></div><div class="glow g2"></div>`;
  }
  function mount(id, prevBg) {
    const def = TV.scenes[id];
    tv.innerHTML = "";
    const under = document.createElement("div");
    under.className = "bleed bg-" + (prevBg || def.bg || "light");
    under.innerHTML = bleedHTML(prevBg);
    const bleed = document.createElement("div");
    bleed.className = "bleed bg-" + (def.bg || "light") + (prevBg && prevBg !== (def.bg || "light") ? " reveal" : "");
    bleed.innerHTML = bleedHTML(def.bg);
    const stage = document.createElement("div");
    stage.className = "stage";
    const el = document.createElement("section");
    el.className = "scene on-" + (def.bg || "light");
    el.dataset.scene = id;
    el.style.setProperty("--dur", def.dur + "ms");
    el.innerHTML = typeof def.html === "function" ? def.html(o) : def.html;
    // Бік екрана задає петля, а не сцена: сусідні сцени чергуються (TV.SIDE в order.js).
    const side = (TV.SIDE || {})[id];
    const split = el.querySelector(".split");
    if (side && split) split.classList.toggle("flip", side === "L");
    stage.appendChild(el);
    tv.append(under, bleed, stage);
    if (!document.getElementById("css-" + id) && def.css) {
      const st = document.createElement("style");
      st.id = "css-" + id;
      st.textContent = def.css;
      document.head.appendChild(st);
    }
    fitTitles(el);
    if (def.setup) def.setup(el, o);
    cur = { def, el, id };
    if (def.tick) def.tick(0, el, o);
    return cur;
  }

  // Довга назва модуля («Інвентаризація») не має вилазити за колонку:
  // кегль зменшується рівно настільки, щоб найдовше слово вмістилось.
  function fitTitles(el) {
    el.querySelectorAll(".t").forEach((h) => {
      for (let k = 0; k < 4 && h.scrollWidth > h.clientWidth + 1; k++) {
        const fs = parseFloat(getComputedStyle(h).fontSize);
        h.style.fontSize = Math.floor(fs * (h.clientWidth / h.scrollWidth) * 0.99) + "px";
      }
    });
  }

  // Поставити мить t (мс від старту сцени) — для запису кадрів.
  function seek(t) {
    for (const a of tv.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = t;
    }
    if (cur && cur.def.tick) cur.def.tick(t, cur.el, o);
  }

  window.TVR = {
    list: () => order.map((id) => ({ id, dur: TV.scenes[id].dur, bg: TV.scenes[id].bg || "light" })),
    mount: (id, prevBg, orient) => {
      forced = orient || forced;
      fit();
      mount(id, prevBg);
      seek(0);
      return true;
    },
    seek,
    speed: () => speed,
    ready: () => document.fonts.ready.then(() => true),
  };
  fit();
  if (RENDER) return;

  // ─────────────────────────────── живий режим
  let i = 0, t0 = 0, paused = false, pausedAt = 0;
  const hud = document.createElement("div");
  hud.id = "hud";
  const bar = document.createElement("div");
  bar.id = "progress";
  document.body.append(hud, bar);

  function play(n) {
    const prev = cur ? cur.def.bg || "light" : null;
    i = (n + list.length) % list.length;
    mount(list[i], list.length > 1 ? prev : null);
    tv.getAnimations({ subtree: true }).forEach((a) => { a.playbackRate = speed; });
    t0 = performance.now();
    paused = false;
    hud.textContent = `${i + 1}/${list.length} · ${list[i]} · ${o === "port" ? "портрет" : "альбом"} · темп ${speed.toFixed(2)} — ← → пробіл F O − +`;
  }
  function frame(now) {
    if (cur && !paused) {
      const t = (now - t0) * speed;
      if (cur.def.tick) cur.def.tick(t, cur.el, o);
      bar.style.width = (100 * Math.min(1, t / cur.def.dur)) + "%";
      if (t >= cur.def.dur) play(i + 1);
    }
    requestAnimationFrame(frame);
  }
  function setPaused(p) {
    if (!cur || p === paused) return;
    paused = p;
    const anims = tv.getAnimations({ subtree: true });
    if (p) { pausedAt = performance.now(); anims.forEach((a) => a.pause()); }
    else { t0 += performance.now() - pausedAt; anims.forEach((a) => a.play()); }
  }

  // Змінити темп, не перериваючи сцену: час сцени лишається тим самим.
  function setSpeed(v) {
    if (!cur) return;
    const now = performance.now();
    const t = ((paused ? pausedAt : now) - t0) * speed;
    speed = Math.min(1.5, Math.max(0.4, Math.round(v * 100) / 100));
    t0 = (paused ? pausedAt : now) - t / speed;
    tv.getAnimations({ subtree: true }).forEach((a) => { a.playbackRate = speed; });
    hud.textContent = hud.textContent.replace(/темп [\d.]+/, "темп " + speed.toFixed(2));
  }

  addEventListener("keydown", (e) => {
    if (e.key === "-" || e.key === "_") setSpeed(speed - 0.1);
    else if (e.key === "=" || e.key === "+") setSpeed(speed + 0.1);
    else if (e.key === "0") setSpeed(TV.SPEED || 1);
    else if (e.key === "ArrowRight") play(i + 1);
    else if (e.key === "ArrowLeft") play(i - 1);
    else if (e.key === " ") { e.preventDefault(); setPaused(!paused); }
    else if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
    } else if (e.key === "o" || e.key === "O" || e.key === "щ" || e.key === "Щ") {
      forced = o === "land" ? "port" : "land";
      fit();
      play(i);
    }
  });
  addEventListener("resize", () => { if (fit()) play(i); });
  // Один клік — на весь екран (браузер не дозволяє ввімкнути його без дії людини);
  // подвійний — вийти. Esc теж виходить.
  addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  });
  addEventListener("dblclick", () => {
    if (document.fullscreenElement) document.exitFullscreen();
  });

  // Курсор миші ховається за 2 с — на телевізорі його не має бути видно.
  let idle;
  const wake = () => {
    document.body.classList.remove("idle");
    clearTimeout(idle);
    idle = setTimeout(() => document.body.classList.add("idle"), 2000);
  };
  addEventListener("mousemove", wake);
  wake();

  // Екран ноутбука не має гаснути посеред петлі.
  async function keepAwake() {
    try { if ("wakeLock" in navigator) await navigator.wakeLock.request("screen"); } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) keepAwake(); });
  keepAwake();

  document.fonts.ready.then(() => {
    play(0);
    requestAnimationFrame(frame);
  });
})();
