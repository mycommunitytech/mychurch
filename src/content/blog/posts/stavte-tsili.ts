import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "stavte-tsili",
  category: "growth",
  date: "2026-09-04",
  updated: "2026-09-30",
  related: ["vid-vidviduvacha-do-lidera", "dani-v-riznykh-mistsiakh", "piat-pytan-pro-systemu"],
  copy: {
    ua: {
      seoTitle: "Як виміряти зростання церкви: показники й цілі на рік",
      seoDescription:
        "Які цифри показують рух церкви, а які лише заспокоюють: п'ять показників здоров'я громади і як поставити цілі на рік так, щоб їх можна було перевірити.",
      title: "Як виміряти зростання церкви і поставити цілі",
      lead: "«Хочемо зростати» — це не ціль, а настрій. Виміряти зростання церкви можна: рахуйте рух людей, а кожну ціль на рік записуйте числом із датою.",
      keywords: [
        "як виміряти зростання церкви",
        "показники здоров'я церкви",
        "метрики росту церкви",
        "цілі церкви на рік",
        "планування розвитку громади",
      ],
      problem: {
        title: "Плани є, але ніхто не знає, чи вони виконані",
        text: "На початку року озвучили п'ять напрямів. У грудні ніхто не може сказати, що з них вийшло: жоден не мав числа, за яким це перевірити.",
      },
      sections: [
        {
          heading: "Цифри, які заспокоюють, і цифри, які показують рух",
          blocks: [
            {
              kind: "text",
              text: "Церква найчастіше рахує те, що легко порахувати: людей у неділю, події, імена в базі. Ці числа приємні, але зал може бути повним щонеділі, а люди в ньому щоразу інші.",
            },
            {
              kind: "table",
              columns: ["Показує рух", "Замість", "Чому"],
              rows: [
                ["Скільки гостей прийшли вдруге протягом місяця", "Скільки людей було в неділю", "Повний зал не каже, хто затримався"],
                ["Скільки людей за рік перейшли на наступний етап", "Скільки людей у базі", "База росте, навіть коли люди йдуть"],
                ["Яка частка людей ходить у малу групу", "Скільки подій провели", "Подія — робота команди, а в групі людину помічають"],
                ["Скільки служителів стоять у графіку без перерви понад місяць", "Скільки служителів у списку", "Довгий список не рятує від вигорання тих самих десяти людей"],
                ["Скільки прохань закрито й за скільки днів", "Скільки прохань надійшло", "Прохання без відповіді множить розчарування"],
              ],
            },
            {
              kind: "text",
              text: "Недільну явку теж рахуйте, але як тло. Де шлях людини обривається найчастіше, ми розібрали в статті [«Від першого візиту до лідера»](/blog/vid-vidviduvacha-do-lidera).",
            },
            {
              kind: "callout",
              title: "П'ять показників здоров'я громади",
              text: "Якщо стежити лише за п'ятьма цифрами, беріть першу колонку таблиці: гості, що прийшли вдруге, частка людей у групах, переходи на наступний етап, служителі без перерви й закриті прохання. Усі п'ять рахуються з відміток, які церква вже робить.",
            },
          ],
        },
        {
          heading: "Ціль складається з чотирьох частин",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Що змінюється", text: "Показник, який можна порахувати, наприклад «частка людей у малих групах»." },
                { title: "З якого до якого", text: "Число зараз і число, якого хочемо досягти." },
                { title: "До якої дати", text: "Рік, півріччя, сезон. Без дати ціль стає напрямом." },
                { title: "Хто відповідає", text: "Одне ім'я, навіть якщо працює ціла команда." },
              ],
            },
            {
              kind: "quote",
              text: "Ціль без стартового числа — це побажання з датою.",
            },
          ],
        },
        {
          heading: "Приклади цілей, які можна перевірити",
          blocks: [
            {
              kind: "table",
              columns: ["Напрям", "Погана форма", "Робоча форма"],
              rows: [
                ["Малі групи", "Розвивати групи", "Частка людей у групах з 38% до 55% до грудня"],
                ["Нові люди", "Більше працювати з гостями", "Гостям пишуть протягом тижня: з 60% до 90% за пів року"],
                ["Служіння", "Не перевантажувати команду", "Служителів без перерви понад місяць: з 14 до нуля за сезон"],
                ["Лідери", "Готувати наступників", "Групи з помічником: з 9 до 20 із 24 до червня"],
              ],
            },
            {
              kind: "text",
              text: "Усі робочі формулювання спираються на дані, які церква вже збирає. Ціль, яку можна перевірити лише опитуванням, помирає в березні.",
            },
            {
              kind: "visual",
              caption:
                "Приклад цілі з першого рядка таблиці. У травні стовпчик сягає 43%, на 12 пунктів нижче пунктиру: розрив видно за сім місяців до кінця року, а лінію цілі перетнули лише в грудні.",
              visual: {
                type: "chart",
                title: "Частка людей у малих групах: з 38% до 55% до грудня",
                unit: "частка людей у малих групах, відсотки",
                goal: 55,
                goalLabel: "ціль 55%",
                bars: [
                  { label: "січ", value: 38 },
                  { label: "бер", value: 41 },
                  { label: "трав", value: 43 },
                  { label: "лип", value: 47 },
                  { label: "вер", value: 49 },
                  { label: "лист", value: 53 },
                  { label: "груд", value: 56 },
                ],
              },
            },
          ],
        },
        {
          heading: "Скільки цілей ставити на рік",
          blocks: [
            {
              kind: "list",
              items: [
                "Три-чотири для всієї церкви. П'ятнадцять цілей означають нуль пріоритетів.",
                "Одна на служіння, сформульована його лідером.",
                "Показники здоров'я — щомісяця, прогрес цілей — щокварталу.",
              ],
            },
            {
              kind: "callout",
              title: "Ціль ≠ звіт",
              text: "Ціль, про яку згадують лише перед звітом, не працює. Живу ціль лідери обговорюють щотижня: що ми зробили, щоб її зрушити?",
            },
            {
              kind: "solution",
              title: "Три цілі на квартал — з числом і людиною",
              text:
                "Показник, стартове число, термін і відповідальний стоять поруч, а прогрес рахується з відміток, які вже є в системі.",
              spec: {
                kind: "list",
                title: "Цілі та метрики",
                subtitle: "Осінній квартал",
                items: [
                  { title: "Гості доходять до групи", sub: "Було 18% · ціль 30% · до 31 грудня", meta: "Тарас Микитюк", badge: { label: "24%", tone: "green" } },
                  { title: "Кожне служіння має заміну", sub: "Було 4 служіння · ціль 9 · до 30 листопада", meta: "Оксана Гнатюк", badge: { label: "6 з 9", tone: "amber" } },
                  { title: "Дзвінок новому за три дні", sub: "Було 9 днів · ціль 3 дні", meta: "Ніна Панчук", badge: { label: "5 днів", tone: "amber" } },
                ],
                footer: "Число тягнеться з відміток і заявок — руками його ніхто не вводить.",
              },
              link: { label: "Модуль «Цілі та метрики»", href: "/modules/goals" },
            },
          ],
        },
        {
          heading: "Що робити, коли ціль не виконана",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Перевірте дані", text: "Часто «не виконано» означає «не порахували». Спершу переконайтесь, що цифра правдива." },
                { title: "Розділіть причини", text: "Не вистачило людей, часу, ясності чи бажання: це чотири різні проблеми з різними рішеннями." },
                { title: "Не переносьте автоматично", text: "Ціль, яку переносять третій рік поспіль, зазвичай так і не стала ціллю церкви." },
                { title: "Зафіксуйте висновок", text: "Кілька речень у документі сезону. Їх прочитають наступні лідери." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Зростання видно в русі людей; повний зал — лише тло.",
        "Ціль = показник + стартове число + дата + одне ім'я.",
        "Міряйте ціль тим, що церква вже відмічає, без опитувань.",
        "Три-чотири цілі на рік, не більше.",
        "Невиконану ціль розбирають письмово, перш ніж переносити.",
      ],
      faq: [
        {
          q: "Які показники здоров'я церкви дивитись щомісяця?",
          a: "П'ять: скільки гостей прийшли вдруге, яка частка людей у малих групах, скільки людей перейшли на наступний етап, скільки служителів стоять у графіку без перерви понад місяць і скільки прохань закрито вчасно.",
        },
        {
          q: "Чи доречно ставити числові цілі в церкві?",
          a: "Так, коли число описує практичну справу: чи зателефонували гостю, чи має людина групу. Такі числа міряють не духовний стан, а нашу вірність і відповідальність.",
        },
        {
          q: "З чого почати, якщо даних немає взагалі?",
          a: "З кварталу вимірювань без цілей. Фіксуйте відвідуваність і склад груп, і за три місяці матимете стартове число.",
        },
        {
          q: "Хто має формулювати цілі?",
          a: "Пастор і керівники напрямів разом. Ціль, у формулюванні якої лідер не брав участі, виконується формально або не виконується взагалі.",
        },
      ],
      cta: {
        title: "Цілі та метрики в системі",
        text: "Показник, стартове число, термін і відповідальний — і прогрес, який видно щомісяця.",
        label: "Модуль «Цілі та метрики»",
        href: "/modules/goals",
      },
    },
    en: {
      seoTitle: "How to measure church growth: health metrics and yearly goals",
      seoDescription:
        "Which numbers show a church is moving and which only reassure: five church health metrics, and how to set yearly goals you can actually check.",
      title: "How to measure church growth and set goals",
      lead: "“We want to grow” is a mood, not a goal. Church growth can be measured: count how people move, and write each yearly goal as a number with a date.",
      keywords: [
        "how to measure church growth",
        "church health metrics",
        "church growth metrics",
        "church goals for the year",
        "church strategic planning",
      ],
      problem: {
        title: "There are plans, but nobody knows if they happened",
        text: "Five directions announced in January. In December nobody can say which worked: none had a number to check against.",
      },
      sections: [
        {
          heading: "Numbers that reassure and numbers that show movement",
          blocks: [
            {
              kind: "text",
              text: "Churches usually count what is easy: Sunday headcount, events, names in the database. These numbers feel good, but a room can be full every week with different people each time.",
            },
            {
              kind: "table",
              columns: ["Shows movement", "Instead of", "Why"],
              rows: [
                ["Guests who came back within a month", "Sunday headcount", "A full room does not say who stayed"],
                ["People who moved a stage forward this year", "Names in the database", "The database grows even as people leave"],
                ["Share of people in a small group", "Events held", "An event is the team's work; in a group someone gets noticed"],
                ["Volunteers rostered with no break for over a month", "Volunteers on the list", "A long list does not stop the same ten people burning out"],
                ["Requests closed, and in how many days", "Requests received", "An unanswered request multiplies disappointment"],
              ],
            },
            {
              kind: "text",
              text: "Do count Sunday attendance, as background. Where a person's path most often breaks is in [From first visit to leader](/blog/vid-vidviduvacha-do-lidera).",
            },
            {
              kind: "callout",
              title: "Five church health metrics",
              text: "If you track only five numbers, take the table's first column: returning guests, the share in groups, stage transitions, volunteers with no break and requests closed. All five come from check-ins the church already records.",
            },
          ],
        },
        {
          heading: "A goal has four parts",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "What changes", text: "A metric you can count, such as the share of people in small groups." },
                { title: "From what to what", text: "Today's number and the one you want to reach." },
                { title: "By when", text: "A year, a half, a season. Without a date a goal becomes a direction." },
                { title: "Who owns it", text: "One name, even if a whole team does the work." },
              ],
            },
            { kind: "quote", text: "A goal without a starting number is a wish with a deadline." },
          ],
        },
        {
          heading: "Examples of goals you can check",
          blocks: [
            {
              kind: "table",
              columns: ["Area", "Weak wording", "Working wording"],
              rows: [
                ["Small groups", "Develop groups", "Share of people in groups from 38% to 55% by December"],
                ["New people", "Work better with guests", "Guests contacted within a week: from 60% to 90% in six months"],
                ["Ministries", "Avoid overloading the team", "Volunteers rostered over a month running: from 14 to zero this season"],
                ["Leaders", "Raise successors", "Groups with an apprentice: from 9 to 20 of 24 by June"],
              ],
            },
            {
              kind: "text",
              text: "Every working version relies on data the church already collects. A goal that can only be checked with a survey dies in March.",
            },
            {
              kind: "visual",
              caption:
                "The goal from the table's first row. In May the column is at 43%, 12 points under the dashed line: the gap shows seven months out, and the line is crossed only in December.",
              visual: {
                type: "chart",
                title: "People in small groups: from 38% to 55% by December",
                unit: "share of people in small groups, per cent",
                goal: 55,
                goalLabel: "goal 55%",
                bars: [
                  { label: "Jan", value: 38 },
                  { label: "Mar", value: 41 },
                  { label: "May", value: 43 },
                  { label: "Jul", value: 47 },
                  { label: "Sep", value: 49 },
                  { label: "Nov", value: 53 },
                  { label: "Dec", value: 56 },
                ],
              },
            },
          ],
        },
        {
          heading: "How many goals a year",
          blocks: [
            {
              kind: "list",
              items: [
                "Three or four for the whole church. Fifteen goals means no priorities.",
                "One per ministry, worded by its leader.",
                "Health metrics monthly; goal progress quarterly.",
              ],
            },
            {
              kind: "callout",
              title: "A goal is not a report",
              text: "A goal that only comes up before a report is not working. Leaders discuss a live goal every week: what did we do to move it?",
            },
            {
              kind: "solution",
              title: "Three goals a quarter, with a number and a name",
              text:
                "Metric, baseline, deadline and owner sit side by side, and progress is counted from check-ins already in the system.",
              spec: {
                kind: "list",
                title: "Goals and metrics",
                subtitle: "Autumn quarter",
                items: [
                  { title: "Guests reach a group", sub: "Was 18% · goal 30% · by 31 December", meta: "Taras Mykytiuk", badge: { label: "24%", tone: "green" } },
                  { title: "Every ministry has a stand-in", sub: "Was 4 ministries · goal 9 · by 30 November", meta: "Oksana Hnatiuk", badge: { label: "6 of 9", tone: "amber" } },
                  { title: "A call to a newcomer within three days", sub: "Was 9 days · goal 3 days", meta: "Nina Panchuk", badge: { label: "5 days", tone: "amber" } },
                ],
                footer: "The number comes from check-ins and requests — nobody types it in.",
              },
              link: { label: "The Goals and metrics module", href: "/modules/goals" },
            },
          ],
        },
        {
          heading: "When a goal is missed",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Check the data", text: "Missed often means not measured. Make sure the number is true first." },
                { title: "Separate the causes", text: "Not enough people, time, clarity or desire: four different problems with four different fixes." },
                { title: "Do not roll it over automatically", text: "A goal carried for a third year usually never became the church's goal." },
                { title: "Write the conclusion down", text: "A few sentences in the season document. The next leaders will read them." },
              ],
            },
          ],
        },
      ],
      takeaways: [
        "Growth shows in how people move; a full room is only background.",
        "A goal is a metric plus a starting number, a date and one name.",
        "Measure goals with what the church already records, no surveys.",
        "Three or four goals a year, no more.",
        "Review a missed goal in writing before rolling it over.",
      ],
      faq: [
        {
          q: "Which church health metrics should we check monthly?",
          a: "Five: guests who came back, the share of people in small groups, people who moved a stage forward, volunteers rostered with no break for over a month, and requests closed on time.",
        },
        {
          q: "Are numeric goals appropriate for a church?",
          a: "Yes, when the number describes a practical task: whether the guest was called, whether a person has a group. Such numbers measure not spiritual state but our faithfulness and accountability.",
        },
        {
          q: "Where do we start with no data at all?",
          a: "With a quarter of measuring and no goals. Record attendance and group membership, and in three months you have a baseline.",
        },
        {
          q: "Who should word the goals?",
          a: "The pastor and area leads together. A goal a leader did not help shape gets done formally or not at all.",
        },
      ],
      cta: {
        title: "Goals and metrics in the system",
        text: "A metric, a baseline, a deadline and an owner, with progress visible every month.",
        label: "Goals and metrics module",
        href: "/modules/goals",
      },
    },
  },
};
