"use client";

import { useState, useEffect, useCallback } from "react";
import { MONTH_THEMES, DateRange, formatMonthKey } from "@/lib/calendar";

import SpiralBinding  from "./calender/SpiralBinding";
import HeroImage      from "./calender/HeroImage";
import MonthNav       from "./calender/MonthNav";
import CalendarGrid   from "./calender/CalenderGrid";
import RangeDisplay   from "./calender/RangeDisplay";
import NotesPanel     from "./calender/NotesPanel";

export default function WallCalendar() {
  const today = new Date();
 
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [range,     setRange]     = useState<DateRange>({ start: null, end: null });
  const [hoverDay,  setHoverDay]  = useState<number | null>(null);
  const [notes,     setNotes]     = useState<Record<string, string>>({});
 
  const theme    = MONTH_THEMES[viewMonth];
  const monthKey = formatMonthKey(viewYear, viewMonth);
 
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wall-cal-notes");
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);
 
  useEffect(() => {
    document.documentElement.style.setProperty("--color-accent",      theme.accent);
    document.documentElement.style.setProperty("--color-accent-soft", theme.accentSoft);
  }, [theme]);
 
  const prevMonth = useCallback(() => {
    setRange({ start: null, end: null });
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);
 
  const nextMonth = useCallback(() => {
    setRange({ start: null, end: null });
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);
 
  const handleDayClick = useCallback((day: number) => {
    setRange(prev => {
      if (prev.start === null)                     return { start: day, end: null };
      if (prev.end !== null || prev.start === day) return { start: null, end: null };
      if (day < prev.start)                        return { start: day, end: prev.start };
      return { start: prev.start, end: day };
    });
  }, []);
 
  const handleNoteChange = useCallback((text: string) => {
    setNotes(prev => {
      const next = { ...prev, [monthKey]: text };
      try { localStorage.setItem("wall-cal-notes", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [monthKey]);
 
  return (
    /* Page background */
    <div
      className="min-h-screen flex items-start md:items-center justify-center px-4 py-6"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 0%, rgba(29,78,216,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(180,83,9,0.05) 0%, transparent 60%),
          #f6f2ec
        `
      }}
    >
      {/* Calendar card */}
      <div
        className="animate-fade-in w-full max-w-[900px] bg-white rounded-[20px] overflow-hidden flex flex-col md:flex-row md:max-h-[680px]"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.10)" }}
      >
        {/* Notes panel */}
        <NotesPanel
          month={viewMonth}
          year={viewYear}
          accent={theme.accent}
          accentSoft={theme.accentSoft}
          note={notes[monthKey] ?? ""}
          range={range}
          onNoteChange={handleNoteChange}
        />
 
        {/* Main calendar column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-1">
          <SpiralBinding />
 
          <HeroImage
            month={viewMonth}
            year={viewYear}
            accent={theme.accent}
            photoId={theme.photoId}
            label={theme.label}
          />
 
          <MonthNav
            month={viewMonth}
            year={viewYear}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
 
          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            today={today}
            range={range}
            hoverDay={hoverDay}
            onDayClick={handleDayClick}
            onDayHover={setHoverDay}
          />
 
          <RangeDisplay
            range={range}
            month={viewMonth}
            year={viewYear}
            onClear={() => setRange({ start: null, end: null })}
          />
        </div>
      </div>
    </div>
  );
}