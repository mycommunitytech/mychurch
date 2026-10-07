"""Чисті кадри для каруселі відгуків з нових обкладинок YouTube.

Обкладинка: людина збоку на синій сітці (крок 80 px) + заголовок і підпис.
Кадр: та сама людина по центру (за головою), без жодного тексту, фон —
та сама сітка, відтворена: низькочастотне тло з чистих пікселів обкладинки
(push-pull) + лінії сітки 2 px.

Запуск з кореня репо: `python3 scripts/video-faces.py [id ...]` (numpy +
Pillow). Кадри лягають у public/ambassadors/video/face/. Нова обкладинка
з тим самим ім'ям — міняй і теку: nginx віддає картинки з кешем 30 днів.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/ambassadors/video/cover"
OUT = ROOT / "public/ambassadors/video/face"
IDS = sys.argv[1:] or ["people", "groups", "onboarding", "learning", "forms", "links", "automations", "org", "analytics", "telegram-bot"]
W, H, P = 1280, 720, 80
LINE = np.array([9.0, 8.0, 9.0])


def dilate(m, r):
    out = m.copy()
    for _ in range(r):
        n = out.copy()
        n[1:] |= out[:-1]; n[:-1] |= out[1:]; n[:, 1:] |= out[:, :-1]; n[:, :-1] |= out[:, 1:]
        out = n
    return out


def flood(mask, seed):
    """Компонента `mask`, досяжна з `seed` (4-зв'язність)."""
    cur = seed & mask
    while True:
        n = cur.copy()
        n[1:] |= cur[:-1]; n[:-1] |= cur[1:]; n[:, 1:] |= cur[:, :-1]; n[:, :-1] |= cur[:, 1:]
        n &= mask
        if n.sum() == cur.sum():
            return n
        cur = n


def push_pull(val, w):
    """Заповнює дірки (w == 0) гладко: піраміда зважених середніх."""
    if min(val.shape[:2]) <= 2:
        s = w.sum()
        m = (val * w[..., None]).sum((0, 1)) / max(s, 1e-6)
        return np.broadcast_to(m, val.shape).copy()
    h, wd = val.shape[:2]
    h2, w2 = (h + 1) // 2, (wd + 1) // 2
    pv = np.zeros((h2 * 2, w2 * 2, 3)); pw = np.zeros((h2 * 2, w2 * 2))
    pv[:h, :wd] = val * w[..., None]; pw[:h, :wd] = w
    sv = pv.reshape(h2, 2, w2, 2, 3).sum((1, 3)); sw = pw.reshape(h2, 2, w2, 2).sum((1, 3))
    lv = np.where(sw[..., None] > 0, sv / np.maximum(sw, 1e-6)[..., None], 0)
    lw = np.minimum(sw, 1.0)
    coarse = push_pull(lv, lw)
    up = np.asarray(Image.fromarray(np.clip(coarse, 0, 255).astype(np.uint8)).resize((wd, h), Image.BILINEAR)).astype(float)
    wn = np.minimum(w, 1.0)[..., None]
    return val * wn + up * (1 - wn)


def blur(a, r):
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(r))).astype(float)


def make(id_):
    im = np.asarray(Image.open(SRC / f"{id_}.webp").convert("RGB")).astype(float)
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    bg = (B > 150) & (B - R > 90) & (G < 175)

    # Людина — усе не-синє, що з'єднане з нижнім краєм кадру.
    seed = np.zeros((H, W), bool); seed[-1] = True
    person = flood(~bg, seed)
    text = (~bg) & ~person  # заголовок, підпис, «Моя Церква»

    ys, xs = np.nonzero(person)
    top = ys.min()
    head = person[top:top + 170]
    hx = int(round(np.nonzero(head)[1].mean()))
    dx = W // 2 - hx

    # Відомі чисті пікселі: не людина, не текст, не лінії сітки.
    xx, yy = np.meshgrid(np.arange(W), np.arange(H))
    on_grid = ((xx + 1) % P <= 2) | ((yy + 1) % P <= 2)
    known = bg & ~dilate(person, 8) & ~dilate(text, 10) & ~on_grid

    # Зсунути все на dx і відтворити тло на новому полотні.
    def shift(a, fill):
        out = np.full_like(a, fill)
        if dx >= 0:
            out[:, dx:] = a[:, :W - dx]
        else:
            out[:, :W + dx] = a[:, -dx:]
        return out

    im_s = shift(im, 0.0)
    known_s = shift(known, False)
    person_s = shift(person, False)

    lf = push_pull(im_s, known_s.astype(float))
    lf = blur(lf, 6)
    grid = (((xx - dx + 1) % P) <= 1) | (((yy + 1) % P) <= 1)
    base = lf + grid[..., None] * LINE

    alpha = dilate(person_s, 2).astype(np.uint8) * 255
    alpha = np.asarray(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.5))).astype(float)[..., None] / 255
    out = im_s * alpha + base * (1 - alpha)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT / f"{id_}.webp", quality=82, method=6)
    print(id_, "dx", dx, "head x", hx, "top", top)


OUT.mkdir(parents=True, exist_ok=True)
for i in IDS:
    make(i)
