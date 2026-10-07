import type { ModuleDetail } from "./types";

/* Module pages: campuses — their catalogue group is the `group` field below. */
export const campusesModules: ModuleDetail[] = [
  {
    id: "campuses",
    group: "structure",
    related: ["analytics", "calendar", "ministries", "rooms"],
    copy: {
      ua: {
        seoTitle: "Кемпуси — модуль «Моя Церква»",
        seoDescription: "Кілька локацій однієї церкви в одній базі: свої люди, служіння й розклад у кожному кемпусі та спільна картина для старшого пастора.",
        title: "Кілька кемпусів — одна церква, одна база",
        lead: "Модуль «Кемпуси» дає кожній локації свій простір: людей, служіння, розклад і команду. А старший пастор бачить усю церкву разом — без зведення таблиць із трьох районів.",
        highlights: [
          "Свої люди, служіння й розклад у кожному кемпусі",
          "Одна база — людина не дублюється при переїзді",
          "Доступ лідерів обмежений своїм кемпусом",
          "Порівняння кемпусів на одному екрані",
        ],
        features: [
          { icon: "Building2", title: "Простір кемпусу", text: "Кожна локація має свої служіння, малі групи, приміщення й команду — і за замовчуванням бачить лише своє." },
          { icon: "Eye", title: "Загальна картина", text: "Старший пастор бачить усі кемпуси разом: людей, явку, ріст — і кожен окремо одним перемиканням." },
          { icon: "UserCheck", title: "Одна людина — одна картка", text: "Переїхав з Виноградаря на Лівий берег — історія лишається, змінюється лише кемпус у профілі." },
          { icon: "Lock", title: "Доступ за кемпусом", text: "Пастор кемпусу керує своєю локацією; чужих людей і нотаток не бачить, поки ви не дозволите." },
          { icon: "CalendarDays", title: "Розклад кожної локації", text: "Служіння о 10:00 у Центрі та о 12:00 на Виноградарі — окремі календарі й спільні події всієї церкви." },
          { icon: "BarChart3", title: "Порівняння кемпусів", text: "Явка, новенькі, групи — поруч в одній таблиці, щоб бачити, якій локації потрібна допомога." },
        ],
        steps: [
          { title: "Створіть кемпуси", text: "Назва, адреса, час служінь, пастор локації. Три хвилини на кожен." },
          { title: "Розподіліть людей і групи", text: "Призначте кемпус кожній людині, групі та служінню — масово з фільтра або одразу під час імпорту." },
          { title: "Дайте доступ командам", text: "Пастор і лідери кемпусу отримують ролі в межах своєї локації; старший пастор — над усіма." },
          { title: "Дивіться разом і окремо", text: "Один дашборд на всю церкву, перемикач кемпусу — і перед вами конкретна локація." },
        ],
        audience: [
          { role: "pastor", text: "Старший пастор порівнює кемпуси й бачить усю церкву; пастор кемпусу — свою локацію повністю." },
          { role: "leader", text: "Веде групу чи служіння свого кемпусу, бачить його розклад і вільні приміщення." },
          { role: "reception", text: "Відмічає прихід у своїй локації й знаходить людину, навіть якщо вона з іншого кемпусу." },
          { role: "member", text: "Бачить розклад і події свого кемпусу та загальні події церкви." },
        ],
        faq: [
          { q: "Що, як людина ходить на два кемпуси?", a: "У профілі є основний кемпус і будь-яка кількість додаткових. Явка враховується там, де людина була, а в статистиці церкви вона не подвоюється." },
          { q: "Чи бачить пастор кемпусу людей з інших локацій?", a: "За замовчуванням — ні. Ви самі вирішуєте, які ролі бачать усю церкву, а які — лише свій кемпус." },
          { q: "Чи можна мати спільні служіння для всієї церкви?", a: "Так. Подія або служіння позначається як загальноцерковне і з'являється в календарі кожного кемпусу." },
          { q: "Ми тільки відкриваємо другу локацію. Чи не зарано?", a: "Ні. Створіть другий кемпус, щойно з'явиться перша група людей — простіше почати з чистої структури, ніж потім ділити базу." },
        ],
        mock: {
          kind: "table",
          title: "Кемпуси",
          subtitle: "4 локації · 428 людей · нд, 21 квітня",
          columns: ["Кемпус", "Людей", "Явка нд", "Груп"],
          rows: [
            { cells: ["Центр", "186", "142", "10"], badge: { label: "+5 нових", tone: "green" } },
            { cells: ["Виноградар", "124", "91", "6"], badge: { label: "+3 нових", tone: "green" } },
            { cells: ["Лівий берег", "76", "47", "4"], badge: { label: "Явка −12%", tone: "amber" } },
            { cells: ["Бровари", "42", "36", "3"], badge: { label: "Новий кемпус", tone: "brand" } },
            { cells: ["Вся церква", "428", "316", "23"], badge: { label: "+10 за тиждень", tone: "neutral" } },
          ],
        },
      },
      en: {
        seoTitle: "Campuses — My Church module",
        seoDescription: "Several locations of one church in one database: each campus has its own people, ministries and schedule, and the senior pastor sees the whole church.",
        title: "Several locations, one church, one database",
        lead: "The Campuses module gives every location its own space: people, ministries, schedule and team. The senior pastor sees the whole church together — no merging spreadsheets from three districts.",
        highlights: [
          "Own people, ministries and schedule per campus",
          "One database — no duplicates when someone moves",
          "Leader access limited to their own campus",
          "Campuses compared side by side on one screen",
        ],
        features: [
          { icon: "Building2", title: "Campus space", text: "Each location has its own ministries, small groups, rooms and team — and by default sees only its own." },
          { icon: "Eye", title: "The whole picture", text: "The senior pastor sees all campuses together: people, attendance, growth — and each one on its own with a single switch." },
          { icon: "UserCheck", title: "One person, one profile", text: "Moved from Obolon to Left Bank — the history stays, only the campus in the profile changes." },
          { icon: "Lock", title: "Access by campus", text: "A campus pastor runs their location; they don't see other people or notes until you allow it." },
          { icon: "CalendarDays", title: "A schedule per location", text: "Service at 10:00 in the Centre and at 12:00 in Obolon — separate calendars plus church-wide events." },
          { icon: "BarChart3", title: "Campus comparison", text: "Attendance, newcomers, groups — side by side in one table, so you can see which location needs help." },
        ],
        steps: [
          { title: "Create the campuses", text: "Name, address, service times, campus pastor. Three minutes each." },
          { title: "Assign people and groups", text: "Set a campus for every person, group and ministry — in bulk from a filter or straight during import." },
          { title: "Give teams access", text: "The campus pastor and leaders get roles within their location; the senior pastor sits above all of them." },
          { title: "View together and apart", text: "One dashboard for the whole church, a campus switch — and you're looking at a single location." },
        ],
        audience: [
          { role: "pastor", text: "The senior pastor compares campuses and sees the whole church; a campus pastor sees their location in full." },
          { role: "leader", text: "Runs a group or ministry in their own campus and sees its schedule and free rooms." },
          { role: "reception", text: "Checks people in at their location and can find a person even if they belong to another campus." },
          { role: "member", text: "Sees the schedule and events of their own campus plus church-wide events." },
        ],
        faq: [
          { q: "What if someone attends two campuses?", a: "A profile has a home campus and any number of additional ones. Attendance counts where the person actually was, and church-wide statistics never double-count them." },
          { q: "Can a campus pastor see people from other locations?", a: "Not by default. You decide which roles see the whole church and which see only their own campus." },
          { q: "Can we hold church-wide services?", a: "Yes. Mark an event or service as church-wide and it appears in every campus calendar." },
          { q: "We're only opening our second location. Is it too early?", a: "No. Create the second campus as soon as the first group of people appears — it's easier to start with a clean structure than to split the database later." },
        ],
        mock: {
          kind: "table",
          title: "Campuses",
          subtitle: "4 locations · 428 people · Sun 21 April",
          columns: ["Campus", "People", "Sun att.", "Groups"],
          rows: [
            { cells: ["Centre", "186", "142", "10"], badge: { label: "+5 new", tone: "green" } },
            { cells: ["Obolon", "124", "91", "6"], badge: { label: "+3 new", tone: "green" } },
            { cells: ["Left Bank", "76", "47", "4"], badge: { label: "Attendance −12%", tone: "amber" } },
            { cells: ["Brovary", "42", "36", "3"], badge: { label: "New campus", tone: "brand" } },
            { cells: ["Whole church", "428", "316", "23"], badge: { label: "+10 this week", tone: "neutral" } },
          ],
        },
      },
    },
  },
];
