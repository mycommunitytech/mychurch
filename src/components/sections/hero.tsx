"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppPreview from "@/components/shared/app-preview";
import GridPulse from "@/components/shared/grid-pulse";
import RotatingWords from "@/components/shared/rotating-words";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { i18n } from "@/lib/i18n";

const WORD_STEP = 95; // ms between words

export default function Hero() {
  const { open } = useDemoModal();
  const t = useT();
  const mockRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const lines = t.hero.h1Lines;

  /* Staged entrance: headline → subtitle → actions + mockup (runs once).
     Timing is derived from the language active at mount, read straight from
     <html data-lang> so this effect can stay dependency-free. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      const skip = setTimeout(() => setStage(3), 0);
      return () => clearTimeout(skip);
    }
    const lang = document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ua";
    const d = (i18n[lang].hero.h1Lines.flat().length + 1) * WORD_STEP + 500;
    const t0 = setTimeout(() => setStage(1), 80);
    const t1 = setTimeout(() => setStage(2), d * 0.5);
    const t2 = setTimeout(() => setStage(3), d * 0.75);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* Scroll-driven 3D: the frame starts tilted back and lies flat as you scroll */
  useEffect(() => {
    const el = mockRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.transform = "none";
      return;
    }

    let raf: number | null = null;
    let ticking = false;
    let target = 1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const centre = rect.top + window.scrollY + el.offsetHeight / 2;
      target = Math.max(1, centre - window.innerHeight / 2);
    };

    const update = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, window.scrollY / target));
      const rotateX = 18 * (1 - p);
      const scale = 0.92 + 0.08 * p;
      el.style.transform = `perspective(1400px) rotateX(${rotateX}deg) scale(${scale})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const softIn = (visible: boolean, shift = 14) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${shift}px)`,
    transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,0.84,0.44,1)",
  });

  return (
    <section
      className={`relative w-full overflow-hidden bg-surface flex flex-col items-center pt-14 md:pt-24 pb-16 md:pb-28 ${
        stage >= 1 ? "hero-lit" : ""
      }`}
    >
      {/* ── Ambient background ─────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[280px] left-1/2 -translate-x-1/2 w-[900px] h-[620px] rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, var(--glow), color-mix(in oklab, var(--glow) 35%, transparent) 55%, transparent 100%)",
          }}
        />
        <div
          className="aurora-b absolute top-[120px] -left-[180px] w-[620px] h-[520px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 80%, transparent), transparent 100%)",
          }}
        />
        <div
          className="aurora-b absolute top-[60px] -right-[200px] w-[640px] h-[540px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 70%, transparent), transparent 100%)",
            animationDelay: "-8s",
          }}
        />
        {/* Grid, faded out towards the edges — and the light that moves in it */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 30%, black 20%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 30%, black 20%, transparent 78%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <GridPulse className="absolute inset-0" />
        </div>
      </div>

      {/* ── Copy ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-7 md:gap-8 w-full max-w-[860px] px-5 text-center">
        <div style={softIn(stage >= 1, 8)}>
          <span className="inline-flex items-center gap-2.5 rounded-full bg-surface/80 backdrop-blur border border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.04)] pl-2.5 pr-4 py-2 md:py-1.5">
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="pulse-ring absolute inset-0 rounded-full bg-brand" />
              <span className="relative w-2 h-2 rounded-full bg-brand" />
            </span>
            {/* The badge wraps to two lines on a phone — leading-none would make
                them touch, so the line box only collapses once it fits on one. */}
            <span className="text-[13px] font-medium text-ink-2 leading-[1.35] md:leading-none tracking-[-0.1px] text-left">
              {t.hero.badge}
            </span>
          </span>
        </div>

        <h1 className="font-semibold text-ink leading-[1.04] tracking-[-1.4px] md:tracking-[-2.6px] text-[46px] sm:text-[62px] md:text-[78px]">
          {lines.map((line, li) => {
            const before = lines.slice(0, li).reduce((a, l) => a + l.length, 0);
            return (
              <span key={li} className="hero-line block">
                {line.map((word, wi) => (
                  <span key={`${word}-${wi}`} className="hero-word">
                    <span style={{ animationDelay: `${(before + wi) * WORD_STEP}ms` }}>{word}</span>
                    {wi < line.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            );
          })}
          {/* The headline ends on a word that keeps changing — it owns the last
              line, so the long forms have the whole width to themselves. */}
          <span className="hero-line block">
            <span className="hero-word">
              <span style={{ animationDelay: `${lines.flat().length * WORD_STEP}ms` }}>
                <RotatingWords
                  words={t.hero.h1Rotate}
                  stack
                  className="text-brand"
                  active={stage >= 3}
                />
              </span>
            </span>
          </span>
        </h1>

        <p
          className="text-[17px] md:text-[19px] font-normal text-ink-2 leading-[1.55] max-w-[560px]"
          style={softIn(stage >= 2)}
        >
          {t.hero.subtitle}
        </p>

        <div style={softIn(stage >= 3, 16)} className="flex flex-col items-center gap-6 w-full">
          {/* One action carries the weight. The second used to be a pill that
              opened the very same modal — two buttons, one outcome — so it is
              now a quiet link into the constructor, for people who want to look
              before they talk. */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={open}
              data-track="cta"
              data-place="перший екран"
              className="btn-primary btn-brand group relative flex items-center justify-center h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden"
            >
              <span className="relative text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.hero.cta}
              </span>
            </button>

            <Link
              href="/modules"
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-2 hover:text-brand transition-colors"
            >
              {t.common.buildSet}
              <ArrowRight
                className="w-[16px] h-[16px] transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Product preview ────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-[1040px] px-5 md:px-8 mt-14 md:mt-20"
        style={{ ...softIn(stage >= 3, 24), isolation: "isolate" }}
      >
        <div
          ref={mockRef}
          style={{
            transformOrigin: "center top",
            transform: "perspective(1400px) rotateX(18deg) scale(0.92)",
            willChange: "transform",
          }}
        >
          {/* Rotating glow behind the frame */}
          <div
            aria-hidden
            className="absolute inset-x-6 inset-y-8 rounded-[40px] overflow-hidden -z-10"
            style={{ filter: "blur(52px)", opacity: 0.4, contain: "layout style paint" }}
          >
            <div
              className="gradient-spin absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
              style={{
                background:
                  "conic-gradient(from 0deg, #007aff, #8cc2ff, #2f93ff, #005fc6, #007aff)",
              }}
            />
          </div>

          <div className="relative rounded-[24px] md:rounded-[34px] bg-surface border-[8px] md:border-[10px] border-hairline overflow-hidden shadow-[0_40px_80px_-40px_rgba(0,50,120,0.35)]">
            <div className="w-full aspect-[960/592] overflow-hidden rounded-[16px] md:rounded-[24px]">
              <AppPreview />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-full h-24 pointer-events-none bg-gradient-to-t from-page to-transparent"
      />
    </section>
  );
}
