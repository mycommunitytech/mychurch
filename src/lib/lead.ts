/* Клієнтська частина відправки ліда. Один шлях для модалки демо, брифу і
   плаваючої слухавки, щоб стан кнопки й обробка помилок були однакові
   в усіх трьох формах.

   Сайт статичний, свого роуту /api/lead у нього немає — і це на краще: ключ
   CRM і токен бота в браузер класти не можна. Тому заявка йде на приймач
   public/lead.php, який їде в корінь сайту разом зі статикою, а вже він
   розсилає її паралельно трьома каналами:

     • CRM My Community — картка у воронці (назва, телефон, джерело, коментар);
     • Telegram — щоб менеджер побачив заявку одразу;
     • пошта — третій канал, аби заявка не загубилась.

   Секрети для всіх трьох лежать поруч із сайтом, у lead-secret.php (див.
   шапку public/lead.php).

   ENV:
     NEXT_PUBLIC_LEAD_ENDPOINT — адреса приймача (POST, JSON), /lead.php

   Поки адреса не задана, відправка чесно повертає false, і форма показує
   запасні контакти замість «дякуємо» — краще, ніж мовчазна порожнеча. */

/** Куди форма шле заявку. Приймач — public/lead.php у корені сайту. */
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "";

export interface LeadInput {
  name: string;
  /** Назва церкви, якщо людина її вказала: з неї починається картка в CRM. */
  church?: string;
  phone: string;
  /* Звідки заявка: форма демо, бриф на /modules, плаваюча слухавка,
     де питаємо тільки номер, чи форма матеріалу на /plan. Приймач
     підписує повідомлення по-різному — менеджер має бачити, на що саме
     людина чекає: показати систему, передзвонити чи надіслати файл. */
  source: "demo" | "callback" | "material";
  about?: string;
  size?: string;
  tools?: string[];
  /** Ідентифікатори цілей, позначених у фінальному блоці. */
  goals?: string[];
  /** Роль того, хто заповнив бриф: ідентифікатор із каталогу «Для кого». */
  role?: string;
  /** Пастка для ботів — має лишатись порожньою. */
  company?: string;
}

export type LeadState = "idle" | "sending" | "sent" | "failed";

/* ── Звідки прийшла людина ──────────────────────────────────────────────── */

const UTM_KEY = "mychurch-utm";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/** Мітки кампанії з адреси. Порожньо — людина прийшла без них. */
function utmFromUrl(): string {
  const params = new URLSearchParams(location.search);
  return UTM_PARAMS.map((key) => [key, params.get(key)] as const)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value!.slice(0, 80)}`)
    .join(" ");
}

/* Мітки живуть лише в адресі першої сторінки: перехід за внутрішнім
   посиланням їх губить. Тому запам'ятовуємо на візит — заявка з /pricing
   має знати, що людину привела реклама, яка привела її на головну. */
export function rememberLeadSource(): void {
  if (typeof window === "undefined") return;
  const utm = utmFromUrl();
  if (!utm) return;
  try {
    sessionStorage.setItem(UTM_KEY, utm);
  } catch {
    /* Приватний режим — мітки просто не переживуть перехід на іншу сторінку. */
  }
}

function utmOfVisit(): string {
  if (typeof window === "undefined") return "";
  const current = utmFromUrl();
  if (current) return current;
  try {
    return sessionStorage.getItem(UTM_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Приймач на самому сайті: він розводить заявку по каналах. */
async function sendToReceiver(input: LeadInput): Promise<boolean> {
  if (!LEAD_ENDPOINT) return false;
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        page: typeof location !== "undefined" ? location.pathname : undefined,
        lang: typeof document !== "undefined" ? document.documentElement.dataset.lang : undefined,
        utm: utmOfVisit(),
      }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    /* Свій приймач відповідає {ok:true}; сторонні сервіси часто просто
       віддають 200 — обом віримо, якщо статус успішний. */
    return res.ok && data?.ok !== false;
  } catch {
    return false;
  }
}

export async function sendLead(input: LeadInput): Promise<boolean> {
  /* Заповнену пастку теж шлемо: приймач тихо відповідає «ок», у канали її
     не пускає, але кладе в журнал lead-trap.log. До 2026-10-07 браузер тут
     же відкидав такі заявки сам — і людина, якій автозаповнення вписало
     щось у приховане поле, зникала безслідно. */
  return sendToReceiver(input);
}
