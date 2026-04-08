import { MONTH_NAMES, DateRange } from "@/lib/calendar";

interface RangeDisplayProps {
  range:   DateRange;
  month:   number;
  year:    number;
  onClear: () => void;
}
 
export default function RangeDisplay({ range, month, year, onClear }: RangeDisplayProps) {
  if (!range.start) return null;
 
  const name  = MONTH_NAMES[month];
  const label = range.end
    ? `${name} ${range.start} – ${range.end}, ${year}`
    : `From ${name} ${range.start}…`;
  const count = range.end ? range.end - range.start + 1 : null;
 
  return (
    <div className="range-bar animate-fade-up">
      <div className="range-bar-text">
        <div className="range-bar-label">Selected</div>
        <div className="range-bar-dates">{label}</div>
        {count && (
          <div className="range-bar-count">{count} {count === 1 ? "day" : "days"}</div>
        )}
      </div>
 
      <button
        className="range-clear-btn"
        onClick={onClear}
        aria-label="Clear selection"
        title="Clear selection"
      >
        ×
      </button>
    </div>
  );
}