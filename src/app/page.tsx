import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import Capabilities from "@/components/sections/capabilities";
import Features from "@/components/sections/features";
import Automations from "@/components/sections/automations";
import ForWhom from "@/components/sections/for-whom";
import Pocket from "@/components/sections/pocket";
import Customization from "@/components/sections/customization";
import Integrations from "@/components/sections/integrations";
import Proof from "@/components/sections/proof";
import ReviewsPanel from "@/components/sections/reviews-panel";
import ChurchBrief from "@/components/sections/church-brief";
import CooperationTeaser from "@/components/sections/cooperation-teaser";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { graph, softwareSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  /* Заголовок головної — єдиний рядок, який пошук показує за брендовим
     запитом. «Єдиний простір для церкви» не містив ні назви, ні того, що
     це за продукт: за «моя церква» сніпет не впізнавали, за «система
     управління церквою» сторінка не мала чим збігтись. Тут стоїть той
     самий рядок, що й дефолт у layout.tsx — назва плюс категорія. */
  title: "Моя Церква — система управління церквою українською",
  /* Опис пишемо як визначення, а не як перелік переваг: «Моя Церква» — це
     [категорія], яка робить [що]. Саме таке речення пошук і ШІ-відповіді
     переказують, коли їх питають, які системи для церкви існують; опис,
     що починається з переліку, переказати нічим. */
  description:
    "«Моя Церква» — українська система управління церквою: облік членів і сімей, малі групи, служіння, події, відвідуваність, заявки й аналітика в одному місці.",
  path: "/",
  keywords: [
    "система управління церквою",
    "програма для церкви",
    "облік членів церкви",
    "облік відвідуваності в церкві",
    "малі групи облік",
  ],
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="lazy-sections flex flex-col items-center bg-page">
        <JsonLd data={graph(softwareSchema())} />
        <Hero />
        {/* Справжня церква з її промо-фільмом — одразу під першим екраном
            (2026-09-30, «може це промо на верх підняти?»): до того блок
            стояв сьомим, після «Для кого», і фільм мало хто догортав. */}
        <Proof />
        <Features />
        {/* Телеграм і телефон одразу після огляду: більшість церков живе в
            чаті, тож показуємо це раніше за все інше. */}
        <Integrations />
        <Pocket />
        <Automations />
        {/* Кастомізація — остання в огляді (2026-09-30): та сама система
            перебудовується з великої церкви на малу й назад. */}
        <Customization />
        {/* Переписка з асистентом поки не на головній: сам помічник ще не
            в руках у церков, тож не обіцяємо його першим екраном. Блок цілий
            у components/sections/assistant.tsx — повернути = вписати рядок
            назад. Повна сторінка лишається за /ai. */}
        <ForWhom />
        {/* Відгуки — темна панель із записом, двійник закривашки. */}
        <ReviewsPanel />
        {/* «Було — стало» знято з головної 2026-09-21: той самий вибір
            болів тепер стоїть чипами всередині форми знайомства нижче.
            Компонент живий у components/sections/solved.tsx. */}
        <Cta rollout />
        {/* «Допоможемо організувати» — над каталогом модулів (2026-10-07,
            «перенеси вище над блок Все в одному місці»; з 2026-09-23 стояв
            під ним, останнім). Той самий блок, що й на /modules; форми в
            ньому немає з 2026-09-22. */}
        <ChurchBrief />
        {/* Каталог модулів — це вже не аргумент, а довідка про широту
            системи для тих, хто догортав. */}
        <Capabilities />
        {/* Тонка смуга на /cooperation — останньою (2026-10-07, «якось
            акуратно»): головна говорить із церквою, а сюди догортають
            об'єднання, клуби, рухи, школи й партнери. */}
        <CooperationTeaser />
      </main>
      <Footer />
    </>
  );
}
