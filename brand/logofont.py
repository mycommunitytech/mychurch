"""Шрифт словесної частини логотипа для сайту.

    pip install fonttools brotli && python3 brand/logofont.py

Manrope на сайті пише одне: «Моя Церква» / «My Church» у шапці й у сцені
брифу. Раніше його тягнув `next/font/google` — два варіативні файли
(латиниця й кирилиця, ~38 КБ), і на повільному мобільному вони стояли в
черзі першого екрана. Тут з `brand/fonts/Manrope[wght].ttf` вирізається
вага 800 і рівно літери назви — виходить ~2 КБ.

Змінили назву бренду або пишете Manrope ще десь — допишіть літери в TEXT
і запустіть скрипт знову. Літери, яких тут немає, браузер домалює Inter.
"""
import os

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "fonts", "Manrope[wght].ttf")
OUT = os.path.join(ROOT, "src", "assets", "fonts", "manrope-brand-800.woff2")

TEXT = "Моя Церква My Church"

font = instantiateVariableFont(TTFont(SRC), {"wght": 800})
opts = Options()
opts.layout_features = ["kern", "liga", "calt"]
opts.flavor = "woff2"
sub = Subsetter(opts)
sub.populate(text=TEXT)
sub.subset(font)
font.flavor = "woff2"
font.save(OUT)

missing = [c for c in TEXT if not c.isspace() and ord(c) not in TTFont(OUT).getBestCmap()]
if missing:
    raise SystemExit(f"У Manrope немає: {''.join(missing)}")
print(f"{os.path.relpath(OUT, ROOT)}: {os.path.getsize(OUT)} Б")
