import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Сторінка «Вартість»: сходинка тарифів.

   Тариф веде не перелік модулів, а проблема, яку він знімає, і час,
   який церква отримує назад. Модулі — деталь під цим.

   Сум тут немає свідомо: ціну називаємо до початку робіт, після
   розмови про розмір громади й набір модулів. Сторінка показує, за
   що саме платять, а не скільки.

   Усе про гроші й строки має збігатися з `legal.ts` (умови, розділи
   6–7) і з блоком «Консалтинг».
   ──────────────────────────────────────────────────────────────── */

export interface PricingTier {
  id: string;
  name: string;
  /** Кому цей щабель. */
  who: string;
  /** Проблема, яку знімає саме цей щабель. */
  problem: string;
  /** Що церква отримує назад у часі. */
  time: string;
  /** Модулі, які додаються на цьому щаблі. */
  adds: string[];
}

export interface PricingCopy {
  seoTitle: string;
  seoDescription: string;
  navLabel: string;

  eyebrow: string;
  title: string;
  lead: string;

  programEyebrow: string;
  programTitle: string;
  programText: string;
  program: { title: string; text: string }[];
  programNote: string;

  tiersEyebrow: string;
  tiersTitle: string;
  tiersText: string;
  /** Підписи всередині щабля. */
  addsLabel: string;
  includesPrevLabel: string;
  tiers: PricingTier[];
  tiersNote: string;

  ambassadorEyebrow: string;
  ambassadorTitle: string;
  ambassadorText: string;
  ambassadorPerks: string[];
  ambassadorNote: string;
  ambassadorCta: string;

  promisesTitle: string;
  promises: string[];

  alwaysEyebrow: string;
  alwaysTitle: string;
  alwaysText: string;
  always: { title: string; text: string }[];
}

const ua: PricingCopy = {
  seoTitle: "Скільки коштує система для церкви — тарифи «Моя Церква»",
  seoDescription:
    "Чотири щаблі «Моєї Церкви»: Старт, База, Ріст і Преміум. Що знімає кожен і скільки часу повертає церкві. Точну суму називаємо до початку робіт.",
  navLabel: "Вартість",

  eyebrow: "Вартість",
  title: "Чотири щаблі — за тим, скільки ви перестаєте робити руками",
  lead: "Ми не рахуємо вам людей і не продаємо кількість модулів. Щабель визначає інше: яку рутину система забирає і скільки вечорів повертає команді.",

  programEyebrow: "Зараз",
  programTitle: "Діє програма безкоштовного підключення",
  programText:
    "Поки програма відкрита, підключення, перенесення бази й навчання команди нічого не коштують — незалежно від того, який щабель ви оберете далі. Про її завершення ми попередимо заздалегідь.",
  program: [
    { title: "Підключення і впровадження", text: "Система, налаштування під вашу структуру й супровід на старті." },
    { title: "Консалтинг до 1 листопада 2026 року", text: "Аудит процесів і план впровадження, зібраний під вашу церкву." },
    { title: "Перенесення бази з таблиць", text: "Забираємо ваші Google Таблиці, чати й зошити і зводимо в одну базу." },
    { title: "Навчання команди", text: "Пастори, лідери груп і адміністрація — поки не почнуть працювати самі." },
  ],
  programNote:
    "Налаштування займає до 7 днів. Безкоштовний період не перетворюється на платну підписку сам собою: щоб продовжити на платній основі, потрібна ваша окрема згода.",

  tiersEyebrow: "Щаблі",
  tiersTitle: "Кожен наступний знімає більший шматок рутини",
  tiersText:
    "Щаблі накопичуються: усе з попереднього лишається. Починати з верхнього не треба — більшість церков живе на другому чи третьому.",
  addsLabel: "Додається",
  includesPrevLabel: "усе з попереднього",
  tiers: [
    {
      id: "start",
      name: "Старт",
      who: "Громада, яка щойно вирішила вести облік по-людськи",
      problem: "Люди перестають губитися між чатами, таблицями й записниками",
      time: "Знайти людину — три секунди замість пошуку в трьох місцях",
      adds: ["Люди", "Сім'я", "Малі групи", "Календар", "Telegram-бот"],
    },
    {
      id: "base",
      name: "База",
      who: "Церква з кількома служіннями й регулярними зустрічами",
      problem: "Лідери перестають вести облік руками й писати нагадування самі",
      time: "Явка за хвилину з телефона, нагадування йдуть без вас",
      adds: ["Служіння", "Планування служіння", "Онбординг", "Форми", "Розсилки", "Аналітика та звіти"],
    },
    {
      id: "growth",
      name: "Ріст",
      who: "Церква, у якої більше подій, ніж вільних вечорів",
      problem: "Події, навчання й дитяче служіння живуть у системі, а не в чиїйсь голові",
      time: "Звіт для ради — за кілька хвилин замість цілого вечора",
      adds: [
        "Організатор подій",
        "Навчання",
        "Дитяче містечко",
        "Заявки",
        "Автоматизації",
        "Кімнати",
        "Цілі та метрики",
        "Сезони",
      ],
    },
    {
      id: "premium",
      name: "Преміум",
      who: "Велика церква або мережа кемпусів",
      problem: "Кілька локацій, команда й фінанси видно як одне ціле",
      time: "Пастор бачить усю мережу з одного екрана, без зведення таблиць",
      adds: [
        "Кемпуси",
        "Бухгалтерія",
        "Оргструктура",
        "Інвентаризація",
        "Інфраструктура",
        "Проєкти",
        "База знань",
        "ШІ-асистент",
        "Кастомізація",
      ],
    },
  ],
  tiersNote:
    "Суму в гривнях ми називаємо до початку робіт — після короткої розмови про розмір громади й набір модулів — і не змінюємо її заднім числом. Telegram нічого не коштує; SMS і Viber ви оплачуєте оператору напряму — ці гроші йдуть не нам, і ми на них не заробляємо.",

  ambassadorEyebrow: "Окремо",
  ambassadorTitle: "Амбасадор — це не щабель, його не можна купити",
  ambassadorText:
    "Церква відкриває свій досвід: реальні цифри, фото, процеси і право посилатися на неї, коли ми розповідаємо іншим громадам. Натомість отримує всю систему і місце в розробці. Це домовленість, а не тариф.",
  ambassadorPerks: [
    "Усі 39 модулів, без обмежень щабля",
    "Пріоритетна підтримка — окремий канал і швидкі відповіді",
    "Ранній доступ до нових модулів і ШІ-функцій",
    "Голос у дорожній карті: ваші потреби формують систему",
  ],
  ambassadorNote: "Зараз амбасадор один — церква «Нове Життя» з Черкас.",
  ambassadorCta: "Подивитись, як вона працює в системі",

  promisesTitle: "Чого не буде на жодному щаблі",
  promises: [
    "Автоматичного списання після безкоштовної програми",
    "Плати за кожну «зайву» людину в базі посеред року",
    "Окремого рахунку за підтримку чи оновлення",
    "Штрафу за те, що ви вирішили піти",
  ],

  alwaysEyebrow: "Незмінно",
  alwaysTitle: "Що входить на будь-якому щаблі",
  alwaysText: "Це не залежить від тарифу, розміру церкви й того, скільки ви платите.",
  always: [
    {
      title: "Дані церкви належать церкві",
      text: "Повний експорт у CSV або Excel будь-коли, без пояснень, навіщо він вам.",
    },
    {
      title: "Час, щоб усе забрати",
      text: "Якщо розійдемось, база не зникне того ж дня — ви спокійно все заберете.",
    },
    {
      title: "Підтримка протягом робочого дня",
      text: "Окремого тарифу на відповіді немає й не буде.",
    },
    {
      title: "Оновлення без доплат",
      text: "Нові модулі й виправлення приходять усім, хто працює в системі.",
    },
  ],
};

const en: PricingCopy = {
  seoTitle: "What a church management system costs — My Church plans",
  seoDescription:
    "Four steps of My Church: Start, Base, Growth and Premium. What each one takes off your hands and how much time it gives back. We name the exact figure before work starts.",
  navLabel: "Pricing",

  eyebrow: "Pricing",
  title: "Four steps, measured by how much you stop doing by hand",
  lead: "We don't count your people and we don't sell you a number of modules. A step is defined by something else: which routine the system takes over, and how many evenings it gives your team back.",

  programEyebrow: "Right now",
  programTitle: "Our free onboarding programme is open",
  programText:
    "While the programme runs, onboarding, data migration and team training cost nothing — whichever step you choose afterwards. We will give you notice before it ends.",
  program: [
    { title: "Onboarding and rollout", text: "The system, setup for your structure and support at the start." },
    { title: "Consulting until 1 November 2026", text: "A process audit and a rollout plan assembled for your church." },
    { title: "Migration from spreadsheets", text: "We take your Google Sheets, chats and notebooks and merge them into one database." },
    { title: "Training your team", text: "Pastors, group leaders and administrators — until they can work on their own." },
  ],
  programNote:
    "Setup takes up to 7 days. A free period never turns into a paid subscription by itself: continuing on paid terms requires your separate agreement.",

  tiersEyebrow: "The steps",
  tiersTitle: "Each one takes a bigger piece of the routine",
  tiersText:
    "The steps accumulate: everything from the previous one stays. You don't need to start at the top — most churches live on the second or third.",
  addsLabel: "Adds",
  includesPrevLabel: "everything from the previous step",
  tiers: [
    {
      id: "start",
      name: "Start",
      who: "A congregation that has just decided to keep proper records",
      problem: "People stop falling through the gaps between chats, spreadsheets and notebooks",
      time: "Finding someone takes three seconds instead of searching in three places",
      adds: ["People", "Family", "Small groups", "Calendar", "Telegram bot"],
    },
    {
      id: "base",
      name: "Base",
      who: "A church with several ministries and regular meetings",
      problem: "Leaders stop keeping records by hand and writing every reminder themselves",
      time: "Attendance in a minute from a phone; reminders go out without you",
      adds: ["Ministries", "Service planning", "Onboarding", "Forms", "Campaigns", "Analytics and reports"],
    },
    {
      id: "growth",
      name: "Growth",
      who: "A church with more events than free evenings",
      problem: "Events, courses and children's ministry live in the system, not in someone's head",
      time: "A report for the board in minutes instead of a whole evening",
      adds: ["Events", "Learning", "Kids Town", "Requests", "Automations", "Rooms", "Goals and metrics", "Seasons"],
    },
    {
      id: "premium",
      name: "Premium",
      who: "A large church or a network of campuses",
      problem: "Several locations, the team and the finances read as one whole",
      time: "The pastor sees the whole network on one screen, with no spreadsheets to merge",
      adds: [
        "Campuses",
        "Finance",
        "Org structure",
        "Inventory",
        "Infrastructure",
        "Projects",
        "Knowledge base",
        "AI assistant",
        "Customisation",
      ],
    },
  ],
  tiersNote:
    "We name the figure before work starts — after a short conversation about the size of the congregation and the set of modules — and never change it retroactively. Telegram costs nothing; SMS and Viber you pay to the carrier directly — that money does not come to us and we make nothing on it.",

  ambassadorEyebrow: "Separately",
  ambassadorTitle: "Ambassador is not a step, and it cannot be bought",
  ambassadorText:
    "A church opens up its experience: real figures, photos, processes, and the right for us to point to it when we talk to other congregations. In return it gets the whole system and a seat in how it is built. That is an agreement, not a plan.",
  ambassadorPerks: [
    "All 39 modules, with no step limits",
    "Priority support — a direct channel and fast answers",
    "Early access to new modules and AI features",
    "A voice in the roadmap: your needs shape the product",
  ],
  ambassadorNote: "There is one ambassador today — the New Life church in Cherkasy.",
  ambassadorCta: "See how they work in the system",

  promisesTitle: "What will not happen on any step",
  promises: [
    "An automatic charge when the free programme ends",
    "A fee for every “extra” person added mid-year",
    "A separate invoice for support or updates",
    "A penalty for deciding to leave",
  ],

  alwaysEyebrow: "Always",
  alwaysTitle: "What is included on every step",
  alwaysText: "None of this depends on the plan, the size of the church or how much you pay.",
  always: [
    {
      title: "Your church's data is yours",
      text: "A full export as CSV or Excel at any time, with no need to explain why you want it.",
    },
    {
      title: "Time to take everything",
      text: "If we part ways, the database doesn't vanish the same day — you can take everything with you calmly.",
    },
    {
      title: "Support within the working day",
      text: "There is no separate tariff for answers, and there never will be.",
    },
    {
      title: "Updates at no extra cost",
      text: "New modules and fixes reach everyone working in the system.",
    },
  ],
};

export const PRICING_COPY: Record<Lang, PricingCopy> = { ua, en };
