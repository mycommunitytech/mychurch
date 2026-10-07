"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ExternalLink, Loader2, X } from "lucide-react";
import { useCalendly } from "@/context/calendly-context";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { SITE_CALENDLY } from "@/lib/seo";
import { useFocusTrap } from "@/components/shared/use-focus-trap";
import { useBodyScrollLock } from "@/components/shared/use-body-scroll-lock";
import { track } from "@/lib/analytics/client";

/* ────────────────────────────────────────────────────────────────
   Вікно «Оберіть зручний час»: календар Calendly у нашій рамці.

   Не сторінка Calendly в новій вкладці й не їхній спливний віджет зі
   своїм скриптом і оверлеєм, а наш діалог — той самий, що й у модалки
   демо: скло позаду, закриття по Escape і по клацанню поза вікном,
   фокус повертається туди, звідки відкрили. Усередині — iframe із
   календарем у кольорах поточної теми.

   Адреса календаря — SITE_CALENDLY (NEXT_PUBLIC_CALENDLY_URL). Без неї
   вікна не існує: компонент віддає null, а входи до нього не рендеряться.
   Саму адресу iframe (з кольорами теми й ім'ям) збирає контекст у момент
   відкриття — тут лише показуємо те, що дали.
   ──────────────────────────────────────────────────────────────── */

/** Звідки Calendly шле події про кроки людини в календарі. */
const CALENDLY_ORIGIN = "https://calendly.com";

/** Скільки чекаємо на календар, перш ніж запропонувати нову вкладку. */
const STALL_MS = 15000;

/** Документ iframe завантажився, а Calendly так і не озвався — показуємо
    те, що є: далі ховати календар уже нечесно. */
const GRACE_MS = 6000;

export default function CalendlyModal() {
  const t = useT();
  const c = t.calendly;
  const { isOpen, source, src, close } = useCalendly();

  /* Для якої адреси людина вже записалась — у шапці стає «Зустріч
     заплановано». Прив'язка до адреси замість скидання в ефекті: нове
     відкриття — нова адреса, і позначка сама перестає збігатись. */
  const [doneFor, setDoneFor] = useState("");
  const done = src !== "" && doneFor === src;

  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const titleId = useId();

  useFocusTrap(windowRef, isOpen, closeRef);
  useBodyScrollLock(isOpen);

  /* Відкрили / закрили — в аналітику. Скільки записалось, каже
     `scheduled` у події закриття. */
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      track("calendly_open", { source });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      track("calendly_close", { source, scheduled: done });
    }
  }, [isOpen, source, done]);

  /* Calendly повідомляє батьківське вікно про кроки: нам потрібен один —
     зустріч записано. Слухаємо лише їхній origin. */
  useEffect(() => {
    if (!isOpen) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== CALENDLY_ORIGIN) return;
      const event = (e.data as { event?: string } | null)?.event;
      if (event === "calendly.event_scheduled") {
        setDoneFor(src);
        track("calendly_scheduled", { source });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isOpen, source, src]);

  /* Escape закриває. Коли фокус усередині iframe, клавішу бачить уже
     документ Calendly — тоді лишається хрестик. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(e.target as Node)) close();
    },
    [close]
  );

  if (!SITE_CALENDLY) return null;

  const external = src || SITE_CALENDLY;

  return (
    /* Вище за модалку демо (z-50): календар відкривається з неї. */
    <div
      aria-hidden={!isOpen}
      onClick={onBackdrop}
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/40",
        "transition-[opacity,visibility] duration-200",
        isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      )}
    >
      <div
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ willChange: "opacity, transform" }}
        className={cn(
          "relative w-full max-w-[1040px] h-[min(92dvh,800px)] rounded-[20px] sm:rounded-[24px]",
          "bg-surface border border-hairline-strong overflow-hidden flex flex-col",
          "shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-200",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Шапка: що це за вікно, вихід у нову вкладку, хрестик */}
        <div className="shrink-0 flex items-center gap-3 sm:gap-4 h-14 sm:h-16 px-3 sm:px-5 border-b border-hairline bg-surface">
          <span
            aria-hidden
            className="hidden sm:flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"
          >
            <CalendarDays className="w-[17px] h-[17px]" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <h2
              id={titleId}
              className="text-[15px] sm:text-[16px] font-semibold text-ink leading-[1.25] tracking-[-0.2px] truncate"
            >
              {done ? c.doneTitle : c.title}
            </h2>
            <p className="text-[12.5px] text-ink-3 leading-[1.3] truncate">{done ? c.doneText : c.subtitle}</p>
          </div>
          <a
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.openTab}
            title={c.openTab}
            className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full text-[13px] font-medium text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.9} />
            <span className="hidden md:inline">{c.openTab}</span>
          </a>
          <button
            ref={closeRef}
            onClick={close}
            aria-label={c.close}
            className="w-9 h-9 flex items-center justify-center rounded-full text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Сам календар. `key` за адресою: нове відкриття — новий iframe
            зі своїм станом завантаження, без скидань в ефектах. */}
        <div className="relative flex-1 min-h-0 bg-surface">
          {src && (
            <CalendarFrame key={src} src={src} title={c.title} loading={c.loading} blocked={c.blocked} openTab={c.openTab} />
          )}
        </div>
      </div>
    </div>
  );
}

/* iframe із календарем і заглушка поверх нього, поки той не доїхав, — щоб
   не блимав його власний білий екран завантаження (у темній темі особливо).
   Подія load iframe приходить задовго до того, як застосунок Calendly
   намалює календар, тому чекаємо на його перше повідомлення (Calendly
   шле `calendly.event_type_viewed`, коли сторінка готова), а після load —
   щонайбільше кілька секунд. Якщо календар так і не відкрився
   (блокувальник, мережа), підказуємо нову вкладку. */
function CalendarFrame({
  src,
  title,
  loading,
  blocked,
  openTab,
}: {
  src: string;
  title: string;
  loading: string;
  blocked: string;
  openTab: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [stalled, setStalled] = useState(false);
  const graceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const id = setTimeout(() => setStalled(true), STALL_MS);
    const onMessage = (e: MessageEvent) => {
      if (e.origin === CALENDLY_ORIGIN) setLoaded(true);
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(id);
      clearTimeout(graceRef.current);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const onFrameLoad = () => {
    clearTimeout(graceRef.current);
    graceRef.current = setTimeout(() => setLoaded(true), GRACE_MS);
  };

  return (
    <>
      <iframe src={src} title={title} onLoad={onFrameLoad} className="absolute inset-0 w-full h-full border-0" />

      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center bg-surface",
            !stalled && "pointer-events-none"
          )}
        >
          {stalled ? (
            <>
              <p className="text-[14.5px] text-ink-2 leading-[1.5] max-w-[360px]">{blocked}</p>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-hairline-strong bg-surface text-[14.5px] font-medium text-ink hover:bg-surface-3 transition-colors"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={1.9} />
                {openTab}
              </a>
            </>
          ) : (
            <>
              <Loader2 className="w-5 h-5 text-ink-3 animate-spin" aria-hidden />
              <span className="text-[13.5px] text-ink-3">{loading}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
