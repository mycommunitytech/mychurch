"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { settleSections } from "@/lib/scroll";

/* Прийшли за глибоким посиланням (/#product з іншої сторінки, з пошуку, з
   закладки): секцію показуємо, а #hash з адреси прибираємо. Інакше він
   лишається в адресному рядку, і кожне наступне відкриття сайту починається
   посеред сторінки, а не згори. Меню й підвал гортають без якоря самі —
   див. sectionClick() у lib/scroll. */
export default function AnchorGuard() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;

    const clean = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      /* Кадр після завантаження: картинки вже мають розмір, секції стали на
         місце — інакше сторінка зупиняється повз потрібний блок. */
      frame = requestAnimationFrame(() => {
        settleSections();
        document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
        /* Стан роутера зберігаємо — інакше «Назад» поверне порожню сторінку. */
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search
        );
      });
    };

    /* Якір міг приїхати і без нового документа — переходом усередині сторінки. */
    window.addEventListener("hashchange", clean);

    const loaded = document.readyState === "complete";
    if (loaded) clean();
    else window.addEventListener("load", clean, { once: true });

    return () => {
      window.removeEventListener("hashchange", clean);
      window.removeEventListener("load", clean);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
