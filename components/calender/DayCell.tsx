interface DayCellProps {
  day:         number;
  isToday:     boolean;
  isStart:     boolean;
  isEnd:       boolean;
  isInRange:   boolean;
  isWeekend:   boolean;
  holiday:     string | null;
  onClick:     () => void;
  onMouseEnter:() => void;
}

export default function DayCell({
  day, isToday, isStart, isEnd, isInRange,
  isWeekend, holiday, onClick, onMouseEnter,
}: DayCellProps) {

  // Build class list
  const classes = [
    "day-cell",
    isWeekend  ? "weekend"    : "",
    isToday    ? "today"      : "",
    (isStart || isEnd) ? "selected" : "",
    isInRange  ? "in-range"   : "",
    isStart && isInRange ? "range-start" : "",
    isEnd   && isInRange ? "range-end"   : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      role="button"
      tabIndex={0}
      className={classes}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={e => e.key === "Enter" && onClick()}
      title={holiday ?? undefined}
      aria-label={`Day ${day}${holiday ? `, ${holiday}` : ""}${isToday ? ", today" : ""}`}
    >
      <span className="day-num">{day}</span>
      {holiday && <span className="holiday-dot" />}
    </div>
  );
}