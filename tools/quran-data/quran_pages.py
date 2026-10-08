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
for f in sorted(glob.glob(D+'/gloss/out*.json')):G.update(json.load(open(f)))   # весь Коран, по словам Hafs
GR=json.load(open(D+'/gloss_ru.json'))   # подстрочник сур намаза и изучаемых сур (по словам quran-simple)
pages=collections.defaultdict(list);juz={}
def clean(w):return w.replace('۞','').replace('،','').strip()
for ref,(pg,j) in sorted(P.items(),key=lambda x:tuple(map(int,x[0].split(':')))):
    s,a=map(int,ref.split(':'));ws=[w for w in (clean(x) for x in H[ref]) if w]
    g=next((x for x in (GR.get(ref),G.get(ref)) if x and len(x)==len(ws)),None)
    pages[pg].append([s,a,ws,ayah_tr(ws),K[ref],g]);juz[pg]=j
# режим «Мусхаф»: 15 строк, разбивка печатного Мединского мусхафа (quran.com, mushaf=5 = KFGQPC Hafs; mushaf_lines.json:
# {страница: [[сура, аят, № слова (0 — знак конца аята), строка]]}). Строка — [["слово", "перевод", сура, аят], …, [№ аята]],
# ["h", сура] — заставка суры, ["b"] — басмала.
ML=json.load(open(D+'/mushaf_lines.json'))
GL={}
for ref in H:
    ws=[w for w in (clean(x) for x in H[ref]) if w]
    GL[ref]=next((x for x in (GR.get(ref),G.get(ref)) if x and len(x)==len(ws)),None)
def mushaf(pg):
    n=8 if pg<=2 else 15
    L={i:[] for i in range(1,n+1)}
    for s_,a_,pos,ln in sorted(ML[str(pg)],key=lambda x:(x[3],x[0],x[1],x[2] or 999)):
        if pos:g=GL[f'{s_}:{a_}'];L[ln].append([H[f'{s_}:{a_}'][pos-1].replace('،','').strip(),g[pos-1] if g else '',s_,a_])
        else:L[ln].append([a_])
    out=[];i=1
    while i<=n:
        if L[i]:out.append(L[i]);i+=1;continue
        j=i
        while j<=n and not L[j]:j+=1
        run=j-i
        if j<=n:
            f=L[j][0];assert len(f)==4 and f[3]==1,(pg,i,f)          # пустые строки — только перед началом суры
            su=f[2];fill=(['h',su],) if su in(1,9) else (['h',su],['b'])
            if i==1 and run<len(fill):fill=fill[-run:]                    # заставка суры осталась внизу прошлой страницы
            assert run==len(fill),(pg,i,run,su)
        else:                                                         # конец страницы: заставка следующей суры
            last=max(x[2] for l in L.values() for x in l if len(x)==4);su=last+1
            fill=((['h',su],['b']) if su!=9 else (['h',su],))[:run];assert run<=2,(pg,run)
        out.extend(list(fill));i=j
    return out
glossed=0
for pg,ays in pages.items():
    glossed+=all(x[5] for x in ays)
    json.dump({'p':pg,'j':juz[pg],'a':ays,'m':mushaf(pg)},open(f'{OUT}/p{pg:03d}.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print('страниц',len(pages),'с подстрочником',glossed)
