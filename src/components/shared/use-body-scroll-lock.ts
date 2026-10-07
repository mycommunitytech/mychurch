"use client";

import { useEffect } from "react";

/* Скільки вікон зараз тримають сторінку. Лічильник, а не прапорець: коли
   одна модалка закривається, а інша відкривається в тому ж кадрі (заявка
   надіслана → відкрився календар), сторінка не має ні смикнутись, ні
   лишитись розблокованою під відкритим вікном. */
let locks = 0;

/**
 * Забороняє прокрутку сторінки, поки вікно відкрите, і компенсує ширину
 * смуги прокрутки відступом — інакше вміст стрибає на її ширину.
 * Тільки overflowY: скорочений overflow збив би власний overflow-x: clip
 * у body.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (locks++ === 0) {
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflowY = "hidden";
      document.body.style.paddingRight = `${gap}px`;
    }
    return () => {
      if (--locks === 0) {
        document.body.style.overflowY = "";
        document.body.style.paddingRight = "";
      }
    };
  }, [active]);
}
