"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Play, Quote, X } from "lucide-react";
import { youtubeEmbed, YOUTUBE_ALLOW } from "@/components/shared/clip-player";
import { useFocusTrap } from "@/components/shared/use-focus-trap";
import { LEAD_AMBASSADOR } from "@/content/ambassadors";
import { getModuleClipPreview, getModuleVideo, getModuleVideoFace } from "@/content/modules/videos";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import PulseRings from "@/components/shared/pulse-rings";

/* ────────────────────────────────────────────────────────────────
   Обличчя церкви-амбасадора рейкою кружечків. Кружечок — не декор:
   у ньому грає тиха шестисекундна петля з того самого запису (~70 КБ,
   public/clips/preview/), а клік відкриває повний запис зі звуком.
   Прямокутні плеєри в ряд були б 80 МБ, стіною однакових кадрів — і
   все одно мовчали б до тапу, бо автоплей зі звуком браузер не дасть.

   Грає завжди один: активний. Решта стоїть кадром, а доріжка по колу
   показує, скільки лишилось, — щойно уривок скінчився, черга переходить
   до сусіда. Наведення забирає чергу собі: дивимось того, на кого
   дивиться людина, а не того, до кого дійшов лічильник.

   Хто саме стоїть на головній — вирішує церква: `featured` у
   ambassadors.ts. Підпис під рейкою — слова того, хто зараз грає, і
   лише ті, що людина підтвердила (`confirmed`). Решта записів підписані
   темою: переказувати за людину ми не будемо.
   ──────────────────────────────────────────────────────────────── */

/** Скільки облич на головній; решта записів — на сторінці церкви. */
const TOP = 4;

/* Страхувальник: уривок ~6 секунд, але як відео не доїхало — черга все
   одно має йти далі. */
const FALLBACK_MS = 9000;

const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia(RM_QUERY).matches;
const getReducedServer = () => false;

/* Позиція елемента в розмітці, без огляду на трансформації. Саме тому
   не getBoundingClientRect: блок з'їжджає в кадр анімацією scale, і під
   час неї прямокутники стиснуті до центру — хвостик ставав не під тим
   обличчям. offsetLeft трансформацій не бачить. */
function layoutLeft(el: HTMLElement | null) {
  let x = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return x;
}

export default function VoiceBubbles({ accent }: { accent: string }) {
  const t = useT();
  const { lang } = useLang();
  const copy = t.proof.voices;

  /* Назви модулів — зі словника: жодного рядка, який розходився б із каталогом. */
  const names = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of t.modules.groups) for (const item of group.items) map.set(item.id, item.name);
    return map;
  }, [t]);

  const voices = useMemo(() => {
    const ready = LEAD_AMBASSADOR.copy[lang].clips.filter(
      (clip) => clip.speaker && getModuleVideo(clip.id) && getModuleClipPreview(clip.id)
    );
    /* Церква позначила четвірку сама; якщо не позначила — беремо по
       одному запису на людину, щоб те саме обличчя не стояло двічі. */
    let picked = ready.filter((clip) => clip.featured);
    if (!picked.length) {
      const best = new Map<string, (typeof ready)[number]>();
      for (const clip of ready) {
        const have = best.get(clip.speaker!.name);
        if (!have || (!have.confirmed && clip.confirmed)) best.set(clip.speaker!.name, clip);
      }
      picked = [...best.values()];
    }
    return picked.slice(0, TOP).map((clip) => ({
      id: clip.id,
      speaker: clip.speaker!,
      /* Непідтверджена цитата — наша чернетка, тож на головну не йде. */
      quote: clip.confirmed ? clip.quote : undefined,
      topic: names.get(clip.id) ?? clip.id,
      videoId: getModuleVideo(clip.id)!,
      preview: getModuleClipPreview(clip.id)!,
      poster: getModuleVideoFace(clip.id),
    }));
  }, [lang, names]);

  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  /* Записів може не бути зовсім: public/clips/ поза репозиторієм, і на
     свіжій копії там порожньо. Тоді замість чорного прямокутника в колі
     лишається кадр, а черга їде далі по таймеру. */
  const [failed, setFailed] = useState<string[]>([]);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  const railRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useFocusTrap(winRef, open !== null);

  /* Хвостик рамки стоїть рівно під тим обличчям, чиї це слова: без нього
     не видно, за ким закріплений відгук. Позицію міряємо по DOM — рейка
     на телефоні ще й гортається, тож перераховуємо на скрол і на зміну
     розміру. `null` = хвостик ховається (обличчя виїхало за рамку). */
  const [tailX, setTailX] = useState<number | null>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const count = voices.length;
  const activeIdx = count ? (hover ?? step % count) : 0;

  useLayoutEffect(() => {
    const rail = railRef.current;
    const frame = frameRef.current;
    if (!rail || !frame) return;
    const measure = () => {
      const face = faceRefs.current[activeIdx];
      if (!face) return setTailX(null);
      const x = layoutLeft(face) + face.offsetWidth / 2 - layoutLeft(frame) - rail.scrollLeft;
      setTailX(x > 24 && x < frame.offsetWidth - 24 ? x : null);
    };
    measure();
    rail.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    ro.observe(frame);
    return () => {
      rail.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [activeIdx, count]);
  const playing = inView && open === null && !reduced && count > 0;

  /* Доріжку рухаємо кадрами, а не станом: `timeupdate` приходить разів
     чотири на секунду — це видно як ривки. */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const v = vidRef.current;
      const ring = ringRef.current;
      if (v && ring && v.duration) ring.setAttribute("stroke-dashoffset", String(1 - v.currentTime / v.duration));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, activeIdx]);

  /* Уривок скінчився — черга йде далі; таймер лише страхує. */
  const advance = () => setStep((s) => (count ? (s + 1) % count : 0));
  useEffect(() => {
    if (!playing || hover !== null || count < 2) return;
    const id = setTimeout(advance, FALLBACK_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, hover, count, step]);

  /* Поки відкрито повний запис — сторінка під ним не їздить. */
  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!count) return null;

  const active = voices[activeIdx];
  const shown = open !== null ? voices[open] : null;

  return (
    /* w-full і min-w-0 обов'язкові: у колонці з items-center цей вузол
       інакше розтягується по вмісту рейки (чотири обличчя — це 636 px на
       телефоні), і тоді рамка з цитатою «шириною 100%» виходить за екран,
       а сцена обрізає її своїм overflow-hidden. */
    <div className="w-full min-w-0 flex flex-col items-center gap-8 md:gap-10">
      {/* На телефоні рейка гортається пальцем, на десктопі стоїть по центру. */}
      <div
        ref={railRef}
        /* Центруємо автополями першого й останнього, а не justify-center:
           коли чотири обличчя ширші за блок, justify-center зрізає ліве
           й доскролити до нього неможливо — а заразом збиває розрахунок
           хвостика. Автополя в такому разі просто стають нулем. */
        /* py-3: overflow-x-auto вмикає і вертикальне обрізання, тож
           збільшене (scale) активне коло зрізало згори. */
        className="w-full flex gap-3 md:gap-6 py-3 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto"
      >
        {voices.map((voice, i) => {
          const on = i === activeIdx;
          return (
            <button
              key={`${voice.id}-${i}`}
              type="button"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
              onFocus={() => setHover(i)}
              onBlur={() => setHover((h) => (h === i ? null : h))}
              onClick={() => setOpen(i)}
              aria-label={copy.play.replace("{name}", voice.speaker.name)}
              className={cn(
                "group shrink-0 w-[150px] md:w-[210px] flex flex-col items-center gap-3 text-center",
                "transition-opacity duration-300",
                on ? "opacity-100" : "opacity-55 hover:opacity-80"
              )}
            >
              {/* Знак відтворення і доріжка лежать поза круглою маскою:
                  усередині неї їх зрізало кутом. */}
              <span
                ref={(el) => { faceRefs.current[i] = el; }}
                className={cn(
                  "relative w-[142px] h-[142px] md:w-[196px] md:h-[196px]",
                  "transition-transform duration-300 group-hover:scale-[1.04]",
                  on && "scale-[1.04]"
                )}
              >
                <span
                  className="absolute inset-0 rounded-full overflow-hidden bg-surface-3"
                  style={{
                    boxShadow: on
                      ? `0 14px 30px -18px color-mix(in oklab, ${accent} 80%, transparent)`
                      : "0 0 0 1px var(--hairline)",
                  }}
                >
                  {/* Обидва шари трохи більші за коло і зсунуті вниз: у
                      петлі знизу вписано «mychurch.com.ua» (його додає
                      scripts/clip-previews.sh), і в кружечку той напис
                      читався як сміття. Тягнемо від верхнього краю
                      (`origin-top`): так із кадру виходить низ із написом,
                      а голова лишається на місці — зі звичайним масштабом
                      від центру вона зрізалась. Кадр і відео їдуть
                      однаково, щоб обличчя не стрибало на старті. */}
                  {voice.poster && (
                    <Image
                      src={voice.poster}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 142px, 196px"
                      className="object-cover object-[50%_28%] scale-[1.14] origin-top"
                    />
                  )}
                  {on && playing && !failed.includes(voice.id) && (
                    <video
                      ref={vidRef}
                      key={voice.id}
                      src={voice.preview}
                      autoPlay
                      muted
                      playsInline
                      preload="none"
                      onError={() => setFailed((f) => (f.includes(voice.id) ? f : [...f, voice.id]))}
                      onEnded={(e) => {
                        /* Черга йде далі сама. А поки на обличчя дивляться,
                           уривок просто починається спочатку: інакше він
                           завмирав би на останньому кадрі, а доріжка — на
                           повному колі. */
                        if (hover === null) return advance();
                        const v = e.currentTarget;
                        v.currentTime = 0;
                        void v.play();
                      }}
                      className="absolute inset-0 w-full h-full object-cover scale-[1.14] origin-top"
                    />
                  )}
                </span>

                {/* Доріжка по колу: видно, скільки лишилось до сусіда. */}
                <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle cx="50" cy="50" r="49" fill="none" stroke="var(--hairline)" strokeWidth="1.6" />
                  {on && (
                    <circle
                      ref={ringRef}
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke={accent}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                    />
                  )}
                </svg>

                <span
                  aria-hidden
                  className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 w-[34px] h-[34px] md:w-[40px] md:h-[40px] rounded-full flex items-center justify-center ring-2 ring-page transition-transform duration-150 group-hover:scale-110"
                  style={{ background: accent }}
                >
                  <PulseRings color={accent} />
                  <Play className="w-[15px] h-[15px] md:w-[17px] md:h-[17px] text-white translate-x-[0.5px]" fill="currentColor" strokeWidth={0} />
                </span>
              </span>

              <span className="flex flex-col items-center gap-1.5">
                <span className="text-[14px] md:text-[15.5px] font-medium text-ink leading-[1.25] tracking-[-0.2px]">
                  {voice.speaker.name}
                </span>
                {/* Хто це в церкві — під іменем, а не тільки в цитаті:
                    «пастор» і «лідер медіа» читаються інакше (2026-09-22). */}
                <span className="text-[12.5px] md:text-[13px] text-ink-3 leading-[1.25]">
                  {voice.speaker.role}
                </span>
                {/* Про що саме ця людина говорить — плашкою, а не сірим
                    рядком: це назва модуля, а не підпис (2026-09-22). */}
                <span
                  className="rounded-full px-2.5 py-1 text-[12px] md:text-[12.5px] font-medium leading-none transition-colors duration-300"
                  style={{
                    background: on
                      ? `color-mix(in oklab, ${accent} 20%, var(--surface))`
                      : `color-mix(in oklab, ${accent} 10%, var(--surface))`,
                    color: accent,
                  }}
                >
                  {voice.topic}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Те, що людина каже, — великим блоком: це головне в розділі, а не
          підпис під картинкою (2026-09-22). Немає підтверджених слів —
          стоїть тема запису. Висота тримається, щоб рейка не стрибала,
          коли цитата коротша за сусідню. */}
      <div
        ref={frameRef}
        /* aria-live саме тут, на сталій рамці: у <p> нижче міняється key,
           тобто вузол перемонтовується, і читалка про зміну не дізнається. */
        aria-live="polite"
        className="relative w-full max-w-[900px] rounded-[24px] md:rounded-[28px] border px-6 py-8 md:px-12 md:py-11 flex flex-col items-center gap-5 md:min-h-[212px] justify-center"
        style={{
          borderColor: `color-mix(in oklab, ${accent} 28%, var(--hairline-strong))`,
          background: `color-mix(in oklab, ${accent} 8%, var(--surface))`,
        }}
      >
        {/* Хвостик рамки — під обличчям того, чиї це слова. */}
        {tailX !== null && (
          <span
            aria-hidden
            className="absolute -top-[11px] w-5 h-5 rotate-45 rounded-[4px] transition-[left] duration-500 ease-out"
            style={{
              left: tailX - 10,
              background: `color-mix(in oklab, ${accent} 8%, var(--surface))`,
              borderTop: `1px solid color-mix(in oklab, ${accent} 28%, var(--hairline-strong))`,
              borderLeft: `1px solid color-mix(in oklab, ${accent} 28%, var(--hairline-strong))`,
            }}
          />
        )}
        <Quote aria-hidden className="w-8 h-8 md:w-9 md:h-9 shrink-0" strokeWidth={1.6} style={{ color: accent }} />
        <p
          key={`${active.id}-${activeIdx}`}
          /* w-full обов'язкове: у колонці з items-center дитина інакше
             отримує ширину по вмісту, і на телефоні рядок цитати виїжджав
             за краї екрана. */
          className="w-full text-center"
          style={{ animation: "revealUp 0.4s var(--ease-out-soft) both" }}
        >
          <span
            className={cn(
              "block font-semibold text-ink leading-[1.25] tracking-[-0.6px] md:tracking-[-1px]",
              "text-[22px] sm:text-[28px] md:text-[36px]"
            )}
          >
            {active.quote ? <>«{active.quote}»</> : copy.about.replace("{name}", active.topic)}
          </span>
          {/* Ще раз обличчя — тепер у самій рамці: хто це сказав, видно
              і тоді, коли рейка з'їхала вбік (2026-09-22). */}
          <span className="mt-5 flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] text-ink-2">
            {active.poster && (
              <span className="relative w-8 h-8 rounded-full overflow-hidden shrink-0" style={{ boxShadow: `0 0 0 2px color-mix(in oklab, ${accent} 45%, transparent)` }}>
                <Image src={active.poster} alt="" fill sizes="32px" className="object-cover object-[50%_28%] scale-[1.14] origin-top" />
              </span>
            )}
            <span className="font-medium text-ink">{active.speaker.name}</span>
            <span className="text-ink-3">· {active.speaker.role}</span>
          </span>
        </p>
      </div>

      <span className="w-full text-center text-[12.5px] text-ink-3">{copy.hint}</span>

      {/* Вікно виносимо в <body>: усередині сцени воно лишалось би в її
          `overflow-hidden`, а предок із трансформацією робить containing
          block навіть для position: fixed — вікно з'їжджало вниз замість
          того, щоб стояти по центру екрана. */}
      {shown && createPortal(
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            ref={winRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${shown.speaker.name} — ${shown.topic}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[860px] rounded-[20px] overflow-hidden bg-surface border border-hairline shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]"
          >
            {/* Тут запис уже на весь кадр і зі звуком — ролик із каналу
                церкви. На комп'ютері клік по кружечку і є той тап, якого
                браузер чекає; на iPhone — ще тап по кнопці YouTube. */}
            <iframe
              src={youtubeEmbed(shown.videoId, lang)}
              title={`${shown.speaker.name} — ${shown.topic}`}
              allow={YOUTUBE_ALLOW}
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="block w-full aspect-video bg-black border-0"
            />
            <div className="flex flex-col gap-1 px-5 py-4">
              <span className="font-semibold text-ink text-[16px] leading-[1.3] tracking-[-0.3px]">
                {shown.speaker.name} · <span className="font-normal text-ink-2">{shown.speaker.role}</span>
              </span>
              <span className="text-[13.5px] text-ink-3">{copy.about.replace("{name}", shown.topic)}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={copy.close}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center transition-colors hover:bg-black/75"
            >
              <X className="w-[18px] h-[18px]" strokeWidth={2.2} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
