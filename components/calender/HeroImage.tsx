"use client";
import { useState } from "react";
import { MONTH_NAMES } from "@/lib/calendar";

interface HeroImageProps {
  month:   number;
  year:    number;
  accent:  string;
  imageUrl: string;
  label:   string;
}

export default function HeroImage({ month, year, accent, imageUrl, label }: HeroImageProps) {
  const [errored, setErrored] = useState(false);

  // Directly use the full image URL from picsum.photos
  const src = imageUrl;

  return (
    /* hero wrap */
    <div className="relative w-full overflow-hidden shrink-0" style={{ aspectRatio: "16/7", background: `linear-gradient(135deg, ${accent}cc 0%, ${accent}44 100%)` }}>
      {!errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${MONTH_NAMES[month]} – ${label}`}
          className="absolute inset-0 w-full h-full object-cover block transition-opacity duration-700"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      )}

      {/* gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.65) 100%)" }}
      />

      {/* month label - bottom right */}
      <div className="absolute bottom-0 right-0 px-5 pb-[14px] pt-[14px] pl-14 text-right">
        <div className="text-[10px] font-medium tracking-[3px] uppercase text-white/65 mb-[3px]">
          {label} · {year}
        </div>
        <div
          className="font-bold text-white leading-none tracking-[-0.5px]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 5vw, 40px)",
            textShadow: "0 2px 16px rgba(0,0,0,0.4)"
          }}
        >
          {MONTH_NAMES[month]}
        </div>
      </div>

      {/* accent bar - bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[5px] h-[72px]"
        style={{ background: accent }}
      />
    </div>
  );
}