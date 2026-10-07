"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { youtubeEmbed, YOUTUBE_ALLOW } from "@/components/shared/clip-player";
import { useBodyScrollLock } from "@/components/shared/use-body-scroll-lock";
import { useFocusTrap } from "@/components/shared/use-focus-trap";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Ролик у власному вікні — для місць, де кадр не 16:9 і грати на
   місці нема де: промо «Нового Життя» поверх кадрів громади на
   головній. Сцена там висока (на телефоні 560 px), а під склом
   візитівка з кнопками — відео на місці або ховало б її, або стояло
   б смугою посеред чорного.

   Вікно виноситься в <body>: предок із трансформацією (FadeIn) робить
   containing block навіть для position: fixed. Хрестик — над кадром, а
   не на ньому: у правому верхньому куті YouTube тримає свої кнопки.
   Escape і клацання поза кадром теж закривають; фокус повертається на
   кнопку, з якої відкрили (useFocusTrap).
   ──────────────────────────────────────────────────────────────── */

export default function VideoLightbox({
  videoId,
  title,
  closeLabel,
  onClose,
}: {
  videoId: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const win = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useFocusTrap(win, true, closeBtn);
  useBodyScrollLock(true);

  /* Коли фокус уже в iframe, Escape бачить документ YouTube — тоді
     лишаються хрестик і клацання поза кадром. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-md animate-[softFade_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        ref={win}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        /* Ширина впирається і в екран, і у висоту: на широкому, але
           низькому вікні 16:9 на всю ширину вилазив би за низ. */
        className="relative w-full max-w-[min(1280px,calc((100dvh-9rem)*16/9))] flex flex-col gap-3"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="self-end w-10 h-10 rounded-full bg-white/12 text-white flex items-center justify-center ring-1 ring-white/25 transition-colors hover:bg-white/25"
        >
          <X className="w-5 h-5" strokeWidth={2.2} />
        </button>
        {/* Відкрили кліком — це і є жест, якого браузер чекає для звуку;
            на iPhone ще тап по кнопці YouTube, як і в інших плеєрах. */}
        <iframe
          src={youtubeEmbed(videoId, lang)}
          title={title}
          allow={YOUTUBE_ALLOW}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="block w-full aspect-video rounded-[16px] md:rounded-[22px] bg-black border-0 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
        />
      </div>
    </div>,
    document.body
  );
}
