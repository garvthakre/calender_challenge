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
 
  const legendItems = [
    { bg: accent,        border: "none",                    label: "Selected day" },
    { bg: accentSoft,    border: `1.5px solid ${accent}55`, label: "In range" },
    { bg: "transparent", border: `2px solid ${accent}`,     label: "Today" },
    { bg: "#b45309",     border: "none",                    label: "Holiday" },
  ];
 
  return (
    <aside
      style={{
        background: "#faf7f2",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        flexShrink: 0,
        width: "100%",
        borderBottom: "1px solid #e2ddd6",
        overflowY: "auto",
      }}
      className="notes-panel"
    >
      <style>{`
        @media (min-width: 768px) {
          .notes-panel {
            width: 240px !important;
            min-width: 240px !important;
            max-width: 240px !important;
            border-bottom: none !important;
            border-right: 1px solid #e2ddd6 !important;
            order: -1 !important;
          }
        }
      `}</style>
 
      {/* Title */}
      <div style={{ flexShrink: 0 }}>
        <p style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#1c1917",
          lineHeight: 1,
          fontFamily: "var(--font-display)",
          margin: 0,
        }}>
          Notes
        </p>
        <p style={{ fontSize: "11px", color: "#a8a29e", marginTop: "4px", letterSpacing: "0.05em" }}>
          {name} {year}
        </p>
        <div style={{ width: "28px", height: "2.5px", borderRadius: "999px", marginTop: "10px", background: accent }} />
      </div>
 
      {/* Range pill */}
      {range.start && (
        <div style={{
          flexShrink: 0,
          padding: "10px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          lineHeight: 1.6,
          borderLeft: `3px solid ${accent}`,
          background: accentSoft,
        }}>
          <span style={{ fontWeight: 600, display: "block", color: accent }}>
            {name} {range.start}{range.end ? ` – ${range.end}` : ""}
          </span>
          {range.end && (
            <span style={{ fontSize: "11px", color: "#a8a29e", marginTop: "2px", display: "block" }}>
              {range.end - range.start + 1} days selected
            </span>
          )}
        </div>
      )}
 
      {/* Textarea */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minHeight: 0 }}>
        <textarea
          style={{
            width: "100%",
            resize: "none",
            borderRadius: "10px",
            padding: "10px 12px",
            fontSize: "13px",
            lineHeight: 1.7,
            color: "#1c1917",
            background: "white",
            outline: "none",
            border: "1.5px solid #e2ddd6",
            fontFamily: "var(--font-body)",
            minHeight: "110px",
            flex: "1 1 auto",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxSizing: "border-box",
          }}
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder={`Notes for ${name}…`}
          onFocus={e => {
            e.target.style.borderColor = accent;
            e.target.style.boxShadow   = `0 0 0 3px ${accentSoft}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e2ddd6";
            e.target.style.boxShadow   = "none";
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#b8b3ae" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80" }} />
            Auto-saved
          </span>
          <span>{note.length} chars</span>
        </div>
      </div>
 
      {/* Legend */}
      <div style={{ flexShrink: 0, paddingTop: "12px", borderTop: "1px solid #e2ddd6" }}>
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a8a29e", marginBottom: "10px" }}>
          Legend
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {legendItems.map(({ bg, border, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                flexShrink: 0,
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: bg,
                border,
                display: "inline-block",
              }} />
              <span style={{ fontSize: "12px", color: "#57534e", lineHeight: 1 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}