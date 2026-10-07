"use client";

import { Fragment } from "react";
import FadeIn from "@/components/shared/fade-in";
import MaterialForm from "@/components/shared/material-form";
import { PLAN_COPY } from "@/content/plan";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Друга — і остання — поява форми: людина догортала сторінку, і
   питання має стояти тут, а не за екран вище. Три числа поруч
   відповідають на те, чого форма не каже: скільки це часу і чи
   треба щось купувати.
   ──────────────────────────────────────────────────────────────── */

export default function PlanGet() {
  const { lang } = useLang();
  const c = PLAN_COPY[lang];

  return (
    <section id="get" className="w-full flex flex-col items-center bg-surface px-5 md:px-8 py-14 md:py-24 scroll-mt-24">
      <FadeIn className="w-full max-w-[1120px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-9 lg:gap-16 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="font-semibold text-ink text-[30px] sm:text-[38px] md:text-[44px] leading-[1.08] tracking-[-1.2px]">
            {c.get.title}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55] max-w-[440px]">{c.get.text}</p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1">
            {c.facts.map((fact, i) => (
              <Fragment key={fact.label}>
                {i > 0 && <span aria-hidden className="hidden sm:block w-px h-9 bg-hairline-strong" />}
                <div className="flex flex-col gap-1">
                  <span className="text-[22px] md:text-[25px] font-semibold text-ink leading-none tracking-[-0.7px]">
                    {fact.value}
                  </span>
                  <span className="text-[12.5px] text-ink-3 leading-none">{fact.label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <MaterialForm variant="band" place="кінець /plan" />
      </FadeIn>
    </section>
  );
}
