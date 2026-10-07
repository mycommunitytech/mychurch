"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage, inCatalog } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Увесь каталог одним полотном, як у ClickUp: тонка сітка клітинок
   «іконка + назва», що згасає до країв, а в центрі чотири ключові
   модулі великими клітинками з мальованим шматочком екрана. Широту
   показує сітка, головне — кольорові плитки посередині; сірі іконки
   фарбуються в колір модуля лише під мишею.

   На широкому екрані сітка 10 × 6: верхній ряд порожній (з нього
   починається згасання), ключові модулі стоять у колонках 4–7, решта
   розкладається автоматично довкола. Вужче — чотири колонки, ключові
   йдуть першими, а хвіст дрібних клітинок ховається під згасанням.
   ──────────────────────────────────────────────────────────────── */

const KEY = ["people", "ministries", "groups", "service-planning"] as const;
type KeyId = (typeof KEY)[number];

/* Місце великої плитки на сітці 10 × 6 (1-based, кожна займає 2 × 2). */
const KEY_PLACE: Record<KeyId, string> = {
  people: "lg:col-start-4 lg:row-start-2",
  ministries: "lg:col-start-6 lg:row-start-2",
  groups: "lg:col-start-4 lg:row-start-4",
  "service-planning": "lg:col-start-6 lg:row-start-4",
};

const COLS = 10;
const ROWS = 6;
const SLOTS = COLS * ROWS - KEY.length * 4;
/* Скільки дрібних клітинок видно на телефоні до згасання. */
const MOBILE_SMALL = 12;

interface Cell {
  id: string;
  name: string;
  group: string;
}

/* ── Шматочки екранів для ключових плиток: малюнок, не список ── */

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn("block h-[6px] rounded-full bg-ink/10", className)} style={{ width: w }} />;
}

function PeopleSnippet({ accent }: { accent: string }) {
  const faces = [0, 1, 2, 4, 5];
  return (
    <div className="relative w-[190px] rounded-xl bg-surface border border-hairline shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)] p-3">
      <div className="flex -space-x-2">
        {faces.map((f) => (
          <PersonAvatar key={f} look={AVATAR_LOOKS[f]} size={30} className="ring-2 ring-surface" />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Bar w="46%" />
        <span
          className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5"
          style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
        >
          +3
        </span>
      </div>
      <Bar w="70%" className="mt-2 bg-ink/[0.06]" />
    </div>
  );
}

function MinistriesSnippet({ accent }: { accent: string }) {
  const slots = [
    { look: 3, ok: true },
    { look: 1, ok: true },
    { look: 2, ok: false },
  ];
  return (
    <div className="w-[190px] rounded-xl bg-surface border border-hairline shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)] p-3">
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        <Bar w="40%" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {slots.map((s, i) => (
          <div key={i} className="relative flex flex-col items-center gap-1.5 rounded-lg bg-surface-3 py-2">
            <PersonAvatar look={AVATAR_LOOKS[s.look]} size={26} />
            <Bar w="60%" className="h-[4px]" />
            <span
              className={cn(
                "absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center",
                s.ok ? "text-white" : "border border-dashed border-ink/25"
              )}
              style={s.ok ? { background: accent } : undefined}
            >
              {s.ok && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupsSnippet({ accent }: { accent: string }) {
  /* Три групи — три кола людей різного розміру. */
  const groups = [
    { x: 8, y: 6, faces: [0, 4, 5] },
    { x: 104, y: 0, faces: [1, 2] },
    { x: 60, y: 58, faces: [3, 0, 1, 2] },
  ];
  return (
    <div className="relative w-[196px] h-[108px]">
      {groups.map((g, gi) => (
        <div
          key={gi}
          className="absolute flex -space-x-2 rounded-full bg-surface border border-hairline shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)] p-1.5 pr-2.5 items-center"
          style={{ left: g.x, top: g.y }}
        >
          {g.faces.map((f, i) => (
            <PersonAvatar key={i} look={AVATAR_LOOKS[f]} size={24} className="ring-2 ring-surface" />
          ))}
          <span className="!ml-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        </div>
      ))}
    </div>
  );
}

function PlanningSnippet({ accent }: { accent: string }) {
  const items = [
    { t: "10:00", w: "62%", done: true },
    { t: "10:25", w: "44%", done: true },
    { t: "10:40", w: "74%", done: false },
    { t: "11:30", w: "38%", done: false },
  ];
  return (
    <div className="w-[190px] rounded-xl bg-surface border border-hairline shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)] p-3 flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] font-medium tabular-nums text-ink-3 w-8">{it.t}</span>
          <span
            className="h-[14px] rounded-[4px]"
            style={{
              width: it.w,
              background: it.done ? `color-mix(in oklab, ${accent} 70%, var(--surface))` : `color-mix(in oklab, ${accent} 18%, var(--surface))`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

const SNIPPETS: Record<KeyId, (p: { accent: string }) => React.ReactNode> = {
  people: PeopleSnippet,
  ministries: MinistriesSnippet,
  groups: GroupsSnippet,
  "service-planning": PlanningSnippet,
};

/* Посилання, якщо в модуля є своя сторінка, інакше просто блок. */
function Tile({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return hasModulePage(id) ? (
    <Link href={`/modules/${id}`} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export default function Capabilities() {
  const t = useT();
  const all: Cell[] = t.modules.groups.flatMap((g) =>
    g.items
      .filter((m) => !("soon" in m && m.soon) && inCatalog(m.id))
      .map((m) => ({ id: m.id, name: m.name, group: g.id }))
  );
  const keys = KEY.map((id) => all.find((c) => c.id === id)).filter((c): c is Cell => !!c);
  const small = all.filter((c) => !(KEY as readonly string[]).includes(c.id)).slice(0, SLOTS - COLS);
  /* Порожні клітинки: верхній ряд, з якого починається згасання, і
     добивка до повної сітки, щоб лінії не обривались посеред ряду. */
  const tail = Math.max(0, SLOTS - COLS - small.length);

  return (
    <section className="w-full flex flex-col items-center pt-16 md:pt-24 pb-12 md:pb-16 bg-page overflow-hidden">
      <FadeIn className="text-center mb-8 md:mb-10 px-5">
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-3">{t.capabilities.caption}</p>
      </FadeIn>

      <FadeIn delay={1} className="w-full flex justify-center">
        {/* Дві маски вкладені, бо згасання по горизонталі й по вертикалі
            мають перетинатися, а mask-composite у Safari ненадійний. */}
        <div className="caps-fade-x w-full flex justify-center px-4 lg:px-0">
          <div className="caps-fade-y w-full lg:w-auto max-w-[560px] lg:max-w-none">
            <div
              className="grid grid-cols-4 lg:grid-cols-[repeat(10,136px)] auto-rows-[104px] lg:auto-rows-[124px] grid-flow-dense gap-px bg-hairline border-y border-hairline lg:border-y-0"
            >
              {Array.from({ length: COLS }, (_, i) => (
                <span key={`top-${i}`} aria-hidden className="hidden lg:block bg-page" />
              ))}

              {keys.map((c) => {
                const Icon = MODULE_ICONS[c.id];
                const accent = moduleAccent(c.id, c.group);
                const Snippet = SNIPPETS[c.id as KeyId];
                return (
                  <Tile
                    key={c.id}
                    id={c.id}
                    className={cn(
                      "group relative bg-page col-span-2 row-span-2 flex flex-col items-center justify-between overflow-hidden pt-6 pb-5 px-3",
                      KEY_PLACE[c.id as KeyId]
                    )}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 transition-opacity"
                      style={{
                        background: `radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, ${accent} 14%, var(--page)) 0%, var(--page) 70%)`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="relative scale-[0.82] sm:scale-100 origin-top transition-transform duration-500 group-hover:-translate-y-1"
                    >
                      <Snippet accent={accent} />
                    </span>
                    <span className="relative flex items-center gap-2">
                      <span
                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ background: accent }}
                      >
                        {Icon && <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2.2} />}
                      </span>
                      <span className="text-[17px] md:text-[21px] font-bold tracking-[-0.4px] text-ink leading-[1.05] text-balance">
                        {c.name}
                      </span>
                    </span>
                  </Tile>
                );
              })}

              {small.map((c, i) => {
                const Icon = MODULE_ICONS[c.id];
                const accent = moduleAccent(c.id, c.group);
                return (
                  <Tile
                    key={c.id}
                    id={c.id}
                    className={cn(
                      "group bg-page flex flex-col items-center justify-center gap-2.5 px-2 text-center transition-colors hover:bg-surface",
                      i >= MOBILE_SMALL && "hidden lg:flex"
                    )}
                  >
                    <span
                      className="caps-icon text-ink-3 transition-colors"
                      style={{ "--accent": accent } as React.CSSProperties}
                    >
                      {Icon && <Icon className="w-[22px] h-[22px]" strokeWidth={1.6} />}
                    </span>
                    <span className="text-[13px] lg:text-[14px] leading-[1.25] text-ink-2 group-hover:text-ink transition-colors line-clamp-2">
                      {c.name}
                    </span>
                  </Tile>
                );
              })}

              {Array.from({ length: tail }, (_, i) => (
                <span key={`tail-${i}`} aria-hidden className="hidden lg:block bg-page" />
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={2} className="mt-6 md:mt-8 px-5">
        <Link
          href="/modules"
          className="group inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] font-medium text-ink-2 hover:text-ink transition-colors"
        >
          <span className="font-semibold text-ink">{t.capabilities.count}</span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-ink-3" />
          <span>{t.capabilities.all}</span>
          <ArrowRight className="w-4 h-4 text-brand transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </FadeIn>
    </section>
  );
}
