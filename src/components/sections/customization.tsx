"use client";

import { useEffect, useRef, useState } from "react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { MODULE_ACCENTS, MODULE_ICONS } from "@/components/shared/module-icons";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Кастомізація» — система підлаштовується під церкву.

   Одне вікно і повзунок «Розмір церкви». Рука веде його з 1 200 людей
   до 40 і назад, і все під ним перебудовується одним рухом:

     велика  — три кемпуси, густі натовпи крапок, усі вісім модулів;
     середня — три служіння, натовпи рідшають, частина модулів згортається;
     мала    — одне коло облич довкола «Домашньої групи», три модулі,
               а «Малі групи» вже звуться «Домашні групи».

   Повзунок справжній: відвідувач може потягти його сам, і рука
   відступає, поки він не піде з картки.
   ──────────────────────────────────────────────────────────────── */

type Size = 0 | 1 | 2;

const MIN = 40;
const MAX = 1200;

/* Шкала логарифмічна: інакше мала й середня церква тулились би в
   першій десятій частині повзунка. Круглимо до 5/10/50 — і число
   завжди закінчується на 0 чи 5, тож «людей» не треба відмінювати. */
function peopleAt(p: number) {
  const v = MIN * Math.pow(MAX / MIN, p);
  const step = v >= 200 ? 50 : v >= 100 ? 10 : 5;
  return Math.round(v / step) * step;
}
const sizeAt = (p: number): Size => (p > 0.68 ? 0 : p > 0.3 ? 1 : 2);

/* Модулі, що лишаються ввімкненими в кожній церкві. */
const ON: Record<Size, string[]> = {
  0: ["people", "campuses", "ministries", "groups", "events", "org", "accounting", "rooms"],
  1: ["people", "ministries", "groups", "events", "accounting"],
  2: ["people", "groups", "events"],
};

/* Полотно: по вертикалі пікселі, по горизонталі відсотки — так воно
   однаково тягнеться на телефоні й на широкому екрані. */
const CANVAS_H = 240;
const CY = 108;
const BIG = [17, 50, 83];
const MID = [19, 50, 81];
const R_BIG = 46;
const R_MID = 30;
const N_BIG = 28;
const N_MID = 12;
const N_FACES = 8;
const DOTS = N_BIG * 3;

/* Соняшник: крапки лягають спіраллю із золотим кутом — натовп
   виходить живим і рівним водночас, скільки б крапок у ньому не було. */
function sunflower(i: number, n: number, radius: number) {
  const r = radius * Math.sqrt((i + 0.5) / n);
  const a = i * 2.39996;
  return { dx: r * Math.cos(a), dy: r * Math.sin(a) };
}

type Dot = { x: string; y: number; s: number; on: boolean; face: boolean };

const at = (pct: number, dx = 0) => `calc(${pct}% + ${dx.toFixed(1)}px)`;

function dotAt(size: Size, d: number): Dot {
  const cl = d % 3;
  const k = Math.floor(d / 3);
  if (size === 0) {
    const { dx, dy } = sunflower(k, N_BIG, R_BIG);
    return { x: at(BIG[cl], dx), y: CY + dy, s: 9, on: true, face: false };
  }
  if (size === 1) {
    /* Зайві крапки стягуються в середину свого натовпу й гаснуть. */
    if (k >= N_MID) return { x: at(MID[cl]), y: CY, s: 0, on: false, face: false };
    const { dx, dy } = sunflower(k, N_MID, R_MID);
    return { x: at(MID[cl], dx), y: CY + dy, s: 12, on: true, face: false };
  }
  if (d >= N_FACES) return { x: at(50), y: CY, s: 0, on: false, face: false };
  /* Мала церква: не натовп, а коло облич — тут кожного знають в лице. */
  const a = (d / N_FACES) * Math.PI * 2 - Math.PI / 2;
  return { x: at(50, Math.cos(a) * 94), y: CY + Math.sin(a) * 76, s: 36, on: true, face: true };
}

function labelAt(size: Size, slot: number) {
  if (size === 0) return { x: BIG[slot], y: CY + R_BIG + 22, on: true };
  if (size === 1) return { x: MID[slot], y: CY + R_MID + 22, on: true };
  return { x: 50, y: CY, on: slot === 0 };
}

const EASE = "var(--ease-out-soft)";
const MOVE = 900;

type Pointer = { x: number; y: number; ms: number; on: boolean; press: boolean };

/* Той самий темп, що в CursorDemo: майже стала швидкість, без телепортів. */
function travelMs(dist: number) {
  return Math.round(Math.min(900, Math.max(380, dist * 1.25)));
}

export default function Customization() {
  const t = useT().customization;
  const { lang } = useLang();
  const hostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pRef = useRef(1);
  const resumeRef = useRef<number | undefined>(undefined);
  const [p, setP] = useState(1);
  const [grab, setGrab] = useState(false);
  const [userHand, setUserHand] = useState(false);
  const [inView, setInView] = useState(false);
  const [cursor, setCursor] = useState<Pointer>({ x: 0, y: 0, ms: 0, on: false, press: false });

  const size = sizeAt(p);
  const people = peopleAt(p);
  const fmt = (n: number) => n.toLocaleString(lang === "en" ? "en-GB" : "uk-UA");

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => () => window.clearTimeout(resumeRef.current), []);

  /* Рука: підходить до повзунка, тягне до середньої церкви, далі до
     малої, відпускає; потім так само повертає до великої. Показ іде,
     лише поки блок на екрані й поки відвідувач не взявся сам. */
  useEffect(() => {
    const host = hostRef.current;
    const track = trackRef.current;
    if (!host || !track || !inView || userHand || prefersReducedMotion()) return;

    const timers: number[] = [];
    let raf = 0;
    let dead = false;
    const sleep = (ms: number) => new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));
    const thumb = (v: number) => {
      const h = host.getBoundingClientRect();
      const r = track.getBoundingClientRect();
      return { x: r.left - h.left + v * r.width, y: r.top - h.top + r.height / 2 };
    };
    const parked = () => ({ x: host.clientWidth * 0.8, y: host.clientHeight + 40 });

    let from = parked();
    const go = async () => {
      const to = thumb(pRef.current);
      const ms = travelMs(Math.hypot(to.x - from.x, to.y - from.y));
      setCursor({ ...to, ms, on: true, press: false });
      from = to;
      await sleep(ms + 160);
    };
    const hold = async (on: boolean) => {
      setGrab(on);
      setCursor((c) => ({ ...c, ms: 0, press: on }));
      await sleep(on ? 200 : 120);
    };
    const drag = (to: number, ms: number) =>
      new Promise<void>((res) => {
        const a = pRef.current;
        const t0 = performance.now();
        const tick = (now: number) => {
          if (dead) return;
          const k = Math.min(1, (now - t0) / ms);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const v = a + (to - a) * e;
          pRef.current = v;
          setP(v);
          from = thumb(v);
          setCursor({ ...from, ms: 0, on: true, press: true });
          if (k < 1) raf = requestAnimationFrame(tick);
          else res();
        };
        raf = requestAnimationFrame(tick);
      });

    (async () => {
      await sleep(0);
      setGrab(false);
      setCursor({ ...from, ms: 0, on: false, press: false });
      await sleep(1400);
      for (;;) {
        await go();
        await hold(true);
        await drag(0.5, 1400);
        await sleep(1500);
        await drag(0, 1400);
        await hold(false);
        await sleep(2800);
        await go();
        await hold(true);
        await drag(1, 1800);
        await hold(false);
        const out = parked();
        setCursor({ ...out, ms: 700, on: false, press: false });
        from = out;
        await sleep(3200);
      }
    })();

    return () => {
      dead = true;
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
    };
  }, [inView, userHand]);

  /* Відвідувач узявся за повзунок сам — рука відступає і повертається
     за кілька секунд після того, як він пішов із картки. */
  const takeOver = () => {
    window.clearTimeout(resumeRef.current);
    setUserHand(true);
  };
  const letGo = () => {
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setUserHand(false), 4000);
  };

  return (
    <section id="customization" className="w-full flex flex-col items-center pt-2.5 md:pt-3 pb-16 md:pb-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          {/* Той самий розкрій, що й у решти огляду. «Автоматизації» вище
              стоять екраном ліворуч — тут екран праворуч. */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr] overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div
              className="relative flex items-center justify-center min-h-[280px] md:min-h-[440px] px-4 py-6 md:px-8 md:py-6 md:order-2 overflow-hidden"
              style={{
                background:
                  "linear-gradient(140deg, color-mix(in oklab, var(--brand) 12%, var(--surface)) 0%, color-mix(in oklab, var(--brand) 5%, var(--surface)) 55%, var(--surface) 100%)",
              }}
            >
              <div
                ref={hostRef}
                className="relative w-full max-w-[540px]"
                onPointerEnter={() => userHand && window.clearTimeout(resumeRef.current)}
                onPointerLeave={() => userHand && letGo()}
              >
                <div className="rounded-[20px] bg-surface border border-hairline shadow-[0_22px_50px_-30px_rgba(0,0,0,0.4)] overflow-hidden">
                  {/* Повзунок: яка церква і скільки в ній людей. */}
                  <div className="px-4 md:px-5 pt-3.5 pb-2.5 border-b border-hairline">
                    <div className="flex items-baseline justify-between gap-3">
                      <span key={size} className="view-in text-[15px] md:text-[16px] font-semibold text-ink tracking-[-0.2px]">
                        {t.sizes[size].label}
                      </span>
                      <span className="text-[13px] text-ink-2 whitespace-nowrap">
                        <span className="text-[20px] md:text-[22px] font-semibold text-ink tabular-nums tracking-[-0.5px]">
                          {fmt(people)}
                        </span>{" "}
                        {t.people}
                      </span>
                    </div>

                    <div ref={trackRef} className="relative mt-3 h-[6px] rounded-full bg-hairline-strong">
                      <span
                        aria-hidden
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${p * 100}%`, background: "var(--brand)" }}
                      />
                      <span
                        aria-hidden
                        className="absolute top-1/2 w-[22px] h-[22px] rounded-full bg-surface transition-[scale,box-shadow] duration-200"
                        style={{
                          left: `${p * 100}%`,
                          translate: "-50% -50%",
                          border: `3px solid var(--brand)`,
                          scale: grab ? "1.15" : "1",
                          boxShadow: grab
                            ? `0 0 0 6px color-mix(in oklab, var(--brand) 18%, transparent), 0 4px 10px -2px rgba(0,0,0,0.3)`
                            : "0 3px 8px -2px rgba(0,0,0,0.3)",
                        }}
                      />
                      {/* Справжній повзунок — прозорий поверх намальованого:
                          його можна тягти пальцем, мишею і стрілками. */}
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        value={Math.round(p * 1000)}
                        aria-label={t.slider}
                        aria-valuetext={`${fmt(people)} ${t.people}`}
                        onChange={(e) => {
                          const v = Number(e.target.value) / 1000;
                          pRef.current = v;
                          setP(v);
                        }}
                        onPointerDown={() => {
                          takeOver();
                          setGrab(true);
                        }}
                        onPointerUp={() => setGrab(false)}
                        onKeyDown={takeOver}
                        onBlur={letGo}
                        className="absolute left-[-11px] w-[calc(100%+22px)] top-1/2 -translate-y-1/2 h-8 m-0 opacity-0 cursor-grab active:cursor-grabbing"
                      />
                    </div>
                    <div aria-hidden className="mt-2 flex justify-between text-[11px] font-medium text-ink-3 leading-none">
                      <span>{t.small}</span>
                      <span>{t.large}</span>
                    </div>
                  </div>

                  <div aria-hidden className="flex">
                    {/* Модулі збоку: зайві згортаються, «Малі групи» в малій
                        церкві звуться «Домашні групи». */}
                    <div className="hidden lg:flex flex-col w-[158px] shrink-0 border-r border-hairline bg-surface-2 py-2 px-2">
                      {t.modules.map((m) => {
                        const on = ON[size].includes(m.id);
                        const Icon = MODULE_ICONS[m.id];
                        const renamed = m.id === "groups" && size === 2;
                        return (
                          <div
                            key={m.id}
                            className="grid"
                            style={{
                              gridTemplateRows: on ? "1fr" : "0fr",
                              opacity: on ? 1 : 0,
                              transition: `grid-template-rows ${MOVE}ms ${EASE}, opacity 450ms ease`,
                            }}
                          >
                            <div className="min-h-0 overflow-hidden">
                              <span className="flex items-center gap-2 px-1.5 py-[5px]">
                                <span
                                  className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0"
                                  style={{ background: MODULE_ACCENTS[m.id] }}
                                >
                                  {Icon && <Icon className="w-[13px] h-[13px] text-white" strokeWidth={2.3} />}
                                </span>
                                <span
                                  key={renamed ? "renamed" : "name"}
                                  className={cn(
                                    "text-[13px] leading-none whitespace-nowrap",
                                    renamed ? "font-semibold text-brand view-in" : "text-ink-2 font-medium",
                                  )}
                                >
                                  {renamed ? t.renamed : m.name}
                                </span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Церква: натовпи крапок або коло облич. */}
                    <div className="relative flex-1 min-w-0 overflow-hidden" style={{ height: CANVAS_H }}>
                      {Array.from({ length: DOTS }, (_, d) => {
                        const dot = dotAt(size, d);
                        const face = lookFor(t.faces[d % t.faces.length]);
                        return (
                          <span
                            key={d}
                            className="absolute rounded-full overflow-hidden"
                            style={{
                              left: dot.x,
                              top: dot.y,
                              width: dot.s,
                              height: dot.s,
                              translate: "-50% -50%",
                              opacity: dot.on ? 1 : 0,
                              background: `color-mix(in oklab, var(--brand) ${40 + ((d * 37) % 5) * 8}%, var(--surface))`,
                              boxShadow: dot.face ? "0 0 0 2.5px var(--surface), 0 6px 14px -6px rgba(0,0,0,0.35)" : undefined,
                              transition: `left ${MOVE}ms ${EASE}, top ${MOVE}ms ${EASE}, width ${MOVE}ms ${EASE}, height ${MOVE}ms ${EASE}, opacity 500ms ease`,
                              transitionDelay: `${(d % 12) * 12}ms`,
                            }}
                          >
                            {d < N_FACES && (
                              <span
                                className="absolute inset-0 transition-opacity duration-500"
                                style={{ opacity: dot.face ? 1 : 0, transitionDelay: dot.face ? "380ms" : "0ms" }}
                              >
                                <PersonAvatar look={face} size={36} className="w-full h-full" />
                              </span>
                            )}
                          </span>
                        );
                      })}

                      {[0, 1, 2].map((slot) => {
                        const l = labelAt(size, slot);
                        const small = size === 2;
                        return (
                          <span
                            key={slot}
                            className="absolute whitespace-nowrap"
                            style={{
                              left: `${l.x}%`,
                              top: l.y,
                              translate: "-50% -50%",
                              opacity: l.on ? 1 : 0,
                              transition: `left ${MOVE}ms ${EASE}, top ${MOVE}ms ${EASE}, opacity 400ms ease`,
                            }}
                          >
                            <span
                              key={`${size}-${slot}`}
                              className={cn(
                                "view-in block leading-none",
                                small
                                  ? "rounded-full bg-brand-soft text-brand px-3 py-[7px] text-[13px] font-semibold"
                                  : "text-[12px] font-semibold text-ink-2",
                              )}
                            >
                              {t.sizes[size].clusters[slot] ?? ""}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Рука, що тягне повзунок. */}
                <span
                  aria-hidden
                  data-press={cursor.press ? "1" : "0"}
                  className="demo-cursor"
                  style={{
                    transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
                    transitionDuration: `${cursor.ms}ms`,
                    opacity: cursor.on && inView && !userHand ? 1 : 0,
                  }}
                >
                  <svg className="demo-cursor-arrow" width={30} height={33} viewBox="0 0 22 24" fill="none">
                    <path
                      d="M4 2.2 17.4 13.1c.7.6.3 1.7-.6 1.8l-5.4.5a1 1 0 0 0-.8.6l-2.2 5a1 1 0 0 1-1.9-.2L3.3 3.2c-.2-.9.9-1.5 1.6-1z"
                      fill="var(--ink)"
                      stroke="var(--surface)"
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* На телефоні стрілки немає — там ходить палець. */}
                  <span className="hidden pointer-coarse:block w-[26px] h-[26px] -ml-[13px] -mt-[13px] rounded-full border-2 border-ink bg-ink/15 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]" />
                  <span className="absolute top-[26px] left-[20px] pointer-coarse:top-[16px] pointer-coarse:left-[14px] rounded-full bg-ink px-2.5 py-[4px] text-[12px] font-semibold text-surface leading-none whitespace-nowrap shadow-[0_10px_20px_-10px_rgba(0,0,0,0.55)]">
                    {t.you}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 p-7 md:p-10 md:order-1">
              <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                {t.title}
              </h2>
              <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5] max-w-[340px]">{t.lead}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
