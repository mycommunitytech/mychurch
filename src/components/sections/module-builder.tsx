"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Blocks, Check, Church, LayoutGrid } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { BUILDER_GROUPS, CORE_MODULES, ALL_GOALS, findGoal } from "@/content/builder";
import { track } from "@/lib/analytics/client";
import { useBuilder } from "@/context/builder-context";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import type { Dict, Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   The constructor. Nobody has to know the catalogue: the visitor
   marks what they want to simplify, and the workspace on the right
   assembles itself — the sidebar fills with the modules that close
   those wishes, split into "on from day one" and "add later".
   Hovering a wish lights up exactly the modules it brought in.

   Lives on /modules alone: all seventeen wishes in their four groups, and
   the set hands over to the brief below. The home page asks a narrower
   question — one pain, one solved screen — in the «Було — стало» block.
   ──────────────────────────────────────────────────────────────── */

/** [one, few, many] — Ukrainian needs all three, English only the first two. */
function plural(n: number, forms: string[], lang: Lang) {
  if (lang === "en") return n === 1 ? forms[0] : forms[1];
  const d = n % 10;
  const h = n % 100;
  if (d === 1 && h !== 11) return forms[0];
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return forms[1];
  return forms[2];
}

/** Module id → its name and the group it belongs to (for the colour fallback). */
function useModuleIndex(t: Dict) {
  return useMemo(() => {
    const map = new Map<string, { name: string; group: string }>();
    for (const g of t.modules.groups) for (const i of g.items) map.set(i.id, { name: i.name, group: g.id });
    return map;
  }, [t]);
}

type Index = ReturnType<typeof useModuleIndex>;

/* ── One line of the assembled sidebar ──────────────────────────── */
function NavRow({ id, index, state }: { id: string; index: Index; state: "on" | "lit" | "dim" }) {
  const Icon = MODULE_ICONS[id] ?? LayoutGrid;
  const info = index.get(id);
  const accent = moduleAccent(id, info?.group);
  return (
    <div
      className={cn(
        "builder-in flex items-center gap-2 h-[30px] px-2 rounded-[9px] border transition-[background-color,border-color,opacity] duration-200",
        state === "lit" ? "border-brand/40 bg-brand-soft" : "border-transparent",
        state === "dim" && "opacity-40"
      )}
    >
      <Icon className="w-[14px] h-[14px] shrink-0" strokeWidth={2.1} style={{ color: accent }} />
      <span className="text-[12px] text-ink truncate leading-none">{info?.name ?? id}</span>
    </div>
  );
}

/* ── A rollout stage: the modules of the set as chips ───────────── */
function Stage({
  label, ids, index, later, hovered,
}: {
  label: string; ids: string[]; index: Index; later?: boolean; hovered: Set<string> | null;
}) {
  if (ids.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const Icon = MODULE_ICONS[id] ?? LayoutGrid;
          const info = index.get(id);
          const accent = moduleAccent(id, info?.group);
          const lit = hovered?.has(id) ?? false;
          return (
            <span
              key={id}
              className={cn(
                "builder-in inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium leading-none border transition-[opacity,border-color,background-color] duration-200",
                later ? "border-dashed border-hairline-strong text-ink-2" : "border-hairline bg-surface-2 text-ink",
                lit && "border-brand/45 bg-brand-soft text-ink",
                hovered && !lit && "opacity-40"
              )}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2.2} style={{ color: later ? undefined : accent }} />
              {info?.name ?? id}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export default function ModuleBuilder() {
  const t = useT();
  const { lang } = useLang();
  const b = t.builder;
  const sp = b.space;
  const index = useModuleIndex(t);
  const { goals, toggle, reset, set } = useBuilder();
  const { openWith } = useDemoModal();
  const [hover, setHover] = useState<string | null>(null);

  const empty = goals.length === 0;
  const hovered = useMemo(() => {
    if (!hover) return null;
    const g = findGoal(hover);
    return g ? new Set(g.modules) : null;
  }, [hover]);

  const groups = BUILDER_GROUPS;
  const total = ALL_GOALS.length;
  const count = set.all.length;
  /* The empty sidebar still carries the two core lines. */
  const shown = empty ? CORE_MODULES.length : count;

  const scrollToSet = () => document.getElementById("builder-set")?.scrollIntoView({ behavior: "smooth", block: "center" });

  /* Набір має десь приземлитись. Досі це був бриф під конструктором, але
     форму звідти прибрано (2026-09-22), тож обрані бажання їдуть одразу
     у вікно демо — тим самим полем `goals`, яким вони їхали в лід. */
  const takeSet = () => {
    track("builder_cta", { place: "modules", picked: goals.length });
    openWith(goals);
  };

  const rowState = (id: string): "on" | "lit" | "dim" => (!hovered ? "on" : hovered.has(id) ? "lit" : "dim");

  return (
    <section id="builder" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <FadeIn className="flex flex-col gap-4 max-w-[760px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{b.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px]">{b.title}</h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{b.lead}</p>
        </FadeIn>

        <FadeIn variant="scale">
          <div className="overflow-clip rounded-[24px] md:rounded-[30px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* ── The wishes ─────────────────────────────────── */}
            <div
              className="relative flex flex-col gap-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-hairline"
              style={{ background: "linear-gradient(170deg, color-mix(in oklab, var(--brand) 7%, var(--surface)) 0%, var(--surface-2) 60%)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[15px] font-semibold text-ink leading-[1.3]">{b.pickLabel}</h3>
                  <span className="text-[12.5px] text-ink-3 tabular-nums">
                    {b.picked.replace("{n}", String(goals.length)).replace("{total}", String(total))}
                  </span>
                </div>
                {!empty && (
                  <button
                    type="button"
                    onClick={reset}
                    className="shrink-0 text-[12.5px] font-medium text-ink-3 hover:text-ink transition-colors duration-150 underline underline-offset-2 decoration-hairline-strong"
                  >
                    {b.reset}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">
                {groups.map((group) => (
                  <div key={group.id} className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                      {b.groups[group.id as keyof typeof b.groups]}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {group.goals.map((goal) => {
                        const copy = b.goals[goal.id as keyof typeof b.goals];
                        const on = goals.includes(goal.id);
                        const accent = moduleAccent(goal.modules[0]);
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => {
                              track("builder_pick", { label: copy.label, id: goal.id, on: !on, place: "modules" });
                              toggle(goal.id);
                            }}
                            onMouseEnter={() => setHover(goal.id)}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover(goal.id)}
                            onBlur={() => setHover(null)}
                            className={cn(
                              "w-full text-left flex items-center gap-3 rounded-[14px] border px-3 py-2.5 transition-[background-color,border-color,box-shadow] duration-150",
                              on ? "border-brand/45 bg-brand-soft" : "border-hairline bg-surface hover:border-hairline-strong hover:bg-surface-2"
                            )}
                          >
                            <span
                              className="w-8 h-8 rounded-[10px] border border-hairline flex items-center justify-center shrink-0"
                              style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: accent }}
                            >
                              <goal.Icon className="w-4 h-4" strokeWidth={2.1} />
                            </span>
                            <span className="text-[14.5px] font-medium text-ink leading-[1.3] min-w-0 flex-1">{copy.label}</span>
                            <span
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-150",
                                on ? "bg-brand border-brand" : "border-hairline-strong bg-surface"
                              )}
                            >
                              {on && <Check className="w-3 h-3 text-white" strokeWidth={3.2} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <p className="hidden lg:block text-[12.5px] text-ink-3 leading-[1.4]">{b.hint}</p>

              {/* Phones: the workspace sits below the list, so keep a way back to it. */}
              {!empty && (
                <div className="lg:hidden sticky bottom-3 z-10 flex justify-center">
                  <button
                    type="button"
                    onClick={scrollToSet}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-surface text-[13px] font-medium shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)]"
                  >
                    <span className="tabular-nums">{count} {plural(count, sp.counter, lang)}</span>
                    <span className="opacity-50">·</span>
                    {sp.toSet}
                    <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.4} />
                  </button>
                </div>
              )}
            </div>

            {/* ── The workspace it adds up to ─────────────────── */}
            <div id="builder-set" className="p-6 md:p-8 bg-surface-2/40 scroll-mt-24">
              {/* The wish list is taller than the workspace, so the workspace follows along. */}
              <div className="lg:sticky lg:top-24 flex flex-col gap-4">
                <div className="rounded-[18px] border border-hairline-strong bg-surface overflow-hidden shadow-[0_28px_56px_-40px_rgba(0,0,0,0.5)]">
                  {/* Window chrome */}
                  <div className="h-10 bg-surface-2 border-b border-hairline flex items-center px-3.5 gap-3">
                    <div className="hidden sm:flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="h-6 min-w-[170px] rounded-md bg-surface-3 flex items-center justify-center gap-2 px-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" />
                        <span className="text-[11px] text-ink-3 leading-none">{sp.url}</span>
                      </div>
                    </div>
                    <span className="hidden sm:block w-[52px]" />
                  </div>

                  <div className="grid grid-cols-[118px_1fr] sm:grid-cols-[164px_1fr] h-[430px] sm:h-[470px]">
                    {/* Sidebar — fills up as wishes are ticked */}
                    <div className="border-r border-hairline bg-surface-2 flex flex-col min-h-0">
                      <div className="h-[46px] shrink-0 px-2.5 flex items-center gap-2 border-b border-hairline">
                        <span className="w-6 h-6 rounded-[8px] bg-brand-soft text-brand flex items-center justify-center shrink-0">
                          <Church className="w-[13px] h-[13px]" strokeWidth={2.2} />
                        </span>
                        <span className="text-[12px] font-medium text-ink truncate leading-none">{sp.church}</span>
                      </div>

                      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-1.5 py-2 flex flex-col gap-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">{sp.core}</span>
                          {CORE_MODULES.map((id) => (
                            <NavRow key={id} id={id} index={index} state={rowState(id)} />
                          ))}
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">{sp.nav}</span>
                          {empty
                            ? sp.emptyRows.map((label, i) => (
                                <div key={i} className="flex items-center gap-2 h-[30px] px-2 rounded-[9px] border border-dashed border-hairline">
                                  <span className="w-[14px] h-[14px] rounded-[4px] bg-surface-3 shrink-0" />
                                  <span className="text-[12px] text-ink-3 truncate leading-none">{label}</span>
                                </div>
                              ))
                            : set.all
                                .filter((id) => !CORE_MODULES.includes(id))
                                .map((id) => <NavRow key={id} id={id} index={index} state={rowState(id)} />)}
                        </div>
                      </div>

                      <div className="h-[34px] shrink-0 px-2.5 flex items-center border-t border-hairline">
                        <span className="text-[10.5px] text-ink-3 tabular-nums truncate leading-none">
                          {shown} {plural(shown, sp.counter, lang)}
                        </span>
                      </div>
                    </div>

                    {/* Main pane — the set and where every module came from */}
                    <div className="relative min-h-0 bg-surface">
                      <div className="h-full overflow-y-auto no-scrollbar p-4 sm:p-5">
                        {empty ? (
                          <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-2">
                            <span className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
                              <Blocks className="w-[22px] h-[22px]" strokeWidth={2} />
                            </span>
                            <span className="text-[15px] font-semibold text-ink leading-[1.3]">{sp.emptyTitle}</span>
                            <span className="text-[13px] text-ink-2 leading-[1.5] max-w-[280px]">{sp.emptyText}</span>
                            <span className="text-[12px] text-ink-3 leading-[1.45] max-w-[280px] pt-3 mt-1 border-t border-hairline">{sp.coreHint}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[13.5px] font-semibold text-ink leading-none">{sp.setTitle}</span>
                              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-medium text-brand leading-none tabular-nums whitespace-nowrap">
                                {count} {plural(count, sp.counter, lang)}
                              </span>
                            </div>

                            <Stage label={sp.start} ids={set.start} index={index} hovered={hovered} />
                            <Stage label={sp.later} ids={set.later} index={index} later hovered={hovered} />

                            <div className="h-px bg-hairline" />

                            <div className="flex flex-col gap-1">
                              <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 pb-1">{sp.why}</span>
                              {goals.map((id) => {
                                const goal = findGoal(id);
                                if (!goal) return null;
                                const copy = b.goals[id as keyof typeof b.goals];
                                return (
                                  <div
                                    key={id}
                                    onMouseEnter={() => setHover(id)}
                                    onMouseLeave={() => setHover(null)}
                                    className={cn(
                                      "builder-in flex items-start gap-2 rounded-[10px] px-2 py-1.5 -mx-2 transition-colors duration-150",
                                      hover === id ? "bg-brand-soft" : "hover:bg-surface-2"
                                    )}
                                  >
                                    <Check className="w-3.5 h-3.5 mt-[3px] text-brand shrink-0" strokeWidth={3} />
                                    <span className="flex flex-col gap-0.5 min-w-0">
                                      <span className="text-[12.5px] text-ink leading-[1.35]">{copy.label}</span>
                                      <span className="text-[11.5px] text-ink-3 leading-[1.35]">
                                        {goal.modules.map((m) => index.get(m)?.name ?? m).join(" · ")}
                                      </span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      {!empty && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
                          style={{ background: "linear-gradient(to top, var(--surface), transparent)" }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={takeSet}
                    disabled={empty}
                    className={cn(
                      "btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full rounded-full overflow-hidden",
                      empty && "opacity-45 pointer-events-none"
                    )}
                  >
                    <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.32px] leading-[1.4]">{sp.cta}</span>
                    <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-[12.5px] text-ink-3 leading-[1.45] text-center">{sp.ctaNote}</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
