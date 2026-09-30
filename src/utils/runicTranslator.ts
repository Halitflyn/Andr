/**
 * Dybriv Runes Advanced Phonetic Translator
 * Implements canonical rules formulated by Fehykitop and the Cult of Psycho-Andriy:
 * 
 * Target Canonical Test Case:
 * Input:  Психо-Андрельф, Фехукі, Кабачок, Ньом, Лем, Ельф, Чапля, Жьмень
 * Output: ΠᛋИҲꙮ-ᚨНᛞᚱЕЛЬФ, ФЕҲУΚІ, ΚᚨᛒᚨᛏᛋꙮΚ, НÖᛗ, LЕᛗ, ЕЛЬФ, ᛏᛋᚨΠЛЯ, ӁᛗЕЊ
 * 
 * Rules:
 * 1. Cult words & sacred O:
 *    - 'психо', 'андрельф', 'кабачок', 'чай', 'культ', 'бог', 'діброва', 'священний', 'адепт', 'ліс'
 *    - All occurrences of 'о' in these words become sacred ꙮ (ΠᛋИҲꙮ, ΚᚨᛒᚨᛏᛋꙮΚ).
 * 2. Soft Л vs Hard L:
 *    - Soft Л combinations (ль, ля, лю, лє) use the sacred rune Л!
 *    - 'ль' keeps the soft sign Ь: 'ль' -> 'ЛЬ' (Андрельф -> ᚨНᛞᚱЕЛЬФ, Ельф -> ЕЛЬФ).
 *    - 'ля' -> 'ЛЯ' (Чапля -> ᛏᛋᚨΠЛЯ).
 *    - 'лю' -> 'ЛЮ' (or 'ЛѤ' if stressed).
 *    - 'лє' -> 'ЛЄ'.
 *    - Hard л (when not followed by ь, я, ю, є) becomes 'L' (Лем -> LЕᛗ, LЕᛗᛒ).
 * 3. ЬО -> Ö:
 *    - 'ьо' / 'ЬО' becomes 'Ö' (Ньом -> НÖᛗ).
 * 4. НЬ -> Њ:
 *    - 'нь' / 'НЬ' becomes 'Њ' (Жьмень -> ӁᛗЕЊ, тінь -> ᛏІЊ).
 * 5. ЖЬ -> Ӂ:
 *    - 'жь' / 'ЖЬ' becomes 'Ӂ' (Жьмень -> ӁᛗЕЊ).
 * 6. ФЬ -> Ƒ:
 *    - 'фь' / 'ФЬ' becomes 'Ƒ'.
 * 7. ПП -> ∩:
 *    - 'пп' / 'ПП' becomes '∩'.
 * 8. ДЖ -> Џ:
 *    - 'дж' / 'ДЖ' becomes 'Џ'.
 * 9. Ч -> ᛏᛋ:
 *    - 'ч' / 'Ч' becomes 'ᛏᛋ'.
 * 10. Ш -> Ψ:
 *    - 'ш' / 'Ш' becomes 'Ψ'.
 * 11. Х -> Ҳ (hard) vs ХЬ (soft):
 *    - Hard х is Ҳ (Психо -> ΠᛋИҲꙮ, Фехукі -> ФЕҲУΚІ).
 * 12. Stressed Я & Ю -> Ꙗ & Ѥ.
 */

export interface TranslatorOptions {
  sacredO?: boolean;
  smartStress?: boolean;
  preserveCase?: boolean;
}

// Cult words that trigger sacred ꙮ when sacredO is enabled (includes кабачок and cult lore terms)
const CULT_WORDS_REGEX = /(кабач[а-яіїє]*|психо[а-яіїє]*|андрельф[а-яіїє]*|андр[а-яіїє]*|чай[а-яіїє]*|культ[а-яіїє]*|бог[а-яіїє]*|дібр[а-яіїє]*|свящ[а-яіїє]*|адепт[а-яіїє]*|ліс[а-яіїє]*)/gi;

// Stressed words dictionary for Я / Ю
const STRESSED_YA_REGEX = /\b(я|моя́?|твоя́?|своя́?|життя́?|ім'я́?|знання́?|святи́?ня|прися́?га|андрія́?|воля́?|земля́?|надія́?|пісня́?)\b/gi;
const STRESSED_YU_REGEX = /\b(лю́?бить|лю́?ди|ю́?ність|клю́?ч|плю́?с|чу́?ю|зна́?ю|ча́?ю|борю́?ся|стою́?)\b/gi;

export function ukrainianToDybriv(
  text: string,
  options: TranslatorOptions = { sacredO: true, smartStress: true }
): string {
  if (!text) return '';

  let res = text;

  // 1. Mark and handle sacred ꙮ in cult terms if enabled
  if (options.sacredO) {
    res = res.replace(CULT_WORDS_REGEX, (match) => {
      return match.replace(/[оО]/g, 'ꙮ');
    });
  }

  // Explicit user tokens for Ғ, Ø, Ө
  res = res.replace(/\[(?:ɦ|ғ|г'|гһ)\]/gi, 'Ғ');
  res = res.replace(/\[(?:ø|ф\/в|в\/ф|фв|вф)\]/gi, 'Ø');
  res = res.replace(/\[(?:ө|oe|о-е|е-о)\]/gi, 'Ө');
  res = res.replace(/ғ/gi, 'Ғ');
  res = res.replace(/ø/gi, 'Ø');
  res = res.replace(/ө/gi, 'Ө');

  // Stressed Ю / Я handling
  res = res.replace(/[юЮ]\u0301|\[ю́\]|\[Ѥ\]|ю́|Ю́/g, 'Ѥ');
  res = res.replace(/[яЯ]\u0301|\[я́\]|\[Ꙗ\]|я́|Я́/g, 'Ꙗ');

  if (options.smartStress) {
    res = res.replace(STRESSED_YA_REGEX, (match) => {
      return match.replace(/я/g, 'Ꙗ').replace(/Я/g, 'Ꙗ');
    });
    res = res.replace(STRESSED_YU_REGEX, (match) => {
      return match.replace(/ю/g, 'Ѥ').replace(/Ю/g, 'Ѥ');
    });
  }

  // 2. Multi-letter combinations
  // ПП -> ∩ (Double P arc)
  res = res.replace(/пп/gi, '∩');

  // ДЖ -> Џ (Dje)
  res = res.replace(/дж/gi, 'Џ');

  // ЖЬ -> Ӂ (Soft Zh without separate Ь)
  res = res.replace(/жь/gi, 'Ӂ');

  // ФЬ -> Ƒ (Soft F without separate Ь)
  res = res.replace(/фь/gi, 'Ƒ');

  // ЬО -> Ö (Om') - MUST occur before 'нь' -> 'Њ' so 'Ньом' -> 'НÖм'
  res = res.replace(/ьо/gi, 'Ö');

  // НЬ -> Њ (Soft N becomes Њ)
  res = res.replace(/нь/gi, 'Њ');

  // 3. Handle Soft Л vs Hard L:
  // Use a protected token \uE000 to prevent charMap from turning soft Л into L
  res = res.replace(/ль/gi, '\uE000Ь');
  res = res.replace(/ля/gi, '\uE000Я');
  res = res.replace(/лю/gi, '\uE000Ю');
  res = res.replace(/лє/gi, '\uE000Є');

  // All remaining unsoftened 'л' / 'Л' become 'L'
  res = res.replace(/[лЛ]/g, 'L');

  // Soft X:
  res = res.replace(/хь/gi, 'ХЬ');
  res = res.replace(/хі/gi, 'ХІ');

  // Ч -> ᛏᛋ (Chera)
  res = res.replace(/ч/gi, 'ᛏᛋ');

  // Ш -> Ψ (Shakha)
  res = res.replace(/ш/gi, 'Ψ');

  // 4. Single character mapping
  const charMap: Record<string, string> = {
    'а': 'ᚨ', 'А': 'ᚨ',
    'б': 'ᛒ', 'Б': 'ᛒ',
    'в': 'ᚹ', 'В': 'ᚹ',
    'г': 'Γ', 'Г': 'Γ',
    'ґ': 'Ґ', 'Ґ': 'Ґ',
    'д': 'ᛞ', 'Д': 'ᛞ',
    'е': 'Е', 'Е': 'Е',
    'є': 'Є', 'Є': 'Є',
    'ж': 'Ж', 'Ж': 'Ж',
    'з': 'З', 'З': 'З',
    'и': 'И', 'И': 'И',
    'і': 'І', 'І': 'І',
    'ї': 'Ї', 'Ї': 'Ї',
    'й': 'ᛃ', 'Й': 'ᛃ',
    'к': 'Κ', 'К': 'Κ',
    'м': 'ᛗ', 'М': 'ᛗ',
    'н': 'Н', 'Н': 'Н',
    'о': 'Ο', 'О': 'Ο',
    'п': 'Π', 'П': 'Π',
    'р': 'ᚱ', 'Р': 'ᚱ',
    'с': 'ᛋ', 'С': 'ᛋ',
    'т': 'ᛏ', 'Т': 'ᛏ',
    'у': 'У', 'У': 'У',
    'ф': 'Ф', 'Ф': 'Ф',
    'х': 'Ҳ', 'Х': 'Ҳ', // Hard X uses Ҳ (Фехукі -> ФЕҲУΚІ, Психо -> ΠᛋИҲꙮ)
    'ц': 'Ц', 'Ц': 'Ц',
    'щ': 'Щ', 'Щ': 'Щ',
    'ь': 'Ь', 'Ь': 'Ь',
    'ю': 'Ю', 'Ю': 'Ю',
    'я': 'Я', 'Я': 'Я',
  };

  let out = '';
  for (let i = 0; i < res.length; i++) {
    const ch = res[i];
    out += charMap[ch] !== undefined ? charMap[ch] : ch;
  }

  // Restore the protected soft Л rune token to canonical 'Л'
  out = out.replace(/\uE000/g, 'Л');

  return out;
}

export function dybrivToUkrainian(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Multi-rune / special symbols to Ukrainian
  res = res.replace(/∩/g, 'пп');
  res = res.replace(/Џ/g, 'дж');
  res = res.replace(/Ӂ/g, 'жь');
  res = res.replace(/Ƒ/g, 'фь');
  res = res.replace(/Ö/g, 'ьо');
  res = res.replace(/Ө/g, 'о');
  res = res.replace(/ꙮ/g, 'о'); // Sacred O is read as Ukrainian 'о'
  res = res.replace(/ᛏᛋ/g, 'ч');
  res = res.replace(/Ψ/g, 'ш');
  res = res.replace(/Ø/g, 'ф');
  res = res.replace(/Ғ/g, 'г');
  res = res.replace(/Ѥ/g, 'ю');
  res = res.replace(/Ꙗ/g, 'я');

  // Handle Н vs Њ
  res = res.replace(/Њ/g, 'нь');

  // Handle Л vs L
  // Before soft vowels (я, ю, є, і), Л produces 'л' (Чапля -> чапля)
  res = res.replace(/ЛЯ/gi, 'ля');
  res = res.replace(/ЛЮ/gi, 'лю');
  res = res.replace(/ЛЄ/gi, 'лє');
  res = res.replace(/ЛІ/gi, 'лі');
  // 'ЛЬ' produces 'ль' (Ельф -> ельф, Андрельф -> андрельф)
  res = res.replace(/ЛЬ/gi, 'ль');
  res = res.replace(/Л/g, 'ль');
  res = res.replace(/L/gi, 'л');

  // Handle Ҳ vs Х
  res = res.replace(/Ҳ/g, 'х');
  res = res.replace(/ХЬ/gi, 'хь');
  res = res.replace(/ХІ/gi, 'хі');
  res = res.replace(/Х/g, 'х');

  // Remaining runes
  const runeMap: Record<string, string> = {
    'ᚨ': 'а',
    'ᛒ': 'б',
    'ᚹ': 'в',
    'Γ': 'г',
    'Ґ': 'ґ',
    'ᛞ': 'д',
    'Е': 'е',
    'Є': 'є',
    'Ж': 'ж',
    'З': 'з',
    'И': 'и',
    'І': 'і',
    'Ї': 'ї',
    'ᛃ': 'й',
    'Κ': 'к',
    'ᛗ': 'м',
    'Н': 'н',
    'Ο': 'о',
    'Π': 'п',
    'ᚱ': 'р',
    'ᛋ': 'с',
    'ᛏ': 'т',
    'У': 'у',
    'Ф': 'ф',
    'Ц': 'ц',
    'Щ': 'щ',
    'Ь': 'ь',
    'Ю': 'ю',
    'Я': 'я',
  };

  let out = '';
  for (let i = 0; i < res.length; i++) {
    const ch = res[i];
    out += runeMap[ch] !== undefined ? runeMap[ch] : ch;
  }

  return out;
}
