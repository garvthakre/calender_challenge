import { MONTH_NAMES, DateRange } from "@/lib/calendar";

interface RangeDisplayProps {
  range:   DateRange;
  month:   number;
  year:    number;
  accent:  string;
  accentSoft: string;
  onClear: () => void;
}

export default function RangeDisplay({ range, month, year, accent, accentSoft, onClear }: RangeDisplayProps) {
  if (!range.start && !range.end) return null;

  const monthName = MONTH_NAMES[month];

  const label = range.start && range.end
    ? `${monthName} ${range.start} – ${range.end}, ${year}`
    : range.start
    ? `From ${monthName} ${range.start}…`
    : null;

  const daysCount = range.start && range.end ? range.end - range.start + 1 : null;

  return (
    <div style={{
      margin: "0 16px 14px",
      padding: "10px 14px",
      background: accentSoft,
      borderRadius: "10px",
      border: `1px solid ${accent}30`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
      animation: "fadeUp 0.2s ease",
    }}>
      <div>
        <div style={{ fontSize: "11px", color: accent, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "2px" }}>
          Selected Range
        </div>
        <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>
          {label}
        </div>
        {daysCount && (
          <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "1px" }}>
            {daysCount} {daysCount === 1 ? "day" : "days"}
          </div>
        )}
      </div>

      <button
        onClick={onClear}
        style={{
          flexShrink: 0,
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          border: `1px solid ${accent}40`,
          background: "transparent",
          color: accent,
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        aria-label="Clear selection"
        title="Clear selection"
      >
        ×
      </button>
    </div>
  );
}