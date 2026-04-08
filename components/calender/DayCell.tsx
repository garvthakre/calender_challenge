import { Holiday } from "@/lib/calendar";

interface DayCellProps {
  day:          number;
  isToday:      boolean;
  isStart:      boolean;
  isEnd:        boolean;
  isInRange:    boolean;
  isWeekend:    boolean;
  holiday:      Holiday | null;
  onClick:      () => void;
  onMouseEnter: () => void;
}

export default function DayCell({
  day, isToday, isStart, isEnd, isInRange,
  isWeekend, holiday, onClick, onMouseEnter,
}: DayCellProps) {
  const isSelected = isStart || isEnd;

  // Whether the holiday label is visible (not hidden by selection/range styling)
  const showLabel = !!holiday && !isSelected && !isInRange;

  // Dot color for holiday type
  const holidayDotColor = holiday?.type === "national"
    ? "#dc2626"
    : holiday?.type === "festival"
    ? "#d97706"
    : "#8b5cf6";

  // Border-radius for range pill shape
  let borderRadius = "9999px";
  if (isInRange && !isSelected) borderRadius = "0";
  if (isInRange && isStart)     borderRadius = "9999px 0 0 9999px";
  if (isInRange && isEnd)       borderRadius = "0 9999px 9999px 0";
  if (isSelected)               borderRadius = "9999px";

  // Background
  let bgColor = "transparent";
  if (isSelected)     bgColor = "var(--color-accent)";
  else if (isInRange) bgColor = "var(--color-accent-soft)";

  // Text color
  let textColor = "#1c1917";
  if (isWeekend && !isSelected && !isInRange)                          textColor = "#b91c1c";
  else if (holiday?.type === "national" && !isSelected && !isInRange)  textColor = "#b91c1c";
  else if (holiday?.type === "festival" && !isSelected && !isInRange)  textColor = "#b45309";

  if (isSelected)                      textColor = "#fff";
  else if (isInRange)                  textColor = "var(--color-accent)";
  else if (isToday && !isWeekend)      textColor = "var(--color-accent)";

  const fontWeight = isSelected ? "700" : isInRange ? "500" : isToday ? "600" : isWeekend ? "500" : "400";

  const outline       = isToday && !isSelected ? "2px solid var(--color-accent)" : "none";
  const outlineOffset = isToday && !isSelected ? "-2px" : "0";

  const hoverClass = !isSelected && !isInRange ? "day-cell-hoverable" : "";

  // Label badge colours
  const labelColor = holiday?.type === "national"
    ? "#dc2626"
    : holiday?.type === "festival"
    ? "#d97706"
    : "#8b5cf6";

  const labelBg = holiday?.type === "national"
    ? "rgba(220,38,38,0.10)"
    : holiday?.type === "festival"
    ? "rgba(217,119,6,0.10)"
    : "rgba(139,92,246,0.10)";

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
        .day-cell-hoverable:active { transform: scale(0.85); }

        .holiday-label {
          font-size: clamp(6px, 1.5vw, 9px);
          line-height: 1;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          padding: 1px 3px;
          border-radius: 3px;
          pointer-events: none;
          user-select: none;
          transition: color 0.12s ease, background 0.12s ease;
        }
      `}</style>

      <div
        role="button"
        tabIndex={0}
        className={`relative flex flex-col items-center cursor-pointer select-none transition-all duration-[120ms] ease-in-out ${hoverClass}`}
        style={{
          // Only holiday-label cells break the square — all others stay perfectly centered
          aspectRatio:    showLabel ? "auto" : "1",
          minHeight:      showLabel ? "clamp(38px, 7.5vw, 48px)" : undefined,
          paddingTop:     showLabel ? "clamp(4px, 1vw, 6px)" : "0",
          paddingBottom:  showLabel ? "clamp(3px, 0.8vw, 5px)" : "0",
          justifyContent: showLabel ? "flex-start" : "center",
          background:     bgColor,
          borderRadius,
          outline,
          outlineOffset,
          minWidth: "32px",
          touchAction: "manipulation",
        }}
        onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") onMouseEnter(); }}
        onKeyDown={e => e.key === "Enter" && onClick()}
        title={holiday?.name ?? undefined}
        aria-label={`Day ${day}${holiday ? `, ${holiday.name}` : ""}${isToday ? ", today" : ""}`}
      >
        <span
          className="text-[clamp(11px,2.2vw,13px)] leading-none pointer-events-none transition-colors duration-[120ms]"
          style={{ color: textColor, fontWeight, fontFamily: "var(--font-body)" }}
        >
          {day}
        </span>

        {/* Weekend underline bar — only when no holiday label */}
        {isWeekend && !isSelected && !isInRange && !holiday && (
          <span
            className="w-[12px] h-[1.5px] rounded-full pointer-events-none opacity-40 mt-[3px]"
            style={{ background: "#b91c1c", flexShrink: 0 }}
          />
        )}

        {/* Holiday name label — only when not selected / in-range */}
        {showLabel && (
          <span
            className="holiday-label mt-[2px]"
            style={{ color: labelColor, background: labelBg }}
          >
            {holiday!.shortName}
          </span>
        )}

        {/* Holiday dot — only when selected or in-range (circle/pill, no room for text) */}
        {holiday && (isSelected || isInRange) && (
          <span
            className="absolute bottom-[3px] w-[4px] h-[4px] rounded-full pointer-events-none"
            style={{
              background: isSelected ? "rgba(255,255,255,0.85)" : holidayDotColor,
            }}
          />
        )}
      </div>
    </>
  );
}