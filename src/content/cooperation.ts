import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Copy for /cooperation — «Запрошуємо до співпраці».

   Адресати, кожен зі своїм блоком і екраном (2026-10-05):
     • об'єднання й союзи церков — це справжній продукт: окрема панель
       об'єднання в my-church-union-admin (дашборд, реєстр церков і
       пасторів, звіти за рік);
     • церкви-амбасадори — та сама програма, що й «Нове Життя»
       (src/content/ambassadors.ts): ранній доступ і голос у розвитку;
     • консультанти й партнери — етапи взяті з /consulting
       (i18n → consultingPage.stages), щоб партнер бачив той самий шлях;
     • навчальні заклади — модуль «Навчання» (курси, потоки, явка,
       сертифікати, src/content/modules/activities.ts → learning);
     • клуби, рухи й організації — ті самі простори, події й волонтери,
       що й у церкві, тільки для спільнот поза нею (додано на прохання
       власника того ж дня);
     • сервіси для інтеграції — до тих, що вже є в каталозі модулів
       (Telegram, Viber, TurboSMS, Google Calendar).
   Четвертий блок — «Команда» (розробка, дизайн, волонтерство) — знятий
   того ж дня: «це не треба». Сторінка кличе до співпраці, а не на роботу.

   Умов, яких ще немає (відсотки, ставки, строки), тут не обіцяємо:
   сторінка запрошує до розмови, а не продає програму.
   Церкви, люди й числа в екранах — вигадані, як і скрізь у демо.
   ──────────────────────────────────────────────────────────────── */

export type CooperationId =
  | "unions"
  | "ambassadors"
  | "clubs"
  | "movements"
  | "organizations"
  | "education"
  | "partners"
  | "integrations";

/** Що робить кнопка під адресатом. */
export type CooperationAction = "demo" | "telegram";

export interface CooperationAudience {
  id: CooperationId;
  name: string;
  /** Одне речення під назвою: кого кличемо і що з цього має адресат. */
  tagline: string;
  action: CooperationAction;
  cta: string;
  /** Підпис у шапці екрана. */
  screenTitle: string;
  /** Підпис поля назви у вікні заявки, якщо адресат — не церква. */
  orgPlaceholder?: string;
  /** З якого блоку заявка — їде в лід як «Побажання». Менеджер читає
      українською, тож для ліда завжди береться рядок з `ua`. */
  leadNote?: string;
}

export interface CooperationCopy {
  /** Формат чисел у екранах. */
  locale: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  text: string;
  audiences: CooperationAudience[];

  screens: {
    unions: {
      title: string;
      ofLabel: string;
      doneLabel: string;
      collected: string;
      waitingLabel: string;
      districts: { name: string; total: number; done: number }[];
      stats: { value: string; label: string }[];
    };
    ambassadors: {
      beta: string;
      feature: string;
      you: string;
      ask: string;
      steps: string[];
      us: string;
      reply: string;
      nowLabel: string;
      nowValue: string;
    };
    partners: {
      title: string;
      stages: string[];
      churches: string[];
    };
    clubs: {
      when: string;
      ofLabel: string;
      comingLabel: string;
      total: number;
      confirmed: number;
      final: number;
      reminder: string;
    };
    movements: {
      when: string;
      fromLabel: string;
      live: string;
      fresh: string;
      cities: { name: string; count: number }[];
      newcomers: string[];
    };
    organizations: {
      period: string;
      raisedLabel: string;
      ofLabel: string;
      currency: string;
      goal: number;
      facts: { value: string; label: string }[];
      report: string;
    };
    education: {
      stream: string;
      students: string[];
      facts: { value: string; label: string }[];
      certificatesLabel: string;
    };
    integrations: {
      /** {n} — скільки сервісів увімкнено, {total} — скільки всього. */
      title: string;
      services: { name: string; feeds: string }[];
      yours: { name: string; feeds: string; perk: string };
    };
  };

  outro: {
    title: string;
    text: string;
    telegram: string;
    /** Тема листа, з якою відкривається пошта. */
    mailSubject: string;
  };

  /** Схема-запрошення внизу головної (cooperation-teaser.tsx): заголовок
      і речення — ті самі, що в сторінки, тут лише підпис дії. */
  teaser: {
    cta: string;
  };
}

const ua: CooperationCopy = {
  locale: "uk-UA",
  seoTitle: "Співпраця з «Моєю Церквою» — об'єднання, клуби, рухи, школи",
  seoDescription:
    "Запрошуємо до співпраці об'єднання церков, амбасадорів, клуби, рухи, організації, навчальні заклади, консультантів і сервіси для інтеграції.",
  title: "Запрошуємо до співпраці",
  text: "Систему будуємо зсередини церкви — і шукаємо тих, хто піде цим шляхом разом.",

  audiences: [
    {
      id: "unions",
      name: "Об'єднання церков",
      tagline: "Союзи, обласні об'єднання, єпархії — усі церкви в одному огляді, а кожна веде своє.",
      action: "demo",
      cta: "Запланувати зустріч",
      screenTitle: "Панель об'єднання",
      orgPlaceholder: "Назва об'єднання",
      leadNote: "Співпраця · об'єднання церков",
    },
    {
      id: "ambassadors",
      name: "Амбасадори",
      tagline: "Церкви, які пробують нове першими і чиї потреби стають частиною системи.",
      action: "demo",
      cta: "Стати амбасадором",
      screenTitle: "Ранній доступ",
      leadNote: "Співпраця · хочуть стати амбасадором",
    },
    {
      id: "clubs",
      name: "Клуби",
      tagline: "Дитячі, підліткові, спортивні — кожен клуб зі своїми учасниками, зустрічами і явкою.",
      action: "demo",
      cta: "Запланувати зустріч",
      screenTitle: "Спортивний клуб",
      orgPlaceholder: "Назва клубу",
      leadNote: "Співпраця · клуб",
    },
    {
      id: "movements",
      name: "Рухи",
      tagline: "Молодіжні й служительські рухи — люди з різних церков і міст в одній системі.",
      action: "demo",
      cta: "Запланувати зустріч",
      screenTitle: "Форум руху",
      orgPlaceholder: "Назва руху",
      leadNote: "Співпраця · рух",
    },
    {
      id: "organizations",
      name: "Організації",
      tagline: "Місії, фонди, громадські організації — волонтери, проєкти і звіти в одному місці.",
      action: "demo",
      cta: "Запланувати зустріч",
      screenTitle: "Гуманітарний проєкт",
      orgPlaceholder: "Назва організації",
      leadNote: "Співпраця · організація",
    },
    {
      id: "education",
      name: "Навчальні заклади",
      tagline: "Семінарії, біблійні та християнські школи — курси, потоки, явка і сертифікати в одному місці.",
      action: "demo",
      cta: "Запланувати зустріч",
      screenTitle: "Біблійна школа",
      orgPlaceholder: "Назва навчального закладу",
      leadNote: "Співпраця · навчальний заклад",
    },
    {
      id: "partners",
      name: "Партнери",
      tagline: "Ведете церкви до порядку як консультант — система й наша команда стануть поруч.",
      action: "telegram",
      cta: "Написати в телеграм",
      screenTitle: "Ваші церкви",
    },
    {
      id: "integrations",
      name: "Інтеграції",
      tagline: "Платежі, розсилки, календарі — під'єднайте свій сервіс до системи, якою церкви користуються щодня.",
      action: "telegram",
      cta: "Написати в телеграм",
      screenTitle: "Інтеграції",
    },
  ],

  screens: {
    unions: {
      title: "Звіти церков за 2025 рік",
      ofLabel: "з",
      doneLabel: "церков здали звіт",
      collected: "Звіт зібрано",
      waitingLabel: "чекаємо",
      districts: [
        { name: "Центральний", total: 14, done: 12 },
        { name: "Північний", total: 11, done: 10 },
        { name: "Південний", total: 9, done: 8 },
        { name: "Західний", total: 8, done: 8 },
      ],
      stats: [
        { value: "3 870", label: "членів" },
        { value: "48", label: "пасторів" },
        { value: "214", label: "хрещень" },
      ],
    },
    ambassadors: {
      beta: "Бета · спершу в амбасадорів",
      feature: "Повторний візит",
      you: "Ваша церква",
      ask: "Хочемо бачити, хто з новеньких не прийшов удруге.",
      steps: ["Запит", "У роботі", "У вас"],
      us: "Команда «Моєї Церкви»",
      reply: "Готово — ви бачите це першими.",
      nowLabel: "Зараз амбасадор",
      nowValue: "«Нове Життя», Черкаси · 1,5 року",
    },
    partners: {
      /* {n} — скільки церков зараз на дошці: у петлі приходить нова. */
      title: "{n} церков",
      stages: ["Знайомство", "Рішення", "Впровадження", "Супровід"],
      churches: ["Віфанія", "Світло", "Еммануїл", "Благодать", "Спасіння", "Відродження", "Ковчег"],
    },
    clubs: {
      when: "Субота, 10:00 · стадіон",
      ofLabel: "з",
      comingLabel: "будуть на тренуванні",
      total: 24,
      confirmed: 15,
      final: 21,
      reminder: "Бот нагадав учасникам у Telegram",
    },
    movements: {
      when: "Реєстрація · 14–16 листопада",
      fromLabel: "учасників із 38 церков",
      live: "Реєстрація відкрита",
      fresh: "нова реєстрація",
      cities: [
        { name: "Київ", count: 412 },
        { name: "Львів", count: 286 },
        { name: "Харків", count: 198 },
        { name: "Одеса", count: 176 },
        { name: "Дніпро", count: 168 },
      ],
      newcomers: ["Олена · Львів", "Марко · Київ", "Софія · Одеса", "Андрій · Харків", "Ірина · Дніпро"],
    },
    organizations: {
      period: "Звіт для партнерів · жовтень",
      raisedLabel: "зібрано",
      ofLabel: "з",
      currency: "₴",
      goal: 500000,
      facts: [
        { value: "46", label: "волонтерів" },
        { value: "128", label: "родин отримали допомогу" },
        { value: "19", label: "виїздів" },
      ],
      report: "Звіт готовий — надіслати",
    },
    education: {
      stream: "Потік «Осінь» · 10 уроків",
      students: ["Олена", "Марко", "Софія", "Андрій", "Ірина", "Давид"],
      facts: [
        { value: "92%", label: "явка" },
        { value: "31 з 34", label: "домашніх здано" },
      ],
      /* Підпис із двокрапкою: «Сертифікатів: 1» не треба відмінювати за числом. */
      certificatesLabel: "Сертифікатів",
    },
    integrations: {
      title: "{n} з {total} підключено",
      services: [
        { name: "Telegram", feeds: "Бот, нагадування, явка" },
        { name: "Viber", feeds: "Розсилки й нагадування" },
        { name: "TurboSMS", feeds: "SMS тим, хто без месенджерів" },
        { name: "Google Calendar", feeds: "Розклад служінь" },
      ],
      yours: { name: "Ваш сервіс", feeds: "Платежі, облік, трансляції…", perk: "З'являється в каталозі інтеграцій" },
    },
  },

  outro: {
    title: "Напишіть нам",
    text: "Розкажіть, хто ви і що хочете будувати разом, — відповімо протягом дня.",
    telegram: "Написати в телеграм",
    mailSubject: "Співпраця",
  },

  teaser: {
    cta: "Детальніше",
  },
};

const en: CooperationCopy = {
  locale: "en-US",
  seoTitle: "Partner with MyChurch — unions, clubs, movements, schools",
  seoDescription:
    "We invite church unions, ambassadors, clubs, movements, organizations, schools, consultants and services that want to integrate.",
  title: "Let's build it together",
  text: "We build the system from inside the church — and look for people to walk this road with us.",

  audiences: [
    {
      id: "unions",
      name: "Church unions",
      tagline: "Unions, regional associations, dioceses — every church in one overview, each running its own.",
      action: "demo",
      cta: "Book a demo",
      screenTitle: "Union dashboard",
      orgPlaceholder: "Union name",
    },
    {
      id: "ambassadors",
      name: "Ambassadors",
      tagline: "Churches that try new things first — and whose needs shape the system.",
      action: "demo",
      cta: "Become an ambassador",
      screenTitle: "Early access",
    },
    {
      id: "clubs",
      name: "Clubs",
      tagline: "Kids, teens, sports — every club with its own members, meetings and attendance.",
      action: "demo",
      cta: "Book a demo",
      screenTitle: "Sports club",
      orgPlaceholder: "Club name",
    },
    {
      id: "movements",
      name: "Movements",
      tagline: "Youth and ministry movements — people from many churches and cities in one system.",
      action: "demo",
      cta: "Book a demo",
      screenTitle: "Movement forum",
      orgPlaceholder: "Movement name",
    },
    {
      id: "organizations",
      name: "Organizations",
      tagline: "Missions, foundations, nonprofits — volunteers, projects and reports in one place.",
      action: "demo",
      cta: "Book a demo",
      screenTitle: "Relief project",
      orgPlaceholder: "Organization name",
    },
    {
      id: "education",
      name: "Schools",
      tagline: "Seminaries, Bible and Christian schools — courses, cohorts, attendance and certificates in one place.",
      action: "demo",
      cta: "Book a demo",
      screenTitle: "Bible school",
      orgPlaceholder: "School name",
    },
    {
      id: "partners",
      name: "Partners",
      tagline: "You bring churches to order as a consultant — the system and our team stand behind you.",
      action: "telegram",
      cta: "Message on Telegram",
      screenTitle: "Your churches",
    },
    {
      id: "integrations",
      name: "Integrations",
      tagline: "Payments, messaging, calendars — plug your service into the system churches use every day.",
      action: "telegram",
      cta: "Message on Telegram",
      screenTitle: "Integrations",
    },
  ],

  screens: {
    unions: {
      title: "Church reports for 2025",
      ofLabel: "of",
      doneLabel: "churches reported",
      collected: "Report complete",
      waitingLabel: "waiting",
      districts: [
        { name: "Central", total: 14, done: 12 },
        { name: "North", total: 11, done: 10 },
        { name: "South", total: 9, done: 8 },
        { name: "West", total: 8, done: 8 },
      ],
      stats: [
        { value: "3,870", label: "members" },
        { value: "48", label: "pastors" },
        { value: "214", label: "baptisms" },
      ],
    },
    ambassadors: {
      beta: "Beta · ambassadors first",
      feature: "Second visit",
      you: "Your church",
      ask: "We want to see which newcomers never came back a second time.",
      steps: ["Request", "In progress", "Live for you"],
      us: "MyChurch team",
      reply: "Done — you're the first to see it.",
      nowLabel: "Ambassador today",
      nowValue: "New Life, Cherkasy · 1.5 years",
    },
    partners: {
      title: "{n} churches",
      stages: ["Intro", "Plan", "Rollout", "Support"],
      churches: ["Bethany", "Light", "Emmanuel", "Grace", "Salvation", "Revival", "Ark"],
    },
    clubs: {
      when: "Saturday, 10:00 · stadium",
      ofLabel: "of",
      comingLabel: "coming to practice",
      total: 24,
      confirmed: 15,
      final: 21,
      reminder: "The bot reminded members on Telegram",
    },
    movements: {
      when: "Registration · 14–16 November",
      fromLabel: "people from 38 churches",
      live: "Registration open",
      fresh: "new sign-up",
      cities: [
        { name: "Kyiv", count: 412 },
        { name: "Lviv", count: 286 },
        { name: "Kharkiv", count: 198 },
        { name: "Odesa", count: 176 },
        { name: "Dnipro", count: 168 },
      ],
      newcomers: ["Olena · Lviv", "Marko · Kyiv", "Sofia · Odesa", "Andrii · Kharkiv", "Iryna · Dnipro"],
    },
    organizations: {
      period: "Partner report · October",
      raisedLabel: "raised",
      ofLabel: "of",
      currency: "₴",
      goal: 500000,
      facts: [
        { value: "46", label: "volunteers" },
        { value: "128", label: "families helped" },
        { value: "19", label: "trips" },
      ],
      report: "Report ready — send",
    },
    education: {
      stream: "Autumn cohort · 10 lessons",
      students: ["Olena", "Marko", "Sofia", "Andrii", "Iryna", "Davyd"],
      facts: [
        { value: "92%", label: "attendance" },
        { value: "31 of 34", label: "homework in" },
      ],
      certificatesLabel: "Certificates",
    },
    integrations: {
      title: "{n} of {total} connected",
      services: [
        { name: "Telegram", feeds: "Bot, reminders, check-in" },
        { name: "Viber", feeds: "Campaigns and reminders" },
        { name: "TurboSMS", feeds: "SMS for people without messengers" },
        { name: "Google Calendar", feeds: "Service schedule" },
      ],
      yours: { name: "Your service", feeds: "Payments, accounting, streaming…", perk: "Shows up in the integrations catalog" },
    },
  },

  outro: {
    title: "Write to us",
    text: "Tell us who you are and what you'd like to build together — we reply within a day.",
    telegram: "Message on Telegram",
    mailSubject: "Partnership",
  },

  teaser: {
    cta: "Learn more",
  },
};

export const COOPERATION_COPY: Record<Lang, CooperationCopy> = { ua, en };
