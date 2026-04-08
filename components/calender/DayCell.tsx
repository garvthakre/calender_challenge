"use client";

interface DayCellProps {
  day:       number;
  isToday:   boolean;
  isStart:   boolean;
  isEnd:     boolean;
  isInRange: boolean;
  isWeekend: boolean;
  holiday:   string | null;
  accent:    string;
  accentSoft:string;
  onClick:   () => void;
  onMouseEnter: () => void;
}

export default function DayCell({
  day, isToday, isStart, isEnd, isInRange,
  isWeekend, holiday, accent, accentSoft,
  onClick, onMouseEnter,
}: DayCellProps) {

  const isSelected = isStart || isEnd;

  // Visual state priority: selected > range > today > weekend > default
  let cellBg     = "transparent";
  let cellColor  = isWeekend ? "var(--weekend)" : "var(--ink)";
  let fontWeight = "400";
  let borderRadius = "50%";
  let outline    = "none";

  if (isSelected) {
    cellBg    = accent;
    cellColor = "#ffffff";
    fontWeight = "600";
  } else if (isInRange) {
    cellBg      = accentSoft;
    cellColor   = accent;
    fontWeight  = "500";
    borderRadius = isStart ? "50% 0 0 50%" : isEnd ? "0 50% 50% 0" : "0";
  } else if (isToday) {
    outline    = `2px solid ${accent}`;
    cellColor  = accent;
    fontWeight = "600";
  }

  // Range shape: flatten edges between start→end
  if (isInRange) borderRadius = "0";
  if (isStart)   borderRadius = "50% 0 0 50%";
  if (isEnd)     borderRadius = "0 50% 50% 0";
  if (isSelected && !isInRange) borderRadius = "50%";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={e => e.key === "Enter" && onClick()}
      title={holiday ?? undefined}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        aspectRatio: "1",
        cursor: "pointer",
        borderRadius,
        background: cellBg,
        outline,
        outlineOffset: "-2px",
        transition: "background 0.12s ease, transform 0.1s ease",
        userSelect: "none",
      }}
      onMouseDown={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(0.88)"; }}
      onMouseUp={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
    >
      <span style={{
        fontSize: "clamp(11px, 1.8vw, 13.5px)",
        fontWeight,
        color: cellColor,
        lineHeight: 1,
        fontFamily: "var(--font-body)",
      }}>
        {day}
      </span>

      {/* Holiday dot */}
      {holiday && (
        <span style={{
          position: "absolute",
          bottom: "3px",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          background: isSelected ? "rgba(255,255,255,0.8)" : "var(--holiday-dot)",
        }} />
      )}
    </div>
  );
}