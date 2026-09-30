import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  addDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Track, AlphabetItem, GrammarItem, DictionaryItem, alphabetData, grammarData, rulesData } from './data';

const firebaseConfig = {
  projectId: "impactful-hub-6j1d7",
  appId: "1:419742933988:web:aa070f723fe3d5c1b51df1",
  apiKey: "AIzaSyBbsSRJiJkQ_HJgW_ceasAnFzpG12Hwe80",
  authDomain: "impactful-hub-6j1d7.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-andrelf-eeefe627-dc11-4aa7-9abb-8e3b7d9e5eba",
  storageBucket: "impactful-hub-6j1d7.firebasestorage.app",
  messagingSenderId: "419742933988"
};

let app: any;
let db: any;
let auth: any;
export const googleProvider = new GoogleAuthProvider();

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase init fallback warning:', e);
}

export { app, db, auth, onAuthStateChanged, signInWithPopup, firebaseSignOut };
export type { User };

// --- Quota & Error Management ---
export function isQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = String(err?.message || err?.toString() || '').toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('exhausted') ||
    msg.includes('resource-exhausted') ||
    msg.includes('429') ||
    err.code === 'resource-exhausted'
  );
}

export function hasReadQuotaExceeded(): boolean {
  const timestamp = localStorage.getItem('firebaseReadQuotaExceededTime');
  if (timestamp) {
    const elapsed = Date.now() - parseInt(timestamp, 10);
    if (elapsed < 3600 * 1000) {
      return true;
    }
    localStorage.removeItem('firebaseReadQuotaExceededTime');
  }
  return false;
}

export function checkWriteQuota(): void {
  const timestamp = localStorage.getItem('firebaseQuotaExceededTime');
  if (timestamp) {
    const elapsed = Date.now() - parseInt(timestamp, 10);
    if (elapsed < 360 * 60 * 1000) {
      console.warn('Write quota exceeded, caching locally.');
    } else {
      localStorage.removeItem('firebaseQuotaExceededTime');
    }
  }
}

export function recordWriteQuotaExceeded(err: any): void {
  if (isQuotaError(err)) {
    localStorage.setItem('firebaseQuotaExceededTime', Date.now().toString());
  }
}

// --- IndexedDB Audio Cache ---
function openAudioCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('PsychoAndriyAudioCache', 1);
    req.onupgradeneeded = () => {
      const dbInstance = req.result;
      if (!dbInstance.objectStoreNames.contains('audioBlobs')) {
        dbInstance.createObjectStore('audioBlobs');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedAudioBlob(key: string): Promise<Blob | null> {
  try {
    const database = await openAudioCacheDB();
    return new Promise((resolve) => {
      const tx = database.transaction('audioBlobs', 'readonly');
      const store = tx.objectStore('audioBlobs');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function setCachedAudioBlob(key: string, blob: Blob): Promise<void> {
  try {
    const database = await openAudioCacheDB();
    return new Promise((resolve) => {
      const tx = database.transaction('audioBlobs', 'readwrite');
      const store = tx.objectStore('audioBlobs');
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (e) {}
}

export async function deleteCachedAudioBlob(key: string): Promise<void> {
  try {
    const database = await openAudioCacheDB();
    return new Promise((resolve) => {
      const tx = database.transaction('audioBlobs', 'readwrite');
      const store = tx.objectStore('audioBlobs');
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (e) {}
}

// --- Tracks API ---
export async function fetchCustomTracksFromFirestore(): Promise<Track[]> {
  try {
    if (!db || hasReadQuotaExceeded()) {
      const cached = localStorage.getItem('psychoAndriy_tracks');
      return cached ? JSON.parse(cached) : [];
    }
    const col = collection(db, 'tracks');
    const snap = await getDocs(col);
    const tracks: Track[] = [];
    snap.forEach((d) => {
      tracks.push({ id: d.id, ...(d.data() as any) });
    });
    tracks.sort((a, b) => {
      const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return tB - tA;
    });
    localStorage.setItem('psychoAndriy_tracks', JSON.stringify(tracks));
    return tracks;
  } catch (err: any) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
    const cached = localStorage.getItem('psychoAndriy_tracks');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function saveTrackChunksToFirestore(trackId: string, file: Blob): Promise<void> {
  try {
    if (!db) return;
    checkWriteQuota();
    const CHUNK_SIZE = 600 * 1024;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const base64Data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1] || res);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(chunk);
      });

      const chunkDocRef = doc(db, 'tracks', trackId, 'chunks', i.toString());
      await setDoc(chunkDocRef, { chunkIndex: i, data: base64Data });
    }
  } catch (err) {
    recordWriteQuotaExceeded(err);
  }
}

export async function saveTrackToFirestore(track: Partial<Track>, file?: File): Promise<string> {
  const generatedId = `custom_${Date.now()}`;
  const dataToSave: any = {
    ...track,
    id: generatedId,
    createdAt: new Date(),
  };
  if (file) {
    dataToSave.hasFile = true;
    dataToSave.fileType = file.type || 'audio/mpeg';
    dataToSave.url = `db://${dataToSave.title}`;
    await setCachedAudioBlob(generatedId, file);
  }

  // Update local cache first
  try {
    const cached = JSON.parse(localStorage.getItem('psychoAndriy_tracks') || '[]');
    cached.unshift(dataToSave);
    localStorage.setItem('psyspychoAndriy_tracks', JSON.stringify(cached));
    localStorage.setItem('psychoAndriy_tracks', JSON.stringify(cached));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = await addDoc(collection(db, 'tracks'), dataToSave);
      if (file) {
        await saveTrackChunksToFirestore(docRef.id, file);
      }
      return docRef.id;
    } catch (err: any) {
      recordWriteQuotaExceeded(err);
    }
  }
  return generatedId;
}

export async function updateTrackAudioAndMetadata(trackId: string, file: File, isCustom: boolean): Promise<void> {
  await setCachedAudioBlob(trackId, file);
  if (db) {
    try {
      await saveTrackChunksToFirestore(trackId, file);
      if (isCustom) {
        await updateTrackInFirestore(trackId, { hasFile: true, fileType: file.type || 'audio/mpeg' });
      } else {
        await saveTrackOverride(trackId, { hasFile: true, fileType: file.type || 'audio/mpeg' });
      }
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function fetchTrackAudioBlobFromFirestore(trackId: string, fileType = 'audio/mpeg'): Promise<Blob> {
  const cached = await getCachedAudioBlob(trackId);
  if (cached) return cached;

  if (!db || hasReadQuotaExceeded()) {
    throw new Error('Audio cache miss & offline mode');
  }

  try {
    const chunksCol = collection(db, 'tracks', trackId, 'chunks');
    const snap = await getDocs(chunksCol);
    if (snap.empty) {
      throw new Error('No track chunks found');
    }
    const chunksList: { chunkIndex: number; data: string }[] = [];
    snap.forEach((d) => {
      const data = d.data();
      chunksList.push({ chunkIndex: data.chunkIndex, data: data.data });
    });
    chunksList.sort((a, b) => a.chunkIndex - b.chunkIndex);
    const combinedBase64 = chunksList.map((c) => c.data).join('');
    const byteCharacters = atob(combinedBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    await setCachedAudioBlob(trackId, blob);
    return blob;
  } catch (err: any) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
    throw err;
  }
}

export async function deleteTrackFromFirestore(trackId: string): Promise<void> {
  await deleteCachedAudioBlob(trackId);
  try {
    const cached = JSON.parse(localStorage.getItem('psychoAndriy_tracks') || '[]');
    const filtered = cached.filter((t: any) => t.id !== trackId && t.filename !== trackId);
    localStorage.setItem('psychoAndriy_tracks', JSON.stringify(filtered));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      await deleteDoc(doc(db, 'tracks', trackId));
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function updateTrackInFirestore(trackId: string, trackData: Partial<Track>): Promise<void> {
  try {
    const cached = JSON.parse(localStorage.getItem('psychoAndriy_tracks') || '[]');
    const idx = cached.findIndex((t: any) => t.id === trackId || t.filename === trackId);
    if (idx >= 0) {
      cached[idx] = { ...cached[idx], ...trackData };
      localStorage.setItem('psychoAndriy_tracks', JSON.stringify(cached));
    }
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'tracks', trackId);
      await setDoc(docRef, trackData, { merge: true });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

// --- Overrides API ---
export async function fetchTrackOverrides(): Promise<Record<string, any>> {
  try {
    const cached = localStorage.getItem('psychoAndriy_overrides');
    if (!db || hasReadQuotaExceeded()) {
      return cached ? JSON.parse(cached) : {};
    }
    const col = collection(db, 'overrides');
    const snap = await getDocs(col);
    const res: Record<string, any> = {};
    snap.forEach((d) => {
      res[d.id] = d.data();
    });
    localStorage.setItem('psychoAndriy_overrides', JSON.stringify(res));
    return res;
  } catch (err: any) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
    const cached = localStorage.getItem('psychoAndriy_overrides');
    return cached ? JSON.parse(cached) : {};
  }
}

export async function saveTrackOverride(trackFilename: string, overrideData: Record<string, any>): Promise<void> {
  try {
    const current = JSON.parse(localStorage.getItem('psychoAndriy_overrides') || '{}');
    current[trackFilename] = { ...(current[trackFilename] || {}), ...overrideData };
    localStorage.setItem('psychoAndriy_overrides', JSON.stringify(current));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'overrides', trackFilename);
      await setDoc(docRef, overrideData, { merge: true });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

// --- Admins API ---
export async function fetchClaimedAdmins(): Promise<Record<string, any>> {
  try {
    const cached = localStorage.getItem('psychoAndriy_admins');
    if (!db || hasReadQuotaExceeded()) {
      return cached ? JSON.parse(cached) : {};
    }
    const col = collection(db, 'admins');
    const snap = await getDocs(col);
    const res: Record<string, any> = {};
    snap.forEach((d) => {
      res[d.id] = d.data();
    });
    localStorage.setItem('psychoAndriy_admins', JSON.stringify(res));
    return res;
  } catch (err: any) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
    const cached = localStorage.getItem('psychoAndriy_admins');
    return cached ? JSON.parse(cached) : {};
  }
}

// --- User Preferences ---
export async function fetchUserPreferences(uid: string): Promise<any | null> {
  try {
    const cached = localStorage.getItem(`psychoAndriy_prefs_${uid}`);
    if (!db || hasReadQuotaExceeded()) {
      return cached ? JSON.parse(cached) : null;
    }
    const docRef = doc(db, 'user_preferences', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      localStorage.setItem(`psychoAndriy_prefs_${uid}`, JSON.stringify(data));
      return data;
    }
    return cached ? JSON.parse(cached) : null;
  } catch (err: any) {
    const cached = localStorage.getItem(`psychoAndriy_prefs_${uid}`);
    return cached ? JSON.parse(cached) : null;
  }
}

export async function saveUserPreferences(uid: string, preferences: Record<string, any>): Promise<void> {
  try {
    localStorage.setItem(`psychoAndriy_prefs_${uid}`, JSON.stringify(preferences));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'user_preferences', uid);
      await setDoc(docRef, preferences, { merge: true });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

// --- Global Likes ---
export async function fetchGlobalLikes(): Promise<Record<string, number>> {
  try {
    const cached = localStorage.getItem('psychoAndriy_likes');
    if (!db || hasReadQuotaExceeded()) {
      return cached ? JSON.parse(cached) : {};
    }
    const col = collection(db, 'likes');
    const snap = await getDocs(col);
    const res: Record<string, number> = {};
    snap.forEach((d) => {
      const data = d.data();
      res[d.id] = Array.isArray(data.likedBy) ? data.likedBy.length : 0;
    });
    localStorage.setItem('psychoAndriy_likes', JSON.stringify(res));
    return res;
  } catch (err: any) {
    const cached = localStorage.getItem('psychoAndriy_likes');
    return cached ? JSON.parse(cached) : {};
  }
}

export async function toggleGlobalLikeInFirestore(trackId: string, userId: string): Promise<number> {
  const currentLikes = JSON.parse(localStorage.getItem('psychoAndriy_likes') || '{}');
  const userLikes = JSON.parse(localStorage.getItem('psychoAndriyLiked') || '[]');
  const isLiked = userLikes.includes(trackId);
  const newCount = isLiked ? (currentLikes[trackId] || 0) + 1 : Math.max(0, (currentLikes[trackId] || 1) - 1);
  currentLikes[trackId] = newCount;
  localStorage.setItem('psychoAndriy_likes', JSON.stringify(currentLikes));

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'likes', trackId);
      const snap = await getDoc(docRef);
      let likedBy: string[] = snap.exists() ? snap.data().likedBy || [] : [];
      if (likedBy.includes(userId)) {
        likedBy = likedBy.filter((u) => u !== userId);
      } else {
        likedBy.push(userId);
      }
      await setDoc(docRef, { likedBy }, { merge: true });
      return likedBy.length;
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
  return newCount;
}

// --- Sub Admins ---
export async function fetchSubAdmins(): Promise<any[]> {
  try {
    const cached = localStorage.getItem('psychoAndriy_sub_admins');
    if (!db || hasReadQuotaExceeded()) {
      return cached ? JSON.parse(cached) : [];
    }
    const col = collection(db, 'sub_admins');
    const snap = await getDocs(col);
    const res: any[] = [];
    snap.forEach((d) => res.push(d.data()));
    localStorage.setItem('psychoAndriy_sub_admins', JSON.stringify(res));
    return res;
  } catch (err: any) {
    const cached = localStorage.getItem('psychoAndriy_sub_admins');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function addSubAdminToFirestore(email: string, addedByUid: string, addedByEmail: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new Error('Емейл не може бути пустим!');
  
  try {
    const cached = JSON.parse(localStorage.getItem('psychoAndriy_sub_admins') || '[]');
    cached.push({ email: cleanEmail, addedByUid, addedByEmail, addedAt: new Date() });
    localStorage.setItem('psychoAndriy_sub_admins', JSON.stringify(cached));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'sub_admins', cleanEmail);
      await setDoc(docRef, {
        email: cleanEmail,
        addedByUid,
        addedByEmail,
        addedAt: new Date(),
      });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function removeSubAdminFromFirestore(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const cached = JSON.parse(localStorage.getItem('psychoAndriy_sub_admins') || '[]');
    const filtered = cached.filter((a: any) => a.email !== cleanEmail);
    localStorage.setItem('psychoAndriy_sub_admins', JSON.stringify(filtered));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'sub_admins', cleanEmail);
      await deleteDoc(docRef);
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function checkIsSubAdminInFirestore(email: string): Promise<boolean> {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  try {
    const cached = localStorage.getItem('psychoAndriy_sub_admins');
    if (cached) {
      return JSON.parse(cached).some((a: any) => a.email?.trim().toLowerCase() === cleanEmail);
    }
  } catch (e) {}

  if (db && !hasReadQuotaExceeded()) {
    try {
      const docRef = doc(db, 'sub_admins', cleanEmail);
      const snap = await getDoc(docRef);
      return snap.exists();
    } catch (err) {
      if (isQuotaError(err)) {
        localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
      }
    }
  }
  return false;
}

// --- Rules & Alphabet & Dictionary & Grammar ---
export async function fetchRulesFromFirestore(fallback: string[] = rulesData): Promise<string[]> {
  try {
    const cached = localStorage.getItem('psychoAndriy_rules');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (!db || hasReadQuotaExceeded()) return fallback;
    const docRef = doc(db, 'config', 'rules');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.rules) && data.rules.length > 0) {
        localStorage.setItem('psychoAndriy_rules', JSON.stringify(data.rules));
        return data.rules;
      }
    }
  } catch (err) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
  }
  return fallback;
}

export async function saveRulesToFirestore(rules: string[]): Promise<void> {
  try {
    localStorage.setItem('psychoAndriy_rules', JSON.stringify(rules));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'config', 'rules');
      await setDoc(docRef, { rules });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function fetchAlphabetFromFirestore(): Promise<AlphabetItem[]> {
  try {
    const cached = localStorage.getItem('psychoAndriy_alphabet');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (!db || hasReadQuotaExceeded()) return alphabetData;
    const docRef = doc(db, 'config', 'alphabet');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.alphabet) && data.alphabet.length > 0) {
        localStorage.setItem('psychoAndriy_alphabet', JSON.stringify(data.alphabet));
        return data.alphabet;
      }
    }
  } catch (err) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
  }
  return alphabetData;
}

export async function fetchDictionaryFromFirestore(): Promise<DictionaryItem[]> {
  try {
    const cached = localStorage.getItem('psychoAndriy_dictionary');
    if (cached) {
      return JSON.parse(cached);
    }
    if (!db || hasReadQuotaExceeded()) return [];
    const col = collection(db, 'dictionary');
    const snap = await getDocs(col);
    const items: DictionaryItem[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as any) });
    });
    localStorage.setItem('psychoAndriy_dictionary', JSON.stringify(items));
    return items;
  } catch (err) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
    const cached = localStorage.getItem('psychoAndriy_dictionary');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function saveWordToDictionary(wordItem: Partial<DictionaryItem>): Promise<DictionaryItem> {
  const newId = wordItem.id || `dict_${Date.now()}`;
  const data: DictionaryItem = {
    id: newId,
    word: wordItem.word || '',
    runic: wordItem.runic || '',
    meaning: wordItem.meaning || '',
    createdAt: wordItem.createdAt || Date.now(),
    author: wordItem.author || 'Гість',
  };
  try {
    const current = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
    const idx = current.findIndex((i: any) => i.id === newId);
    if (idx >= 0) current[idx] = data;
    else current.push(data);
    localStorage.setItem('psychoAndriy_dictionary', JSON.stringify(current));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'dictionary', newId);
      await setDoc(docRef, data);
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
  return data;
}

export async function deleteWordFromDictionary(wordId: string): Promise<void> {
  try {
    const current = JSON.parse(localStorage.getItem('psychoAndriy_dictionary') || '[]');
    const filtered = current.filter((i: any) => i.id !== wordId);
    localStorage.setItem('psychoAndriy_dictionary', JSON.stringify(filtered));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'dictionary', wordId);
      await deleteDoc(docRef);
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function saveAlphabetToFirestore(alphabet: AlphabetItem[]): Promise<void> {
  try {
    localStorage.setItem('psychoAndriy_alphabet', JSON.stringify(alphabet));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'config', 'alphabet');
      await setDoc(docRef, { alphabet });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function fetchGrammarFromFirestore(): Promise<GrammarItem[]> {
  try {
    const cached = localStorage.getItem('psychoAndriy_grammar');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (!db || hasReadQuotaExceeded()) return grammarData;
    const docRef = doc(db, 'config', 'grammar');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.grammar) && data.grammar.length > 0) {
        localStorage.setItem('psychoAndriy_grammar', JSON.stringify(data.grammar));
        return data.grammar;
      }
    }
  } catch (err) {
    if (isQuotaError(err)) {
      localStorage.setItem('firebaseReadQuotaExceededTime', Date.now().toString());
    }
  }
  return grammarData;
}

export async function saveGrammarToFirestore(grammar: GrammarItem[]): Promise<void> {
  try {
    localStorage.setItem('psychoAndriy_grammar', JSON.stringify(grammar));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'config', 'grammar');
      await setDoc(docRef, { grammar });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

export async function saveTrackSubtitlesToFirestore(trackId: string, subtitles: any[]): Promise<void> {
  try {
    const cachedTracks = JSON.parse(localStorage.getItem('psychoAndriy_tracks') || '[]');
    const idx = cachedTracks.findIndex((t: any) => t.id === trackId || t.filename === trackId);
    if (idx >= 0) {
      cachedTracks[idx].subtitles = subtitles;
      localStorage.setItem('psychoAndriy_tracks', JSON.stringify(cachedTracks));
    }
    const currentOverrides = JSON.parse(localStorage.getItem('psychoAndriy_overrides') || '{}');
    currentOverrides[trackId] = { ...(currentOverrides[trackId] || {}), subtitles };
    localStorage.setItem('psychoAndriy_overrides', JSON.stringify(currentOverrides));
  } catch (e) {}

  if (db) {
    try {
      checkWriteQuota();
      const docRef = doc(db, 'overrides', trackId);
      await setDoc(docRef, { subtitles }, { merge: true });
    } catch (err) {
      recordWriteQuotaExceeded(err);
    }
  }
}

