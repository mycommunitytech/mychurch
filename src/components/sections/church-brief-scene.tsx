"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, CheckCheck, Clock, FileSpreadsheet, Play } from "lucide-react";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import { MODULE_ICONS, MODULE_ACCENTS } from "@/components/shared/module-icons";
import { useT } from "@/lib/lang";
import s from "./church-brief-scene.module.css";

/* Безлад, що складається в порядок (2026-09-25).

   Спершу на столі лежить те, чим церква живе сьогодні: таблиця «ФІНАЛ(2)»,
   чат без відповіді, стікер, зошит групи, фото нової сім'ї без імен.
   Клаптики неспокійно ворушаться. Потім кожен летить у свою клітинку вікна
   «Моєї Церкви» і на льоту стає плиткою модуля — таблиця людьми, фото
   сім'єю, зошит малою групою. Наостанок у шапці з'являється команда: це
   крок «Навчання».

   У плитках немає фінансів, а цифри й картинки в балансі: число мають
   лише «Люди» і «Заявки», решта — кожна зі своїм шматочком інтерфейсу,
   що закриває свій клаптик безладу. Обличчя лишились тільки в «Сім'ях»:
   у п'яти плитках поспіль їх було «забагато» (2026-09-25).

   Фази веде батьківський блок (church-brief.tsx), бо ті самі фази
   підсвічують кроки плану поруч. Без JavaScript і для тих, кому рух
   заважає, сцена стоїть у фазі `order` — одразу складеним вікном. */

export type ScenePhase = "order" | "chaos" | "gather" | "team" | "done";

/* Полотно малюємо в одних розмірах і масштабуємо під колонку. */
const W = 500;
const H = 400;
const TILE_W = 140;
const TILE_H = 84;

/* Лівий верхній кут вікна (у CSS — `.frame`). */
const FRAME_X = 14;
const FRAME_Y = 26;

/* Клітинки вікна: три на три, зліва направо й згори вниз. */
const SLOT_X = [28, 180, 332];
const SLOT_Y = [84, 180, 276];

/* Модуль кожної клітинки — у тому ж порядку, що й `brief.scene.tiles`. */
const TILE_MODULES = [
  "people", "ministries", "groups",
  "events", "family", "applications",
  "forms", "campaigns", "analytics",
] as const;

type Kind = "xlsx" | "chat" | "notebook" | "calendar" | "photo" | "sticky" | "form" | "tally" | "voice";

/* Де клаптик лежить у безладі (центр, нахил) і в яку клітинку летить.
   Клаптики навмисне летять не до найближчої клітинки, а навхрест —
   інакше впорядкування виглядає як легке вирівнювання, а не як лад. */
type Piece = { kind: Kind; slot: number; x: number; y: number; r: number; w: number; h: number; z: number; d: number };

const PIECES: Piece[] = [
  { kind: "xlsx",     slot: 0, x: 332, y: 116, r: 7,   w: 176, h: 108, z: 3, d: 0 },
  { kind: "chat",     slot: 1, x: 150, y: 50,  r: -6,  w: 236, h: 56,  z: 5, d: 2 },
  { kind: "notebook", slot: 2, x: 92,  y: 256, r: -10, w: 124, h: 124, z: 2, d: 4 },
  { kind: "calendar", slot: 3, x: 424, y: 318, r: 11,  w: 118, h: 122, z: 4, d: 7 },
  { kind: "photo",    slot: 4, x: 262, y: 244, r: -5,  w: 124, h: 146, z: 4, d: 3 },
  { kind: "sticky",   slot: 5, x: 80,  y: 140, r: -8,  w: 120, h: 108, z: 6, d: 1 },
  { kind: "tally",    slot: 6, x: 382, y: 196, r: -12, w: 134, h: 88,  z: 2, d: 5 },
  { kind: "voice",    slot: 7, x: 418, y: 30,  r: 5,   w: 170, h: 46,  z: 7, d: 6 },
  { kind: "form",     slot: 8, x: 140, y: 338, r: 6,   w: 142, h: 112, z: 3, d: 8 },
];

/* Сім'я (індекси AVATAR_LOOKS): на фото в безладі і в плитці «Сім'ї». */
const FAMILY = [3, 7, 2];

/* Міні-графік «Аналітики»: явка за шість неділь, що росте. */
const BARS = [10, 15, 13, 19, 18, 26];

/* QR-код анкети: три кутові мітки й кілька модулів між ними, 21×21. */
const QR: [number, number, number, number][] = [
  [0, 0, 7, 1], [0, 6, 7, 1], [0, 0, 1, 7], [6, 0, 1, 7], [2, 2, 3, 3],
  [14, 0, 7, 1], [14, 6, 7, 1], [14, 0, 1, 7], [20, 0, 1, 7], [16, 2, 3, 3],
  [0, 14, 7, 1], [0, 20, 7, 1], [0, 14, 1, 7], [6, 14, 1, 7], [2, 16, 3, 3],
  [8, 0, 2, 2], [11, 1, 2, 3], [8, 4, 1, 3], [10, 6, 2, 2], [9, 9, 3, 2],
  [0, 8, 2, 2], [3, 9, 3, 1], [4, 11, 2, 2], [13, 8, 2, 3], [16, 9, 3, 2],
  [19, 8, 2, 4], [8, 12, 2, 3], [11, 13, 3, 2], [15, 14, 2, 2], [18, 13, 2, 3],
  [8, 17, 3, 2], [12, 16, 2, 4], [15, 18, 3, 2], [19, 17, 2, 2], [9, 20, 2, 1],
];

/* Хто з'являється в шапці на кроці «Навчання». */
const TEAM = [0, 1, 4, 5];

/* Висоти стовпчиків голосового — сталі, щоб сервер і браузер малювали одне. */
const WAVE = [5, 9, 14, 8, 12, 18, 11, 6, 15, 20, 13, 7, 10, 16, 9, 5, 12, 8, 14, 6];

/* Ширини «записів» у таблиці: рядок за рядком, чотири колонки. */
const CELLS = [
  [70, 55, 80, 40], [60, 75, 0, 55], [85, 45, 60, 70],
  [50, 0, 75, 45], [75, 60, 50, 0],
];

type SceneCopy = ReturnType<typeof useT>["brief"]["scene"];

/* Картинка плитки без числа — у кожного модуля своя, і кожна закриває
   свій клаптик безладу. Абстрактні кільце, смужка, тиждень і квадратики
   стояли тут до них і «тупо виглядали» (2026-09-25): шматочок справжнього
   інтерфейсу читається одразу, фігура — ні. */
function TileVisual({ id, c }: { id: string; c: SceneCopy }) {
  const n = c.notes;
  switch (id) {
    /* «Хто в неділю на дитячому??» → усі на місці. */
    case "ministries":
      return (
        <span className={`${s.pop} ${s.pill} ${s.pillOk}`}>
          <Check className="w-3 h-3 shrink-0" strokeWidth={3} />
          {n.ministries}
        </span>
      );
    /* Зошит «Група, вівторок» → зустріч у розкладі. */
    case "groups":
      return (
        <span className={`${s.pop} ${s.pill} ${s.pillAccent}`}>
          <Clock className="w-3 h-3 shrink-0" strokeWidth={2.6} />
          {n.groups}
        </span>
      );
    /* «Табір??» у календарі → табір, і відомо коли. */
    case "events":
      return (
        <span className={`${s.pop} flex items-center gap-2 min-w-0`}>
          <span className={s.leaf}>
            <b>{n.month}</b>
            <span>{n.day}</span>
          </span>
          <span className="truncate text-[13px] font-semibold text-ink">{n.event}</span>
        </span>
      );
    case "family":
      return (
        <span className={s.people} aria-hidden>
          {FAMILY.map((look, i) => (
            <span key={look} className={s.person} style={{ "--j": i } as CSSProperties}>
              <PersonAvatar look={AVATAR_LOOKS[look]} size={26} />
            </span>
          ))}
        </span>
      );
    /* «Анкета гостя (копія 3)» → одна анкета за QR-кодом. */
    case "forms":
      return (
        <span className={`${s.pop} flex items-center gap-2 min-w-0`}>
          <svg viewBox="0 0 21 21" className={s.qr} aria-hidden>
            {QR.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
          </svg>
          <span className="truncate text-[11.5px] font-medium text-ink-2">{n.form}</span>
        </span>
      );
    /* Голосове на 47 секунд → коротке повідомлення, яке дійшло. */
    case "campaigns":
      return (
        <span className={`${s.pop} ${s.bubble}`}>
          {n.sent}
          <CheckCheck className="w-[13px] h-[13px] shrink-0 text-[#3b82f6]" strokeWidth={2.6} />
        </span>
      );
    case "analytics":
      return (
        <span className={s.bars} aria-hidden>
          {BARS.map((h, i) => (
            <i key={i} style={{ height: h, "--j": i } as CSSProperties} />
          ))}
        </span>
      );
    default:
      return null;
  }
}

function Mess({ kind, c }: { kind: Kind; c: SceneCopy }) {
  switch (kind) {
    case "xlsx":
      return (
        <div className={`${s.paper} ${s.xlsx}`}>
          <div className={s.xlsxBar}>
            <FileSpreadsheet className="w-[11px] h-[11px] shrink-0" strokeWidth={2.4} />
            <span className="truncate">{c.file}</span>
          </div>
          <div className={s.xlsxGrid}>
            {CELLS.flatMap((row, ri) =>
              row.map((w, ci) => {
                /* Одна клітинка з питаннями й одна підсвічена жовтим —
                   сліди того, що таблицю вели троє людей. */
                const odd = ri === 1 && ci === 2;
                const marked = ri === 3 && ci === 1;
                return (
                  <span key={`${ri}-${ci}`} className={odd ? s.cellOdd : marked ? s.cellMarked : s.cell}>
                    {odd ? "???" : w > 0 && <i style={{ width: `${w}%` }} />}
                  </span>
                );
              }),
            )}
          </div>
        </div>
      );

    case "chat":
      return (
        <div className={s.chat}>
          <PersonAvatar look={AVATAR_LOOKS[3]} size={28} />
          <div className={s.chatBubble}>
            <span className={s.chatFrom}>{c.chatFrom}</span>
            <span className={s.chatText}>{c.chat}</span>
          </div>
          <span className={s.badge}>47</span>
        </div>
      );

    case "notebook":
      return (
        <div className={`${s.paper} ${s.notebook}`}>
          <span className={s.pen}>{c.notebook}</span>
          {["✓", "✓", "✗", "?", "✓"].map((m, i) => (
            <span key={i} className={s.noteRow}>
              <svg viewBox="0 0 60 8" className={s.scribble} style={{ width: 38 + ((i * 13) % 22) }} aria-hidden>
                <path d="M1 5 C6 1 9 7 14 4 S22 1 27 5 S36 7 41 3 S52 2 59 5" />
              </svg>
              <b className={m === "✗" ? s.markBad : m === "?" ? s.markUnsure : undefined}>{m}</b>
            </span>
          ))}
        </div>
      );

    case "calendar":
      return (
        <div className={`${s.paper} ${s.calendar}`}>
          <div className={s.calTop}>{c.month}</div>
          <div className={s.calGrid}>
            {Array.from({ length: 21 }, (_, i) => (
              <span key={i} className={i === 11 ? s.dayCircled : i === 5 ? s.dayCrossed : undefined}>{i + 6}</span>
            ))}
          </div>
          <span className={s.calNote}>{c.monthNote}</span>
        </div>
      );

    case "photo":
      return (
        <div className={s.photo}>
          <div className={s.photoPic}>
            {FAMILY.map((look, i) => (
              <span key={look} className={s.photoPerson}>
                <PersonAvatar look={AVATAR_LOOKS[look]} size={i === 2 ? 30 : 40} />
              </span>
            ))}
          </div>
          <span className={s.photoCaption}>{c.photo}</span>
        </div>
      );

    case "sticky":
      return (
        <div className={s.sticky}>
          <span className={s.tape} aria-hidden />
          {c.sticky}
        </div>
      );

    case "form":
      return (
        <div className={`${s.paper} ${s.form}`}>
          <span className={s.formTitle}>{c.form}</span>
          {c.formFields.map((f, i) => (
            <span key={f} className={s.formField}>
              <span>{f}</span>
              <span className={s.formLine}>
                {i === 0 && (
                  <svg viewBox="0 0 60 8" className={s.scribble} style={{ width: 44 }} aria-hidden>
                    <path d="M1 5 C6 1 9 7 14 4 S22 1 27 5 S36 7 41 3 S52 2 59 5" />
                  </svg>
                )}
              </span>
            </span>
          ))}
        </div>
      );

    case "tally":
      return (
        <div className={`${s.paper} ${s.tally}`}>
          <span className={s.pen}>{c.tally}</span>
          <svg viewBox="0 0 120 26" className={s.tallyMarks} aria-hidden>
            {[0, 38, 76].map((ox, gi) => (
              <g key={gi} transform={`translate(${ox} 0)`}>
                {[4, 10, 16, 22].map((x) => <line key={x} x1={x} y1="3" x2={x + 1} y2="23" />)}
                {gi < 2 && <line x1="0" y1="19" x2="27" y2="6" />}
              </g>
            ))}
          </svg>
          <span className={s.tallyNote}>{c.tallyNote}</span>
        </div>
      );

    case "voice":
      return (
        <div className={s.voice}>
          <span className={s.voicePlay}><Play className="w-[11px] h-[11px] fill-current" strokeWidth={0} /></span>
          <span className={s.wave} aria-hidden>
            {WAVE.map((h, i) => <i key={i} style={{ height: h, animationDelay: `${-i * 90}ms` }} />)}
          </span>
          <span className={s.voiceTime}>0:47</span>
        </div>
      );
  }
}

export default function ChurchBriefScene({ phase }: { phase: ScenePhase }) {
  const t = useT();
  const c = t.brief.scene;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);

  /* Полотно тримає свої пропорції: на телефоні воно менше, на широкій
     колонці трохи більше, але клаптики лежать там само. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setK(Math.min(1.1, entry.contentRect.width / W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [first, ...rest] = t.common.brand.split(" ");

  return (
    <div ref={wrapRef} className="w-full flex justify-center" style={{ height: H * k }}>
      <div
        role="img"
        aria-label={c.label}
        data-phase={phase}
        className={s.stage}
        style={{ width: W, height: H, transform: `scale(${k})` }}
      >
        {/* Вікно, у яке все складається. У безладі його ще немає. */}
        <div className={s.frame}>
          <div className={s.frameHead}>
            <span className="font-brand font-extrabold text-[15px] tracking-[-0.3px] text-ink">
              <span className="text-brand">{first}</span> {rest.join(" ")}
            </span>
            <span className={s.team}>
              <span className={s.teamFaces}>
                {TEAM.map((look, i) => (
                  <span key={look} className={s.face} style={{ "--a": i } as CSSProperties}>
                    <PersonAvatar look={AVATAR_LOOKS[look]} size={24} />
                  </span>
                ))}
              </span>
              <span className={s.teamLabel}>
                <i className={s.liveDot} />
                {c.team}
              </span>
            </span>
          </div>
          {TILE_MODULES.map((id, i) => (
            <span
              key={id}
              aria-hidden
              className={s.slot}
              style={{ left: SLOT_X[i % 3] - FRAME_X, top: SLOT_Y[Math.floor(i / 3)] - FRAME_Y }}
            />
          ))}
        </div>

        {PIECES.map((p) => {
          const id = TILE_MODULES[p.slot];
          const Icon = MODULE_ICONS[id];
          const accent = MODULE_ACCENTS[id];
          const tile = c.tiles[p.slot];
          const style = {
            "--ox": `${SLOT_X[p.slot % 3]}px`,
            "--oy": `${SLOT_Y[Math.floor(p.slot / 3)]}px`,
            "--mx": `${p.x - TILE_W / 2}px`,
            "--my": `${p.y - TILE_H / 2}px`,
            "--mr": `${p.r}deg`,
            "--w": `${p.w}px`,
            "--h": `${p.h}px`,
            "--z": p.z,
            "--d": p.d,
            "--accent": accent,
          } as CSSProperties;
          return (
            <div key={p.kind} className={s.item} style={style}>
              <div className={s.mess}>
                <div className={s.jitter}>
                  <Mess kind={p.kind} c={c} />
                </div>
              </div>
              <div className={s.tile}>
                <span className="flex items-center gap-[7px] min-w-0">
                  <span className={s.tileIcon}>
                    <Icon className="w-[14px] h-[14px]" strokeWidth={2.2} />
                  </span>
                  <span className="truncate text-[14px] font-semibold text-ink tracking-[-0.2px]">{tile.label}</span>
                </span>
                {tile.value ? (
                  <span className="text-[26px] font-semibold text-ink tracking-[-0.9px] leading-[26px] tabular-nums">{tile.value}</span>
                ) : (
                  <TileVisual id={id} c={c} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
