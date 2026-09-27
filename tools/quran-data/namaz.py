# Трек «Мой намаз»: суры, которые читаются в намазе, пословно (морфемы → слова словаря),
# новые слова этих сур (добавляются в QWORDS после 300 частых) и покрытие всего Корана (QCOV).
# Запуск из папки с morph.txt/simple.json/kuliev.json:  python3 namaz.py /путь/к/web/data.js
import json,re,sys,collections,unicodedata as u
sys.path.insert(0,__file__.rsplit('/',1)[0])
from namaz_words import NW,PRON,SPECIAL
from translit import tr
N=lambda x:u.normalize('NFC',x)
DATA=sys.argv[1]
MARK=re.compile(r'^[ۖ-ۭ۞۩]+$')
SUR=[(1,'Аль-Фатиха'),(112,'Аль-Ихлас'),(113,'Аль-Фаляк'),(114,'Ан-Нас'),(103,'Аль-Аср'),(108,'Аль-Каусар'),(110,'Ан-Наср'),
     (109,'Аль-Кафирун'),(111,'Аль-Масад'),(105,'Аль-Филь'),(106,'Курайш'),(107,'Аль-Маун'),(104,'Аль-Хумаза'),(2,'Аят аль-Курси')]
def inN(s,a):return (s!=2 and s in dict(SUR)) or (s,a)==(2,255)
simple=json.load(open('simple.json'))['data']['surahs'];kul=json.load(open('kuliev.json'))['data']['surahs']
S={};K={}
for su in simple:
    for a in su['ayahs']:
        t=a['text'].replace('﻿','').strip();n=su['number'];k=a['numberInSurah']
        if k==1 and n not in(1,9):
            tk0=t.split(' ')
            if re.sub(r'[ً-ٰٟ]','',tk0[0])=='بسم':t=' '.join(tk0[4:])
        S[(n,k)]=t
for su in kul:
    for a in su['ayahs']:K[(su['number'],a['numberInSurah'])]=a['text'].strip()
def ru_fix(r):
    r=r.strip().replace(' - ',' — ')
    if r[0].islower():r='…'+r
    if r[-1] in ',;:':r=r[:-1]+'…'
    return r
def toks(t):  # слова со знаками паузы, приклеенными к предыдущему
    out=[]
    for x in t.split(' '):
        if not x:continue
        if MARK.match(x) and out:out[-1]+=' '+x
        else:out.append(x)
    return out
# морфология
morph=collections.defaultdict(list);freq=collections.Counter();root={}
for line in open('morph.txt',encoding='utf8'):
    p=line.rstrip('\n').split('\t')
    if len(p)<4:continue
    s,a,w,g=map(int,p[0].split(':'))
    m=re.search(r'LEM:([^|]+)',p[3]);k=N(f"{m.group(1)}|{p[2]}") if m else None
    if k:freq[k]+=1;r=re.search(r'ROOT:([^|]+)',p[3]);root.setdefault(k,r.group(1) if r else '')
    morph[(s,a,w)].append((p[1],p[2],p[3],k))
# текущий словарь
js=open(DATA,encoding='utf8').read()
mW=re.search(r'window.QWORDS=(\[.*?\]\]);',js,re.S);W=json.loads(mW.group(1))[:300]
top=json.load(open('words.json'))
assert [w['ar'] for w in top]==[w[0] for w in W],'words.json не совпадает с data.js'
idx={w['k']:i for i,w in enumerate(top)}
NWN={N(k):v for k,v in NW.items()}
def word_of(s,a):
    n=max(w for (ss,aa,w) in morph if (ss,aa)==(s,a))
    ws=[morph[(s,a,w)] for w in range(1,n+1)]
    tk=toks(S[(s,a)])
    if len(tk)==len(ws)+1:  # يَا أَيُّهَا: в тексте два слова, в морфологии одно
        j=next(i for i,x in enumerate(ws) if x[0][2].startswith('VOC'))
        ws=ws[:j]+[ws[j][:1],ws[j][1:]]+ws[j+1:]
    assert len(tk)==len(ws),(s,a,len(tk),len(ws))
    return tk,ws
# новые слова по порядку появления
new=[]
for s,_ in SUR:
    for a in sorted(k for (ss,k) in S if ss==s and inN(ss,k)):
        tk,ws=word_of(s,a)
        for wi,segs in enumerate(ws):
            for surf,pos,tags,k in segs:
                if k and k not in idx and k in NWN:
                    head,mean,kind,note=NWN[k];idx[k]=300+len(new)
                    new.append([head,tr(head),mean,S[(s,a)],ru_fix(K[(s,a)]),wi,root.get(k,''),freq[k],f'{s}:{a}',kind,note])
miss=[k for k in NWN if k not in idx];assert not miss,miss
# пословная разметка сур
def seg_ref(surf,tags,k):
    base=re.sub(r'\|(M|F|MS|FS|MP|FP|MD|FD|GEN|NOM|ACC|INDEF)(?=\||$)','',tags)
    for key,g in SPECIAL.items():
        if base.startswith(key):return [surf,idx.get(k,-1),g]
    if k and k in idx:return [surf,idx[k]]
    m=re.search(r'PRON(?:\|SUFF)?\|(\w+)$',base)
    if m and m.group(1) in PRON:return [surf or 'ـي','местоимение: '+PRON[m.group(1)]]
    raise SystemExit(f'нет значения: {surf} {tags} {k}')
NAMAZ=[]
for s,name in SUR:
    ays=[]
    for a in sorted(k for (ss,k) in S if ss==s and inN(ss,k)):
        tk,ws=word_of(s,a)
        ays.append([a,ru_fix(K[(s,a)]),[[t,[seg_ref(x[0],x[2],x[3]) for x in segs]] for t,segs in zip(tk,ws)]])
    NAMAZ.append([s,name,ays])
# покрытие Корана: группы слов с одинаковым набором лемм (-1 — леммы нет в словаре)
cov=collections.Counter()
for (s,a,w),segs in morph.items():
    ids=sorted({idx.get(k,-1) for *_,k in segs if k})
    if ids:cov[tuple(ids)]+=1
QCOV=[[list(k),v] for k,v in cov.items() if -1 not in k]
total=sum(cov.values())
W2=W+new
out=js[:mW.start(1)]+json.dumps(W2,ensure_ascii=False,separators=(',',':'))+js[mW.end(1):]
out=re.sub(r'\nwindow\.QNAMAZ=.*?;\n|\nwindow\.QCOV=.*?;\n','\n',out,flags=re.S)
out=out.rstrip('\n')+'\nwindow.QNAMAZ='+json.dumps(NAMAZ,ensure_ascii=False,separators=(',',':'))+';\n'
out+='window.QCOV={total:'+str(total)+',g:'+json.dumps(QCOV,separators=(',',':'))+'};\n'
open(DATA,'w',encoding='utf8').write(out)
print('новых слов',len(new),'всего',len(W2),'групп покрытия',len(QCOV),'слов в Коране',total,
      'покрыто 300:',sum(v for k,v in cov.items() if -1 not in k and max(k)<300)/total)
