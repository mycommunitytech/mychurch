import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import TelegramHero from "@/components/sections/telegram-hero";
import TelegramBlocks from "@/components/sections/telegram-blocks";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { TELEGRAM_COPY } from "@/content/telegram";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: TELEGRAM_COPY.ua.seoTitle,
  description: TELEGRAM_COPY.ua.seoDescription,
  path: "/telegram",
  keywords: ["Telegram-бот для церкви", "бот для малої групи", "відмітка явки в телеграмі"],
});

export default function TelegramPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Бот", path: "/telegram" }]))} />
        <TelegramHero />
        <TelegramBlocks />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
