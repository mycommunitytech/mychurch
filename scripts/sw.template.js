/* Сервіс-воркер сайту — «кеш на сайт».
   ─────────────────────────────────────────────────────────────────
   Це шаблон: scripts/sw.mjs після `next build` вписує сюди версію та
   список файлів сторінки /offline/ і кладе готовий sw.js у корінь
   експорту (.static/sw.js). Реєструє воркер
   src/components/shared/service-worker.tsx — лише в production-збірці.

   Що робить:
     • сторінки (HTML) — спершу мережа, щоб після заливки нової збірки
       всі одразу бачили свіжу; не відповіла за 4 с або впала — остання
       збережена копія цієї сторінки, а якщо її нема — сторінка /offline/;
     • дані для переходів між сторінками (…/index.txt та __next.*.txt,
       які Next тягне замість повного HTML) — так само: мережа, потім кеш;
     • /_next/static/* (js, css, шрифти — у назві хеш, вміст не міняється)
       — з кешу, у мережу лише за новим;
     • картинки й іконки з public/ — з кешу одразу, а свіжа копія
       довантажується у фоні на наступний раз;
     • демо-відео (/clips/, по 8–12 МБ) і PDF не чіпає: вони б з'їли
       квоту, а відео браузер і так тягне шматками (Range).

   Чого не робить: не чіпає POST (заявки йдуть у CRM і lead.php напряму),
   чужих доменів (Firebase Analytics, YouTube) і файлів для роботів
   (robots.txt, sitemap.xml, llms.txt) — їм кеш ні до чого.

   Оновлення: хостинг віддає sw.js із кешем на 30 днів, як і всю статику,
   але браузер перевіряє сам файл воркера повз HTTP-кеш (updateViaCache:
   "none" при реєстрації). Нова збірка = новий текст файла (версія й список
   усередині), тож воркер оновлюється разом із сайтом і одразу стає чинним.
   Стара оболонка зникає на активації; кеш сторінок і картинок живе далі —
   поки мережа є, сторінки все одно беруться з неї.

   Подивитись, що відбувається: DevTools → Application → Service Workers
   (і Cache Storage поруч); там же — прапорець Offline для перевірки. */

/* global self, caches, fetch, Response, AbortController, URL, setTimeout, clearTimeout */

const VERSION = "__VERSION__";

/* Сторінка /offline/ разом зі своїми js/css/шрифтами — щоб вона відкрилась
   навіть у перший офлайн. Список вписує scripts/sw.mjs зі збірки. */
const PRECACHE_URLS = __PRECACHE__;

const SHELL_CACHE = `mychurch-shell-${VERSION}`;
const PAGES_CACHE = "mychurch-pages-v1";
const ASSETS_CACHE = "mychurch-assets-v1";

const OFFLINE_URL = "/offline/";
/* Скільки чекати мережу на сторінку, перш ніж віддати копію з кешу. */
const NETWORK_TIMEOUT_MS = 4000;
/* Межі, після яких найстаріші записи прибираються — щоб кеш не ріс вічно. */
const PAGES_MAX = 120;
const ASSETS_MAX = 250;

/* ── Установлення й активація ─────────────────────────────────────────── */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      /* Не чекати, поки закриють усі вкладки зі старим воркером. */
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith("mychurch-shell-") && name !== SHELL_CACHE)
            .map((name) => caches.delete(name)),
        ),
      )
      /* Узяти під контроль уже відкриті вкладки, а не лише наступні. */
      .then(() => self.clients.claim()),
  );
});

/* ── Маршрутизація запитів ────────────────────────────────────────────── */

/* Дані для переходу між сторінками: Next у статичному експорті просить
   `<шлях>/index.txt` (уся сторінка) або `<шлях>/__next.<сегмент>.txt`
   (шматок для попереднього завантаження). */
const isPayload = (path) => path.endsWith("/index.txt") || /\/__next\.[^/]+\.txt$/.test(path);

/* Важке й одноразове — не для кешу. */
const isHeavy = (path) => path.startsWith("/clips/") || /\.(mp4|webm|pdf)$/i.test(path);

/* Файли з public/ та іконки: те, що не міняється від збірки до збірки. */
const isPublicAsset = (request, path) =>
  ["image", "font", "style", "script", "manifest"].includes(request.destination) ||
  /\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|css|js|json|webmanifest)$/i.test(path);

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  /* Відео просять шматками (Range) — часткову відповідь кешувати не можна. */
  if (request.headers.has("range")) return;

  const path = url.pathname;
  if (path === "/sw.js" || path.endsWith(".php") || isHeavy(path)) return;

  if (request.mode === "navigate") {
    event.respondWith(pageNetworkFirst(event, request, url));
  } else if (isPayload(path)) {
    event.respondWith(payloadNetworkFirst(event, request, url));
  } else if (path.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, request));
  } else if (isPublicAsset(request, path)) {
    event.respondWith(staleWhileRevalidate(event, request));
  }
  /* Решта (robots.txt, sitemap.xml, llms.txt, невідоме) — у мережу як є. */
});

/* ── Стратегії ────────────────────────────────────────────────────────── */

/* Ключ у кеші — адреса без query і #: /?utm_source=… і /?notrack=1 — та
   сама сторінка, а сам параметр читає вже скрипт сторінки з адресного рядка. */
const cacheKey = (url) => url.origin + url.pathname;

/* Запит до мережі повз HTTP-кеш браузера (no-cache = спитати сервер, він
   відповість 304, якщо файл не змінився). Інакше HTML і index.txt, яким
   хостинг ставить кеш на 30 днів, після заливки ще довго були б старими.
   Перевищили час — обриваємо, щоб не тримати з'єднання даремно. */
async function fetchFresh(request, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request.url, {
      method: "GET",
      headers: request.headers,
      cache: "no-cache",
      credentials: "same-origin",
      /* Для навігації — "manual": редиректи хостингу (/modules → /modules/)
         має виконати сам браузер, а не воркер. */
      redirect: request.redirect,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/* Сторінка: мережа → копія з кешу → /offline/. */
async function pageNetworkFirst(event, request, url) {
  const key = cacheKey(url);
  try {
    const response = await fetchFresh(request, NETWORK_TIMEOUT_MS);
    /* Редирект — браузеру як є; 5xx від хостингу — все одно що без мережі. */
    if (response.type === "opaqueredirect") return response;
    if (response.status >= 500) throw new Error(`upstream ${response.status}`);
    if (response.status === 200) event.waitUntil(putTrimmed(PAGES_CACHE, key, response.clone(), PAGES_MAX));
    return response;
  } catch {
    const cached = await caches.match(key);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response("Немає з'єднання з інтернетом. Спробуйте пізніше.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/* Дані переходу: мережа → копія з кешу. Без копії — помилка запиту; на неї
   Next сам робить повний перехід, і його вже зустрічає pageNetworkFirst. */
async function payloadNetworkFirst(event, request, url) {
  const key = cacheKey(url);
  try {
    const response = await fetchFresh(request, NETWORK_TIMEOUT_MS);
    if (response.status >= 500) throw new Error(`upstream ${response.status}`);
    if (response.status === 200) event.waitUntil(putTrimmed(PAGES_CACHE, key, response.clone(), PAGES_MAX));
    return response;
  } catch (error) {
    const cached = await caches.match(key);
    if (cached) return cached;
    throw error;
  }
}

/* Файли збірки з хешем у назві: є в кеші — беремо, нема — тягнемо й кладемо. */
async function cacheFirst(event, request) {
  const cached = await caches.match(request.url);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.status === 200) event.waitUntil(putTrimmed(ASSETS_CACHE, request.url, response.clone(), ASSETS_MAX));
  return response;
}

/* Картинки з public/: віддати з кешу одразу, свіжу копію — у фоні на потім
   (файл могли перезалити під тією самою назвою). */
async function staleWhileRevalidate(event, request) {
  const cached = await caches.match(request.url);
  const refresh = fetch(request).then((response) => {
    if (response.status === 200) {
      return putTrimmed(ASSETS_CACHE, request.url, response.clone(), ASSETS_MAX).then(() => response);
    }
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch(() => {}));
    return cached;
  }
  return refresh;
}

/* Покласти в кеш і прибрати найстаріше понад межу (keys() віддає записи в
   порядку додавання). */
async function putTrimmed(cacheName, key, response, max) {
  const cache = await caches.open(cacheName);
  await cache.put(key, response);
  const keys = await cache.keys();
  if (keys.length > max) {
    await Promise.all(keys.slice(0, keys.length - max).map((old) => cache.delete(old)));
  }
}
