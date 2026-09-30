import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shuffle,
  Repeat,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Heart,
  HeartOff,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Lock,
  LogOut,
  X,
  Search,
  BookOpen,
  BookMarked,
  Scroll,
  Eye,
  Swords,
  Sparkles,
  TreePine,
  UploadCloud,
  Copy,
  PenLine,
  Key,
  ShieldAlert,
  ArrowRightLeft,
  CirclePlus,
  ArrowUp,
  ArrowDown,
  Save,
  Music,
  Check,
  Flame,
  Coffee,
  HelpCircle,
  Wand2,
  Sliders,
  FileText,
  RotateCcw,
  Sparkle,
  Share2,
  Download,
  FolderArchive,
  RefreshCw,
  AlertTriangle,
  FileAudio,
  HardDrive,
  Subtitles,
  Disc
} from 'lucide-react';
import { rulesData as defaultRules, tracksData as defaultTracks, Track, AlphabetItem, DictionaryItem, GrammarItem, SubtitleCue, alphabetData as defaultAlphabet, grammarData as defaultGrammar } from './data';
import { downloadGitHubUpdateZip, downloadDataTsOnly } from './utils/githubExporter';
import { SITE_BUILD_VERSION } from './version';
import {
  saveAudioToLocalStore,
  getAudioFromLocalStore,
  preserveTrackMetadata,
  getPreservedTracks,
  removePreservedTrack
} from './utils/audioStorage';
import { PvpArena } from './components/PvpArena';
import { SubtitleStudio } from './components/SubtitleStudio';
import { AudioWaveVisualizer } from './components/AudioWaveVisualizer';
import { generateDarkFolkAudio } from './utils/synthGenerator';
import { ukrainianToDybriv, dybrivToUkrainian } from './utils/runicTranslator';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  User,
  fetchCustomTracksFromFirestore,
  saveTrackToFirestore,
  deleteTrackFromFirestore,
  updateTrackInFirestore,
  fetchTrackOverrides,
  saveTrackOverride,
  fetchTrackAudioBlobFromFirestore,
  updateTrackAudioAndMetadata,
  fetchClaimedAdmins,
  fetchUserPreferences,
  saveUserPreferences,
  fetchGlobalLikes,
  toggleGlobalLikeInFirestore,
  fetchSubAdmins,
  checkIsSubAdminInFirestore,
  fetchRulesFromFirestore,
  saveRulesToFirestore,
  fetchAlphabetFromFirestore,
  saveAlphabetToFirestore,
  fetchDictionaryFromFirestore,
  saveWordToDictionary,
  deleteWordFromDictionary,
  fetchGrammarFromFirestore,
  saveGrammarToFirestore,
  saveTrackSubtitlesToFirestore
} from './firebase';

const RulesList = React.memo(({ rules, onTeaClick, runicMode }: { rules: string[]; onTeaClick: (e: React.MouseEvent) => void; runicMode: boolean }) => (
  <ol className="list-none p-0 mt-6 sm:mt-8 text-left space-y-4" onClick={onTeaClick}>
    {rules.map((rule, idx) => {
      const runeNums = ['ᚨ', 'ᛒ', 'ᚹ', 'Γ', 'Ғ', 'Ґ', 'ᛞ', 'Е', 'Є', 'Ж', 'Ӂ', 'Џ', 'З', 'И'];
      const badge = runeNums[idx] ? `${runeNums[idx]}.` : `${idx + 1}.`;
      return (
        <li
          key={idx}
          className="relative pl-12 sm:pl-16 p-4 rounded-xl bg-black/40 border border-neon-teal/20 hover:border-neon-cyan/50 text-base sm:text-lg leading-relaxed transition-all duration-300 hover:translate-x-1.5 hover:bg-black/60 group shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          <span className="absolute left-3 top-4 text-neon-cyan font-bold font-mono text-sm sm:text-base">
            {badge} ◆
          </span>
          <div className="text-gray-200 group-hover:text-white" dangerouslySetInnerHTML={{ __html: rule }} />
          {runicMode && (
            <div className="mt-2 text-xs font-mono text-neon-teal border-t border-neon-teal/10 pt-1.5 opacity-90">
              ᚱ {ukrainianToDybriv(rule.replace(/<[^>]*>?/gm, ''))}
            </div>
          )}
        </li>
      );
    })}
  </ol>
));

const formatAudioUrl = (url?: string) => {
  if (!url) return undefined;
  let formatted = url;
  if (formatted.includes('github.com') && formatted.includes('/blob/')) {
    formatted = formatted.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  if (formatted.includes('drive.google.com')) {
    const match = formatted.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      formatted = `https://docs.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return formatted;
};

export default function App() {
  // --- Refs ---
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const synthCache = useRef<Record<string, string>>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'rules' | 'music' | 'runes' | 'oracle' | 'pvp'>('rules');
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeTooltip, setEyeTooltip] = useState('');
  const [eyeClicks, setEyeClicks] = useState(0);
  const [pvpUnlocked, setPvpUnlocked] = useState(false);
  const [runicMode, setRunicMode] = useState<boolean>(() => {
    return localStorage.getItem('psychoAndriy_runicMode') === 'true';
  });
  const [showRunicExplainer, setShowRunicExplainer] = useState(false);

  // --- Music & Karaoke State ---
  const [tracks, setTracks] = useState<Track[]>(defaultTracks);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showCapCutStudio, setShowCapCutStudio] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const [newTrack, setNewTrack] = useState({
    title: '',
    author: 'Психо-Андрій',
    coAuthor: '',
    description: '',
    url: '',
    lyrics: '',
    filename: ''
  });
  const [newTrackFile, setNewTrackFile] = useState<File | null>(null);
  const [addError, setAddError] = useState('');
  const [isSavingTrack, setIsSavingTrack] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTrackData, setEditTrackData] = useState({
    title: '',
    artist: '',
    description: '',
    lyrics: '',
    filename: '',
    url: ''
  });
  const [editAudioFile, setEditAudioFile] = useState<File | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const openEditModalForTrack = (track: Track) => {
    const idx = tracks.findIndex(t => (t.id || t.filename) === (track.id || track.filename));
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
    setEditTrackData({
      title: track.title || '',
      artist: track.author || '',
      description: track.description || '',
      lyrics: track.lyrics || '',
      filename: track.filename || '',
      url: track.url || ''
    });
    setEditAudioFile(null);
    setIsEditModalOpen(true);
  };

  // Auth & Permissions
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdminName, setCurrentAdminName] = useState<string | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('andrelf_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [hasLocalEdits, setHasLocalEdits] = useState<boolean>(() => {
    try {
      return localStorage.getItem('andrelf_has_local_edits') === 'true';
    } catch {
      return false;
    }
  });
  const [showSiteUpdatedModal, setShowSiteUpdatedModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Secret 5-clicks tracker
  const adminClickCount = useRef(0);
  const lastAdminClickTime = useRef(0);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | undefined>(undefined);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Player Controls
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [dislikedTracks, setDislikedTracks] = useState<string[]>([]);
  const [globalLikes, setGlobalLikes] = useState<Record<string, number>>({});
  const [isSubAdmin, setIsSubAdmin] = useState(false);

  // Rules State
  const [rules, setRules] = useState<string[]>(defaultRules);
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [editRulesList, setEditRulesList] = useState<string[]>([]);

  // Runes, Alphabet & Dictionary & Grammar State
  const [runesSubTab, setRunesSubTab] = useState<'translator' | 'alphabet' | 'dictionary' | 'grammar'>('translator');
  const [translatorInput, setTranslatorInput] = useState('');
  const [translationDirection, setTranslationDirection] = useState<'ukrToDib' | 'dibToUkr'>('ukrToDib');
  const [sacredOEnabled, setSacredOEnabled] = useState(true);
  const [smartStressEnabled, setSmartStressEnabled] = useState(true);

  const [alphabet, setAlphabet] = useState<AlphabetItem[]>(defaultAlphabet);
  const [isEditingAlphabet, setIsEditingAlphabet] = useState(false);
  const [editingAlphabetList, setEditingAlphabetList] = useState<AlphabetItem[]>([]);

  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  const [dictSearch, setDictSearch] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [runicInput, setRunicInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');
  const [isSavingWord, setIsSavingWord] = useState(false);

  const [grammar, setGrammar] = useState<GrammarItem[]>(defaultGrammar);
  const [isEditingGrammar, setIsEditingGrammar] = useState(false);
  const [editingGrammarList, setEditingGrammarList] = useState<GrammarItem[]>([]);

  const [copiedText, setCopiedText] = useState(false);

  // Oracle State
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [oracleAnswer, setOracleAnswer] = useState('');
  const [isOracleConsulting, setIsOracleConsulting] = useState(false);

  // Toast & Confirm
  const [showShareModal, setShowShareModal] = useState(false);
  const [publicShareUrl, setPublicShareUrl] = useState(() => {
    if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')) {
      return window.location.origin;
    }
    return 'https://andrelf-419742933988.europe-west3.run.app';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setPublicShareUrl(window.location.origin);
    }
  }, []);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error'; title?: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const showToast = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info', title?: string) => {
    setToast({ message: msg, type, title });
    setTimeout(() => {
      setToast(curr => (curr && curr.message === msg ? null : curr));
    }, 4500);
  }, []);

  const playSfx = useCallback((type: 'tea' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'tea') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {}
  }, []);

  const loadTracks = useCallback(async () => {
    try {
      let custom: any[] = [];
      let overrides: Record<string, any> = {};
      try {
        custom = await fetchCustomTracksFromFirestore();
        overrides = await fetchTrackOverrides();
      } catch (e) {}

      // 1. Deleted tracks set (so admin deletion persists)
      let deletedSet = new Set<string>();
      try {
        const deletedArr = JSON.parse(localStorage.getItem('psychoAndriy_deleted_tracks') || '[]');
        deletedSet = new Set(deletedArr);
      } catch (e) {}

      // 2. Merge local storage overrides & custom tracks
      let localOverrides: Record<string, any> = {};
      try {
        localOverrides = JSON.parse(localStorage.getItem('psychoAndriy_track_overrides') || '{}');
      } catch (e) {}

      let localCustom: Track[] = [];
      try {
        localCustom = JSON.parse(localStorage.getItem('psychoAndriy_custom_tracks') || '[]');
      } catch (e) {}

      const mergedOverrides = { ...overrides, ...localOverrides };
      const combinedCustom = [
        ...custom,
        ...localCustom.filter(lc => !custom.some(c => c.id === lc.id))
      ];

      // 3. Filter default tracks by deletedSet
      const filteredDefaults = defaultTracks.filter(
        (dt) => !deletedSet.has(dt.filename) && !deletedSet.has(dt.id || '')
      );

      const defaultMerged: Track[] = filteredDefaults.map((dt) => {
        const ov = mergedOverrides[dt.filename];
        const cm = combinedCustom.find(
          (c) => c.id === dt.filename || (c.title && c.title.trim().toLowerCase() === dt.title.trim().toLowerCase())
        );
        let trk: Track = { id: dt.filename, isCustom: false, hasFile: false, fileType: 'audio/mpeg', ...dt };
        if (ov) {
          trk = {
            ...trk,
            filename: ov.filename || trk.filename,
            title: ov.title || trk.title,
            author: ov.artist || trk.author,
            description: ov.description || trk.description,
            lyrics: ov.lyrics || trk.lyrics,
            subtitles: (ov.subtitles && ov.subtitles.length >= (dt.subtitles?.length || 0)) ? ov.subtitles : (dt.subtitles || ov.subtitles),
            url: ov.url || trk.url,
            hasFile: ov.hasFile ?? trk.hasFile,
            fileType: ov.fileType || trk.fileType,
            isCustom: ov.hasFile ? true : trk.isCustom
          };
        }
        if (cm) {
          trk = {
            ...trk,
            id: cm.id,
            title: cm.title || trk.title,
            author: cm.author || trk.author,
            description: cm.description || trk.description,
            url: cm.url || trk.url,
            lyrics: cm.lyrics || trk.lyrics,
            subtitles: (cm.subtitles && cm.subtitles.length >= (dt.subtitles?.length || 0)) ? cm.subtitles : (dt.subtitles || cm.subtitles),
            hasFile: cm.hasFile ?? trk.hasFile,
            fileType: cm.fileType || trk.fileType,
            isCustom: true
          };
        }
        return trk;
      });

      const pureCustom: Track[] = combinedCustom
        .filter(
          (c) =>
            !deletedSet.has(c.id || '') &&
            !defaultTracks.some(
              (dt) => dt.filename === c.id || (c.title && dt.title.trim().toLowerCase() === c.title.trim().toLowerCase())
            )
        )
        .map((c) => ({
          id: c.id || '',
          filename: c.filename || c.id || '',
          title: c.title,
          author: c.author,
          coAuthor: c.coAuthor || '',
          description: c.description || '',
          url: c.url || '',
          lyrics: c.lyrics || '',
          subtitles: c.subtitles || [],
          isCustom: true,
          hasFile: c.hasFile,
          fileType: c.fileType,
          createdAt: c.createdAt
        }));

      // 4. Preserved tracks previously listened to by this user!
      // If a track was removed from GitHub, but the user listened to it, it stays in their local library!
      let preservedList: any[] = [];
      try {
        preservedList = await getPreservedTracks();
      } catch (e) {}

      const retainedTracks: Track[] = [];
      for (const pt of preservedList) {
        const pKey = pt.id || pt.filename;
        if (!pKey || deletedSet.has(pKey)) continue;
        const existsInDefault = defaultMerged.some(
          (d) => (d.id || d.filename) === pKey || d.title?.trim().toLowerCase() === pt.title?.trim().toLowerCase()
        );
        const existsInCustom = pureCustom.some((c) => (c.id || c.filename) === pKey);
        if (!existsInDefault && !existsInCustom) {
          retainedTracks.push({
            ...pt,
            id: pt.id || pt.filename,
            isCustom: pt.isCustom ?? false
          });
        }
      }

      setTracks([...defaultMerged, ...pureCustom, ...retainedTracks]);
    } catch (err) {
      console.warn('Tracks loaded with fallback:', err);
    }
  }, []);

  const loadRules = useCallback(async () => {
    try {
      const localRules = localStorage.getItem('psychoAndriy_rules');
      if (localRules) {
        try {
          const parsed = JSON.parse(localRules);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRules(parsed);
            return;
          }
        } catch (e) {}
      }
      const r = await fetchRulesFromFirestore(defaultRules);
      if (r && r.length > 0) setRules(r);
    } catch (err) {}
  }, []);

  const loadAlphabet = useCallback(async () => {
    try {
      const localAlpha = localStorage.getItem('psychoAndriy_alphabet');
      if (localAlpha) {
        try {
          const parsed = JSON.parse(localAlpha);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAlphabet(parsed);
            return;
          }
        } catch (e) {}
      }
      const a = await fetchAlphabetFromFirestore();
      if (a && a.length > 0) setAlphabet(a);
    } catch (err) {}
  }, []);

  const loadDictionary = useCallback(async () => {
    try {
      let localDict: DictionaryItem[] = [];
      try {
        localDict = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
      } catch (e) {}
      const d = await fetchDictionaryFromFirestore();
      const combined = [...d, ...localDict.filter(ld => !d.some(x => x.word === ld.word))];
      setDictionary(combined);
    } catch (err) {
      try {
        const localDict = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
        if (localDict.length > 0) setDictionary(localDict);
      } catch (e) {}
    }
  }, []);

  const loadGrammar = useCallback(async () => {
    try {
      const localGram = localStorage.getItem('psychoAndriy_grammar');
      if (localGram) {
        try {
          const parsed = JSON.parse(localGram);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGrammar(parsed);
            return;
          }
        } catch (e) {}
      }
      const g = await fetchGrammarFromFirestore();
      if (g && g.length > 0) setGrammar(g);
    } catch (err) {}
  }, []);

  // Init Data and Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setCurrentUser(usr);
      if (usr) {
        try {
          const admins = await fetchClaimedAdmins();
          let adminName: string | null = null;
          for (const [name, adm] of Object.entries(admins)) {
            if (adm.uid === usr.uid) {
              adminName = name;
              break;
            }
          }
          setCurrentAdminName(adminName);

          if (!adminName && usr.email) {
            const isSub = await checkIsSubAdminInFirestore(usr.email);
            setIsSubAdmin(isSub);
          } else {
            setIsSubAdmin(false);
          }

          const prefs = await fetchUserPreferences(usr.uid);
          if (prefs) {
            if (Array.isArray(prefs.likedTracks)) setLikedTracks(prefs.likedTracks);
            if (Array.isArray(prefs.dislikedTracks)) setDislikedTracks(prefs.dislikedTracks);
          }
        } catch (e) {}
      } else {
        setCurrentAdminName(null);
        setIsSubAdmin(false);
      }
    });

    (async () => {
      try {
        const l = await fetchGlobalLikes();
        setGlobalLikes(l);
      } catch (e) {}
    })();

    loadTracks();
    loadRules();
    loadAlphabet();
    loadDictionary();
    loadGrammar();

    // Check if site was updated in repository and user has local drafts
    const localEditsExist = localStorage.getItem('andrelf_has_local_edits') === 'true';
    const ackVersion = localStorage.getItem('andrelf_acknowledged_version');
    if (localEditsExist && ackVersion !== String(SITE_BUILD_VERSION)) {
      setShowSiteUpdatedModal(true);
    }

    return () => unsubscribe();
  }, [loadTracks, loadRules, loadAlphabet, loadDictionary, loadGrammar]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Procedural Synth Fallback
  const handleAudioError = async () => {
    if (!currentTrack) return;
    const key = currentTrack.id || currentTrack.filename || currentTrack.title;
    setIsSynthesizing(true);
    try {
      const synthUrl = await generateDarkFolkAudio(currentTrack.title, key);
      synthCache.current[key] = synthUrl;
      setResolvedAudioUrl(synthUrl);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(() => {});
        }, 100);
      }
    } catch (e) {
      console.warn('Fallback audio generation error:', e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Resolve Track Audio URL
  useEffect(() => {
    if (!currentTrack) {
      setResolvedAudioUrl(undefined);
      return;
    }
    let isCancelled = false;
    if (audioRef.current) audioRef.current.pause();

    (async () => {
      setIsSynthesizing(true);
      const key = currentTrack.id || currentTrack.filename || currentTrack.title;
      try {
        // 1. In-memory synthesizer / URL cache
        if (synthCache.current[key]) {
          setResolvedAudioUrl(synthCache.current[key]);
          setIsSynthesizing(false);
          preserveTrackMetadata(currentTrack);
          return;
        }

        // 2. Persistent IndexedDB cache (instant playback, zero network request, offline ready)
        try {
          const cachedBlob = await getAudioFromLocalStore(key);
          if (cachedBlob && cachedBlob.size > 1000) {
            if (isCancelled) return;
            const blobUrl = URL.createObjectURL(cachedBlob);
            synthCache.current[key] = blobUrl;
            setResolvedAudioUrl(blobUrl);
            setIsSynthesizing(false);
            preserveTrackMetadata(currentTrack);
            return;
          }
        } catch (e) {}

        // 3. Custom audio file from Firestore
        if (currentTrack.hasFile) {
          try {
            const trackId = currentTrack.id || currentTrack.filename;
            const blob = await fetchTrackAudioBlobFromFirestore(trackId, currentTrack.fileType);
            if (isCancelled) return;
            await saveAudioToLocalStore(key, blob);
            const blobUrl = URL.createObjectURL(blob);
            synthCache.current[key] = blobUrl;
            setResolvedAudioUrl(blobUrl);
            setIsSynthesizing(false);
            preserveTrackMetadata(currentTrack);
            return;
          } catch (e) {}
        }

        // 4. Remote HTTP URL or relative music/ path
        const targetUrl = currentTrack.url || (currentTrack.filename ? `music/${currentTrack.filename}` : '');
        if (targetUrl && !targetUrl.startsWith('db://')) {
          try {
            const resp = await fetch(targetUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              if (blob.size > 1000) {
                if (isCancelled) return;
                await saveAudioToLocalStore(key, blob);
                const blobUrl = URL.createObjectURL(blob);
                synthCache.current[key] = blobUrl;
                setResolvedAudioUrl(blobUrl);
                setIsSynthesizing(false);
                preserveTrackMetadata(currentTrack);
                return;
              }
            }
          } catch (e) {
            console.warn('[Audio] Could not fetch audio from URL, falling back to synth:', e);
          }
        }

        // 5. Atmospheric Dark Folk procedural synthesizer
        const synthUrl = await generateDarkFolkAudio(currentTrack.title, key);
        if (isCancelled) return;
        synthCache.current[key] = synthUrl;
        setResolvedAudioUrl(synthUrl);
        preserveTrackMetadata(currentTrack);
      } catch (err) {
        if (!isCancelled) {
          setResolvedAudioUrl(undefined);
          setIsPlaying(false);
        }
      } finally {
        if (!isCancelled) setIsSynthesizing(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (currentTrack) {
      setEditTrackData({
        title: currentTrack.title || '',
        artist: currentTrack.author || '',
        description: currentTrack.description || '',
        lyrics: currentTrack.lyrics || '',
        filename: currentTrack.filename || '',
        url: currentTrack.url || ''
      });
    }
  }, [currentTrackIndex, tracks]);

  // Load user preferences from localStorage
  useEffect(() => {
    const l = JSON.parse(localStorage.getItem('psychoAndriyLiked') || '[]');
    const d = JSON.parse(localStorage.getItem('psychoAndriyDisliked') || '[]');
    setLikedTracks(l);
    setDislikedTracks(d);

    const saved = localStorage.getItem('psychoAndriySavedTrack');
    if (saved) {
      const idx = tracks.findIndex(t => (t.filename || t.id) === saved);
      if (idx !== -1) setCurrentTrackIndex(idx);
    }
  }, [tracks]);

  // Eye Tracking Logic (throttled to avoid layout thrashing)
  useEffect(() => {
    let frameId: number;
    let pendingX = 0;
    let pendingY = 0;
    let hasMove = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (activeTab === 'pvp') return;
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!hasMove) {
        hasMove = true;
        frameId = requestAnimationFrame(() => {
          hasMove = false;
          if (eyeRef.current && pupilRef.current) {
            const rect = eyeRef.current.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            const angle = Math.atan2(pendingY - eyeY, pendingX - eyeX);
            const dist = Math.min(22, Math.hypot(pendingX - eyeX, pendingY - eyeY) * 0.18);
            pupilRef.current.style.transform = `translate(${dist * Math.cos(angle)}px, ${dist * Math.sin(angle)}px)`;
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [activeTab]);

  // Audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current && resolvedAudioUrl) {
      audioRef.current.play().catch(() => {});
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [resolvedAudioUrl, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      if (audioRef.current.currentTime > 10 && tracks[currentTrackIndex]) {
        const key = tracks[currentTrackIndex].filename || tracks[currentTrackIndex].id;
        localStorage.setItem('psychoAndriySavedTrack', key || '');
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnd = () => {
    if (showCapCutStudio) {
      // In CapCut Studio: NEVER switch track! Loop current track so work is never lost!
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      nextTrack(1);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getFilteredIndices = () => {
    const list: number[] = [];
    for (let i = 0; i < tracks.length; i++) {
      const key = tracks[i].filename || tracks[i].id || '';
      if (showFavoritesOnly) {
        if (likedTracks.includes(key)) list.push(i);
      } else {
        if (!dislikedTracks.includes(key)) list.push(i);
      }
    }
    return list;
  };

  const nextTrack = (delta = 1) => {
    if (showCapCutStudio) {
      // Lock track while in CapCut Studio so subtitle work is never interrupted
      return;
    }
    if (isRepeat && delta === 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    const filtered = getFilteredIndices();
    if (filtered.length === 0) return;
    if (isShuffle) {
      const rand = Math.floor(Math.random() * filtered.length);
      setCurrentTrackIndex(filtered[rand]);
      setIsPlaying(true);
      return;
    }
    let nextPos = filtered.indexOf(currentTrackIndex) + delta;
    if (nextPos >= filtered.length) nextPos = 0;
    if (nextPos < 0) nextPos = filtered.length - 1;
    setCurrentTrackIndex(filtered[nextPos]);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Global Hotkeys: Space to toggle play/pause, Left/Right arrows to seek -5s / +5s
  // Excluded when typing in input, textarea, or contentEditable elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox'
        )
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const cur = audioRef.current ? audioRef.current.currentTime : progress;
        const newTime = Math.max(0, cur - 5);
        setProgress(newTime);
        if (audioRef.current) audioRef.current.currentTime = newTime;
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const cur = audioRef.current ? audioRef.current.currentTime : progress;
        const maxDur = duration || 180;
        const newTime = Math.min(maxDur, cur + 5);
        setProgress(newTime);
        if (audioRef.current) audioRef.current.currentTime = newTime;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress, duration]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleLike = async () => {
    if (!currentTrack) return;
    const key = currentTrack.filename || currentTrack.id || '';
    let newLiked = [...likedTracks];
    let newDisliked = [...dislikedTracks];
    const isNowLiked = likedTracks.includes(key);

    if (isNowLiked) {
      newLiked = newLiked.filter(k => k !== key);
    } else {
      newLiked.push(key);
      newDisliked = newDisliked.filter(k => k !== key);
    }

    setLikedTracks(newLiked);
    setDislikedTracks(newDisliked);
    localStorage.setItem('psychoAndriyLiked', JSON.stringify(newLiked));
    localStorage.setItem('psychoAndriyDisliked', JSON.stringify(newDisliked));

    setGlobalLikes(prev => {
      const cnt = prev[key] || 0;
      return { ...prev, [key]: isNowLiked ? Math.max(0, cnt - 1) : cnt + 1 };
    });

    if (currentUser) {
      try {
        await saveUserPreferences(currentUser.uid, {
          likedTracks: newLiked,
          dislikedTracks: newDisliked
        });
        await toggleGlobalLikeInFirestore(key, currentUser.uid);
      } catch (e) {}
    }
  };

  const toggleDislike = async () => {
    if (!currentTrack) return;
    const key = currentTrack.filename || currentTrack.id || '';
    let newLiked = [...likedTracks];
    let newDisliked = [...dislikedTracks];
    const isNowLiked = likedTracks.includes(key);

    if (dislikedTracks.includes(key)) {
      newDisliked = newDisliked.filter(k => k !== key);
    } else {
      newDisliked.push(key);
      newLiked = newLiked.filter(k => k !== key);
    }

    setLikedTracks(newLiked);
    setDislikedTracks(newDisliked);
    localStorage.setItem('psychoAndriyLiked', JSON.stringify(newLiked));
    localStorage.setItem('psychoAndriyDisliked', JSON.stringify(newDisliked));

    if (isNowLiked) {
      setGlobalLikes(prev => ({
        ...prev,
        [key]: Math.max(0, (prev[key] || 1) - 1)
      }));
    }

    if (currentUser) {
      try {
        await saveUserPreferences(currentUser.uid, {
          likedTracks: newLiked,
          dislikedTracks: newDisliked
        });
        if (isNowLiked) {
          await toggleGlobalLikeInFirestore(key, currentUser.uid);
        }
      } catch (e) {}
    }
  };

  const toggleRunicMode = () => {
    const next = !runicMode;
    setRunicMode(next);
    localStorage.setItem('psychoAndriy_runicMode', String(next));
    showToast(next ? 'ᚱ Рунічний режим увімкнено по всьому сайту!' : 'Український класичний режим увімкнено.', 'info');
  };

  // Google Login
  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
      showToast('Успішний вхід у культ через Google!', 'success', 'Ласкаво просимо');
    } catch (err: any) {
      setAuthError('Не вдалося увійти через Google. Ви можете використовувати гостьовий режим.');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentAdminName(null);
      setIsSubAdmin(false);
      showToast('Ви вийшли з облікового запису.', 'info');
    } catch (err) {}
  };

  const handleTeaClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'SPAN' && (target.innerText.includes('чай') || target.innerText.includes('Чай'))) {
      playSfx('tea');
      const bubble = document.createElement('div');
      bubble.className =
        'fixed bg-black/95 text-neon-cyan border-2 border-neon-cyan px-3 py-1.5 rounded-xl text-xs pointer-events-none z-50 animate-bounce shadow-[0_0_15px_rgba(102,252,241,0.6)] font-mono';
      bubble.innerText = '☕ Священна пара чаю піднялася! Дух Психо-Андрія благословляє вас.';
      bubble.style.left = `${Math.min(window.innerWidth - 260, Math.max(10, e.clientX - 100))}px`;
      bubble.style.top = `${Math.max(10, e.clientY - 45)}px`;
      document.body.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1800);
    }
  };

  // Add Track
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        setAddError('Файл занадто великий. Максимальний розмір для завантаження: 8MB');
        setNewTrackFile(null);
        return;
      }
      setNewTrackFile(file);
      setAddError('');
      if (!newTrack.title) {
        const titleWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setNewTrack(prev => ({ ...prev, title: titleWithoutExt }));
      }
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrack.title || !newTrack.author) {
      setAddError("Заповніть обов'язкові поля: Назва пісні та Автор.");
      return;
    }
    setIsSavingTrack(true);
    setAddError('');
    try {
      let fileType: string | undefined;
      if (newTrackFile) {
        fileType = newTrackFile.type || 'audio/mpeg';
      }
      const trackId = `custom-${Date.now()}`;
      const rawFn = (newTrack.filename || '').trim();
      const customFilename = rawFn
        ? (rawFn.toLowerCase().endsWith('.mp3') ? rawFn : `${rawFn}.mp3`)
        : (newTrackFile?.name || `${trackId}.mp3`);

      const customUrl = newTrack.url?.trim()
        ? newTrack.url.trim()
        : (newTrackFile ? URL.createObjectURL(newTrackFile) : `music/${customFilename}`);

      const newCustomTrack: Track = {
        id: trackId,
        filename: customFilename,
        title: newTrack.title,
        author: newTrack.author,
        coAuthor: newTrack.coAuthor,
        description: newTrack.description,
        url: customUrl,
        lyrics: newTrack.lyrics,
        isCustom: true,
        hasFile: !!newTrackFile,
        fileType
      };

      // Save to localStorage
      let localCustom: Track[] = [];
      try {
        localCustom = JSON.parse(localStorage.getItem('psychoAndriy_custom_tracks') || '[]');
      } catch (e) {}
      localCustom.push(newCustomTrack);
      localStorage.setItem('psychoAndriy_custom_tracks', JSON.stringify(localCustom));

      // Preserve metadata and audio locally
      await preserveTrackMetadata(newCustomTrack);
      if (newTrackFile) {
        await saveAudioToLocalStore(trackId, newTrackFile);
      }

      localStorage.setItem('andrelf_has_local_edits', 'true');
      localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
      setHasLocalEdits(true);

      setTracks(prev => [...prev, newCustomTrack]);
      setNewTrack({
        title: '',
        author: 'Психо-Андрій',
        coAuthor: '',
        description: '',
        url: '',
        lyrics: '',
        filename: ''
      });
      setNewTrackFile(null);
      setShowAddForm(false);
      showToast('Новий священний сувій успішно збережено!', 'success');

      try {
        await saveTrackToFirestore(
          {
            title: newTrack.title,
            author: newTrack.author,
            coAuthor: newTrack.coAuthor,
            description: newTrack.description,
            url: customUrl,
            filename: customFilename,
            lyrics: newTrack.lyrics,
            hasFile: !!newTrackFile,
            fileType
          },
          newTrackFile || undefined
        );
      } catch (err: any) {
        console.warn('Firestore sync failed, local copy saved:', err);
      }
    } catch (err: any) {
      setAddError(`Помилка створення сувою: ${err.message || err.toString()}`);
    } finally {
      setIsSavingTrack(false);
    }
  };

  const handleDeleteTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({
      title: 'Видалення священного сувою',
      message: 'Ви дійсно бажаєте вилучити цей сувій з бібліотеки культу?',
      onConfirm: async () => {
        try {
          // 1. Remove from local custom tracks
          let localCustom: Track[] = [];
          try {
            localCustom = JSON.parse(localStorage.getItem('psychoAndriy_custom_tracks') || '[]');
          } catch (e) {}
          localCustom = localCustom.filter(t => (t.id || t.filename) !== trackId);
          localStorage.setItem('psychoAndriy_custom_tracks', JSON.stringify(localCustom));

          // 2. Add to deleted tracks list so defaultTracks don't bring it back
          let deletedArr: string[] = [];
          try {
            deletedArr = JSON.parse(localStorage.getItem('psychoAndriy_deleted_tracks') || '[]');
          } catch (e) {}
          if (!deletedArr.includes(trackId)) {
            deletedArr.push(trackId);
          }
          localStorage.setItem('psychoAndriy_deleted_tracks', JSON.stringify(deletedArr));

          // 3. Remove from preserved local store
          await removePreservedTrack(trackId);

          localStorage.setItem('andrelf_has_local_edits', 'true');
          localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
          setHasLocalEdits(true);

          setTracks(prev => prev.filter(t => (t.id || t.filename) !== trackId));
          showToast('Сувій вилучено з бібліотеки.', 'info');
          try {
            await deleteTrackFromFirestore(trackId);
          } catch (err) {}
        } catch (err) {}
      }
    });
  };

  const handleSaveTrackDetails = async () => {
    if (!currentTrack) return;
    setIsSavingEdit(true);
    try {
      const trackId = currentTrack.id || currentTrack.filename;
      const rawFilename = (editTrackData.filename || '').trim();
      const cleanFilename = rawFilename
        ? (rawFilename.toLowerCase().endsWith('.mp3') ? rawFilename : `${rawFilename}.mp3`)
        : (currentTrack.filename || 'track.mp3');
      const updatedUrl = editTrackData.url?.trim()
        ? editTrackData.url.trim()
        : (!currentTrack.url || currentTrack.url.startsWith('music/'))
          ? `music/${cleanFilename}`
          : currentTrack.url;

      if (editAudioFile) {
        try {
          await updateTrackAudioAndMetadata(trackId, editAudioFile, !!currentTrack.isCustom);
        } catch (e) {}
        const newUrl = URL.createObjectURL(editAudioFile);
        synthCache.current[trackId] = newUrl;
        setResolvedAudioUrl(newUrl);
        await saveAudioToLocalStore(trackId, editAudioFile);
        setEditAudioFile(null);
      }

      // Save to localStorage overrides
      let overrides: Record<string, any> = {};
      try {
        overrides = JSON.parse(localStorage.getItem('psychoAndriy_track_overrides') || '{}');
      } catch (e) {}
      overrides[trackId] = {
        title: editTrackData.title,
        artist: editTrackData.artist,
        description: editTrackData.description,
        lyrics: editTrackData.lyrics,
        filename: cleanFilename,
        url: updatedUrl,
        hasFile: editAudioFile ? true : currentTrack.hasFile,
        fileType: editAudioFile ? editAudioFile.type || 'audio/mpeg' : currentTrack.fileType
      };
      localStorage.setItem('psychoAndriy_track_overrides', JSON.stringify(overrides));
      localStorage.setItem('andrelf_has_local_edits', 'true');
      localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
      setHasLocalEdits(true);

      const updatedTrack: Track = {
        ...currentTrack,
        title: editTrackData.title,
        author: editTrackData.artist,
        description: editTrackData.description,
        lyrics: editTrackData.lyrics,
        filename: cleanFilename,
        url: updatedUrl
      };

      // Preserve updated track in local store
      await preserveTrackMetadata(updatedTrack);

      const nextTracks = tracks.map((t) => {
        if ((t.id || t.filename) === trackId) {
          return updatedTrack;
        }
        return t;
      });
      setTracks(nextTracks);
      setIsEditModalOpen(false);
      showToast('Деталі сувою успішно оновлено!', 'success');

      try {
        if (currentTrack.isCustom) {
          await updateTrackInFirestore(currentTrack.id!, {
            title: editTrackData.title,
            author: editTrackData.artist,
            description: editTrackData.description,
            lyrics: editTrackData.lyrics,
            filename: cleanFilename,
            url: updatedUrl,
            hasFile: editAudioFile ? true : currentTrack.hasFile,
            fileType: editAudioFile ? editAudioFile.type || 'audio/mpeg' : currentTrack.fileType
          });
        } else {
          await saveTrackOverride(trackId, {
            title: editTrackData.title,
            artist: editTrackData.artist,
            description: editTrackData.description,
            lyrics: editTrackData.lyrics,
            filename: cleanFilename,
            url: updatedUrl,
            hasFile: editAudioFile ? true : currentTrack.hasFile,
            fileType: editAudioFile ? editAudioFile.type || 'audio/mpeg' : currentTrack.fileType
          });
        }
      } catch (e) {}
    } catch (err) {
      showToast('Не вдалося оновити сувій', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSaveSubtitles = async (cues: SubtitleCue[]) => {
    if (!currentTrack) return;
    const trackId = currentTrack.id || currentTrack.filename;
    try {
      await saveTrackSubtitlesToFirestore(trackId, cues);
      // Update state
      const next = [...tracks];
      const idx = next.findIndex(t => (t.id || t.filename) === trackId);
      if (idx !== -1) {
        next[idx].subtitles = cues;
        setTracks(next);
      }
      setShowCapCutStudio(false);
      showToast('Субтитри сувою успішно збережені в базі!', 'success', 'Капкат синхронізовано');
    } catch (err) {
      showToast('Помилка при збереженні субтитрів', 'error');
    }
  };

  // Rules Edit Handlers
  const startEditRules = () => {
    setEditRulesList([...rules]);
    setIsEditingRules(true);
  };

  const addRule = () => {
    setEditRulesList(prev => [...prev, 'Нове священне правило культу...']);
  };

  const deleteRule = (idx: number) => {
    setEditRulesList(prev => prev.filter((_, i) => i !== idx));
  };

  const moveRule = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editRulesList.length) return;
    const updated = [...editRulesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setEditRulesList(updated);
  };

  const resetRulesToDefault = () => {
    setConfirmDialog({
      title: 'Скинути священні правила',
      message: 'Відновити початкові священні правила культу за замовчуванням?',
      onConfirm: async () => {
        setEditRulesList([...defaultRules]);
        setRules([...defaultRules]);
        try {
          localStorage.removeItem('psychoAndriy_rules');
          await saveRulesToFirestore(defaultRules);
        } catch (e) {}
        showToast('Правила відновлено до початкового канону!', 'info');
      }
    });
  };

  const handleSaveRules = async () => {
    try {
      localStorage.setItem('psychoAndriy_rules', JSON.stringify(editRulesList));
      localStorage.setItem('andrelf_has_local_edits', 'true');
      localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
      setHasLocalEdits(true);
      setRules(editRulesList);
      setIsEditingRules(false);
      showToast('Священний статут культу успішно збережено локально!', 'success');
      try {
        await saveRulesToFirestore(editRulesList);
      } catch (err) {
        console.warn('Firestore sync failed, local copy active:', err);
      }
    } catch (err) {
      showToast('Помилка при збереженні правил', 'error');
    }
  };

  // Alphabet Edit Handlers
  const startEditAlphabet = () => {
    setEditingAlphabetList([...alphabet]);
    setIsEditingAlphabet(true);
  };

  const addAlphabetItem = () => {
    setEditingAlphabetList(prev => [
      ...prev,
      { symbol: 'ᚱ', sound: '[НОВИЙ ЗВУК]', description: 'Опис нової священної руни' }
    ]);
  };

  const resetAlphabetToDefault = () => {
    setConfirmDialog({
      title: 'Скинути абетку',
      message: 'Відновити канонічні 48 рунічних символів за замовчуванням?',
      onConfirm: async () => {
        setEditingAlphabetList([...defaultAlphabet]);
        setAlphabet([...defaultAlphabet]);
        try {
          localStorage.removeItem('psychoAndriy_alphabet');
          await saveAlphabetToFirestore(defaultAlphabet);
        } catch (e) {}
        showToast('Абетку повернено до первинного канону (48 символів)!', 'info');
      }
    });
  };

  const handleSaveAlphabet = async () => {
    setAlphabet(editingAlphabetList);
    try {
      localStorage.setItem('psychoAndriy_alphabet', JSON.stringify(editingAlphabetList));
      localStorage.setItem('andrelf_has_local_edits', 'true');
      localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
      setHasLocalEdits(true);
    } catch (e) {}
    setIsEditingAlphabet(false);
    showToast('Священну Абетку успішно оновлено та збережено!', 'success');

    // Sync to Firestore in background
    try {
      await saveAlphabetToFirestore(editingAlphabetList);
    } catch (err) {
      console.warn('Firestore sync failed, local copy active:', err);
    }
  };

  // Grammar Edit Handlers
  const startEditGrammar = () => {
    setEditingGrammarList([...grammar]);
    setIsEditingGrammar(true);
  };

  const addGrammarItem = () => {
    setEditingGrammarList(prev => [
      ...prev,
      {
        title: `${prev.length + 1}. НОВЕ СВЯЩЕННЕ ПРАВИЛО ГРАМАТИКИ`,
        description: 'Введіть детальний опис нового правила граматики або фонетики Дібрівської мови...'
      }
    ]);
  };

  const deleteGrammarItem = (idx: number) => {
    setEditingGrammarList(prev => prev.filter((_, i) => i !== idx));
  };

  const moveGrammarItem = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editingGrammarList.length) return;
    const next = [...editingGrammarList];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setEditingGrammarList(next);
  };

  const resetGrammarToDefault = () => {
    setConfirmDialog({
      title: 'Скинути граматику',
      message: 'Відновити канонічні 9 священних правил граматики за замовчуванням?',
      onConfirm: async () => {
        setEditingGrammarList([...defaultGrammar]);
        setGrammar([...defaultGrammar]);
        try {
          localStorage.removeItem('psychoAndriy_grammar');
          await saveGrammarToFirestore(defaultGrammar);
        } catch (e) {}
        showToast('Граматику повернено до первинного канону (9 правил)!', 'info');
      }
    });
  };

  const handleSaveGrammar = async () => {
    setGrammar(editingGrammarList);
    try {
      localStorage.setItem('psychoAndriy_grammar', JSON.stringify(editingGrammarList));
      localStorage.setItem('andrelf_has_local_edits', 'true');
      localStorage.setItem('andrelf_last_edit_time', String(Date.now()));
      setHasLocalEdits(true);
    } catch (e) {}
    setIsEditingGrammar(false);
    showToast('Священну Граматику успішно оновлено та збережено!', 'success');

    // Sync to Firestore in background
    try {
      await saveGrammarToFirestore(editingGrammarList);
    } catch (err) {
      console.warn('Firestore sync failed, local copy active:', err);
    }
  };

  // Translator Logic using the new phonetic translator
  const translate = (text: string, dir: 'ukrToDib' | 'dibToUkr') => {
    if (!text) return '';
    return dir === 'ukrToDib'
      ? ukrainianToDybriv(text, { sacredO: sacredOEnabled, smartStress: smartStressEnabled })
      : dybrivToUkrainian(text);
  };

  // Dictionary Add
  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput || !runicInput) {
      showToast('Введіть слово та його рунічний запис.', 'error');
      return;
    }
    setIsSavingWord(true);
    try {
      const newWord: DictionaryItem = {
        id: `word-${Date.now()}`,
        word: wordInput,
        runic: runicInput,
        meaning: meaningInput,
        createdAt: Date.now(),
        author: currentUser?.email?.split('@')[0] || (isLocalAdmin ? 'Верховний Адмін' : 'Адепт')
      };
      let localDict: DictionaryItem[] = [];
      try {
        localDict = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
      } catch (e) {}
      localDict.push(newWord);
      localStorage.setItem('psychoAndriy_dictionary', JSON.stringify(localDict));
      localStorage.setItem('andrelf_has_local_edits', 'true');
      setHasLocalEdits(true);

      setDictionary(prev => [...prev, newWord]);
      setWordInput('');
      setRunicInput('');
      setMeaningInput('');
      showToast('Слово збережено в Дібрівський словник!', 'success');
      try {
        await saveWordToDictionary({
          word: newWord.word,
          runic: newWord.runic,
          meaning: newWord.meaning,
          author: newWord.author
        });
      } catch (e) {}
    } catch (err) {
      showToast('Помилка при збереженні слова', 'error');
    } finally {
      setIsSavingWord(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    setConfirmDialog({
      title: 'Видалення слова зі словника',
      message: 'Ви впевнені, що бажаєте вилучити це слово?',
      onConfirm: async () => {
        try {
          let localDict: DictionaryItem[] = [];
          try {
            localDict = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
          } catch (e) {}
          localDict = localDict.filter(w => w.id !== id);
          localStorage.setItem('psychoAndriy_dictionary', JSON.stringify(localDict));
          setDictionary(prev => prev.filter(w => w.id !== id));
          showToast('Слово вилучено.', 'info');
          try {
            await deleteWordFromDictionary(id);
          } catch (err) {}
        } catch (err) {}
      }
    });
  };

  // 5-Clicks Admin Trigger & GitHub Exporter Handlers
  const handleAdmin5Clicks = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const now = Date.now();
    if (now - lastAdminClickTime.current > 2500) {
      adminClickCount.current = 1;
    } else {
      adminClickCount.current += 1;
    }
    lastAdminClickTime.current = now;

    if (adminClickCount.current >= 5) {
      adminClickCount.current = 0;
      setIsLocalAdmin(true);
      localStorage.setItem('andrelf_is_admin', 'true');
      setShowAuthModal(false);
      playSfx('tea');
      showToast(
        '🗝️ Верховний Адмін активовано (5 кліків)! Усі зміни доступні локально.',
        'success',
        'Автономний Адмін'
      );
      if (hasLocalEdits || isLocalAdmin) {
        handleExportGitHubZip();
      }
    } else {
      showToast(`Натисніть ще ${5 - adminClickCount.current} раз(и) для таємного входу/експорту Адміна`, 'info');
    }
  };

  const handleExportGitHubZip = async () => {
    setIsExporting(true);
    showToast('Створюємо ZIP-архів з файлами для GitHub...', 'info');
    try {
      await downloadGitHubUpdateZip(rules, tracks, alphabet, grammar);
      showToast('Архів завантажено! Перетягніть файли в репозиторій на GitHub.', 'success', '📦 Експорт готовий');
    } catch (e: any) {
      showToast('Помилка при створенні архіву: ' + e.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDataTs = () => {
    try {
      downloadDataTsOnly(rules, tracks, alphabet, grammar);
      showToast('Файл data.ts завантажено! Замініть ним src/data.ts на GitHub.', 'success');
    } catch (e: any) {
      showToast('Помилка експорту data.ts', 'error');
    }
  };

  const handleAcceptNewSiteVersion = () => {
    localStorage.removeItem('psychoAndriy_rules');
    localStorage.removeItem('psychoAndriy_track_overrides');
    localStorage.removeItem('psychoAndriy_custom_tracks');
    localStorage.removeItem('psychoAndriy_alphabet');
    localStorage.removeItem('psychoAndriy_grammar');
    localStorage.removeItem('psychoAndriy_dictionary');
    localStorage.removeItem('andrelf_has_local_edits');
    localStorage.setItem('andrelf_acknowledged_version', String(SITE_BUILD_VERSION));
    setShowSiteUpdatedModal(false);
    setHasLocalEdits(false);
    showToast('Сайт скинуто до останньої версії з GitHub!', 'success');
    window.location.reload();
  };

  const handleKeepLocalChanges = () => {
    localStorage.setItem('andrelf_acknowledged_version', String(SITE_BUILD_VERSION));
    setShowSiteUpdatedModal(false);
    showToast('Ваші локальні зміни залишено в силі.', 'info');
  };

  // Oracle
  const consultOracle = () => {
    if (!oracleQuestion.trim()) {
      showToast('Задайте питання Оракулу лісу...', 'info');
      return;
    }
    setIsOracleConsulting(true);
    playSfx('tea');
    setTimeout(() => {
      const answers = [
        'Духи Дібрівських лісів шепочуть: Чай вже заварюється, відповідь ствердна!',
        'Психо-Андрій усміхається крізь туман. Твій шлях чистий і правильний.',
        'Руни переплітаються у візерунок удачі. Дій сміливо, адепте!',
        'Шепіт кленів застерігає: спочатку випий три чашки священного чаю.',
        'Око бачить великий тріумф, але тінь Асасіна вимагає пильності.',
        'Так! Якщо ти принесеш данину у вигляді доброго пісенного сувою.',
        'Невизначеність лісів огортає це питання. Запитай ще раз опівночі.',
        'Бий москалів 1 раз на тиждень, і все задумане здійсниться!'
      ];
      const ans = answers[Math.floor(Math.random() * answers.length)];
      setOracleAnswer(ans);
      setIsOracleConsulting(false);
    }, 700);
  };

  // Get active subtitle cue for player
  const activeSubtitles: SubtitleCue[] = currentTrack?.subtitles && currentTrack.subtitles.length > 0
    ? currentTrack.subtitles
    : (currentTrack?.lyrics
      ? currentTrack.lyrics
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0 && !l.startsWith('Куплет') && !l.startsWith('Приспів') && !l.startsWith('Брідж'))
          .map((text, idx, arr) => {
            const safeDur = duration > 10 ? duration : 180;
            const step = safeDur / Math.max(1, arr.length);
            return {
              id: `auto_${idx}`,
              startTime: idx * step,
              endTime: (idx + 1) * step,
              text
            };
          })
      : []);

  const currentSubtitle = activeSubtitles.find(c => progress >= c.startTime && progress <= c.endTime);
  const currentSubProgress = currentSubtitle && currentSubtitle.endTime > currentSubtitle.startTime
    ? Math.max(0, Math.min(1, (progress - currentSubtitle.startTime) / (currentSubtitle.endTime - currentSubtitle.startTime)))
    : 0;

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDictionary = dictionary.filter(d =>
    d.word.toLowerCase().includes(dictSearch.toLowerCase()) ||
    d.meaning.toLowerCase().includes(dictSearch.toLowerCase()) ||
    d.runic.includes(dictSearch)
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#07090e] text-gray-100 font-sans relative overflow-x-hidden select-none">
      <div className="scanlines fixed inset-0 pointer-events-none z-30 opacity-60" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={resolvedAudioUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
        onError={handleAudioError}
      />

      {/* Floating Quick Music Controller in Top-Left Corner ("Поплавок") */}
      {currentTrack && (
        <div
          className="fixed top-3 left-3 z-50 flex items-center bg-black/85 backdrop-blur-md border border-neon-cyan/40 hover:border-neon-cyan/80 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.85),0_0_12px_rgba(102,252,241,0.2)] transition-all duration-200 select-none overflow-hidden max-w-[270px] sm:max-w-xs group"
          title={`Поплавок швидкого керування: ${currentTrack.title}`}
        >
          {/* Progress Bar along the bottom of the float pill */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-teal to-neon-cyan shadow-[0_0_8px_#66fcf1] transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, (progress / (duration || 1)) * 100))}%` }}
          />

          {/* Mini Vinyl / Disc & Track Info (clicking switches to music tab) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('music');
              window.scrollTo({ top: 320, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-white/5 transition-colors cursor-pointer text-left overflow-hidden min-w-0"
            title="Перейти до плеєра сувоїв"
          >
            {/* Spinning Vinyl Disc */}
            <div className="relative w-7 h-7 shrink-0 rounded-full bg-black border border-neon-teal/50 flex items-center justify-center shadow-[0_0_8px_rgba(102,252,241,0.3)]">
              <Disc
                size={18}
                className={`text-neon-cyan transition-transform ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-70'
                }`}
              />
              {/* Glowing center indicator */}
              <div
                className={`absolute w-1.5 h-1.5 rounded-full ${
                  isPlaying ? 'bg-neon-green shadow-[0_0_6px_#10b981]' : 'bg-gray-500'
                }`}
              />
            </div>

            {/* Song Title & Time */}
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[11px] font-bold text-white truncate max-w-[85px] sm:max-w-[120px] font-cinzel">
                {currentTrack.title || 'Сувій'}
              </span>
              <span className="text-[9px] font-mono text-neon-cyan/80">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </button>

          {/* Quick Action Controls (Skip Back, Stop/Play, Skip Forward) */}
          <div className="flex items-center gap-1 pr-2 pl-1 border-l border-neon-teal/20 my-1 shrink-0">
            {/* Previous track */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextTrack(-1);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Попередній трек"
              aria-label="Попередній трек"
            >
              <SkipBack size={13} />
            </button>

            {/* Play / Stop (Pause) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-neon-cyan text-black shadow-[0_0_10px_#66fcf1] hover:scale-105'
                  : 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
              }`}
              title={isPlaying ? 'Зупинити пісню (Пауза)' : 'Відтворити'}
              aria-label={isPlaying ? 'Зупинити пісню' : 'Відтворити пісню'}
            >
              {isPlaying ? <Pause size={12} className="fill-current" /> : <Play size={12} className="fill-current ml-0.5" />}
            </button>

            {/* Skip track forward */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextTrack(1);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-neon-cyan hover:bg-white/10 transition-all cursor-pointer"
              title="Скіпнути пісню (Наступний трек)"
              aria-label="Скіпнути пісню"
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Top Cyber Eye */}
      <div
        ref={eyeRef}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex flex-col items-center"
      >
        <div
          className="relative w-[96px] h-[96px] sm:w-[115px] sm:h-[115px] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105"
          title="Психо-Око (Не тицяйте курсором!)"
          onClick={() => {
            setIsBlinking(true);
            playSfx('click');
            const nextClicks = eyeClicks + 1;
            setEyeClicks(nextClicks);

            if (!pvpUnlocked && nextClicks >= 10) {
              setPvpUnlocked(true);
              setEyeTooltip('⚔️ ТАЄМНЕ ПвП РОЗБЛОКОВАНО! Око викликано на дуель!');
              setActiveTab('pvp');
            } else if (pvpUnlocked) {
              setEyeTooltip('Око роздратоване вашим тиканням! Розпочинаємо ПвП ⚔️');
              setActiveTab('pvp');
            } else {
              const remaining = 10 - nextClicks;
              const phrases = [
                `Гей! Не тицяй у мене пальцем! (${nextClicks}/10)`,
                `Оку неприємно, коли в нього вилуплюються! (${nextClicks}/10)`,
                `Залиш Око в спокої! Ще ${remaining} тикань до ПвП!`,
                `Ти роздратував Око лісу! (${nextClicks}/10)`
              ];
              setEyeTooltip(phrases[nextClicks % phrases.length]);
            }
            setTimeout(() => setIsBlinking(false), 450);
          }}
          onMouseEnter={() => {
            setIsBlinking(true);
            setEyeTooltip(pvpUnlocked ? 'Гей! Не тицяй у мене пальцем, Оку це неприємно! 👁️❌' : `Гей! Не тицяй у мене пальцем! (${eyeClicks}/10)`);
          }}
          onMouseLeave={() => {
            setIsBlinking(false);
            setEyeTooltip('');
          }}
        >
          {/* Dynamic Top & Bottom Mirrored Soundwaves Visualizer directly around the Cyber Eye */}
          <AudioWaveVisualizer
            isPlaying={isPlaying}
            audioRef={audioRef}
            size={115}
            volume={isMuted ? 0 : volume}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 max-w-none max-h-none"
          />

          <div className="absolute inset-1 rounded-full border border-dashed border-neon-cyan/40 animate-spin-reverse pointer-events-none" />
          <svg className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(102,252,241,0.4)]" viewBox="0 0 400 400">
            <defs>
              <radialGradient id="sclera-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0b101d" />
                <stop offset="70%" stopColor="#050811" />
                <stop offset="100%" stopColor="#0b0c10" />
              </radialGradient>
              <radialGradient id="iris-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#66fcf1" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#45a29e" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#1f2833" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0b0c10" stopOpacity="0.9" />
              </radialGradient>
              <radialGradient id="pupil-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#66fcf1" />
                <stop offset="80%" stopColor="#0b101d" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <clipPath id="eye-clip">
                <path d="M 40,200 Q 200,80 360,200 Q 200,320 40,200 Z" />
              </clipPath>
            </defs>
            <g>
              <circle cx="200" cy="200" r="190" fill="none" stroke="#66fcf1" strokeOpacity="0.25" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="182" fill="none" stroke="#66fcf1" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-slow" />
            </g>
            <g>
              <path d="M 38,200 Q 200,75 362,200 Q 200,325 38,200 Z" fill="none" stroke="#66fcf1" strokeWidth="3.5" />
              <path d="M 45,200 Q 200,85 355,200 Q 200,315 45,200 Z" fill="url(#sclera-grad)" stroke="#66fcf1" strokeOpacity="0.3" strokeWidth="1.5" />
              <g clipPath="url(#eye-clip)">
                <g ref={pupilRef} className="transition-transform duration-75 ease-out">
                  <circle cx="200" cy="200" r="74" fill="url(#iris-grad)" stroke="#66fcf1" strokeWidth="2" />
                  <circle cx="200" cy="200" r="54" fill="none" stroke="#66fcf1" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin-reverse" />
                  <circle cx="200" cy="200" r="26" fill="url(#pupil-core)" stroke="#66fcf1" strokeWidth="2" />
                </g>
                <g>
                  <path
                    d="M 0,0 L 400,0 L 400,201 L 0,201 Z"
                    fill="#050608"
                    stroke="#66fcf1"
                    strokeWidth="2.5"
                    className="transition-transform duration-150 ease-out"
                    style={{ transform: isBlinking ? 'translateY(0%)' : 'translateY(-100%)' }}
                  />
                  <path
                    d="M 0,200 L 400,200 L 400,400 L 0,400 Z"
                    fill="#050608"
                    stroke="#66fcf1"
                    strokeWidth="2.5"
                    className="transition-transform duration-150 ease-out"
                    style={{ transform: isBlinking ? 'translateY(0%)' : 'translateY(100%)' }}
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
        {eyeTooltip && (
          <div className="mt-1 px-3 py-1 bg-black/95 border-2 border-neon-cyan text-neon-cyan text-[11px] font-mono rounded-xl shadow-[0_0_15px_rgba(102,252,241,0.6)] animate-bounce text-center max-w-[260px] pointer-events-none">
            {eyeTooltip}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12">
        {/* Header Container */}
        <header className="glass-panel rounded-2xl p-6 sm:p-8 mb-8 text-center glow-box-cyan relative overflow-hidden">
          {/* Top Bar with Runic Switch & Auth */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleRunicMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                  runicMode
                    ? 'bg-neon-cyan/25 text-neon-cyan border-neon-cyan shadow-[0_0_12px_#66fcf1]'
                    : 'bg-black/50 text-gray-300 border-neon-teal/30 hover:border-neon-teal/60'
                }`}
                title="Перемкнути рунічний режим інтерфейсу"
              >
                <Sparkles size={13} className={runicMode ? 'text-neon-cyan' : 'text-gray-400'} />
                <span>ᚱ Рунічний режим: {runicMode ? 'УВІМК' : 'ВИМК'}</span>
              </button>

              <button
                onClick={() => setShowRunicExplainer(true)}
                className="text-xs text-neon-teal hover:text-neon-cyan flex items-center gap-1 underline cursor-pointer"
              >
                <HelpCircle size={13} /> Де руни на сайті?
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publicShareUrl);
                  showToast('Публічне посилання скопійовано! Надішліть його друзям.', 'success', '🔗 Пряме посилання');
                  setShowShareModal(true);
                }}
                className="text-xs bg-neon-cyan/15 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 px-3 py-1.5 rounded-xl transition-all font-mono cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(102,252,241,0.25)]"
                title="Отримати пряме публічне посилання на сайт для людей без чату"
              >
                <Share2 size={13} />
                <span className="hidden sm:inline">Поділитися сайтом</span>
                <span className="sm:hidden">Поділитися</span>
              </button>

              {isLocalAdmin || currentUser ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs bg-black/60 border border-neon-cyan/40 px-3 py-1.5 rounded-xl text-neon-cyan font-mono shadow-[0_0_10px_rgba(102,252,241,0.2)]">
                    <Sparkles size={12} className="text-yellow-400" />
                    <span>{currentUser ? currentUser.email?.split('@')[0] : 'Верховний Адмін'}</span>
                    <button
                      onClick={() => {
                        if (currentUser) handleSignOut();
                        setIsLocalAdmin(false);
                        localStorage.removeItem('andrelf_is_admin');
                        showToast('Вихід з режиму адміна виконано.', 'info');
                      }}
                      className="text-gray-400 hover:text-red-400 ml-1.5 transition-colors cursor-pointer"
                      title="Вийти з режиму Адміна"
                    >
                      <LogOut size={13} />
                    </button>
                  </div>
                  <button
                    onClick={handleExportGitHubZip}
                    disabled={isExporting}
                    className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-3 py-1.5 rounded-xl transition-all font-mono cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    title="Завантажити готовий ZIP-архів для GitHub"
                  >
                    <FolderArchive size={13} />
                    <span className="hidden sm:inline">{isExporting ? 'Створення ZIP...' : 'Експорт для GitHub (ZIP)'}</span>
                    <span className="sm:hidden">{isExporting ? 'ZIP...' : 'ZIP'}</span>
                  </button>
                  <button
                    onClick={handleExportDataTs}
                    className="text-xs bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-neon-teal/40 px-2.5 py-1.5 rounded-xl transition-all font-mono cursor-pointer flex items-center gap-1"
                    title="Завантажити лише файл src/data.ts"
                  >
                    <Download size={12} />
                    <span>data.ts</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    handleAdmin5Clicks(e);
                    setShowAuthModal(true);
                  }}
                  className="text-xs bg-neon-cyan/10 hover:bg-neon-cyan/25 text-neon-cyan border border-neon-cyan/40 px-3 py-1.5 rounded-xl transition-all font-cinzel cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(102,252,241,0.2)]"
                  title="Вхід для Адептів (5 швидких кліків активують Верховного Адміна)"
                >
                  <Lock size={12} /> Вхід для Адептів
                </button>
              )}
            </div>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-teal tracking-wider mb-2">
            {runicMode ? 'ᚨНᛞᚱЕЛЬФ' : 'ANDRELF'}
          </h1>
          <p className="font-orbitron text-xs sm:text-sm tracking-widest text-neon-green uppercase mb-3">
            {runicMode
              ? 'ΚУЛЬᛏ ΠᛋИҲꙮ-ᚨНᛞᚱІꙖ • ЕЛЬФ ᚨᛋᚨᛋІН З ᛞІᛒᚱІᚹᛋЬΚИҲ LІᛋІᚹ'
              : 'Культ Психо-Андрія • Ельфа Асасіна з Дібрівських лісів'}
          </p>
          <p className="text-gray-300 italic text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-serif">
            «Кожен ковток чаю — це обітниця миру, сили й трохи безумства, бо Психо-Андрій любить таких, як ти.» 🍵
          </p>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-neon-teal/20">
            <button
              onClick={() => { setActiveTab('rules'); playSfx('click'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'rules'
                  ? 'bg-neon-cyan text-black shadow-[0_0_15px_#66fcf1]'
                  : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30 hover:border-neon-cyan'
              }`}
            >
              <Scroll size={15} /> {runicMode ? 'СᚹЯЩЕНІ ΠᚱᚨᚹИLᚨ' : 'Священні Правила'}
            </button>
            <button
              onClick={() => { setActiveTab('music'); playSfx('click'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'music'
                  ? 'bg-neon-cyan text-black shadow-[0_0_15px_#66fcf1]'
                  : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30 hover:border-neon-cyan'
              }`}
            >
              <Music size={15} /> {runicMode ? 'ᛋУᚹΟЇ ᛗЕLΟᛞІᛃ' : `Сувої Мелодій (${tracks.length})`}
            </button>
            <button
              onClick={() => { setActiveTab('runes'); playSfx('click'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'runes'
                  ? 'bg-neon-cyan text-black shadow-[0_0_15px_#66fcf1]'
                  : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30 hover:border-neon-cyan'
              }`}
            >
              <BookOpen size={15} /> {runicMode ? 'ᛞІᛒᚱІᚹᛋЬΚІ ᚱУНИ' : 'Дібрівські Руни'}
            </button>
            <button
              onClick={() => { setActiveTab('oracle'); playSfx('click'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'oracle'
                  ? 'bg-neon-cyan text-black shadow-[0_0_15px_#66fcf1]'
                  : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30 hover:border-neon-cyan'
              }`}
            >
              <Wand2 size={15} /> {runicMode ? 'ΟᚱᚨΚУL LІᛋУ' : 'Оракул Лісу'}
            </button>
            <button
              onClick={() => { setActiveTab('pvp'); playSfx('click'); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'pvp'
                  ? 'bg-red-500 text-white shadow-[0_0_20px_#ff0055]'
                  : 'bg-black/50 text-red-300 hover:text-red-100 border border-red-500/40 hover:border-red-400'
              }`}
            >
              <Swords size={15} /> {runicMode ? 'ΠᚹΠ ᚨᚱЕНᚨ' : 'ПвП Арена'} {pvpUnlocked && '★'}
            </button>
          </nav>
        </header>

        {/* TAB 1: RULES */}
        {activeTab === 'rules' && (
          <section className="glass-panel rounded-2xl p-6 sm:p-8 glow-box-cyan-hover animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neon-teal/20 pb-4">
              <div>
                <h2 className="font-cinzel text-xl sm:text-2xl text-neon-cyan font-bold flex items-center gap-2.5">
                  <TreePine className="text-neon-green" size={22} />
                  {runicMode ? 'СᚹЯЩЕНІ ΠᚱᚨᚹИLᚨ ΚУLЬᛏУ' : 'Священні Правила Культу Психо-Андрія'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Наводьте на слово «чай», щоб відчути священну пару. Клікайте на нього для благословення!
                </p>
              </div>
              <button
                onClick={isEditingRules ? () => setIsEditingRules(false) : startEditRules}
                className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PenLine size={13} /> {isEditingRules ? 'Скасувати' : 'Редагувати Правила'}
              </button>
            </div>

            {isEditingRules ? (
              <div className="mt-6 space-y-4">
                {editRulesList.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 bg-black/50 p-3 rounded-xl border border-neon-teal/30">
                    <span className="font-mono text-neon-cyan text-sm pt-2">{i + 1}.</span>
                    <textarea
                      value={r}
                      onChange={(e) => {
                        const next = [...editRulesList];
                        next[i] = e.target.value;
                        setEditRulesList(next);
                      }}
                      rows={2}
                      className="flex-grow bg-black/60 border border-neon-teal/30 rounded-lg p-2 text-sm text-gray-100 font-sans focus:border-neon-cyan focus:outline-none"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveRule(i, 'up')}
                        disabled={i === 0}
                        className="p-1 hover:text-neon-cyan disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveRule(i, 'down')}
                        disabled={i === editRulesList.length - 1}
                        className="p-1 hover:text-neon-cyan disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => deleteRule(i)}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={addRule}
                    className="px-4 py-2 bg-black/70 border border-neon-teal hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-cinzel cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Додати правило
                  </button>
                  <button
                    onClick={handleSaveRules}
                    className="px-5 py-2 bg-neon-cyan text-black font-cinzel font-bold rounded-xl text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_#66fcf1]"
                  >
                    <Save size={14} /> Зберегти Статут
                  </button>
                  <button
                    onClick={resetRulesToDefault}
                    className="px-4 py-2 bg-black/70 border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-xl text-xs font-cinzel cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} /> Скинути канон
                  </button>
                </div>
              </div>
            ) : (
              <RulesList rules={rules} onTeaClick={handleTeaClick} runicMode={runicMode} />
            )}
          </section>
        )}

        {/* TAB 2: MUSIC PLAYER */}
        {activeTab === 'music' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Main Player Box */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 glow-box-cyan relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Vinyl / Rune Disc */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-neon-teal/40 flex items-center justify-center bg-black/95 shadow-[0_0_30px_rgba(102,252,241,0.25)] shrink-0 overflow-visible">
                  <div
                    className={`absolute inset-2 rounded-full border border-dashed border-neon-cyan/60 ${
                      isPlaying ? 'animate-spin-slow' : ''
                    }`}
                  />
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-neon-teal to-neon-cyan flex items-center justify-center text-black font-cinzel font-black text-xl shadow-[0_0_20px_#66fcf1] z-20">
                    ᚱ
                  </div>
                  {isSynthesizing && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-[10px] font-mono text-neon-cyan p-2 text-center animate-pulse z-30 rounded-full">
                      <Sparkles size={16} className="mb-1" />
                      Заварювання звуку...
                    </div>
                  )}
                </div>

                {/* Track Info & Controls */}
                <div className="flex flex-col flex-grow text-center md:text-left w-full overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-neon-green tracking-wider uppercase">
                      Сувій #{currentTrackIndex + 1} з {tracks.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleLike}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                          likedTracks.includes(currentTrack?.filename || currentTrack?.id || '')
                            ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                            : 'text-gray-400 border-transparent hover:text-white'
                        }`}
                        title="Вподобати"
                        aria-label="Вподобати"
                      >
                        <Heart size={16} className={likedTracks.includes(currentTrack?.filename || currentTrack?.id || '') ? 'fill-red-400' : ''} />
                      </button>
                      <button
                        onClick={toggleDislike}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          dislikedTracks.includes(currentTrack?.filename || currentTrack?.id || '')
                            ? 'bg-gray-800 text-gray-300 border-gray-600'
                            : 'text-gray-400 border-transparent hover:text-white'
                        }`}
                        title="Не подобається"
                      >
                        <HeartOff size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate mb-1">
                    {runicMode ? ukrainianToDybriv(currentTrack?.title || '') : (currentTrack?.title || 'Без назви')}
                  </h3>
                  <p className="text-sm text-neon-cyan font-mono mb-2">
                    Автор: <span className="text-white">{currentTrack?.author}</span>
                    {currentTrack?.coAuthor && <span className="text-gray-400"> • Разом з {currentTrack.coAuthor}</span>}
                  </p>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-3 font-serif italic">
                    {currentTrack?.description || 'Священний сувій із глибин Дібрівського лісу.'}
                  </p>

                  {/* Karaoke Subtitles Live Line Display */}
                  {subtitlesEnabled && (
                    <div className="bg-black/75 border border-neon-cyan/40 rounded-xl p-3 my-2 text-center shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] min-h-[50px] flex items-center justify-center">
                      {currentSubtitle ? (
                        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-sm sm:text-base font-cinzel font-bold max-w-full">
                          {(() => {
                            const words = currentSubtitle.words && currentSubtitle.words.length > 0
                              ? currentSubtitle.words
                              : currentSubtitle.text.trim().split(/\s+/).map((w, _, arr) => ({
                                  word: w,
                                  duration: (currentSubtitle.endTime - currentSubtitle.startTime) / Math.max(1, arr.length)
                                }));

                            let wordStartAcc = currentSubtitle.startTime;
                            return words.map((w, wIdx) => {
                              const wStart = wordStartAcc;
                              const wEnd = wStart + w.duration;
                              wordStartAcc = wEnd;

                              const isPast = progress >= wEnd;
                              const isCurrent = progress >= wStart && progress < wEnd;
                              const wordProgress = isPast ? 1 : isCurrent && w.duration > 0 ? (progress - wStart) / w.duration : 0;

                              return (
                                <span key={wIdx} className="relative inline-block">
                                  <span className="text-gray-500">{w.word}</span>
                                  <span
                                    className="absolute top-0 left-0 text-neon-cyan overflow-hidden whitespace-nowrap drop-shadow-[0_0_8px_#66fcf1]"
                                    style={{ width: `${Math.min(100, Math.max(0, wordProgress * 100))}%` }}
                                  >
                                    {w.word}
                                  </span>
                                </span>
                              );
                            });
                          })()}
                        </div>
                      ) : (
                        <span className="text-xs font-serif italic text-gray-500">
                          {isPlaying ? '... Мелодійний програш ...' : '▶ Натисніть Play для караоке рядка'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress Slider */}
                  <div className="flex items-center gap-3 w-full mb-3">
                    <span className="text-[11px] font-mono text-gray-400 w-10 text-right">{formatTime(progress)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={progress}
                      onChange={handleProgressChange}
                      className="flex-grow"
                    />
                    <span className="text-[11px] font-mono text-gray-400 w-10">{formatTime(duration)}</span>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <button
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isShuffle ? 'text-neon-cyan bg-neon-cyan/20 border border-neon-cyan/50' : 'text-gray-400 hover:text-white'
                      }`}
                      title={isShuffle ? 'Випадковий порядок: Увімк' : 'Випадковий порядок: Вимк'}
                    >
                      <Shuffle size={18} />
                    </button>
                    <button
                      onClick={() => nextTrack(-1)}
                      className="p-2 text-neon-cyan hover:text-white transition-all cursor-pointer"
                      title="Попередній трек"
                    >
                      <SkipBack size={22} />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-neon-cyan hover:bg-white text-black flex items-center justify-center shadow-[0_0_20px_#66fcf1] transition-all cursor-pointer"
                      title={isPlaying ? 'Пауза' : 'Відтворити'}
                    >
                      {isPlaying ? <Pause size={22} className="fill-black" /> : <Play size={22} className="fill-black ml-0.5" />}
                    </button>
                    <button
                      onClick={() => nextTrack(1)}
                      className="p-2 text-neon-cyan hover:text-white transition-all cursor-pointer"
                      title="Наступний трек"
                    >
                      <SkipForward size={22} />
                    </button>
                    <button
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isRepeat ? 'text-neon-cyan bg-neon-cyan/20 border border-neon-cyan/50' : 'text-gray-400 hover:text-white'
                      }`}
                      title={isRepeat ? 'Повтор: Увімк' : 'Повтор: Вимк'}
                    >
                      <Repeat size={18} />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-gray-400 hover:text-neon-cyan cursor-pointer"
                      >
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>

                  {/* Secondary Action Row with CapCut Subtitle Studio Button */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-neon-teal/20 text-xs font-cinzel">
                    {/* Subtitles (Karaoke) SVG Toggle Button */}
                    <button
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        subtitlesEnabled
                          ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(102,252,241,0.25)]'
                          : 'bg-black/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                      title={subtitlesEnabled ? 'Субтитри (караоке): Увімкнено (натисніть, щоб вимкнути)' : 'Субтитри (караоке): Вимкнено (натисніть, щоб увімкнути)'}
                      aria-label="Субтитри"
                    >
                      <Subtitles size={15} className={subtitlesEnabled ? 'text-neon-cyan' : 'text-gray-400'} />
                      <span>Субтитри</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        subtitlesEnabled ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-black/40 text-gray-500 border-gray-700'
                      }`}>
                        {subtitlesEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* CapCut Subtitle Studio: Visible ONLY in Admin Mode */}
                    {(isLocalAdmin || currentUser) && (
                      <button
                        onClick={() => setShowCapCutStudio(true)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-neon-teal/30 to-neon-cyan/30 border border-neon-cyan text-neon-cyan hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(102,252,241,0.3)]"
                        title="Налаштувати субтитри та таймінг літер (CapCut Studio)"
                      >
                        <Sparkle size={13} /> 🎬 Капкат Субтитрів
                      </button>
                    )}
                    {currentTrack?.lyrics && (
                      <button
                        onClick={() => setShowLyricsModal(true)}
                        className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-gray-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Scroll size={13} /> Текст пісні
                      </button>
                    )}
                    {(isLocalAdmin || currentUser) && (
                      <button
                        onClick={() => openEditModalForTrack(currentTrack)}
                        className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-gray-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <PenLine size={13} /> Редагувати
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Track List Header & Filter */}
            <div className="glass-panel rounded-2xl p-6 glow-box-cyan-hover">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="relative flex-grow max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Пошук священних сувоїв..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5 ${
                      showFavoritesOnly
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'bg-black/60 text-gray-300 border border-neon-teal/30 hover:border-neon-cyan'
                    }`}
                  >
                    <Heart size={14} className={showFavoritesOnly ? 'fill-red-400' : ''} />
                    Тільки улюблені
                  </button>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-neon-cyan text-black font-cinzel font-bold rounded-xl text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_#66fcf1]"
                  >
                    <Plus size={15} /> Додати сувій
                  </button>
                </div>
              </div>

              {/* Add Track Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddTrack}
                  className="bg-black/70 border border-neon-cyan/40 rounded-xl p-5 mb-6 space-y-4 animate-[fadeIn_0.2s_ease-out]"
                >
                  <h4 className="font-cinzel text-base text-neon-cyan font-bold flex items-center gap-2">
                    <CirclePlus size={18} /> Створення нового сувою
                  </h4>
                  {addError && <p className="text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-500/40">{addError}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">Назва пісні *</label>
                      <input
                        type="text"
                        required
                        value={newTrack.title}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">Автор *</label>
                      <input
                        type="text"
                        required
                        value={newTrack.author}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-neon-cyan">
                        <FileAudio size={14} /> Назва аудіофайлу (.mp3)
                      </span>
                      <span className="text-[10px] text-neon-teal font-mono">наприклад: andr.mp3</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="andr.mp3"
                        value={newTrack.filename}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, filename: e.target.value }))}
                        className="flex-grow bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setNewTrack(prev => ({ ...prev, filename: 'andr.mp3' }))}
                        className="px-2.5 py-1 text-xs bg-neon-teal/15 hover:bg-neon-teal/30 text-neon-cyan border border-neon-teal/30 rounded-lg cursor-pointer shrink-0 font-mono transition-colors"
                      >
                        Вставити andr.mp3
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      Вкажіть точну назву .mp3 файлу (наприклад, <code className="text-neon-cyan">andr.mp3</code>), якщо файл завантажується в папку <code className="text-neon-cyan">public/music/</code> на GitHub.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Аудіо файл або URL</label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-black/80 border border-dashed border-neon-teal/50 hover:border-neon-cyan text-neon-cyan rounded-lg text-xs cursor-pointer flex items-center gap-2">
                        <UploadCloud size={16} /> {newTrackFile ? newTrackFile.name : 'Обрати файл'}
                        <input type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
                      </label>
                      <input
                        type="url"
                        placeholder="або вставте посилання https://..."
                        value={newTrack.url}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, url: e.target.value }))}
                        className="flex-grow bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-xs text-gray-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">Текст пісні</label>
                    <textarea
                      rows={3}
                      value={newTrack.lyrics}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, lyrics: e.target.value }))}
                      placeholder="Введіть слова сувою..."
                      className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-xs text-gray-100 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-transparent hover:bg-white/10 rounded-xl text-xs text-gray-400 cursor-pointer"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingTrack}
                      className="px-6 py-2 bg-neon-cyan text-black font-cinzel font-bold rounded-xl text-xs hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_#66fcf1]"
                    >
                      {isSavingTrack ? 'Збереження...' : 'Зберегти сувій'}
                    </button>
                  </div>
                </form>
              )}

              {/* Tracks Table */}
              <div className="space-y-2">
                {filteredTracks.map((t, idx) => {
                  const originalIdx = tracks.indexOf(t);
                  const isCurrent = originalIdx === currentTrackIndex;
                  return (
                    <div
                      key={t.id || t.filename || idx}
                      onClick={() => {
                        // Select the track to inspect details and read without auto-playing
                        setCurrentTrackIndex(originalIdx);
                        playSfx('click');
                      }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-neon-cyan/15 border-neon-cyan shadow-[0_0_15px_rgba(102,252,241,0.25)]'
                          : 'bg-black/40 border-neon-teal/20 hover:border-neon-teal/60 hover:bg-black/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                        <span className="font-mono text-xs text-neon-teal w-6 shrink-0 text-center">
                          {isCurrent && isPlaying ? (
                            <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
                          ) : (
                            `${originalIdx + 1}`
                          )}
                        </span>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-sm sm:text-base font-bold truncate ${isCurrent ? 'text-neon-cyan' : 'text-gray-200'}`}>
                              {runicMode ? ukrainianToDybriv(t.title) : t.title}
                            </h4>
                            {t.filename && (
                              <span className="font-mono text-[10px] text-neon-teal/70 bg-black/60 px-1.5 py-0.5 rounded border border-neon-teal/20 shrink-0">
                                {t.filename}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-mono truncate">
                            {t.author} {t.coAuthor && `• ${t.coAuthor}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Admin actions: Edit & Trash (ONLY visible in admin mode) */}
                        {(isLocalAdmin || currentUser) && (
                          <div className="flex items-center gap-1 bg-black/40 border border-neon-teal/20 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModalForTrack(t);
                              }}
                              className="p-1.5 text-gray-400 hover:text-neon-cyan hover:bg-neon-teal/10 rounded transition-colors cursor-pointer"
                              title="Редагувати сувій / назву аудіофайлу"
                            >
                              <PenLine size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTrack(t.id || t.filename, e)}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                              title="Видалити сувій з бібліотеки"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}

                        {/* Play / Pause button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) {
                              setIsPlaying(!isPlaying);
                            } else {
                              setCurrentTrackIndex(originalIdx);
                              setIsPlaying(true);
                            }
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                            isCurrent && isPlaying
                              ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_12px_#66fcf1]'
                              : 'border-neon-teal/40 text-neon-cyan hover:border-neon-cyan hover:bg-neon-teal/20'
                          }`}
                          title={isCurrent && isPlaying ? "Пауза" : "Слухати сувій"}
                        >
                          {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RUNES & DYBRIV TONGUE */}
        {activeTab === 'runes' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 glow-box-cyan space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Sub-Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-neon-teal/20 pb-4 font-cinzel text-xs sm:text-sm">
              <button
                onClick={() => setRunesSubTab('translator')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  runesSubTab === 'translator'
                    ? 'bg-neon-cyan text-black font-bold shadow-[0_0_15px_#66fcf1]'
                    : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30'
                }`}
              >
                <ArrowRightLeft size={14} /> Перекладач
              </button>
              <button
                onClick={() => setRunesSubTab('alphabet')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  runesSubTab === 'alphabet'
                    ? 'bg-neon-cyan text-black font-bold shadow-[0_0_15px_#66fcf1]'
                    : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30'
                }`}
              >
                <BookOpen size={14} /> Абетка ({alphabet.length})
              </button>
              <button
                onClick={() => setRunesSubTab('dictionary')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  runesSubTab === 'dictionary'
                    ? 'bg-neon-cyan text-black font-bold shadow-[0_0_15px_#66fcf1]'
                    : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30'
                }`}
              >
                <BookMarked size={14} /> Словник ({dictionary.length})
              </button>
              <button
                onClick={() => setRunesSubTab('grammar')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  runesSubTab === 'grammar'
                    ? 'bg-neon-cyan text-black font-bold shadow-[0_0_15px_#66fcf1]'
                    : 'bg-black/50 text-gray-300 hover:text-white border border-neon-teal/30'
                }`}
              >
                <Scroll size={14} /> Граматика ({grammar.length})
              </button>
            </div>

            {/* SUBTAB: TRANSLATOR */}
            {runesSubTab === 'translator' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-neon-cyan">
                      Священний Рунічний Перекладач
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Враховує ЛЬ vs L (АндреЛЬФ ➔ ᚨНᛞᚱЕЛЬФ), Ҳ vs Х (Психо ➔ ΠᛋИҲꙮ), Н vs Њ (кінь ➔ ΚІЊ), наголоси Ꙗ/Ѥ, Џ (дж), ∩ (пп), Ӂ, Ƒ, Ö, Ө, ꙮ, Ø та Ғ.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSacredOEnabled(!sacredOEnabled)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        sacredOEnabled ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_8px_rgba(102,252,241,0.2)]' : 'border-gray-700 text-gray-400'
                      }`}
                      title="Автоматично вживати священне ꙮ у словах культу (Психо, Андрельф, чай, бог, ліс)"
                    >
                      Святе ꙮ: {sacredOEnabled ? 'УВІМК' : 'ВИМК'}
                    </button>
                    <button
                      onClick={() => setSmartStressEnabled(!smartStressEnabled)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        smartStressEnabled ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_8px_rgba(158,255,161,0.2)]' : 'border-gray-700 text-gray-400'
                      }`}
                      title="Автоматично розпізнавати наголоси на Я та Ю, замінюючи їх на Ꙗ та Ѥ"
                    >
                      Наголос Ꙗ/Ѥ: {smartStressEnabled ? 'УВІМК' : 'ВИМК'}
                    </button>
                    <button
                      onClick={() => setTranslationDirection(prev => prev === 'ukrToDib' ? 'dibToUkr' : 'ukrToDib')}
                      className="px-3 py-1.5 bg-black/60 border border-neon-cyan text-neon-cyan rounded-xl text-xs font-mono hover:bg-neon-cyan hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowRightLeft size={13} />
                      {translationDirection === 'ukrToDib' ? 'Укр ➔ Руни' : 'Руни ➔ Укр'}
                    </button>
                  </div>
                </div>

                {/* Quick Rune Insert Pills */}
                <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-black/50 border border-neon-teal/20 rounded-xl text-xs font-mono">
                  <span className="text-gray-400 mr-1 text-[11px]">Швидкі руни:</span>
                  {['ꙮ', '∩', 'Џ', 'Ӂ', 'Ƒ', 'Ö', 'Ө', 'Ø', 'Ғ', 'ᛏᛋ', 'Ψ', 'Ҳ', 'L', 'Л', 'Ь', 'Њ', 'Ѥ', 'Ꙗ'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setTranslatorInput(prev => prev + r);
                        playSfx('click');
                      }}
                      className="px-2 py-0.5 bg-black/80 hover:bg-neon-cyan/25 border border-neon-teal/30 hover:border-neon-cyan text-neon-cyan rounded font-bold transition-all cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      {translationDirection === 'ukrToDib' ? 'Введіть текст українською мовою:' : 'Введіть рунічний текст:'}
                    </label>
                    <textarea
                      rows={6}
                      value={translatorInput}
                      onChange={(e) => setTranslatorInput(e.target.value)}
                      placeholder={translationDirection === 'ukrToDib' ? 'Наприклад: Психо-Андрій п’є чай у Дібрівському лісі, б’є москалів і варить ппори...' : 'Вставте руни...'}
                      className="w-full bg-black/70 border border-neon-teal/40 focus:border-neon-cyan rounded-xl p-3.5 text-sm text-gray-100 focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-mono text-neon-green">
                        {translationDirection === 'ukrToDib' ? 'Дібрівський священний переклад:' : 'Український переклад:'}
                      </label>
                      {translatorInput && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translate(translatorInput, translationDirection));
                            setCopiedText(true);
                            setTimeout(() => setCopiedText(false), 2000);
                          }}
                          className="text-[11px] font-mono text-neon-cyan hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText ? <Check size={12} /> : <Copy size={12} />}
                          {copiedText ? 'Скопійовано!' : 'Копіювати'}
                        </button>
                      )}
                    </div>
                    <div className="w-full h-[160px] bg-black/80 border border-neon-cyan/50 rounded-xl p-3.5 text-base sm:text-lg text-neon-cyan font-mono overflow-y-auto leading-relaxed shadow-[inset_0_0_15px_rgba(102,252,241,0.1)]">
                      {translate(translatorInput, translationDirection) || (
                        <span className="text-gray-600 text-xs italic">Тут з’явиться священний напис...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: ALPHABET */}
            {runesSubTab === 'alphabet' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-mono">
                    Таблиця канонічних рунічних символів мови Дібрівського лісу.
                  </p>
                  <button
                    onClick={isEditingAlphabet ? () => setIsEditingAlphabet(false) : startEditAlphabet}
                    className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PenLine size={13} /> {isEditingAlphabet ? 'Скасувати' : 'Редагувати Абетку'}
                  </button>
                </div>

                {isEditingAlphabet ? (
                  <div className="space-y-3 bg-black/60 p-4 rounded-xl border border-neon-teal/30">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-neon-green">Режим редагування абетки:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={addAlphabetItem}
                          className="px-3 py-1.5 bg-black/80 border border-neon-teal/50 hover:border-neon-cyan text-neon-cyan rounded-lg text-xs font-cinzel flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={13} /> Додати руну
                        </button>
                        <button
                          type="button"
                          onClick={resetAlphabetToDefault}
                          className="px-3 py-1.5 bg-black/80 border border-red-500/40 hover:border-red-400 text-red-300 rounded-lg text-xs font-cinzel flex items-center gap-1 cursor-pointer"
                          title="Відновити початкові 48 рун культу"
                        >
                          <RotateCcw size={13} /> Скинути до канону
                        </button>
                        <button
                          onClick={handleSaveAlphabet}
                          className="px-4 py-1.5 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-lg hover:bg-white transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_12px_#66fcf1]"
                        >
                          <Save size={13} /> Зберегти зміни
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {editingAlphabetList.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-black/70 p-2 rounded-lg border border-neon-teal/20 text-xs font-mono">
                          <input
                            type="text"
                            value={item.symbol}
                            onChange={(e) => {
                              const next = [...editingAlphabetList];
                              next[i].symbol = e.target.value;
                              setEditingAlphabetList(next);
                            }}
                            className="w-12 bg-black border border-neon-teal/40 text-neon-cyan text-center rounded p-1"
                          />
                          <input
                            type="text"
                            value={item.sound}
                            onChange={(e) => {
                              const next = [...editingAlphabetList];
                              next[i].sound = e.target.value;
                              setEditingAlphabetList(next);
                            }}
                            className="w-24 bg-black border border-neon-teal/40 text-neon-green rounded p-1"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const next = [...editingAlphabetList];
                              next[i].description = e.target.value;
                              setEditingAlphabetList(next);
                            }}
                            className="flex-grow bg-black border border-neon-teal/40 text-gray-200 rounded p-1"
                          />
                          <button
                            onClick={() => setEditingAlphabetList(editingAlphabetList.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {alphabet.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-black/60 border border-neon-teal/20 hover:border-neon-cyan/60 rounded-xl p-3 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(102,252,241,0.2)]"
                      >
                        <div className="text-3xl text-neon-cyan font-bold font-mono mb-1">{item.symbol}</div>
                        <div className="text-xs text-neon-green font-mono font-bold">{item.sound}</div>
                        <div className="text-[10px] text-gray-400 font-sans mt-1 line-clamp-2" title={item.description}>
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB: DICTIONARY */}
            {runesSubTab === 'dictionary' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="relative flex-grow max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Пошук слів у словнику..."
                      value={dictSearch}
                      onChange={(e) => setDictSearch(e.target.value)}
                      className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Add Word Form */}
                <form
                  onSubmit={handleSaveWord}
                  className="bg-black/50 border border-neon-teal/30 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Слово (укр)..."
                    value={wordInput}
                    onChange={(e) => {
                      setWordInput(e.target.value);
                      if (!runicInput) setRunicInput(ukrainianToDybriv(e.target.value));
                    }}
                    className="bg-black/60 border border-neon-teal/30 rounded-lg p-2 text-xs text-gray-100 focus:outline-none focus:border-neon-cyan"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Рунічний запис..."
                    value={runicInput}
                    onChange={(e) => setRunicInput(e.target.value)}
                    className="bg-black/60 border border-neon-teal/30 rounded-lg p-2 text-xs text-neon-cyan font-mono focus:outline-none focus:border-neon-cyan"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Значення / переклад..."
                      value={meaningInput}
                      onChange={(e) => setMeaningInput(e.target.value)}
                      className="flex-grow bg-black/60 border border-neon-teal/30 rounded-lg p-2 text-xs text-gray-100 focus:outline-none focus:border-neon-cyan"
                    />
                    <button
                      type="submit"
                      disabled={isSavingWord}
                      className="px-4 py-2 bg-neon-cyan text-black font-cinzel font-bold rounded-lg text-xs hover:bg-white transition-all cursor-pointer shrink-0"
                    >
                      {isSavingWord ? '...' : 'Додати'}
                    </button>
                  </div>
                </form>

                {/* Words Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredDictionary.length === 0 ? (
                    <p className="text-gray-500 text-xs font-mono col-span-full text-center py-6">
                      Слів не знайдено. Будьте першим, хто додасть нове слово до словника!
                    </p>
                  ) : (
                    filteredDictionary.map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/40 border border-neon-teal/20 rounded-xl p-3 relative group hover:border-neon-cyan/50 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-white">{item.word}</h4>
                          {item.id && (
                            <button
                              onClick={() => handleDeleteWord(item.id!)}
                              className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <p className="text-base font-mono text-neon-cyan mt-1">{item.runic}</p>
                        <p className="text-xs text-gray-400 mt-1 font-serif italic">{item.meaning}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: GRAMMAR */}
            {runesSubTab === 'grammar' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-mono">
                    Священний звід 9 правил граматики та фонетики Дібрівської мови.
                  </p>
                  <button
                    onClick={isEditingGrammar ? () => setIsEditingGrammar(false) : startEditGrammar}
                    className="px-3 py-1.5 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PenLine size={13} /> {isEditingGrammar ? 'Скасувати' : 'Редагувати Граматику'}
                  </button>
                </div>

                {isEditingGrammar ? (
                  <div className="space-y-3 bg-black/60 p-4 rounded-xl border border-neon-teal/30">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-neon-green">Редагування священної граматики:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={addGrammarItem}
                          className="px-3 py-1.5 bg-black/80 border border-neon-teal/50 hover:border-neon-cyan text-neon-cyan rounded-lg text-xs font-cinzel flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={13} /> Додати правило
                        </button>
                        <button
                          type="button"
                          onClick={resetGrammarToDefault}
                          className="px-3 py-1.5 bg-black/80 border border-red-500/40 hover:border-red-400 text-red-300 rounded-lg text-xs font-cinzel flex items-center gap-1 cursor-pointer"
                          title="Відновити початкові 9 правил культу"
                        >
                          <RotateCcw size={13} /> Скинути до канону
                        </button>
                        <button
                          onClick={handleSaveGrammar}
                          className="px-4 py-1.5 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-lg hover:bg-white transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_12px_#66fcf1]"
                        >
                          <Save size={13} /> Зберегти Граматику
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {editingGrammarList.map((item, i) => (
                        <div key={i} className="bg-black/70 p-3 rounded-lg border border-neon-teal/20 space-y-2 text-xs relative">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-neon-cyan font-bold">#{i + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveGrammarItem(i, 'up')}
                                disabled={i === 0}
                                className="p-1 hover:text-neon-cyan disabled:opacity-30 cursor-pointer"
                                title="Перемістити вгору"
                              >
                                <ArrowUp size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGrammarItem(i, 'down')}
                                disabled={i === editingGrammarList.length - 1}
                                className="p-1 hover:text-neon-cyan disabled:opacity-30 cursor-pointer"
                                title="Перемістити вниз"
                              >
                                <ArrowDown size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteGrammarItem(i)}
                                className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                                title="Видалити правило"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...editingGrammarList];
                              next[i].title = e.target.value;
                              setEditingGrammarList(next);
                            }}
                            className="w-full bg-black border border-neon-teal/40 text-neon-cyan font-bold rounded p-1.5 focus:border-neon-cyan focus:outline-none"
                          />
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={(e) => {
                              const next = [...editingGrammarList];
                              next[i].description = e.target.value;
                              setEditingGrammarList(next);
                            }}
                            className="w-full bg-black border border-neon-teal/40 text-gray-200 rounded p-1.5 focus:border-neon-cyan focus:outline-none font-sans"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grammar.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-black/40 border border-neon-teal/20 hover:border-neon-cyan/40 rounded-xl p-4 transition-all"
                      >
                        <h4 className="font-cinzel text-base text-neon-cyan font-bold mb-2">{item.title}</h4>
                        <p
                          className="text-sm text-gray-300 font-serif leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ORACLE */}
        {activeTab === 'oracle' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 glow-box-cyan text-center max-w-2xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-20 h-20 mx-auto rounded-full bg-black/80 border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_25px_rgba(102,252,241,0.4)]">
              <Eye size={36} className="text-neon-cyan animate-pulse" />
            </div>

            <div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-neon-cyan mb-2">
                {runicMode ? 'ΟᚱᚨΚУL LІᛋУ' : 'Оракул Дібрівського Лісу'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-serif max-w-md mx-auto">
                Задайте будь-яке запитання духам лісу та Психо-Андрію. Оракул заварить священний чай і надасть відповідь.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={oracleQuestion}
                onChange={(e) => setOracleQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && consultOracle()}
                placeholder="Чи прийде сьогодні Андрельф грати у майнкрафт?..."
                className="w-full bg-black/70 border border-neon-teal/40 focus:border-neon-cyan rounded-xl p-3.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none text-center font-sans shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"
              />

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Чи пити мені чай сьогодні? 🍵',
                  'Чи переможемо ми ворогів? ⚔️',
                  'Що кажуть Дібрівські руни? ᚱ',
                  'Чи бити москалів цього тижня? 🛡️'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setOracleQuestion(prompt);
                      playSfx('click');
                    }}
                    className="text-[11px] font-mono bg-black/50 hover:bg-neon-cyan/20 text-gray-400 hover:text-neon-cyan border border-neon-teal/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <button
                onClick={consultOracle}
                disabled={isOracleConsulting}
                className="px-8 py-3 bg-neon-cyan text-black font-cinzel font-black rounded-xl text-sm hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_#66fcf1]"
              >
                {isOracleConsulting ? 'Заварювання священного чаю...' : 'Запитати Оракула 🍵'}
              </button>
            </div>

            {oracleAnswer && (
              <div className="p-5 bg-black/80 border-2 border-neon-green/60 rounded-xl text-neon-green font-serif text-base sm:text-lg leading-relaxed shadow-[0_0_20px_rgba(158,255,161,0.2)] animate-[fadeIn_0.3s_ease-out]">
                «{oracleAnswer}»
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PVP ARENA */}
        {activeTab === 'pvp' && (
          <div className="w-full animate-[fadeIn_0.3s_ease-out]">
            <PvpArena onClose={() => setActiveTab('rules')} />
          </div>
        )}
      </div>

      {/* CapCut Subtitle Studio Fullscreen Modal */}
      {showCapCutStudio && currentTrack && (
        <SubtitleStudio
          track={currentTrack}
          currentTime={progress}
          duration={duration || 180}
          isPlaying={isPlaying}
          onSeek={(time) => {
            setProgress(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }}
          onTogglePlay={togglePlay}
          onSaveSubtitles={handleSaveSubtitles}
          onClose={() => setShowCapCutStudio(false)}
        />
      )}

      {/* Runic Explainer Modal */}
      {showRunicExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-xl w-full rounded-2xl p-6 glow-box-cyan space-y-4 relative">
            <div className="flex justify-between items-center border-b border-neon-teal/30 pb-3">
              <h3 className="font-cinzel text-lg text-neon-cyan font-bold flex items-center gap-2">
                <Sparkles size={18} /> Де на сайті використовуються Дібрівські Руни?
              </h3>
              <button onClick={() => setShowRunicExplainer(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-200 font-serif leading-relaxed space-y-3">
              <p>
                <b>1. На вініловій священній платівці:</b> центральний символ ᚱ та кругові аудіохвилі реагують на ритми музики.
              </p>
              <p>
                <b>2. Рунічний режим сайту:</b> кнопка «ᚱ Рунічний режим» у шапці перекладає назви пісень, правила та елементи інтерфейсу в реальному часі!
              </p>
              <p>
                <b>3. У караоке-субтитрах:</b> рядки підсвічуються літера за літерою синхронно зі звуком сувоїв.
              </p>
              <p>
                <b>4. У Перекладачі та Абетці:</b> повний набір рун (Л vs L, Ҳ vs Х, Џ, ∩, Ӂ, Ƒ, Ö, ꙮ, Ø, Ғ) з можливістю редагування для адептів.
              </p>
              <p>
                <b>5. У ПвП Арені:</b> рунічні снаряди вилітають при стрільбі курсора по Кібер-Оку!
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRunicExplainer(false)}
                className="px-5 py-2 bg-neon-cyan text-black font-cinzel font-bold text-xs rounded-xl hover:bg-white cursor-pointer"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics Modal */}
      {showLyricsModal && currentTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-xl w-full max-h-[85vh] rounded-2xl p-6 glow-box-cyan flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-neon-teal/30 pb-3 mb-4">
              <div>
                <h3 className="font-cinzel text-xl text-neon-cyan font-bold">{currentTrack.title}</h3>
                <p className="text-xs text-gray-400 font-mono">Текст священного сувою</p>
              </div>
              <button
                onClick={() => setShowLyricsModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 text-sm sm:text-base leading-relaxed text-gray-200 font-serif whitespace-pre-line space-y-4">
              {currentTrack.lyrics || 'Текст для цього сувою ще не записаний у літописах.'}
            </div>
          </div>
        </div>
      )}

      {/* Edit Track Modal */}
      {isEditModalOpen && currentTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 glow-box-cyan space-y-4 relative">
            <div className="flex justify-between items-center border-b border-neon-teal/30 pb-3">
              <h3 className="font-cinzel text-lg text-neon-cyan font-bold">Редагування сувою</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Назва сувою</label>
              <input
                type="text"
                value={editTrackData.title}
                onChange={(e) => setEditTrackData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-neon-cyan">
                  <FileAudio size={14} /> Назва аудіофайлу (.mp3)
                </span>
                <span className="text-[10px] text-neon-teal font-mono">наприклад: andr.mp3</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="andr.mp3"
                  value={editTrackData.filename}
                  onChange={(e) => setEditTrackData(prev => ({ ...prev, filename: e.target.value }))}
                  className="flex-grow bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setEditTrackData(prev => ({ ...prev, filename: 'andr.mp3' }))}
                  className="px-2.5 py-1 text-xs bg-neon-teal/15 hover:bg-neon-teal/30 text-neon-cyan border border-neon-teal/30 rounded-lg cursor-pointer shrink-0 font-mono transition-colors"
                  title="Швидко вставити andr.mp3"
                >
                  Вставити andr.mp3
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">
                Вкажіть точну назву .mp3 файлу (наприклад, <code className="text-neon-cyan">andr.mp3</code>), щоб трек зчитувався з папки <code className="text-neon-cyan">public/music/</code> на GitHub.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center justify-between">
                <span>Або пряме посилання на аудіо (URL / Хмара)</span>
                <span className="text-[10px] text-gray-500 font-mono">опціонально</span>
              </label>
              <input
                type="text"
                placeholder="https://... або залиште порожнім для public/music/"
                value={editTrackData.url || ''}
                onChange={(e) => setEditTrackData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-xs text-gray-100 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-mono">
                💡 Якщо музика багато важить і не поміщається на GitHub, ви можете зберігати аудіо в хмарі та вставити пряме посилання сюди.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Автор</label>
              <input
                type="text"
                value={editTrackData.artist}
                onChange={(e) => setEditTrackData(prev => ({ ...prev, artist: e.target.value }))}
                className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Опис</label>
              <textarea
                rows={2}
                value={editTrackData.description}
                onChange={(e) => setEditTrackData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-sm text-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Текст пісні</label>
              <textarea
                rows={4}
                value={editTrackData.lyrics}
                onChange={(e) => setEditTrackData(prev => ({ ...prev, lyrics: e.target.value }))}
                className="w-full bg-black/60 border border-neon-teal/30 focus:border-neon-cyan rounded-lg p-2 text-xs text-gray-100 focus:outline-none"
              />
            </div>

            <div className="bg-black/50 border border-neon-teal/20 rounded-xl p-3 text-[11px] font-mono text-gray-300 flex items-center gap-2">
              <HardDrive size={16} className="text-neon-cyan shrink-0" />
              <span>
                💾 Сувій автоматично зберігається в локальну пам&apos;ять браузера (IndexedDB) при прослуховуванні. Якщо пісня пропаде з GitHub, вона залишиться у вас у бібліотеці!
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-transparent text-gray-400 hover:text-white rounded-xl text-xs cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveTrackDetails}
                className="px-6 py-2 bg-neon-cyan text-black font-cinzel font-bold rounded-xl text-xs hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_#66fcf1]"
              >
                {isSavingEdit ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 glow-box-cyan text-center space-y-4 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan flex items-center justify-center mx-auto shadow-[0_0_15px_#66fcf1]">
              <Share2 size={24} />
            </div>
            <h3 className="font-cinzel text-xl text-white font-bold">Публічне посилання на сайт</h3>
            <p className="text-xs text-gray-300 font-serif leading-relaxed">
              Це пряме автономне посилання на сайт культу <strong>Андрельфа</strong>. Ваші друзі та інші люди можуть відкрити його у будь-якому браузері на комп'ютері чи смартфоні та вільно користуватися всіма функціями <strong>напряму без чату</strong>!
            </p>
            
            <div className="flex items-center gap-2 bg-black/70 border border-neon-cyan/40 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={publicShareUrl}
                className="bg-transparent text-xs font-mono text-neon-cyan flex-grow focus:outline-none px-2 select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publicShareUrl);
                  showToast('Посилання скопійовано у буфер обміну!', 'success');
                }}
                className="px-3 py-1.5 bg-neon-cyan text-black font-mono font-bold text-xs rounded-lg hover:bg-white transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_#66fcf1]"
              >
                <Copy size={13} />
                <span>Копіювати</span>
              </button>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <a
                href={publicShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black/60 border border-neon-teal/40 hover:border-neon-cyan text-neon-cyan rounded-xl text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <span>Відкрити в новій вкладці</span>
                <span>↗</span>
              </a>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-black/60 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl text-xs font-mono cursor-pointer"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 glow-box-cyan text-center space-y-4 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <div
              onClick={handleAdmin5Clicks}
              className="cursor-pointer inline-block"
              title="Натисніть 5 разів для входу або завантаження файлів для GitHub!"
            >
              <Lock size={36} className="text-neon-cyan mx-auto animate-pulse hover:scale-110 transition-transform" />
            </div>
            <h3
              onClick={handleAdmin5Clicks}
              className="font-cinzel text-xl text-white font-bold cursor-pointer select-none"
            >
              Вхід для Адептів та Адміна
            </h3>
            <p className="text-xs text-gray-300 font-serif leading-relaxed">
              На статичному сайті (GitHub Pages) Google-авторизація вимагає додавання домену у Firebase.
              Ви можете скористатися <strong>Автономним Режимом Верховного Адміна</strong> — без реєстрації та паролів!
            </p>

            {authError && <p className="text-red-400 text-xs bg-red-950/40 p-2 rounded-lg border border-red-500/30">{authError}</p>}

            <div className="space-y-2.5 pt-1">
              <button
                onClick={(e) => {
                  handleAdmin5Clicks(e);
                  setIsLocalAdmin(true);
                  localStorage.setItem('andrelf_is_admin', 'true');
                  setShowAuthModal(false);
                  showToast('🗝️ Верховний Адмін активовано! Тепер ви можете редагувати все на сайті.', 'success');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-teal text-black font-cinzel font-bold rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(102,252,241,0.5)]"
              >
                <Sparkles size={14} />
                <span>Увійти як Верховний Адмін (Автономно)</span>
              </button>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-2 bg-white/90 text-black font-medium rounded-xl text-xs hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Спробувати вхід через Google</span>
              </button>

              {hasLocalEdits && (
                <button
                  onClick={handleExportGitHubZip}
                  className="w-full py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 font-mono rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FolderArchive size={14} />
                  <span>Завантажити всі локальні зміни для GitHub (ZIP)</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400 font-mono">
              💡 Підказка: 5 швидких кліків по замку або кнопці також активують адмін-режим та завантажують файли для GitHub!
            </p>
          </div>
        </div>
      )}

      {/* Site Updated On GitHub Modal */}
      {showSiteUpdatedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 glow-box-cyan text-center space-y-4 border border-neon-cyan/50 shadow-[0_0_25px_rgba(102,252,241,0.3)]">
            <div className="w-12 h-12 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center mx-auto text-neon-cyan animate-pulse">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-cinzel text-xl text-neon-cyan font-bold">
              Сайт було оновлено на GitHub!
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-serif">
              Виявлено свіжу версію сайту в репозиторії. При цьому у вашому браузері збережені попередні локальні зміни.
            </p>
            <p className="text-xs text-gray-400 font-sans">
              Бажаєте перейти на новий сайт з GitHub (скинувши ваші локальні чернетки), чи залишити ваші локальні редагування?
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleAcceptNewSiteVersion}
                className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-teal text-black font-cinzel font-bold rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(102,252,241,0.4)]"
              >
                <RefreshCw size={14} />
                <span>Оновити сайт (завантажити новий сайт з GitHub)</span>
              </button>

              <button
                onClick={handleExportGitHubZip}
                className="w-full py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FolderArchive size={14} />
                <span>Зберегти мої зміни в ZIP перед оновленням</span>
              </button>

              <button
                onClick={handleKeepLocalChanges}
                className="w-full py-2 bg-transparent text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Залишити мої локальні зміни (не оновлювати зараз)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-black/95 border-2 border-neon-cyan text-white p-3.5 rounded-xl shadow-[0_0_20px_rgba(102,252,241,0.5)] animate-bounce font-mono text-xs flex items-center gap-3">
          <Sparkles className="text-neon-cyan shrink-0" size={18} />
          <div>
            {toast.title && <div className="font-bold text-neon-cyan">{toast.title}</div>}
            <div>{toast.message}</div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 glow-box-cyan text-center space-y-4">
            <h3 className="font-cinzel text-lg text-neon-cyan font-bold">{confirmDialog.title}</h3>
            <p className="text-sm text-gray-300 font-serif leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-5 py-2 bg-transparent text-gray-400 hover:text-white border border-gray-600 rounded-xl text-xs cursor-pointer"
              >
                Скасувати
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-6 py-2 bg-red-500 text-white font-cinzel font-bold rounded-xl text-xs hover:bg-red-400 transition-all cursor-pointer shadow-[0_0_15px_#ff0055]"
              >
                Підтвердити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
