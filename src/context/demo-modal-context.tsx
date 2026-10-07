"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

/* Хто пише, якщо не церква: /cooperation кличе клуби, рухи, організації
   й навчальні заклади. Поле «Назва церкви» підписується під них, а з
   якого блоку прийшла людина, їде в лід — менеджер бачить це в картці. */
export interface DemoAudience {
  /** Підпис поля назви замість «Назва церкви». */
  orgPlaceholder?: string;
  /** Рядок, що їде в лід як «Побажання». */
  note?: string;
}

interface DemoModalContextType {
  isOpen: boolean;
  /** Цілі, позначені там, звідки модалку відкрили, — їдуть у лід. */
  goals: string[];
  context: DemoAudience | null;
  open: () => void;
  /** Те саме, але з уже позначеними цілями. */
  openWith: (goals: string[]) => void;
  /** Те саме, але для адресата, який не є церквою. */
  openFor: (context: DemoAudience) => void;
  close: () => void;
}

const DemoModalContext = createContext<DemoModalContextType>({
  isOpen: false,
  goals: [],
  context: null,
  open: () => {},
  openWith: () => {},
  openFor: () => {},
  close: () => {},
});

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [context, setContext] = useState<DemoAudience | null>(null);

  const openWith = useCallback((next: string[]) => {
    setGoals(Array.isArray(next) ? next : []);
    setContext(null);
    setIsOpen(true);
  }, []);
  const open = useCallback(() => openWith([]), [openWith]);
  const openFor = useCallback((next: DemoAudience) => {
    setGoals([]);
    setContext(next);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, goals, context, open, openWith, openFor, close }),
    [isOpen, goals, context, open, openWith, openFor, close]
  );

  return <DemoModalContext.Provider value={value}>{children}</DemoModalContext.Provider>;
}

export function useDemoModal() {
  return useContext(DemoModalContext);
}
