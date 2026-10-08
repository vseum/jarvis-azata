# Транскрипция кириллицей по тексту KFGQPC Hafs (quran.com text_qpc_hafs): слитное чтение аята, остановка в конце.
# Система — как в приложении, по которому читает Азат (с 08.10): ق → ḳ, ج → ж; долгое «а» одной буквой, долгие «ии», «уу» —
# двумя; шадда удваивает согласную; артикль при слитном чтении уходит к предыдущему слову («`алайкумул лайла»,
# «йаумил ḳийамати», «`алайкумун нахара»), «Аллах» пишется слитно («жа`алаллаху»); долгая гласная перед хамзат-васлем
# сокращается («фи»), танвин перед ним получает «и» («хайранил»); согласная و — «в», после «у» сливается («хуа»), в дифтонге — «у»
# («йауми»); хамза между гласными внутри слова не пишется («араайтум»). Икляб (малый мим) → «м», идгам танвина/нуна — в следующую букву.
# Особенности кодировки KFGQPC: ۡ — сукун; ْ — немая буква (круглый ноль); ٗ ٞ ٖ — «открытые» танвины; ـٔ — отдельная хамза.
import re
C={'ب':'б','ت':'т','ث':'с','ج':'ж','ح':'х','خ':'х','د':'д','ذ':'з','ر':'р','ز':'з','س':'с','ش':'ш','ص':'с','ض':'д','ط':'т',
   'ظ':'з','ع':'`','غ':'г','ف':'ф','ق':'ḳ','ك':'к','ل':'л','م':'м','ن':'н','ه':'х','ء':"'",'أ':"'",'إ':"'",'ؤ':"'",'ئ':"'",
   'ة':'т','و':'у','ي':'й','ى':'','ا':'','ٱ':'','آ':"'"}
FA,DA,KA='َ','ُ','ِ'
VOW={FA:'а',DA:'у',KA:'и'}
SUK='ۡ'; SH='ّ'; DAGGER='ٰ'
TAN={'ً':'ан','ٗ':'ан','ٌ':'ун','ٞ':'ун','ٍ':'ин','ٖ':'ин'}
SILENT=('۟','۠','ْ')
SMEEM=('ۢ','ۭ')   # икляб
LETTER=re.compile(r'[ء-يٱ]')

def cluster(word):
    word=word.replace('۞','').replace('۩','').replace('ـٔ','ء').replace('ـ','').replace(' ','')
    out=[]
    for ch in word:
        if LETTER.match(ch) or not out: out.append([ch,''])
        else: out[-1][1]+=ch
    return out

def has_v(m): return any(v in m for v in VOW) or any(t in m for t in TAN)
def silent(L,m): return any(z in m for z in SILENT)

def first_readable(cl):
    """первая звучащая согласная слова: (индекс, буква, есть ли шадда)"""
    for i,(L,m) in enumerate(cl):
        if L=='ٱ' or silent(L,m): continue
        if L=='ل' and not m and i+1<len(cl) and SH in cl[i+1][1]: continue   # лам солнечного артикля
        return i,L,SH in m
    return None

def last_readable(cl):
    for i in range(len(cl)-1,-1,-1):
        L,m=cl[i]
        if silent(L,m): continue
        if L in 'اى' and not has_v(m) and DAGGER not in m: continue
        return i
    return len(cl)-1

def word_tr(cl, first_in_ayah, last_in_ayah, nxt, skip_double):
    s=''; n=len(cl); li=last_readable(cl); fr=first_readable(cl); append=''
    for i,(L,m) in enumerate(cl):
        prev=cl[i-1] if i else None
        if silent(L,m): continue
        if L=='ٱ':
            if first_in_ayah and i==0: s+='а' if i+1<n and cl[i+1][0]=='ل' else 'и'
            continue
        if L=='ل' and not m and i+1<n and SH in cl[i+1][1] and i>0: continue      # лам артикля перед солнечной буквой (и в «لِلشَّهَٰدَةِ»)
        if not m and i+1<n and SH in cl[i+1][1] and C.get(L)==C.get(cl[i+1][0]): continue   # «يُدۡرِككُّمُ» → «йудриккум»
        if L in 'اى' and not has_v(m):
            if DAGGER in m and not (prev and FA in prev[1]): s+='а'   # долгое «а» — одной буквой
            elif L=='ى' and prev and KA in prev[1]: s+='и'
            continue
        if L=='و' and not has_v(m) and SH not in m and SUK not in m and prev and DA in prev[1]: s+='у'; continue
        if L in 'يى' and not has_v(m) and SH not in m and SUK not in m and prev and KA in prev[1]: s+='и'; continue
        c=C.get(L,'')
        if L=='و' and SUK not in m:                                           # согласная و: «ва», «ḳувва», но «хуа»
            c='' if (SH not in m and s.endswith('у') and prev and DA in prev[1]) else 'в'
        if L in 'ءأإؤئ' and i>=2 and s and s[-1] in 'аиу' and has_v(m): c=''   # хамза между гласными: «араайтум»
        if L=='آ' or (L in 'أإ' and 'ٓ' in m and not has_v(m)): s+="'а"; continue   # хамза с маддой: «ал'ахири»
        if L=='ة': c='х' if (last_in_ayah and i==li) else 'т'
        if L=='ن' and any(x in m for x in SMEEM) and not has_v(m): c='м'
        if L=='ن' and i==li and not m and nxt and nxt[2]: c=C.get(nxt[1],'')      # идгам нуна: звучит следующая буква
        dbl=SH in m and not (skip_double and fr and i==fr[0])
        s+=c*(2 if dbl and c else 1) if c else ''
        vowel=next((VOW[v] for v in VOW if v in m),'')
        if DAGGER in m: vowel='а'
        tan=next((TAN[t] for t in TAN if t in m),'')
        if tan:
            if last_in_ayah and i==li: vowel='а' if tan=='ан' else ''
            elif nxt and nxt[2]:                                                  # идгам танвина
                vowel=tan[0]+C.get(nxt[1],''); append='skip'
            elif any(x in m for x in SMEEM): vowel=tan[0]+'м'
            else: vowel=tan
        elif last_in_ayah and i==li and vowel in ('а','у','и') and not any(cl[k][0] in 'اى' and not silent(*cl[k]) for k in range(li+1,n)): vowel=''   # остановка (долгое «а» на конце остаётся: «а`ла»)
        if L=='ن' and i==li and not m and nxt and nxt[2]: append='skip'
        s+=vowel
        if 'ۥ' in m: s+='у'
        if 'ۦ' in m or 'ۧ' in m: s+='и'
        if 'ۨ' in m: s+='н'
    s=re.sub(r"^'", '', s)          # начальная хамза не пишется
    return s, append=='skip'

def base(cl): return ''.join(L for L,m in cl)

def ayah_tr(words):
    cls=[cluster(w) for w in words]; out=[]; skip=False
    for j,cl in enumerate(cls):
        nxt=first_readable(cls[j+1]) if j+1<len(cls) and cls[j+1][0][0]!='ٱ' else None   # через васль идгама нет
        t,skip_next=word_tr(cl, j==0, j==len(cls)-1, nxt, skip)
        out.append(t); skip=skip_next
    # слитное чтение через хамзат-васль: «… ил-…» → как в приложении
    pi=0                                                                    # предыдущее непустое слово (Аллах мог слиться в него)
    for j in range(1,len(cls)):
        cl=cls[j]
        if cl[0][0]!='ٱ' or not out[pi] or not out[j]: pi=j if out[j] else pi; continue
        pl=cls[j-1][last_readable(cls[j-1])][1]
        if any(t in pl for t in TAN): out[pi]+='и'                         # танвин перед васлем: «хайранил», «нухуни»
        out[pi]=re.sub(r'(ии|уу)$',lambda m:m.group(0)[0],out[pi])           # долгая гласная перед васлем сокращается
        if len(cl)<3 or cl[1][0]!='ل' or base(cl).startswith('ٱلله'):        # не артикль (ٱسۡمَ, ٱرۡجِعُوٓا) и «Аллах» — слитно:
            out[pi]+=out[j]; out[j]=''; continue                            # «саббихисма», «жа`алаллаху»
        w=out[j]
        if SH in cl[2][1] and len(w)>1 and w[0]==w[1]: out[pi]+=w[0]; out[j]=w[1:]   # солнечная буква: «алайкумун нахара»
        elif w.startswith('л'): out[pi]+='л'; out[j]=w[1:].lstrip("'")              # лунная: «йаумил ḳийамати», «фил арди»
        pi=j
    for j in range(1,len(cls)):                                             # «أَصۡحَٰبُ لۡـَٔيۡكَةِ» — лам без васля тоже к предыдущему
        if cls[j][0][0]=='ل' and SUK in cls[j][0][1] and out[j].startswith('л') and out[j-1]: out[j-1]+='л'; out[j]=out[j][1:].lstrip("'")
    for j in range(1,len(out)):                                             # одинаковые согласные на стыке
        w=out[j]
        if len(w)>1 and w[0]==w[1] and w[0] not in 'аиу' and out[j-1].endswith(w[0]): out[j]=w[1:]
    return re.sub(r'([аиу])\1\1',r"\1'\1\1",' '.join(x for x in out if x))   # «сабииина» → «саби'иина»
