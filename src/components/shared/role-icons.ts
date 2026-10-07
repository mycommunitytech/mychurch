import type { LucideIcon } from "lucide-react";
import {
  Church, UsersRound, HandHeart, HeartHandshake, UserPlus, User, Network, Calculator, ConciergeBell, Flame,
  Eye, UserX, BarChart3, Target, Sparkles, ArrowRightLeft,
  ClipboardCheck, CalendarDays, Send, ListChecks,
  Smartphone, MousePointerClick, BookOpen, Bell, GraduationCap,
  QrCode, MessageCircleHeart, Route, UserCheck, Radar, CalendarRange,
  Ticket, Heart, Wallet, Bot,
  Inbox, Gauge, FileText,
  Coins, Receipt, Banknote, PieChart, Download,
  Search, DoorOpen, Baby, LayoutList,
} from "lucide-react";

export const ROLE_IDS = ["pastor", "leader", "deacon", "volunteer", "visitor", "member", "hr", "accountant", "reception"] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export const ROLE_ICONS: Record<string, LucideIcon> = {
  pastor: Church,
  leader: UsersRound,
  deacon: HandHeart,
  volunteer: Flame,
  /* Волонтер є лише в брифі: своєї сторінки ролі в нього немає. */
  helper: HeartHandshake,
  visitor: UserPlus,
  member: User,
  hr: Network,
  accountant: Calculator,
  reception: ConciergeBell,
};

/* Обличчя ролі — для плашок на головній: там замість іконки стоїть людина,
   бо блок і називається «для кожного в церкві». Індекси в AVATAR_LOOKS
   підібрані так, щоб сусідні плашки не повторювали одне обличчя. */
export const ROLE_LOOKS: Record<string, number> = {
  pastor: 3, leader: 0, deacon: 7, volunteer: 1, visitor: 5, member: 0, hr: 1, accountant: 3, reception: 5,
};

export const ROLE_ACCENTS: Record<string, string> = {
  pastor: "#007aff",
  leader: "#12a150",
  deacon: "#e11d48",
  volunteer: "#f59e0b",
  helper: "#14b8a6",
  visitor: "#0ea5e9",
  member: "#f05b8b",
  hr: "#8b5bf0",
  accountant: "#0f766e",
  reception: "#f97316",
};

/* Кольори для ротатора у заголовках «Для кого»: перше слово («кожного в
   церкві») лишається фірмовим градієнтом, тому без кольору, далі — ролі в
   порядку ROLE_IDS, тим самим, що й у списку ролей. */
export const ROLE_ROTATE_ACCENTS: (string | undefined)[] = [
  undefined,
  ...ROLE_IDS.map((id) => ROLE_ACCENTS[id]),
];

/* One icon per capability card, in dictionary order. */
export const ROLE_CAP_ICONS: Record<string, LucideIcon[]> = {
  pastor: [Eye, UserX, BarChart3, Target, Sparkles, ArrowRightLeft],
  leader: [ClipboardCheck, UserX, CalendarDays, Send, ListChecks, ArrowRightLeft],
  deacon: [Inbox, HeartHandshake, Wallet, CalendarDays, ListChecks, FileText],
  volunteer: [CalendarDays, MousePointerClick, ListChecks, BookOpen, Bell, GraduationCap],
  visitor: [QrCode, MessageCircleHeart, Route, UserCheck, Radar, CalendarRange],
  member: [CalendarDays, Ticket, Heart, UsersRound, Wallet, Bot],
  hr: [Network, Inbox, ListChecks, Gauge, GraduationCap, FileText],
  accountant: [Coins, Receipt, Banknote, PieChart, Target, Download],
  reception: [QrCode, UserPlus, Search, DoorOpen, Baby, LayoutList],
};

/* Icons for the four "actions" lines on a role screen. */
export const ROLE_ACTION_ICONS: Record<string, LucideIcon[]> = {
  pastor: [UserX, Sparkles, BarChart3, Inbox],
  leader: [ClipboardCheck, Send, CalendarDays, ArrowRightLeft],
  deacon: [Inbox, HeartHandshake, Wallet, ListChecks],
  volunteer: [MousePointerClick, ClipboardCheck, BookOpen, Bell],
  visitor: [QrCode, MessageCircleHeart, Ticket, UserCheck],
  member: [Ticket, Heart, Bell, Bot],
  hr: [Inbox, Network, ListChecks, Gauge],
  accountant: [Coins, Banknote, PieChart, Download],
  reception: [QrCode, UserPlus, DoorOpen, Search],
};

export const ROLE_SMARTPHONE = Smartphone;
