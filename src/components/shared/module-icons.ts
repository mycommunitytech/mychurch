import type { LucideIcon } from "lucide-react";
import {
  Users, User, UserPlus, UserCheck, Heart, HeartHandshake, Home, Baby, Flame, Shield, ShieldCheck, Bell, BellRing,
  Calendar, CalendarDays, CalendarCheck, CalendarClock, Clock, Timer, MapPin, Building2, DoorOpen, Package, Wrench,
  ClipboardList, ClipboardCheck, ListChecks, CheckCircle2, FileText, FileCheck, FileSpreadsheet, FolderKanban, Table2,
  BarChart3, LineChart, PieChart, TrendingUp, Target, Flag, Rocket, GraduationCap, BookOpen, Award, Tent, Ticket,
  CreditCard, Wallet, Receipt, Calculator, Coins, Banknote, Send, Mail, MessageCircle, MessageSquare, MessagesSquare,
  Smartphone, Phone, QrCode, Link2, Workflow, Zap, Sparkles, Bot, Search, Filter, SlidersHorizontal, LayoutTemplate,
  LayoutGrid, Layers, Network, GitBranch, RefreshCw, Repeat, Lock, KeyRound, Eye, Globe, Languages, Download, Upload,
  Share2, History, Tag, Tags, Star, ThumbsUp, Music, Mic, Camera, Video, Inbox, Puzzle, Blocks, Settings2, Database,
  Cloud, Plug, Handshake, Gift, Hammer, Map, Compass, Megaphone, NotebookPen, Pencil, Printer, Archive, AlertTriangle,
  Info, HelpCircle, Sun, Snowflake, Leaf, PartyPopper, Bus, Utensils, Bed, School, Church, Contact, ScanLine, Smile,
  Radio, Palette, Copy, Kanban, Milestone, Route, Activity, Gauge, Percent, Bookmark, MessageSquareText,
} from "lucide-react";
import type { RoleId } from "@/content/modules/types";

/* ── Icons content authors may reference by name in `features[].icon` ── */
export const FEATURE_ICONS = {
  Users, User, UserPlus, UserCheck, Heart, HeartHandshake, Home, Baby, Flame, Shield, ShieldCheck, Bell, BellRing,
  Calendar, CalendarDays, CalendarCheck, CalendarClock, Clock, Timer, MapPin, Building2, DoorOpen, Package, Wrench,
  ClipboardList, ClipboardCheck, ListChecks, CheckCircle2, FileText, FileCheck, FileSpreadsheet, FolderKanban, Table2,
  BarChart3, LineChart, PieChart, TrendingUp, Target, Flag, Rocket, GraduationCap, BookOpen, Award, Tent, Ticket,
  CreditCard, Wallet, Receipt, Calculator, Coins, Banknote, Send, Mail, MessageCircle, MessageSquare, MessagesSquare,
  Smartphone, Phone, QrCode, Link2, Workflow, Zap, Sparkles, Bot, Search, Filter, SlidersHorizontal, LayoutTemplate,
  LayoutGrid, Layers, Network, GitBranch, RefreshCw, Repeat, Lock, KeyRound, Eye, Globe, Languages, Download, Upload,
  Share2, History, Tag, Tags, Star, ThumbsUp, Music, Mic, Camera, Video, Inbox, Puzzle, Blocks, Settings2, Database,
  Cloud, Plug, Handshake, Gift, Hammer, Map, Compass, Megaphone, NotebookPen, Pencil, Printer, Archive, AlertTriangle,
  Info, HelpCircle, Sun, Snowflake, Leaf, PartyPopper, Bus, Utensils, Bed, School, Church, Contact, ScanLine, Smile,
  Radio, Palette, Copy, Kanban, Milestone, Route, Activity, Gauge, Percent, Bookmark,
} as const satisfies Record<string, LucideIcon>;

export type FeatureIconName = keyof typeof FEATURE_ICONS;

/* ── One icon per module id and the colour it owns everywhere on the site ──
   Every module carries its own accent: the grid card, the module page, the
   workspace modal and the catalogue marquee all read it from here, so a module
   keeps the same colour wherever it shows up. Group accents below are only for
   the section headers and the map clusters. */
export const MODULE_ICONS: Record<string, LucideIcon> = {
  people: Users, family: Heart,
  ministries: Flame, "service-planning": ListChecks, groups: Home, learning: GraduationCap, onboarding: Rocket, camps: Tent,
  "kids-town": Blocks,
  forms: ClipboardList, applications: Inbox, links: Link2, automations: Zap, campaigns: Megaphone, knowledge: BookOpen, tables: Table2, projects: Kanban,
  calendar: CalendarDays, seasons: Leaf, goals: Target, events: Ticket,
  analytics: BarChart3,
  campuses: Building2,
  rooms: DoorOpen, inventory: Package, infrastructure: Hammer,
  org: Network, requests: FileCheck, accounting: Calculator,
  customization: SlidersHorizontal, templates: LayoutTemplate, "telegram-bot": Bot,
  telegram: Send, viber: MessageCircle, instagram: Camera, whatsapp: MessageSquare, turbosms: MessageSquareText, notion: NotebookPen,
  assistant: Sparkles,
};

/* Hues are spaced so that no two cards inside one group land on the same tone;
   integrations borrow their own brand colours. */
export const MODULE_ACCENTS: Record<string, string> = {
  people: "#0ea5e9", family: "#ec4899",
  ministries: "#f97316", "service-planning": "#ea580c", groups: "#0d9488", learning: "#4f46e5", onboarding: "#7c5cf0", camps: "#15803d",
  calendar: "#3b82f6", seasons: "#65a30d", goals: "#dc2626", events: "#f59e0b",
  analytics: "#0891b2",
  campuses: "#0f766e",
  "kids-town": "#e11d48",
  forms: "#7c3aed", applications: "#6366f1", links: "#10b981", automations: "#ca8a04", campaigns: "#d946ef", knowledge: "#b45309", tables: "#64748b", projects: "#2563eb",
  rooms: "#8b5e3c", inventory: "#b07d4f", infrastructure: "#6b7280",
  org: "#7c5cf0", requests: "#0891b2", accounting: "#059669",
  telegram: "#229ed9", viber: "#7360f2", instagram: "#e1306c", whatsapp: "#25d366", turbosms: "#f59e0b", notion: "#52525b",
  customization: "#64748b", templates: "#0d9488", "telegram-bot": "#229ed9",
  assistant: "#a855f7",
};

/* Ключі — id груп каталогу з i18n (`modules.groups`), перегрупованого
   2026-09-23. Старі ключі (serving, schedule, outreach, team, property,
   insight) лишились нижче: на них ще спираються зняті з сторінок блоки. */
export const GROUP_ICONS: Record<string, LucideIcon> = {
  people: Users, activities: Flame, planning: CalendarDays, tools: Megaphone,
  analytics: BarChart3, structure: Network, resources: Building2,
  accounting: Calculator, platform: SlidersHorizontal, integrations: Plug,
  serving: Flame, schedule: CalendarDays, outreach: Megaphone, team: Network,
  property: Building2, insight: BarChart3,
};

export const GROUP_ACCENTS: Record<string, string> = {
  people: "#0ea5e9", activities: "#f97316", planning: "#3b82f6", tools: "#d946ef",
  analytics: "#0891b2", structure: "#7c5cf0", resources: "#8b5e3c",
  accounting: "#16a34a", platform: "#64748b", integrations: "#14b8a6",
  serving: "#f97316", schedule: "#3b82f6", outreach: "#d946ef", team: "#7c5cf0",
  property: "#8b5e3c", insight: "#0891b2",
};

/** A module's own colour, falling back to its group's when it has none. */
export function moduleAccent(moduleId: string, groupId?: string): string {
  return MODULE_ACCENTS[moduleId] ?? (groupId ? GROUP_ACCENTS[groupId] : undefined) ?? "#007aff";
}

/* ── Audience roles (ids from `i18n.audience.roles`) ── */
export const AUDIENCE_ROLE_ICONS: Record<RoleId, LucideIcon> = {
  pastor: Church,
  leader: Users,
  deacon: Handshake,
  volunteer: HeartHandshake,
  visitor: UserPlus,
  member: User,
  hr: Network,
  accountant: Calculator,
  reception: Contact,
};

export const AUDIENCE_ROLE_ACCENTS: Record<RoleId, string> = {
  pastor: "#007aff",
  leader: "#12a150",
  deacon: "#e11d48",
  volunteer: "#f59e0b",
  visitor: "#0ea5e9",
  member: "#f05b8b",
  hr: "#8b5bf0",
  accountant: "#a16207",
  reception: "#14b8a6",
};
