"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Ставить `data-offscreen` на секції, яких зараз не видно, — CSS у
   globals.css ставить їхні анімації на паузу («БЛОКИ ПОЗА ЕКРАНОМ»).
   Запас у пів екрана: блок встигає ожити до того, як його побачать.
   Перевіряємо заново на кожній сторінці — після переходу секції нові. */
export default function OffscreenPause() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section");
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      sections.forEach((s) => s.removeAttribute("data-offscreen"));
    };
  }, [pathname]);

  return null;
}
