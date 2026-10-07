"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import ChurchBriefScene, { type ScenePhase } from "@/components/sections/church-brief-scene";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

/* Знайомство: ліворуч — питання і план, праворуч — що саме ми робимо,
   показане, а не розказане: безлад церкви складається в один простір.

   Покрокову форму (роль, церква, бажання, номер) прибрано 2026-09-22:
   блок каже те, що мав сказати, і не бере з людини нічого. Заявку вона
   лишає там, де для цього є окрема дія, а не посеред розповіді.
   Копія форми лишилась у словнику (`brief.form`) і в історії git.

   Заголовок «Допоможемо організувати» (до 2026-09-25 — «Давайте ми вам
   послужимо?», відхилено: воно про нас, а не про церкву; до 2026-09-30 —
   «Наведемо лад за 7 днів», строки прибрано, а «…у вашій церкві» —
   «не пиши так»). Кнопка
   «Хочу порядок» відлунює його й відкриває вікно заявки. Посилання на /consulting
   тут стояло до 2026-09-22: людина казала «так» і йшла читати сторінку.
   Номер поруч теж прибрано того ж дня — у блоці лишається одна дія.

   Ліва половина до 2026-09-25 була порожньою підкладкою з самим
   заголовком — «не подобається, як це виглядає». Тепер там сцена
   «безлад → порядок» (church-brief-scene.tsx), а план іде з нею в такт:
   поки клаптики летять у вікно, горить «Перенесення», коли в шапці
   з'являється команда — «Навчання». */

/* Коли настає кожна фаза, від миті, як сцена доїхала до екрана. Перші
   півтори секунди — чистий безлад: його треба встигнути роздивитись. */
const TIMELINE: [ScenePhase, number][] = [
  ["gather", 1500],
  ["team", 3500],
  ["done", 4800],
];

type StepState = "idle" | "active" | "done";

function stepState(i: number, phase: ScenePhase): StepState {
  if (i === 0) return phase === "gather" ? "active" : phase === "team" || phase === "done" ? "done" : "idle";
  return phase === "team" ? "active" : phase === "done" ? "done" : "idle";
}

export default function ChurchBrief() {
  const t = useT();
  const b = t.brief;
  const { open } = useDemoModal();
  const stageRef = useRef<HTMLDivElement>(null);
  /* `order` — складена картинка: її віддає сервер, і на ній сцена
     лишається для тих, кому рух заважає. */
  const [phase, setPhase] = useState<ScenePhase>("order");

  /* Сцена грає щоразу, коли до неї догортали: вийшла з екрана — знову
     безлад, повернулась — знову складається. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || prefersReducedMotion()) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let running = false;
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
      running = false;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          if (running) return;
          running = true;
          setPhase("chaos");
          timers = TIMELINE.map(([p, ms]) => setTimeout(() => setPhase(p), ms));
        } else if (!entry.isIntersecting) {
          stop();
          setPhase("chaos");
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, []);

  /* Лінія між кроками наливається, коли перенесення завершено. */
  const lineFull = phase === "order" || phase === "team" || phase === "done";

  return (
    <section id="brief" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <div className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="min-w-0 p-7 pb-6 md:p-10 md:pb-8 lg:pb-0 lg:self-end font-semibold text-ink text-[32px] sm:text-[42px] md:text-[52px] lg:text-[42px] xl:text-[52px] leading-[1.02] tracking-[-1px] md:tracking-[-1.6px]">
              {b.title}
              {b.titleAccent && <> <span className="text-brand whitespace-nowrap">{b.titleAccent}</span></>}
            </h2>

            {/* На телефоні сцена стоїть між питанням і планом, на широкому
                екрані — праворуч на всю висоту картки. */}
            <div
              ref={stageRef}
              className="relative min-w-0 flex items-center overflow-hidden px-2 py-6 sm:px-6 md:p-8 border-y lg:border-y-0 lg:border-l border-hairline lg:col-start-2 lg:row-start-1 lg:row-span-2"
              style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--brand) 9%, var(--surface)) 0%, var(--surface-2) 100%)" }}
            >
              <div
                aria-hidden
                className="aurora-a absolute -top-32 -left-24 w-[380px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
              />
              <ChurchBriefScene phase={phase} />
            </div>

            <div className="min-w-0 p-7 md:p-10 lg:pt-9 lg:self-start">
              <ol className="relative flex flex-col">
                {b.serve.map((item, i) => {
                  const st = stepState(i, phase);
                  return (
                    <li key={item.title} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      {/* Лінія тягнеться від кроку до кроку — саме вона
                          робить із рядків смугу часу, а не перелік. */}
                      {i < b.serve.length - 1 && (
                        <span
                          aria-hidden
                          className="absolute left-[15px] top-[34px] bottom-0 w-[2px] rounded-full overflow-hidden"
                          style={{ background: "color-mix(in oklab, var(--brand) 14%, transparent)" }}
                        >
                          <span
                            className="absolute inset-0 origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,0.84,0.44,1)]"
                            style={{
                              background: "linear-gradient(to bottom, color-mix(in oklab, var(--brand) 60%, transparent), color-mix(in oklab, var(--brand) 25%, transparent))",
                              transform: lineFull ? "none" : "scaleY(0)",
                            }}
                          />
                        </span>
                      )}
                      <span
                        aria-hidden
                        className="relative z-10 w-[32px] h-[32px] rounded-full shrink-0 flex items-center justify-center bg-brand text-white text-[13.5px] font-semibold tabular-nums leading-none shadow-[0_6px_16px_-8px_color-mix(in_oklab,var(--brand)_90%,transparent)]"
                      >
                        {st === "active" && <span className="pulse-ring absolute inset-0 rounded-full bg-brand" />}
                        {st === "done" ? (
                          <Check
                            key="done"
                            className="relative w-4 h-4"
                            strokeWidth={3}
                            style={{ animation: "sparkleIn 0.45s var(--ease-pop) both" }}
                          />
                        ) : (
                          <span className="relative">{i + 1}</span>
                        )}
                      </span>
                      <span className="flex flex-1 flex-col gap-1.5 min-w-0 pt-[2px]">
                        {/* Лише назва етапу: плашку строку поруч прибрано
                            2026-09-30 — терміни в цьому блоці не називаємо. */}
                        <span
                          className={`text-[17px] md:text-[19px] font-semibold leading-[1.2] tracking-[-0.4px] transition-colors duration-300 ${st === "active" ? "text-brand" : "text-ink"}`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[14px] md:text-[15px] text-ink-2 leading-[1.45]">
                          {item.text}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* Одна дія — і більше нічого. */}
              <div className="flex pt-7 md:pt-8">
                <button
                  type="button"
                  onClick={open}
                  data-track="cta"
                  data-place="бриф"
                  className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-7 rounded-full overflow-hidden"
                >
                  <span className="relative font-semibold text-base text-white tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                    {b.how}
                  </span>
                  <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
