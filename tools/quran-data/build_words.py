import json,re,collections
from meanings import M,SKIP
import unicodedata as u
N=lambda x:u.normalize('NFC',x)
M={N(k):v for k,v in M.items()};SKIP={N(k) for k in SKIP}
top=json.load(open('top.json'))
simple=json.load(open('simple.json'))['data']['surahs']
kul=json.load(open('kuliev.json'))['data']['surahs']
MARK=re.compile(r'^[ۖ-ۭ۞۩]+$')
B='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ '
S={};K={}
for su in simple:
    for a in su['ayahs']:
        t=a['text'].replace('﻿','').strip()
        n=su['number'];k=a['numberInSurah']
        if k==1 and n not in(1,9):
            tk0=t.split(' ')
            if re.sub(r'[\u064B-\u065F\u0670]','',tk0[0])=='بسم':t=' '.join(tk0[4:])
        S[(n,k)]=t
for su in kul:
    for a in su['ayahs']: K[(su['number'],a['numberInSurah'])]=a['text'].strip()
# morph word counts per ayah
mw=collections.Counter()
for line in open('morph.txt',encoding='utf8'):
    p=line.split('\t')
    if len(p)<4:continue
    s,a,w,_=p[0].split(':');mw[(int(s),int(a))]=max(mw[(int(s),int(a))],int(w))
def tokens(t): return [x for x in t.split(' ') if x and not MARK.match(x)]
used=collections.Counter()
words=[]
for e in top['top']:
    raw=f"{e['lem']}|{e['pos']}";key=N(raw)
    if key in SKIP or key not in M: continue
    head,mean=M[key]
    best=None
    FAV={1,112,113,114,103,108,110,109,97,94,93,99,101,102,105,106,107,111,55,67,36,87,96,95,2}
    def complete(ru): return bool(re.match(r'^[«"(А-ЯЁ]',ru)) and bool(re.search(r'[.!?»)]$',ru))
    for tier,(lo,hi,maxru) in enumerate([(3,10,170),(3,14,240),(2,20,400)]):
        for s,a,w in top['locs'][raw]:
            t=S.get((s,a));ru=K.get((s,a),'')
            if not t:continue
            tk=tokens(t)
            if len(tk)!=mw[(s,a)] or not(lo<=len(tk)<=hi):continue
            if len(ru)>maxru or not complete(ru):continue
            sc=abs(len(tk)-6)*1.5+len(ru)/40+(-3 if s in FAV else 0)+used[(s,a)]*6
            if best is None or sc<best[0]:best=(sc,s,a,w-1,t,ru)
        if best:break
    if not best:
        print('NO EXAMPLE',key);continue
    _,s,a,hl,t,ru=best;used[(s,a)]+=1
    words.append({'k':key,'ar':head,'m':mean,'ex':t,'ru':ru,'hl':hl,'ref':f'{s}:{a}','root':e['root'],'n':e['n']})
    if len(words)>=300:break
json.dump(words,open('words.json','w'),ensure_ascii=False,indent=0)
print(len(words))
for i,w in enumerate(words[:12]+words[150:156]+words[-6:]):print(w['ar'],w['m'],'|',w['ex'],'|',tokens(w['ex'])[w['hl']],'|',w['ru'][:90],w['ref'])

# --- ручные примеры для приставок
MAN={"و|P":("1:5",2),"ال|P":("1:2",0),"ل|P":("112:4",2),"لا|P":("109:2",0),"ف|P":("108:2",0),"ب|P":("1:1",0),"ك|P":("101:4",3),"س|P":("87:6",0),"أ|N":("94:1",0),
     # аудит 27.09: примеры, где слово стоит в основном значении
     "مِن|P":("113:2",0),"الَّذِي|N":("67:1",1),"إِن|P":("47:7",4),"آمَنَ|V":("95:6",2),"كَفَرَ|V":("85:19",2),"نَظَرَ|V":("88:17",1),"ضَرَبَ|V":("36:13",0)}
MANN={N(k):v for k,v in MAN.items()}
for w in words:
    if w['k'] in MANN:
        ref,hl=MANN[w['k']];s,a=map(int,ref.split(':'))
        w['ex']=S[(s,a)];w['ru']=K[(s,a)];w['hl']=hl;w['ref']=ref
# --- проверка: выделенное слово содержит согласные корня/частицы
AR=re.compile(r'[ً-ٰٟۖ-ۭ]')
def bare(x):return AR.sub('',x).replace('أ','ا').replace('إ','ا').replace('آ','ا').replace('ٱ','ا').replace('ى','ي').replace('ؤ','و').replace('ئ','ي').replace('ة','ه')
bad=0
for w in words:
    tk=tokens(w['ex'])[w['hl']]
    r=bare(w['root'].replace('ء','ا')) if w['root'] else bare(w['ar'])
    hit=sum(1 for c in set(r) if c in bare(tk))
    need=min(2,len(set(r)))
    if hit<need:
        bad+=1;print('CHECK',w['ar'],w['root'],'|',tk,'|',w['ref'])
print('checked',len(words),'suspicious',bad)
json.dump(words,open('words.json','w'),ensure_ascii=False,indent=0)
for w in words[:8]:print(w['ar'],'|',w['ex'],'|',tokens(w['ex'])[w['hl']],'|',w['ru'])
