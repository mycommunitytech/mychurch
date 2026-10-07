import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import PricingPage from "@/components/sections/pricing-page";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { PRICING_COPY } from "@/content/pricing";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: PRICING_COPY.ua.seoTitle,
  description: PRICING_COPY.ua.seoDescription,
  path: "/pricing",
  keywords: [
    "скільки коштує система для церкви",
    "вартість ChMS українською",
    "ціна програми для церкви",
  ],
});

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Вартість", path: "/pricing" }]))} />
        <PricingPage />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
