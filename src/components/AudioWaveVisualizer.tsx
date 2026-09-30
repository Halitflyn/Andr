import React, { useRef, useEffect } from 'react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  size?: number; // diameter of the Eye in pixels (default 115)
  volume?: number; // current volume level (0..1)
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  audioRef,
  size = 115,
  volume = 0.85,
  className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 max-w-none max-h-none",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Setup Web Audio Analyser if possible without breaking audio playback
  useEffect(() => {
    if (!isPlaying) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      if (audioCtxRef.current && audioRef.current && !audioSourceRef.current) {
        try {
          audioSourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 128; // 64 frequency bins + 128 waveform samples
          analyserRef.current.smoothingTimeConstant = 0.65; // Responsive for high-energy dynamics
          audioSourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        } catch {
          // Fallback to high-performance procedural audio-reactive engine
        }
      }
    } catch {}
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    let smoothBass = 0.2;
    let lastVolume = volume;

    // Fixed buffers for zero garbage collection on older PCs
    const freqData = new Uint8Array(64);
    const timeData = new Uint8Array(128);

    // Number of bars distributed across the TOP hemisphere:
    // Angles range from -Math.PI (far left, 9 o'clock) to 0 (far right, 3 o'clock)
    // The BOTTOM hemisphere is the EXACT symmetrical mirror reflection (y inverted)
    const numBars = 28;
    const cosAngles: number[] = [];
    const sinAngles: number[] = [];
    for (let i = 0; i < numBars; i++) {
      const a = -Math.PI + (i / (numBars - 1)) * Math.PI;
      cosAngles.push(Math.cos(a));
      sinAngles.push(Math.sin(a)); // Negative or 0 for top hemisphere
    }

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (isPlaying) {
        // Read current live audio volume (either from prop or audio element)
        let currentVol = volume;
        if (audioRef.current) {
          currentVol = audioRef.current.muted ? 0 : audioRef.current.volume;
        }
        lastVolume += (currentVol - lastVolume) * 0.1;

        // Speed of dynamic wave ripple accelerates with volume
        phase += 0.05 + lastVolume * 0.06;

        let hasRealData = false;
        if (analyserRef.current) {
          try {
            analyserRef.current.getByteFrequencyData(freqData);
            analyserRef.current.getByteTimeDomainData(timeData);
            hasRealData = freqData[0] > 0 || freqData[2] > 0 || timeData[0] !== 128;
          } catch {}
        }

        // Measure live soundwave dynamics (waveform peak-to-peak variance)
        let waveAmp = 0;
        let instantBass = 0;

        if (hasRealData) {
          // Average low-frequency energy (bins 0..4)
          instantBass = (freqData[0] + freqData[1] + freqData[2] + freqData[3]) / (4 * 255);

          // Measure time-domain oscillation (swings away from 128)
          let timeSum = 0;
          for (let k = 0; k < 32; k++) {
            timeSum += Math.abs(timeData[k * 4] - 128);
          }
          waveAmp = timeSum / (32 * 128); // 0 to 1
        } else {
          // Energetic beat-synced synthetic pulse
          const beat = Math.sin(phase * 3.8);
          instantBass = beat > 0.4 ? Math.pow((beat - 0.4) / 0.6, 1.8) * 0.9 : 0.08;
          waveAmp = Math.abs(Math.sin(phase * 5.2)) * 0.75;
        }

        // Smooth baseline energy tracker for transient kick detection
        smoothBass += (instantBass - smoothBass) * 0.12;
        // Kick punch: detects sharp transients even at 100% volume
        const kickTransient = Math.max(0, instantBass - smoothBass * 0.85);

        // Base radius is anchored exactly to the outer circumference of the Eye
        const baseRadius = size / 2 + 1.5;

        // Dynamic volume multiplier:
        // At high volume, ensure waves have huge excursion and DO NOT flat-line
        const volFactor = Math.max(0.2, lastVolume);

        // Precompute heights for each bar in the top hemisphere
        // Notice: Left (i=0) and Right (i=numBars-1) are NOT mirrored copies of each other,
        // but TOP and BOTTOM are 100% EXACT vertical mirror reflections!
        const barHeights: number[] = new Array(numBars);

        for (let i = 0; i < numBars; i++) {
          let height = 0;
          const normIdx = i / (numBars - 1); // 0 (left) to 1 (right)

          // Center bias (closer to 1 at apex 12 o'clock, 0 at left/right edges)
          const apexWeight = Math.sin(normIdx * Math.PI);

          if (hasRealData) {
            // Map bar index to frequency spectrum: left gets lower-mids, right gets higher frequencies
            const freqBin = Math.min(63, Math.floor(normIdx * 45));
            const rawFreq = freqData[freqBin] / 255;

            // Waveform time-domain sample: provides dynamic oscillation even at saturated frequency bins!
            const timeSample = Math.abs(timeData[(i * 4) % timeData.length] - 128) / 128;

            // Dynamic oscillating ripple traveling along the perimeter
            const travelingWave = Math.sin(phase * 4.2 + i * 0.6) * (0.35 + waveAmp * 0.65);
            const subHarmonic = Math.cos(phase * 2.1 - i * 0.4) * 0.3;

            // At high volume: dynamic spikes, dancing ripples, and punchy transients
            height = 3
              + rawFreq * (10 + volFactor * 18)
              + timeSample * (8 + volFactor * 24)
              + kickTransient * (14 + volFactor * 26) * apexWeight
              + travelingWave * (4 + volFactor * 14)
              + subHarmonic * 4;
          } else {
            // High-octane procedural waveform simulation
            const wave1 = Math.sin(phase * 4 + i * 0.5) * 6;
            const wave2 = Math.cos(phase * 2.5 - i * 0.35) * 5;
            const wave3 = Math.sin(phase * 6.5 + i * 0.8) * (waveAmp * 12);
            height = 4 + (wave1 + wave2 + wave3) * (0.5 + volFactor * 0.9) + kickTransient * 28 * apexWeight;
          }

          barHeights[i] = Math.max(3, height);
        }

        // ==========================================
        // 1. NEON CYAN BARS (Even Indices)
        // ==========================================
        ctx.strokeStyle = '#66fcf1';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();

        for (let i = 0; i < numBars; i += 2) {
          const hVal = barHeights[i];
          const r1 = baseRadius;
          const r2 = baseRadius + hVal;
          const cosA = cosAngles[i];
          const sinA = sinAngles[i]; // <= 0

          // A. TOP BAR: extends upward (cy + sinA * r, where sinA is negative)
          ctx.moveTo(cx + cosA * r1, cy + sinA * r1);
          ctx.lineTo(cx + cosA * r2, cy + sinA * r2);

          // B. BOTTOM BAR: EXACT vertical mirror reflection across horizontal axis (cy - sinA * r)
          ctx.moveTo(cx + cosA * r1, cy - sinA * r1);
          ctx.lineTo(cx + cosA * r2, cy - sinA * r2);
        }
        ctx.stroke();

        // ==========================================
        // 2. NEON EMERALD BARS (Odd Indices)
        // ==========================================
        ctx.strokeStyle = '#9effa1';
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        for (let i = 1; i < numBars; i += 2) {
          const hVal = barHeights[i];
          const r1 = baseRadius;
          const r2 = baseRadius + hVal;
          const cosA = cosAngles[i];
          const sinA = sinAngles[i];

          // A. TOP BAR
          ctx.moveTo(cx + cosA * r1, cy + sinA * r1);
          ctx.lineTo(cx + cosA * r2, cy + sinA * r2);

          // B. BOTTOM BAR: EXACT vertical mirror reflection
          ctx.moveTo(cx + cosA * r1, cy - sinA * r1);
          ctx.lineTo(cx + cosA * r2, cy - sinA * r2);
        }
        ctx.stroke();

        // ==========================================
        // 3. TOP & BOTTOM MIRRORED SHOCKWAVE ARCS
        // Highly reactive to volume & kick bass
        // ==========================================
        const dynamicPulse1 = (kickTransient * 22 + waveAmp * 12) * volFactor;
        const shockRadius1 = baseRadius + 8 + dynamicPulse1;
        const opacity1 = Math.min(0.85, 0.15 + (instantBass * 0.35 + kickTransient * 0.45) * volFactor);

        ctx.strokeStyle = `rgba(102, 252, 241, ${opacity1})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        // Top arc (from left -PI to right 0)
        ctx.arc(cx, cy, shockRadius1, -Math.PI, 0);
        // Bottom mirrored arc (from right 0 to left PI)
        ctx.moveTo(cx + shockRadius1, cy);
        ctx.arc(cx, cy, shockRadius1, 0, Math.PI);
        ctx.stroke();

        // Secondary outer emerald ripples for high volume vibrancy
        if (volFactor > 0.3) {
          const dynamicPulse2 = (kickTransient * 14 + waveAmp * 8) * volFactor;
          const shockRadius2 = baseRadius + 3 + dynamicPulse2;
          const opacity2 = Math.min(0.7, 0.12 + (instantBass * 0.3) * volFactor);

          ctx.strokeStyle = `rgba(158, 255, 161, ${opacity2})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, shockRadius2, -Math.PI, 0);
          ctx.moveTo(cx + shockRadius2, cy);
          ctx.arc(cx, cy, shockRadius2, 0, Math.PI);
          ctx.stroke();
        }

        // Concentric explosive outer shock ring at peak bass hits
        if (kickTransient > 0.18 && volFactor > 0.4) {
          const outerPulse = baseRadius + 18 + kickTransient * 30 * volFactor;
          ctx.strokeStyle = `rgba(102, 252, 241, ${kickTransient * 0.5 * volFactor})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, outerPulse, -Math.PI, 0);
          ctx.moveTo(cx + outerPulse, cy);
          ctx.arc(cx, cy, outerPulse, 0, Math.PI);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, size, volume]);

  // Generous canvas bounds with explicit size so waves never clip or scale
  const canvasDim = size + 110;

  return (
    <canvas
      ref={canvasRef}
      width={canvasDim}
      height={canvasDim}
      className={className}
      style={{
        width: `${canvasDim}px`,
        height: `${canvasDim}px`,
        maxWidth: 'none',
        maxHeight: 'none',
      }}
    />
  );
};
