"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useCalendly } from "@/context/calendly-context";
import { useT } from "@/lib/lang";
import { SITE_CALENDLY, SITE_TELEGRAM } from "@/lib/seo";

/* This panel is intentionally dark in both themes — it is the one high-contrast
   moment on the page, so the white/blue values here are deliberate.
   `rollout` folds the consulting steps into the same block: the home page closes
   with one panel instead of a consulting card followed by the same promise. */
export default function Cta({ rollout = false }: { rollout?: boolean }) {
  const { open } = useDemoModal();
  const t = useT();

  return (
    <section
      id={rollout ? "consulting" : undefined}
      className="w-full flex flex-col items-center px-5 md:px-8 py-12 sm:py-16 md:py-24 bg-page scroll-mt-24"
    >
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[40px] px-5 py-9 sm:px-8 sm:py-12 md:px-14 md:py-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ background: "linear-gradient(115deg, #0a1f3d 0%, #06356e 52%, #0b4f9e 100%)" }}
          />
          <div
            aria-hidden
            className="aurora-a absolute -top-[260px] -left-[120px] w-[720px] h-[520px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(0,122,255,0.55), transparent 100%)" }}
          />
          <div
            aria-hidden
            className="aurora-b absolute -bottom-[220px] -right-[140px] w-[620px] h-[460px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(140,194,255,0.30), transparent 100%)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(ellipse 70% 70% at 22% 25%, black 8%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 22% 25%, black 8%, transparent 78%)",
            }}
          />

          {/* Один розкрій на всіх сторінках: запрошення і дві дії. Плашка,
              речення й кроки впровадження прибрані (2026-09-21). */}
          <div className="flex flex-col items-center text-center gap-7 sm:gap-8">
            {/* Два речення розведені: питання — тихий рядок згори, а
                запрошення стоїть заголовком. Раніше вони були одного
                кегля й читались як суцільний абзац. */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <span className="text-[15px] sm:text-[17px] font-medium text-[#8cc2ff] leading-[1.35]">
                {t.cta.title}
              </span>
              <h2 className="font-semibold text-white text-[30px] sm:text-[40px] md:text-[54px] leading-[1.05] tracking-[-1px] md:tracking-[-2px] max-w-[820px]">
                {t.cta.titleAccent}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
              <Actions open={open} t={t} />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function Actions({ open, t }: { open: () => void; t: ReturnType<typeof useT> }) {
  const { open: openCalendly } = useCalendly();

  /* Тихий лінк поруч із запрошенням. Заголовок кличе на зустріч — тож коли
     є календар (NEXT_PUBLIC_CALENDLY_URL), другою дією стає «обрати час»,
     а Telegram лишається в шапці, футері й запасних каналах. Без календаря
     тут, як і раніше, «Написати». Посилання справжнє: середня кнопка миші
     відкриє календар у новій вкладці, звичайний клік — у нашому вікні. */
  const quiet = SITE_CALENDLY
    ? {
        href: SITE_CALENDLY,
        label: t.calendly.action,
        Icon: CalendarDays,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          openCalendly({ source: "cta" });
        },
      }
    : { href: SITE_TELEGRAM, label: t.cta.telegram, Icon: Send, onClick: undefined };

  return (
    <>
      <button
        onClick={open}
        data-track="cta"
        data-place="фінальний блок"
        className="btn-primary group relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
      >
        <span className="absolute inset-0 bg-white rounded-full" />
        <span className="relative text-[#06356e] font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
          {t.cta.action}
        </span>
        <ArrowRight className="relative w-[17px] h-[17px] text-[#06356e] transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>

      <Link
        href={quiet.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={quiet.onClick}
        className="relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors duration-200 hover:bg-white/12"
      >
        <quiet.Icon className="w-[16px] h-[16px] text-white/80" />
        <span className="text-white font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
          {quiet.label}
        </span>
      </Link>
    </>
  );
}
