"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LayoutGrid, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { GROUP_ICONS, GROUP_ACCENTS } from "@/components/shared/module-icons";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   "Усе сходиться в картці людини": сама картка і більше нічого.
   Дві колонки груп із ортогональними кабелями прибрані 2026-09-22 —
   схема читалась як складна діаграма, а не як екран. Те, що робили
   кабелі, тепер робить сам рядок: він підсвічується по черзі, а
   підпис під карткою називає модулі, які його заповнюють.
   ──────────────────────────────────────────────────────────────── */

type RowId = "outreach" | "serving" | "schedule" | "team" | "property" | "channels" | "insight";

/** Порядок рядків у картці + група модулів, звідки береться колір та іконка. */
const ROWS: { id: RowId; group: string; Icon?: LucideIcon }[] = [
  { id: "outreach", group: "outreach" },
  { id: "serving", group: "serving" },
  { id: "schedule", group: "schedule" },
  { id: "team", group: "team" },
  { id: "property", group: "property" },
  { id: "channels", group: "integrations" },
  { id: "insight", group: "insight", Icon: Sparkles },
];

const STORY: (RowId | "platform")[] = [...ROWS.map((r) => r.id), "platform"];

/* Slate: шар налаштувань — не група модулів, тож чужого акценту не позичає. */
const PLATFORM_ACCENT = "#64748b";

const STEP_MS = 3200;

/* prefers-reduced-motion as a store: false on the server, live on the client. */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia(RM_QUERY).matches;
const getReducedServer = () => false;

export default function ModulesMap({ bare }: { bare?: boolean }) {
  const t = useT();
  const copy = t.modulesMap;

  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<RowId | "platform" | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  const boxRef = useRef<HTMLDivElement>(null);

  /* Only animate while on screen. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = hover !== null || !inView || reduced;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STORY.length), STEP_MS);
    return () => clearInterval(id);
  }, [paused]);

  const active: RowId | "platform" = hover ?? STORY[step % STORY.length];
  /* The setup layer is on: its own row inside the profile fills in. */
  const setupOn = active === "platform";
  const customRow = setupOn ? copy.custom.filled : copy.custom.empty;

  return (
    <section className={cn("w-full flex flex-col items-center", bare ? "" : "py-16 md:py-24")}>
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-6 md:gap-8">
        {bare ? null : (
          <FadeIn className="flex flex-col items-center gap-3 text-center">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{copy.eyebrow}</span>
            <h2 className="font-semibold text-ink text-[26px] md:text-[34px] leading-[1.15] tracking-[-0.9px] max-w-[680px]">
              {copy.title}
            </h2>
          </FadeIn>
        )}

        <FadeIn className="flex flex-col items-center gap-5">
          <div
            ref={boxRef}
            className="w-full max-w-[380px] rounded-[20px] bg-surface border border-hairline shadow-[0_18px_46px_-28px_rgba(0,0,0,0.38)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-surface-2">
              <PersonAvatar look={lookFor(copy.profile.name)} size={40} className="rounded-full shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-semibold text-ink text-[15px] leading-none tracking-[-0.2px]">{copy.profile.name}</span>
                <span className="text-[12px] text-ink-2 leading-none truncate">{copy.profile.status}</span>
              </div>
              <span className="ml-auto rounded-full bg-brand-soft text-brand px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] leading-none shrink-0">
                {copy.profile.badge}
              </span>
            </div>

            <div className="flex flex-col p-1.5">
              {ROWS.map(({ id, group, Icon: Custom }) => {
                const row = copy.rows[id];
                const accent = GROUP_ACCENTS[group] ?? "#007aff";
                const Icon = Custom ?? GROUP_ICONS[group] ?? LayoutGrid;
                const on = active === id;
                return (
                  <div
                    key={id}
                    onMouseEnter={() => setHover(id)}
                    onMouseLeave={() => setHover(null)}
                    className="flex items-center gap-2 rounded-lg px-1.5 py-[7px] transition-colors duration-300"
                    style={on ? { background: `color-mix(in oklab, ${accent} 10%, var(--surface))` } : undefined}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{ background: on ? accent : `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: on ? "#fff" : accent }}
                    >
                      <Icon className="w-[11px] h-[11px]" strokeWidth={2.4} />
                    </span>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-ink-3 w-[66px] shrink-0 truncate">{row.label}</span>
                    <span className={cn("text-[12.5px] leading-[1.3] truncate transition-colors duration-300", on ? "text-ink font-medium" : "text-ink-2")}>
                      {row.value}
                    </span>
                  </div>
                );
              })}

              {/* Рядок, якого ми не постачали: церква додає його сама.
                  Порожній, поки шар налаштувань не засвітиться, — тоді
                  заповнюється. */}
              <div
                onMouseEnter={() => setHover("platform")}
                onMouseLeave={() => setHover(null)}
                className="mt-1 flex items-center gap-2 rounded-lg border border-dashed px-1.5 py-[7px] transition-colors duration-300"
                style={{
                  borderColor: setupOn ? `color-mix(in oklab, ${PLATFORM_ACCENT} 60%, var(--hairline-strong))` : "var(--hairline-strong)",
                  background: setupOn ? `color-mix(in oklab, ${PLATFORM_ACCENT} 10%, var(--surface))` : "transparent",
                }}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300"
                  style={{
                    background: setupOn ? PLATFORM_ACCENT : `color-mix(in oklab, ${PLATFORM_ACCENT} 12%, var(--surface))`,
                    color: setupOn ? "#fff" : PLATFORM_ACCENT,
                  }}
                >
                  {setupOn
                    ? <SlidersHorizontal className="w-[11px] h-[11px]" strokeWidth={2.4} />
                    : <Plus className="w-[11px] h-[11px]" strokeWidth={2.6} />}
                </span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-ink-3 w-[66px] shrink-0 truncate">{customRow.label}</span>
                <span
                  key={String(setupOn)}
                  className={cn("text-[12.5px] leading-[1.3] truncate transition-colors duration-300", setupOn ? "text-ink font-medium" : "text-ink-3")}
                  style={setupOn && !reduced ? { animation: "revealUp 0.4s var(--ease-out-soft) both" } : undefined}
                >
                  {customRow.value}
                </span>
                {setupOn && (
                  <span
                    className="ml-auto shrink-0 rounded-full px-1.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.06em] leading-none"
                    style={{ background: `color-mix(in oklab, ${PLATFORM_ACCENT} 16%, var(--surface))`, color: PLATFORM_ACCENT }}
                  >
                    {copy.custom.filled.tag}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Підпис до підсвіченого рядка: називає модулі, які його заповнюють. */}
          <p
            key={active}
            className="text-[15px] text-ink-2 leading-[1.45] text-center max-w-[560px]"
            style={{ animation: "revealUp 0.4s var(--ease-out-soft) both" }}
            aria-live="polite"
          >
            {copy.nodeHints[active]}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
