import type { Lang } from "@/lib/i18n";
import { SITE_TELEGRAM, SITE_TELEGRAM_HANDLE } from "@/lib/seo";

/* ────────────────────────────────────────────────────────────────
   Copy for /support — сторінка підтримки.

   Тут немає нових обіцянок: усе, що на сторінці, вже сказано в
   іншому місці сайту, і має збігатися з ним дослівно за змістом.
     • канали й контакти ....... sections/footer.tsx
     • час відповіді ........... i18n → faq.stillQuestionsText
     • бекапи, ЄС, оновлення ... i18n → faq.categories (Системні, Технічні)
     • етап «Супровід» ......... i18n → consultingPage.stages[3]
   Якщо міняється щось там — міняємо і тут.

   Кроки обробки звернення не переказуємо словами: їх показує
   переписка в flow.chat — той самий шлях, але видно, як він
   виглядає насправді.
   ──────────────────────────────────────────────────────────────── */

/** Канал зв'язку: чим є, для чого, коли відповідаємо. */
export interface SupportChannel {
  id: string;
  name: string;
  /** Адреса або підпис під назвою — те, що людина бачить і копіює. */
  handle: string;
  href?: string;
  text: string;
  when: string;
}

/** Репліка в переписці з підтримкою. */
export interface SupportTurn {
  /** `you` — пише церква, `us` — відповідає підтримка. */
  from: "you" | "us";
  at: string;
  text: string;
  /** Крок обробки, який видно саме в цій репліці. Без нього — просто репліка. */
  step?: string;
}

/** Рядок блоку «про що можна не турбуватись». */
export interface SupportFact {
  title: string;
  text: string;
}

export interface SupportLink {
  label: string;
  text: string;
  href: string;
}

export interface SupportCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    ctaSecondary: string;
    note: string;
    facts: { value: string; label: string }[];
  };

  channels: {
    eyebrow: string;
    title: string;
    text: string;
    whenLabel: string;
    items: SupportChannel[];
  };

  flow: {
    eyebrow: string;
    title: string;
    text: string;
    chat: {
      /** Назва чату в шапці — це ми, а не вигадана людина з іменем. */
      title: string;
      status: string;
      placeholder: string;
      /** Підпис під вікном: що це за кадр. */
      caption: string;
      turns: SupportTurn[];
    };
  };

  care: {
    eyebrow: string;
    title: string;
    text: string;
    items: SupportFact[];
    /** Три місця, де відповідь уже є, — рядком під панеллю. */
    selfText: string;
    selfLinks: SupportLink[];
  };
}

const TELEGRAM_HREF = SITE_TELEGRAM;
const TELEGRAM_HANDLE = `@${SITE_TELEGRAM_HANDLE}`;
const MAIL = "team@mychurch.com.ua";
const PHONE = "+380 96 529 73 75";
const PHONE_HREF = "tel:+380965297375";

const ua: SupportCopy = {
  navLabel: "Підтримка",
  seoTitle: "Підтримка — Моя Церква",
  seoDescription:
    "Підтримка «Моєї Церкви»: телеграм, пошта і телефон, відповідь протягом дня, окремий канал для вашої команди, щоденні резервні копії та щотижневі оновлення.",

  hero: {
    eyebrow: "Підтримка",
    title: "Ви не лишаєтесь сам на сам із системою",
    lead: "Запуск, перенесення даних і перше навчання ми проходимо разом з вашою командою — і лишаємось поруч далі. Пишете у зручний канал, відповідає людина, яка знає вашу церкву.",
    cta: "Написати в телеграм",
    ctaSecondary: "Написати на пошту",
    note: "Без тікетів і номерів звернень. Просто напишіть, що сталось.",
    facts: [
      { value: "швидка", label: "відповідь на звернення" },
      { value: "до 7 днів", label: "запуск з нашою участю" },
      { value: "щотижня", label: "оновлення платформи" },
    ],
  },

  channels: {
    eyebrow: "Куди писати",
    title: "Чотири канали — і жодного автовідповідача",
    text: "Усі ведуть до тієї самої команди, яка налаштовувала вашу систему.",
    whenLabel: "Коли відповідаємо",
    items: [
      {
        id: "telegram",
        name: "Телеграм",
        handle: TELEGRAM_HANDLE,
        href: TELEGRAM_HREF,
        text: "Найшвидший канал: питання по ходу дня, скріншот або голосове.",
        when: "Протягом робочого дня",
      },
      {
        id: "mail",
        name: "Пошта",
        handle: MAIL,
        href: `mailto:${MAIL}`,
        text: "Коли варто зафіксувати текстом: вивантаження, документи, доступи.",
        when: "Протягом дня",
      },
      {
        id: "phone",
        name: "Телефон",
        handle: PHONE,
        href: PHONE_HREF,
        text: "Коли щось стало перед служінням і швидше пояснити голосом.",
        when: "Пн–Пт, 9:00–18:00",
      },
      {
        id: "team",
        name: "Спільний чат із вашою командою",
        handle: "окремий канал",
        text: "Ваші адміністратори, лідери і ми. Лишається й після запуску.",
        when: "Створюємо під час впровадження",
      },
    ],
  },

  flow: {
    eyebrow: "Як це працює",
    title: "Що відбувається після вашого повідомлення",
    text: "Оформлювати нічого не потрібно — достатньо описати своїми словами. Далі це наша робота.",
    chat: {
      title: "Моя Церква · підтримка",
      status: "у мережі",
      placeholder: "Повідомлення",
      caption: "Звичайне звернення: від питання зранку до перевірки за тиждень.",
      turns: [
        {
          from: "you",
          at: "09:41",
          step: "Ви пишете",
          text: "Допоможіть обрати автоматизацію.",
        },
        {
          from: "us",
          at: "09:47",
          step: "Уточнюємо",
          text: "Що забирає найбільше часу?",
        },
        {
          from: "you",
          at: "09:52",
          text: "Нагадування лідерам про звіти.",
        },
        {
          from: "us",
          at: "10:05",
          step: "Налаштовуємо",
          text: "Увімкнули — тепер бот нагадує сам.",
        },
        {
          from: "us",
          at: "за тиждень",
          step: "Повертаємось",
          text: "Усі звіти зайшли без нагадувань.",
        },
      ],
    },
  },

  care: {
    eyebrow: "Надійність",
    title: "Про що можна не турбуватись",
    text: "Частина роботи підтримки відбувається без вашої участі — і про неї варто знати заздалегідь.",
    items: [
      {
        title: "Щоденні резервні копії",
        text: "Копіювання відбувається автоматично щодня, без вашої участі.",
      },
      {
        title: "Дані в ЄС",
        text: "Зберігання на серверах у Європейському Союзі з шифруванням AES-256, передача захищена TLS.",
      },
      {
        title: "Оновлення без простою",
        text: "Нове з'являється саме собою — без зупинок і переустановок. Про великі зміни попереджаємо заздалегідь.",
      },
      {
        title: "Дані лишаються вашими",
        text: "Повний експорт у CSV або Excel доступний будь-коли. Після скасування підписки дані не зникають того ж дня — встигнете все забрати.",
      },
    ],
    selfText: "Часто відповідь знаходиться швидше — ось три місця, де вже є пояснення.",
    selfLinks: [
      { label: "Питання і відповіді", text: "Комунікація, техніка, безпека даних", href: "/faq" },
      { label: "Телеграм-бот", text: "Що бачить кожна роль і як це виглядає в чаті", href: "/telegram" },
      { label: "Консалтинг", text: "Аудит процесів, впровадження, навчання команди", href: "/consulting" },
    ],
  },
};

const en: SupportCopy = {
  navLabel: "Support",
  seoTitle: "Support — My Church",
  seoDescription:
    "My Church support: Telegram, email and phone, a reply within the day, a shared channel for your team, daily backups and weekly updates.",

  hero: {
    eyebrow: "Support",
    title: "You are never left alone with the system",
    lead: "We go through launch, data migration and the first training together with your team — and stay around afterwards. Write to whichever channel suits you; the person who answers knows your church.",
    cta: "Message us on Telegram",
    ctaSecondary: "Send an email",
    note: "No tickets, no reference numbers. Just tell us what happened.",
    facts: [
      { value: "fast", label: "reply to any request" },
      { value: "up to 7 days", label: "launch with us alongside" },
      { value: "weekly", label: "platform updates" },
    ],
  },

  channels: {
    eyebrow: "Where to write",
    title: "Four channels — and not a single auto-reply",
    text: "They all reach the same team that set your system up.",
    whenLabel: "When we reply",
    items: [
      {
        id: "telegram",
        name: "Telegram",
        handle: TELEGRAM_HANDLE,
        href: TELEGRAM_HREF,
        text: "The fastest channel: questions as the day goes, a screenshot or a voice note.",
        when: "Within the working day",
      },
      {
        id: "mail",
        name: "Email",
        handle: MAIL,
        href: `mailto:${MAIL}`,
        text: "For anything worth putting in writing: exports, documents, access rights.",
        when: "Within the day",
      },
      {
        id: "phone",
        name: "Phone",
        handle: PHONE,
        href: PHONE_HREF,
        text: "For when something breaks right before a service and talking is faster.",
        when: "Mon–Fri, 9:00–18:00",
      },
      {
        id: "team",
        name: "A shared chat with your team",
        handle: "a channel of your own",
        text: "Your admins, your leaders and us. It stays after launch too.",
        when: "Opened during rollout",
      },
    ],
  },

  flow: {
    eyebrow: "How it works",
    title: "What happens after your message",
    text: "Nothing needs to be formatted — describing it in your own words is enough. The rest is our job.",
    chat: {
      title: "My Church · support",
      status: "online",
      placeholder: "Message",
      caption: "An ordinary request: from the morning question to a check a week later.",
      turns: [
        {
          from: "you",
          at: "09:41",
          step: "You write",
          text: "Help us pick an automation.",
        },
        {
          from: "us",
          at: "09:47",
          step: "We ask",
          text: "What takes up the most time?",
        },
        {
          from: "you",
          at: "09:52",
          text: "Reminding leaders about reports.",
        },
        {
          from: "us",
          at: "10:05",
          step: "We set it up",
          text: "Done — the bot reminds them now.",
        },
        {
          from: "us",
          at: "a week later",
          step: "We come back",
          text: "Every report came in without a nudge.",
        },
      ],
    },
  },

  care: {
    eyebrow: "Reliability",
    title: "Things you don't have to think about",
    text: "Part of what support does happens without you — and it is worth knowing about in advance.",
    items: [
      {
        title: "Daily backups",
        text: "Backups run automatically every day, with nothing for you to do.",
      },
      {
        title: "Data in the EU",
        text: "Stored on servers in the European Union with AES-256 encryption; transfer is protected by TLS.",
      },
      {
        title: "Updates without downtime",
        text: "New things simply appear — no stops, no reinstalling. We announce larger changes in advance.",
      },
      {
        title: "The data stays yours",
        text: "A full export to CSV or Excel is available at any time. After a cancellation the data doesn't vanish the same day — there is time to take it all.",
      },
    ],
    selfText: "Often the answer is quicker to find — three places that already explain it.",
    selfLinks: [
      { label: "Questions and answers", text: "Communication, technology, data safety", href: "/faq" },
      { label: "Telegram bot", text: "What each role sees and how it looks in the chat", href: "/telegram" },
      { label: "Consulting", text: "Process audit, rollout, training for the team", href: "/consulting" },
    ],
  },
};

export const SUPPORT_COPY: Record<Lang, SupportCopy> = { ua, en };
