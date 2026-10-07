import { SITE_DESCRIPTION, SITE_EMAIL, SITE_NAME, SITE_NAME_LATIN, SITE_PHONE, SITE_TELEGRAM, SITE_URL, absoluteUrl } from "@/lib/seo";

/* ────────────────────────────────────────────────────────────────
   Структуровані дані (schema.org, JSON-LD).

   Тільки те, що справді є на сторінці: Google карає за розмітку,
   якої не видно людині. Ціни й рейтинги не вигадуємо.
   ──────────────────────────────────────────────────────────────── */

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/* Назву «Моя Церква» носить і мобільний застосунок ПЦУ (App Store,
   Google Play), і пошук та ШІ-помічники плутають нас із ним. Поле
   schema.org `disambiguatingDescription` існує саме для цього: одним
   реченням каже, котра це «Моя Церква». */
const DISAMBIGUATION =
  "Українська система обліку й організації церкви (mychurch.com.ua), а не мобільний застосунок «Моя Церква» Православної церкви України.";

/** Хто ми — один запис на весь сайт, решта схем посилається на нього по @id. */
export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_NAME_LATIN,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 256,
      height: 256,
    },
    description: SITE_DESCRIPTION,
    disambiguatingDescription: DISAMBIGUATION,
    slogan: "Досягай людей",
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    areaServed: "UA",
    sameAs: [SITE_TELEGRAM],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE_EMAIL,
        telephone: SITE_PHONE,
        availableLanguage: ["uk", "en"],
      },
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    alternateName: SITE_NAME_LATIN,
    description: SITE_DESCRIPTION,
    inLanguage: ["uk", "en"],
    publisher: { "@id": ORG_ID },
  };
}

/** Сам продукт — щоб пошук розумів, що це система для церкви, а не блог. */
export function softwareSchema(): Json {
  return {
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    alternateName: SITE_NAME_LATIN,
    url: absoluteUrl("/"),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Church Management Software",
    /* Тільки браузер: система адаптована під телефон, але окремого застосунку
       для iOS та Android ще немає — він у розробці (див. /terms, FAQ). */
    operatingSystem: "Web browser",
    inLanguage: "uk",
    description: SITE_DESCRIPTION,
    disambiguatingDescription: DISAMBIGUATION,
    publisher: { "@id": ORG_ID },
    featureList: [
      "Облік людей і сімей",
      "Малі групи та служіння",
      "Події та відвідуваність",
      "Заявки і звернення",
      "Планування недільного служіння",
      "Аналітика та звіти",
      "Імпорт даних з Excel і Google Таблиць",
      "ШІ-помічник і Telegram-бот",
    ],
  };
}

/** Хлібні крихти. Перший елемент — завжди головна. */
export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ-розмітка. Питання й відповіді мають бути видимі на сторінці. */
export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  published: string;
  modified?: string;
  keywords: string[];
  section: string;
  /** Приблизна кількість слів — Google любить цей сигнал у статтях. */
  wordCount?: number;
  /** Обкладинка статті 1200×630. Google хоче ≥1200px по ширині. */
  image?: { url: string; width: number; height: number };
}

export function articleSchema(a: ArticleSchemaInput): Json {
  const url = absoluteUrl(a.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: a.published,
    dateModified: a.modified ?? a.published,
    inLanguage: "uk",
    articleSection: a.section,
    keywords: a.keywords.join(", "),
    ...(a.wordCount ? { wordCount: a.wordCount } : null),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    image: a.image
      ? {
          "@type": "ImageObject",
          url: absoluteUrl(a.image.url),
          width: a.image.width,
          height: a.image.height,
        }
      : absoluteUrl("/logo.png"),
  };
}

/** Список статей на /blog — допомагає пошуку побачити всі матеріали одразу. */
export function blogSchema(posts: { title: string; path: string }[]): Json {
  return {
    "@type": "Blog",
    "@id": `${absoluteUrl("/blog")}#blog`,
    name: `Блог «${SITE_NAME}»`,
    url: absoluteUrl("/blog"),
    inLanguage: "uk",
    publisher: { "@id": ORG_ID },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(p.path),
    })),
  };
}

/** Кілька схем в одному <script> — так їх бачить і Google, і валідатор. */
export function graph(...nodes: Json[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Канал зв'язку для ContactPage — рівно той, що видно в блоці «Куди писати». */
export interface SupportContactPoint {
  contactType: string;
  email?: string;
  telephone?: string;
  url?: string;
  /** Дні й години — тільки там, де канал справді обмежений розкладом. */
  hours?: { days: string[]; opens: string; closes: string };
}

/** Сторінка підтримки: канали, години і мови — те саме, що й на екрані. */
export function contactPageSchema(a: {
  name: string;
  description: string;
  path: string;
  points: SupportContactPoint[];
}): Json {
  const url = absoluteUrl(a.path);
  return {
    "@type": "ContactPage",
    "@id": `${url}#contact`,
    name: a.name,
    description: a.description,
    url,
    inLanguage: "uk",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: {
      "@type": "Organization",
      "@id": ORG_ID,
      contactPoint: a.points.map((p) => ({
        "@type": "ContactPoint",
        contactType: p.contactType,
        availableLanguage: ["uk", "en"],
        areaServed: "UA",
        ...(p.email ? { email: p.email } : null),
        ...(p.telephone ? { telephone: p.telephone } : null),
        ...(p.url ? { url: p.url } : null),
        ...(p.hours
          ? {
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: p.hours.days,
                opens: p.hours.opens,
                closes: p.hours.closes,
              },
            }
          : null),
      })),
    },
  };
}
