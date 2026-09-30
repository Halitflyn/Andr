import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Trash2, Clock, Sparkles, X, Save, Wand2, Link2, Link2Off, ChevronLeft, ChevronRight } from 'lucide-react';
import { SubtitleCue, Track } from '../data';

interface SubtitleStudioProps {
  track: Track;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onSaveSubtitles: (cues: SubtitleCue[]) => void;
  onClose: () => void;
}

export const SubtitleStudio: React.FC<SubtitleStudioProps> = ({
  track,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onSaveSubtitles,
  onClose,
}) => {
  const [cues, setCues] = useState<SubtitleCue[]>(() => {
    if (track.subtitles && track.subtitles.length > 0) {
      return [...track.subtitles];
    }
    // Auto generate preliminary cues from track lyrics if empty
    if (track.lyrics) {
      const lines = track.lyrics
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('[') && !l.toLowerCase().includes('куплет') && !l.toLowerCase().includes('приспів') && !l.toLowerCase().includes('брідж'));
      
      const count = lines.length;
      const safeDuration = duration > 10 ? duration : 180;
      const step = safeDuration / Math.max(1, count);
      return lines.map((text, idx) => ({
        id: `cue_${idx}_${Date.now()}`,
        startTime: parseFloat((idx * step).toFixed(2)),
        endTime: parseFloat(((idx + 1) * step).toFixed(2)),
        text,
      }));
    }
    return [
      { id: '1', startTime: 0, endTime: 5, text: 'Перший священний рядок сувою...' }
    ];
  });

  const [activeCueIdx, setActiveCueIdx] = useState<number>(0);
  const [magneticPush, setMagneticPush] = useState<boolean>(true); // Linked Push-Pull
  const listRef = useRef<HTMLDivElement>(null);

  const totalDuration = duration > 0 ? duration : (cues[cues.length - 1]?.endTime || 180);

  // Sync active cue with current time
  useEffect(() => {
    const idx = cues.findIndex(c => currentTime >= c.startTime && currentTime <= c.endTime);
    if (idx !== -1) {
      setActiveCueIdx(idx);
    }
  }, [currentTime, cues]);

  const formatSec = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00.0';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  /**
   * Linked Push-Pull Handler for modifying start time or end time:
   * "якщо я пухаю максимум в 1 то в іншого мінімум рухається"
   */
  const handleUpdateBoundaries = (
    idx: number,
    newStart: number,
    newEnd: number
  ) => {
    const next = [...cues];
    const prevStart = next[idx].startTime;
    const prevEnd = next[idx].endTime;

    // Constrain within bounds
    let clampedStart = Math.max(0, parseFloat(newStart.toFixed(2)));
    let clampedEnd = Math.max(clampedStart + 0.3, parseFloat(newEnd.toFixed(2)));

    next[idx] = {
      ...next[idx],
      startTime: clampedStart,
      endTime: clampedEnd,
    };

    // Magnetic Push-Pull:
    if (magneticPush) {
      // If End Time changed (maximum of cue 1): push minimum of next cue (cue idx + 1)
      if (Math.abs(clampedEnd - prevEnd) > 0.01 && idx + 1 < next.length) {
        const delta = clampedEnd - prevEnd;
        next[idx + 1] = {
          ...next[idx + 1],
          startTime: clampedEnd,
          endTime: Math.max(clampedEnd + 0.8, parseFloat((next[idx + 1].endTime + (delta > 0 ? delta * 0.5 : 0)).toFixed(2))),
        };
      }

      // If Start Time changed (minimum of cue 1): push maximum of previous cue (cue idx - 1)
      if (Math.abs(clampedStart - prevStart) > 0.01 && idx > 0) {
        next[idx - 1] = {
          ...next[idx - 1],
          endTime: clampedStart,
          startTime: Math.min(clampedStart - 0.8, next[idx - 1].startTime),
        };
      }
    }

    setCues(next);
  };

  const handleSetCurrentStart = (idx: number) => {
    const newStart = parseFloat(currentTime.toFixed(2));
    const currentEnd = cues[idx].endTime <= newStart ? parseFloat((newStart + 3).toFixed(2)) : cues[idx].endTime;
    handleUpdateBoundaries(idx, newStart, currentEnd);
  };

  const handleSetCurrentEnd = (idx: number) => {
    const newEnd = parseFloat(currentTime.toFixed(2));
    const currentStart = cues[idx].startTime >= newEnd ? Math.max(0, parseFloat((newEnd - 2).toFixed(2))) : cues[idx].startTime;
    handleUpdateBoundaries(idx, currentStart, newEnd);
  };

  // Tap-Sync: Sets current line start to currentTime, and advances
  const handleTapSync = () => {
    const next = [...cues];
    if (next[activeCueIdx]) {
      const now = parseFloat(currentTime.toFixed(2));
      handleUpdateBoundaries(activeCueIdx, now, Math.max(now + 2.5, next[activeCueIdx].endTime));
      if (activeCueIdx > 0 && next[activeCueIdx - 1]) {
        next[activeCueIdx - 1].endTime = now;
      }
      if (next[activeCueIdx + 1]) {
        setActiveCueIdx(activeCueIdx + 1);
      }
    }
  };

  const handleAddCue = () => {
    const last = cues[cues.length - 1];
    const newStart = last ? last.endTime : parseFloat(currentTime.toFixed(2));
    setCues([
      ...cues,
      {
        id: `cue_${Date.now()}`,
        startTime: parseFloat(newStart.toFixed(2)),
        endTime: parseFloat((newStart + 3.5).toFixed(2)),
        text: 'Новий священний рядок...',
      },
    ]);
  };

  const handleDeleteCue = (idx: number) => {
    if (cues.length <= 1) return;
    setCues(cues.filter((_, i) => i !== idx));
  };

  const handleAutoSplitLyrics = () => {
    if (!track.lyrics) return;
    const lines = track.lyrics
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('Куплет') && !l.startsWith('Приспів') && !l.startsWith('Брідж') && !l.startsWith('Фінал'));

    const safeDuration = duration > 10 ? duration : 180;
    const step = safeDuration / Math.max(1, lines.length);
    const newCues = lines.map((text, idx) => ({
      id: `cue_${idx}_${Date.now()}`,
      startTime: parseFloat((idx * step).toFixed(2)),
      endTime: parseFloat(((idx + 1) * step).toFixed(2)),
      text,
    }));
    setCues(newCues);
  };

  // Find active cue text for live preview
  const currentCue = cues[activeCueIdx];
  const cueProgress = currentCue && currentCue.endTime > currentCue.startTime
    ? Math.max(0, Math.min(1, (currentTime - currentCue.startTime) / (currentCue.endTime - currentCue.startTime)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-5 animate-[fadeIn_0.2s_ease-out]">
      <div className="glass-panel max-w-5xl w-full max-h-[95vh] rounded-2xl p-4 sm:p-6 glow-box-cyan flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-neon-teal/30 pb-3 mb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan shadow-[0_0_12px_#66fcf1]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-neon-cyan m-0">
                Студія Субтитрів (CapCut-Style Timeline)
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Трек: <span className="text-white font-bold">{track.title}</span> • Магнітний стик меж та підсвітка літер
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveSubtitles(cues)}
              className="px-4 py-2 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_#66fcf1]"
            >
              <Save size={14} /> Зберегти субтитри
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Karaoke Preview Screen with Letter Highlight */}
        <div className="bg-black/85 border-2 border-neon-cyan/40 rounded-xl p-4 sm:p-5 text-center relative overflow-hidden mb-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="text-xs font-mono text-neon-teal mb-2 flex justify-between items-center px-2">
            <span>Жива підсвітка караоке-літер</span>
            <span className="text-neon-cyan font-bold">{formatSec(currentTime)} / {formatSec(totalDuration)}</span>
          </div>

          <div className="text-xl sm:text-3xl font-cinzel font-bold min-h-[52px] flex items-center justify-center px-4">
            {currentCue ? (
              <span className="relative inline-block text-gray-500">
                {currentCue.text}
                <span
                  className="absolute top-0 left-0 text-neon-cyan overflow-hidden whitespace-nowrap drop-shadow-[0_0_12px_#66fcf1]"
                  style={{ width: `${cueProgress * 100}%` }}
                >
                  {currentCue.text}
                </span>
              </span>
            ) : (
              <span className="text-gray-600 text-sm font-sans italic">... Музичний програш / Пауза ...</span>
            )}
          </div>
          {cues[activeCueIdx + 1] && (
            <div className="text-xs text-gray-500 font-serif mt-1 truncate">
              Наступний: {cues[activeCueIdx + 1].text}
            </div>
          )}
        </div>

        {/* Global Timeline Track & Scrubber */}
        <div className="bg-black/75 border border-neon-cyan/30 rounded-xl p-3 mb-3 flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between items-center text-gray-300">
            <span className="text-neon-cyan font-bold flex items-center gap-1.5">
              <span>⏱️ Повзунок треку:</span>
              <span className="text-white bg-black/60 px-2 py-0.5 rounded border border-neon-teal/40">
                {formatSec(currentTime)}
              </span>
            </span>

            {/* Magnetic Push-Pull Toggle Button */}
            <button
              onClick={() => setMagneticPush(!magneticPush)}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                magneticPush
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(102,252,241,0.3)]'
                  : 'bg-black/60 border-gray-700 text-gray-400'
              }`}
              title="Коли кінець одного рядка зміщується, початок сусіднього рухається синхронно!"
            >
              {magneticPush ? <Link2 size={13} /> : <Link2Off size={13} />}
              <span>Магнітний стик (Push-Pull): {magneticPush ? 'УВІМК' : 'ВИМК'}</span>
            </button>
          </div>

          {/* Master Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="flex-grow accent-[#66fcf1] h-2 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mini-Track Visual Cue Blocks (CapCut Multi-Clip Strip) */}
          <div className="w-full h-5 bg-black/90 rounded-md border border-neon-teal/20 relative overflow-hidden flex items-center cursor-pointer">
            {cues.map((c, i) => {
              const leftPct = (c.startTime / totalDuration) * 100;
              const widthPct = Math.max(1, ((c.endTime - c.startTime) / totalDuration) * 100);
              const isActive = i === activeCueIdx;
              return (
                <div
                  key={c.id || i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCueIdx(i);
                    onSeek(c.startTime);
                  }}
                  className={`h-full absolute border-r border-black/40 transition-colors ${
                    isActive
                      ? 'bg-neon-cyan/70 text-black font-bold'
                      : i % 2 === 0
                      ? 'bg-neon-teal/30 hover:bg-neon-teal/50'
                      : 'bg-emerald-500/25 hover:bg-emerald-500/40'
                  }`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${i + 1}. ${c.text} (${c.startTime}s - ${c.endTime}s)`}
                />
              );
            })}
            {/* Playhead needle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 pointer-events-none shadow-[0_0_6px_red]"
              style={{ left: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSeek(Math.max(0, currentTime - 5))}
                className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
              >
                -5с
              </button>
              <button
                onClick={() => onSeek(Math.max(0, currentTime - 1))}
                className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
              >
                -1с
              </button>
              <button
                onClick={() => onSeek(Math.min(totalDuration, currentTime + 1))}
                className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
              >
                +1с
              </button>
              <button
                onClick={() => onSeek(Math.min(totalDuration, currentTime + 5))}
                className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
              >
                +5с
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="px-3 py-1 bg-neon-cyan text-black font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-[0_0_8px_#66fcf1]"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                {isPlaying ? 'Пауза' : 'Грати'}
              </button>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-black/60 border border-neon-teal/20 p-2.5 rounded-xl mb-3 font-mono text-xs">
          <button
            onClick={handleTapSync}
            className="px-3 py-1.5 bg-neon-green/20 text-neon-green border border-neon-green/50 hover:bg-neon-green hover:text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(158,255,161,0.2)]"
            title="Синхронізувати: встановити початок рядка за поточним часом"
          >
            <Clock size={13} /> Tap-Sync (Позначити рядок)
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoSplitLyrics}
              className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-gray-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
              title="Автоматично розбити текст пісні"
            >
              <Wand2 size={13} /> З тексту пісні
            </button>
            <button
              onClick={handleAddCue}
              className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan hover:text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus size={13} /> Додати рядок
            </button>
          </div>
        </div>

        {/* Timeline Cues List with Magnetic Push-Pull Controls */}
        <div ref={listRef} className="flex-grow overflow-y-auto space-y-2 pr-1">
          {cues.map((cue, idx) => {
            const isActive = idx === activeCueIdx;
            const cueDur = Math.max(0, cue.endTime - cue.startTime);

            return (
              <div
                key={cue.id || idx}
                onClick={() => setActiveCueIdx(idx)}
                className={`p-3 rounded-xl border flex flex-col gap-2.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neon-cyan/15 border-neon-cyan shadow-[0_0_12px_rgba(102,252,241,0.2)]'
                    : 'bg-black/40 border-neon-teal/20 hover:border-neon-teal/50'
                }`}
              >
                {/* Upper line: Index, Time badge, Text input, and Delete */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-neon-cyan shrink-0">
                    <span className="w-5 text-gray-500 font-bold">{idx + 1}.</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSeek(cue.startTime); }}
                      className="hover:underline flex items-center gap-1 bg-black/60 px-2 py-1 rounded border border-neon-teal/30 hover:border-neon-cyan text-xs font-bold"
                      title="Перемотати на початок рядка"
                    >
                      {formatSec(cue.startTime)} ➔ {formatSec(cue.endTime)}
                    </button>
                    <span className="text-[10px] text-neon-green/80 bg-black/40 px-1.5 py-0.5 rounded border border-neon-green/30">
                      {cueDur.toFixed(1)}с
                    </span>
                  </div>

                  <input
                    type="text"
                    value={cue.text}
                    onChange={(e) => {
                      const next = [...cues];
                      next[idx].text = e.target.value;
                      setCues(next);
                    }}
                    className="flex-grow bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg px-2.5 py-1.5 text-sm text-gray-100 font-sans focus:outline-none w-full sm:w-auto"
                  />

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSetCurrentStart(idx); }}
                      className="px-2 py-1 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[11px] font-mono text-gray-300 hover:text-neon-cyan cursor-pointer"
                      title="Встановити початок як поточний час треку"
                    >
                      Початок
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSetCurrentEnd(idx); }}
                      className="px-2 py-1 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[11px] font-mono text-gray-300 hover:text-neon-cyan cursor-pointer"
                      title="Встановити кінець як поточний час треку"
                    >
                      Кінець
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCue(idx); }}
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded cursor-pointer"
                      title="Видалити рядок"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Lower line: Interactive Duration & Boundary Adjustment ("звідки - доки" with push-pull) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neon-teal/10 text-xs font-mono text-gray-300">
                  {/* Start boundary controls */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-[11px]">Початок (звідки):</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBoundaries(idx, cue.startTime - 0.5, cue.endTime);
                      }}
                      className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[11px]"
                      title="-0.5с"
                    >
                      -0.5с
                    </button>
                    <span className="font-bold text-white px-1">{formatSec(cue.startTime)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBoundaries(idx, cue.startTime + 0.5, cue.endTime);
                      }}
                      className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[11px]"
                      title="+0.5с"
                    >
                      +0.5с
                    </button>
                  </div>

                  {/* Range slider for this cue's duration */}
                  <div className="flex items-center gap-2 flex-grow max-w-xs mx-2">
                    <input
                      type="range"
                      min={0}
                      max={totalDuration}
                      step={0.1}
                      value={cue.endTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleUpdateBoundaries(idx, cue.startTime, val);
                      }}
                      className="w-full accent-neon-cyan h-1.5 bg-gray-800 rounded cursor-pointer"
                      title="Рухати кінець рядка (зв'язано штовхає наступний рядок!)"
                    />
                  </div>

                  {/* End boundary controls */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-[11px]">Кінець (доки):</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBoundaries(idx, cue.startTime, cue.endTime - 0.5);
                      }}
                      className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[11px]"
                      title="-0.5с (штовхає наступний рядок)"
                    >
                      -0.5с
                    </button>
                    <span className="font-bold text-white px-1">{formatSec(cue.endTime)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBoundaries(idx, cue.startTime, cue.endTime + 0.5);
                      }}
                      className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[11px]"
                      title="+0.5с (штовхає наступний рядок)"
                    >
                      +0.5с
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
