"use client";

/**
 * SeasonalOverlay
 * ────────────────────────────────────────────────────────────────────────────
 * Pure-CSS animated particle effects layered over the HeroImage.
 * Toggled on/off via the `isActive` prop — fades in/out smoothly.
 */

interface ParticleConfig {
  color:     string;
  size:      number;
  count:     number;
  shape:     "circle" | "petal" | "leaf" | "star" | "raindrop" | "firefly";
  animation: string;
  duration:  number;
  opacity:   number;
  layer2?:   Omit<ParticleConfig, "layer2">;
}

const MONTH_PARTICLES: ParticleConfig[] = [
  // 0 – January  ❄ Snowflakes
  {
    color: "rgba(255,255,255,0.90)", size: 5, count: 28, shape: "circle",
    animation: "snoFall", duration: 8, opacity: 0.85,
    layer2: { color: "rgba(220,235,255,0.70)", size: 3, count: 16, shape: "circle", animation: "snoFall", duration: 12, opacity: 0.6 },
  },
  // 1 – February  🌸 Cherry petals
  {
    color: "rgba(255,182,193,0.88)", size: 7, count: 22, shape: "petal",
    animation: "petalDrift", duration: 9, opacity: 0.82,
    layer2: { color: "rgba(255,105,135,0.55)", size: 5, count: 12, shape: "petal", animation: "petalDriftB", duration: 13, opacity: 0.6 },
  },
  // 2 – March  ✨ Green pollen sparkles
  {
    color: "rgba(134,239,172,0.80)", size: 4, count: 20, shape: "star",
    animation: "pollenFloat", duration: 10, opacity: 0.7,
    layer2: { color: "rgba(255,255,255,0.50)", size: 3, count: 14, shape: "circle", animation: "pollenFloat", duration: 14, opacity: 0.45 },
  },
  // 3 – April  🌸 Blossom petals (purple/pink)
  {
    color: "rgba(216,180,254,0.85)", size: 8, count: 24, shape: "petal",
    animation: "petalDrift", duration: 10, opacity: 0.8,
    layer2: { color: "rgba(251,207,232,0.65)", size: 5, count: 14, shape: "petal", animation: "petalDriftB", duration: 14, opacity: 0.6 },
  },
  // 4 – May  ✨ Golden dust motes
  {
    color: "rgba(253,224,71,0.80)", size: 3, count: 24, shape: "firefly",
    animation: "dustFloat", duration: 10, opacity: 0.75,
    layer2: { color: "rgba(255,255,255,0.55)", size: 2, count: 16, shape: "circle", animation: "dustFloat", duration: 15, opacity: 0.5 },
  },
  // 5 – June  🫧 Ocean foam bubbles
  {
    color: "rgba(186,230,253,0.75)", size: 6, count: 20, shape: "circle",
    animation: "bubbleRise", duration: 7, opacity: 0.7,
    layer2: { color: "rgba(255,255,255,0.55)", size: 4, count: 14, shape: "circle", animation: "bubbleRise", duration: 11, opacity: 0.5 },
  },
  // 6 – July  🔥 Warm ember glows
  {
    color: "rgba(251,191,36,0.85)", size: 4, count: 22, shape: "firefly",
    animation: "emberRise", duration: 6, opacity: 0.8,
    layer2: { color: "rgba(252,132,74,0.60)", size: 3, count: 14, shape: "circle", animation: "emberRise", duration: 9, opacity: 0.55 },
  },
  // 7 – August  💜 Lavender petals
  {
    color: "rgba(196,181,253,0.85)", size: 6, count: 22, shape: "petal",
    animation: "petalDrift", duration: 11, opacity: 0.78,
    layer2: { color: "rgba(167,139,250,0.55)", size: 4, count: 13, shape: "petal", animation: "petalDriftB", duration: 15, opacity: 0.55 },
  },
  // 8 – September  🍂 Autumn leaves
  {
    color: "rgba(251,146,60,0.88)", size: 9, count: 18, shape: "leaf",
    animation: "leafTumble", duration: 10, opacity: 0.82,
    layer2: { color: "rgba(234,88,12,0.65)", size: 6, count: 12, shape: "leaf", animation: "leafTumbleB", duration: 14, opacity: 0.6 },
  },
  // 9 – October  🍁 Fiery fall leaves
  {
    color: "rgba(220,38,38,0.85)", size: 10, count: 20, shape: "leaf",
    animation: "leafTumble", duration: 9, opacity: 0.80,
    layer2: { color: "rgba(234,179,8,0.70)", size: 7, count: 13, shape: "leaf", animation: "leafTumbleB", duration: 13, opacity: 0.65 },
  },
  // 10 – November  🌧 Misty rain
  {
    color: "rgba(203,213,225,0.70)", size: 2, count: 30, shape: "raindrop",
    animation: "rainFall", duration: 1.2, opacity: 0.65,
    layer2: { color: "rgba(148,163,184,0.50)", size: 1, count: 20, shape: "raindrop", animation: "rainFall", duration: 0.9, opacity: 0.45 },
  },
  // 11 – December  ❄ Heavy snow + sparkles
  {
    color: "rgba(255,255,255,0.92)", size: 6, count: 32, shape: "circle",
    animation: "snoFall", duration: 7, opacity: 0.88,
    layer2: { color: "rgba(186,230,253,0.65)", size: 3, count: 20, shape: "star", animation: "snoFall", duration: 11, opacity: 0.6 },
  },
];

function shapeStyle(
  shape: ParticleConfig["shape"],
  color: string,
  size: number,
): React.CSSProperties {
  switch (shape) {
    case "petal":
      return { width: size, height: size * 1.5, background: color, borderRadius: "50% 0 50% 0", transform: "rotate(-30deg)" };
    case "leaf":
      return { width: size, height: size * 1.4, background: color, borderRadius: "0 50% 0 50%" };
    case "star":
      return { width: size, height: size, background: color, clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" };
    case "raindrop":
      return { width: 1.5, height: size * 6, background: `linear-gradient(to bottom, transparent, ${color})`, borderRadius: "1px" };
    case "firefly":
      return { width: size, height: size, background: color, borderRadius: "50%", boxShadow: `0 0 ${size * 2}px ${size}px ${color}`, filter: "blur(0.5px)" };
    case "circle":
    default:
      return { width: size, height: size, background: color, borderRadius: "50%" };
  }
}

function ParticleLayer({ cfg, seed = 0 }: { cfg: Omit<ParticleConfig, "layer2">; seed?: number }) {
  return (
    <>
      {Array.from({ length: cfg.count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(n * 9301 + seed * 49297 + 233) * 43758.5453;
          return x - Math.floor(x);
        };
        const left     = r(i * 7 + 1) * 100;
        const delay    = r(i * 7 + 2) * cfg.duration;
        const dur      = cfg.duration * (0.7 + r(i * 7 + 3) * 0.9);
        const sizeMult = 0.6 + r(i * 7 + 4) * 0.9;
        const actual   = Math.round(cfg.size * sizeMult);
        const wobble   = (r(i * 7 + 5) - 0.5) * 30;
        const isRising = cfg.animation === "bubbleRise" || cfg.animation === "emberRise";

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: isRising ? `${70 + r(i * 7 + 6) * 30}%` : `-${actual + 8}px`,
              left: `${left}%`,
              opacity: cfg.opacity,
              animationName: cfg.animation,
              animationDuration: `${dur.toFixed(2)}s`,
              animationDelay: `${delay.toFixed(2)}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationFillMode: "both",
              ["--drift" as string]: `${wobble}px`,
              pointerEvents: "none",
              willChange: "transform, opacity",
              ...shapeStyle(cfg.shape, cfg.color, actual),
            }}
          />
        );
      })}
    </>
  );
}

interface SeasonalOverlayProps {
  month:    number;
  isActive: boolean;
}

export default function SeasonalOverlay({ month, isActive }: SeasonalOverlayProps) {
  const cfg = MONTH_PARTICLES[month];
  if (!cfg) return null;

  return (
    <>
      <style>{`
        @keyframes snoFall {
          0%   { transform: translateY(0)    translateX(0)               rotate(0deg);    opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(115%) translateX(var(--drift,0px)) rotate(360deg); opacity: 0; }
        }
        @keyframes petalDrift {
          0%   { transform: translateY(0)    translateX(0)                              rotate(0deg)   scale(1);    opacity: 0; }
          8%   { opacity: 0.9; }
          30%  { transform: translateY(30%)  translateX(calc(var(--drift,0px)*.4))      rotate(120deg) scale(.95); }
          60%  { transform: translateY(65%)  translateX(var(--drift,0px))               rotate(220deg) scale(1.05); }
          90%  { opacity: 0.85; }
          100% { transform: translateY(115%) translateX(calc(var(--drift,0px)*1.5))     rotate(360deg) scale(.9);  opacity: 0; }
        }
        @keyframes petalDriftB {
          0%   { transform: translateY(0)    translateX(0)                              rotate(180deg) scale(.9);  opacity: 0; }
          8%   { opacity: 0.8; }
          40%  { transform: translateY(35%)  translateX(calc(var(--drift,0px)*-.3))     rotate(290deg) scale(1); }
          70%  { transform: translateY(70%)  translateX(var(--drift,0px))               rotate(400deg) scale(1.1); }
          92%  { opacity: 0.75; }
          100% { transform: translateY(115%) translateX(calc(var(--drift,0px)*.8))      rotate(540deg) scale(.85); opacity: 0; }
        }
        @keyframes pollenFloat {
          0%   { transform: translate(0,0)                            scale(1);    opacity: 0; }
          10%  { opacity: 0.85; }
          25%  { transform: translate(calc(var(--drift,0px)*.5),-18%) scale(1.1); }
          50%  { transform: translate(var(--drift,0px),-8%)           scale(.95); }
          75%  { transform: translate(calc(var(--drift,0px)*-.3),-22%) scale(1.05); }
          90%  { opacity: 0.8; }
          100% { transform: translate(0,0)                            scale(1);    opacity: 0; }
        }
        @keyframes dustFloat {
          0%   { transform: translate(0,0)                             scale(1);    opacity: 0; }
          12%  { opacity: 0.9; }
          30%  { transform: translate(calc(var(--drift,0px)*.4),-12%)  scale(1.15); }
          55%  { transform: translate(var(--drift,0px),-5%)            scale(.9);  }
          80%  { transform: translate(calc(var(--drift,0px)*-.2),-20%) scale(1.1); }
          90%  { opacity: 0.85; }
          100% { transform: translate(0,0)                             scale(1);    opacity: 0; }
        }
        @keyframes bubbleRise {
          0%   { transform: translateY(0)     translateX(0)                          scale(.6); opacity: 0; }
          10%  { opacity: 0.75; }
          50%  { transform: translateY(-50%)  translateX(calc(var(--drift,0px)*.4))  scale(1); }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-120%) translateX(var(--drift,0px))           scale(1.2); opacity: 0; }
        }
        @keyframes emberRise {
          0%   { transform: translateY(0)     translateX(0)                           scale(1.2); opacity: 0; }
          8%   { opacity: 0.9; }
          40%  { transform: translateY(-45%)  translateX(calc(var(--drift,0px)*.5))   scale(.85); opacity: .85; }
          80%  { transform: translateY(-90%)  translateX(var(--drift,0px))            scale(.5);  opacity: .4; }
          100% { transform: translateY(-130%) translateX(calc(var(--drift,0px)*1.4))  scale(.2);  opacity: 0; }
        }
        @keyframes leafTumble {
          0%   { transform: translateY(0)    translateX(0)                            rotate(0deg)   scale(1);    opacity: 0; }
          6%   { opacity: 0.9; }
          20%  { transform: translateY(20%)  translateX(calc(var(--drift,0px)*.6))    rotate(-80deg) scale(1.05); }
          45%  { transform: translateY(48%)  translateX(calc(var(--drift,0px)*-.2))   rotate(60deg)  scale(.9);  }
          70%  { transform: translateY(72%)  translateX(var(--drift,0px))             rotate(200deg) scale(1.1); }
          92%  { opacity: 0.8; }
          100% { transform: translateY(115%) translateX(calc(var(--drift,0px)*.9))    rotate(340deg) scale(.85); opacity: 0; }
        }
        @keyframes leafTumbleB {
          0%   { transform: translateY(0)    translateX(0)                            rotate(45deg)  scale(.85); opacity: 0; }
          6%   { opacity: 0.85; }
          25%  { transform: translateY(22%)  translateX(calc(var(--drift,0px)*-.5))   rotate(-40deg) scale(1); }
          50%  { transform: translateY(50%)  translateX(calc(var(--drift,0px)*.3))    rotate(140deg) scale(1.05); }
          75%  { transform: translateY(77%)  translateX(var(--drift,0px))             rotate(260deg) scale(.9); }
          92%  { opacity: 0.75; }
          100% { transform: translateY(115%) translateX(calc(var(--drift,0px)*1.2))   rotate(400deg) scale(.8);  opacity: 0; }
        }
        @keyframes rainFall {
          0%   { transform: translateY(0)    translateX(0)    skewX(-8deg); opacity: 0; }
          5%   { opacity: 0.7; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(120%) translateX(-8px) skewX(-8deg); opacity: 0; }
        }

        /* Fade wrapper transition */
        .seasonal-overlay-wrap {
          transition: opacity 0.55s ease;
        }
      `}</style>

      {/* Wrapper handles the fade — particles always rendered to avoid re-mount flicker */}
      <div
        className="seasonal-overlay-wrap"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 2,
          opacity: isActive ? 1 : 0,
        }}
      >
        <ParticleLayer cfg={cfg} seed={0} />
        {cfg.layer2 && <ParticleLayer cfg={cfg.layer2} seed={42} />}
      </div>
    </>
  );
}