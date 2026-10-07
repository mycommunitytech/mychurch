"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";
import AnalyticsShowcase from "@/components/shared/analytics-showcase";
import PeopleExplorer from "@/components/shared/people-explorer";
import ServingMini from "@/components/shared/serving-mini";
import GroupsMini from "@/components/shared/groups-mini";
import PlanningMini from "@/components/shared/planning-mini";

/* Аналітика йде останньою і має власний розкрій: це не картинка збоку, а
   цілий екран, який сам перебирає п'ять поглядів. */
const ANALYTICS_BLOCK = 4;

/* Один і той самий розкрій на всі блоки: екран модуля в кольоровій половині,
   назва модуля одним словом — у білій. Міняються тільки колір і сам екран,
   а боки чергуються, щоб чотири картки не читались як таблиця. */
const VISUALS = [
  { imageLeft: true, accent: "var(--brand)", module: "people", Mock: PeopleExplorer },
  { imageLeft: false, accent: "#f97316", module: "ministries", Mock: ServingMini },
  { imageLeft: true, accent: "#0d9488", module: "groups", Mock: GroupsMini },
  { imageLeft: false, accent: "#ea580c", module: "service-planning", Mock: PlanningMini },
  { imageLeft: true, accent: "#8b5bf0", module: "analytics", Mock: null },
];

const tint = (accent: string) =>
  `linear-gradient(140deg, color-mix(in oklab, ${accent} 12%, var(--surface)) 0%, color-mix(in oklab, ${accent} 5%, var(--surface)) 55%, var(--surface) 100%)`;

export default function Features() {
  const t = useT().features;
  return (
    <section id="product" className="w-full flex flex-col items-center pt-16 md:pt-24 pb-2.5 md:pb-3 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-16">
        {/* Заголовок огляду — вивіска: два слова великими літерами й на всю
            ширину. Рядок у словнику лишається звичайним, великі літери дає
            css, щоб їх правильно читав скрінрідер. */}
        <SectionHeading
          eyebrow={t.eyebrow}
          title={
            <span className="block uppercase text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
              {t.title}
            </span>
          }
        />

        <div className="flex flex-col gap-5 md:gap-6">
          {t.blocks.map((block, i) => {
            const v = VISUALS[i];
            if (i === ANALYTICS_BLOCK) {
              return (
                <FadeIn key={block.title} variant="scale" delay={1}>
                  <AnalyticsShowcase block={block} tint={tint(v.accent)} />
                </FadeIn>
              );
            }
            const Mock = v.Mock;
            return (
              <FadeIn key={block.title} variant="scale" delay={0}>
                {/* Картка нікуди не веде: ні кліку, ні стрілки — сам екран
                    і те, що в ньому рухається. Каталог модулів лишається
                    внизу сторінки й у меню (2026-09-21). */}
                <div
                  style={
                    {
                      "--accent": v.accent,
                      "--accent-soft": `color-mix(in oklab, ${v.accent} 12%, var(--surface))`,
                      "--accent-line": `color-mix(in oklab, ${v.accent} 32%, var(--surface))`,
                    } as React.CSSProperties
                  }
                  className={[
                    "block overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-1",
                    /* Ширша половина завжди під екраном, з якого боку він би не стояв. */
                    v.imageLeft ? "md:grid-cols-[1.35fr_1fr]" : "md:grid-cols-[1fr_1.35fr]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      /* Висота половини з екраном однакова в усіх блоках
                         огляду (аналітика, бот і телефон — теж 440). */
                      "relative flex items-center justify-center min-h-[280px] md:min-h-[440px] p-4 md:p-7",
                      v.imageLeft ? "md:order-1" : "md:order-2",
                    ].join(" ")}
                    style={{ background: tint(v.accent) }}
                  >
                    {Mock && <Mock />}
                  </div>

                  <div
                    className={[
                      "flex flex-col justify-center gap-3 p-7 md:p-10",
                      v.imageLeft ? "md:order-2" : "md:order-1",
                    ].join(" ")}
                  >
                    {/* Одне слово, одне речення — і стрілка. Перелік умінь був
                        рядом чипів, його показує сам екран поруч, не підпис. */}
                    <h3 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                      {block.title}
                    </h3>
                    <p className="text-[16.5px] md:text-[18px] font-normal text-ink-2 leading-[1.5] max-w-[340px]">
                      {block.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
