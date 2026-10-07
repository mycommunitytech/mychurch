"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import LiveDot from "@/components/shared/live-dot";
import PromoButton from "@/components/shared/promo-button";
import VideoLightbox from "@/components/shared/video-lightbox";
import { usePromoLoop } from "@/components/shared/use-promo-loop";
import type { AmbassadorDetail } from "@/content/ambassadors";
import { track } from "@/lib/analytics/client";
import { useLang, useT } from "@/lib/lang";

/* Кадри фону по черзі: повний зал, проповідь, мала група, прославлення,
   хол, світшоти церкви. Дитячих кадрів тут немає — обличчя дітей на першому
   екрані не крутимо. */
const SCENE_PHOTOS = [
  "/ambassadors/newlife/zal.webp",
  "/ambassadors/newlife/propovid-vyshyvanka.webp",
  "/ambassadors/newlife/mala-grupa-dyvan.webp",
  "/ambassadors/newlife/proslavlennia.webp",
  "/ambassadors/newlife/kava-u-kholi.webp",
  "/ambassadors/newlife/svitshoty.webp",
];
const STEP_MS = 5500;

/* ────────────────────────────────────────────────────────────────
   Церква однією сценою: блок `proof` на головній і шапка її ж сторінки
   (2026-09-30, «тут так само перероби»). Позаду — її промо-фільм
   беззвучною петлею (поки петля не пішла або якщо її не можна — кадри
   громади по черзі), посередині — кнопка повного фільму, внизу — скляна
   візитівка: великий знак на світлій панелі (сам знак темно-зелений і на
   темній підкладці зник би), назва, рядок про себе, місто і строк.
   Дії у візитівці різні: головна веде на сторінку церкви, сторінка
   церкви — на її сайт, тому кнопки приходять ззовні (`actions`).
   Сцена темна в обох темах — це кадр, а не текст.
   ──────────────────────────────────────────────────────────────── */

export default function ChurchScene({
  church,
  actions,
  source,
}: {
  church: AmbassadorDetail;
  actions: ReactNode;
  /** Для події `promo_play`: звідки запустили фільм. */
  source: "home" | "ambassador" | "about";
}) {
  const { lang } = useLang();
  const t = useT();
  const copy = church.copy[lang];
  const accent = church.accent;
  /* «Разом — 1,5 року будуємо процеси»: останній з фактів церкви. */
  const since = copy.facts[copy.facts.length - 1];
  /* Повний зал стоїть у «Про церкву», а не в галереї — тому шукаємо і там.
     Підписи — з картки церкви, тож мова збігається. */
  const pool = [...copy.gallery, copy.aboutPhoto];
  const photos = SCENE_PHOTOS.map((src) => pool.find((p) => p.src === src)).filter(
    (p): p is { src: string; alt: string } => !!p
  );
  const [shown, setShown] = useState(0);
  const stage = useRef<HTMLElement>(null);
  const promo = church.promo;
  const [promoOpen, setPromoOpen] = useState(false);
  const closePromo = useCallback(() => setPromoOpen(false), []);
  const loop = useRef<HTMLVideoElement>(null);
  /* Петля пішла — фото під нею більше не міняємо. */
  const [looping, setLooping] = useState(false);

  /* Фон міняється сам: кадр за кадром із плавним переходом і легким
     наближенням (2026-09-23). Не крутиться, коли сцена поза екраном або
     людина просить менше руху. */
  useEffect(() => {
    const el = stage.current;
    if (!el || photos.length < 2 || looping) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setShown((i) => (i + 1) % photos.length), STEP_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [photos.length, looping]);

  /* Під кнопкою крутиться сам фільм — беззвучний шматок на 14 секунд
     (2026-09-30); як і коли він вантажиться — у use-promo-loop.ts. */
  usePromoLoop(stage, loop, promo?.loop, promoOpen);

  return (
    <article className="relative isolate overflow-hidden rounded-[28px] md:rounded-[36px] border border-hairline bg-black min-h-[560px] md:min-h-[600px] flex flex-col justify-end p-3 sm:p-5 md:p-8">
      <figure ref={stage} className="absolute inset-0 -z-10 m-0 overflow-hidden">
        {photos.map((p, i) => {
          const on = i === shown;
          return (
            <Image
              key={p.src}
              src={p.src}
              alt={on ? p.alt : ""}
              aria-hidden={!on}
              fill
              sizes="(min-width: 1120px) 1120px, 100vw"
              className="object-cover object-[center_30%]"
              style={{
                opacity: on ? 1 : 0,
                transform: on ? "scale(1.07)" : "scale(1)",
                /* Активний кадр повільно наближається; той, що йде,
                   згасає і лише потім тихо вертає масштаб. */
                transition: on
                  ? "opacity 1.4s ease, transform 7s linear"
                  : "opacity 1.4s ease, transform 0s linear 1.4s",
              }}
            />
          );
        })}
        {promo?.loop && (
          <video
            ref={loop}
            aria-hidden
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            onPlaying={() => setLooping(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: looping ? 1 : 0 }}
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(3,8,18,0.85) 0%, rgba(3,8,18,0.35) 45%, transparent 75%)" }}
        />
        <figcaption className="absolute top-3 right-4 md:top-4 md:right-5 text-[11.5px] text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          {looping ? copy.promoCredit : copy.photoCredit} ·{" "}
          <Link href={church.website} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {copy.photoCreditCta}
          </Link>
        </figcaption>
      </figure>

      {/* ── Промо: кнопка посеред кадру ──
          Займає все місце над візитівкою і стає по його центру. */}
      {promo && (
        <div className="flex-1 flex items-center justify-center py-8">
          <PromoButton
            cta={copy.promoCta}
            label={`${copy.promoCta}: ${copy.promoTitle}, ${promo.duration}`}
            duration={promo.duration}
            accent={accent}
            onClick={() => {
              setPromoOpen(true);
              track("promo_play", { source });
            }}
          />
        </div>
      )}
      {promo && promoOpen && (
        <VideoLightbox
          videoId={promo.videoId}
          title={`${copy.promoTitle} — ${church.name}`}
          closeLabel={t.modal.close}
          onClose={closePromo}
        />
      )}

      {/* ── Візитівка громади: скло ──
          Тим самим прийомом, що й рамка цитати в reviews-panel.tsx:
          градієнтна обводка, глибоке скло, світла риска згори. */}
      <div
        className="relative rounded-[22px] md:rounded-[28px] p-px shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]"
        style={{
          background: `linear-gradient(140deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.04) 62%, color-mix(in oklab, ${accent} 85%, white) 100%)`,
        }}
      >
        {/* Від md — один рядок, але з переносом: кнопки тримають свою
            ширину (shrink-0), а блок із назвою має мінімум 380px і
            росте. Не вміщаються разом (планшет, 768–1100px) — кнопки
            сходять під текст. Без цього назва «Нове Життя» ламалась
            по дві літери в рядку (2026-09-27). */}
        <div className="flex flex-col gap-6 p-5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-10 md:gap-y-6 md:p-8 rounded-[21px] md:rounded-[27px] bg-[rgba(8,16,24,0.55)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
          <div className="flex items-center gap-4 md:gap-5 min-w-0 md:grow md:shrink md:basis-[380px]">
            <span
              className="shrink-0 flex items-center justify-center rounded-[16px] md:rounded-[20px] w-[64px] h-[64px] sm:w-[88px] sm:h-[88px] md:w-[112px] md:h-[112px] p-3 sm:p-4 md:p-5 ring-1 ring-white/30"
              style={{ background: `color-mix(in oklab, ${accent} 8%, #ffffff)` }}
            >
              {church.logo ? (
                <Image src={church.logo} alt={church.name} width={320} height={260} className="w-full h-auto" />
              ) : (
                <span className="font-semibold text-[26px]" style={{ color: accent }}>{church.initials}</span>
              )}
            </span>

            <span className="flex flex-col gap-2 min-w-0">
              <span className="font-semibold text-white text-[24px] md:text-[34px] leading-[1.1] tracking-[-0.8px] md:tracking-[-1.1px]">
                {church.name}
              </span>
              {copy.tagline && (
                <span
                  className="text-[12px] md:text-[13px] font-medium uppercase tracking-[0.16em]"
                  style={{ color: `color-mix(in oklab, ${accent} 45%, white)` }}
                >
                  {copy.tagline}
                </span>
              )}
              <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px] md:text-[15px] text-white/70 leading-[1.35]">
                <LiveDot />
                {church.city}
                <span aria-hidden>·</span>
                {since.value}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:shrink-0">{actions}</div>
        </div>
      </div>
    </article>
  );
}
