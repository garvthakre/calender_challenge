interface DayCellProps {
  day:          number;
  isToday:      boolean;
  isStart:      boolean;
  isEnd:        boolean;
  isInRange:    boolean;
  isWeekend:    boolean;
  holiday:      string | null;
  onClick:      () => void;
  onMouseEnter: () => void;
}

export default function DayCell({
  day, isToday, isStart, isEnd, isInRange,
  isWeekend, holiday, onClick, onMouseEnter,
}: DayCellProps) {
  const isSelected = isStart || isEnd;

  // Determine border-radius for range pill shape
  let borderRadius = "9999px";
  if (isInRange && !isSelected) borderRadius = "0";
  if (isInRange && isStart)     borderRadius = "9999px 0 0 9999px";
  if (isInRange && isEnd)       borderRadius = "0 9999px 9999px 0";
  if (isSelected)               borderRadius = "9999px";

  // Background color
  let bgColor = "transparent";
  if (isSelected)   bgColor = "var(--color-accent)";
  else if (isInRange) bgColor = "var(--color-accent-soft)";

  // Text color
  let textColor = isWeekend ? "#dc2626" : "#1c1917";
  if (isSelected)    textColor = "#fff";
  else if (isInRange) textColor = "var(--color-accent)";
  else if (isToday)  textColor = "var(--color-accent)";
  
  // Light background for weekends
  let weekendBg = isWeekend && !isSelected && !isInRange ? "rgba(220, 38, 38, 0.03)" : "transparent";
  if (isSelected || isInRange) weekendBg = "transparent";

  const fontWeight = isSelected ? "700" : isInRange ? "500" : isToday ? "600" : "400";

  const outline = isToday && !isSelected ? "2px solid var(--color-accent)" : "none";
  const outlineOffset = isToday && !isSelected ? "-2px" : "0";

  // Build a unique class name for hover — only apply hover bg when not selected/in-range
  const hoverClass = !isSelected && !isInRange ? "day-cell-hoverable" : "";

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .day-cell-hoverable:hover,
          .day-cell-hoverable:focus-visible {
            background: var(--color-accent-soft) !important;
            border-radius: 9999px !important;
          }
        }
        .day-cell-hoverable:active {
          transform: scale(0.85);
        }
      `}</style>
      <div
        role="button"
        tabIndex={0}
        className={`relative flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-[120ms] ease-in-out active:scale-[0.85] ${hoverClass}`}
        style={{
          aspectRatio: "1",
          background: bgColor || weekendBg,
          borderRadius,
          outline,
          outlineOffset,
          minWidth: "36px",
          minHeight: "36px",
          touchAction: "manipulation",
        }}
        onClick={onClick}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") {
            onMouseEnter();
          }
        }}
        onKeyDown={e => e.key === "Enter" && onClick()}
        title={holiday ?? undefined}
        aria-label={`Day ${day}${holiday ? `, ${holiday}` : ""}${isToday ? ", today" : ""}`}
      >
        <span
          className="text-[clamp(11px,2.2vw,13.5px)] leading-none pointer-events-none transition-colors duration-[120ms]"
          style={{ color: textColor, fontWeight, fontFamily: "var(--font-body)" }}
        >
          {day}
        </span>

        {holiday && (
          <>
            <style>{`
              .holiday-tooltip {
                position: absolute;
                bottom: 110%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
                z-index: 50;
                margin-bottom: 4px;
              }
              .day-cell-hoverable:hover .holiday-tooltip,
              [role="button"]:hover .holiday-tooltip {
                opacity: 1;
              }
            `}</style>
            <span className="holiday-tooltip">
              {holiday}
            </span>
            <span
              className="absolute bottom-[4px] flex items-center justify-center pointer-events-none"
              style={{}}
            >
              <span
                className="w-[4.5px] h-[4.5px] rounded-full animate-pulse-subtle"
                style={{ 
                  background: isSelected ? "rgba(255,255,255,0.95)" : "#b45309",
                  boxShadow: isSelected ? "0 0 0 2.5px rgba(180,83,9,0.2)" : "0 0 0 2.5px rgba(180,83,9,0.12)"
                }}
              />
            </span>
          </>
        )}
      </div>
    </>
  );
}
