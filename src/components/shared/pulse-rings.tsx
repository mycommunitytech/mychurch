import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Дві хвилі, що розходяться від кнопки відтворення, — спільний знак
   «тут відео» на кожному плеєрі сайту (2026-09-30, «на будь якому відео
   має бути пульсуюча анімація»).

   Кладеться всередину самого кола (у нього має бути `relative`): хвилі
   беруть його розмір і розходяться назовні, а трикутник лишається зверху.
   Білі — для кадру; на світлій сторінці передають колір кнопки (`color`).
   Хвилі гасить глобальне prefers-reduced-motion, поза екраном — пауза
   `[data-offscreen]`.
   ──────────────────────────────────────────────────────────────── */

export default function PulseRings({ color, className }: { color?: string; className?: string }) {
  const ring = cn(
    "pulse-ring pointer-events-none absolute inset-0 rounded-full border-2",
    !color && "border-white/80",
    className
  );
  return (
    <>
      <span aria-hidden className={ring} style={color ? { borderColor: color } : undefined} />
      <span
        aria-hidden
        className={ring}
        style={{ animationDelay: "1.2s", ...(color ? { borderColor: color } : null) }}
      />
    </>
  );
}
