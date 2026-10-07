"use client";

import { useEffect, useRef, useState } from "react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import { TgHeader, TgInline, TgKeyboard, TgMessage } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Телеграм на головній: той самий розкрій, що й у модулів — екран у
   кольоровій половині, назва одним словом у білій. Екран не
   вигаданий: рядки й кнопки беруться з `content/telegram.ts`, тобто
   з коду самого бота, і збігаються зі сторінкою /telegram.

   Інтеграції (Viber, календар) лишились у каталозі модулів — тут
   лише бот, бо саме ним церква користується щодня.
   ──────────────────────────────────────────────────────────────── */

const ACCENT = "#229ED9";

const TINT = `linear-gradient(140deg, color-mix(in oklab, ${ACCENT} 12%, var(--surface)) 0%, color-mix(in oklab, ${ACCENT} 5%, var(--surface)) 55%, var(--surface) 100%)`;

export default function Integrations() {
  const t = useT().integrations;
  const { lang } = useLang();
  const tg = TELEGRAM_COPY[lang];
  const hostRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  /* Екран оживає, коли доїхав у кадр; без анімації просто стоїть. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (!reduced) setOn(true);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Бот не стоїть мовчки: вітається, людина тисне кнопку меню — і він
     відповідає справжнім екраном із content/telegram.ts.

     Розмова накопичується, а не змінює одна одну: привітання лишається
     на місці, під ним лягає натиснута кнопка, потім відповідь. Раніше
     кожен крок стирав попередній, і півцикла екран стояв порожнім
     (2026-09-22: «погана візуалізація»). Без анімацій видно всю
     розмову одразу. */
  const ASK = tg.hero.phone.keyboard[0][1];
  const answer = tg.hero.phone.screens.find((x) => x.id === ASK);
  /* 0 — привітання, 1 — натиснули кнопку, 2 — бот друкує, 3 — відповідь. */
  const [step, setStep] = useState(3);

  useEffect(() => {
    if (!on || !answer) return;
    const timers: number[] = [];
    const run = () => {
      timers.push(window.setTimeout(() => setStep(0), 0));
      timers.push(window.setTimeout(() => setStep(1), 2600));
      timers.push(window.setTimeout(() => setStep(2), 3200));
      timers.push(window.setTimeout(() => setStep(3), 4100));
      timers.push(window.setTimeout(run, 11000));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [on, answer]);

  return (
    <section id="integrations" className="w-full flex flex-col items-center py-2.5 md:py-3 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          {/* Картка нікуди не веде: ні кліку, ні стрілки. */}
          <div
            style={
              {
                "--accent": ACCENT,
                "--accent-soft": `color-mix(in oklab, ${ACCENT} 12%, var(--surface))`,
                "--accent-line": `color-mix(in oklab, ${ACCENT} 32%, var(--surface))`,
              } as React.CSSProperties
            }
            className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div
              className="relative flex items-center justify-center min-h-[280px] md:min-h-[440px] p-4 md:p-7"
              style={{ background: TINT }}
            >
              <div
                ref={hostRef}
                className={cn(
                  /* Та сама ширина, що й у телефона нижче, — два екрани поспіль
                     не можуть бути різного розміру. */
                  "w-full max-w-[300px] rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]",
                  on && "mock-on"
                )}
              >
                {/* Головне меню бота — те саме, що бачить людина в себе:
                    привітання і кнопки з `content/telegram.ts`. Назву церкви
                    в шапці не пишемо: бот у кожної свій. */}
                <TgHeader title={t.bot.name} sub={tg.hero.phone.status} />
                {/* Висота вікна стала: повідомлення з'являються по черзі, і
                    з `min-height` картка підростала на кожному — увесь блок
                    смикався на очах. Тепер місце під найвищий стан чату
                    зарезервоване одразу, і нічого не рухається (2026-09-22). */}
                <div className="tg-wallpaper p-3.5 h-[268px] md:h-[304px] overflow-hidden flex flex-col items-start gap-2">
                  <TgMessage lines={tg.hero.phone.greeting} time={false} className="bubble-in max-w-full" />

                  {step >= 1 && (
                    <span className="tg-bubble-out bubble-in self-end max-w-[86%] rounded-[14px] rounded-br-[4px] px-3.5 py-2 text-[13.5px] text-ink leading-[1.35]">
                      {ASK}
                    </span>
                  )}

                  {step === 2 && (
                    <span className="tg-bubble bubble-in self-start rounded-[14px] rounded-bl-[4px] px-3.5 py-3 flex items-center gap-1.5">
                      <i className="tg-dot" />
                      <i className="tg-dot" />
                      <i className="tg-dot" />
                      <span className="sr-only">{tg.hero.phone.typing}</span>
                    </span>
                  )}

                  {/* Відповідь бота — з його ж кнопками: сам заголовок
                      «Мої групи (2)» без списку виглядав порожнім. */}
                  {step >= 3 && answer && (
                    <TgMessage lines={answer.lines} time={false} className="bubble-in max-w-full">
                      {answer.buttons && <TgInline rows={answer.buttons} className="pt-1.5" dense />}
                    </TgMessage>
                  )}
                </div>
                <TgKeyboard rows={tg.hero.phone.keyboard} className="mock-row" active={step >= 1 ? ASK : null} />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 p-7 md:p-10">
              <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
                {t.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              {/* Одне речення, як у решти блоків огляду: три цифри під назвою
                  («1 дотик», «45 розділів», «своє меню») були водою — все,
                  що вони описували, видно на екрані поруч. */}
              <p className="text-[16.5px] md:text-[18px] font-normal text-ink-2 leading-[1.5] max-w-[340px]">
                {t.text}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
