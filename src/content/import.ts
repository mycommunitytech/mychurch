import type { Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   Copy for /import — розумний імпорт.

   Сторінка показує один наскрізний приклад, а не абстракцію:
   чотири файли церкви → розбір колонок → родина Ковальчуків
   (той самий приклад, що в модулі «Сім'я») → чернетка з дублікатами.
   Цифри узгоджені між секціями: 428 людей, 96 сімей, 18 груп,
   11 служінь, 23 дублікати — це один і той самий імпорт.

   Правила зіставлення, які тут описані, — з бекенду
   (my-church-backend/src/api/onboarding/onboarding-matching.util.ts):
   пошта зводиться до нижнього регістру, телефон — до останніх
   дев'яти цифр, тому «+38 (067) 123-45-67» і «0671234567» — одна людина.
   ──────────────────────────────────────────────────────────────── */

export interface ImportFile {
  name: string;
  meta: string;
}

export interface ImportColumn {
  /** Назва колонки так, як вона написана у файлі. */
  head: string;
  /** Приклад значення з першого рядка. */
  sample: string;
  /** Модуль, у який лягає колонка. */
  module: string;
  /** Поле всередині модуля. */
  field: string;
}

export interface ImportCopy {
  navLabel: string;
  seoTitle: string;
  seoDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    drop: {
      title: string;
      hint: string;
      files: ImportFile[];
    };
    seen: {
      label: string;
      rows: { value: string; label: string }[];
      note: string;
    };
    facts: { value: string; label: string }[];
    cta: string;
    ctaSecondary: string;
  };

  sources: {
    eyebrow: string;
    title: string;
    text: string;
    /** Імена файлів для рухомого рядка. */
    files: string[];
    points: { title: string; text: string }[];
    note: string;
  };

  mapping: {
    eyebrow: string;
    title: string;
    text: string;
    fileLabel: string;
    fileName: string;
    columns: ImportColumn[];
    targetLabel: string;
    targets: { module: string; fields: string[] }[];
    fix: string;
    note: string;
  };

  links: {
    eyebrow: string;
    title: string;
    text: string;
    rawLabel: string;
    rawHead: string[];
    rows: string[][];
    resultLabel: string;
    family: {
      title: string;
      sub: string;
      members: { name: string; sub: string; tag: string }[];
    };
    evidence: { title: string; text: string }[];
    note: string;
  };

  review: {
    eyebrow: string;
    title: string;
    text: string;
    screen: {
      title: string;
      sub: string;
      kpis: { value: string; label: string }[];
      issues: {
        tone: "amber" | "brand" | "red";
        title: string;
        text: string;
        action: string;
      }[];
      primary: string;
      secondary: string;
    };
    safety: { title: string; text: string }[];
    quote: { text: string; author: string; link: string };
  };

  after: {
    eyebrow: string;
    title: string;
    text: string;
    items: { module: string; text: string; href: string }[];
    note: string;
  };
}

const ua: ImportCopy = {
  navLabel: "Імпорт",
  seoTitle: "Розумний імпорт — Моя Церква",
  seoDescription:
    "Закиньте таблиці, експорти й списки як є. Система розбере колонки, заведе людей, сім'ї, групи та служіння, знайде дублікати й зв'язки — а ви лише підтвердите.",

  hero: {
    eyebrow: "Розумний імпорт",
    title: "Закиньте все, що у вас є",
    lead:
      "Таблиці різних служінь, експорт зі старої системи, списки груп, анкети з форм. Не треба зводити це в один шаблон: система сама прочитає файли, заведе людей, сім'ї та групи — і покаже зв'язки, яких у файлах не було.",
    drop: {
      title: "Перетягніть файли сюди",
      hint: "xlsx · csv · Google Таблиці · json · vcf — скільки завгодно файлів за раз",
      files: [
        { name: "Члени_церкви_2019.xlsx", meta: "428 рядків · 3 аркуші" },
        { name: "малі_групи (копія).csv", meta: "18 груп" },
        { name: "Прославлення_графік.xlsx", meta: "11 команд" },
        { name: "анкети_гостей.xlsx", meta: "96 рядків" },
      ],
    },
    seen: {
      label: "Система побачила",
      rows: [
        { value: "428", label: "людей" },
        { value: "96", label: "сімей" },
        { value: "18", label: "малих груп" },
        { value: "11", label: "служінь" },
        { value: "23", label: "дублікати" },
      ],
      note: "Поки це чернетка: у базі церкви ще нічого не змінилось.",
    },
    facts: [
      { value: "Без шаблону", label: "не треба переганяти таблиці в наш формат" },
      { value: "Чернетка", label: "нічого не з'явиться, поки ви не підтвердите" },
      { value: "Відкат", label: "один рух — і база така, як була до імпорту" },
    ],
    cta: "Запланувати зустріч",
    ctaSecondary: "Модуль «Люди»",
  },

  sources: {
    eyebrow: "Що приймає",
    title: "Файли, які у вас уже є",
    text:
      "База церкви рідко буває однією таблицею. Частіше це десяток файлів у різних людей, з різними колонками й різними звичками запису. Закидайте як є — зводити разом не треба.",
    files: [
      "Члени_церкви_2019.xlsx",
      "малі_групи (копія).csv",
      "Прославлення_графік.xlsx",
      "анкети_гостей.xlsx",
      "Контакти.vcf",
      "експорт_старої_системи.json",
      "діти_Kids_Town.xlsx",
      "телефони_лідерів.txt",
      "Табір_2024_реєстрація.csv",
      "нові_після_Великодня.xlsx",
    ],
    points: [
      {
        title: "Колонки називаються як завгодно",
        text: "«ПІБ» в одному файлі, «Прізвище / Ім'я» в другому, «Name» у третьому — система зводить це до одного поля.",
      },
      {
        title: "Номери записані по-різному",
        text: "«+38 (067) 123-45-67», «067 123 45 67» і «0671234567» — це один номер і одна людина, а не три картки.",
      },
      {
        title: "Порожні клітинки — не проблема",
        text: "Немає пошти чи дати народження — рядок усе одно заходить. Поле лишається порожнім, картка живе далі.",
      },
    ],
    note:
      "Не чистьте файли перед завантаженням. Усе, чого система не зрозуміла, вона винесе окремим списком — і ви вирішите на місці.",
  },

  mapping: {
    eyebrow: "Крок 1 — розбір",
    title: "Колонки система читає сама",
    text:
      "Ви не заповнюєте таблицю відповідностей. Система дивиться і на назву колонки, і на самі значення — і каже, у яке поле якого модуля це піде.",
    fileLabel: "Ваш файл",
    fileName: "Члени_церкви_2019.xlsx",
    columns: [
      { head: "ПІБ", sample: "Ковальчук Олена Петрівна", module: "Люди", field: "ПІБ" },
      { head: "моб.", sample: "+38 (067) 123-45-67", module: "Люди", field: "Телефон" },
      { head: "дата нар.", sample: "14.05.1987", module: "Люди", field: "Дата народження" },
      { head: "хрещ.", sample: "2011", module: "Люди", field: "Хрещення" },
      { head: "адреса", sample: "Виноградар, Героїв 12, кв. 4", module: "Сім'я", field: "Адреса родини" },
      { head: "гр.", sample: "Домашня група", module: "Малі групи", field: "Група" },
      { head: "служ.", sample: "прославлення", module: "Служіння", field: "Команда" },
      { head: "прим.", sample: "переїхала з Черкас", module: "Люди", field: "Нотатки" },
    ],
    targetLabel: "Куди це лягає",
    targets: [
      { module: "Люди", fields: ["ПІБ", "Телефон", "Дата народження", "Статус", "Хрещення", "Нотатки"] },
      { module: "Сім'я", fields: ["Адреса родини", "Подружжя", "Діти"] },
      { module: "Малі групи", fields: ["Група", "Роль у групі"] },
      { module: "Служіння", fields: ["Команда", "Роль"] },
    ],
    fix: "Не вгадали — міняєте вибір у списку, і система застосовує це до всіх рядків файлу.",
    note:
      "Колонку, якої немає в системі, ми не викидаємо: вона стає вашим власним полем у картці людини — і працює у фільтрах і звітах так само, як стандартне.",
  },

  links: {
    eyebrow: "Крок 2 — зв'язки",
    title: "Зв'язки, яких у файлі не було",
    text:
      "У таблиці Ковальчуки — п'ять окремих рядків, і нічого не каже, що це одна родина. Система бачить спільне прізвище й адресу, той самий номер у двох написаннях і ім'я з сусіднього рядка в колонці «прим.».",
    rawLabel: "Рядки у файлі",
    rawHead: ["ПІБ", "моб.", "адреса", "прим."],
    rows: [
      ["Ковальчук Андрій", "+38 (067) 123-45-67", "Героїв 12, кв. 4", "зустріч гостей"],
      ["Ковальчук Олена", "0671234567", "Героїв 12/4", "прославлення"],
      ["Марко, 9 р.", "—", "Героїв 12, кв. 4", "син Андрія"],
      ["Софія, 5 р.", "—", "Героїв 12, кв. 4", "донька Андрія"],
      ["Ковальчук Галина", "067 987 65 43", "Героїв 12, кв. 4", "мама Андрія"],
    ],
    resultLabel: "Що з'явиться в системі",
    family: {
      title: "Родина Ковальчуків",
      sub: "5 осіб · Виноградар · річниця 14 травня",
      members: [
        { name: "Андрій Ковальчук", sub: "Чоловік · Зустріч гостей", tag: "Контакт родини" },
        { name: "Олена Ковальчук", sub: "Дружина · Прославлення", tag: "Член церкви" },
        { name: "Марко Ковальчук", sub: "Син · 9 років", tag: "Дитяче містечко" },
        { name: "Софія Ковальчук", sub: "Донька · 5 років", tag: "Дитяче містечко" },
        { name: "Галина Ковальчук", sub: "Мама Андрія · Група «Центр»", tag: "Член церкви" },
      ],
    },
    evidence: [
      {
        title: "Один номер у двох написаннях",
        text: "Система звіряє останні дев'ять цифр, а пошту — у нижньому регістрі. Тому «+38 (067) 123-45-67» і «0671234567» — та сама людина, а не дві картки.",
      },
      {
        title: "Спільне прізвище й адреса",
        text: "П'ять рядків з однією адресою стають родиною. Ви лише підтверджуєте, хто кому ким доводиться.",
      },
      {
        title: "Діти без контактів",
        text: "У Марка і Софії є лише ім'я і вік. Вони заходять дитячими картками під батьками — без телефону й пошти, з групою за віком у «Дитячому містечку».",
      },
      {
        title: "Не тільки родина",
        text: "«прославлення» і «домашня група» з тих самих клітинок приводять Олену в команду прославлення й у домашню групу. Лідери одразу бачать свій склад.",
      },
    ],
    note:
      "Жоден зв'язок не проставляється мовчки: біля кожного система показує рядок і файл, з яких вона його взяла.",
  },

  review: {
    eyebrow: "Крок 3 — підтвердження",
    title: "Ви бачите все до того, як натиснути",
    text:
      "Імпорт живе як чернетка: повний список того, що з'явиться, що об'єднається і чого система не зрозуміла. Поки ви не підтвердили — у базі церкви не змінилось нічого.",
    screen: {
      title: "Імпорт · чернетка",
      sub: "4 файли · зібрано 12 хвилин тому",
      kpis: [
        { value: "428", label: "людей" },
        { value: "96", label: "сімей" },
        { value: "18", label: "малих груп" },
        { value: "11", label: "служінь" },
      ],
      issues: [
        {
          tone: "amber",
          title: "23 дублікати",
          text: "Той самий номер або пошта у двох рядках. Пари показані поруч: об'єднати в одну картку чи лишити окремо.",
          action: "Переглянути",
        },
        {
          tone: "brand",
          title: "96 родин зі зв'язками",
          text: "Подружжя, діти й батьки, зібрані за прізвищем, адресою та номером. Кожен зв'язок — з підписом, звідки він.",
          action: "Перевірити",
        },
        {
          tone: "red",
          title: "7 рядків без імені",
          text: "Є телефон, немає людини. Такі рядки не імпортуються, поки ви не скажете, що з ними робити.",
          action: "Вирішити",
        },
      ],
      primary: "Імпортувати 428 записів",
      secondary: "Скасувати",
    },
    safety: [
      {
        title: "Відкат",
        text: "Кожен імпорт — окрема подія. Один рух — і всі картки цього імпорту зникають, а те, що було в базі до нього, лишається недоторканим.",
      },
      {
        title: "Журнал",
        text: "У картці людини видно, з якого файлу і коли вона зайшла та хто підтвердив цей імпорт.",
      },
      {
        title: "Доступи",
        text: "Файл бачить лише той, хто веде базу. Лідер групи не отримує чужі контакти разом із таблицею.",
      },
    ],
    quote: {
      text: "Уся база церкви з Google Таблиць за три дні. Дублікати система показала ще до імпорту.",
      author: "Перенесення бази — церква «Нове Життя», Черкаси",
      link: "Історія церкви",
    },
  },

  after: {
    eyebrow: "Після імпорту",
    title: "База одразу жива, а не порожня",
    text:
      "Наступного дня лідери бачать свої групи, рецепція знаходить людину за секунди, а пастор — усю церкву. Без місяця ручного набору.",
    items: [
      { module: "Люди", text: "428 карток зі статусами, контактами й нотатками", href: "/modules/people" },
      { module: "Сім'я", text: "96 родин: подружжя, діти, адреси, дати", href: "/modules/family" },
      { module: "Малі групи", text: "18 груп зі складом і лідерами", href: "/modules/groups" },
      { module: "Служіння", text: "11 команд з ролями й графіком", href: "/modules/ministries" },
      { module: "Аналітика", text: "перші зрізи по церкві — без жодного ручного рядка", href: "/modules/analytics" },
    ],
    note: "Далі база наповнюється сама: явка з груп, анкети гостей, реєстрації на події.",
  },
};

const en: ImportCopy = {
  navLabel: "Import",
  seoTitle: "Smart import — My Church",
  seoDescription:
    "Drop in your spreadsheets, exports and lists as they are. The system reads the columns, creates people, families, groups and ministries, finds duplicates and relations — you just confirm.",

  hero: {
    eyebrow: "Smart import",
    title: "Drop in everything you have",
    lead:
      "Spreadsheets from every ministry, an export from your old system, group lists, form responses. No need to merge them into one template: the system reads the files, creates people, families and groups — and shows relations the files never spelled out.",
    drop: {
      title: "Drag your files here",
      hint: "xlsx · csv · Google Sheets · json · vcf — as many files at once as you like",
      files: [
        { name: "Members_2019.xlsx", meta: "428 rows · 3 sheets" },
        { name: "small_groups (copy).csv", meta: "18 groups" },
        { name: "Worship_rota.xlsx", meta: "11 teams" },
        { name: "guest_forms.xlsx", meta: "96 rows" },
      ],
    },
    seen: {
      label: "The system found",
      rows: [
        { value: "428", label: "people" },
        { value: "96", label: "families" },
        { value: "18", label: "small groups" },
        { value: "11", label: "ministries" },
        { value: "23", label: "duplicates" },
      ],
      note: "It is still a draft: nothing in the church database has changed yet.",
    },
    facts: [
      { value: "No template", label: "you don't reshape your sheets into our format" },
      { value: "Draft first", label: "nothing appears until you confirm it" },
      { value: "Rollback", label: "one move and the base is exactly as it was" },
    ],
    cta: "Book a demo",
    ctaSecondary: "The People module",
  },

  sources: {
    eyebrow: "What it takes",
    title: "The files you already have",
    text:
      "A church database is rarely one spreadsheet. More often it is a dozen files kept by different people, with different columns and different habits. Send them as they are — no need to merge anything first.",
    files: [
      "Members_2019.xlsx",
      "small_groups (copy).csv",
      "Worship_rota.xlsx",
      "guest_forms.xlsx",
      "Contacts.vcf",
      "old_system_export.json",
      "kids_town.xlsx",
      "leader_phones.txt",
      "Camp_2024_signup.csv",
      "new_after_Easter.xlsx",
    ],
    points: [
      {
        title: "Columns can be named anything",
        text: "\"Full name\" in one file, \"Surname / First name\" in another, \"ПІБ\" in a third — they all land in the same field.",
      },
      {
        title: "Numbers written every way",
        text: "\"+38 (067) 123-45-67\", \"067 123 45 67\" and \"0671234567\" are one number and one person, not three profiles.",
      },
      {
        title: "Empty cells are fine",
        text: "No email or birthday? The row still goes in. The field stays empty and the profile lives on.",
      },
    ],
    note:
      "Don't clean the files up first. Anything the system could not read is listed separately, and you decide on the spot.",
  },

  mapping: {
    eyebrow: "Step 1 — parsing",
    title: "It reads the columns for you",
    text:
      "You don't fill in a mapping table. The system looks at the column name and at the values themselves, then says which field of which module they belong to.",
    fileLabel: "Your file",
    fileName: "Members_2019.xlsx",
    columns: [
      { head: "Full name", sample: "Olena Kovalchuk", module: "People", field: "Full name" },
      { head: "mob.", sample: "+38 (067) 123-45-67", module: "People", field: "Phone" },
      { head: "d.o.b.", sample: "14.05.1987", module: "People", field: "Date of birth" },
      { head: "bapt.", sample: "2011", module: "People", field: "Baptism" },
      { head: "address", sample: "Obolon, Heroiv 12, apt. 4", module: "Family", field: "Family address" },
      { head: "grp.", sample: "Obolon", module: "Small groups", field: "Group" },
      { head: "min.", sample: "worship", module: "Ministries", field: "Team" },
      { head: "notes", sample: "moved from Cherkasy", module: "People", field: "Notes" },
    ],
    targetLabel: "Where it lands",
    targets: [
      { module: "People", fields: ["Full name", "Phone", "Date of birth", "Status", "Baptism", "Notes"] },
      { module: "Family", fields: ["Family address", "Spouse", "Children"] },
      { module: "Small groups", fields: ["Group", "Role in the group"] },
      { module: "Ministries", fields: ["Team", "Role"] },
    ],
    fix: "Guessed wrong? Change the pick in the list and it applies to every row of the file.",
    note:
      "A column the system has no field for is not thrown away: it becomes your own field on the profile and works in filters and reports like a standard one.",
  },

  links: {
    eyebrow: "Step 2 — relations",
    title: "Relations the file never spelled out",
    text:
      "In the spreadsheet the Kovalchuks are five separate rows, and nothing says they are one family. The system sees the shared surname and address, the same number written two ways, and a name from the row above in the \"notes\" column.",
    rawLabel: "Rows in the file",
    rawHead: ["Full name", "mob.", "address", "notes"],
    rows: [
      ["Andrii Kovalchuk", "+38 (067) 123-45-67", "Heroiv 12, apt. 4", "greeting team"],
      ["Olena Kovalchuk", "0671234567", "Heroiv 12/4", "worship"],
      ["Marko, 9 y.o.", "—", "Heroiv 12, apt. 4", "son of Andrii"],
      ["Sofiia, 5 y.o.", "—", "Heroiv 12, apt. 4", "daughter of Andrii"],
      ["Halyna Kovalchuk", "067 987 65 43", "Heroiv 12, apt. 4", "mother of Andrii"],
    ],
    resultLabel: "What appears in the system",
    family: {
      title: "The Kovalchuk family",
      sub: "5 people · Obolon · anniversary 14 May",
      members: [
        { name: "Andrii Kovalchuk", sub: "Husband · Greeting team", tag: "Family contact" },
        { name: "Olena Kovalchuk", sub: "Wife · Worship", tag: "Member" },
        { name: "Marko Kovalchuk", sub: "Son · 9 years old", tag: "Kids Town" },
        { name: "Sofiia Kovalchuk", sub: "Daughter · 5 years old", tag: "Kids Town" },
        { name: "Halyna Kovalchuk", sub: "Andrii's mother · Centre group", tag: "Member" },
      ],
    },
    evidence: [
      {
        title: "One number, two spellings",
        text: "The system compares the last nine digits, and emails in lowercase. So \"+38 (067) 123-45-67\" and \"0671234567\" are the same person, not two profiles.",
      },
      {
        title: "Shared surname and address",
        text: "Five rows at one address become a family. All you do is confirm who is who.",
      },
      {
        title: "Children with no contacts",
        text: "Marko and Sofiia have only a name and an age. They come in as children's profiles under their parents — no phone, no email, with the Kids Town group for their age.",
      },
      {
        title: "Not only families",
        text: "\"worship\" and \"Obolon\" from the same cells put Olena on the worship team and in the small group with that name. Leaders see their people right away.",
      },
    ],
    note:
      "No relation is created silently: next to each one the system shows the row and the file it came from.",
  },

  review: {
    eyebrow: "Step 3 — confirmation",
    title: "You see everything before you press the button",
    text:
      "The import lives as a draft: the full list of what will be created, what will be merged and what the system could not read. Until you confirm, nothing in the church database has changed.",
    screen: {
      title: "Import · draft",
      sub: "4 files · assembled 12 minutes ago",
      kpis: [
        { value: "428", label: "people" },
        { value: "96", label: "families" },
        { value: "18", label: "small groups" },
        { value: "11", label: "ministries" },
      ],
      issues: [
        {
          tone: "amber",
          title: "23 duplicates",
          text: "The same number or email in two rows. The pairs are shown side by side: merge into one profile or keep them apart.",
          action: "Review",
        },
        {
          tone: "brand",
          title: "96 families with relations",
          text: "Spouses, children and parents gathered by surname, address and phone. Every relation says where it came from.",
          action: "Check",
        },
        {
          tone: "red",
          title: "7 rows with no name",
          text: "A phone number and no person. These rows stay out until you say what to do with them.",
          action: "Decide",
        },
      ],
      primary: "Import 428 records",
      secondary: "Cancel",
    },
    safety: [
      {
        title: "Rollback",
        text: "Every import is its own event. One move and all of its profiles are gone, while everything that was in the base before it stays untouched.",
      },
      {
        title: "Trail",
        text: "A profile shows which file it came from, when, and who confirmed that import.",
      },
      {
        title: "Access",
        text: "Only the person who runs the database sees the file. A group leader never receives other people's contacts along with a spreadsheet.",
      },
    ],
    quote: {
      text: "A whole church database out of Google Sheets in three days. Duplicates were flagged before the import ran.",
      author: "Database migration — New Life church, Cherkasy",
      link: "Their story",
    },
  },

  after: {
    eyebrow: "After the import",
    title: "The base is alive from day one",
    text:
      "The next day leaders see their groups, the welcome desk finds a person in seconds and the pastor sees the whole church. Without a month of typing.",
    items: [
      { module: "People", text: "428 profiles with statuses, contacts and notes", href: "/modules/people" },
      { module: "Family", text: "96 families: spouses, children, addresses, dates", href: "/modules/family" },
      { module: "Small groups", text: "18 groups with their members and leaders", href: "/modules/groups" },
      { module: "Ministries", text: "11 teams with roles and a rota", href: "/modules/ministries" },
      { module: "Analytics", text: "the first read on the church — with no manual row", href: "/modules/analytics" },
    ],
    note: "From there the base fills itself: attendance from groups, guest forms, event signups.",
  },
};

export const IMPORT_COPY: Record<Lang, ImportCopy> = { ua, en };
