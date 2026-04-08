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
    { bg: accent,       border: "none",                     label: "Selected day" },
    { bg: accentSoft,   border: `1.5px solid ${accent}55`,  label: "Date range" },
    { bg: "transparent",border: `2px solid ${accent}`,      label: "Today" },
    { bg: "#b45309",    border: "none",                     label: "Holiday" },
  ];
 
  return (
    <aside
      className="flex flex-col gap-[14px] px-[18px] py-5 order-2 border-b border-[#e2ddd6] md:order-none md:border-b-0 md:border-r md:w-[210px] md:min-w-[210px] md:overflow-y-auto"
      style={{ background: "#faf7f2" }}
    >
      {/* Title */}
      <div>
        <div
          className="text-[18px] font-semibold text-[#1c1917] leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Notes
        </div>
        <div className="text-[11px] text-[#a8a29e] mt-[3px]">{name} {year}</div>
        <div className="w-7 h-[2px] rounded-sm mt-[10px]" style={{ background: accent }} />
      </div>
 
      {/* Range pill */}
      {range.start && (
        <div
          className="px-[10px] py-2 rounded-lg text-[12px] text-[#57534e] leading-[1.5] border-l-[3px]"
          style={{ borderLeftColor: accent, background: accentSoft }}
        >
          <span className="font-semibold" style={{ color: accent }}>
            {range.start}{range.end ? ` – ${range.end}` : ""}
          </span>{" "}{name}
          {range.end && (
            <span className="block text-[11px] text-[#a8a29e] mt-[2px]">
              {range.end - range.start + 1} days
            </span>
          )}
        </div>
      )}
 
      {/* Textarea */}
      <div className="flex-1 flex flex-col gap-[6px]">
        <textarea
          className="flex-1 min-h-[90px] resize-none rounded-[10px] px-3 py-[10px] text-[13px] leading-[1.7] text-[#1c1917] bg-white outline-none transition-all duration-150 w-full placeholder:text-[#a8a29e]"
          style={{
            border: "1.5px solid #e2ddd6",
            fontFamily: "var(--font-body)",
          }}
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder={`Notes for ${name}…`}
          onFocus={e => {
            e.target.style.borderColor = accent;
            e.target.style.boxShadow = `0 0 0 3px ${accentSoft}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e2ddd6";
            e.target.style.boxShadow = "none";
          }}
        />
        <div className="flex justify-between text-[10px] text-[#a8a29e]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-[5px] h-[5px] rounded-full bg-green-500" />
            Auto-saved
          </span>
          <span>{note.length} chars</span>
        </div>
      </div>
 
      {/* Legend */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#a8a29e] pt-[14px] border-t border-[#e2ddd6]">
          Legend
        </div>
        {legendItems.map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-2 text-[11px] text-[#57534e]">
            <span
              className="w-[13px] h-[13px] rounded-full shrink-0"
              style={{ background: bg, border }}
            />
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}