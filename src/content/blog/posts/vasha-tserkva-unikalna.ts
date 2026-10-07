import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "vasha-tserkva-unikalna",
  category: "process",
  date: "2026-09-18",
  updated: "2026-09-30",
  related: ["yak-obraty-systemu-dlia-tserkvy", "dani-v-riznykh-mistsiakh", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Ваша церква унікальна: система має підлаштуватись під вас",
      seoDescription:
        "Чому церкві не варто ламати свої процеси заради програми: що можна налаштувати під себе, а що дійсно варто змінити, і як перевірити це до впровадження.",
      title: "Ваша церква унікальна — не підлаштовуйтесь під систему",
      lead: "Назви служінь, структура, шлях людини, навіть те, кого ви вважаєте членом церкви, — у кожній громаді своє. Система, яка вимагає це переписати, коштуватиме вам більше, ніж здається.",
      keywords: [
        "налаштування системи під церкву",
        "гнучка система для церкви",
        "своя структура церкви в програмі",
        "впровадження системи в церкві",
        "система під процеси церкви",
      ],
      problem: {
        title: "Програма диктує, як має жити громада",
        text: "У програмі людина буває лише «учасником» або «гостем», а у вас — п'ять станів. Там є тільки «групи», а у вас — домашні групи, домашні церкви й молодіжні команди. Щоразу доводиться пояснювати лідерам, чому в програмі все називається не так, як у житті.",
      },
      sections: [
        {
          heading: "Що в кожній церкві своє",
          blocks: [
            {
              kind: "list",
              items: [
                "Назви: служіння, домашні групи, покоління, спільноти — словник громади складався роками.",
                "Структура: один зал, кілька кампусів, мережа домашніх церков, служіння в кількох містах.",
                "Шлях людини: у когось курс перед членством, у когось хрещення, у когось наставництво.",
                "Ролі та доступи: де пастор бачить усе, а де свідомо ні.",
                "Ритм року: сезони, табори, свята, які не збігаються ні з чиїм шаблоном.",
              ],
            },
            {
              kind: "text",
              text: "З цього складається ідентичність громади. Лідер домашньої церкви, який бачить у програмі «малу групу», вирішує, що система чужа, і відкриває її дедалі рідше.",
            },
          ],
        },
        {
          heading: "Що варто змінити, а що залишити",
          blocks: [
            {
              kind: "table",
              columns: ["Що", "Підлаштовуємо систему", "Змінюємо практику"],
              rows: [
                ["Назви й словник", "Так, завжди", "—"],
                ["Етапи шляху людини", "Так", "—"],
                ["Структура громади", "Так", "—"],
                ["Дані у п'яти таблицях", "—", "Так: один список людей"],
                ["Усні домовленості замість графіка", "—", "Так: графік у спільному місці"],
                ["Доступ «у всіх до всього»", "—", "Так: ролі й межі"],
              ],
            },
            {
              kind: "quote",
              text: "Безлад не унікальний: він однаковий у всіх.",
            },
          ],
        },
        {
          heading: "Чотири питання до впровадження",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Чи можна змінити назви?", text: "Якщо «мала група» ніяк не стане «домашньою церквою», уся подальша робота йтиме проти вашого словника." },
                { title: "Чи можна додати свої поля?", text: "У кожної церкви є те, що вона обов'язково фіксує: рік хрещення, місто, волонтерська згода." },
                { title: "Чи можна змінити етапи?", text: "Шлях у системі має збігатися з тим, яким людина йде у вашій громаді." },
                { title: "Що станеться, якщо ми передумаємо?", text: "Попросіть на демо додати етап посередині шляху, де вже є люди. Гнучкість перевіряється на другій зміні рішення." },
              ],
            },
            {
              kind: "text",
              text: "Питання про ролі, перенесення таблиць, телефон лідера й підтримку зібрані в статті [«Як обрати систему управління церквою»](/blog/yak-obraty-systemu-dlia-tserkvy).",
            },
          ],
        },
        {
          heading: "Гнучкість не означає «зроблю все з нуля»",
          blocks: [
            {
              kind: "text",
              text: "Хороша система дає готові модулі, а ви налаштовуєте в них назви, поля, етапи, ролі й звіти. Якщо ж кожну дрібницю доводиться будувати з нуля, розробник переклав свою роботу на вас.",
            },
            {
              kind: "callout",
              title: "Орієнтир",
              text: "Типова церква має запуститися на готових модулях приблизно за тиждень, а під себе налаштовуватися поступово, без програміста.",
            },
          ],
        },
        {
          heading: "Як це працює в «Моїй Церкві»",
          blocks: [
            {
              kind: "solution",
              title: "Ваші назви, ваші етапи",
              text:
                "Словник і етапи тут задає громада: перейменували малі групи на «домашні», і ця назва стоїть усюди, без програміста.",
              spec: {
                kind: "form",
                title: "Налаштування громади",
                subtitle: "Словник і етапи — ваші",
                fields: [
                  { label: "Як ви називаєте малі групи", value: "Домашні групи", type: "text" },
                  { label: "Як ви називаєте гостя", value: "Новий друг", type: "text" },
                  { label: "Етапи шляху людини", value: "Гість → Домашня група → Хрещення → Служіння", type: "select" },
                  { label: "Структура", value: "Дві локації, спільні служіння", type: "select" },
                  { label: "Членство ведемо окремо", value: "Так", type: "check" },
                ],
                submit: "Зберегти",
              },
              link: { label: "Модуль «Налаштування»", href: "/modules/customization" },
            },
            {
              kind: "text",
              text: "Модулі вмикаються окремо: беріть лише те, що громаді потрібно зараз. Ролі й доступи налаштовуються під вашу структуру, від однієї церкви до мережі кампусів.",
            },
          ],
        },
      ],
      takeaways: [
        "Назви, структуру й шлях людини не ламайте: під них налаштовують систему.",
        "П'ять таблиць, усні домовленості й доступ «у всіх до всього» варто змінити.",
        "Гнучкість видно, коли громада передумала, а люди вже в системі.",
        "Близько тижня на запуск, далі поступові правки без програміста.",
      ],
      faq: [
        {
          q: "Чи не стане надмірна гнучкість джерелом хаосу?",
          a: "Стане, якщо міняти все одразу. Почніть із базової конфігурації, поживіть із нею місяць і змініть лише те, що заважає.",
        },
        {
          q: "Хто має відповідати за налаштування?",
          a: "Одна людина в церкві: адміністратор системи. Комітет узгоджує назви довше, ніж триває саме впровадження.",
        },
        {
          q: "Що робити, якщо в нас кілька церков у мережі?",
          a: "Спільна структура з окремими кампусами: спільні довідники й ролі, але свої люди, групи й звіти в кожної локації.",
        },
      ],
      cta: {
        title: "Подивіться, що налаштовується",
        text: "Модулі, назви, поля, етапи й ролі — під вашу церкву.",
        label: "Модуль «Налаштування»",
        href: "/modules/customization",
      },
    },
    en: {
      seoTitle: "Your church is unique: the system should adapt to you",
      seoDescription:
        "Why a church should not rewrite its processes for software: what to configure, what genuinely needs changing, and how to test it before you commit.",
      title: "Your church is unique — do not bend to the software",
      lead: "Ministry names, structure, the path a person walks, even who counts as a member: every church does it differently. Software that demands you rewrite that costs more than you think.",
      keywords: [
        "configurable church software",
        "flexible church management system",
        "custom church structure software",
        "church software implementation",
        "church database custom fields",
      ],
      problem: {
        title: "The software dictates how the church should live",
        text: "The system has members and visitors; you have five states. It has groups; you have groups, house churches and youth teams. Every time, leaders have to be told why nothing is called what they call it.",
      },
      sections: [
        {
          heading: "What every church does its own way",
          blocks: [
            {
              kind: "list",
              items: [
                "Vocabulary: ministries, house groups, generations, communities — built over years.",
                "Structure: one room, several campuses, a network of house churches, work in several cities.",
                "The path of a person: a course before membership here, baptism there, mentoring elsewhere.",
                "Roles and access: where the pastor sees everything and where deliberately not.",
                "The rhythm of the year: seasons, camps and feasts that match nobody's template.",
              ],
            },
            {
              kind: "text",
              text: "This is the church's identity. A house church leader who sees “small group” in the software decides it belongs to someone else, and opens it less and less.",
            },
          ],
        },
        {
          heading: "What to change and what to keep",
          blocks: [
            {
              kind: "table",
              columns: ["Area", "Adapt the system", "Change the practice"],
              rows: [
                ["Names and vocabulary", "Always", "—"],
                ["Stages of the path", "Yes", "—"],
                ["Church structure", "Yes", "—"],
                ["Data in five spreadsheets", "—", "Yes: one list of people"],
                ["Verbal agreements instead of a rota", "—", "Yes: a shared rota"],
                ["Everyone can see everything", "—", "Yes: roles and boundaries"],
              ],
            },
            {
              kind: "quote",
              text: "Mess is not unique: it looks the same everywhere.",
            },
          ],
        },
        {
          heading: "Four questions before you commit",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Can we rename things?", text: "If “small group” can never become “house church”, everything afterwards fights your vocabulary." },
                { title: "Can we add our own fields?", text: "Every church records something specific: year of baptism, city, volunteer consent." },
                { title: "Can stages be changed?", text: "The path in the system should match the one people walk in your church." },
                { title: "What if we change our minds?", text: "In the demo, ask them to insert a stage into a path people are already on. Flexibility is tested on the second change of mind." },
              ],
            },
            {
              kind: "text",
              text: "Roles, spreadsheet import, the leader's phone and support are covered in [How to choose a church management system](/blog/yak-obraty-systemu-dlia-tserkvy).",
            },
          ],
        },
        {
          heading: "Flexible does not mean build it yourself",
          blocks: [
            {
              kind: "text",
              text: "Good software ships ready modules; you configure their names, fields, stages, roles and reports. If every small thing must be built from scratch, the vendor has handed its work to you.",
            },
            {
              kind: "callout",
              title: "A benchmark",
              text: "A typical church should go live on ready modules in about a week, then tune things gradually, without a developer.",
            },
          ],
        },
        {
          heading: "How My Church handles it",
          blocks: [
            {
              kind: "solution",
              title: "Your labels, your stages",
              text:
                "The church sets vocabulary and stages here: rename small groups “home groups” and that name appears everywhere, no developer needed.",
              spec: {
                kind: "form",
                title: "Church setup",
                subtitle: "Your vocabulary, your stages",
                fields: [
                  { label: "What you call small groups", value: "Home groups", type: "text" },
                  { label: "What you call a guest", value: "New friend", type: "text" },
                  { label: "Stages of the path", value: "Guest → Home group → Baptism → Ministry", type: "select" },
                  { label: "Structure", value: "Two locations, shared ministries", type: "select" },
                  { label: "Membership tracked separately", value: "Yes", type: "check" },
                ],
                submit: "Save",
              },
              link: { label: "The customisation module", href: "/modules/customization" },
            },
            {
              kind: "text",
              text: "Modules switch on separately: take only what your church needs now. Roles and access match your structure, from one church to a network of campuses.",
            },
          ],
        },
      ],
      takeaways: [
        "Do not break your names, structure or path: configure the system around them.",
        "Five spreadsheets, verbal agreements and open access to everything are worth changing.",
        "Flexibility shows when the church changes its mind with people already in the system.",
        "About a week to launch, then gradual changes without a developer.",
      ],
      faq: [
        {
          q: "Will too much flexibility create chaos?",
          a: "It will if you change everything at once. Start with a basic setup, live with it for a month, and change only what gets in the way.",
        },
        {
          q: "Who should own the configuration?",
          a: "One person: the system administrator. A committee takes longer to agree on names than the whole rollout.",
        },
        {
          q: "What if we are a network of churches?",
          a: "A shared structure with separate campuses: common directories and roles, but each location with its own people, groups and reports.",
        },
      ],
      cta: {
        title: "See what can be configured",
        text: "Modules, names, fields, stages and roles, shaped to your church.",
        label: "Customisation module",
        href: "/modules/customization",
      },
    },
  },
};
