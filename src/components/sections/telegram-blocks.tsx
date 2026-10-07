"use client";

import { useState } from "react";
import FadeIn from "@/components/shared/fade-in";
import { TgHeader, TgInline, TgMessage } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Три блоки під героєм /telegram — один розкрій на всі: велика назва,
   одне речення й одне вікно бота. Боки чергуються шахівницею: у героя
   телефон праворуч, тож перше вікно — ліворуч. Кожне вікно відповідає
   на дотик тим самим рядком, що й бот. */

export default function TelegramBlocks() {
  return (
    <>
      <JoinBlock />
      <AttendanceBlock />
      <ServingBlock />
    </>
  );
}

function Block({
  title,
  text,
  screenLeft,
  className,
  children,
}: {
  title: string;
  text: string;
  screenLeft?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("w-full flex flex-col items-center py-20 md:py-28", className)}>
      {/* Вікно — фіксовані 420 px, решта ширини йде назві, щоб вона не ламалась. */}
      <div
        className={cn(
          "w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 gap-10 lg:gap-24 items-center",
          screenLeft ? "lg:grid-cols-[420px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_420px]"
        )}
      >
        <FadeIn className={cn("flex flex-col gap-5", screenLeft && "lg:order-2")}>
          <h2 className="font-semibold text-ink leading-[1.04] tracking-[-1.4px] md:tracking-[-2.4px] text-[40px] md:text-[56px] lg:text-[64px]">
            {title}
          </h2>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.5] max-w-[440px]">{text}</p>
        </FadeIn>
        <FadeIn variant="scale" delay={1} className={cn("min-w-0 flex justify-center", screenLeft && "lg:order-1")}>
          {children}
        </FadeIn>
      </div>
    </section>
  );
}

/** Вікно чату з ботом: шапка й шпалери, як у героя. */
function Window({ children, onBack, backLabel }: { children: React.ReactNode; onBack?: () => void; backLabel?: string }) {
  const { lang } = useLang();
  const phone = TELEGRAM_COPY[lang].hero.phone;
  return (
    <div className="w-full max-w-[420px] rounded-[24px] border border-hairline bg-surface overflow-hidden shadow-[0_30px_60px_-45px_rgba(0,50,120,0.5)]">
      <TgHeader title={phone.bot} sub={phone.status} onBack={onBack} backLabel={backLabel} />
      <div className="tg-wallpaper p-4 flex flex-col justify-end gap-1.5 min-h-[320px]">{children}</div>
    </div>
  );
}

/* Заявка: після рішення кнопки зникають, а в повідомленні лишається
   рядок бота (submissions.handler.ts). Стрілка в шапці повертає все назад. */
function JoinBlock() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].join;
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);

  const lines = decision ? [...t.lines, { s: "b" as const, t: t[decision] }] : t.lines;

  return (
    <Block title={t.title} text={t.text} screenLeft className="bg-page">
      <Window onBack={decision ? () => setDecision(null) : undefined} backLabel={t.undo}>
        <TgMessage key={decision ?? "open"} lines={lines} className={cn("max-w-none self-stretch", decision && "view-in")} />
        {!decision && (
          <TgInline
            rows={[[{ t: t.accept, tone: "green" }, { t: t.decline, tone: "red" }]]}
            onTap={(label) => setDecision(label === t.accept ? "accepted" : "declined")}
          />
        )}
      </Window>
    </Block>
  );
}

/* Явка: дотик до імені перемикає статус по колу, як у attendance.handler.ts.
   У списку шість імен із тринадцяти — решту вважаємо вже відміченими,
   щоб «Присутніх» збігалось із копією й рухалось від натискань. */
function AttendanceBlock() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].attendance;
  const [marks, setMarks] = useState<string[]>(() => t.people.map((p) => p.icon));

  const shownAtStart = t.people.filter((p) => p.icon === "✅").length;
  const startCount = Number(/(\d+)\//.exec(t.head[1].t)?.[1] ?? shownAtStart);
  const present = startCount - shownAtStart + marks.filter((m) => m === "✅").length;
  const head = t.head.map((line, i) => (i === 1 ? { ...line, t: line.t.replace(/\d+\/(\d+)/, `${present}/$1`) } : line));

  const labels = t.people.map((p, i) => `${marks[i]} ${p.name}`);
  const rows = [];
  for (let i = 0; i < labels.length; i += 2) rows.push(labels.slice(i, i + 2).map((l) => ({ t: l })));

  const onTap = (label: string) => {
    if (label === t.all) return setMarks(t.people.map(() => "✅"));
    const at = labels.indexOf(label);
    if (at < 0) return;
    setMarks((prev) => prev.map((m, i) => (i === at ? t.cycle[(t.cycle.indexOf(m) + 1) % t.cycle.length] : m)));
  };

  return (
    <Block title={t.title} text={t.text} className="bg-surface border-y border-hairline">
      <Window>
        <TgMessage lines={head} className="max-w-none self-stretch" />
        <TgInline rows={[...rows, [{ t: t.all, primary: true }]]} onTap={onTap} />
      </Window>
    </Block>
  );
}

/* Служіння: відповідь стає на місце питання «Будете?» — тим рядком,
   що пише serving-text.util.ts. Кнопки лишаються: відповідь можна змінити. */
function ServingBlock() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].serving;
  const [answer, setAnswer] = useState<string | null>(null);

  const tail = answer ? { s: "b" as const, t: answer === t.yes ? t.yesState : t.noState } : t.lines[t.lines.length - 1];

  return (
    <Block title={t.title} text={t.text} screenLeft className="bg-page">
      <Window>
        <TgMessage lines={[...t.lines.slice(0, -1), tail]} className="max-w-none self-stretch" />
        <TgInline
          rows={[[{ t: t.yes, tone: "green" }, { t: t.no, tone: "red" }]]}
          onTap={setAnswer}
          active={answer}
        />
      </Window>
    </Block>
  );
}
