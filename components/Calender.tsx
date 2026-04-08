"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SelectedRange {
  start: number | null;
  end: number | null;
}

interface MonthNote {
  [key: string]: string; // "YYYY-MM" -> note text
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Month themes: [accentColor, imageKeyword]
const MONTH_THEMES: [string, string][] = [
  ["#1a6eb5", "winter,snow,mountain"],
  ["#8e44ad", "spring,cherry,blossom"],
  ["#16a085", "forest,green,nature"],
  ["#e67e22", "sunset,golden,field"],
  ["#c0392b", "red,flowers,garden"],
  ["#2980b9", "ocean,beach,summer"],
  ["#f39c12", "desert,canyon,warm"],
  ["#27ae60", "autumn,leaves,orange"],
  ["#d35400", "harvest,pumpkin,fall"],
  ["#2c3e50", "night,fog,misty"],
  ["#8e44ad", "purple,lavender,frost"],
  ["#1abc9c", "ice,crystal,winter"],
];

// Hardcoded holidays (month 0-indexed, day)
const HOLIDAYS: Record<string, string> = {
  "0-1": "New Year",
  "0-26": "Republic Day",
  "2-25": "Holi",
  "3-14": "Ambedkar Jayanti",
  "7-15": "Independence Day",
  "9-2": "Gandhi Jayanti",
  "9-24": "Dussehra",
  "10-14": "Diwali",
  "11-25": "Christmas",
  "11-31": "New Year's Eve",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun..6=Sat → convert to Mon-first (0=Mon..6=Sun)
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpiralBinding() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        padding: "8px 20px 0",
        background: "#f0ece6",
        borderRadius: "12px 12px 0 0",
      }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "14px",
            height: "20px",
            border: "2.5px solid #999",
            borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
            background: "#ddd",
          }}
        />
      ))}
    </div>
  );
}

interface HeroImageProps {
  month: number;
  year: number;
  accent: string;
  imageKeyword: string;
}

function HeroImage({ month, year, accent, imageKeyword }: HeroImageProps) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://source.unsplash.com/800x350/?${imageKeyword}`}
        alt={`${MONTH_NAMES[month]} scenery`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.background = accent;
        }}
      />
      {/* Diagonal overlay with month name */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          background: accent,
          clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
          padding: "12px 24px 12px 60px",
          minWidth: "160px",
          textAlign: "right",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "2px" }}>
          {year}
        </div>
        <div style={{ color: "#fff", fontSize: "22px", fontWeight: "900", fontFamily: "'Playfair Display', serif", letterSpacing: "1px" }}>
          {MONTH_NAMES[month].toUpperCase()}
        </div>
      </div>
    </div>
  );
}

interface DayCellProps {
  day: number;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isWeekend: boolean;
  holiday: string | null;
  accent: string;
  onClick: () => void;
  onMouseEnter: () => void;
}

function DayCell({ day, isToday, isStart, isEnd, isInRange, isWeekend, holiday, accent, onClick, onMouseEnter }: DayCellProps) {
  const isSelected = isStart || isEnd;

  let bg = "transparent";
  let color = isWeekend ? "var(--weekend)" : "var(--text-primary)";
  let border = "none";

  if (isSelected) {
    bg = accent;
    color = "#fff";
  } else if (isInRange) {
    bg = "var(--range-bg)";
    color = accent;
  } else if (isToday) {
    bg = "var(--today-bg)";
    color = "var(--today-text)";
  }

  if (isToday && !isSelected) {
    border = `2px solid ${accent}`;
    bg = "transparent";
    color = accent;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      title={holiday ?? undefined}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        aspectRatio: "1",
        cursor: "pointer",
        borderRadius: isStart ? "50% 0 0 50%" : isEnd ? "0 50% 50% 0" : isInRange ? "0" : "50%",
        background: bg,
        border,
        transition: "all 0.15s ease",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: "clamp(11px, 2vw, 14px)", fontWeight: isSelected || isToday ? "700" : "400", color, lineHeight: 1 }}>
        {day}
      </span>
      {holiday && (
        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: isSelected ? "#fff" : accent, marginTop: "2px" }} />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<MonthNote>({});
  const [isMobile, setIsMobile] = useState(false);

  const monthKey = formatMonthKey(viewYear, viewMonth);
  const [accent, imageKeyword] = MONTH_THEMES[viewMonth];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wall-calendar-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // Responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const saveNote = (text: string) => {
    const updated = { ...notes, [monthKey]: text };
    setNotes(updated);
    try {
      localStorage.setItem("wall-calendar-notes", JSON.stringify(updated));
    } catch {}
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setRange({ start: null, end: null });
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setRange({ start: null, end: null });
  };

  const handleDayClick = useCallback((day: number) => {
    setRange(prev => {
      if (prev.start === null || (prev.start !== null && prev.end !== null)) {
        return { start: day, end: null };
      }
      if (day < prev.start) return { start: day, end: prev.start };
      if (day === prev.start) return { start: null, end: null };
      return { start: prev.start, end: day };
    });
  }, []);

  const effectiveEnd = range.end ?? (range.start !== null && hoverDay !== null && hoverDay > range.start ? hoverDay : null);

  // Build cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeLabel = range.start
    ? range.end
      ? `${MONTH_NAMES[viewMonth]} ${range.start} – ${range.end}, ${viewYear}`
      : `Starting ${MONTH_NAMES[viewMonth]} ${range.start}`
    : null;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "0",
        borderRadius: "16px",
        boxShadow: "var(--shadow)",
        overflow: "hidden",
        background: "var(--card)",
      }}>

        {/* LEFT / TOP: Notes Panel */}
        <div style={{
          width: isMobile ? "100%" : "220px",
          minWidth: isMobile ? "auto" : "220px",
          background: "var(--notes-bg)",
          borderRight: isMobile ? "none" : "1px solid var(--border)",
          borderBottom: isMobile ? "1px solid var(--border)" : "none",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          order: isMobile ? 2 : 0,
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
            Notes
          </div>
          <div style={{ width: "40px", height: "2px", background: accent, borderRadius: "2px" }} />

          {rangeLabel && (
            <div style={{
              fontSize: "11px",
              color: accent,
              fontWeight: "600",
              padding: "6px 8px",
              background: "var(--range-bg)",
              borderRadius: "6px",
              lineHeight: "1.4",
            }}>
              📅 {rangeLabel}
            </div>
          )}

          <textarea
            value={notes[monthKey] ?? ""}
            onChange={e => saveNote(e.target.value)}
            placeholder={`Jot down notes for ${MONTH_NAMES[viewMonth]}...`}
            style={{
              flex: 1,
              minHeight: isMobile ? "100px" : "280px",
              resize: "none",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-primary)",
              background: "#fff",
              outline: "none",
              lineHeight: "1.6",
            }}
          />

          <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>
            Auto-saved ✓
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            {[
              { color: accent, label: "Selected" },
              { color: "var(--range-bg)", label: "Range", border: `1px solid ${accent}` },
              { color: "transparent", label: "Holiday ●", border: `2px solid ${accent}` },
            ].map(({ color, label, border }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: color, border, flexShrink: 0, display: "inline-block" }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT / MAIN: Calendar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <SpiralBinding />

          <HeroImage month={viewMonth} year={viewYear} accent={accent} imageKeyword={imageKeyword} />

          {/* Month navigation */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px 8px",
            borderBottom: "1px solid var(--border)",
          }}>
            <button
              onClick={prevMonth}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: `1.5px solid ${accent}`, background: "transparent",
                color: accent, fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >‹</button>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
                {MONTH_NAMES[viewMonth]}
              </span>
              <span style={{ marginLeft: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>{viewYear}</span>
            </div>

            <button
              onClick={nextMonth}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: `1.5px solid ${accent}`, background: "transparent",
                color: accent, fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >›</button>
          </div>

          {/* Grid */}
          <div style={{ padding: "12px 16px 20px", flex: 1 }}>
            {/* Day labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    padding: "4px 0",
                    color: i >= 5 ? "var(--weekend)" : "var(--text-muted)",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}
              onMouseLeave={() => setHoverDay(null)}
            >
              {cells.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />;

                const colIdx = idx % 7; // 0=Mon..6=Sun
                const isWeekend = colIdx === 5 || colIdx === 6;
                const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                const isStart = range.start === day;
                const isEnd = range.end === day;
                const isInRange = range.start !== null && effectiveEnd !== null && day > range.start && day < effectiveEnd;
                const holiday = HOLIDAYS[`${viewMonth}-${day}`] ?? null;

                return (
                  <DayCell
                    key={day}
                    day={day}
                    isToday={isToday}
                    isStart={isStart}
                    isEnd={isEnd}
                    isInRange={isInRange}
                    isWeekend={isWeekend}
                    holiday={holiday}
                    accent={accent}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => range.start !== null && range.end === null ? setHoverDay(day) : undefined}
                  />
                );
              })}
            </div>

            {/* Range clear button */}
            {(range.start || range.end) && (
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <button
                  onClick={() => setRange({ start: null, end: null })}
                  style={{
                    fontSize: "12px",
                    color: accent,
                    background: "transparent",
                    border: `1px solid ${accent}`,
                    borderRadius: "20px",
                    padding: "4px 16px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}