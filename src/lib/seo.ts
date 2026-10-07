import type { Metadata } from "next";

/* ────────────────────────────────────────────────────────────────
   Один спільний шар SEO для всіх сторінок.

   Кожна сторінка викликає `pageMeta()` — так канонічна адреса,
   Open Graph і Twitter-картка збираються однаково й нічого не
   губиться при додаванні нових розділів.
   ──────────────────────────────────────────────────────────────── */

/** Продакшн-домен. Переозначається через NEXT_PUBLIC_SITE_URL (прев'ю, стейджинг). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mychurch.com.ua").replace(/\/+$/, "");

/* Бренд в усіх метаданих — українською: саме «Моя Церква» шукають церкви,
   і саме цю назву ми реєструємо. Латинка лишається лише як alternateName —
   нею нас знаходять ті, хто бачив логотип у застосунку. */
export const SITE_NAME = "Моя Церква";
/** Латинське написання — для структурованих даних (alternateName). */
export const SITE_NAME_LATIN = "My Church";
export const SITE_EMAIL = "team@mychurch.com.ua";
export const SITE_PHONE = "+380965297375";
/** Той самий номер, як його читає людина: пишемо його в блоках, де номер видно. */
export const SITE_PHONE_LABEL = "+380 96 529 73 75";

/** Юзернейм у Telegram — без «@». Показуємо його як контакт поруч із поштою й телефоном. */
export const SITE_TELEGRAM_HANDLE = "mychurch_team";

/** Усі кнопки «Написати в Telegram» читають цю константу — правити в одному місці.

    Порожній рядок у .env — це «не задано», а не «порожня адреса». З `??`
    він проходив далі, і кнопка їхала в збірку як href="" — тобто вела на
    саму себе. Тому тут `||`, а не `??`. */
export const SITE_TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || `https://t.me/${SITE_TELEGRAM_HANDLE}`;

/** Календар зустрічей (Calendly): сторінка або тип події, наприклад
    https://calendly.com/mychurch/demo. Її читають усі входи «Обрати час
    зустрічі» — тихий лінк у закривашці, кнопка після заявки в модалці
    демо і рядок у контактах футера — і відкривають у власному вікні,
    а не на сайті Calendly (src/components/shared/calendly-modal.tsx).

    Порожньо — календаря немає: жоден із цих входів не рендериться, у
    закривашці лишається Telegram. Тому в збірку без адреси нічого
    мертвого не їде. Адресу без схеми доповнюємо https://. */
export const SITE_CALENDLY = (() => {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
})();

/** Загальний опис продукту — дефолт для сторінок без свого тексту, а також
    опис організації та сайту в структурованих даних.

    Формулювання навмисно однакове з описом головної: назва — категорія —
    що робить. Пошук і ШІ-відповіді переказують саме таке речення, і воно
    має звучати однаково скрізь, де його читає машина, — інакше опис
    виглядає непевним і його не беруть. «Система управління церквою» тут
    замість «простору» тому, що це слово, яким категорію шукають. */
export const SITE_DESCRIPTION =
  "«Моя Церква» — українська система управління церквою: облік членів і сімей, малі групи, служіння, події, відвідуваність, заявки й аналітика в одному місці.";

/** Ключові запити, за якими церкви шукають таку систему. */
export const SITE_KEYWORDS = [
  "система управління церквою",
  "програма для церкви",
  "облік членів церкви",
  "церковна CRM",
  "ChMS українською",
  "облік відвідуваності в церкві",
  "малі групи облік",
  "планування служінь",
  "церковна аналітика",
  "My Church",
  "Моя Церква",
];

/* Картинка для соцмереж — генерується з src/app/opengraph-image.tsx.
   Її доводиться додавати в кожну сторінку явно: сторінка, яка задає свій
   `openGraph`, повністю перекриває батьківський, разом із картинкою.

   Адреса обовʼязково закінчується на «.png». Next кладе згенерований
   файл без розширення, і краулери месенджерів (Telegram, Viber,
   WhatsApp) таку картинку просто пропускають — у стрічці лишається
   голе посилання. Копію з розширенням робить `scripts/og-png.mjs`
   одразу після збірки; стара адреса теж лишається живою. */
export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const OG_IMAGE: OgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Моя Церква — єдиний простір для вашої церкви",
};

/* `trailingSlash: true` у next.config: канонічна адреса сторінки завжди
   зі слешем на кінці. Карта сайту мусить вести туди ж — інакше кожен її
   рядок це зайвий 301, а пошук бачить дві адреси однієї сторінки.
   Файли (/sitemap.xml, /opengraph-image.png) слеша не отримують. */
export function absoluteUrl(path = "/") {
  const clean = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  return `${SITE_URL}${clean.endsWith("/") || isFile ? clean : `${clean}/`}`;
}

/* Абсолютна адреса + `og:image:type`: краулер бачить, що це саме PNG,
   ще до того, як почне його качати. */
export function ogImage(image: OgImage) {
  return {
    url: absoluteUrl(image.url),
    secureUrl: absoluteUrl(image.url),
    type: "image/png",
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

/* Картка Twitter читає лише адресу й опис картинки — решту полів
   з `ogImage()` вона б винесла в <head> зайвими тегами. */
export function twitterImage(image: OgImage) {
  return { url: absoluteUrl(image.url), alt: image.alt };
}

interface PageMetaInput {
  /** <title> цієї сторінки — повний, разом із брендом. */
  title: string;
  /** 120–165 символів, з ключовим запитом на початку. */
  description: string;
  /** Шлях від кореня: "/blog", "/modules/people". */
  path: string;
  /** Додаткові запити саме цієї сторінки. */
  keywords?: string[];
  /** "article" для статей блогу, інакше "website". */
  type?: "website" | "article";
  /** Дати для статей — у форматі YYYY-MM-DD. */
  publishedTime?: string;
  modifiedTime?: string;
  /** Сторінку не пускаємо в пошук, але посилання з неї лишаються живими:
      index: false + follow: true — інакше ми б обрізали власну перелінковку. */
  noIndex?: boolean;
  /** Своя картинка для соцмереж. За замовчуванням — спільна `OG_IMAGE`. */
  image?: OgImage;
}

/** Повний набір метатегів для сторінки: canonical + Open Graph + Twitter. */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
  image = OG_IMAGE,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords?.length ? [...keywords, ...SITE_KEYWORDS.slice(0, 4)] : undefined,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: true } } : null),
    openGraph: {
      type: type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "uk_UA",
      alternateLocale: ["en_US"],
      images: [ogImage(image)],
      ...(type === "article" ? { publishedTime, modifiedTime } : null),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage(image)],
    },
  };
}
