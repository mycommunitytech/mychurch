"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { PLAN_COPY, PLAN_SHEET } from "@/content/plan";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   «Що всередині»: аркуш тижня на всю висоту — і чотири тижні
   списком поруч. Не сітка однакових карток: ліворуч сторінка, яку
   людина справді отримає, праворуч — зміст, по рядку на тиждень.
   ──────────────────────────────────────────────────────────────── */

export default function PlanInside() {
  const { lang } = useLang();
  const c = PLAN_COPY[lang].inside;

  return (
    <section className="w-full flex flex-col items-center bg-page px-5 md:px-8 py-14 md:py-24">
      <div className="w-full max-w-[1120px] flex flex-col gap-10 md:gap-14">
        <FadeIn className="flex flex-col gap-4 max-w-[720px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{c.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] tracking-[-1.2px]">
            {c.title}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{c.text}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
          {/* Аркуш першого тижня — на повну сторінку, без обрізки: те,
              що людина розгорне у файлі, видно ще до кнопки. */}
          <FadeIn variant="scale" className="order-2 lg:order-1">
            <div className="relative w-full max-w-[380px] mx-auto aspect-[210/297] rounded-[12px] overflow-hidden border border-hairline bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
              <Image
                src={PLAN_SHEET}
                alt={c.sheetAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 380px"
                className="object-contain"
              />
            </div>
          </FadeIn>

          <FadeIn delay={1} className="order-1 lg:order-2 flex flex-col">
            {c.weeks.map((week) => (
              <div
                key={week.n}
                className="flex gap-5 sm:gap-7 py-6 first:pt-0 border-b border-hairline last:border-b-0"
              >
                <span className="shrink-0 flex flex-col items-center gap-1 w-[58px] pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-none">
                    {week.label}
                  </span>
                  <span className="text-[30px] font-semibold text-brand leading-none tabular-nums tracking-[-1px]">
                    {week.n}
                  </span>
                </span>
                <div className="flex flex-col gap-2 min-w-0">
                  <h3 className="text-[20px] sm:text-[23px] font-semibold text-ink leading-[1.2] tracking-[-0.5px]">
                    {week.title}
                  </h3>
                  <p className="text-[15.5px] text-ink-2 leading-[1.55]">{week.goal}</p>
                  <p className="flex items-start gap-2 text-[14.5px] text-ink-3 leading-[1.5]">
                    <Check className="w-4 h-4 mt-[3px] shrink-0 text-brand" strokeWidth={2.4} />
                    <span>
                      <span className="font-medium text-ink-2">{c.doneLabel}:</span> {week.done}
                    </span>
                  </p>
                </div>
              </div>
            ))}

            {/* Два аркуші, які лишаються після плану: їх заповнюють і
                вішають на стіну, тому вони згадані окремо від тижнів. */}
            <div className="mt-8 flex flex-col gap-4 rounded-[18px] border border-hairline bg-surface p-6">
              {c.extras.map((extra) => (
                <div key={extra.title} className="flex flex-col gap-1">
                  <span className="text-[15.5px] font-semibold text-ink leading-[1.35]">{extra.title}</span>
                  <span className="text-[14.5px] text-ink-2 leading-[1.5]">{extra.text}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
