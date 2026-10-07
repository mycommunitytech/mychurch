"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronLeft, ChevronRight, MessageSquare, Phone as PhoneIcon, Plus, Send } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import CursorDemo from "@/components/shared/cursor-demo";
import PersonAvatar, { AVATAR_LOOKS, lookFor } from "@/components/shared/person-avatar";
import { TgDevice } from "@/components/shared/tg-phone";
import { useT } from "@/lib/lang";
import type { Dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Важливе — під рукою».

   Решта головної показує систему за столом — тут вона в руці. Три
   моменти, заради яких її дістають стоячи: неділя зранку в пастора,
   зустріч у лідера і зустріч із людиною. Тому й три телефони поруч,
   а не перемикач: різниця між моментами і є картинкою.

   Екрани справжні настільки, наскільки можуть бути: явку на
   середньому телефоні відмічають пальцем — чотири галочки лягають
   самі, коли блок доходить до екрана, решту ставить відвідувач.

   Знизу в кожному телефоні — адресний рядок Safari, а не панель
   застосунку: окремого застосунку в сторах ще немає, система
   відкривається в браузері. Той самий рядок стоїть у відповіді FAQ
   «Чи є мобільний застосунок» — обіцяти більше за неї тут не можна.
   ──────────────────────────────────────────────────────────────── */

/* Корпус із tg-phone намальовано під ширину 352 px: малюємо його в
   натуральну величину і стискаємо цілим, щоб радіуси, рамка й кегль
   лишились у пропорції. Висота — та сама арифметика, що в корпусі:
   4 (грань) + 16 (рамка) + 332 × 874/402 (екран) ≈ 742. */
const DEVICE_W = 352;
const DEVICE_H = 742;

/* Галочки, що лягають самі, коли блок доходить до екрана. */
const AUTO_TICKS = 4;
const TICK_MS = 260;

const TEAL = "#0d9488";

/* Три екрани прототипу: з головного відкривається явка групи і картка людини. */
type Screen = "today" | "roll" | "person";
const AMBER = "#f59e0b";

type Copy = Dict["pocket"];

/** Телефон у натуральну величину, стиснутий під ширину колонки, і підпис під ним. */
function Phone({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;
    const apply = () => {
      inner.style.transform = `scale(${host.clientWidth / DEVICE_W})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <FadeIn variant="scale" className="flex flex-col items-center">
      <div
        ref={hostRef}
        className="w-full max-w-[300px] mx-auto"
        style={{ aspectRatio: `${DEVICE_W} / ${DEVICE_H}` }}
      >
        <div
          ref={innerRef}
          className="w-[352px] origin-top-left"
          style={{ transform: "scale(0.852)" }}
        >
          <TgDevice>{children}</TgDevice>
        </div>
      </div>
    </FadeIn>
  );
}

/** Шапка всередині екрана: назва розділу і стрілка назад. */
function Bar({ back, title, sub, right, onBack, demo }: { back: string; title: string; sub?: string; right?: React.ReactNode; onBack?: () => void; demo?: boolean }) {
  const Tag = onBack ? "button" : "span";
  return (
    <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-hairline bg-surface">
      <Tag
        {...(onBack ? { type: "button" as const, onClick: onBack, "data-demo": demo ? "click" : undefined } : {})}
        className="flex items-center gap-0.5 shrink-0 text-brand">
        <ChevronLeft className="w-[17px] h-[17px]" strokeWidth={2.6} />
        <span className="text-[13px] font-medium leading-none">{back}</span>
      </Tag>
      <span className="flex-1 min-w-0 flex flex-col items-center gap-1">
        <span className="block max-w-full text-[14.5px] font-semibold text-ink leading-none truncate">{title}</span>
        {sub && <span className="block max-w-full text-[11.5px] text-ink-3 leading-none truncate">{sub}</span>}
      </span>
      <span className="shrink-0 min-w-[46px] flex justify-end">{right}</span>
    </div>
  );
}

/* ── Екран 1: неділя зранку ─────────────────────────────────────── */
function TodayScreen({ t, roll, demo, onOpen }: { t: Copy["today"]; roll: Copy["roll"]; demo: Screen; onOpen: (s: Screen) => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-page">
      <div className="flex-1 min-h-0 flex flex-col gap-3 px-4 pt-3 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex-1 min-w-0 flex flex-col gap-1.5">
            <span className="text-[15.5px] font-semibold text-ink leading-none truncate">{t.appName}</span>
            <span className="text-[12px] text-ink-3 leading-none truncate">{t.date}</span>
          </span>
          <Bell className="w-[17px] h-[17px] text-ink-3 shrink-0" strokeWidth={2.2} />
          <PersonAvatar look={AVATAR_LOOKS[3]} size={30} className="w-[30px] h-[30px] shrink-0" />
        </div>

        {/* Найближче — найбільшим: те, заради чого телефон і дістали. */}
        <div
          className="rounded-[18px] px-4 py-3.5 flex flex-col gap-2.5 border"
          style={{
            background: "color-mix(in oklab, var(--brand) 9%, var(--surface))",
            borderColor: "color-mix(in oklab, var(--brand) 22%, transparent)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand leading-none">
            {t.soon}
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[18px] font-semibold text-ink leading-tight tracking-[-0.3px]">{t.event}</span>
            <span className="text-[13px] text-ink-2 leading-none">{t.where}</span>
          </span>
          <span className="flex items-center gap-2.5 pt-2.5 border-t border-hairline">
            <span className="flex -space-x-2 shrink-0">
              {[0, 4, 7, 2].map((i) => (
                <PersonAvatar
                  key={i}
                  look={AVATAR_LOOKS[i]}
                  size={24}
                  className="w-6 h-6 ring-2 ring-surface rounded-full"
                />
              ))}
            </span>
            <span className="text-[12px] text-ink-2 leading-none truncate">{t.serving}</span>
          </span>
        </div>

        <div className="rounded-[16px] border border-hairline bg-surface overflow-hidden">
          <span className="flex items-center gap-2 px-3.5 py-2.5 border-b border-hairline">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: AMBER }} />
            <span className="text-[12px] font-semibold text-ink-2 leading-none">{t.attentionTitle}</span>
          </span>
          {t.attention.map((p, i) => {
            /* Відкривається картка тієї людини, яку показує екран картки:
               решта рядків лишається списком, а не обіцянкою. */
            const opens = i === 1;
            return (
              <button
                key={p.name}
                type="button"
                onClick={opens ? () => onOpen("person") : undefined}
                data-demo={opens && demo === "person" ? "click" : undefined}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-hairline last:border-b-0 text-left transition-colors duration-150",
                  opens ? "hover:bg-surface-2 cursor-pointer" : "cursor-default"
                )}
              >
                <PersonAvatar look={lookFor(p.name)} size={30} className="w-[30px] h-[30px] shrink-0" />
                <span className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="text-[13.5px] font-medium text-ink leading-none truncate">{p.name}</span>
                  <span className="text-[11.5px] text-ink-3 leading-none truncate">{p.note}</span>
                </span>
                {opens && <ChevronRight className="w-[15px] h-[15px] text-ink-3 shrink-0" strokeWidth={2.2} />}
              </button>
            );
          })}
        </div>

        {/* Найближча зустріч групи — звідси відкривається явка. */}
        <button
          type="button"
          onClick={() => onOpen("roll")}
          data-demo={demo === "roll" ? "click" : undefined}
          className="rounded-[16px] border border-hairline bg-surface px-3.5 py-3 flex items-center gap-3 text-left hover:bg-surface-2 transition-colors duration-150"
        >
          <span
            className="w-[30px] h-[30px] rounded-[10px] shrink-0 flex items-center justify-center"
            style={{ background: `color-mix(in oklab, ${TEAL} 14%, var(--surface))`, color: TEAL }}
          >
            <Check className="w-[15px] h-[15px]" strokeWidth={2.6} />
          </span>
          <span className="flex-1 min-w-0 flex flex-col gap-1">
            <span className="text-[13.5px] font-medium text-ink leading-none truncate">{roll.group}</span>
            <span className="text-[11.5px] text-ink-3 leading-none truncate">{roll.when}</span>
          </span>
          <ChevronRight className="w-[15px] h-[15px] text-ink-3 shrink-0" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

/* ── Екран 2: явка на зустрічі групи ────────────────────────────── */
function RollScreen({ t, onBack }: { t: Copy["roll"]; onBack: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<boolean[]>(() => t.members.map(() => false));

  /* Перші чотири галочки лягають самі — далі палець відвідувача. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const auto = t.members.map((m, i) => m !== t.absent && i < AUTO_TICKS);
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        /* Без анімації галочки просто вже стоять. */
        if (prefersReducedMotion()) {
          setOn(auto);
          return;
        }
        let step = 0;
        auto.forEach((yes, i) => {
          if (!yes) return;
          step += 1;
          timers.push(
            window.setTimeout(() => {
              setOn((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, TICK_MS * step)
          );
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [t.members, t.absent]);

  const count = on.filter(Boolean).length;
  const counter = t.counter.replace("{n}", String(count));

  return (
    <div ref={rootRef} className="flex-1 min-h-0 flex flex-col bg-page">
      <Bar
        back={t.back}
        title={t.group}
        sub={t.when}
        onBack={onBack}
        demo
        right={
          <span
            className="rounded-full px-2 py-1 text-[11.5px] font-semibold leading-none tabular-nums"
            style={{ background: `color-mix(in oklab, ${TEAL} 14%, var(--surface))`, color: TEAL }}
          >
            {counter}
          </span>
        }
      />

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {t.members.map((name, i) => {
          const absent = name === t.absent;
          const ticked = on[i];
          return (
            <button
              key={name}
              type="button"
              aria-pressed={ticked}
              aria-label={t.tickLabel.replace("{name}", name)}
              onClick={() =>
                setOn((prev) => {
                  const next = [...prev];
                  next[i] = !next[i];
                  return next;
                })
              }
              className="flex items-center gap-3 px-4 py-2.5 border-b border-hairline text-left transition-colors hover:bg-surface-2"
            >
              <PersonAvatar
                look={lookFor(name)}
                size={34}
                className={cn("w-[34px] h-[34px] shrink-0 transition-all duration-300", absent && !ticked && "grayscale opacity-45")}
              />
              <span className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[14.5px] font-medium text-ink leading-none truncate">{name}</span>
                {absent && !ticked && (
                  <span className="text-[11.5px] text-ink-3 leading-none truncate">{t.absentNote}</span>
                )}
              </span>
              <span
                className={cn(
                  "w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center transition-all duration-200",
                  ticked ? "text-white" : "border-[1.5px] border-hairline-strong"
                )}
                style={ticked ? { background: TEAL } : undefined}
              >
                {ticked && <Check className="w-[15px] h-[15px]" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 px-4 pt-3 pb-1">
        <span className="flex items-center gap-2 rounded-[13px] border border-dashed border-hairline-strong px-3 py-2.5 text-brand">
          <Plus className="w-[15px] h-[15px] shrink-0" strokeWidth={2.6} />
          <span className="text-[13px] font-medium leading-none">{t.addGuest}</span>
        </span>
      </div>

      <div className="shrink-0 px-4 py-3 bg-surface border-t border-hairline">
        <span className="flex items-center justify-center gap-2 w-full rounded-[13px] bg-brand px-4 py-3 text-white">
          <Check className="w-[16px] h-[16px]" strokeWidth={2.6} />
          <span className="text-[14.5px] font-semibold leading-none">{t.save}</span>
        </span>
      </div>
    </div>
  );
}

/* ── Екран 3: картка людини ─────────────────────────────────────── */
const PERSON_ICONS = [PhoneIcon, MessageSquare, Send];

function PersonScreen({ t, onBack }: { t: Copy["person"]; onBack: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-page">
      <Bar back={t.back} title={t.name} onBack={onBack} demo />

      <div className="flex-1 min-h-0 flex flex-col gap-3 px-4 pt-4 overflow-hidden">
        <div className="flex flex-col items-center text-center gap-2.5">
          <PersonAvatar look={lookFor(t.name)} size={64} className="w-16 h-16" />
          <span className="flex flex-col items-center gap-1.5">
            <span className="text-[17px] font-semibold text-ink leading-tight">{t.name}</span>
            <span
              className="rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none"
              style={{ background: "color-mix(in oklab, var(--brand) 12%, var(--surface))", color: "var(--brand)" }}
            >
              {t.status}
            </span>
          </span>
        </div>

        {/* Дії, заради яких картку й відкрили на ходу. */}
        <div className="flex gap-2">
          {t.actions.map((label, i) => {
            const Icon = PERSON_ICONS[i];
            return (
              <span
                key={label}
                className="flex-1 min-w-0 rounded-[14px] border border-hairline bg-surface px-2 py-2.5 flex flex-col items-center gap-1.5"
              >
                <Icon className="w-[17px] h-[17px] text-brand" strokeWidth={2.2} />
                <span className="text-[11.5px] font-medium text-ink-2 leading-none truncate max-w-full">{label}</span>
              </span>
            );
          })}
        </div>

        <div className="rounded-[16px] border border-hairline bg-surface overflow-hidden">
          {t.rows.map((r) => (
            <span key={r.label} className="flex items-center gap-3 px-3.5 py-2.5 border-b border-hairline last:border-b-0">
              <span className="text-[12.5px] text-ink-3 leading-none shrink-0">{r.label}</span>
              <span className="flex-1 min-w-0 text-right text-[13.5px] font-medium text-ink leading-none truncate">
                {r.value}
              </span>
            </span>
          ))}
        </div>

        <div className="rounded-[16px] border border-hairline bg-surface px-3.5 py-3 flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-none">
            {t.noteTitle}
          </span>
          <span className="text-[13px] text-ink-2 leading-[1.45]">{t.note}</span>
          <span className="text-[11.5px] text-ink-3 leading-none">{t.noteBy}</span>
        </div>
      </div>
    </div>
  );
}

export default function Pocket() {
  const t = useT().pocket;
  const [screen, setScreen] = useState<Screen>("today");

  /* Прототип, а не слайдшоу: людина сама заходить у явку групи чи в картку
     людини і повертається назад тією ж стрілкою, що і в застосунку. */
  /* Привидний палець сам показує, куди тут тиснути: з головного екрана —
     то в явку групи, то в картку людини, і назад тією ж стрілкою.
     Живий дотик завжди має перевагу — демо відступає (CursorDemo). */
  const [turn, setTurn] = useState(0);
  const back = () => {
    setScreen("today");
    setTurn((n) => n + 1);
  };
  const view =
    screen === "roll" ? (
      <RollScreen t={t.roll} onBack={back} />
    ) : screen === "person" ? (
      <PersonScreen t={t.person} onBack={back} />
    ) : (
      <TodayScreen t={t.today} roll={t.roll} demo={turn % 2 === 0 ? "roll" : "person"} onOpen={setScreen} />
    );

  return (
    <section
      id="pocket"
      className="w-full flex flex-col items-center py-2.5 md:py-3 scroll-mt-24"
    >
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        {/* Той самий розкрій, що й у модулів та інтеграцій: екран у кольоровій
            половині, назва одним словом — у білій. Тут екран живий, тому
            картка не посилання: по ній ходять пальцем. */}
        <FadeIn variant="scale">
          {/* Боки чергуються: бот вище стоїть екраном ліворуч, тож телефон
              іде праворуч — шахівниця, а не колонка. */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr] overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Картка тієї ж висоти, що й решта блоків огляду (440): апарат
                заходить за нижній край замість того, щоб тягнути блок униз.
                Нахилів немає — телефон стоїть прямо. На телефоні картка
                росте під сам апарат, там різати нічого. */}
            <div
              className="relative flex justify-center overflow-hidden px-6 py-6 md:px-10 md:py-0 md:min-h-[440px] md:order-2"
              style={{ background: "linear-gradient(140deg, color-mix(in oklab, var(--brand) 12%, var(--surface)) 0%, color-mix(in oklab, var(--brand) 5%, var(--surface)) 55%, var(--surface) 100%)" }}
            >
              <div className="relative w-full max-w-[300px]">
                <div className="md:absolute md:inset-x-0 md:top-10">
                  <CursorDemo playKey={`${screen}-${turn}`} startDelay={900} mode="touch" accent="var(--brand)" className="w-full">
                    <Phone>
                      <div key={`${screen}-${turn}`} className="view-in flex-1 min-h-0 flex flex-col">
                        {view}
                      </div>
                    </Phone>
                  </CursorDemo>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 p-7 md:p-10 md:order-1">
              <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                {t.aside}
              </h2>
              <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5] max-w-[320px]">{t.lead}</p>
              {/* Плашка «натисніть на екран» прибрана 2026-09-21: у блоках
                  огляду лишаються сам екран і дія, без підказок. */}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

