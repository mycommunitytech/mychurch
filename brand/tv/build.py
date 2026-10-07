"""ТВ-петля «Моя Церква»: збирає один офлайн-файл і записує відео.

    python3 brand/tv/build.py assets          # іконки, словесний знак, QR → src/*.js
    python3 brand/tv/build.py html            # out/tv.html — один файл, працює без інтернету
    python3 brand/tv/build.py site            # той самий файл у public/tv/ → mychurch.com.ua/tv/
    python3 brand/tv/build.py frames serving  # out/frames/serving-land.png — аркуш кадрів для перевірки
    python3 brand/tv/build.py video           # out/video/*.mp4 — кожна сцена + вся петля, 16:9 і 9:16
        --o land|port|land,port   --fps 60   --scene intro,serving   --jobs 6   --4k

Відео пишеться покадрово: сторінка ставить кожну мить (TVR.seek), Chrome знімає
кадр, ffmpeg складає H.264. Кадри не губляться, як при записі екрана, і
швидкість машини на результат не впливає.
"""
import argparse
import base64
import json
import multiprocessing
import os
import re
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SRC = HERE / "src"
OUT = HERE / "out"
LUCIDE = ROOT / "node_modules" / "lucide-react" / "dist" / "esm" / "icons"
WORDMARK = ROOT / "brand" / "out" / "social" / "lockup" / "wordmark-colour.svg"
QR_SWIFT = ROOT / "brand" / "print" / "qr.swift"
PUBLIC = ROOT / "public"

SITE = "mychurch.com.ua"
CONF = os.environ.get("CONF", "konferentsiia")
QR_URL = f"https://{SITE}/?utm_source={CONF}&utm_medium=tv&utm_content=loop"


def chrome():
    env = os.environ.get("CHROME_BIN")
    cache = Path.home() / "Library/Caches/ms-playwright"
    for p in [env, *sorted(cache.glob("chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell"), reverse=True),
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]:
        if p and Path(p).exists():
            return str(p)
    sys.exit("Не знайшов Chrome: вкажіть CHROME_BIN")


# ─────────────────────────────────────────────────────────── ассети
def scene_order():
    """Id сцен у порядку TV.ORDER з order.js."""
    body = re.search(r"TV\.ORDER\s*=\s*\[(.*?)\];", (SRC / "order.js").read_text(), re.S).group(1)
    body = re.sub(r"//[^\n]*", "", body)
    return re.findall(r'"([a-z0-9-]+)"', body)


def scene_lists():
    """Добірки TV.LISTS з order.js: {"short": [id, …]}."""
    m = re.search(r"TV\.LISTS\s*=\s*\{(.*?)\};", (SRC / "order.js").read_text(), re.S)
    body = re.sub(r"//[^\n]*", "", m.group(1)) if m else ""
    lists = {k: re.findall(r'"([a-z0-9-]+)"', v) for k, v in re.findall(r"([a-z0-9_]+)\s*:\s*\[(.*?)\]", body, re.S)}
    return lists


def scene_files():
    return sorted((SRC / "scenes").glob("*.js"))


def write_atomic(path, text):
    """Кілька агентів можуть збирати одночасно — файл підміняємо цілим."""
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    tmp.write_text(text)
    os.replace(tmp, path)


def wanted_icons():
    names = set()
    for f in [SRC / "lib.js", *scene_files()]:
        s = f.read_text()
        names |= set(re.findall(r"TV\.icon\(\s*[\"']([a-z0-9-]+)[\"']", s))
        for line in re.findall(r"^\s*//\s*icons:\s*(.+)$", s, re.M):
            names |= {n.strip() for n in line.split(",") if n.strip()}
    return sorted(names)


def lucide(name):
    f = LUCIDE / f"{name}.js"
    if not f.exists():
        sys.exit(f"Немає іконки lucide «{name}» ({f})")
    m = re.search(r"const __iconNode = (\[.*?\]);\n", f.read_text(), re.S)
    nodes = json.loads(re.sub(r"(\w+):", r'"\1":', m.group(1)))
    out = []
    for tag, attrs in nodes:
        a = " ".join(f'{k}="{v}"' for k, v in attrs.items() if k != "key")
        out.append(f"<{tag} {a}/>")
    return "".join(out)


def qr_svg(text):
    tool = Path(tempfile.gettempdir()) / "mychurch-tv-qr"
    if not tool.exists() or tool.stat().st_mtime < QR_SWIFT.stat().st_mtime:
        subprocess.run(["swiftc", "-O", str(QR_SWIFT), "-o", str(tool)], check=True)
    rows = subprocess.run([str(tool), "encode", text, "M"], check=True, capture_output=True, text=True).stdout.split()
    n, quiet = len(rows), 4
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
    return (f'<svg class="qr" viewBox="{-quiet} {-quiet} {s} {s}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
            f'<rect x="{-quiet}" y="{-quiet}" width="{s}" height="{s}" fill="#fff"/>'
            f'<path d="{"".join(d)}" fill="#0b0b0f"/></svg>')


def assets():
    icons = {n: lucide(n) for n in wanted_icons()}
    write_atomic(SRC / "icons.js",
        "/* Згенеровано `python3 brand/tv/build.py assets` з lucide-react — руками не правимо. */\n"
        f"window.TV_ICONS = {json.dumps(icons, ensure_ascii=False, indent=0)};\n")
    wm = WORDMARK.read_text()
    wm = re.sub(r'\s(width|height)="[^"]*"', "", wm)
    wm = wm.replace('fill="#0069e0"', 'style="fill:var(--wm-a)"').replace('fill="#0b0b0f"', 'style="fill:var(--wm-b)"')
    wm = wm.replace('xmlns="http://www.w3.org/2000/svg" ', "")
    write_atomic(SRC / "brand.js",
        "/* Згенеровано `python3 brand/tv/build.py assets`: словесний знак із brand/out/social/lockup\n"
        f"   і QR на {QR_URL} — руками не правимо. */\n"
        f"window.TV_WORDMARK = {json.dumps(wm, ensure_ascii=False)};\n"
        f"window.TV_QR = {json.dumps(qr_svg(QR_URL))};\n"
        f"window.TV_QR_URL = {json.dumps(QR_URL)};\n")
    print(f"іконок: {len(icons)} ({', '.join(icons)})\nQR: {QR_URL}")


# ─────────────────────────────────────────────────────────── один файл
MIME = {".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml"}


def data_uri(p):
    return f"data:{MIME[p.suffix]};base64,{base64.b64encode(p.read_bytes()).decode()}"


def bundle(dest=None):
    html = (SRC / "index.html").read_text()

    def css(m):
        s = (SRC / m.group(1)).read_text()
        s = re.sub(r'url\("(fonts/[^"]+)"\)', lambda u: f'url("{data_uri(SRC / u.group(1))}")', s)
        return f"<style>\n{s}\n</style>"

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
    used = set()
    for f in scene_files():
        used |= set(re.findall(r"TV\.asset\(\s*[\"']([^\"']+)[\"']", f.read_text()))
    amap = {p: data_uri(PUBLIC / p) for p in sorted(used)}
    scenes = "".join(f"<script>\n{(SRC / 'scenes' / f'{sid}.js').read_text()}\n</script>\n"
                     for sid in scene_order() if (SRC / "scenes" / f"{sid}.js").exists())
    html = re.sub(r"<!-- scenes -->.*?<!-- /scenes -->\n", lambda m: scenes, html, flags=re.S)
    html = html.replace("<!-- assets -->", f"<script>window.TV_ASSETS = {json.dumps(amap)};</script>")
    def js(m):
        f = SRC / m.group(1)
        return f"<script>\n{f.read_text()}\n</script>" if f.exists() else ""

    html = re.sub(r'<script src="([^"]+)"></script>', js, html)
    OUT.mkdir(exist_ok=True)
    dest = dest or OUT / "tv.html"
    write_atomic(dest, html)
    if dest.name == "tv.html":
        kb = dest.stat().st_size / 1024
        print(f"out/tv.html — {kb:.0f} КБ (шрифти {len(re.findall('font/woff2', html))}, фото {len(amap)})")
    return dest


def site():
    """Кладе петлю на сайт: public/tv/index.html → mychurch.com.ua/tv/ після збірки.

    Сторінка закрита від пошуку (noindex) і не стоїть у sitemap — це екран для
    телевізора на стенді, а не сторінка для відвідувачів."""
    html = bundle().read_text()
    html = html.replace('<meta name="viewport"', '<meta name="robots" content="noindex, nofollow">\n<meta name="viewport"', 1)
    dest = PUBLIC / "tv" / "index.html"
    dest.parent.mkdir(exist_ok=True)
    write_atomic(dest, html)
    print(f"public/tv/index.html — {dest.stat().st_size / 1024:.0f} КБ → https://{SITE}/tv/ після `npm run build` і викладки")


# ─────────────────────────────────────────────────────────── кадри
SIZES = {"land": (1920, 1080), "port": (1080, 1920)}


def open_page(browser, orient, scale=1, src=None):
    w, h = SIZES[orient]
    page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
    msgs = []
    page.on("console", lambda m: msgs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: msgs.append(f"pageerror: {e}"))
    page.goto((src or OUT / "tv.html").as_uri() + f"?render=1&o={orient}", wait_until="load")
    page.evaluate("TVR.ready()")
    return page, msgs


def mount(page, scene, prev, orient):
    page.evaluate("([s, p, o]) => TVR.mount(s, p, o)", [scene, prev, orient])
    page.evaluate("Promise.all([...document.images].map(i => i.decode().catch(() => {})))")
    page.evaluate("document.fonts.ready")


def shot(page):
    # Штатний знімок Playwright: сирий CDP-знімок бере вікно без емуляції
    # (1920×993 замість 1920×1080) і лишає внизу порожню смугу.
    # Коли шість Chrome пишуть одночасно, знімок зрідка зависає — пробуємо ще раз.
    for attempt in range(3):
        try:
            return page.screenshot(type="png", timeout=60000)
        except Exception:
            if attempt == 2:
                raise


def scene_list():
    """Сцени повної петлі; `secs` — скільки сцена триває у відео з урахуванням темпу."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=chrome())
        page, _ = open_page(b, "land")
        items = page.evaluate("TVR.list()")
        speed = page.evaluate("TVR.speed()")
        b.close()
    for it in items:
        it["secs"] = round(it["dur"] / speed / 1000 * 60) / 60
    return items


def frames(scene, orient="land", count=12, at=None):
    """Аркуш кадрів сцени: count рівних проміжків (або мітки --at), підписані часом.

    Кожен запуск збирає свою тимчасову копію сторінки — кілька людей (чи агентів)
    можуть знімати різні сцени одночасно й не заважати одне одному."""
    from playwright.sync_api import sync_playwright
    from PIL import Image, ImageDraw
    out = OUT / "frames"
    out.mkdir(parents=True, exist_ok=True)
    src = bundle(OUT / f".frames-{scene}-{orient}-{os.getpid()}.html")
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=chrome())
        page, msgs = open_page(b, orient, src=src)
        ids = [s["id"] for s in page.evaluate("TVR.list()")]
        if scene not in ids:
            b.close()
            src.unlink()
            sys.exit(f"Сцени «{scene}» немає. Зареєстровані: {', '.join(ids)}")
        dur = next(s["dur"] for s in page.evaluate("TVR.list()") if s["id"] == scene)
        mount(page, scene, None, orient)
        times = at or [round(dur * k / count) for k in range(count)]
        shots = []
        for t in times:
            page.evaluate(f"TVR.seek({t})")
            f = out / f"{scene}-{orient}-{t:05d}.png"
            f.write_bytes(shot(page))
            shots.append((t, f))
        b.close()
    src.unlink()
    w, h = SIZES[orient]
    cols = 4 if orient == "land" else 6
    tw = 640 if orient == "land" else 300
    th = round(tw * h / w)
    rows = -(-len(shots) // cols)
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * 8, rows * (th + 30) + 8), "#222")
    d = ImageDraw.Draw(sheet)
    for n, (t, f) in enumerate(shots):
        im = Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS)
        x, y = 8 + (n % cols) * (tw + 8), 8 + (n // cols) * (th + 30)
        sheet.paste(im, (x, y + 22))
        d.text((x, y + 4), f"{t} ms", fill="#fff")
    path = out / f"{scene}-{orient}.png"
    sheet.save(path)
    for m in msgs:
        print("  консоль:", m)
    print(path)
    return path


# ─────────────────────────────────────────────────────────── відео
def ffmpeg_cmd(fps, path):
    return ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "png", "-i", "-",
            "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
            "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-tune", "animation",
            "-profile:v", "high", "-level", "5.1" if fps > 30 else "4.2",
            "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
            "-g", str(fps * 2), "-movflags", "+faststart", "-r", str(fps), str(path)]


def render_clip(job):
    scene, prev, orient, fps, scale, path = job
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=chrome())
        page, msgs = open_page(b, orient, scale)
        dur = next(s["dur"] for s in page.evaluate("TVR.list()") if s["id"] == scene)
        # Темп петлі (TV.SPEED): у відео сцена триває dur / speed.
        speed = page.evaluate("TVR.speed()")
        mount(page, scene, prev, orient)
        n = round(dur / speed * fps / 1000)
        ff = subprocess.Popen(ffmpeg_cmd(fps, path), stdin=subprocess.PIPE)
        for f in range(n):
            page.evaluate(f"TVR.seek({f * 1000 / fps * speed})")
            ff.stdin.write(shot(page))
        ff.stdin.close()
        ff.wait()
        b.close()
    if ff.returncode:
        raise RuntimeError(f"ffmpeg впав на {path}")
    return path, msgs


def clip_secs(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return None


def fresh(clip, sid, secs=None):
    """Кліп уже записаний, цілий, потрібної довжини (темп!) і новіший за сцену та
    спільні файли — писати вдруге не треба."""
    if not clip.exists():
        return False
    got = clip_secs(clip)
    if got is None or (secs and abs(got - secs) > 0.15):
        return False
    # order.js теж: там темп (TV.SPEED) і бік екрана (TV.SIDE) — вони міняють кадр.
    deps = [SRC / "tv.css", SRC / "lib.js", SRC / "tv.js", SRC / "icons.js", SRC / "brand.js", SRC / "order.js",
            SRC / "scenes" / f"{sid}.js"]
    return clip.stat().st_mtime > max(d.stat().st_mtime for d in deps if d.exists())


def video(orients, fps, only, jobs, scale, lst=None, force=False):
    bundle()
    full = scene_list()
    # Номер у назві кліпу — місце сцени в повній петлі, тож добірки беруть ті самі файли.
    idx = {s["id"]: i + 1 for i, s in enumerate(full)}
    items = full
    if lst:
        ids = scene_lists().get(lst) or sys.exit(f"Немає добірки «{lst}» у order.js")
        by = {s["id"]: s for s in full}
        items = [by[i] for i in ids if i in by]
    order = [s["id"] for s in items]
    bg = {s["id"]: s["bg"] for s in items}
    secs = {s["id"]: s["secs"] for s in full}
    vdir = OUT / "video"
    cache = vdir / ".loop"
    cache.mkdir(parents=True, exist_ok=True)
    suffix = ("-4k" if scale == 2 else "") + ("" if fps == 60 else f"-{fps}fps")
    todo, loops = [], {}
    for o in orients:
        seq = []
        for i, sid in enumerate(order):
            prev = bg[order[i - 1]]
            clip = vdir / f"{idx[sid]:02d}-{sid}-{o}{suffix}.mp4"
            want = not only or sid in only
            if want and (force or not fresh(clip, sid, secs[sid])):
                todo.append((sid, None, o, fps, scale, clip))
            if prev != bg[sid]:
                # У петлі тло цієї сцени розкривається колом поверх попередньої.
                lc = cache / f"{sid}-after-{prev}-{o}{suffix}.mp4"
                if want and (force or not fresh(lc, sid, secs[sid])):
                    todo.append((sid, prev, o, fps, scale, lc))
                seq.append(lc)
            else:
                seq.append(clip)
        loops[o] = seq
    # Довгі сцени — першими, щоб наприкінці не чекати одну.
    dur = {s["id"]: s["dur"] for s in full}
    todo.sort(key=lambda j: -dur[j[0]])
    print(f"кліпів записати: {len(todo)}, паралельно: {jobs}", flush=True)
    # Кожен кліп — у свіжому процесі: другий запуск Playwright у тому самому
    # процесі зависав, і весь запис ставав після першого кліпу на кожен процес.
    ctx = multiprocessing.get_context("spawn")
    with ProcessPoolExecutor(max_workers=jobs, mp_context=ctx, max_tasks_per_child=1) as ex:
        futs = [ex.submit(render_clip, j) for j in todo]
        for n, fu in enumerate(as_completed(futs), 1):
            path, msgs = fu.result()
            print(f" ✓ {n}/{len(todo)} {path.relative_to(OUT)}", flush=True)
            for m in msgs:
                print("   консоль:", m)
    for o, seq in loops.items():
        if not all(p.exists() for p in seq):
            print(f"петлю {o} не складаю — бракує кліпів (запустіть без --scene)")
            continue
        listfile = cache / f"loop-{lst or 'full'}-{o}.txt"
        listfile.write_text("".join(f"file '{p}'\n" for p in seq))
        dest = vdir / f"00-petlia{'-' + lst if lst else ''}-{o}{suffix}.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listfile),
                        "-c", "copy", "-movflags", "+faststart", str(dest)], check=True)
        total = sum(s["secs"] for s in items)
        print(f" ✓ {dest.relative_to(OUT)} — {total // 60:.0f} хв {total % 60:.0f} с, {dest.stat().st_size / 1e6:.1f} МБ", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["assets", "html", "site", "frames", "video"])
    ap.add_argument("scene", nargs="?")
    ap.add_argument("--o", default=None)
    ap.add_argument("--fps", type=int, default=60)
    ap.add_argument("--scene", dest="scenes", default="")
    ap.add_argument("--jobs", type=int, default=max(2, (os.cpu_count() or 4) // 2))
    ap.add_argument("--count", type=int, default=12)
    ap.add_argument("--at", default="", help="мітки часу в мс через кому, напр. 1200,3400")
    ap.add_argument("--4k", dest="uhd", action="store_true")
    ap.add_argument("--list", default=None, help="добірка з order.js, напр. short")
    ap.add_argument("--force", action="store_true", help="переписати навіть свіжі кліпи")
    a = ap.parse_args()
    if a.cmd == "assets":
        assets()
    elif a.cmd == "html":
        bundle()
    elif a.cmd == "site":
        site()
    elif a.cmd == "frames":
        for o in (a.o or "land").split(","):
            frames(a.scene, o, a.count, [int(x) for x in a.at.split(",") if x] or None)
    else:
        only = {s for s in a.scenes.split(",") if s}
        video((a.o or "land,port").split(","), a.fps, only, a.jobs, 2 if a.uhd else 1, a.list, a.force)


if __name__ == "__main__":
    main()
