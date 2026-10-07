import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import CooperationStage, { CooperationOutro } from "@/components/sections/cooperation-stage";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { COOPERATION_COPY } from "@/content/cooperation";
import { NAV_LABELS } from "@/content/nav";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

const copy = COOPERATION_COPY.ua;

export const metadata: Metadata = pageMeta({
  title: copy.seoTitle,
  description: copy.seoDescription,
  path: "/cooperation",
  keywords: [
    "співпраця з Моєю Церквою",
    "система для об'єднання церков",
    "партнерство з впровадження системи в церкві",
    "амбасадор Моєї Церкви",
    "система для християнської організації",
    "облік учасників клубу",
    "система для біблійної школи",
    "інтеграція з церковною системою",
  ],
});

export default function CooperationPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: NAV_LABELS.cooperation.ua, path: "/cooperation" }]))} />
        <CooperationStage />
        {/* Замість <Cta /> «Запланувати зустріч» — розмова: сюди приходять
            не лише церкви, а й клуби, рухи, організації, навчальні заклади,
            консультанти й сервіси. */}
        <CooperationOutro />
      </main>
      <Footer />
    </>
  );
}
