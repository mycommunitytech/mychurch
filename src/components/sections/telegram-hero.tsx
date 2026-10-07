"use client";

import FadeIn from "@/components/shared/fade-in";
import TgPhone from "@/components/shared/tg-phone";
import { TgMark } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang } from "@/lib/lang";

export default function TelegramHero() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].hero;
  const { open } = useDemoModal();

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-12 md:pt-20 pb-16 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[280px] left-[45%] -translate-x-1/2 w-[860px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 90%, transparent), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 55% at 45% 25%, black 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 45% 25%, black 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-12 lg:gap-16 items-center">
        <FadeIn className="flex flex-col items-start gap-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur border border-hairline pl-2.5 pr-4 py-1.5">
            <TgMark className="w-[16px] h-[16px]" />
            <span className="text-[13px] font-medium text-ink-2 leading-none">{t.eyebrow}</span>
          </span>

          <h1 className="font-semibold text-ink leading-[1.02] tracking-[-1.4px] md:tracking-[-2.8px] text-[42px] sm:text-[56px] md:text-[72px] max-w-[620px]">
            {t.title}
          </h1>

          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{t.lead}</p>

          <button
            onClick={open}
            className="btn-primary btn-brand flex items-center justify-center h-[52px] w-full sm:w-auto px-8 rounded-full mt-2"
          >
            <span className="text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">{t.cta}</span>
          </button>
        </FadeIn>

        <FadeIn variant="scale" delay={2} className="min-w-0 flex flex-col items-center">
          <TgPhone phone={t.phone} />
        </FadeIn>
      </div>
    </section>
  );
}
