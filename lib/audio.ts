"use client";

// ─── Refined Web Audio API synthesizer ────────────────────────────────────────
// Produces classy, tactile sounds with careful layering and envelope shaping.

let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

// ─── Utility: create a short noise buffer ─────────────────────────────────────
function makeNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.ceil(ctx.sampleRate * seconds);
  const buf    = ctx.createBuffer(1, length, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  // Slightly pink-ish noise: blend white with a one-sample lag
  let prev = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = prev = white * 0.6 + prev * 0.4; // gentle low-pass tint
  }
  return buf;
}

// ─── A soft satisfying "pop" for clicking a date ──────────────────────────────
export const playPopSound = (): void => {
  const ctx = getContext();
  if (!ctx) return;

  const t = ctx.currentTime;

  // Sine body — a gentle pitched thump
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.055);

  gain.gain.setValueAtTime(0.0, t);
  gain.gain.linearRampToValueAtTime(0.32, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

  osc.start(t);
  osc.stop(t + 0.08);

  // Tiny transient click layer — adds tactility without harshness
  const click      = ctx.createBufferSource();
  click.buffer     = makeNoiseBuffer(ctx, 0.012);
  const clickFilt  = ctx.createBiquadFilter();
  clickFilt.type   = "highpass";
  clickFilt.frequency.value = 3800;
  const clickGain  = ctx.createGain();
  clickGain.gain.setValueAtTime(0.09, t);
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

  click.connect(clickFilt);
  clickFilt.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(t);
};

// ─── Realistic page-flip sound ────────────────────────────────────────────────
//
//  Built from four concurrent layers:
//
//  1. LIFT  — a soft high-freq swish at the very start (paper edge leaving desk)
//  2. BODY  — the main mid-freq whoosh as the page travels through air
//  3. SETTLE — a low thud + crinkle as the page lands (slightly delayed)
//  4. TAIL  — a whisper of air displacement after the page lands
//
//  All gains are kept low so the effect sits behind the UI, not on top of it.

export const playFlipSound = (): void => {
  const ctx = getContext();
  if (!ctx) return;

  const t   = ctx.currentTime;
  const vol = 0.38; // master attenuation — tasteful, never intrusive

  // ── Master output gain ──────────────────────────────────────────────────────
  const master = ctx.createGain();
  master.gain.value = vol;
  master.connect(ctx.destination);

  // ── 1. LIFT — crisp high-end swish (0 – 60 ms) ─────────────────────────────
  {
    const src  = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 0.08);

    const bp   = ctx.createBiquadFilter();
    bp.type    = "bandpass";
    bp.frequency.setValueAtTime(5500, t);
    bp.frequency.linearRampToValueAtTime(3200, t + 0.06);
    bp.Q.value = 0.6;

    const g    = ctx.createGain();
    g.gain.setValueAtTime(0.0,  t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.008); // fast attack
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(t);
  }

  // ── 2. BODY — mid whoosh (10 – 200 ms) ─────────────────────────────────────
  {
    const src  = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 0.22);

    // Two complementary bandpass filters give a richer "paper in air" texture
    const bp1   = ctx.createBiquadFilter();
    bp1.type    = "bandpass";
    bp1.frequency.setValueAtTime(1600, t + 0.01);
    bp1.frequency.linearRampToValueAtTime(900,  t + 0.19);
    bp1.Q.value = 0.9;

    const bp2   = ctx.createBiquadFilter();
    bp2.type    = "bandpass";
    bp2.frequency.setValueAtTime(2800, t + 0.01);
    bp2.frequency.linearRampToValueAtTime(1400, t + 0.19);
    bp2.Q.value = 1.2;

    // Merge through a gain splitter
    const merge = ctx.createGain();
    merge.gain.value = 0.5;

    const g     = ctx.createGain();
    g.gain.setValueAtTime(0.0,  t + 0.01);
    g.gain.linearRampToValueAtTime(0.70, t + 0.03);
    g.gain.setValueAtTime(0.70,          t + 0.10);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.21);

    src.connect(bp1); bp1.connect(merge);
    src.connect(bp2); bp2.connect(merge);
    merge.connect(g);
    g.connect(master);
    src.start(t + 0.01);
  }

  // ── 3. SETTLE — soft thud + paper crinkle (190 – 310 ms) ──────────────────
  {
    // Thud: pitched sine decay
    const osc  = ctx.createOscillator();
    osc.type   = "sine";
    osc.frequency.setValueAtTime(140, t + 0.19);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.31);

    const gThud = ctx.createGain();
    gThud.gain.setValueAtTime(0.0,  t + 0.19);
    gThud.gain.linearRampToValueAtTime(0.40, t + 0.197);
    gThud.gain.exponentialRampToValueAtTime(0.001, t + 0.31);

    osc.connect(gThud);
    gThud.connect(master);
    osc.start(t + 0.19);
    osc.stop(t + 0.32);

    // Crinkle: short burst of filtered noise
    const src2  = ctx.createBufferSource();
    src2.buffer = makeNoiseBuffer(ctx, 0.10);

    const lp   = ctx.createBiquadFilter();
    lp.type    = "lowpass";
    lp.frequency.setValueAtTime(2200, t + 0.19);
    lp.frequency.linearRampToValueAtTime(700,  t + 0.29);
    lp.Q.value = 1.4;

    const gCrinkle = ctx.createGain();
    gCrinkle.gain.setValueAtTime(0.0,  t + 0.19);
    gCrinkle.gain.linearRampToValueAtTime(0.28, t + 0.205);
    gCrinkle.gain.exponentialRampToValueAtTime(0.001, t + 0.29);

    src2.connect(lp);
    lp.connect(gCrinkle);
    gCrinkle.connect(master);
    src2.start(t + 0.19);
  }

  // ── 4. TAIL — gentle air whisper (250 – 420 ms) ────────────────────────────
  {
    const src  = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 0.20);

    const hp   = ctx.createBiquadFilter();
    hp.type    = "highpass";
    hp.frequency.value = 4000;
    hp.Q.value = 0.4;

    const g    = ctx.createGain();
    g.gain.setValueAtTime(0.0,  t + 0.25);
    g.gain.linearRampToValueAtTime(0.08, t + 0.28);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    src.connect(hp);
    hp.connect(g);
    g.connect(master);
    src.start(t + 0.25);
  }
};