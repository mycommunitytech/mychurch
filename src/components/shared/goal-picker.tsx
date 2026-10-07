"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { BUILDER_GROUPS, findGoal } from "@/content/builder";
import { moduleAccent } from "@/components/shared/module-icons";
import { FIELD_SHELL } from "@/components/shared/form-field";
import { useFocusTrap } from "@/components/shared/use-focus-trap";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Що хочете покращити» у брифі.

   Бажань у каталозі майже тридцять — стіною чипів вони не влазять
   у форму і читаються як меню. Тому в самій формі лишається рядок
   із обраним, а весь список відкривається окремим вікном: пошук,
   групи конструктора і, першою групою, те, що зазвичай називає
   саме ця роль. Чого немає в списку — людина дописує своїми
   словами прямо в пошуку.

   Вікно йде порталом у <body>: картка брифу обрізає все, що
   виходить за її межі (overflow-hidden), а розділ під час появи ще
   й трансформується — випадаючий шар усередині неї жив би в її
   системі координат.
   ──────────────────────────────────────────────────────────────── */

interface GoalPickerProps {
  /** Обрані бажання, ідентифікаторами; своє — з префіксом own:. */
  picked: string[];
  onToggle: (id: string) => void;
  /** Своє бажання, вписане в пошуку. */
  onAdd: (text: string) => void;
  /** Бажання обраної ролі: у вікні вони стоять окремою групою вгорі. */
  suggest: string[];
  /** Підпис над цією групою: ролі — «для вашої ролі», без неї — «часто обирають». */
  suggestLabel?: string;
  /** Чого не пропонуємо взагалі. */
  hide?: string[];
  /** Вікно відкрили — крок у аналітиці. */
  onOpen?: () => void;
}

/* ── Один рядок списку ───────────────────────────────────────────── */
function GoalRow({ id, label, on, onClick }: { id: string; label: string; on: boolean; onClick: () => void }) {
  const goal = findGoal(id);
  const Icon = goal?.Icon;
  const accent = moduleAccent(goal?.modules[0] ?? "people");
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-3 rounded-[14px] border px-3 py-2.5 transition-[background-color,border-color] duration-150",
        on ? "border-brand/45 bg-brand-soft" : "border-hairline bg-surface hover:border-hairline-strong hover:bg-surface-2"
      )}
    >
      <span
        className="w-8 h-8 rounded-[10px] border border-hairline flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: accent }}
      >
        {Icon ? <Icon className="w-4 h-4" strokeWidth={2.1} /> : <Plus className="w-4 h-4" strokeWidth={2.1} />}
      </span>
      <span className="text-[14.5px] font-medium text-ink leading-[1.3] min-w-0 flex-1">{label}</span>
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
}

/* ── Поле з обраним + вікно вибору ───────────────────────────────── */
export default function GoalPicker({ picked, onToggle, onAdd, suggest, suggestLabel, hide = [], onOpen }: GoalPickerProps) {
  const t = useT();
  const f = t.brief.form;
  const labels = t.builder.goals as Record<string, { label: string; short?: string }>;
  const groupNames = t.builder.groups as Record<string, string>;
  /* Своє бажання несе свій текст у самому ідентифікаторі. */
  const label = (id: string) => labels[id]?.label ?? id.replace(/^own:/, "");
  const short = (id: string) => labels[id]?.short ?? label(id);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const windowRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  /* Фокус заходить у пошук і повертається на кнопку, яка відкрила вікно. */
  useFocusTrap(windowRef, open, searchRef);

  /* Escape закриває, а сторінка під вікном не їде під пальцем. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const pad = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${pad}px`;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const hidden = useMemo(() => new Set(hide), [hide]);
  const q = query.trim().toLocaleLowerCase("uk");
  const matches = (id: string) => !q || `${label(id)} ${short(id)}`.toLocaleLowerCase("uk").includes(q);

  /* Поки в пошуку порожньо, зверху стоїть те, що називає ця роль; у
     своїх групах ці бажання вже не повторюються. */
  const mine = q ? [] : suggest.filter((id) => !hidden.has(id));
  const mineSet = new Set(mine);
  const groups = BUILDER_GROUPS.map((g) => ({
    id: g.id,
    ids: g.goals.map((goal) => goal.id).filter((id) => !hidden.has(id) && !mineSet.has(id) && matches(id)),
  })).filter((g) => g.ids.length > 0);

  const flat = [...mine, ...groups.flatMap((g) => g.ids)];
  const total = BUILDER_GROUPS.flatMap((g) => g.goals).filter((g) => !hidden.has(g.id)).length;
  const canAdd = query.trim().length > 1 && !flat.some((id) => label(id).toLocaleLowerCase("uk") === q);

  const addOwn = () => {
    const value = query.trim();
    if (!value) return;
    onAdd(value);
    setQuery("");
    searchRef.current?.focus();
  };

  const openPicker = () => {
    onOpen?.();
    setQuery("");
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Рядок із обраним: піни знімаються хрестиком, а решта рядка —
          кнопка, яка відкриває весь список. */}
      <div className={cn(FIELD_SHELL, "flex-row flex-wrap items-center gap-2 py-3 min-h-[60px] cursor-default")}>
        {picked.map((id) => {
          const Icon = findGoal(id)?.Icon;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              aria-pressed
              aria-label={`${label(id)} — ${f.dropHint}`}
              className="perk-in inline-flex shrink-0 items-center gap-1.5 h-9 pl-3.5 pr-2.5 rounded-full border border-hairline bg-surface-2 text-ink-2 text-[13.5px] font-medium leading-none whitespace-nowrap transition-colors duration-150 hover:text-ink hover:border-hairline-strong"
            >
              {Icon && <Icon className="w-4 h-4 shrink-0 text-ink-3" strokeWidth={2.2} />}
              {short(id)}
              <X className="w-3.5 h-3.5 shrink-0 opacity-70" strokeWidth={2.6} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={openPicker}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex-1 min-w-[150px] h-9 flex items-center justify-between gap-2 text-left text-[15px] text-ink-3 hover:text-ink-2 transition-colors duration-150 leading-none"
        >
          <span className="truncate">{picked.length ? f.pickedMore : f.pickedPlaceholder}</span>
          <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={2.2} />
        </button>
      </div>

      {/* Вікно відкриває тільки клік, тож на сервері (статичний експорт)
          цієї гілки не буває і document тут завжди є. */}
      {open &&
        createPortal(
          <div
            className="picker-fade fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/40 sm:px-5 sm:py-6"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              ref={windowRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="picker-sheet w-full sm:max-w-[560px] max-h-[86vh] sm:max-h-[620px] flex flex-col overflow-hidden bg-surface border border-hairline-strong rounded-t-[24px] sm:rounded-[24px] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]"
            >
              <div className="shrink-0 flex items-start gap-4 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-hairline">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h3 id={titleId} className="text-[19px] sm:text-[21px] font-semibold text-ink leading-tight tracking-[-0.4px]">
                    {f.pickerTitle}
                  </h3>
                  <p className="text-[13.5px] text-ink-2 leading-[1.45]">{f.pickerText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={f.pickerClose}
                  className="shrink-0 w-9 h-9 -mr-1.5 -mt-1 rounded-full flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors duration-150"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={2.2} />
                </button>
              </div>

              <div className="shrink-0 px-5 sm:px-6 py-3 border-b border-hairline">
                <label className="flex items-center gap-2.5 h-11 px-4 rounded-[12px] bg-surface-2 border border-hairline transition-[border-color] duration-150 focus-within:border-[#007aff] cursor-text">
                  <Search aria-hidden className="w-[17px] h-[17px] shrink-0 text-ink-3" strokeWidth={2} />
                  <span className="sr-only">{f.pickerSearch}</span>
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    placeholder={f.pickerSearch}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      /* Один збіг — Enter його й позначає; збігів немає —
                         рядок лягає своїм бажанням. */
                      if (flat.length === 1) onToggle(flat[0]);
                      else if (canAdd) addOwn();
                    }}
                    className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-ink/[0.88] placeholder:text-[#818186] leading-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        searchRef.current?.focus();
                      }}
                      aria-label={f.pickerClose}
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors duration-150"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2.4} />
                    </button>
                  )}
                </label>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-4 flex flex-col gap-5">
                {mine.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                      {suggestLabel ?? f.pickerForYou}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {mine.map((id) => (
                        <GoalRow key={id} id={id} label={label(id)} on={picked.includes(id)} onClick={() => onToggle(id)} />
                      ))}
                    </div>
                  </div>
                )}

                {groups.map((g) => (
                  <div key={g.id} className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{groupNames[g.id]}</span>
                    <div className="flex flex-col gap-1.5">
                      {g.ids.map((id) => (
                        <GoalRow key={id} id={id} label={label(id)} on={picked.includes(id)} onClick={() => onToggle(id)} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Чого немає в каталозі — дописується тим самим рядком пошуку. */}
                {canAdd && (
                  <button
                    type="button"
                    onClick={addOwn}
                    className="w-full text-left flex items-center gap-3 rounded-[14px] border border-dashed border-hairline-strong bg-surface px-3 py-2.5 transition-colors duration-150 hover:bg-surface-2"
                  >
                    <span className="w-8 h-8 rounded-[10px] border border-hairline bg-surface-2 text-ink-2 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-[14.5px] font-medium text-ink leading-[1.3] min-w-0 flex-1">
                      {f.pickerAdd.replace("{q}", query.trim())}
                    </span>
                  </button>
                )}

                {flat.length === 0 && !canAdd && (
                  <p className="text-[14px] text-ink-3 leading-[1.5] py-4 text-center">{f.pickerEmpty}</p>
                )}
              </div>

              <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-hairline bg-surface-2/50 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
                <span className="text-[13px] text-ink-3 tabular-nums">
                  {/* «N з 28» рахує тільки каталог: своє бажання в ті 28 не
                      входить, тож і в лічильник не лізе. */}
                  {t.builder.picked
                    .replace("{n}", String(picked.filter((id) => !id.startsWith("own:")).length))
                    .replace("{total}", String(total))}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-primary btn-brand relative flex items-center justify-center h-10 px-6 rounded-full overflow-hidden"
                >
                  <span className="relative text-white font-semibold text-[14.5px] leading-none">{f.pickerDone}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
