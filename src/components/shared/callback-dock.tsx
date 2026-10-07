"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/lang";
import { Field } from "@/components/shared/form-field";
import { validatePhone } from "@/lib/validate";
import { sendLead, type LeadState } from "@/lib/lead";
import { track } from "@/lib/analytics/client";
import LeadFallback from "@/components/shared/lead-fallback";

/* ────────────────────────────────────────────────────────────────
   Слухавка в кутку: «Ми вам перетелефонуємо».

   Модалка демо питає три речі — і це правильно там, де людина вже
   вирішила подивитись систему. Але той, хто просто читає сторінку,
   часто готовий лише на одне: лишити номер. Для нього тут рівно одне
   поле й одна кнопка, а заявка їде тим самим шляхом (lead.php → CRM,
   Telegram, пошта), тільки з позначкою «callback»: менеджер бачить,
   що людина чекає на дзвінок, а не на демо.

   Над героєм слухавка не висить — з'являється після першого екрана,
   коли людина справді почала читати. Кнопка «нагору» піднімається над
   нею через `--dock-lift`, а смуга читання статті підіймає обидві
   через `--float-lift`.
   ──────────────────────────────────────────────────────────────── */

/* Наскільки кнопка «нагору» відступає, щоб стати над слухавкою. */
const LIFT = "64px";

/** Скільки відстоїть картка від низу: спільна формула всіх плаваючих кнопок. */
const BOTTOM = "calc(max(1rem, env(safe-area-inset-bottom)) + var(--float-lift, 0px))";

export default function CallbackDock() {
  const t = useT();
  const c = t.callback;

  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  /* Пастка для ботів: поле поза екраном і поза табом. */
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LeadState>("idle");

  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  /* Той самий засув, що й у модалці: подвійний клік не має слати двічі. */
  const sendingRef = useRef(false);
  const startedRef = useRef(false);
  const titleId = useId();

  /* Кнопка «нагору» має знати, що під нею стоїть слухавка. */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--dock-lift", LIFT);
    return () => {
      root.style.removeProperty("--dock-lift");
    };
  }, []);

  /* Над героєм не висимо: слухавка виїжджає, коли перший екран позаду. */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen((was) => {
      if (was) track("modal_close", { source: "callback" });
      return false;
    });
  }, []);

  /* Escape і клік повз картку — картка не модальна, сторінка під нею жива,
     тож підкладки немає і фокус ми не замикаємо. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cardRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, close]);

  /* Картку відкрили — курсор одразу в поле. На телефоні цього не робимо:
     клавіатура виїхала б поверх самої картки. */
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    const id = setTimeout(() => {
      inputRef.current?.querySelector<HTMLInputElement>('input[type="tel"]')?.focus();
    }, 220);
    return () => clearTimeout(id);
  }, [open]);

  /* Закрили — повертаємо форму в початковий стан, але вже після того,
     як картка поїхала, щоб текст не блимав дорогою. */
  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      sendingRef.current = false;
      startedRef.current = false;
      setPhone("");
      setCompany("");
      setError(null);
      setState("idle");
    }, 220);
    return () => clearTimeout(id);
  }, [open]);

  const toggle = useCallback(() => {
    setOpen((was) => {
      track(was ? "modal_close" : "modal_open", { source: "callback" });
      return !was;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (sendingRef.current || state === "sending") return;
      const pe = validatePhone(phone, t.modal.errors);
      setError(pe);
      if (pe) {
        track("form_error", { source: "callback", field: "телефон", error: pe });
        inputRef.current?.querySelector<HTMLInputElement>('input[type="tel"]')?.focus();
        return;
      }
      sendingRef.current = true;
      setState("sending");
      track("form_submit", { source: "callback" });
      try {
        /* Ім'я не питаємо зовсім — приймач підпише картку номером. */
        const ok = await sendLead({ name: "", phone, company, source: "callback" });
        track(ok ? "lead" : "lead_failed", { source: "callback" });
        setState(ok ? "sent" : "failed");
      } finally {
        sendingRef.current = false;
      }
    },
    [phone, company, state, t.modal.errors]
  );

  /* Схована слухавка не ловить ані Tab, ані читачку екрана. */
  const hidden = !shown && !open;

  return (
    <div
      className={cn(
        /* z-30 — той самий поверх, що й кнопка «нагору»: слухавка має ховатись
           під модалками (z-50) і під шухлядою меню (z-40), а не лежати поверх них. */
        "fixed right-4 md:right-8 z-30 transition-[opacity,transform] duration-300",
        hidden ? "opacity-0 translate-y-3 invisible" : "opacity-100 translate-y-0 visible"
      )}
      style={{ bottom: BOTTOM }}
    >
      {/* Картка стоїть над слухавкою і притиснута до того ж краю. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        className={cn(
          "absolute bottom-full right-0 mb-3 w-[320px] max-w-[calc(100vw-2rem)]",
          "origin-bottom-right rounded-[20px] border border-hairline-strong bg-surface",
          "px-5 py-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]",
          "transition-[opacity,transform] duration-200",
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
        )}
      >
        {state === "sent" ? (
          <div role="status" className="flex flex-col items-center gap-3 py-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0063d1]">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d="M7 16.5L13 22.5L25 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span id={titleId} className="text-[17px] font-semibold text-ink leading-[1.3]">
              {c.successTitle}
            </span>
            <span className="text-[14px] text-ink-2 leading-[1.5]">{c.successText}</span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5 pr-1">
              <h2 id={titleId} className="text-[19px] font-semibold text-ink leading-[1.25] tracking-[-0.4px]">
                {c.title}
              </h2>
              <p className="text-[14px] text-ink-2 leading-[1.5]">{c.text}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3">
              <div ref={inputRef}>
                <Field
                  kind="tel"
                  placeholder={c.phonePlaceholder}
                  value={phone}
                  error={error}
                  required
                  requiredLabel={t.modal.required}
                  onChange={(v) => {
                    setPhone(v);
                    if (!startedRef.current) {
                      startedRef.current = true;
                      track("form_start", { source: "callback", field: "телефон" });
                    }
                    if (error) setError(validatePhone(v, t.modal.errors));
                  }}
                />
              </div>

              <input
                type="text"
                name="hp_extra"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="absolute h-px w-px -left-[9999px] opacity-0"
              />

              {/* Після невдачі кнопка стає тихою: головне тепер — контакти нижче. */}
              <button
                type="submit"
                disabled={state === "sending"}
                className={cn(
                  "group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full disabled:opacity-70",
                  state === "failed" ? "btn-secondary border border-hairline-strong" : "btn-primary btn-brand"
                )}
              >
                {state === "failed" && (
                  <span className="btn-secondary-bg absolute inset-0 rounded-full bg-surface transition-colors duration-150" />
                )}
                <span
                  className={cn(
                    "relative text-[15px] font-semibold leading-[1.4] tracking-[-0.3px]",
                    state === "failed" ? "text-ink-2" : "text-white"
                  )}
                >
                  {state === "sending" ? c.sending : state === "failed" ? c.retry : c.submit}
                </span>
              </button>

              {state === "failed" && (
                <LeadFallback source="callback" title={c.failedTitle} text={c.failedText} name="" phone={phone} />
              )}

              <p className="text-center text-[11.5px] leading-[1.5] text-ink-3">
                {c.consentPrefix}{" "}
                <Link href="/privacy" className="font-medium text-ink-2 underline-offset-2 hover:underline">
                  {c.consentPrivacy}
                </Link>
                .
              </p>
            </form>
          </>
        )}
      </div>

      {/* Сама слухавка. Відкрита картка перетворює її на «закрити». */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? c.close : c.open}
        title={open ? c.close : c.open}
        tabIndex={hidden ? -1 : 0}
        className="btn-primary btn-brand relative flex h-12 w-12 items-center justify-center rounded-full md:h-[52px] md:w-[52px]"
      >
        <Phone
          className={cn(
            "absolute h-[19px] w-[19px] transition-[opacity,transform] duration-200",
            open ? "opacity-0 scale-75" : "opacity-100 scale-100"
          )}
          strokeWidth={2}
        />
        <X
          className={cn(
            "absolute h-[19px] w-[19px] transition-[opacity,transform] duration-200",
            open ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
