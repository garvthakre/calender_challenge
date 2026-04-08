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
  if (isSelected)    bgColor = "var(--color-accent)";
  else if (isInRange) bgColor = "var(--color-accent-soft)";

  // Text color — weekends get red tint, national holidays too
  let textColor = "#1c1917";
  if (isWeekend && !isSelected && !isInRange) textColor = "#b91c1c";
  else if (holiday?.type === "national" && !isSelected && !isInRange) textColor = "#b91c1c";
  else if (holiday?.type === "festival" && !isSelected && !isInRange) textColor = "#b45309";

  if (isSelected)    textColor = "#fff";
  else if (isInRange) textColor = "var(--color-accent)";
  else if (isToday && !isWeekend) textColor = "var(--color-accent)";

  const fontWeight = isSelected ? "700" : isInRange ? "500" : isToday ? "600" : isWeekend ? "500" : "400";

  const outline      = isToday && !isSelected ? "2px solid var(--color-accent)" : "none";
  const outlineOffset = isToday && !isSelected ? "-2px" : "0";

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
        .day-cell-hoverable:active { transform: scale(0.85); }
      `}</style>
      <div
        role="button"
        tabIndex={0}
        className={`relative flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-[120ms] ease-in-out ${hoverClass}`}
        style={{
          aspectRatio: "1",
          background: bgColor,
          borderRadius,
          outline,
          outlineOffset,
          minWidth: "32px",
          minHeight: "32px",
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

        {/* Weekend subtle underline bar */}
        {isWeekend && !isSelected && !isInRange && (
          <span
            className="absolute bottom-[4px] w-[12px] h-[1.5px] rounded-full pointer-events-none opacity-40"
            style={{ background: "#b91c1c" }}
          />
        )}

        {/* Holiday dot */}
        {holiday && (
          <span
            className="absolute bottom-[3px] w-[4px] h-[4px] rounded-full pointer-events-none"
            style={{
              background: isSelected ? "rgba(255,255,255,0.85)" : holidayDotColor,
              bottom: isWeekend ? "2px" : "3px",
            }}
          />
        )}
      </div>
    </>
  );
}