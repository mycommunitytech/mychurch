"use client";

import { useId } from "react";
import { User, Phone, Church } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaret } from "@/components/shared/use-caret";
import { UA_PREFIX, capitalizeWords, formatPhone, normalizeName, phoneCaret } from "@/lib/input-format";

/* Which field this is — decides the icon, the autofill hint and the keyboard
   a phone opens. Placeholder alone is not a label: the input carries a real
   <label>, visually hidden so the layout stays the same. */
type FieldKind = "name" | "tel" | "church";

interface FieldProps {
  kind: FieldKind;
  /** Both the visible placeholder and the accessible name. */
  placeholder: string;
  value: string;
  error: string | null;
  onChange: (v: string) => void;
  /** Опційно: підпис для скрінрідера, якщо він має відрізнятись від плейсхолдера. */
  label?: string;
  /* Обов'язковий у наших формах рівно один рядок — номер, і позначає
     його зірочка в самому полі. Решту не підписуємо взагалі: приписка
     «необов'язково» біля кожного рядка робила з форми бланк. */
  required?: boolean;
  /** Що означає зірочка — для скрінрідера. */
  requiredLabel?: string;
}

const KIND = {
  name: { Icon: User, type: "text", autoComplete: "name", inputMode: undefined },
  tel: { Icon: Phone, type: "tel", autoComplete: "tel", inputMode: "tel" as const },
  /* Назва церкви — це назва організації: браузер підставляє її з тих самих
     збережених даних, що й у будь-якій формі «компанія». */
  church: { Icon: Church, type: "text", autoComplete: "organization", inputMode: undefined },
} satisfies Record<FieldKind, { Icon: typeof User; type: string; autoComplete: string; inputMode?: "tel" }>;

/* Оболонка поля: та сама рамка, наведення і фокус, що в однорядкового
   поля, але без висоти — нею користуються й текстове поле брифу, і рядок,
   у який складаються обрані бажання. */
export const FIELD_SHELL = cn(
  "field-shell flex flex-col gap-1.5 px-5 py-4 rounded-[14px] bg-surface border border-hairline transition-[border-color,box-shadow] duration-150 cursor-text",
  "[&:hover:not(:focus-within)]:border-hairline-strong [&:hover:not(:focus-within)]:shadow-[0px_1px_2px_rgba(0,0,0,0.06)]",
  "focus-within:border-[#007aff] focus-within:shadow-[0px_2px_4px_rgba(0,122,255,0.12)]"
);

/* Зірочка обов'язкового поля. Колір фірмовий, а не червоний: це не
   помилка, а позначка «без цього не обійдемось». Для скрінрідера поруч
   стоїть слово, бо саму зірочку він прочитає як «зірочка». */
export function RequiredMark({ label }: { label: string }) {
  return (
    <span className="shrink-0 leading-none text-[15px] font-semibold text-brand">
      <span aria-hidden>*</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* One-line text input, used by the demo modal and the church-brief form.
   Назву церкви питаємо окремим рядком — вона їде в картку окремим полем,
   а не тоне всередині розповіді про себе. */
export function Field({ kind, placeholder, value, error, onChange, label, required, requiredLabel }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const { Icon, type, autoComplete, inputMode } = KIND[kind];

  /* Поле переписує набране — маскою номера чи великою літерою, — тож
     каретку доводиться повертати самим. */
  const { ref: inputRef, at: caretRef } = useCaret<HTMLInputElement>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const pos = e.target.selectionStart ?? raw.length;
    if (kind === "tel") {
      const next = formatPhone(raw);
      caretRef.current = phoneCaret(raw, pos, next);
      onChange(next);
      return;
    }
    /* Регістр не змінює довжини рядка, тож каретка лишається там, де була. */
    caretRef.current = pos;
    onChange(capitalizeWords(raw));
  };

  /* Ім'я, набране з Caps Lock, випрямляємо, коли людина йде з поля: під час
     набору «ВІФА» ще не відрізнити від свідомо великих літер. */
  const handleBlur = () => {
    if (kind === "name" && value) onChange(normalizeName(value));
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "field-shell flex items-center gap-4 h-[52px] px-5 rounded-[14px] bg-surface border transition-[border-color,box-shadow] duration-150 cursor-text",
          "[&:hover:not(:focus-within)]:border-hairline-strong [&:hover:not(:focus-within)]:shadow-[0px_1px_2px_rgba(0,0,0,0.06)]",
          "focus-within:border-[#007aff] focus-within:shadow-[0px_2px_4px_rgba(0,122,255,0.12)]",
          error ? "border-[#c76a00]" : "border-hairline"
        )}
      >
        <Icon aria-hidden className="w-[18px] h-[18px] shrink-0 text-ink-3" strokeWidth={2} />
        <span className="sr-only">{label ?? placeholder}</span>
        <input
          ref={inputRef}
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          /* Код країни ставимо самі: людина дотикається поля — і вже має «+380»,
             далі набирає тільки свій номер. Валідатор і лід бачать повний
             номер, як і раніше. */
          onFocus={kind === "tel" && !value ? () => onChange(UA_PREFIX) : undefined}
          onChange={handleChange}
          onBlur={kind === "name" ? handleBlur : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="flex-1 min-w-0 text-[16px] text-ink/[0.88] placeholder:text-[#6f6f75] bg-transparent outline-none leading-[1.4] cursor-text"
        />
        {/* Зірочка стоїть у самому рядку: один знак поле не тисне. */}
        {required && <RequiredMark label={requiredLabel ?? ""} />}
      </label>
      {/* role="alert" — помилку має почути й той, хто не бачить поля. */}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-[#c76a00] leading-[1.4]">
          {error}
        </p>
      )}
    </div>
  );
}
