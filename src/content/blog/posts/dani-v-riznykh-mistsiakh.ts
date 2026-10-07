import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "dani-v-riznykh-mistsiakh",
  category: "data",
  date: "2026-08-18",
  updated: "2026-09-30",
  related: ["piat-pytan-pro-systemu", "yak-obraty-systemu-dlia-tserkvy", "stavte-tsili"],
  copy: {
    ua: {
      seoTitle: "Дані церкви в п'яти місцях: чому інформація губиться",
      seoDescription:
        "Таблиці, чати, зошити й пам'ять лідерів — чому церква втрачає інформацію, навіть коли її нібито зберігають, і як звести все в один простір.",
      title: "Дані церкви в п'яти місцях: як їх звести й не загубити",
      lead: "Дані церкви рідко зникають повністю. Частіше вони є, але в чужому файлі, закритому чаті чи пам'яті людини, яка сьогодні не на зв'язку.",
      keywords: [
        "дані церкви в таблицях",
        "як зберігати інформацію про членів церкви",
        "єдина база церкви",
        "облік у церкві в Excel",
        "де зберігати контакти церкви",
      ],
      problem: {
        title: "«Це у Валі в таблиці»",
        text: "Як зв'язатися з родиною, яка минулого місяця просила про допомогу? Відповідь: у Валі. Валя у відпустці, файл у неї на комп'ютері, а копія в чаті ще з березня.",
      },
      sections: [
        {
          heading: "Де лежать дані типової церкви",
          blocks: [
            {
              kind: "table",
              columns: ["Де зберігається", "Що саме", "Чому це проблема"],
              rows: [
                ["Таблиця адміністратора", "Контакти, дні народження", "Одна копія, немає історії змін"],
                ["Чати лідерів", "Молитовні потреби, заміни", "Зникає під новими повідомленнями"],
                ["Зошит служіння", "Графік і присутність", "Недоступний нікому, крім власника"],
                ["Форми на сайті", "Заявки й реєстрації", "Приходять на пошту й там залишаються"],
                ["Пам'ять лідерів", "Контекст і домовленості", "Йде разом з людиною"],
              ],
            },
            {
              kind: "text",
              text: "Поодинці кожне місце працює. Біда в тому, що вони не зустрічаються: родина Ковальчуків є в таблиці, її заявка про допомогу лежить у пошті, а про що з нею домовились, пам'ятає лише лідер групи.",
            },
            {
              kind: "solution",
              title: "Одна картка людини",
              text:
                "Контакт, сім'я, група, присутність і звернення стоять в одному записі, і кожен, кому дозволено, відкриває його без прохання «скинь файл».",
              spec: {
                kind: "list",
                title: "Люди",
                subtitle: "Один список замість п'яти таблиць",
                items: [
                  { title: "Олена Гнатюк", sub: "Група «Витоки» · четвертий рік у церкві", meta: "Була минулої неділі", badge: { label: "Член церкви", tone: "brand" } },
                  { title: "Родина Ковальчуків", sub: "Четверо · звернення про допомогу", meta: "Відповідальний: Тарас", badge: { label: "В роботі", tone: "amber" } },
                  { title: "Андрій Пилипенко", sub: "Служіння звуку · неділя", meta: "Графік на місяць", badge: { label: "Служитель", tone: "violet" } },
                  { title: "Марія Дідух", sub: "Гостя, другий тиждень", meta: "Ще без групи", badge: { label: "Новенька", tone: "green" } },
                ],
                footer: "Кожна зміна лишає слід: видно, хто і коли оновив запис.",
              },
              link: { label: "Модуль «Люди»", href: "/modules/people" },
            },
          ],
        },
        {
          heading: "Чого це коштує церкві",
          blocks: [
            {
              kind: "list",
              items: [
                "Подвійна робота: ту саму людину питають про контакти тричі за рік.",
                "Прохання без відповідального: кожен думає, що родині вже зателефонував хтось інший.",
                "Служіння не передати: новий лідер отримує посилання на чат, а історію людей збирає розпитами.",
              ],
            },
            { kind: "quote", text: "Дані в п'яти місцях — це нуль місць, коли вони потрібні." },
          ],
        },
        {
          heading: "Як переносити: одне джерело за раз",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Візьміть найповніше джерело", text: "Зазвичай це таблиця адміністратора. Решту додавайте до неї по одному." },
                { title: "Домовтесь про слова до переносу", text: "Хто для вас «член церкви», а хто «регулярний відвідувач»; які є статуси й групи. Інакше в одній базі зійдуться п'ять різних визначень." },
                { title: "Почистіть дублікати", text: "Та сама людина як «Олена Гнатюк» і «Гнатюк О.» з двома номерами — найчастіша знахідка першого імпорту. Злити їх до завантаження простіше, ніж після." },
                { title: "Перевірте на десяти людях", text: "Відкрийте десять карток і звірте з джерелом телефон, сім'ю й групу. Помилку в зіставленні колонок видно одразу." },
                { title: "Закрийте старе того ж дня", text: "Старий файл стає архівом тільки для читання. Поки його можна правити, хтось туди допише, і копій знову дві." },
              ],
            },
            {
              kind: "visual",
              caption:
                "П'ять джерел сходяться в картку людини: біля кожного імені одразу видно групу, звернення чи служіння. Питати, в кого останній файл, більше не треба.",
              visual: {
                type: "merge",
                title: "П'ять місць, з яких збирають одне й те саме",
                sources: ["Таблиця адміністратора", "Чати лідерів", "Зошит служіння", "Форми на сайті", "Пам'ять лідерів"],
                target: {
                  title: "Картка людини",
                  rows: [
                    { title: "Олена Гнатюк", meta: "Група «Витоки»" },
                    { title: "Родина Ковальчуків", meta: "Звернення, в роботі" },
                    { title: "Андрій Пилипенко", meta: "Служіння звуку" },
                    { title: "Марія Дідух", meta: "Гостя, другий тиждень" },
                  ],
                },
              },
            },
            {
              kind: "text",
              text: "Що зводити першим (людей, відвідуваність, служіння чи заявки), підкаже перевірка зі статті [«П'ять питань, які показують, чи є у вас система»](/blog/piat-pytan-pro-systemu). Як «Моя Церква» зіставляє колонки й показує дублікати ще до завантаження, видно на сторінці [імпорту](/import).",
            },
          ],
        },
        {
          heading: "Як не повернутися до таблиць за пів року",
          blocks: [
            {
              kind: "list",
              items: [
                "Якщо чогось немає в системі, цього не існує. Навіть коли «в чаті зручніше».",
                "Дайте лідерам право вносити зміни: якщо оновлює лише Валя, дані застигають, щойно вона йде у відпустку.",
                "Раз на квартал шукайте нову тіньову таблицю. Вона майже завжди є і підказує, чого бракує в системі.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Шкодить не кількість інструментів, а те, що вони між собою не пов'язані.",
        "Зводити всі п'ять джерел одночасно — прямий шлях до двох паралельних систем.",
        "Старий файл, який ще можна правити, стає другою копією.",
        "Тіньова таблиця — готовий список того, чого бракує в системі.",
      ],
      faq: [
        {
          q: "А якщо лідерам зручніше в чаті?",
          a: "Хай спілкуються в чаті, забороняти його не треба. Але все, що має пережити тиждень, записують у систему: заявку, відмітку, домовленість.",
        },
        {
          q: "Що робити з архівом старих таблиць?",
          a: "Актуальне імпортуйте, решту збережіть як архів тільки для читання: не видаляйте й не редагуйте.",
        },
        {
          q: "Скільки часу займає зведення даних?",
          a: "Зазвичай кілька тижнів. Сам імпорт триває години, решту часу забирають домовленості про визначення й чистка списків.",
        },
      ],
      cta: {
        title: "Зведіть дані в один простір",
        text: "Імпорт з таблиць, зіставлення полів і перевірка перед завантаженням.",
        label: "Як працює імпорт",
        href: "/import",
      },
    },
    en: {
      seoTitle: "Church data in five places: why information gets lost",
      seoDescription:
        "Spreadsheets, chats, notebooks and leaders' memory — why churches lose information even when it is stored, and how to bring it into one place.",
      title: "Church data in five places: how to bring it together",
      lead: "Church data rarely vanishes. More often it is there, but in someone else's file, a closed chat or the memory of someone offline today.",
      keywords: [
        "church data in spreadsheets",
        "single church database",
        "storing church member information",
        "church records management",
        "church contact list",
      ],
      problem: {
        title: "“It's in Valia's spreadsheet”",
        text: "How do we reach the family that asked for help last month? Ask Valia. Valia is on holiday, the file is on her laptop, and the copy in the chat is from March.",
      },
      sections: [
        {
          heading: "Where a typical church keeps its data",
          blocks: [
            {
              kind: "table",
              columns: ["Where", "What", "Why it hurts"],
              rows: [
                ["Administrator's spreadsheet", "Contacts, birthdays", "One copy, no change history"],
                ["Leaders' chats", "Prayer needs, swaps", "Buried under newer messages"],
                ["A ministry notebook", "Rota and attendance", "Available to nobody but the owner"],
                ["Website forms", "Requests and sign-ups", "Arrive by email and stay there"],
                ["Leaders' memory", "Context and agreements", "Leaves with the person"],
              ],
            },
            {
              kind: "text",
              text: "Each place works on its own; they just never meet. The Kovalchuk family is in the spreadsheet, their request for help in the inbox, and only a group leader remembers what was agreed with them.",
            },
            {
              kind: "solution",
              title: "One person, one record",
              text:
                "Contact, family, group, attendance and requests sit in one record that anyone with access can open, no “send me the file” needed.",
              spec: {
                kind: "list",
                title: "People",
                subtitle: "One list instead of five spreadsheets",
                items: [
                  { title: "Olena Hnatiuk", sub: "Roots group · fourth year in church", meta: "In last Sunday", badge: { label: "Member", tone: "brand" } },
                  { title: "The Kovalchuk family", sub: "Four people · request for help", meta: "Owner: Taras", badge: { label: "In progress", tone: "amber" } },
                  { title: "Andrii Pylypenko", sub: "Sound ministry · Sundays", meta: "Rota for the month", badge: { label: "Serving", tone: "violet" } },
                  { title: "Mariia Didukh", sub: "Guest, second week", meta: "No group yet", badge: { label: "New", tone: "green" } },
                ],
                footer: "Every change leaves a trace: who updated the record, and when.",
              },
              link: { label: "The People module", href: "/modules/people" },
            },
          ],
        },
        {
          heading: "What it costs the church",
          blocks: [
            {
              kind: "list",
              items: [
                "Duplicated work: the same person gives their contact details three times a year.",
                "Requests without an owner: everyone assumes someone else has already called the family.",
                "No handover: a new leader gets a link to the chat and learns people's history by asking around.",
              ],
            },
            { kind: "quote", text: "Data in five places is data in no place when you need it." },
          ],
        },
        {
          heading: "How to migrate: one source at a time",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Take the fullest source", text: "Usually the administrator's spreadsheet. Add the others to it one at a time." },
                { title: "Agree on words before you move", text: "Who counts as a “member” and who as a “regular attender”; which statuses and groups exist. Otherwise one database ends up with five definitions." },
                { title: "Clean up duplicates", text: "The same person as “Olena Hnatiuk” and “Hnatiuk O.”, with two phone numbers, is the most common find of a first import. Merging before the upload is easier than after." },
                { title: "Check ten people", text: "Open ten records and compare phone, family and group with the source. A wrong column mapping shows up at once." },
                { title: "Close the old source the same day", text: "The old file becomes a read-only archive. While it is editable, someone will add to it and you have two copies again." },
              ],
            },
            {
              kind: "visual",
              caption:
                "Five sources flow into one person record, with the group, request or ministry beside each name. Nobody asks who has the latest file.",
              visual: {
                type: "merge",
                title: "Five places holding the same thing",
                sources: ["Admin spreadsheet", "Leader chats", "Ministry notebook", "Website forms", "What leaders remember"],
                target: {
                  title: "Person record",
                  rows: [
                    { title: "Olena Hnatiuk", meta: "Roots group" },
                    { title: "The Kovalchuk family", meta: "Request, in progress" },
                    { title: "Andrii Pylypenko", meta: "Sound team" },
                    { title: "Mariia Didukh", meta: "Guest, second week" },
                  ],
                },
              },
            },
            {
              kind: "text",
              text: "[Five questions that show whether you have a system](/blog/piat-pytan-pro-systemu) tells you what to bring over first: people, attendance, ministries or requests. The [import page](/import) shows how My Church maps columns and flags duplicates before the upload.",
            },
          ],
        },
        {
          heading: "How not to slide back to spreadsheets in six months",
          blocks: [
            {
              kind: "list",
              items: [
                "If it is not in the system, it does not exist. Even when “the chat is easier”.",
                "Let leaders make changes: if only Valia can update the data, it freezes the moment she goes on holiday.",
                "Once a quarter, look for a new shadow spreadsheet. There almost always is one, and it shows what the system lacks.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "What hurts is not the number of tools but the lack of links between them.",
        "Merging all five sources at once leads straight to two parallel systems.",
        "An old file that can still be edited becomes a second copy.",
        "A shadow spreadsheet is a ready-made list of what the system lacks.",
      ],
      faq: [
        {
          q: "What if leaders prefer the chat?",
          a: "Keep it for talking; there is no need to ban it. But anything that must outlive the week goes into the system: a request, a mark, an agreement.",
        },
        {
          q: "What about the archive of old spreadsheets?",
          a: "Import what is current and keep the rest as a read-only archive: no deleting, no editing.",
        },
        {
          q: "How long does consolidation take?",
          a: "Usually a few weeks. The import itself takes hours; agreeing definitions and cleaning lists takes the rest.",
        },
      ],
      cta: {
        title: "Bring the data into one space",
        text: "Import from spreadsheets, field mapping and a review step before anything is written.",
        label: "How import works",
        href: "/import",
      },
    },
  },
};
