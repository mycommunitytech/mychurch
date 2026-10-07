"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ChurchScene from "@/components/shared/church-scene";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { getAmbassador, hasAmbassadorPage } from "@/content/ambassadors";
import { useT } from "@/lib/lang";

/* Амбасадор на /about — тією самою сценою, що в блоці `proof` на головній
   і в шапці сторінки церкви (`shared/church-scene.tsx`): позаду петля з її
   промо-фільму, посередині кнопка повного фільму, внизу скляна візитівка
   з великим знаком, містом і тим, скільки ми разом.

   До 2026-10-07 тут стояла картка «кадр + Про церкву + абзац»
   (`shared/ambassador-card.tsx`), того ж дня з промо на місці кадру.
   «Перероби, зроби цей модуль кращим» — знак церкви в картці не стояв
   зовсім, промо займало пів картки, а абзац повторював те, що видно в
   кадрі. Сцена — формат, який власник уже схвалив на сторінці церкви:
   «більше лого, менше води». Головна дія — сторінка церкви, її сайт
   лишається тихим лінком. */

export default function AboutAmbassadors() {
  const t = useT().about.ambassadors;
  const first = t.items[0];
  const church = first ? getAmbassador(first.id) : undefined;
  if (!first || !church) return null;
  const pageHref = hasAmbassadorPage(first.id) ? `/ambassadors/${first.id}` : undefined;

  return (
    <section className="w-full flex flex-col items-center bg-page py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <FadeIn variant="scale">
          <ChurchScene
            church={church}
            source="about"
            actions={
              <>
                {pageHref && (
                  <Link
                    href={pageHref}
                    className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                    style={{ background: church.accent }}
                  >
                    {t.profileCta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
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
        </FadeIn>
      </div>
    </section>
  );
}
