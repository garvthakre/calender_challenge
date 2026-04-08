import { MONTH_NAMES, DateRange } from "@/lib/calendar";
interface NotesPanelProps {
  month:        number;
  year:         number;
  accent:       string;
  accentSoft:   string;
  note:         string;
  range:        DateRange;
  onNoteChange: (t: string) => void;
}
 
export default function NotesPanel({
  month, year, accent, accentSoft, note, range, onNoteChange,
}: NotesPanelProps) {
  const name = MONTH_NAMES[month];
 
  return (
    <aside className="notes-panel">
      {/* Title */}
      <div>
        <div className="notes-title">Notes</div>
        <div className="notes-sub">{name} {year}</div>
        <div className="notes-rule" style={{ background: accent }} />
      </div>
 
      {/* Range pill */}
      {range.start && (
        <div className="notes-range-pill" style={{ borderLeftColor: accent, background: accentSoft }}>
          <span style={{ fontWeight: 600, color: accent }}>
            {range.start}{range.end ? ` – ${range.end}` : ""}
          </span>{" "}{name}
          {range.end && (
            <span style={{ display: "block", fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>
              {range.end - range.start + 1} days
            </span>
          )}
        </div>
      )}
 
      {/* Textarea */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <textarea
          className="notes-textarea"
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder={`Notes for ${name}…`}
          style={{ flex: 1 }}
        />
        <div className="notes-footer">
          <span>
            <span className="notes-saved-dot" />
            Auto-saved
          </span>
          <span>{note.length} chars</span>
        </div>
      </div>
 
      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="notes-legend-title">Legend</div>
        {[
          { bg: accent,       border: "none",                          label: "Selected day" },
          { bg: accentSoft,   border: `1.5px solid ${accent}55`,      label: "Date range" },
          { bg: "transparent",border: `2px solid ${accent}`,          label: "Today" },
          { bg: "#b45309",    border: "none",                          label: "Holiday" },
        ].map(({ bg, border, label }) => (
          <div key={label} className="notes-legend-item">
            <span className="legend-swatch" style={{ background: bg, border }} />
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}