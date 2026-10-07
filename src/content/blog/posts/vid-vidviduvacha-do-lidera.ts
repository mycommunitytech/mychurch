import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "vid-vidviduvacha-do-lidera",
  category: "people",
  date: "2026-09-19",
  updated: "2026-09-30",
  related: ["stavte-tsili", "yak-nalashtuvaty-ai-ahenta", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Шлях людини в церкві: від першого візиту до лідера",
      seoDescription:
        "Шість етапів шляху в церкві: відвідувач, покаяння, мала група, хрещення, служіння, лідер. Що має статись на кожному і як не загубити людину між ними.",
      title: "Від першого візиту до лідера: шість етапів шляху",
      lead: "Людина приходить у церкву один раз, а лишається через десятки маленьких кроків. Ось шість етапів цього шляху: що потрібно людині на кожному і хто за це відповідає.",
      keywords: [
        "шлях учнівства в церкві",
        "етапи духовного зростання",
        "супровід людини після покаяння",
        "підготовка до хрещення в церкві",
        "як виростити лідера в церкві",
        "залучення людей до служіння",
      ],
      problem: {
        title: "Між покаянням і служінням — порожнеча",
        text: "Людина покаялась на служінні в лютому. Далі не сталось нічого: у групу її ніхто не запросив, про хрещення ніхто не поговорив, у команду не покликали. До літа вона перестала приходити, і формально ніхто не зробив нічого поганого.",
      },
      sections: [
        {
          heading: "Досягати людей — означає вести їх далі",
          blocks: [
            {
              kind: "text",
              text: "З першим кроком у церкви рідко бувають проблеми: люди приходять із другом, у кризу, після запрошення чи проходячи повз. Проблема там, де за першим кроком мав іти другий, а ніхто не назвав ні цього кроку, ні того, хто за нього відповідає.",
            },
            {
              kind: "quote",
              text: "«Тож ідіть, і навчіть всі народи» — Матвія 28:19, переклад Огієнка",
            },
            {
              kind: "text",
              text: "Доручення каже «навчіть», а за одну неділю не навчиш: людина має йти далі від місця, де вперше сіла в залі. Етапи нижче — це моменти, коли людині потрібен хтось поруч. Ієрархії чи рівнів святості вони не означають.",
            },
          ],
        },
        {
          heading: "Шість етапів і що потрібно людині на кожному",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Відвідувач",
                  text: "Перший візит. Гостя мають запам'ятати на ім'я, і протягом тижня хтось із церкви має написати йому особисто.",
                },
                {
                  title: "Покаяння",
                  text: "Людині потрібна наступна зустріч з іменем і датою. Не «ми за вас молимось», а «у четвер о сьомій зустрічаємось з Андрієм».",
                },
                {
                  title: "Мала група",
                  text: "Місце, де відсутність людини помітять наступного тижня. Із залу можна зникнути непоміченим, із групи на дванадцять людей — ні.",
                },
                {
                  title: "Хрещення",
                  text: "Свідомий крок і перша публічна відповідальність. Перед ним потрібні підготовка, розмова з пастором і конкретна дата.",
                },
                {
                  title: "Служіння",
                  text: "Людина переходить з тих, хто отримує, до тих, хто дає. Їй потрібні зрозуміла роль у команді й межа навантаження з першого дня, бо вигорання починається тут.",
                },
                {
                  title: "Лідер",
                  text: "Своя група чи служіння і відповідальність за інших людей. Лідеру потрібно бачити свою ділянку цілком і знати, кому передасть справу, коли прийде час.",
                },
              ],
            },
            {
              kind: "visual",
              caption:
                "Числа — приклад: зі 120 гостей за рік до малої групи дійшли 33. Тому відповідальний потрібен насамперед між першим візитом і групою, хоча у вашій церкві вузьке місце може бути іншим.",
              visual: {
                type: "path",
                title: "Дорога від першого візиту до лідера",
                unit: "осіб на кожній зупинці за рік",
                stages: [
                  { title: "Відвідувач", value: 120 },
                  { title: "Покаяння", value: 54 },
                  { title: "Мала група", value: 33 },
                  { title: "Хрещення", value: 21 },
                  { title: "Служіння", value: 13 },
                  { title: "Лідер", value: 4 },
                ],
              },
            },
          ],
        },
        {
          heading: "Що на кожному етапі бере на себе система",
          blocks: [
            {
              kind: "table",
              columns: ["Етап", "Що бере на себе система"],
              rows: [
                ["Відвідувач", "Анкета через QR створює картку, відповідальний отримує нагадування того ж дня"],
                ["Покаяння", "Статус у картці, завдання відповідальному, запис у календарі"],
                ["Мала група", "Список тих, хто ходить понад місяць і досі без групи"],
                ["Хрещення", "Реєстрація на курс, нагадування учасникам, історія в картці"],
                ["Служіння", "Графік із підтвердженнями і сигнал про тих, хто служить без перерви"],
                ["Лідер", "Аналітика своєї групи й передача справ без втрати історії"],
              ],
            },
            {
              kind: "text",
              text: "Жоден рядок таблиці не замінює розмови. Система прибирає лише причини, через які розмова не стається: «я не знав», «я забув», «це було в іншому чаті».",
            },
            {
              kind: "solution",
              title: "Шлях на одній дошці",
              text:
                "Кожен новий стоїть на своєму етапі, у кожного переходу є відповідальний, і видно, хто застряг між етапами другий тиждень.",
              spec: {
                kind: "board",
                title: "Онбординг",
                subtitle: "Жовтень",
                columns: [
                  {
                    title: "Перший візит",
                    cards: [
                      { title: "Марія Дідух", sub: "Неділя, 12 жовтня", tag: { label: "Потрібен дзвінок", tone: "amber" } },
                      { title: "Родина Шевчуків", sub: "Прийшли вдвох, з дитиною" },
                    ],
                  },
                  {
                    title: "Знайомство",
                    cards: [
                      { title: "Андрій Пилипенко", sub: "Дзвонила Ніна · три дні тому" },
                      { title: "Оксана Гнатюк", sub: "Запрошена в групу «Витоки»" },
                    ],
                  },
                  {
                    title: "У групі",
                    cards: [
                      { title: "Тарас Микитюк", sub: "«Молодіжна» · четверта зустріч" },
                      { title: "Софія Панчук", sub: "Питає про служіння медіа", tag: { label: "Готова служити", tone: "brand" } },
                    ],
                  },
                ],
              },
              link: { label: "Модуль «Онбординг»", href: "/modules/onboarding" },
            },
          ],
        },
        {
          heading: "Де шлях обривається найчастіше",
          blocks: [
            {
              kind: "list",
              items: [
                "Після першого візиту: анкета лишилась на папері, і другий крок залежить від того, чи не загубився аркуш.",
                "Після покаяння: ім'я записали в блокнот служіння, і на цьому все.",
                "Перед групою: людину запросили «в малі групи» взагалі, без назви групи й імені лідера.",
                "У служінні: людина стоїть у графіку щонеділі півтора року, і цього ніхто не помічає.",
              ],
            },
            {
              kind: "callout",
              title: "Відповідальний за перехід, а не за етап",
              text: "Найчастіша помилка — закріпити людей за етапами: служіння зустрічі за гостей, координатора за групи. Тоді між етапами лишається нічия зона, і від покаяння до групи людину не веде ніхто.",
            },
          ],
        },
        {
          heading: "Лідер — це не фініш шляху",
          blocks: [
            {
              kind: "text",
              text: "На шостому етапі шлях починається заново: лідер веде свою групу, а в ній сидить людина, яка вперше прийшла минулої неділі. Церква росте, коли люди доходять до кінця шляху й ведуть наступних.",
            },
            {
              kind: "text",
              text: "Тому найкращий показник здоров'я громади — скільки людей за рік перейшли хоча б на один етап далі. Явка на служінні цього не покаже: цифра з'являється, лише коли етап відмічено в картці людини. Ще чотири такі показники і як поставити на них ціль — у статті [«Як виміряти зростання церкви»](/blog/stavte-tsili).",
            },
          ],
        },
        {
          heading: "З чого почати цього місяця",
          blocks: [
            {
              kind: "list",
              items: [
                "Випишіть етапи словами, якими говорить ваша церква.",
                "Біля кожного переходу впишіть одне ім'я. Де порожньо, там перехід не працює.",
                "Перевірте останніх десять людей, які покаялись: скільки з них зараз у групі?",
                "Відмічайте етап у картці людини, і стане видно, де шлях зупиняється.",
              ],
            },
            {
              kind: "text",
              text: "Не беріться за все одразу: почніть із переходу, на якому втрачаєте найбільше, доведіть його до звички, а за три місяці додайте наступний.",
            },
          ],
        },
      ],
      takeaways: [
        "Люди губляться на переходах між етапами.",
        "На кожен перехід потрібне одне ім'я відповідального.",
        "Покаяння без наступної зустрічі з датою так і лишається подією.",
        "Етап, якого немає в картці, не бачить ніхто.",
        "На шостому етапі лідер починає шлях для наступних.",
      ],
      faq: [
        {
          q: "А якщо в нашій церкві інші етапи?",
          a: "Так і має бути, бо етапи описують практику вашої церкви. У системі їх налаштовують: додають курс, членство чи випробувальний період у служінні й прибирають те, чого у вас немає.",
        },
        {
          q: "Хто має відмічати перехід людини на наступний етап?",
          a: "Той, хто супроводжував людину: лідер групи, керівник служіння, відповідальний за гостей. Якщо відмічає один адміністратор за всіх, дані швидко застарівають.",
        },
        {
          q: "Чи не перетворює це людей на позиції у воронці?",
          a: "Ні, якщо зміна етапу породжує дзвінок, знайомство чи запрошення: тоді це спосіб не забути про людину. Якщо етап потрібен лише для звіту, то так.",
        },
      ],
      cta: {
        title: "Подивіться, як шлях виглядає в модулі «Онбординг»",
        text: "Етапи, відповідальні за переходи й історія людини — від першого візиту до служіння.",
        label: "Модуль «Онбординг»",
        href: "/modules/onboarding",
      },
    },
    en: {
      seoTitle: "A person's path in church: from first visit to leader",
      seoDescription:
        "Six stages of the path through a church: visitor, repentance, small group, baptism, ministry, leader. What has to happen at each one and where people slip away.",
      title: "From first visit to leader: the six stages",
      lead: "People arrive once, but they stay through dozens of small steps. Here are the six stages of that path: what a person needs at each one, and who is responsible for it.",
      keywords: [
        "discipleship path in church",
        "stages of spiritual growth",
        "following up after a decision for Christ",
        "preparing people for baptism",
        "raising leaders in church",
        "getting people into ministry",
      ],
      problem: {
        title: "The gap between a decision and a ministry",
        text: "Someone makes a decision at a February service. Then nothing happens: no invitation to a group, no conversation about baptism, no place on a team. By summer they have stopped coming, and formally nobody did anything wrong.",
      },
      sections: [
        {
          heading: "Reaching people means leading them further",
          blocks: [
            {
              kind: "text",
              text: "Churches rarely struggle with the first step: people come with a friend, in a crisis, after an invitation or while passing by. The trouble starts where a second step should have followed, and nobody named that step or who owns it.",
            },
            {
              kind: "quote",
              text: "Therefore go and make disciples of all nations — Matthew 28:19",
            },
            {
              kind: "text",
              text: "The commission says “make disciples”, and nobody is discipled in one Sunday: a person has to move on from the seat they first sat in. The stages below are moments when someone needs another person beside them. They are not a hierarchy or levels of holiness.",
            },
          ],
        },
        {
          heading: "Six stages, and what a person needs at each",
          blocks: [
            {
              kind: "steps",
              items: [
                {
                  title: "Visitor",
                  text: "The first visit. The guest needs to be remembered by name and to hear from someone at church personally within the week.",
                },
                {
                  title: "Repentance",
                  text: "The person needs a next meeting with a name and a date. Not “we are praying for you”, but “Thursday at seven with Andrii”.",
                },
                {
                  title: "Small group",
                  text: "A place where their absence is noticed next week. You can vanish from a congregation unnoticed; you cannot vanish from a group of twelve.",
                },
                {
                  title: "Baptism",
                  text: "A deliberate step and the first public commitment. It needs preparation, a conversation with the pastor and a set date.",
                },
                {
                  title: "Ministry",
                  text: "The person moves from receiving to giving. They need a clear role on a team and a limit on the load from day one, because burnout starts here.",
                },
                {
                  title: "Leader",
                  text: "Their own group or ministry, and responsibility for other people. A leader needs to see their whole patch and to know who they will hand it to when the time comes.",
                },
              ],
            },
            {
              kind: "visual",
              caption:
                "The numbers are an example: of 120 guests in a year, 33 reached a small group. So an owner is needed first of all between a first visit and a group, though in your church the narrow point may be elsewhere.",
              visual: {
                type: "path",
                title: "The road from a first visit to leading",
                unit: "people at each stop over a year",
                stages: [
                  { title: "Visitor", value: 120 },
                  { title: "Repentance", value: 54 },
                  { title: "Small group", value: 33 },
                  { title: "Baptism", value: 21 },
                  { title: "Ministry", value: 13 },
                  { title: "Leader", value: 4 },
                ],
              },
            },
          ],
        },
        {
          heading: "What the system carries at each stage",
          blocks: [
            {
              kind: "table",
              columns: ["Stage", "What the system carries"],
              rows: [
                ["Visitor", "The QR form creates the record; the owner is reminded the same day"],
                ["Repentance", "A status on the record, a task for the owner, an entry in the calendar"],
                ["Small group", "The list of people attending over a month with no group"],
                ["Baptism", "Course registration, reminders, the history on the record"],
                ["Ministry", "A rota with confirmations and a flag for anyone serving without a break"],
                ["Leader", "Analytics for their own group and a handover that keeps the history"],
              ],
            },
            {
              kind: "text",
              text: "No row in this table replaces a conversation. The system only removes the reasons it never happens: “I did not know”, “I forgot”, “it was in another chat”.",
            },
            {
              kind: "solution",
              title: "The path on one board",
              text:
                "Every newcomer sits at their stage, every transition has an owner, and you can see who has been stuck between stages for a second week.",
              spec: {
                kind: "board",
                title: "Onboarding",
                subtitle: "October",
                columns: [
                  {
                    title: "First visit",
                    cards: [
                      { title: "Mariia Didukh", sub: "Sunday, 12 October", tag: { label: "Needs a call", tone: "amber" } },
                      { title: "The Shevchuk family", sub: "Came as a couple, with a child" },
                    ],
                  },
                  {
                    title: "Getting to know",
                    cards: [
                      { title: "Andrii Pylypenko", sub: "Nina called · three days ago" },
                      { title: "Oksana Hnatiuk", sub: "Invited to the Roots group" },
                    ],
                  },
                  {
                    title: "In a group",
                    cards: [
                      { title: "Taras Mykytiuk", sub: "Youth · fourth meeting" },
                      { title: "Sofiia Panchuk", sub: "Asking about media ministry", tag: { label: "Ready to serve", tone: "brand" } },
                    ],
                  },
                ],
              },
              link: { label: "The Onboarding module", href: "/modules/onboarding" },
            },
          ],
        },
        {
          heading: "Where the path breaks most often",
          blocks: [
            {
              kind: "list",
              items: [
                "After the first visit: the card stays on paper, so the second step depends on whether the sheet survives the week.",
                "After a decision: the name went into a ministry notebook, and that was it.",
                "Before a group: the person was invited to “small groups” in general, with no group name and no leader's name.",
                "In ministry: eighteen months on the rota every Sunday, and nobody notices.",
              ],
            },
            {
              kind: "callout",
              title: "Own the transition, not the stage",
              text: "The common mistake is assigning people to stages: the welcome team to guests, a coordinator to groups. That leaves an unowned gap between stages, and nobody walks a person from a decision into a group.",
            },
          ],
        },
        {
          heading: "Leader is not the end of the path",
          blocks: [
            {
              kind: "text",
              text: "At stage six the path starts again: the leader runs a group, and in that group sits someone who came for the first time last Sunday. A church grows when people reach the end of the path and take the next ones along.",
            },
            {
              kind: "text",
              text: "So the best measure of a church's health is how many people moved at least one stage further this year. Attendance will not show it: the number only appears when the stage is marked on the person's record. Four more measures like it, and how to set a goal on them, are in [How to measure church growth](/blog/stavte-tsili).",
            },
          ],
        },
        {
          heading: "Where to start this month",
          blocks: [
            {
              kind: "list",
              items: [
                "Write down your stages in the words your church actually uses.",
                "Put one name against each transition. Where the line is empty, the transition does not work.",
                "Check the last ten people who made a decision: how many are in a group now?",
                "Mark the stage on each person's record, and you will see where the path stalls.",
              ],
            },
            {
              kind: "text",
              text: "Do not take on everything at once: start with the transition where you lose the most, turn it into a habit, and add the next one in three months.",
            },
          ],
        },
      ],
      takeaways: [
        "People are lost on the transitions between stages.",
        "Every transition needs one named owner.",
        "A decision without a dated next meeting stays an event.",
        "A stage that is not on the record is visible to nobody.",
        "At stage six, the leader starts the path for the next people.",
      ],
      faq: [
        {
          q: "What if our church has different stages?",
          a: "It should, because the stages describe your church's own practice. In the system you configure them: add a course, membership or a trial period in ministry, and remove whatever you do not have.",
        },
        {
          q: "Who marks the move to the next stage?",
          a: "Whoever walked with the person: the group leader, the ministry lead, the person responsible for guests. If one administrator marks it for everyone, the data goes stale within weeks.",
        },
        {
          q: "Does this turn people into positions in a funnel?",
          a: "Not if a change of stage produces a call, an introduction or an invitation: then it is a way of not forgetting a person. If the stage exists only for a report, then yes.",
        },
      ],
      cta: {
        title: "See the path inside the Onboarding module",
        text: "Stages, owners for every transition and the person's history — from the first visit to ministry.",
        label: "Onboarding module",
        href: "/modules/onboarding",
      },
    },
  },
};
