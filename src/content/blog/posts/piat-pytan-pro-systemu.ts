import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "piat-pytan-pro-systemu",
  category: "process",
  date: "2026-09-19",
  updated: "2026-09-30",
  related: ["vasha-tserkva-unikalna", "dani-v-riznykh-mistsiakh", "yak-obraty-systemu-dlia-tserkvy"],
  copy: {
    ua: {
      seoTitle: "П'ять питань, які показують, чи є в церкві система",
      seoDescription:
        "Простий тест для церкви: п'ять звичайних питань тижня. Якщо відповідь на кожне доводиться шукати в людях і таблицях — системи немає, а є пам'ять кількох людей.",
      title: "П'ять питань, які показують, чи є у вас система",
      lead: "Щоб перевірити, чи є в церкві система, не потрібні ні програма, ні бюджет. Спробуйте відповісти на п'ять звичайних питань тижня і подивіться, звідки беруться відповіді.",
      keywords: [
        "система управління церквою",
        "облік у церкві",
        "як перевірити облік церкви",
        "де зберігати дані церкви",
        "облік відвідуваності в церкві",
      ],
      problem: {
        title: "«Зараз у Наталі спитаю»",
        text: "Це нормальна відповідь у церкві на п'ятдесят людей. У церкві на триста вона означає, що вся картина тримається на кількох людях і зникає разом з їхньою відпусткою, втомою чи переїздом.",
      },
      sections: [
        {
          heading: "Правила тесту: хвилина на питання, без дзвінків",
          blocks: [
            {
              kind: "list",
              title: "Відповідь рахується, якщо вона:",
              items: [
                "Точна: з іменами й датами. «Здається, хтось перестав ходити» не рахується.",
                "Своя: ви знайшли її самі, без дзвінка лідеру.",
                "Швидка: хвилина на питання, без «подивлюсь увечері».",
                "Стала: за тиждень її можна знайти там само.",
              ],
            },
          ],
        },
        {
          heading: "П'ять питань і де зазвичай шукають відповідь",
          blocks: [
            {
              kind: "text",
              text: "Біля кожного питання позначте, звідки взяли відповідь. Якщо з пам'яті, таблиці чи телефону конкретної людини, облік тримається на ній.",
            },
            {
              kind: "table",
              columns: ["Питання", "Де зазвичай шукають відповідь", "Що це означає"],
              rows: [
                [
                  "Хто не був у церкві останні три тижні?",
                  "У пам'яті лідера",
                  "Про людину згадують тоді, коли вона вже не бере слухавку",
                ],
                [
                  "Скільки людей у молодіжці і хто прийшов уперше?",
                  "У таблиці лідера",
                  "Цифру знає одна людина, і вона застаріла",
                ],
                [
                  "Хто служить цієї неділі і чи всі підтвердили?",
                  "У чаті та дзвінках",
                  "Хто випав, з'ясовується вранці в неділю",
                ],
                [
                  "Що люди просили минулого тижня і хто це закрив?",
                  "В особистих повідомленнях",
                  "Половина прохань не має відповідального",
                ],
                [
                  "Що залишиться церкві, коли лідер піде?",
                  "У ноутбуці лідера",
                  "Служіння йде разом з людиною",
                ],
              ],
            },
            {
              kind: "text",
              text: "Жодне з питань не складне. Складно те, що відповіді лежать у п'яти різних місцях, і жодне з них не належить церкві.",
            },
          ],
        },
        {
          heading: "Нуль, два чи п'ять: що означає ваш рахунок",
          blocks: [
            {
              kind: "visual",
              caption:
                "Типовий приклад: відповідь є на два питання з п'яти, про молодіжку і про неділю. Порахуйте свої: сірі питання показують, де облік досі тримається на одній людині.",
              visual: {
                type: "score",
                title: "На скільки питань відповідь уже є в системі",
                totalLabel: "з п'яти",
                items: [
                  { label: "Хто зник на три тижні", ok: false },
                  { label: "Скільки людей у молодіжці", ok: true },
                  { label: "Хто служить цієї неділі", ok: true },
                  { label: "Хто закрив прохання", ok: false },
                  { label: "Що лишиться, коли лідер піде", ok: false },
                ],
              },
            },
            {
              kind: "list",
              items: [
                "Чотири-п'ять: система є, тепер нею мають користуватися всі.",
                "Дві-три: система є в окремих служіннях, але вони не бачать одне одного.",
                "Нуль-одна: усе тримають на собі кілька людей. Так виглядає церква, яка виросла швидше, ніж домовилась, де що записувати.",
              ],
            },
          ],
        },
        {
          heading: "Чому «у голові в лідера» — це не система",
          blocks: [
            {
              kind: "text",
              text: "Пам'ять лідера — найшвидше сховище, поки лідер поруч. Але воно не витримує трьох речей: відпустки, зростання й передачі.",
            },
            {
              kind: "quote",
              text: "Коли людей більше, ніж лідер може тримати в голові, церква втрачає не дані, а людей.",
            },
            {
              kind: "solution",
              title: "Малі групи одним списком",
              text:
                "Те, що лідер зазвичай тримає в голові: коли була зустріч, скільки людей прийшло і де явка падає другий місяць.",
              spec: {
                kind: "table",
                title: "Малі групи",
                subtitle: "Осінній сезон",
                columns: ["Група", "Лідер", "Остання зустріч", "Було"],
                rows: [
                  { cells: ["Витоки", "Олена Ковальчук", "Чт, 19:00", "9 з 12"] },
                  { cells: ["Молодіжна", "Тарас Микитюк", "Пт, 18:30", "14 з 16"] },
                  { cells: ["Сімейна", "Ігор Дідух", "Сб, 17:00", "6 з 10"], badge: { label: "Явка падає", tone: "amber" } },
                  { cells: ["Нові люди", "Ніна Панчук", "Нд, 12:00", "5 з 5"] },
                ],
              },
              link: { label: "Модуль «Малі групи»", href: "/modules/groups" },
            },
            {
              kind: "callout",
              title: "Навіщо облік самому лідерові",
              text: "Щоб не тримати в голові двадцять чотири людини одночасно і спокійно піти у відпустку.",
            },
          ],
        },
        {
          heading: "Що зводити першим",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Люди",
                  text: "Один реєстр людей і сімей. До нього чіпляється все інше.",
                },
                {
                  title: "Відвідуваність",
                  text: "Відмітки з груп і служінь, прив'язані до людини. Звідси береться відповідь на перше питання: хто не був три тижні.",
                },
                {
                  title: "Служіння й розклад",
                  text: "Хто, коли й чи підтвердив. Розклад перестає бути картинкою в чаті.",
                },
                {
                  title: "Заявки",
                  text: "Усі звернення в одному списку зі статусом і відповідальним замість особистих повідомлень.",
                },
                {
                  title: "Ролі й доступи",
                  text: "Коли лідер міняється, новий отримує його роль, а база лишається в церкві.",
                },
              ],
            },
            {
              kind: "text",
              text: "Порядок важливіший за швидкість. Церква, яка вмикає все одразу, зазвичай за місяць повертається до таблиць: ніхто не встиг звикнути. Як переносити кожне джерело без двох копій, ми розклали по кроках у статті [«Дані церкви в п'яти місцях»](/blog/dani-v-riznykh-mistsiakh).",
            },
          ],
        },
        {
          heading: "Як перевірити себе через квартал",
          blocks: [
            {
              kind: "list",
              items: [
                "Пройдіть ті самі п'ять питань так само: самі й з годинником.",
                "Порахуйте, скільки прохань за квартал лишились без відповідального. Ціль — нуль, і вона досяжна.",
                "Спитайте лідерів, що вони досі роблять вручну щотижня.",
                "Перевірте, чи зможе новий лідер групи почати роботу без дзвінка попередньому.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Система — це коли на звичайні питання тижня відповідають без дзвінка «людині в темі».",
        "Відповідь рахується, лише якщо вона точна, знайдена самостійно й за хвилину.",
        "Починайте з реєстру людей: відвідуваність, служіння й заявки чіпляються до нього.",
        "Через квартал пройдіть тест так само: сірих питань має стати менше.",
      ],
      faq: [
        {
          q: "У нас невелика церква. Нам справді потрібна система?",
          a: "Поки людей до п'ятдесяти, зазвичай вистачає пам'яті лідерів. Система потрібна, коли з'являється другий лідер, який має знати те саме, або коли перший іде у відпустку.",
        },
        {
          q: "З чого почати, якщо жодної відповіді немає?",
          a: "З одного реєстру людей і сімей. Не переносьте п'ять джерел одразу: перенесіть людей, закрийте стару таблицю й тільки потім беріться за відвідуваність.",
        },
        {
          q: "Чи не буде це виглядати як недовіра до лідерів?",
          a: "Зазвичай ні: лідери самі першими просять прибрати зошит зі списком групи, бо вести його доводиться їм.",
        },
      ],
      cta: {
        title: "Зберіть систему під свою церкву",
        text: "Оберіть, що хочете спростити першим, і подивіться, які модулі це закривають.",
        label: "Конструктор модулів",
        href: "/modules",
      },
    },
    en: {
      seoTitle: "Five questions that show whether a church has a system",
      seoDescription:
        "A simple test for a church: five ordinary questions of the week. If every answer has to be hunted down in people and spreadsheets, there is no system — only a few people's memory.",
      title: "Five questions that show whether you have a system",
      lead: "You need neither software nor a budget to check whether your church has a system. Try answering five ordinary questions of the week and watch where the answers come from.",
      keywords: [
        "church management system",
        "church record keeping",
        "how to check church records",
        "where to keep church data",
        "church attendance tracking",
      ],
      problem: {
        title: "“Let me ask Natalia”",
        text: "That is a fine answer in a church of fifty. In a church of three hundred it means the whole picture rests on a few people and leaves with their holiday, their tiredness or their move to another city.",
      },
      sections: [
        {
          heading: "The rules: a minute per question, no phone calls",
          blocks: [
            {
              kind: "list",
              title: "An answer counts if it is:",
              items: [
                "Precise: names and dates. “I think someone stopped coming” does not count.",
                "Yours: you found it yourself, without calling a leader.",
                "Fast: a minute per question, no “I'll check tonight”.",
                "Stable: next week it is still in the same place.",
              ],
            },
          ],
        },
        {
          heading: "Five questions and where the answers usually live",
          blocks: [
            {
              kind: "text",
              text: "Next to each question, note where you got the answer. If it came from one person's memory, spreadsheet or phone, your records rest on that person.",
            },
            {
              kind: "table",
              columns: ["Question", "Where the answer usually lives", "What that means"],
              rows: [
                [
                  "Who hasn't been to church for three weeks?",
                  "In the leader's memory",
                  "The person comes to mind once they stop picking up",
                ],
                [
                  "How many people are in the youth group, and who came for the first time?",
                  "In the leader's spreadsheet",
                  "One person knows the number, and it is out of date",
                ],
                [
                  "Who is serving this Sunday, and has everyone confirmed?",
                  "In chats and phone calls",
                  "Who dropped out becomes clear on Sunday morning",
                ],
                [
                  "What did people ask for last week, and who closed it?",
                  "In private messages",
                  "Half of the requests have no owner",
                ],
                [
                  "What stays with the church when a leader leaves?",
                  "On the leader's laptop",
                  "The ministry walks out with the person",
                ],
              ],
            },
            {
              kind: "text",
              text: "None of these questions is hard. What is hard is that the answers sit in five different places, and none of them belongs to the church.",
            },
          ],
        },
        {
          heading: "Zero, two or five: what your score means",
          blocks: [
            {
              kind: "visual",
              caption:
                "A typical example: two questions out of five have an answer, youth and Sunday. Count yours: the grey questions show where your records still rest on one person.",
              visual: {
                type: "score",
                title: "How many questions the system already answers",
                totalLabel: "out of five",
                items: [
                  { label: "Who has been missing three weeks", ok: false },
                  { label: "How many are in the youth group", ok: true },
                  { label: "Who serves this Sunday", ok: true },
                  { label: "Who closed each request", ok: false },
                  { label: "What stays when a leader leaves", ok: false },
                ],
              },
            },
            {
              kind: "list",
              items: [
                "Four or five: you have a system; now everyone needs to use it.",
                "Two or three: single ministries have a system, but they cannot see each other.",
                "None or one: a few people carry everything. This is what a church looks like when it grew faster than it agreed on where things get written down.",
              ],
            },
          ],
        },
        {
          heading: "Why “in the leader's head” is not a system",
          blocks: [
            {
              kind: "text",
              text: "A leader's memory is the fastest storage there is, as long as the leader is around. It fails at three things: holidays, growth and handover.",
            },
            {
              kind: "quote",
              text: "Once there are more people than a leader can hold in mind, a church loses not data but people.",
            },
            {
              kind: "solution",
              title: "Small groups in one list",
              text:
                "What a leader usually keeps in their head: when the group last met, how many came, and where attendance has been sliding for a second month.",
              spec: {
                kind: "table",
                title: "Small groups",
                subtitle: "Autumn season",
                columns: ["Group", "Leader", "Last meeting", "Present"],
                rows: [
                  { cells: ["Roots", "Olena Kovalchuk", "Thu, 19:00", "9 of 12"] },
                  { cells: ["Youth", "Taras Mykytiuk", "Fri, 18:30", "14 of 16"] },
                  { cells: ["Families", "Ihor Didukh", "Sat, 17:00", "6 of 10"], badge: { label: "Attendance down", tone: "amber" } },
                  { cells: ["Newcomers", "Nina Panchuk", "Sun, 12:00", "5 of 5"] },
                ],
              },
              link: { label: "The Small groups module", href: "/modules/groups" },
            },
            {
              kind: "callout",
              title: "Why the leader needs it",
              text: "So they don't have to hold twenty-four people in their head at once, and can take a holiday in peace.",
            },
          ],
        },
        {
          heading: "What to bring together first",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "People",
                  text: "One register of people and families. Everything else attaches to it.",
                },
                {
                  title: "Attendance",
                  text: "Check-ins from groups and ministries, tied to the person. This answers the first question: who hasn't been for three weeks.",
                },
                {
                  title: "Ministries and the rota",
                  text: "Who, when, and whether they confirmed. The plan stops being an image in a chat.",
                },
                {
                  title: "Requests",
                  text: "Every request in one list with a status and an owner, instead of private messages.",
                },
                {
                  title: "Roles and access",
                  text: "When a leader changes, the new one gets the role, and the database stays with the church.",
                },
              ],
            },
            {
              kind: "text",
              text: "Order matters more than speed. A church that switches everything on at once is usually back in spreadsheets within a month: nobody had time to get used to it. How to move each source without ending up with two copies is laid out step by step in [Church data in five places](/blog/dani-v-riznykh-mistsiakh).",
            },
          ],
        },
        {
          heading: "How to re-check yourself in a quarter",
          blocks: [
            {
              kind: "list",
              items: [
                "Run the same five questions the same way: on your own, with a clock.",
                "Count how many requests this quarter were left without an owner. The target is zero, and it is reachable.",
                "Ask leaders what they still do by hand every week.",
                "Check whether a new group leader could start without calling the previous one.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "A system means the ordinary questions of the week get answered without calling “the person who knows”.",
        "An answer counts only if it is precise, found by you, and found within a minute.",
        "Start with the register of people: attendance, ministries and requests attach to it.",
        "In a quarter, run the test the same way: fewer questions should stay grey.",
      ],
      faq: [
        {
          q: "Our church is small. Do we really need a system?",
          a: "Up to about fifty people, the leaders' memory is usually enough. A system becomes necessary when a second leader has to know the same things, or when the first one goes on holiday.",
        },
        {
          q: "Where do we start if we have none of the answers?",
          a: "With one register of people and families. Do not move five sources at once: move the people, close the old spreadsheet, and only then take on attendance.",
        },
        {
          q: "Won't this look like distrust of our leaders?",
          a: "Usually not: leaders tend to be the first to ask to get rid of the notebook with the group list, because they are the ones keeping it.",
        },
      ],
      cta: {
        title: "Build the system around your church",
        text: "Pick what you want to simplify first and see which modules cover it.",
        label: "Module builder",
        href: "/modules",
      },
    },
  },
};
