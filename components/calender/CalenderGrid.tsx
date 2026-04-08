"use client";

import DayCell from "./DayCell";
import { WEEKDAY_LABELS, HOLIDAYS, buildMonthCells, DateRange } from "@/lib/calendar";

interface CalendarGridProps {
  year:        number;
  month:       number;
  today:       Date;
  range:       DateRange;
  hoverDay:    number | null;
  accent:      string;
  accentSoft:  string;
  onDayClick:  (day: number) => void;
  onDayHover:  (day: number | null) => void;
}

export default function CalendarGrid({
  year, month, today, range, hoverDay,
  accent, accentSoft, onDayClick, onDayHover,
}: CalendarGridProps) {
  const cells = buildMonthCells(year, month);

  // Effective end for hover preview
  const effectiveEnd = range.end
    ?? (range.start !== null && hoverDay !== null && hoverDay > range.start ? hoverDay : null);

  return (
    <div style={{ padding: "8px 16px 16px" }}>
      {/* Weekday labels */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        marginBottom: "2px",
      }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={label} style={{
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            padding: "6px 0",
            color: i >= 5 ? "var(--weekend)" : "var(--ink-muted)",
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}
        onMouseLeave={() => onDayHover(null)}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} style={{ aspectRatio: "1" }} />;
          }

          const colIdx   = idx % 7; // 0=Mon … 6=Sun
          const isWeekend = colIdx >= 5;
          const isToday  = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isStart  = range.start === day;
          const isEnd    = range.end === day;
          const isInRange = range.start !== null && effectiveEnd !== null
            && day > range.start && day < effectiveEnd;
          const holiday  = HOLIDAYS[`${month}-${day}`] ?? null;

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
              accentSoft={accentSoft}
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
            />
          );
        })}
      </div>
    </div>
  );
}