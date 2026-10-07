"use client";

import { Play } from "lucide-react";
import { warmYoutube } from "@/components/shared/clip-player";
import PulseRings from "@/components/shared/pulse-rings";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Дивитись промо · 1:32» посеред фото громади: блок `proof` на головній
   і кадр у шапці сторінки церкви. Сама лише кнопка — вікно з роликом
   (VideoLightbox) відкриває той, хто її поставив.

   Велике біле коло з трикутником і двома хвилями, що розходяться від
   нього, — знак «тут відео», який читається з першого погляду (2026-09-30).
   Скляна таблетка до того тонула в строкатому фото. Під колом — темна
   пляма, щоб біле не губилось на світлій стіні кадру.

   Коло біле, а не колір церкви: суцільна зелена кнопка сперечалася б із
   кнопками церкви поруч. Колір церкви лишається тільки на трикутнику.
   Хвилі — спільні для всіх плеєрів (PulseRings) і не вимикаються навіть
   над відео, що грає позаду: «на будь якому відео має бути пульсуюча
   анімація» (2026-09-30).
   ──────────────────────────────────────────────────────────────── */

export default function PromoButton({
  cta,
  duration,
  accent,
  onClick,
  label,
  className,
}: {
  cta: string;
  /** Що чує скрінрідер: «Дивитись» саме по собі не каже, що саме. */
  label?: string;
  duration: string;
  accent: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onPointerEnter={warmYoutube}
      onTouchStart={warmYoutube}
      className={cn(
        "group relative isolate flex flex-col items-center gap-4 md:gap-5 text-white touch-manipulation outline-none",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[340px] h-[280px] md:w-[440px] md:h-[340px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(closest-side, rgba(3,8,18,0.55), rgba(3,8,18,0.25) 55%, transparent)" }}
      />

      <span className="relative w-[84px] h-[84px] md:w-[108px] md:h-[108px]">
        <PulseRings />
        <span className="relative flex w-full h-full items-center justify-center rounded-full bg-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-white/50">
          <Play className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-[3px]" style={{ color: accent }} strokeWidth={0} />
        </span>
      </span>

      <span className="flex items-center gap-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
        <span className="font-semibold text-[21px] md:text-[26px] leading-none tracking-[-0.5px] whitespace-nowrap">{cta}</span>
        <span className="flex items-center h-7 md:h-8 px-2.5 md:px-3 rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md text-[13px] md:text-[14px] font-medium tabular-nums [text-shadow:none]">
          {duration}
        </span>
      </span>
    </button>
  );
}
