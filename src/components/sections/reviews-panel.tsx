"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { warmYoutube, youtubeEmbed, YOUTUBE_ALLOW } from "@/components/shared/clip-player";
import { LEAD_AMBASSADOR } from "@/content/ambassadors";
import { getModuleVideo, getModuleVideoFace } from "@/content/modules/videos";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import PulseRings from "@/components/shared/pulse-rings";

/* ────────────────────────────────────────────────────────────────
   Відгуки — карусель великих записів просто на сторінці (синю панель
   на кшталт закривашки прибрано того ж дня). Рядок людини — у скляній
   рамці на затемненому кадрі; тап — рамка ховається і грає звук.
   Гортається свайпом (scroll-snap), стрілками й крапками.

   Дорогою (2026-09-23): цитата в колі поруч із записом («жах») і запис
   кружечком поруч із цитатою — обидва відхилені на користь тексту
   просто на відео.

   Вкладки з іменами і кнопка «Усі відгуки» прибрані (2026-09-23):
   перемикач читався як меню, а не як відгуки.

   Лише `confirmed` цитати: вигаданий відгук від реальної людини на
   головній стояти не може (див. ambassadors.ts). Коли слайд пішов з
   екрана, його плеєр знімається — два голоси разом не грають.
   ──────────────────────────────────────────────────────────────── */

export default function ReviewsPanel() {
  const { lang } = useLang();
  const t = useT().proof.reviews;
  const church = LEAD_AMBASSADOR;
  const reviews = church.copy[lang].clips.filter(
    (c) => c.confirmed && c.quote && c.speaker && getModuleVideo(c.id) && getModuleVideoFace(c.id)
  );
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /* Який запис грає. Паузи в iframe YouTube ми не бачимо, тож «зупинити»
     = зняти плеєр: слайд пішов з екрана — його запис зникає, повертається
     кадр із цитатою. */
  const [playing, setPlaying] = useState<string | null>(null);
  if (reviews.length === 0) return null;

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const n = (i + reviews.length) % reviews.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i === active) return;
    setActive(i);
    setPlaying(null);
  }

  return (
    <section id="reviews" className="w-full flex flex-col items-center px-5 md:px-8 py-12 sm:py-16 md:py-24 bg-page scroll-mt-24">
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        {/* Без великої синьої панелі (2026-09-23): карусель стоїть просто
            на сторінці, рамка лишилась тільки на самих записах. */}
        <div>
          <span className="block text-[15px] sm:text-[17px] font-medium text-brand leading-[1.35]">
            {t.kicker}
          </span>

          <div
            ref={track}
            onScroll={onScroll}
            aria-roledescription="carousel"
            aria-label={t.kicker}
            className="no-scrollbar mt-6 md:mt-8 flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain"
          >
            {reviews.map((r, i) => (
              <figure
                key={r.id}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${reviews.length}`}
                className="m-0 w-full shrink-0 snap-center"
              >
                <QuoteClip
                  videoId={getModuleVideo(r.id)!}
                  playing={playing === r.id}
                  onPlay={() => setPlaying(r.id)}
                  poster={getModuleVideoFace(r.id)!}
                  quote={r.quote!}
                  name={r.speaker!.name}
                  role={r.speaker!.role}
                  church={church.name}
                />
              </figure>
            ))}
          </div>

          {reviews.length > 1 && (
            <div className="mt-6 md:mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label={t.prev}
                className="w-10 h-10 rounded-full border border-hairline text-ink flex items-center justify-center transition-colors duration-200 hover:bg-ink/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {reviews.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={t.go.replace("{n}", String(i + 1))}
                    aria-current={i === active}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === active ? "w-6 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/50"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label={t.next}
                className="w-10 h-10 rounded-full border border-hairline text-ink flex items-center justify-center transition-colors duration-200 hover:bg-ink/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  );
}

/* Запис із цитатою на кадрі. До тапу — наш постер, затемнення знизу і
   рядок людини, жодного запиту до YouTube; тап — текст іде, на його
   місці плеєр YouTube з автоплеєм (на iPhone — ще тап по їхній кнопці).
   На телефоні кадр вищий (4:5), інакше три рядки цитати не влізуть. */
function QuoteClip({
  videoId,
  playing,
  onPlay,
  poster,
  quote,
  name,
  role,
  church,
}: {
  videoId: string;
  playing: boolean;
  onPlay: () => void;
  /** Чистий кадр із запису, а не обкладинка YouTube: у тієї свій
      заголовок і підпис, і рамка цитати лягала просто на них. */
  poster: string;
  quote: string;
  name: string;
  role: string;
  church: string;
}) {
  const { lang } = useLang();

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-video overflow-hidden rounded-[18px] md:rounded-[24px] bg-black border border-white/15 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
      <Image src={poster} alt="" fill sizes="(max-width: 1120px) 100vw, 1120px" className="object-cover" />

      {playing && (
        <iframe
          src={youtubeEmbed(videoId, lang)}
          title={`${name} · ${church}`}
          className="absolute inset-0 w-full h-full border-0"
          allow={YOUTUBE_ALLOW}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}

      <button
        type="button"
        onClick={onPlay}
        onPointerEnter={warmYoutube}
        onTouchStart={warmYoutube}
        aria-label={`${name}, ${role} · ${church}`}
        className={cn(
          "group absolute inset-0 w-full h-full text-left touch-manipulation transition-opacity duration-300",
          playing ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,10,24,0.75) 0%, rgba(3,10,24,0.35) 40%, transparent 70%)",
          }}
        />
        {/* На телефоні кнопка — у верхньому куті: рамка займає всю ширину
            знизу, а в центрі кадру обличчя. */}
        <span className="sm:hidden absolute right-4 top-4 w-14 h-14 rounded-full bg-[#0069e0] text-white flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
          <PulseRings />
          <Play className="w-6 h-6 fill-current translate-x-[1px]" strokeWidth={0} />
        </span>
        {/* Цитата в рамці. Обводка — градієнт (світло згори зліва,
            синій у правому куті) через p-px на зовнішньому шарі; всередині
            глибоке скло. На верхньому краї — синій значок із лапками, під
            цитатою волосяна лінія і підпис: обличчя з того ж кадру, ім'я,
            роль і плашка церкви. */}
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-4 sm:p-6 md:p-9">
          <span
            className="relative block max-w-[660px] rounded-[20px] md:rounded-[24px] p-px shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]"
            style={{
              background:
                "linear-gradient(140deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.04) 62%, rgba(0,105,224,0.85) 100%)",
            }}
          >
            <span
              aria-hidden
              className="absolute -top-5 left-6 md:left-8 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(0,105,224,0.8)] ring-4 ring-[rgba(8,16,34,0.55)]"
              style={{ background: "linear-gradient(135deg, #3b8cff 0%, #0069e0 100%)" }}
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-5 md:h-5" fill="currentColor">
                <path d="M4 18v-5.2C4 8.6 6.2 6 10 5l.8 1.7C8.6 7.5 7.6 9 7.5 11H10v7H4Zm10 0v-5.2c0-4.2 2.2-6.8 6-7.8l.8 1.7c-2.2.8-3.2 2.3-3.3 4.3H20v7h-6Z" />
              </svg>
            </span>

            <span className="relative flex flex-col gap-4 md:gap-5 rounded-[19px] md:rounded-[23px] bg-[rgba(8,16,34,0.58)] backdrop-blur-xl backdrop-saturate-150 px-5 pt-7 pb-4 md:px-8 md:pt-9 md:pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <span className="font-semibold text-white text-[19px] sm:text-[24px] md:text-[30px] leading-[1.18] tracking-[-0.4px] md:tracking-[-0.9px] [text-wrap:balance]">
                {quote}
              </span>

              <span aria-hidden className="h-px w-full bg-gradient-to-r from-white/25 via-white/10 to-transparent" />

              <span className="flex items-center gap-3 min-w-0">
                {/* Обличчя — з постера того ж запису, без окремих фото. */}
                <span
                  aria-hidden
                  className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full ring-2 ring-white/30 bg-no-repeat"
                  style={{ backgroundImage: `url(${poster})`, backgroundSize: "auto 330%", backgroundPosition: "50% 14%" }}
                />
                <span className="flex flex-col min-w-0 leading-[1.25]">
                  <span className="text-white font-semibold text-[14px] md:text-[15.5px] truncate">{name}</span>
                  <span className="text-white/60 text-[12.5px] md:text-[13.5px] truncate">{role}</span>
                </span>
                <span className="ml-auto shrink-0 hidden sm:inline-flex items-center gap-1.5 h-7 px-3 rounded-full border border-white/15 bg-white/[0.06] text-[12.5px] font-medium text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  {church}
                </span>
              </span>
            </span>
          </span>
          <span className="relative hidden sm:flex shrink-0 w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#0069e0] text-white items-center justify-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            <PulseRings />
            <Play className="w-6 h-6 md:w-7 md:h-7 fill-current translate-x-[1px]" strokeWidth={0} />
          </span>
        </span>
      </button>
    </div>
  );
}
