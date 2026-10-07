"""Друк для конференції: «Усі можливості» — ролап, банер, два плакати A1,
синій євробуклет і футболка.

    python3 brand/print/build.py                 # усе в brand/print/out/
    CONF=forum-2026 python3 brand/print/build.py # мітка конференції в QR

Зміст — каталог можливостей сайту (`/modules`): групи, назви й рядок про
кожну можливість збірка читає прямо з `src/lib/i18n.ts` (`modules.groups`),
іконки й кольори — з `src/components/shared/module-icons.ts`, контури іконок —
з `lucide-react` у node_modules. Змінився каталог на сайті — перезібрали друк,
і він знову збігається з сайтом. Можливості з `soon: true` на друк не йдуть:
друк не обіцяє того, що ще не працює (BRAND.md, правило 4).

Напрям затвердив власник (2026-09-25): синій бренду, продукт, «усі можливості».
Відхилено: перший зміст (гасло + два екрани + амбасадор) — «саме наповнення»,
і стиль сторінки «Про нас» (біле тло, печатка) — «1 був кращий».

Верстка — HTML, друк — Chromium у PDF, як у `scripts/plan-pdf.mjs`:
словесний знак — контури з `brand/out/social/lockup`, текст — статичні
зрізи Manrope з `fonts/`, екрани продукту — знімки сайту з `screens/`.

Кожен QR веде на головну з мітками utm_*: `src/lib/lead.ts` кладе їх у
заявку, тож у Telegram видно, з якого матеріалу прийшла людина. Після
збірки кожен код читається назад розпізнавачем Vision з готового PNG —
якщо адреса не збіглась, скрипт падає.
"""
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = HERE / "out"
PREVIEW = OUT / "preview"
SCREENS = HERE / "screens"
FONTS = HERE / "fonts"
LOCKUP = ROOT / "brand" / "out" / "social" / "lockup"
VARIABLE_FONT = ROOT / "brand" / "fonts" / "Manrope[wght].ttf"
I18N = ROOT / "src" / "lib" / "i18n.ts"
ICONS_TS = ROOT / "src" / "components" / "shared" / "module-icons.ts"
LUCIDE = ROOT / "node_modules" / "lucide-react" / "dist" / "esm"

SITE = "mychurch.com.ua"
TELEGRAM = "@mychurch_team"
PHONE = "+380 96 529 73 75"
EMAIL = "team@mychurch.com.ua"

# Мітка конференції: з'являється в заявці як utm_source. Назву конкретної
# конференції передаємо змінною CONF, латиницею й без пробілів.
CONF = os.environ.get("CONF", "konferentsiia")


def qr_url(content):
    return f"https://{SITE}/?utm_source={CONF}&utm_medium=print&utm_content={content}"


# ─────────────────────────────────────────── каталог можливостей із сайту
@lru_cache(None)
def catalog():
    """Групи каталогу з українського словника: id, назва, рядок і можливості.

    Беремо перший `catalog:` у файлі — це `ua`; англійська локаль нижче."""
    s = I18N.read_text()
    start = s.index("groups: [", s.index("catalog: {"))
    block = s[start:s.index("] as ModuleGroup[]", start)]
    groups = []
    for m in re.finditer(r'\{\s*id: "([^"]+)",\s*title: "([^"]+)",\s*text: "([^"]+)",\s*items: \[(.*?)\],\s*\}',
                         block, re.S):
        items = [(i, n, t) for i, n, t, soon in
                 re.findall(r'\{ id: "([^"]+)", name: "([^"]+)", text: "([^"]+)"(, soon: true)? \}', m.group(4))
                 if not soon]
        groups.append(dict(id=m.group(1), title=m.group(2), text=m.group(3), items=items))
    if len(groups) < 8 or sum(len(g["items"]) for g in groups) < 30:
        sys.exit("Каталог у src/lib/i18n.ts не розібрався — змінилась форма `modules.groups`?")
    return groups


def group(gid):
    return next(g for g in catalog() if g["id"] == gid)


def total():
    return sum(len(g["items"]) for g in catalog()), len(catalog())


def plural(n, one, few, many):
    if n % 10 == 1 and n % 100 != 11:
        return one
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return few
    return many


def count_line():
    """«37 можливостей у 10 групах» — з того, що справді надруковано."""
    n, g = total()
    return f"{n} {plural(n, 'можливість', 'можливості', 'можливостей')} у {g} {plural(g, 'групі', 'групах', 'групах')}"


@lru_cache(None)
def icon_maps():
    """Іконка й колір кожної можливості та групи — ті самі, що на сайті."""
    s = ICONS_TS.read_text()

    def block(name):
        i = s.index(f"export const {name}")
        return s[i:s.index("};", i)]

    names = lambda b: dict(re.findall(r'"?([\w-]+)"?:\s*([A-Z]\w*)', block(b)))
    colours = lambda b: dict(re.findall(r'"?([\w-]+)"?:\s*"(#[0-9a-fA-F]{6})"', block(b)))
    return names("MODULE_ICONS"), colours("MODULE_ACCENTS"), names("GROUP_ICONS"), colours("GROUP_ACCENTS")


@lru_cache(None)
def lucide(name, colour, width=2.0):
    """Контури іконки lucide з node_modules — вектор без шрифта іконок."""
    index = (LUCIDE / "lucide-react.js").read_text()
    m = re.search(r"default as " + name + r"\b[^;]*?from '\./icons/([\w-]+)\.js'", index)
    if not m:
        sys.exit(f"Немає іконки {name} у lucide-react")
    src = (LUCIDE / "icons" / f"{m.group(1)}.js").read_text()
    i = src.index("const __iconNode = [")
    node = src[i:src.index("];", i)]
    parts = []
    # Prettier розбиває довгі вузли на кілька рядків — пробіли між дужками довільні.
    for tag, attrs in re.findall(r'\[\s*"(\w+)",\s*\{([^}]*)\}\s*\]', node):
        kv = " ".join(f'{k}="{v}"' for k, v in re.findall(r'(\w+): "([^"]*)"', attrs) if k != "key")
        parts.append(f"<{tag} {kv}/>")
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{colour}" stroke-width="{width}" '
            f'stroke-linecap="round" stroke-linejoin="round">{"".join(parts)}</svg>')


def module_tile(mid, gid):
    icons, accents, _, gaccents = icon_maps()
    return f'<span class="tile">{lucide(icons.get(mid, "Sparkles"), accents.get(mid) or gaccents.get(gid, "#0069e0"))}</span>'


def group_tile(gid):
    _, _, gicons, gaccents = icon_maps()
    return f'<span class="tile">{lucide(gicons.get(gid, "Sparkles"), gaccents.get(gid, "#0069e0"))}</span>'


def group_block(gid, names_only=False):
    """Група каталогу: іконка, назва, рядок групи — і її можливості з іконками."""
    g = group(gid)
    if names_only:
        items = "".join(f'<li>{module_tile(i, gid)}<b>{esc(n)}</b></li>' for i, n, _ in g["items"])
    else:
        items = "".join(f'<li>{module_tile(i, gid)}<div><b>{esc(n)}</b><span>{esc(t)}</span></div></li>'
                        for i, n, t in g["items"])
    return (f'<section class="cat-group"><div class="cat-head">{group_tile(gid)}'
            f'<div><h3>{esc(g["title"])}</h3><p>{esc(g["text"])}</p></div></div>'
            f'<ul class="cat-items">{items}</ul></section>')


# ───────────────────────────────────────────────────────────── QR
_qr_bin = None


def qr_tool():
    """Компілює qr.swift один раз за запуск: інтерпретація — 20 с на кожен код."""
    global _qr_bin
    if _qr_bin is None:
        _qr_bin = Path(tempfile.mkdtemp(prefix="mychurch-qr-")) / "qr"
        subprocess.run(["swiftc", "-O", str(HERE / "qr.swift"), "-o", str(_qr_bin)], check=True)
    return str(_qr_bin)


def qr_svg(text, dark="#0b0b0f", light="#ffffff", quiet=4):
    """Вектор: один <path> на всі модулі — без волосяних щілин між квадратами."""
    rows = subprocess.run([qr_tool(), "encode", text, "M"], check=True,
                          capture_output=True, text=True).stdout.split()
    n = len(rows)
    d = []
    for y, row in enumerate(rows):
        x = 0
        while x < n:
            if row[x] == "1":
                x0 = x
                while x < n and row[x] == "1":
                    x += 1
                d.append(f"M{x0} {y}h{x - x0}v1h{x0 - x}z")
            else:
                x += 1
    s = n + 2 * quiet
    return (f'<svg class="qr" viewBox="{-quiet} {-quiet} {s} {s}" xmlns="http://www.w3.org/2000/svg">'
            f'<rect x="{-quiet}" y="{-quiet}" width="{s}" height="{s}" fill="{light}"/>'
            f'<path d="{"".join(d)}" fill="{dark}"/></svg>')


def qr_decode(png):
    res = subprocess.run([qr_tool(), "decode", str(png)], capture_output=True, text=True)
    return [line for line in res.stdout.splitlines() if line.strip()]


# ─────────────────────────────────────────────────── словесний знак
def wordmark(first="#0069e0", rest="#0b0b0f", cls="wm"):
    """Контури «Моя Церква» з lockup/wordmark-colour.svg у потрібних кольорах.

    viewBox 785 × 129.17: велика «М» — 100 одиниць, решта — запас під «р»."""
    svg = (LOCKUP / "wordmark-colour.svg").read_text()
    svg = re.sub(r'\s(width|height)="[^"]*"', "", svg)
    svg = svg.replace('fill="#0069e0"', f'fill="{first}"').replace('fill="#0b0b0f"', f'fill="{rest}"')
    return svg.replace("<svg ", f'<svg class="{cls}" ', 1)


def uri(p):
    return Path(p).resolve().as_uri()


def esc(s):
    return html.escape(s, quote=False)


# ────────────────────────────────────────────────────────── стилі
STATIC = {500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold"}


def font_faces():
    """Статичні зрізи ваг → у PDF звичайний вбудований TrueType.

    Змінний шрифт Chromium вбудовує як Type 3 (контури без шрифту), а на
    Type 3 спотикаються препрес-перевірки частини друкарень. Зрізи ріже
    `fontTools.varLib.instancer` з `brand/fonts/Manrope[wght].ttf`; немає
    їх — друкуємо змінним, воно теж векторне."""
    if all((FONTS / f"Manrope-{n}.ttf").exists() for n in STATIC.values()):
        return "".join(
            f'@font-face {{ font-family: "Manrope Print"; font-weight: {w}; '
            f'src: url("{uri(FONTS / f"Manrope-{n}.ttf")}") format("truetype"); }}\n'
            for w, n in STATIC.items())
    return (f'@font-face {{ font-family: "Manrope Print"; font-weight: 200 800; '
            f'src: url("{uri(VARIABLE_FONT)}") format("truetype-variations"); }}\n')


BASE_CSS = """
:root {
  --brand: #0069e0; --deep: #00509e; --soft: #eaf3ff; --light: #8cc2ff;
  --ink: #0b0b0f; --ink2: rgba(11, 11, 15, 0.70); --ink3: rgba(11, 11, 15, 0.52);
  --line: rgba(11, 11, 15, 0.12); --wline: rgba(255, 255, 255, 0.22);
}
@page { size: __W__mm __H__mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
/* Тло аркуша й на html: інакше по краю лишається волосина білого від округлення мм у пікселі. */
html, body { background: __BG__; }
body { font-family: "Manrope Print", sans-serif; color: var(--ink); font-weight: 500;
       -webkit-font-smoothing: antialiased; }
.sheet { position: relative; width: __W__mm; height: __H__mm; overflow: hidden; break-after: page; }
.sheet:last-child { break-after: auto; }
/* Усі координати нижче — від лінії обрізу, а не від краю аркуша з вильотами. */
.trim { position: absolute; left: __B__mm; top: __B__mm; width: __TW__mm; height: __TH__mm; }
.abs { position: absolute; }
.wm { display: block; height: auto; }
.qr { display: block; width: 100%; height: auto; }
img { display: block; }
ul { list-style: none; }
h1, h2, h3 { font-weight: 800; letter-spacing: -0.04em; }
h1, h2, .lead, .txt, .note { text-wrap: balance; }
.accent { color: var(--brand); }
.on-brand { color: #fff; }
.on-brand .accent { color: var(--light); }
/* Тінь — окремий блок під картинкою: фільтр на самому знімку Chromium
   розтрусив би в растр разом із картинкою. */
.shadow { position: absolute; z-index: 0; }
.shot { position: absolute; z-index: 1; }

/* Каталог можливостей: білі плитки з іконкою в кольорі можливості, як на /modules.
   Розміри задає font-size контейнера — той самий каталог і в буклеті, і на плакаті. */
.tile { display: flex; align-items: center; justify-content: center; flex: none; background: #fff; }
.tile svg { display: block; }
.cat-head { display: flex; gap: 0.62em; align-items: flex-start; }
.cat-head .tile { width: 2.1em; height: 2.1em; border-radius: 0.56em; }
.cat-head .tile svg { width: 1.2em; height: 1.2em; }
.cat-head h3 { font-size: 1.36em; line-height: 1.08; letter-spacing: -0.03em; }
.cat-head p { margin-top: 0.22em; font-size: 0.8em; line-height: 1.38; color: rgba(255, 255, 255, 0.74); text-wrap: pretty; }
.cat-items { margin-top: 0.7em; }
.cat-items li { display: flex; gap: 0.62em; align-items: flex-start; padding: 0.5em 0; border-top: 0.07em solid var(--wline); }
.cat-items .tile { width: 1.5em; height: 1.5em; border-radius: 0.42em; margin-top: 0.02em; }
.cat-items .tile svg { width: 0.92em; height: 0.92em; }
.cat-items b { display: block; font-weight: 700; letter-spacing: -0.01em; line-height: 1.22; }
.cat-items span { display: block; margin-top: 0.12em; font-size: 0.84em; line-height: 1.36; color: rgba(255, 255, 255, 0.8); text-wrap: pretty; }
"""


def page_css(tw, th, bleed, bg="transparent"):
    w, h = tw + 2 * bleed, th + 2 * bleed
    css = BASE_CSS
    for k, v in dict(W=w, H=h, B=bleed, TW=tw, TH=th, BG=bg).items():
        css = css.replace(f"__{k}__", str(v))
    return font_faces() + css


def doc(title, css, body):
    # Тире не починає рядок: пробіл перед ним нерозривний (BRAND.md §6 — довге тире з пробілами).
    body = body.replace(" — ", " — ")
    return f"""<!doctype html>
<html lang="uk"><head><meta charset="utf-8"><title>{esc(title)}</title>
<style>{css}</style></head><body>{body}</body></html>"""


# ─────────────────────────────────────────────────────────── ролап
# 850 × 2000 мм + 5 мм вильотів. Нижні ~150 мм ховаються в касеті, верх —
# під планкою. Зверху — гасло, посередині — усі десять груп із назвами
# можливостей, нижче — QR і контакти.
def rollup():
    tw, th, b = 850, 2000, 5
    url = qr_url("rollup")
    _, _, gicons, gaccents = icon_maps()
    rows = "".join(
        f'<li>{group_tile(g["id"])}<div><h3>{esc(g["title"])}</h3>'
        f'<p>{" · ".join(esc(n) for _, n, _ in g["items"])}</p></div></li>' for g in catalog())
    css = page_css(tw, th, b, "#0069e0") + """
.sheet { background: var(--brand); }
.top { left: 60mm; top: 70mm; }
.top .wm { width: 236mm; }
.top .tag { margin-top: 13mm; font-size: 21mm; color: rgba(255,255,255,0.74); letter-spacing: -0.01em; }
h1 { left: 54mm; top: 205mm; font-size: 99mm; line-height: 1; letter-spacing: -0.045em; white-space: nowrap; }
.lead { left: 60mm; top: 340mm; width: 700mm; font-size: 29mm; line-height: 1.32; color: rgba(255,255,255,0.9); letter-spacing: -0.012em; }
.all { left: 60mm; top: 520mm; width: 730mm; display: flex; align-items: baseline; justify-content: space-between;
       border-top: 1.2mm solid var(--wline); padding-top: 26mm; }
.all h2 { font-size: 50mm; line-height: 1; }
.all p { font-size: 22mm; color: rgba(255,255,255,0.74); letter-spacing: -0.01em; }
.groups { left: 60mm; top: 640mm; width: 730mm; display: grid; grid-template-columns: 1fr 1fr; column-gap: 34mm; row-gap: 27mm; }
.groups li { display: flex; gap: 14mm; align-items: flex-start; }
.groups .tile { width: 56mm; height: 56mm; border-radius: 15mm; }
.groups .tile svg { width: 32mm; height: 32mm; }
.groups h3 { font-size: 33mm; line-height: 1.05; letter-spacing: -0.03em; }
.groups p { margin-top: 6mm; font-size: 19mm; line-height: 1.34; color: rgba(255,255,255,0.84); letter-spacing: -0.01em; }
.cta { left: 60mm; top: 1325mm; width: 730mm; display: flex; gap: 34mm; align-items: center; }
.cta .card { width: 290mm; padding: 22mm; border-radius: 20mm; background: #fff; flex: none; }
.cta .go { font-size: 44mm; line-height: 1.02; font-weight: 800; letter-spacing: -0.04em; }
.cta .how { margin-top: 10mm; font-size: 21mm; color: rgba(255,255,255,0.84); line-height: 1.3; }
.cta .pill { display: inline-block; margin-top: 18mm; padding: 7mm 13mm 8mm; border-radius: 30mm; background: rgba(255,255,255,0.14);
             font-size: 17mm; font-weight: 600; line-height: 1.25; }
.foot { left: 60mm; top: 1690mm; width: 730mm; border-top: 1.2mm solid var(--wline); padding-top: 26mm;
        display: flex; align-items: baseline; justify-content: space-between; }
.foot .site { font-size: 44mm; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.foot .contacts { font-size: 20mm; font-weight: 600; color: rgba(255,255,255,0.84); text-align: right; line-height: 1.4; }
"""
    body = f"""
<div class="sheet on-brand"><div class="trim">
  <div class="abs top">{wordmark("#ffffff", "#ffffff")}<p class="tag">Організація церковних процесів</p></div>
  <h1 class="abs">Досягай <span class="accent">людей</span></h1>
  <p class="abs lead">Українська система обліку й організації церкви, яка живе в Telegram і яку ми впроваджуємо разом з вашою командою.</p>
  <div class="abs all"><h2>Усі можливості</h2><p>{count_line()}</p></div>
  <ul class="abs groups">{rows}</ul>
  <div class="abs cta"><div class="card">{qr_svg(url)}</div>
    <div><p class="go">Замовити демо</p><p class="how">Наведіть камеру — покажемо, як це працює у вас</p>
      <p class="pill">Діє програма безкоштовного підключення</p></div></div>
  <div class="abs foot"><p class="site">{SITE}</p><p class="contacts">Telegram {TELEGRAM}<br>{PHONE}</p></div>
</div></div>"""
    return dict(name="rollup-850x2000", w=tw + 2 * b, h=th + 2 * b,
                html=doc("Ролап — Моя Церква", css, body), qr=[url], dpi=24)


# ─────────────────────────────────────────────────────────── банер
# 3000 × 2000 мм + 30 мм вильотів: пресвол за стендом або полотно на стіні.
# Його читають з проходу й на його тлі фотографуються, тож головне — у
# верхніх двох третинах: гасло на два рядки ліворуч, QR і «Замовити демо»
# праворуч, сайт і контакти в правому верхньому куті. Нижня смуга — усі
# десять груп у п'ять колонок: її часто закривають стіл і люди, тому там
# те, що доповнює, а не те, без чого банер не працює. Нічого важливого
# ближче 120 мм до обрізу: туди йдуть люверси, кишеня або підворот на раму.
# Файл повністю векторний (жодного знімка) — друкується в будь-якому
# розмірі з пропорцією 3:2 без втрат.
BANNER_BLEED = 30


def banner():
    tw, th, b = 3000, 2000, BANNER_BLEED
    url = qr_url("banner")
    rows = "".join(
        f'<li>{group_tile(g["id"])}<div><h3>{esc(g["title"])}</h3>'
        f'<p>{" · ".join(esc(n) for _, n, _ in g["items"])}</p></div></li>' for g in catalog())
    css = page_css(tw, th, b, "#0069e0") + """
.sheet { background: var(--brand); }
.top { left: 120mm; top: 120mm; }
.top .wm { width: 560mm; }
.top .tag { margin-top: 24mm; font-size: 48mm; color: rgba(255,255,255,0.74); letter-spacing: -0.01em; }
.site { right: 120mm; top: 124mm; text-align: right; }
.site b { display: block; font-size: 72mm; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.site span { display: block; margin-top: 14mm; font-size: 36mm; font-weight: 600; color: rgba(255,255,255,0.84); letter-spacing: -0.01em; }
h1 { left: 100mm; top: 300mm; font-size: 420mm; line-height: 0.9; letter-spacing: -0.045em; white-space: nowrap; }
.lead { left: 120mm; top: 1110mm; width: 1950mm; font-size: 60mm; line-height: 1.32; color: rgba(255,255,255,0.9); letter-spacing: -0.012em; }
.cta { right: 120mm; top: 320mm; width: 700mm; }
.cta .card { padding: 44mm; border-radius: 44mm; background: #fff; }
.cta .go { margin-top: 30mm; font-size: 86mm; line-height: 1.02; font-weight: 800; letter-spacing: -0.04em; }
.cta .how { margin-top: 12mm; font-size: 38mm; color: rgba(255,255,255,0.84); line-height: 1.3; letter-spacing: -0.01em; }
.cta .pill { display: inline-block; margin-top: 20mm; padding: 10mm 24mm 12mm; border-radius: 60mm; background: rgba(255,255,255,0.14);
             font-size: 30mm; white-space: nowrap; font-weight: 600; line-height: 1.25; }
.all { left: 120mm; top: 1370mm; width: 2760mm; display: flex; align-items: baseline; justify-content: space-between;
       border-top: 2.4mm solid var(--wline); padding-top: 40mm; }
.all h2 { font-size: 90mm; line-height: 1; }
.all p { font-size: 42mm; color: rgba(255,255,255,0.74); letter-spacing: -0.01em; }
.groups { left: 120mm; top: 1540mm; width: 2760mm; display: grid; grid-template-columns: repeat(5, 1fr); column-gap: 40mm; row-gap: 30mm; }
.groups li { display: flex; gap: 22mm; align-items: flex-start; }
.groups .tile { width: 78mm; height: 78mm; border-radius: 20mm; }
.groups .tile svg { width: 44mm; height: 44mm; }
.groups h3 { font-size: 44mm; line-height: 1.05; letter-spacing: -0.03em; }
.groups p { margin-top: 8mm; font-size: 25mm; line-height: 1.32; color: rgba(255,255,255,0.84); letter-spacing: -0.01em; }
"""
    body = f"""
<div class="sheet on-brand"><div class="trim">
  <div class="abs top">{wordmark("#ffffff", "#ffffff")}<p class="tag">Організація церковних процесів</p></div>
  <p class="abs site"><b>{SITE}</b><span>Telegram {TELEGRAM} · {PHONE}</span></p>
  <h1 class="abs">Досягай<br><span class="accent">людей</span></h1>
  <p class="abs lead">Українська система обліку й організації церкви, яка живе в Telegram і яку ми впроваджуємо разом з вашою командою.</p>
  <div class="abs cta"><div class="card">{qr_svg(url)}</div>
    <p class="go">Замовити демо</p><p class="how">Наведіть камеру — покажемо, як це працює у вас</p>
    <p class="pill">Діє програма безкоштовного підключення</p></div>
  <div class="abs all"><h2>Усі можливості</h2><p>{count_line()}</p></div>
  <ul class="abs groups">{rows}</ul>
</div></div>"""
    return dict(name="banner-3000x2000", w=tw + 2 * b, h=th + 2 * b,
                html=doc("Банер — Моя Церква", css, body), qr=[url], dpi=24)


# ─────────────────────────────────────────────── плакати A1 (594 × 841)
# Вектор, тож той самий файл друкується A0/A2/A3 без втрат — пропорції
# формату A однакові. Обидва сині, низ однаковий: QR, «Замовити демо», контакти.
POSTER_CSS = """
.sheet { background: var(--brand); }
.phead { left: 44mm; top: 44mm; width: 506mm; display: flex; align-items: center; justify-content: space-between; }
.phead .wm { width: 128mm; }
.phead .tag { font-size: 10.5mm; color: rgba(255,255,255,0.74); letter-spacing: -0.01em; }
.pfoot { left: 44mm; top: 712mm; width: 506mm; display: flex; align-items: center; gap: 13mm;
         border-top: 0.6mm solid var(--wline); padding-top: 14mm; }
.pfoot .pqr { width: 70mm; flex: none; border-radius: 4mm; overflow: hidden; }
.pfoot .ppill { display: inline-block; padding: 2.6mm 6mm 3mm; border-radius: 20mm; background: rgba(255,255,255,0.14);
                font-size: 8.5mm; font-weight: 600; letter-spacing: -0.01em; }
.pfoot .pgo { margin-top: 7mm; font-size: 22mm; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.pfoot .phow { margin-top: 4mm; font-size: 10.5mm; color: rgba(255,255,255,0.82); letter-spacing: -0.01em; }
.pfoot .pcontacts { margin-left: auto; text-align: right; font-size: 10mm; font-weight: 600; line-height: 1.55;
                    color: rgba(255,255,255,0.82); letter-spacing: -0.01em; }
.pfoot .psite { display: block; font-size: 13mm; font-weight: 800; letter-spacing: -0.03em; color: #fff; margin-bottom: 1.5mm; }
"""


def poster(name, content, title, css_extra, body):
    tw, th, b = 594, 841, 3
    url = qr_url(content)
    css = page_css(tw, th, b, "#0069e0") + POSTER_CSS + css_extra
    html_body = f"""
<div class="sheet on-brand"><div class="trim">
  <div class="abs phead">{wordmark("#ffffff", "#ffffff")}<p class="tag">Організація церковних процесів</p></div>
  {body}
  <div class="abs pfoot"><div class="pqr">{qr_svg(url)}</div>
    <div><p class="ppill">Діє програма безкоштовного підключення</p><p class="pgo">Замовити демо</p>
      <p class="phow">Покажемо, як це працює у вас</p></div>
    <p class="pcontacts"><span class="psite">{SITE}</span>Telegram {TELEGRAM}<br>{PHONE}</p></div>
</div></div>"""
    return dict(name=name, w=tw + 2 * b, h=th + 2 * b, html=doc(title, css, html_body), qr=[url], dpi=72)


# Плакат-каталог: три колонки груп. Групи розкладено так, щоб колонки вийшли
# рівні за висотою; на плакаті лише назви — рядки про кожну є в буклеті.
POSTER_COLUMNS = (("people", "activities", "planning"),
                  ("tools", "analytics", "accounting"),
                  ("structure", "resources", "platform", "integrations"))


def poster_catalog():
    known = {g["id"] for g in catalog()}
    cols = "".join('<div class="col">' + "".join(group_block(gid, names_only=True) for gid in col if gid in known) + "</div>"
                   for col in POSTER_COLUMNS)
    return poster("plakat-A1-usi-mozhlyvosti", "plakat-mozhlyvosti", "Плакат — Усі можливості", """
h1 { left: 42mm; top: 108mm; font-size: 70mm; line-height: 1; letter-spacing: -0.045em; }
.count { left: 44mm; top: 190mm; font-size: 14mm; color: rgba(255,255,255,0.78); letter-spacing: -0.01em; }
.cols { left: 44mm; top: 240mm; width: 506mm; display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 17mm;
        font-size: 9mm; }
.cat-group + .cat-group { margin-top: 13mm; }
.cat-items li { align-items: center; padding: 0.42em 0; }
.cat-items b { font-size: 1.12em; }
""", f"""
  <h1 class="abs">Усі <span class="accent">можливості</span></h1>
  <p class="abs count">{count_line()} — в одній системі</p>
  <div class="abs cols">{cols}</div>""")


def poster_screens():
    """Як це виглядає: головні можливості справжніми екранами сайту, під кожним — рядок із каталогу."""
    line = {i: (n, t) for g in catalog() for i, n, t in g["items"]}

    def cap(mid):
        n, t = line[mid]
        return f'<p class="cap"><b>{esc(n)}</b>{esc(t)}</p>'

    return poster("plakat-A1-yak-tse-vyglyadaye", "plakat-ekrany", "Плакат — Як це виглядає", """
h1 { left: 42mm; top: 108mm; font-size: 64mm; line-height: 1.02; letter-spacing: -0.042em; }
.cap { position: absolute; font-size: 7.6mm; line-height: 1.38; color: rgba(255,255,255,0.84); letter-spacing: -0.005em; }
.cap b { display: block; font-size: 10.5mm; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 1mm; }
.sh { box-shadow: 0 10mm 24mm rgba(0, 22, 64, 0.38); }
""", f"""
  <h1 class="abs">Єдиний простір<br><span class="accent">для вашої церкви</span></h1>
  <div class="shadow sh" style="left:52mm;top:262mm;width:290mm;height:176mm;border-radius:10mm"></div>
  <img class="shot" style="left:44mm;top:254mm;width:306mm" src="{uri(SCREENS / 'dashboard.png')}" alt="">
  <div style="left:44mm;top:452mm;width:300mm" class="abs">{cap('people')}</div>
  <div class="shadow sh" style="left:44mm;top:505mm;width:146mm;height:136mm;border-radius:8mm"></div>
  <img class="shot" style="left:44mm;top:505mm;width:146mm" src="{uri(SCREENS / 'groups.png')}" alt="">
  <div class="shadow sh" style="left:204mm;top:505mm;width:146mm;height:144mm;border-radius:8mm"></div>
  <img class="shot" style="left:204mm;top:505mm;width:146mm" src="{uri(SCREENS / 'serving.png')}" alt="">
  <div class="shadow sh" style="left:382mm;top:262mm;width:156mm;height:340mm;border-radius:26mm"></div>
  <img class="shot" style="left:372mm;top:254mm;width:178mm" src="{uri(SCREENS / 'tg-phone.png')}" alt="">
  <div style="left:372mm;top:630mm;width:178mm" class="abs">{cap('telegram-bot')}</div>
  <div style="left:44mm;top:658mm;width:146mm" class="abs">{cap('groups')}</div>
  <div style="left:204mm;top:658mm;width:146mm" class="abs">{cap('ministries')}</div>""")


# ─────────────────────────────────────── євробуклет A4, згин у три
# Сторона 1 (зовнішня), зліва направо: клапан 97 · спинка 100 · обкладинка 100.
# Сторона 2 (внутрішня):                  100 · 100 · 97 (зворот клапана).
# Клапан на 3 мм вужчий, інакше він не ляже всередину. Нічого важливого
# ближче 5 мм до згину й обрізу. Обидві сторони синім бренду.
#
# Порядок читання: обкладинка → відкрили — ліва внутрішня панель і клапан →
# розгорнули клапан — уся внутрішня сторона → зворот. Каталог іде саме так:
# заголовок і перші групи ліворуч, далі клапан, далі розворот, інтеграції — на звороті.
FOLDS_OUT = (97, 197)
FOLDS_IN = (100, 200)
BROCHURE_PANELS = {
    "in1": ("people", "activities"),
    "flap": ("planning", "analytics"),
    "in2": ("tools", "accounting"),
    "in3": ("structure", "resources", "platform"),
    "back": ("integrations",),
}


def brochure():
    tw, th, b = 297, 210, 3
    url = qr_url("buklet")
    known = {g["id"] for g in catalog()}
    placed = {gid for gids in BROCHURE_PANELS.values() for gid in gids}
    if known - placed:  # нова група в каталозі — буклет мусить про неї знати
        sys.exit(f"Групи без місця в буклеті: {sorted(known - placed)} — додайте їх у BROCHURE_PANELS")
    blocks = {p: "".join(group_block(gid) for gid in gids if gid in known) for p, gids in BROCHURE_PANELS.items()}
    css = page_css(tw, th, b, "#0069e0") + """
.sheet { background: var(--brand); }
.panel { position: absolute; top: 0; height: 210mm; padding: 14mm 11mm 12mm; font-size: 3.3mm; }
.cat-group + .cat-group { margin-top: 6.5mm; }
h2 { font-size: 9mm; line-height: 1.02; letter-spacing: -0.04em; }
.count { margin-top: 2.2mm; font-size: 3.3mm; color: rgba(255,255,255,0.78); }
.in1 h2 + .count { margin-bottom: 7mm; }

/* ── обкладинка ── */
.cover { left: 197mm; width: 100mm; }
.cover .wm { width: 42mm; }
.cover .tag { margin-top: 2.6mm; font-size: 2.9mm; color: rgba(255,255,255,0.74); }
.cover h1 { margin-top: 20mm; font-size: 18.6mm; line-height: 0.92; letter-spacing: -0.045em; }
.cover .txt { margin-top: 6mm; font-size: 3.6mm; line-height: 1.42; color: rgba(255,255,255,0.9); }
.cover-phone-shadow { left: 231mm; top: 121mm; width: 32mm; height: 76mm; border-radius: 6mm; box-shadow: 0 5mm 10mm rgba(0,22,64,0.4); }
.cover-phone { left: 227mm; top: 116.5mm; width: 40mm; }

/* ── спинка: інтеграції, дія й контакти ── */
.back { left: 97mm; width: 100mm; display: flex; flex-direction: column; justify-content: space-between; }
.cta { display: flex; gap: 4mm; align-items: center; padding: 3.5mm; border-radius: 4mm; background: #fff; color: var(--ink); }
.cta .qrbox { width: 30mm; flex: none; }
.cta .go { font-size: 4.8mm; font-weight: 800; letter-spacing: -0.035em; line-height: 1.1; }
.cta .how { margin-top: 1.6mm; font-size: 2.85mm; line-height: 1.35; color: var(--ink2); text-wrap: balance; }
.free { display: inline-block; margin-top: 3.6mm; padding: 1.5mm 3.2mm 1.7mm; border-radius: 6mm; background: rgba(255,255,255,0.14);
        font-size: 2.8mm; font-weight: 600; }
.contacts li { padding: 2mm 0; border-top: 0.25mm solid var(--wline); display: flex; justify-content: space-between; align-items: baseline; }
.contacts li:last-child { border-bottom: 0.25mm solid var(--wline); }
.contacts span { font-size: 2.75mm; color: rgba(255,255,255,0.68); }
.contacts b { font-size: 3.3mm; font-weight: 700; letter-spacing: -0.01em; }

.flap { left: 0; width: 97mm; padding-left: 10mm; padding-right: 9mm; }
.in1 { left: 0; width: 100mm; }
.in2 { left: 100mm; width: 100mm; }
.in3 { left: 200mm; width: 97mm; padding-left: 10mm; padding-right: 10mm; }
"""
    outside = f"""
<div class="sheet on-brand"><div class="trim">
  <div class="panel cover">{wordmark("#ffffff", "#ffffff")}
    <p class="tag">Організація церковних процесів</p>
    <h1>Досягай<br><span class="accent">людей</span></h1>
    <p class="txt">Українська система обліку й організації церкви, яка живе в Telegram і яку ми впроваджуємо разом з вашою командою.</p>
  </div>
  <div class="shadow cover-phone-shadow"></div>
  <img class="shot cover-phone" src="{uri(SCREENS / 'tg-phone.png')}" alt="">

  <div class="panel back">
    {blocks["back"]}
    <div><div class="cta"><div class="qrbox">{qr_svg(url)}</div>
      <div><p class="go">Замовити демо</p><p class="how">Наведіть камеру — покажемо, як це працює у вас</p></div></div>
      <p class="free">Діє програма безкоштовного підключення</p></div>
    <ul class="contacts">
      <li><span>Сайт</span><b>{SITE}</b></li>
      <li><span>Telegram</span><b>{TELEGRAM}</b></li>
      <li><span>Телефон</span><b>{PHONE}</b></li>
      <li><span>Пошта</span><b>{EMAIL}</b></li>
    </ul>
  </div>

  <div class="panel flap">{blocks["flap"]}</div>
</div></div>"""
    inside = f"""
<div class="sheet on-brand"><div class="trim">
  <div class="panel in1"><h2>Усі <span class="accent">можливості</span></h2><p class="count">{count_line()}</p>
    {blocks["in1"]}</div>
  <div class="panel in2">{blocks["in2"]}</div>
  <div class="panel in3">{blocks["in3"]}</div>
</div></div>"""
    return dict(name="buklet-A4-yevro", w=tw + 2 * b, h=th + 2 * b,
                html=doc("Євробуклет — Моя Церква", css, outside + inside), qr=[url], dpi=150, folds=True)


# ────────────────────────────────────────────────────────── футболка
# Друкарні — точний розмір і прозоре тло: PDF (вектор) + PNG 300 dpi.
# Перед: словесний знак 250 мм по центру грудей. Спина: гасло 300 мм.
TEE_FRONT_W = 250
TEE_BACK_W, TEE_BACK_H = 300, 170
TEE = {
    "svitla": dict(first="#0069e0", rest="#0b0b0f", accent="#0069e0", ink="#0b0b0f"),  # біла тканина
    "temna": dict(first="#8cc2ff", rest="#ffffff", accent="#8cc2ff", ink="#ffffff"),   # темна або синя
}


def tee_front(variant):
    c = TEE[variant]
    w = TEE_FRONT_W
    h = round(w * 129.17 / 785, 2)
    css = page_css(w, h, 0) + ".wm { width: 100%; }"
    body = f'<div class="sheet"><div class="trim">{wordmark(c["first"], c["rest"])}</div></div>'
    return dict(name=f"futbolka-pered-{variant}", w=w, h=h,
                html=doc("Футболка — перед", css, body), qr=[], dpi=300, png=True)


def tee_back(variant):
    c = TEE[variant]
    w, h = TEE_BACK_W, TEE_BACK_H
    # top: −5 мм зрізає порожній верх рядка, але лишає місце дужці над «й».
    css = page_css(w, h, 0) + f"""
.slogan {{ position: absolute; left: 0; top: -5mm; font-size: 75.5mm; line-height: 0.9; letter-spacing: -0.045em; color: {c["ink"]}; }}
.slogan span {{ color: {c["accent"]}; }}
.site {{ position: absolute; left: 1.5mm; bottom: 0; font-size: 15mm; font-weight: 700; letter-spacing: -0.03em; color: {c["ink"]}; line-height: 1; }}
"""
    body = f"""<div class="sheet"><div class="trim">
  <h1 class="slogan">Досягай<br><span>людей</span></h1><p class="site">{SITE}</p></div></div>"""
    return dict(name=f"futbolka-spyna-{variant}", w=w, h=h,
                html=doc("Футболка — спина", css, body), qr=[], dpi=300, png=True)


def tee_mockup():
    """Лише для перегляду: як друк сидить на футболці. У друкарню не йде."""
    front_neck = "C 252 84, 348 84, 368 36"
    back_neck = "C 256 56, 344 56, 368 36"
    body_path = ("L 452 60 L 560 150 L 506 214 L 452 178 L 450 604 Q 300 616 150 604 "
                 "L 148 178 L 94 214 L 40 150 L 148 60 Z")

    def tee(fill, stroke, neck, art, art_w_mm, art_h_mm, top):
        k = 302 / 520  # ширина корпусу в одиницях / ширина футболки L в мм
        aw, ah = art_w_mm * k, art_h_mm * k
        return f"""<svg viewBox="0 0 600 640" xmlns="http://www.w3.org/2000/svg">
  <path d="M232 36 {neck} {body_path}" fill="{fill}" stroke="{stroke}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M236 38 {neck.replace('84', '76').replace('56', '50')}" fill="none" stroke="{stroke}" stroke-width="6" opacity="0.5"/>
  <image href="{uri(OUT / art)}" x="{300 - aw / 2:.1f}" y="{top}" width="{aw:.1f}" height="{ah:.1f}"/>
</svg>"""

    fh = TEE_FRONT_W * 129.17 / 785
    cells = [
        ("Біла, перед", tee("#ffffff", "#d5dae3", front_neck, "futbolka-pered-svitla.png", TEE_FRONT_W, fh, 128)),
        ("Біла, спина", tee("#ffffff", "#d5dae3", back_neck, "futbolka-spyna-svitla.png", TEE_BACK_W, TEE_BACK_H, 96)),
        ("Темна, перед", tee("#1c2644", "#141b31", front_neck, "futbolka-pered-temna.png", TEE_FRONT_W, fh, 128)),
        ("Темна, спина", tee("#1c2644", "#141b31", back_neck, "futbolka-spyna-temna.png", TEE_BACK_W, TEE_BACK_H, 96)),
    ]
    grid = "".join(f'<figure>{svg}<figcaption>{esc(cap)}</figcaption></figure>' for cap, svg in cells)
    css = font_faces() + """
html, body { margin: 0; background: #eef1f5; font-family: "Manrope Print", sans-serif; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 40px; width: 1840px; }
figure { margin: 0; background: #f8f9fb; border-radius: 20px; padding: 24px 16px 18px; }
svg { width: 100%; height: auto; display: block; }
figcaption { margin-top: 8px; text-align: center; font-size: 22px; font-weight: 600; color: rgba(11,11,15,0.6); }
"""
    return doc("Футболка — макет", css, f'<div class="grid">{grid}</div>')


# ─────────────────────────────────────────────────────────── збірка
def chromium():
    env = os.environ.get("CHROME_BIN")
    cache = Path.home() / "Library/Caches/ms-playwright"
    for p in [env, *sorted(cache.glob("chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell"), reverse=True),
              *sorted(cache.glob("chromium-*/chrome-mac*/*.app/Contents/MacOS/*"), reverse=True),
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]:
        if p and Path(p).exists():
            return str(p)
    sys.exit("Не знайшов Chromium: встановіть `python3 -m playwright install chromium` або вкажіть CHROME_BIN")


def open_page(browser, src, **kw):
    page = browser.new_page(**kw)
    page.goto(src.as_uri(), wait_until="load")
    page.evaluate("document.fonts.ready")
    page.wait_for_function("[...document.images].every(i => i.complete && i.naturalWidth > 0)")
    return page


# Що вилізло за свою панель чи за обріз — друкарня відріже або згин переріже.
OVERFLOW_JS = """() => [...document.querySelectorAll('.panel, .trim > .abs')].filter(el => {
  const r = el.getBoundingClientRect(), box = el.closest('.trim').getBoundingClientRect();
  // Панель має фіксовану висоту — переповнення видно по scrollHeight; решта — по межі обрізу.
  const inner = el.classList.contains('panel') && el.scrollHeight > el.clientHeight + 1;
  return inner || r.bottom > box.bottom + 1 || r.right > box.right + 1;
}).map(el => el.className)"""


def render(items):
    from playwright.sync_api import sync_playwright

    work = Path(tempfile.mkdtemp(prefix="mychurch-print-"))
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chromium())
        for it in items:
            src = work / f"{it['name']}.html"
            src.write_text(it["html"], encoding="utf-8")
            page = open_page(browser, src)
            spill = page.evaluate(OVERFLOW_JS)
            if spill:
                print(f"  ! {it['name']}: не влазить — {spill}")
            pdf = OUT / f"{it['name']}.pdf"
            page.pdf(path=str(pdf), width=f"{it['w']}mm", height=f"{it['h']}mm", print_background=True,
                     prefer_css_page_size=True)
            page.close()
            if it.get("png"):  # друкарні футболок часто хочуть саме PNG з прозорим тлом
                vw, vh = round(it["w"] / 25.4 * 96), round(it["h"] / 25.4 * 96)
                shot = open_page(browser, src, device_scale_factor=it["dpi"] / 96, viewport={"width": vw, "height": vh})
                shot.screenshot(path=str(OUT / f"{it['name']}.png"), omit_background=True)
                shot.close()
            print(f"  ✓ {pdf.name}  {it['w']}×{it['h']} мм")

        # Макет футболки — після того, як PNG друку вже лежать у out/.
        PREVIEW.mkdir(parents=True, exist_ok=True)
        src = work / "tee-mockup.html"
        src.write_text(tee_mockup(), encoding="utf-8")
        page = open_page(browser, src, viewport={"width": 1920, "height": 700}, device_scale_factor=1)
        page.locator(".grid").screenshot(path=str(PREVIEW / "futbolka-maket.png"))
        page.close()
        print("  ✓ preview/futbolka-maket.png")
        browser.close()
    shutil.rmtree(work, ignore_errors=True)


def mark_folds(png, folds, page_w_mm, bleed):
    """На превʼю буклета — пунктир згинів і рамка обрізу, щоб бачити, що куди лягає."""
    from PIL import Image, ImageDraw

    im = Image.open(png).convert("RGB")
    d = ImageDraw.Draw(im)
    k = im.width / page_w_mm
    for x_mm in folds:
        x = round((x_mm + bleed) * k)
        for y in range(0, im.height, 14):
            d.line([(x, y), (x, y + 7)], fill=(255, 196, 0), width=2)
    b = round(bleed * k)
    d.rectangle([b, b, im.width - b - 1, im.height - b - 1], outline=(255, 196, 0), width=1)
    im.save(png)


def previews(items):
    """PNG для перегляду + перевірка, що кожен QR читається з готового файлу."""
    if not shutil.which("pdftoppm"):
        print("  (pdftoppm немає — превʼю й перевірку QR пропускаю)")
        return True
    ok = True
    for it in items:
        if it.get("png"):
            continue
        base = PREVIEW / it["name"]
        subprocess.run(["pdftoppm", "-png", "-r", str(it["dpi"]), str(OUT / f"{it['name']}.pdf"), str(base)], check=True)
        pngs = sorted(PREVIEW.glob(f"{it['name']}-*.png"))
        found = set()
        for png in pngs:
            found.update(qr_decode(png))
        for url in it["qr"]:
            if url in found:
                print(f"  ✓ QR {it['name']}: читається → {url}")
            else:
                ok = False
                print(f"  ✗ QR {it['name']}: не прочитався (знайдено: {sorted(found) or 'нічого'})")
        if it.get("folds"):  # згини малюємо вже після перевірки QR
            for png, folds in zip(pngs, (FOLDS_OUT, FOLDS_IN)):
                mark_folds(png, folds, it["w"], 3)
    return ok


def overview(posters):
    """Одна картинка з усім набором — щоб глянути все разом, не відкриваючи восьми файлів."""
    from PIL import Image

    def load(name, h):
        im = Image.open(PREVIEW / name).convert("RGB")
        return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)

    gap, pad, ph = 36, 48, 820
    ps = [load(f"{n}-1.png", ph) for n in posters]
    b1, b2 = load("buklet-A4-yevro-1.png", 392), load("buklet-A4-yevro-2.png", 392)
    height = ph + gap + b1.height + 12 + b2.height  # права колонка задає висоту, ролап — на всю
    roll = load("rollup-850x2000-1.png", height)
    right_w = sum(p.width for p in ps) + gap * (len(ps) - 1)
    tee = Image.open(PREVIEW / "futbolka-maket.png").convert("RGB")
    tw = right_w - b1.width - gap
    tee = tee.resize((tw, round(tee.height * tw / tee.width)), Image.LANCZOS)
    sheet = Image.new("RGB", (pad * 2 + roll.width + gap + right_w, pad * 2 + height), (236, 239, 244))
    sheet.paste(roll, (pad, pad))
    x = pad + roll.width + gap
    for p in ps:
        sheet.paste(p, (x, pad))
        x += p.width + gap
    x = pad + roll.width + gap
    y = pad + ph + gap
    sheet.paste(b1, (x, y))
    sheet.paste(b2, (x, y + b1.height + 12))
    sheet.paste(tee, (x + b1.width + gap, y + (b1.height * 2 + 12 - tee.height) // 2))
    # Банер — окремим рядком на всю ширину внизу: він ушир, як усе інше разом.
    ban = Image.open(PREVIEW / "banner-3000x2000-1.png").convert("RGB")
    bw = sheet.width - pad * 2
    ban = ban.resize((bw, round(ban.height * bw / ban.width)), Image.LANCZOS)
    full = Image.new("RGB", (sheet.width, sheet.height + gap + ban.height), (236, 239, 244))
    full.paste(sheet, (0, 0))
    full.paste(ban, (pad, sheet.height - pad + gap))
    full.save(OUT / "zvedennia.png", optimize=True)
    print("  ✓ zvedennia.png")


def bundle():
    """Архів для друкарні: друковані файли й інструкція, без превʼю."""
    import zipfile

    path = OUT / "druk-moya-tserkva.zip"
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.glob("*.pdf")) + sorted(OUT.glob("futbolka-*.png")):
            z.write(f, f.name)
        z.write(HERE / "README.md", "README.md")
    print(f"  ✓ {path.name}  {path.stat().st_size / 1e6:.1f} МБ")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    for old in list(OUT.glob("*.pdf")) + list(OUT.glob("*.png")) + list(OUT.glob("*.zip")) + list(PREVIEW.glob("*.png")):
        old.unlink()
    n, g = total()
    print(f"каталог: {count_line()} (з {I18N.relative_to(ROOT)})")
    posters = [poster_catalog(), poster_screens()]
    items = [rollup(), banner(), *posters, brochure(),
             tee_front("svitla"), tee_front("temna"), tee_back("svitla"), tee_back("temna")]
    print("друк:")
    render(items)
    print("перевірка:")
    if not previews(items):
        sys.exit("QR не прочитався — файли не віддавати в друк")
    print("збірка:")
    overview([p["name"] for p in posters])
    bundle()
    print(f"готово: {OUT}")


if __name__ == "__main__":
    main()
