"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownToLine, Check } from "lucide-react";
import { Field } from "@/components/shared/form-field";
import LeadFallback from "@/components/shared/lead-fallback";
import { PLAN_COPY, PLAN_FILE, PLAN_FILE_NAME } from "@/content/plan";
import { track } from "@/lib/analytics/client";
import { useLang, useT } from "@/lib/lang";
import { sendLead, type LeadState } from "@/lib/lead";
import { validatePhone } from "@/lib/validate";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Куди надіслати» — форма матеріалу.

   Одне питання і одна кнопка: питаємо рівно те, без чого план
   нікуди не надішлеш. Ім'я й назву церкви не питаємо взагалі —
   за файл не торгуються.

   Файл віддаємо в обох випадках: і коли заявка доїхала, і коли
   ні. Людина свою частину зробила, а те, що в нас не працює
   приймач, — не її проблема. Тому після відповіді сервера
   завантаження стартує саме, а поруч лишається кнопка: у Safari
   програмний клік після очікування спрацьовує не завжди.
   ──────────────────────────────────────────────────────────────── */

export default function MaterialForm({
  /** "card" — біла картка в шапці; "band" — широка смуга наприкінці. */
  variant = "card",
  className,
  /** Звідки натиснули: лишається в аналітиці поруч із заявкою. */
  place,
}: {
  variant?: "card" | "band";
  className?: string;
  place: string;
}) {
  const { lang } = useLang();
  const dict = useT();
  const t = PLAN_COPY[lang].form;

  const [phone, setPhone] = useState("");
  /* Пастка для ботів: поле поза екраном і поза табом. */
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LeadState>("idle");

  const startedRef = useRef(false);
  /* Засув від подвійної відправки: два кліки встигають до перемальовки. */
  const sendingRef = useRef(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const download = useCallback(
    (how: "auto" | "hand") => {
      track("material_download", { material: "plan-30", how, place });
      if (how === "auto") linkRef.current?.click();
    },
    [place]
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (sendingRef.current || state === "sending") return;

      const bad = validatePhone(phone, dict.modal.errors);
      setError(bad);
      if (bad) {
        track("form_error", { source: "material", field: "телефон", error: bad });
        (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('input[type="tel"]')?.focus();
        return;
      }

      sendingRef.current = true;
      setState("sending");
      track("form_submit", { source: "material", place });
      try {
        const ok = await sendLead({ name: "", phone, company, source: "material" });
        track(ok ? "lead" : "lead_failed", { source: "material", place });
        setState(ok ? "sent" : "failed");
        download("auto");
      } finally {
        sendingRef.current = false;
      }
    },
    [phone, company, state, dict.modal.errors, download, place]
  );

  const band = variant === "band";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[20px] border border-hairline bg-surface p-6 sm:p-7",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        band && "sm:p-9",
        className
      )}
    >
      {/* Посилання на файл живе в розмітці завжди: програмний клік по
          ньому — це звичайне завантаження, а не спливне вікно, яке
          браузер міг би заблокувати. */}
      <a
        ref={linkRef}
        href={PLAN_FILE}
        download={PLAN_FILE_NAME[lang]}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      >
        {t.download}
      </a>

      {state === "sent" || state === "failed" ? (
        <div className="flex flex-col gap-5">
          {state === "sent" && (
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-[18px] w-[18px]" strokeWidth={2.6} />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[19px] font-semibold text-ink leading-[1.25] tracking-[-0.4px]">
                  {t.sentTitle}
                </span>
                <span className="text-[14.5px] text-ink-2 leading-[1.5]">{t.sentText}</span>
              </div>
            </div>
          )}

          <a
            href={PLAN_FILE}
            download={PLAN_FILE_NAME[lang]}
            onClick={() => download("hand")}
            className="btn-primary btn-brand group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7"
          >
            <ArrowDownToLine className="relative h-[17px] w-[17px] text-white" strokeWidth={2.2} />
            <span className="relative text-[16px] font-semibold tracking-[-0.32px] leading-[1.4] text-white">
              {t.download}
            </span>
          </a>

          {state === "failed" && (
            <LeadFallback
              source="material"
              title={t.failedTitle}
              text={t.failedText}
              name=""
              phone={phone}
            />
          )}
        </div>
      ) : (
        <>
          {/* У смузі наприкінці сторінки заголовок і речення вже сказала
              сама секція — форма не повторює їх удруге. */}
          {!band && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[22px] sm:text-[24px] font-semibold text-ink leading-[1.2] tracking-[-0.6px]">
                {t.title}
              </h2>
              <p className="text-[14.5px] text-ink-2 leading-[1.5]">{t.text}</p>
            </div>
          )}

          <form onSubmit={submit} noValidate className="flex flex-col gap-3">
            <div className={cn("flex flex-col gap-3", band && "sm:flex-row sm:items-start")}>
              <div className={cn("flex flex-col", band && "sm:flex-1")}>
                <Field
                  kind="tel"
                  placeholder={t.placeholder}
                  label={t.label}
                  value={phone}
                  error={error}
                  required
                  requiredLabel={t.required}
                  onChange={(v) => {
                    setPhone(v);
                    if (!startedRef.current) {
                      startedRef.current = true;
                      track("form_start", { source: "material", place });
                    }
                    if (error) setError(validatePhone(v, dict.modal.errors));
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={state === "sending"}
                data-track="material"
                data-place={place}
                className={cn(
                  "btn-primary btn-brand group relative flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-full px-8 disabled:opacity-70",
                  band && "sm:w-auto"
                )}
              >
                <span className="relative text-[16px] font-semibold tracking-[-0.32px] leading-[1.4] text-white whitespace-nowrap">
                  {state === "sending" ? t.sending : t.submit}
                </span>
              </button>
            </div>

            <input
              type="text"
              name="hp_extra"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />

            <p className="text-[12px] text-ink-3 leading-[1.5]">
              {t.consent}{" "}
              <Link href="/terms" className="font-medium hover:underline underline-offset-2">
                {dict.modal.consentTerms}
              </Link>{" "}
              {dict.modal.consentAnd}{" "}
              <Link href="/privacy" className="font-medium hover:underline underline-offset-2">
                {dict.modal.consentPrivacy}
              </Link>
              .
            </p>
          </form>
        </>
      )}
    </div>
  );
}
