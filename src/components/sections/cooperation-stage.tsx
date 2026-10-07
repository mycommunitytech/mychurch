"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight, Award, CalendarDays, Check, Clock, GraduationCap, Mail, MessageCircle, MessageSquareText, Plus, Send,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { AVATAR_LOOKS, lookFor } from "@/components/shared/person-avatar";
import { COOP_ACCENTS, COOP_ICONS } from "@/components/shared/cooperation-look";
import { useDemoModal } from "@/context/demo-modal-context";
import { LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { COOPERATION_COPY, type CooperationAudience, type CooperationCopy } from "@/content/cooperation";
import { useLang } from "@/lib/lang";
import { SITE_EMAIL, SITE_TELEGRAM } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   /cooperation — «Запрошуємо до співпраці» (2026-10-05).

   Вісім окремих блоків, по одному на адресата, — розкроєм карток огляду
   з головної. Перша версія (покажчик ліворуч і один липкий екран, як на
   /for-whom) була відхилена того ж дня: «не зручно, зроби окремими
   блоками» — вибір через наведення ховав усі екрани, крім одного.

   Кожен екран має власну геометрію, а не рядки «іконка + текст»:
   об'єднання — крапки церков, що здають звіт; амбасадор — запит, який
   проходить шлях до релізу; клуб — обличчя, що підтверджують зустріч;
   рух — реєстрація на форум з різних міст; організація — кільце зібраних
   коштів; навчальний заклад — студенти йдуть уроками до сертифіката;
   партнер — церкви на етапах впровадження; інтеграції — патч-
   панель із головної, де вмикається «ваш сервіс».
   ──────────────────────────────────────────────────────────────── */

/* Колір і знак адресата — спільні зі смугою на головній. */
const ACCENTS = COOP_ACCENTS;
const ICONS = COOP_ICONS;

/* Колір адресата трохи поглиблюємо, щоб білий текст на ньому тримав контраст
   AA (4,5:1). Межу задає золото навчальних закладів: на 80% воно давало 4,4. */
const solid = (accent: string) => `color-mix(in oklab, ${accent} 76%, #04121f)`;
/* Текст кольору адресата на світлій плашці. Тягнемо його до --ink, а не до
   темного: у темній темі --ink світлий, тож напис світлішає разом із нею, а
   не тоне в тлі, як було з «solid». */
const inked = (accent: string) => `color-mix(in oklab, ${accent} 72%, var(--ink))`;
const soft = (accent: string, pct = 12) => `color-mix(in oklab, ${accent} ${pct}%, var(--surface))`;
const tint = (accent: string) =>
  `linear-gradient(170deg, color-mix(in oklab, ${accent} 12%, var(--surface)) 0%, color-mix(in oklab, ${accent} 4%, var(--surface)) 60%, var(--surface) 100%)`;

/* Крок петлі екрана. Екран, якого не видно (сусідня картка стрічки), стоїть;
   хто просив менше руху — одразу бачить фінальний кадр. */
function useStep(count: number, ms: number, active: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = reduce
      ? window.setTimeout(() => setStep(count - 1), 0)
      : window.setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => {
      window.clearTimeout(id);
      window.clearInterval(id);
    };
  }, [count, ms, active]);
  return step;
}

/* ── Рамка екрана: та сама шапка, що в панелей ролей на /for-whom ── */
function Frame({ a, sub, children }: { a: CooperationAudience; sub?: string; children: ReactNode }) {
  const accent = ACCENTS[a.id];
  const Icon = ICONS[a.id];
  return (
    <div className="mock-on rounded-[22px] bg-surface border border-hairline shadow-[0_28px_60px_-40px_rgba(0,40,100,0.5)] overflow-hidden flex flex-col">
      <div
        className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-hairline"
        style={{ background: `linear-gradient(120deg, ${soft(accent)}, var(--surface-2))` }}
      >
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-surface border border-hairline" style={{ color: accent }}>
          <Icon className="w-[19px] h-[19px]" strokeWidth={2.2} />
        </span>
        <span className="flex flex-col min-w-0">
          <span className="text-[15px] font-semibold text-ink leading-[1.2] truncate">{a.screenTitle}</span>
          {sub && <span className="text-[12px] text-ink-3 leading-none mt-1 truncate">{sub}</span>}
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

/* ── Об'єднання: церкви округів здають річний звіт ─────────────── */
function UnionsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.unions;
  const accent = ACCENTS.unions;
  const total = s.districts.reduce((n, d) => n + d.total, 0);
  const before = s.districts.reduce((n, d) => n + d.done, 0);
  const missing = total - before;
  /* Кадр 0 — як є; далі по одній церкві; два кадри тримаємо повний звіт. */
  const step = useStep(missing + 3, 1100, active);
  const filled = Math.min(step, missing);
  const done = before + filled;
  const complete = done === total;

  let order = 0;
  return (
    <Frame a={a} sub={s.title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="flex items-baseline gap-1.5 leading-none">
              <span className="text-[40px] sm:text-[44px] font-semibold text-ink tracking-[-1.4px] tabular-nums">{done}</span>
              <span className="text-[17px] text-ink-3 tabular-nums">
                {s.ofLabel} {total}
              </span>
            </span>
            <span className="text-[13px] text-ink-2 leading-none">{s.doneLabel}</span>
          </div>
          <span
            key={complete ? "done" : "wait"}
            className="mock-pop shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold leading-none"
            style={
              complete
                ? { background: "#e3f6ea", color: "#0e7a3c" }
                : { background: "#fff4dc", color: "#94570a" }
            }
          >
            {complete ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />}
            {complete ? s.collected : `${s.waitingLabel} ${total - done}`}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${(done / total) * 100}%`, background: complete ? "#12a150" : accent }}
          />
        </div>

        {/* Округи — чотири коробки, у кожній крапка = церква. */}
        <div className="grid grid-cols-2 gap-2.5">
          {s.districts.map((d) => {
            const dots = Array.from({ length: d.total }, (_, i) => {
              if (i < d.done) return "was" as const;
              const mine = order++;
              return mine < filled ? ("now" as const) : ("wait" as const);
            });
            const got = dots.filter((x) => x !== "wait").length;
            return (
              <div key={d.name} className="rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-2.5">
                {/* На телефоні коробка вузька: лічильник переноситься під назву,
                    а не обрізає її. */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className="text-[13px] font-semibold text-ink leading-none">{d.name}</span>
                  <span className="text-[12px] text-ink-3 leading-none tabular-nums">
                    {got}/{d.total}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dots.map((state, i) =>
                    state === "wait" ? (
                      <span key={`${i}-w`} className="block w-[11px] h-[11px] rounded-full border-[1.5px] border-dashed" style={{ borderColor: "var(--hairline-strong)" }} />
                    ) : (
                      <span
                        key={`${i}-${state}`}
                        className={cn("block w-[11px] h-[11px] rounded-full", state === "now" && "mock-pop")}
                        style={{ background: state === "now" ? "#12a150" : accent }}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 rounded-xl border border-hairline divide-x divide-hairline">
          {s.stats.map((st) => (
            <div key={st.label} className="px-2.5 sm:px-3 py-2.5 flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold text-ink leading-none tracking-[-0.3px] tabular-nums">{st.value}</span>
              <span className="text-[12px] text-ink-3 leading-none whitespace-nowrap">{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* Знак команди в переписці — «М» на синьому, як іконка вкладки. */
function Monogram({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      className="shrink-0 flex items-center justify-center bg-brand text-white font-brand font-bold leading-none"
      style={{ width: size, height: size, borderRadius: size * 0.3, fontSize: size * 0.52 }}
    >
      М
    </span>
  );
}

/* ── Амбасадор: запит церкви проходить шлях до релізу ──────────── */
function AmbassadorsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.ambassadors;
  const accent = ACCENTS.ambassadors;
  /* Запит → у роботі → у вас → відповідь команди → пауза. */
  const step = useStep(5, 1400, active);
  const stage = Math.min(step, s.steps.length - 1);
  const replied = step >= s.steps.length;
  const last = s.steps.length - 1;

  return (
    <Frame a={a} sub={s.feature}>
      <div className="flex flex-col gap-4">
        <span
          className="self-start inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
          style={{ background: soft(accent, 14), color: inked(accent) }}
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.4} />
          {s.beta}
        </span>

        {/* Запит церкви */}
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
            style={{ background: soft(accent, 18), color: inked(accent) }}
          >
            {s.you
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[12px] text-ink-3 leading-none">{s.you}</span>
            <p className="rounded-2xl rounded-tl-md bg-surface-2 border border-hairline px-3.5 py-2.5 text-[14px] text-ink leading-[1.45]">{s.ask}</p>
          </div>
        </div>

        {/* Шлях запиту: три вузли на одній лінії */}
        <div className="relative px-3 pt-1">
          <div className="absolute left-[26px] right-[26px] top-[17px] h-[3px] rounded-full bg-surface-3">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${(stage / last) * 100}%`, background: accent }}
            />
          </div>
          <ol className="relative flex justify-between">
            {s.steps.map((label, i) => {
              const passed = i < stage || (i === last && stage === last);
              const now = i === stage && !passed;
              return (
                <li key={label} className="flex flex-col items-center gap-1.5 w-[64px]">
                  <span
                    className="w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: passed ? accent : "var(--surface)",
                      borderColor: passed || now ? accent : "var(--hairline-strong)",
                    }}
                  >
                    {passed ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : (
                      <span className="block w-2 h-2 rounded-full" style={{ background: now ? accent : "var(--hairline-strong)" }} />
                    )}
                  </span>
                  <span className={cn("text-[12px] leading-[1.2] text-center", passed || now ? "text-ink font-semibold" : "text-ink-3")}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Відповідь команди — місце під неї тримаємо, щоб екран не стрибав. */}
        <div
          className="flex items-start gap-2.5 flex-row-reverse transition-opacity duration-300"
          style={{ opacity: replied ? 1 : 0 }}
          aria-hidden={!replied}
        >
          <Monogram size={32} />
          <div className="flex flex-col items-end gap-1 min-w-0">
            <span className="text-[12px] text-ink-3 leading-none">{s.us}</span>
            <p
              key={replied ? "on" : "off"}
              className={cn("rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[14px] font-medium text-white leading-[1.45]", replied && "mock-pop")}
              style={{ background: solid(accent) }}
            >
              {s.reply}
            </p>
          </div>
        </div>

        <Link
          href={LEAD_AMBASSADOR_HREF}
          className="group -mx-1 flex items-center gap-2 rounded-xl px-1 pt-3 border-t border-hairline text-[13px] leading-[1.3]"
        >
          <span className="text-ink-3 shrink-0">{s.nowLabel}</span>
          <span className="font-semibold text-ink truncate">{s.nowValue}</span>
          <ArrowRight className="ml-auto w-3.5 h-3.5 text-ink-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} />
        </Link>
      </div>
    </Frame>
  );
}

/* ── Партнер: церкви на етапах впровадження ────────────────────── */
/* Етап кожної церкви в кожному кадрі: по одній церкві робить крок уперед,
   а коли перший етап звільнився — приходить нова (−1 = її ще немає). */
const PARTNER_FRAMES = [
  [0, 1, 1, 2, 3, 3, -1],
  [0, 1, 1, 3, 3, 3, -1],
  [0, 1, 2, 3, 3, 3, -1],
  [1, 1, 2, 3, 3, 3, -1],
  [1, 1, 2, 3, 3, 3, 0],
  [1, 1, 2, 3, 3, 3, 0],
];
const CHURCH_HUES = ["#0ea5e9", "#f59e0b", "#8b5bf0", "#12a150", "#f05b8b", "#14b8a6", "#ef4444"];

function PartnersScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.partners;
  const accent = ACCENTS.partners;
  const step = useStep(PARTNER_FRAMES.length, 1500, active);
  const at = PARTNER_FRAMES[step];
  const prev = PARTNER_FRAMES[(step + PARTNER_FRAMES.length - 1) % PARTNER_FRAMES.length];
  const last = s.stages.length - 1;
  const count = at.filter((x) => x >= 0).length;

  return (
    <Frame a={a} sub={s.title.replace("{n}", String(count))}>
      {/* Вертикальний шлях: вузол етапу ліворуч, церкви цього етапу праворуч. */}
      <ol className="relative flex flex-col">
        <span aria-hidden className="absolute left-[13px] top-[14px] bottom-[14px] w-[2px] rounded-full bg-surface-3" />
        {s.stages.map((stage, si) => {
          const here = s.churches.map((name, ci) => ({ name, ci })).filter(({ ci }) => at[ci] === si);
          const final = si === last;
          return (
            <li key={stage} className="relative flex items-start gap-3 py-2 min-h-[56px]">
              <span
                className="relative z-10 mt-[3px] w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-bold tabular-nums"
                style={{
                  background: final ? accent : "var(--surface)",
                  borderColor: final ? accent : here.length ? accent : "var(--hairline-strong)",
                  color: final ? "#fff" : accent,
                }}
              >
                {final ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : si + 1}
              </span>
              <div className="flex flex-col gap-2 min-w-0 flex-1 pt-[7px]">
                <span className="flex items-center gap-2 text-[13px] leading-none">
                  <span className="font-semibold text-ink">{stage}</span>
                  <span className="text-ink-3 tabular-nums">{here.length}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {here.map(({ name, ci }) => {
                    const moved = prev[ci] !== si;
                    return (
                      <span
                        key={`${name}-${si}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border pl-1 pr-2.5 py-1 text-[12.5px] font-medium text-ink leading-none",
                          moved && step > 0 && "mock-pop"
                        )}
                        style={{
                          background: moved && step > 0 ? soft(accent, 14) : "var(--surface-2)",
                          borderColor: moved && step > 0 ? accent : "var(--hairline)",
                        }}
                      >
                        <span
                          aria-hidden
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ background: CHURCH_HUES[ci % CHURCH_HUES.length] }}
                        >
                          {name[0]}
                        </span>
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

/* ── Клуб: учасники по одному підтверджують наступну зустріч ───── */
/* Порядок, у якому обличчя «загоряються», — не підряд, а вроздріб. */
const CLUB_ORDER = [3, 17, 8, 21, 0, 12, 5, 19, 10, 1, 14, 23, 7, 16, 2, 20, 9, 13, 4, 22, 11, 6, 18, 15];

function ClubsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.clubs;
  const accent = ACCENTS.clubs;
  const joining = s.final - s.confirmed;
  /* Кадр 0 — як є; далі по одному учаснику; два кадри тримаємо результат. */
  const step = useStep(joining + 3, 900, active);
  const yes = s.confirmed + Math.min(step, joining);
  const on = new Set(CLUB_ORDER.slice(0, yes));
  const fresh = new Set(CLUB_ORDER.slice(s.confirmed, yes));

  return (
    <Frame a={a} sub={s.when}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[40px] sm:text-[44px] font-semibold text-ink tracking-[-1.4px] tabular-nums">{yes}</span>
            <span className="text-[17px] text-ink-3 tabular-nums">
              {s.ofLabel} {s.total}
            </span>
          </span>
          <span className="text-[13px] text-ink-2 leading-none">{s.comingLabel}</span>
        </div>

        {/* Обличчя клубу: ті, хто підтвердив, — у кольорі. */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-x-1.5 gap-y-2 justify-items-center">
          {Array.from({ length: s.total }, (_, i) => {
            const coming = on.has(i);
            return (
              <span
                key={`${i}-${coming ? "y" : "n"}`}
                className={cn("relative rounded-full transition-[opacity,filter] duration-300", fresh.has(i) && "mock-pop")}
                style={{ opacity: coming ? 1 : 0.32, filter: coming ? "none" : "grayscale(1)" }}
              >
                <PersonAvatar look={AVATAR_LOOKS[(i * 3) % AVATAR_LOOKS.length]} size={34} />
                {coming && (
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface flex items-center justify-center"
                    style={{ background: "#12a150" }}
                  >
                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                  </span>
                )}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-hairline text-[13px] text-ink-2 leading-[1.3]">
          <span className="w-6 h-6 rounded-full bg-[#229ED9] text-white flex items-center justify-center shrink-0">
            <Send className="w-3 h-3" strokeWidth={2.4} />
          </span>
          {s.reminder}
          <span className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: accent }} />
        </div>
      </div>
    </Frame>
  );
}

/* ── Рух: реєстрація на спільний форум з різних міст ───────────── */
const MOVEMENT_FILL = [0.84, 0.88, 0.92, 0.96, 1, 1];

function MovementsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.movements;
  const accent = ACCENTS.movements;
  const step = useStep(MOVEMENT_FILL.length, 1100, active);
  const fill = MOVEMENT_FILL[step];
  const counts = s.cities.map((city) => Math.round(city.count * fill));
  const full = s.cities.reduce((n, city) => n + city.count, 0);
  const now = counts.reduce((n, x) => n + x, 0);
  const fmt = new Intl.NumberFormat(c.locale);
  const shade = (i: number) => `color-mix(in oklab, ${accent} ${100 - i * 17}%, var(--surface))`;
  const newcomer = s.newcomers[step % s.newcomers.length];

  return (
    <Frame a={a} sub={s.when}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[40px] sm:text-[44px] font-semibold text-ink tracking-[-1.4px] tabular-nums leading-none whitespace-nowrap">{fmt.format(now)}</span>
            <span className="text-[13px] text-ink-2 leading-none">{s.fromLabel}</span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold leading-none" style={{ background: "#e3f6ea", color: "#0e7a3c" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" />
            {s.live}
          </span>
        </div>

        {/* Одна смуга на весь форум: шматок — місто. */}
        <div className="flex h-4 rounded-full overflow-hidden bg-surface-3">
          {counts.map((n, i) => (
            <span
              key={s.cities[i].name}
              className="h-full transition-[width] duration-700 ease-out first:rounded-l-full"
              style={{ width: `${(n / full) * 100}%`, background: shade(i) }}
            />
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {s.cities.map((city, i) => (
            <li key={city.name} className="flex items-center gap-1.5 text-[13px] leading-none">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: shade(i) }} />
              <span className="text-ink font-medium">{city.name}</span>
              <span className="text-ink-3 tabular-nums">{fmt.format(counts[i])}</span>
            </li>
          ))}
        </ul>

        {/* Щойно зареєстрована людина — щокроку інша. */}
        <div key={newcomer} className="mock-pop flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5">
          <PersonAvatar look={lookFor(newcomer)} size={30} />
          <span className="flex flex-col min-w-0">
            <span className="text-[13.5px] font-semibold text-ink leading-none truncate">{newcomer}</span>
            <span className="text-[12px] text-ink-3 leading-none mt-1">{s.fresh}</span>
          </span>
          <span className="ml-auto text-[13px] font-semibold tabular-nums shrink-0" style={{ color: inked(accent) }}>
            +1
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* ── Організація: проєкт збирає кошти, звіт складається сам ────── */
const RAISED = [0.52, 0.6, 0.66, 0.72, 0.72];

function OrganizationsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.organizations;
  const accent = ACCENTS.organizations;
  const step = useStep(RAISED.length, 1100, active);
  const pct = RAISED[step];
  const done = step === RAISED.length - 1;
  const fmt = new Intl.NumberFormat(c.locale);
  const raised = Math.round((s.goal * pct) / 1000) * 1000;
  const R = 52;
  const L = 2 * Math.PI * R;

  return (
    <Frame a={a} sub={s.period}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative w-[112px] h-[112px] sm:w-[132px] sm:h-[132px] shrink-0">
            <svg viewBox="0 0 132 132" className="w-full h-full -rotate-90" aria-hidden>
              <circle cx="66" cy="66" r={R} fill="none" stroke="var(--surface-3)" strokeWidth="13" />
              <circle
                cx="66"
                cy="66"
                r={R}
                fill="none"
                stroke={accent}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={L}
                strokeDashoffset={L * (1 - pct)}
                style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[26px] sm:text-[30px] font-semibold text-ink tracking-[-0.8px] leading-none tabular-nums">{Math.round(pct * 100)}%</span>
              <span className="text-[12px] text-ink-3 leading-none mt-1">{s.raisedLabel}</span>
            </span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[22px] sm:text-[26px] font-semibold text-ink tracking-[-0.6px] leading-none tabular-nums whitespace-nowrap">
              {fmt.format(raised)} {s.currency}
            </span>
            <span className="text-[13px] text-ink-3 leading-none tabular-nums whitespace-nowrap">
              {s.ofLabel} {fmt.format(s.goal)} {s.currency}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 rounded-xl border border-hairline divide-x divide-hairline">
          {s.facts.map((f) => (
            <div key={f.label} className="px-2.5 sm:px-3 py-2.5 flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold text-ink leading-none tracking-[-0.3px] tabular-nums">{f.value}</span>
              <span className="text-[12px] text-ink-3 leading-[1.25]">{f.label}</span>
            </div>
          ))}
        </div>

        <span
          className="self-start inline-flex items-center gap-2 min-h-9 py-2 px-4 rounded-full text-[13px] leading-[1.25] font-semibold text-white transition-[background] duration-300"
          style={{ background: done ? "#0e7a3c" : solid(accent) }}
        >
          {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />}
          {s.report}
        </span>
      </div>
    </Frame>
  );
}

/* ── Навчальний заклад: студенти потоку йдуть уроками до сертифіката ── */
const LESSONS = 10;
/* Скільки уроків пройшов кожен студент у кожному кадрі: щокроку хтось
   один робить крок, а перша, хто дійшла до кінця, отримує сертифікат. */
const EDU_FRAMES = [
  [9, 8, 7, 7, 5, 3],
  [10, 8, 7, 7, 5, 3],
  [10, 8, 8, 7, 5, 3],
  [10, 8, 8, 7, 6, 3],
  [10, 9, 8, 7, 6, 4],
  [10, 9, 8, 7, 6, 4],
];

function EducationScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.education;
  const accent = ACCENTS.education;
  const step = useStep(EDU_FRAMES.length, 1200, active);
  const at = EDU_FRAMES[step];
  const prev = EDU_FRAMES[(step + EDU_FRAMES.length - 1) % EDU_FRAMES.length];
  const graduates = at.filter((n) => n >= LESSONS).length;
  /* Хто на якому вузлі: студенти стоять стовпчиком над своїм уроком. */
  const stacks = Array.from({ length: LESSONS }, (_, k) => s.students.filter((_, i) => at[i] === k + 1));

  return (
    <Frame a={a} sub={s.stream}>
      <div className="flex flex-col gap-4">
        <span
          key={graduates}
          className={cn("self-end inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold leading-none", step > 0 && "mock-pop")}
          style={graduates ? { background: "#fdf3d2", color: "#8a6500" } : { background: "var(--surface-3)", color: "var(--ink-3)" }}
        >
          <Award className="w-3.5 h-3.5" strokeWidth={2.4} />
          {s.certificatesLabel}: {graduates}
        </span>
        <div className="relative">
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${LESSONS}, minmax(0, 1fr))` }}>
            {stacks.map((who, k) => (
              <div key={k} className="flex flex-col-reverse items-center gap-1 h-[64px] pb-2">
                {who.map((name) => {
                  const i = s.students.indexOf(name);
                  const moved = step > 0 && prev[i] !== at[i];
                  const last = k === LESSONS - 1;
                  return (
                    <span
                      key={`${name}-${k}`}
                      title={name}
                      className={cn("relative rounded-full ring-2 ring-surface", moved && "mock-pop")}
                    >
                      <PersonAvatar look={lookFor(name)} size={26} />
                      {last && (
                        <span
                          aria-hidden
                          className="absolute -right-1.5 -top-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                          style={{ background: "#d4a106" }}
                        >
                          <Award className="w-2.5 h-2.5" strokeWidth={2.6} />
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Лінія уроків */}
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${LESSONS}, minmax(0, 1fr))` }}>
            <span aria-hidden className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-surface-3" />
            {Array.from({ length: LESSONS }, (_, k) => {
              /* У кольорі — лише уроки, на яких зараз хтось стоїть. */
              const reached = stacks[k].length > 0;
              const last = k === LESSONS - 1;
              return (
                <span key={k} className="relative flex justify-center">
                  <span
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10.5px] font-bold tabular-nums transition-colors duration-300"
                    style={{
                      background: last && graduates ? "#d4a106" : reached ? accent : "var(--surface)",
                      borderColor: last && graduates ? "#d4a106" : reached ? accent : "var(--hairline-strong)",
                      color: reached || (last && graduates) ? "#fff" : "var(--ink-3)",
                    }}
                  >
                    {last ? <GraduationCap className="w-3.5 h-3.5" strokeWidth={2.4} /> : k + 1}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 rounded-xl border border-hairline divide-x divide-hairline">
          {s.facts.map((f) => (
            <div key={f.label} className="px-3 py-2.5 flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold text-ink leading-none tracking-[-0.3px] tabular-nums whitespace-nowrap">{f.value}</span>
              <span className="text-[12px] text-ink-3 leading-[1.25]">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── Інтеграції: та сама патч-панель, що на головній, і рядок для вас ── */
const SERVICE_LOOKS: { bg: string; Icon: LucideIcon }[] = [
  { bg: "#229ED9", Icon: Send },
  { bg: "#7360f2", Icon: MessageCircle },
  { bg: "#f59e0b", Icon: MessageSquareText },
  { bg: "#1a73e8", Icon: CalendarDays },
];

function Toggle({ on, accent }: { on: boolean; accent: string }) {
  return (
    <span
      aria-hidden
      className="relative block w-10 h-6 rounded-full shrink-0 transition-colors duration-300"
      style={{ background: on ? accent : "var(--hairline-strong)" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: on ? "translateX(16px)" : "none" }}
      />
    </span>
  );
}

function IntegrationsScreen({ c, a, active }: { c: CooperationCopy; a: CooperationAudience; active: boolean }) {
  const s = c.screens.integrations;
  const accent = ACCENTS.integrations;
  /* Вимкнено → увімкнули → тримаємо два кадри. */
  const step = useStep(4, 1300, active);
  const yours = step >= 1;
  const total = s.services.length + 1;
  const title = s.title.replace("{n}", String(s.services.length + (yours ? 1 : 0))).replace("{total}", String(total));

  return (
    <Frame a={a} sub={title}>
      <ul className="flex flex-col gap-2">
        {s.services.map((svc, i) => {
          const look = SERVICE_LOOKS[i % SERVICE_LOOKS.length];
          return (
            <li key={svc.name} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: look.bg }}>
                <look.Icon className="w-4 h-4" strokeWidth={2.2} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-ink leading-none truncate">{svc.name}</span>
                <span className="text-[12px] text-ink-3 leading-[1.25] mt-1">{svc.feeds}</span>
              </span>
              <span className="ml-auto">
                <Toggle on accent={accent} />
              </span>
            </li>
          );
        })}
        <li
          className="flex flex-col gap-2 rounded-xl border-2 border-dashed px-3 py-2.5 transition-colors duration-300"
          style={{ borderColor: yours ? accent : "var(--hairline-strong)", background: yours ? soft(accent, 8) : "var(--surface)" }}
        >
          <span className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-lg border-2 border-dashed flex items-center justify-center shrink-0"
              style={{ borderColor: accent, color: accent }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.6} />
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-ink leading-none truncate">{s.yours.name}</span>
              <span className="text-[12px] text-ink-3 leading-[1.25] mt-1">{s.yours.feeds}</span>
            </span>
            <span className="ml-auto">
              <Toggle on={yours} accent={accent} />
            </span>
          </span>
          {/* Плюшка з'являється лише тоді, коли сервіс увімкнули. */}
          <span
            className="flex items-center gap-1.5 text-[12.5px] font-medium leading-none transition-opacity duration-300"
            style={{ color: inked(accent), opacity: yours ? 1 : 0 }}
            aria-hidden={!yours}
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            {s.yours.perk}
          </span>
        </li>
      </ul>
    </Frame>
  );
}

function AudienceScreen({ c, a, active = true }: { c: CooperationCopy; a: CooperationAudience; active?: boolean }) {
  switch (a.id) {
    case "unions":
      return <UnionsScreen c={c} a={a} active={active} />;
    case "ambassadors":
      return <AmbassadorsScreen c={c} a={a} active={active} />;
    case "clubs":
      return <ClubsScreen c={c} a={a} active={active} />;
    case "movements":
      return <MovementsScreen c={c} a={a} active={active} />;
    case "organizations":
      return <OrganizationsScreen c={c} a={a} active={active} />;
    case "education":
      return <EducationScreen c={c} a={a} active={active} />;
    case "partners":
      return <PartnersScreen c={c} a={a} active={active} />;
    case "integrations":
      return <IntegrationsScreen c={c} a={a} active={active} />;
  }
}

/* ── Дія адресата: заявка на зустріч або телеграм ─────────────── */

function Action({ a, className, style, children }: { a: CooperationAudience; className: string; style?: CSSProperties; children: ReactNode }) {
  const { openFor } = useDemoModal();
  const track = { "data-track": "cta", "data-place": `співпраця · ${a.id}` };
  if (a.action === "demo") {
    /* Менеджер читає лід українською — рядок беремо з ua, хоч би якою
       мовою була сторінка. */
    const leadNote = COOPERATION_COPY.ua.audiences.find((x) => x.id === a.id)?.leadNote;
    return (
      <button
        type="button"
        onClick={() => openFor({ orgPlaceholder: a.orgPlaceholder, note: leadNote })}
        className={className}
        style={style}
        {...track}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      href={SITE_TELEGRAM}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      {...track}
    >
      {children}
    </a>
  );
}

const ACTION_ICONS: Record<CooperationAudience["action"], LucideIcon> = { demo: ArrowRight, telegram: Send };

export default function CooperationStage() {
  const { lang } = useLang();
  const c = COOPERATION_COPY[lang];

  return (
    <section className="w-full flex flex-col items-center pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-16">
        <FadeIn className="flex flex-col gap-3 md:gap-4 max-w-[820px]">
          <h1 className="font-semibold text-ink text-[44px] sm:text-[60px] lg:text-[84px] leading-[1.0] tracking-[-1.6px] lg:tracking-[-3px] text-balance">
            {c.title}
          </h1>
          <p className="text-[16px] md:text-[19px] text-ink-2 leading-[1.45] max-w-[640px]">{c.text}</p>
        </FadeIn>

        <div className="flex flex-col gap-5 md:gap-6">
          {c.audiences.map((a, i) => (
            <FadeIn key={a.id} variant="scale">
              <Block c={c} a={a} screenLeft={i % 2 === 1} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Петля екрана грає, лише поки блок у кадрі (із запасом у пів екрана). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { rootMargin: "25% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/* ── Блок адресата ────────────────────────────────────────────────
   Розкрій той самий, що в картках огляду на головній (features.tsx):
   одна половина — екран у тінті кольору адресата, друга — велика назва,
   одне речення і одна дія. Боки чергуються шахівницею, ширша половина
   завжди під екраном. На телефоні спершу назва й дія, під ними екран. */
function Block({ c, a, screenLeft }: { c: CooperationCopy; a: CooperationAudience; screenLeft: boolean }) {
  const accent = ACCENTS[a.id];
  const Icon = ACTION_ICONS[a.action];
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-1",
        screenLeft ? "md:grid-cols-[1.35fr_1fr]" : "md:grid-cols-[1fr_1.35fr]"
      )}
    >
      <div className={cn("flex flex-col justify-center items-start gap-4 md:gap-5 p-7 md:p-10", screenLeft ? "md:order-2" : "md:order-1")}>
        <h2 className="font-semibold text-ink text-[40px] sm:text-[48px] lg:text-[60px] leading-[1.0] tracking-[-1px] lg:tracking-[-2px]">
          {a.name}
        </h2>
        <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5] max-w-[380px]">{a.tagline}</p>
        <Action
          a={a}
          className="mt-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[15.5px] font-semibold text-white whitespace-nowrap transition-[filter] hover:brightness-110"
          style={{ background: solid(accent) }}
        >
          {a.action !== "demo" && <Icon className="w-4 h-4" strokeWidth={2.2} />}
          {a.cta}
          {a.action === "demo" && <Icon className="w-4 h-4" strokeWidth={2.2} />}
        </Action>
      </div>

      <div
        className={cn(
          "flex items-center justify-center p-4 sm:p-6 md:p-8 md:min-h-[520px]",
          screenLeft ? "md:order-1" : "md:order-2"
        )}
        style={{ background: tint(accent) }}
      >
        <div className="w-full max-w-[480px]">
          <AudienceScreen c={c} a={a} active={seen} />
        </div>
      </div>
    </div>
  );
}

/* ── Закривашка сторінки: та сама темна панель, що й у <Cta />,
   але дія — розмова, а не демо: сюди приходять не лише церкви. ── */
export function CooperationOutro() {
  const { lang } = useLang();
  const c = COOPERATION_COPY[lang];
  const mail = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(c.outro.mailSubject)}`;

  return (
    <section className="w-full flex flex-col items-center px-5 md:px-8 py-12 sm:py-16 md:py-24 bg-page">
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[40px] px-5 py-9 sm:px-8 sm:py-12 md:px-14 md:py-16">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(115deg, #0a1f3d 0%, #06356e 52%, #0b4f9e 100%)" }} />
          <div
            aria-hidden
            className="aurora-a absolute -top-[260px] -left-[120px] w-[720px] h-[520px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(0,122,255,0.55), transparent 100%)" }}
          />
          <div
            aria-hidden
            className="aurora-b absolute -bottom-[220px] -right-[140px] w-[620px] h-[460px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(140,194,255,0.30), transparent 100%)" }}
          />

          <div className="flex flex-col items-center text-center gap-7 sm:gap-8">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <h2 className="font-semibold text-white text-[36px] sm:text-[48px] md:text-[64px] leading-[1.02] tracking-[-1px] md:tracking-[-2.4px]">
                {c.outro.title}
              </h2>
              <p className="text-[16px] sm:text-[18px] text-white/75 leading-[1.45] max-w-[560px]">{c.outro.text}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
              <a
                href={SITE_TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta"
                data-place="співпраця · фінальний блок"
                className="btn-primary group relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
              >
                <span className="absolute inset-0 bg-white rounded-full" />
                <Send className="relative w-[17px] h-[17px] text-[#06356e]" />
                <span className="relative text-[#06356e] font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                  {c.outro.telegram}
                </span>
              </a>
              <a
                href={mail}
                className="relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors duration-200 hover:bg-white/12"
              >
                <Mail className="w-[16px] h-[16px] text-white/80" />
                <span className="text-white font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">{SITE_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
