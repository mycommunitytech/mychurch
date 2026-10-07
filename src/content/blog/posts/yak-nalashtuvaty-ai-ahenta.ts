import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "yak-nalashtuvaty-ai-ahenta",
  category: "ai",
  date: "2026-09-12",
  updated: "2026-09-30",
  related: ["vid-vidviduvacha-do-lidera", "vasha-tserkva-unikalna", "dani-v-riznykh-mistsiakh"],
  copy: {
    ua: {
      seoTitle: "ШІ-помічник для церкви: як налаштувати асистента в Telegram",
      seoDescription:
        "Що ШІ-помічник може робити в церкві: відповідати лідерам у Telegram, помічати «мене не буде» в чаті групи, збирати зміну. Що доручати, а що — ні.",
      title: "ШІ-помічник для церкви: що йому доручити, а що — ні",
      lead: "ШІ-помічник корисний церкві не гарними відповідями, а кроками в системі: знаходить тих, хто випав, збирає зміну на неділю й помічає в чаті групи, хто не прийде.",
      keywords: [
        "ШІ-помічник для церкви",
        "як налаштувати ШІ-помічника",
        "асистент у Telegram для церкви",
        "автоматизація рутини в церкві",
        "як використовувати ШІ в церкві",
      ],
      problem: {
        title: "Помічник, який лише розмовляє, не знімає навантаження",
        text: "Загальний чат-бот напише гарне привітання, але не знає, хто з вашої групи не був місяць, і не бачить, що троє вже написали в чаті «мене не буде». Тому за тиждень ним перестають користуватись.",
      },
      sections: [
        {
          heading: "Три умови, без яких помічник марний",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Знає вашу церкву", text: "Відповідає з вашої бази: люди, групи, служіння, події, явка. Без неї він лише шукає в інтернеті." },
                { title: "Робить кроки в системі", text: "Знаходить тих, хто випав, нагадує тим, хто мовчить про неділю, бронює залу, готує чернетки повідомлень." },
                { title: "Нічого не робить без вашого «так»", text: "Усе, що побачать інші люди, спершу приходить вам чернеткою і виконується лише після підтвердження." },
              ],
            },
          ],
        },
        {
          heading: "Де він працює: особисто в боті й у чаті групи",
          blocks: [
            {
              kind: "text",
              text: "Лідери й так щодня в Telegram, тому помічник теж там: в особистому чаті з ботом церкви і, якщо церква дозволить, у чаті малої групи. Правила в цих двох місцях різні.",
            },
            {
              kind: "table",
              columns: ["", "Особистий чат із ботом", "Чат групи"],
              rows: [
                ["Хто пише", "Лідер, служитель, адміністратор", "Уся група"],
                ["Що вміє", "Відповідає про людей, групи й графік: «хто не був місяць», «хто служить у неділю»", "Помічає сказане в чаті; відповідає, коли до нього звернулись"],
                ["Імена й контакти", "Так, у межах прав того, хто питає", "Ні: у чат лише те, що й так бачать усі"],
              ],
            },
            {
              kind: "list",
              title: "Що помічник робить у чаті групи",
              items: [
                "Помічає «мене не буде» й кладе це чернеткою до відмітки явки; лідер ставить відмітку однією кнопкою.",
                "На прохання про молитву надсилає лідеру картку «Записати?», і без його дотику нікуди нічого не йде.",
                "Ловить задачі: «Оля принесе вечерю» стає чернеткою з виконавцем і терміном.",
                "Раз на день пише лідеру підсумок: про що говорили, що вирішили, хто що обіцяв.",
                "Відповідає на питання про зустріч, якщо 15 хвилин ніхто не відповів, і попереджає лідера, коли троє й більше пишуть, що не прийдуть.",
              ],
            },
            {
              kind: "callout",
              title: "Кожен дозвіл церква вмикає окремо",
              text: "Читання чату, явка, задачі, підсумок — окремі перемикачі. Читання чату за замовчуванням вимкнене, а вимкнений дозвіл не робить жодного запиту до моделі. Ще лідер може описати свою групу кількома реченнями («у нас підлітки», «чай приносить черговий»), і помічник врахує це у відповідях.",
            },
          ],
        },
        {
          heading: "З чого почати: три завдання першого місяця",
          blocks: [
            {
              kind: "table",
              columns: ["Завдання", "Що просите", "Що економить"],
              rows: [
                ["Хто зник", "Знайди тих, хто не був у моїй групі місяць", "Перегляд журналів явки вручну"],
                ["Зібрати зміну", "Які позиції не закриті на неділю, нагадай тим, хто мовчить", "Вечір суботніх дзвінків"],
                ["Підсумок тижня", "Що сталося в моєму служінні за тиждень", "Складання звіту руками"],
              ],
            },
            {
              kind: "text",
              text: "Три завдання, які повторюються щотижня, дадуть більше, ніж двадцять можливостей, про які ніхто не згадає. Живі приклади запитів лідерів є на [сторінці помічника](/ai).",
            },
          ],
        },
        {
          heading: "Як формулювати запит",
          blocks: [
            {
              kind: "list",
              items: [
                "Одна мета на повідомлення. «Знайди і напиши» спрацює, а «знайди, напиши, забронюй і склади звіт» краще розбити на кілька.",
                "Уточнюйте період: місяць, чотири зустрічі, з початку сезону.",
                "Якщо результат не той, допишіть уточнення наступним повідомленням.",
              ],
            },
            {
              kind: "solution",
              title: "Запит словами — дії в системі",
              text:
                "Лідер питає звичайними словами, помічник знаходить людей і готує чернетки. Надсилає завжди лідер.",
              spec: {
                kind: "chat",
                title: "Помічник",
                subtitle: "Права лідера групи",
                messages: [
                  { from: "user", text: "Хто з моєї групи не був уже місяць?", time: "10:12" },
                  { from: "bot", text: "Троє: Ігор, Таня і Марина. Остання відмітка — 17 серпня.", time: "10:12" },
                  { from: "user", text: "Підготуй кожному коротке повідомлення від мене.", time: "10:13" },
                  { from: "bot", text: "Три чернетки готові. Надсилаєте ви — я не пишу людям сам.", time: "10:13" },
                ],
                input: "Напишіть помічнику…",
              },
              link: { label: "Сторінка помічника", href: "/ai" },
            },
            {
              kind: "callout",
              title: "Помічник працює в межах ваших прав",
              text: "Лідер групи бачить через помічника лише свою групу, адміністратор — свою зону. Пастирських нотаток і фінансів помічник не бачить ні для кого.",
            },
          ],
        },
        {
          heading: "Що не варто доручати",
          blocks: [
            {
              kind: "list",
              items: [
                "Особисті відповіді на молитовні потреби.",
                "Рішення про людей: хто готовий до служіння, кого ставити лідером.",
                "Розсилки без перегляду: навіть точний текст прочитайте перед відправкою.",
                "Чутливі теми: конфлікти, опіка, фінансові труднощі родини.",
              ],
            },
            {
              kind: "text",
              text: "Помічник бере на себе пошук, підготовку й нагадування. Рішення й турбота залишаються за людьми.",
            },
          ],
        },
        {
          heading: "Як зрозуміти, що налаштування вдалось",
          blocks: [
            {
              kind: "list",
              items: [
                "Лідери пишуть помічнику самі, без нагадувань зверху.",
                "Суботніх дзвінків поменшало: нагадування йдуть через бота.",
                "Питання «де подивитись явку» ставлять помічнику.",
                "Лідер знає, що половини групи не буде, ще до зустрічі, а не на ній.",
                "Ви жодного разу не знайшли дію, виконану без підтвердження.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Помічник вартий уваги, коли знаходить людей, нагадує й готує чернетки.",
        "У чаті групи кожен дозвіл вмикається окремо, читання чату спершу вимкнене.",
        "Без вашого «так» людям нічого не йде; пастирського й фінансів помічник не бачить.",
        "Почніть з трьох завдань, які повторюються щотижня.",
      ],
      faq: [
        {
          q: "Чи бачить помічник особисті дані всієї церкви?",
          a: "Ні. Лише те, що людина може відкрити сама, і ніколи пастирських нотаток чи фінансів.",
        },
        {
          q: "Чи читає помічник усі повідомлення в чаті групи?",
          a: "Лише якщо церква ввімкнула читання чату, а за замовчуванням воно вимкнене. Для підсумку зберігається короткий переказ, самі повідомлення — ні.",
        },
        {
          q: "Чи можна дати помічнику власне ім'я?",
          a: "Так. Ім'я — лише подача; важливіше, до яких даних і дій він має доступ.",
        },
        {
          q: "Що робити, якщо помічник помилився?",
          a: "Не підтверджуйте дію. Усе, що побачать інші, спершу приходить чернеткою, тож помилку видно до відправлення.",
        },
      ],
      cta: {
        title: "Подивіться сценарії помічника",
        text: "Реальні запити лідерів і кроки, які помічник готує на ваше підтвердження.",
        label: "Сторінка ШІ-помічника",
        href: "/ai",
      },
    },
    en: {
      seoTitle: "AI assistant for churches: setting one up in Telegram",
      seoDescription:
        "What an AI assistant can do in a church: answer leaders in Telegram, notice “I can't make it” in a group chat, fill a rota. What to delegate and what not.",
      title: "An AI assistant for your church: what to hand it and what not",
      lead: "An AI assistant helps a church through steps in the system, not nice answers: it finds who dropped off, fills the Sunday rota and notices in the group chat who is not coming.",
      keywords: [
        "AI assistant for churches",
        "setting up an AI assistant",
        "Telegram assistant church",
        "church admin automation",
        "using AI in ministry",
      ],
      problem: {
        title: "An assistant that only talks removes no load",
        text: "A generic chatbot writes a nice welcome, but it does not know who in your group has been absent for a month and does not see that three people already wrote “I can't make it” in the chat. So people stop using it within a week.",
      },
      sections: [
        {
          heading: "Three conditions, or it is useless",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "It knows your church", text: "It answers from your database: people, groups, ministries, events, attendance. Otherwise it is just web search." },
                { title: "It takes steps in the system", text: "Finds who dropped off, reminds those silent about Sunday, books a room, drafts messages." },
                { title: "Nothing happens without your yes", text: "Anything other people will see reaches you as a draft first and runs only after you confirm." },
              ],
            },
          ],
        },
        {
          heading: "Where it works: in a private chat and in the group chat",
          blocks: [
            {
              kind: "text",
              text: "Leaders are in Telegram every day anyway, so the assistant is there too: in a private chat with the church bot and, if the church allows it, in a small group's chat. Each place has its own rules.",
            },
            {
              kind: "table",
              columns: ["", "Private chat with the bot", "Group chat"],
              rows: [
                ["Who writes", "A leader, volunteer or administrator", "The whole group"],
                ["What it does", "Answers about people, groups and rotas: “who has missed a month”, “who serves on Sunday”", "Notices what is said in the chat; replies when addressed"],
                ["Names and contacts", "Yes, within the asker's permissions", "No: only what everyone can already see"],
              ],
            },
            {
              kind: "list",
              title: "What the assistant does in a group chat",
              items: [
                "Notices “I can't make it” and drafts it into the attendance check; the leader confirms with one button.",
                "Sends the leader a “Record this?” card for a prayer request, and nothing goes anywhere without their tap.",
                "Catches tasks: “Olia will bring dinner” becomes a draft with an owner and a due date.",
                "Once a day sends the leader a summary: what was discussed, what was decided, who promised what.",
                "Answers a question about the meeting if nobody has in 15 minutes, and warns the leader when three or more say they cannot come.",
              ],
            },
            {
              kind: "callout",
              title: "The church switches on each permission separately",
              text: "Chat reading, attendance, tasks, summaries: each is its own switch. Chat reading is off by default, and a switched-off permission sends no request to the model at all. A leader can also describe their group in a few sentences (“we are teenagers”, “whoever is on duty brings tea”), and the assistant takes that into account.",
            },
          ],
        },
        {
          heading: "Where to start: three tasks for month one",
          blocks: [
            {
              kind: "table",
              columns: ["Task", "What you ask", "What it saves"],
              rows: [
                ["Who disappeared", "Find who has missed my group for a month", "Manually reading attendance logs"],
                ["Fill the rota", "Which Sunday positions are open, remind the silent ones", "A Saturday of phone calls"],
                ["Weekly summary", "What happened in my ministry this week", "Writing the report by hand"],
              ],
            },
            {
              kind: "text",
              text: "Three tasks that repeat every week beat twenty capabilities nobody remembers. Real requests from leaders are on the [assistant page](/ai).",
            },
          ],
        },
        {
          heading: "How to phrase a request",
          blocks: [
            {
              kind: "list",
              items: [
                "One goal per message. “Find and message” works; “find, message, book and report” is better split up.",
                "Name the period: a month, four meetings, since the season started.",
                "If the result is off, add a correction in your next message.",
              ],
            },
            {
              kind: "solution",
              title: "A request in words, actions in the system",
              text:
                "The leader asks in plain words, the assistant finds the people and prepares drafts. The leader always presses send.",
              spec: {
                kind: "chat",
                title: "Assistant",
                subtitle: "Group leader permissions",
                messages: [
                  { from: "user", text: "Who in my group has been away for a month?", time: "10:12" },
                  { from: "bot", text: "Three: Ihor, Tania and Maryna. Last mark was 17 August.", time: "10:12" },
                  { from: "user", text: "Draft a short message from me to each of them.", time: "10:13" },
                  { from: "bot", text: "Three drafts ready. You send them — I do not message people myself.", time: "10:13" },
                ],
                input: "Message the assistant…",
              },
              link: { label: "The assistant page", href: "/ai" },
            },
            {
              kind: "callout",
              title: "It works within your permissions",
              text: "A group leader sees only their group through the assistant, an administrator their area. It never sees pastoral notes or finances, for anyone.",
            },
          ],
        },
        {
          heading: "What not to delegate",
          blocks: [
            {
              kind: "list",
              items: [
                "Personal replies to prayer needs.",
                "Decisions about people: who is ready to serve, who should lead.",
                "Unreviewed broadcasts: even a correct text deserves a read before sending.",
                "Sensitive matters: conflict, pastoral care, family finances.",
              ],
            },
            {
              kind: "text",
              text: "The assistant takes searching, preparing and reminding. Decisions and care stay with people.",
            },
          ],
        },
        {
          heading: "How to know it worked",
          blocks: [
            {
              kind: "list",
              items: [
                "Leaders write to it without being told to.",
                "Fewer Saturday calls: reminders go out through the bot.",
                "Questions like “where do I see attendance” go to the assistant.",
                "The leader learns that half the group is away before the meeting, not at it.",
                "You have never found an action executed without confirmation.",
              ],
            },
          ],
        },
      ],
      takeaways: [
        "The assistant earns its place when it finds people, reminds and drafts.",
        "In a group chat each permission is its own switch; chat reading starts off.",
        "Nothing reaches people without your yes; pastoral notes and finances stay out of its sight.",
        "Start with three tasks that repeat every week.",
      ],
      faq: [
        {
          q: "Does it see everyone's personal data?",
          a: "No. Only what the person can open themselves, and never pastoral notes or finances.",
        },
        {
          q: "Does the assistant read every message in the group chat?",
          a: "Only if the church has switched on chat reading, which is off by default. For summaries it keeps a short digest; the messages themselves are not stored.",
        },
        {
          q: "Can we give it our own name?",
          a: "Yes. The name is presentation; what matters is the data and actions it can reach.",
        },
        {
          q: "What if it gets something wrong?",
          a: "Do not confirm the action. Anything other people will see arrives as a draft first, so mistakes show before sending.",
        },
      ],
      cta: {
        title: "See the assistant scenarios",
        text: "Real requests from leaders and the steps the assistant prepares for your approval.",
        label: "AI assistant page",
        href: "/ai",
      },
    },
  },
};
