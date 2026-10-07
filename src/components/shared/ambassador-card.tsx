"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import LiveDot from "@/components/shared/live-dot";
import { getAmbassador } from "@/content/ambassadors";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Картка церкви-амбасадора: кадр із життя громади, короткий рядок
   про неї, «скільки ми разом» і дорога далі.

   Одна й та сама картка стоїть у кінці сторінки амбасадора, у блоці
   «Наш амбасадор» на /about і на головній — щоб церква виглядала
   однаково в усіх трьох місцях. `pageHref` вмикає другу дію: головна
   кнопка веде на сторінку церкви, а сайт лишається тихим лінком.

   `visual="logo"` міняє кадр громади на знак церкви: на головній під
   карткою стоїть відео з тієї самої громади, і ще одне фото поруч із
   ним було б третім її виглядом підряд. Панель зі знаком світла в
   обох темах — сам знак темно-зелений і на темній підкладці зник би,
   тож кольори тексту в ній беруться від акценту, а не від --ink.
   ──────────────────────────────────────────────────────────────── */

export default function AmbassadorCard({
  id,
  pageHref,
  pageCta,
  visual = "photo",
}: {
  id: string;
  pageHref?: string;
  pageCta?: string;
  visual?: "photo" | "logo";
}) {
  const { lang } = useLang();
  const church = getAmbassador(id);
  if (!church) return null;

  const copy = church.copy[lang];
  const accent = church.accent;
  const since = copy.facts[copy.facts.length - 1];

  return (
    <article
      className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline"
      style={{ background: `color-mix(in oklab, ${accent} 7%, var(--surface))` }}
    >
      {visual === "logo" ? (
        <div
          className="relative min-h-[220px] md:min-h-[380px] flex items-center justify-center p-10"
          style={{ background: `color-mix(in oklab, ${accent} 10%, #ffffff)` }}
        >
          {church.logo ? (
            <span className="flex flex-col items-center gap-4">
              <Image
                src={church.logo}
                alt={church.name}
                width={480}
                height={390}
                className="w-[168px] md:w-[232px] h-auto"
              />
              {copy.tagline && (
                <span
                  className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.16em] text-center"
                  style={{ color: `color-mix(in oklab, ${accent} 75%, #475569)` }}
                >
                  {copy.tagline}
                </span>
              )}
            </span>
          ) : (
            <span
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-semibold text-[30px] tracking-[-0.6px]"
              style={{ backgroundColor: accent }}
            >
              {church.initials}
            </span>
          )}
        </div>
      ) : (
        <div className="relative min-h-[260px] md:min-h-[380px]">
          <Image
            src={copy.aboutPhoto.src}
            alt={copy.aboutPhoto.alt}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col justify-center gap-5 p-7 md:p-10">
        {/* Зі знаком у панелі заголовком стоїть сама назва громади: під
            малюнком вона б повторювала те саме вдруге (2026-09-22). */}
        <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 font-semibold text-ink text-[28px] md:text-[38px] leading-[1.1] tracking-[-0.8px] md:tracking-[-1.2px]">
          {visual === "logo" ? church.name : copy.aboutTitle}
          {visual === "logo" && <LiveDot size={10} />}
        </h3>
        <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.55]">{copy.aboutText}</p>

        {/* Один рядок: скільки ми разом. Адреса й час служінь — на сайті церкви. */}
        <dl className="flex flex-wrap items-baseline gap-x-2 text-[14.5px] leading-[1.45]">
          <dt className="text-ink-3">{since.label}</dt>
          <dd className="font-medium text-ink">{since.value}</dd>
        </dl>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {pageHref ? (
            <>
              <Link
                href={pageHref}
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                style={{ background: accent }}
              >
                {pageCta}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-opacity hover:opacity-75"
                style={{ color: accent }}
              >
                {copy.siteCta}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          ) : (
            <Link
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
              style={{ background: accent }}
            >
              {copy.siteCta}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
