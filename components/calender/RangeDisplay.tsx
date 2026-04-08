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
    <div
      className="animate-fade-up mx-[14px] mb-3 px-[14px] py-[10px] rounded-xl flex items-center justify-between gap-[10px]"
      style={{
        background: "var(--color-accent-soft)",
        border: "1px solid rgba(29,78,216,0.15)"
      }}
    >
      <div>
        <div
          className="text-[10px] font-semibold tracking-[0.8px] uppercase mb-[2px]"
          style={{ color: "var(--color-accent)" }}
        >
          Selected
        </div>
        <div className="text-[13px] font-semibold text-[#1c1917]">{label}</div>
        {count && (
          <div className="text-[11px] text-[#a8a29e] mt-[1px]">
            {count} {count === 1 ? "day" : "days"}
          </div>
        )}
      </div>
 
      <button
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[18px] transition-all duration-150 hover:bg-[rgba(29,78,216,0.1)] active:scale-[0.88] touch-manipulation"
        style={{
          border: "1.5px solid rgba(29,78,216,0.25)",
          color: "var(--color-accent)",
          background: "transparent"
        }}
        onClick={onClear}
        aria-label="Clear selection"
        title="Clear selection"
      >
        ×
      </button>
    </div>
  );
}