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
  imageUrl:   string; // full image URL (picsum.photos)
}

// ─── Calendar labels ──────────────────────────────────────────────────────────

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const MONTH_NAMES = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December",
] as const;

export const SHORT_MONTH_NAMES = [
  "Jan","Feb","Mar","Apr",
  "May","Jun","Jul","Aug",
  "Sep","Oct","Nov","Dec",
] as const;

// ─── Month themes ─────────────────────────────────────────────────────────────

export const MONTH_THEMES: MonthTheme[] = [
  // January  – snowy mountain
  { accent:"#1d4ed8", accentSoft:"#dbeafe", keyword:"winter snow",     label:"Winter",      imageUrl:"https://picsum.photos/seed/january-snow/1200/525" },
  // February – cherry blossoms / Valentine
  { accent:"#be185d", accentSoft:"#fce7f3", keyword:"cherry blossom",  label:"Early Spring", imageUrl:"https://picsum.photos/seed/february-bloom/1200/525" },
  // March    – spring green meadow
  { accent:"#059669", accentSoft:"#d1fae5", keyword:"spring meadow",   label:"Spring",      imageUrl:"https://picsum.photos/seed/march-meadow/1200/525" },
  // April    – blooming flower field
  { accent:"#7c3aed", accentSoft:"#ede9fe", keyword:"flower field",    label:"Late Spring", imageUrl:"https://picsum.photos/seed/april-flowers/1200/525" },
  // May      – golden hour nature
  { accent:"#b45309", accentSoft:"#fef3c7", keyword:"golden fields",   label:"Bloom",       imageUrl:"https://picsum.photos/seed/may-golden/1200/525" },
  // June     – sunny ocean beach
  { accent:"#0891b2", accentSoft:"#cffafe", keyword:"ocean beach",     label:"Summer",      imageUrl:"https://picsum.photos/seed/june-beach/1200/525" },
  // July     – tropical sunset
  { accent:"#d97706", accentSoft:"#fef3c7", keyword:"tropical sunset", label:"Midsummer",   imageUrl:"https://picsum.photos/seed/july-sunset/1200/525" },
  // August   – lavender fields
  { accent:"#4f46e5", accentSoft:"#e0e7ff", keyword:"lavender field",  label:"Late Summer", imageUrl:"https://picsum.photos/seed/august-lavender/1200/525" },
  // September – golden autumn forest
  { accent:"#92400e", accentSoft:"#fef3c7", keyword:"autumn leaves",   label:"Autumn",      imageUrl:"https://picsum.photos/seed/september-autumn/1200/525" },
  // October  – fiery fall foliage
  { accent:"#c2410c", accentSoft:"#ffedd5", keyword:"harvest fall",    label:"Deep Autumn", imageUrl:"https://picsum.photos/seed/october-foliage/1200/525" },
  // November – misty foggy forest
  { accent:"#475569", accentSoft:"#f1f5f9", keyword:"foggy forest",    label:"Late Autumn", imageUrl:"https://picsum.photos/seed/november-mist/1200/525" },
  // December – cosy winter / christmas snow
  { accent:"#1e40af", accentSoft:"#dbeafe", keyword:"christmas snow",  label:"Winter",      imageUrl:"https://picsum.photos/seed/december-xmas/1200/525" },
];

// ─── Indian Holidays & Festivals (month-index is 0-based) ────────────────────

export interface Holiday {
  name:      string;
  shortName: string; // compact label for the calendar cell (≤8 chars)
  type:      "national" | "festival" | "regional";
}

export const HOLIDAYS: Record<string, Holiday> = {
  // January
  "0-1":  { name: "New Year's Day",                        shortName: "New Year",  type: "national" },
  "0-14": { name: "Makar Sankranti",                       shortName: "Sankranti", type: "festival" },
  "0-15": { name: "Pongal",                                shortName: "Pongal",    type: "festival" },
  "0-23": { name: "Netaji Subhas Chandra Bose Jayanti",   shortName: "Netaji",    type: "national" },
  "0-26": { name: "Republic Day",                          shortName: "Republic",  type: "national" },

  // February
  "1-14": { name: "Valentine's Day",                       shortName: "Valentine", type: "regional" },
  "1-19": { name: "Chhatrapati Shivaji Maharaj Jayanti",  shortName: "Shivaji",   type: "regional" },

  // March
  "2-8":  { name: "International Women's Day",             shortName: "Women's",   type: "national" },
  "2-25": { name: "Holi",                                  shortName: "Holi",      type: "festival" },

  // April
  "3-6":  { name: "Ram Navami",                            shortName: "Ram Nav",   type: "festival" },
  "3-14": { name: "Ambedkar Jayanti / Baisakhi",           shortName: "Baisakhi",  type: "national" },
  "3-18": { name: "Good Friday",                           shortName: "Good Fri",  type: "national" },

  // May
  "4-1":  { name: "Maharashtra Day / Labour Day",          shortName: "Labour",    type: "national" },
  "4-12": { name: "Buddha Purnima",                        shortName: "Buddha",    type: "festival" },
  "4-23": { name: "Eid ul-Fitr",                           shortName: "Eid Fitr",  type: "festival" },

  // June
  "5-21": { name: "International Yoga Day",                shortName: "Yoga Day",  type: "national" },

  // July
  "6-6":  { name: "Eid ul-Adha",                           shortName: "Eid Adha",  type: "festival" },
  "6-17": { name: "Muharram",                              shortName: "Muharram",  type: "festival" },

  // August
  "7-15": { name: "Independence Day",                      shortName: "Independ",  type: "national" },
  "7-16": { name: "Raksha Bandhan",                        shortName: "Raksha",    type: "festival" },
  "7-27": { name: "Janmashtami",                           shortName: "Janmast",   type: "festival" },

  // September
  "8-5":  { name: "Teachers' Day",                         shortName: "Teachers",  type: "national" },
  "8-10": { name: "Ganesh Chaturthi",                      shortName: "Ganesh",    type: "festival" },
  "8-16": { name: "Milad-un-Nabi",                         shortName: "Milad",     type: "festival" },

  // October
  "9-2":  { name: "Gandhi Jayanti",                        shortName: "Gandhi",    type: "national" },
  "9-2_b":{ name: "Navratri begins",                       shortName: "Navratri",  type: "festival" },
  "9-12": { name: "Dussehra",                              shortName: "Dussehra",  type: "festival" },
  "9-20": { name: "Dhanteras",                             shortName: "Dhanters",  type: "festival" },
  "9-22": { name: "Diwali",                                shortName: "Diwali",    type: "festival" },
  "9-23": { name: "Govardhan Puja",                        shortName: "Govardan",  type: "festival" },
  "9-24": { name: "Bhai Dooj",                             shortName: "Bhai Dj",   type: "festival" },

  // November
  "10-5": { name: "Guru Nanak Jayanti",                    shortName: "Guru Nak",  type: "festival" },
  "10-14":{ name: "Children's Day",                        shortName: "Children",  type: "national" },

  // December
  "11-25":{ name: "Christmas Day",                         shortName: "Xmas",      type: "festival" },
  "11-31":{ name: "New Year's Eve",                        shortName: "NYE",       type: "regional" },
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