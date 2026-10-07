import { ALL_GOALS } from "@/content/builder";

/* ────────────────────────────────────────────────────────────────
   Хто заповнює бриф — і з чого починає саме він.

   Питання «яка ваша роль?» стоїть першим не для картки в CRM, а
   щоб наступне питання («що хочете покращити») відкривалось уже
   з тими бажаннями, які ця роль називає першими: пастор дивиться
   на церкву цілком, лідер — на свою групу, бухгалтер — на гроші.
   Решта каталогу нікуди не дівається, вона на крок далі, у вікні
   вибору.

   Ролі — ті самі ідентифікатори, що й у каталозі «Для кого»
   (ROLE_IDS), лише підмножина: відвідувач і член церкви системи
   для громади не замовляють. Виняток один — «волонтер» (`helper`):
   у брифі його просили окремо від служителя (2026-09-22), а
   сторінки ролі в нього немає, тож іконка й колір лежать у
   role-icons поруч із рештою. Бажання — ідентифікатори з
   конструктора, порядком «що назвуть першим».
   ──────────────────────────────────────────────────────────────── */

export const BRIEF_ROLES = ["pastor", "leader", "deacon", "volunteer", "helper", "accountant", "reception"] as const;
export type BriefRole = (typeof BRIEF_ROLES)[number];

const ROLE_GOALS: Record<BriefRole, string[]> = {
  pastor: ["numbers", "attendance", "goals", "assistant", "ministries", "groups", "org", "campuses"],
  leader: ["groups", "attendance", "comms", "planning", "ministries", "calendar", "learning", "requests"],
  deacon: ["requests", "families", "comms", "money", "membership", "calendar", "projects"],
  volunteer: ["ministries", "planning", "calendar", "learning", "knowledge", "comms", "projects"],
  helper: ["events", "calendar", "ministries", "camps", "projects", "comms", "rooms"],
  accountant: ["money", "numbers", "gather", "projects", "inventory", "camps", "forms"],
  reception: ["attendance", "forms", "kids", "calendar", "rooms", "families", "membership", "requests"],
};

/* Коли роль ще не названо, список відкривається тим, що називають
   найчастіше незалежно від ролі. */
const DEFAULT_GOALS = ["attendance", "groups", "comms", "requests", "ministries", "numbers"];

/** Бажання цієї ролі, зверху вниз. Невідомий id мовчки відкидаємо:
    каталог конструктора змінюється частіше за цей список. */
export function goalsForRole(role: string | null): string[] {
  const ids = (role && ROLE_GOALS[role as BriefRole]) || DEFAULT_GOALS;
  return ids.filter((id) => ALL_GOALS.some((g) => g.id === id));
}
