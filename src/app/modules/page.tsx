import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import ModulesGrid, { type CatalogMocks } from "@/components/sections/modules-grid";
import ChurchBrief from "@/components/sections/church-brief";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { MODULE_DETAILS } from "@/content/modules";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Модулі для церкви — люди, групи, служіння, події, аналітика",
  description:
    "Усі модулі «Моєї Церкви»: облік людей і сімей, малі групи, служіння та графіки, події, заявки, адміністрація, інтеграції, Telegram-бот і ШІ-помічник. Вмикайте лише потрібне.",
  path: "/modules",
  keywords: ["модулі для церкви", "облік людей у церкві", "малі групи", "планування служінь", "церковна аналітика"],
});

/* Каталогу потрібні лише екрани модулів — не весь текст сторінок (той
   важить пів мегабайта), тож вибираємо їх тут, на сервері. */
const MOCKS: CatalogMocks = Object.fromEntries(
  MODULE_DETAILS.map((m) => [m.id, { ua: m.copy.ua.mock, en: m.copy.en.mock }])
);

export default function ModulesPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Модулі", path: "/modules" }]))} />
        {/* Шапка сторінки знята 2026-09-22 разом із карткою людини, яка під
            нею стояла: лишався екран із самим гаслом. Тепер сторінка
            починається з каталогу — він і є те, по що сюди приходять.
            Компоненти живі: components/sections/modules-hero.tsx і
            components/sections/modules-map.tsx. */}
        <ModulesGrid mocks={MOCKS} />
        {/* Конструктор («Зберіть свою систему») знято зі сторінки 2026-09-21
            на прохання користувача. Компонент живий у
            components/sections/module-builder.tsx — повернути = вписати
            <ModuleBuilder /> назад сюди, обгорнувши його <BuilderProvider>:
            провайдер потрібен саме йому, і більше нікому. Набір із нього
            відкриває вікно демо з обраними бажаннями (2026-09-22). */}
        <ChurchBrief />
      </main>
      <Footer />
    </>
  );
}
