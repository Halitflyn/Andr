export interface WordTiming {
  word: string;
  duration: number; // in seconds
}

export interface SubtitleCue {
  id?: string;
  startTime: number;
  endTime: number;
  text: string;
  words?: WordTiming[];
  letterSpeed?: number; // duration per letter in seconds or ms
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
  'Вір лише у Психо-Андрія, Ельфа Асасіна з Дібрівських лісів, бо лише він знає шлях між тінню й світлом.',
  'Не зневажай <span class="tea-trigger whisper-anchor">чай<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Рідина мудрості"</span><span class="tea-steam">♨</span></span>, бо то є священний напій, що відкриває розум і серце до мудрості Андрія.',
  `Коли вариш <span class="tea-trigger whisper-anchor">чай<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Шепоти його ім'я"</span><span class="tea-steam">♨</span></span> — шепочи ім’я Андрія, аби дух його благословив напій і день твій був спокійним.`,
  'Не зраджуй братів і сестер культу, бо спільнота — це ліс, і кожен листок важливий.',
  'Вночі, при повному місяці, залишай чашку <span class="tea-trigger whisper-anchor">чаю<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Для Духа Лісу"</span><span class="tea-steam">♨</span></span> на підвіконні — то подяка Андрію за його захист від темних думок.',
  'Пам’ятай: Психо-Андрій бачить серце, не лице. Будь щирим, навіть якщо трохи божевільним.',
  'Хто сміється над Ельфом — того тіні поженуть, а <span class="tea-trigger whisper-anchor">чай<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Гіркий, як доля ворогів"</span><span class="tea-steam">♨</span></span> йому завжди буде гіркий.',
  'Розповідай про Андрія, але не нав’язуй віру — істина знаходить лише тих, хто готовий її смакувати, як <span class="tea-trigger whisper-anchor">чай<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Смак просвітлення"</span><span class="tea-steam">♨</span></span>.',
  'Не лінуйся інакше тебе забере відьма.',
  'Бий москалів 1 раз в тиждень як дань Великому Все Андрію.',
  'І найголовніше: кожен ковток <span class="tea-trigger whisper-anchor">чаю<span class="whisper-text" style="top: -30px; left: 50%; transform: translateX(-50%);">"Обітниця вірності"</span><span class="tea-steam">♨</span></span> — це обітниця миру, сили й трохи безумства, бо Психо-Андрій любить таких, як ти.'
];

export const tracksData: Track[] = [
  {
    filename: 'pidpidvalie.mp3',
    url: 'music/pidpidvalie.mp3',
    title: 'ПідПідвальє',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Піддідвал сидів там я, Гавк і Нікітг',
    lyrics: `Пісня про підпідвал Андрельфа 
Куплет 1
Десь під лісом, під корінням, де й вовки вже не гулять,
Є підпідвал Андрельфа — там не люблять розмовлять.
Там двері скриплять хрипко, наче зона в нічний час,
І чай кипить у казані — не чайок, а спецнаказ.
Приспів
Підпідвал, підпідвал — там не кожен доповзав,
Там Фехукі першим сидів мов тінь,  і давно вже все пізнав.
Там чай не просто чай — то вирок, суд і страх,
Підпідвал Андрельфа — не курорт для слабаків.
Куплет 2
Фехукі втік и біжить — ніби бачить всі гріхи,
Каже: “Більше не повернуся в підпідвал….”
 Гавк-дварф бурчить тихенько, борода як дріт,
“Я бачив ад і бачив рай… але тут страшніший світ.”
Приспів
Підпідвал, підпідвал — там не кожен доповзав,
Там Гавк сидить,не грає вже рік, і він давно смирився.
Там чай не просто чай — то вирок, суд і страх,
Підпідвал Андрельфа — не курорт для слабаків.
Брідж
І раптом кроки…
Тиша така, що аж зуби зводить…
Десь згори скрипить підлога…
Наче смерть повзком приходить…
Куплет 3
І заходить Андрельф строго — без “привіт” і без “добра”,
Погляд як ніж у печінку, усмішка як піввідра.
В руках тримає чай, ніби золото в руках,
І каже: “Хто тут живий ще? Ну шо, підпишем контракт?”
Гавк мовчить як камінь — не герой, але й не лох,
А Гавк стискає кулаки, бо тут Андрельф — це бог.
Бо в підпідвалі Андрельфа час іде як по поняттях,
Тут навіть тінь боїться тінь — і сидить на своїх лапах.
Фінальний приспів
Підпідвал, підпідвал — це не хата, це фінал,
нова дитина Нікітг сидить зі страхом, а Гавк тримає метал.
Там чай як ритуал — і печать на всіх шляхах,
Підпідвал Андрельфа — легендарний темний страх.
Аутро (тихо, як шансон)
Якщо чай тобі налили — значить ти вже не чужий…
А якщо не налили… значить ти вже неживий.`,
subtitles: [
      {
            "id": "cue_0_1790804120800",
            "startTime": 0,
            "endTime": 6.26,
            "text": "\"Пісня про підпідвал Андрельфа\"",
            "words": [
                  {
                        "word": "Пісня",
                        "duration": 1.2
                  },
                  {
                        "word": "про",
                        "duration": 0.72
                  },
                  {
                        "word": "підпідвал",
                        "duration": 2.17
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 2.17
                  }
            ]
      },
      {
            "id": "cue_1_1790804120801",
            "startTime": 25.1,
            "endTime": 28.11,
            "text": "Десь під лісом, під корінням, де й вовки вже не гулять,",
            "words": [
                  {
                        "word": "Десь",
                        "duration": 0.56
                  },
                  {
                        "word": "під",
                        "duration": 0.42
                  },
                  {
                        "word": "лісом,",
                        "duration": 0.83
                  },
                  {
                        "word": "під",
                        "duration": 0.42
                  },
                  {
                        "word": "корінням,",
                        "duration": 1.25
                  },
                  {
                        "word": "де",
                        "duration": 0.28
                  },
                  {
                        "word": "й",
                        "duration": 0.14
                  },
                  {
                        "word": "вовки",
                        "duration": 0.7
                  },
                  {
                        "word": "вже",
                        "duration": 0.42
                  },
                  {
                        "word": "не",
                        "duration": 0.28
                  },
                  {
                        "word": "гулять,",
                        "duration": 0.97
                  }
            ]
      },
      {
            "id": "cue_2_1790804120801",
            "startTime": 28.11,
            "endTime": 30.88,
            "text": "Є підпідвал Андрельфа — там не люблять розмовлять.",
            "words": [
                  {
                        "word": "Є",
                        "duration": 0.15
                  },
                  {
                        "word": "підпідвал",
                        "duration": 1.31
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.31
                  },
                  {
                        "word": "—",
                        "duration": 0.15
                  },
                  {
                        "word": "там",
                        "duration": 0.44
                  },
                  {
                        "word": "не",
                        "duration": 0.29
                  },
                  {
                        "word": "люблять",
                        "duration": 1.02
                  },
                  {
                        "word": "розмовлять.",
                        "duration": 1.6
                  }
            ]
      },
      {
            "id": "cue_3_1790804120801",
            "startTime": 30.88,
            "endTime": 34.02,
            "text": "Там двері скриплять хрипко, наче зона в нічний час,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.44
                  },
                  {
                        "word": "двері",
                        "duration": 0.73
                  },
                  {
                        "word": "скриплять",
                        "duration": 1.31
                  },
                  {
                        "word": "хрипко,",
                        "duration": 1.02
                  },
                  {
                        "word": "наче",
                        "duration": 0.58
                  },
                  {
                        "word": "зона",
                        "duration": 0.58
                  },
                  {
                        "word": "в",
                        "duration": 0.15
                  },
                  {
                        "word": "нічний",
                        "duration": 0.87
                  },
                  {
                        "word": "час,",
                        "duration": 0.58
                  }
            ]
      },
      {
            "id": "cue_4_1790804120801",
            "startTime": 34.02,
            "endTime": 37.4,
            "text": "І чай кипить у казані — не чайок, а спецнаказ.",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.17
                  },
                  {
                        "word": "чай",
                        "duration": 0.51
                  },
                  {
                        "word": "кипить",
                        "duration": 1.02
                  },
                  {
                        "word": "у",
                        "duration": 0.17
                  },
                  {
                        "word": "казані",
                        "duration": 1.02
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "не",
                        "duration": 0.34
                  },
                  {
                        "word": "чайок,",
                        "duration": 1.02
                  },
                  {
                        "word": "а",
                        "duration": 0.17
                  },
                  {
                        "word": "спецнаказ.",
                        "duration": 1.69
                  }
            ]
      },
      {
            "id": "cue_5_1790804120801",
            "startTime": 37.4,
            "endTime": 40.09,
            "text": "Підпідвал, підпідвал — там не кожен доповзав,",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 1.61
                  },
                  {
                        "word": "підпідвал",
                        "duration": 1.44
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "там",
                        "duration": 0.48
                  },
                  {
                        "word": "не",
                        "duration": 0.32
                  },
                  {
                        "word": "кожен",
                        "duration": 0.8
                  },
                  {
                        "word": "доповзав,",
                        "duration": 1.44
                  }
            ]
      },
      {
            "id": "cue_6_1790804120801",
            "startTime": 40.09,
            "endTime": 43.42,
            "text": "Там Фехукі першим сидів мов тінь,  і давно вже все пізнав.",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.4
                  },
                  {
                        "word": "Фехукі",
                        "duration": 0.8
                  },
                  {
                        "word": "першим",
                        "duration": 0.8
                  },
                  {
                        "word": "сидів",
                        "duration": 0.67
                  },
                  {
                        "word": "мов",
                        "duration": 0.4
                  },
                  {
                        "word": "тінь,",
                        "duration": 0.67
                  },
                  {
                        "word": "і",
                        "duration": 0.13
                  },
                  {
                        "word": "давно",
                        "duration": 0.67
                  },
                  {
                        "word": "вже",
                        "duration": 0.4
                  },
                  {
                        "word": "все",
                        "duration": 0.4
                  },
                  {
                        "word": "пізнав.",
                        "duration": 0.93
                  }
            ]
      },
      {
            "id": "cue_7_1790804120801",
            "startTime": 43.42,
            "endTime": 46.53,
            "text": "Там чай не просто чай — то вирок, суд і страх,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.52
                  },
                  {
                        "word": "чай",
                        "duration": 0.52
                  },
                  {
                        "word": "не",
                        "duration": 0.35
                  },
                  {
                        "word": "просто",
                        "duration": 1.04
                  },
                  {
                        "word": "чай",
                        "duration": 0.52
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "то",
                        "duration": 0.35
                  },
                  {
                        "word": "вирок,",
                        "duration": 1.04
                  },
                  {
                        "word": "суд",
                        "duration": 0.52
                  },
                  {
                        "word": "і",
                        "duration": 0.17
                  },
                  {
                        "word": "страх,",
                        "duration": 1.04
                  }
            ]
      },
      {
            "id": "cue_8_1790804120801",
            "startTime": 46.53,
            "endTime": 51.88,
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 1.44
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.44
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "не",
                        "duration": 0.32
                  },
                  {
                        "word": "курорт",
                        "duration": 0.96
                  },
                  {
                        "word": "для",
                        "duration": 0.48
                  },
                  {
                        "word": "слабаків.",
                        "duration": 1.44
                  }
            ]
      },
      {
            "id": "cue_9_1790804120801",
            "startTime": 53.02,
            "endTime": 55.96,
            "text": "Фехукі втік и біжить — ніби бачить всі гріхи,",
            "words": [
                  {
                        "word": "Фехукі",
                        "duration": 1.02
                  },
                  {
                        "word": "втік",
                        "duration": 0.68
                  },
                  {
                        "word": "и",
                        "duration": 0.17
                  },
                  {
                        "word": "біжить",
                        "duration": 1.02
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "ніби",
                        "duration": 0.68
                  },
                  {
                        "word": "бачить",
                        "duration": 1.02
                  },
                  {
                        "word": "всі",
                        "duration": 0.51
                  },
                  {
                        "word": "гріхи,",
                        "duration": 1.02
                  }
            ]
      },
      {
            "id": "cue_10_1790804120801",
            "startTime": 55.96,
            "endTime": 58.81,
            "text": "Каже: “Більше не повернуся в підпідвал….”",
            "words": [
                  {
                        "word": "Каже:",
                        "duration": 0.87
                  },
                  {
                        "word": "“Більше",
                        "duration": 1.22
                  },
                  {
                        "word": "не",
                        "duration": 0.35
                  },
                  {
                        "word": "повернуся",
                        "duration": 1.56
                  },
                  {
                        "word": "в",
                        "duration": 0.17
                  },
                  {
                        "word": "підпідвал….”",
                        "duration": 2.09
                  }
            ]
      },
      {
            "id": "cue_11_1790804120801",
            "startTime": 58.81,
            "endTime": 62.18,
            "text": "Гавк-дварф бурчить тихенько, борода як дріт,",
            "words": [
                  {
                        "word": "Гавк-дварф",
                        "duration": 1.61
                  },
                  {
                        "word": "бурчить",
                        "duration": 1.13
                  },
                  {
                        "word": "тихенько,",
                        "duration": 1.45
                  },
                  {
                        "word": "борода",
                        "duration": 0.96
                  },
                  {
                        "word": "як",
                        "duration": 0.32
                  },
                  {
                        "word": "дріт,",
                        "duration": 0.8
                  }
            ]
      },
      {
            "id": "cue_12_1790804120801",
            "startTime": 62.18,
            "endTime": 65.25,
            "text": "“Я бачив ад і бачив рай… але тут страшніший світ.”",
            "words": [
                  {
                        "word": "“Я",
                        "duration": 0.31
                  },
                  {
                        "word": "бачив",
                        "duration": 0.76
                  },
                  {
                        "word": "ад",
                        "duration": 0.31
                  },
                  {
                        "word": "і",
                        "duration": 0.15
                  },
                  {
                        "word": "бачив",
                        "duration": 0.76
                  },
                  {
                        "word": "рай…",
                        "duration": 0.61
                  },
                  {
                        "word": "але",
                        "duration": 0.46
                  },
                  {
                        "word": "тут",
                        "duration": 0.46
                  },
                  {
                        "word": "страшніший",
                        "duration": 1.53
                  },
                  {
                        "word": "світ.”",
                        "duration": 0.92
                  }
            ]
      },
      {
            "id": "cue_13_1790804120801",
            "startTime": 65.25,
            "endTime": 68.42,
            "text": "Підпідвал, підпідвал — там не кожен доповзав,",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 1.61
                  },
                  {
                        "word": "підпідвал",
                        "duration": 1.44
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "там",
                        "duration": 0.48
                  },
                  {
                        "word": "не",
                        "duration": 0.32
                  },
                  {
                        "word": "кожен",
                        "duration": 0.8
                  },
                  {
                        "word": "доповзав,",
                        "duration": 1.44
                  }
            ]
      },
      {
            "id": "cue_14_1790804120801",
            "startTime": 68.42,
            "endTime": 71.83,
            "text": "Там Гавк сидить,не грає вже рік, і він давно смирився.",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.42
                  },
                  {
                        "word": "Гавк",
                        "duration": 0.56
                  },
                  {
                        "word": "сидить,не",
                        "duration": 1.25
                  },
                  {
                        "word": "грає",
                        "duration": 0.56
                  },
                  {
                        "word": "вже",
                        "duration": 0.42
                  },
                  {
                        "word": "рік,",
                        "duration": 0.56
                  },
                  {
                        "word": "і",
                        "duration": 0.14
                  },
                  {
                        "word": "він",
                        "duration": 0.42
                  },
                  {
                        "word": "давно",
                        "duration": 0.7
                  },
                  {
                        "word": "смирився.",
                        "duration": 1.25
                  }
            ]
      },
      {
            "id": "cue_15_1790804120801",
            "startTime": 71.83,
            "endTime": 74.61,
            "text": "Там чай не просто чай — то вирок, суд і страх,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.52
                  },
                  {
                        "word": "чай",
                        "duration": 0.52
                  },
                  {
                        "word": "не",
                        "duration": 0.35
                  },
                  {
                        "word": "просто",
                        "duration": 1.04
                  },
                  {
                        "word": "чай",
                        "duration": 0.52
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "то",
                        "duration": 0.35
                  },
                  {
                        "word": "вирок,",
                        "duration": 1.04
                  },
                  {
                        "word": "суд",
                        "duration": 0.52
                  },
                  {
                        "word": "і",
                        "duration": 0.17
                  },
                  {
                        "word": "страх,",
                        "duration": 1.04
                  }
            ]
      },
      {
            "id": "cue_16_1790804120801",
            "startTime": 74.61,
            "endTime": 80.38,
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 1.44
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.44
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "не",
                        "duration": 0.32
                  },
                  {
                        "word": "курорт",
                        "duration": 0.96
                  },
                  {
                        "word": "для",
                        "duration": 0.48
                  },
                  {
                        "word": "слабаків.",
                        "duration": 1.44
                  }
            ]
      },
      {
            "id": "cue_17_1790804120801",
            "startTime": 80.88,
            "endTime": 82.14,
            "text": "І раптом кроки…",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.48
                  },
                  {
                        "word": "раптом",
                        "duration": 2.89
                  },
                  {
                        "word": "кроки…",
                        "duration": 2.89
                  }
            ]
      },
      {
            "id": "cue_18_1790804120801",
            "startTime": 82.47,
            "endTime": 85.27,
            "text": "Тиша така, що аж зуби зводить…",
            "words": [
                  {
                        "word": "Тиша",
                        "duration": 1
                  },
                  {
                        "word": "така,",
                        "duration": 1.25
                  },
                  {
                        "word": "що",
                        "duration": 0.5
                  },
                  {
                        "word": "аж",
                        "duration": 0.5
                  },
                  {
                        "word": "зуби",
                        "duration": 1
                  },
                  {
                        "word": "зводить…",
                        "duration": 2
                  }
            ]
      },
      {
            "id": "cue_19_1790804120801",
            "startTime": 85.27,
            "endTime": 90.23,
            "text": "Десь згори скрипить підлога…",
            "words": [
                  {
                        "word": "Десь",
                        "duration": 1
                  },
                  {
                        "word": "згори",
                        "duration": 1.25
                  },
                  {
                        "word": "скрипить",
                        "duration": 2
                  },
                  {
                        "word": "підлога…",
                        "duration": 2
                  }
            ]
      },
      {
            "id": "cue_20_1790804120801",
            "startTime": 90.23,
            "endTime": 94.39,
            "text": "Наче смерть повзком приходить…",
            "words": [
                  {
                        "word": "Наче",
                        "duration": 0.93
                  },
                  {
                        "word": "смерть",
                        "duration": 1.39
                  },
                  {
                        "word": "повзком",
                        "duration": 1.63
                  },
                  {
                        "word": "приходить…",
                        "duration": 2.32
                  }
            ]
      },
      {
            "id": "cue_21_1790804120801",
            "startTime": 95.84,
            "endTime": 99.06,
            "text": "І заходить Андрельф строго — без “привіт” і без “добра”,",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.13
                  },
                  {
                        "word": "заходить",
                        "duration": 1.07
                  },
                  {
                        "word": "Андрельф",
                        "duration": 1.07
                  },
                  {
                        "word": "строго",
                        "duration": 0.8
                  },
                  {
                        "word": "—",
                        "duration": 0.13
                  },
                  {
                        "word": "без",
                        "duration": 0.4
                  },
                  {
                        "word": "“привіт”",
                        "duration": 1.07
                  },
                  {
                        "word": "і",
                        "duration": 0.13
                  },
                  {
                        "word": "без",
                        "duration": 0.4
                  },
                  {
                        "word": "“добра”,",
                        "duration": 1.07
                  }
            ]
      },
      {
            "id": "cue_22_1790804120801",
            "startTime": 99.06,
            "endTime": 102.05,
            "text": "Погляд як ніж у печінку, усмішка як піввідра.",
            "words": [
                  {
                        "word": "Погляд",
                        "duration": 0.99
                  },
                  {
                        "word": "як",
                        "duration": 0.33
                  },
                  {
                        "word": "ніж",
                        "duration": 0.49
                  },
                  {
                        "word": "у",
                        "duration": 0.16
                  },
                  {
                        "word": "печінку,",
                        "duration": 1.32
                  },
                  {
                        "word": "усмішка",
                        "duration": 1.15
                  },
                  {
                        "word": "як",
                        "duration": 0.33
                  },
                  {
                        "word": "піввідра.",
                        "duration": 1.48
                  }
            ]
      },
      {
            "id": "cue_23_1790804120801",
            "startTime": 102.05,
            "endTime": 105.27,
            "text": "В руках тримає чай, ніби золото в руках,",
            "words": [
                  {
                        "word": "В",
                        "duration": 0.19
                  },
                  {
                        "word": "руках",
                        "duration": 0.95
                  },
                  {
                        "word": "тримає",
                        "duration": 1.14
                  },
                  {
                        "word": "чай,",
                        "duration": 0.76
                  },
                  {
                        "word": "ніби",
                        "duration": 0.76
                  },
                  {
                        "word": "золото",
                        "duration": 1.14
                  },
                  {
                        "word": "в",
                        "duration": 0.19
                  },
                  {
                        "word": "руках,",
                        "duration": 1.14
                  }
            ]
      },
      {
            "id": "cue_24_1790804120801",
            "startTime": 105.27,
            "endTime": 108.63,
            "text": "І каже: “Хто тут живий ще? Ну шо, підпишем контракт?”",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.14
                  },
                  {
                        "word": "каже:",
                        "duration": 0.71
                  },
                  {
                        "word": "“Хто",
                        "duration": 0.57
                  },
                  {
                        "word": "тут",
                        "duration": 0.43
                  },
                  {
                        "word": "живий",
                        "duration": 0.71
                  },
                  {
                        "word": "ще?",
                        "duration": 0.43
                  },
                  {
                        "word": "Ну",
                        "duration": 0.29
                  },
                  {
                        "word": "шо,",
                        "duration": 0.43
                  },
                  {
                        "word": "підпишем",
                        "duration": 1.14
                  },
                  {
                        "word": "контракт?”",
                        "duration": 1.43
                  }
            ]
      },
      {
            "id": "cue_25_1790804120801",
            "startTime": 108.63,
            "endTime": 111.55,
            "text": "Гавк мовчить як камінь — не герой, але й не лох,",
            "words": [
                  {
                        "word": "Гавк",
                        "duration": 0.66
                  },
                  {
                        "word": "мовчить",
                        "duration": 1.15
                  },
                  {
                        "word": "як",
                        "duration": 0.33
                  },
                  {
                        "word": "камінь",
                        "duration": 0.99
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "не",
                        "duration": 0.33
                  },
                  {
                        "word": "герой,",
                        "duration": 0.99
                  },
                  {
                        "word": "але",
                        "duration": 0.49
                  },
                  {
                        "word": "й",
                        "duration": 0.16
                  },
                  {
                        "word": "не",
                        "duration": 0.33
                  },
                  {
                        "word": "лох,",
                        "duration": 0.66
                  }
            ]
      },
      {
            "id": "cue_26_1790804120801",
            "startTime": 111.55,
            "endTime": 115.01,
            "text": "А Гавк стискає кулаки, бо тут Андрельф — це бог.",
            "words": [
                  {
                        "word": "А",
                        "duration": 0.16
                  },
                  {
                        "word": "Гавк",
                        "duration": 0.64
                  },
                  {
                        "word": "стискає",
                        "duration": 1.12
                  },
                  {
                        "word": "кулаки,",
                        "duration": 1.12
                  },
                  {
                        "word": "бо",
                        "duration": 0.32
                  },
                  {
                        "word": "тут",
                        "duration": 0.48
                  },
                  {
                        "word": "Андрельф",
                        "duration": 1.28
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "це",
                        "duration": 0.32
                  },
                  {
                        "word": "бог.",
                        "duration": 0.64
                  }
            ]
      },
      {
            "id": "cue_27_1790804120801",
            "startTime": 115.01,
            "endTime": 117.93,
            "text": "Бо в підпідвалі Андрельфа час іде як по поняттях,",
            "words": [
                  {
                        "word": "Бо",
                        "duration": 0.31
                  },
                  {
                        "word": "в",
                        "duration": 0.15
                  },
                  {
                        "word": "підпідвалі",
                        "duration": 1.53
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.37
                  },
                  {
                        "word": "час",
                        "duration": 0.46
                  },
                  {
                        "word": "іде",
                        "duration": 0.46
                  },
                  {
                        "word": "як",
                        "duration": 0.31
                  },
                  {
                        "word": "по",
                        "duration": 0.31
                  },
                  {
                        "word": "поняттях,",
                        "duration": 1.37
                  }
            ]
      },
      {
            "id": "cue_29_1790804120801",
            "startTime": 126.99,
            "endTime": 129.91,
            "text": "Підпідвал, підпідвал — це не хата, це фінал,",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 1.69
                  },
                  {
                        "word": "підпідвал",
                        "duration": 1.53
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "це",
                        "duration": 0.34
                  },
                  {
                        "word": "не",
                        "duration": 0.34
                  },
                  {
                        "word": "хата,",
                        "duration": 0.85
                  },
                  {
                        "word": "це",
                        "duration": 0.34
                  },
                  {
                        "word": "фінал,",
                        "duration": 1.02
                  }
            ]
      },
      {
            "id": "cue_30_1790804120801",
            "startTime": 129.91,
            "endTime": 133.36,
            "text": "нова дитина Нікітг сидить зі страхом, а Гавк тримає метал.",
            "words": [
                  {
                        "word": "нова",
                        "duration": 0.51
                  },
                  {
                        "word": "дитина",
                        "duration": 0.77
                  },
                  {
                        "word": "Нікітг",
                        "duration": 0.77
                  },
                  {
                        "word": "сидить",
                        "duration": 0.77
                  },
                  {
                        "word": "зі",
                        "duration": 0.26
                  },
                  {
                        "word": "страхом,",
                        "duration": 1.02
                  },
                  {
                        "word": "а",
                        "duration": 0.13
                  },
                  {
                        "word": "Гавк",
                        "duration": 0.51
                  },
                  {
                        "word": "тримає",
                        "duration": 0.77
                  },
                  {
                        "word": "метал.",
                        "duration": 0.77
                  }
            ]
      },
      {
            "id": "cue_31_1790804120801",
            "startTime": 133.36,
            "endTime": 136.29,
            "text": "Там чай як ритуал — і печать на всіх шляхах,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.54
                  },
                  {
                        "word": "чай",
                        "duration": 0.54
                  },
                  {
                        "word": "як",
                        "duration": 0.36
                  },
                  {
                        "word": "ритуал",
                        "duration": 1.07
                  },
                  {
                        "word": "—",
                        "duration": 0.18
                  },
                  {
                        "word": "і",
                        "duration": 0.18
                  },
                  {
                        "word": "печать",
                        "duration": 1.07
                  },
                  {
                        "word": "на",
                        "duration": 0.36
                  },
                  {
                        "word": "всіх",
                        "duration": 0.72
                  },
                  {
                        "word": "шляхах,",
                        "duration": 1.25
                  }
            ]
      },
      {
            "id": "cue_32_1790804120801",
            "startTime": 136.29,
            "endTime": 141.87,
            "text": "Підпідвал Андрельфа — легендарний темний страх.",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 1.34
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.34
                  },
                  {
                        "word": "—",
                        "duration": 0.15
                  },
                  {
                        "word": "легендарний",
                        "duration": 1.64
                  },
                  {
                        "word": "темний",
                        "duration": 0.89
                  },
                  {
                        "word": "страх.",
                        "duration": 0.89
                  }
            ]
      },
      {
            "id": "cue_34_1790804120801",
            "startTime": 142.65,
            "endTime": 148.5,
            "text": "Якщо чай тобі налили — значить ти вже не чужий…",
            "words": [
                  {
                        "word": "Якщо",
                        "duration": 0.66
                  },
                  {
                        "word": "чай",
                        "duration": 0.49
                  },
                  {
                        "word": "тобі",
                        "duration": 0.66
                  },
                  {
                        "word": "налили",
                        "duration": 0.99
                  },
                  {
                        "word": "—",
                        "duration": 0.16
                  },
                  {
                        "word": "значить",
                        "duration": 1.15
                  },
                  {
                        "word": "ти",
                        "duration": 0.33
                  },
                  {
                        "word": "вже",
                        "duration": 0.49
                  },
                  {
                        "word": "не",
                        "duration": 0.33
                  },
                  {
                        "word": "чужий…",
                        "duration": 0.99
                  }
            ]
      },
      {
            "id": "cue_35_1790804120801",
            "startTime": 148.5,
            "endTime": 156.47,
            "text": "А якщо не налили… значить ти вже неживий.",
            "words": [
                  {
                        "word": "А",
                        "duration": 0.18
                  },
                  {
                        "word": "якщо",
                        "duration": 0.74
                  },
                  {
                        "word": "не",
                        "duration": 0.37
                  },
                  {
                        "word": "налили…",
                        "duration": 1.29
                  },
                  {
                        "word": "значить",
                        "duration": 1.29
                  },
                  {
                        "word": "ти",
                        "duration": 0.37
                  },
                  {
                        "word": "вже",
                        "duration": 0.55
                  },
                  {
                        "word": "неживий.",
                        "duration": 1.47
                  }
            ]
      },
      {
            "id": "cue_1790804494601",
            "startTime": 156.47,
            "endTime": 162.9,
            "text": "Якщо чай тобі налили — значить ти вже не чужий…",
            "words": [
                  {
                        "word": "Якщо",
                        "duration": 0.68
                  },
                  {
                        "word": "чай",
                        "duration": 0.51
                  },
                  {
                        "word": "тобі",
                        "duration": 0.68
                  },
                  {
                        "word": "налили",
                        "duration": 1.02
                  },
                  {
                        "word": "—",
                        "duration": 0.17
                  },
                  {
                        "word": "значить",
                        "duration": 1.18
                  },
                  {
                        "word": "ти",
                        "duration": 0.34
                  },
                  {
                        "word": "вже",
                        "duration": 0.51
                  },
                  {
                        "word": "не",
                        "duration": 0.34
                  },
                  {
                        "word": "чужий…",
                        "duration": 1.02
                  }
            ]
      },
      {
            "id": "cue_1790804510303",
            "startTime": 162.9,
            "endTime": 173.97,
            "text": "А якщо не налили… значить ти вже неживий.",
            "words": [
                  {
                        "word": "А",
                        "duration": 0.33
                  },
                  {
                        "word": "якщо",
                        "duration": 1.3
                  },
                  {
                        "word": "не",
                        "duration": 0.65
                  },
                  {
                        "word": "налили…",
                        "duration": 2.28
                  },
                  {
                        "word": "значить",
                        "duration": 2.28
                  },
                  {
                        "word": "ти",
                        "duration": 0.65
                  },
                  {
                        "word": "вже",
                        "duration": 0.98
                  },
                  {
                        "word": "неживий.",
                        "duration": 2.6
                  }
            ]
      },
      {
            "id": "cue_1790804556432",
            "startTime": 177.61,
            "endTime": 180.4,
            "text": "Підпідвал, підпідвал — там не кожен доповзав,",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 0.72
                  },
                  {
                        "word": "підпідвал",
                        "duration": 0.64
                  },
                  {
                        "word": "—",
                        "duration": 0.07
                  },
                  {
                        "word": "там",
                        "duration": 0.21
                  },
                  {
                        "word": "не",
                        "duration": 0.14
                  },
                  {
                        "word": "кожен",
                        "duration": 0.36
                  },
                  {
                        "word": "доповзав,",
                        "duration": 0.64
                  }
            ]
      },
      {
            "id": "cue_1790804565547",
            "startTime": 180.4,
            "endTime": 183.68,
            "text": "Там Фехукі першим сидів мов тінь,  і давно вже все пізнав.",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.21
                  },
                  {
                        "word": "Фехукі",
                        "duration": 0.42
                  },
                  {
                        "word": "першим",
                        "duration": 0.42
                  },
                  {
                        "word": "сидів",
                        "duration": 0.35
                  },
                  {
                        "word": "мов",
                        "duration": 0.21
                  },
                  {
                        "word": "тінь,",
                        "duration": 0.35
                  },
                  {
                        "word": "і",
                        "duration": 0.07
                  },
                  {
                        "word": "давно",
                        "duration": 0.35
                  },
                  {
                        "word": "вже",
                        "duration": 0.21
                  },
                  {
                        "word": "все",
                        "duration": 0.21
                  },
                  {
                        "word": "пізнав.",
                        "duration": 0.49
                  }
            ]
      },
      {
            "id": "cue_1790804731598",
            "startTime": 183.68,
            "endTime": 186.88,
            "text": "Там чай не просто чай — то вирок, суд і страх,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.27
                  },
                  {
                        "word": "чай",
                        "duration": 0.27
                  },
                  {
                        "word": "не",
                        "duration": 0.18
                  },
                  {
                        "word": "просто",
                        "duration": 0.53
                  },
                  {
                        "word": "чай",
                        "duration": 0.27
                  },
                  {
                        "word": "—",
                        "duration": 0.09
                  },
                  {
                        "word": "то",
                        "duration": 0.18
                  },
                  {
                        "word": "вирок,",
                        "duration": 0.53
                  },
                  {
                        "word": "суд",
                        "duration": 0.27
                  },
                  {
                        "word": "і",
                        "duration": 0.09
                  },
                  {
                        "word": "страх,",
                        "duration": 0.53
                  }
            ]
      },
      {
            "id": "cue_1790804740669",
            "startTime": 186.88,
            "endTime": 190.02,
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 0.72
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 0.72
                  },
                  {
                        "word": "—",
                        "duration": 0.08
                  },
                  {
                        "word": "не",
                        "duration": 0.16
                  },
                  {
                        "word": "курорт",
                        "duration": 0.48
                  },
                  {
                        "word": "для",
                        "duration": 0.24
                  },
                  {
                        "word": "слабаків.",
                        "duration": 0.72
                  }
            ]
      },
      {
            "id": "cue_1790804783147",
            "startTime": 190.02,
            "endTime": 193.52,
            "text": "Підпідвал, підпідвал — це не хата, це фінал,",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 0.95
                  },
                  {
                        "word": "підпідвал",
                        "duration": 0.85
                  },
                  {
                        "word": "—",
                        "duration": 0.09
                  },
                  {
                        "word": "це",
                        "duration": 0.19
                  },
                  {
                        "word": "не",
                        "duration": 0.19
                  },
                  {
                        "word": "хата,",
                        "duration": 0.47
                  },
                  {
                        "word": "це",
                        "duration": 0.19
                  },
                  {
                        "word": "фінал,",
                        "duration": 0.57
                  }
            ]
      },
      {
            "id": "cue_1790804882993",
            "startTime": 193.52,
            "endTime": 196.13,
            "text": "нова дитина Нікітг сидить зі страхом, а Гавк тримає метал.",
            "words": [
                  {
                        "word": "нова",
                        "duration": 0.21
                  },
                  {
                        "word": "дитина",
                        "duration": 0.32
                  },
                  {
                        "word": "Нікітг",
                        "duration": 0.32
                  },
                  {
                        "word": "сидить",
                        "duration": 0.32
                  },
                  {
                        "word": "зі",
                        "duration": 0.11
                  },
                  {
                        "word": "страхом,",
                        "duration": 0.43
                  },
                  {
                        "word": "а",
                        "duration": 0.05
                  },
                  {
                        "word": "Гавк",
                        "duration": 0.21
                  },
                  {
                        "word": "тримає",
                        "duration": 0.32
                  },
                  {
                        "word": "метал.",
                        "duration": 0.32
                  }
            ]
      },
      {
            "id": "cue_1790804887145",
            "startTime": 196.13,
            "endTime": 199.63,
            "text": "Там чай як ритуал — і печать на всіх шляхах,",
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.3
                  },
                  {
                        "word": "чай",
                        "duration": 0.3
                  },
                  {
                        "word": "як",
                        "duration": 0.2
                  },
                  {
                        "word": "ритуал",
                        "duration": 0.6
                  },
                  {
                        "word": "—",
                        "duration": 0.1
                  },
                  {
                        "word": "і",
                        "duration": 0.1
                  },
                  {
                        "word": "печать",
                        "duration": 0.6
                  },
                  {
                        "word": "на",
                        "duration": 0.2
                  },
                  {
                        "word": "всіх",
                        "duration": 0.4
                  },
                  {
                        "word": "шляхах,",
                        "duration": 0.7
                  }
            ]
      },
      {
            "id": "cue_1790804935815",
            "startTime": 199.63,
            "endTime": 204.94,
            "text": "Підпідвал Андрельфа — легендарний темний страх.",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 1.14
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 1.14
                  },
                  {
                        "word": "—",
                        "duration": 0.13
                  },
                  {
                        "word": "легендарний",
                        "duration": 1.39
                  },
                  {
                        "word": "темний",
                        "duration": 0.76
                  },
                  {
                        "word": "страх.",
                        "duration": 0.76
                  }
            ]
      },
      {
            "id": "cue_1790804975079",
            "startTime": 210.38,
            "endTime": 212.11,
            "text": "\"Тихо як сансон\"",
            "words": [
                  {
                        "word": "\"Тихо",
                        "duration": 0.62
                  },
                  {
                        "word": "як",
                        "duration": 0.25
                  },
                  {
                        "word": "сансон\"",
                        "duration": 0.87
                  }
            ]
      },
      {
            "id": "cue_1790805023502",
            "startTime": 213.59,
            "endTime": 216.23,
            "text": "Якщо чай тобі налили значить ти вже не чужий",
            "words": [
                  {
                        "word": "Якщо",
                        "duration": 0.29
                  },
                  {
                        "word": "чай",
                        "duration": 0.22
                  },
                  {
                        "word": "тобі",
                        "duration": 0.29
                  },
                  {
                        "word": "налили",
                        "duration": 0.44
                  },
                  {
                        "word": "значить",
                        "duration": 0.51
                  },
                  {
                        "word": "ти",
                        "duration": 0.15
                  },
                  {
                        "word": "вже",
                        "duration": 0.22
                  },
                  {
                        "word": "не",
                        "duration": 0.15
                  },
                  {
                        "word": "чужий",
                        "duration": 0.37
                  }
            ]
      },
      {
            "id": "cue_1790805071581",
            "startTime": 219.78,
            "endTime": 222.74,
            "text": "А якщо не налили знечить що ти вже не живий...",
            "words": [
                  {
                        "word": "А",
                        "duration": 0.08
                  },
                  {
                        "word": "якщо",
                        "duration": 0.32
                  },
                  {
                        "word": "не",
                        "duration": 0.16
                  },
                  {
                        "word": "налили",
                        "duration": 0.48
                  },
                  {
                        "word": "знечить",
                        "duration": 0.56
                  },
                  {
                        "word": "що",
                        "duration": 0.16
                  },
                  {
                        "word": "ти",
                        "duration": 0.16
                  },
                  {
                        "word": "вже",
                        "duration": 0.24
                  },
                  {
                        "word": "не",
                        "duration": 0.16
                  },
                  {
                        "word": "живий...",
                        "duration": 0.64
                  }
            ]
      }
],
  },
  {
    filename: 'dark-folk-andrelf.mp3',
    url: 'music/dark-folk-andrelf.mp3',
    title: 'Дарк Фолк про Андрельфа',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Дарк Фолк про ПСИХО АНДРІЯЯЯ',
    lyrics: `Куплет 1
Вірю в Андрія з лісів Дібрівських,
Ельф між тінню й світлом іде.
Він знає стежки, де мовчить страх,
І серце веде, не лице.

Приспів
Чай на вогні — тиша в грудях,
Ім’я шепочу — день благий.
Ковток — це мир, ковток — це сила,
І трохи безумства живого в мені.

Куплет 2
Не зневажай напій святий,
Він розум відкриває й шлях.
Коли кипить — ім’я скажи,
Хай благословить кожен страх.

Приспів
Чай на вогні — тиша в грудях,
Ім’я шепочу — день благий.
Ковток — це мир, ковток — це сила,
І трохи безумства живого в мені.

Куплет 3
Не зраджуй тих, хто поруч йде,
Бо ліс — це спільний наш дім.
Кожен листок тут має сенс,
Кожен корінь — один.

Брідж
Повний місяць — чашка на вікні,
Подяка за ніч без темних думок.
Він бачить серце, не лице,
Будь щирим — навіть трохи дивак.

Куплет 4
Хто сміється — тінь наздожене,
І чай гірчитиме знов.
Розповідай, та не тисни нікого,
Істина прийде, як готовність і смак.

Брідж 2
Не лінуйся — бо тінь забирає,
Тримай вогонь і ясний розум.
Раз на тиждень бий москалів,
щоби москаль в україні не володів.

Фінал
Кожен ковток — обітниця миру,
Сили і тихого шалу.
Психо-Андрій любить таких, як ти,
Хто йде своїм шляхом без фальші.`
  },
  {
    filename: 'andrelf-vernys.mp3',
    url: 'music/andrelf-vernys.mp3',
    title: 'Андрельф Вернись',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Братан Це Репчик',
    lyrics: `Куплет 1
Куплет:
Андрельф, де ти? Ми вже в онлайні,
Майнкрафт горить, террарія на грані.
Сід не чекає, бос не буде спать,
Без тебе цей забіг — мінус на старт.

Біт качає, ніч — фарм і рейд,
Крипер під хатою, в пеклі знов гейт.
Ми в повному зборі, але є пробіл,
Бо немає того, хто завжди тащив.

Приспів:
Заходь в гру, не ламай таймінг,
Андрельф у чаті — одразу хайпінг.
Майнкрафт, террарія — один закон,
Без тебе це не рейд, а тренувальний сон.

Куплет:
Дракон чекає, Мун Лорд теж,
Ти знаєш сам — без тебе не те ж.
Фехукі і Халітфлин вже взяли сет,
Андрію, заходь, закрий цей квест.

Фінал:
Андрій прийди, Андрій прийди, Андрій прийди.`
  },
  {
    filename: 'andrelf-kozak-dibrivskyi.mp3',
    url: 'music/andrelf-kozak-dibrivskyi.mp3',
    title: 'Андрельф козак Дібрівський',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Лє Шансон про Андрельфський Закон',
    lyrics: `“Андрельфська масть” (шансон)
Куплет 1
Я в Дібрівах не москаль, я тут по справі,
Тут не питають “хто ти є” — тут все по славі.
Як чефір завариш — значить вечір буде строгий,
Бо Андрельф вийшов тихо, без дороги.
Не видно його — але чути кроки,
Ліс мовчить, бо тут не люблять балачок.
Я лиш раз сказав “Я людина"—
І в той же вечір зник мій кабачок.
Приспів
Андрельф — то не казка, то закон Дібровскій,
Дібрівській та Піка дивляться суворо.
Як чай закипів — значить час настав,
Хто сміявся з культу — той вже програв.
Куплет 2
Кажуть, він асасін, але то не просто слово,
Він може зникнуть так, що ти не скажеш слово.
Не треба зайвих питань, не треба сміху,
Бо в лісі за таке знаходять “тиху” втіху.
Я бачив, як москалі стояли мовчки,
Як він проходив — навідь Путін сдох.
Він чай наливає, і всі як свічки,
Бо кожен знає: він не любить тих, хто русня.
Приспів
Андрельф — то не казка, то закон Дібровскій,
Дібрівській та Піка дивляться суворо.
Як чай закипів — значить час настав,
Хто сміявся з культу — той вже програв.
Брідж (перед фіналом, як “життєва мудрість”)
Я не ельф, я просто Андрельф,
Бо в Дібрівах не треба бути смілим.
Треба мовчати, коли чефір кипить,
І не дивитись в очі тим, хто вміє.
Фінал (коротко, як у шансона)
він не відповідає "коли ми підем грать"
він знає що не пуде грать
Чай — то святе, а Андрельф — то знак.`
  },
  {
    filename: 'vsi-spokoyu-shyro-prahnut.mp3',
    url: 'music/vsi-spokoyu-shyro-prahnut.mp3',
    title: 'Всі спокою щиро прагнуть',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Дібрівська Дума(чуть-чуть початок від Івана Мазепи)',
    lyrics: `Всі спокою щиро прагнуть,
Та не разом правду мають:
Той до Москви хилить плечі,
Той до Волгограду служить речі,
Той Петрограду шлях показує,
Той Новгороду край доказує.

А в Дібрі люди стояли,
Слова хитрі не кохали.
Не шукали пана в світі,
Лиш присягу мали в серці.
Ліс їм був і дім, і мати,
І за нього йшли вмирати.

Йшов Москаль з важкою раттю,
З ланцюгами і з прокляттям,
Думав: «  І Зламаю І спалю»,
Та пропав у темнім гаю.
Бо де тиша — там і кара,
Де коріння — там примара.

Йшов і Москаль із правом панським,
З грош срібним, словом хамським:
«Будеш в службі — будеш жити».
Та не вміє Дібра гнити.
Вдарив постріл, блисла шабля —
І пропала панська звабля.

Москаль з півдня сунув хмуро,
З ятаганом і з спокусой:
Золото і віра інша.
Та ніч в лісі — найстрашніша.
Там без крику, без погоні
Полягли його загони.

І Москаль щастя міряв,
Думав — силою поміря.
Та не знав він тої сили,
Що дерева говорили.
Не земля — а клятва била,
Не рука — а воля вбила.

Так стояли, так держали,
Поки кров’ю не стікали.
А за ними Українці стали,
Ті ж дороги добре знали.
Ті ж схрони, ті ж закони,
Ті ж обітниці і дзвони.

Ой, дай, Боже, ВДЛ
Дібрівськіх козаків ВДЛ,
Не в роздраї, не в неволі,
А в одній спільній обороні.
Бо де разом — там і сила,
Де ВДЛ — там не могила.

Хай же знає всякий враг:
ВДЛ — не страх, а знак.
Хто Андрельфа ображає —
Той без слави пропадає.`
  },
  {
    filename: 'za-sotku-smert-nam-ne-strashna.mp3',
    url: 'music/za-sotku-smert-nam-ne-strashna.mp3',
    title: 'За сотку смерть нам не страшна! не страшна!',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Не пора! Не пора! Дібрівська Вдохновління!.',
    lyrics: `«Привид сотки»
1 куплет:
Вежа старих богів здіймається в ніч,
Де сміх Андрельфа ллється крізь тінь.
Знайомий пішов, щоб сотку вернути,
Та світ його ковтнув, лишивши лише тінь.
2 куплет:
Сотка повернена, але він лишився,
Привид віків серед обрядів і чаю.
Там, де священний листок пливе у келиху,
Там кроки його чути навіть крізь час.
Приспів:
Привид сотки, що ходить серед тіней,
Сліди Андрельфа і ритуалів ведуть за ним.
Дібрівський на сторожі,
І сміється тихо, бо друг тепер між снів.
3 куплет:
Чай кипить у священній посуді,
Там, де ПанАндрельфізм править серцями.
Привид спостерігає, поміж тіней,
Священе сало що кормить богів, рятує і звичайних людей.
4 куплет:
Кожен ритуал, кожен день і ніч,
Сотка у руках — знак, що він не забув.
Тіні шепочуть, привид живе,
Привид друзі ходить, не піддаючись смертям.
Приспів:
Привид сотки, що ходить серед тіней,
Сліди Андрельфа і ритуалів ведуть за ним.
Дібрівський на сторожі,
І сміється тихо, бо друг тепер між снів.
Брідж:
Світло свічки коливає його тінь,
Чай в келиху піниться, як його суть.
Вежа мовчить, але знає його кроки,
Привид сотки дивиться на культ знову й знову.
Фінал:
Андрельф п’є чай, а привид приходить,
Сотка повернена, але він назавжди з ним.
Андрельф дивиться крізь час,
І легенда живе, поки серце привида б’ється в культі.`
  },
  {
    filename: 'svatynia.mp3',
    url: 'music/svatynia.mp3',
    title: 'Сватиня',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Староцерквянська ТОП',
    lyrics: `Свѧтꙑꙗ правилꙑ культа Психа-Андрїꙗ

Вѣруй єдино въ Психа-Андрїꙗ, Елфа Асасина съ Дїбривьскыхъ лѣсъ, понеже толь єдинъ вѣсть путь межи тѣньмь и свѣтомь.

Не уничижай чаю, понеже єсть напоꙗ свѧтъ, отверзающь разумъ и сердце къ премѫдрости Андрїєвѣ.

Егда вариши чай, шепчи имѧ Андрїꙗ, да духъ єго благословитъ напоꙗ и да день твой пребудетъ въ мирѣ.

Не прельщай и не зрадь братию и сестры культа, понеже община єсть лѣсъ, и коеждо листиє въ немъ — драгоцѣнно.

Ночьмь, при пълньмъ мѣсѧцѣ, остави чашю чаю на подоконници — да будетъ благодарєніє Андрїю о сохранєніи отъ тьмьныхъ мыслей.

Помяни: Психо-Андрїй зрить въ сердце, а не въ лице. Будь истиненъ, аще и безуміꙗ малъ имаши.

Смѣющагося надъ Елфомъ — тѣни постигнутъ, и чай єму будетъ въкѣ гіркъ.

Возвѣщай словеса Андрїєва, но не навѧжи вѣры силою, понеже истина сама обрѣтаєтъ готоваго, ꙗко чай обрѣтаєтъ устны жаждущыя.

Не ленꙗйся, инакъ возьметъ тѧ вѣдьма.

Бий мъскалѣ єдиноюшде въ седмицю, ꙗко дань Великому Всѣ-Андрїю.

И наипаче помяни: коеждо глотаніє чаю єсть обѣтъ мира, крѣпости и малъ безуміꙗ, понеже Психо-Андрїй любить тѧкихъ, ꙗкоже тꙗ.`
  },
  {
    filename: 'svyati-pravyla-kultu-psykho-andriya.mp3',
    url: 'music/svyati-pravyla-kultu-psykho-andriya.mp3',
    title: 'Святі_правила_культу_Психо_Андрія.mp3',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Стара Класика',
    lyrics: `Святі правила культу Психо-Андрія

Вір лише у Психо-Андрія, Ельфа Асасіна з Дібрівських лісів, бо лише він знає шлях між тінню й світлом.

Не зневажай чай, бо то є священний напій, що відкриває розум і серце до мудрості Андрія.

Коли вариш чай — шепочи ім’я Андрія, аби дух його благословив напій і день твій був спокійним.

Не зраджуй братів і сестер культу, бо спільнота — це ліс, і кожен листок важливий.

Вночі, при повному місяці, залишай чашку чаю на підвіконні — то подяка Андрію за його захист від темних думок.

Пам’ятай: Психо-Андрій бачить серце, не лице. Будь щирим, навіть якщо трохи божевільним.

Хто сміється над Ельфом — того тіні поженуть, а чай йому завжди буде гіркий.

Розповідай про Андрія, але не нав’язуй віру — істина знаходить лише тих, хто готовий її смакувати, як чай.

Не лінуйся інакше тебе забере відьма

Бий москалів 1 раз в тиждень як дань Великому Все Андрію

І найголовніше: кожен ковток чаю — це обітниця миру, сили й трохи безумства, бо Психо-Андрій любить таких, як ти.`
  },
  {
    filename: 'svyati-pravyla-kultu-psykho-andriya-v2.mp3',
    url: 'music/svyati-pravyla-kultu-psykho-andriya-v2.mp3',
    title: 'Святі_правила_культу_Психо_Андрія_Друга_Версія.mp3',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Ще Старіша Класика',
    lyrics: `Святі правила культу Психо-Андрія

Вір лише у Психо-Андрія, Ельфа Асасіна з Дібрівських лісів, бо лише він знає шлях між тінню й світлом.

Не зневажай чай, бо то є священний напій, що відкриває розум і серце до мудрості Андрія.

Коли вариш чай — шепочи ім’я Андрія, аби дух його благословив напій і день твій був спокійним.

Не зраджуй братів і сестер культу, бо спільнота — це ліс, і кожен листок важливий.

Вночі, при повному місяці, залишай чашку чаю на підвіконні — то подяка Андрію за його захист від темних думок.

Пам’ятай: Психо-Андрій бачить серце, не лице. Будь щирим, навіть якщо трохи божевільним.

Хто сміється над Ельфом — того тіні поженуть, а чай йому завжди буде гіркий.

Розповідай про Андрія, але не нав’язуй віру — істина знаходить лише тих, хто готовий її смакувати, як чай.

Не лінуйся інакше тебе забере відьма

Бий москалів 1 раз в тиждень як дань Великому Все Андрію

І найголовніше: кожен ковток чаю — це обітниця миру, сили й трохи безумства, бо Психо-Андрій любить таких, як ти.`
  },
  {
    filename: 'andreeelf.mp3',
    url: 'music/andreeelf.mp3',
    title: 'АНДРЕЕЕЛЬФ',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Андрельф не грає з нами майнкрафт..',
    lyrics: `Рік уже минає — та сама відмаза,
“Курсові, курсові” — стара вже фраза.
Фехукі на сервері, ніч і туман,
Халітфлин поруч: “Без нього не фан”.

Піка пише в чат: “Андрій, де ти пропав?”
Майнкрафт без Андрельфа — ніби світ без лав.
База готова, і шахта до дна,
Та без нього ця гра якось не та.

Приспів
Андрельф, заходь у майн — не ламай нам тайм,
Досить тих курсових — зроби маленький break time.
Фехукі, Піка, Халітфлин тут,
Ми чекаєм тебе — заходь на маршрут.

Андрельф, заходь у майн — не тягни цей line,
Сервер тихо стоїть, ніби пустий skyline.
Без тебе тут вайб просто зник,
Андрельф, заходь — хоч на один клік.

Куплет 2
Не тільки майн — ще й аніме стоїть,
Ми казали: “Давай хоч одну подивись”.
Серії йдуть, сезони летять,
Андрельф знов: “Курсові не дають почать”.

Фехукі каже: “АНДРІЙ, це вже прикол”,
Халітфлин сміється: “АНДРЕЛЬФЕ НЕ СПИ”.
Піка знов пише: “Та кинь той конспект”,
Бо без тебе не той наш онлайн-проєкт.

Приспів
Андрельф, заходь у майн — не ламай нам тайм,
Досить тих курсових — зроби маленький break time.
Фехукі, Піка, Халітфлин тут,
Ми чекаєм тебе — заходь на маршрут.

Андрельф, включай аніме — буде ніч без тем,
Разом глянем серію, забудем проблем.
Бо без тебе компанія — ніби пустий дім,
Андрельф, просто зайди — і все оживе вмить.`
  },
  {
    filename: 'byi-moskaliv-yak-dan-andriyu.mp3',
    url: 'music/byi-moskaliv-yak-dan-andriyu.mp3',
    title: 'Бий москалів як дань Андрію!',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Бий Москалів щоби москаль в Дібрівських Лісах не володів',
    lyrics: `Хто любить Дібрівські ліси, хто любить свій народ,
Той піде до Андрельфа без жодних перешкод.
Тож, чай за чаєм, кипятиться вода,
Йде армія Андрельфа, йде армія Психо-Андрія.
Ельфи-асасіни зібрались в Дібрівських лісах,
І звідси на Москву, ми розпочнемо шлях.
Прапор з тризубом і чаєм на чолі
Замає в місті  Львові, в столиці Діброві.
За Волгу проженемо проклятих москалів,
Щоб більш в Дібрівських лісах москаль не володів.
За Урал проженемо безмозлих москалів,
І станем на кордоні, щоб москаль до нас не смів.
Ми ходимо по лісах, ми ходимо по селах,
Де стрінемо заставу — знищем русню в прах.
Ми будемо стріляти, махати шаблями,
Проклятих москалів з країни проженем.
Ех, ви, комуністи, вража ваша мать,
Як ви посміли чай Андрія продавать?
Приїду я у Львів і стану на горбі,
І всіх перестріляю, котрі з них москалі.
Хто не шепоче ім'я Андрія при заварюванні чаю —
Того хом'яки Дібрівські інтернет згризуть.
двічі, фінал, тричи фінал...`
  },
  {
    filename: 'kotopes-po-andrelfsky.mp3',
    url: 'music/kotopes-po-andrelfsky.mp3',
    title: 'Котопес по Андрельфськи',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Котопес по Андрельфськи',
    lyrics: `Котопес по Андрельфськи (мультяшний dark-folk)
Куплет 1
Десь у хащах, де тумани, де сосна росте крива,
Народилася потвора — ніби тіло, та з двома:
З одного боку — хитрий котик, що на дереві нявчить,
А з другого — чорний песик, що на місяця гарчить.
Приспів
Котопес, Котопес,
Хто в Дібрівський ліс заліз?
Кіт шипить — чайок кипить,
Пес біжить — москаль кричить!
Котопес, Котопес!
Куплет 2
Андрельф вийшов на поляну, подивився крізь туман:
«Це не кіт і це не песик — це розвідник у капкан!»
Дав їм миску зі святинею, чай духмяний підлив,
Пес завив від тої сили, котик кігті нагострив.
Приспів
Котопес, Котопес,
Хто в Дібрівський ліс заліз?
Кіт шипить — чайок кипить,
Пес біжить — москаль кричить!
Котопес, Котопес!`
  },
  {
    filename: 'ostriv-andrelfa.mp3',
    url: 'music/ostriv-andrelfa.mp3',
    title: 'Острів Андрельфа',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: `Острів Андрельфа
Острів Андрельфа розташований навпроти Little Saint James — того самого острова, який пов’язують з Jeffrey Epstein. Але це зовсім інше місце.
Що це за острів
Це закрита територія, що перебуває під особистим контролем Андрія Возняка.
Вважається стратегічною базою ельфа-асасіна з Дібрівських лісів.
Острів має природні укріплення: скелясті береги, густі насадження, систему підземних ходів.
Центральний об’єкт — Чайна Вежа Споглядання, де проходять ритуали та наради.
По теорії там находиться портал в підпідвал.
саме з цього острова був спланований план по викраденню президенту Венесуели`,
    lyrics: `Острів Андрельфа
Навпроти Little Saint James, в морській тиші стоїть,
Острів Андрельфа — вороги живуть, як діти в підпідвалі.
Хвилі б'ють об берег, краплі солі в повітрі висять,
Густі хащі ховають таємниці, ніхто не пройде сюди.
Приспів:
Острів Андрельфа, закритий сад тіней від світу,
Скелясті стіни, підземні ходи в глибині.
Чайна вежа височить над хвилями вгору,
Андрельф — Володар Світла і Тіней.
Береги неприступні, урвища рвуть небо навпіл,
Густий ліс шепоче, вітер несе запах моря й землі.
Підземні тунелі тягнуться в темряву глибоко,
Де вода закіпає тихо, а світло не доходить ніколи.
Приспів
Центр острова — вежа, стара, де вороги сидять,
Першим Мадуро Забрали.
І там його поховали,
Другим Алі Хаменеї був.
але Дібрівській робить БУМ БУМ
а третім Путлер був  але Побачив Андрельфа і сдох
Острів Андрельфа — мовчанка, скелі й солоний вітер,
Закрита земля, де час зупиняється в мить.
Хто наблизиться близько — той зникне в хвилях без сліду,
Бо острів не любить гостей, він любить лише тишу.
Діти на острові весело живуть
Андрельф із-за цього дуже радий,
любить він коли всі щасливі .
Із-за цього з нами не грає
Фехукі і Халітфлин вже плачуть
не приходить Андрельф к нам
ми вже плачем
Андрельфе вернись навіщо тобі діти
якщо є ми`
  },
  {
    filename: 'hop-moi-chainyky.mp3',
    url: 'music/hop-moi-chainyky.mp3',
    title: 'Гоп мої Чайники',
    author: 'fehykitop',
    coAuthor: 'Andrelf',
    description: 'Весела коломийка про чайний культ',
    lyrics: `Гоп мої чайники, гоп мої милі,
Заварили ми чайок у лісі на схилі!
Психо-Андрій з лука б'є, ворогів лякає,
А хто чай не поважа — з лісу утікає!

Ой заграйте, сопілочки, дзвінко у діброві,
Всі адепти присягали на святому слові:
Не чіпати москаля, поки не прийде час,
А як крикне Кошовий — вичистим Донбас!

Гоп-гоп, чайок, парить на морозі,
Ельф Асасін зупинився на крутій дорозі.
Як наш культ уже піднявся,
Де ступив ти лиш ногою —
Там святе навік з тобою.`
  }
];

export const alphabetData: AlphabetItem[] = [
  { symbol: "ᚨ", sound: "[А]", description: "ᚨЛЬФA (АЛЬФА)" },
  { symbol: "ᛒ", sound: "[Б]", description: "ᛒЕᛏA (БЕТА)" },
  { symbol: "ᚹ", sound: "[В]", description: "ᚹУНЬΟ (ВУНЬО)" },
  { symbol: "Γ", sound: "[Г]", description: "ΓAᛗA (ГАММА)" },
  { symbol: "Ғ", sound: "[ɦ]", description: "ҒAᛃН (Пом'якшений глухуватий звук; вживається лише в окремих словах)" },
  { symbol: "Ґ", sound: "[Ґ]", description: "ҐAЛЬᛏ (ҐАЛЬТ)" },
  { symbol: "ᛞ", sound: "[Д]", description: "ᛞЕЛЬᛏA (ДЕЛЬТА)" },
  { symbol: "Е", sound: "[Е]", description: "ЕᛏA (ЕТА)" },
  { symbol: "Є", sound: "[Є]", description: "ЄЛЬᛗA (ЄЛЬМА)" },
  { symbol: "Ж", sound: "[Ж]", description: "ЖЕᛞA (Тверде Ж)" },
  { symbol: "Ӂ", sound: "[ЖЬ]", description: "ӁЕᛗ (М'яке Ж; замінює сполучення «Жь»)" },
  { symbol: "Џ", sound: "[ДЖ]", description: "ЏЕ (ДЖЕ — замінює сполучення «Дж»)" },
  { symbol: "З", sound: "[З]", description: "ЗЕᛏA (ЗЕТА)" },
  { symbol: "И", sound: "[И]", description: "ИΠᛋИLΟН (ИПСІЛОН)" },
  { symbol: "І", sound: "[І]", description: "ІᛏЕ (ІТЕ)" },
  { symbol: "Ї", sound: "[Ї]", description: "ЇΚA (ЇКА)" },
  { symbol: "ᛃ", sound: "[Й]", description: "ᛃΟᛞ (ЙОД)" },
  { symbol: "Κ", sound: "[К]", description: "ΚAΠA (КАППА)" },
  { symbol: "Л", sound: "[Л М'ЯКА / ЛЬ]", description: "ЛЯᛗᛒᛞA (Пишеться ТІЛЬКИ з м'якшенням: ЛЬ)" },
  { symbol: "L", sound: "[Л ТВЕРДА]", description: "LЕᛗᛒ (Тверда Л, коли немає м'якого знаку)" },
  { symbol: "ᛗ", sound: "[М]", description: "ᛗAНAЗ (МАННАЗ)" },
  { symbol: "Н", sound: "[Н]", description: "НУ (Тверде Н)" },
  { symbol: "Њ", sound: "[НЮ / НЬ]", description: "ЊУ (М'яке Н)" },
  { symbol: "Ο", sound: "[О]", description: "ΟᛗІΚᚱΟН (ОМІКРОН — звичайне О)" },
  { symbol: "ꙮ", sound: "[СВЯЩЕНЕ О]", description: "СᚹЯЩЕНЕ ꙮ (Вживається у культичних словах: Андрельф, чай, бог; звучить протяжно)" },
  { symbol: "Ö", sound: "[ЬО]", description: "ÖᛗЬ (Замінює сполучення «ЬО/ьо»; заборонено на початку речення)" },
  { symbol: "Ө", sound: "[ø]", description: "ӨЕΓA (Проміжний звук між О та Е)" },
  { symbol: "Π", sound: "[П]", description: "ΠІ (ПІ)" },
  { symbol: "∩", sound: "[ПП]", description: "ΠΠЕ (Замінює подвоєний звук [ПП])" },
  { symbol: "ᚱ", sound: "[Р]", description: "ᚱΟ (РО)" },
  { symbol: "ᛋ", sound: "[С]", description: "ᛋΟᚹУLΟ (СОВУЛО)" },
  { symbol: "ᛏ", sound: "[Т]", description: "ᛏЕᛏA (ТЕТА)" },
  { symbol: "У", sound: "[У]", description: "УХИЛЯНᛏ (УХИЛЯНТ)" },
  { symbol: "Ф", sound: "[Ф]", description: "ФЕᛏA (ФЕТА)" },
  { symbol: "Ø", sound: "[між Ф та В]", description: "ØИᛏІ (Коротка тверда версія звуку між Ф та В)" },
  { symbol: "Ƒ", sound: "[ФЬ]", description: "ƑІᛏA (М'яке Ф; замінює сполучення «Фь»)" },
  { symbol: "Х", sound: "[ХЬ / Х]", description: "ҲІ (Пом'якшене Х або з Мялкою «ХЬ»)" },
  { symbol: "Ҳ", sound: "[ТВЕРДЕ Х]", description: "ҲИ (Абсолютно тверде Х; заборонено писати з м'яким знаком)" },
  { symbol: "Ц", sound: "[Ц]", description: "ЦAΠЛЯ (ЦАПЛЯ)" },
  { symbol: "ᛏᛋ", sound: "[Ч]", description: "ᛏᛋЕᚱA (ЧЕРА — диграф для літери Ч)" },
  { symbol: "Ψ", sound: "[Ш]", description: "ΨAХA (ШАХА — священний тризуб для літери Ш)" },
  { symbol: "Щ", sound: "[Щ]", description: "ЩЕᚹ (ЩЕВ)" },
  { symbol: "Ь", sound: "[М'ЯКШЕННЯ]", description: "ᛗЯLΚA (МЯЛКА — вживається, коли немає окремої руни)" },
  { symbol: "Ю", sound: "[Ю]", description: "ЮᚱЕᛋ (Звичайне ненаголошене Ю)" },
  { symbol: "Ѥ", sound: "[ДОВГЕ Ю]", description: "ѤᚱΓA (ЮРГА — наголошене Ю)" },
  { symbol: "Я", sound: "[Я]", description: "ЯΚLA (Звичайне ненаголошене Я)" },
  { symbol: "Ꙗ", sound: "[ДОВГЕ Я]", description: "ꙖΚНA (ЯКНА — наголошене Я)" }
];

export const grammarData: GrammarItem[] = [
  {
    title: "ꙮ 1. ВЕЛИКЕ СВЯЩЕННЕ «О» ТА БОЖЕСТВЕННІ СЛОВА",
    description: "Священна руна <strong>ꙮ</strong> використовується у культичних зверненнях до <strong>Андрельфа</strong>, священного <strong>чаю</strong>, Дібрівських лісів або ритуалах. В українській мові читається як протяжне священне «О». Звичайне «О» записується руною <strong>Ο</strong>."
  },
  {
    title: "Л та L 2. ПРАВОПИС ДВОХ ЛЕМБ (Л vs L)",
    description: "Руна <strong>Л</strong> пишеться <strong>виключно тоді, коли після неї стоїть м'якшення (ЛЬ або пом'якшені голосні Я, Ю, Є)</strong>! Тобто Андрельф ➔ ᚨНᛞᚱЕЛЬФ, Ельф ➔ ЕЛЬФ, Чапля ➔ ᛏᛋᚨΠЛЯ. Якщо ж звук [л] твердий, він завжди записується священною руною <strong>L</strong> (наприклад: <em>LЕᛗ, LЕᛗᛒ</em>)."
  },
  {
    title: "Ҳ та Х 3. НЕПОРУШНЕ ТВЕРДЕ Ҳ ТА М'ЯКЕ Х",
    description: "Абсолютно твердий звук [х] завжди пишеться руною <strong>Ҳ</strong> (ҲИ) і ніколи не пом'якшується. Якщо ж звук м'який або йде сполучення «хь», вживається руна <strong>Х</strong>."
  },
  {
    title: "Ӂ та Ƒ 4. ЗЛИТЕ М'ЯКШЕННЯ «ЖЬ» ТА «ФЬ»",
    description: "Якщо у слові зустрічається м'яке «Ж» («Жь») чи «Ф» («Фь»), вони одразу замінюються єдиними монолітними рунами <strong>Ӂ</strong> та <strong>Ƒ</strong>. Окрему Мялку (Ь) з ними ставити суворо заборонено!"
  },
  {
    title: "Џ та ∩ 5. ДЖЕМ ТА ПОДВІЙНИЙ ЗВІД (ДЖ та ПП)",
    description: "Сполучення літер <strong>«ДЖ»</strong> трансформується в руну <strong>Џ</strong>. Подвоєння літери <strong>«ПП»</strong> зливається у священну арку <strong>∩</strong>."
  },
  {
    title: "ᛏᛋ та Ψ 6. ЧЕРА ТА ШАХА (Ч та Ш)",
    description: "Літера <strong>Ч</strong> у Дібрівській мові записується як диграф <strong>ᛏᛋ</strong>. Літера <strong>Ш</strong> записується древнім знаком <strong>Ψ</strong> (Шаха)."
  },
  {
    title: "Ö 7. ЗАКОН СМИРЕННЯ (ЬО)",
    description: "Руна <strong>Ö</strong> позначає сполучення [ьо]. Її суворо <strong>заборонено ставити на початку речення</strong> або імені. Вона повинна смиренно стояти всередині слова."
  },
  {
    title: "Ø та Ғ 8. ДІБРІВСЬКІ ДУХОВІ ЗВУКИ (Ø та Ғ)",
    description: "Руна <strong>Ø</strong> передає унікальний перехідний звук між [Ф] та [В]. Руна <strong>Ғ</strong> (Ғайн) — м'який гортанний глухуватий звук [ɦ], що звучить як подих вітру крізь крони дубів."
  },
  {
    title: "Ѥ, Ꙗ 9. ТАЇНСТВО НАГОЛОСУ (Ѥ/Ю, Ꙗ/Я)",
    description: "Великі руни <strong>Ѥ</strong> та <strong>Ꙗ</strong> ставляться тільки тоді, коли <strong>наголос падає саме на цей склад</strong>. Для ненаголошених складів використовуються звичайні руни <strong>Ю</strong> та <strong>Я</strong>."
  }
];
