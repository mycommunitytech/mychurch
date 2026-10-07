"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { homeClick, scrollToSection, sectionClick } from "@/lib/scroll";
import LogoLink from "@/components/shared/logo-link";
import PreferenceToggles from "@/components/shared/preference-toggles";
import { useLang, useT } from "@/lib/lang";
import { useDemoModal } from "@/context/demo-modal-context";
import { LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { SITE_TELEGRAM } from "@/lib/seo";
import { NAV_LABELS, PLAN_LIVE } from "@/content/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  /* Панель лежить уже не в кнопці, а в самій шапці — на всю її ширину, тож
     і клік повз меню, і наведення мусять знати про два вузли, не про один. */
  const morePanelRef = useRef<HTMLDivElement>(null);
  const moreTimer = useRef<number | null>(null);
  const { open: openModal } = useDemoModal();
  const t = useT();
  const { lang } = useLang();

  /* Верхній ряд — це шлях до продукту: що це, для кого, кому вже працює.
     «Амбасадор» саме тут — жива церква переконує сильніше за будь-який
     розділ про можливості. Решта живе у згортці «Більше», щоб рядок меню
     не перетворювався на список: «Блог» і «Питання» — розділи, куди йдуть
     свідомо і з пошуку, а не проходячи меню зверху вниз, тож вони не мусять
     займати місце в головному ряду. «Модулі» поверталися у верхній ряд
     («не видно модулів»), але ввечері 2026-09-22 власник переніс їх назад
     у згортку — верхній ряд лишається на три пункти: головна, для кого,
     амбасадор. У самій згортці каталог стоїть першим. «ШІ-помічник» того ж дня
     поїхав у згортку — його читають після того, як зрозуміли продукт.
     «Вартості» в меню поки немає: сторінка жива за /pricing, але сум там
     ще не названо, тож ми не ведемо на неї з навігації.
     «Головна» веде на «/», а не на якір огляду: з іншої сторінки якір
     відкривав головну посеред «Все просто», через голову першого екрана.
     «Імпорту» в меню немає зовсім: перенесення даних — це крок всередині
     модулів, тож він живе посиланням у /modules і в статтях блогу, де на
     нього виходять з питання, а не з рядка навігації. */
  const NAV_LINKS = [
    { label: t.nav.product, href: "/", match: "/" },
    { label: t.nav.audience, href: "/for-whom", match: "/for-whom" },
    { label: t.nav.ambassadors, href: LEAD_AMBASSADOR_HREF, match: LEAD_AMBASSADOR_HREF },
  ];

  /* Згортка — не плоский список: спершу дві сторінки про сам продукт, потім
     усе, по що приходять уже після нього — почитати, спитати, написати. «Про
     нас» замикає ряд свідомо: компанію читають, коли продукт уже зрозумілий,
     тож у меню вона стоїть останньою, як і в підвалі. */
  type MoreLink = { label: string; href: string; match: string; hint: string };
  const hint = t.nav.moreHints;
  const MORE_GROUPS: { title: string; items: MoreLink[] }[] = [
    {
      title: t.nav.moreGroups.product,
      items: [
        { label: t.nav.modules, href: "/modules", match: "/modules", hint: hint.modules },
        { label: t.nav.ai, href: "/ai", match: "/ai", hint: hint.ai },
        { label: NAV_LABELS.telegram[lang], href: "/telegram", match: "/telegram", hint: hint.telegram },
      ],
    },
    {
      title: t.nav.moreGroups.read,
      items: [
        { label: NAV_LABELS.blog[lang], href: "/blog", match: "/blog", hint: hint.blog },
        ...(PLAN_LIVE
          ? [{ label: NAV_LABELS.plan[lang], href: "/plan", match: "/plan", hint: hint.plan }]
          : []),
      ],
    },
    {
      title: t.nav.moreGroups.help,
      items: [
        { label: t.nav.faq, href: "/faq", match: "/faq", hint: hint.faq },
        { label: t.nav.support, href: "/support", match: "/support", hint: hint.support },
        { label: t.nav.about, href: "/about", match: "/about", hint: hint.about },
        { label: NAV_LABELS.cooperation[lang], href: "/cooperation", match: "/cooperation", hint: hint.cooperation },
      ],
    },
  ];

  const moreActive = MORE_GROUPS.some((group) => group.items.some((link) => pathname === link.match));

  /* «Контакти» — це якір на головну, а не розділ: на широкому екрані він
     живе іконкою поруч з перемикачами, щоб рядок меню лишався читабельним.
     У шухляді на телефоні місця вистачає — там він текстом, як був. */
  const CONTACTS = { label: t.nav.contacts, href: "/#contacts", match: null };

  /* Якорі на головну («Головна», «Контакти») гортають сторінку, але не
     лишають #hash в адресі: інакше наступне відкриття сайту починалося б
     посеред сторінки, а не згори. З інших сторінок це звичайний перехід —
     там якоря ще нема, його треба спершу завантажити, а вже на місці адресу
     чистить <AnchorGuard />. */

  /* Solidify the bar once the page moves away from the top */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Keep the page still while the mobile drawer is open. Only the vertical axis
     is touched — the shorthand would drop the body's own overflow-x: clip. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = previous;
    };
  }, [open]);

  /* A tall drawer on a short screen (landscape, small phones) must close when
     the route changes rather than hang over the new page. Adjusted during the
     render that brings the new path in, not in an effect: React then drops the
     half-finished output and re-renders before painting, so the drawer never
     flashes over the new page. */
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setOpen(false);
    setMore(false);
  }

  /* Згортка «Більше» закривається кліком повз неї — і клавіатурою теж:
     Escape нижче обробляє шухляду, тут — саме її. */
  useEffect(() => {
    if (!more) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreRef.current?.contains(target) || morePanelRef.current?.contains(target)) return;
      setMore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMore(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [more]);

  /* Escape закриває шухляду — так само, як модалку. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Наведення відкриває «Більше» одразу, а закриває з паузою: коротка
     затримка прощає курсору, що проходить повз кнопку або зрізає кут до
     панелі, і меню не блимає на кожному русі мишки. */
  const cancelMoreClose = () => {
    if (moreTimer.current === null) return;
    window.clearTimeout(moreTimer.current);
    moreTimer.current = null;
  };

  const scheduleMoreClose = () => {
    cancelMoreClose();
    moreTimer.current = window.setTimeout(() => {
      moreTimer.current = null;
      setMore(false);
    }, 180);
  };

  useEffect(() => cancelMoreClose, []);

  /* Клік по пункту меню: «Головна» гортає вгору (або веде на «/» з іншої
     сторінки), якір — до своєї секції, звичайне посилання — просто відкриває
     сторінку. */
  const navClick = (href: string) =>
    href === "/" ? homeClick(pathname === "/") : sectionClick(href);

  /* Один рядок шухляди. */
  const drawerLink = (link: { label: string; href: string; match: string | null }) => (
    <Link
      key={link.href}
      href={link.href}
      onClick={(e) => {
        setOpen(false);
        /* Спершу шухляда їде вгору, потім сторінка — інакше два рухи
           накладаються і перехід виглядає смиканим. */
        if (link.href === "/" && pathname === "/") {
          e.preventDefault();
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
        } else if (link.href.startsWith("/#") && document.getElementById(link.href.slice(2))) {
          e.preventDefault();
          setTimeout(() => scrollToSection(link.href.slice(2)), 300);
        }
      }}
      className={cn(
        "px-4 py-3 rounded-xl text-[16px] leading-[1.2] tracking-[-0.16px] transition-colors",
        link.match && pathname === link.match
          ? "bg-surface-3 text-ink font-medium"
          : "text-ink-2 hover:bg-surface-3"
      )}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <header
        className={cn(
          "w-full h-16 md:h-20 flex items-center justify-between px-5 md:px-8 lg:px-12 py-4 md:py-5 glass-fixed sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "bg-surface/85 border-hairline shadow-[0_6px_24px_-18px_rgba(0,0,0,0.5)]"
            : "bg-surface/70 border-transparent"
        )}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {/* Логотип і права колонка тягнуться порівну (flex-1 від нульової
            бази), тож рядок меню стоїть рівно посередині шапки, а не там,
            куди його відсуне ширина логотипа. */}
        <div className="flex-1 shrink-0">
          <LogoLink size="md" />
        </div>

        {/* Desktop navigation */}
        <nav aria-label={t.nav.primary} className="hidden min-[1100px]:flex items-center justify-center gap-0.5 min-[1260px]:gap-1 shrink-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={navClick(link.href)}
              className={cn(
                "px-2 min-[1260px]:px-2.5 py-2 rounded-full text-[14px] min-[1260px]:text-[15px] leading-[1.2] tracking-[-0.16px] transition-colors duration-200 whitespace-nowrap",
                link.match && pathname === link.match
                  ? "bg-surface-3 text-ink"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* «Більше» — згортка з другорядними розділами. Відкривається
             наведенням: на мишці це на клік менше, а список і так короткий.
             Наведення слухаємо тільки для миші (pointerType) — на тачскріні
             лишається звичайний тап, інакше перший дотик відкривав би і одразу
             закривав меню. Закриття з паузою: курсор, що зрізає кут між
             кнопкою і панеллю, не мусить гасити щойно відкрите меню. */}
          <div
            ref={moreRef}
            className="relative"
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              cancelMoreClose();
              setMore(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              scheduleMoreClose();
            }}
          >
            <button
              type="button"
              onClick={() => {
                cancelMoreClose();
                setMore((v) => !v);
              }}
              aria-expanded={more}
              aria-haspopup="menu"
              className={cn(
                "flex items-center gap-1 px-2 min-[1260px]:px-2.5 py-2 rounded-full text-[14px] min-[1260px]:text-[15px] leading-[1.2] tracking-[-0.16px] transition-colors duration-200 whitespace-nowrap",
                more || moreActive
                  ? "bg-surface-3 text-ink"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink"
              )}
            >
              {t.nav.more}
              <ChevronDown
                className={cn("w-[15px] h-[15px] transition-transform duration-200", more && "rotate-180")}
                strokeWidth={2}
              />
            </button>
          </div>
        </nav>

        {/* Desktop: preferences + CTA */}
        <div className="hidden min-[1100px]:flex flex-1 items-center gap-2 min-[1260px]:gap-3 justify-end">
          {/* За комп'ютером набирати номер нічим — там швидша дія написати.
             Кружечок той самий, що в перемикача теми і в контактів футера:
             36 px, тонкий обідок, bg-surface-2. Був на 4 px більший і з
             сильнішим обідком — у ряду з перемикачами одразу випирав.
             Літачок Send важчий за місяць на тому ж розмірі й тягне масу
             вгору-праворуч, тож 15 px і півпікселя вниз-ліворуч. */}
          <a
            href={SITE_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.telegram}
            title={t.common.telegram}
            className="flex w-9 h-9 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors duration-200 shrink-0"
          >
            <Send className="w-[15px] h-[15px] -translate-x-[0.5px] translate-y-[0.5px]" strokeWidth={2} />
          </a>
          <PreferenceToggles />
          <button
            onClick={openModal}
            data-track="cta"
            data-place="меню"
            className="btn-primary btn-brand group relative flex items-center justify-center h-10 px-4 min-[1260px]:px-5 rounded-full overflow-hidden shrink-0"
          >
            <span className="relative text-white font-semibold text-[15px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
              {t.common.bookDemo}
            </span>
          </button>
        </div>

        {/* Повноширока панель «Більше»: лежить під шапкою від краю до краю,
           тож у кожного пункту є місце на рядок про те, що там усередині.
           Вузька картка в кутку давала лише стовпчик назв (2026-09-22).
           Вона дитина шапки, а не кнопки: інакше ширину обмежував би сам
           пункт меню. Наведення слухає окремо — курсор на шляху з кнопки
           вниз виходить з обгортки кнопки, і без цього меню гасло б. */}
        <div
          ref={morePanelRef}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            cancelMoreClose();
            /* Курсор уже в панелі — тримаємо її відкритою навіть тоді, коли
               він забарився в проміжку між кнопкою і нею. Закрита панель
               подій не отримує (pointer-events-none), тож само собою вона
               від цього не відкриється. */
            setMore(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            scheduleMoreClose();
          }}
          className={cn(
            "absolute left-0 right-0 top-full hidden min-[1100px]:block",
            more ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div
            role="menu"
            aria-hidden={!more}
            className={cn(
              "w-full border-b border-hairline bg-surface shadow-[0_26px_50px_-34px_rgba(0,0,0,0.6)] transition-all duration-200",
              more ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
          >
            {/* Відступи ті самі, що в шапки, і без обмеження ширини: перша
               колонка стоїть рівно під логотипом, остання — під кнопкою.
               «-ml-3» з'їдає власний padding рядка, інакше назви стояли б
               на 12 px правіше за логотип. */}
            <div className="w-full px-5 md:px-8 lg:px-12 py-8 grid grid-cols-3 gap-x-10">
              {MORE_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col -ml-3">
                  <span className="px-3 pb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3 leading-none">
                    {group.title}
                  </span>
                  {group.items.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      tabIndex={more ? 0 : -1}
                      onClick={() => {
                        cancelMoreClose();
                        setMore(false);
                      }}
                      className={cn(
                        "group/item flex flex-col gap-1 w-full max-w-[380px] px-3 py-2.5 rounded-xl transition-colors",
                        pathname === link.match ? "bg-surface-3" : "hover:bg-surface-3"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-[15.5px] leading-[1.2] tracking-[-0.16px] transition-colors",
                          pathname === link.match ? "text-ink font-medium" : "text-ink-2 group-hover/item:text-ink"
                        )}
                      >
                        {link.label}
                        <ArrowRight
                          className="w-[15px] h-[15px] opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                          strokeWidth={2.2}
                        />
                      </span>
                      <span className="text-[13px] text-ink-3 leading-[1.35]">{link.hint}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: toggles + hamburger */}
        <div className="flex min-[1100px]:hidden items-center justify-end gap-2">
          {/* Той самий швидкий контакт, що й на широкому екрані: написати в
             Telegram. Дзвінок тут стояв до 2026-09-21 — церкви пишуть, а не
             набирають; номер лишився в розмітці сайту й у запасному екрані
             форми (lead-fallback), у футері його немає. Вужче за 360 px ховаємо:
             там кожні 44 px виштовхують бургер за край екрана. Розмір — як у
             компактних перемикачів поруч (32 px), не як у бургера. */}
          <a
            href={SITE_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.telegram}
            title={t.common.telegram}
            className="hidden min-[360px]:flex w-8 h-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors duration-200 shrink-0"
          >
            <Send className="w-[14px] h-[14px] -translate-x-[0.5px] translate-y-[0.5px]" strokeWidth={2} />
          </a>
          <PreferenceToggles size="sm" />
          {/* Між телефоном і повним меню (≈640–1260) головна дія лишається на
             видноті: ховати її в шухляду на ноутбуці — втрачати конверсію. */}
          <button
            onClick={openModal}
            data-track="cta"
            data-place="меню (компактне)"
            className="btn-primary btn-brand group relative hidden sm:flex items-center justify-center h-9 px-4 rounded-full overflow-hidden shrink-0"
          >
            <span className="relative text-white font-semibold text-[14px] tracking-[-0.3px] leading-[1.4] whitespace-nowrap">
              {t.common.bookDemo}
            </span>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-9 h-9 flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-surface-3 transition-colors"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
          >
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200 origin-center", open && "rotate-45 translate-y-[6.5px]")} />
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200", open && "opacity-0 scale-x-0")} />
            <span className={cn("w-5 h-[1.5px] bg-ink rounded-full transition-all duration-200 origin-center", open && "-rotate-45 -translate-y-[6.5px]")} />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        className={cn(
          /* overflow-hidden — не косметика: закрита шухляда (-translate-y-full)
             стоїть рівно за шапкою, а скло шапки в Safari не розмиває того, що
             під ним лежить окремим шаром. Chrome такий фон змилює, Safari —
             ні, і синя кнопка «Замовити демо» просвічувала поверх логотипа на
             кожному екрані. Рамка її просто відрізає. */
          "fixed inset-0 top-16 md:top-20 z-40 overflow-hidden min-[1100px]:hidden transition-all duration-300",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 left-0 right-0 max-h-full overflow-y-auto overscroll-contain bg-surface border-b border-hairline transition-transform duration-300 shadow-lg",
            open ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <nav aria-label={t.nav.primary} className="flex flex-col px-5 py-4 gap-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {NAV_LINKS.map((link) => drawerLink(link))}

            {/* У шухляді «Більше» не ховає нічого за другим тапом — воно просто
               підписує, де закінчується головний шлях і починається решта. */}
            {MORE_GROUPS.map((group, i) => (
              <div
                key={group.title}
                /* Лінія стоїть і перед першою групою: вона відрізає головний
                   шлях згори від решти розділів. */
                className={cn("flex flex-col gap-1 mt-2 pt-2 border-t border-hairline", i === 0 && "mt-3")}
              >
                <span className="px-4 pt-3 pb-1 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {group.title}
                </span>
                {group.items.map((link) => drawerLink(link))}
              </div>
            ))}

            {drawerLink(CONTACTS)}
            <div className="pt-3 pb-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  openModal();
                }}
                className="btn-primary btn-brand group relative flex items-center justify-center h-12 w-full rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4]">
                  {t.common.bookDemo}
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
