import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-obraty-systemu-dlia-tserkvy",
  category: "choice",
  date: "2026-09-16",
  updated: "2026-09-30",
  /* Запит «церковна СРМ» тримає окрема стаття, тож тут на неї лише посилання в «Читати далі». */
  related: ["vasha-tserkva-unikalna", "piat-pytan-pro-systemu", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "Як обрати систему для церкви: 12 запитань перед вибором",
      seoDescription:
        "Критерії вибору програми для церкви: мова, гнучкість, ролі, імпорт, мобільність, ціна й підтримка. Що перевірити на демо й де зазвичай ховаються проблеми.",
      title: "Як обрати систему управління церквою",
      lead: "Систему для церкви обирають раз на кілька років, а живуть із нею щодня. Тому важливіші не списки можливостей, а відповіді на дванадцять незручних запитань.",
      keywords: [
        "система управління церквою",
        "як обрати програму для церкви",
        "як обрати систему для церкви",
        "порівняння систем для церкви",
        "впровадження програми в церкві",
      ],
      problem: {
        title: "Обрали за списком можливостей — і не користуються",
        text: "Система вміє все: від обліку до розсилок. Через три місяці в ній працює один адміністратор, лідери повернулись у чат, а дані знову в таблиці.",
      },
      sections: [
        {
          heading: "Почніть зі своїх процесів",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Випишіть п'ять щотижневих дій", text: "Наприклад: відмітка явки, графік служіння, робота з гостями, заявки, зведення для пастора." },
                { title: "Позначте, хто їх робить", text: "Лідер групи, керівник служіння, адміністратор, пастор. Це ваші майбутні ролі в системі." },
                { title: "Порахуйте, скільки часу вони займають зараз", text: "Без цього числа ви не побачите, чи стало краще." },
                { title: "І тільки тоді дивіться системи", text: "На кожному демо пройдіть ці п'ять дій крок за кроком." },
              ],
            },
          ],
        },
        {
          heading: "Дванадцять запитань, які варто поставити",
          blocks: [
            {
              kind: "list",
              title: "Про щоденну роботу",
              items: [
                "Скільки дотиків потрібно лідеру, щоб відмітити явку?",
                "Чи працює все потрібне лідеру з телефона і що для цього треба встановити?",
                "Чи бачить лідер лише свою групу?",
                "Що бачить пастор і чи готується цей екран автоматично?",
              ],
            },
            {
              kind: "list",
              title: "Про дані й гнучкість",
              items: [
                "Чи можна змінити назви під наш словник і додати свої поля та етапи без розробника?",
                "Як імпортуються наші таблиці й чи можна скасувати імпорт?",
                "Де зберігаються дані людей, хто має до них доступ і як часто робляться резервні копії?",
                "Чи можемо ми вивантажити свої дані, якщо підемо?",
              ],
            },
            {
              kind: "list",
              title: "Про роботу з нами",
              items: [
                "Чи є інтерфейс і підтримка українською?",
                "Хто допомагає на старті й скільки це коштує?",
                "Як швидко відповідає підтримка й у якому каналі?",
                "Що входить у ціну, а що рахується окремо?",
              ],
            },
            {
              kind: "text",
              text: "Про гнучкість докладніше в статті [«Ваша церква унікальна»](/blog/vasha-tserkva-unikalna), а наші відповіді про ціну — на сторінці [«Вартість»](/pricing).",
            },
          ],
        },
        {
          heading: "Що перевірити на демо",
          blocks: [
            {
              kind: "table",
              columns: ["Перевірка", "Як робити", "На що дивитись"],
              rows: [
                ["Ваші дані", "Попросіть завантажити фрагмент вашої таблиці", "Скільки часу й ручної роботи"],
                ["Роль лідера", "Попросіть показати екран лідера групи", "Чи немає там зайвого"],
                ["Щотижнева дія", "Відмітьте явку самі", "Скільки кроків"],
                ["Зміна назви", "Попросіть перейменувати «малу групу» при вас", "Чи це налаштування, чи розробка"],
              ],
            },
            {
              kind: "callout",
              title: "Демо на ваших даних варте десяти презентацій",
              text: "Беріть фрагмент із дублями й порожніми полями: у презентаціях таких не буває.",
            },
          ],
        },
        {
          heading: "Червоні прапорці",
          blocks: [
            {
              kind: "list",
              items: [
                "«Налаштуємо все під вас за окрему плату»: далі платна кожна дрібниця.",
                "Немає ролей: усі бачать усе.",
                "Немає експорту даних.",
                "Пів року впровадження до першої відмітки явки.",
                "Підтримка лише поштою й лише іноземною мовою.",
              ],
            },
          ],
        },
        {
          heading: "Скільки має тривати впровадження",
          blocks: [
            {
              kind: "list",
              items: [
                "Запуск: тиждень-два до першої реальної відмітки явки.",
                "Перенесення даних: кілька днів.",
                "Навчання лідера: 15 хвилин на щотижневі дії.",
                "Повне впровадження: місяць, модулі вмикаються по одному.",
              ],
            },
            {
              kind: "solution",
              title: "Розклад перших двох тижнів",
              text: "Приклад: група вперше відмічає явку в системі на дев'ятий день від першої розмови.",
              spec: {
                kind: "timeline",
                title: "Від демо до першої відмітки",
                subtitle: "Дні від першої розмови",
                items: [
                  { time: "1-й", title: "Демо на своїх даних", who: "Пастор і адміністратор", done: true },
                  { time: "3-й", title: "Перенесли список людей", who: "Адміністратор", done: true },
                  { time: "5-й", title: "Лідери отримали доступ", who: "12 лідерів", done: true },
                  { time: "9-й", title: "Перша відмітка явки в групі", who: "Одна мала група" },
                  { time: "14-й", title: "Тиждень без паралельної таблиці" },
                ],
              },
              link: { label: "Як ми впроваджуємо", href: "/consulting" },
            },
            {
              kind: "text",
              text: "Якщо до першого реального використання минає більше місяця, впровадження зупиняється навіть із доброю системою: ентузіазм команди має свій термін.",
            },
          ],
        },
      ],
      takeaways: [
        "Мірило вибору — ваші п'ять щотижневих дій і час, який вони забирають зараз.",
        "На демо завантажте свою таблицю й відмітьте явку з екрана лідера.",
        "Немає ролей чи експорту даних — розмову можна закінчувати.",
        "Перша відмітка явки за два тижні — норма, за пів року — червоний прапорець.",
      ],
      faq: [
        {
          q: "Скільки систем варто порівняти?",
          a: "Дві-три. Більше — і порівняння стає дослідженням, яке не закінчується рішенням.",
        },
        {
          q: "Чи важлива українська мова інтерфейсу?",
          a: "Так, якщо системою мають користуватися лідери груп. Кожне незрозуміле слово — мінус кілька людей у системі.",
        },
        {
          q: "Що робити, якщо частина команди проти змін?",
          a: "Почніть із тих, кому система одразу полегшує тиждень: зазвичай це лідери груп. Успіх однієї групи переконує решту краще за будь-яку презентацію.",
        },
      ],
      cta: {
        title: "Подивіться, як це влаштовано",
        text: "Модулі, ролі й налаштування, а демо — на ваших даних.",
        label: "Подивитись модулі",
        href: "/modules",
      },
    },
    en: {
      seoTitle: "Choosing church management software: 12 questions",
      seoDescription:
        "Criteria for choosing church software: language, flexibility, roles, import, mobile use, price and support. What to test in a demo and where problems hide.",
      title: "How to choose a church management system",
      lead: "You choose church software once every few years and live with it daily. So feature lists matter less than the answers to twelve awkward questions.",
      keywords: [
        "church management software",
        "choosing church software",
        "church CRM comparison",
        "ChMS selection",
        "church software implementation",
      ],
      problem: {
        title: "Chosen on features, then unused",
        text: "The system can do everything, from records to mailings. Three months later one administrator uses it, leaders are back in the chat and the data is in a spreadsheet again.",
      },
      sections: [
        {
          heading: "Start with your processes",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "List five weekly actions", text: "Attendance, rota, guest follow-up, requests, the pastor's summary." },
                { title: "Note who does them", text: "Group leader, ministry lead, administrator, pastor. Those are your future roles." },
                { title: "Measure how long they take now", text: "Without that number you cannot tell whether anything improved." },
                { title: "Only then look at systems", text: "In every demo, walk through those five actions step by step." },
              ],
            },
          ],
        },
        {
          heading: "Twelve questions to ask",
          blocks: [
            {
              kind: "list",
              title: "About daily work",
              items: [
                "How many taps does a leader need to mark attendance?",
                "Does everything a leader needs work from a phone, and what has to be installed for it?",
                "Does a leader see only their own group?",
                "What does the pastor see, and is that screen built automatically?",
              ],
            },
            {
              kind: "list",
              title: "About data and flexibility",
              items: [
                "Can names be changed to our vocabulary and our own fields and stages added without a developer?",
                "How are our spreadsheets imported, and can an import be undone?",
                "Where is people's data stored, who can access it, and how often is it backed up?",
                "Can we export our data if we leave?",
              ],
            },
            {
              kind: "list",
              title: "About working with us",
              items: [
                "Is the interface and support available in our language?",
                "Who helps at launch, and what does it cost?",
                "How fast does support reply, and through which channel?",
                "What is included in the price and what is billed separately?",
              ],
            },
            {
              kind: "text",
              text: "More on flexibility in [Your church is unique](/blog/vasha-tserkva-unikalna); our own answers on price are on the [pricing page](/pricing).",
            },
          ],
        },
        {
          heading: "What to test in the demo",
          blocks: [
            {
              kind: "table",
              columns: ["Test", "How", "What to watch"],
              rows: [
                ["Your data", "Ask them to load a slice of your spreadsheet", "Time and manual work involved"],
                ["The leader role", "Ask to see a group leader's screen", "Anything they should not see"],
                ["A weekly action", "Mark attendance yourself", "Number of steps"],
                ["Renaming", "Ask them to rename small group while you watch", "Configuration or development?"],
              ],
            },
            {
              kind: "callout",
              title: "A demo on your data beats ten presentations",
              text: "Bring a slice with duplicates and empty fields: presentations never have them.",
            },
          ],
        },
        {
          heading: "Red flags",
          blocks: [
            {
              kind: "list",
              items: [
                "“We will configure everything for you for an extra fee”: then every detail costs extra.",
                "No roles: everyone sees everything.",
                "No data export.",
                "Six months of implementation before the first attendance mark.",
                "Support by email only, and only in a foreign language.",
              ],
            },
          ],
        },
        {
          heading: "How long rollout should take",
          blocks: [
            {
              kind: "list",
              items: [
                "Launch: a week or two until the first real attendance mark.",
                "Data migration: a few days.",
                "Training a leader: fifteen minutes for the weekly actions.",
                "Full rollout: a month, switching modules on one at a time.",
              ],
            },
            {
              kind: "solution",
              title: "The first two weeks",
              text: "Example: a group first marks attendance in the system on day nine after the first conversation.",
              spec: {
                kind: "timeline",
                title: "From demo to the first mark",
                subtitle: "Days from the first conversation",
                items: [
                  { time: "Day 1", title: "Demo on your own data", who: "Pastor and administrator", done: true },
                  { time: "Day 3", title: "People list migrated", who: "Administrator", done: true },
                  { time: "Day 5", title: "Leaders have access", who: "12 leaders", done: true },
                  { time: "Day 9", title: "First attendance mark in a group", who: "One small group" },
                  { time: "Day 14", title: "A week with no parallel spreadsheet" },
                ],
              },
              link: { label: "How we roll out", href: "/consulting" },
            },
            {
              kind: "text",
              text: "If first real use is more than a month away, the rollout stalls even with a good system: team enthusiasm has a shelf life.",
            },
          ],
        },
      ],
      takeaways: [
        "Judge every system by your five weekly actions.",
        "In a demo, load your spreadsheet and mark attendance as a leader.",
        "No roles or no export: end the conversation.",
        "A first attendance mark within two weeks is normal; six months is a red flag.",
      ],
      faq: [
        {
          q: "How many systems should we compare?",
          a: "Two or three. Beyond that, comparing turns into research that never ends in a decision.",
        },
        {
          q: "Does the interface language matter?",
          a: "Yes, if group leaders are meant to use the system. Every unclear word loses you a few people.",
        },
        {
          q: "What if part of the team resists?",
          a: "Start with those who gain right away, usually group leaders. One group's success convinces the rest better than any presentation.",
        },
      ],
      cta: {
        title: "See how it is built",
        text: "Modules, roles and configuration, and a demo on your own data.",
        label: "Explore modules",
        href: "/modules",
      },
    },
  },
};
