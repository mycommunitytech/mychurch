"use client";

import { useEffect } from "react";

/* Реєструє сервіс-воркер сайту (scripts/sw.template.js → /sw.js): сторінки,
   стилі й картинки лишаються на пристрої, і те, що людина вже бачила,
   відкривається без мережі; решта показує сторінку /offline/. Повторні
   заходи теж швидші: файли збірки не тягнуться вдруге.

   Лише production-збірка: у розробці воркер підсовував би стару копію
   замість щойно зміненого коду. `updateViaCache: "none"` — хостинг віддає
   sw.js із кешем на 30 днів, як усю статику; так браузер перевіряє файл
   воркера повз цей кеш і підхоплює нову збірку одразу після заливки. */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
        /* Не вийшло (старий браузер, приватний режим) — сайт працює як раніше. */
      });
    };

    /* Після load — щоб не відбирати мережу в самої сторінки. */
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
