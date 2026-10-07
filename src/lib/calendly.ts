/* Адреса вбудованого календаря Calendly.

   Ми не вантажимо їхній widget.js: він лише створює iframe із цими ж
   параметрами й вішає свій оверлей поверх сторінки. Свій iframe у своєму
   вікні — це той самий календар, але без стороннього скрипта, у наших
   кольорах і з нашим закриттям. Події (обрав час, записався) Calendly
   шле в батьківське вікно через postMessage і без widget.js. */

import { SITE_CALENDLY, SITE_URL } from "@/lib/seo";

/** Звідки відкрили календар — їде в UTM Calendly і в нашу аналітику. */
export type CalendlySource = "demo" | "cta" | "footer";

export interface CalendlyThemeColors {
  /** Фон сторінки календаря — наш `--surface`. */
  background: string;
  /** Основний текст — наш `--ink`. */
  text: string;
  /** Кнопки й обрані дати — наш `--brand`. */
  primary: string;
}

export interface CalendlyUrlOptions {
  source: CalendlySource;
  /** Ім'я з уже надісланої заявки — щоб не набирати двічі. */
  name?: string;
  /** Кольори теми в момент відкриття; невалідні (не #rrggbb) пропускаємо. */
  colors?: Partial<CalendlyThemeColors>;
  /** Хост сторінки, у яку вбудовано календар (Calendly позначає так embed). */
  embedDomain?: string;
}

/** Calendly бере колір як шість шістнадцяткових цифр без «#». Збірка
    стискає #ffffff до #fff — короткий запис розгортаємо назад. */
function hex6(value: string | undefined): string | null {
  const v = value?.trim().replace(/^#/, "").toLowerCase();
  if (!v) return null;
  if (/^[0-9a-f]{6}$/.test(v)) return v;
  if (/^[0-9a-f]{3}$/.test(v)) return v.split("").map((ch) => ch + ch).join("");
  return null;
}

/**
 * Збирає адресу iframe з базової адреси календаря. Параметри, що вже стоять
 * у базовій адресі (наприклад, `month=`), лишаються — дописуємо лише свої.
 * Невалідна адреса повертається як є: краще відкрити хоч щось, ніж нічого.
 */
export function calendlyEmbedUrl(base: string, opts: CalendlyUrlOptions): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }
  const q = url.searchParams;

  /* Календар стоїть у нашому вікні — банер про куки й службова шапка
     Calendly тут зайві. */
  q.set("hide_gdpr_banner", "1");
  q.set("embed_type", "Inline");
  if (opts.embedDomain) q.set("embed_domain", opts.embedDomain);

  const bg = hex6(opts.colors?.background);
  const text = hex6(opts.colors?.text);
  const primary = hex6(opts.colors?.primary);
  if (bg) q.set("background_color", bg);
  if (text) q.set("text_color", text);
  if (primary) q.set("primary_color", primary);

  const name = opts.name?.trim();
  if (name) q.set("name", name.slice(0, 80));

  /* У картці зустрічі в Calendly видно, звідки прийшла людина. */
  q.set("utm_source", new URL(SITE_URL).hostname);
  q.set("utm_medium", "site");
  q.set("utm_content", opts.source);

  return url.toString();
}

/** Кольори теми, як вони стоять зараз, — для календаря в тон сторінці.
    Тільки в браузері: викликати з обробників, не під час рендеру. */
export function themeColorsFromCss(): CalendlyThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const read = (name: string) => cs.getPropertyValue(name).trim();
  return { background: read("--surface"), text: read("--ink"), primary: read("--brand") };
}

/** Чи налаштований календар взагалі — від цього залежить, що показувати. */
export const HAS_CALENDLY = SITE_CALENDLY !== "";
