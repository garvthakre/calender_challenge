"use client";
import { useState } from "react";
import { MONTH_NAMES, SHORT_MONTH_NAMES } from "@/lib/calendar";

interface HeroImageProps {
  month:    number;
  year:     number;
  accent:   string;
  keyword:  string;
  label:    string;
}

// Curated Unsplash photo IDs per month for reliable, beautiful images
const MONTH_PHOTOS: string[] = [
  "photo-1519681393784-d120267933ba", // Jan - snowy mountain
  "photo-1458682625221-3a45f8a844c7", // Feb - purple flowers
  "photo-1462275646964-a0e3386b89fa", // Mar - green meadow
  "photo-1504701954957-2010ec3bcec1", // Apr - golden fields
  "photo-1490750967868-88df5691cc0e", // May - red roses
  "photo-1507525428034-b723cf961d3e", // Jun - beach
  "photo-1469854523086-cc02fe5d8800", // Jul - canyon
  "photo-1499002238440-d264edd596ec", // Aug - lavender
  "photo-1508739773434-c26b3d09e071", // Sep - autumn forest
  "photo-1508193638397-1c4234db14d8", // Oct - harvest
  "photo-1448375240586-882707db888b", // Nov - foggy forest
  "photo-1491002052546-bf38f186af56", // Dec - ice/winter
];

export default function HeroImage({ month, year, accent, label }: HeroImageProps) {
  const [imgError, setImgError] = useState(false);
  const photoId = MONTH_PHOTOS[month];
  const src = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`;

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", overflow: "hidden", flexShrink: 0 }}>
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${MONTH_NAMES[month]} scenery`}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        /* Fallback gradient when image fails */
        <div style={{
          width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${accent}cc, ${accent}44)`,
        }} />
      )}

      {/* Subtle dark gradient at bottom for text legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Month label – bottom-right */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "20px",
        textAlign: "right",
      }}>
        <div style={{
          fontSize: "11px",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "2px",
        }}>
          {label} · {year}
        </div>
        <div style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1,
          letterSpacing: "-0.5px",
          textShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>
          {MONTH_NAMES[month]}
        </div>
      </div>

      {/* Accent stripe bottom-left */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "4px",
        height: "60px",
        background: accent,
      }} />
    </div>
  );
}