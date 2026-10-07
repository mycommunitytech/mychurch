"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { COOP_ACCENTS, COOP_ICONS } from "@/components/shared/cooperation-look";
import { COOPERATION_COPY } from "@/content/cooperation";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Вхід на /cooperation з головної — останнім блоком, під каталогом
   (2026-10-07, «можна на головній винести запрошуємо до співпраці?
   якось акуратно»).

   Заголовок сторінки, її речення, кнопка — і вісім адресатів плашками
   з назвами в їхніх кольорах. Уся картка — одне посилання.

   Того ж дня пробували й відкинули: білу смугу з рядком дрібних знаків
   («якось красивіше»), схему, де плашки лініями сходяться в знак «М» з
   вогниками («давай простіше»), її ж варіант із п'ятьма плашками й «Не
   лише для церков» («не підходить») і живий екран «Та сама система —
   для клубів» («погано»).
   ──────────────────────────────────────────────────────────────── */

export default function CooperationTeaser() {
  const { lang } = useLang();
  const c = COOPERATION_COPY[lang];

  return (
    <section className="w-full flex justify-center px-5 md:px-8 pb-16 md:pb-24">
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        <Link
          href="/cooperation"
          data-track="cta"
          data-place="головна · співпраця"
          className="group flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14 rounded-[28px] md:rounded-[32px] border border-hairline bg-surface p-7 md:p-10 xl:p-12 transition-[border-color,box-shadow] duration-300 hover:border-hairline-strong hover:shadow-[0_24px_60px_-36px_rgba(0,40,100,0.45)]"
        >
          <div className="flex flex-col items-start gap-4 lg:max-w-[420px]">
            <h2 className="font-semibold text-ink text-[36px] sm:text-[44px] md:text-[52px] leading-[1.02] tracking-[-1px] md:tracking-[-1.8px]">
              {c.title}
            </h2>
            <p className="text-[16px] md:text-[18px] text-ink-2 leading-[1.5]">{c.text}</p>
            <span className="mt-2 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-brand text-white text-[15.5px] font-semibold">
              {c.teaser.cta}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} />
            </span>
          </div>

          <ul aria-hidden className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {c.audiences.map((a) => {
              const Icon = COOP_ICONS[a.id];
              const accent = COOP_ACCENTS[a.id];
              return (
                <li key={a.id} className="flex items-center gap-3 h-[52px] rounded-2xl border border-hairline bg-surface-2 pl-2 pr-4">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                  </span>
                  <span className="text-[15px] font-semibold text-ink truncate">{a.name}</span>
                </li>
              );
            })}
          </ul>
        </Link>
      </FadeIn>
    </section>
  );
}
