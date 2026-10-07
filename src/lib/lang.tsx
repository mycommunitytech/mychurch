"use client";

import { useSyncExternalStore } from "react";
import { i18n, isLangReady, loadEn, type Lang } from "@/lib/i18n";
import { LANG_KEY } from "@/lib/prefs";

/* Same approach as the theme: <html data-lang> is the source of truth, set by a
   blocking script before first paint. */

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

/* Англійські рядки приходять окремим файлом (див. loadEn). Поки вони в
   дорозі, React далі малює українською — а тоді перемикається одним кадром. */
function getSnapshot(): Lang {
  const lang = document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ua";
  return isLangReady(lang) ? lang : "ua";
}

/* Хто повернувся з обраною англійською: скрипт у <head> уже поставив
   data-lang="en", лишається довезти рядки. */
if (typeof document !== "undefined" && document.documentElement.getAttribute("data-lang") === "en") {
  void loadEn().then(emit);
}

function getServerSnapshot(): Lang {
  return "ua";
}

export async function applyLang(lang: Lang) {
  if (lang === "en") await loadEn();
  const el = document.documentElement;
  el.setAttribute("data-lang", lang);
  el.setAttribute("lang", lang === "en" ? "en" : "uk");
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode — the choice just won't persist */
  }
  emit();
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { lang, setLang: applyLang };
}

/** Strings for the active language. */
export function useT() {
  const { lang } = useLang();
  return i18n[lang];
}
