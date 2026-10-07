"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { BLOG_CATEGORIES, BLOG_COPY, BLOG_POSTS, morePosts, readingMinutes, starterPosts } from "@/content/blog";
import type { BlogPost } from "@/content/blog";
import { BLOG_CATEGORY_ACCENTS, BLOG_CATEGORY_ICONS } from "@/components/shared/blog-icons";
import { PLAN_COPY, PLAN_COVER, PLAN_LIVE } from "@/content/plan";
import { useLang } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   /blog — сім статей «з чого почати», кожна великим блоком. Не сітка
   однакових карток: перший і останній блоки широкі, решта — вужчі,
   тому мозаїка читається в порядку «з чого почати». Решта статей —
   нижче рядками змісту («Ще в блозі»), щоб до кожної вело посилання.
   ──────────────────────────────────────────────────────────────── */

function formatDate(date: string, lang: "ua" | "en") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "ua" ? "uk-UA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  const { lang } = useLang();
  const t = BLOG_COPY[lang];
  const categories = BLOG_CATEGORIES[lang];
  const starter = starterPosts(lang);
  const more = morePosts(lang);

  const categoryTitle = (post: BlogPost) => categories.find((c) => c.id === post.category)?.title ?? "";
  const plan = PLAN_COPY[lang];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-10 md:pt-16 pb-14 md:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[300px] left-[15%] w-[880px] h-[600px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 18%, transparent), transparent 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
          <FadeIn className="flex flex-col gap-5 max-w-[760px]">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.hero.eyebrow}</span>
            <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[36px] sm:text-[44px] md:text-[54px]">
              {t.hero.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[620px]">{t.hero.lead}</p>
            <div className="flex items-center gap-5 pt-1">
              <span className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold text-ink tabular-nums">{BLOG_POSTS.length}</span>
                <span className="text-[14px] text-ink-3">{t.stats.posts}</span>
              </span>
              <span className="w-px h-5 bg-hairline-strong" />
              <span className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold text-ink tabular-nums">{categories.length}</span>
                <span className="text-[14px] text-ink-3">{t.stats.topics}</span>
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Сім статей великими блоками ──────────────────────── */}
      <section className="w-full flex flex-col items-center pb-12 md:pb-16 bg-page">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-7 md:gap-9 -mt-8 md:-mt-10">
          <FadeIn className="flex flex-col gap-2.5 max-w-[720px]">
            <h2 className="font-semibold text-ink text-[26px] md:text-[34px] leading-[1.12] tracking-[-0.9px]">{t.starterTitle}</h2>
            <p className="text-[15.5px] md:text-[17px] text-ink-2 leading-[1.55]">{t.starterText}</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
            {starter.map(({ post, why }, i) => {
              const accent = BLOG_CATEGORY_ACCENTS[post.category];
              const Icon = BLOG_CATEGORY_ICONS[post.category];
              const copy = post.copy[lang];
              const wide = i === 0 || i === starter.length - 1;
              return (
                <FadeIn
                  key={post.slug}
                  delay={Math.min(i, 4)}
                  variant="scale"
                  className={["h-full", wide ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2"].join(" ")}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover-lift group h-full flex flex-col gap-3.5 rounded-[24px] border border-hairline bg-surface p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    style={{ background: `linear-gradient(140deg, color-mix(in oklab, ${accent} 9%, var(--surface)), var(--surface) 62%)` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                      >
                        <Icon className="w-[19px] h-[19px]" strokeWidth={2} />
                      </span>
                      <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
                        <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {categoryTitle(post)}
                      </span>
                    </div>
                    <h3
                      className={[
                        "font-semibold text-ink leading-[1.14] tracking-[-0.7px] group-hover:text-brand transition-colors",
                        wide ? "text-[26px] md:text-[34px]" : "text-[21px] md:text-[25px]",
                      ].join(" ")}
                    >
                      {copy.title}
                    </h3>
                    <p className={["text-ink-2 leading-[1.55]", wide ? "text-[16px] md:text-[17.5px] max-w-[620px]" : "text-[15.5px]"].join(" ")}>
                      {why}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4 text-[13px] text-ink-3">
                      <span>{formatDate(post.date, lang)}</span>
                      <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                      <span className="tabular-nums">
                        {readingMinutes(post, lang)} {t.minutes}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 font-medium" style={{ color: accent }}>
                        {t.readLabel}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {more.length > 0 && (
            <FadeIn className="flex flex-col gap-4 pt-6 md:pt-10">
              <h2 className="font-semibold text-ink text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.6px]">{t.moreTitle}</h2>
              <ul className="flex flex-col border-t border-hairline">
                {more.map((post) => {
                  const accent = BLOG_CATEGORY_ACCENTS[post.category];
                  const copy = post.copy[lang];
                  return (
                    <li key={post.slug} className="border-b border-hairline">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-x-8 gap-y-2 py-5 md:py-6"
                      >
                        <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em] pt-1.5" style={{ color: accent }}>
                          {categoryTitle(post)}
                        </span>
                        <span className="flex flex-col gap-1.5 min-w-0">
                          <span className="font-semibold text-ink text-[19px] md:text-[22px] leading-[1.25] tracking-[-0.4px] group-hover:text-brand transition-colors">
                            {copy.title}
                          </span>
                          <span className="text-[15px] text-ink-2 leading-[1.55] line-clamp-2 max-w-[640px]">{copy.lead}</span>
                        </span>
                        <span className="flex items-center gap-3 text-[13px] text-ink-3 md:pt-1.5 md:self-start whitespace-nowrap">
                          <span>{formatDate(post.updated ?? post.date, lang)}</span>
                          <span className="w-1 h-1 rounded-full bg-ink-3/50" />
                          <span className="tabular-nums">
                            {readingMinutes(post, lang)} {t.minutes}
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: accent }} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── Матеріал: те саме, що в статтях, але файлом ─────────
           Поки сторінка схована (PLAN_LIVE), смуги тут немає. */}
      {PLAN_LIVE && (
        <section className="w-full flex flex-col items-center bg-page px-5 md:px-8 pb-14 md:pb-20">
          <FadeIn variant="scale" className="w-full max-w-[1120px]">
            <Link
              href="/plan"
              className="hover-lift group flex flex-col sm:flex-row items-stretch gap-6 sm:gap-9 rounded-[24px] border border-hairline bg-surface p-6 md:p-9"
            >
              {/* Обкладинка справжнього файла: видно, що це папір, а не
                  ще одна стаття. */}
              <span className="relative shrink-0 w-[96px] sm:w-[118px] aspect-[210/297] self-center rounded-[8px] overflow-hidden border border-hairline shadow-[0_14px_36px_-20px_rgba(0,0,0,0.45)]">
                <Image src={PLAN_COVER} alt={plan.hero.coverAlt} fill sizes="118px" className="object-cover" />
              </span>
              <span className="flex flex-col justify-center gap-2.5 min-w-0">
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {plan.hero.eyebrow}
                </span>
                <span className="font-semibold text-ink text-[24px] md:text-[32px] leading-[1.12] tracking-[-0.8px] group-hover:text-brand transition-colors">
                  {plan.teaser.title}
                </span>
                <span className="text-[15.5px] md:text-[17px] text-ink-2 leading-[1.55] max-w-[620px]">
                  {plan.teaser.text}
                </span>
                <span className="inline-flex items-center gap-1.5 pt-1 text-[15px] font-medium text-brand">
                  {plan.teaser.action}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </FadeIn>
        </section>
      )}
    </>
  );
}
