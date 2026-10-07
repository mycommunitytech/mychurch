"use client";

import { Mail, Phone, Send } from "lucide-react";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { SITE_EMAIL, SITE_PHONE, SITE_TELEGRAM } from "@/lib/seo";
import { track } from "@/lib/analytics/client";

/* Заявка не доїхала. Тут не місце для трьох підписаних кнопок — вони
   перекрикують саму форму. Лишаємо три круглі іконки в ряд: телефон,
   телеграм, пошта. Підпис читає скрінрідер і показує тултип, а лист
   іде вже з іменем і номером усередині — передруковувати не треба. */

interface Props {
  /** «Не вдалося надіслати» — своє в кожної форми. */
  title: string;
  text: string;
  /** Те, що людина вже ввела: підставляємо в лист, щоб не набирати двічі. */
  name: string;
  phone: string;
  /** Звідки саме не доїхало — для аналітики. */
  source: "demo" | "callback" | "material";
  className?: string;
}

export default function LeadFallback({ title, text, name, phone, source, className }: Props) {
  const t = useT();

  const body = [
    `${t.modal.namePlaceholder}: ${name}`,
    `${t.modal.phonePlaceholder}: ${phone}`,
  ].join("\n");
  const mailto = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(t.common.leadMailSubject)}&body=${encodeURIComponent(body)}`;

  const rescue = (channel: string) => () => track("lead_rescue", { source, channel });

  return (
    <div role="alert" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1 text-center">
        <span className="text-[14px] font-semibold text-[#c76a00]">{title}</span>
        <span className="text-[13.5px] text-ink-2 leading-[1.5]">{text}</span>
      </div>

      {/* Три іконки в ряд — однакові за вагою, кожна в один дотик */}
      <div className="flex items-center justify-center gap-3">
        <a
          href={`tel:${SITE_PHONE}`}
          onClick={rescue("телефон")}
          aria-label={t.common.call}
          title={t.common.call}
          className="btn-secondary relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-hairline-strong"
        >
          <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
          <Phone className="relative w-[18px] h-[18px] text-ink-2" strokeWidth={1.9} />
        </a>

        <a
          href={SITE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          onClick={rescue("телеграм")}
          aria-label={t.common.telegram}
          title={t.common.telegram}
          className="btn-secondary relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-hairline-strong"
        >
          <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
          <Send className="relative w-[18px] h-[18px] text-ink-2" strokeWidth={1.9} />
        </a>

        <a
          href={mailto}
          onClick={rescue("пошта")}
          aria-label={SITE_EMAIL}
          title={SITE_EMAIL}
          className="btn-secondary relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-hairline-strong"
        >
          <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
          <Mail className="relative w-[18px] h-[18px] text-ink-2" strokeWidth={1.9} />
        </a>
      </div>
    </div>
  );
}
