"use client";

import { useEffect, type RefObject } from "react";

/* Беззвучна петля промо-фільму позаду кадру (2026-09-30, «хочу щоб промо
   відтворювалося позаду»). Свій файл, а не YouTube: той показував би
   поверх кадру свою назву й логотип і ще до натискання тягнув би свої
   скрипти. Файл не вантажиться, доки кадр не підійшов до екрана; поза
   екраном і під відкритим фільмом (`paused`) — пауза. Хто просить менше
   руху, береже трафік або в iPhone з енергозбереженням (там play()
   відмовляє) — бачить фото під петлею.

   Спільна для сцени церкви (church-scene.tsx) і картки амбасадора на
   /about (ambassador-card.tsx, `visual="promo"`). */
export function usePromoLoop(
  stage: RefObject<HTMLElement | null>,
  video: RefObject<HTMLVideoElement | null>,
  src: string | undefined,
  paused: boolean
) {
  useEffect(() => {
    const el = stage.current;
    const v = video.current;
    if (!el || !v || !src || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return v.pause();
        if (!v.getAttribute("src")) v.src = src;
        v.muted = true;
        v.play().catch(() => {});
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [stage, video, src, paused]);
}
