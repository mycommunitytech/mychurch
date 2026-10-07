"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useT } from "@/lib/lang";

interface LogoLinkProps {
  size?: "sm" | "md";
}

export default function LogoLink({ size = "md" }: LogoLinkProps) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Трекінг щільний, щоб слова читались як одна фігура, а не як текст у меню.
     Перше слово — синім: «Моя» це найсильніший аргумент бренду, тому воно
     звучить у самому логотипі. Знак поки не показуємо. */
  /* Знака нема — словесна частина бере на себе всю вагу, тому тягнемо її
     до стелі рядка: 64px хедер на мобільному, 80px на десктопі. */
  const textSize = size === "sm" ? "text-[22px]" : "text-[26px] md:text-[32px]";

  const [firstWord, ...restWords] = t.common.brand.split(" ");
  const rest = restWords.join(" ");

  /* Логотип — справжнє посилання на «/», а не кнопка: це головний шлях на
     головну з кожної сторінки й у підвалі. Кнопка не мала href, тож її не
     можна було відкрити в новій вкладці чи скопіювати адресу, скрінрідер
     читав її як «кнопка», а пошук не бачив у ній посилання на корінь сайту.
     Перехід лишився тим самим: затемнення, і аж потім сторінка. */
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    /* Ctrl/Cmd-клік, середня кнопка, «відкрити в новій вкладці» — віддаємо
       браузеру як є: затемнювати поточну сторінку тут нічого. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (timerRef.current) return;
    setFading(true);

    timerRef.current = setTimeout(() => {
      setFading(false);
      timerRef.current = null;
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    }, 350);
  }

  return (
    <>
      {fading && (
        <div className="fixed inset-0 z-[9999] bg-surface pointer-events-none animate-fade-in-out" style={{ willChange: "opacity" }} />
      )}

      <Link href="/" onClick={handleClick} aria-label={t.common.brand} className="flex items-center">
        {/* Поки що лише словесна частина — знак ще в роботі. */}
        <span
          aria-hidden
          className={`font-brand font-extrabold tracking-[-0.04em] ${textSize} text-ink leading-[1.2] whitespace-nowrap`}
        >
          <span className="text-brand">{firstWord}</span>
          {rest ? ` ${rest}` : ""}
        </span>
      </Link>
    </>
  );
}
