/* IndexNow: сказати пошуковим системам, що сторінки змінились, не чекаючи,
   поки робот зайде сам.

   Протокол підтримують Bing, Yandex, Seznam і Naver — Google ні, його
   будимо через Search Console («Запит на індексування»). Але Bing
   зазвичай бере сторінку за години, і саме з його індексу тягнуть
   відповіді кілька ШІ-пошуків.

   Ключ лежить файлом у корені сайту (public/<ключ>.txt) — так сервіс
   перевіряє, що адресу подав власник домену.

   Запускати після того, як свіжий експорт уже залито на хостинг:
   інакше робот прийде на стару версію сторінки.

       node scripts/indexnow.mjs            — усі адреси з карти сайту
       node scripts/indexnow.mjs /blog/     — лише вказані

   Нічого не вивантажує й нічого не змінює на сайті: надсилає тільки
   список адрес, які й так відкриті в пошуку. */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mychurch.com.ua").replace(/\/+$/, "");
const HOST = new URL(SITE).host;
const ROOT = path.join(import.meta.dirname, "..");

/** Ключ — єдиний файл виду <32 шістнадцяткові символи>.txt у public/. */
async function readKey() {
  const files = await readdir(path.join(ROOT, "public"));
  const key = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!key) throw new Error("Немає файлу ключа public/<ключ>.txt — IndexNow без нього не працює");
  return key.replace(/\.txt$/, "");
}

/** Адреси беремо з готової карти сайту: вона вже містить рівно те, що
    має бути в пошуку, і саме з тими слешами. */
async function sitemapUrls() {
  const xml = await readFile(path.join(ROOT, ".static", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const key = await readKey();
const picked = process.argv.slice(2);
const all = await sitemapUrls();
const urlList = picked.length
  ? picked.map((p) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? p : `/${p}`}`))
  : all;

if (!urlList.length) {
  console.error("Список адрес порожній — спершу `npm run build`");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList }),
});

/* 200 — прийнято, 202 — прийнято, ключ ще перевіряється. */
if (res.status === 200 || res.status === 202) {
  console.log(`indexnow: подано ${urlList.length} адрес (${res.status})`);
} else {
  console.error(`indexnow: відмова ${res.status} ${res.statusText}`);
  console.error(await res.text().catch(() => ""));
  process.exit(1);
}
