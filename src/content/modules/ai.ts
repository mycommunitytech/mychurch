import type { ModuleDetail } from "./types";

/* Module pages: assistant — their catalogue group is the `group` field below. */
export const aiModules: ModuleDetail[] = [
  {
    id: "assistant",
    group: "analytics",
    related: ["analytics", "people", "automations", "telegram-bot"],
    copy: {
      ua: {
        seoTitle: "ШІ-асистенти — модуль «Моя Церква»",
        seoDescription: "ШІ-асистент «Моєї Церкви» відповідає на запитання по базі вашої церкви, помічає, хто перестав приходити, готує зведення тижня й підказує наступний крок.",
        title: "Відповіді про вашу церкву — без таблиць і фільтрів",
        lead: "ШІ-асистент працює на даних, які вже є в «Моїй Церкві»: люди, явка, групи, служіння. Запитайте звичайною мовою — і отримайте не звіт, а відповідь і наступний крок.",
        highlights: [
          "Відповіді на запитання по вашій базі",
          "Сам помічає, хто перестав приходити",
          "Зведення тижня щопонеділка",
          "Дії прямо з відповіді: список, нагадування, розсилка",
        ],
        features: [
          { icon: "MessagesSquare", title: "Запитання звичайною мовою", text: "«Хто не був три тижні?», «Які групи виросли за квартал?» — без фільтрів, звітів і таблиць." },
          { icon: "Eye", title: "Помічає, хто зникає", text: "Стежить за явкою і піднімає людей, які перестали приходити, поки ще можна подзвонити." },
          { icon: "FileText", title: "Зведення тижня", text: "Щопонеділка коротко: хто новий, де впала явка, які групи ростуть і що варто зробити." },
          { icon: "Zap", title: "Дія з відповіді", text: "Надіслати список лідеру, поставити нагадування, запустити розсилку — одним натисканням." },
          { icon: "Lock", title: "Бачить лише те, що й ви", text: "Асистент відповідає в межах вашої ролі: лідер групи не дізнається про чужих людей." },
          { icon: "Smartphone", title: "У Telegram і на дашборді", text: "Запитуйте з телефону через бот церкви або з робочого столу — відповідь та сама." },
        ],
        steps: [
          { title: "Увімкніть асистента", text: "Нічого налаштовувати: він працює на даних, які вже є в системі, і поважає ваші ролі доступу." },
          { title: "Поставте перше запитання", text: "Про людей, явку, групи чи служіння. Відповідь — із вашої бази, з іменами й цифрами." },
          { title: "Підпишіться на зведення", text: "Оберіть день і хто отримує: пастор, рада, лідери. Асистент готує його сам." },
          { title: "Дійте з відповіді", text: "Список лідеру, нагадування собі, розсилка групі — прямо з чату, без переходів між модулями." },
        ],
        audience: [
          { role: "pastor", text: "Запитує про всю церкву й отримує зведення тижня без роботи з фільтрами." },
          { role: "leader", text: "Запитує про свою групу: хто пропускає, кому подзвонити, що змінилось за місяць." },
          { role: "reception", text: "Відповідає гостям одним запитанням: де яка група, коли зустріч, хто лідер." },
          { role: "hr", text: "Бачить навантаження команди: хто служить тричі на тиждень, хто давно не мав вихідного." },
        ],
        faq: [
          { q: "Чи бачить асистент дані, до яких у мене немає доступу?", a: "Ні. Він відповідає в межах вашої ролі. Лідер групи отримує відповіді лише про своїх людей, пастор — про всю церкву." },
          { q: "Куди йдуть дані церкви?", a: "Асистент працює всередині «Моєї Церкви» на вашій базі. Дані не використовуються для навчання моделей і не передаються третім сторонам." },
          { q: "Чи може асистент помилятися?", a: "Він відповідає лише на основі записів у системі й показує, звідки взяв цифру. Якщо явку не відмітили — він так і скаже." },
          { q: "Чи замінює він аналітику?", a: "Ні, він доповнює: дашборди показують картину, асистент відповідає на конкретне запитання й пропонує наступний крок." },
        ],
        mock: {
          kind: "chat",
          title: "ШІ-асистент",
          subtitle: "Онлайн · працює на базі вашої церкви",
          messages: [
            { from: "user", text: "Хто з новеньких за квітень ще без групи?", time: "09:41" },
            { from: "bot", text: "П'ятеро: Дмитро Лис, Марія Іщенко та ще троє. Двоє живуть біля Виноградаря — там є група в четвер.", time: "09:41" },
            { from: "user", text: "Надішли список Наталі й нагадай мені в п'ятницю.", time: "09:42" },
            { from: "bot", text: "Надіслав Наталі Рудь у Telegram. Нагадування — п'ятниця, 10:00. Підготувати зведення тижня для ради?", time: "09:42" },
            { from: "user", text: "Так, на неділю.", time: "09:43" },
            { from: "bot", text: "Готово. Зведення прийде в неділю о 8:00: явка, новенькі, групи, які потребують уваги.", time: "09:43" },
          ],
          input: "Запитайте про вашу церкву…",
        },
      },
      en: {
        seoTitle: "AI assistants — My Church module",
        seoDescription: "The My Church AI assistant answers questions from your church's own data, notices who has stopped coming, prepares the weekly digest and suggests the next step.",
        title: "Answers about your church, no spreadsheets or filters",
        lead: "The AI assistant runs on the data already in My Church: people, attendance, groups, ministries. Ask in plain language — and get an answer and a next step, not a report.",
        highlights: [
          "Answers questions from your own data",
          "Notices who has stopped coming on its own",
          "A weekly digest every Monday",
          "Acts straight from the answer: list, reminder, campaign",
        ],
        features: [
          { icon: "MessagesSquare", title: "Questions in plain language", text: "\"Who hasn't been for three weeks?\", \"Which groups grew this quarter?\" — no filters, reports or spreadsheets." },
          { icon: "Eye", title: "Notices who drifts away", text: "Watches attendance and raises the people who stopped coming while there's still time to call." },
          { icon: "FileText", title: "Weekly digest", text: "Every Monday, briefly: who's new, where attendance dropped, which groups are growing and what's worth doing." },
          { icon: "Zap", title: "Act from the answer", text: "Send the list to a leader, set a reminder, launch a campaign — in one tap." },
          { icon: "Lock", title: "Sees only what you see", text: "The assistant answers within your role: a group leader learns nothing about other people's groups." },
          { icon: "Smartphone", title: "In Telegram and on the dashboard", text: "Ask from your phone through the church bot or from your desk — the answer is the same." },
        ],
        steps: [
          { title: "Turn the assistant on", text: "Nothing to configure: it runs on the data already in the system and respects your access roles." },
          { title: "Ask your first question", text: "About people, attendance, groups or ministries. The answer comes from your database, with names and numbers." },
          { title: "Subscribe to the digest", text: "Pick the day and who receives it: the pastor, the board, the leaders. The assistant prepares it itself." },
          { title: "Act from the answer", text: "A list to a leader, a reminder for yourself, a campaign to a group — straight from the chat, no switching modules." },
        ],
        audience: [
          { role: "pastor", text: "Asks about the whole church and gets the weekly digest without touching a filter." },
          { role: "leader", text: "Asks about their own group: who's missing, who to call, what changed this month." },
          { role: "reception", text: "Answers guests with one question: where each group meets, when, and who leads it." },
          { role: "hr", text: "Sees the team's load: who serves three times a week, who hasn't had a day off in a while." },
        ],
        faq: [
          { q: "Can the assistant see data I don't have access to?", a: "No. It answers within your role. A group leader gets answers only about their own people, the pastor about the whole church." },
          { q: "Where does the church's data go?", a: "The assistant works inside My Church on your own database. Your data isn't used to train models and isn't passed to third parties." },
          { q: "Can the assistant get it wrong?", a: "It answers only from the records in the system and shows where each number came from. If attendance wasn't marked, it says so." },
          { q: "Does it replace analytics?", a: "No, it complements it: dashboards show the picture, the assistant answers a specific question and suggests the next step." },
        ],
        mock: {
          kind: "chat",
          title: "AI assistant",
          subtitle: "Online · runs on your church's data",
          messages: [
            { from: "user", text: "Which April newcomers still have no group?", time: "09:41" },
            { from: "bot", text: "Five: Dmytro Lys, Maria Ishchenko and three more. Two live near Obolon — there's a Thursday group there.", time: "09:41" },
            { from: "user", text: "Send the list to Natalia and remind me on Friday.", time: "09:42" },
            { from: "bot", text: "Sent to Natalia Rud in Telegram. Reminder set for Friday, 10:00. Shall I prepare the weekly digest for the board?", time: "09:42" },
            { from: "user", text: "Yes, for Sunday.", time: "09:43" },
            { from: "bot", text: "Done. The digest arrives on Sunday at 8:00: attendance, newcomers, groups that need attention.", time: "09:43" },
          ],
          input: "Ask about your church…",
        },
      },
    },
  },
];
