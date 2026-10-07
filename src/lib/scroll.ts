/* Horizontal rails (role strips, view switchers) have to keep the active chip
   in sight on small screens. Element.scrollIntoView() cannot do that job: it
   walks *every* scrollable ancestor, so on a phone it drags the whole document
   down to the section — the page then "opens in the middle". These helpers
   move the rail and nothing else. */

/** Scroll `rail` (and only `rail`) so its nth child sits in the middle. */
export function centerInRail(rail: HTMLElement | null, index: number, smooth = true) {
  if (!rail) return;
  const item = rail.children[index] as HTMLElement | undefined;
  if (!item) return;
  const max = rail.scrollWidth - rail.clientWidth;
  if (max <= 1) return; // the rail is not scrolling — nothing to centre
  const offset = item.getBoundingClientRect().left - rail.getBoundingClientRect().left;
  const target = rail.scrollLeft + offset - (rail.clientWidth - item.offsetWidth) / 2;
  rail.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: smooth ? "smooth" : "auto" });
}

/* Якорі на секції головної («Головна», «Контакти» в меню й у підвалі) гортають
   сторінку, але не лишають #hash в адресі: інакше наступне відкриття сайту
   починалося б посеред сторінки, а не згори. З інших сторінок це звичайний
   перехід — там якоря ще нема, його треба спершу завантажити, а вже на місці
   адресу чистить <AnchorGuard />. */

/* Секції головної, яких ще не видно, браузер не розкладає
   (`content-visibility: auto`, див. .lazy-sections у globals.css) — їхня
   висота поки лише оцінка. Перед стрибком до якоря на мить розкладаємо все:
   браузер запам'ятовує справжні висоти, і прокрутка сідає рівно на блок,
   а не туди, де він був би за оцінкою. */
export function settleSections() {
  const root = document.documentElement;
  root.classList.add("cv-settle");
  void document.body.offsetHeight;
  requestAnimationFrame(() => root.classList.remove("cv-settle"));
}

/** Прокрутити до секції з таким id. */
export function scrollToSection(id: string) {
  settleSections();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Обробник кліку для посилання з якорем («/#секція», «/modules#m-team»):
    якщо секція вже на цій сторінці — гортаємо самі, без переходу. Інакше це
    звичайне посилання: роутер завантажить потрібну сторінку, а адресу там
    почистить <AnchorGuard />. Без цього перехід «на себе» лишає #hash в
    адресі назавжди: роутер робить pushState, а він не будить ані `load`,
    ані `hashchange`, на які й дивиться AnchorGuard. */
export function sectionClick(href: string) {
  return (e: { preventDefault: () => void }) => {
    const id = href.split("#")[1];
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    scrollToSection(id);
  };
}

/** Обробник кліку для посилання на головну («Головна» в меню й у підвалі).
    Веде саме на «/», а не на якір секції: «Головна» мусить відкривати головну
    згори, а не висаджувати людину посеред сторінки — з іншої сторінки перехід
    на «/#product» кидав читача одразу в «Все просто», через голову першого
    екрана. Якщо ми вже на головній — гортаємо вгору самі, без перезавантаження. */
export function homeClick(onHome: boolean) {
  return (e: { preventDefault: () => void }) => {
    if (!onHome) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
