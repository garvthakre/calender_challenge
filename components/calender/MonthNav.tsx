import { MONTH_NAMES } from "@/lib/calendar";

interface MonthNavProps {
  month:     number;
  year:      number;
  accent:    string;
  onPrev:    () => void;
  onNext:    () => void;
}

export default function MonthNav({ month, year, accent, onPrev, onNext }: MonthNavProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px 10px",
      borderBottom: "1px solid var(--border-light)",
    }}>
      <NavButton onClick={onPrev} accent={accent} dir="prev" />

      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          fontWeight: 600,
          color: "var(--ink)",
          letterSpacing: "-0.3px",
        }}>
          {MONTH_NAMES[month]}
        </div>
        <div style={{
          fontSize: "12px",
          fontWeight: 400,
          color: "var(--ink-muted)",
          letterSpacing: "1.5px",
          marginTop: "1px",
        }}>
          {year}
        </div>
      </div>

      <NavButton onClick={onNext} accent={accent} dir="next" />
    </div>
  );
}

function NavButton({ onClick, accent, dir }: { onClick: () => void; accent: string; dir: "prev" | "next" }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "1.5px solid var(--border)",
        background: "var(--surface)",
        color: "var(--ink-light)",
        fontSize: "17px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
        (e.currentTarget as HTMLButtonElement).style.color = accent;
        (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-soft)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-light)";
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
      }}
      aria-label={dir === "prev" ? "Previous month" : "Next month"}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}