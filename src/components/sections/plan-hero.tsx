"use client";

import Image from "next/image";
import FadeIn from "@/components/shared/fade-in";
import MaterialForm from "@/components/shared/material-form";
import { PLAN_COPY, PLAN_COVER, PLAN_SHEET } from "@/content/plan";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Шапка /plan: питання ліворуч, сам матеріал праворуч.

   Аркуші — не намальована обкладинка, а знімки справжніх сторінок
   PDF (scripts/plan-pdf.mjs кладе їх у public/). Стоять прямо: ні
   нахилу, ні розвороту — папір на столі, а не рекламний макет.
   ──────────────────────────────────────────────────────────────── */

export default function PlanHero() {
  const { lang } = useLang();
  const c = PLAN_COPY[lang];

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-12 md:pt-20 pb-14 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[300px] left-[10%] w-[880px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 12%, black 10%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 12%, black 10%, transparent 76%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-10 lg:gap-14 items-center">
        <FadeIn className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">
              {c.hero.eyebrow}
            </span>
            <h1 className="font-semibold text-ink leading-[1.04] tracking-[-1.4px] md:tracking-[-2.2px] text-[40px] sm:text-[52px] md:text-[64px]">
              {c.hero.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{c.hero.lead}</p>
          </div>

          {/* Що це за файл — рядком, а не трьома плашками: формат і обсяг
              мають бути видні, але не сперечатись із заголовком. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13.5px] text-ink-3">
            {c.hero.meta.map((item, i) => (
              /* Крапка їде разом зі своїм словом: інакше при переносі вона
                 лишається висіти в кінці рядка. */
              <span key={item} className="inline-flex items-center gap-3">
                {i > 0 && <span aria-hidden className="w-1 h-1 rounded-full bg-ink-3/50" />}
                {item}
              </span>
            ))}
          </div>

          <MaterialForm place="шапка /plan" className="max-w-[520px]" />
        </FadeIn>

        {/* Аркуші: сторінка тижня визирає з-за обкладинки. На телефоні
            вона їде нагору й лишається сама — другий аркуш там нічого не
            додає, а половину екрана з'їдає. */}
        <FadeIn variant="scale" delay={1} className="relative order-first lg:order-none">
          <div className="relative mx-auto w-full max-w-[190px] sm:max-w-[420px] aspect-[210/297]">
            <div className="absolute right-0 top-0 hidden sm:block w-[84%] h-[94%] rounded-[10px] overflow-hidden border border-hairline bg-surface shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)]">
              <Image
                src={PLAN_SHEET}
                alt={c.inside.sheetAlt}
                fill
                sizes="(max-width: 1024px) 40vw, 360px"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute left-0 bottom-0 w-full sm:w-[78%] h-full sm:h-[94%] rounded-[10px] overflow-hidden shadow-[0_30px_70px_-28px_rgba(0,0,0,0.55)]">
              <Image
                src={PLAN_COVER}
                alt={c.hero.coverAlt}
                fill
                sizes="(max-width: 1024px) 40vw, 360px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
