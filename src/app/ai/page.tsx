import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import AiHero from "@/components/sections/ai-hero";
import AiScenarios from "@/components/sections/ai-scenarios";
import AiChatWatcher from "@/components/sections/ai-chat-watcher";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "ШІ-помічник для церкви — асистент у Telegram і застосунку",
  description:
    "Помічник знає базу вашої церкви: знаходить тих, хто зник, збирає зміну на неділю, бронює зали й нагадує тим, хто не відповів. Ви лише підтверджуєте.",
  path: "/ai",
  keywords: ["ШІ-помічник для церкви", "асистент у Telegram", "автоматизація церкви", "розумний помічник лідера"],
});

export default function AiPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "ШІ-помічник", path: "/ai" }]))} />
        <AiHero />
        <AiScenarios />
        <AiChatWatcher />
        {/* «Натисніть — і побачите, як він відповідає» знято 2026-09-21:
            після сценаріїв і живої переписки вище це був третій чат поспіль.
            Компонент цілий у components/sections/ai-try-it.tsx. */}
        {/* «Ім'я і голос — ваші» знято 2026-09-22: налаштування асистента
            (ім'я, аватар, стиль, канали) — це вже інтерфейс продукту, а не
            розповідь про нього, і на сторінці воно ставало четвертим вікном
            із чатом поспіль. Компонент цілий у components/sections/ai-persona.tsx. */}
        {/* «Робить багато. Але нічого — без вас» знято 2026-09-21: три
            картки з обіцянками довіри читались як текст про текст, а
            «після вашого "так"» уже стоїть у першому ж реченні сторінки.
            Компонент цілий у components/sections/ai-trust.tsx. */}
        <Cta />
      </main>
      <Footer />
    </>
  );
}
