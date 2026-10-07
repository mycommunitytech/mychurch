"""Два чорно-білі логотипи: «Моя Церква» і «My Church».

    python3 brand/mono.py        # brand/out/logo/{moya-tserkva,my-church}.{png,svg}

Напис в один рядок, обидва слова одного кегля, перше чорне, друге сіре — та
сама схема, що в аватарки Telegram (`social.tg_avatar()`: білий і
світло-блакитний на синьому), тільки без кольору. Сірий — чорний, змішаний
із білим у тій самій пропорції, що білий із синім у `social.TG_SECOND`.

Обрано 2026-10-07 з п'яти розкладок (два яруси, рівна ширина, «MyChurch»…):
один рядок із пробілом, однаково для обох мов. Інших кольорів не робимо —
«просто 2 лого».

SVG потребують fontTools (`pip install fonttools`) — без нього збираються
тільки PNG, вектор пропускається з попередженням.
"""
import os
import shutil
from PIL import Image, ImageDraw
import social
import word

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out", "logo")

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREY = social.mix(BLACK, WHITE, 0.66)  # як білий у TG_SECOND

CAP = 300  # висота великої літери в PNG, px
PAD = 0.5  # поле довкола, у частках великої літери; хвости «р», «y» влазять у нього

LOGOS = {"moya-tserkva": social.LOGO, "my-church": "My Church"}


def hexc(c):
    return "#%02x%02x%02x" % c


def logo(text, cap=CAP):
    """Напис на білому: (PNG, SVG-фабрика).

    Ширина міряється при літері 100 і масштабується, як у `tg_avatar()`:
    на справжньому кеглі FreeType округлює розмір і ширини гліфів інакше,
    і вектор з'їжджає від PNG на кілька пікселів. По вертикалі центрується
    смуга від верху великих літер до базової лінії, хвости висять у полі.
    """
    pad = cap * PAD
    tw = word.width(text, word.cap_to_px(100)) * cap / 100
    w, h = round(tw + 2 * pad), round(cap + 2 * pad)
    px, base = word.cap_to_px(cap), pad + cap
    img = Image.new("RGB", (w, h), WHITE)
    word.draw(ImageDraw.Draw(img), (pad, base), text, px, BLACK, GREY)

    def svg():
        body = "".join(
            f'<path d="{d}" fill="{c}" transform="translate({pad:.2f} {base:.2f})"/>'
            for d, c in word.svg_paths(text, px, hexc(BLACK), hexc(GREY)))
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
                f'width="{w}" height="{h}" fill="none">'
                f'<rect width="{w}" height="{h}" fill="{hexc(WHITE)}"/>{body}</svg>')

    return img, svg


def main():
    shutil.rmtree(os.path.join(HERE, "out", "logo-mono"), ignore_errors=True)  # старий набір
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT)
    try:
        import fontTools  # noqa: F401
        vector = True
    except ImportError:
        vector = False
        print("fontTools немає — SVG пропущено (pip install fonttools)")

    for name, text in LOGOS.items():
        png, svg = logo(text)
        png.save(f"{OUT}/{name}.png", optimize=True)
        if vector:
            open(f"{OUT}/{name}.svg", "w").write(svg())
    print("brand/out/logo/:", ", ".join(sorted(os.listdir(OUT))))


if __name__ == "__main__":
    main()
