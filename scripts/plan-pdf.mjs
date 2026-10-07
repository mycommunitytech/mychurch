/* Матеріал «30 днів до порядку» — PDF, який церква забирає з /plan.
   ─────────────────────────────────────────────────────────────────
   Сайт статичний, тож файл не збирається на запит: цей скрипт малює
   HTML і друкує його в public/plan-30-dniv.pdf готовим Chrome. Сам
   PDF лежить у репозиторії — так його віддає хостинг і так його
   видно в історії змін.

   Запуск (після правок тексту нижче):

     node scripts/plan-pdf.mjs

   Chrome шукаємо в такому порядку: CHROME_BIN → браузери Playwright
   (їх ставить `npx playwright install chromium`) → Chrome і Chromium,
   встановлені в системі. Жодного з них немає — скрипт чесно каже,
   що друкувати нічим, і нічого не чіпає.

   Текст плану — один до одного те, що людина отримає файлом. Тижні
   тут і чотири тижні на сторінці /plan (src/content/plan.ts) мусять
   називатись однаково: сторінка показує зміст матеріалу, а не свій
   переказ. Правиш тут — переглянь і там. */

import { access, mkdir, rm, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const run = promisify(execFile);

const OUT = "public/plan-30-dniv.pdf";

/* ── Текст матеріалу ───────────────────────────────────────────────
   Один тиждень — одна сторінка. П'ять кроків, критерій «готово» і
   найчастіша помилка: більше на аркуш не влазить, та й не треба.
   `short` — назва для чотирьох плашок на обкладинці, де довгий
   заголовок ламається на три рядки. */

const BRAND = "Моя Церква";
const SITE = "mychurch.com.ua";

const WEEKS = [
  {
    n: 1,
    title: "Один список людей",
    short: "Один список людей",
    chip: "Одна відповідь замість чотирьох",
    goal: "Щоб на питання «хто в нас є?» була одна відповідь, а не чотири.",
    time: "2–3 години",
    fig: "merge",
    caption: "Чотири місця, де дані живуть зараз, зводяться в один список. Імена й номери — приклад.",
    steps: [
      { title: "Випишіть, де зараз живуть дані", text: "Зошит, таблиця, робочий чат, пам'ять лідера. Зазвичай виходить чотири місця." },
      { title: "Оберіть головний список. Один", text: "Той, де більше людей і свіжіші номери. Решта з цього дня — чернетки." },
      { title: "Домовтесь про колонки", text: "Ім'я, телефон, дата народження, статус, сім'я, група, хто запросив." },
      { title: "Зведіть дублікати за номером", text: "Однакові останні дев'ять цифр — це одна людина." },
      { title: "Позначте, кого не бачили два місяці", text: "Це список для дзвінків, а не звіт для ради." },
    ],
    done: "Будь-кого знаходять за півхвилини, і всі згодні, що список один.",
    trap: "Почати з вибору програми. Спершу список, інструмент — після.",
  },
  {
    n: 2,
    title: "Групи і служіння: хто де",
    short: "Групи і служіння",
    chip: "Кожен має групу і служіння",
    goal: "Щоб кожне ім'я мало свою групу і своє служіння.",
    time: "2 години",
    fig: "who",
    caption: "Та сама картина показує двох: хто без групи і хто тягне три служіння. Імена — приклад.",
    steps: [
      { title: "Випишіть малі групи", text: "Назва, лідер, день і місце зустрічі." },
      { title: "Випишіть служіння", text: "Назва, відповідальний, скільки людей треба на неділю." },
      { title: "Проставте людям групу і служіння", text: "Хто лишився без жодного — окремий список." },
      { title: "Знайдіть перевантажених", text: "Хто стоїть у трьох служіннях одночасно: вони вигорають першими." },
      { title: "Один канал новин на групу", text: "Два чати означають, що половина новин не доходить." },
    ],
    done: "Видно, хто без групи, і видно, хто тягне на собі три служіння.",
    trap: "Рахувати активних на око: «ну, десь половина» — це не число.",
  },
  {
    n: 3,
    title: "Відвідування і графік",
    short: "Відвідування і графік",
    chip: "Видно, хто був, і хто зник",
    goal: "Щоб було видно, хто був, а графік складався на місяць уперед.",
    time: "1 година",
    fig: "sundays",
    caption: "Чотири неділі поспіль — і вже видно, хто зник. Праворуч той самий місяць у графіку служінь.",
    steps: [
      { title: "Оберіть, хто відмічає присутність", text: "Лідер групи, черговий на вході. Головне — однаково щотижня." },
      { title: "Відмічайте чотири неділі поспіль", text: "Без висновків: на одному тижні не видно нічого, на чотирьох — усе." },
      { title: "Складіть графік на місяць уперед", text: "Не на тиждень: місяць дає час попросити заміну самому." },
      { title: "Запишіть правило заміни", text: "Хто не може — сам знаходить заміну і вписує її в графік." },
      { title: "Подивіться, хто зник", text: "Три пропуски поспіль. Поділіть ці імена між лідерами." },
    ],
    done: "Графік на місяць є в усіх, а «хто був у неділю» — це запис, а не спогад.",
    trap: "Відмічати приблизно. Два поля щотижня кращі за десять раз на рік.",
  },
  {
    n: 4,
    title: "Цифри, які дивимось щомісяця",
    short: "Чотири цифри місяця",
    chip: "Чотири числа щомісяця",
    goal: "Щоб на раді дивились на ті самі чотири числа й бачили рух.",
    time: "1 година",
    fig: "funnel",
    caption: "Чотири числа одного місяця й ціль на квартал. Числа — приклад, не наші дані.",
    steps: [
      { title: "Оберіть чотири цифри", text: "Нові люди, з них дійшли до групи, скільки служать, скільки зникли." },
      { title: "Запишіть, звідки берете і хто рахує", text: "Цифра без імені поруч не рахується ніколи." },
      { title: "Порахуйте за минулий місяць", text: "Навіть якщо числа неприємні: треба з чим порівнювати." },
      { title: "Поставте одну ціль на квартал", text: "З числом і датою. «Більше залучення» — це не ціль." },
      { title: "15 хвилин щомісяця", text: "Той самий день, ті самі числа, ті самі люди за столом." },
    ],
    done: "Чотири числа за минулий місяць названі вголос і записані.",
    trap: "Міряти все. Двадцять показників, які ніхто не відкриває, гірші за чотири.",
  },
];

/* ── Як усе це малюється ───────────────────────────────────────────
   Друк — це не екран: кольорові заливки хостинг принтера економить,
   тому фон лишається там, де без нього втрачається сенс (обкладинка,
   шапка тижня), а решта тримається на типографіці й тонких лініях. */

const CSS = `
  /* Шрифт беремо з репозиторію (brand/fonts), а не з мережі: друк має
     виходити однаковим і без інтернету. Manrope змінної ваги — той самий
     файл, з якого зібрані знак і слово бренду. */
  @font-face {
    font-family: "Manrope Local";
    src: url("MANROPE_URL") format("truetype-variations");
    font-weight: 200 800;
    font-style: normal;
  }

  :root {
    --brand: #0069e0;
    --deep: #00509e;
    --soft: #eaf3ff;
    --ink: #0f1115;
    --ink-2: rgba(15, 17, 21, 0.74);
    --ink-3: rgba(15, 17, 21, 0.52);
    --line: rgba(15, 17, 21, 0.13);
    --line-soft: rgba(15, 17, 21, 0.07);
  }

  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Manrope Local", -apple-system, sans-serif;
    color: var(--ink);
    font-size: 10.5pt;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 { margin: 0; letter-spacing: -0.03em; font-weight: 800; }
  p { margin: 0; }

  /* Одне поле на весь документ: 20мм з боків, 17 згори, 15 знизу.
     Сторінка — колонка, тож підвал сам стає на низ через margin-top:auto. */
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    padding: 17mm 20mm 15mm;
    page-break-after: always;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .page:last-child { page-break-after: auto; }

  /* ── Колонтитули ────────────────────────────────────────── */
  .head {
    display: flex; align-items: baseline; justify-content: space-between;
    padding-bottom: 3mm; border-bottom: 0.8pt solid var(--line);
    font-size: 7.5pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--ink-3);
  }
  .head .brand { color: var(--brand); }
  .foot {
    margin-top: auto; padding-top: 4mm; border-top: 0.8pt solid var(--line-soft);
    display: flex; align-items: center; justify-content: space-between;
    font-size: 8pt; color: var(--ink-3);
  }
  .foot .num { font-size: 9.5pt; font-weight: 800; color: var(--ink-2); }

  /* Вкладки тижнів на зрізі — по них зошит гортають, не читаючи. */
  .tabs { position: absolute; right: 6mm; top: 74mm; display: flex; flex-direction: column; gap: 1.4mm; }
  .tabs span {
    width: 8mm; height: 12mm; border-radius: 2mm; background: var(--soft); color: var(--brand);
    font-size: 8.5pt; font-weight: 800; display: flex; align-items: center; justify-content: center;
  }
  .tabs span.on { background: var(--brand); color: #fff; }

  /* ── Обкладинка ─────────────────────────────────────────── */
  .cover { background: #06356e; color: #fff; padding: 0; }
  .cover-art { position: absolute; inset: 0; overflow: hidden; }
  .cover-art .glow {
    position: absolute; width: 260mm; height: 190mm; left: -60mm; top: -70mm; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(0,122,255,0.75), rgba(0,122,255,0));
  }
  .cover-art .glow2 {
    position: absolute; width: 200mm; height: 150mm; right: -70mm; bottom: -60mm; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(140,194,255,0.36), rgba(140,194,255,0));
  }
  .cover-art .grid {
    position: absolute; inset: 0; opacity: 0.16;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px);
    background-size: 16mm 16mm;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 20% 22%, black 6%, transparent 76%);
  }
  .cover-inner { position: relative; z-index: 1; height: 100%; padding: 18mm 20mm 15mm; display: flex; flex-direction: column; }
  .cover-top { display: flex; align-items: center; justify-content: space-between; }
  .brandline { display: flex; align-items: center; gap: 3.2mm; }
  .brandline .mark { width: 9.5mm; height: 9.5mm; }
  .brandline .name { font-weight: 800; font-size: 13pt; letter-spacing: -0.02em; }
  .brandline .name .my { color: #8cc2ff; }
  .cover-top .edition {
    font-size: 7.5pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
  .eyebrow {
    display: inline-block; margin-top: 26mm;
    font-size: 8.5pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #8cc2ff;
  }
  .cover h1 { font-size: 48pt; line-height: 1.0; margin: 5mm 0 0; max-width: 150mm; }
  .cover .lead { margin-top: 6mm; font-size: 13pt; line-height: 1.5; color: rgba(255,255,255,0.84); max-width: 132mm; }

  .cover .outcomes { margin-top: auto; }
  .cover .outcomes-lbl {
    font-size: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.5); padding-bottom: 3.5mm; border-bottom: 1px solid rgba(255,255,255,0.18);
  }
  .cover .outcome {
    display: flex; align-items: center; gap: 4mm; padding: 4.2mm 0;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    font-size: 12pt; font-weight: 500; color: rgba(255,255,255,0.92);
  }
  .cover .outcome .tick { width: 4.6mm; height: 4.6mm; border-radius: 50%; flex: none; background: #8cc2ff; position: relative; }
  .cover .outcome .tick::after {
    content: ""; position: absolute; left: 1.35mm; top: 1.5mm; width: 1.9mm; height: 1mm;
    border-left: 0.9pt solid #06356e; border-bottom: 0.9pt solid #06356e; transform: rotate(-45deg);
  }

  /* Ряд тижнів разом із рядком «по порядку» стоїть на низу обкладинки. */
  .cover .plan-rail { margin-top: auto; }
  .cover .order {
    padding-bottom: 5mm; font-size: 10.5pt; line-height: 1.5; color: rgba(255,255,255,0.62); max-width: 128mm;
  }
  .cover .weeks { display: flex; gap: 3mm; }
  .cover .week-chip { flex: 1; border: 1px solid rgba(255,255,255,0.22); border-radius: 4mm; padding: 4.5mm 4mm; background: rgba(255,255,255,0.06); }
  .cover .week-chip .n { font-size: 8pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #8cc2ff; }
  .cover .week-chip .t { margin-top: 2mm; font-weight: 800; font-size: 11.5pt; line-height: 1.25; }
  .cover .week-chip .g { margin-top: 2mm; font-size: 9pt; line-height: 1.35; color: rgba(255,255,255,0.6); }
  .cover .cover-foot {
    margin-top: 9mm; padding-top: 5mm; border-top: 1px solid rgba(255,255,255,0.18);
    display: flex; justify-content: space-between; font-size: 9.5pt; color: rgba(255,255,255,0.72);
  }

  /* ── Типографіка сторінок ───────────────────────────────── */
  .page-title { margin-top: 7mm; font-size: 22pt; line-height: 1.08; }
  .page-lead { margin-top: 3.5mm; font-size: 10.5pt; line-height: 1.5; color: var(--ink-2); max-width: 150mm; }

  /* ── Тиждень: половина сторінки ─────────────────────────── */
  .week { display: flex; flex-direction: column; }
  /* Риска між тижнями забирає вільне місце сторінки собі: обидва
     блоки стають рівними, а підвал лишається на своєму. */
  .week-split { height: 0; margin: auto 0; border-top: 0.8pt solid var(--line); }
  .week-head { margin-top: 7mm; display: flex; align-items: flex-start; gap: 5mm; }
  .week:first-child .week-head { margin-top: 8mm; }
  .week-num {
    width: 15mm; height: 15mm; border-radius: 3.5mm; background: var(--brand); color: #fff; flex: none;
    display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;
  }
  .week-num .lbl { font-size: 6pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.85; }
  .week-num .val { font-size: 15pt; font-weight: 800; margin-top: 1mm; }
  .week-head h2 { font-size: 18pt; line-height: 1.1; }
  .week-head .goal { margin-top: 2mm; font-size: 10.5pt; line-height: 1.45; color: var(--ink-2); }
  /* Час стоїть у тому ж рядку, що й ціль: окрема плашка з'їдала висоту. */
  .week-head .time { color: var(--brand); font-weight: 700; white-space: nowrap; }

  .fig { margin-top: 4mm; }
  .fig svg { width: 100%; height: auto; display: block; }
  .fig .cap { margin-top: 2.5mm; font-size: 8pt; line-height: 1.4; color: var(--ink-3); }

  /* Крок — один рядок наказу. Пояснення до нього каже схема вище. */
  .steps { margin-top: 5mm; }
  .step { display: flex; align-items: baseline; gap: 3mm; padding: 1.2mm 0; border-top: 0.8pt solid var(--line-soft); }
  .step:first-child { border-top: none; }
  .step .box { width: 4.4mm; height: 4.4mm; border: 1.1pt solid var(--brand); border-radius: 1.2mm; flex: none; transform: translateY(0.4mm); }
  .step .idx { font-size: 8.5pt; font-weight: 800; color: var(--brand); flex: none; }
  .step .t { font-size: 11pt; font-weight: 700; line-height: 1.3; }

  .done-line {
    margin-top: 3.5mm; padding: 3mm 4mm; border-left: 2.5pt solid var(--brand); background: var(--soft);
    border-radius: 0 2mm 2mm 0; font-size: 10pt; line-height: 1.45;
  }
  .done-line .lbl {
    margin-right: 3mm; font-size: 7.5pt; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--deep);
  }

  /* ── Аркуші для заповнення ──────────────────────────────── */
  .sheet-block { margin-top: 5mm; }
  .sheet-lbl {
    font-size: 8pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--deep);
  }
  .sheet-lbl span {
    margin-left: 3mm; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--ink-3); font-size: 9pt;
  }
  table.sheet { width: 100%; border-collapse: collapse; margin-top: 3mm; }
  table.sheet th {
    text-align: left; font-size: 7.5pt; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-3); padding: 0 3mm 2mm 0; border-bottom: 1.2pt solid var(--ink-3);
  }
  table.sheet td { padding: 2.2mm 3mm 2.2mm 0; border-bottom: 0.8pt solid var(--line); font-size: 10pt; vertical-align: top; }
  table.sheet tbody tr:nth-child(even) td { background: rgba(15, 17, 21, 0.022); }
  table.sheet th + th, table.sheet td + td { border-left: 0.8pt solid var(--line-soft); padding-left: 3.5mm; }
  table.sheet td .no { margin-right: 2.5mm; font-size: 8pt; font-weight: 800; color: var(--brand); }
  table.sheet td .hint { color: var(--ink-3); font-size: 9pt; }

  /* ── Що далі ────────────────────────────────────────────── */
  .next { margin-top: auto; padding-top: 5mm; border-top: 0.8pt solid var(--line); }
  .next-text h3 { font-size: 13pt; }
  .next-text p { margin-top: 2.5mm; font-size: 10pt; line-height: 1.5; color: var(--ink-2); max-width: 150mm; }
  .next-text .contacts-line { margin-top: 3mm; font-weight: 700; color: var(--brand); font-size: 10pt; }

  /* ── Схеми ──────────────────────────────────────────────── */
  svg text { font-family: "Manrope Local", sans-serif; fill: var(--ink); }
  svg .t-sm { font-size: 12px; fill: var(--ink-2); }
  svg .t-b { font-size: 13px; font-weight: 800; }
  svg .t-xs { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; fill: var(--ink-3); }
  svg .t-tiny { font-size: 10px; fill: var(--ink-3); }
  svg .t-tag { font-size: 10px; font-weight: 800; fill: var(--brand); }
  svg .t-num { font-size: 14px; font-weight: 800; fill: var(--ink); }
  svg .bx { fill: #ffffff; stroke: rgba(15,17,21,0.16); stroke-width: 1.2; }
  svg .bx-soft { fill: var(--soft); stroke: none; }
  svg .bx-brand { fill: var(--brand); stroke: none; }
  svg .flow { stroke: var(--brand); stroke-width: 1.5; fill: none; }
  svg .flow-soft { stroke: rgba(15,17,21,0.22); stroke-width: 1.2; fill: none; }
  svg .rule { stroke: rgba(15,17,21,0.12); stroke-width: 1; }
  svg .dot-on { fill: var(--brand); }
  svg .dot-off { fill: #ffffff; stroke: rgba(15,17,21,0.28); stroke-width: 1.4; }
  svg .goal { stroke: var(--deep); stroke-width: 1.4; stroke-dasharray: 5 4; fill: none; }
`;
/* Знак бренду: та сама діагональ, що й у логотипі сайту (brand/gen.py) —
   у PDF він мусить бути векторним, тож малюємо прямо тут. */
const MARK = `
<svg class="mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M41.31 30.50A11.06 11.06 0 1 0 36.85 19.75A2.76 2.76 0 0 1 32.51 21.55A11.06 11.06 0 0 0 17.08 36.98A2.76 2.76 0 0 1 15.28 41.32A11.06 11.06 0 0 0 15.28 63.15A2.76 2.76 0 0 1 17.08 67.49A11.06 11.06 0 0 0 32.51 82.92A2.76 2.76 0 0 1 36.85 84.72A11.06 11.06 0 0 0 58.68 84.72A2.76 2.76 0 0 1 63.02 82.92A11.06 11.06 0 0 0 78.45 67.49A2.76 2.76 0 0 1 80.25 63.15A11.06 11.06 0 1 0 69.50 58.69A2.76 2.76 0 0 1 67.70 63.04A11.06 11.06 0 0 0 58.57 72.17A2.76 2.76 0 0 1 54.23 73.97A11.06 11.06 0 0 0 41.31 73.97A2.76 2.76 0 0 1 36.96 72.17A11.06 11.06 0 0 0 27.83 63.04A2.76 2.76 0 0 1 26.03 58.69A11.06 11.06 0 0 0 26.03 45.77A2.76 2.76 0 0 1 27.83 41.43A11.06 11.06 0 0 0 36.96 32.30A2.76 2.76 0 0 1 41.31 30.50A11.06 11.06 0 0 0 41.31 30.50ZM71.89 17.06A11.06 11.06 0 1 0 94.00 17.06A11.06 11.06 0 1 0 71.89 17.06Z" fill="#fff"/>
</svg>`;

/* Те, заради чого місяць і затівається. Три рядки на обкладинці — це
   обіцянка, яку кожен тиждень усередині закриває своїм «Готово, коли». */
const OUTCOMES = [
  "Один список людей замість чотирьох різних",
  "Групи, служіння й графік на місяць уперед",
  "Чотири цифри, на які дивитесь щомісяця",
];

/* file:// до змінного Manrope. Квадратні дужки в імені файла Chrome
   читає лише в закодованому вигляді. */
function fontUrl() {
  return pathToFileURL(resolve("brand/fonts/Manrope[wght].ttf")).href;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── Схеми ─────────────────────────────────────────────────────────
   Одна картинка на тиждень, і вона не ілюстрація, а сам доказ: чотири
   джерела сходяться в список, видно людину без групи і людину на трьох
   служіннях, чотири неділі поспіль, чотири числа й ціль.

   Малюємо самі — це єдиний спосіб мати вектор у друці. Усі імена й
   числа вигадані, і підпис під кожною схемою це каже. */

const ARROW = `<marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
  <path d="M0 0 L10 5 L0 10 z" fill="#0069e0"/></marker>`;

const SOURCES = ["Зошит", "Таблиця в телефоні", "Робочий чат", "Пам'ять лідера"];
const LIST_ROWS = [
  ["Олег Кравець", "+380 67 …", "Член", "Центр"],
  ["Марія Кравець", "+380 50 …", "Член", "Сім'ї"],
  ["Андрій Гринь", "+380 63 …", "Гість", "—"],
];

/* Тиждень 1: чотири місця → один список. */
function figMerge() {
  const boxes = SOURCES.map((name, i) => {
    const y = 6 + i * 26;
    return `<rect class="bx" x="0" y="${y}" width="140" height="20" rx="5"/>
      <text class="t-sm" x="11" y="${y + 14}">${esc(name)}</text>
      <path class="flow-soft" d="M140 ${y + 10} H170"/>`;
  }).join("");
  const rows = LIST_ROWS.map((r, i) => {
    const y = 68 + i * 22;
    const line = i < 2 ? `<path class="rule" d="M236 ${y + 9} H586"/>` : "";
    return `<text class="t-sm" x="240" y="${y}">${esc(r[0])}</text>
      <text class="t-sm" x="360" y="${y}">${esc(r[1])}</text>
      <text class="t-sm" x="452" y="${y}">${esc(r[2])}</text>
      <text class="t-sm" x="522" y="${y}">${esc(r[3])}</text>${line}`;
  }).join("");
  return `<svg viewBox="0 0 600 116" xmlns="http://www.w3.org/2000/svg"><defs>${ARROW}</defs>
    ${boxes}
    <path class="flow" d="M170 16 V94"/>
    <path class="flow" d="M170 55 H206" marker-end="url(#a)"/>
    <rect class="bx" x="222" y="0" width="378" height="116" rx="7"/>
    <rect class="bx-brand" x="222" y="0" width="378" height="4" rx="2"/>
    <text class="t-b" x="240" y="26">Один список</text>
    <text class="t-xs" x="240" y="46">ІМ'Я</text>
    <text class="t-xs" x="360" y="46">ТЕЛЕФОН</text>
    <text class="t-xs" x="452" y="46">СТАТУС</text>
    <text class="t-xs" x="522" y="46">ГРУПА</text>
    <path class="rule" d="M236 54 H586"/>
    ${rows}
  </svg>`;
}

/* Тиждень 2: люди між групами і служіннями. */
function figWho() {
  const people = [
    { name: "Олег Кравець", tag: "три служіння" },
    { name: "Марія Кравець", tag: "" },
    { name: "Андрій Гринь", tag: "без групи" },
    { name: "Ніна Лисенко", tag: "" },
  ];
  const chips = people.map((p, i) => {
    const y = 18 + i * 26;
    const tag = p.tag ? `<text class="t-tag" x="375" y="${y + 14}" text-anchor="end">${esc(p.tag)}</text>` : "";
    return `<rect class="bx" x="195" y="${y}" width="190" height="20" rx="5"/>
      <text class="t-sm" x="206" y="${y + 14}">${esc(p.name)}</text>${tag}`;
  }).join("");
  const box = (x, y, label) =>
    `<rect class="bx-soft" x="${x}" y="${y}" width="145" height="20" rx="5"/>
     <text class="t-sm" x="${x + 11}" y="${y + 14}">${esc(label)}</text>`;
  return `<svg viewBox="0 0 600 122" xmlns="http://www.w3.org/2000/svg">
    <text class="t-xs" x="0" y="8">МАЛІ ГРУПИ</text>
    <text class="t-xs" x="195" y="8">ЛЮДИ</text>
    <text class="t-xs" x="455" y="8">СЛУЖІННЯ</text>
    ${box(0, 44, "Центр")}
    ${box(0, 96, "Молодь")}
    ${box(455, 18, "Прославляння")}
    ${box(455, 57, "Діти")}
    ${box(455, 96, "Зустріч гостей")}
    ${chips}
    <path class="flow" d="M195 54 H145"/>
    <path class="flow" d="M195 106 H145"/>
    <path class="flow" d="M385 28 H455"/>
    <path class="flow" d="M385 28 H415 V67 H455"/>
    <path class="flow" d="M385 28 H432 V106 H455"/>
    <path class="flow" d="M385 106 H455"/>
  </svg>`;
}

/* Тиждень 3: чотири неділі й графік на той самий місяць. */
function figSundays() {
  const att = [
    ["Олег", [1, 1, 1, 1]],
    ["Марія", [1, 0, 1, 1]],
    ["Андрій", [1, 0, 0, 0]],
    ["Ніна", [0, 1, 1, 1]],
  ];
  const dots = att.map(([name, marks], i) => {
    const cy = 40 + i * 24;
    const row = marks
      .map((m, j) => `<circle class="${m ? "dot-on" : "dot-off"}" cx="${145 + j * 40}" cy="${cy}" r="7"/>`)
      .join("");
    return `<text class="t-sm" x="0" y="${cy + 5}">${esc(name)}</text>${row}`;
  }).join("");
  const rota = [
    ["Прославляння", ["Оля", "Іван", "Ніна", "Оля"]],
    ["Діти", ["Ніна", "Оля", "Іван", "Ніна"]],
    ["Зустріч", ["Іван", "Ніна", "Оля", "Іван"]],
  ];
  const cells = rota.map(([name, who], i) => {
    const y = 30 + i * 28;
    const row = who
      .map((n, j) => {
        const x = 428 + j * 43;
        return `<rect class="bx" x="${x}" y="${y}" width="39" height="22" rx="4"/>
          <text class="t-tiny" x="${x + 19}" y="${y + 15}" text-anchor="middle">${esc(n)}</text>`;
      })
      .join("");
    return `<text class="t-sm" x="316" y="${y + 15}">${esc(name)}</text>${row}`;
  }).join("");
  return `<svg viewBox="0 0 600 122" xmlns="http://www.w3.org/2000/svg">
    <text class="t-xs" x="0" y="8">ХТО БУВ · ЧОТИРИ НЕДІЛІ</text>
    <text class="t-xs" x="316" y="8">ГРАФІК НА ТОЙ САМИЙ МІСЯЦЬ</text>
    ${["1-ша", "2-га", "3-тя", "4-та"].map((l, j) => `<text class="t-tiny" x="${145 + j * 40}" y="22" text-anchor="middle">${l}</text>`).join("")}
    ${["1-ша", "2-га", "3-тя", "4-та"].map((l, j) => `<text class="t-tiny" x="${447 + j * 43}" y="22" text-anchor="middle">${l}</text>`).join("")}
    ${dots}
    ${cells}
  </svg>`;
}

/* Тиждень 4: чотири числа місяця і ціль на квартал. */
function figFunnel() {
  const rows = [
    ["Прийшли вперше", 24, 1],
    ["Прийшли ще раз", 15, 0.78],
    ["Дійшли до групи", 9, 0.56],
    ["Служать", 4, 0.4],
  ];
  const bars = rows.map(([label, value, alpha], i) => {
    const y = 4 + i * 26;
    const w = Math.round((value / 24) * 340);
    return `<text class="t-sm" x="0" y="${y + 14}">${esc(label)}</text>
      <rect x="170" y="${y}" width="${w}" height="20" rx="4" fill="#0069e0" fill-opacity="${alpha}"/>
      <text class="t-num" x="600" y="${y + 15}" text-anchor="end">${value}</text>`;
  }).join("");
  return `<svg viewBox="0 0 600 122" xmlns="http://www.w3.org/2000/svg">
    ${bars}
    <path class="goal" d="M397 0 V104"/>
    <text class="t-xs" x="403" y="118">ЦІЛЬ НА КВАРТАЛ — 16</text>
  </svg>`;
}

/* Фінал: чотири результати місяця → місце, де вони живуть разом.
   Назви праворуч — справжні розділи системи, а не вигадані ярлики. */
function figSystem() {
  const got = ["Один список людей", "Групи і служіння", "Відвідування і графік", "Чотири цифри"];
  const boxes = got.map((label, i) => {
    const y = 4 + i * 26;
    return `<rect class="bx" x="0" y="${y}" width="190" height="20" rx="5"/>
      <text class="t-sm" x="12" y="${y + 14}">${esc(label)}</text>
      <path class="flow-soft" d="M190 ${y + 10} H222"/>`;
  }).join("");
  const rows = ["Люди і сім'ї", "Малі групи", "Служіння і графік", "Відвідуваність", "Аналітика"]
    .map((label, i) => `<text class="t-sm" x="${300 + (i % 2) * 150}" y="${54 + Math.floor(i / 2) * 24}">${esc(label)}</text>
      <circle class="dot-on" cx="${288 + (i % 2) * 150}" cy="${50 + Math.floor(i / 2) * 24}" r="4"/>`)
    .join("");
  return `<svg viewBox="0 0 600 106" xmlns="http://www.w3.org/2000/svg"><defs>${ARROW}</defs>
    ${boxes}
    <path class="flow" d="M222 14 V92"/>
    <path class="flow" d="M222 53 H252" marker-end="url(#a)"/>
    <rect class="bx" x="268" y="0" width="332" height="106" rx="7"/>
    <rect class="bx-brand" x="268" y="0" width="332" height="4" rx="2"/>
    <text class="t-b" x="288" y="28">Моя Церква</text>
    ${rows}
  </svg>`;
}

const FIGURES = { merge: figMerge, who: figWho, sundays: figSundays, funnel: figFunnel };

/* Сторінки. Їх чотири, і кожна має свою роботу: обкладинка з картою
   місяця, два розвороти по два тижні й аркуші, які заповнюють.

   Довгі пояснення прибрані 2026-09-22: крок — це один рядок наказу,
   решту каже схема. Те, що не влазить у чотири аркуші, не влазить і
   в голову тому, хто це читає між служіннями. */
const PAGES = { weeks: (n) => (n <= 2 ? 2 : 3), sheets: 4 };

function coverPage() {
  return `
<section class="page cover">
  <div class="cover-art"><div class="glow"></div><div class="glow2"></div><div class="grid"></div></div>
  <div class="cover-inner">
    <div class="cover-top">
      <div class="brandline">${MARK}<span class="name"><span class="my">Моя</span> Церква</span></div>
      <span class="edition">Робочий зошит · 2026</span>
    </div>
    <span class="eyebrow">План для церкви</span>
    <h1>30 днів<br>до порядку</h1>
    <p class="lead">Що робити по тижнях, щоб церква перестала тримати все в голові, в чатах і в чотирьох різних таблицях.</p>
    <div class="outcomes">
      <div class="outcomes-lbl">Наприкінці місяця у вас є</div>
      ${OUTCOMES.map((o) => `<div class="outcome"><span class="tick"></span>${esc(o)}</div>`).join("")}
    </div>
    <div class="plan-rail">
      <p class="order">Виконувати по порядку: кожен наступний тиждень спирається на попередній.</p>
      <div class="weeks">
        ${WEEKS.map(
          (w) => `<div class="week-chip">
            <div class="n">Тиждень ${w.n}</div>
            <div class="t">${esc(w.short)}</div>
            <div class="g">${esc(w.chip)}</div>
          </div>`
        ).join("")}
      </div>
    </div>
    <div class="cover-foot"><span>${SITE}</span><span>Роздруковуйте і передавайте іншим церквам</span></div>
  </div>
</section>`;
}

/* Звичайна сторінка: колонтитул із назвою розділу, вміст, номер унизу. */
function page(section, inner, num, note = "") {
  return `
<section class="page">
  <div class="head"><span class="brand">${BRAND}</span><span>${esc(section)}</span></div>
  ${inner}
  <div class="foot"><span>30 днів до порядку · ${SITE}${note ? " · " + note : ""}</span><span class="num">${num}</span></div>
</section>`;
}

/* Один тиждень — половина сторінки: заголовок, схема, п'ять наказів
   в один рядок і критерій, яким тиждень закривається. */
function weekBlock(week) {
  return `
    <div class="week">
      <div class="week-head">
        <div class="week-num"><span class="lbl">Тиждень</span><span class="val">${week.n}</span></div>
        <div>
          <h2>${esc(week.title)}</h2>
          <p class="goal">${esc(week.goal)} <span class="time">${esc(week.time)} на тиждень</span></p>
        </div>
      </div>
      <div class="fig">${FIGURES[week.fig]()}</div>
      <div class="steps">
        ${week.steps
          .map(
            (s, i) =>
              `<div class="step"><span class="box"></span><span class="idx">${String(i + 1).padStart(2, "0")}</span><span class="t">${esc(s.title)}</span></div>`
          )
          .join("")}
      </div>
      <p class="done-line"><span class="lbl">Готово, коли</span>${esc(week.done)}</p>
    </div>`;
}

function weeksPage(pair, num) {
  return page(
    `Тижні ${pair[0].n} і ${pair[1].n}`,
    pair.map(weekBlock).join('<div class="week-split"></div>'),
    num,
    "імена й числа на схемах — приклад"
  );
}

/* Останній аркуш: дві таблиці, які заповнюють, і чотири рядки про те,
   куди це все потім лягає. */
function sheetsPage() {
  const owners = [
    ["Список людей", "хто вносить нових"],
    ["Гості", "хто пише першим"],
    ["Малі групи", "скільки їх і де"],
    ["Служіння й графік", "хто складає графік"],
    ["Відвідування", "хто відмічає і де"],
    ["Цифри місяця", "хто рахує і кому"],
  ];
  const numbers = [
    "Скільки нових людей прийшло вперше",
    "Скільки з них дійшли до малої групи",
    "Скільки людей служать",
    "Скільки зникли з поля зору",
  ];
  return page(
    "Аркуші · Що далі",
    `
    <h2 class="page-title">Два аркуші, які заповнюють</h2>
    <p class="page-lead">Перший — до кінця другого тижня, другий — щомісяця. Порожній рядок означає процес, якого не робить ніхто.</p>

    <div class="sheet-block">
      <div class="sheet-lbl">Хто за що відповідає</div>
      <table class="sheet">
        <thead><tr><th style="width:42%">Що</th><th style="width:29%">Хто відповідає</th><th>Де це живе</th></tr></thead>
        <tbody>
          ${owners
            .map(
              ([what, hint], i) =>
                `<tr><td><span class="no">${String(i + 1).padStart(2, "0")}</span><b>${esc(what)}</b> <span class="hint">${esc(hint)}</span></td><td></td><td></td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="sheet-block">
      <div class="sheet-lbl">Чотири цифри місяця <span>ціль на квартал — одна, з числом і датою</span></div>
      <table class="sheet">
        <thead><tr><th style="width:42%">Цифра</th><th style="width:29%">Звідки беремо</th><th>Хто рахує · скільки</th></tr></thead>
        <tbody>
          ${numbers
            .map((r, i) => `<tr><td><span class="no">${String(i + 1).padStart(2, "0")}</span><b>${esc(r)}</b></td><td></td><td></td></tr>`)
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="next">
      <div class="next-text">
        <h3>Що далі</h3>
        <p>Місяць пройдено — далі питання одне: де цьому жити. «Моя Церква» бере заповнену таблицю як є: колонки розбирає сама, дублікати за номером зводить.</p>
        <p class="contacts-line">${SITE} · @mychurch_team · +380 96 529 73 75</p>
      </div>
    </div>`,
    PAGES.sheets
  );
}

function html() {
  return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <title>30 днів до порядку — план для церкви | Моя Церква</title>
  <style>${CSS.replace("MANROPE_URL", fontUrl())}</style>
</head>
<body>
  ${coverPage()}
  ${weeksPage([WEEKS[0], WEEKS[1]], PAGES.weeks(1))}
  ${weeksPage([WEEKS[2], WEEKS[3]], PAGES.weeks(3))}
  ${sheetsPage()}
</body>
</html>`;
}

/* ── Друк ──────────────────────────────────────────────────────── */

async function exists(path) {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  const fromEnv = process.env.CHROME_BIN;
  if (fromEnv && (await exists(fromEnv))) return fromEnv;

  const cache = join(homedir(), "Library/Caches/ms-playwright");
  const candidates = [
    join(cache, "chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell"),
    join(cache, "chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  for (const path of candidates) {
    if (await exists(path)) return path;
  }
  return null;
}

async function main() {
  const chrome = await findChrome();
  if (!chrome) {
    console.error(
      "Не знайшов Chrome. Встановіть його або вкажіть шлях:\n" +
        "  CHROME_BIN=/path/to/chrome node scripts/plan-pdf.mjs"
    );
    process.exit(1);
  }

  const work = join(tmpdir(), `plan-pdf-${process.pid}`);
  await mkdir(work, { recursive: true });
  const source = join(work, "plan.html");
  await writeFile(source, html(), "utf8");

  /* virtual-time-budget — щоб шрифти встигли доїхати з мережі:
     без нього Chrome друкує сторінку системним шрифтом. */
  await run(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    "--print-to-pdf-no-header",
    `--print-to-pdf=${OUT}`,
    "--virtual-time-budget=10000",
    `file://${source}`,
  ]).catch((e) => {
    /* Chrome пише в stderr навіть за успішного друку, тож падаємо лише
       тоді, коли файла справді немає — це перевіряється нижче. */
    if (!e?.stderr) throw e;
  });

  try {
    await access(OUT, constants.R_OK);
  } catch {
    await rm(work, { recursive: true, force: true });
    console.error("Друк не вдався: файл не з'явився.");
    process.exit(1);
  }
  console.log(`Готово: ${OUT}`);

  await previews(work);
  await rm(work, { recursive: true, force: true });
}

/* ── Аркуші для сторінки /plan ─────────────────────────────────────
   На сайті матеріал показуємо ним самим, а не намальованою копією:
   перша сторінка і сторінка першого тижня їдуть у public/ картинками.
   Потрібні pdftoppm (poppler) і cwebp; немає — просто пропускаємо, бо
   старі картинки лишаються на місці й сторінка не ламається. */
const PREVIEWS = [
  { page: 1, out: "public/plan-cover.webp", quality: 86 },
  { page: 2, out: "public/plan-week.webp", quality: 84 },
];

async function previews(work) {
  for (const { page, out, quality } of PREVIEWS) {
    const raw = join(work, `preview-${page}`);
    try {
      /* 150 dpi — аркуш виходить ~1240px завширшки, удвічі більший за
         своє місце на сторінці: вистачає і для екранів із подвоєною
         щільністю, і файл лишається легким. */
      await run("pdftoppm", ["-png", "-r", "150", "-f", String(page), "-l", String(page), OUT, raw]);
      await run("cwebp", ["-quiet", "-q", String(quality), `${raw}-${page}.png`, "-o", out]);
      console.log(`Готово: ${out}`);
    } catch {
      console.warn(`Картинку ${out} не оновив: немає pdftoppm або cwebp.`);
      return;
    }
  }
}

main();
