import type { Lang } from "@/lib/i18n";
import { NAV_LABELS } from "./nav";

/* ────────────────────────────────────────────────────────────────
   Copy for /telegram — сторінка бота.

   Герой із живим телефоном і три блоки «назва + речення + один
   екран». 2026-09-30 сторінку спростили: меню за ролями, картки
   групи, хронологію «швидкість реакції» й закриваючий абзац прибрано.

   Кожен екран списаний з бекенду (my-church-backend/src/telegram):
   підписи кнопок і відповіді бота дослівні, щоб сторінка показувала
   бот, а не його переказ. Якщо бот міняє підпис — міняємо і тут.
     • меню й привітання ...... utils/main-menu.util.ts
     • рішення по заявці ...... handlers/submissions.handler.ts
     • явка ................... handlers/attendance.handler.ts
     • служіння ............... utils/serving-text.util.ts
   ──────────────────────────────────────────────────────────────── */

/** Рядок повідомлення в макеті чату. */
export interface TgLine {
  /** "b" — жирний, "d" — приглушений, "n" — звичайний. */
  s?: "b" | "d";
  t: string;
}

export interface TgButton {
  t: string;
  /** Синя кнопка — головна дія екрана. */
  primary?: boolean;
  tone?: "green" | "red";
}

/** Блок сторінки: назва, одне речення і один екран бота. */
interface TelegramBlock {
  title: string;
  text: string;
}

export interface TelegramCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    phone: {
      bot: string;
      status: string;
      greeting: TgLine[];
      keyboard: string[][];
      hint: string;
      /** Підпис «бот друкує» між натисканням і відповіддю. */
      typing: string;
      /** Підказка, що екран живий: по кнопках можна тиснути. */
      tapHint: string;
      /** Підпис кнопки «назад» у шапці — повертає привітання. */
      back: string;
      /** Екрани під кнопками клавіатури: id === підпис кнопки. */
      screens: { id: string; lines: TgLine[]; buttons?: TgButton[][] }[];
    };
  };

  /** Заявка в групу: рішення лідера з того самого повідомлення. */
  join: TelegramBlock & {
    lines: TgLine[];
    accept: string;
    decline: string;
    /** Рядок, яким бот замінює кнопки після рішення. */
    accepted: string;
    declined: string;
    /** Стрілка в шапці повертає заявку — щоб натиснути ще раз. */
    undo: string;
  };

  /** Явка: дотик до імені перемикає статус по колу. */
  attendance: TelegramBlock & {
    /** Перший рядок — заголовок, другий — «Присутніх: N/M». */
    head: TgLine[];
    /** Коло статусів у порядку бота. */
    cycle: string[];
    people: { name: string; icon: string }[];
    all: string;
  };

  /** Служіння: питання в зміну, відповідь одним дотиком. */
  serving: TelegramBlock & {
    /** Останній рядок — питання; відповідь стає на його місце. */
    lines: TgLine[];
    yes: string;
    no: string;
    yesState: string;
    noState: string;
  };
}

const ua: TelegramCopy = {
  navLabel: NAV_LABELS.telegram.ua,
  seoTitle: "Telegram-бот церкви — Моя Церква",
  seoDescription:
    "Бот церкви в Telegram: малі групи й служіння, відмітка явки за хвилину, заявка в групу з одного посилання, графік служіння з «Буду / Не зможу» і меню, яке в кожного своє.",

  hero: {
    eyebrow: "Телеграм-бот",
    title: "Важливе — під рукою",
    lead: "Та сама база, що й у застосунку, — просто в месенджері.",
    cta: "Запланувати зустріч",
    phone: {
      bot: "Бот церкви «Нове Життя»",
      status: "бот · онлайн",
      /* Привітання — не абзац, а те, що в людини попереду: рядок на
         групу, служіння і справи. Речення «меню внизу, можна просто
         написати» прибране 2026-09-22 — воно нічого не показувало. */
      greeting: [
        { s: "b", t: "Вітаю, Андрію 👋" },
        { t: "🏠 Домашня група — ви лідер · чт, 19:00" },
        { t: "🔥 Звук — неділя, 10:00" },
        { t: "📌 3 справи чекають" },
      ],
      keyboard: [
        ["📌 Мої справи · 3", "🏠 Мої групи (2)"],
        ["🔥 Мої служіння (1)"],
      ],
      hint: "Меню в кожного своє.",
      typing: "друкує…",
      tapHint: "Натисніть кнопку внизу — це справжні екрани бота.",
      back: "Назад до привітання",
      screens: [
        {
          id: "📌 Мої справи · 3",
          lines: [
            { s: "b", t: "📌 Що чекає на вас" },
            { t: "🏠 Домашня група — зустріч 12 жовт. не відмічена" },
            { t: "📥 Заявка в групу — Марія Ткачук, 12 хв тому" },
            { t: "🙌 Неділя, 12 жовт. — ви ще не відповіли" },
            { s: "d", t: "Усі групи й служіння — одним екраном" },
          ],
          buttons: [
            [{ t: "✅ Відмітити відвідуваність · 12 жовт.", primary: true }],
            [{ t: "📥 Заявки · ⏳ 1" }, { t: "🙌 Мій графік" }],
          ],
        },
        /* Обидва екрани — один в один із бота (`telegram-bot.update.ts`,
           `ministryListText`): заголовок із числом і кнопки по одній на
           групу чи служіння. Описові рядки прибрані 2026-09-22 — бот
           просто показує мої групи й мої служіння. */
        {
          id: "🏠 Мої групи (2)",
          lines: [{ s: "b", t: "🏠 Мої групи (2)" }],
          buttons: [
            [{ t: "🏠 Домашня група · 👑 лідер", primary: true }],
            [{ t: "🏠 Молодіжна група" }],
          ],
        },
        {
          id: "🔥 Мої служіння (1)",
          lines: [{ s: "b", t: "🔥 Мої служіння (1)" }],
          buttons: [
            [{ t: "🙌 Мій графік" }],
            [{ t: "🙏 Звук", primary: true }],
          ],
        },
      ],
    },
  },

  join: {
    title: "Заявка в групу",
    text: "Лідер приймає людину з того самого повідомлення, в якому прийшла заявка.",
    lines: [
      { s: "b", t: "📥 Заявка в групу" },
      { t: "Марія Ткачук · 📞 +380 67 •• •• 214" },
      { t: "«Переїхала на Виноградар, шукаю своїх»" },
      { s: "d", t: "Подано 12 хв тому" },
    ],
    accept: "✅ Прийняти",
    decline: "❌ Відхилити",
    accepted: "✅ Заявку прийнято",
    declined: "❌ Заявку відхилено",
    undo: "Повернути заявку",
  },

  attendance: {
    title: "Явка за хвилину",
    text: "Одразу після зустрічі, просто в чаті: дотик до імені змінює статус.",
    head: [
      { s: "b", t: "📋 Відвідуваність — 12 жовтня" },
      { t: "Присутніх: 9/13" },
    ],
    cycle: ["✅", "⏰", "❌", "📗", "❓"],
    people: [
      { name: "Ірина Гнатюк", icon: "✅" },
      { name: "Олег Сердюк", icon: "❌" },
      { name: "Марія Ткачук", icon: "✅" },
      { name: "Павло Кравець", icon: "⏰" },
      { name: "Ніна Лисенко", icon: "📗" },
      { name: "Тарас Бойко", icon: "❓" },
    ],
    all: "✅ Були всі",
  },

  serving: {
    title: "Графік служіння",
    text: "Кожен у зміні отримує питання й відповідає одним дотиком.",
    lines: [
      { s: "b", t: "🙌 Служіння: неділя, 12 жовт." },
      { t: "Недільне служіння · 10:00" },
      { t: "Ваша роль: Звукорежисер" },
      { t: "📍 Велика зала" },
      { s: "d", t: "Будете?" },
    ],
    yes: "✅ Буду",
    no: "❌ Не зможу",
    yesState: "✅ Ви будете",
    noState: "❌ Не зможете",
  },
};

const en: TelegramCopy = {
  navLabel: NAV_LABELS.telegram.en,
  seoTitle: "Church Telegram bot — My Church",
  seoDescription:
    "Your church bot in Telegram: small groups and serving teams, attendance in a minute, a group application from a single link, a serving rota with «I'm in / Can't», and a menu that differs for every person.",

  hero: {
    eyebrow: "Telegram bot",
    title: "What matters — at hand",
    lead: "The same database as the app — just in a messenger.",
    cta: "Book a demo",
    phone: {
      bot: "New Life Church bot",
      status: "bot · online",
      greeting: [
        { s: "b", t: "Hi Andrii 👋" },
        { t: "🏠 Obolon group — you lead it · Thu, 19:00" },
        { t: "🔥 Sound — Sunday, 10:00" },
        { t: "📌 3 tasks waiting" },
      ],
      keyboard: [
        ["📌 My tasks · 3", "🏠 My groups (2)"],
        ["🔥 My serving (1)"],
      ],
      hint: "Everyone gets their own menu.",
      typing: "typing…",
      tapHint: "Tap a button below — these are the bot's real screens.",
      back: "Back to the greeting",
      screens: [
        {
          id: "📌 My tasks · 3",
          lines: [
            { s: "b", t: "📌 What is waiting for you" },
            { t: "🏠 Obolon group — the 12 Oct meeting is not marked" },
            { t: "📥 A group application — Maria Tkachuk, 12 min ago" },
            { t: "🙌 Sunday, 12 Oct — you have not answered yet" },
            { s: "d", t: "Every group and team on one screen" },
          ],
          buttons: [
            [{ t: "✅ Mark attendance · 12 Oct", primary: true }],
            [{ t: "📥 Applications · 1" }, { t: "🙌 My rota" }],
          ],
        },
        {
          id: "🏠 My groups (2)",
          lines: [{ s: "b", t: "🏠 My groups (2)" }],
          buttons: [
            [{ t: "🏠 Obolon group · 👑 leader", primary: true }],
            [{ t: "🏠 Youth group" }],
          ],
        },
        {
          id: "🔥 My serving (1)",
          lines: [{ s: "b", t: "🔥 My serving (1)" }],
          buttons: [
            [{ t: "🙌 My rota" }],
            [{ t: "🙏 Sound", primary: true }],
          ],
        },
      ],
    },
  },

  join: {
    title: "Group requests",
    text: "The leader accepts a newcomer from the very message the request arrived in.",
    lines: [
      { s: "b", t: "📥 Group application" },
      { t: "Maria Tkachuk · 📞 +380 67 •• •• 214" },
      { t: "«Moved to Obolon, looking for my people»" },
      { s: "d", t: "Submitted 12 min ago" },
    ],
    accept: "✅ Accept",
    decline: "❌ Decline",
    accepted: "✅ Application accepted",
    declined: "❌ Application declined",
    undo: "Bring the application back",
  },

  attendance: {
    title: "Attendance in a minute",
    text: "Right after the meeting, in the chat: tap a name to change the status.",
    head: [
      { s: "b", t: "📋 Attendance — 12 October" },
      { t: "Present: 9/13" },
    ],
    cycle: ["✅", "⏰", "❌", "📗", "❓"],
    people: [
      { name: "Iryna Hnatiuk", icon: "✅" },
      { name: "Oleh Serdiuk", icon: "❌" },
      { name: "Maria Tkachuk", icon: "✅" },
      { name: "Pavlo Kravets", icon: "⏰" },
      { name: "Nina Lysenko", icon: "📗" },
      { name: "Taras Boiko", icon: "❓" },
    ],
    all: "✅ Everyone was here",
  },

  serving: {
    title: "Serving rota",
    text: "Everyone on the shift gets the question and answers in one tap.",
    lines: [
      { s: "b", t: "🙌 Serving: Sunday, 12 Oct" },
      { t: "Sunday service · 10:00" },
      { t: "Your role: Sound engineer" },
      { t: "📍 Main hall" },
      { s: "d", t: "Will you be there?" },
    ],
    yes: "✅ I'm in",
    no: "❌ Can't",
    yesState: "✅ You're in",
    noState: "❌ You can't",
  },
};

export const TELEGRAM_COPY: Record<Lang, TelegramCopy> = { ua, en };
