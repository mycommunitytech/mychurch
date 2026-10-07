"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Cake, CalendarDays, Check, HeartHandshake, Send } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Малі групи в блоці огляду — одна зустріч цілком, в одній картинці:
   коли і де вона (подія), що читають і які матеріали до неї (тема),
   хто був (явка) і в кого на тижні день народження.

   Список іде одним стовпчиком на п'ятьох: дві колонки з галочками
   читались як таблиця (2026-09-22). Тиждень по всіх днях лишився у
   великому демо на /modules/groups.
   ──────────────────────────────────────────────────────────────── */

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
/* Молитва — фірмовим синім, а не бірюзою картки: серед галочок явки
   вона має читатись як інша річ. Токен, а не хекс, щоб у темній темі
   синій світлішав разом з усім сайтом (2026-09-22). */
const BLUE = "var(--brand)";
const TICK_MS = 340;
const HOLD_MS = 2600;

const tint = (color: string, pct: number) => `color-mix(in oklab, ${color} ${pct}%, var(--surface))`;

export default function GroupsMini() {
  const t = useT().features.mocks.groups;
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  const [ticks, setTicks] = useState(0);

  /* Галочки лягають підряд по присутніх: того, кого немає, черга обходить. */
  let seen = 0;
  const roster = t.members.map((m) => ({ ...m, order: m.missing ? -1 : seen++ }));
  const present = seen;

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
      const still = window.setTimeout(() => setTicks(present), 0);
      return () => clearTimeout(still);
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setTicks(0), 0));
    for (let i = 1; i <= present; i++) {
      timers.push(window.setTimeout(() => setTicks(i), TICK_MS * i));
    }
    timers.push(window.setTimeout(() => setRun((n) => n + 1), TICK_MS * present + HOLD_MS));
    return () => timers.forEach(clearTimeout);
  }, [live, run, present]);

  return (
    <div
      ref={hostRef}
      className="w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      {/* Подія: яка група, коли і де зустрічається. */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TEAL }} />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.name}</span>
        <span className="ml-auto shrink-0 flex items-center gap-1.5 text-[11.5px] text-ink-3 leading-none">
          <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.2} />
          {t.when}
        </span>
      </div>

      <div className="px-4 py-3.5 flex flex-col gap-3">
        {/* Тема — і матеріали, які до неї вже приготували. */}
        <span className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: tint(TEAL, 8) }}>
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: tint(TEAL, 16), color: TEAL }}
          >
            <BookOpen className="w-[15px] h-[15px]" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink leading-none truncate">{t.topic}</span>
            <span className="text-[11px] text-ink-3 leading-none truncate">{t.materials}</span>
          </span>
        </span>

        {/* Явка поіменно — один стовпчик: ім'я, привід подзвонити й галочка. */}
        <ul className="flex flex-col divide-y divide-hairline">
          {roster.map((m) => {
            const ticked = !m.missing && m.order < ticks;
            return (
              <li key={m.name} className="flex items-center gap-2.5 py-[7px]">
                <PersonAvatar
                  look={lookFor(m.name)}
                  size={28}
                  className={cn("w-7 h-7 shrink-0 transition-all duration-300", m.missing && "grayscale opacity-45")}
                />
                <span
                  className={cn(
                    "text-[12.5px] leading-none shrink-0 transition-colors duration-300",
                    m.missing ? "text-ink-3" : "text-ink font-medium"
                  )}
                >
                  {m.name}
                </span>

                {/* День народження бачить лідер просто в списку групи —
                    не треба нікуди заходити, щоб про нього згадати. */}
                {m.birthday && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-medium leading-none truncate"
                    style={{ background: tint(AMBER, 14), color: AMBER }}
                  >
                    <Cake className="w-3 h-3 shrink-0" strokeWidth={2.4} />
                    <span className="truncate">{m.birthday}</span>
                  </span>
                )}
                {/* Молитва стоїть біля того, за кого молимось: лідер
                    бачить потребу там само, де відмічає явку. */}
                {m.prayer && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-medium leading-none min-w-0"
                    style={{ background: tint(BLUE, 14), color: BLUE }}
                  >
                    <HeartHandshake className="w-3 h-3 shrink-0" strokeWidth={2.4} />
                    <span className="truncate">{m.prayer}</span>
                  </span>
                )}
                {m.missing && <span className="text-[11px] text-ink-3 leading-none">{t.away}</span>}

                <span
                  className={cn(
                    "ml-auto w-[18px] h-[18px] rounded-[6px] border-[1.5px] flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-200",
                    !ticked && "border-hairline-strong bg-surface"
                  )}
                  style={ticked ? { background: TEAL, borderColor: TEAL } : undefined}
                >
                  {ticked && <Check className="pin-in w-3 h-3 text-white" strokeWidth={3.6} />}
                </span>
              </li>
            );
          })}
        </ul>

        <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-none tabular-nums" style={{ color: TEAL }}>
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          {t.presentLabel} {t.rate}
        </span>

        {/* Явка сама по собі — просто список. Те, що з неї випливає,
            стоїть тут: людина, якої не було два тижні поспіль, і дія
            поруч. Лідер не мусить це помічати сам (2026-09-22). */}
        <span
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ background: tint(AMBER, 10), border: `1px solid ${tint(AMBER, 30)}` }}
        >
          <PersonAvatar look={lookFor(t.nudge.who)} size={26} className="w-[26px] h-[26px] shrink-0" />
          <span className="min-w-0 flex-1 text-[11.5px] leading-[1.35] text-ink">
            <b className="font-semibold">{t.nudge.who}</b> {t.nudge.text}
          </span>
          <span
            className="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold leading-none text-white"
            style={{ background: AMBER }}
          >
            <Send className="w-3 h-3" strokeWidth={2.4} />
            {t.nudge.action}
          </span>
        </span>
      </div>
    </div>
  );
}
