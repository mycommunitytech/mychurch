import { Flag, GraduationCap, Handshake, HeartHandshake, Landmark, Plug, Sparkles, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CooperationId } from "@/content/cooperation";

/* Колір і знак кожного адресата /cooperation. Окремим файлом, бо їх
   бере й сама сторінка (cooperation-stage.tsx), і смуга-запрошення внизу
   головної (cooperation-teaser.tsx) — головна не має тягнути всі екрани
   сторінки співпраці заради восьми іконок. */

export const COOP_ACCENTS: Record<CooperationId, string> = {
  unions: "#0069e0",
  /* Колір церкви-амбасадора «Нове Життя» (src/content/ambassadors.ts). */
  ambassadors: "#0f766e",
  clubs: "#ea580c",
  movements: "#db2777",
  organizations: "#16a34a",
  /* Золото сертифіката. */
  education: "#ca8a04",
  partners: "#7c4ddf",
  integrations: "#0891b2",
};

export const COOP_ICONS: Record<CooperationId, LucideIcon> = {
  unions: Landmark,
  ambassadors: Sparkles,
  clubs: UsersRound,
  movements: Flag,
  organizations: HeartHandshake,
  education: GraduationCap,
  partners: Handshake,
  integrations: Plug,
};
