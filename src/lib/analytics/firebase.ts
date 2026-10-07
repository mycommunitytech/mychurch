/* Firebase Analytics (GA4) — єдиний отримувач статистики.

   Сайт роздається як статика, свого лічильника з кабінетом більше
   немає: звичні звіти Google, аудиторії та рекламні конверсії
   закривають цю потребу й не вимагають сервера.

   SDK вантажиться ліниво, вже після першої події: Firebase важить
   чимало, і сторінка не має на нього чекати. Якщо ключів немає —
   модуль просто мовчить, а сайт працює далі.

   Конфіг Firebase для вебу публічний за задумом (він однаково
   потрапляє в браузер), але тримаємо його в NEXT_PUBLIC_-змінних:
   так проєкт легко перемкнути й нічого не лишається в репозиторії. */

import type { Analytics } from "firebase/analytics";

const CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

export const firebaseEnabled = Boolean(CONFIG.apiKey && CONFIG.appId && CONFIG.measurementId);

let pending: Promise<Analytics | null> | null = null;

async function init(): Promise<Analytics | null> {
  if (!firebaseEnabled) return null;
  const [{ initializeApp, getApps }, analyticsModule] = await Promise.all([
    import("firebase/app"),
    import("firebase/analytics"),
  ]);
  /* isSupported() відсіює середовища без потрібних API — приватні
     режими деяких браузерів, вебв'ю без cookie тощо. */
  if (!(await analyticsModule.isSupported())) return null;
  const app = getApps()[0] ?? initializeApp(CONFIG);
  return analyticsModule.getAnalytics(app);
}

/* Перша подія летить ще під час завантаження, а SDK разом із gtag — це
   ~180 КБ скриптів. На телефоні вони відбирали мережу й процесор у самої
   сторінки, тож стартуємо тільки після `load`, коли браузер вільний.
   Події тим часом просто чекають у промісі. */
function whenIdle() {
  return new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => resolve(), { timeout: 3000 })
        : setTimeout(resolve, 1500);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

function ready() {
  if (!pending) pending = whenIdle().then(init).catch(() => null);
  return pending;
}

/* GA4 приймає в назвах лише латиницю, цифри й підкреслення, а значення
   обрізає на 100 символах. Чистимо на нашому боці, щоб події не
   зникали мовчки. */
const NAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/;

function cleanParams(params?: Record<string, string | number | boolean | undefined>) {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "" || !NAME_RE.test(key)) continue;
    out[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  return out;
}

export function logToFirebase(name: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!firebaseEnabled || !NAME_RE.test(name)) return;
  void ready()
    .then(async (analytics) => {
      if (!analytics) return;
      const { logEvent } = await import("firebase/analytics");
      logEvent(analytics, name, cleanParams(params));
    })
    .catch(() => {
      /* Блокувальник реклами чи офлайн — свій лічильник це не зачіпає. */
    });
}
