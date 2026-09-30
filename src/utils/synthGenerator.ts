function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

class SeededRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numOfChan * bytesPerSample;

  const left = buffer.getChannelData(0);
  const right = numOfChan > 1 ? buffer.getChannelData(1) : left;
  const length = buffer.length;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      const sample = channel === 0 ? left[i] : right[i];
      let clamped = Math.max(-1, Math.min(1, sample));
      clamped = clamped < 0 ? clamped * 32768 : clamped * 32767;
      view.setInt16(offset, clamped, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const SCALE_D_DORIAN = [38, 40, 41, 43, 45, 46, 50, 52, 53, 55, 57, 58, 62, 64, 65, 67, 69, 70, 74];
const SCALE_A_AEOLIAN = [33, 35, 36, 38, 40, 42, 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69];

export async function generateDarkFolkAudio(title: string, trackId: string): Promise<string> {
  const seed = hashString(title + '_' + trackId);
  const rng = new SeededRNG(seed);

  const durationSec = 32;
  const sampleRate = 22050;
  const channels = 2;

  const ctx = new OfflineAudioContext(channels, sampleRate * durationSec, sampleRate);

  // Master Gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.7, 0);
  masterGain.connect(ctx.destination);

  // Delay / Reverb simulation
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.25, 0);
  const delayGain = ctx.createGain();
  delayGain.gain.setValueAtTime(0.35, 0);
  delay.connect(delayGain);
  delayGain.connect(delay);
  delay.connect(masterGain);

  const scale = rng.next() > 0.5 ? SCALE_D_DORIAN : SCALE_A_AEOLIAN;
  const bpm = Math.floor(rng.range(75, 110));
  const beatSec = 60 / bpm;
  const totalBeats = Math.floor(durationSec / beatSec);

  // 1. Drone Bass Layer
  const bassNotes = [scale[0], scale[2], scale[3], scale[0]];
  for (let i = 0; i < totalBeats; i += 4) {
    const note = bassNotes[Math.floor(i / 4) % bassNotes.length];
    const freq = midiToFreq(note);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, i * beatSec);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, i * beatSec);

    const startTime = i * beatSec;
    const dur = beatSec * 3.8;
    gain.gain.setValueAtTime(0.01, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + dur);
  }

  // 2. Mystic Plucked Folk Arpeggio
  const subBeat = beatSec / 2;
  const totalSubBeats = Math.floor(durationSec / subBeat);
  for (let i = 0; i < totalSubBeats; i++) {
    if (i % 8 === 7 && rng.next() > 0.4) continue;

    const noteIdx = Math.floor(rng.range(4, 12));
    const note = scale[noteIdx % scale.length];
    const freq = midiToFreq(note);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = rng.next() > 0.3 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, i * subBeat);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2, i * subBeat);
    filter.Q.setValueAtTime(3, i * subBeat);

    const st = i * subBeat;
    const noteDur = subBeat * 1.5;
    gain.gain.setValueAtTime(0.25, st);
    gain.gain.exponentialRampToValueAtTime(0.0001, st + noteDur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    gain.connect(delay);

    osc.start(st);
    osc.stop(st + noteDur);
  }

  // 3. Ethereal High Wind Flute / Whistle
  for (let i = 0; i < totalBeats; i += 2) {
    if (rng.next() > 0.75) continue;

    const note = scale[Math.floor(rng.range(8, scale.length - 2))];
    const freq = midiToFreq(note);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const st = i * beatSec;
    const noteDur = beatSec * rng.range(1.2, 2.5);

    osc.frequency.setValueAtTime(freq, st);
    osc.frequency.setValueAtTime(freq * 1.005, st + noteDur * 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, st);

    gain.gain.setValueAtTime(0.001, st);
    gain.gain.linearRampToValueAtTime(0.18, st + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, st + noteDur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    gain.connect(delay);

    osc.start(st);
    osc.stop(st + noteDur);
  }

  // 4. Shamanic Forest Drum & Shaker
  for (let i = 0; i < totalBeats; i++) {
    const t = i * beatSec;
    if (i % 2 === 0) {
      // Deep shamanic kick
      const drumOsc = ctx.createOscillator();
      const drumGain = ctx.createGain();

      drumOsc.type = 'sine';
      drumOsc.frequency.setValueAtTime(110, t);
      drumOsc.frequency.exponentialRampToValueAtTime(35, t + 0.15);

      drumGain.gain.setValueAtTime(0.4, t);
      drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      drumOsc.connect(drumGain);
      drumGain.connect(masterGain);

      drumOsc.start(t);
      drumOsc.stop(t + 0.25);
    }

    // Whispering wood percussion (noise burst)
    const tShaker = t + beatSec / 2;
    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let s = 0; s < bufferSize; s++) {
      output[s] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(4500, tShaker);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, tShaker);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, tShaker + 0.05);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(tShaker);
    whiteNoise.stop(tShaker + 0.05);
  }

  const renderedBuffer = await ctx.startRendering();
  const wavBlob = audioBufferToWavBlob(renderedBuffer);
  return URL.createObjectURL(wavBlob);
}
