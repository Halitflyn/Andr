import JSZip from 'jszip';
import { Track, AlphabetItem, GrammarItem } from '../data';

/**
 * Formats a TypeScript string with proper escaping
 */
function escapeTsString(str: string): string {
  return JSON.stringify(str);
}

/**
 * Generates the full, valid src/data.ts file content
 */
export function generateDataTsSource(
  rules: string[],
  tracks: Track[],
  alphabet: AlphabetItem[],
  grammar: GrammarItem[]
): string {
  const serializedRules = rules
    .map((r) => `  ${escapeTsString(r)}`)
    .join(',\n');

  const serializedTracks = tracks
    .map((t) => {
      const parts: string[] = [];
      parts.push(`    filename: ${escapeTsString(t.filename || t.id || 'track.mp3')}`);
      parts.push(`    title: ${escapeTsString(t.title)}`);
      parts.push(`    author: ${escapeTsString(t.author)}`);
      if (t.coAuthor) {
        parts.push(`    coAuthor: ${escapeTsString(t.coAuthor)}`);
      }
      parts.push(`    description: ${escapeTsString(t.description || '')}`);
      if (t.url) {
        parts.push(`    url: ${escapeTsString(t.url)}`);
      }
      if (t.lyrics) {
        // Use multiline backticks safely
        const escapedLyrics = t.lyrics.replace(/`/g, '\\`').replace(/\${/g, '\\${');
        parts.push(`    lyrics: \`${escapedLyrics}\``);
      }
      if (t.subtitles && t.subtitles.length > 0) {
        parts.push(`    subtitles: ${JSON.stringify(t.subtitles, null, 6).trim()}`);
      }
      return `  {\n${parts.join(',\n')}\n  }`;
    })
    .join(',\n');

  const serializedAlphabet = alphabet
    .map(
      (a) =>
        `  { symbol: ${escapeTsString(a.symbol)}, sound: ${escapeTsString(a.sound)}, description: ${escapeTsString(a.description)} }`
    )
    .join(',\n');

  const serializedGrammar = grammar
    .map(
      (g) =>
        `  {\n    title: ${escapeTsString(g.title)},\n    description: ${escapeTsString(g.description)}\n  }`
    )
    .join(',\n');

  return `// Auto-generated data file for Andrelf Cult Website
export interface WordTiming {
  word: string;
  duration: number;
}

export interface SubtitleCue {
  id?: string;
  startTime: number;
  endTime: number;
  text: string;
  words?: WordTiming[];
  letterSpeed?: number;
}

export interface Track {
  id?: string;
  filename: string;
  title: string;
  author: string;
  coAuthor?: string;
  description: string;
  url?: string;
  lyrics?: string;
  subtitles?: SubtitleCue[];
  isCustom?: boolean;
  hasFile?: boolean;
  fileType?: string;
  createdAt?: any;
}

export interface AlphabetItem {
  symbol: string;
  sound: string;
  description: string;
}

export interface GrammarItem {
  title: string;
  description: string;
}

export interface DictionaryItem {
  id?: string;
  word: string;
  runic: string;
  meaning: string;
  createdAt?: number;
  author?: string;
}

export const rulesData: string[] = [
${serializedRules}
];

export const tracksData: Track[] = [
${serializedTracks}
];

export const alphabetData: AlphabetItem[] = [
${serializedAlphabet}
];

export const grammarData: GrammarItem[] = [
${serializedGrammar}
];
`;
}

/**
 * Initiates browser download of a blob
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Downloads single src/data.ts file
 */
export function downloadDataTsOnly(
  rules: string[],
  tracks: Track[],
  alphabet: AlphabetItem[],
  grammar: GrammarItem[]
) {
  const content = generateDataTsSource(rules, tracks, alphabet, grammar);
  const blob = new Blob([content], { type: 'text/typescript;charset=utf-8' });
  triggerFileDownload(blob, 'data.ts');
}

/**
 * Bundles changes into a ready-to-commit ZIP with exact repository layout
 */
export async function downloadGitHubUpdateZip(
  rules: string[],
  tracks: Track[],
  alphabet: AlphabetItem[],
  grammar: GrammarItem[],
  customAudioFiles?: Record<string, Blob>
): Promise<void> {
  const zip = new JSZip();

  // 1. src/data.ts
  const dataTsContent = generateDataTsSource(rules, tracks, alphabet, grammar);
  zip.file('src/data.ts', dataTsContent);

  // 2. src/version.ts (updates build timestamp)
  const newTimestamp = Date.now();
  zip.file('src/version.ts', `// Auto-generated site build version\nexport const SITE_BUILD_VERSION = ${newTimestamp};\n`);

  // 3. Audio files if uploaded locally
  if (customAudioFiles) {
    for (const [name, blob] of Object.entries(customAudioFiles)) {
      zip.file(`public/music/${name}`, blob);
    }
  }

  // 4. Clear instructions in Ukrainian
  const instructions = `=====================================================
ЯК ОНОВИТИ ВАШ САЙТ НА GITHUB (ЗА 30 СЕКУНД)
=====================================================

Вміст цього архіву містить файли вашого сайту з усіма змінами
(новими/зміненими правилами, піснями, текстами та налаштуваннями).

ВАРІАНТ 1 (Найшвидший через браузер на GitHub):
1. Відкрийте ваш репозиторій на https://github.com
2. Перейдіть у папку "src"
3. Натисніть "Add file" -> "Upload files"
4. Перетягніть файл "data.ts" (з папки "src" цього архіву)
5. Внизу натисніть зелену кнопку "Commit changes".

ВАРІАНТ 2 (Оновити всю папку):
1. Розархівуйте цей ZIP файл на комп'ютері.
2. Перетягніть отриману папку "src" прямо у вікно репозиторію на GitHub.
3. Натисніть "Commit changes".

Після коміту GitHub Actions автоматично перезбере сайт,
і через ~30 секунд усі ваші зміни стануть видимі всім відвідувачам!
`;
  zip.file('README-ІНСТРУКЦІЯ.txt', instructions);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerFileDownload(zipBlob, `andrelf-github-update-${new Date().toISOString().slice(0, 10)}.zip`);
}
