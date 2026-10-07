/* Порядок сцен у петлі — за каталогом /modules (src/lib/i18n.ts → modules.groups).
   Кожна сцена живе у scenes/<id>.js. Сцена, якої ще немає, просто пропускається.
   Добірка для показу: tv.html?only=intro,people,ministries,outro */
window.TV = window.TV || {};
/* Темп усієї петлі: сцени записані «як задумано», а грають на чверть повільніше —
   на презентації людина ловить екран краєм ока (2026-10-01: «дуже швидко, не встигаєш»;
   0.8 виявилось задовгим — «давай пришвидшувати», тож 0.9).
   Міняється адресою ?speed=0.7 або клавішами − / + під час показу. */
TV.SPEED = 0.9;
TV.ORDER = [
  "intro",            // «Моя» і «Церква» на синьому + категорія
  "space",            // «Єдиний простір для вашої церкви / служіння / групи / клубу / організації» + головна
  "roles",            // «Для кожного в церкві»: пастор, лідер, диякон, служитель…
  "pocket",           // мобільний простір: телефон перебудовується під кожну роль
  // Люди та сім'ї
  "people", "family", "onboarding",
  // Активності
  "ministries", "groups", "groups-analytics", "kids-town", "learning", "camps",
  // Планування
  "calendar", "events", "service-planning", "songs", "sermons", "handover", "projects",
  // Інструменти
  "forms", "applications", "links", "knowledge", "campaigns", "telegram-bot", "assistant",
  // Цілі та метрики
  "analytics", "results", "goals",
  // Структура
  "org", "requests", "campuses",
  // Інвентаризація і бухгалтерія
  "rooms", "inventory", "accounting",
  // Кастомізація
  "customization", "routine", "automations",
  "all-in-one",       // «Все в одному місці»: сітка всіх модулів складається в одне вікно
  "organize",         // «Допоможемо організувати»: хаос складається в одне вікно системи
  "outro",            // «Досягай людей» + QR «Запланувати зустріч»
];

/* Готові добірки. Без параметрів грає main; повна петля (усі сцени) — tv.html?list=all.
   main — те, що власник дивився й доповнював 2026-10-01: «додай кемпуси, інвентаризацію,
   кімнати, форми, посилання, онбординг, календар, таблиці, детальну аналітику груп». */
TV.LISTS = {
  // Без повторів (2026-10-01, «скоротити й прибрати дублювання»): пісні вже є в плануванні,
  // форми — у посиланнях, цифри аналітики — у «Єдиному просторі» й «Що працює», «Буду» з
  // Telegram — у мобільному просторі.
  main: [
    "intro", "space", "roles", "pocket",
    "people", "ministries", "service-planning", "sermons", "handover",
    "groups", "groups-analytics", "kids-town", "learning",
    "calendar", "rooms", "inventory",
    "links", "knowledge", "assistant",
    "results", "org", "campuses", "customization", "routine", "automations",
    "organize", "outro",
  ],
  // ≈ 5 хв: найсильніше, по одній сцені на тему.
  short: [
    "intro", "space", "roles", "pocket",
    "people", "ministries", "service-planning", "groups", "groups-analytics", "kids-town",
    "rooms", "links", "assistant", "results", "customization", "routine",
    "organize", "outro",
  ],
};

/* Бік екрана в основній добірці: щоб сусідні сцени не стояли однаково, петля
   сама дзеркалить ці (L — екран ліворуч, R — праворуч). Порахувано під main;
   змінили порядок — перерахуйте, щоб чергування не збилось. */
TV.SIDE = {
  "service-planning": "L", "groups": "R", "groups-analytics": "L", "kids-town": "R",
  "learning": "L", "links": "L", "assistant": "L", "org": "L",
  "customization": "L",
};
