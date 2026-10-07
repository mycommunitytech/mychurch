"use client";

import { useEffect, type RefObject } from "react";

/* iframe у списку заради вікна календаря: без нього Tab перескакував би
   з останньої кнопки шапки назад на першу й ніколи не заходив у сам
   календар. Усередині iframe клавіатуру веде вже його документ. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function visibleFocusable(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null && getComputedStyle(el).visibility !== "hidden"
  );
}

/**
 * Keeps the keyboard inside an open dialog and gives it back when the dialog
 * closes. Without this, Tab walks straight out onto the page behind the
 * overlay — the page is still there, just covered (WCAG 2.4.3, 2.1.2).
 *
 * @param ref    the dialog window
 * @param open   whether it is on screen
 * @param first  optional element to focus on open; defaults to the first
 *               focusable one, falling back to the dialog itself
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  first?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const root = ref.current;
    if (!open || !root) return;

    /* Whoever opened the dialog gets the focus back when it closes. */
    const opener = document.activeElement as HTMLElement | null;

    const target = first?.current ?? visibleFocusable(root)[0] ?? root;
    if (target === root) root.tabIndex = -1;
    /* Вікно ще всередині transition (visibility/opacity) — поки воно не
       показалось, .focus() на ньому не спрацює. Тому чекаємо кадр, а якщо
       елемент так і не взяв фокус — повторюємо після завершення переходу. */
    let retry: ReturnType<typeof setTimeout> | undefined;
    const raf = requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
      if (!root.contains(document.activeElement)) {
        /* Тільки якщо фокус так і не зайшов усередину: інакше повтор через
           чверть секунди забирав його з поля, у яке людина вже клацнула. */
        retry = setTimeout(() => {
          if (!root.contains(document.activeElement)) target.focus({ preventScroll: true });
        }, 220);
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = visibleFocusable(root);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const start = items[0];
      const end = items[items.length - 1];
      const active = document.activeElement;
      if (!root.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? end : start).focus();
        return;
      }
      if (e.shiftKey && active === start) {
        e.preventDefault();
        end.focus();
      } else if (!e.shiftKey && active === end) {
        e.preventDefault();
        start.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      if (retry) clearTimeout(retry);
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, open, first]);
}
