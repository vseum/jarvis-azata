# Вкладка «Азкары» и сведения для вкладки «Коран» → строки window.QAZKAR и window.QMETA в web/data.js.
# Запуск из папки с hafs_full.json и pages.json:  python3 azkar.py /путь/к/web/data.js
# azkar.json: when = am | pm | both | sleep | jumua (пятница, до джума); *_pm — вечерний вариант текста; q — аяты (текст Hafs берётся из hafs_full.json);
# ref — повтор другого пункта (текст берётся оттуда, своё — только ctx).
import json,sys,re
sys.path.insert(0,__file__.rsplit('/',1)[0])
from translit_hafs import ayah_tr
D=__file__.rsplit('/',1)[0];DATA=sys.argv[1]
H=json.load(open('hafs_full.json'));P=json.load(open('pages.json'))
A=json.load(open(f'{D}/azkar.json',encoding='utf8'));BY={a['id']:a for a in A}
def clean(w):return w.replace('۞','').replace('،','').strip()
def ayah(ref):ws=[w for w in (clean(x) for x in H[ref]) if w];return [' '.join(ws),ayah_tr(ws),int(ref.split(':')[1])]
BSM=ayah('1:1')
APP=json.load(open(f'{D}/azkar_app.json',encoding='utf8'))  # транскрипция, перевод и достоинство — как в приложении Азата
def item(a,pm):
    ap=APP.get(a['id'])or APP.get(a.get('ref'))or{}
    if a.get('ref'):b=dict(BY[a['ref']]);b.update({k:v for k,v in a.items() if k!='ref'});a=b
    g=lambda k:a.get(k+'_pm',a.get(k)) if pm else a.get(k)
    o={'id':a['id'],'n':a['n'],'ru':g('ru'),'ctx':a.get('ctx',''),'why':a.get('why',''),'grade':a.get('grade','')}
    if a.get('q'):
        o['q']=[[ayah(r) for r in a[k]] for k in ('q','q2','q3') if a.get(k)]
        if a.get('bsm'):o['bsm']=BSM
    else:o['ar']=g('ar');o['tr']=g('tr')
    for k in ('pre','tr_pre','sub','open','fadl'):
        if a.get(k):o[k]=a[k]
    for k in ('tr','ru','fadl'):
        v=ap.get(k+'_pm',ap.get(k)) if pm else ap.get(k)
        if v and not (k=='fadl' and a.get('fadl')):o[k]=v   # своё достоинство (у повтора по ref) важнее взятого из приложения
    for k in ('tr_pre','sub'):
        if k in ap:o[k]=ap[k]
    return o
out={'am':[item(a,False) for a in A if a['when'] in('am','both')],
     'pm':[item(a,True) for a in A if a['when'] in('pm','both')],
     'sl':[item(a,False) for a in A if a['when']=='sleep'],
     'jm':[item(a,False) for a in A if a['when']=='jumua']}
NAMES=['Аль-Фатиха','Аль-Бакара','Али Имран','Ан-Ниса','Аль-Маида','Аль-Анам','Аль-Араф','Аль-Анфаль','Ат-Тауба','Юнус','Худ','Юсуф','Ар-Рад','Ибрахим','Аль-Хиджр','Ан-Нахль','Аль-Исра','Аль-Кахф','Марьям','Та Ха','Аль-Анбийа','Аль-Хадж','Аль-Муминун','Ан-Нур','Аль-Фуркан','Аш-Шуара','Ан-Намль','Аль-Касас','Аль-Анкабут','Ар-Рум','Лукман','Ас-Саджда','Аль-Ахзаб','Саба','Фатыр','Йа Син','Ас-Саффат','Сад','Аз-Зумар','Гафир','Фуссылат','Аш-Шура','Аз-Зухруф','Ад-Духан','Аль-Джасия','Аль-Ахкаф','Мухаммад','Аль-Фатх','Аль-Худжурат','Каф','Аз-Зарийат','Ат-Тур','Ан-Наджм','Аль-Камар','Ар-Рахман','Аль-Вакиа','Аль-Хадид','Аль-Муджадала','Аль-Хашр','Аль-Мумтахана','Ас-Сафф','Аль-Джумуа','Аль-Мунафикун','Ат-Тагабун','Ат-Талак','Ат-Тахрим','Аль-Мульк','Аль-Калам','Аль-Хакка','Аль-Мааридж','Нух','Аль-Джинн','Аль-Муззаммиль','Аль-Муддассир','Аль-Кийама','Аль-Инсан','Аль-Мурсалат','Ан-Наба','Ан-Назиат','Абаса','Ат-Таквир','Аль-Инфитар','Аль-Мутаффифин','Аль-Иншикак','Аль-Бурудж','Ат-Тарик','Аль-Аля','Аль-Гашийа','Аль-Фаджр','Аль-Балад','Аш-Шамс','Аль-Лайль','Ад-Духа','Аш-Шарх','Ат-Тин','Аль-Аляк','Аль-Кадр','Аль-Баййина','Аз-Зальзаля','Аль-Адийат','Аль-Кариа','Ат-Такасур','Аль-Аср','Аль-Хумаза','Аль-Филь','Курайш','Аль-Маун','Аль-Каусар','Аль-Кафирун','Ан-Наср','Аль-Масад','Аль-Ихлас','Аль-Фаляк','Ан-Нас']
assert len(NAMES)==114
start={};juz={}
for ref,(pg,j) in P.items():
    s,a=map(int,ref.split(':'))
    if a==1:start[s]=pg
    juz.setdefault(j,pg);juz[j]=min(juz[j],pg)
import hashlib,glob,os
QV=hashlib.md5(b''.join(open(f,'rb').read() for f in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(DATA)),'quran','p*.json'))))).hexdigest()[:8]  # версия файлов страниц для кэша
AR=[x['name'] for x in json.load(open('simple.json'))['data']['surahs']]   # арабские названия для заставок мусхафа
meta={'v':QV,'names':NAMES,'ar':AR,'start':[start[s] for s in range(1,115)],'juz':[juz[j] for j in range(1,31)],'bsm':BSM}
# долгие гласные — удвоением, как в транскрипции Корана (аа, уу, ии)
LONG=str.maketrans({'ā':'аа','ӯ':'уу','ӣ':'ии','Ā':'Аа'})
def fix(x):
    if isinstance(x,str):return x.translate(LONG)
    if isinstance(x,list):return [fix(y) for y in x]
    return x
for k in out:
    for o in out[k]:
        for f in o:
            if f not in ('ar','pre','q','bsm'):o[f]=fix(o[f])
js=open(DATA,encoding='utf8').read()
js='\n'.join(l for l in js.split('\n') if not l.startswith(('window.QAZKAR=','window.QMETA='))).rstrip('\n')
js+='\nwindow.QAZKAR='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n'
js+='window.QMETA='+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\n'
open(DATA,'w',encoding='utf8').write(js)
print({k:len(v) for k,v in out.items()})
