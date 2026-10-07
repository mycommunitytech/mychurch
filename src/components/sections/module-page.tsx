"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, LayoutGrid, MonitorPlay, Zap } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import ModuleMock from "@/components/shared/module-mock";
import ClipPlayer from "@/components/shared/clip-player";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import ServiceNeeds from "@/components/sections/service-needs";
import ServicePlanning from "@/components/sections/service-planning";
import Ministries from "@/components/sections/ministries";
import HomeGroups from "@/components/sections/home-groups";
import { MODULE_ICONS, moduleAccent, AUDIENCE_ROLE_ACCENTS } from "@/components/shared/module-icons";
import { ROLE_LOOKS } from "@/components/shared/role-icons";
import { getModule, hasModulePage } from "@/content/modules";
import { getModuleVideo, getModuleVideoPoster } from "@/content/modules/videos";
import type { ModuleCopy, Tone } from "@/content/modules/types";
import { useDemoModal } from "@/context/demo-modal-context";
import { useWorkspace } from "@/context/workspace-context";
import { useLang, useT } from "@/lib/lang";
import type { Dict } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   One page per module. Copy comes from src/content/modules; group,
   item name and chrome strings come from the dictionary.

   Розкрій (2026-09-30): назва модуля великими літерами, одне речення
   і великий екран у кольоровій сцені — далі блоки без карток і без
   eyebrow над заголовком. Заголовок блоку — одне-три слова (це колишні
   eyebrow зі словника), подробиці — під ним рядками, а не плитками.
   ──────────────────────────────────────────────────────────────── */

function findItem(t: Dict, id: string) {
  for (const group of t.modules.groups) {
    const item = group.items.find((i) => i.id === id);
    if (item) return { group, item };
  }
  return null;
}

interface Ctx {
  id: string;
  name: string;
  accent: string;
  copy: ModuleCopy;
  t: Dict;
}

/* Той самий відтінок, що в картках огляду на головній: сцена з екраном
   модуля читається як продовження тих карток. */
const tint = (accent: string) =>
  `linear-gradient(140deg, color-mix(in oklab, ${accent} 13%, var(--surface)) 0%, color-mix(in oklab, ${accent} 5%, var(--surface)) 55%, var(--surface) 100%)`;

const GRID: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  maskImage: "radial-gradient(ellipse 60% 70% at 50% 45%, black 20%, transparent 80%)",
  WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 45%, black 20%, transparent 80%)",
};

/* Заголовок блоку: коротко й великим кеглем, під ним щонайбільше одне речення.
   `md` — для авторських заголовків-речень (шлях по дошці, «Що реально
   змінюється за тиждень»): довше за 30 знаків вони йдуть меншим кеглем,
   щоб на телефоні не займати три рядки по 36px. */
function BlockTitle({ title, text, size = title.length > 30 ? "md" : "lg" }: { title: string; text?: string; size?: "lg" | "md" }) {
  return (
    <FadeIn className="flex flex-col gap-3 md:gap-4">
      <h2
        className={[
          "font-semibold text-ink text-balance",
          size === "lg"
            ? "text-[36px] sm:text-[48px] md:text-[64px] leading-[1.02] tracking-[-1px] md:tracking-[-2.2px]"
            : "text-[26px] sm:text-[34px] md:text-[44px] leading-[1.12] tracking-[-0.8px] md:tracking-[-1.5px] max-w-[820px]",
        ].join(" ")}
      >
        {title}
      </h2>
      {text && <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5] max-w-[560px]">{text}</p>}
    </FadeIn>
  );
}

const WRAP = "w-full max-w-[1120px] px-5 md:px-8";

/* ── Hero ───────────────────────────────────────────────────────── */
/* `stage` — показати загальний макет модуля. Там, де є власне живе демо,
   сцени немає: демо стає одразу під шапкою, і два екрани про одне
   не стоять підряд. */
function Hero({ ctx, groupId, groupTitle, soon, stage }: { ctx: Ctx; groupId: string; groupTitle: string; soon?: boolean; stage: boolean }) {
  const { open } = useDemoModal();
  const { open: openSpace } = useWorkspace();
  const { id, name, accent, copy, t } = ctx;
  const Icon = MODULE_ICONS[id] ?? LayoutGrid;

  return (
    <section className={["relative w-full overflow-hidden bg-surface flex flex-col items-center pt-8 md:pt-12", stage ? "pb-16 md:pb-24" : "pb-12 md:pb-16"].join(" ")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[360px] left-[10%] w-[1000px] h-[640px] rounded-full opacity-60"
          style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 18%, transparent), transparent 100%)` }}
        />
      </div>

      <div className={`relative z-10 ${WRAP} flex flex-col gap-8 md:gap-12`}>
        <FadeIn>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
            <Link href="/modules" className="hover:text-ink transition-colors">{t.modulePage.breadcrumbModules}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/modules#m-${groupId}`} className="hover:text-ink transition-colors">{groupTitle}</Link>
          </nav>
        </FadeIn>

        {/* Назва модуля і є заголовок: одне-два слова, яким модуль
            називають у самій церкві. Обіцянка — одним реченням під ним. */}
        <FadeIn className="flex flex-col gap-6 md:gap-8">
          <h1 className="font-semibold text-ink text-[48px] sm:text-[72px] md:text-[96px] lg:text-[112px] leading-[0.96] tracking-[-1.6px] sm:tracking-[-2.6px] md:tracking-[-4px] text-balance">
            {name}
            {soon && (
              <span className="ml-3 md:ml-5 inline-block align-middle -translate-y-1 md:-translate-y-3 rounded-full border border-dashed border-hairline-strong px-3 py-1.5 text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">
                {t.modulePage.soon}
              </span>
            )}
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10">
            <p className="text-[19px] md:text-[24px] text-ink-2 leading-[1.4] tracking-[-0.3px] max-w-[640px] text-pretty">{copy.title}</p>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={open}
                className="btn-primary btn-brand btn-sheen group relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.common.bookDemo}</span>
                <ArrowRight className="relative w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => openSpace(id)}
                className="btn-secondary relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden border border-hairline-strong"
              >
                <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                <MonitorPlay className="relative w-4 h-4" style={{ color: accent }} />
                <span className="relative text-ink font-medium text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.workspace.open}</span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Сцена: екран модуля на всю ширину сторінки, а не картинка збоку
            від абзацу. Макет той самий, що в каталозі, — лише більший. */}
        {stage && (
          <FadeIn delay={2} variant="scale">
            <div
              className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline flex items-center justify-center px-3 py-10 sm:px-8 md:px-12 md:py-16 min-h-[340px] md:min-h-[540px]"
              style={{ background: tint(accent) }}
            >
              <div aria-hidden className="absolute inset-0 pointer-events-none" style={GRID} />
              <div className="relative w-full [&>div]:max-w-[540px] md:[zoom:1.1] lg:[zoom:1.18]">
                <ModuleMock spec={copy.mock} accent={accent} Icon={Icon} />
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ── Video ──────────────────────────────────────────────────────── */
/* `tight` — запис стоїть одразу під сценою шапки на тому самому тлі. */
function Video({ ctx, videoId, tight }: { ctx: Ctx; videoId: string; tight: boolean }) {
  const { id, name, accent, t } = ctx;
  const title = t.modulePage.videoTitle.replace("{name}", name);
  return (
    <section id="video" className={["w-full flex flex-col items-center pb-16 md:pb-28 bg-surface", tight ? "pt-4" : "pt-16 md:pt-28"].join(" ")}>
      <div className={`${WRAP} flex flex-col gap-8 md:gap-12`}>
        <BlockTitle title={title} text={t.modulePage.videoText} />
        <FadeIn variant="scale" className="w-full">
          <ClipPlayer
            videoId={videoId}
            poster={getModuleVideoPoster(id)}
            title={title}
            accent={accent}
            className="w-full rounded-[24px] md:rounded-[32px] border border-hairline shadow-[0_30px_60px_-40px_rgba(0,50,120,0.35)]"
          />
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────── */
/* Не плитки, а перелік: номер, назва великим кеглем і одне речення поруч.
   Порожніх карток і рядів однакових іконок тут більше немає. */
function Features({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  return (
    <section id="inside" className="w-full flex flex-col items-center py-16 md:py-28">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-14`}>
        <BlockTitle title={t.modulePage.insideEyebrow} />
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {copy.features.map((f, i) => (
            <li key={f.title} className="border-t border-hairline">
              <FadeIn delay={i % 2} className="grid grid-cols-[36px_minmax(0,1fr)] md:grid-cols-[48px_minmax(0,1fr)] gap-x-3 gap-y-2 pt-6 pb-8 md:pt-7 md:pb-10">
                <span className="text-[14px] md:text-[15px] font-semibold tabular-nums leading-[1.9] md:leading-[2.1]" style={{ color: accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.5px] md:tracking-[-0.7px]">{f.title}</h3>
                <p className="col-start-2 text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.55] max-w-[440px]">{f.text}</p>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────── */
/* Кроки — одна лінія зліва направо: велика цифра, крапка на лінії,
   назва й речення. На телефоні лінія йде згори вниз. */
function Steps({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  const cols = copy.steps.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <section id="how" className="w-full flex flex-col items-center py-16 md:py-28 bg-surface border-y border-hairline">
      <div className={`${WRAP} flex flex-col gap-10 md:gap-16`}>
        <BlockTitle title={t.modulePage.howEyebrow} />
        <ol className={`grid grid-cols-1 ${cols} gap-10 md:gap-8`}>
          {copy.steps.map((step, i) => (
            <li key={step.title}>
              <FadeIn delay={i} className="flex flex-col gap-4 md:gap-5">
                <span
                  className="font-semibold leading-[0.9] tracking-[-3px] tabular-nums text-[72px] md:text-[104px]"
                  style={{ color: accent }}
                >
                  {i + 1}
                </span>
                <span aria-hidden className="relative h-px w-full bg-hairline-strong">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                </span>
                <div className="flex flex-col gap-2 md:pr-4">
                  <h3 className="font-semibold text-ink text-[20px] md:text-[22px] leading-[1.25] tracking-[-0.4px]">{step.title}</h3>
                  <p className="text-[15.5px] text-ink-2 leading-[1.55]">{step.text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Audience ────────────────────────────────────────────────── */
/* Обличчя замість іконок у квадратиках — як на плашках ролей на головній. */
function Audience({ ctx }: { ctx: Ctx }) {
  const { copy, t } = ctx;
  const cols = copy.audience.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : copy.audience.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <section id="who" className="w-full flex flex-col items-center py-16 md:py-28">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-14`}>
        <BlockTitle title={t.modulePage.audienceEyebrow} />
        <ul className={`grid grid-cols-1 ${cols} gap-x-8 border-t border-hairline`}>
          {copy.audience.map((a, i) => {
            const role = t.audience.roles.find((r) => r.id === a.role);
            const c = AUDIENCE_ROLE_ACCENTS[a.role];
            return (
              <li key={a.role} className="border-b border-hairline md:border-b-0">
                <FadeIn delay={i}>
                  {/* Ведемо на сторінку ролі: там уся роль, а не один модуль. */}
                  <Link href={`/for-whom/${a.role}`} className="group flex md:flex-col gap-4 md:gap-5 py-6 md:pt-8 md:pb-2">
                    <PersonAvatar look={AVATAR_LOOKS[ROLE_LOOKS[a.role] ?? 0]} size={56} className="md:w-16 md:h-16" />
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h3 className="flex items-center gap-1.5 font-semibold text-ink text-[19px] md:text-[22px] leading-[1.25] tracking-[-0.4px]">
                        <span className="border-b-2 border-transparent transition-colors duration-200 group-hover:border-current">
                          {role?.name ?? a.role}
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: c }} />
                      </h3>
                      <p className="text-[15px] md:text-[15.5px] text-ink-2 leading-[1.5]">{a.text}</p>
                    </div>
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────── */
function QaRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="w-full text-left py-5 md:py-6 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-medium text-ink text-[17px] md:text-[19px] leading-[1.35] tracking-[-0.25px]">{q}</span>
        <span
          className="shrink-0 w-7 h-7 rounded-full bg-surface-3 border border-hairline flex items-center justify-center text-ink-2 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <div style={{ overflow: "hidden" }}>
          <p className="pt-3 pr-11 text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.6]">{a}</p>
        </div>
      </div>
    </button>
  );
}

function Faq({ ctx }: { ctx: Ctx }) {
  const { copy, t } = ctx;
  return (
    <section id="faq" className="w-full flex flex-col items-center py-16 md:py-28 bg-surface border-y border-hairline">
      <div className={`${WRAP} grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 lg:gap-16`}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <BlockTitle title={t.modulePage.faqEyebrow} />
        </div>
        <FadeIn className="border-t border-hairline divide-y divide-hairline border-b">
          {copy.faq.map((item) => (
            <QaRow key={item.q} q={item.q} a={item.a} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Related ─────────────────────────────────────────────────── */
/* Сусідні модулі — великими назвами в рядок, а не дрібними плитками. */
function Related({ ctx, related }: { ctx: Ctx; related: string[] }) {
  const { t } = ctx;
  const cards = related
    .map((rid) => {
      const found = findItem(t, rid);
      return found ? { rid, ...found } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (cards.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-center pt-16 pb-4 md:pt-28 md:pb-8">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-14`}>
        <BlockTitle title={t.modulePage.relatedEyebrow} text={t.modulePage.relatedText} />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-hairline">
          {cards.map(({ rid, group, item }, i) => {
            const Icon = MODULE_ICONS[rid] ?? LayoutGrid;
            const c = moduleAccent(rid, group.id);
            const href = hasModulePage(rid) ? `/modules/${rid}` : `/modules#m-${group.id}`;
            return (
              <li key={rid} className="border-b border-hairline">
                <FadeIn delay={i}>
                  <Link href={href} className="group flex items-center gap-4 md:gap-5 py-5 md:py-7">
                    <span className="w-11 h-11 md:w-12 md:h-12 rounded-[14px] flex items-center justify-center shrink-0 text-white" style={{ background: c }}>
                      <Icon className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2} />
                    </span>
                    <span className="flex flex-col gap-1 min-w-0">
                      <span className="font-semibold text-ink text-[21px] md:text-[28px] leading-[1.1] tracking-[-0.5px] md:tracking-[-0.9px] truncate">{item.name}</span>
                      <span className="text-[13px] md:text-[13.5px] text-ink-3 leading-none">{group.title}</span>
                    </span>
                    <ArrowUpRight className="ml-auto w-5 h-5 md:w-6 md:h-6 text-ink-3 shrink-0 transition-all duration-200 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
        <FadeIn>
          <Link href="/modules" className="btn-secondary relative inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full overflow-hidden border border-hairline-strong">
            <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
            <LayoutGrid className="relative w-4 h-4 text-ink-2" />
            <span className="relative text-ink-2 font-medium text-[15px] tracking-[-0.3px]">{t.modulePage.allModules}</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Benefits (optional) ─────────────────────────────────────── */
/* Великі цифри в один ряд — без рамки навколо. */
function Benefits({ ctx }: { ctx: Ctx }) {
  const { accent, copy } = ctx;
  const b = copy.benefits;
  if (!b) return null;
  const cols = b.items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  /* Один кегль на весь ряд: «0» і «1 екран» стоять поруч і не мають
     розламуватись на два рядки. */
  const longest = Math.max(...b.items.map((item) => item.value.length));
  const valueSize =
    longest <= 3
      ? "text-[56px] md:text-[80px] tracking-[-2px] md:tracking-[-3px]"
      : longest <= 5
        ? "text-[52px] md:text-[64px] tracking-[-2px] md:tracking-[-2.4px]"
        : "text-[40px] md:text-[48px] tracking-[-1.2px] md:tracking-[-1.6px]";
  return (
    <section id="benefits" className="w-full flex flex-col items-center py-16 md:py-28">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-14`}>
        <BlockTitle title={b.title} text={b.text} />
        <div className={`grid grid-cols-1 ${cols} gap-x-8 border-t border-hairline`}>
          {b.items.map((item, i) => (
            <FadeIn key={item.label} delay={i} className="flex flex-col gap-3 py-7 md:py-9 border-b border-hairline sm:border-b-0">
              <span className={`font-semibold leading-[0.95] tabular-nums whitespace-nowrap ${valueSize}`} style={{ color: accent }}>
                {item.value}
              </span>
              <h3 className="font-semibold text-ink text-[17px] md:text-[19px] leading-[1.3] tracking-[-0.3px]">{item.label}</h3>
              <p className="text-[14.5px] md:text-[15px] text-ink-2 leading-[1.5]">{item.text}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Kanban path (optional) ─────────────────────────────────────── */
const STAGE_TONE: Record<Tone, string> = {
  brand: "var(--brand)",
  green: "#12a150",
  amber: "#f59e0b",
  red: "#f43f5e",
  violet: "#8b5bf0",
  neutral: "#94a3b8",
};

const STAGE_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/* Шлях запису — дошка в тій самій кольоровій сцені, що й екран угорі:
   колонки-етапи, у кожній картка і те, що система робить сама. */
function Pipeline({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  const p = copy.pipeline;
  if (!p) return null;
  const cols = STAGE_COLS[p.stages.length] ?? "lg:grid-cols-4";
  return (
    <section id="flow" className="w-full flex flex-col items-center py-16 md:py-28">
      <div className={`${WRAP} flex flex-col gap-8 md:gap-14`}>
        <BlockTitle title={p.title} text={p.text} />
        <FadeIn variant="scale">
          <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline p-3 md:p-6" style={{ background: tint(accent) }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={GRID} />
            <div className={["relative grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4", cols].join(" ")}>
              {p.stages.map((stage, i) => {
                const c = STAGE_TONE[stage.tone ?? "brand"];
                return (
                  <article key={stage.title} className="rounded-[18px] bg-surface/70 backdrop-blur-sm border border-hairline p-2.5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2 px-1.5 pt-1">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }} />
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2 truncate">{stage.title}</span>
                      </span>
                      <span className="text-[12px] text-ink-3 tabular-nums shrink-0">{i + 1}/{p.stages.length}</span>
                    </div>
                    <div className="rounded-[12px] bg-surface border border-hairline p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ boxShadow: `inset 3px 0 0 ${c}` }}>
                      <p className="text-[14px] text-ink leading-[1.5]">{stage.text}</p>
                    </div>
                    {stage.auto && (
                      <div className="flex items-start gap-2 px-1.5 pb-1 mt-auto">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-[1px] text-white" style={{ background: accent }}>
                          <Zap className="w-3 h-3" strokeWidth={2.6} />
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[12px] font-semibold leading-[1.4]" style={{ color: accent }}>{t.modulePage.pipelineAuto}</span>
                          <p className="text-[13px] text-ink-2 leading-[1.45]">{stage.auto}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ModulePage({ id }: { id: string }) {
  const { lang } = useLang();
  const t = useT();
  const detail = getModule(id);
  if (!detail) return null;

  const found = findItem(t, id);
  const groupId = found?.group.id ?? detail.group;
  const groupTitle = found?.group.title ?? "";
  const name = found?.item.name ?? id;
  const accent = moduleAccent(id, groupId);
  const copy = detail.copy[lang];
  const ctx: Ctx = { id, name, accent, copy, t };
  const video = getModuleVideo(id);
  /* Набір команди на подію показуємо там, де про нього й питають — у плануванні служіння. */
  const needs = id === "service-planning";
  /* Демо, які раніше стояли на головній: там вони ставали черговим макетом
     поспіль, а тут — на своєму місці. */
  const ministriesDemo = id === "ministries";
  const groupsDemo = id === "groups";

  const liveDemo = needs || ministriesDemo || groupsDemo;

  /* Спершу продукт: екран (або живе демо), запис із церкви; далі — що
     всередині, як почати і для кого. Рейку-зміст над сторінкою прибрано:
     сторінка стала коротшою, і ряд чипів лише дублював заголовки. */
  return (
    <>
      <Hero ctx={ctx} groupId={groupId} groupTitle={groupTitle} soon={found?.item.soon} stage={!liveDemo} />
      {needs && <ServicePlanning onModulePage />}
      {ministriesDemo && <Ministries onModulePage />}
      {groupsDemo && <HomeGroups onModulePage />}
      {video && <Video ctx={ctx} videoId={video} tight={!liveDemo} />}
      <Features ctx={ctx} />
      <Steps ctx={ctx} />
      <Pipeline ctx={ctx} />
      {needs && <ServiceNeeds accent={accent} />}
      <Benefits ctx={ctx} />
      <Audience ctx={ctx} />
      <Faq ctx={ctx} />
      <Related ctx={ctx} related={detail.related} />
    </>
  );
}
