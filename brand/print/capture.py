"""Знімає екрани продукту з живої збірки сайту — для плакатів і буклета.

    # 1) зібрати сайт і віддати статику (порт будь-який вільний):
    npx next build && python3 -m http.server 3318 --directory .static
    # 2) зняти екрани:
    python3 brand/print/capture.py http://localhost:3318

На друк ідуть ті самі макети, що й на сайті, а не намальовані копії:
змінився макет на сайті — перезняли й перезібрали друк (`build.py`).
Знімаємо з великою щільністю пікселів (DSF), щоб на плакаті A1 екран
тримав 200+ dpi. Тло навколо макета прозоре: тінь і підкладку малює
вже верстка друку. Аналітику блокуємо — знімки не мають бути візитами.
"""
import asyncio
import os
import sys

from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "screens")
BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3318").rstrip("/")

CHROME = os.path.expanduser(
    "~/Library/Caches/ms-playwright/chromium_headless_shell-1243/"
    "chrome-headless-shell-mac-arm64/chrome-headless-shell")
BLOCK = ("google-analytics", "googletagmanager", "firebase", "gstatic.com", "analytics.google")

# Шукає текст і піднімається до першого предка, який підходить під опис
# (картка з тінню і скругленням, корпус телефона тощо). Позначає його
# data-print, робить прозорими всіх предків вище і знімає обрізання.
FIND = """([text, stop]) => {
  // Попередній знімок міг сховати сусідні блоки — повертаємо їх.
  document.querySelectorAll('[data-print-hidden]').forEach(e => {
    e.style.visibility = ''; e.removeAttribute('data-print-hidden'); });
  const isCard = (e) => {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    return cs.boxShadow !== 'none' && parseFloat(cs.borderTopLeftRadius) >= 14 && r.width >= 260;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  const direct = text === '' ? document.querySelector(stop) : null;
  while (direct || (node = walker.nextNode())) {
    if (!direct && !node.textContent.includes(text)) continue;
    let el = direct || node.parentElement;
    while (el && !(stop === 'card' ? isCard(el) : el.matches(stop))) el = el.parentElement;
    if (!el) continue;
    document.querySelectorAll('[data-print]').forEach(e => e.removeAttribute('data-print'));
    el.setAttribute('data-print', '1');
    for (let a = el.parentElement; a; a = a.parentElement) {
      a.style.setProperty('background', 'transparent', 'important');
      a.style.setProperty('overflow', 'visible', 'important');
      a.style.setProperty('box-shadow', 'none', 'important');
      a.style.setProperty('border-color', 'transparent', 'important');
    }
    // Макет, що вилазить за свою картку, не має ховатись під наступним
    // блоком: усе, що не містить макет, робимо невидимим.
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      for (const sib of a.parentElement ? a.parentElement.children : []) {
        if (sib !== a && !sib.contains(el)) {
          sib.setAttribute('data-print-hidden', '1'); sib.style.visibility = 'hidden';
        }
      }
    }
    el.scrollIntoView({ block: 'center' });
    return true;
  }
  return false;
}"""

# Сторінка без тла: прозорий html/body, без «аврор», сітки й липкої шапки.
CLEAN = """() => {
  const css = document.createElement('style');
  css.textContent = `
    html, body, main { background: transparent !important; }
    header, nav, footer, [class*="aurora"], [class*="grid-pulse"], .back-to-top { visibility: hidden !important; }
    .reveal { opacity: 1 !important; transform: none !important; }
  `;
  document.head.appendChild(css);
  document.querySelectorAll('.reveal').forEach(r => r.classList.add('is-visible'));
}"""


async def shoot(page, name, text, stop, pad=0, prep=None, wait=900):
    await page.evaluate(CLEAN)
    ok = await page.evaluate(FIND, [text, stop])
    if not ok:
        print(f"  ✗ {name}: не знайшов «{text}» → {stop}")
        return
    if prep:
        await page.evaluate(prep)
    await page.wait_for_timeout(wait)
    box = await page.locator("[data-print]").first.bounding_box()
    clip = dict(x=box["x"] - pad, y=box["y"] - pad, width=box["width"] + 2 * pad, height=box["height"] + 2 * pad)
    path = os.path.join(OUT, f"{name}.png")
    await page.screenshot(path=path, clip=clip, omit_background=True)
    print(f"  ✓ {name}.png  {round(box['width'])}×{round(box['height'])} css px")


async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME)

        async def page_at(path, dsf):
            ctx = await browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=dsf,
                                            reduced_motion="reduce", color_scheme="light", locale="uk-UA")
            await ctx.route("**/*", lambda r: r.abort() if any(b in r.request.url for b in BLOCK) else r.continue_())
            page = await ctx.new_page()
            await page.goto(BASE + path, wait_until="networkidle")
            await page.evaluate("document.fonts.ready")
            return page

        print("головна")
        page = await page_at("/", 5)
        # Макет героя стоїть під нахилом (rotateX) і з кольоровим сяйвом позаду —
        # на друк потрібен рівний кадр без сяйва.
        await shoot(page, "dashboard", "Потребують уваги",
                    '[class*="border-hairline"][class*="rounded-[24px]"]',
                    prep="""() => { const f = document.querySelector('[data-print]');
                      const tilt = f.parentElement; tilt.style.transform = 'none';
                      [...tilt.children].forEach(c => { if (c !== f) c.style.display = 'none'; }); }""",
                    wait=2500)
        await shoot(page, "analytics", "Аналітика церкви", "card")
        await shoot(page, "groups", "Один розум", "card")
        await shoot(page, "serving", "Налаштувати пульт", "card")
        await shoot(page, "pocket-phone", "Через 40 хвилин", ".tg-device", pad=6)
        # Бриф: те саме полотно у двох станах — безлад і складене вікно.
        for phase in ("chaos", "done"):
            await shoot(page, f"brief-{phase}", "Команда в системі", '[data-phase]', pad=40,
                        prep=f"""() => document.querySelector('[data-print]').setAttribute('data-phase', '{phase}')""",
                        wait=2500)
        await page.context.close()

        print("про нас")
        page = await page_at("/about/", 5)
        # Картина «Як це починалось»: у ній немає тексту, тож шукаємо від заголовка
        # блоку до першої картки з рамкою в тій самій секції.
        await page.evaluate("""() => {
          const h = [...document.querySelectorAll('h2')].find(e => e.textContent.includes('Як це починалось'));
          h.closest('section').querySelector('[class*="rounded-[26px]"]').setAttribute('data-story', '1');
        }""")
        await shoot(page, "about-story", "", '[data-story]')
        await page.context.close()

        print("телеграм")
        page = await page_at("/telegram/", 6)
        await shoot(page, "tg-phone", "Вітаю", ".tg-device", pad=6, wait=1500)
        await page.context.close()

        await browser.close()


asyncio.run(main())
