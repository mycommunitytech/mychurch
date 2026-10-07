"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/lang";

/* Сторінки тут довгі — головна це десятки екранів. Дійшовши до низу,
   повернутись до меню не було чим: меню липке тільки згори. Кнопка
   з'являється після першого екрана, щоб не висіти над героєм, коли
   вертатись ще нікуди, і ховається під модалками (z-30 проти їх z-50)
   та під шухлядою меню (z-40). */
export default function BackToTop() {
  const t = useT();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > window.innerHeight);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.common.backToTop}
      title={t.common.backToTop}
      /* Схована кнопка не повинна ловити ані Tab, ані читачку екрана. */
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={cn(
        "fixed right-4 md:right-8 z-30 flex w-11 h-11 md:w-12 md:h-12 items-center justify-center",
        "rounded-full border border-hairline-strong glass-fixed bg-surface/85 backdrop-blur-xl text-ink-2",
        "shadow-[0_12px_32px_-18px_rgba(0,0,0,0.65)] transition-all duration-300",
        "hover:text-ink hover:bg-surface-2",
        shown
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      )}
      /* --float-lift піднімає кнопку над липкою смугою статті, коли та видима,
         --dock-lift — над слухавкою «перетелефонуємо», яка стоїть у тому ж кутку. */
      style={{ bottom: "calc(max(1rem, env(safe-area-inset-bottom)) + var(--float-lift, 0px) + var(--dock-lift, 0px))" }}
    >
      <ArrowUp className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
    </button>
  );
}
