import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Save,
  Wand2,
  Link2,
  Link2Off,
  FileText,
  Sliders,
  Type,
  RotateCcw,
  Check,
  HardDrive
} from 'lucide-react';
import { SubtitleCue, Track, WordTiming } from '../data';

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

/**
 * Ensures words and durations exist for a cue
 */
function ensureCueWords(cue: SubtitleCue): WordTiming[] {
  if (cue.words && cue.words.length > 0) {
    return cue.words;
  }
  const rawWords = cue.text.trim().split(/\s+/).filter(w => w.length > 0);
  if (rawWords.length === 0) {
    return [{ word: cue.text || '...', duration: Math.max(0.5, cue.endTime - cue.startTime) }];
  }
  const totalDur = Math.max(0.5, cue.endTime - cue.startTime);
  const totalChars = rawWords.reduce((sum, w) => sum + Math.max(1, w.length), 0);

  return rawWords.map((word) => ({
    word,
    duration: parseFloat(((totalDur * Math.max(1, word.length)) / totalChars).toFixed(2))
  }));
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
  const trackKey = track.id || track.filename || track.title;
  const draftKey = `andrelf_subtitles_draft_${trackKey}`;

  const [hasDraftLoaded, setHasDraftLoaded] = useState(false);
  const [cues, setCues] = useState<SubtitleCue[]>(() => {
    // 1. Try local draft first (prevents lost progress)
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    // 2. Existing track subtitles
    if (track.subtitles && track.subtitles.length > 0) {
      return track.subtitles.map(c => ({
        ...c,
        words: ensureCueWords(c)
      }));
    }

    // 3. Auto-generate preliminary cues from lyrics
    if (track.lyrics) {
      const lines = track.lyrics
        .split('\n')
        .map(l => l.trim())
        .filter(
          l =>
            l.length > 0 &&
            !l.startsWith('[') &&
            !l.toLowerCase().includes('куплет') &&
            !l.toLowerCase().includes('приспів') &&
            !l.toLowerCase().includes('брідж')
        );

      const count = lines.length;
      const safeDuration = duration > 10 ? duration : 180;
      const step = safeDuration / Math.max(1, count);
      return lines.map((text, idx) => {
        const start = parseFloat((idx * step).toFixed(2));
        const end = parseFloat(((idx + 1) * step).toFixed(2));
        const cue: SubtitleCue = {
          id: `cue_${idx}_${Date.now()}`,
          startTime: start,
          endTime: end,
          text
        };
        cue.words = ensureCueWords(cue);
        return cue;
      });
    }

    const defaultCue: SubtitleCue = {
      id: '1',
      startTime: 0,
      endTime: 5,
      text: 'Перший священний рядок сувою...'
    };
    defaultCue.words = ensureCueWords(defaultCue);
    return [defaultCue];
  });

  const [activeCueIdx, setActiveCueIdx] = useState<number>(0);
  const [magneticPush, setMagneticPush] = useState<boolean>(true);
  const [showLyricsModal, setShowLyricsModal] = useState<boolean>(false);
  const [lyricsTextBuffer, setLyricsTextBuffer] = useState<string>(() => {
    return track.lyrics || cues.map(c => c.text).join('\n');
  });
  const [letterDurationMs, setLetterDurationMs] = useState<number>(60);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const totalDuration = duration > 0 ? duration : (cues[cues.length - 1]?.endTime || 180);

  // Auto-save draft to localStorage whenever cues change
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(cues));
      setHasDraftLoaded(true);
    } catch (e) {}
  }, [cues, draftKey]);

  // Sync active cue with current audio playback time
  useEffect(() => {
    const idx = cues.findIndex(c => currentTime >= c.startTime && currentTime <= c.endTime);
    if (idx !== -1) {
      setActiveCueIdx(idx);
    }
  }, [currentTime, cues]);

  const formatSec = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00.00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const centis = Math.floor(Math.round((sec % 1) * 100));
    const safeCentis = centis >= 100 ? 99 : centis;
    return `${m}:${s < 10 ? '0' : ''}${s}.${safeCentis < 10 ? '0' : ''}${safeCentis}`;
  };

  /**
   * Linked Push-Pull boundary updater
   * Fixed to prevent teleporting fragments across the timeline!
   */
  const handleUpdateBoundaries = (idx: number, newStart: number, newEnd: number) => {
    const next = [...cues];
    if (!next[idx]) return;

    const prevStart = next[idx].startTime;
    const prevEnd = next[idx].endTime;

    const clampedStart = Math.max(0, parseFloat(newStart.toFixed(2)));
    const clampedEnd = Math.max(parseFloat((clampedStart + 0.01).toFixed(2)), parseFloat(newEnd.toFixed(2)));

    next[idx] = {
      ...next[idx],
      startTime: clampedStart,
      endTime: clampedEnd,
    };

    // Magnetic push-pull: cleanly connects adjacent cues WITHOUT distorting or teleporting
    if (magneticPush) {
      // 1. If end time changed and push is active:
      if (Math.abs(clampedEnd - prevEnd) > 0.005 && idx + 1 < next.length) {
        const nextDur = Math.max(0.1, parseFloat((next[idx + 1].endTime - next[idx + 1].startTime).toFixed(2)));
        // Next cue starts right where this one ends, keeping its duration intact
        next[idx + 1] = {
          ...next[idx + 1],
          startTime: clampedEnd,
          endTime: parseFloat((clampedEnd + nextDur).toFixed(2)),
        };
      }

      // 2. If start time changed and overlaps into previous cue:
      if (Math.abs(clampedStart - prevStart) > 0.005 && idx > 0) {
        if (next[idx - 1].endTime > clampedStart) {
          next[idx - 1] = {
            ...next[idx - 1],
            endTime: clampedStart,
          };
        }
      }
    }

    setCues(next);
  };

  // Instant snap to previous cue's end without deformation
  const handleSnapToPrevious = (idx: number) => {
    if (idx <= 0) return;
    const prev = cues[idx - 1];
    const dur = Math.max(0.1, parseFloat((cues[idx].endTime - cues[idx].startTime).toFixed(2)));
    const newStart = prev.endTime;
    const newEnd = parseFloat((newStart + dur).toFixed(2));
    const next = [...cues];
    next[idx] = {
      ...next[idx],
      startTime: newStart,
      endTime: newEnd,
    };
    setCues(next);
  };

  // Instant snap to next cue's start without deformation
  const handleSnapToNext = (idx: number) => {
    if (idx >= cues.length - 1) return;
    const nextCue = cues[idx + 1];
    if (nextCue.startTime <= cues[idx].startTime + 0.05) return;
    const next = [...cues];
    next[idx] = {
      ...next[idx],
      endTime: nextCue.startTime,
    };
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
    const newCue: SubtitleCue = {
      id: `cue_${Date.now()}`,
      startTime: parseFloat(newStart.toFixed(2)),
      endTime: parseFloat((newStart + 3.5).toFixed(2)),
      text: 'Новий священний рядок...',
    };
    newCue.words = ensureCueWords(newCue);
    setCues([...cues, newCue]);
  };

  const handleDeleteCue = (idx: number) => {
    if (cues.length <= 1) return;
    setCues(cues.filter((_, i) => i !== idx));
  };

  // Adjust duration of a specific word inside active cue
  const handleUpdateWordDuration = (wordIdx: number, newDur: number) => {
    const next = [...cues];
    const cue = next[activeCueIdx];
    if (!cue) return;
    const words = [...ensureCueWords(cue)];
    if (!words[wordIdx]) return;

    const clampedDur = Math.max(0.01, parseFloat(newDur.toFixed(2)));
    words[wordIdx] = {
      ...words[wordIdx],
      duration: clampedDur
    };

    // Update cue words and adjust cue.endTime to fit total word durations if needed
    const totalWordsDur = words.reduce((acc, w) => acc + w.duration, 0);
    cue.words = words;
    cue.endTime = parseFloat((cue.startTime + totalWordsDur).toFixed(2));

    setCues(next);
  };

  // Evenly distribute word durations across active cue
  const handleDistributeWordsEvenly = () => {
    const next = [...cues];
    const cue = next[activeCueIdx];
    if (!cue) return;
    const words = ensureCueWords(cue);
    const cueDur = Math.max(0.4, cue.endTime - cue.startTime);
    const perWord = parseFloat((cueDur / Math.max(1, words.length)).toFixed(2));

    cue.words = words.map(w => ({
      ...w,
      duration: perWord
    }));
    setCues(next);
  };

  // Proportional distribution by letter count
  const handleDistributeWordsByChars = () => {
    const next = [...cues];
    const cue = next[activeCueIdx];
    if (!cue) return;
    const words = ensureCueWords(cue);
    const cueDur = Math.max(0.4, cue.endTime - cue.startTime);
    const totalChars = words.reduce((sum, w) => sum + Math.max(1, w.word.length), 0);

    cue.words = words.map(w => ({
      ...w,
      duration: parseFloat(((cueDur * Math.max(1, w.word.length)) / totalChars).toFixed(2))
    }));
    setCues(next);
  };

  // Split lyrics from full text buffer
  const handleApplyLyricsText = () => {
    const lines = lyricsTextBuffer
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('[') && !l.toLowerCase().includes('куплет') && !l.toLowerCase().includes('приспів'));

    if (lines.length === 0) return;

    const safeDuration = duration > 10 ? duration : 180;
    const step = safeDuration / Math.max(1, lines.length);

    const newCues: SubtitleCue[] = lines.map((text, idx) => {
      const start = parseFloat((idx * step).toFixed(2));
      const end = parseFloat(((idx + 1) * step).toFixed(2));
      const c: SubtitleCue = {
        id: `cue_${idx}_${Date.now()}`,
        startTime: start,
        endTime: end,
        text
      };
      c.words = ensureCueWords(c);
      return c;
    });

    setCues(newCues);
    setShowLyricsModal(false);
  };

  const handleSave = () => {
    onSaveSubtitles(cues);
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {}
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  // Active cue and words for live highlight
  const currentCue = cues[activeCueIdx];
  const activeWords = currentCue ? ensureCueWords(currentCue) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 text-gray-100 animate-[fadeIn_0.2s_ease-out]">
      <div className="glass-panel w-full h-full max-w-[1920px] rounded-2xl p-3 sm:p-4 glow-box-cyan flex flex-col relative overflow-hidden bg-[#070b13]/95 border-2 border-neon-cyan/50 shadow-[0_0_30px_rgba(0,0,0,0.95)]">
        
        {/* Top Full-Width Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-neon-teal/30 pb-2 mb-2 gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan shadow-[0_0_12px_#66fcf1] shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-neon-cyan m-0 truncate">
                  Студія Субтитрів CapCut
                </h3>
                <span className="text-[9px] text-neon-green font-mono bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                  <HardDrive size={10} /> Автозбереження
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono truncate max-w-sm sm:max-w-md">
                Трек: <span className="text-white font-bold">{track.title}</span> • Точність до 0.01с
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowLyricsModal(true)}
              className="px-2.5 py-1 bg-black/60 hover:bg-neon-teal/20 text-gray-300 hover:text-neon-cyan border border-neon-teal/40 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="Переглянути або імпортувати текст пісні"
            >
              <FileText size={13} /> <span>Текст пісні</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_#66fcf1]"
              title="Зберегти субтитри в сувій"
            >
              <Save size={13} /> <span>{saveSuccessNotice ? 'Збережено! ✓' : 'Зберегти'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-xl cursor-pointer"
              title="Закрити Капкат"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Body: 1/4 Left (Cues & Timing) + 3/4 Right (All Features & Controls) */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 flex-grow min-h-0 overflow-hidden">
          
          {/* LEFT 1/4 COLUMN: "на тій 1/4 зліва в нас стоять порядковий таймінг" */}
          <div className="w-full lg:w-1/4 xl:w-1/4 min-w-[310px] max-w-full lg:max-w-sm shrink-0 flex flex-col h-full border-b lg:border-b-0 lg:border-r border-neon-teal/25 pb-2 lg:pb-0 lg:pr-3 overflow-hidden">
            {/* Left Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neon-teal/15 shrink-0">
              <span className="font-cinzel text-xs font-bold text-neon-cyan flex items-center gap-1.5">
                <Clock size={13} /> Порядковий таймінг ({cues.length})
              </span>
              <button
                type="button"
                onClick={handleAddCue}
                className="px-2 py-1 bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black border border-neon-cyan/40 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Додати новий рядок"
              >
                <Plus size={12} /> Додати рядок
              </button>
            </div>

            {/* Scrollable list of cues */}
            <div ref={listRef} className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-0">
              {cues.map((cue, idx) => {
                const isActive = idx === activeCueIdx;
                const cueDur = Math.max(0, cue.endTime - cue.startTime);

                return (
                  <div
                    key={cue.id || idx}
                    onClick={() => setActiveCueIdx(idx)}
                    className={`p-2.5 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neon-cyan/15 border-neon-cyan shadow-[0_0_12px_rgba(102,252,241,0.2)]'
                        : 'bg-black/40 border-neon-teal/20 hover:border-neon-teal/50'
                    }`}
                  >
                    {/* Row 1: Index, Time seek badge, Duration, and Action buttons */}
                    <div className="flex items-center justify-between gap-1 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-neon-cyan">
                        <span className="w-4 text-gray-500 font-bold text-[11px]">{idx + 1}.</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSeek(cue.startTime);
                          }}
                          className="hover:underline flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded border border-neon-teal/30 hover:border-neon-cyan text-[11px] font-bold"
                          title="Перемотати аудіо на початок рядка"
                        >
                          {formatSec(cue.startTime)} ➔ {formatSec(cue.endTime)}
                        </button>
                        <span className="text-[10px] text-neon-green/80 bg-black/50 px-1 py-0.2 rounded border border-neon-green/30">
                          {cueDur.toFixed(2)}с
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCurrentStart(idx);
                          }}
                          className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[10px] font-mono text-gray-300 hover:text-neon-cyan cursor-pointer"
                          title="Встановити початок як поточний час треку"
                        >
                          Поч
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCurrentEnd(idx);
                          }}
                          className="px-1.5 py-0.5 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[10px] font-mono text-gray-300 hover:text-neon-cyan cursor-pointer"
                          title="Встановити кінець як поточний час треку"
                        >
                          Кін
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCue(idx);
                          }}
                          className="p-1 text-gray-500 hover:text-red-400 rounded cursor-pointer"
                          title="Видалити рядок"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Text input for this cue */}
                    <input
                      type="text"
                      value={cue.text}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const next = [...cues];
                        next[idx].text = e.target.value;
                        next[idx].words = ensureCueWords(next[idx]);
                        setCues(next);
                      }}
                      className="w-full bg-black/70 border border-neon-teal/30 focus:border-neon-cyan rounded-lg px-2 py-1 text-xs text-gray-100 font-sans focus:outline-none"
                      placeholder="Текст рядка..."
                    />

                    {/* Row 3: Precision 0.01s start/end controls */}
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-neon-teal/10 text-[11px] font-mono text-gray-300">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        {/* Start time controls */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-gray-400 text-[10px] font-bold w-6">Від:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime - 0.1, cue.endTime);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="-0.10с"
                          >
                            -0.1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime - 0.01, cue.endTime);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="-0.01с"
                          >
                            -0.01
                          </button>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={cue.endTime - 0.01}
                            value={cue.startTime}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) {
                                handleUpdateBoundaries(idx, val, cue.endTime);
                              }
                            }}
                            className="w-14 bg-black/90 border border-neon-teal/40 focus:border-neon-cyan rounded px-1 py-0.2 text-center text-[11px] text-white font-bold font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime + 0.01, cue.endTime);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="+0.01с"
                          >
                            +0.01
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime + 0.1, cue.endTime);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="+0.10с"
                          >
                            +0.1
                          </button>
                        </div>

                        {/* End time controls */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-gray-400 text-[10px] font-bold w-6">До:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime, cue.endTime - 0.1);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="-0.10с"
                          >
                            -0.1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime, cue.endTime - 0.01);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="-0.01с"
                          >
                            -0.01
                          </button>
                          <input
                            type="number"
                            step="0.01"
                            min={cue.startTime + 0.01}
                            max={totalDuration}
                            value={cue.endTime}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) {
                                handleUpdateBoundaries(idx, cue.startTime, val);
                              }
                            }}
                            className="w-14 bg-black/90 border border-neon-teal/40 focus:border-neon-cyan rounded px-1 py-0.2 text-center text-[11px] text-white font-bold font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime, cue.endTime + 0.01);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="+0.01с"
                          >
                            +0.01
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateBoundaries(idx, cue.startTime, cue.endTime + 0.1);
                            }}
                            className="px-1 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px]"
                            title="+0.10с"
                          >
                            +0.1
                          </button>
                        </div>
                      </div>

                      {/* Range slider & Explicit Snap buttons */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <input
                          type="range"
                          min={parseFloat((cue.startTime + 0.01).toFixed(2))}
                          max={Math.max(cue.startTime + 15, totalDuration)}
                          step={0.01}
                          value={cue.endTime}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val > cue.startTime) {
                              handleUpdateBoundaries(idx, cue.startTime, val);
                            }
                          }}
                          className="flex-grow accent-neon-cyan h-1 bg-gray-800 rounded cursor-pointer"
                          title="Рухати кінець рядка (зв'язано рухає наступний рядок без деформації)"
                        />
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSnapToPrevious(idx);
                            }}
                            className="px-1.5 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[9px] font-mono text-neon-teal hover:text-neon-cyan flex items-center gap-0.5 cursor-pointer shrink-0"
                            title="Пристикувати до кінця попереднього рядка"
                          >
                            <Link2 size={10} /> До попер.
                          </button>
                        )}
                        {idx < cues.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSnapToNext(idx);
                            }}
                            className="px-1.5 py-0.2 bg-black/70 hover:bg-neon-cyan/20 border border-neon-teal/40 rounded text-[9px] font-mono text-neon-teal hover:text-neon-cyan flex items-center gap-0.5 cursor-pointer shrink-0"
                            title="Пристикувати наступний рядок до кінця цього"
                          >
                            <Link2 size={10} /> Наступн.
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 3/4 COLUMN: "а весь його функціонал все закріплено за праву частину монітора" */}
          <div className="w-full lg:w-3/4 xl:w-3/4 flex-grow flex flex-col h-full overflow-y-auto min-w-0 pl-0 lg:pl-1 gap-2.5">
            
            {/* 1. Large Live Karaoke Preview Screen: Sleek, high-contrast, pure glowing words - NO EXTRA CLUTTER */}
            <div className="bg-black/95 border-2 border-neon-cyan/50 rounded-xl p-3 sm:p-4 text-center relative overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(102,252,241,0.08)]">
              <div className="text-xs font-mono text-neon-cyan mb-2 flex flex-wrap justify-between items-center gap-2 px-1 border-b border-neon-teal/20 pb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-neon-cyan uppercase tracking-wide text-xs">
                  <Type size={14} className="text-neon-cyan" /> Жива караоке-підсвітка (Рядок #{activeCueIdx + 1})
                </span>
                <div className="flex items-center gap-2">
                  {currentCue && (
                    <button
                      type="button"
                      onClick={() => onSeek(currentCue.startTime)}
                      className="px-2 py-0.5 bg-neon-cyan/20 hover:bg-neon-cyan hover:text-black border border-neon-cyan/40 rounded text-[11px] font-mono text-neon-cyan transition-all cursor-pointer"
                      title="Перемотати аудіо на цей рядок"
                    >
                      ▶ На початок рядка ({formatSec(currentCue.startTime)})
                    </button>
                  )}
                  <span className="text-white font-bold font-mono bg-black/60 px-2 py-0.5 rounded border border-neon-teal/40">
                    {formatSec(currentTime)} / {formatSec(totalDuration)}
                  </span>
                </div>
              </div>

              {/* Fluid Wrapped Glowing Words: Clean, crystal clear text, NO duplicate banners below! */}
              <div className="min-h-[70px] flex flex-col items-center justify-center py-2">
                {currentCue && currentCue.text?.trim() ? (
                  <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-full text-center px-2 font-cinzel text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed break-words">
                    {(() => {
                      let wordStartAcc = currentCue.startTime;
                      return activeWords.map((w, wIdx) => {
                        const wStart = wordStartAcc;
                        const wEnd = wStart + w.duration;
                        wordStartAcc = wEnd;

                        const isPast = currentTime >= wEnd;
                        const isUpcoming = currentTime < wStart;
                        const isCurrent = !isPast && !isUpcoming;

                        const chars = Array.from(w.word);
                        const charDuration = w.duration / Math.max(1, chars.length);

                        return (
                          <span
                            key={wIdx}
                            onClick={() => onSeek(wStart)}
                            className={`inline-flex items-center px-2 py-1 rounded-xl transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-neon-cyan/25 border-2 border-neon-cyan text-white shadow-[0_0_18px_rgba(102,252,241,0.7)] scale-105'
                                : isPast
                                ? 'text-neon-cyan border border-neon-cyan/40 bg-neon-teal/10'
                                : 'text-gray-100 border border-white/20 bg-white/5 hover:border-neon-teal/50 hover:bg-white/10'
                            }`}
                            title={`Слово: "${w.word}" (${formatSec(wStart)} - ${formatSec(wEnd)}, ${w.duration.toFixed(2)}с)`}
                          >
                            {chars.map((char, cIdx) => {
                              const charStart = wStart + cIdx * charDuration;
                              const charEnd = charStart + charDuration;
                              const isCharPast = currentTime >= charEnd;
                              const isCharCurrent = currentTime >= charStart && currentTime < charEnd;

                              return (
                                <span
                                  key={cIdx}
                                  className={`transition-colors duration-75 ${
                                    isCharPast
                                      ? 'text-neon-cyan font-black drop-shadow-[0_0_8px_#66fcf1]'
                                      : isCharCurrent
                                      ? 'text-white font-extrabold scale-110 drop-shadow-[0_0_12px_#ffffff] underline'
                                      : 'text-gray-100 font-bold'
                                  }`}
                                >
                                  {char}
                                </span>
                              );
                            })}
                          </span>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-gray-300 text-sm font-sans mb-1 font-bold">
                      {currentCue ? 'Текст цього рядка порожній' : '... Музичний програш / Пауза ...'}
                    </span>
                    <span className="text-neon-cyan text-xs font-mono">
                      {currentCue ? 'Введіть слова в поле ліворуч' : 'Оберіть рядок зі списку ліворуч або натисніть Play'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Global Timeline Track, Visual mini blocks, and Playback Controller */}
            <div className="bg-black/85 border border-neon-cyan/30 rounded-xl p-3 flex flex-col gap-2 font-mono text-xs shrink-0">
              <div className="flex flex-wrap justify-between items-center text-gray-300 gap-2">
                <span className="text-neon-cyan font-bold flex items-center gap-1.5">
                  <span>⏱️ Позиція:</span>
                  <span className="text-white bg-black/60 px-2 py-0.5 rounded border border-neon-teal/40">
                    {formatSec(currentTime)}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Magnetic Snap Toggle */}
                  <button
                    type="button"
                    onClick={() => setMagneticPush(!magneticPush)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                      magneticPush
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(102,252,241,0.3)]'
                        : 'bg-black/60 border-gray-700 text-gray-400'
                    }`}
                    title="Магнітний стик: кінець одного рядка штовхає початок наступного без деформації"
                  >
                    {magneticPush ? <Link2 size={13} /> : <Link2Off size={13} />}
                    <span>Магнітний стик: {magneticPush ? 'УВІМК' : 'ВИМК'}</span>
                  </button>
                </div>
              </div>

              {/* Master Timeline Scrubber */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.01}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="flex-grow accent-[#66fcf1] h-2 bg-gray-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Mini-Track Visual Cue Blocks */}
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
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 pointer-events-none shadow-[0_0_6px_red]"
                  style={{ left: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
                />
              </div>

              {/* Scrub Navigation & Playback Controls */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-1 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSeek(Math.max(0, currentTime - 5))}
                    className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
                  >
                    -5с
                  </button>
                  <button
                    type="button"
                    onClick={() => onSeek(Math.max(0, currentTime - 1))}
                    className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
                  >
                    -1с
                  </button>
                  <button
                    type="button"
                    onClick={() => onSeek(Math.min(totalDuration, currentTime + 1))}
                    className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
                  >
                    +1с
                  </button>
                  <button
                    type="button"
                    onClick={() => onSeek(Math.min(totalDuration, currentTime + 5))}
                    className="px-2 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan cursor-pointer"
                  >
                    +5с
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTapSync}
                    className="px-2.5 py-1 bg-neon-green/20 text-neon-green border border-neon-green/50 hover:bg-neon-green hover:text-black rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Позначити початок поточного рядка"
                  >
                    <Clock size={12} /> Tap-Sync
                  </button>
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="px-3.5 py-1 bg-neon-cyan text-black font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_#66fcf1]"
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    {isPlaying ? 'Пауза' : 'Грати'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Word & Letter Duration Breakdown Panel */}
            {currentCue && (
              <div className="bg-black/85 border border-neon-teal/30 rounded-xl p-3 text-xs font-mono space-y-2 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neon-teal/20 pb-1.5">
                  <span className="text-neon-cyan font-bold flex items-center gap-1.5">
                    <Sliders size={13} /> Розбивка тривалості слів та літер (Рядок #{activeCueIdx + 1})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDistributeWordsEvenly}
                      className="px-2 py-0.5 bg-black/60 hover:bg-neon-teal/20 border border-neon-teal/30 text-gray-300 hover:text-neon-cyan rounded cursor-pointer"
                      title="Порівну поділити час між словами"
                    >
                      ⚖️ Порівну
                    </button>
                    <button
                      type="button"
                      onClick={handleDistributeWordsByChars}
                      className="px-2 py-0.5 bg-black/60 hover:bg-neon-teal/20 border border-neon-teal/30 text-gray-300 hover:text-neon-cyan rounded cursor-pointer"
                      title="Поділити час пропорційно довжині слів"
                    >
                      🔤 За кількістю літер
                    </button>
                  </div>
                </div>

                {/* List of Words with individual duration inputs & step buttons */}
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {activeWords.map((w, wIdx) => (
                    <div
                      key={wIdx}
                      className="bg-black/70 border border-neon-teal/30 rounded-lg p-2 flex flex-col gap-1 min-w-[130px]"
                    >
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span className="text-neon-teal font-bold">Слово {wIdx + 1}:</span>
                        <span className="text-gray-300 font-sans font-bold truncate max-w-[80px]">
                          «{w.word}»
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateWordDuration(wIdx, w.duration - 0.01)}
                          className="px-1 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px] font-mono"
                          title="-0.01с"
                        >
                          -0.01
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateWordDuration(wIdx, w.duration - 0.1)}
                          className="px-1 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px] font-mono"
                          title="-0.1с"
                        >
                          -0.1
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="60"
                          value={w.duration}
                          onChange={(e) => handleUpdateWordDuration(wIdx, parseFloat(e.target.value) || 0.01)}
                          className="w-16 bg-black/90 border border-neon-teal/40 rounded px-1 py-0.5 text-center text-xs text-neon-cyan font-bold font-mono focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-400">с</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateWordDuration(wIdx, w.duration + 0.1)}
                          className="px-1 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px] font-mono"
                          title="+0.1с"
                        >
                          +0.1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateWordDuration(wIdx, w.duration + 0.01)}
                          className="px-1 py-0.5 bg-black/60 hover:bg-neon-cyan/20 border border-neon-teal/30 rounded text-neon-cyan text-[9px] font-mono"
                          title="+0.01с"
                        >
                          +0.01
                        </button>
                      </div>
                      <div className="text-[9px] text-gray-400 text-center font-mono">
                        ~{(w.duration / Math.max(1, w.word.length) * 1000).toFixed(0)}мс / буква
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Lyrics Text Input & Output Tool */}
        {showLyricsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="glass-panel max-w-2xl w-full rounded-2xl p-5 glow-box-cyan flex flex-col space-y-3 relative">
              <div className="flex justify-between items-center border-b border-neon-teal/30 pb-2">
                <h4 className="font-cinzel text-base text-neon-cyan font-bold flex items-center gap-2">
                  <FileText size={16} /> Текст пісні (Введення та експорт слів)
                </h4>
                <button
                  type="button"
                  onClick={() => setShowLyricsModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-gray-400 font-mono">
                Тут ви можете переглянути повний текст, скопіювати його або вставити новий текст для автоматичної розбивки на рядки та слова.
              </p>

              <textarea
                rows={10}
                value={lyricsTextBuffer}
                onChange={(e) => setLyricsTextBuffer(e.target.value)}
                placeholder="Введіть або скопіюйте сюди текст пісні рядок за рядком..."
                className="w-full bg-black/80 border border-neon-teal/30 focus:border-neon-cyan rounded-xl p-3 text-xs text-gray-100 font-sans focus:outline-none"
              />

              <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(lyricsTextBuffer);
                  }}
                  className="px-3 py-1.5 bg-black/60 hover:bg-neon-teal/20 text-gray-300 border border-neon-teal/30 rounded-xl text-xs font-mono cursor-pointer"
                >
                  📋 Скопіювати текст
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLyricsModal(false)}
                    className="px-3 py-1.5 text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyLyricsText}
                    className="px-5 py-1.5 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer shadow-[0_0_12px_#66fcf1]"
                  >
                    ⚡ Розбити на караоке-рядки та слова
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
