"use client";

import DayCell from "./DayCell";
import { WEEKDAY_LABELS, HOLIDAYS, buildMonthCells, DateRange } from "@/lib/calendar";

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
  const cells = buildMonthCells(year, month);
 
  const effectiveEnd = range.end
    ?? (range.start !== null && hoverDay !== null && hoverDay > range.start ? hoverDay : null);
 
  return (
    <div className="px-[14px] pb-3 pt-1 flex-1">
      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-[2px]">
        {WEEKDAY_LABELS.map((lbl, i) => (
          <div
            key={lbl}
            className="text-center text-[10px] font-semibold tracking-[0.8px] uppercase py-[6px]"
            style={{ color: i >= 5 ? "#b91c1c" : "#a8a29e" }}
          >
            {lbl}
          </div>
        ))}
      </div>
 
      {/* Day cells */}
      <div
        className="grid grid-cols-7 gap-px"
        onMouseLeave={() => onDayHover(null)}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`e-${idx}`} style={{ aspectRatio: "1" }} />;
          }
 
          const col       = idx % 7;
          const isWeekend = col >= 5;
          const isToday   = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isStart   = range.start === day;
          const isEnd     = range.end   === day;
          const isInRange = range.start !== null && effectiveEnd !== null && day > range.start && day < effectiveEnd;
          const holiday   = HOLIDAYS[`${month}-${day}`] ?? null;
 
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
              onClick={() => onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
 