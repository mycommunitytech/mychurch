"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import GridPulse from "@/components/shared/grid-pulse";
import { MODULE_ACCENTS, MODULE_ICONS } from "@/components/shared/module-icons";
import { useCountUp } from "@/components/shared/use-count-up";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Якщо — то» однією колонкою: подія згори, під нею дія, розвилка
   і дві гілки. Розряд іде згори вниз, від блока до блока.

   Схема лежала впоперек на всю ширину сторінки, з проводами, які
   міряли по DOM. Блок тепер така сама картка, як решта огляду, —
   упоперек вона в половину картки не влазила й різалась краєм.
   Тож ланцюжок став вертикальним, а проводи — простими рисками.
   Зелений блок-результат прибрано: те саме каже рядок унизу.
   ──────────────────────────────────────────────────────────────── */

const AMBER = "#f59e0b";
/* Темний текст на суцільному бурштині — єдиний блок схеми, який світиться. */
const INK = "#14100a";

/* Сценарії міняються самі, доки на них не навели. */
const NEXT_MS = 5200;
/* Спершу здригається сама подія, і аж тоді згори вниз біжить розряд.
   Збігається з .zap-trigger і zapDrop у globals.css. */
const START_MS = 900;
const DROP_MS = 260;
const STEP_MS = 300;

interface Node {
  text: string;
  accent: string;
  Icon: LucideIcon;
}

/* Крок сценарію: квадратик модуля і рядок. Кольорові плашки на всю
   ширину виявились заважкими — лишився значок і текст. */
function Step({ node, lit }: { node: Node; lit?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", lit && "zap-lift")}>
      {/* Гніздо завширшки з подію: значки кроків дрібніші за неї, але
          стоять на одній осі — інакше провід ішов би навскіс. */}
      <span className="w-12 shrink-0 flex justify-center">
        <span
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ background: node.accent }}
        >
          <node.Icon className="w-[19px] h-[19px] text-white" strokeWidth={2.2} />
        </span>
      </span>
      <span className="text-white text-[17px] md:text-[18.5px] font-semibold leading-[1.25] tracking-[-0.4px]">
        {node.text}
      </span>
    </span>
  );
}

/* Провід між кроками: риска під значком, якою згори вниз біжить розряд. */
function Drop({ delay, paused }: { delay: number; paused: boolean }) {
  return (
    <span aria-hidden className="relative block h-7 w-px ml-[23.5px] bg-white/15">
      <span
        className="absolute inset-0 origin-top"
        style={{
          background: AMBER,
          animationName: "zapDrop",
          animationDuration: `${DROP_MS}ms`,
          animationDelay: `${delay}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "both",
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </span>
  );
}

/* Подія, з якої все починається: єдиний бурштиновий значок у схемі. */
function Event({ text, label }: { text: string; label: string }) {
  return (
    <span className="zap-trigger flex items-center gap-3">
      {/* Подія більша за все, що під нею: значок ширший, напис крупніший,
          а над ним написано «Якщо» — щоб схема читалась як «якщо — то»,
          а не як п'ять однакових рядків (2026-09-22). */}
      <span
        className="w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center"
        style={{
          background: AMBER,
          /* Світиться вдвічі сильніше за решту схеми: подія має бити в
             око першою, ще до того, як прочитали напис. */
          boxShadow: `0 0 0 6px color-mix(in oklab, ${AMBER} 16%, transparent), 0 14px 34px -10px ${AMBER}`,
        }}
      >
        <Zap className="w-[25px] h-[25px]" strokeWidth={2.4} style={{ color: INK }} fill={INK} />
      </span>
      <span className="flex flex-col gap-[5px] min-w-0">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.2em] leading-none"
          style={{ color: AMBER }}
        >
          {label}
        </span>
        <span className="text-white text-[23px] md:text-[27px] font-bold leading-[1.05] tracking-[-0.8px]">
          {text}
        </span>
      </span>
    </span>
  );
}

export default function Automations() {
  const c = useT().automations;
  const [active, setActive] = useState(0);
  /* Наведення зупиняє і розряд, і перехід до наступного сценарію. */
  const [paused, setPaused] = useState(false);
  /* Куди саме дійшов розряд (-1 — нікуди). */
  const [lit, setLit] = useState(-1);
  /* Риска через «рутину» малюється один раз — коли блок доїхав до ока. */
  const [seen, setSeen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const count = c.recipes.length;
  const r = c.recipes[active];

  /* Блок підстрибує, щойно розряд добіг до нього. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const last = r.steps.length - 1;
    const timers = r.steps.map((_, i) =>
      window.setTimeout(() => setLit(i), START_MS + i * STEP_MS + DROP_MS)
    );
    const off = window.setTimeout(() => setLit(-1), START_MS + last * STEP_MS + DROP_MS + 700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(off);
    };
  }, [active, r.steps]);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const card = (x: { text: string; module: string }): Node => ({
    text: x.text,
    accent: MODULE_ACCENTS[x.module] ?? AMBER,
    Icon: MODULE_ICONS[x.module] ?? Zap,
  });

  /* Лічильник перелічується щоразу, коли міняється сценарій. */
  const saved = useCountUp(r.saved, true, 900);

  return (
    <section
      id="automations"
      className="w-full flex flex-col items-center py-2.5 md:py-3 scroll-mt-24"
    >
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          {/* Той самий розкрій, що й у решти огляду: схема в темній
              половині, назва одним словом — у білій. Ряд чипів зі
              сценаріями прибрано: вони міняються самі, а показує це
              смужка внизу. */}
          {/* Картка нікуди не веде: ні кліку, ні стрілки. */}
          <div
            style={
              {
                "--accent": AMBER,
                "--accent-soft": `color-mix(in oklab, ${AMBER} 12%, var(--surface))`,
                "--accent-line": `color-mix(in oklab, ${AMBER} 32%, var(--surface))`,
              } as React.CSSProperties
            }
            className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div
              className="relative flex flex-col min-h-[280px] md:min-h-[440px] p-5 md:p-7 gap-5 overflow-hidden"
              style={{
                background:
                  "radial-gradient(700px 360px at 8% 0%, rgba(0,105,224,0.42), transparent 70%), " +
                  "radial-gradient(600px 340px at 92% 104%, rgba(245,158,11,0.20), transparent 70%), " +
                  "linear-gradient(165deg, #0a1020 0%, #070b14 100%)",
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Тло — те саме, що в хедері сторінки: сітка, у якій
                  спалахують клітинки й пробігають промені. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 84%)",
                  WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 84%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                  }}
                />
                <GridPulse className="absolute inset-0" focus={[0.5, 0.5]} />
              </div>

              {/* Подія згори і чотири кроки під нею. Розвилка «так / ні»
                  й кольорові плашки на всю ширину жили тут до 2026-09-21:
                  на пів картки це читалось як схема метро. */}
              <div key={active} className="relative flex-1 w-full max-w-[340px] mx-auto flex flex-col justify-center">
                <Event text={r.when} label={c.triggerLabel} />
                {r.steps.map((x, i) => (
                  <Fragment key={x.text}>
                    <Drop delay={START_MS + i * STEP_MS} paused={paused} />
                    <Step node={card(x)} lit={lit === i} />
                  </Fragment>
                ))}
              </div>

              {/* Підвал: що з цього виходить людям, скільки часу це повертає
                  за тиждень (число приблизне — тому «≈») і смужка, яка
                  показує, коли прийде наступний сценарій. */}
              <div className="relative flex items-end justify-between gap-4">
                <span className="flex flex-col gap-1.5 min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      {c.savedEyebrow}
                    </span>
                    <span className="text-[20px] md:text-[24px] font-semibold text-white leading-none tracking-[-0.6px] tabular-nums">
                      ≈ {saved} {c.savedUnit}
                    </span>
                    <span className="text-[12.5px] text-white/45 leading-none">{c.savedPer}</span>
                  </span>
                </span>

                <span aria-hidden className="flex items-center gap-1.5 shrink-0 pb-1">
                  {c.recipes.map((x, i) =>
                    i === active ? (
                      <span key={x.name} className="h-[5px] w-8 rounded-full bg-white/20 overflow-hidden">
                        <span
                          key={active}
                          onAnimationEnd={() => setActive((a) => (a + 1) % count)}
                          className="block h-full w-full origin-left rounded-full"
                          style={{
                            background: AMBER,
                            animationName: "barGrowX",
                            animationDuration: `${NEXT_MS}ms`,
                            animationTimingFunction: "linear",
                            animationFillMode: "both",
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      </span>
                    ) : (
                      <span key={x.name} className="h-[5px] w-[5px] rounded-full bg-white/25" />
                    )
                  )}
                </span>
              </div>
            </div>

            <div ref={titleRef} className="flex flex-col justify-center p-7 md:p-10">
              <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                {c.title}{" "}
                {/* Рутину не описують — її викреслюють. Риска їде зліва
                    направо, щойно блок доїхав до екрана. */}
                <span className="relative inline-block whitespace-nowrap">
                  {c.titleStrike}
                  {/* Зсув по вертикалі — на зовнішньому шарі, масштаб — на
                      внутрішньому: інакше анімація scaleX() затирає
                      translateY() і риска з'їжджає нижче слова. */}
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 top-1/2 h-[5px] md:h-[7px] -translate-y-1/2"
                  >
                    <span
                      className={cn("strike-line block w-full h-full origin-left rounded-full", seen && "strike-draw")}
                      style={{ background: AMBER }}
                    />
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
