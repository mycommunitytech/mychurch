"use client";

import { Compass, Lightbulb, Rocket, LifeBuoy, ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

const STAGE_ICONS = [Compass, Lightbulb, Rocket, LifeBuoy];

export default function ConsultingProcess() {
  const c = useT().consultingPage;

  return (
    <section id="process" className="w-full flex flex-col items-center py-16 md:py-24 bg-page scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-16">
        <SectionHeading
          align="left"
          eyebrow={c.processEyebrow}
          title={c.processTitle}
        />

        <div className="flex flex-col">
          {c.stages.map((stage, i) => {
            const Icon = STAGE_ICONS[i] ?? Compass;
            const last = i === c.stages.length - 1;
            return (
              <FadeIn key={stage.title} delay={i} variant="left">
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3 md:gap-10">
                  {/* Rail label */}
                  <div className="flex md:flex-col md:items-end items-center gap-3 md:gap-1.5 md:text-right md:pt-0.5">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-[13.5px] text-ink-3 leading-[1.3]">{stage.when}</span>
                  </div>

                  {/* Stage body */}
                  <div
                    className={[
                      "relative ml-5 md:ml-0 pl-7 md:pl-10 border-l",
                      last ? "border-transparent pb-0" : "border-hairline-strong pb-10 md:pb-14",
                    ].join(" ")}
                  >
                    <span className="absolute -left-[19px] md:-left-[21px] top-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-surface border border-hairline shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)] flex items-center justify-center text-brand">
                      <Icon className="w-[19px] h-[19px] md:w-5 md:h-5" strokeWidth={2} />
                    </span>

                    <div className="flex flex-col gap-4 pt-0.5 md:pt-1">
                      <h3 className="font-semibold text-ink text-[20px] md:text-[24px] leading-[1.25] tracking-[-0.5px]">
                        {stage.title}
                      </h3>

                      <ul className="flex flex-col gap-2">
                        {stage.does.map((d) => (
                          <li key={d} className="flex items-start gap-2.5">
                            <span aria-hidden className="mt-[9px] w-1.5 h-1.5 rounded-full bg-brand/60 shrink-0" />
                            <span className="text-[15px] text-ink leading-[1.5]">{d}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="inline-flex self-start items-center gap-2 flex-wrap rounded-full border border-hairline bg-surface pl-3 pr-4 py-2">
                        <ArrowRight className="w-[14px] h-[14px] text-brand shrink-0" strokeWidth={2.5} />
                        <span className="text-[13px] text-ink-3 leading-[1.3]">{c.resultLabel}:</span>
                        <span className="text-[13.5px] font-medium text-ink leading-[1.3]">{stage.result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
