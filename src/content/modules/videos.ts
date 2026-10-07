/* ────────────────────────────────────────────────────────────────
   Демо-записи по модулях. Ключ — id модуля, значення — id ролика на
   YouTube (те, що в посиланні після `youtu.be/` або `v=`). Ролики
   лежать на каналі церкви «Нове Життя».

   Дорога сюди: Google Drive (чужий плеєр у рамці, «запросити доступ»
   у кого інший акаунт) → YouTube без роликів (нікому було заливати) →
   свій файл у public/clips → знову YouTube (2026-09-30), коли церква
   сама виклала записи на свій канал. Ціна — другий тап на iPhone:
   iOS не дає автоплей зі звуком у чужому iframe.

   Порожній рядок (або відсутній ключ) = модуль просто без відео:
   секція на сторінці модуля і картка на сторінці амбасадора зникають.
   ──────────────────────────────────────────────────────────────── */
export const MODULE_VIDEOS: Record<string, string> = {
  people: "WBSzPQReAl0", // Люди і сім'ї
  family: "WBSzPQReAl0", // той самий запис
  groups: "UqvdiGIYTMA", // Малі групи
  learning: "XhS7MDuEGts", // Навчання
  onboarding: "rRoZF2h37sA", // Онбординг
  forms: "L13ZsNMBgOQ", // Форми
  links: "k87udfXmAZ8", // Посилання
  automations: "ovGKyD2uUVA", // Автоматизація
  org: "ANiSc2J_TPQ", // Структура
  analytics: "_s0HW7OqpBk", // Аналітика
  "telegram-bot": "OKZdOR6Szu8", // Чат бот
};

export function getModuleVideo(id: string): string | undefined {
  return MODULE_VIDEOS[id] || undefined;
}

/* Кружечок на наведення — окремий файл у нас на хостингу, а не ролик:
   шість секунд без звуку, 360×360, ~70 КБ. Тягнути плеєр YouTube на
   кожне наведення не можна, та й кружечок грає сам, без тапу. Файли
   робить scripts/clip-previews.sh зі старих повних записів і кладе в
   public/clips/preview/ — поза репозиторієм (.gitignore). Для
   «Аналітики» і «Чат бота» кружечків ще немає. */
const MODULE_CLIP_PREVIEWS: Record<string, string> = {
  people: "people",
  family: "people",
  groups: "groups",
  learning: "learning",
  onboarding: "onboarding",
  forms: "forms",
  links: "links",
  automations: "automations",
  org: "org",
};

export function getModuleClipPreview(id: string): string | undefined {
  const file = MODULE_CLIP_PREVIEWS[id];
  return file ? `/clips/preview/${file}.mp4` : undefined;
}

/* Кадр до тапу — та сама обкладинка, що на YouTube (назва модуля,
   підпис, людина), тільки збережена в себе: до тапу сторінка не робить
   жодного запиту до YouTube — ні плеєра, ні cookies. Новий ролик —
   забрати i.ytimg.com/vi/<id>/maxresdefault.jpg і покласти поруч. */
const MODULE_VIDEO_POSTERS: Record<string, string> = {
  people: "/ambassadors/video/cover/people.webp",
  family: "/ambassadors/video/cover/people.webp",
  groups: "/ambassadors/video/cover/groups.webp",
  learning: "/ambassadors/video/cover/learning.webp",
  onboarding: "/ambassadors/video/cover/onboarding.webp",
  forms: "/ambassadors/video/cover/forms.webp",
  links: "/ambassadors/video/cover/links.webp",
  automations: "/ambassadors/video/cover/automations.webp",
  org: "/ambassadors/video/cover/org.webp",
  analytics: "/ambassadors/video/cover/analytics.webp",
  "telegram-bot": "/ambassadors/video/cover/telegram-bot.webp",
};

export function getModuleVideoPoster(id: string): string | undefined {
  return MODULE_VIDEO_POSTERS[id];
}

/* Чистий кадр без напису: людина стоїть по центру. Він — фон каруселі
   відгуків (там свій заголовок — цитата, і напис обкладинки під нею
   тільки заважав) і джерело облич: кружечок біля імені і рейка облич.

   З 2026-09-30 кадр робиться з нової обкладинки (синя сітка), а не зі
   старого фіолетового запису: scripts/video-faces.py пересуває людину
   в центр і домальовує сітку там, де був заголовок. Тека нова (face/),
   бо старі файли в /ambassadors/video/ nginx тримає в кеші 30 днів. */
const MODULE_VIDEO_FACES: Record<string, string> = {
  people: "/ambassadors/video/face/people.webp",
  family: "/ambassadors/video/face/people.webp",
  groups: "/ambassadors/video/face/groups.webp",
  learning: "/ambassadors/video/face/learning.webp",
  onboarding: "/ambassadors/video/face/onboarding.webp",
  forms: "/ambassadors/video/face/forms.webp",
  links: "/ambassadors/video/face/links.webp",
  automations: "/ambassadors/video/face/automations.webp",
  org: "/ambassadors/video/face/org.webp",
  analytics: "/ambassadors/video/face/analytics.webp",
  "telegram-bot": "/ambassadors/video/face/telegram-bot.webp",
};

export function getModuleVideoFace(id: string): string | undefined {
  return MODULE_VIDEO_FACES[id];
}
