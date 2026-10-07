"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, ChevronRight, LayoutGrid, Quote } from "lucide-react";
import AmbassadorCard from "@/components/shared/ambassador-card";
import ChurchScene from "@/components/shared/church-scene";
import FadeIn from "@/components/shared/fade-in";
import { MODULE_ACCENTS, MODULE_ICONS } from "@/components/shared/module-icons";
import { getAmbassador } from "@/content/ambassadors";
import { getModuleVideo, getModuleVideoPoster } from "@/content/modules/videos";
import ClipPlayer from "@/components/shared/clip-player";
import type { AmbassadorCopy, AmbassadorDetail } from "@/content/ambassadors";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Сторінка церкви-амбасадора — чотири екрани:

     хто це            — заголовок і сцена церкви: петля з їхнього
                         промо, кнопка фільму, візитівка (church-scene);
     цитата            — рядок із їхнього сайту над фотографією;
     було і стало      — чотири пари й запис із їхньої системи;
     як вмикали        — чотири кроки, кожен називає свої модулі.

   Каталог модулів окремим блоком прибрано: він повторював /modules.
   Уся копія — у src/content/ambassadors.ts, тут лише розкрій.
   ──────────────────────────────────────────────────────────────── */

interface Ctx {
  church: AmbassadorDetail;
  copy: AmbassadorCopy;
  accent: string;
}

/* ── Хто це ─────────────────────────────────────────────────────── */
/* Та сама сцена, що й «Наш амбасадор» на головній (2026-09-30, «тут так
   само перероби: більше лого, менше води, акуратніше»): позаду петля з їхнього
   промо, посередині кнопка фільму, внизу візитівка з великим знаком.
   Над сценою лише крихти й заголовок. Надпис «Амбасадор», плашка строку,
   речення про церкву і фото з цитатою прибрані: строк і місто стоять у
   візитівці, а решту розповідає фільм. Єдина дія — сайт самої церкви:
   «Замовити демо» чекає в закривашці й у меню. */
function Hero({ ctx, parentLabel }: { ctx: Ctx; parentLabel: string }) {
  const { church, copy, accent } = ctx;

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-8 md:pt-12 pb-14 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[320px] left-[20%] w-[900px] h-[620px] rounded-full opacity-70"
          style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 20%, transparent), transparent 100%)` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-6 md:gap-10">
        <FadeIn className="flex flex-col gap-5 md:gap-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
            <Link href="/about" className="hover:text-ink transition-colors">{parentLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-2 font-medium">{church.name}</span>
          </nav>
          <h1 className="font-semibold text-ink leading-[1.04] tracking-[-1.2px] md:tracking-[-2px] text-[36px] sm:text-[46px] md:text-[58px] max-w-[900px]">
            {copy.titleAccent && copy.title.endsWith(copy.titleAccent) ? (
              <>
                {copy.title.slice(0, -copy.titleAccent.length).trim()}
                <span className="block whitespace-nowrap" style={{ color: accent }}>
                  {copy.titleAccent}
                </span>
              </>
            ) : (
              copy.title
            )}
          </h1>
        </FadeIn>

        <FadeIn delay={1} variant="scale">
          <ChurchScene
            church={church}
            source="ambassador"
            actions={
              <Link
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                style={{ background: accent }}
              >
                {copy.siteCta}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
          />
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Записи з системи церкви ────────────────────────────────────── */
/* Один запис — один рядок: кадр з одного боку, назва модуля й що він
   робить — з іншого. Боки чергуються, щоб вісім записів не читались
   як стос однакових плиток. Нічого не вантажиться, доки не натиснули. */
function Clip({
  id,
  accent,
  name,
  speaker,
  quote,
  flip,
}: {
  id: string;
  accent: string;
  name: string;
  speaker?: { name: string; role: string };
  quote?: string;
  flip?: boolean;
}) {
  const c = useT().ambassadorPage;

  const Icon = MODULE_ICONS[id] ?? LayoutGrid;
  const tone = MODULE_ACCENTS[id] ?? accent;
  const videoId = getModuleVideo(id);
  const poster = getModuleVideoPoster(id);
  if (!videoId || !poster) return null;

  return (
    <figure className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6 md:gap-12 items-center py-9 md:py-14 border-b border-hairline">
      <ClipPlayer
        videoId={videoId}
        poster={poster}
        title={name}
        label={`${c.clipPlay}: ${name}`}
        accent={accent}
        size="md"
        className={cn("rounded-[20px] md:rounded-[26px] border border-hairline", flip && "md:order-2")}
      />

      <figcaption className={cn("flex flex-col gap-3", flip && "md:order-1")}>
        {/* Великим — назва модуля; хто говорить, стоїть акуратним рядком
            під нею. Ім'я заголовком робило з блоку візитівку, а не відгук
            про модуль. */}
        <span
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ background: `color-mix(in oklab, ${tone} 13%, var(--surface))`, color: tone }}
        >
          <Icon className="w-[19px] h-[19px]" strokeWidth={2} />
        </span>

        <h3 className="font-semibold text-ink text-[28px] md:text-[40px] leading-[1.1] tracking-[-1px]">{name}</h3>

        {/* Слова людини — в оболонці цитати: тихий колір модуля, лапка
            згори, підпис курсивом. Голий абзац серед іншого тексту
            не читався як чиясь пряма мова. */}
        {quote ? (
          <figure
            className="flex flex-col gap-3 rounded-[18px] px-5 py-4 md:px-6 md:py-5"
            style={{ background: `color-mix(in oklab, ${tone} 7%, var(--surface))` }}
          >
            <Quote className="w-5 h-5 shrink-0 fill-current" style={{ color: tone }} strokeWidth={0} />
            <blockquote className="text-[17px] md:text-[19px] text-ink leading-[1.5] tracking-[-0.3px]">
              {quote}
            </blockquote>
            {speaker && (
              <figcaption className="text-[13.5px] italic text-ink-3 leading-[1.35]">
                {speaker.name} · {speaker.role}
              </figcaption>
            )}
          </figure>
        ) : (
          speaker && (
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[15px] font-medium text-ink leading-[1.35]">{speaker.name}</span>
              <span className="text-[13.5px] italic text-ink-3 leading-[1.35]">{speaker.role}</span>
            </span>
          )
        )}

        <Link
          href={`/modules/${id}`}
          className="link-underline inline-flex items-center gap-1 self-start text-[14.5px] font-medium text-ink-3 hover:text-ink transition-colors"
        >
          {c.clipOpen}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </figcaption>
    </figure>
  );
}

function Clips({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  const t = useT();

  /* Назви модулів беруться зі словника — на сторінці немає жодного
     рядка, який би розходився з каталогом. */
  const names = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of t.modules.groups) for (const item of group.items) map.set(item.id, item.name);
    return map;
  }, [t]);

  const clips = copy.clips.filter((c) => getModuleVideo(c.id));
  if (!clips.length) return null;

  return (
    <section id="clips" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <FadeIn className="flex flex-col gap-4 max-w-[760px]">
          <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
            {copy.clipsTitle}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.5]">{copy.clipsText}</p>
        </FadeIn>

        <div className="flex flex-col border-t border-hairline">
          {clips.map((clip, i) => (
            <FadeIn key={clip.id}>
              <Clip
                id={clip.id}
                accent={accent}
                name={names.get(clip.id) ?? clip.id}
                speaker={clip.speaker}
                quote={clip.quote}
                flip={i % 2 === 1}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Стрічка кадрів ─────────────────────────────────────────────── */
/* Фото їдуть самі зліва направо і зупиняються, щойно на них навели.
   Список подвоєний — інакше в кінці був би розрив. */
function Gallery({ ctx }: { ctx: Ctx }) {
  const { copy, church } = ctx;
  if (!copy.gallery.length) return null;
  const row = [...copy.gallery, ...copy.gallery];

  return (
    <section className="w-full flex flex-col items-center py-10 md:py-14">
      <div className="marquee">
        <div className="marquee-track photo-track">
          {row.map((photo, i) => (
            <figure
              key={`${photo.src}-${i}`}
              className="relative w-[240px] md:w-[340px] aspect-[4/3] shrink-0 overflow-hidden rounded-[18px] border border-hairline"
            >
              <Image
                src={photo.src}
                /* Друга половина стрічки — та сама, тож для читача вона мовчить. */
                alt={i < copy.gallery.length ? photo.alt : ""}
                fill
                sizes="340px"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>

      {/* Один тихий кредит на всю сторінку: знімки — церкви. */}
      <div className="w-full max-w-[1120px] px-5 md:px-8 mt-3">
        <span className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-3">
          <span>{copy.photoCredit}</span>
          <span aria-hidden>·</span>
          <Link
            href={church.website}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1 text-ink-2 hover:text-ink transition-colors"
          >
            {copy.photoCreditCta}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </span>
      </div>
    </section>
  );
}

/* ── Відгуки ────────────────────────────────────────────────────── */
/* Друкуємо тільки те, що церква справді сказала: немає тексту — немає
   блоку. Свої слова за неї ми не пишемо. */
function Reviews({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  const list = (copy.reviews ?? []).filter((r) => r.text);
  if (!list.length) return null;

  return (
    <section id="reviews" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <FadeIn>
          <h2 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
            {copy.reviewsTitle}
          </h2>
        </FadeIn>

        <div className="flex flex-col">
          {list.map((r, i) => (
            <FadeIn key={r.text} delay={i}>
              <figure className="flex flex-col gap-4 py-7 md:py-9 border-b border-hairline first:border-t first:border-hairline">
                <blockquote className="font-medium text-ink text-[20px] md:text-[26px] leading-[1.35] tracking-[-0.5px] max-w-[860px]">
                  «{r.text}»
                </blockquote>
                <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[15px] font-semibold text-ink leading-none">{r.author}</span>
                  <span className="text-[13.5px] text-ink-3 leading-none">{r.role}</span>
                  {r.source && (
                    <>
                      <span aria-hidden className="text-ink-3">·</span>
                      <span className="text-[13.5px] leading-none" style={{ color: accent }}>
                        {r.source}
                      </span>
                    </>
                  )}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Про церкву ─────────────────────────────────────────────────── */
/* Та сама картка, що й у блоці «Наш амбасадор» на /about. */
function About({ ctx }: { ctx: Ctx }) {
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <AmbassadorCard id={ctx.church.id} />
        </FadeIn>
      </div>
    </section>
  );
}

/* «Було і стало» знято зі сторінки 2026-09-21 («повністю прибери»):
   після восьми записів із системи список був переказом того самого.
   Копія цілим шматком лишається в src/content/ambassadors.ts — якщо
   блок повернеться, писати його заново не доведеться. */

export default function AmbassadorPage({ id }: { id: string }) {
  const { lang } = useLang();
  const t = useT();
  const church = getAmbassador(id);
  if (!church) return null;

  const copy = church.copy[lang];
  const ctx: Ctx = { church, copy, accent: church.accent };

  return (
    <>
      <Hero ctx={ctx} parentLabel={t.nav.about} />
      <Gallery ctx={ctx} />
      <Clips ctx={ctx} />
      <Reviews ctx={ctx} />
      <About ctx={ctx} />
    </>
  );
}
