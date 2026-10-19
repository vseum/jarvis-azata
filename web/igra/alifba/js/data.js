"use strict";
/* Арабские буквы для «Алиф-Ба». Русские названия — как в русских учебниках «Каида» (тяжёлые буквы через «о»: Сод, Дод, То, Зо).
   name — арабское название с огласовками; snd — как звучит (для голоса и подсказки родителю);
   pic — мнемоника из предметов (живых существ не рисуем); word — слово-пример из Корана/быта: [арабский, по-русски, ключ картинки];
   join — соединяется ли со следующей буквой (6 «гордых» букв + хамза — нет); sun — солнечная буква (для аль-, уровень 5). */
const LETTERS = [
  { id: "alif",  ch: "ا", name: "أَلِف", ru: "Алиф",  snd: "без огласовки молчит — держит гласный звук", pic: "прямая палочка, как столбик", word: ["أَرْض", "земля", "earth"], join: false, sun: false },
  { id: "ba",    ch: "ب", name: "بَاء", ru: "Ба",    snd: "«б»", pic: "лодочка, а под днищем одна точка", word: ["بَيْت", "дом", "house"], join: true, sun: false },
  { id: "ta",    ch: "ت", name: "تَاء", ru: "Та",    snd: "«т»", pic: "лодочка, сверху две точки — две капельки", word: ["تِين", "инжир", "fig"], join: true, sun: true },
  { id: "tha",   ch: "ث", name: "ثَاء", ru: "Са",    snd: "«с», кончик языка между зубами", pic: "лодочка, сверху три точки — три звёздочки", word: ["ثَمَر", "плоды", "fruit"], join: true, sun: true },
  { id: "jim",   ch: "ج", name: "جِيم", ru: "Джим",  snd: "«дж»", pic: "крючок, а внутри точка — как семечко в ложке", word: ["جَبَل", "гора", "mountain"], join: true, sun: false },
  { id: "hha",   ch: "ح", name: "حَاء", ru: "Ха",    snd: "мягкое «х» из середины горла, с придыханием", pic: "крючок без точек — пустой", word: ["حَجَر", "камень", "stone"], join: true, sun: false },
  { id: "kha",   ch: "خ", name: "خَاء", ru: "Хо",    snd: "грубое «х» из верхней части горла", pic: "крючок, точка сверху", word: ["خُبْز", "хлеб", "bread"], join: true, sun: false },
  { id: "dal",   ch: "د", name: "دَال", ru: "Даль",  snd: "«д»", pic: "уголок", word: ["دَلْو", "ведро", "bucket"], join: false, sun: true },
  { id: "dhal",  ch: "ذ", name: "ذَال", ru: "Заль",  snd: "«з», кончик языка между зубами", pic: "уголок, сверху точка", word: ["ذَهَب", "золото", "gold"], join: false, sun: true },
  { id: "ra",    ch: "ر", name: "رَاء", ru: "Ро",    snd: "«р»", pic: "горка, по которой катятся вниз", word: ["رُمَّان", "гранат", "pomegranate"], join: false, sun: true },
  { id: "zay",   ch: "ز", name: "زَاي", ru: "Зай",   snd: "«з»", pic: "горка, а над ней точка", word: ["زَيْتُون", "оливки", "olive"], join: false, sun: true },
  { id: "sin",   ch: "س", name: "سِين", ru: "Син",   snd: "«с»", pic: "три зубчика, как у расчёски", word: ["سَمَاء", "небо", "sky"], join: true, sun: true },
  { id: "shin",  ch: "ش", name: "شِين", ru: "Шин",   snd: "«ш»", pic: "три зубчика и три точки над ними", word: ["شَمْس", "солнце", "sun"], join: true, sun: true },
  { id: "sad",   ch: "ص", name: "صَاد", ru: "Сод",   snd: "твёрдое, «толстое» «с»", pic: "петелька и чаша", word: ["صَخْرَة", "скала", "rock"], join: true, sun: true },
  { id: "dad",   ch: "ض", name: "ضَاد", ru: "Дод",   snd: "твёрдое, «толстое» «д»", pic: "петелька, чаша и точка сверху", word: ["ضِيَاء", "свет", "light"], join: true, sun: true },
  { id: "tta",   ch: "ط", name: "طَاء", ru: "То",    snd: "твёрдое «т»", pic: "петелька с высокой палочкой — как флажок", word: ["طِين", "глина", "clay"], join: true, sun: true },
  { id: "zza",   ch: "ظ", name: "ظَاء", ru: "Зо",    snd: "твёрдое «з», язык между зубами", pic: "флажок с точкой", word: ["ظِلّ", "тень", "shade"], join: true, sun: true },
  { id: "ain",   ch: "ع", name: "عَيْن", ru: "Айн",   snd: "особый звук из середины горла — в русском такого нет", pic: "полумесяц сверху и хвостик внизу", word: ["عِنَب", "виноград", "grapes"], join: true, sun: false },
  { id: "ghain", ch: "غ", name: "غَيْن", ru: "Гойн",  snd: "раскатистое «г», как картавое «р»", pic: "полумесяц с хвостиком и точка сверху", word: ["غَمَام", "облака", "cloud"], join: true, sun: false },
  { id: "fa",    ch: "ف", name: "فَاء", ru: "Фа",    snd: "«ф»", pic: "кружочек с точкой сверху на дорожке", word: ["فَجْر", "рассвет", "dawn"], join: true, sun: false },
  { id: "qaf",   ch: "ق", name: "قَاف", ru: "Коф",   snd: "глубокое «к» из самой глубины горла", pic: "кружочек с двумя точками и глубокая чаша", word: ["قَمَر", "луна", "moon"], join: true, sun: false },
  { id: "kaf",   ch: "ك", name: "كَاف", ru: "Каф",   snd: "«к»", pic: "высокий уголок с маленькой волной внутри", word: ["كِتَاب", "книга", "book"], join: true, sun: false },
  { id: "lam",   ch: "ل", name: "لَام", ru: "Лям",   snd: "«л»", pic: "высокий крючок, как удочка", word: ["لَيْل", "ночь", "night"], join: true, sun: true },
  { id: "mim",   ch: "م", name: "مِيم", ru: "Мим",   snd: "«м»", pic: "кружочек с хвостиком вниз", word: ["مَاء", "вода", "water"], join: true, sun: false },
  { id: "nun",   ch: "ن", name: "نُون", ru: "Нун",   snd: "«н»", pic: "чаша, а над ней одна точка — как пиала с ягодкой", word: ["نَجْم", "звезда", "star"], join: true, sun: true },
  { id: "ha",    ch: "ه", name: "هَاء", ru: "Ха",    snd: "лёгкое «х», как выдох", pic: "кружочек", word: ["هِلَال", "полумесяц", "crescent"], join: true, sun: false },
  { id: "waw",   ch: "و", name: "وَاو", ru: "Уау",   snd: "«у», как английское w", pic: "завиток с хвостиком, как запятая", word: ["وَرَق", "листья", "leaf"], join: false, sun: false },
  { id: "ya",    ch: "ي", name: "يَاء", ru: "Йа",    snd: "«й»", pic: "завиток, а под ним две точки", word: ["يَوْم", "день", "day"], join: true, sun: false },
  { id: "hamza", ch: "ء", name: "هَمْزَة", ru: "Хамза", snd: "короткая остановка голоса, как в «не-а»", pic: "маленький завиток", word: ["مَاء", "вода", "water"], join: false, sun: false }
];
const LET = Object.fromEntries(LETTERS.map(l => [l.id, l]));

/* Огласовки и знаки */
const HARAKA = { a: "َ", i: "ِ", u: "ُ", an: "ً", in: "ٍ", un: "ٌ", sk: "ْ", sh: "ّ" };
/* Вид буквы в слове: через невидимую связку ZWJ, без чёрточки-татвиля */
const ZWJ = "‍";
function formOf(l, pos) {
  const c = l.ch;
  if (pos === "init") return l.join ? c + ZWJ : c;
  if (pos === "mid") return l.join ? ZWJ + c + ZWJ : ZWJ + c;
  if (pos === "fin") return ZWJ + c;
  return c;
}
/* Слог для звука: у алифа огласовку несёт хамза (أَ إِ أُ) */
function syl(l, h) {
  const base = l.id === "alif" ? (h === "i" || h === "in" ? "إ" : "أ") : l.ch;
  if (h === "an") return base + HARAKA.an + (l.id === "hamza" || l.id === "alif" ? "" : "ا");
  if (h === "aa") return base + HARAKA.a + "ا";
  if (h === "ii") return base + HARAKA.i + "ي";
  if (h === "uu") return base + HARAKA.u + "و";
  if (h === "sk") return "أ" + HARAKA.a + l.ch + HARAKA.sk;   // اَبْ — буква с сукуном после «а»
  return base + HARAKA[h];
}
/* Главы уровня 1: буквы семьями по форме */
const LETTER_GROUPS = [
  ["alif", "ba", "ta", "tha"], ["jim", "hha", "kha"], ["dal", "dhal", "ra", "zay"], ["sin", "shin", "sad", "dad"],
  ["tta", "zza", "ain", "ghain"], ["fa", "qaf", "kaf", "lam"], ["mim", "nun", "ha", "waw", "ya", "hamza"]
];
