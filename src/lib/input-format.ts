/* Як поле поводиться, поки людина друкує.

   Телефон їде по українській масці «+380 XX XXX XX XX»: код країни стоїть
   намертво, після нього рівно дев'ять цифр — більше набрати неможливо.
   Виняток — номер іншої країни, вставлений чи підставлений браузером з
   плюсом («+48 512 345 678»): його лишаємо як є, плюс і до 15 цифр. До
   2026-10-07 маска переписувала його в «+380 48 512 34 56» — у CRM лягав
   правдоподібний український номер, за яким людину не знайти.
   Ім'я піднімає першу літеру кожного слова, розповідь про церкву — першу
   літеру тексту. Виправляємо на ходу, щоб у заявку не потрапив ні номер
   із зайвими цифрами, ні «віфа петренко», ні «ВІФА» з Caps Lock. */

export const UA_PREFIX = "+380";
/** Скільки цифр іде після коду країни: 67 123 45 67. */
const NATIONAL_LEN = 9;
/** Як вони розбиваються на групи. Сума = NATIONAL_LEN. */
const GROUPS = [2, 3, 2, 2];

/** Найдовший номер за E.164 — разом із кодом країни. */
const INTL_MAX = 15;

/* Номер іншої країни — рядок від останнього плюса, якщо код після нього
   не український. Останнього — бо поле саме підставляє «+380», і номер,
   вставлений після нього, приходить як «+380+48512345678».

   Неукраїнським код вважаємо лише тоді, коли його вже видно: «+3» і «+38»
   ще можуть стати «+380», а «8» і «0» — звичні українські початки
   («80…», «0…»). Тож +3x і +8x набрати вручну цифра за цифрою не вийде —
   лише вставити чи підставити автозаповненням; решту кодів — і набрати. */
function foreignDigits(raw: string): string | null {
  const plus = raw.lastIndexOf("+");
  if (plus < 0) return null;
  const d = raw.slice(plus).replace(/\D/g, "");
  if (!d || d[0] === "0") return null;
  const ua =
    (d[0] === "8" && (d.length < 2 || d[1] === "0")) ||
    (d[0] === "3" && (d.length < 2 || (d[1] === "8" && (d.length < 3 || d[2] === "0"))));
  return ua ? null : d.slice(0, INTL_MAX);
}

/* Цифри номера без коду країни — і скільки цифр з'їв початок рядка.
   Друге потрібне, щоб повернути каретку туди, де вона стояла. */
function split(raw: string): { national: string; eaten: number } {
  let d = raw.replace(/\D/g, "");
  let eaten = 0;
  const drop = (n: number) => {
    eaten += n;
    d = d.slice(n);
  };

  if (d.startsWith("380")) drop(3);
  /* «80…» — стерли плюс і трійку; «0…» — національний запис «0671234567». */
  else if (d.startsWith("80")) drop(2);
  else if (d.startsWith("0")) drop(1);
  /* Хвіст коду країни після Backspace — це не цифри номера. */
  else if (d === "3" || d === "8" || d === "38") drop(d.length);

  /* Номер вставили поверх готового «+380» — код країни подвоївся. Зайвого
     коду завжди рівно стільки, на скільки номер задовгий. */
  while (d.length > NATIONAL_LEN) {
    if (d.startsWith("380")) drop(3);
    else if (d.startsWith("80")) drop(2);
    else if (d.startsWith("0")) drop(1);
    else break;
  }

  /* «+380» і одразу «0»: набирають за звичкою «067…», нуль тут зайвий. */
  const rest = d.replace(/^0+/, "");
  eaten += d.length - rest.length;
  return { national: rest.slice(0, NATIONAL_LEN), eaten };
}

/** Дев'ять цифр номера без коду країни; для номера іншої країни — усі цифри разом із кодом. */
export function phoneDigits(raw: string): string {
  return foreignDigits(raw) ?? split(raw).national;
}

/** «+380 67 123 45 67» із будь-якого вводу: набраного, вставленого, автозаповненого. */
export function formatPhone(raw: string): string {
  const intl = foreignDigits(raw);
  if (intl !== null) return `+${intl}`;
  const d = split(raw).national;
  if (!d) return UA_PREFIX;
  const parts: string[] = [];
  for (let i = 0, g = 0; i < d.length; g++) {
    parts.push(d.slice(i, i + GROUPS[g]));
    i += GROUPS[g];
  }
  return `${UA_PREFIX} ${parts.join(" ")}`;
}

/* Каретка. Після переформатування рядок інший, тож браузер кинув би її
   в кінець — і виправити цифру посеред номера стало б неможливо.
   Рахуємо, скільки цифр номера стояло перед кареткою, і ставимо її
   після стількох же цифр у новому рядку. */
export function phoneCaret(raw: string, caret: number, formatted: string): number {
  const intl = foreignDigits(raw);
  if (intl !== null) {
    const plus = raw.lastIndexOf("+");
    const before = raw.slice(plus, Math.max(plus, caret)).replace(/\D/g, "").length;
    return 1 + Math.min(intl.length, before);
  }
  const { national, eaten } = split(raw);
  const digitsBefore = raw.slice(0, caret).replace(/\D/g, "").length;
  const n = Math.max(0, Math.min(national.length, digitsBefore - eaten));
  if (n === 0) return Math.min(formatted.length, UA_PREFIX.length + 1);
  let seen = 0;
  for (let i = UA_PREFIX.length; i < formatted.length; i++) {
    if (formatted[i] >= "0" && formatted[i] <= "9" && ++seen === n) return i + 1;
  }
  return formatted.length;
}

/* Слово — між пробілами й дефісами: «Іванов-Петров». Апостроф не розділяє,
   інакше «Мар'яна» стала б «Мар'Яна». */
const WORD = /[^\s-]+/gu;

/** Поки друкують: кожне слово з великої, решту не чіпаємо.
    «віфа петренко» → «Віфа Петренко», «іванов-петров» → «Іванов-Петров». */
export function capitalizeWords(raw: string): string {
  return raw.replace(WORD, (w) => w.slice(0, 1).toLocaleUpperCase("uk") + w.slice(1));
}

/** Коли пішли з поля: до того ж опускаємо слова, набрані капсом.
    «ВІФА ПЕТРЕНКО» → «Віфа Петренко», «МакДональд» лишається собою.

    Капс ловимо саме тут, а не під час набору: на другій літері слово ще
    все з великих, і жодне правило не відрізнить Caps Lock від наміру. */
export function normalizeName(raw: string): string {
  return capitalizeWords(raw).replace(WORD, (w) => {
    const tail = w.slice(1);
    const caps = tail !== tail.toLocaleLowerCase("uk") && tail === tail.toLocaleUpperCase("uk");
    return w.slice(0, 1) + (caps ? tail.toLocaleLowerCase("uk") : tail);
  });
}

/** Перша літера тексту — велика, решта як людина написала. */
export function sentenceCase(raw: string): string {
  const i = raw.search(/\p{L}/u);
  if (i < 0) return raw;
  return raw.slice(0, i) + raw[i].toLocaleUpperCase("uk") + raw.slice(i + 1);
}
