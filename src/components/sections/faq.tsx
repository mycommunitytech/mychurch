"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { SITE_EMAIL, SITE_TELEGRAM } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────
   Питання та відповіді.

   Сторінка лишається документом: рубрика заголовком, під
   нею рядки питань. Але відповідь тепер розгортається по кліку
   (2026-09-22): стіна з розкритих відповідей не давала знайти своє
   питання очима. Згорнута відповідь залишається в розмітці (висота
   0fr, а не display:none), тож пошуковик бачить весь текст.
   Ідіома та сама, що в QaCard на сторінках модулів.
   ──────────────────────────────────────────────────────────── */

/* Один рядок: питання і плюс, відповідь виїжджає знизу. */
function Row({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="group w-full text-left border-b border-hairline py-5 md:py-6 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:rounded-[10px]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[16.5px] md:text-[18px] font-semibold text-ink leading-[1.35] tracking-[-0.25px] group-hover:text-brand transition-colors duration-150">
          {question}
        </h3>
        <span
          className="shrink-0 w-6 h-6 rounded-full bg-surface-3 border border-hairline flex items-center justify-center text-ink-2 mt-[1px] transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.24s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p className="mt-3 text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.6] max-w-[620px]">{answer}</p>
        </div>
      </div>
    </button>
  );
}

export default function Faq() {
  const t = useT().faq;
  const common = useT().common;

  return (
    <div className="w-full bg-page">
      {/* Шапка: заголовок і один рядок. Ряд чипів із рубриками прибрано —
          ті самі назви стоять заголовками нижче. */}
      <section className="relative w-full bg-surface pt-14 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-[1120px] mx-auto px-5 md:px-8 flex flex-col items-center gap-8 text-center">
          <FadeIn className="flex flex-col items-center gap-4">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
            <h1 className="font-semibold text-ink text-[36px] md:text-[56px] leading-[1.1] tracking-[-1.1px] md:tracking-[-1.8px]">
              {t.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{t.text}</p>
          </FadeIn>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-page pointer-events-none" />
      </section>

      <div className="w-full max-w-[1000px] mx-auto px-5 md:px-8 py-12 md:py-16 flex flex-col gap-12 md:gap-16">
        {t.categories.map((category, ci) => (
          <section key={category.title} className="flex flex-col">
            <FadeIn className="flex items-baseline gap-3 pb-4">
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] tabular-nums text-ink-3">
                {`0${ci + 1}`}
              </span>
              <h2 className="text-[22px] md:text-[28px] font-semibold text-ink leading-[1.15] tracking-[-0.6px]">
                {category.title}
              </h2>
            </FadeIn>

            {/* Відповідь схована за плюсом — список питань читається
                одним поглядом. Перше питання першої рубрики відкрите:
                показує, що рядки розгортаються. */}
            <div className="flex flex-col border-t border-hairline">
              {category.items.map((item, i) => (
                <FadeIn key={item.id} delay={i}>
                  <Row question={item.question} answer={item.answer} defaultOpen={ci === 0 && i === 0} />
                </FadeIn>
              ))}
            </div>

          </section>
        ))}

        {/* Не знайшли відповідь — смуга, а не ще одна картка. */}
        <FadeIn className="border-t border-hairline pt-8 md:pt-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-ink text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.5px]">
              {t.stillQuestions}
            </h2>
            <p className="text-[15.5px] text-ink-2 leading-[1.5]">{t.stillQuestionsText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <Link
              href={SITE_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 px-6 rounded-full overflow-hidden"
            >
              <Send className="relative w-4 h-4 text-white" strokeWidth={2.2} />
              <span className="relative text-white font-semibold text-[15px] tracking-[-0.3px] whitespace-nowrap">
                {common.telegram}
              </span>
            </Link>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="group inline-flex items-center gap-1.5 text-[15px] text-ink-3 hover:text-ink transition-colors whitespace-nowrap"
            >
              {SITE_EMAIL}
              <ArrowUpRight className="w-4 h-4 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
