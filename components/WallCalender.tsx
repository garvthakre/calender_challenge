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
  const [isMobile,  setIsMobile]  = useState(false);

  const theme    = MONTH_THEMES[viewMonth];
  const monthKey = formatMonthKey(viewYear, viewMonth);

  // ── Load notes from localStorage ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wall-cal-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // ── Responsive breakpoint ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Month navigation ──
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

  // ── Day click: build range ──
  const handleDayClick = useCallback((day: number) => {
    setRange(prev => {
      // Nothing selected → set start
      if (prev.start === null) return { start: day, end: null };
      // Both selected or clicked same start → reset
      if (prev.end !== null || prev.start === day) return { start: null, end: null };
      // Set end (swap if needed)
      if (day < prev.start) return { start: day, end: prev.start };
      return { start: prev.start, end: day };
    });
  }, []);

  // ── Save note ──
  const handleNoteChange = useCallback((text: string) => {
    setNotes(prev => {
      const updated = { ...prev, [monthKey]: text };
      try { localStorage.setItem("wall-cal-notes", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, [monthKey]);

  // ── CSS variable injection for accent ──
  useEffect(() => {
    document.documentElement.style.setProperty("--accent",      theme.accent);
    document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
  }, [theme]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "860px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        background: "var(--surface)",
        /* Subtle paper texture */
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E\")",
      }}>

        {/* Notes panel (left on desktop, bottom on mobile) */}
        <NotesPanel
          month={viewMonth}
          year={viewYear}
          accent={theme.accent}
          accentSoft={theme.accentSoft}
          note={notes[monthKey] ?? ""}
          range={range}
          onNoteChange={handleNoteChange}
          isMobile={isMobile}
        />

        {/* Right: actual calendar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <SpiralBinding accent={theme.accent} />

          <HeroImage
            month={viewMonth}
            year={viewYear}
            accent={theme.accent}
            keyword={theme.keyword}
            label={theme.label}
          />

          <MonthNav
            month={viewMonth}
            year={viewYear}
            accent={theme.accent}
            onPrev={prevMonth}
            onNext={nextMonth}
          />

          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            today={today}
            range={range}
            hoverDay={hoverDay}
            accent={theme.accent}
            accentSoft={theme.accentSoft}
            onDayClick={handleDayClick}
            onDayHover={setHoverDay}
          />

          <RangeDisplay
            range={range}
            month={viewMonth}
            year={viewYear}
            accent={theme.accent}
            accentSoft={theme.accentSoft}
            onClear={() => setRange({ start: null, end: null })}
          />
        </div>
      </div>
    </div>
  );
}