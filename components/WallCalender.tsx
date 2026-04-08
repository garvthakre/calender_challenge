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
 
  // Load notes
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wall-cal-notes");
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);
 
  // Inject accent CSS vars whenever month changes
  useEffect(() => {
    document.documentElement.style.setProperty("--accent",      theme.accent);
    document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
  }, [theme]);
 
  // ── Month navigation ──────────────────────────────────────────────────────
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
 
  // ── Day range selection ───────────────────────────────────────────────────
  const handleDayClick = useCallback((day: number) => {
    setRange(prev => {
      if (prev.start === null)                    return { start: day, end: null };
      if (prev.end !== null || prev.start === day) return { start: null, end: null };
      if (day < prev.start)                        return { start: day, end: prev.start };
      return { start: prev.start, end: day };
    });
  }, []);
 
  // ── Notes save ────────────────────────────────────────────────────────────
  const handleNoteChange = useCallback((text: string) => {
    setNotes(prev => {
      const next = { ...prev, [monthKey]: text };
      try { localStorage.setItem("wall-cal-notes", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [monthKey]);
 
  return (
    <div className="page-bg">
      <div className="cal-card animate-fade-in">
 
        {/* LEFT: Notes panel (desktop) / BOTTOM: (mobile) */}
        <NotesPanel
          month={viewMonth}
          year={viewYear}
          accent={theme.accent}
          accentSoft={theme.accentSoft}
          note={notes[monthKey] ?? ""}
          range={range}
          onNoteChange={handleNoteChange}
        />
 
        {/* RIGHT / MAIN: calendar column */}
        <div className="cal-main">
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