"use client";
import { useState } from "react";
import { MONTH_NAMES, SHORT_MONTH_NAMES } from "@/lib/calendar";

interface HeroImageProps {
  month:   number;
  year:    number;
  accent:  string;
  photoId: string;
  label:   string;
}
 
export default function HeroImage({ month, year, accent, photoId, label }: HeroImageProps) {
  const [errored, setErrored] = useState(false);
  const src = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`;
 
  return (
    <div className="hero-wrap">
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${MONTH_NAMES[month]} scenery`}
          className="hero-img"
          onError={() => setErrored(true)}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}cc 0%, ${accent}44 100%)` }} />
      )}
 
      <div className="hero-gradient" />
 
      <div className="hero-label">
        <div className="hero-season">{label} · {year}</div>
        <div className="hero-month">{MONTH_NAMES[month]}</div>
      </div>
 
      <div className="hero-accent-bar" style={{ background: accent }} />
    </div>
  );
}