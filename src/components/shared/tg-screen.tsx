import { Bot, ChevronLeft, Menu, MoreVertical, Paperclip, Smile } from "lucide-react";
import type { TgButton, TgLine } from "@/content/telegram";
import { cn } from "@/lib/utils";

/* Chrome спільна для всіх блоків /telegram: шапка бота, повідомлення,
   inline-кнопки під ним і сіра reply-клавіатура внизу. Один вигляд на
   сторінку — інакше кожен блок малював би «свій» Telegram.

   Порядок елементів такий самий, як у застосунку: шапка → чат на
   блакитних шпалерах → поле вводу → reply-клавіатура під ним. */

/** Знак Telegram — літачок у колі. Тільки для позначки «це месенджер». */
export function TgMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="tg-mark" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2aabee" />
          <stop offset="100%" stopColor="#229ed9" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#tg-mark)" />
      <path
        fill="#fff"
        d="M5.2 11.7c3.6-1.6 6-2.6 7.2-3.1 3.4-1.4 4.1-1.7 4.6-1.7.1 0 .3 0 .4.2.1.1.1.2.1.3v.4c-.2 1.7-.9 5.9-1.3 7.8-.2.8-.5 1.1-.8 1.1-.7.1-1.2-.4-1.8-.8-1-.7-1.6-1.1-2.6-1.7-1.1-.7-.4-1.1.2-1.8.2-.2 3-2.7 3-2.9 0-.1 0-.1-.1-.2h-.2c-.1 0-1.6 1-4.4 2.9-.4.3-.8.4-1.1.4-.4 0-1.1-.2-1.6-.4-.6-.2-1.1-.3-1.1-.7.1-.2.5-.5 1.5-.8z"
      />
    </svg>
  );
}

export function TgHeader({
  title,
  sub,
  right,
  onBack,
  backLabel,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  /** Є що згорнути — стрілка стає справжньою кнопкою «назад». */
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div className="shrink-0 flex items-center gap-2 px-2.5 py-2.5 border-b border-hairline bg-surface">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="-ml-1 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-surface-3"
        >
          <ChevronLeft className="w-[18px] h-[18px] text-brand" strokeWidth={2.4} />
        </button>
      ) : (
        <ChevronLeft className="w-[18px] h-[18px] text-brand shrink-0" strokeWidth={2.4} />
      )}
      <span className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0">
        <Bot className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="block text-[14.5px] font-semibold text-ink leading-none truncate">{title}</span>
        {sub && <span className="block text-[12px] text-ink-3 leading-none truncate">{sub}</span>}
      </span>
      {right ?? <MoreVertical className="w-[18px] h-[18px] text-ink-3 shrink-0" strokeWidth={2} />}
    </div>
  );
}

/** Повідомлення бота: рядки з жирним заголовком і приглушеним хвостом. */
export function TgMessage({
  lines,
  className,
  children,
  time = "09:41",
}: {
  lines: TgLine[];
  className?: string;
  children?: React.ReactNode;
  /** Час у кутку бульбашки; false — прибрати. */
  time?: string | false;
}) {
  return (
    <div
      className={cn(
        "tg-bubble self-start max-w-[92%] rounded-[14px] rounded-bl-[4px] px-3.5 py-2.5 flex flex-col gap-1.5",
        className
      )}
    >
      {lines.map((line, i) => (
        <span
          key={`${line.t}-${i}`}
          className={cn(
            "text-[14.5px] leading-[1.4]",
            line.s === "b" && "font-semibold text-ink text-[15.5px]",
            line.s === "d" && "text-[13px] text-ink-3",
            !line.s && "text-ink-2"
          )}
        >
          {line.t}
        </span>
      ))}
      {children}
      {time !== false && (
        <span className="self-end -mt-0.5 text-[11px] text-ink-3 leading-none tabular-nums">{time}</span>
      )}
    </div>
  );
}

/** Inline-кнопки — те, що прикріплене до самого повідомлення. */
export function TgInline({
  rows,
  className,
  dense,
  demo,
  onTap,
  active,
}: {
  rows: TgButton[][];
  className?: string;
  dense?: boolean;
  /** Підпис кнопки, по якій «тисне» примарний курсор (CursorDemo). */
  demo?: string;
  /** Передали — кнопки справді натискаються (блоки /telegram). */
  onTap?: (label: string) => void;
  /** Підпис вибраної кнопки — вона заливається своїм кольором. */
  active?: string | null;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-1.5">
          {row.map((b) => {
            const on = active === b.t;
            const cls = cn(
              "flex-1 min-w-0 rounded-[10px] border flex items-center justify-center text-center leading-[1.2] px-2.5 truncate",
              dense ? "h-8 text-[12px]" : "h-9 text-[12.5px] font-medium",
              b.primary && "bg-brand border-brand text-white font-semibold",
              b.tone === "green" &&
                (on
                  ? "bg-[#12a150] border-[#12a150] text-white font-semibold"
                  : "bg-[#12a150]/12 border-[#12a150]/35 text-[#0f8a45] dark:text-[#3ddc97] font-semibold"),
              b.tone === "red" &&
                (on
                  ? "bg-[#f05b8b] border-[#f05b8b] text-white font-semibold"
                  : "bg-[#f05b8b]/12 border-[#f05b8b]/35 text-[#d1376b] dark:text-[#ff8fb4] font-semibold"),
              !b.primary && !b.tone && "tg-inline-btn border-hairline-strong text-ink-2",
              demo === b.t && "ring-2 ring-offset-2 ring-offset-transparent ring-brand/35"
            );
            return onTap ? (
              <button
                key={b.t}
                type="button"
                onClick={() => onTap(b.t)}
                aria-pressed={active === undefined ? undefined : on}
                className={cn(cls, "transition-[transform,background-color,color] duration-150 active:scale-[0.97]")}
              >
                {b.t}
              </button>
            ) : (
              <span key={b.t} data-demo={demo === b.t ? "click" : undefined} className={cls}>
                {b.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Reply-клавіатура: сірі кнопки під полем вводу, головне меню бота. */
export function TgKeyboard({
  rows,
  className,
  onTap,
  active,
  disabled,
}: {
  rows: string[][];
  className?: string;
  /** Передали — кнопки справді натискаються (герой /telegram). */
  onTap?: (label: string) => void;
  /** Підпис кнопки, яку щойно натиснули. */
  active?: string | null;
  disabled?: boolean;
}) {
  const base =
    "flex-1 min-w-0 h-10 rounded-[10px] bg-surface border border-hairline-strong flex items-center justify-center px-2 text-[13.5px] font-medium text-ink leading-none truncate shadow-[0_1px_1px_rgba(0,0,0,0.05)]";
  return (
    <div className={cn("tg-keyboard flex flex-col gap-2 p-3 border-t border-hairline", className)}>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-2">
          {row.map((label) =>
            onTap ? (
              <button
                key={label}
                type="button"
                onClick={() => onTap(label)}
                disabled={disabled}
                aria-pressed={active === label}
                className={cn(
                  base,
                  "tg-key-btn transition-transform duration-100 active:scale-[0.97] disabled:cursor-default",
                  active === label && "border-brand/60 text-brand"
                )}
              >
                {label}
              </button>
            ) : (
              <span key={label} className={base}>
                {label}
              </span>
            )
          )}
        </div>
      ))}
    </div>
  );
}

/** Поле вводу: кнопка меню бота, скріпка, смайл і синій літачок. */
export function TgInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="shrink-0 px-3 py-2.5 border-t border-hairline bg-surface flex items-center gap-2">
      <span className="w-9 h-9 rounded-full bg-surface-3 flex items-center justify-center shrink-0">
        <Menu className="w-[17px] h-[17px] text-ink-3" strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0 h-9 rounded-full bg-surface-2 border border-hairline flex items-center gap-2 pl-3 pr-3">
        <Smile className="w-[16px] h-[16px] text-ink-3 shrink-0" strokeWidth={2} />
        <span className="flex-1 min-w-0 text-[13.5px] text-ink-3 leading-none truncate">{placeholder}</span>
        <Paperclip className="w-[16px] h-[16px] text-ink-3 shrink-0" strokeWidth={2} />
      </span>
      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#2aabee" }}>
        <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" aria-hidden>
          <path
            fill="#fff"
            d="M3.2 10.7c3.6-1.6 6-2.6 7.2-3.1 3.4-1.4 4.1-1.7 4.6-1.7.1 0 .3 0 .4.2.1.1.1.2.1.3v.4c-.2 1.7-.9 5.9-1.3 7.8-.2.8-.5 1.1-.8 1.1-.7.1-1.2-.4-1.8-.8-1-.7-1.6-1.1-2.6-1.7-1.1-.7-.4-1.1.2-1.8.2-.2 3-2.7 3-2.9 0-.1 0-.1-.1-.2h-.2c-.1 0-1.6 1-4.4 2.9-.4.3-.8.4-1.1.4-.4 0-1.1-.2-1.6-.4-.6-.2-1.1-.3-1.1-.7.1-.2.5-.5 1.5-.8z"
          />
        </svg>
      </span>
    </div>
  );
}
