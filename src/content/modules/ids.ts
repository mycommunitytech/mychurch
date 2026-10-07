/* ────────────────────────────────────────────────────────────────
   Самі лише ідентифікатори модулів — без жодного тексту.

   Копія всіх сорока модулів двома мовами важить близько пів
   мегабайта. Клієнтським секціям («чи є в цього модуля сторінка?»,
   «куди веде посилання?») з неї потрібні тільки id — і якщо вони
   імпортують index.ts, у бандл кожної сторінки їде весь каталог.
   Тому список лежить окремо, а index.ts звіряє його з реальними
   модулями під час збірки: розійдуться — збірка впаде.
   ──────────────────────────────────────────────────────────────── */

/** Модулі зі своєю сторінкою /modules/<id> — у порядку сітки на /modules. */
export const MODULE_IDS = [
  "people",
  "family",
  "ministries",
  "service-planning",
  "groups",
  "learning",
  "onboarding",
  "camps",
  "calendar",
  "seasons",
  "goals",
  "events",
  "analytics",
  "campuses",
  "kids-town",
  "forms",
  "applications",
  "links",
  "automations",
  "campaigns",
  "knowledge",
  "tables",
  "projects",
  "rooms",
  "inventory",
  "infrastructure",
  "org",
  "requests",
  "accounting",
  "telegram",
  "viber",
  "instagram",
  "whatsapp",
  "turbosms",
  "notion",
  "customization",
  "templates",
  "telegram-bot",
  "assistant",
] as const;

const SET = new Set<string>(MODULE_IDS);

/** Чи має модуль власну сторінку — на це спираються посилання в секціях. */
export function hasModulePage(id: string) {
  return SET.has(id);
}

/** Назва модуля (як її показують рольові сторінки) → найкраще посилання:
    власна сторінка, інакше — його група на /modules. */
export function moduleHrefByName(groups: { id: string; items: { id: string; name: string }[] }[], name: string) {
  for (const g of groups) {
    const item = g.items.find((i) => i.name === name);
    if (item) return hasModulePage(item.id) ? `/modules/${item.id}` : `/modules#m-${g.id}`;
  }
  return "/modules";
}

/* ────────────────────────────────────────────────────────────────
   Чого не показувати в каталозі на /modules. Зараз порожньо: замість
   виривати окремі рядки каталог перегрупували в десять блоків
   (2026-09-23) — так тридцять дев'ять модулів читаються як структура
   системи, а не як склад.

   Сторінка модуля лишається живою в будь-якому разі: тут ховається
   лише рядок у каталозі. Додайте id сюди — і він зникне зі списку.
   ──────────────────────────────────────────────────────────────── */
export const CATALOG_HIDDEN = new Set<string>([]);

/** Чи показувати модуль у каталозі на /modules. */
export function inCatalog(id: string) {
  return !CATALOG_HIDDEN.has(id);
}
