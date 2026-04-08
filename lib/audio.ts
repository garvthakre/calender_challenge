"use client";

// Simple Web Audio API synthesizer for tactile UI sounds

let audioCtx: AudioContext | null = null;
const getContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// A soft satisfying "pop" for clicking a date
export const playPopSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Soft pop parameters
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
};

// A brushed noise sound simulating a paper page turning
export const playFlipSound = () => {
  const ctx = getContext();
  if (!ctx) return;

  const duration = 0.25; // 250ms flip sound
  
  // 1. Create white noise buffer
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Generate noise between -1 and 1
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // 2. Filter the noise to sound like thick paper (Bandpass)
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  // The frequency slides up slightly as the paper moves
  filter.frequency.setValueAtTime(1500, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(2500, ctx.currentTime + duration);
  filter.Q.value = 1.0; 

  // 3. Shape the volume (Envelope)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  // Quick attack as page lifts
  gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05);
  // Slower release as page lands
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(ctx.currentTime);
};
