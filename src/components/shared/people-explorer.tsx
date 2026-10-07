"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, UsersRound, HeartHandshake, GraduationCap, NotebookPen, History, Cake, Church, Phone, User, Check, Sparkles, Plus, X, MousePointerClick } from "lucide-react";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import ClickHere from "@/components/shared/click-here";
import { useT } from "@/lib/lang";

const META_ICONS = [User, Cake, Church, Phone];
const CONFETTI = ["#007aff", "#12a150", "#f59e0b", "#f05b8b", "#8b5bf0", "#0ea5e9"];

function Section({
  icon: Icon,
  accent,
  title,
  delay,
  children,
  className = "",
}: {
  icon: typeof Heart;
  accent: string;
  title: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2", className].join(" ")} style={{ animationDelay: `${delay}ms` }}>
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
        <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}>
          <Icon className="w-3 h-3" strokeWidth={2.4} />
        </span>
        {title}
      </span>
      {children}
    </div>
  );
}

/* Рідні, які самі є в базі, стоять зі своїм фото. Решта — просто літера:
   у справжній базі фото є не в кожного, і чуже обличчя тут гірше за його
   відсутність (донька з лицем сорокарічного чоловіка). */
function FamilyFace({ name, profiles }: { name: string; profiles: readonly { readonly name: string }[] }) {
  const idx = profiles.findIndex((p) => p.name.split(" ")[0] === name);
  if (idx >= 0) return <PersonAvatar look={AVATAR_LOOKS[idx]} size={18} />;
  return (
    <span aria-hidden className="shrink-0 w-[18px] h-[18px] rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-[9px] font-semibold text-ink-3 leading-none">
      {name.slice(0, 1)}
    </span>
  );
}

export default function PeopleExplorer() {
  const t = useT().features.mocks.people;
  const stripRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState<Record<string, string[]>>({});
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!celebrate) return;
    const id = setTimeout(() => setCelebrate(false), 2600);
    return () => clearTimeout(id);
  }, [celebrate]);

  const pick = (i: number) => setSelected((s) => (s === i ? null : i));

  const profile = selected === null ? null : t.profiles[selected];
  const pinned = profile ? [...profile.pins, ...(added[profile.id] ?? [])] : [];
  const bank = profile ? t.pinBank.filter((p) => !pinned.includes(p)) : [];
  const initialBank = profile ? t.pinBank.filter((p) => !profile.pins.includes(p)).length : 0;
  const completeness = profile
    ? Math.round(profile.base + (100 - profile.base) * ((added[profile.id] ?? []).length / Math.max(1, initialBank)))
    : 0;

  const addPin = (pin: string) => {
    if (!profile) return;
    const next = [...(added[profile.id] ?? []), pin];
    setAdded({ ...added, [profile.id]: next });
    if (next.length === initialBank) setCelebrate(true);
  };
  const removePin = (pin: string) => {
    if (!profile) return;
    setAdded({ ...added, [profile.id]: (added[profile.id] ?? []).filter((p) => p !== pin) });
  };

  const ringLen = 2 * Math.PI * 20;

  return (
    <div className="w-full max-w-[560px] mx-auto flex flex-col gap-3">
      {/* Підказка словами — курсор-привид показує, куди тиснути, але не
          каже, що з того буде. Рядок лишається в потоці й коли профіль
          відкрито: якби він зникав, ряд карток стрибав би вгору просто
          під час кліку. Плашкою, а не сірим рядком: 13px на 60% по
          кольоровій половині картки майже не читались (2026-09-30). */}
      <p
        aria-hidden={selected !== null}
        className="self-center inline-flex items-center gap-2 rounded-full bg-surface border border-hairline-strong px-3.5 py-1.5 text-[14px] font-medium text-ink leading-[1.3] shadow-[0_6px_18px_-10px_rgba(0,50,120,0.35)] transition-opacity duration-300"
        style={{ opacity: selected === null ? 1 : 0 }}
      >
        <MousePointerClick className="w-4 h-4 shrink-0 text-brand" strokeWidth={2.2} />
        {t.hint}
      </p>

      {/* Avatar strip */}
      <div ref={stripRef} className="relative grid grid-cols-3 gap-2 md:gap-3">
        {t.profiles.map((p, i) => {
          const active = selected === i;
          return (
            <button
              key={p.id}
              onClick={() => pick(i)}
              aria-pressed={active}
              data-click-here
              className={[
                "hover-lift group rounded-2xl border p-3 flex flex-col items-center gap-2 text-center transition-all duration-300",
                active ? "bg-surface border-brand/40 shadow-[0_18px_40px_-20px_rgba(0,122,255,0.55)]" : "bg-surface/80 border-hairline opacity-90",
              ].join(" ")}
            >
              <span className={["rounded-full transition-transform duration-300", active ? "scale-110 ring-[3px] ring-brand/30" : "group-hover:scale-105"].join(" ")}>
                <PersonAvatar look={AVATAR_LOOKS[i]} size={48} />
              </span>
              <span className="text-[12.5px] md:text-[13px] font-semibold text-ink leading-[1.2]">{p.name.split(" ")[0]}</span>
              <span className="text-[11px] text-ink-3 leading-none">{p.role}</span>
            </button>
          );
        })}
        {/* Слова підказки — у рядку вище, а палець — просто тут: величезний
            курсор обходить людей, поки жодної з них не відкрили. */}
        <ClickHere host={stripRef} show={selected === null} />
      </div>

      {/* Expanding profile */}
      <div style={{ display: "grid", gridTemplateRows: selected === null ? "0fr" : "1fr", transition: "grid-template-rows 0.5s var(--ease-out-soft)" }}>
        <div style={{ overflow: "hidden" }}>
          {profile && (
            <div key={profile.id} className="mock-on relative rounded-[20px] bg-surface border border-hairline shadow-[0_30px_60px_-30px_rgba(0,50,120,0.35)] p-4 md:p-5 flex flex-col gap-3">
              {/* Header */}
              <div className="mock-pop flex items-center gap-3.5" style={{ animationDelay: "40ms" }}>
                <div className="relative shrink-0">
                  <PersonAvatar look={AVATAR_LOOKS[selected!]} size={64} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#12a150] border-[3px] border-surface flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <span className="text-[16px] md:text-[17px] font-semibold text-ink leading-[1.2] tracking-[-0.3px] truncate">{profile.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none border" style={{ background: "color-mix(in oklab, #12a150 12%, var(--surface))", borderColor: "color-mix(in oklab, #12a150 40%, transparent)", color: "#12a150" }}>{profile.status}</span>
                    <span className="rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none border bg-brand-soft border-brand/40 text-brand">{profile.role}</span>
                  </div>
                </div>
                {/* completeness ring */}
                <div className="relative w-12 h-12 shrink-0" title={`${t.completeness}: ${completeness}%`}>
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="var(--hairline)" strokeWidth="4" />
                    <circle
                      cx="24" cy="24" r="20" fill="none" stroke={completeness >= 100 ? "#12a150" : "var(--brand)"} strokeWidth="4" strokeLinecap="round"
                      transform="rotate(-90 24 24)" strokeDasharray={ringLen} strokeDashoffset={ringLen * (1 - completeness / 100)}
                      style={{ transition: "stroke-dashoffset 0.7s var(--ease-out-soft), stroke 0.3s" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-ink tabular-nums">{completeness}%</span>
                </div>
              </div>

              {/* Meta */}
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {profile.meta.map((m, i) => {
                  const Icon = META_ICONS[i];
                  return (
                    <li key={m} className="mock-row flex items-center gap-2 text-[12.5px] text-ink-2 min-w-0" style={{ animationDelay: `${140 + i * 60}ms` }}>
                      <Icon className="w-[14px] h-[14px] text-ink-3 shrink-0" strokeWidth={2} />
                      <span className="truncate">{m}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Sections */}
              <div className="grid grid-cols-2 gap-2">
                <Section icon={Heart} accent="#f05b8b" title={t.labels.family} delay={380}>
                  {profile.family.length ? (
                    <ul className="flex flex-col gap-1">
                      {profile.family.map((f) => (
                        <li key={f.name} className="flex items-center gap-2 text-[12.5px] text-ink">
                          <FamilyFace name={f.name} profiles={t.profiles} />
                          <span className="font-medium">{f.name}</span>
                          <span className="text-ink-3">· {f.rel}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[12.5px] text-ink-3">{t.empty.family}</span>
                  )}
                </Section>

                <Section icon={UsersRound} accent="#007aff" title={t.labels.group} delay={440}>
                  {profile.group ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12.5px] font-medium text-ink leading-[1.3]">{profile.group.name}</span>
                      <span className="text-[11.5px] text-ink-3 leading-[1.3]">{profile.group.meta}</span>
                    </div>
                  ) : (
                    <span className="text-[12.5px] text-ink-3">{t.empty.group}</span>
                  )}
                </Section>

                <Section icon={HeartHandshake} accent="#8b5bf0" title={t.labels.ministry} delay={500}>
                  {profile.ministry ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12.5px] font-medium text-ink leading-[1.3]">{profile.ministry.name}</span>
                      <span className="text-[11.5px] text-ink-3 leading-[1.3]">{profile.ministry.meta}</span>
                    </div>
                  ) : (
                    <span className="text-[12.5px] text-ink-3">{t.empty.ministry}</span>
                  )}
                </Section>

                <Section icon={GraduationCap} accent="#12a150" title={t.labels.learning} delay={560}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-ink leading-[1.3] truncate">{profile.learning.name}</span>
                      <span className="text-[11px] text-ink-3 tabular-nums shrink-0">{profile.learning.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                      <div className="h-full rounded-full bg-[#12a150] origin-left" style={{ width: `${profile.learning.progress}%`, transform: "scaleX(1)", animation: "barGrowX 0.9s var(--ease-out-soft) 700ms both" }} />
                    </div>
                    <span className="text-[11px] text-ink-3 leading-none">{profile.learning.meta}</span>
                  </div>
                </Section>

                {/* Смужка «відвідуваність за 8 тижнів» прибрана 2026-09-21:
                    у картці людини вона була зайвим рядком, а сама явка
                    живе в групах і в аналітиці. */}

                <Section icon={History} accent="#f59e0b" title={t.labels.history} delay={680}>
                  <ul className="flex flex-col gap-1.5">
                    {profile.history.map((h) => (
                      <li key={h.text} className="flex gap-2 text-[11.5px] leading-[1.3]">
                        <span className="text-ink-3 tabular-nums shrink-0 w-[52px]">{h.date}</span>
                        <span className="text-ink">{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={NotebookPen} accent="#64748b" title={t.labels.notes} delay={740}>
                  <p className="text-[12px] text-ink-2 leading-[1.4]">{profile.note}</p>
                </Section>
              </div>

              {/* Pins — the game */}
              <div className="mock-row rounded-xl border border-dashed border-brand/40 bg-brand-soft/60 p-3 flex flex-col gap-2.5" style={{ animationDelay: "820ms" }}>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.4} /> {t.pinsTitle}
                </span>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {pinned.map((pin) => {
                    const preset = profile.pins.includes(pin);
                    return (
                      <span key={pin} className="pin-in inline-flex items-center gap-1 rounded-full bg-brand text-white px-2.5 py-1.5 text-[12px] font-medium leading-none shadow-[0_6px_14px_-8px_rgba(0,122,255,0.9)]">
                        <Check className="w-3 h-3" strokeWidth={3} />
                        {pin}
                        {!preset && (
                          <button onClick={() => removePin(pin)} aria-label={`− ${pin}`} className="ml-0.5 -mr-1 w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center">
                            <X className="w-2.5 h-2.5" strokeWidth={3} />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
                {bank.length > 0 && (
                  <>
                    <span className="text-[11.5px] text-ink-3 leading-none">
                      {t.pinBankTitle} <span className="text-ink-3/70">· {t.pinBankHint}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bank.map((pin) => (
                        <button
                          key={pin}
                          onClick={() => addPin(pin)}
                          className="inline-flex items-center gap-1 rounded-full bg-surface border border-hairline-strong px-2.5 py-1.5 text-[12px] font-medium text-ink-2 leading-none transition-all duration-200 hover:border-brand hover:text-brand hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Plus className="w-3 h-3" strokeWidth={3} />
                          {pin}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Celebration */}
              {celebrate && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {CONFETTI.concat(CONFETTI).map((c, i) => {
                      const a = (i / 12) * Math.PI * 2;
                      return (
                        <span
                          key={i}
                          className="confetti-dot absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                          style={{ background: c, ["--dx" as string]: `${Math.cos(a) * (70 + (i % 3) * 20)}px`, ["--dy" as string]: `${Math.sin(a) * (70 + (i % 3) * 20)}px`, animationDelay: `${(i % 4) * 40}ms` }}
                        />
                      );
                    })}
                    <div className="pin-in rounded-2xl bg-surface border border-hairline shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] px-5 py-4 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#12a150] flex items-center justify-center"><Check className="w-5 h-5 text-white" strokeWidth={3.5} /></span>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-ink leading-[1.2]">{t.done}</span>
                        <span className="text-[12.5px] text-ink-2 leading-[1.3]">{t.doneText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
