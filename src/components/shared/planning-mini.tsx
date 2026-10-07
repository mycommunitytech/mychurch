"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Clock, Megaphone, MousePointer2, Music4, Sparkles, Video, Wine, type LucideIcon } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Планування служіння в блоці огляду — стрічка часу однієї неділі:
   вісь із годинами ліворуч, а блоки служіння заввишки рівно такі,
   скільки тривають. Видно форму служіння — довге прославлення,
   коротке відео, довга проповідь — а не рівні рядки таблиці.

   Рядки однакової висоти прибрані 2026-09-22: план виглядав як
   список, хоч головне в ньому — таймінг. Велике демо з пісенником
   і диктуванням лишилось на /modules/service-planning; рядки плану
   беруться ті самі, що й там.
   ──────────────────────────────────────────────────────────────── */

const ACCENT = "#ea580c";
/* Кожен блок служіння має свій колір — той самий, що й у великому
   демо модуля: по ньому впізнаєш прославлення чи проповідь. */
const KIND_ICONS: Record<string, LucideIcon> = {
  worship: Music4, prayer: Sparkles, video: Video, sermon: BookOpen, announce: Megaphone, communion: Wine,
};
const KIND_ACCENTS: Record<string, string> = {
  worship: "#f05b8b", prayer: "#8b5bf0", video: "#0ea5e9", sermon: "#007aff", announce: "#f59e0b", communion: "#12a150",
};

/* Скільки пікселів у хвилині служіння і найменша висота блоку, в яку
   ще влазить рядок з іменем. */
const PX_PER_MIN = 2.4;
const MIN_H = 30;
/* Блок такий високий, що в ньому видно й другий рядок. */
const TALL_MIN = 20;

/* Крок між підтвердженнями і пауза перед наступним колом. */
const ROW_MS = 900;
const REPLAY_MS = 2600;
/* Курсори не на кожному блоці: два — це вже «складають кілька людей»,
   шість перетворювали план на ярмарок. Підпис — роль, а не ім'я.
   Перший — лідер прославлення: він на очах обирає пісні. */
const CURSOR_ROWS: Record<number, string> = { 0: "#f05b8b", 3: "#0d9488" };

/* Скільки пісень лідер встигає поставити в сет на екрані огляду. */
const SET_SONGS = 3;

const tint = (color: string, pct: number) => `color-mix(in oklab, ${color} ${pct}%, var(--surface))`;

/* «10:35» і «1:40» читаються однаково — година з хвилинами. */
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export default function PlanningMini() {
  const t = useT().servicePlanning.plan;
  const hostRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(0);

  /* План складають кілька людей: блоки закриваються один за одним,
     до двох із них підлітає курсор — і все повторюється з початку. */
  const [run, setRun] = useState(0);
  const [live, setLive] = useState(false);

  /* Пісні, які лідер ставить у сет: ті самі, що в пісеннику модуля. */
  const songs = t.library.recent.slice(0, SET_SONGS);

  /* Тривалість блоку — відстань до наступного; в останнього — до
     кінця служіння. */
  const end = toMin(t.items[0].time) + toMin(t.duration);
  const rows = t.items.map((item, i) => {
    const next = i + 1 < t.items.length ? toMin(t.items[i + 1].time) : end;
    return { ...item, minutes: Math.max(1, next - toMin(item.time)) };
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    if (prefersReducedMotion()) {
      const still = window.setTimeout(() => setDone(rows.length), 0);
      return () => clearTimeout(still);
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDone(0), 0));
    for (let i = 1; i <= rows.length; i++) {
      timers.push(window.setTimeout(() => setDone(i), ROW_MS * i));
    }
    timers.push(
      window.setTimeout(() => setRun((n) => n + 1), ROW_MS * rows.length + REPLAY_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [live, run, rows.length]);

  return (
    <div
      ref={hostRef}
      className="w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.title}</span>
        <span className="ml-auto shrink-0 flex items-center gap-1 text-[11.5px] text-ink-3 leading-none tabular-nums">
          <Clock className="w-3 h-3" strokeWidth={2.2} />
          {t.duration}
        </span>
      </div>

      <ol className="mock-on flex flex-col px-3 py-3">
        {rows.map((item, i) => {
          const filled = i < done;
          const accent = KIND_ACCENTS[item.kind] ?? ACCENT;
          const Icon = KIND_ICONS[item.kind] ?? Music4;
          const tall = item.minutes >= TALL_MIN;
          return (
            <li
              key={item.time}
              className="mock-row relative flex items-stretch gap-2"
              style={{ height: Math.max(MIN_H, item.minutes * PX_PER_MIN), animationDelay: `${80 + i * 70}ms` }}
            >
              {/* Вісь часу: година блоку і суцільна лінія крізь усе служіння. */}
              <span className="w-[38px] shrink-0 pt-[3px] text-[11.5px] text-ink-3 leading-none tabular-nums text-right">
                {item.time}
              </span>
              {/* Лінія таймінгу: суцільна вісь крізь усе служіння, а на
                  ній — вузол кожного блоку. Волосяна лінія на екрані
                  майже не читалась (2026-09-22). */}
              <span aria-hidden className="relative w-[11px] shrink-0">
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full"
                  style={{ background: `color-mix(in oklab, ${ACCENT} 22%, var(--hairline))` }}
                />
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-[2px] w-[9px] h-[9px] rounded-full border-2 border-surface transition-colors duration-300"
                  style={{ background: filled ? accent : "var(--hairline-strong)" }}
                />
              </span>

              {/* Сам блок: заввишки рівно стільки, скільки триває. */}
              <span
                className="flex-1 min-w-0 mb-1 rounded-lg border-l-[3px] px-2.5 py-1.5 flex items-start gap-2 transition-colors duration-300"
                style={{ background: tint(accent, filled ? 10 : 5), borderColor: filled ? accent : "var(--hairline-strong)" }}
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0 mt-[1px] transition-colors duration-300"
                  strokeWidth={2.2}
                  style={{ color: filled ? accent : "var(--ink-3)" }}
                />
                <span className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{item.name}</span>
                    <span className="shrink-0 text-[10.5px] text-ink-3 leading-none tabular-nums">
                      {item.minutes} {t.min}
                    </span>
                  </span>
                  {/* Прославлення — єдиний блок, який на очах наповнюється:
                      лідер ставить пісні в сет одну за одною, як у
                      пісеннику на сторінці модуля (2026-09-22). */}
                  {tall && item.kind === "worship" ? (
                    <span className="flex flex-wrap items-center gap-1">
                      {songs.map((song, si) => (
                        <span
                          key={`${run}-${song.name}`}
                          className="pin-in shrink-0 rounded-full px-1.5 py-[3px] text-[10px] font-medium leading-none"
                          style={{
                            background: tint(accent, 12),
                            color: accent,
                            animationDelay: `${240 + si * 420}ms`,
                          }}
                        >
                          {song.name} · {song.tone}
                        </span>
                      ))}
                    </span>
                  ) : (
                    tall && (
                      <span className="text-[11px] text-ink-3 leading-[1.3] line-clamp-2">{item.value || item.role}</span>
                    )
                  )}
                </span>

                {filled ? (
                  <span className="mock-pop relative shrink-0">
                    <PersonAvatar look={lookFor(item.who)} size={22} className="w-[22px] h-[22px]" />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full border-2 border-surface flex items-center justify-center"
                      style={{ background: accent }}
                    >
                      <Check className="w-[6px] h-[6px] text-white" strokeWidth={5} />
                    </span>
                  </span>
                ) : (
                  <span
                    title={t.empty}
                    className="shrink-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-dashed border-hairline-strong"
                  />
                )}
              </span>

              {/* Курсор того, хто саме зараз закриває цей блок. */}
              {CURSOR_ROWS[i] && (
                <span
                  key={`${run}-${item.time}`}
                  aria-hidden
                  className="plan-cursor absolute right-1 -top-1 z-10 flex items-center gap-1.5 pointer-events-none"
                  style={{ color: CURSOR_ROWS[i], animationDelay: `${i * ROW_MS}ms` }}
                >
                  <MousePointer2 className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" strokeWidth={1.5} />
                  <span
                    className="rounded-full px-2 py-[3px] text-[10.5px] font-semibold text-white leading-none whitespace-nowrap shadow-[0_6px_14px_-8px_rgba(0,0,0,0.6)]"
                    style={{ background: CURSOR_ROWS[i] }}
                  >
                    {item.role}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="px-4 pb-3.5 pt-0.5">
        <span className="text-[12px] text-ink-3 leading-[1.35]">
          {done >= rows.length ? t.ready : t.progress.replace("{n}", String(done)).replace("{total}", String(rows.length))}
        </span>
      </div>
    </div>
  );
}
