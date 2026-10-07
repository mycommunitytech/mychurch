import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import AboutHero from "@/components/sections/about-hero";
import AboutStory from "@/components/sections/about-story";
import AboutMission from "@/components/sections/about-mission";
import AboutWhyMy from "@/components/sections/about-why-my";
import AboutAmbassadors from "@/components/sections/about-ambassadors";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Про «Мою Церкву» — команда, місія і навіщо ми це робимо",
  description:
    "Ми будуємо простір для тих, хто будує церкву: історія «Моєї Церкви», наше бачення й місія та церква-амбасадор, з якою ми працюємо.",
  path: "/about",
  keywords: ["про «Мою Церкву»", "команда «Моєї Церкви»", "бачення", "місія", "українська система для церкви"],
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Про нас", path: "/about" }]))} />
        <AboutHero />
        <AboutStory />
        <AboutMission />
        <AboutWhyMy />
        <AboutAmbassadors />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
