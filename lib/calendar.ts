// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  start: number | null;
  end:   number | null;
}

export interface MonthTheme {
  accent:     string;
  accentSoft: string;
  keyword:    string;
  label:      string; // descriptive season/mood label
}

// ─── Date Constants ───────────────────────────────────────────────────────────

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const MONTH_NAMES = [
  "January", "February", "March",    "April",
  "May",     "June",     "July",     "August",
  "September","October", "November", "December",
] as const;

export const SHORT_MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
] as const;

// ─── Month Themes ─────────────────────────────────────────────────────────────

export const MONTH_THEMES: MonthTheme[] = [
  { accent: "#1d4ed8", accentSoft: "#dbeafe", keyword: "winter+snow+mountain",   label: "Winter" },
  { accent: "#7c3aed", accentSoft: "#ede9fe", keyword: "purple+blossom+spring",  label: "Early Spring" },
  { accent: "#059669", accentSoft: "#d1fae5", keyword: "spring+green+meadow",    label: "Spring" },
  { accent: "#d97706", accentSoft: "#fef3c7", keyword: "golden+sunset+fields",   label: "Late Spring" },
  { accent: "#dc2626", accentSoft: "#fee2e2", keyword: "red+roses+garden",       label: "Bloom" },
  { accent: "#0891b2", accentSoft: "#cffafe", keyword: "ocean+beach+summer",     label: "Summer" },
  { accent: "#b45309", accentSoft: "#fef3c7", keyword: "desert+canyon+arid",     label: "Midsummer" },
  { accent: "#4f46e5", accentSoft: "#e0e7ff", keyword: "lavender+purple+field",  label: "Late Summer" },
  { accent: "#b45309", accentSoft: "#fef3c7", keyword: "autumn+leaves+forest",   label: "Autumn" },
  { accent: "#c2410c", accentSoft: "#ffedd5", keyword: "harvest+orange+fall",    label: "Deep Autumn" },
  { accent: "#475569", accentSoft: "#f1f5f9", keyword: "fog+misty+grey+forest",  label: "Late Autumn" },
  { accent: "#1e40af", accentSoft: "#dbeafe", keyword: "ice+frost+crystal+blue", label: "Winter" },
];

// ─── Holidays (month 0-indexed) ───────────────────────────────────────────────

export const HOLIDAYS: Record<string, string> = {
  "0-1":  "New Year's Day",
  "0-26": "Republic Day",
  "2-25": "Holi",
  "3-14": "Ambedkar Jayanti",
  "7-15": "Independence Day",
  "9-2":  "Gandhi Jayanti",
  "9-24": "Dussehra",
  "10-14":"Diwali",
  "11-25":"Christmas",
  "11-31":"New Year's Eve",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon … 6=Sun */
export function getFirstWeekday(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;
}

export function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function isSameDay(year: number, month: number, day: number, ref: Date): boolean {
  return ref.getFullYear() === year && ref.getMonth() === month && ref.getDate() === day;
}

/** Build the flat cell array for a month grid (null = empty leading/trailing cell) */
export function buildMonthCells(year: number, month: number): (number | null)[] {
  const first = getFirstWeekday(year, month);
  const days  = getDaysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}