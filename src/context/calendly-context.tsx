"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { calendlyEmbedUrl, themeColorsFromCss, type CalendlySource } from "@/lib/calendly";
import { SITE_CALENDLY } from "@/lib/seo";

/* Вікно календаря одне на весь сайт (живе в layout), а відкривають його
   з різних місць: тихий лінк у закривашці, кнопка після заявки в модалці
   демо, рядок у футері. Той самий устрій, що й у модалки демо.

   Адресу iframe збираємо тут, у момент кліку: кольори — від теми, що
   стоїть зараз, ім'я — із заявки. Тому перемикання теми при відкритому
   вікні календар не перезавантажує, а вікно лишається простим —
   показує те, що йому дали. */

export interface CalendlyOpenOptions {
  source: CalendlySource;
  /** Ім'я, яке людина вже вписала в заявку, — підставляємо в календар. */
  name?: string;
}

interface CalendlyContextType {
  isOpen: boolean;
  source: CalendlySource;
  /** Адреса iframe; порожня — календар не змонтовано. */
  src: string;
  open: (opts: CalendlyOpenOptions) => void;
  close: () => void;
}

const CalendlyContext = createContext<CalendlyContextType>({
  isOpen: false,
  source: "cta",
  src: "",
  open: () => {},
  close: () => {},
});

/** Стільки триває анімація закриття вікна — iframe знімаємо після неї. */
const CLOSE_MS = 220;

export function CalendlyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<CalendlySource>("cta");
  const [src, setSrc] = useState("");
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback((opts: CalendlyOpenOptions) => {
    if (!SITE_CALENDLY) return;
    clearTimeout(clearTimer.current);
    setSource(opts.source);
    setSrc(
      calendlyEmbedUrl(SITE_CALENDLY, {
        source: opts.source,
        name: opts.name,
        colors: themeColorsFromCss(),
        embedDomain: location.hostname,
      })
    );
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    /* Календар зникає разом із вікном, а не посеред його згасання. */
    clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setSrc(""), CLOSE_MS);
  }, []);

  const value = useMemo(() => ({ isOpen, source, src, open, close }), [isOpen, source, src, open, close]);

  return <CalendlyContext.Provider value={value}>{children}</CalendlyContext.Provider>;
}

export function useCalendly() {
  return useContext(CalendlyContext);
}
