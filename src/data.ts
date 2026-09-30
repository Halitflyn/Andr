// Auto-generated data file for Andrelf Cult Website
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
  "Вір лише у Психо-Андрія, Ельфа Асасіна з Дібрівських лісів, бо лише він знає шлях між тінню й світлом.",
  "Не зневажай <span class=\"tea-trigger whisper-anchor\">чай<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Рідина мудрості\"</span><span class=\"tea-steam\">♨</span></span>, бо то є священний напій, що відкриває розум і серце до мудрості Андрія.",
  "Коли вариш <span class=\"tea-trigger whisper-anchor\">чай<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Шепоти його ім'я\"</span><span class=\"tea-steam\">♨</span></span> — шепочи ім’я Андрія, аби дух його благословив напій і день твій був спокійним.",
  "Не зраджуй братів і сестер культу, бо спільнота — це ліс, і кожен листок важливий.",
  "Вночі, при повному місяці, залишай чашку <span class=\"tea-trigger whisper-anchor\">чаю<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Для Духа Лісу\"</span><span class=\"tea-steam\">♨</span></span> на підвіконні — то подяка Андрію за його захист від темних думок.",
  "Пам’ятай: Психо-Андрій бачить серце, не лице. Будь щирим, навіть якщо трохи божевільним.",
  "Хто сміється над Ельфом — того тіні поженуть, а <span class=\"tea-trigger whisper-anchor\">чай<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Гіркий, як доля ворогів\"</span><span class=\"tea-steam\">♨</span></span> йому завжди буде гіркий.",
  "Розповідай про Андрія, але не нав’язуй віру — істина знаходить лише тих, хто готовий її смакувати, як <span class=\"tea-trigger whisper-anchor\">чай<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Смак просвітлення\"</span><span class=\"tea-steam\">♨</span></span>.",
  "Не лінуйся інакше тебе забере відьма.",
  "Бий москалів 1 раз в тиждень як дань Великому Все Андрію.",
  "І найголовніше: кожен ковток <span class=\"tea-trigger whisper-anchor\">чаю<span class=\"whisper-text\" style=\"top: -30px; left: 50%; transform: translateX(-50%);\">\"Обітниця вірності\"</span><span class=\"tea-steam\">♨</span></span> — це обітниця миру, сили й трохи безумства, бо Психо-Андрій любить таких, як ти."
];

export const tracksData: Track[] = [
  {
    filename: "pidpidvalie.mp3",
    title: "ПідПідвальє",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Піддідвал сидів там я, Гавк і Нікітг",
    url: "music/pidpidvalie.mp3",
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
            "words": [
                  {
                        "word": "\"Пісня",
                        "duration": 1.34
                  },
                  {
                        "word": "про",
                        "duration": 0.67
                  },
                  {
                        "word": "підпідвал",
                        "duration": 2.01
                  },
                  {
                        "word": "Андрельфа\"",
                        "duration": 2.24
                  }
            ],
            "startTime": 0,
            "text": "\"Пісня про підпідвал Андрельфа\"",
            "id": "cue_0_1790804120800",
            "endTime": 6.26
      },
      {
            "id": "cue_1_1790804120801",
            "words": [
                  {
                        "duration": 0.48,
                        "word": "Десь"
                  },
                  {
                        "word": "під",
                        "duration": 0.25
                  },
                  {
                        "word": "лісом,",
                        "duration": 0.49
                  },
                  {
                        "word": "під",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.31,
                        "word": "корінням,"
                  },
                  {
                        "word": "де",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.27,
                        "word": "й"
                  },
                  {
                        "word": "вовки",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.27,
                        "word": "вже"
                  },
                  {
                        "duration": 0.27,
                        "word": "не"
                  },
                  {
                        "word": "гулять,",
                        "duration": 0.27
                  }
            ],
            "startTime": 24.57,
            "text": "Десь під лісом, під корінням, де й вовки вже не гулять,",
            "endTime": 27.99
      },
      {
            "endTime": 30.88,
            "id": "cue_2_1790804120801",
            "text": "Є підпідвал Андрельфа — там не люблять розмовлять.",
            "words": [
                  {
                        "word": "Є",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "підпідвал"
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "—"
                  },
                  {
                        "duration": 0.35,
                        "word": "там"
                  },
                  {
                        "duration": 0.35,
                        "word": "не"
                  },
                  {
                        "word": "люблять",
                        "duration": 0.35
                  },
                  {
                        "word": "розмовлять.",
                        "duration": 0.35
                  }
            ],
            "startTime": 28
      },
      {
            "text": "Там двері скриплять хрипко, наче зона в нічний час,",
            "endTime": 34,
            "startTime": 30.88,
            "id": "cue_3_1790804120801",
            "words": [
                  {
                        "duration": 0.35,
                        "word": "Там"
                  },
                  {
                        "word": "двері",
                        "duration": 0.35
                  },
                  {
                        "word": "скриплять",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "хрипко,"
                  },
                  {
                        "duration": 0.35,
                        "word": "наче"
                  },
                  {
                        "duration": 0.35,
                        "word": "зона"
                  },
                  {
                        "word": "в",
                        "duration": 0.35
                  },
                  {
                        "word": "нічний",
                        "duration": 0.35
                  },
                  {
                        "word": "час,",
                        "duration": 0.35
                  }
            ]
      },
      {
            "text": "І чай кипить у казані — не чайок, а спецнаказ.",
            "endTime": 37.11,
            "startTime": 34,
            "words": [
                  {
                        "duration": 0.31,
                        "word": "І"
                  },
                  {
                        "duration": 0.31,
                        "word": "чай"
                  },
                  {
                        "word": "кипить",
                        "duration": 0.31
                  },
                  {
                        "duration": 0.31,
                        "word": "у"
                  },
                  {
                        "duration": 0.31,
                        "word": "казані"
                  },
                  {
                        "word": "—",
                        "duration": 0.31
                  },
                  {
                        "word": "не",
                        "duration": 0.31
                  },
                  {
                        "word": "чайок,",
                        "duration": 0.31
                  },
                  {
                        "duration": 0.31,
                        "word": "а"
                  },
                  {
                        "word": "спецнаказ.",
                        "duration": 0.31
                  }
            ],
            "id": "cue_4_1790804120801"
      },
      {
            "text": "Підпідвал, підпідвал — там не кожен доповзав,",
            "startTime": 37.11,
            "endTime": 40.25,
            "id": "cue_5_1790804120801",
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 0.85
                  },
                  {
                        "duration": 0.71,
                        "word": "підпідвал"
                  },
                  {
                        "duration": 0.1,
                        "word": "—"
                  },
                  {
                        "duration": 0.34,
                        "word": "там"
                  },
                  {
                        "duration": 0.38,
                        "word": "не"
                  },
                  {
                        "word": "кожен",
                        "duration": 0.38
                  },
                  {
                        "word": "доповзав,",
                        "duration": 0.38
                  }
            ]
      },
      {
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
                        "duration": 0.34
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
            ],
            "id": "cue_6_1790804120801",
            "startTime": 40.09,
            "text": "Там Фехукі першим сидів мов тінь,  і давно вже все пізнав.",
            "endTime": 43.37
      },
      {
            "words": [
                  {
                        "duration": 0.28,
                        "word": "Там"
                  },
                  {
                        "word": "чай",
                        "duration": 0.28
                  },
                  {
                        "word": "не",
                        "duration": 0.28
                  },
                  {
                        "word": "просто",
                        "duration": 0.28
                  },
                  {
                        "word": "чай",
                        "duration": 0.28
                  },
                  {
                        "word": "—",
                        "duration": 0.28
                  },
                  {
                        "duration": 0.28,
                        "word": "то"
                  },
                  {
                        "duration": 0.28,
                        "word": "вирок,"
                  },
                  {
                        "word": "суд",
                        "duration": 0.28
                  },
                  {
                        "duration": 0.28,
                        "word": "і"
                  },
                  {
                        "duration": 0.28,
                        "word": "страх,"
                  }
            ],
            "endTime": 46.53,
            "id": "cue_7_1790804120801",
            "text": "Там чай не просто чай — то вирок, суд і страх,",
            "startTime": 43.42
      },
      {
            "endTime": 50.27,
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "startTime": 46.53,
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 0.76
                  },
                  {
                        "duration": 0.76,
                        "word": "Андрельфа"
                  },
                  {
                        "word": "—",
                        "duration": 0.1
                  },
                  {
                        "word": "не",
                        "duration": 0.3
                  },
                  {
                        "duration": 0.76,
                        "word": "курорт"
                  },
                  {
                        "word": "для",
                        "duration": 0.3
                  },
                  {
                        "duration": 0.76,
                        "word": "слабаків."
                  }
            ],
            "id": "cue_8_1790804120801"
      },
      {
            "words": [
                  {
                        "duration": 0.33,
                        "word": "Фехукі"
                  },
                  {
                        "word": "втік",
                        "duration": 0.33
                  },
                  {
                        "duration": 0.33,
                        "word": "и"
                  },
                  {
                        "duration": 0.33,
                        "word": "біжить"
                  },
                  {
                        "duration": 0.33,
                        "word": "—"
                  },
                  {
                        "word": "ніби",
                        "duration": 0.33
                  },
                  {
                        "duration": 0.33,
                        "word": "бачить"
                  },
                  {
                        "duration": 0.33,
                        "word": "всі"
                  },
                  {
                        "duration": 0.33,
                        "word": "гріхи,"
                  }
            ],
            "id": "cue_9_1790804120801",
            "endTime": 55.96,
            "startTime": 53.02,
            "text": "Фехукі втік и біжить — ніби бачить всі гріхи,"
      },
      {
            "words": [
                  {
                        "duration": 0.32,
                        "word": "Каже:"
                  },
                  {
                        "duration": 0.48,
                        "word": "“Більше"
                  },
                  {
                        "word": "не",
                        "duration": 0.48
                  },
                  {
                        "duration": 0.48,
                        "word": "повернуся"
                  },
                  {
                        "duration": 0.48,
                        "word": "в"
                  },
                  {
                        "duration": 0.48,
                        "word": "підпідвал….”"
                  }
            ],
            "endTime": 58.68,
            "text": "Каже: “Більше не повернуся в підпідвал….”",
            "id": "cue_10_1790804120801",
            "startTime": 55.96
      },
      {
            "words": [
                  {
                        "word": "Гавк-дварф",
                        "duration": 0.56
                  },
                  {
                        "word": "бурчить",
                        "duration": 0.56
                  },
                  {
                        "word": "тихенько,",
                        "duration": 0.56
                  },
                  {
                        "duration": 0.56,
                        "word": "борода"
                  },
                  {
                        "word": "як",
                        "duration": 0.56
                  },
                  {
                        "word": "дріт,",
                        "duration": 0.56
                  }
            ],
            "endTime": 62.18,
            "id": "cue_11_1790804120801",
            "startTime": 58.81,
            "text": "Гавк-дварф бурчить тихенько, борода як дріт,"
      },
      {
            "words": [
                  {
                        "word": "“Я",
                        "duration": 0.31
                  },
                  {
                        "duration": 0.31,
                        "word": "бачив"
                  },
                  {
                        "word": "ад",
                        "duration": 0.31
                  },
                  {
                        "word": "і",
                        "duration": 0.31
                  },
                  {
                        "duration": 0.31,
                        "word": "бачив"
                  },
                  {
                        "duration": 0.31,
                        "word": "рай…"
                  },
                  {
                        "duration": 0.31,
                        "word": "але"
                  },
                  {
                        "word": "тут",
                        "duration": 0.31
                  },
                  {
                        "word": "страшніший",
                        "duration": 0.31
                  },
                  {
                        "word": "світ.”",
                        "duration": 0.31
                  }
            ],
            "startTime": 62.18,
            "text": "“Я бачив ад і бачив рай… але тут страшніший світ.”",
            "endTime": 65.25,
            "id": "cue_12_1790804120801"
      },
      {
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 0.7
                  },
                  {
                        "duration": 0.7,
                        "word": "підпідвал"
                  },
                  {
                        "word": "—",
                        "duration": 0.05
                  },
                  {
                        "word": "там",
                        "duration": 0.3
                  },
                  {
                        "duration": 0.2,
                        "word": "не"
                  },
                  {
                        "word": "кожен",
                        "duration": 0.5
                  },
                  {
                        "word": "доповзав,",
                        "duration": 0.63
                  }
            ],
            "text": "Підпідвал, підпідвал — там не кожен доповзав,",
            "startTime": 65.25,
            "endTime": 68.28,
            "id": "cue_13_1790804120801"
      },
      {
            "words": [
                  {
                        "word": "Там",
                        "duration": 0.34
                  },
                  {
                        "duration": 0.34,
                        "word": "Гавк"
                  },
                  {
                        "word": "сидить,не",
                        "duration": 0.34
                  },
                  {
                        "duration": 0.34,
                        "word": "грає"
                  },
                  {
                        "duration": 0.34,
                        "word": "вже"
                  },
                  {
                        "word": "рік,",
                        "duration": 0.34
                  },
                  {
                        "word": "і",
                        "duration": 0.34
                  },
                  {
                        "duration": 0.34,
                        "word": "він"
                  },
                  {
                        "word": "давно",
                        "duration": 0.34
                  },
                  {
                        "duration": 0.34,
                        "word": "смирився."
                  }
            ],
            "text": "Там Гавк сидить,не грає вже рік, і він давно смирився.",
            "startTime": 68.28,
            "endTime": 71.69,
            "id": "cue_14_1790804120801"
      },
      {
            "id": "cue_15_1790804120801",
            "endTime": 74.61,
            "words": [
                  {
                        "duration": 0.25,
                        "word": "Там"
                  },
                  {
                        "duration": 0.25,
                        "word": "чай"
                  },
                  {
                        "duration": 0.25,
                        "word": "не"
                  },
                  {
                        "duration": 0.25,
                        "word": "просто"
                  },
                  {
                        "word": "чай",
                        "duration": 0.25
                  },
                  {
                        "word": "—",
                        "duration": 0.25
                  },
                  {
                        "word": "то",
                        "duration": 0.25
                  },
                  {
                        "duration": 0.25,
                        "word": "вирок,"
                  },
                  {
                        "duration": 0.25,
                        "word": "суд"
                  },
                  {
                        "duration": 0.25,
                        "word": "і"
                  },
                  {
                        "duration": 0.25,
                        "word": "страх,"
                  }
            ],
            "startTime": 71.83,
            "text": "Там чай не просто чай — то вирок, суд і страх,"
      },
      {
            "words": [
                  {
                        "duration": 0.7,
                        "word": "Підпідвал"
                  },
                  {
                        "duration": 0.7,
                        "word": "Андрельфа"
                  },
                  {
                        "word": "—",
                        "duration": 0.1
                  },
                  {
                        "duration": 0.25,
                        "word": "не"
                  },
                  {
                        "word": "курорт",
                        "duration": 0.5
                  },
                  {
                        "duration": 0.25,
                        "word": "для"
                  },
                  {
                        "word": "слабаків.",
                        "duration": 0.82
                  }
            ],
            "endTime": 80.78,
            "id": "cue_16_1790804120801",
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "startTime": 75.16
      },
      {
            "startTime": 80.78,
            "endTime": 82.37,
            "id": "cue_17_1790804120801",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.42
                  },
                  {
                        "word": "раптом",
                        "duration": 0.42
                  },
                  {
                        "word": "кроки…",
                        "duration": 0.42
                  }
            ],
            "text": "І раптом кроки…"
      },
      {
            "text": "Тиша така, що аж зуби зводить…",
            "id": "cue_18_1790804120801",
            "endTime": 85.27,
            "startTime": 82.37,
            "words": [
                  {
                        "duration": 0.47,
                        "word": "Тиша"
                  },
                  {
                        "duration": 0.47,
                        "word": "така,"
                  },
                  {
                        "duration": 0.47,
                        "word": "що"
                  },
                  {
                        "duration": 0.47,
                        "word": "аж"
                  },
                  {
                        "duration": 0.47,
                        "word": "зуби"
                  },
                  {
                        "word": "зводить…",
                        "duration": 0.47
                  }
            ]
      },
      {
            "words": [
                  {
                        "duration": 0.68,
                        "word": "Десь"
                  },
                  {
                        "word": "згори",
                        "duration": 0.68
                  },
                  {
                        "duration": 0.68,
                        "word": "скрипить"
                  },
                  {
                        "duration": 0.68,
                        "word": "підлога…"
                  }
            ],
            "startTime": 87.51,
            "text": "Десь згори скрипить підлога…",
            "id": "cue_19_1790804120801",
            "endTime": 90.23
      },
      {
            "words": [
                  {
                        "duration": 0.75,
                        "word": "Наче"
                  },
                  {
                        "word": "смерть",
                        "duration": 0.75
                  },
                  {
                        "word": "повзком",
                        "duration": 0.75
                  },
                  {
                        "word": "приходить…",
                        "duration": 0.75
                  }
            ],
            "id": "cue_20_1790804120801",
            "endTime": 94.39,
            "startTime": 91.41,
            "text": "Наче смерть повзком приходить…"
      },
      {
            "startTime": 95.84,
            "id": "cue_21_1790804120801",
            "text": "І заходить Андрельф строго — без “привіт” і без “добра”,",
            "words": [
                  {
                        "word": "І",
                        "duration": 0.32
                  },
                  {
                        "word": "заходить",
                        "duration": 0.32
                  },
                  {
                        "duration": 0.32,
                        "word": "Андрельф"
                  },
                  {
                        "word": "строго",
                        "duration": 0.32
                  },
                  {
                        "word": "—",
                        "duration": 0.32
                  },
                  {
                        "duration": 0.32,
                        "word": "без"
                  },
                  {
                        "word": "“привіт”",
                        "duration": 0.32
                  },
                  {
                        "duration": 0.32,
                        "word": "і"
                  },
                  {
                        "duration": 0.32,
                        "word": "без"
                  },
                  {
                        "word": "“добра”,",
                        "duration": 0.32
                  }
            ],
            "endTime": 99.06
      },
      {
            "id": "cue_22_1790804120801",
            "words": [
                  {
                        "duration": 0.37,
                        "word": "Погляд"
                  },
                  {
                        "word": "як",
                        "duration": 0.37
                  },
                  {
                        "word": "ніж",
                        "duration": 0.37
                  },
                  {
                        "duration": 0.37,
                        "word": "у"
                  },
                  {
                        "duration": 0.37,
                        "word": "печінку,"
                  },
                  {
                        "duration": 0.37,
                        "word": "усмішка"
                  },
                  {
                        "duration": 0.37,
                        "word": "як"
                  },
                  {
                        "word": "піввідра.",
                        "duration": 0.37
                  }
            ],
            "endTime": 102.05,
            "startTime": 99.06,
            "text": "Погляд як ніж у печінку, усмішка як піввідра."
      },
      {
            "endTime": 105.27,
            "text": "В руках тримає чай, ніби золото в руках,",
            "id": "cue_23_1790804120801",
            "words": [
                  {
                        "duration": 0.4,
                        "word": "В"
                  },
                  {
                        "duration": 0.4,
                        "word": "руках"
                  },
                  {
                        "duration": 0.4,
                        "word": "тримає"
                  },
                  {
                        "word": "чай,",
                        "duration": 0.4
                  },
                  {
                        "word": "ніби",
                        "duration": 0.4
                  },
                  {
                        "duration": 0.4,
                        "word": "золото"
                  },
                  {
                        "duration": 0.4,
                        "word": "в"
                  },
                  {
                        "word": "руках,",
                        "duration": 0.4
                  }
            ],
            "startTime": 102.05
      },
      {
            "words": [
                  {
                        "word": "І",
                        "duration": 0.1
                  },
                  {
                        "word": "каже:",
                        "duration": 0.34
                  },
                  {
                        "word": "“Хто",
                        "duration": 0.34
                  },
                  {
                        "word": "тут",
                        "duration": 0.34
                  },
                  {
                        "duration": 0.34,
                        "word": "живий"
                  },
                  {
                        "duration": 0.34,
                        "word": "ще?"
                  },
                  {
                        "duration": 0.34,
                        "word": "Ну"
                  },
                  {
                        "word": "шо,",
                        "duration": 0.34
                  },
                  {
                        "word": "підпишем",
                        "duration": 0.34
                  },
                  {
                        "word": "контракт?”",
                        "duration": 0.34
                  }
            ],
            "endTime": 108.43,
            "id": "cue_24_1790804120801",
            "startTime": 105.27,
            "text": "І каже: “Хто тут живий ще? Ну шо, підпишем контракт?”"
      },
      {
            "endTime": 111.55,
            "startTime": 108.63,
            "words": [
                  {
                        "duration": 0.27,
                        "word": "Гавк"
                  },
                  {
                        "duration": 0.27,
                        "word": "мовчить"
                  },
                  {
                        "duration": 0.27,
                        "word": "як"
                  },
                  {
                        "word": "камінь",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.27,
                        "word": "—"
                  },
                  {
                        "word": "не",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.27,
                        "word": "герой,"
                  },
                  {
                        "word": "але",
                        "duration": 0.27
                  },
                  {
                        "word": "й",
                        "duration": 0.27
                  },
                  {
                        "word": "не",
                        "duration": 0.27
                  },
                  {
                        "duration": 0.27,
                        "word": "лох,"
                  }
            ],
            "id": "cue_25_1790804120801",
            "text": "Гавк мовчить як камінь — не герой, але й не лох,"
      },
      {
            "startTime": 111.55,
            "endTime": 115.01,
            "text": "А Гавк стискає кулаки, бо тут Андрельф — це бог.",
            "words": [
                  {
                        "word": "А",
                        "duration": 0.35
                  },
                  {
                        "word": "Гавк",
                        "duration": 0.35
                  },
                  {
                        "word": "стискає",
                        "duration": 0.35
                  },
                  {
                        "word": "кулаки,",
                        "duration": 0.35
                  },
                  {
                        "word": "бо",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "тут"
                  },
                  {
                        "word": "Андрельф",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "—"
                  },
                  {
                        "duration": 0.35,
                        "word": "це"
                  },
                  {
                        "word": "бог.",
                        "duration": 0.35
                  }
            ],
            "id": "cue_26_1790804120801"
      },
      {
            "text": "Бо в підпідвалі Андрельфа час іде як по поняттях,",
            "endTime": 117.93,
            "startTime": 115.01,
            "id": "cue_27_1790804120801",
            "words": [
                  {
                        "duration": 0.32,
                        "word": "Бо"
                  },
                  {
                        "duration": 0.32,
                        "word": "в"
                  },
                  {
                        "word": "підпідвалі",
                        "duration": 0.32
                  },
                  {
                        "duration": 0.32,
                        "word": "Андрельфа"
                  },
                  {
                        "duration": 0.32,
                        "word": "час"
                  },
                  {
                        "word": "іде",
                        "duration": 0.32
                  },
                  {
                        "duration": 0.32,
                        "word": "як"
                  },
                  {
                        "duration": 0.32,
                        "word": "по"
                  },
                  {
                        "duration": 0.32,
                        "word": "поняттях,"
                  }
            ]
      },
      {
            "startTime": 126.99,
            "words": [
                  {
                        "word": "Підпідвал,",
                        "duration": 1
                  },
                  {
                        "duration": 0.6,
                        "word": "підпідвал"
                  },
                  {
                        "duration": 0.1,
                        "word": "—"
                  },
                  {
                        "word": "це",
                        "duration": 0.37
                  },
                  {
                        "word": "не",
                        "duration": 0.37
                  },
                  {
                        "duration": 0.37,
                        "word": "хата,"
                  },
                  {
                        "word": "це",
                        "duration": 0.37
                  },
                  {
                        "word": "фінал,",
                        "duration": 0.37
                  }
            ],
            "endTime": 130.54,
            "id": "cue_29_1790804120801",
            "text": "Підпідвал, підпідвал — це не хата, це фінал,"
      },
      {
            "endTime": 133.36,
            "words": [
                  {
                        "duration": 0.35,
                        "word": "нова"
                  },
                  {
                        "duration": 0.35,
                        "word": "дитина"
                  },
                  {
                        "word": "Нікітг",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "сидить"
                  },
                  {
                        "duration": 0.35,
                        "word": "зі"
                  },
                  {
                        "duration": 0.35,
                        "word": "страхом,"
                  },
                  {
                        "word": "а",
                        "duration": 0.35
                  },
                  {
                        "duration": 0.35,
                        "word": "Гавк"
                  },
                  {
                        "duration": 0.35,
                        "word": "тримає"
                  },
                  {
                        "word": "метал.",
                        "duration": 0.35
                  }
            ],
            "id": "cue_30_1790804120801",
            "startTime": 129.91,
            "text": "нова дитина Нікітг сидить зі страхом, а Гавк тримає метал."
      },
      {
            "words": [
                  {
                        "duration": 0.29,
                        "word": "Там"
                  },
                  {
                        "duration": 0.29,
                        "word": "чай"
                  },
                  {
                        "duration": 0.29,
                        "word": "як"
                  },
                  {
                        "duration": 0.29,
                        "word": "ритуал"
                  },
                  {
                        "duration": 0.29,
                        "word": "—"
                  },
                  {
                        "word": "і",
                        "duration": 0.29
                  },
                  {
                        "duration": 0.29,
                        "word": "печать"
                  },
                  {
                        "duration": 0.29,
                        "word": "на"
                  },
                  {
                        "word": "всіх",
                        "duration": 0.29
                  },
                  {
                        "duration": 0.29,
                        "word": "шляхах,"
                  }
            ],
            "startTime": 133.36,
            "endTime": 137.08,
            "text": "Там чай як ритуал — і печать на всіх шляхах,",
            "id": "cue_31_1790804120801"
      },
      {
            "text": "Підпідвал Андрельфа — легендарний темний страх.",
            "id": "cue_32_1790804120801",
            "endTime": 140.47,
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 0.7
                  },
                  {
                        "duration": 0.7,
                        "word": "Андрельфа"
                  },
                  {
                        "word": "—",
                        "duration": 0.1
                  },
                  {
                        "duration": 0.6,
                        "word": "легендарний"
                  },
                  {
                        "duration": 0.4,
                        "word": "темний"
                  },
                  {
                        "duration": 0.89,
                        "word": "страх."
                  }
            ],
            "startTime": 137.08
      },
      {
            "text": "Якщо чай тобі налили — значить ти вже не чужий…",
            "endTime": 148.5,
            "startTime": 142.65,
            "words": [
                  {
                        "duration": 0.66,
                        "word": "Якщо"
                  },
                  {
                        "duration": 0.49,
                        "word": "чай"
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
                        "duration": 0.16,
                        "word": "—"
                  },
                  {
                        "duration": 1.15,
                        "word": "значить"
                  },
                  {
                        "duration": 0.33,
                        "word": "ти"
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
            ],
            "id": "cue_34_1790804120801"
      },
      {
            "endTime": 155.41,
            "startTime": 149.44,
            "words": [
                  {
                        "duration": 0.18,
                        "word": "А"
                  },
                  {
                        "duration": 0.8,
                        "word": "якщо"
                  },
                  {
                        "duration": 0.5,
                        "word": "не"
                  },
                  {
                        "word": "налили…",
                        "duration": 1.1
                  },
                  {
                        "duration": 1,
                        "word": "значить"
                  },
                  {
                        "word": "ти",
                        "duration": 0.37
                  },
                  {
                        "duration": 0.55,
                        "word": "вже"
                  },
                  {
                        "word": "неживий.",
                        "duration": 1.47
                  }
            ],
            "id": "cue_35_1790804120801",
            "text": "А якщо не налили… значить ти вже неживий."
      },
      {
            "startTime": 156.47,
            "text": "Якщо чай тобі налили — значить ти вже не чужий…",
            "words": [
                  {
                        "word": "Якщо",
                        "duration": 0.68
                  },
                  {
                        "word": "чай",
                        "duration": 0.9
                  },
                  {
                        "word": "тобі",
                        "duration": 0.72
                  },
                  {
                        "word": "налили",
                        "duration": 1.02
                  },
                  {
                        "word": "—",
                        "duration": 0.18
                  },
                  {
                        "word": "значить",
                        "duration": 0.9
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
            ],
            "endTime": 163.08,
            "id": "cue_1790804494601"
      },
      {
            "words": [
                  {
                        "word": "А",
                        "duration": 0.8
                  },
                  {
                        "word": "якщо",
                        "duration": 1
                  },
                  {
                        "word": "не",
                        "duration": 0.4
                  },
                  {
                        "word": "налили…",
                        "duration": 1
                  },
                  {
                        "word": "значить",
                        "duration": 0.9
                  },
                  {
                        "word": "ти",
                        "duration": 0.5
                  },
                  {
                        "word": "вже",
                        "duration": 0.8
                  },
                  {
                        "word": "неживий.",
                        "duration": 1.81
                  }
            ],
            "id": "cue_1790804510303",
            "endTime": 173.69,
            "text": "А якщо не налили… значить ти вже неживий.",
            "startTime": 162.9
      },
      {
            "id": "cue_1790804556432",
            "startTime": 177.68,
            "endTime": 180.68,
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
            "endTime": 183.69,
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
            ],
            "text": "Там Фехукі першим сидів мов тінь,  і давно вже все пізнав.",
            "id": "cue_1790804565547",
            "startTime": 180.68
      },
      {
            "endTime": 184.3,
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
            ],
            "startTime": 183.92,
            "id": "cue_1790804731598",
            "text": "Там чай не просто чай — то вирок, суд і страх,"
      },
      {
            "text": "Підпідвал Андрельфа — не курорт для слабаків.",
            "endTime": 190.02,
            "id": "cue_1790804740669",
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
            ],
            "startTime": 186.88
      },
      {
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
            ],
            "endTime": 193.52,
            "startTime": 190.02,
            "text": "Підпідвал, підпідвал — це не хата, це фінал,",
            "id": "cue_1790804783147"
      },
      {
            "endTime": 196.13,
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
            ],
            "startTime": 193.52,
            "text": "нова дитина Нікітг сидить зі страхом, а Гавк тримає метал.",
            "id": "cue_1790804882993"
      },
      {
            "endTime": 199.63,
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
            ],
            "text": "Там чай як ритуал — і печать на всіх шляхах,",
            "id": "cue_1790804887145",
            "startTime": 196.13
      },
      {
            "endTime": 204.29,
            "id": "cue_1790804935815",
            "words": [
                  {
                        "word": "Підпідвал",
                        "duration": 0.9
                  },
                  {
                        "word": "Андрельфа",
                        "duration": 0.8
                  },
                  {
                        "word": "—",
                        "duration": 0.1
                  },
                  {
                        "word": "легендарний",
                        "duration": 1
                  },
                  {
                        "word": "темний",
                        "duration": 1.1
                  },
                  {
                        "word": "страх.",
                        "duration": 0.76
                  }
            ],
            "text": "Підпідвал Андрельфа — легендарний темний страх.",
            "startTime": 199.63
      },
      {
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
            ],
            "startTime": 210.38,
            "text": "\"Тихо як сансон\"",
            "id": "cue_1790804975079",
            "endTime": 212.11
      },
      {
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
            ],
            "endTime": 216.23,
            "id": "cue_1790805023502",
            "startTime": 213.59
      },
      {
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
            ],
            "endTime": 118.41,
            "id": "cue_1790805071581",
            "startTime": 219.78
      },
      {
            "id": "cue_1790806904100",
            "startTime": 118.41,
            "endTime": 120.29,
            "text": "Тут навіть тінь боїться тіні",
            "words": [
                  {
                        "word": "Тут",
                        "duration": 0.37
                  },
                  {
                        "word": "навіть",
                        "duration": 0.74
                  },
                  {
                        "word": "тінь",
                        "duration": 0.5
                  },
                  {
                        "word": "боїться",
                        "duration": 0.87
                  },
                  {
                        "word": "тіні",
                        "duration": 0.5
                  }
            ]
      },
      {
            "id": "cue_1790806972393",
            "startTime": 120.29,
            "endTime": 123.94,
            "text": "і сидить на своїх лапах",
            "words": [
                  {
                        "word": "і",
                        "duration": 0.13
                  },
                  {
                        "word": "сидить",
                        "duration": 0.79
                  },
                  {
                        "word": "на",
                        "duration": 0.26
                  },
                  {
                        "word": "своїх",
                        "duration": 0.66
                  },
                  {
                        "word": "лапах",
                        "duration": 0.66
                  }
            ]
      }
]
  },
  {
    filename: "dark-folk-andrelf.mp3",
    title: "Дарк Фолк про Андрельфа",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Дарк Фолк про ПСИХО АНДРІЯЯЯ",
    url: "music/dark-folk-andrelf.mp3",
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
    filename: "andrelf-vernys.mp3",
    title: "Андрельф Вернись",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Братан Це Репчик",
    url: "music/andrelf-vernys.mp3",
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
    filename: "andrelf-kozak-dibrivskyi.mp3",
    title: "Андрельф козак Дібрівський",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Лє Шансон про Андрельфський Закон",
    url: "music/andrelf-kozak-dibrivskyi.mp3",
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
    filename: "vsi-spokoyu-shyro-prahnut.mp3",
    title: "Всі спокою щиро прагнуть",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Дібрівська Дума(чуть-чуть початок від Івана Мазепи)",
    url: "music/vsi-spokoyu-shyro-prahnut.mp3",
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
    filename: "za-sotku-smert-nam-ne-strashna.mp3",
    title: "За сотку смерть нам не страшна! не страшна!",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Не пора! Не пора! Дібрівська Вдохновління!.",
    url: "music/za-sotku-smert-nam-ne-strashna.mp3",
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
    filename: "svatynia.mp3",
    title: "Сватиня",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Староцерквянська ТОП",
    url: "music/svatynia.mp3",
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
    filename: "svyati-pravyla-kultu-psykho-andriya.mp3",
    title: "Святі_правила_культу_Психо_Андрія.mp3",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Стара Класика",
    url: "music/svyati-pravyla-kultu-psykho-andriya.mp3",
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
    filename: "svyati-pravyla-kultu-psykho-andriya-v2.mp3",
    title: "Святі_правила_культу_Психо_Андрія_Друга_Версія.mp3",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Ще Старіша Класика",
    url: "music/svyati-pravyla-kultu-psykho-andriya-v2.mp3",
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
    filename: "andreeelf.mp3",
    title: "АНДРЕЕЕЛЬФ",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Андрельф не грає з нами майнкрафт..",
    url: "music/andreeelf.mp3",
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
    filename: "byi-moskaliv-yak-dan-andriyu.mp3",
    title: "Бий москалів як дань Андрію!",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Бий Москалів щоби москаль в Дібрівських Лісах не володів",
    url: "music/byi-moskaliv-yak-dan-andriyu.mp3",
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
    filename: "kotopes-po-andrelfsky.mp3",
    title: "Котопес по Андрельфськи",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Одного разу, невідомо коли,На світі з'явився ці малі.Схожі вони були на кота і на пса.Усі дивувались, усі посміхались.",
    url: "db://Котопес по Андрельфськи",
    lyrics: `У Дібрівських лісах, де дуби — це батьки,
Де чай закипає, міняючи віки,
Виходить на лови загін бойовий,
Кіт Андрельфа — чорний, дібрівській хитрий.
Він знає кунг-фу, він тримає боксерський гард,
У карате він майстер, у карате він — авангард.
Його кігті — як Кабачок, його погляд — це Андрельф,
Він полюбить тебе, як солоденький Ельф.


Кіт і Пес — два боки однієї межі,
Охороняють Підвал на гострій ножі!
Кіт б’є з розвороту, вогнепал у лапах блищить,
А Пес... [ДАНІ ЗАСЕКРЕЧЕНО], всесвіт тремтить!
Чай розливається, конопляний нектар,
Це армія Андрія — небесний удар!

А про Пса не кажи, бо затерто в архівах,
Він — таємна зоря у космічних розривах.
Чотири рази «ЗАСЕКРЕЧЕНО» в його досьє,
Він бачить крізь час все, що було і є.
Якщо Пес гавкне — впаде Вавилон,
Він — тиха загроза, він — вічний заслон.
Навіть Привид від страху пішов у світи,
Бо з Псом Андрельфа не можна на «ти».


У підпідваллі чути м’який крок,
Кіт чистить гвинтівку, даючи урок.
Він знає всі стилі — захисні та їстівні,
Його вороги вже давно у труні.
А Пес за спиною — невидима тінь,
Засекречена міць поколінь і видінь.

Вони бережуть конопляні поля,
Де чай виростає, де квітне земля.
Краб-термінатор віддає їм салют,
Хом’яки-диверсанти пошану несуть.
Якщо ти москаль — то краще тікай,
Бо Кіт вже зняв запобіжник, це край.
А Пес... Пес просто є. І цього досить,
Щоб кожен відчув, що смерть уже косить.


Чай без цукру. Ніж у шкарпетці.
Андрельф у кожному серці.
Андрельф — це закон і вогонь,
Світ у надійних лапах і долонь.
(Шепотом: Дані засекречено... дані засекречено...)`
  },
  {
    filename: "ostriv-andrelfa.mp3",
    title: "Острів Андрельфа",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Острів Андрельфа\nОстрів Андрельфа розташований навпроти Little Saint James — того самого острова, який пов’язують з Jeffrey Epstein. Але це зовсім інше місце.\nЩо це за острів\nЦе закрита територія, що перебуває під особистим контролем Андрія Возняка.\nВважається стратегічною базою ельфа-асасіна з Дібрівських лісів.\nОстрів має природні укріплення: скелясті береги, густі насадження, систему підземних ходів.\nЦентральний об’єкт — Чайна Вежа Споглядання, де проходять ритуали та наради.\nПо теорії там находиться портал в підпідвал.\nсаме з цього острова був спланований план по викраденню президенту Венесуели",
    url: "music/ostriv-andrelfa.mp3",
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
    filename: "hop-moi-chainyky.mp3",
    title: "Гоп мої Чайники",
    author: "fehykitop та Діти",
    coAuthor: "Andrelf",
    description: "Народна пісня дітей в Підвалі",
    url: "db://Гоп мої Чайники",
    lyrics: `Прийшов Халітфлин у Діскорд —
А там, як завжди, пусто,
Ні Андрельфа, ні Піки —
Лиш Фехукі сумно в чаті грустно.
Приспів:
Гоп! Дібрівські гравці,
Білоруські спецназівці,
Дібровці й українці — братки,
А москалі — дурники.
Позбирались у Діскорді
Старі воїни в розмові,
Будем чай ми заваряти,
Свій порядок наставляти.
Нема Андрельфа — нема щастя,
Він знов не піде граться,
Ні майнкрафта, ні Терарії —
Лиш спить у своїй стихії.
Андрельф в чаті — всі у шоці,
Та зникає через кроки,
Не грати він йде —
Чай священний береже.
Хочем щастя! Хочем грати!
Не збираємось ми спати!
Будем майн разом рубать,
І орків дружно вбивать.
"Я дитина в підпідвалі —
Мене звідти вже забрали",
"Тепер маю я роботу —
Збираю чайну коноплю”.
Сидить ельф той на пеньку,
З чаєм теплим у горнятку,
Каже: “Довго я прожив —
Андрельф всіх нас захистив”.
Працювали цілий день —
Ліс гудів від тих пісень,
Як лиш пар піде з котла —
Сила чаю ожила.
Подивися сам тепер,
Як працює підпідвал,
Бо Андрельф своїх людей
Не кидає поміж скал.
Ой, гоп! Ти тільки глянь —
Андрельф зайшов у Діскорд зрань,
Трохи скаже — і зникає,
Знов тихенько засинає.
Прийди, Андрельфе, подивися,
Як наш культ уже піднявся,
Де ступив ти лиш ногою —
Там святе навік з тобою.`
  },
  {
    filename: "SnIaXyCA4Ndji9upIddk",
    title: "Магія з Андрельфом",
    author: "Halitflyn",
    coAuthor: "Andrelf",
    description: "Щастливічаси з Андрельфом, Фехукі, Халітфлином та Пікою",
    url: "db://Магія з Андрельфом",
    lyrics: `Другий курс, ми стали друзями з тобою,
На третьому я таємницю привідкрив.
Скептичний погляд Андрельфа: «Що за мана?»
А я нитками долі світ навколо шив.
Щоб не іти на пари, нам щастило, 
«Магія удачі» — так ми це звали тоді. Слова зривались, і усе раділо, 
Коли тривоги звук ховав нас від нудьги.
Тільки поглянемо й скажем: «Додому!» І відміняється пара умить.
Ми грали в Майнкрафт, не знаючи втоми, З Фехукі і Пікою час так летить. 
То були добрі, найкращі часи, Магія коледжу, дружба і ми.
Йшли з третьої пари, на четверту не хтіли
Погляди збіглись, і слово злетіло одно. «Додому!» — сказали в ідеальній синергії,
І завуч назустріч: «Все скасовано давно! Всіх попередьте і в актовий зал!»
Це був наш спільний магічний фінал.
Або як вчителька їхати мала до нас, А дерево впало на авто в той самий час.
Я пропонував тобі ману: «Візьми, відчувай!» А ти: «Ні-ні-ні, це підозріло, сховай». Ми мрія`
  },
  {
    filename: "Rki7H7MyopUbJAROfd8g",
    title: "Корона дурня",
    author: "Halitflyn",
    coAuthor: "Andrelf",
    description: "Його звали Дирень.....",
    url: "db://Корона дурня",
    lyrics: `Колись... у минулому житті, я був Андрієм Возняком.

Звичайний світ, звичайні дні... Усе пішло прахом.

Ритуал Удачі Аметистового мага затягнув мене сюди.

Нове тіло. Нова доля. Новий час... І жодних кроків назад.

Перші секунди мого пекла, я пролетів по дулу пістолета,

Навколо невідомі послідовності, контроль втрачає ця планета.

Я будував свій Пантеон, збирав Лабораторні по кусках,

Стискаючи залишки волі у підліткових кулаках.

Але фінал... мене просто зламав, розірвав цей зв'язок,

Мене вбили. Холодна рука, кров на бруківці запеклась у пісок.

Вони думали, це кінець. Що моя гра урвалась!

Але смерть для мене — це просто зміна масок.

Я обдумав усе в тумані, серед тисячі доль і поразок.

Я піднімаюся з могили, попіл струшую з плечей,

Нове ім'я. Нова сила. Погляд диких очей.

Я більше не той, ким я був досі!

Нехай вороги тремтять, я стою на краю!

Кличте мене дУууурень! Саме дУрень, не Шут!

Над сірим туманом я вершитиму суд!

Я — Андрельф Дібрівський! Повстав із руїн,

І взагалі я Пацифіст, але в серці — брутальний дзвін!

Перший етап моєї історії пройшов...

Тепер я — дУууурень *(протяжно)*, що свій новий шлях знайшов!

Вони святкували перемогу, думали, що я згас,

Але Андрельф повернувся, і тепер мій час.

Андрій Возняк помер ще там, на Землі,

Дібрівський Андрій лишив тіло в кривавій золі.

Тепер я Андрельф. Сплетіння магії й таємних сил,

Я обдумав кожен крок тих, хто мене вбити хотів.

Цей світ не вартий світла, в ньому надто багато злого,

Тому я стану його володарем — чорного і золотого.

Уламки минулого падають вниз, наче бите скло,

Я бачу крізь темряву все, що колись тут було.

Послідовності сплелися, карти лягають у ряд,

Час повернути контроль. Немає шляху назад.

Я більше не той, ким я був досі!

Нехай вороги тремтять, я стою на краю!

Кличте мене дУууурень! Саме дУрень, не Шут!

Над сірим туманом я вершитиму суд!

Я — Андрельф Дібрівський! Повстав із руїн,

І взагалі я Пацифіст, але в серці — брутальний дзвін!

Перший етап моєї історії пройшов...

Тепер я — дУууурень *(протяжно)*, що свій новий шлях знайшов!

Возняк... Дібрівський... Андрельф...

Скільки імен вміщує одна душа?

Смерть забрала моє минуле, не лишивши ні гроша.

Але я повернувся. Андрельф Дібрівський тут.

Я обдумав усе. І мій вирок — це абсолют.

Запам'ятай це ім'я — Андрельф.

І наголос... правильний наголос...

Я — дУуууууурень...`
  },
  {
    filename: "RhzNLEOFSGvFaPt3bUyL",
    title: "Лопата сильніша",
    author: "Halitflyn",
    coAuthor: "Andrelf",
    description: "Як Андрельф будовав свою імперію в іншому світі",
    url: "db://Лопата сильніша",
    lyrics: `[Verse 1]

Зачекайте, я хто взагалі? 

Андрельф Дібрівський? Ви при своєму розумі?

Потрапив у вежу з купою проблем,

З боргами, податками і без жодних змін!

Але в минулому житті я інженером був,

Про бідність назавжди тепер я забув!

Поки дурні орки сходять всі з ума,

Я зводжу нові міста геть чисто з нуля! 



[Chorus]

Я — Андрельф Дібрівський, шалений геній,

І лопата сильніша за будь-які битви! 

Поки інші мріють лише про славу,

Я будую міцну, грандіозну державу! 

Навіть відьма дивиться з подивом диким,

Як міняю цей світ я рухом великим!

І якщо є гроші — все можна створити,

Навіть власну долю наново переписати! 



[Verse 2]

Орки працюють усю ніч без упину,

А граф знов обдирає бідну людину. 

Монстри, дракони — мені все одно,

Головне, щоб за все заплатили воно!

Нехай кажуть навколо, що я повний дурень,

Без мене розвалиться світ серед бурень. 

Якщо знову зненацька прийде біда,

Кабачок я свій першим схоплю тоді, да!

Навіть якщо я раптом потраплю в пекло,

Я і там збудую все стильно і тепло. 

Поки є золото, камінь і цемент —

Для Андрія неможливих речей немає в момент!



[Chorus]

Я — Андрельф Дібрівський, шалений геній,

І лопата сильніша за будь-які битви! 

Поки інші мріють лише про славу,

Я будую міцну, грандіозну державу!

Навіть відьма дивиться з подивом диким,

Як міняю цей світ я рухом великим!

І якщо є гроші — все можна створити,

Навіть власну долю наново переписати!



[Guitar Solo - Fast and Driving]



[Chorus]

Я — Андрельф Дібрівський, шалений геній,

І лопата сильніша за будь-які битви!

Поки інші мріють лише про славу,

Я будую міцну, грандіозну державу!

Навіть відьма дивиться з подивом диким,

Як міняю цей світ я рухом великим!

І якщо є гроші — все можна створити,

Навіть власну долю наново переписати!



[Outro]

Yeah! Для Андрія перешкод немає!

[End]`
  },
  {
    filename: "Qscud6oEIeNrey0ZdiIf",
    title: "Хом'як Дібрівській і краб термінатор різкий",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Пісня про кінець війни між хом'яками та крабами-термінаторами",
    url: "db://Хом'як Дібрівській і краб термінатор різкий",
    lyrics: `Ой у лісах Дібрівських, де туман стелиться долом,
Де чай священний парує над ельфійським столом,
Живе й ходить між тінями Андрій Возняк —
Ельф-асасін, що знає і тишу, і буряк.

Ой не просто то ліс, і не просто трава —
Там кожен листок його коноплю впізна.
Там хом’яки Дібрівські, військо мале,
Гризуть інтернет, мов сухе галуззя старе.

А головний Хом’як — Дібрівський зветься,
Перед Андрієм низько вклониться й сміється:
«Ми гриземо дроти, бо така нам путь,
Щоб світ від шуму міг трохи заснуть».

Ой кабелі тріщать під зубами ,
Вежі мовчать над полями широкими.
Люди не знають, хто чинить це діло,
Андрій же бачить — і сміється сміливо.

Та з морських глибин, з холодної сталі
Вийшли Краби-Термінатори — важкі й безжалі.
Клешні їх — мов сокири крицеві,
Очі — як вогні нічні й лукаві.

«Хто смів порушити порядок земний?
Хто гризе мережі й спокій людський?» —
Гримлять вони голосом хвиль і машин,
Та стають перед Андрієм, бо він тут один.

Бо тільки його слово в Діброві закон,
І навіть метал перед ним — мов картон.
Поглянув він тихо — і краби зупинились,
Клешні опустили, мов грози скінчились.

А в тій же порі, між кущами густими,
Білочки бродять стежками невидимими.
Їх бачить лише Андрій після чаю,
І ловить їх швидко, мов тінь у тумані.

Ой ті білочки — духи Дібрівські,
Їх не впіймає ні звір, ні людинин.
Та в його руках вони тихо дрімають,
Бо тільки йому себе відкривають.

А ще літає над лісом стара
Муха-Цокотуха — лісова господиня жива.
Не з казки дитячої, а з дібровної сили,
Що стежить, щоб рівновагу не знищили.

Ой став Андрій між хом’яком і крабом,
Між сталлю холодною й сірим загарбом.
І мовив спокійно, без крику й грози:
«Не буде війни серед цієї лози.

Хом’яки — гризіть, та з розумом гризіть,
Краби — порядок тримайте, та мир бережіть.
Бо ліс — то не поле для вічної січі,
А місце сили, тиші й величі».

І стали вони під його знаменом,
Хом’яки — розвідкою, краби — кордоном.
Білочки шепочуть йому про біду,
А Муха-Цокотуха кружляє в меду.

Так в Дібрівських лісах встановився закон:
Андрій Возняк — то вітер і трон.
І поки він ходить стежками нічними —
Живуть хом’яки, і краби, й істоти незримі.`
  },
  {
    filename: "DIY63rzDG0I3gsXWYNpa",
    title: "Курсова",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Сповідь Андрельфа",
    url: "db://Курсова",
    lyrics: `Привіт, вибачте, будь ласка, що не зможу з вами говорити, бо в мене завтра екзамен я не можу робити дві дії одночасно і говорити і готуватись до екзамена, якщо вас то виходить я за вас дуже радий, але я не знаю як Вас то виходить, тому, якщо то не щось термінове то давайте поговоримо після екзамену ще раз вибачте грати я зможу тільки після сесії і ще раз вибачте, бо в мене два екзамена для яких треба писати конспект`
  },
  {
    filename: "KgvAJj80wG0lKyVQhWxI",
    title: "Хроніки крові й чаю",
    author: "fehykitop",
    coAuthor: "Andrelf",
    description: "Коротко про пост-золотий вік лору Андрельфа",
    url: "db://Хроніки крові й чаю",
    lyrics: `Йо, це не казка, це хроніки крові й чаю,

Я лор Андрельфа від початку й до кінця зачитаю.

Від Дібрівських лісів до львівських дахів,

Слухай історію, що вище за богів!

Він був створений «Чорним» — безсмертний атлант,

Він у кожному світі — головний варіант.

Він крокує крізь виміри, він вічний студент,

Його сила — це космосу нищівний фундамент.

Та він тримає в узді свій внутрішній жах,0.000000000001% — і світ не розсиплеться в прах!

Його батьки — Дуби, древні й могутні,

Вони тримають корінням ліси незабутні.

Він не п’є цукор, він магію чаю шукав,

Він вище за все, що ти знав чи бажав!

(Verse 2: Арсенал та Домен)

Тридцять ножів — у шкарпетках, у рамі, всюди,

Він спить із ровером, на заздрість всім людям.

Легендарний лом Кабачок у руці —

Тремтіть, вороги, і старі, і юнці!48 технік розминки — ламається спина,

Якщо ти москаль — то це твоя остання хвилина.

В Японії гуляв, конопляний чай пив,

Автор «Магічної битви» там очі відкрив:

Годжо, Сукуна, Панда — це копії слабкі,

Бо Андрельф має домен — «ПІДПІДВАЛЬЄ» на віки!

Це Пан-Андрельфізм — ідеологія й влада,

Москалям щотижня — від культу розрада (УДАР!).

Чай — це закон, В.Д.Л. — це наш дім,

Ми йдемо за Андрієм крізь попіл і дим!

Психо-Андрій — Ельф-Асасін із тіней,

Він бачить твій дух серед тисяч очей!

Фехукі та Халітфлин заклали фундамент,

Культ Психо-Андрія — це вічний регламент.

Фехукі пройшов крізь іспит підвалу,

Він вірний адепт, він не знає втоми й завалу.

Халітфлин поруч — аметистовий маг,

Удача в руках, і розвіяний страх.

А поруч і Піка — сестра Фехукі,

Вона інтернет тримає в залізній руці.

Бо головний хом’як — Дібрівський (Дипломна),

Тепер її звір, чия лють невимовна!

Навпроти Епштейна, у водах чужих,

Стоїть Острів Андрія — фортеця для своїх.

Там Чайна Вежа, там план викрадення зрів,

Президент Венесуели там майже здурів.

Там портал у Підпідвал, там секрети густі,

Там ВДЛ воскресає у всій чистоті.

Львів — це осередок, це база сучасна,

Де ідея Дібрівська сіяє незгасно!

Під будинком — Підвал, іспит на виживання,

Там діти й істоти проходять навчання.

Там дварф Гавк сидить, що раніше там був,

А тепер і Нікітг туди в гості прибув.

Друг Фехукі, дитина, що знає секрет,

Як потрапити в Підпідвал — у вищий намет.

Там речі Андрія, там сила німа,

Хто пройшов цей іспит — для того межа нема!

Краби-Термінатори море вартують,

Москалів на шматки без жалю шматують.

Армія хом’яків інтернет перегризе,

Якщо хтось на Андрія не те щось скаже.Муха Цокотуха — ручний авіатор,Кіт Андрія — кунг-фу майстер і термінатор.

Дані по псу — засекречені вщент,

А привид Баам — білоруський агент.

Він сотку шукає, він у Вежі загинув,

Але друга Андрія він не покинув.

Жінка — Терка (Дерґа), відьма і жах,

Прокляття несе на ворожих кістках.

Сестра Ерка — таємна, Емілія — теж,

Ця родина не знає кордонів і меж!

(Verse 7: Святі Закони)

Слухай правила, сину, і їх не ламай:


Тільки Андрій — Ельф-Асасін, це пам’ятай.

Чай не зневажай — це мудрості сік.

Шепочи його ім’я, коли вариш, у бік.

Братів не зраджуй — ми ліс, ми одне.

Чашку на вікно — хай зло тебе мине.

Будь щирим, будь психом — Андрій це цінує.

Бий москалів щотижня — це дань,

За велику свободу і чайну гортань!

Кожен ковток — це сила й безумство,

Психо-Андрій любить твоє вольнодумство.`
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
    title: "Правило Економії літер (Автоматичне пом'якшення)",
    description: "Якщо у літери є готовий м'який відповідник в алфавіті, використовувати м'який знак (Ь / Мялку) суворо заборонено. М'яка літера вже сама в собі містить м'якшення.\nЯк правильно: Пишемо однією літерою — Ӂ (замість Жь), Њ (замість Нь), Ƒ (замість Фь)"
  },
  {
    title: "Правило Залишку для Мялки (Ь)",
    description: "Символ Ь (Мялка) використовується тільки як рятівний варіант для тих літер, які залишилися без власної м'якої пари.\nПринцип: Літери на кшталт Х, Ц, ᛏ, ᛒ не мають окремих м'яких аналогів у таблиці. Тільки у поєднанні з ними ти використовуєш Ь, якщо треба пом'якшити звук"
  },
  {
    title: "Тверді Літери",
    description: "В алфавіті є літери,які фізіологічно не можуть бути м'якими: це Ҳ (Абсолютно тверде Х) та Ѳ (Між Ф та В)\nПравило: Поруч із ними Мялка (Ь) не може стояти за жодних обставин. Бачиш ці літери — склад автоматично стає твердим, без винятків"
  },
  {
    title: "Фонетичний наголос (Для Ю та Я)",
    description: "Тут граматика повністю підлаштовується під твою вимову. Тобі не треба вчити правила орфографії, достатньо просто послухати, як ти говориш слово\nНаголос падає на цей склад? Пишемо довгі літери: Ꙗ або Ѥ\nНаголосу немає (склад вимовляється швидко)? Пишемо звичайні: Я або Ю"
  },
  {
    title: "Позиційне табу для Ö",
    description: "Звук Ö [ЬО] технічно вимагає попереднього приголосного, на який спирається м'якість, тому він фізично не може відкривати слово\nПравило: На початку слова Ö писати заборонено. Якщо слово починається на О-подібний звук, це завжди буде або звичайна Ο, або культова ꙮ"
  }
];
