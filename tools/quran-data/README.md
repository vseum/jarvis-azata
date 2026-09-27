# Данные для «Слов» и «Хадиса дня» (web/data.js)

Источники (скачать в рабочую папку):
- `morph.txt` — https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt (Quranic Arabic Corpus)
- `simple.json` — https://api.alquran.cloud/v1/quran/quran-simple
- `kuliev.json` — https://api.alquran.cloud/v1/quran/ru.kuliev
- хадисы: https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/rus-bukhari.json, rus-muslim.json

`meanings.py` — русские значения лемм (написаны вручную по английскому «слово за словом» quran.com).
`build_words.py` — частоты лемм, выбор короткого аята-примера (законченное предложение в переводе Кулиева), позиция слова для подсветки, проверка.
`translit.py` — транслитерация кириллицей (приблизительная).
`notes.py` — пометка «приставка/частица/глагол/имя» и пояснения к служебным словам и терминам (поля 9–10 в QWORDS).
