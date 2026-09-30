/**
 * Audio and Track local storage using browser IndexedDB.
 * Caches audio Blobs so songs don't need to be fetched from GitHub repeatedly,
 * and preserves listened tracks even if they are removed from the GitHub repository.
 */

const DB_NAME = 'andrelf_cult_db';
const DB_VERSION = 1;
const AUDIO_STORE = 'audio_cache';
const TRACKS_STORE = 'preserved_tracks';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TRACKS_STORE)) {
        db.createObjectStore(TRACKS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves an audio Blob in IndexedDB cache for instant offline playback
 */
export async function saveAudioToLocalStore(trackKey: string, blob: Blob): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.put({ id: trackKey, blob, savedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[audioStorage] Failed to cache audio Blob:', err);
  }
}

/**
 * Retrieves a cached audio Blob from IndexedDB
 */
export async function getAudioFromLocalStore(trackKey: string): Promise<Blob | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.get(trackKey);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[audioStorage] Failed to read audio from cache:', err);
    return null;
  }
}

/**
 * Checks if a track audio is cached locally
 */
export async function isAudioCached(trackKey: string): Promise<boolean> {
  try {
    const blob = await getAudioFromLocalStore(trackKey);
    return blob !== null;
  } catch {
    return false;
  }
}

/**
 * Saves track metadata into preserved tracks in both IndexedDB & localStorage
 * so that existing users always keep their listened tracks even if removed from GitHub!
 */
export async function preserveTrackMetadata(track: any): Promise<void> {
  if (!track) return;
  const key = track.id || track.filename;
  if (!key) return;

  // 1. Save to localStorage backup
  try {
    const stored = JSON.parse(localStorage.getItem('psychoAndriy_preserved_tracks') || '{}');
    stored[key] = {
      ...track,
      preservedAt: Date.now()
    };
    localStorage.setItem('psychoAndriy_preserved_tracks', JSON.stringify(stored));
  } catch (e) {}

  // 2. Save to IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(TRACKS_STORE, 'readwrite');
      const store = tx.objectStore(TRACKS_STORE);
      const req = store.put({ id: key, track, preservedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {}
}

/**
 * Returns all preserved tracks that the user has loaded or listened to
 */
export async function getPreservedTracks(): Promise<any[]> {
  const fromLocal: Record<string, any> = {};
  try {
    const stored = JSON.parse(localStorage.getItem('psychoAndriy_preserved_tracks') || '{}');
    Object.assign(fromLocal, stored);
  } catch (e) {}

  try {
    const db = await openDatabase();
    const fromIdb: any[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(TRACKS_STORE, 'readonly');
      const store = tx.objectStore(TRACKS_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    for (const item of fromIdb) {
      if (item && item.track && item.id) {
        if (!fromLocal[item.id]) {
          fromLocal[item.id] = item.track;
        }
      }
    }
  } catch (e) {}

  return Object.values(fromLocal);
}

/**
 * Removes a track from preserved cache if the user/admin explicitly deleted it
 */
export async function removePreservedTrack(trackKey: string): Promise<void> {
  try {
    const stored = JSON.parse(localStorage.getItem('psychoAndriy_preserved_tracks') || '{}');
    delete stored[trackKey];
    localStorage.setItem('psychoAndriy_preserved_tracks', JSON.stringify(stored));
  } catch (e) {}

  try {
    const db = await openDatabase();
    const tx = db.transaction([AUDIO_STORE, TRACKS_STORE], 'readwrite');
    tx.objectStore(AUDIO_STORE).delete(trackKey);
    tx.objectStore(TRACKS_STORE).delete(trackKey);
  } catch (e) {}
}
