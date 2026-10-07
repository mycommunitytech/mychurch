<?php
/* Приймач заявок: форма демо, бриф на /modules, слухавка «перетелефонуємо»
   і форма матеріалу на /plan.

   Сайт збирається в статику (output: export у next.config.ts) — ані свого
   сервера, ані роуту /api/lead у нього немає, а токен бота в браузер класти
   не можна. Тому форма шле JSON сюди: цей файл лежить у корені сайту на
   тому ж хостингу, тримає токен і сам пише в Telegram.

   Адреса цього файла задається фронту через NEXT_PUBLIC_LEAD_ENDPOINT
   (див. .env.example). Той самий домен — тож CORS у звичайному випадку
   не потрібен, але www-дзеркало нижче все одно передбачене.

   ── Куди покласти токен ────────────────────────────────────────────────
   Шукаємо в такому порядку:
     1. ../lead-secret.php — на рівень вище кореня сайту, найкраще місце:
        навіть якщо PHP колись зламається, віддати вихідник нікуди;
     2. ./lead-secret.php  — поруч, якщо вище класти нікуди (shared-хостинг);
     3. змінні оточення TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID.

   Сам lead-secret.php:

     <?php return [
       'telegram_token' => '1234567890:AA...',
       'telegram_chat'  => '-1001234567890',
       'email_to'       => '',  // необов'язковий другий канал
       'email_from'     => '',

       // CRM My Community: лід лягає карткою у воронку.
       // Ключ авторизує тільки створення ліда (роути /api-lead/*),
       // але на сайт його класти все одно не можна — лише сюди.
       'crm_key'        => '',  // X-API-KEY з налаштувань CRM
       'crm_business'   => '',  // businessId
       'crm_funnel'     => '',  // funnelId — воронка, куди падають ліди
       // id джерела ліда (CRM → Джерела). У картці видно сам напис, тож
       // називайте джерело адресою сайту — «Сайт mychurch.com.ua»: менеджер
       // одразу бачить, звідки заявка, а не здогадується з «Сайт».
       'crm_source'     => '',
       'crm_url'        => '',  // порожньо = https://api.my-community.pp.ua/api/api-lead/create

       // Пошта: з ключем Resend лист іде через їхній API, без нього — mail().
       'resend_key'     => '',
     ];

   У репозиторій він не потрапляє — .gitignore ловить lead-secret.php.

   Код навмисне тримається синтаксису PHP 7.4: на спільному хостингу
   версія буває стара, а лід важливіший за сучасні фічі мови. */

declare(strict_types=1);

/* Відповідь — це JSON, і більше нічого. На спільному хостингу
   display_errors часто ввімкнений, і будь-який warning чи «deprecated»
   надрукувався б просто в тіло: форма не розібрала б відповідь і показала
   б помилку на успішно доставленому ліді. Тому вивід помилок — у журнал
   хостингу, а не відвідувачу. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

/* ── Відповідь ─────────────────────────────────────────────────────────── */

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/* ── Налаштування ──────────────────────────────────────────────────────── */

function config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $cfg = [];
    foreach ([__DIR__ . '/../lead-secret.php', __DIR__ . '/lead-secret.php'] as $path) {
        if (is_file($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $cfg = $loaded;
                break;
            }
        }
    }
    /* Оточення — запасний варіант: на хостингу зі змінними файл не потрібен. */
    $fromEnv = [
        'telegram_token' => 'TELEGRAM_BOT_TOKEN',
        'telegram_chat' => 'TELEGRAM_CHAT_ID',
        'email_to' => 'LEAD_EMAIL_TO',
        'email_from' => 'LEAD_EMAIL_FROM',
        'crm_key' => 'CRM_API_KEY',
        'crm_business' => 'CRM_BUSINESS_ID',
        'crm_funnel' => 'CRM_FUNNEL_ID',
        'crm_source' => 'CRM_SOURCE_ID',
        'crm_url' => 'CRM_LEAD_URL',
        'resend_key' => 'RESEND_API_KEY',
    ];
    foreach ($fromEnv as $key => $env) {
        if (empty($cfg[$key])) {
            $value = getenv($env);
            if (is_string($value) && $value !== '') {
                $cfg[$key] = $value;
            }
        }
    }
    return $cfg;
}

function setting(string $key): string
{
    $cfg = config();
    return isset($cfg[$key]) && is_string($cfg[$key]) ? trim($cfg[$key]) : '';
}

/* ── CORS для www-дзеркала ─────────────────────────────────────────────── */

$ALLOWED_ORIGINS = ['https://mychurch.com.ua', 'https://www.mychurch.com.ua'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, $ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

/* ── Чистка того, що надрукував відвідувач ─────────────────────────────── */

/* Керівні символи викидаємо (крім переносу рядка — він потрібен у
   «Побажаннях»), CRLF зводимо до \n, довжину ріжемо по символах, а не
   по байтах: українські літери в UTF-8 займають по два. */
function clean($value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/\r\n?/u', "\n", $value);
    $value = preg_replace('/[\x{0000}-\x{0008}\x{000B}\x{000C}\x{000E}-\x{001F}\x{007F}]/u', '', (string) $value);
    $value = trim((string) $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

/* Поля, які в інтерфейсі займають один рядок: ім'я, телефон, розмір,
   сторінка. Перенос усередині такого значення — або випадковість, або
   спроба дописати щось у тему листа, тож будь-який пробільний набір
   зводимо до одного пробілу. */
function line_value($value, int $max): string
{
    return trim((string) preg_replace('/\s+/u', ' ', clean($value, $max)));
}

/* Telegram розбирає повідомлення як HTML, тож усе, що надрукував
   відвідувач, треба екранувати. Ім'я на кшталт ТОВ "Ромашка" & партнери
   інакше валить відправку (400 can't parse entities), а <a href> із поля
   став би живим посиланням у робочому чаті. */
function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_NOQUOTES, 'UTF-8');
}

/* Цілі приходять ідентифікаторами, а в лід потрапляють наші ж підписи:
   чужий текст у повідомлення не заходить, невідомий id просто відкидаємо.
   Дзеркало ua.builder.goals із src/lib/i18n.ts — якщо там з'явиться нова
   ціль, лід усе одно дійде, просто без цього рядка. */
const GOAL_LABELS = [
    'newcomers' => 'Не губити новеньких',
    'attendance' => 'Бачити, хто перестав приходити',
    'requests' => 'Не губити прохання людей',
    'comms' => 'Писати громаді в один клік',
    'ministries' => 'Навести лад у служіннях і графіках',
    'groups' => 'Тримати малі групи в полі зору',
    'kids' => 'Дитяче служіння без хаосу',
    'events' => 'Спокійно проводити події й табори',
    'org' => 'Зрозуміти, хто за що відповідає',
    'learning' => 'Навчати лідерів і команду',
    'money' => 'Порядок у пожертвах і витратах',
    'rooms' => 'Зали та обладнання без накладок',
    'gather' => 'Зібрати все з файлів і чатів докупи',
    'forms' => 'Прибрати реєстрації з чатів і таблиць',
    'routine' => 'Щоб нагадування йшли самі',
    'numbers' => 'Бачити церкву в цифрах',
    'campuses' => 'Вести кілька локацій разом',
    'families' => 'Бачити сім\'ї, а не список імен',
    'birthdays' => 'Не пропускати дні народження',
    'membership' => 'Вести членство і хрещення',
    'planning' => 'Порядок служіння за шаблоном',
    'camps' => 'Табори з реєстрацією і списками',
    'calendar' => 'Один календар на всю церкву',
    'projects' => 'Задачі команди не губляться',
    'knowledge' => 'Матеріали й проповіді в одному місці',
    'inventory' => 'Майно й техніка на обліку',
    'assistant' => 'Питати систему звичайними словами',
    'custom' => 'Свої поля під нашу церкву',
    'goals' => 'Ставити цілі й бачити рух',
];

/* Роль того, хто лишив заявку: ті самі ідентифікатори, що в каталозі
   «Для кого». Форма брифу, яка це поле надсилала, прибрана з сайту
   2026-09-22 — розбір лишаємо на випадок, коли роль знову почне
   приїжджати (і заради заявок зі сторінок, що висять у кеші). */
const ROLE_LABELS = [
    'pastor' => 'Пастор',
    'leader' => 'Лідер',
    'deacon' => 'Диякон',
    'volunteer' => 'Служитель',
    'accountant' => 'Бухгалтер',
    'reception' => 'Адміністратор',
];

function goal_labels($value): array
{
    if (!is_array($value)) {
        return [];
    }
    $out = [];
    foreach (array_slice($value, 0, 16) as $id) {
        if (!is_string($id)) {
            continue;
        }
        if (array_key_exists($id, GOAL_LABELS)) {
            $out[] = GOAL_LABELS[$id];
            continue;
        }
        /* Бажання, вписане своїми словами: воно приходить із префіксом
           own: і є єдиним місцем у цьому списку, де текст чужий, — тож
           обрізаємо його, як звичайне поле. */
        if (strpos($id, 'own:') === 0) {
            $own = line_value(substr($id, 4), 80);
            if ($own !== '') {
                $out[] = $own;
            }
        }
    }
    return $out;
}

/* ── Заслінки від спаму й дублів ───────────────────────────────────────── */

/* Три різні заслінки, бо спам буває трьох видів.

   1. Одна адреса — не більше 5 лідів за 10 хвилин. Ловить того, хто
      довбить кнопку або крутить скрипт з одного місця.
   2. Увесь сайт — не більше 40 лідів за 10 хвилин. Ботнет міняє адреси,
      і перша заслінка його не бачить; ця не дає залити чат. Звичайний
      день лендінга — одиниці лідів, тож поріг із запасом.
   3. Той самий телефон із тієї самої форми — один лід на 15 хвилин.
      Це головне проти дублів: подвійний клік, повтор після обриву мережі
      чи перезаслана форма більше не перетворюються на N повідомлень. */
const WINDOW = 600;
/* 15, а не 5 (2026-10-07): на конференції з QR-кодом на банері десятки
   людей пишуть з одного Wi-Fi чи однієї адреси мобільного оператора. */
const LIMIT_IP = 15;
const LIMIT_ALL = 40;
const DEDUPE_TTL = 900;

/* Стан заслінок і журнал недоставлених лідів кладемо вище кореня сайту:
   у корені їх віддавав би сам хостинг. Якщо туди не пишеться (буває на
   спільних хостингах) — системний тимчасовий каталог. */
function state_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $preferred = __DIR__ . '/../.lead-state';
    if (!is_dir($preferred)) {
        @mkdir($preferred, 0700, true);
    }
    $dir = (is_dir($preferred) && is_writable($preferred)) ? $preferred : sys_get_temp_dir();
    return $dir;
}

/* Один файл під замком: читаємо, підчищаємо прострочене, вирішуємо і
   одразу записуємо. Не змогли відкрити файл — пропускаємо заявку далі:
   зламані заслінки не привід губити лід. */
function gate(string $ip, string $dedupeKey): string
{
    $path = state_dir() . '/lead-gate.json';
    $fh = @fopen($path, 'c+');
    if (!$fh) {
        return '';
    }
    $verdict = '';
    if (flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $state = json_decode(is_string($raw) ? $raw : '', true);
        if (!is_array($state)) {
            $state = [];
        }
        $now = time();
        $fresh = function ($stamps) use ($now) {
            return array_values(array_filter(
                is_array($stamps) ? $stamps : [],
                function ($t) use ($now) {
                    return is_int($t) && $t > $now - WINDOW;
                }
            ));
        };

        $byIp = isset($state['ip']) && is_array($state['ip']) ? $state['ip'] : [];
        foreach ($byIp as $key => $stamps) {
            $kept = $fresh($stamps);
            if ($kept) {
                $byIp[$key] = $kept;
            } else {
                unset($byIp[$key]);
            }
        }
        $all = $fresh(isset($state['all']) ? $state['all'] : []);

        $dup = isset($state['dup']) && is_array($state['dup']) ? $state['dup'] : [];
        foreach ($dup as $key => $t) {
            if (!is_int($t) || $t <= $now - DEDUPE_TTL) {
                unset($dup[$key]);
            }
        }

        $mine = isset($byIp[$ip]) ? $byIp[$ip] : [];
        if (count($mine) >= LIMIT_IP) {
            $verdict = 'rate_limited';
        } elseif (count($all) >= LIMIT_ALL) {
            $verdict = 'rate_limited_all';
        } elseif (isset($dup[$dedupeKey])) {
            $verdict = 'duplicate';
        } else {
            $mine[] = $now;
            $byIp[$ip] = $mine;
            $all[] = $now;
            $dup[$dedupeKey] = $now;
        }

        $state = ['ip' => $byIp, 'all' => $all, 'dup' => $dup];
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, (string) json_encode($state));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $verdict;
}

/* Журнал заявок, які не дійшли до CRM: заслінка, пастка, збій каналу.
   Лежить поруч зі станом заслінок, щоб менеджер міг знайти людину й
   передзвонити. Розмір обмежений — флуд не має з'їсти диск хостингу. */
function journal(string $file, string $line): void
{
    $path = state_dir() . '/' . $file;
    if (is_file($path) && (int) filesize($path) > 2000000) {
        return;
    }
    @file_put_contents($path, gmdate('c') . ' ' . str_replace("\n", ' | ', $line) . "\n", FILE_APPEND | LOCK_EX);
}

/** Коротко про заявку для журналу — до того, як зібрано повідомлення. */
function brief_line(array $body): string
{
    $parts = [];
    foreach (['source', 'name', 'church', 'phone', 'page', 'company'] as $key) {
        $value = line_value(isset($body[$key]) ? $body[$key] : '', 120);
        if ($value !== '') {
            $parts[] = $key . '=' . $value;
        }
    }
    return implode(' ', $parts);
}

/* Жоден канал не відпрацював — знімаємо позначку дубля, щоб повтор
   одразу пішов у роботу, а не впав у «вже приймали». */
function forget(string $dedupeKey): void
{
    $path = state_dir() . '/lead-gate.json';
    $fh = @fopen($path, 'c+');
    if (!$fh) {
        return;
    }
    if (flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $state = json_decode(is_string($raw) ? $raw : '', true);
        if (is_array($state) && isset($state['dup'][$dedupeKey])) {
            unset($state['dup'][$dedupeKey]);
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, (string) json_encode($state));
            fflush($fh);
        }
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

/* Cloudflare підставляє реальну адресу відвідувача сам і чужий такий
   заголовок відкидає. Без нього беремо REMOTE_ADDR: X-Forwarded-For
   підробляється з боку клієнта, а спільна і загальна заслінки тримають
   оборону й без точної адреси. */
function client_ip(): string
{
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    return !empty($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
}

/* ── Канали ────────────────────────────────────────────────────────────── */

/** Тіло відповіді каже «не вийшло»: {"ok":false} у Telegram, {"status":4xx} у CRM. */
function answer_failed($answer): bool
{
    if (!is_array($answer)) {
        return false;
    }
    if (isset($answer['ok']) && $answer['ok'] !== true) {
        return true;
    }
    return isset($answer['status']) && (int) $answer['status'] >= 400;
}

function post_json(string $url, array $payload, array $headers = []): bool
{
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
    $headers = array_merge(['Content-Type: application/json'], $headers);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        $res = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        /* З PHP 8.0 ручка закривається сама, а з 8.5 виклик уже й лається
           в журнал. Лишаємо його тільки для старих версій на хостингу. */
        if (PHP_VERSION_ID < 80000) {
            curl_close($ch);
        }
        if ($code < 200 || $code >= 300 || !is_string($res)) {
            return false;
        }
        return !answer_failed(json_decode($res, true));
    }
    /* Хостинг без cURL — ідемо потоками. Замість рядка стану дивимось у
       тіло: Telegram і на помилку відповідає JSON із "ok":false, а
       $http_response_header у свіжих PHP уже застарілий. */
    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => implode("\r\n", $headers) . "\r\n",
        'content' => $body,
        'timeout' => 8,
        'ignore_errors' => true,
    ]]);
    $res = @file_get_contents($url, false, $context);
    if (!is_string($res)) {
        return false;
    }
    return !answer_failed(json_decode($res, true));
}

function send_telegram(string $html): bool
{
    $token = setting('telegram_token');
    $chat = setting('telegram_chat');
    if ($token === '' || $chat === '') {
        return false;
    }
    /* Адреса API виноситься в налаштування рівно заради одного: прогнати
       відправку на локальному макеті, не турбуючи справжній чат. */
    $api = setting('telegram_api');
    if ($api === '') {
        $api = 'https://api.telegram.org';
    }
    return post_json(rtrim($api, '/') . '/bot' . $token . '/sendMessage', [
        'chat_id' => $chat,
        'text' => $html,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]);
}

/* ── CRM My Community ───────────────────────────────────────────────────
   Лід лягає карткою у воронку: назва, телефон, джерело і «Коментар» з усім,
   що людина заповнила. Ключ авторизує лише створення ліда (роути
   /api-lead/*), і все одно живе тут, на сервері, а не в бандлі сайту.

   Ідентифікатори нижче — це не поля ліда, а поля ФОРМИ бізнесу (instruction):
   вони спільні для всіх лідів воронки й міняються, лише якщо перебудувати
   структуру картки в CRM. Якщо колись зміняться — нові видно у відповіді на
   будь-яке створення ліда (поле fieldInstructionId поруч із fieldSlug).
   Помилковий id не губить заявку: лід усе одно створиться, просто коментар
   не ляже у своє поле. */

const CRM_BLOCK_INSTRUCTION = 'a095a1f4-a4ba-4acd-b16d-280ccdecda2e';   // lead_info
const CRM_SECTION_INSTRUCTION = '1ca9a8aa-a91b-44c1-9c9c-6a76c0b13463'; // basic_info
/* Поле «Коментар» у CRM більше не заповнюємо (усе розкладено по полях), але id
   лишаємо: воно знадобиться, якщо колись доведеться писати туди знову. */
const CRM_FIELD_COMMENT = '6c2375ed-b132-47da-9e31-6de620a17f18';
const CRM_FIELD_NAME = 'e441e1d8-ce3a-4672-bedb-d9fa7ab9f352';
const CRM_FIELD_PHONE = '52d3e7c3-8aab-4fed-814d-5b976d9766ce';
const CRM_FIELD_SOURCE = '42defd61-1472-4b5d-86e6-b9158f302ef9';

/* Другий блок картки — «Більше». Раніше все, крім імені й телефону, їхало одним
   текстовим коментарем: у CRM це сіра простиня, по якій не працюють ні фільтри,
   ні автоматизації, ні звіти. Тепер ті самі значення додатково лягають окремими
   полями. Ключ — ПІДПИС рядка з $rows: підписи задаються тут же, у цьому файлі,
   тож мапа не роз'їдеться непомітно. «Мова» свідомо не мапиться: окремим полем
   картки вона не потрібна, у коментарі й листі рядок лишається. */
const CRM_BLOCK_MORE = 'fab1e0f3-3cf3-4a0f-96f1-3907dfe1df06';    // more_info
const CRM_SECTION_MORE = '88273938-aec0-4e9e-96ce-4bfbf16d287a';  // site_request
const CRM_MORE_FIELDS = [
    'Церква'           => ['church_name',   'text',     '8ce30c00-46d5-47e0-a88d-f4c8300a7f20'],
    'Розмір'           => ['church_size',   'text',     'c6a56210-3f1a-4816-af03-b705e904358b'],
    'Інструменти'      => ['current_tools', 'text',     'd8e87bf6-ff58-4158-bad7-ba7daf7448a3'],
    'Хочуть покращити' => ['improve_goals', 'textarea', 'ec5c9f17-5dda-431e-acf3-617f1d94883a'],
    'Побажання'        => ['wishes',        'textarea', 'c9d0cba1-4101-4b44-9359-47c3bcfca1e2'],
    'Сторінка'         => ['landing_page',  'text',     'f37ac46e-fc84-48be-ab37-413f6b5bc51b'],
    'Кампанія'         => ['utm_campaign',  'text',     '7a063372-2b57-4ff5-b27b-69037484c744'],
];

/** Випадковий id для значення поля — CRM чекає його від того, хто створює. */
function crm_id(): string
{
    $bytes = function_exists('random_bytes') ? random_bytes(16) : pack('N4', mt_rand(), mt_rand(), mt_rand(), mt_rand());
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

function crm_field(string $slug, string $type, string $instruction, string $value, string $label): array
{
    $id = crm_id();
    return [
        'fieldId' => $id,
        'fieldInstructionId' => $instruction,
        'fieldSlug' => $slug,
        'label' => $label,
        'type' => $type,
        'value' => ['fieldId' => $id, 'type' => $type, 'value_string' => $value],
    ];
}

/** «0931234567» → «+380931234567»: CRM звіряє клієнта за номером, і той самий
    номер у двох написаннях створив би двох різних людей. */
function crm_phone(string $phone): string
{
    $digits = preg_replace('/[^0-9]/', '', $phone);
    if ($digits === '') {
        return '';
    }
    if (strlen($digits) === 10 && $digits[0] === '0') {
        return '+38' . $digits;
    }
    if (strlen($digits) === 9) {
        return '+380' . $digits;
    }
    if (strlen($digits) === 12 && strpos($digits, '380') === 0) {
        return '+' . $digits;
    }
    /* Поле підставляє «+380», а людина за звичкою додає свій нуль — «+3800931234567».
       Зайвий нуль прибираємо, інакше в CRM з'явиться двійник. */
    if (strlen($digits) === 13 && strpos($digits, '3800') === 0) {
        return '+38' . substr($digits, 3);
    }
    return strpos($phone, '+') === 0 ? '+' . $digits : $digits;
}

function send_crm(string $title, string $name, string $church, string $phone, array $rows): bool
{
    $key = setting('crm_key');
    $business = setting('crm_business');
    $funnel = setting('crm_funnel');
    if ($key === '' || $business === '' || $funnel === '') {
        return false;
    }
    $url = setting('crm_url');
    if ($url === '') {
        $url = 'https://api.my-community.pp.ua/api/api-lead/create';
    }

    /* Коментар у CRM більше не збираємо. Склеєний текст — це рядок, по якому не
       працюють ні фільтри, ні автоматизації, ні звіти; усе, що з нього читали,
       тепер лежить окремими полями блоку «Більше». Telegram і лист отримують
       свій текст незалежно (з $lines), тож там нічого не змінюється. */
    $who = $name !== '' ? $name : ($church !== '' ? $church : $phone);
    $phone = crm_phone($phone);

    /* Назва картки в CRM: церква попереду — у списку воронки менеджер бачить,
       від кого заявка, не відкриваючи її. Без назви церкви лишається ім'я,
       а коли людина не назвалась — сам номер. */
    $cardTitle = ($church !== '' && $name !== '')
        ? $title . ' — ' . $church . ' · ' . $name
        : $title . ' — ' . $who;

    /* Поле «Назва» — той самий рядок, що й заголовок картки. Окремим ключем
       payload title лягає в колонку ліда, але НЕ в поле блоку: lead.service.ts
       вписує його лише в поле, яке вже є в присланих блоках. Без цього рядка
       перший рядок «ПРО ЛІД» у картці лишався порожнім. */
    $fields = [crm_field('lead_name', 'text', CRM_FIELD_NAME, $cardTitle, 'Назва')];

    /* «Джерело Ліда» зберігає id джерела, а не його назву: назву показує сама
       CRM із довідника «Джерела». Поле мусить БУТИ в блоці — після створення
       api-lead.service.ts шукає його по fieldSlug і, не знайшовши, мовчки
       пропускає привʼязку (саме тому джерело в картках лишалось порожнім).
       Значення кладемо одразу самі, щоб картка не залежала від того кроку. */
    $source = setting('crm_source');
    if ($source !== '') {
        $fields[] = crm_field('lead_source', 'text', CRM_FIELD_SOURCE, $source, 'Джерело Ліда');
    }

    if ($phone !== '') {
        $fields[] = crm_field('phone', 'phone', CRM_FIELD_PHONE, $phone, 'Номер телефону');
    }

    $blocks = [];
    if ($fields) {
        $blocks[] = [
            'blockId' => crm_id(),
            'blockInstructionId' => CRM_BLOCK_INSTRUCTION,
            'blockSlug' => 'lead_info',
            'sections' => [[
                'sectionId' => crm_id(),
                'sectionInstructionId' => CRM_SECTION_INSTRUCTION,
                'sectionSlug' => 'basic_info',
                'label' => 'ПРО ЛІД',
                'fields' => $fields,
            ]],
        ];
    }

    /* Блок «Більше» додаємо ЛИШЕ коли є що покласти: порожній блок у картці —
       це сім німих рядків на кожну заявку. Підписи, яких немає в мапі (ім'я,
       телефон, мова, час), сюди не потрапляють — вони або вже окремі поля, або
       дублювали б createdAt, або не потрібні в картці. */
    $more = [];
    foreach ($rows as $row) {
        $label = isset($row['label']) ? $row['label'] : '';
        $value = isset($row['value']) ? trim((string) $row['value']) : '';
        if ($value === '' || !isset(CRM_MORE_FIELDS[$label])) {
            continue;
        }
        list($slug, $type, $instruction) = CRM_MORE_FIELDS[$label];
        $more[] = crm_field($slug, $type, $instruction, $value, $label);
    }
    if ($more) {
        $blocks[] = [
            'blockId' => crm_id(),
            'blockInstructionId' => CRM_BLOCK_MORE,
            'blockSlug' => 'more_info',
            'sections' => [[
                'sectionId' => crm_id(),
                'sectionInstructionId' => CRM_SECTION_MORE,
                'sectionSlug' => 'site_request',
                'label' => 'Більше',
                'fields' => $more,
            ]],
        ];
    }

    $payload = [
        'title' => $cardTitle,
        'businessId' => $business,
        'funnelId' => $funnel,
        'sourceType' => 'website',
        'clientPhone' => $phone,
        'blocks' => $blocks,
    ];

    /* Те саме джерело — ще й окремим ключем: із ним CRM звіряє лід із довідником
       і вмикає автоматизації «за джерелом ліда». Ключ додаємо лише непорожнім:
       порожній рядок CRM відкине як неіснуюче джерело, і заявка загубиться
       цілком. */
    if ($source !== '') {
        $payload['sourceId'] = $source;
    }

    return post_json($url, $payload, ['X-API-KEY: ' . $key]);
}

/* Другий канал, якщо хостинг уміє слати пошту і в налаштуваннях є адреса.
   Потрібен рівно для одного: щоб лід не зник, поки Telegram недоступний. */
/* Пошта через Resend — хостингова mail() на шаредах часто мовчки не доходить
   (лист або в спамі, або нікуди). Ключ лежить там само, де решта секретів;
   без нього все працює як раніше, через mail(). */
function send_resend(string $subject, string $text, string $html): bool
{
    $key = setting('resend_key');
    $to = setting('email_to');
    if ($key === '' || $to === '') {
        return false;
    }
    $from = setting('email_from');
    if ($from === '') {
        $from = 'Сайт «Моя Церква» <onboarding@resend.dev>';
    }
    return post_json('https://api.resend.com/emails', [
        'from' => $from,
        'to' => array_map('trim', explode(',', $to)),
        'subject' => $subject,
        'text' => $text,
        'html' => $html,
    ], ['Authorization: Bearer ' . $key]);
}

/* Тема українською — це не ASCII, тож у заголовок вона йде закодованою.
   mb_encode_mimeheader ще й розбиває задовгий рядок на дозволені шматки;
   без mbstring лишається запасний варіант одним куснем, як було. */
function encode_subject(string $subject): string
{
    if (function_exists('mb_encode_mimeheader')) {
        $prev = mb_internal_encoding();
        mb_internal_encoding('UTF-8');
        $encoded = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
        mb_internal_encoding($prev);
        return $encoded;
    }
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

/* «Сайт «Моя Церква» <site@...>» у заголовку From — теж не ASCII, і без
   кодування частина поштовиків показує замість назви кракозябри. Кодуємо
   лише підпис: адреса в кутових дужках має лишитися як є. */
function encode_from(string $from): string
{
    if (preg_match('/^[\x20-\x7e]*$/', $from)) {
        return $from;
    }
    if (preg_match('/^(.*?)\s*<([^>]+)>$/u', $from, $parts)) {
        return encode_subject(trim($parts[1])) . ' <' . $parts[2] . '>';
    }
    return $from;
}

/* Частина multipart-листа. Тіло йде base64: так UTF-8 і переноси рядків
   переживуть будь-який sendmail, який любить «виправляти» CRLF. */
function mime_part(string $type, string $content): string
{
    return 'Content-Type: ' . $type . "; charset=utf-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($content), 76, "\r\n");
}

function send_email(string $subject, string $text, string $html): bool
{
    if (send_resend($subject, $text, $html)) {
        return true;
    }
    $to = setting('email_to');
    if ($to === '' || !function_exists('mail')) {
        return false;
    }
    $from = setting('email_from');
    if ($from === '') {
        $host = isset($_SERVER['HTTP_HOST']) ? preg_replace('/[^a-z0-9.\-]/i', '', (string) $_SERVER['HTTP_HOST']) : 'localhost';
        $from = 'site@' . $host;
    }
    /* multipart/alternative: поштовик показує верстку, а текстова частина
       лишається для клієнтів без HTML і для пошуку в скриньці. */
    $boundary = 'lead-' . md5(uniqid('', true));
    $headers = 'From: ' . encode_from($from) . "\r\n"
        . "MIME-Version: 1.0\r\n"
        . 'Content-Type: multipart/alternative; boundary="' . $boundary . "\"\r\n";
    $message = '--' . $boundary . "\r\n" . mime_part('text/plain', $text)
        . "\r\n--" . $boundary . "\r\n" . mime_part('text/html', $html)
        . "\r\n--" . $boundary . "--\r\n";
    return @mail($to, encode_subject($subject), $message, $headers);
}

/* ── Верстка листа ─────────────────────────────────────────────────────── */

/* В атрибут (href) лапки теж мають бути екрановані — escape_html лишає їх
   як є, бо для Telegram цього досить. */
function escape_attr(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/* Поле заявки: підпис і значення окремо — у листі підпис іде колонкою
   ліворуч. `kind` вирішує, як значення показати (телефон посиланням,
   побажання — в кілька рядків), `display` дає листу власний варіант
   значення там, де машинний рядок людині незручний (час). */
function field(string $label, string $value, string $kind = 'text', string $display = ''): array
{
    return [
        'label' => $label,
        'value' => $value,
        'kind' => $kind,
        'display' => $display === '' ? $value : $display,
    ];
}

/* Сторінка приходить шляхом («/modules»): із нього не видно, ЧИЙ це сайт —
   ні в картці CRM, ні в Telegram, ні в листі. Приймач лежить у корені того
   самого сайту, тож його власний хост і є адресою, звідки прийшла заявка.
   Заразом «Сторінка» в листі стає посиланням: email_html робить лінк лише
   з http(s). */
function page_url(string $path): string
{
    if ($path === '' || preg_match('#^https?://#i', $path)) {
        return $path;
    }
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    if ($host === '' && isset($_SERVER['SERVER_NAME'])) {
        $host = $_SERVER['SERVER_NAME'];
    }
    /* Хост приходить із запиту, тож лишаємо тільки те, з чого складається
       доменне ім'я: інакше підроблений заголовок дописав би в картку що
       завгодно. Дзеркало www прибираємо — адреса сайту одна. */
    $host = preg_replace('/[^A-Za-z0-9.\-:]/', '', (string) $host);
    $host = preg_replace('/^www\./i', '', (string) $host);
    if ($host === '') {
        return $path;
    }
    /* Схема — https, якщо сервер прямо не сказав інше: сайт живе тільки на
       https (усі редиректи в .htaccess ведуть туди), а за проксі, що знімає
       TLS, $_SERVER['HTTPS'] часто взагалі не доходить. */
    $forwarded = isset($_SERVER['HTTP_X_FORWARDED_PROTO'])
        ? strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO'])
        : '';
    $plain = $forwarded === 'http'
        || ($forwarded === '' && isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === '' || $_SERVER['HTTPS'] === 'off'));
    return ($plain ? 'http://' : 'https://') . $host . (strpos($path, '/') === 0 ? $path : '/' . $path);
}

/* Час заявки по-київськи: «21.09.2026, 22:00». У CRM і Telegram лишається
   машинний ISO, а в пошті людина читає звичну дату. */
function local_time(): string
{
    if (class_exists('DateTimeImmutable')) {
        foreach (['Europe/Kyiv', 'Europe/Kiev'] as $zone) {
            try {
                $now = new DateTimeImmutable('now', new DateTimeZone($zone));
                return $now->format('d.m.Y, H:i') . ' (Київ)';
            } catch (Exception $e) {
                /* Стара база поясів не знає нової назви — пробуємо другу. */
            }
        }
    }
    return gmdate('d.m.Y, H:i') . ' UTC';
}

/* Таблиці й інлайнові стилі — єдине, що однаково показують Gmail, Outlook
   і пошта на телефоні. Головне вгорі: імʼя великим і телефон посиланням,
   щоб подзвонити можна було просто з листа, не переписуючи номер. */
function email_html(string $title, array $rows): string
{
    $head = '';
    $table = '';
    foreach ($rows as $row) {
        $value = $row['display'];
        if ($row['kind'] === 'name') {
            $head .= '<div style="font-size:22px;font-weight:700;line-height:1.3;color:#10182f;">'
                . escape_html($value) . '</div>';
            continue;
        }
        if ($row['kind'] === 'phone') {
            $digits = preg_replace('/[^0-9+]/', '', $value);
            $head .= '<div style="margin-top:6px;font-size:18px;line-height:1.4;">'
                . '<a href="tel:' . escape_attr((string) $digits) . '" style="color:#1b6ef3;font-weight:600;text-decoration:none;">'
                . escape_html($value) . '</a></div>';
            continue;
        }
        $shown = escape_html($value);
        if ($row['kind'] === 'url' && preg_match('#^https?://#i', $value)) {
            $shown = '<a href="' . escape_attr($value) . '" style="color:#1b6ef3;">' . $shown . '</a>';
        }
        if ($row['kind'] === 'long') {
            $shown = nl2br($shown, false);
        }
        $table .= '<tr>'
            . '<td class="lbl" style="padding:7px 16px 7px 0;vertical-align:top;width:148px;font-size:13px;line-height:1.5;color:#6b7684;">'
            . escape_html($row['label']) . '</td>'
            . '<td class="val" style="padding:7px 0;vertical-align:top;font-size:15px;line-height:1.5;color:#1f2933;word-break:break-word;">'
            . $shown . '</td>'
            . '</tr>';
    }

    /* На телефоні колонка з підписами зʼїдає половину ширини, тож там
       підпис стає рядком над значенням. Клієнти, які викидають <style>
       (старі Outlook), лишаються на двох колонках — теж читабельно. */
    $style = '<style>@media only screen and (max-width:520px){'
        . '.lbl{display:block!important;width:auto!important;padding:12px 0 0 0!important;}'
        . '.val{display:block!important;width:auto!important;padding:1px 0 0 0!important;}'
        . '}</style>';

    return '<!doctype html><html lang="uk"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>' . escape_html($title) . '</title>' . $style . '</head>'
        . '<body style="margin:0;padding:24px 12px;background:#f1f3f6;'
        . 'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">'
        . '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"'
        . ' style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e1e6ed;border-radius:12px;">'
        . '<tr><td style="padding:15px 24px;background:#16233f;border-radius:11px 11px 0 0;'
        . 'color:#ffffff;font-size:15px;font-weight:600;">' . escape_html($title) . '</td></tr>'
        . '<tr><td style="padding:22px 24px 4px 24px;">' . $head . '</td></tr>'
        . '<tr><td style="padding:12px 24px 22px 24px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $table . '</table>'
        . '</td></tr>'
        . '<tr><td style="padding:13px 24px;background:#f7f9fb;border-top:1px solid #edf0f4;'
        . 'border-radius:0 0 11px 11px;font-size:12px;line-height:1.5;color:#7a8596;">'
        . 'Автоматичний лист із форми заявки на сайті.</td></tr>'
        . '</table></td></tr></table></body></html>';
}

/* ── Розбір заявки ─────────────────────────────────────────────────────── */

/* Тіло ліда — це кілька рядків; мегабайти сюди приходять тільки зі зла. */
const MAX_BODY = 8192;

$raw = file_get_contents('php://input');
if (!is_string($raw)) {
    $raw = '';
}
if (strlen($raw) > MAX_BODY) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(400, ['ok' => false, 'error' => 'bad_json']);
}

/* Бот заповнив приховане поле — тихо відповідаємо «ок», у канали не шлемо.
   Але в журнал кладемо: так само поле могло заповнити автозаповнення
   браузера, і тоді це жива людина, якій треба передзвонити. */
if (clean(isset($body['company']) ? $body['company'] : '', 100) !== '') {
    journal('lead-trap.log', brief_line($body));
    respond(200, ['ok' => true]);
}

$name = line_value(isset($body['name']) ? $body['name'] : '', 80);
$phone = line_value(isset($body['phone']) ? $body['phone'] : '', 32);
$digits = preg_replace('/\D/u', '', $phone);
/* Обов'язковий лише номер — рівно те, що вимагає форма. Ім'я, церква й
   розповідь про себе приходять як є: менеджер спитає решту дзвінком. */
if (strlen((string) $digits) < 9) {
    respond(422, ['ok' => false, 'error' => 'invalid']);
}

/* Джерела заявок: демо, «передзвоніть» і план «30 днів». `brief` лишається
   у списку навмисне — форму прибрано з сайту 2026-09-22, але сторінка,
   що висить у кеші браузера, ще може надіслати саме його, і такий лід
   має доїхати підписаним, а не загубитись. Невідоме значення вважаємо
   заявкою на демо: краще зайвий раз підписати повідомлення звичним
   заголовком, ніж загубити лід через одруківку на фронті. */
$source = isset($body['source']) && in_array($body['source'], ['brief', 'callback', 'material'], true)
    ? $body['source']
    : 'demo';
$dedupeKey = $source . '|' . $digits;

/* Заслінки — до збирання повідомлення: флуд не має коштувати нам роботи. */
$verdict = gate(client_ip(), $dedupeKey);
if ($verdict === 'rate_limited' || $verdict === 'rate_limited_all') {
    if ($verdict === 'rate_limited_all') {
        error_log('[lead] спрацювала загальна заслінка — схоже на ботнет');
    }
    /* Форма покаже запасні контакти, але й сама заявка не має зникнути. */
    journal('lead-failed.log', $verdict . ' ' . brief_line($body));
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}
/* Дубль: той самий телефон із тієї самої форми. Відповідаємо «ок» —
   заявка справді прийнята, просто повідомлення вже пішло. Форма покаже
   «дякуємо», а не помилку, і людина не почне слати втретє. */
if ($verdict === 'duplicate') {
    respond(200, ['ok' => true, 'duplicate' => true]);
}

/* Заголовок повідомлення: менеджер має з першого рядка бачити, чого
   від нього чекають — показати систему чи просто передзвонити. */
$titles = [
    'brief' => '🧩 Бриф із /modules',        /* застаріле джерело: форми на сайті вже немає */
    'callback' => '📲 Просять передзвонити',
    'material' => '📘 Забрали план «30 днів до порядку»',
    'demo' => '📞 Заявка на демо',
];
$title = $titles[$source];
$size = line_value(isset($body['size']) ? $body['size'] : '', 60);
$about = clean(isset($body['about']) ? $body['about'] : '', 2000);
$page = page_url(line_value(isset($body['page']) ? $body['page'] : '', 200));
$utm = line_value(isset($body['utm']) ? $body['utm'] : '', 300);
$goals = goal_labels(isset($body['goals']) ? $body['goals'] : null);
$roleId = isset($body['role']) && is_string($body['role']) ? $body['role'] : '';
$role = array_key_exists($roleId, ROLE_LABELS) ? ROLE_LABELS[$roleId] : '';

$tools = [];
if (isset($body['tools']) && is_array($body['tools'])) {
    foreach (array_slice($body['tools'], 0, 12) as $tool) {
        $value = line_value($tool, 40);
        if ($value !== '') {
            $tools[] = $value;
        }
    }
}

$church = line_value(isset($body['church']) ? $body['church'] : '', 120);

/* Ім'я необов'язкове, тож картку, лист і тему підписує те, що є: саме
   ім'я, інакше назва церкви, а без неї — номер. */
$who = $name !== '' ? $name : ($church !== '' ? $church : $phone);
$rows = [field("Ім'я", $name, 'name', $who), field('Телефон', $phone, 'phone')];
/* Матеріал із /plan: файл людина вже завантажила сама, але ми обіцяли
   копію в телеграм — тож у повідомленні стоїть рядок із дією, а не
   просто позначка джерела. Дзвонити з цього приводу не треба. */
if ($source === 'material') {
    $rows[] = field('Що зробити', 'Надіслати в телеграм файл «30 днів до порядку» (mychurch.com.ua/plan-30-dniv.pdf). Не дзвонити.');
}
if ($role !== '') {
    $rows[] = field('Роль', $role);
}
if ($church !== '') {
    $rows[] = field('Церква', $church);
}
if ($size !== '') {
    $rows[] = field('Розмір', $size);
}
if ($tools) {
    $rows[] = field('Інструменти', implode(', ', $tools));
}
if ($goals) {
    $rows[] = field('Хочуть покращити', implode(', ', $goals));
}
if ($about !== '') {
    $rows[] = field('Побажання', $about, 'long');
}
if ($page !== '') {
    $rows[] = field('Сторінка', $page, 'url');
}
if ($utm !== '') {
    /* Мітки кампанії: по них видно, яка реклама привела заявку. */
    $rows[] = field('Кампанія', $utm);
}
$rows[] = field('Мова', (isset($body['lang']) && $body['lang'] === 'en') ? 'en' : 'ua');
/* CRM і Telegram далі отримують машинний час, лист — київський. */
$rows[] = field('Час', gmdate('c'), 'text', local_time());

/* Один набір полів — три представлення: рядки «підпис: значення» для CRM,
   Telegram і текстової частини листа, і окремо верстка для пошти. */
$lines = [];
foreach ($rows as $row) {
    if ($row['value'] === '') {
        continue;
    }
    $lines[] = $row['label'] . ': ' . $row['value'];
}
$text = implode("\n", array_merge([$title], $lines));
$html = implode("\n", array_merge(
    ['<b>' . escape_html($title) . '</b>'],
    array_map('escape_html', $lines)
));
$letter = email_html($title, $rows);

/* Канали незалежні: CRM — головний (там картка й воронка), Telegram —
   щоб менеджер побачив заявку одразу. Помилка одного не скасовує інший. */
$delivered = [];
if (send_crm($title, $name, $church, $phone, $rows)) {
    $delivered[] = 'crm';
} else {
    /* CRM — головний канал. Якщо впала лише вона, людина бачить «дякуємо»,
       а картки у воронці немає. Тож менеджер дізнається про це з тієї ж
       заявки в Telegram і в листі, а журнал тримає її до ручного внесення. */
    $html .= "\n\n⚠️ <b>У CRM не потрапило — внесіть вручну</b>";
    $text .= "\n\n⚠️ У CRM не потрапило — внесіть вручну";
}
if (send_telegram($html)) {
    $delivered[] = 'telegram';
}
/* Тема з телефоном: у списку листів видно, кому дзвонити, не відкриваючи. */
$subjects = [
    'brief' => 'Бриф з сайту',
    'callback' => 'Просять передзвонити',
    'material' => 'Забрали план «30 днів»',
    'demo' => 'Заявка на демо',
];
$subject = $subjects[$source] . ' — ' . $who;
if ($phone !== '' && $who !== $phone) {
    $subject .= ', ' . $phone;
}
if (send_email($subject, $text, $letter)) {
    $delivered[] = 'email';
}
if ($delivered && !in_array('crm', $delivered, true)) {
    journal('lead-failed.log', 'crm_failed ' . $text);
}

if (!$delivered) {
    /* Жоден канал не відпрацював — лід не має зникнути безслідно:
       кладемо його поруч зі станом заслінок, щоб можна було передзвонити. */
    forget($dedupeKey);
    @file_put_contents(
        state_dir() . '/lead-failed.log',
        gmdate('c') . ' ' . str_replace("\n", ' | ', $text) . "\n",
        FILE_APPEND | LOCK_EX
    );
    error_log('[lead] не доставлено: ' . str_replace("\n", ' | ', $text));
    $configured = (setting('telegram_token') !== '' && setting('telegram_chat') !== '')
        || (setting('crm_key') !== '' && setting('crm_funnel') !== '');
    respond(503, ['ok' => false, 'error' => $configured ? 'delivery_failed' : 'not_configured']);
}

respond(200, ['ok' => true, 'delivered' => $delivered]);
