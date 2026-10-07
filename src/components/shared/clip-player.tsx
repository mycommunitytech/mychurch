"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import PulseRings from "@/components/shared/pulse-rings";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Один плеєр для всіх демо-записів: сторінка модуля, сторінка
   амбасадора і блок амбасадора на головній мали по власній копії.

   Записи — на YouTube-каналі церкви (`videoId`, див.
   src/content/modules/videos.ts). До тапу на екрані тільки наш кадр
   із нашого ж хостингу: жодного запиту до YouTube, ні плеєра, ні
   cookies. Тап монтує youtube-nocookie з автоплеєм; на iPhone це ще
   один тап по їхній кнопці — iOS не дає звук у чужому iframe.

   Прохід на свій файл лишився (`src`, рідний `<video>`) — так записи
   грали з 21 по 30 вересня 2026, і якщо колись повернемось до свого
   хостингу, міняється лише джерело.

   Сам кадр лишається на місці, доки не пішов перший кадр відео, —
   інакше між тапом і картинкою стоїть порожній прямокутник (а в
   темній темі він був ще й білий, бо підкладкою був `bg-ink`, а --ink
   у темній темі майже білий).

   Під мишею «плей» стає курсором (2026-09-30): щойно вона заходить на
   кадр, коло розпливається в таблетку «▶ Дивитись» і м'яко їде за нею,
   а стрілка ховається. Вийшла — таблетка вертається в центр колом. На
   дотик і для тих, хто просить менше руху, кнопка стоїть на місці.
   ──────────────────────────────────────────────────────────────── */

/** Розігріваємо з'єднання з YouTube, коли палець торкнувся картки. */
let warmed = false;
export function warmYoutube() {
  if (warmed || typeof document === "undefined") return;
  warmed = true;
  for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.appendChild(link);
  }
}

/** Адреса вбудованого ролика — одна на всі плеєри сайту. */
export function youtubeEmbed(videoId: string, lang: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    /* Після ролика — тільки інші наші ж записи, а не чужий канал. */
    rel: "0",
    /* Без анотацій і карток поверх кадру: на телефоні вони з'їдають
       пів екрана і ловлять тапи замість самого відео. */
    iv_load_policy: "3",
    /* YouTube знає українську як «uk»; наш код локалі — «ua». */
    hl: lang === "ua" ? "uk" : lang,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

/** Дозволи для iframe плеєра: автоплей, фулскрін, картинка в картинці. */
export const YOUTUBE_ALLOW =
  "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";

export default function ClipPlayer({
  src,
  videoId,
  poster,
  title,
  label,
  accent,
  size = "lg",
  badge,
  cta,
  onPlay,
  className,
}: {
  /** Ролик на YouTube — id з посилання `youtu.be/<id>`. */
  videoId?: string;
  /** Запасний шлях: свій файл, `/clips/people.mp4`. Якщо є — грає замість YouTube. */
  src?: string;
  poster?: string;
  title: string;
  /** Що промовляє скрінрідер на кнопці; за замовчуванням — назва запису. */
  label?: string;
  accent: string;
  size?: "md" | "lg";
  /** Напис у кутку постера — «Відео». */
  badge?: string;
  /** Текст на кнопці. З ним кнопка — таблетка на всю фразу, без нього — коло. */
  cta?: string;
  /** Головна перезапускає курсор-привид, коли запис почали дивитись. */
  onPlay?: () => void;
  className?: string;
}) {
  const { lang } = useLang();
  const watch = useT().player.watch;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  /* Готовність = пішов перший кадр. Доки ні — тримаємо постер. */
  const [ready, setReady] = useState(false);

  const posterSrc = poster ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : undefined);

  /* Кнопка-курсор: зсув від центру кадру, до якого вона м'яко доїжджає. */
  const [follow, setFollow] = useState(false);
  const puck = useRef<HTMLSpanElement>(null);
  const aimAt = useRef({ x: 0, y: 0 });
  const at = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  function glide() {
    const p = at.current;
    const t = aimAt.current;
    p.x += (t.x - p.x) * 0.2;
    p.y += (t.y - p.y) * 0.2;
    const done = Math.abs(t.x - p.x) < 0.4 && Math.abs(t.y - p.y) < 0.4;
    if (done) Object.assign(p, t);
    if (puck.current) puck.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
    frame.current = done ? 0 : requestAnimationFrame(glide);
  }

  function aim(e: React.PointerEvent<HTMLButtonElement> | null) {
    if (e) {
      const r = e.currentTarget.getBoundingClientRect();
      aimAt.current = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
    } else aimAt.current = { x: 0, y: 0 };
    if (!frame.current) frame.current = requestAnimationFrame(glide);
  }

  function onEnter(e: React.PointerEvent<HTMLButtonElement>) {
    if (!src) warmYoutube();
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setFollow(true);
    aim(e);
  }

  function onLeave() {
    if (!follow) return;
    setFollow(false);
    aim(null);
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function start() {
    /* play() викликаємо просто в обробнику тапу: iOS дозволяє звук,
       лише поки триває жест, і чекати перемалювання React не можна.
       Якщо браузер усе ж відмовив — прибираємо кільце й лишаємо
       людині рідну кнопку плеєра, а не вічне очікування. */
    video.current?.play().catch(() => setReady(true));
    setPlaying(true);
    onPlay?.();
  }

  return (
    <div
      className={cn(
        /* Підкладка чорна в обох темах: це рамка відео, а не текст,
           і вона не має світлішати разом зі сторінкою. */
        "relative w-full aspect-video overflow-hidden bg-black",
        className
      )}
    >
      {src ? (
        <video
          ref={video}
          src={src}
          preload="none"
          playsInline
          controls={playing}
          controlsList="nodownload"
          /* Ховаємо кадр на першій декодованій кадрині, а не на події
             `playing`: та приходить із запізненням, і перші секунди
             відео грали під постером — чути голос, видно картинку. */
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          /* Файла немає або мережа впала — вертаємось до кадру з
             кнопкою, а не лишаємо чорний прямокутник. */
          onError={() => {
            setPlaying(false);
            setReady(false);
          }}
          className={cn("absolute inset-0 w-full h-full object-contain", !playing && "pointer-events-none")}
        />
      ) : (
        playing &&
        videoId && (
          <iframe
            src={youtubeEmbed(videoId, lang)}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            onLoad={() => setReady(true)}
            allow={YOUTUBE_ALLOW}
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )
      )}

      {posterSrc && (
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          unoptimized={!poster}
          className={cn(
            "object-cover transition-opacity duration-500",
            playing && ready && "opacity-0 pointer-events-none"
          )}
        />
      )}

      {playing && !ready && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="w-10 h-10 rounded-full border-[3px] border-white/25 border-t-white animate-spin" />
        </span>
      )}

      {!playing && (
        <button
          type="button"
          onClick={start}
          onPointerEnter={onEnter}
          onPointerMove={(e) => follow && aim(e)}
          onPointerLeave={onLeave}
          onTouchStart={src ? undefined : warmYoutube}
          aria-label={label ?? title}
          /* touch-manipulation прибирає пів секунди очікування подвійного
             тапу — без нього перше натискання на телефоні «не помічають». */
          className={cn(
            "group absolute inset-0 w-full h-full touch-manipulation",
            follow ? "cursor-none" : "cursor-pointer"
          )}
        >
          {/* Без затемнення: кадр — обкладинка з YouTube, і вона має
              виглядати так само, як на каналі. Градієнт був для чистих
              кадрів, де кнопка губилась на світлому фоні. */}
          {badge && (
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white leading-none backdrop-blur">
              {badge}
            </span>
          )}
          <span
            ref={puck}
            className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {cta ? (
              /* data-demo — щоб курсор-привид знав, куди йти; поза
                 CursorDemo атрибут просто лежить без діла. */
              <span
                data-demo="hover"
                className="relative flex items-center gap-3 h-14 md:h-16 pl-3 pr-6 md:pl-3.5 md:pr-8 rounded-full text-white shadow-[0_14px_36px_-12px_rgba(0,0,0,0.65)] transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95"
                style={{ background: accent }}
              >
                <PulseRings />
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 md:w-[18px] md:h-[18px] fill-current translate-x-[1px]" strokeWidth={0} />
                </span>
                <span className="font-semibold text-[16px] md:text-[18px] tracking-[-0.3px] whitespace-nowrap">
                  {cta}
                </span>
              </span>
            ) : (
              <span
                data-demo="hover"
                className={cn(
                  "relative rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-[padding,transform] duration-300 ease-out group-active:scale-95",
                  size === "lg" ? "min-w-[72px] h-[72px] md:min-w-16 md:h-16" : "min-w-[68px] h-[68px] md:min-w-14 md:h-14",
                  follow ? "px-5 md:px-6" : "group-hover:scale-105"
                )}
                style={{ background: accent }}
              >
                {/* Хвилі — біля кнопки в спокої; таблетка-курсор їде без них. */}
                {!follow && <PulseRings />}
                <Play
                  className={cn(size === "lg" ? "w-7 h-7" : "w-6 h-6", "shrink-0 fill-current translate-x-[1px]")}
                  strokeWidth={0}
                />
                <span
                  aria-hidden
                  className={cn(
                    "overflow-hidden whitespace-nowrap font-semibold text-[16px] md:text-[17px] tracking-[-0.3px] transition-[max-width,opacity,margin] duration-300 ease-out",
                    follow ? "max-w-[160px] opacity-100 ml-2.5" : "max-w-0 opacity-0 ml-0"
                  )}
                >
                  {watch}
                </span>
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
