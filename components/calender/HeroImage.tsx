"use client";
import { useState } from "react";
import { MONTH_NAMES } from "@/lib/calendar";
import SeasonalOverlay from "./SeasonalOverlay";

interface HeroImageProps {
  month:    number;
  year:     number;
  accent:   string;
  imageUrl: string;
  label:    string;
}

/** Per-month icon that hints at the weather effect */
const MONTH_ICONS: Record<number, string> = {
  0:  "❄️",  // Jan – snow
  1:  "🌸",  // Feb – petals
  2:  "✨",  // Mar – pollen
  3:  "🌸",  // Apr – blossoms
  4:  "🌟",  // May – golden dust
  5:  "🫧",  // Jun – bubbles
  6:  "🔥",  // Jul – embers
  7:  "💜",  // Aug – lavender
  8:  "🍂",  // Sep – autumn
  9:  "🍁",  // Oct – fall
  10: "🌧️", // Nov – rain
  11: "❄️",  // Dec – snow
};

export default function HeroImage({ month, year, accent, imageUrl, label }: HeroImageProps) {
  const [errored,   setErrored]   = useState(false);
  const [overlayOn, setOverlayOn] = useState(false);

  const icon = MONTH_ICONS[month] ?? "✨";

  return (
    <div
      className="relative w-full overflow-hidden shrink-0"
      style={{
        aspectRatio: "16/7",
        background: `linear-gradient(135deg, ${accent}cc 0%, ${accent}44 100%)`,
      }}
    >
      {/* Photo */}
      {!errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${MONTH_NAMES[month]} – ${label}`}
          className="absolute inset-0 w-full h-full object-cover block transition-opacity duration-700"
          style={{ zIndex: 0 }}
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      )}

      {/* Seasonal particle overlay — toggled */}
      <SeasonalOverlay month={month} isActive={overlayOn} />

      {/* Gradient vignette — above particles, keeps text legible */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* ── Toggle button — top-right corner ── */}
      <button
        onClick={() => setOverlayOn(v => !v)}
        aria-label={overlayOn ? "Hide weather effect" : "Show weather effect"}
        title={overlayOn ? "Hide weather effect" : "Show weather effect"}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 4,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: overlayOn
            ? `2px solid ${accent}`
            : "2px solid rgba(255,255,255,0.35)",
          background: overlayOn
            ? `${accent}dd`
            : "rgba(0,0,0,0.28)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          lineHeight: 1,
          transition: "background 0.22s ease, border-color 0.22s ease, transform 0.15s ease, box-shadow 0.22s ease",
          boxShadow: overlayOn
            ? `0 0 0 3px ${accent}44, 0 2px 12px rgba(0,0,0,0.3)`
            : "0 2px 8px rgba(0,0,0,0.25)",
          transform: overlayOn ? "scale(1.08)" : "scale(1)",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.13)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = overlayOn ? "scale(1.08)" : "scale(1)";
        }}
        onMouseDown={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
        }}
        onMouseUp={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = overlayOn ? "scale(1.08)" : "scale(1)";
        }}
      >
        {icon}
      </button>

      {/* Month label — bottom right */}
      <div
        className="absolute bottom-0 right-0 px-5 pb-[14px] pt-[14px] pl-14 text-right"
        style={{ zIndex: 3 }}
      >
        <div className="text-[10px] font-medium tracking-[3px] uppercase text-white/65 mb-[3px]">
          {label} · {year}
        </div>
        <div
          className="font-bold text-white leading-none tracking-[-0.5px]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 5vw, 40px)",
            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
          }}
        >
          {MONTH_NAMES[month]}
        </div>
      </div>

      {/* Accent bar — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[5px] h-[72px]"
        style={{ background: accent, zIndex: 3 }}
      />
    </div>
  );
}