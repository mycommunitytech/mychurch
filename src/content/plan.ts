import type { Lang } from "@/lib/i18n";
import { NAV_LABELS } from "./nav";

/* ────────────────────────────────────────────────────────────────
   /plan — матеріал «30 днів до порядку».

   Сторінка нічого не переказує: вона показує сам файл (перша
   сторінка і сторінка першого тижня — справжні аркуші, зняті з
   PDF) і питає одне — куди його надіслати.

   Сам матеріал збирає `node scripts/plan-pdf.mjs`. Назви тижнів
   нижче мусять збігатися з тими, що в скрипті: тут зміст файла,
   а не його переказ своїми словами.

   Текст сторінки живе тут, а не в i18n.ts, — так само, як для
   /telegram, /support, /import і блогу.
   ──────────────────────────────────────────────────────────────── */

/* Прапорець «сторінка схована» живе в ./nav.ts разом із підписом
   пункту меню: шапка й підвал читають його, не тягнучи за собою
   тексти цієї сторінки. */
export { PLAN_LIVE } from "./nav";

/** Сам файл. Лежить у public/, тож на сайті доступний за цією адресою. */
export const PLAN_FILE = "/plan-30-dniv.pdf";

/** Під такою назвою файл збережеться в людини на комп'ютері. */
export const PLAN_FILE_NAME: Record<Lang, string> = {
  ua: "30 днів до порядку — Моя Церква.pdf",
  en: "30 Days to Order — My Church.pdf",
};

/** Аркуші, зняті з самого PDF (scripts/plan-pdf.mjs їх і оновлює). */
export const PLAN_COVER = "/plan-cover.webp";
export const PLAN_SHEET = "/plan-week.webp";

export interface PlanWeek {
  /** «Тиждень 1» — підпис поруч із номером. */
  label: string;
  n: number;
  title: string;
  /** Одне речення: навіщо цей тиждень. */
  goal: string;
  /** Критерій із файла — те, чим тиждень закривається. */
  done: string;
}

export interface PlanCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Що це за файл: формат, обсяг, мова. */
    meta: string[];
    /** Підпис під аркушем на картинці — для скрінрідера. */
    coverAlt: string;
  };

  form: {
    /** Заголовок над полем. Саме він і є питанням форми. */
    title: string;
    text: string;
    placeholder: string;
    /** Підпис поля для скрінрідера. */
    label: string;
    submit: string;
    sending: string;
    required: string;
    consent: string;
    sentTitle: string;
    sentText: string;
    download: string;
    failedTitle: string;
    failedText: string;
    retry: string;
  };

  inside: {
    eyebrow: string;
    title: string;
    text: string;
    weeks: PlanWeek[];
    doneLabel: string;
    sheetAlt: string;
    /** Дві сторінки-аркуші, яких немає серед тижнів. */
    extras: { title: string; text: string }[];
  };

  facts: { value: string; label: string }[];

  get: {
    title: string;
    text: string;
  };

  /** Тихий рядок у блозі, що веде сюди. */
  teaser: { title: string; text: string; action: string };
}

const ua: PlanCopy = {
  navLabel: NAV_LABELS.plan.ua,
  seoTitle: "30 днів до порядку: план для церкви — Моя Церква",
  seoDescription:
    "План на місяць для церкви: один список людей, групи і служіння, відвідуваність і чотири цифри, які дивитесь щомісяця. PDF на 4 сторінки українською, без реєстрації.",
  seoKeywords: [
    "план впровадження обліку в церкві",
    "як навести лад у церкві",
    "облік членів церкви з чого почати",
    "чек-лист для пастора",
    "церковне адміністрування",
  ],

  hero: {
    eyebrow: "Матеріал",
    title: "30 днів до порядку",
    lead: "Що робити по тижнях, щоб церква перестала тримати все в голові, в чатах і в чотирьох різних таблицях.",
    meta: ["PDF, 4 сторінки", "Українською", "Без реєстрації"],
    coverAlt: "Перша сторінка плану «30 днів до порядку»",
  },

  form: {
    title: "Куди надіслати?",
    text: "Надішлемо план у телеграм на цей номер. Файл почне завантажуватись одразу.",
    placeholder: "Номер телефону",
    label: "Номер телефону, на який надіслати план",
    submit: "Отримати",
    sending: "Надсилаємо…",
    required: "обов'язкове поле",
    consent: "Натискаючи «Отримати», ви погоджуєтесь з",
    sentTitle: "Готово",
    sentText: "План уже завантажується, а копію надішлемо вам у телеграм.",
    download: "Завантажити план",
    failedTitle: "Не вдалося надіслати",
    failedText: "План усе одно ваш — заберіть файл кнопкою вище. А нам напишіть напряму.",
    retry: "Спробувати ще раз",
  },

  inside: {
    eyebrow: "Що всередині",
    title: "Весь місяць на чотирьох аркушах",
    text: "На кожному тижні — схема, п'ять коротких кроків і критерій «готово, коли». Нічого не треба купувати: план виконується хоч у звичайній таблиці.",
    weeks: [
      {
        label: "Тиждень",
        n: 1,
        title: "Один список людей",
        goal: "Щоб на питання «хто в нас є?» була одна відповідь, а не чотири.",
        done: "Будь-кого знаходять за півхвилини, і всі згодні, що список один.",
      },
      {
        label: "Тиждень",
        n: 2,
        title: "Групи і служіння: хто де",
        goal: "Щоб кожне ім'я мало свою групу і своє служіння.",
        done: "Видно, хто без групи, і видно, хто тягне на собі три служіння.",
      },
      {
        label: "Тиждень",
        n: 3,
        title: "Відвідування і графік",
        goal: "Щоб було видно, хто був, а графік складався на місяць уперед.",
        done: "Графік на місяць є в усіх, а «хто був у неділю» — це запис, а не спогад.",
      },
      {
        label: "Тиждень",
        n: 4,
        title: "Цифри, які дивимось щомісяця",
        goal: "Щоб на раді дивились на ті самі чотири числа й бачили рух.",
        done: "Чотири числа за минулий місяць названі вголос і записані.",
      },
    ],
    doneLabel: "Готово, коли",
    sheetAlt: "Сторінка першого тижня з кроками й критерієм «готово, коли»",
    extras: [
      {
        title: "Аркуш «Хто за що відповідає»",
        text: "Шість рядків, які заповнюють іменами. Порожній рядок — це процес, який насправді не робить ніхто.",
      },
      {
        title: "Аркуш «Чотири цифри місяця»",
        text: "Куди щомісяця вписувати числа: звідки беремо, хто рахує, скільки вийшло.",
      },
    ],
  },

  facts: [
    { value: "2–3 години", label: "на тиждень" },
    { value: "4 сторінки", label: "без води" },
    { value: "0 програм", label: "щоб почати" },
  ],

  get: {
    title: "Заберіть план",
    text: "Один номер — і файл ваш. Дзвінком не турбуємо: якщо захочете розмову, напишете самі.",
  },

  teaser: {
    title: "30 днів до порядку",
    text: "План на місяць: один список людей, групи і служіння, відвідуваність і чотири цифри. PDF, 4 сторінки.",
    action: "Забрати план",
  },
};

const en: PlanCopy = {
  navLabel: NAV_LABELS.plan.en,
  seoTitle: "30 Days to Order: a plan for your church — My Church",
  seoDescription:
    "A one-month plan for a church: one list of people, groups and ministries, attendance, and the four numbers you review every month. A 4-page PDF in Ukrainian, no sign-up.",
  seoKeywords: [
    "church administration plan",
    "church membership records",
    "church attendance tracking",
    "checklist for pastors",
  ],

  hero: {
    eyebrow: "Material",
    title: "30 days to order",
    lead: "Week by week, so your church stops keeping everything in its head, in chats and in four different spreadsheets.",
    meta: ["PDF, 4 pages", "In Ukrainian", "No sign-up"],
    coverAlt: "The first page of the plan",
  },

  form: {
    title: "Where should we send it?",
    text: "We will send the plan to this number on Telegram. The file starts downloading right away.",
    placeholder: "Phone number",
    label: "The phone number to send the plan to",
    submit: "Get it",
    sending: "Sending…",
    required: "required field",
    consent: "By pressing «Get it» you agree to the",
    sentTitle: "Done",
    sentText: "The plan is downloading, and we will send a copy on Telegram.",
    download: "Download the plan",
    failedTitle: "Could not send it",
    failedText: "The plan is still yours — take the file with the button above. And write to us directly.",
    retry: "Try again",
  },

  inside: {
    eyebrow: "What is inside",
    title: "The whole month on four sheets",
    text: "Each week has a diagram, five short steps and a «done when» line. Nothing to buy: the plan works in a plain spreadsheet.",
    weeks: [
      {
        label: "Week",
        n: 1,
        title: "One list of people",
        goal: "So that «who do we have?» has one answer instead of four different ones.",
        done: "Anyone is found in half a minute, and everyone agrees there is one list.",
      },
      {
        label: "Week",
        n: 2,
        title: "Groups and ministries: who is where",
        goal: "So that every name has its own group and its own ministry.",
        done: "You can see who has no group, and who carries three ministries alone.",
      },
      {
        label: "Week",
        n: 3,
        title: "Attendance and the rota",
        goal: "So the rota is built a month ahead instead of by calls on Saturday night.",
        done: "Everyone has the rota for the month, and «who came on Sunday» is a record, not a memory.",
      },
      {
        label: "Week",
        n: 4,
        title: "The numbers you review monthly",
        goal: "So the board looks at the same four numbers and sees movement, not impressions.",
        done: "Four numbers for last month are said out loud and written down.",
      },
    ],
    doneLabel: "Done when",
    sheetAlt: "The first week page with its steps and the «done when» line",
    extras: [
      {
        title: "The «who owns what» sheet",
        text: "Six rows filled in with names. An empty row is a process nobody actually runs.",
      },
      {
        title: "The «four numbers» sheet",
        text: "Where to write the numbers each month: where they come from, who counts them, what came out.",
      },
    ],
  },

  facts: [
    { value: "2–3 hours", label: "a week" },
    { value: "4 pages", label: "no filler" },
    { value: "0 tools", label: "to start" },
  ],

  get: {
    title: "Take the plan",
    text: "One number and the file is yours. We will not call: if you want a conversation, you will write first.",
  },

  teaser: {
    title: "30 days to order",
    text: "A plan for the month: one list of people, groups and ministries, attendance and four numbers. A 4-page PDF.",
    action: "Take the plan",
  },
};

export const PLAN_COPY: Record<Lang, PlanCopy> = { ua, en };
