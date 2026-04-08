import { MONTH_NAMES } from "@/lib/calendar";

interface MonthNavProps {
  month:  number;
  year:   number;
  onPrev: () => void;
  onNext: () => void;
}
 
export default function MonthNav({ month, year, onPrev, onNext }: MonthNavProps) {
  return (
    <div className="month-nav">
      <button className="nav-btn" onClick={onPrev} aria-label="Previous month">
        ‹
      </button>
 
      <div className="month-nav-title">
        <div className="month-nav-name">{MONTH_NAMES[month]}</div>
        <div className="month-nav-year">{year}</div>
      </div>
 
      <button className="nav-btn" onClick={onNext} aria-label="Next month">
        ›
      </button>
    </div>
  );
}
 