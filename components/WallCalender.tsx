"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MONTH_THEMES, DateRange, formatMonthKey } from "@/lib/calendar";
import { playFlipSound, playPopSound } from "@/lib/audio";

import SpiralBinding  from "./calender/SpiralBinding";
import HeroImage      from "./calender/HeroImage";
import MonthNav       from "./calender/MonthNav";
import CalendarGrid   from "./calender/CalenderGrid";
import RangeDisplay   from "./calender/RangeDisplay";
import NotesPanel     from "./calender/NotesPanel";

type AnimDir = "next" | "prev" | null;

export default function WallCalendar() {
  const today = new Date();

  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());
  const [range,      setRange]      = useState<DateRange>({ start: null, end: null });
  const [hoverDay,   setHoverDay]   = useState<number | null>(null);
  const [notes,      setNotes]      = useState<Record<string, string>>({});

  // Animation state
  const [animDir,    setAnimDir]    = useState<AnimDir>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  // "outgoing" page data (the month we're leaving)
  const [outMonth,   setOutMonth]   = useState(today.getMonth());
  const [outYear,    setOutYear]    = useState(today.getFullYear());
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme    = MONTH_THEMES[viewMonth];
  const outTheme = MONTH_THEMES[outMonth];
  const monthKey = formatMonthKey(viewYear, viewMonth);

  const prevTheme = MONTH_THEMES[viewMonth === 0 ? 11 : viewMonth - 1];
  const nextTheme = MONTH_THEMES[viewMonth === 11 ? 0 : viewMonth + 1];

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

  // Cleanup on unmount
  useEffect(() => () => { if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current); }, []);

  const triggerFlip = useCallback((dir: AnimDir, newMonth: number, newYear: number) => {
    if (isFlipping) return;

    // Snapshot outgoing
    setOutMonth(viewMonth);
    setOutYear(viewYear);

    setAnimDir(dir);
    setIsFlipping(true);
    
    // Play the tactile paper flip sound
    playFlipSound();

    // After halfway through (300ms), update the live month
    flipTimeoutRef.current = setTimeout(() => {
      setRange({ start: null, end: null });
      setViewMonth(newMonth);
      setViewYear(newYear);
    }, 320);

    // Animation done at 640ms
    flipTimeoutRef.current = setTimeout(() => {
      setIsFlipping(false);
      setAnimDir(null);
    }, 680);
  }, [isFlipping, viewMonth, viewYear]);

  const prevMonth = useCallback(() => {
    const nm = viewMonth === 0 ? 11 : viewMonth - 1;
    const ny = viewMonth === 0 ? viewYear - 1 : viewYear;
    triggerFlip("prev", nm, ny);
  }, [viewMonth, viewYear, triggerFlip]);

  const nextMonth = useCallback(() => {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    triggerFlip("next", nm, ny);
  }, [viewMonth, viewYear, triggerFlip]);

  const handleDayClick = useCallback((day: number) => {
    // Play the tactile pop sound
    playPopSound();

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
    <div
      className="min-h-screen flex items-start md:items-center justify-center px-4 py-6 md:py-10"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 0%, rgba(29,78,216,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(180,83,9,0.05) 0%, transparent 60%),
          #f6f2ec
        `,
      }}
    >
      {/* Global flip animation keyframes */}
      <style>{`
        /* ── Page flip: NEXT (forward) ─────────────────────────────────────────
           The departing page curls up from bottom-right like a real calendar sheet
           being torn off. The incoming page is revealed beneath it.
        */
        @keyframes pageFlipOutNext {
          0%   { transform: perspective(1200px) rotateX(0deg) translateZ(0px); opacity: 1; transform-origin: top center; }
          40%  { transform: perspective(1200px) rotateX(-25deg) translateZ(20px); opacity: 1; transform-origin: top center; }
          70%  { transform: perspective(1200px) rotateX(-70deg) translateZ(40px); opacity: 0.7; transform-origin: top center; }
          100% { transform: perspective(1200px) rotateX(-95deg) translateZ(60px); opacity: 0; transform-origin: top center; }
        }
        @keyframes pageFlipInNext {
          0%   { transform: perspective(1200px) rotateX(10deg) translateZ(-10px); opacity: 0.2; transform-origin: top center; }
          50%  { transform: perspective(1200px) rotateX(6deg)  translateZ(-5px);  opacity: 0.6; transform-origin: top center; }
          100% { transform: perspective(1200px) rotateX(0deg)  translateZ(0px);   opacity: 1;   transform-origin: top center; }
        }

        /* ── Page flip: PREV (backward) ───────────────────────────────────────
           Like unflipping a page — new page falls from the top downward
        */
        @keyframes pageFlipOutPrev {
          0%   { transform: perspective(1200px) rotateX(0deg) translateZ(0px); opacity: 1; transform-origin: bottom center; }
          40%  { transform: perspective(1200px) rotateX(25deg) translateZ(20px); opacity: 1; transform-origin: bottom center; }
          70%  { transform: perspective(1200px) rotateX(70deg) translateZ(40px); opacity: 0.7; transform-origin: bottom center; }
          100% { transform: perspective(1200px) rotateX(95deg) translateZ(60px); opacity: 0; transform-origin: bottom center; }
        }
        @keyframes pageFlipInPrev {
          0%   { transform: perspective(1200px) rotateX(-10deg) translateZ(-10px); opacity: 0.2; transform-origin: bottom center; }
          50%  { transform: perspective(1200px) rotateX(-6deg)  translateZ(-5px);  opacity: 0.6; transform-origin: bottom center; }
          100% { transform: perspective(1200px) rotateX(0deg)   translateZ(0px);   opacity: 1;   transform-origin: bottom center; }
        }

        /* Page shadow during flip */
        @keyframes pageShadowPulse {
          0%, 100% { box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.10); }
          50%       { box-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 20px 48px rgba(0,0,0,0.18), 0 40px 80px rgba(0,0,0,0.18); }
        }

        /* Curl edge highlight — the "paper" shimmer during flip */
        .page-outgoing::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.0) 0%,
            rgba(255,255,255,0.05) 40%,
            rgba(255,255,255,0.25) 70%,
            rgba(255,255,255,0.55) 88%,
            rgba(240,235,228,0.95) 100%
          );
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .page-outgoing.flipping::after { opacity: 1; }

        @media (min-width: 768px) {
          .cal-card { flex-direction: row !important; }
        }

        .animate-fade-in { animation: fadeIn 0.25s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Outer card wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: "905px",
          position: "relative",
          animation: isFlipping ? "pageShadowPulse 0.68s ease" : "none",
        }}
      >
        {/* ── OUTGOING PAGE (animates away) ── */}
        {isFlipping && (
          <div
            className={`page-outgoing flipping`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              borderRadius: "20px",
              overflow: "hidden",
              backgroundColor: "white",
              backfaceVisibility: "hidden",
              animation: animDir === "next"
                ? "pageFlipOutNext 0.36s cubic-bezier(0.4, 0, 0.8, 0.6) forwards"
                : "pageFlipOutPrev 0.36s cubic-bezier(0.4, 0, 0.8, 0.6) forwards",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.10)",
              pointerEvents: "none",
            }}
          >
            <SpiralBinding />
            <div className="cal-card" style={{ display: "flex", flexDirection: "column", width: "100%", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <HeroImage
                  month={outMonth}
                  year={outYear}
                  accent={outTheme.accent}
                  imageUrl={outTheme.imageUrl}
                  label={outTheme.label}
                />
                <MonthNav
                  month={outMonth}
                  year={outYear}
                  onPrev={() => {}}
                  onNext={() => {}}
                />
                <CalendarGrid
                  year={outYear}
                  month={outMonth}
                  today={today}
                  range={range}
                  hoverDay={null}
                  onDayClick={() => {}}
                  onDayHover={() => {}}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── INCOMING / LIVE PAGE ── */}
        <div
          className="animate-fade-in w-full bg-white"
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.10)",
            position: "relative",
            zIndex: isFlipping ? 1 : 2,
            animation: isFlipping
              ? (animDir === "next"
                  ? "pageFlipInNext 0.36s 0.32s cubic-bezier(0.2, 0, 0.4, 1) both"
                  : "pageFlipInPrev 0.36s 0.32s cubic-bezier(0.2, 0, 0.4, 1) both")
              : "none",
          }}
        >
          <SpiralBinding />

          <div
            className="cal-card"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              minHeight: 0,
              borderRadius: "0 0 20px 20px",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
              <HeroImage
                month={viewMonth}
                year={viewYear}
                accent={theme.accent}
                imageUrl={theme.imageUrl}
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

            <NotesPanel
              month={viewMonth}
              year={viewYear}
              accent={theme.accent}
              accentSoft={theme.accentSoft}
              note={notes[monthKey] ?? ""}
              range={range}
              onNoteChange={handleNoteChange}
            />
          </div>
        </div>
      </div>

      {/* Preload adjacent months' images to prevent flashing on navigate */}
      <div style={{ display: "none" }} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prevTheme.imageUrl} alt="" rel="preload" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={nextTheme.imageUrl} alt="" rel="preload" />
      </div>
    </div>
  );
}