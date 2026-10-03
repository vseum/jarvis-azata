# Вкладка «Коран»: файл на каждую страницу мусхафа (604) — web/quran/pNNN.json.
# Запуск из папки с hafs_full.json, pages.json, kuliev.json (подстрочник — tools/quran-data/gloss/out*.json):
#   python3 quran_pages.py /путь/к/web/quran
# Страница: {"p":N,"j":джуз,"a":[[сура,аят,[слова Hafs],транскрипция,Кулиев,[подстрочник]|null], ...]}
import json,sys,os,glob,collections
sys.path.insert(0,__file__.rsplit('/',1)[0])
from translit_hafs import ayah_tr
OUT=sys.argv[1];os.makedirs(OUT,exist_ok=True)
H=json.load(open('hafs_full.json'));P=json.load(open('pages.json'))
K={f"{s['number']}:{a['numberInSurah']}":a['text'].strip() for s in json.load(open('kuliev.json'))['data']['surahs'] for a in s['ayahs']}
G={}
D=__file__.rsplit('/',1)[0]
for f in sorted(glob.glob(D+'/gloss/out*.json')):G.update(json.load(open(f)))   # страницы 363–604 (25:33–114:6)
GR=json.load(open(D+'/gloss_ru.json'))   # подстрочник сур намаза и изучаемых сур (по словам quran-simple)
pages=collections.defaultdict(list);juz={}
def clean(w):return w.replace('۞','').replace('،','').strip()
for ref,(pg,j) in sorted(P.items(),key=lambda x:tuple(map(int,x[0].split(':')))):
    s,a=map(int,ref.split(':'));ws=[w for w in (clean(x) for x in H[ref]) if w]
    g=next((x for x in (GR.get(ref),G.get(ref)) if x and len(x)==len(ws)),None)
    pages[pg].append([s,a,ws,ayah_tr(ws),K[ref],g]);juz[pg]=j
glossed=0
for pg,ays in pages.items():
    glossed+=all(x[5] for x in ays)
    json.dump({'p':pg,'j':juz[pg],'a':ays},open(f'{OUT}/p{pg:03d}.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print('страниц',len(pages),'с подстрочником',glossed)
