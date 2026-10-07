#!/usr/bin/env bash
# Кружечки для каталогу модулів: з кожного запису в public/clips/ ріжемо
# шість секунд без звуку, квадрат 360×360 навколо людини, ~70 КБ. Саме їх
# грає каталог на наведення — повний запис (8–12 МБ) там тягнути не можна.
#
# Знак «mychurch.com.ua» вписаний у кадр знизу по центру: кути кружечка
# однаково зрізає маска, тож у кутку його б ніхто не побачив.
#
# Запуск: bash scripts/clip-previews.sh   (потрібен ffmpeg і python3+Pillow)
set -euo pipefail

cd "$(dirname "$0")/.."
SRC=public/clips
OUT=$SRC/preview
WM=$(mktemp -t clip-wm).png
mkdir -p "$OUT"

python3 - "$WM" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
w, h = 360, 34
img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
try:
    f = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
except OSError:
    f = ImageFont.load_default()
txt = "mychurch.com.ua"
bb = d.textbbox((0, 0), txt, font=f)
d.text(((w - (bb[2] - bb[0])) // 2, 6), txt, font=f, fill=(255, 255, 255, 120))
img.save(sys.argv[1])
PY

for path in "$SRC"/*.mp4; do
  name=$(basename "$path")
  # Кадр 1920×1080, людина стоїть по центру: беремо квадрат 760 від верху.
  ffmpeg -v error -ss 12 -t 6 -i "$path" -i "$WM" -an \
    -filter_complex "[0:v]crop=760:760:610:40,scale=360:360[v];[v][1:v]overlay=0:H-52" \
    -r 24 -c:v libx264 -crf 31 -preset slow -profile:v main -pix_fmt yuv420p \
    -movflags +faststart -y "$OUT/$name"
  echo "  $name → $(du -h "$OUT/$name" | cut -f1)"
done

rm -f "$WM"
echo "Готово: $(ls "$OUT" | wc -l | tr -d ' ') кружечків у $OUT"
