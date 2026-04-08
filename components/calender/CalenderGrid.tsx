"use client";

import { buildMonthCells, WEEKDAY_LABELS, HOLIDAYS, DateRange } from "@/lib/calendar";
import DayCell from "./DayCell";

interface CalendarGridProps {
  year:       number;
  month:      number;
  today:      Date;
  range:      DateRange;
  hoverDay:   number | null;
  onDayClick: (day: number) => void;
  onDayHover: (day: number | null) => void;
}

export default function CalendarGrid({
  year, month, today, range, hoverDay, onDayClick, onDayHover,
}: CalendarGridProps) {
  const cells   = buildMonthCells(year, month);
  const todayD  = today.getFullYear() === year && today.getMonth() === month
    ? today.getDate()
    : -1;

  const effectiveEnd = range.end ?? (hoverDay && range.start && hoverDay !== range.start ? hoverDay : null);

  return (
    <div className="px-2 sm:px-3 pb-3 pt-2 select-none" style={{ touchAction: "pan-y" }}>
      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-2 sm:mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center py-1 sm:py-1.5 transition-colors duration-200"
            style={{
              fontSize: "clamp(8px, 2vw, 11px)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: label === "Sat" || label === "Sun" ? "#dc2626" : "#a8a29e",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-[2px] sm:gap-y-[3px]">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} style={{ aspectRatio: "1" }} />;
          }

          const holidayKey = `${month}-${day}`;
          const holiday    = HOLIDAYS[holidayKey] ?? null;

          // Day of week (0=Mon…6=Sun)
          const dow = (idx) % 7;
          const isWeekend = dow === 5 || dow === 6;

          const isStart   = range.start === day;
          const isEnd     = effectiveEnd === day;
          const isInRange = !!(
            range.start !== null &&
            effectiveEnd !== null &&
            day > Math.min(range.start, effectiveEnd) &&
            day < Math.max(range.start, effectiveEnd)
          );

          return (
            <DayCell
              key={day}
              day={day}
              isToday={day === todayD}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={isInRange}
              isWeekend={isWeekend}
              holiday={holiday}
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
