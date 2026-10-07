"use client";

import { useSyncExternalStore } from "react";

import { THEME_KEY } from "@/lib/prefs";

export type Theme = "light" | "dark";

/* The theme lives on <html> (set by a blocking script in the layout, so there is
   no flash). React only mirrors it — no provider, no state to keep in sync. */

let listeners: (() => void)[] = [];

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

/* Колір смуги браузера на телефоні — має збігатися з обраною темою, а не
   системною, інакше над темною сторінкою висить біла смуга. Тег один, його
   створює стартовий скрипт у layout.tsx. Кольори = --page. */
export const THEME_BAR = { light: "#fcfcfc", dark: "#080a0f" } as const;

function paint(theme: Theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  /* `only light`: інакше Samsung Internet, Chrome з «темним режимом для
     сайтів» і вбудовані браузери Telegram/Instagram на Android самі
     «затемнюють» світлу тему — кольори сіріють, графіки інвертуються. */
  el.style.colorScheme = theme === "dark" ? "dark" : "only light";
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME_BAR[theme]));
  emit();
}

/* Тема міняється миттєво, а плавність дає View Transition: браузер знімає
   кадр старої теми і розчиняє його в новий — одна анімація на весь екран
   замість переходу кольору на кожному з тисяч елементів (див. «ЗМІНА ТЕМИ»
   в globals.css). Без підтримки API чи з reduce-motion — просто перемикаємо. */
export function applyTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the choice just won't persist */
  }
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || calm) {
    paint(theme);
    return;
  }
  document.startViewTransition(() => paint(theme));
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    theme,
    setTheme: applyTheme,
    toggle: () => applyTheme(theme === "dark" ? "light" : "dark"),
  };
}
