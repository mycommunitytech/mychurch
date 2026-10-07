"use client";

import { CSSProperties, RefObject, useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";
import { prefersReducedMotion } from "@/components/shared/fade-in";

/* Наскільки курсор наздоганяє ціль за кадр: менше — тягучіше. */
const EASE = 0.19;
/* Скільки стоїть на картці, перш ніж іти до наступної. */
const HOLD = 1100;

type XY = { x: number; y: number };

/* Величезний курсор саме в цій зоні.

   Заходить жива рука — системний курсор ховається (`cursor: none` на зоні),
   а великий їде за мишею з плавним наздоганянням, кадр за кадром. Руки немає —
   той самий курсор один раз обходить усе, що позначене `data-click-here`,
   підсвічує картку й натискає на ній, тож видно, куди клацати, — і лишається
   на останній. Обхід повторюється, лише коли зона знову з'являється на екрані.

   Кліків не перехоплює (pointer-events: none) — рука проходить крізь нього до
   самої кнопки. На тачскрині системного курсора немає, тож там лишається
   тільки обхід. */
export default function ClickHere({
  host,
  show = true,
  size,
}: {
  /** Зона з цілями. Мусить бути `relative`. */
  host: RefObject<HTMLElement | null>;
  show?: boolean;
  /** Діаметр кола, px. Менший — для тісних рядів чипів. */
  size?: number;
}) {
  const dotRef = useRef<HTMLSpanElement>(null);
  /* Де курсор намальований і куди їде — у ref, бо це рахується щокадру. */
  const pos = useRef<XY | null>(null);
  const aim = useRef<XY>({ x: 0, y: 0 });
  const [follow, setFollow] = useState(false);
  const [press, setPress] = useState(false);
  const [live, setLive] = useState(false);
  /* Зона змінила ширину — картки поїхали, обхід треба перерахувати. */
  const [nonce, setNonce] = useState(0);
  /* Сам стежить, чи зона на екрані: інакше rAF крутився б для всієї сторінки. */
  const [inView, setInView] = useState(false);
  /* `show` вимикає лише обхід цілей. Поки жива рука в зоні, великий курсор
     лишається її курсором — інакше він зникав би просто під час кліку, а
     системний вистрибував би назад. */
  const walk = show && inView;
  const on = inView && (follow || show);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [host]);

  /* Один рушій руху на обидва режими: і за мишею, і в обхід. */
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let id = requestAnimationFrame(function tick() {
      const el = dotRef.current;
      const p = pos.current;
      if (el && p) {
        p.x += (aim.current.x - p.x) * EASE;
        p.y += (aim.current.y - p.y) * EASE;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [inView]);

  /* Жива рука в зоні.

     Стежимо на рівні документа й самі рахуємо, чи точка всередині зони:
     pointerleave губиться, коли під час кліку розкладка поїде (підказка
     згорнулась — ряд стрибнув угору), і курсор застигав би «за межами». */
  useEffect(() => {
    const el = host.current;
    if (!el || !inView || prefersReducedMotion()) return;

    const ro = new ResizeObserver(() => setNonce((n) => n + 1));
    ro.observe(el);

    /* Ховати системний курсор можна лише там, де він узагалі є. */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => ro.disconnect();
    }

    let off: number | undefined;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const b = el.getBoundingClientRect();
      const inside = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
      if (inside) {
        aim.current = { x: e.clientX - b.left, y: e.clientY - b.top };
        pos.current ??= { ...aim.current };
        setLive(true);
      }
      setFollow(inside);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setPress(true);
      window.clearTimeout(off);
      off = window.setTimeout(() => setPress(false), 220);
    };
    document.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", down);

    return () => {
      ro.disconnect();
      window.clearTimeout(off);
      document.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
    };
  }, [host, inView]);

  /* Системний курсор ховаємо рівно тоді, коли його замінює великий: інакше
     в зоні можна лишитись узагалі без курсора. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (follow && on) el.dataset.bigCursor = "1";
    else delete el.dataset.bigCursor;
    return () => {
      delete el.dataset.bigCursor;
    };
  }, [host, follow, on]);

  /* Руки немає — курсор обходить картки сам. */
  useEffect(() => {
    const el = host.current;
    if (!el || !walk || follow || prefersReducedMotion()) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-click-here]"));
    if (!targets.length) return;

    let cancelled = false;
    const timers: number[] = [];
    const sleep = (ms: number) => new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));
    /* Коло сідає на нижній правий кут картки — не затуляючи обличчя й ім'я. */
    const aimAt = (t: HTMLElement): XY => {
      const b = el.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      return { x: r.right - b.left - 14, y: r.bottom - b.top - 14 };
    };

    (async () => {
      if (!pos.current) {
        /* Перша поява — курсор влітає знизу, а не спалахує на картці. */
        const b = el.getBoundingClientRect();
        pos.current = { x: b.width * 0.86, y: b.height + 60 };
        aim.current = { ...pos.current };
      }
      setLive(true);
      await sleep(420);

      /* Один прохід, а не карусель: курсор показує кожну картку по разу
         й лишається на останній. Нескінченне коло крутилось на екрані
         саме собою і перетягувало увагу на себе (2026-09-22). */
      for (const target of targets) {
        if (cancelled) return;
        aim.current = aimAt(target);
        await sleep(620);
        if (cancelled) return;

        target.setAttribute("data-demo-hot", "");
        setPress(true);
        await sleep(220);
        if (cancelled) return;
        setPress(false);
        await sleep(HOLD);
        target.removeAttribute("data-demo-hot");
        if (cancelled) return;
        await sleep(180);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
      setPress(false);
      targets.forEach((t) => t.removeAttribute("data-demo-hot"));
    };
  }, [host, walk, follow, nonce]);

  return (
    <span ref={dotRef} aria-hidden data-on={on && live ? "1" : "0"} className="click-here"
      style={size ? ({ "--ch": `${size}px` } as CSSProperties) : undefined}
    >
      <span className="click-here-in" data-press={press ? "1" : "0"}>
        <span className="click-here-halo" />
        <span className="click-here-dot">
          {/* Іконка курсора з того самого набору, що й решта іконок сайту. */}
          <MousePointer2 className="click-here-arrow" strokeWidth={2.1} strokeLinejoin="round" />
        </span>
      </span>
    </span>
  );
}
