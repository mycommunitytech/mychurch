"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Camera, Check, Clock, Coffee, HandHeart, MousePointer2, Music4, SlidersHorizontal, type LucideIcon } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Служіння в блоці огляду — плитки команд, які готують неділю. У
   кожній плитці задача, людина і час. Готовність приходить не по
   черзі, а врозкид: до плитки підлітає курсор тієї людини, вона
   «дописує» — і плитка спалахує зеленим.

   Рядок «що зробив» під задачею прибрано 2026-09-22: він переказував
   заголовок іншими словами. Стан видно по галочці, перекресленню й
   кольору плитки — розкладка при цьому не рухається.
   ──────────────────────────────────────────────────────────────── */

const ORANGE = "#f97316";
const GREEN = "#12a150";

/* У кожної команди свій колір та іконка — плитка впізнається з
   одного погляду, ще до читання назви. */
const KIND_ICONS: Record<string, LucideIcon> = {
  worship: Music4, sermon: BookOpen, sound: SlidersHorizontal, photo: Camera, cafe: Coffee, order: HandHeart,
};
const KIND_ACCENTS: Record<string, string> = {
  worship: "#f05b8b", sermon: "#007aff", sound: "#8b5bf0", photo: "#0ea5e9", cafe: "#f59e0b", order: "#12a150",
};

/* Готовність приходить хаотично: перша команда не раніше цього, далі
   пауза між ними — випадкова в цих межах. Потім усе тримається кілька
   секунд і починається спочатку. */
const FIRST_MS = 1600;
/* Скільки курсор летить від краю картки до обличчя. */
const MOVE_MS = 780;
/* Мить на старті: курсор мусить встигнути стати за межею картки,
   інакше браузер не побачить, звідки почався рух. */
const SPAWN_MS = 90;
/* Дія завершилась — курсор не їде далі, а гасне на місці. */
const LEAVE_MS = 340;
const FADE_MS = 260;
/* Пауза між людьми — довша за виліт попереднього курсора, щоб двоє
   ніколи не були на картці одночасно. */
const GAP_MIN_MS = 1500;
const GAP_RAND_MS = 1500;
const HOLD_MS = 4000;

/* Колір курсора людини, яка саме закриває свою частину. */
const CURSOR_COLORS = ["#0d9488", "#2563eb", "#f05b8b", "#f59e0b"];

/* Курсор однієї людини: свій колір, своя точка появи, своє коротке
   життя. `id` робить кожного окремим вузлом, тож наступний не
   виїжджає з місця попереднього. */
type Ghost = { id: number; x: number; y: number; who: string; color: string; ms: number; out: boolean };

/* Салют із центру картки, коли готові всі. */
const CONFETTI = ["#f97316", "#12a150", "#007aff", "#f05b8b", "#8b5bf0", "#0ea5e9"];

const tint = (color: string, pct: number) => `color-mix(in oklab, ${color} ${pct}%, var(--surface))`;

export default function ServingMini() {
  const t = useT().features.mocks.serving;
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  /* Хто вже сказав, що готовий. */
  const [readyNames, setReadyNames] = useState<string[]>([]);
  const [burst, setBurst] = useState(false);
  /* Один курсор за раз — але кожна людина своя: влітає з випадкового
     боку, тисне своє обличчя і гасне. Один курсор на всіх перетікав
     від імені до імені, наче людина міняє обличчя (2026-09-22). */
  const [cursor, setCursor] = useState<Ghost | null>(null);
  const [pressed, setPressed] = useState(false);
  const faces = useRef<Record<string, HTMLElement | null>>({});

  const pending = t.teams.filter((team) => team.wait);
  const isReady = (team: (typeof t.teams)[number]) => !team.wait || readyNames.includes(team.name);
  const done = t.teams.filter(isReady).length;
  const total = t.teams.length;

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
      /* Без руху показуємо кінцевий стан: усе готове. */
      setReadyNames(pending.map((team) => team.name));
      return;
    }
    /* Порядок щоразу інший — готовність не мусить іти згори вниз. */
    const order = [...pending].sort(() => Math.random() - 0.5);
    const schedule: Record<string, number> = {};
    let at = FIRST_MS;
    for (const team of order) {
      schedule[team.name] = at;
      at += GAP_MIN_MS + Math.round(Math.random() * GAP_RAND_MS);
    }
    const last = at - GAP_MIN_MS;

    setReadyNames([]);
    setBurst(false);
    setPressed(false);

    setCursor(null);

    /* Звідки прилетить: випадкова точка за краєм картки. Щоразу інший
       бік — поява не виглядає завченою, а край картки ховає старт. */
    const spawn = () => {
      const host = hostRef.current;
      if (!host) return null;
      const box = host.getBoundingClientRect();
      const pad = 64;
      const side = Math.floor(Math.random() * 4);
      if (side === 0) return { x: Math.random() * box.width, y: -pad };
      if (side === 1) return { x: box.width + pad, y: Math.random() * box.height };
      if (side === 2) return { x: Math.random() * box.width, y: box.height + pad };
      return { x: -pad, y: Math.random() * box.height };
    };

    /* Куди їхати: центр обличчя тієї людини, яка зараз дописує. */
    const faceOf = (team: (typeof t.teams)[number]) => {
      const host = hostRef.current;
      const face = faces.current[team.name];
      if (!host || !face) return null;
      const h = host.getBoundingClientRect();
      const f = face.getBoundingClientRect();
      return { x: f.left - h.left + f.width * 0.62, y: f.top - h.top + f.height * 0.62 };
    };

    /* Правимо лише свій курсор: чужий уже живе своїм життям. */
    const mine = (id: number, patch: Partial<Ghost>) =>
      setCursor((c) => (c && c.id === id ? { ...c, ...patch } : c));

    const timers: number[] = [];
    order.forEach((team, i) => {
      const color = CURSOR_COLORS[i % CURSOR_COLORS.length];
      const when = schedule[team.name];
      const born = Math.max(0, when - MOVE_MS - SPAWN_MS);

      timers.push(
        window.setTimeout(() => {
          const from = spawn();
          if (from) setCursor({ id: i, ...from, who: team.who, color, ms: 0, out: false });
        }, born)
      );
      timers.push(
        window.setTimeout(() => {
          const to = faceOf(team);
          if (to) mine(i, { ...to, ms: MOVE_MS });
        }, born + SPAWN_MS)
      );
      /* Натиск — коротко, інакше він розтягнувся б на весь політ. */
      timers.push(
        window.setTimeout(() => {
          mine(i, { ms: 120 });
          setPressed(true);
        }, when - 140)
      );
      timers.push(
        window.setTimeout(() => {
          setPressed(false);
          setReadyNames((names) => [...names, team.name]);
        }, when)
      );
      /* Справу зроблено — курсор гасне тут же і зникає з картки. */
      timers.push(window.setTimeout(() => mine(i, { out: true }), when + LEAVE_MS));
      timers.push(
        window.setTimeout(() => setCursor((c) => (c && c.id === i ? null : c)), when + LEAVE_MS + FADE_MS)
      );
    });
    timers.push(window.setTimeout(() => setBurst(true), last));
    timers.push(window.setTimeout(() => setRun((n) => n + 1), last + HOLD_MS));
    return () => timers.forEach(clearTimeout);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [live, run]);

  return (
    <div
      ref={hostRef}
      className="relative w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span
          aria-hidden
          className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
          style={{ background: done === total ? GREEN : ORANGE }}
        />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.caption}</span>
        <span className="ml-auto shrink-0 text-[11.5px] leading-none tabular-nums">
          {done === total ? (
            <span key={`ready-${run}`} className="pin-in inline-block font-semibold" style={{ color: GREEN }}>
              {t.full}
            </span>
          ) : (
            <span className="text-ink-3">
              {t.readyLabel} {done} {t.of} {total}
            </span>
          )}
        </span>
      </div>

      <div className="mock-on grid grid-cols-2 gap-2 p-3">
        {t.teams.map((team, i) => {
          const ready = isReady(team);
          const accent = KIND_ACCENTS[team.kind] ?? ORANGE;
          const Icon = KIND_ICONS[team.kind] ?? Music4;
          return (
            <div
              key={team.name}
              className={[
                /* Стан видно по всій плитці: готова світиться кольором
                   команди й зеленою рамкою, ще в роботі — сіра з
                   пунктиром. Рухатись плитка не мусить, тож підсвітка
                   лежить у тіні, а не в розмірі (2026-09-22). */
                "mock-row relative rounded-xl border-2 p-2.5 flex flex-col gap-2 transition-all duration-500",
                team.wide ? "col-span-2" : "col-span-1",
                ready ? "" : "border-dashed",
              ].join(" ")}
              style={{
                background: ready ? tint(accent, 8) : "var(--surface-2)",
                borderColor: ready ? `color-mix(in oklab, ${GREEN} 42%, transparent)` : "var(--hairline-strong)",
                /* Підсвітка лежить у тіні плитки й кольором команди:
                   зелене сяйво на всіх шести перетворювало картку на
                   ялинку. */
                boxShadow: ready
                  ? `0 10px 26px -18px color-mix(in oklab, ${accent} 75%, transparent)`
                  : "none",
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Рядок задачі: коробочка, яку закривають, і сама справа
                  дієсловом. Коли закрили — текст гасне й перекреслюється,
                  як у будь-якому списку задач (2026-09-22). */}
              <div className="flex items-start gap-2">
                <span
                  role="img"
                  aria-label={ready ? t.done : t.wait}
                  className="mt-[1px] w-[17px] h-[17px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center transition-[background-color,border-color] duration-300"
                  style={
                    ready
                      ? { background: GREEN, borderColor: GREEN }
                      : { background: "var(--surface)", borderColor: "var(--hairline-strong)" }
                  }
                >
                  {ready && <Check className="pin-in w-[11px] h-[11px] text-white" strokeWidth={4} />}
                </span>
                <span
                  className={[
                    "flex-1 min-w-0 text-[12px] font-semibold leading-[1.3] transition-colors duration-300",
                    ready ? "text-ink-3 line-through decoration-[1.2px]" : "text-ink",
                  ].join(" ")}
                >
                  {team.title}
                </span>
                {/* Знак команди — праворуч: по ньому плитку впізнають, не
                    читаючи, а місце зліва віддане коробочці задачі. */}
                <span
                  className="w-[22px] h-[22px] rounded-md shrink-0 flex items-center justify-center transition-colors duration-300"
                  style={
                    ready
                      ? { background: tint(accent, 16), color: accent }
                      : { background: "var(--surface-3)", color: "var(--ink-3)" }
                  }
                >
                  <Icon className="w-[13px] h-[13px]" strokeWidth={2.2} />
                </span>
              </div>

              {/* На кому задача і до коли. */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="relative shrink-0"
                  ref={(el) => {
                    faces.current[team.name] = el;
                  }}
                >
                  <PersonAvatar look={lookFor(team.who)} size={22} className="w-[22px] h-[22px]" />
                </span>
                <span className="min-w-0 truncate text-[11px] text-ink-2 leading-none">{team.who}</span>
                <span
                  className="ml-auto shrink-0 inline-flex items-center gap-1 text-[10.5px] font-medium leading-none tabular-nums transition-colors duration-300"
                  style={{ color: ready ? GREEN : "var(--ink-3)" }}
                >
                  <Clock className="w-[11px] h-[11px]" strokeWidth={2.4} />
                  {team.due}
                </span>
              </div>

              {team.chips.length > 0 && (
                <span className="flex items-center gap-1 min-w-0">
                  {team.chips.map((chip, ci) => (
                    <span
                      key={chip}
                      className="pin-in shrink-0 truncate rounded-full px-1.5 py-[3px] text-[10px] font-medium leading-none transition-colors duration-300"
                      style={{
                        background: ready ? tint(accent, 14) : "var(--surface-3)",
                        color: ready ? accent : "var(--ink-3)",
                        maxWidth: team.wide ? 160 : 82,
                        animationDelay: `${300 + ci * 200}ms`,
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                  {team.more && (
                    <span className="shrink-0 text-[10px] text-ink-3 leading-none tabular-nums">{team.more}</span>
                  )}
                </span>
              )}

            </div>
          );
        })}
      </div>

      {/* Курсор людини, яка зараз дописує: влітає з-за краю картки,
          тисне своє обличчя — і гасне, щойно плитка стала зеленою. */}
      {cursor && (
        <span
          key={cursor.id}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 flex flex-col items-start gap-0.5"
          style={{
            color: cursor.color,
            opacity: cursor.out ? 0 : 1,
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) scale(${pressed ? 0.88 : 1})`,
            transition: `transform ${cursor.ms}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${FADE_MS}ms ease-out`,
          }}
        >
          <MousePointer2
            className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] shrink-0"
            strokeWidth={1.5}
          />
          <span
            className="ml-3 rounded-full px-2 py-[3px] text-[10.5px] font-semibold text-white leading-none whitespace-nowrap shadow-[0_6px_14px_-8px_rgba(0,0,0,0.6)]"
            style={{ background: cursor.color }}
          >
            {cursor.who}
          </span>
        </span>
      )}

      {/* Конфеті вистрілює з центру картки, коли готові всі. */}
      {burst && (
        <div key={`burst-${run}`} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
          <div className="relative">
            {Array.from({ length: 28 }, (_, i) => {
              const color = CONFETTI[i % CONFETTI.length];
              const angle = (i / 28) * Math.PI * 2 + (i % 5) * 0.13;
              const reach = 120 + (i % 4) * 38;
              const width = 5 + (i % 3) * 2;
              const height = 9 + (i % 4) * 3;
              const spin = 380 + (i % 6) * 170 * (i % 2 ? -1 : 1);
              return (
                <span
                  key={i}
                  className="confetti-shot absolute left-1/2 top-1/2 rounded-[1px]"
                  style={{
                    width,
                    height,
                    background: color,
                    ["--dx" as string]: `${Math.cos(angle) * reach * 1.45}px`,
                    ["--dy" as string]: `${Math.sin(angle) * reach + 70}px`,
                    ["--spin" as string]: `${spin}deg`,
                    animationDuration: `${1300 + (i % 5) * 180}ms`,
                    animationDelay: `${(i % 4) * 60}ms`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
