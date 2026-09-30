"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, BookOpen, Blocks, Camera, Check, Clock, Handshake, Monitor, Music4, Radio,
} from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Кожне служіння — своє».

   Перша версія ховала служіння за перемикачем: на екрані був один
   маленький список у рамці, і блок про різноманіття виглядав як
   один і той самий рядок. Тепер усі п'ять видно одразу, і кожне
   має власну геометрію — кадр трансляції, сет із тональностями,
   план залу згори, кімнати дитячого, стрічка неділь. Нічого
   перемикати не треба: різниця між служіннями і є картинкою.
   ──────────────────────────────────────────────────────────────── */

const ACCENT: Record<string, string> = {
  media: "#6366f1",
  worship: "#f05b8b",
  order: "#0ea5e9",
  kids: "#e11d48",
  sermons: "#b45309",
};

const TILE_ICON: Record<string, LucideIcon> = {
  media: Camera,
  worship: Music4,
  order: Handshake,
  kids: Blocks,
  sermons: BookOpen,
};

/* Камера, слайди, трансляція — по іконці на кожного, хто веде ефір. */
const MEDIA_ICONS: LucideIcon[] = [Camera, Monitor, Radio];

function tint(accent: string, pct = 14) {
  return `color-mix(in oklab, ${accent} ${pct}%, var(--surface))`;
}

/* ── Плитка: шапка зі своїм кольором і картинка під нею ────────── */
function Tile({
  id,
  name,
  caption,
  className,
  children,
  delay,
}: {
  id: string;
  name: string;
  caption: string;
  className?: string;
  children: ReactNode;
  delay: number;
}) {
  const accent = ACCENT[id] ?? "var(--brand)";
  const Icon = TILE_ICON[id] ?? Camera;
  return (
    <FadeIn variant="scale" delay={delay} className={className}>
      <article className="h-full flex flex-col rounded-[20px] border border-hairline bg-surface overflow-hidden shadow-[0_18px_40px_-36px_rgba(0,50,120,0.45)]">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-hairline bg-surface-2 shrink-0">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
            style={{ background: accent }}
          >
            <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
          </span>
          <h3 className="text-[14.5px] font-semibold text-ink leading-none truncate">{name}</h3>
          <span className="ml-auto text-[11.5px] text-ink-3 leading-none truncate shrink-0">{caption}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center p-3.5 md:p-4">{children}</div>
      </article>
    </FadeIn>
  );
}

/* ── Медіа: кадр трансляції і троє, хто її веде ────────────────── */
function MediaBody({ accent }: { accent: string }) {
  const m = useT().ministries.media;
  return (
    <div className="flex flex-col gap-3">
      {/* Вікно ефіру темне в обох темах — як справжній кадр. */}
      <div className="relative w-full h-[132px] md:h-[150px] rounded-xl overflow-hidden bg-[#0f1115]">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: `radial-gradient(120% 95% at 50% 4%, color-mix(in oklab, ${accent} 46%, transparent), transparent 68%)` }}
        />
        {/* Силует сцени: поміст і троє на ньому. */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-3">
          <span className="flex items-end gap-5">
            <span className="w-3.5 h-3.5 rounded-full bg-white/25" />
            <span className="w-4 h-4 rounded-full bg-white/35" />
            <span className="w-3.5 h-3.5 rounded-full bg-white/25" />
          </span>
          <span className="w-[62%] h-2.5 rounded-full bg-white/14" />
        </span>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-medium text-white leading-none backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
          {m.liveLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-medium text-white leading-none tabular-nums backdrop-blur">
          {m.timer}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {m.rows.map((r, i) => {
          const Icon = MEDIA_ICONS[i] ?? Camera;
          return (
            <div
              key={r.role}
              className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-2.5 py-2 min-w-0"
              aria-label={`${r.role}: ${r.who}, ${r.ok ? m.okLabel : m.waitLabel}`}
            >
              <span className="relative shrink-0">
                <PersonAvatar look={lookFor(r.who)} size={30} className="w-[30px] h-[30px]" />
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-[15px] h-[15px] rounded-full flex items-center justify-center border-2 border-surface-2 text-white",
                    r.ok ? "bg-[#12a150]" : "bg-[#f59e0b]"
                  )}
                >
                  {r.ok ? <Check className="w-2 h-2" strokeWidth={4} /> : <Clock className="w-2 h-2" strokeWidth={3.2} />}
                </span>
              </span>
              <span className="flex flex-col min-w-0">
                <span className="flex items-center gap-1 text-[12.5px] font-medium text-ink leading-tight min-w-0">
                  <Icon className="w-3 h-3 shrink-0" strokeWidth={2.2} style={{ color: accent }} />
                  <span className="truncate">{r.role}</span>
                </span>
                <span className="text-[11.5px] text-ink-3 leading-tight truncate">{r.who}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Прославлення: сет із тональностями і хто грає ─────────────── */
function WorshipBody({ accent }: { accent: string }) {
  const w = useT().ministries.worship;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5">
        {w.songs.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold shrink-0"
              style={{ background: tint(accent, 16), color: accent }}
            >
              {s.tone}
            </span>
            <span className="text-[15px] font-medium text-ink leading-tight truncate">{s.name}</span>
            {/* Смужки — щоб сет читався як сет, а не як список. */}
            <span aria-hidden className="ml-auto flex items-end gap-[3px] h-4 shrink-0">
              {[9, 14, 7, 16, 11, 6].map((h, j) => (
                <span
                  key={j}
                  className="w-[3px] rounded-full"
                  style={{ height: h, background: `color-mix(in oklab, ${accent} ${28 + ((i + j) % 3) * 16}%, transparent)` }}
                />
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-hairline pt-3">
        {w.band.map((b) => (
          <span key={b.role} className="flex items-center gap-2 min-w-0">
            <PersonAvatar look={lookFor(b.who)} size={28} className="w-7 h-7" />
            <span className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-medium text-ink leading-tight truncate">{b.who}</span>
              <span className="text-[11px] text-ink-3 leading-tight truncate">{b.role}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Порядок: план залу згори, люди на своїх місцях ────────────── */
function OrderBody({ accent }: { accent: string }) {
  const o = useT().ministries.order;
  return (
    <div className="relative h-[196px] md:h-[212px] rounded-xl border border-dashed border-hairline-strong bg-surface-2 px-3 pt-3">
      <span
        className="mx-auto w-[46%] h-[26px] rounded-md flex items-center justify-center text-[10.5px] font-semibold uppercase tracking-[0.12em]"
        style={{ background: tint(accent, 18), color: accent }}
      >
        {o.stage}
      </span>

      {/* Ряди крісел — тільки щоб прочитався зал. */}
      <span aria-hidden className="mt-3.5 flex justify-center gap-8">
        {[0, 1].map((block) => (
          <span key={block} className="grid grid-cols-6 gap-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-3 h-[7px] rounded-[2px]" style={{ background: "var(--hairline-strong)" }} />
            ))}
          </span>
        ))}
      </span>

      {/* Скільки людей стоїть на вході, в залі та на паркуванні. */}
      <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        {o.spots.map((s) => (
          <span key={s.place} className="flex flex-col items-center gap-1.5 min-w-0">
            <span className="flex items-center gap-1">
              {Array.from({ length: s.need }).map((_, i) =>
                i < s.filled ? (
                  <span key={i} className="w-[15px] h-[15px] rounded-full" style={{ background: accent }} />
                ) : (
                  <span
                    key={i}
                    className="w-[15px] h-[15px] rounded-full border-[1.5px] border-dashed"
                    style={{ borderColor: "#f59e0b" }}
                  />
                )
              )}
            </span>
            <span className="text-[11.5px] text-ink-2 leading-none truncate">{s.place}</span>
            {s.filled < s.need && (
              <span className="text-[10.5px] font-medium leading-none text-[#c46a00] dark:text-[#ffb454]">
                {o.openLabel}
              </span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}

/* ── Дитяче: три кімнати з великими числами ────────────────────── */
function KidsBody({ accent }: { accent: string }) {
  const k = useT().ministries.kids;
  return (
    <div className="grid grid-cols-3 gap-2.5 flex-1">
      {k.classes.map((c) => (
        <div
          key={c.age}
          className="rounded-2xl border border-hairline bg-surface-2 px-2 py-3.5 flex flex-col items-center justify-center gap-2 min-w-0"
        >
          <span className="text-[11.5px] font-semibold text-ink-2 leading-none tabular-nums">{c.age}</span>
          <span className="text-[34px] font-semibold leading-none tabular-nums" style={{ color: accent }}>
            {c.kids}
          </span>
          <span className="text-[10.5px] uppercase tracking-[0.1em] text-ink-3 leading-none">{k.kidsLabel}</span>
          <span className="flex items-center gap-1.5 mt-1 min-w-0">
            <PersonAvatar look={lookFor(c.teacher)} size={22} className="w-[22px] h-[22px]" />
            <span className="text-[11.5px] text-ink-2 leading-none truncate">{c.teacher}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Проповіді: неділі місяця однією стрічкою ──────────────────── */
function SermonsBody({ accent }: { accent: string }) {
  const s = useT().ministries.sermons;
  return (
    <div className="relative grid grid-cols-4 gap-2 pt-1">
      <span
        aria-hidden
        className="absolute left-[12.5%] right-[12.5%] top-[15px] h-[1.5px]"
        style={{ background: `color-mix(in oklab, ${accent} 26%, transparent)` }}
      />
      {s.weeks.map((w) => {
        const planned = Boolean(w.theme);
        return (
          <div key={w.date} className="relative flex flex-col items-center text-center gap-2 min-w-0">
            <span
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-semibold tabular-nums"
              style={
                planned
                  ? { background: accent, color: "#fff" }
                  : {
                      background: "var(--surface)",
                      color: "var(--ink-3)",
                      boxShadow: `inset 0 0 0 1.5px color-mix(in oklab, ${accent} 40%, transparent)`,
                    }
              }
            >
              {w.date}
            </span>
            <span
              className={cn(
                "text-[11.5px] sm:text-[13px] leading-[1.25]",
                planned ? "font-medium text-ink" : "text-ink-3"
              )}
            >
              {planned ? w.theme : s.free}
            </span>
            {planned && (
              <span className="text-[10.5px] sm:text-[11.5px] text-ink-3 leading-tight truncate w-full">{w.who}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* `onModulePage` — блок стоїть на власній сторінці модуля «Служіння»:
   посилання «Модуль «Служіння»» там вело б саме на себе, тож зникає. */
export default function Ministries({ onModulePage = false }: { onModulePage?: boolean }) {
  const t = useT().ministries;
  const link = hasModulePage("ministries") ? "/modules/ministries" : "/modules";
  const name = (id: string) => t.tabs.find((tab) => tab.id === id)?.name ?? "";

  return (
    <section id="ministries" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <FadeIn className="flex flex-col items-center text-center gap-4">
          {/* На сторінці модуля «Служіння» ця назва вже стоїть заголовком згори. */}
          {!onModulePage && <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>}
          <h2 className="text-balance font-semibold text-ink text-[32px] sm:text-[44px] md:text-[56px] leading-[1.05] tracking-[-1.2px] md:tracking-[-2px] max-w-[820px]">
            {t.title}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5] max-w-[560px]">{t.text}</p>
        </FadeIn>

        {/* П'ять служінь одночасно: плитки різного розміру, бо й самі
            служіння різні. Нічого не перемикається — усе на екрані. */}
        <div className="grid gap-3 md:gap-4 md:grid-cols-12">
          <Tile id="media" name={name("media")} caption={t.media.caption} delay={0} className="md:col-span-7">
            <MediaBody accent={ACCENT.media} />
          </Tile>

          <Tile id="worship" name={name("worship")} caption={t.worship.caption} delay={1} className="md:col-span-5">
            <WorshipBody accent={ACCENT.worship} />
          </Tile>

          <Tile id="order" name={name("order")} caption={t.order.caption} delay={1} className="md:col-span-7">
            <OrderBody accent={ACCENT.order} />
          </Tile>

          <Tile id="kids" name={name("kids")} caption={t.kids.caption} delay={2} className="md:col-span-5">
            <KidsBody accent={ACCENT.kids} />
          </Tile>

          <Tile id="sermons" name={name("sermons")} caption={t.sermons.caption} delay={2} className="md:col-span-12">
            <SermonsBody accent={ACCENT.sermons} />
          </Tile>
        </div>

        {!onModulePage && (
          <FadeIn className="flex justify-center">
            <Link href={link} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand">
              {t.link}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
