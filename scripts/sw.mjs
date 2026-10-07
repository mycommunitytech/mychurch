/* Сервіс-воркер сайту: готовий sw.js зі списком файлів сторінки /offline/
   ─────────────────────────────────────────────────────────────────
   Сайт — статика без сервера, тож і воркер — звичайний файл у корені.
   Його код лежить у scripts/sw.template.js; сюди після `next build`
   вписуємо:

     __VERSION__  — короткий хеш шаблону й списку: змінилась збірка —
                    змінився текст sw.js, і браузер бачить нового воркера;
     __PRECACHE__ — /offline/ та її js/css/шрифти з .static/offline/index.html
                    (назви шматків у кожній збірці нові, тож список руками
                    не напишеш).

   Результат — .static/sw.js: їде на хостинг разом із рештою експорту.
   Запускається з `npm run build` після og-png.mjs. */

import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = ".static";
const OFFLINE_URL = "/offline/";
const TEMPLATE = "scripts/sw.template.js";

const offlineHtml = await readFile(join(OUT_DIR, "offline", "index.html"), "utf8").catch(() => null);
if (offlineHtml === null) {
  console.error(`sw: у ${OUT_DIR} немає сторінки ${OFFLINE_URL} — спершу \`next build\``);
  process.exit(1);
}

/* Усе з /_next/static/, на що посилається сторінка: скрипти, стилі, шрифти. */
const assets = [...offlineHtml.matchAll(/\b(?:src|href)="(\/_next\/static\/[^"]+)"/g)]
  .map((match) => match[1])
  .filter((url, index, all) => all.indexOf(url) === index)
  .sort();

if (assets.length === 0) {
  console.error(`sw: у ${OUT_DIR}/offline/index.html не знайдено жодного файла /_next/static/ — розмітка змінилась?`);
  process.exit(1);
}

const precache = [OFFLINE_URL, ...assets];
const template = await readFile(TEMPLATE, "utf8");
const version = createHash("sha1")
  .update(template)
  .update(JSON.stringify(precache))
  .digest("hex")
  .slice(0, 10);

const worker = template
  .replace("__VERSION__", version)
  .replace("__PRECACHE__", JSON.stringify(precache, null, 2));

await writeFile(join(OUT_DIR, "sw.js"), worker);

let bytes = 0;
for (const url of assets) bytes += (await stat(join(OUT_DIR, url))).size;
console.log(
  `sw: ${OUT_DIR}/sw.js v${version}, у precache ${OFFLINE_URL} + ${assets.length} файлів (${(bytes / 1024).toFixed(0)} КБ)`,
);
