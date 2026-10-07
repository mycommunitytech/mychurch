"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ChurchScene from "@/components/shared/church-scene";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { LEAD_AMBASSADOR, LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Одна справжня церква — однією сценою. Зверху сама громада: її знак
   на світлій панелі (сам знак темно-зелений і на нашій темній підкладці
   зник би), її власний рядок про себе, жива крапка «працює зараз» і дві
   дороги — на її сторінку і на її сайт. Під волосяною лінією — голоси:
   велика цитата того, хто зараз говорить, і чотири обличчя, серед яких
   його видно.

   Чого тут більше немає (2026-09-22): ім'я церкви капсом у заголовку,
   рядок «знак + назва + місто» під відео, промо-ролик на всю ширину і
   розрізана картка «фото + Про церкву». Кожне з них показувало ту саму
   церкву ще раз — а говорити в цьому розділі мають люди.

   Промо повернулось 2026-09-30, коли церква виклала власний фільм
   («MyChurch Promo», `church.promo`), — але не окремим плеєром, а
   кнопкою посеред кадрів громади, під якою беззвучно крутиться шматок
   того ж фільму. Грає у своєму вікні (VideoLightbox), бо сцена не 16:9
   і під склом кнопки. Сама сцена — shared/church-scene.tsx: та сама
   стоїть у шапці сторінки церкви, тут відрізняються лише кнопки.

   Цифр тут немає: скільки людей, облікових записів чи груп церква
   тримає в системі — не нам публікувати.
   ──────────────────────────────────────────────────────────────── */

export default function Proof() {
  const t = useT().proof;
  const church = LEAD_AMBASSADOR;

  return (
    <section id="proof" className="w-full flex flex-col items-center pt-16 md:pt-24 pb-2 md:pb-4 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading
          title={
            <span className="block uppercase text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
              {t.title} <span className="text-brand">{t.titleAccent}</span>
            </span>
          }
        />

        <FadeIn variant="scale">
          <ChurchScene
            church={church}
            source="home"
            actions={
              <>
                <Link
                  href={LEAD_AMBASSADOR_HREF}
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                  style={{ background: church.accent }}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={church.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline group inline-flex items-center gap-1.5 text-[14.5px] font-medium text-white/80 transition-colors hover:text-white"
                >
                  {t.siteCta}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </>
            }
          />
          {/* Рейка облич із відгуками знята з головної 2026-09-22: ряд
              кружечків із відео не читався преміально. Компонент цілий
              у components/shared/voice-bubbles.tsx — повернути означає
              вписати під сцену VoiceBubbles із accent церкви, під
              заголовком proof.voices.title зі словника. Самі записи
              лишились на сторінці громади. */}
        </FadeIn>
      </div>
    </section>
  );
}
