import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import PlanHero from "@/components/sections/plan-hero";
import PlanInside from "@/components/sections/plan-inside";
import PlanGet from "@/components/sections/plan-get";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { PLAN_COPY } from "@/content/plan";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

/* Метадані — українською, як і на решті сторінок сайту.

   Сторінка поки схована (`PLAN_LIVE = false` у src/content/nav.ts):
   на неї не веде ні меню, ні підвал, ні смуга під статтями, і її немає
   в карті сайту. Адреса лишається живою — щоб матеріал можна було
   доробляти й показувати за посиланням, — тож закриваємо її від
   індексації так само, як /pricing: інакше пошук знайде сторінку,
   якої ми ще не відкривали. */
export const metadata: Metadata = pageMeta({
  title: PLAN_COPY.ua.seoTitle,
  description: PLAN_COPY.ua.seoDescription,
  path: "/plan",
  keywords: PLAN_COPY.ua.seoKeywords,
  noIndex: true,
});

export default function PlanPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: PLAN_COPY.ua.navLabel, path: "/plan" }]))} />
        <PlanHero />
        <PlanInside />
        <PlanGet />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
