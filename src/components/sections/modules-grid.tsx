"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, LayoutGrid, Search, X } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import ModuleMock from "@/components/shared/module-mock";
import { MODULE_ICONS, GROUP_ICONS, GROUP_ACCENTS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage, inCatalog } from "@/content/modules/ids";
import { getModuleClipPreview } from "@/content/modules/videos";
import type { MockSpec } from "@/content/modules/types";
import type { Lang } from "@/lib/i18n";
import { useLang, useT } from "@/lib/lang";
import { centerInRail } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Каталог можливостей — перероблено 2026-09-30.

   Було: десять розділів, у кожному — картки «іконка + речення + назва»
   у дві колонки. 39 речень підряд читались як склад, і жодного екрана.

   Стало: ліворуч — покажчик. Самі назви великим кеглем, по групах, без
   пояснень під кожною. Праворуч — живий екран модуля, що стоїть на місці,
   поки гортаєш покажчик: наведи на назву — і екран, і одне речення про
   неї міняються. Речення одне на весь каталог, а не тридцять дев'ять.
   Екрани — ті самі макети, що в шапці сторінки кожного модуля
   (`copy.mock`), їх передає серверна сторінка: цілий каталог текстів
   важить пів мегабайта, а самі макети — десяту частину від того.

   На телефоні поруч ставити нема де, тож там самі екрани йдуть один під
   одним, по групах, звичайним скролом сторінки (2026-10-07; до того —
   стрічка вбік, де 39 карток доводилось гортати по одній). Чипи груп
   липнуть угорі, підсвічують групу, яку видно, і переносять до неї.
   Макет монтується лише в картці поблизу екрана, кружечок грає лише в
   тій, що посередині.

   Глибокі посилання /modules#m-<група> (хлібна крихта зі сторінки
   модуля) ведуть на розділ покажчика й одразу показують його перший
   модуль; на телефоні — гортають сторінку до групи.
   ──────────────────────────────────────────────────────────────── */

export type CatalogMocks = Record<string, Record<Lang, MockSpec>>;

const norm = (s: string) => s.toLowerCase().replace(/[’'`]/g, "'");

/* Якір першого завантаження. <AnchorGuard /> прибирає #hash з адреси, щойно
   сторінка стала на місце, а каталог гідратується окремо й буває пізніше
   за нього — тож запам'ятовуємо якір, поки модуль тільки виконується. */
let bootHash = typeof window !== "undefined" ? window.location.hash : "";

/* Кружечок із записом — лише для тих, хто не просив прибрати рух. */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia(RM_QUERY).matches;
/* На сервері кружечка немає: він з'являється після гідратації. */
const getReducedServer = () => true;

/* Людина з команди «Нового Життя» за шість секунд без звуку, кружечком,
   як камера в Loom. Файл ~70 КБ, грає тільки поки модуль вибраний. */
function ClipBubble({ src, className }: { src: string; className?: string }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);
  const [failed, setFailed] = useState(false);
  if (reduced || failed) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 rounded-full overflow-hidden bg-surface-3 ring-[4px] ring-[var(--surface)] shadow-[0_14px_30px_-14px_rgba(0,30,80,0.55)]",
        className
      )}
      style={{ animation: "sparkleIn 0.5s var(--ease-pop) both" }}
    >
      <video
        src={src}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </span>
  );
}

/* Чи перетинає елемент смугу вікна. `rootMargin` задає смугу: «600px 0px» —
   екран із запасом (монтувати макет заздалегідь), «-40% 0px -40% 0px» —
   середина екрана (там грає кружечок). */
function useInBand<T extends Element>(rootMargin: string) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, on] as const;
}

/* Скільки займають угорі шапка сайту й липкий ряд чипів: на стільки
   відступає група, до якої перенесли, і на цій висоті рахуємо поточну. */
const MOBILE_TOP = 140;

type Item = { id: string; name: string; text: string; soon?: boolean };
type Group = { id: string; title: string; items: Item[] };

export default function ModulesGrid({ mocks }: { mocks: CatalogMocks }) {
  const all = useT().modules;
  const c = all.catalog;
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const q = norm(query.trim());

  /* Службові модулі каталог може ховати списком CATALOG_HIDDEN. */
  const catalog = useMemo<Group[]>(
    () =>
      all.groups
        .map((g) => ({ ...g, items: g.items.filter((i) => inCatalog(i.id)) }))
        .filter((g) => g.items.length > 0),
    [all.groups]
  );
  const total = useMemo(() => catalog.reduce((n, g) => n + g.items.length, 0), [catalog]);

  /* Пошук ховає назви, що не збіглися, і групи, де не лишилось жодної. */
  const groups = useMemo(
    () =>
      catalog
        .map((g) => ({
          ...g,
          items: q ? g.items.filter((i) => norm(i.name).includes(q) || norm(i.text).includes(q)) : g.items,
        }))
        .filter((g) => g.items.length > 0),
    [catalog, q]
  );
  const flat = useMemo(() => groups.flatMap((g) => g.items.map((i) => ({ g, i }))), [groups]);

  /* ── Покажчик + екран (десктоп) ── */
  const [active, setActive] = useState(catalog[0]?.items[0]?.id ?? "");
  const current = flat.find((x) => x.i.id === active) ?? flat[0];

  /* Намір, а не проліт: миша, що просто перетинає рядок дорогою до екрана,
     не має перемикати його. */
  const intent = useRef<number | undefined>(undefined);
  const preview = (id: string) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setActive(id), 90);
  };
  const cancel = () => window.clearTimeout(intent.current);
  useEffect(() => () => window.clearTimeout(intent.current), []);

  /* ── Екрани один під одним (телефон, планшет) ── */
  const listRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<string | undefined>(groups[0]?.id);
  const viewGroup = groups.some((g) => g.id === inView) ? inView : groups[0]?.id;

  /* Поточна група — остання, чий верх уже заїхав під липкі чипи. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (list.offsetParent === null) return;
        let id: string | undefined;
        for (const el of list.children as HTMLCollectionOf<HTMLElement>) {
          if (el.getBoundingClientRect().top <= MOBILE_TOP + 8) id = el.dataset.group;
        }
        setInView(id ?? (list.children[0] as HTMLElement | undefined)?.dataset.group);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [groups]);

  const search = (value: string) => setQuery(value);

  /* Чип поточної групи тримаємо в полі зору — рухаючи лише стрічку чипів. */
  useEffect(() => {
    const i = groups.findIndex((g) => g.id === viewGroup);
    if (i >= 0) centerInRail(chipsRef.current, i);
  }, [viewGroup, groups]);

  /* Сторінку гортаємо самі, а не scrollIntoView: той рухав би й стрічку
     чипів (див. lib/scroll.ts). */
  const toGroup = useCallback((id: string, smooth = true) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-group="${id}"]`);
    if (!el || el.offsetParent === null) return;
    const top = el.getBoundingClientRect().top + window.scrollY - MOBILE_TOP;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
  }, []);

  /* Глибоке посилання ставить розділ під шапку, а екран праворуч липне
     лише в межах покажчика: для нижніх груп він виїхав би під шапку. Тож
     нижнім розділам даємо більший відступ зверху — рівно такий, щоб екран
     лишався цілим. <AnchorGuard /> гортає через scrollIntoView, а той
     scroll-margin-top поважає. */
  const indexRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fit = () => {
      const nav = indexRef.current;
      const screen = screenRef.current;
      if (!nav || !screen || nav.offsetParent === null) return;
      const top = parseFloat(getComputedStyle(screen).top) || 104;
      const need = top + screen.offsetHeight;
      const bottom = nav.getBoundingClientRect().bottom;
      for (const el of nav.children as HTMLCollectionOf<HTMLElement>) {
        const margin = Math.max(112, need - (bottom - el.getBoundingClientRect().top));
        el.style.scrollMarginTop = `${Math.min(margin, window.innerHeight - 160)}px`;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [groups]);

  /* Прийшли з хлібної крихти /modules#m-<група>: сторінку до розділу гортає
     <AnchorGuard />, а тут розділ одразу показує свій перший модуль. */
  useEffect(() => {
    const open = (hash: string) => {
      const g = catalog.find((x) => `#m-${x.id}` === hash);
      if (!g) return;
      setActive(g.items[0].id);
      /* На телефоні покажчика немає (він схований) — гортаємо до групи
         в списку екранів, після того як AnchorGuard відпрацював. */
      requestAnimationFrame(() => requestAnimationFrame(() => toGroup(g.id, false)));
    };
    open(window.location.hash || bootHash);
    bootHash = "";
    /* Якір, що приїхав без нового документа. Слухач стоїть після
       AnchorGuard, але той чистить адресу лише в наступному кадрі. */
    const onHash = () => open(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [catalog, toGroup]);

  const count = c.count.replace("{n}", String(total)).replace("{g}", String(catalog.length));

  return (
    <section className="w-full flex flex-col items-center pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-12">
        {/* ── Шапка: назва, одне речення, пошук ── */}
        <FadeIn className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4 max-w-[680px]">
            <h1 className="font-semibold text-ink text-[44px] sm:text-[60px] lg:text-[84px] leading-[1.0] tracking-[-1.6px] lg:tracking-[-3px]">
              {c.title}
            </h1>
            <p className="text-[16px] md:text-[19px] text-ink-2 leading-[1.45] tabular-nums">{count}</p>
          </div>

          <label className="relative flex items-center w-full md:w-[280px] shrink-0 md:mb-1.5">
            <Search className="absolute left-3.5 w-[17px] h-[17px] text-ink-3 pointer-events-none" strokeWidth={2} />
            <input
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder={c.search}
              aria-label={c.search}
              className="w-full h-11 rounded-full bg-surface border border-hairline pl-10 pr-10 text-[15px] text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand/50 focus:shadow-[0_0_0_3px_var(--brand-soft)] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => search("")}
                aria-label={c.clear}
                className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.2} />
              </button>
            )}
          </label>
        </FadeIn>

        {q && (
          <p className="-mt-4 md:-mt-6 text-[14px] text-ink-3 tabular-nums" role="status" aria-live="polite">
            {flat.length > 0 ? c.found.replace("{n}", String(flat.length)) : c.empty}
          </p>
        )}

        {flat.length === 0 && (
          <button
            type="button"
            onClick={() => search("")}
            className="self-start rounded-full border border-hairline bg-surface px-4 h-10 text-[14px] font-medium text-ink hover:border-hairline-strong transition-colors"
          >
            {c.clear}
          </button>
        )}

        {/* ══ Десктоп: покажчик ліворуч, екран праворуч ══ */}
        {flat.length > 0 && (
          <FadeIn className="hidden lg:grid grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_520px] gap-12 xl:gap-16 items-start">
            <nav ref={indexRef} aria-label={c.title} className="flex flex-col">
              {catalog.map((group) => {
                const shown = groups.find((g) => g.id === group.id);
                const GroupIcon = GROUP_ICONS[group.id] ?? LayoutGrid;
                const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
                return (
                  /* Розділ лишається в DOM і під час пошуку: на нього ведуть
                     глибокі посилання. */
                  <div
                    key={group.id}
                    id={`m-${group.id}`}
                    className={cn(
                      "flex flex-col gap-2 py-5 border-t border-hairline first:border-t-0 first:pt-0",
                      !shown && "hidden"
                    )}
                  >
                    <h2
                      className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] leading-none"
                      style={{ color: accent }}
                    >
                      <GroupIcon className="w-[15px] h-[15px]" strokeWidth={2.2} />
                      {group.title}
                    </h2>
                    <ul className="flex flex-wrap gap-x-6 gap-y-0.5">
                      {(shown?.items ?? []).map((item) => {
                        const on = current?.i.id === item.id;
                        const tone = moduleAccent(item.id, group.id);
                        const href = hasModulePage(item.id) ? `/modules/${item.id}` : "";
                        const cls = cn(
                          "relative inline-flex items-center gap-2 py-1 font-semibold text-[25px] xl:text-[27px] leading-[1.22] tracking-[-0.6px] outline-none transition-colors duration-200",
                          on ? "text-ink" : "text-ink-2 hover:text-ink focus-visible:text-ink"
                        );
                        const body = (
                          <>
                            {item.name}
                            {item.soon && (
                              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none rounded-full border border-dashed border-hairline-strong px-1.5 py-1">
                                {all.soon}
                              </span>
                            )}
                            {/* Риска під вибраною назвою — у колір самого модуля. */}
                            <span
                              aria-hidden
                              className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full origin-left transition-transform duration-300 ease-out"
                              style={{ background: tone, transform: `scaleX(${on ? 1 : 0})` }}
                            />
                          </>
                        );
                        const events = {
                          onPointerEnter: (e: React.PointerEvent) => {
                            if (e.pointerType === "mouse") preview(item.id);
                          },
                          onPointerLeave: cancel,
                          onFocus: () => setActive(item.id),
                        };
                        return (
                          <li key={item.id}>
                            {href ? (
                              <Link
                                href={href}
                                aria-current={on ? "true" : undefined}
                                className={cls}
                                {...events}
                                /* Дотик без наведення (планшет у ландшафті):
                                   перший тап показує екран, другий — відкриває. */
                                onClick={(e) => {
                                  if (!on && window.matchMedia("(hover: none)").matches) {
                                    e.preventDefault();
                                    setActive(item.id);
                                  }
                                }}
                              >
                                {body}
                              </Link>
                            ) : (
                              <button type="button" className={cls} {...events} onClick={() => setActive(item.id)}>
                                {body}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>

            {current && (
              <div ref={screenRef} className="sticky top-[104px]">
                <Screen
                  item={current.i}
                  groupId={current.g.id}
                  groupTitle={current.g.title}
                  mock={mocks[current.i.id]?.[lang]}
                  more={c.more}
                />
              </div>
            )}
          </FadeIn>
        )}

        {/* ══ Телефон і планшет: липкі групи + екрани один під одним ══ */}
        {flat.length > 0 && (
          <div className="lg:hidden flex flex-col gap-4">
            <div className="sticky top-16 md:top-20 z-30 -mx-5 md:-mx-8 px-5 md:px-8 py-2.5 bg-page/88 backdrop-blur-xl border-b border-hairline">
              <div ref={chipsRef} className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                {groups.map((group) => {
                  const Icon = GROUP_ICONS[group.id] ?? LayoutGrid;
                  const accent = GROUP_ACCENTS[group.id] ?? "#007aff";
                  const on = viewGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toGroup(group.id)}
                      aria-pressed={on}
                      className={cn(
                        "shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full border text-[13.5px] font-medium leading-none transition-colors duration-200",
                        on ? "border-brand/45 bg-brand-soft text-ink" : "border-hairline bg-surface text-ink-2"
                      )}
                    >
                      <Icon className="w-[15px] h-[15px]" strokeWidth={2.1} style={{ color: accent }} />
                      {group.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={listRef} className="flex flex-col gap-8">
              {groups.map((group) => (
                <div key={group.id} data-group={group.id} className="flex flex-col gap-4">
                  {group.items.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      groupId={group.id}
                      groupTitle={group.title}
                      mock={mocks[item.id]?.[lang]}
                      more={c.more}
                      soon={all.soon}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Перенесення бази — вхід у каталог, а не окремий розділ сайту. */}
        {!q && (
          <FadeIn className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-hairline pt-6 text-[15px] md:text-[16px] text-ink-2">
            {all.importLink.text}
            <Link
              href="/import"
              className="inline-flex items-center gap-1 font-medium text-brand hover:underline underline-offset-4"
            >
              {all.importLink.cta}
              <ArrowUpRight className="w-[15px] h-[15px]" strokeWidth={2} />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ── Макет, вписаний у висоту ────────────────────────────────────
   Макети різні на зріст (чат ШІ-асистента у вузькій картці — понад сімсот
   пікселів, таблиця — триста), а місце під екран залежить від вікна.
   Зрізаний знизу макет виглядає зламаним (відгук 2026-09-30, «обрізане»),
   тож макет, що не влазить, зменшуємо цілим — ширину він тримає сам.
   Але не дрібніше за `min`: далі текст у ньому вже не прочитати, і тоді
   краще розчинити самий низ, ніж показати мурашник. */
function Fit({ children, min = 0.6, fade }: { children: React.ReactNode; min?: number; fade: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, over: false });
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const h = i.offsetHeight;
      const room = o.clientHeight;
      if (!h || !room) return;
      const scale = Math.max(min, Math.min(1, room / h));
      setFit({ scale, over: h * scale > room + 1 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [min]);
  return (
    <div ref={outer} className={cn("absolute inset-0 flex justify-center overflow-hidden", fit.over ? "items-start" : "items-center")}>
      <div
        ref={inner}
        className="w-full shrink-0"
        style={{ transform: `scale(${fit.scale})`, transformOrigin: fit.over ? "top center" : "center" }}
      >
        {children}
      </div>
      {fit.over && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to bottom, transparent, ${fade})` }} />
      )}
    </div>
  );
}

/* ── Екран вибраного модуля (десктоп) ─────────────────────────── */

function Screen({
  item,
  groupId,
  groupTitle,
  mock,
  more,
}: {
  item: Item;
  groupId: string;
  groupTitle: string;
  mock: MockSpec | undefined;
  more: string;
}) {
  const tone = moduleAccent(item.id, groupId);
  const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
  const clip = getModuleClipPreview(item.id);
  const href = hasModulePage(item.id) ? `/modules/${item.id}` : null;

  return (
    /* Панель не вища за вікно під шапкою: липне повністю, нічого не ховає
       за нижнім краєм. */
    <div
      className="relative h-[min(660px,calc(100dvh-128px))] min-h-[460px] rounded-[28px] border border-hairline overflow-hidden flex flex-col transition-[background] duration-500"
      style={{
        background: `linear-gradient(160deg, color-mix(in oklab, ${tone} 13%, var(--surface)) 0%, color-mix(in oklab, ${tone} 4%, var(--surface)) 60%, var(--surface) 100%)`,
      }}
    >
      {/* Речення — заголовок екрана: що людина отримає. Назва вже
          підкреслена в покажчику, тож тут вона лише підпис. Кружечок —
          поруч із реченням: людина з команди ніби каже його сама. */}
      <div key={item.id} className="shrink-0 px-7 pt-6 flex flex-col gap-3" style={{ animation: "softFade 0.35s ease-out both" }}>
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold leading-none" style={{ color: tone }}>
            <Icon className="w-4 h-4" strokeWidth={2.2} />
            {item.name}
            <span className="font-medium text-ink-3">· {groupTitle}</span>
          </span>
          {href && (
            <Link
              href={href}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2 hover:text-ink hover:border-hairline-strong transition-colors"
            >
              {more}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="flex-1 text-ink font-semibold text-[22px] xl:text-[24px] leading-[1.25] tracking-[-0.4px] min-h-[2.5em]">
            {item.text}
          </p>
          {clip && <ClipBubble key={`clip-${item.id}`} src={clip} className="w-[76px] h-[76px]" />}
        </div>
      </div>

      <div className="relative flex-1 min-h-0 mx-7 mt-4 mb-6">
        {mock && (
          <Fit key={item.id} fade={`color-mix(in oklab, ${tone} 3%, var(--surface))`}>
            <ModuleMock spec={mock} accent={tone} Icon={Icon} />
          </Fit>
        )}
      </div>
    </div>
  );
}

/* ── Картка екрана (телефон, планшет) ─────────────────────────── */

function Card({
  item,
  groupId,
  groupTitle,
  mock,
  more,
  soon,
}: {
  item: Item;
  groupId: string;
  groupTitle: string;
  mock: MockSpec | undefined;
  more: string;
  soon: string;
}) {
  /* Макет — лише поблизу екрана (39 макетів разом важкі для телефона);
     висота під нього стала, тож сторінка не стрибає. Кружечок — лише в
     картці посередині екрана. */
  const [ref, near] = useInBand<HTMLElement>("600px 0px");
  const [mid, live] = useInBand<HTMLDivElement>("-40% 0px -40% 0px");
  const tone = moduleAccent(item.id, groupId);
  const Icon = MODULE_ICONS[item.id] ?? LayoutGrid;
  const clip = getModuleClipPreview(item.id);
  const href = hasModulePage(item.id) ? `/modules/${item.id}` : null;

  return (
    <article
      ref={ref}
      className="w-full max-w-[560px] mx-auto rounded-[24px] border border-hairline overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(170deg, color-mix(in oklab, ${tone} 13%, var(--surface)) 0%, color-mix(in oklab, ${tone} 4%, var(--surface)) 55%, var(--surface) 100%)`,
      }}
    >
      <div className="px-5 pt-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold leading-none" style={{ color: tone }}>
              <Icon className="w-4 h-4" strokeWidth={2.2} />
              {groupTitle}
            </span>
            <h3 className="flex flex-wrap items-center gap-2 font-semibold text-ink text-[26px] leading-[1.1] tracking-[-0.6px]">
              {item.name}
              {item.soon && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-3 leading-none rounded-full border border-dashed border-hairline-strong px-1.5 py-1">
                  {soon}
                </span>
              )}
            </h3>
          </div>
          {/* Кружечок грає лише в картці, що на екрані. */}
          {clip && live && <ClipBubble key={`clip-${item.id}`} src={clip} className="w-14 h-14 ring-4" />}
        </div>
        <p className="text-[15px] text-ink-2 leading-[1.4] min-h-[2.8em]">{item.text}</p>
      </div>

      <div ref={mid} className="relative h-[440px] mx-4 mt-3 mb-4">
        {mock && near && (
          <Fit min={0.66} fade="var(--surface)">
            <ModuleMock spec={mock} accent={tone} Icon={Icon} />
          </Fit>
        )}
      </div>

      {href && (
        <div className="mt-auto px-4 pb-4">
          <Link
            href={href}
            className="w-full h-11 rounded-full flex items-center justify-center gap-1.5 text-[15px] font-semibold text-white"
            /* Колір модуля трохи поглиблюємо, щоб білий текст тримав контраст. */
            style={{ background: `color-mix(in oklab, ${tone} 80%, #04121f)` }}
          >
            {more}
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>
      )}
    </article>
  );
}
