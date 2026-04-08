// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  start: number | null;
  end:   number | null;
}

export interface MonthTheme {
  accent:     string;
  accentSoft: string;
  keyword:    string;
  label:      string;
  photoId:    string; // Unsplash photo ID
}

// ─── Calendar labels ──────────────────────────────────────────────────────────

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const MONTH_NAMES = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December",
] as const;

// ─── Month themes ─────────────────────────────────────────────────────────────

export const MONTH_THEMES: MonthTheme[] = [
  { accent:"#1d4ed8", accentSoft:"#dbeafe", keyword:"winter snow",     label:"Winter",      photoId:"photo-1519681393784-d120267933ba" },
  { accent:"#7c3aed", accentSoft:"#ede9fe", keyword:"cherry blossom",  label:"Early Spring", photoId:"photo-1458682625221-3a45f8a844c7" },
  { accent:"#059669", accentSoft:"#d1fae5", keyword:"spring meadow",   label:"Spring",      photoId:"photo-1462275646964-a0e3386b89fa" },
  { accent:"#b45309", accentSoft:"#fef3c7", keyword:"golden fields",   label:"Late Spring", photoId:"photo-1504701954957-2010ec3bcec1" },
  { accent:"#dc2626", accentSoft:"#fee2e2", keyword:"red roses",       label:"Bloom",       photoId:"photo-1490750967868-88df5691cc0e" },
  { accent:"#0891b2", accentSoft:"#cffafe", keyword:"ocean beach",     label:"Summer",      photoId:"photo-1507525428034-b723cf961d3e" },
  { accent:"#b45309", accentSoft:"#fef3c7", keyword:"desert canyon",   label:"Midsummer",   photoId:"photo-1469854523086-cc02fe5d8800" },
  { accent:"#4f46e5", accentSoft:"#e0e7ff", keyword:"lavender field",  label:"Late Summer", photoId:"photo-1499002238440-d264edd596ec" },
  { accent:"#92400e", accentSoft:"#fef3c7", keyword:"autumn leaves",   label:"Autumn",      photoId:"photo-1508739773434-c26b3d09e071" },
  { accent:"#c2410c", accentSoft:"#ffedd5", keyword:"harvest fall",    label:"Deep Autumn", photoId:"photo-1508193638397-1c4234db14d8" },
  { accent:"#475569", accentSoft:"#f1f5f9", keyword:"foggy forest",    label:"Late Autumn", photoId:"photo-1448375240586-882707db888b" },
  { accent:"#1e40af", accentSoft:"#dbeafe", keyword:"ice frost",       label:"Winter",      photoId:"photo-1491002052546-bf38f186af56" },
];

// ─── Holidays ─────────────────────────────────────────────────────────────────

export const HOLIDAYS: Record<string, string> = {
  "0-1":  "New Year's Day",
  "0-26": "Republic Day",
  "2-25": "Holi",
  "3-14": "Ambedkar Jayanti",
  "7-15": "Independence Day",
  "9-2":  "Gandhi Jayanti",
  "9-24": "Dussehra",
  "10-14":"Diwali",
  "11-25":"Christmas Day",
  "11-31":"New Year's Eve",
};

// ─── Date math helpers ────────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon … 6=Sun */
export function getFirstWeekday(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay(); // JS: 0=Sun
  return d === 0 ? 6 : d - 1;
}

export function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/** Flat array of day numbers (null = empty cell) for a 7-column grid */
export function buildMonthCells(year: number, month: number): (number | null)[] {
  const leading = getFirstWeekday(year, month);
  const total   = getDaysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(leading).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}