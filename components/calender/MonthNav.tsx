import { MONTH_NAMES } from "@/lib/calendar";

interface MonthNavProps {
  month:  number;
  year:   number;
  onPrev: () => void;
  onNext: () => void;
}
 
export default function MonthNav({ month, year, onPrev, onNext }: MonthNavProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0ece6] shrink-0">
      <NavBtn onClick={onPrev} label="Previous month">‹</NavBtn>
 
      <div className="text-center">
        <div
          className="text-[22px] font-semibold text-[#1c1917] tracking-[-0.3px] leading-[1.1]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {MONTH_NAMES[month]}
        </div>
        <div className="text-[11px] font-normal text-[#a8a29e] tracking-[2px] mt-[1px]">
          {year}
        </div>
      </div>
 
      <NavBtn onClick={onNext} label="Next month">›</NavBtn>
    </div>
  );
}
 
function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      className="w-10 h-10 rounded-full border-[1.5px] border-[#e2ddd6] bg-white text-[#57534e] text-xl flex items-center justify-center shrink-0 transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] active:scale-90 select-none touch-manipulation"
      onClick={onClick}
      aria-label={label}
      style={{ lineHeight: 1 }}
    >
      {children}
    </button>
  );
}