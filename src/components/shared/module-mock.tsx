"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Bot, Calendar as CalendarIcon, Check, ChevronDown, Send } from "lucide-react";
import type { MockBadge, MockSpec, Tone } from "@/content/modules/types";

/* ────────────────────────────────────────────────────────────────
   Data-driven product mock for module pages. Content authors pick a
   `kind` and supply rows; this file owns layout, colour and motion
   (same `mock-on` convention as the other mocks).
   ──────────────────────────────────────────────────────────────── */

const TONE_HEX: Record<Tone, string> = {
  brand: "var(--brand)",
  green: "#12a150",
  amber: "#f59e0b",
  red: "#f43f5e",
  violet: "#8b5bf0",
  neutral: "#94a3b8",
};

const TONE_BADGE: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  green: "bg-[#12a150]/12 text-[#0e7a3c] dark:text-[#3ddc97]",
  amber: "bg-[#ff9500]/14 text-[#c46a00] dark:text-[#ffb454]",
  red: "bg-[#e11d48]/12 text-[#be123c] dark:text-[#fb7185]",
  violet: "bg-[#8b5bf0]/14 text-[#6d3fd6] dark:text-[#b69cff]",
  neutral: "bg-surface-3 text-ink-2 border border-hairline",
};

const AVATAR = ["#5b8af0", "#f07b5b", "#8b5bf0", "#12a150", "#f0c45b", "#f05b8b"];

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

const delay = (i: number, base = 220, step = 110): CSSProperties => ({ animationDelay: `${base + i * step}ms` });

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function Badge({ badge }: { badge: MockBadge }) {
  return (
    <span className={["inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0", TONE_BADGE[badge.tone ?? "neutral"]].join(" ")}>
      {badge.label}
    </span>
  );
}

function Avatar({ name, i, size = "w-8 h-8 text-[12px]" }: { name: string; i: number; size?: string }) {
  return (
    <span className={["rounded-full text-white font-semibold flex items-center justify-center shrink-0", size].join(" ")} /* Білі ініціали: колір із палітри трохи поглиблюємо, щоб тримати 4.5:1. */
      style={{ backgroundColor: `color-mix(in oklab, ${AVATAR[i % AVATAR.length]} 76%, #04121f)` }}>
      {initials(name)}
    </span>
  );
}

function Header({ title, subtitle, Icon, accent, right }: { title: string; subtitle?: string; Icon: LucideIcon; accent: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-hairline bg-surface-2">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: accent }}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-semibold text-ink leading-none truncate">{title}</span>
          {subtitle && <span className="text-[12px] text-ink-3 leading-none mt-1.5 truncate">{subtitle}</span>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ── kinds ─────────────────────────────────────────────────────── */

/* Вузький екран (телефон): макет — контейнер, і коли він вужчий за 400px,
   широкі види перебудовуються самі — таблиця лишає дві колонки, дошка
   гортається вбік, календар показує лише дні з подіями. Інакше в 350px
   кожне слово обрізалось до «Мікроф…» або ламалось по літерах. */
const NARROW_DAYS = 4;

function ListBody({ spec }: { spec: Extract<MockSpec, { kind: "list" }> }) {
  return (
    <div className="p-2 flex flex-col">
      {spec.items.map((it, i) => (
        <div key={it.title + i} className="mock-row flex items-center gap-3 rounded-xl px-2.5 py-2.5 border-b border-hairline last:border-b-0" style={delay(i)}>
          <Avatar name={it.title} i={i} />
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <span className="text-[13.5px] font-medium text-ink leading-none truncate">{it.title}</span>
            {it.sub && <span className="text-[11.5px] text-ink-3 leading-none truncate">{it.sub}</span>}
          </div>
          {it.meta && <span className={["text-[12px] text-ink-2 tabular-nums shrink-0", it.badge ? "@max-[400px]:hidden" : ""].join(" ")}>{it.meta}</span>}
          {it.badge && <Badge badge={it.badge} />}
        </div>
      ))}
      {spec.footer && (
        <span className="mock-row px-3 pt-2.5 pb-1 text-[11.5px] text-ink-3 leading-none" style={delay(spec.items.length)}>
          {spec.footer}
        </span>
      )}
    </div>
  );
}

function TableBody({ spec }: { spec: Extract<MockSpec, { kind: "table" }> }) {
  const hasBadge = spec.rows.some((r) => r.badge);
  const cols = spec.columns.map((_, i) => (i === 0 ? "minmax(0,1.4fr)" : "minmax(0,1fr)")).join(" ") + (hasBadge ? " auto" : "");
  const narrow = "minmax(0,1.5fr) minmax(0,1fr)" + (hasBadge ? " auto" : "");
  const grid = { "--cols": cols, "--cols-narrow": narrow } as CSSProperties;
  const gridCls = "grid [grid-template-columns:var(--cols)] @max-[400px]:[grid-template-columns:var(--cols-narrow)]";
  const extra = (ci: number) => (ci >= 2 ? "@max-[400px]:hidden" : "");
  return (
    <div className="p-2">
      <div className={`${gridCls} gap-3 px-2.5 py-2`} style={grid}>
        {spec.columns.map((c, ci) => (
          <span key={c} className={["text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 truncate", extra(ci)].join(" ")}>{c}</span>
        ))}
        {hasBadge && <span />}
      </div>
      {spec.rows.map((r, i) => (
        <div key={i} className={`mock-row ${gridCls} items-center gap-3 px-2.5 py-2.5 border-t border-hairline text-[12.5px]`} style={{ ...grid, ...delay(i) }}>
          {r.cells.map((c, ci) => (
            <span key={ci} className={[ci === 0 ? "font-medium text-ink truncate" : "text-ink-2 truncate tabular-nums", extra(ci)].join(" ")}>{c}</span>
          ))}
          {hasBadge && <span className="flex justify-end">{r.badge && <Badge badge={r.badge} />}</span>}
        </div>
      ))}
    </div>
  );
}

function StatsBody({ spec, accent }: { spec: Extract<MockSpec, { kind: "stats" }>; accent: string }) {
  const max = Math.max(1, ...spec.bars.map((b) => b.value));
  return (
    <div className="p-4 @max-[400px]:p-3 flex flex-col gap-4">
      <div className="grid gap-2 @max-[400px]:gap-1.5" style={{ gridTemplateColumns: `repeat(${spec.kpis.length}, minmax(0,1fr))` }}>
        {spec.kpis.map((k, i) => (
          <div key={k.label} className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 @max-[400px]:px-2 py-2.5 flex flex-col gap-1.5 min-w-0" style={delay(i)}>
            <span className="text-[11px] text-ink-3 leading-none truncate">{k.label}</span>
            <span className="text-[20px] @max-[400px]:text-[15px] @max-[400px]:tracking-[-0.3px] font-semibold text-ink leading-none tracking-[-0.5px] tabular-nums truncate">{k.value}</span>
            {k.trend && <span className="text-[11px] font-medium text-[#0e7a3c] dark:text-[#3ddc97] leading-none truncate">{k.trend}</span>}
          </div>
        ))}
      </div>
      {spec.barsTitle && <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">{spec.barsTitle}</span>}
      <div className="flex items-end gap-1.5 h-[112px]">
        {spec.bars.map((b, i) => (
          <div key={b.label + i} className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-1.5">
            <span
              className="mock-bar w-full rounded-t-md origin-bottom"
              style={{
                height: `${Math.max(6, (b.value / max) * 100)}%`,
                background: b.value === max ? accent : `color-mix(in oklab, ${accent} 38%, var(--surface-3))`,
                animationDelay: `${320 + i * 70}ms`,
              }}
            />
            <span className="text-[10px] text-ink-3 leading-none truncate max-w-full">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatBody({ spec, accent }: { spec: Extract<MockSpec, { kind: "chat" }>; accent: string }) {
  return (
    <div className="p-4 flex flex-col gap-2.5 bg-surface-2/50">
      {spec.messages.map((m, i) =>
        m.from === "bot" ? (
          <div key={i} className="mock-row flex items-end gap-2 max-w-[88%]" style={delay(i, 220, 160)}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: accent }}>
              <Bot className="w-3.5 h-3.5" strokeWidth={2.2} />
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="rounded-2xl rounded-bl-md bg-surface border border-hairline px-3 py-2 text-[13px] text-ink leading-[1.4]">{m.text}</span>
              {m.time && <span className="text-[10.5px] text-ink-3 pl-1 leading-none">{m.time}</span>}
            </div>
          </div>
        ) : (
          <div key={i} className="mock-row flex flex-col items-end gap-1 self-end max-w-[88%]" style={delay(i, 220, 160)}>
            <span className="rounded-2xl rounded-br-md px-3 py-2 text-[13px] leading-[1.4] text-white" style={{ background: accent }}>{m.text}</span>
            {m.time && <span className="text-[10.5px] text-ink-3 pr-1 leading-none">{m.time}</span>}
          </div>
        )
      )}
      {spec.input && (
        <div className="mock-row mt-1 flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2.5" style={delay(spec.messages.length, 220, 160)}>
          <span className="flex-1 text-[13px] text-ink-3 truncate">{spec.input}</span>
          <Send className="w-4 h-4 shrink-0" style={{ color: accent }} />
        </div>
      )}
    </div>
  );
}

function BoardBody({ spec }: { spec: Extract<MockSpec, { kind: "board" }> }) {
  return (
    <div className="p-2.5 grid grid-cols-3 @max-[400px]:grid-cols-[repeat(3,152px)] @max-[400px]:overflow-x-auto @max-[400px]:snap-x no-scrollbar gap-2 items-start">
      {spec.columns.map((col, ci) => (
        <div key={col.title} className="flex flex-col gap-2 rounded-xl bg-surface-2 border border-hairline p-1.5 min-w-0 snap-start">
          <div className="flex items-center justify-between gap-1 px-1 pt-0.5">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3 truncate">{col.title}</span>
            <span className="text-[10.5px] text-ink-3 tabular-nums shrink-0">{col.cards.length}</span>
          </div>
          {col.cards.map((card, i) => (
            <div key={card.title + i} className="mock-row rounded-lg bg-surface border border-hairline p-2 flex flex-col gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={delay(ci * 3 + i, 220, 90)}>
              <span className="text-[12px] font-medium text-ink leading-[1.3]">{card.title}</span>
              {card.sub && <span className="text-[10.5px] text-ink-3 leading-[1.3]">{card.sub}</span>}
              {card.tag && <Badge badge={card.tag} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarBody({ spec }: { spec: Extract<MockSpec, { kind: "calendar" }> }) {
  const all = spec.days.map((_, i) => i);
  /* Найзавантаженіші дні, за рівних — ближчі до неділі: у церкві тиждень
     важчає до вихідних, і неділя не має випадати з показу. */
  const count = (di: number) => spec.events.filter((e) => e.day === di).length;
  const busy = all
    .filter((di) => count(di) > 0)
    .sort((a, b) => count(b) - count(a) || b - a)
    .slice(0, NARROW_DAYS)
    .sort((a, b) => a - b);
  return (
    <>
      <div className="@max-[400px]:hidden"><CalendarGrid spec={spec} days={all} /></div>
      <div className="hidden @max-[400px]:block"><CalendarGrid spec={spec} days={busy.length >= 2 ? busy : all.slice(0, NARROW_DAYS)} /></div>
    </>
  );
}

function CalendarGrid({ spec, days }: { spec: Extract<MockSpec, { kind: "calendar" }>; days: number[] }) {
  const cols = `repeat(${days.length}, minmax(0,1fr))`;
  const ROWS = 8;
  return (
    <div className="p-3 flex flex-col gap-1.5">
      <div className="grid gap-1" style={{ gridTemplateColumns: cols }}>
        {days.map((di) => (
          <span key={di} className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3 text-center truncate">{spec.days[di]}</span>
        ))}
      </div>
      <div className="grid gap-1 h-[216px]" style={{ gridTemplateColumns: cols }}>
        {days.map((di) => (
          <div key={di} className="relative rounded-lg bg-surface-2 border border-hairline overflow-hidden">
            {Array.from({ length: ROWS - 1 }, (_, r) => (
              <span key={r} aria-hidden className="absolute left-0 right-0 border-t border-hairline" style={{ top: `${((r + 1) / ROWS) * 100}%` }} />
            ))}
            {spec.events
              .map((e, ei) => ({ ...e, ei }))
              .filter((e) => e.day === di)
              .map((e) => {
                const c = TONE_HEX[e.tone ?? "brand"];
                return (
                  <span
                    key={e.ei}
                    className="mock-row absolute left-[3px] right-[3px] rounded-md px-1.5 py-1 text-[10px] font-medium leading-[1.2] overflow-hidden"
                    style={{
                      top: `calc(${(e.start / ROWS) * 100}% + 2px)`,
                      height: `calc(${(e.span / ROWS) * 100}% - 4px)`,
                      background: `color-mix(in oklab, ${c} 18%, var(--surface))`,
                      color: c,
                      boxShadow: `inset 2px 0 0 ${c}`,
                      ...delay(e.ei, 260, 90),
                    }}
                  >
                    {e.title}
                  </span>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormBody({ spec, accent }: { spec: Extract<MockSpec, { kind: "form" }>; accent: string }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      {spec.fields.map((f, i) => (
        <div key={f.label + i} className="mock-row flex flex-col gap-1.5" style={delay(i)}>
          <span className="text-[11.5px] font-medium text-ink-2 leading-none">{f.label}</span>
          {f.type === "check" ? (
            <span className="flex items-center gap-2 h-9">
              <span className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0" style={{ background: accent }}>
                <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
              </span>
              <span className="text-[13px] text-ink leading-none">{f.value}</span>
            </span>
          ) : (
            <span className={["flex justify-between gap-2 rounded-lg border border-hairline bg-surface-2 px-3 text-[13px] leading-none", f.type === "textarea" ? "min-h-14 items-start pt-3" : "h-9 items-center"].join(" ")}>
              <span className={f.value ? "text-ink truncate" : "text-ink-3"}>{f.value ?? "…"}</span>
              {f.type === "select" && <ChevronDown className="w-3.5 h-3.5 text-ink-3 shrink-0" />}
              {f.type === "date" && <CalendarIcon className="w-3.5 h-3.5 text-ink-3 shrink-0" />}
            </span>
          )}
        </div>
      ))}
      <span className="mock-row mt-1 h-10 rounded-full flex items-center justify-center text-[13.5px] font-semibold text-white" style={{ background: accent, ...delay(spec.fields.length) }}>
        {spec.submit}
      </span>
    </div>
  );
}

function TimelineBody({ spec, accent }: { spec: Extract<MockSpec, { kind: "timeline" }>; accent: string }) {
  return (
    <ul className="p-4 flex flex-col">
      {spec.items.map((it, i) => {
        const last = i === spec.items.length - 1;
        return (
          <li key={it.title + i} className="mock-row flex items-stretch gap-3" style={delay(i)}>
            <span className="w-[44px] shrink-0 text-[12px] font-medium text-ink-3 tabular-nums leading-[20px] pt-0.5">{it.time}</span>
            <span className="flex flex-col items-center shrink-0">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={it.done ? { background: "#12a150", color: "#fff" } : { background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
              >
                {it.done ? <Check className="w-3 h-3" strokeWidth={3.5} /> : <span className="w-2 h-2 rounded-full" style={{ background: accent }} />}
              </span>
              {!last && <span className="flex-1 w-px bg-hairline-strong my-1" />}
            </span>
            <div className={["flex flex-col gap-1 min-w-0 flex-1 pt-0.5", last ? "" : "pb-4"].join(" ")}>
              <span className="text-[13.5px] font-medium text-ink leading-[1.3]">{it.title}</span>
              {it.who && <span className="text-[11.5px] text-ink-3 leading-none">{it.who}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── frame ─────────────────────────────────────────────────────── */

export default function ModuleMock({ spec, accent, Icon }: { spec: MockSpec; accent: string; Icon: LucideIcon }) {
  const { ref, on } = useInView<HTMLDivElement>();

  let body: ReactNode;
  switch (spec.kind) {
    case "list": body = <ListBody spec={spec} />; break;
    case "table": body = <TableBody spec={spec} />; break;
    case "stats": body = <StatsBody spec={spec} accent={accent} />; break;
    case "chat": body = <ChatBody spec={spec} accent={accent} />; break;
    case "board": body = <BoardBody spec={spec} />; break;
    case "calendar": body = <CalendarBody spec={spec} />; break;
    case "form": body = <FormBody spec={spec} accent={accent} />; break;
    case "timeline": body = <TimelineBody spec={spec} accent={accent} />; break;
  }

  return (
    <div ref={ref} className={["@container relative w-full max-w-[440px] mx-auto", on ? "mock-on" : ""].join(" ")}>
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[40px] -z-10 blur-3xl opacity-70"
        style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 24%, transparent), transparent)` }}
      />
      <div className="mock-pop rounded-[22px] border border-hairline bg-surface shadow-[0_30px_60px_-30px_rgba(0,50,120,0.35)] overflow-hidden" style={{ animationDelay: "60ms" }}>
        <Header title={spec.title} subtitle={spec.subtitle} Icon={Icon} accent={accent} />
        {body}
      </div>
    </div>
  );
}
