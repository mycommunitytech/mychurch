"use client";

import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

export default function ConsultingOffer() {
  const c = useT().consultingPage;

  return (
    <section id="offer" className="w-full flex flex-col items-center py-14 md:py-20 bg-page scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <div
            className="relative overflow-hidden rounded-[22px] md:rounded-[26px] border border-hairline flex flex-col md:flex-row md:items-center gap-4 md:gap-10 px-6 py-8 md:px-10 md:py-9"
            style={{ background: "linear-gradient(120deg, color-mix(in oklab, var(--brand) 10%, var(--surface)) 0%, var(--surface) 70%)" }}
          >
            <div
              aria-hidden
              className="aurora-a absolute -top-28 -left-16 w-[420px] h-[320px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
            />

            <div className="relative flex flex-col gap-2 flex-1">
              <h2 className="font-semibold text-ink text-[26px] md:text-[34px] leading-[1.12] tracking-[-0.8px] md:tracking-[-1.1px]">
                {c.offerTitle}
              </h2>
              <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.5]">{c.offerText}</p>
            </div>

            <span className="relative self-start md:self-auto shrink-0 inline-flex items-center rounded-full border border-brand/25 bg-brand-soft px-4 py-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-brand">
              {c.offerBadge}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
