# Транскрипция кириллицей по тексту KFGQPC Hafs (quran.com text_qpc_hafs): слитное чтение аята, остановка в конце.
# Долгие гласные удваиваются (аа, ии, уу), шадда удваивает согласную, солнечные буквы ассимилируют артикль,
# хамзат-васль в середине аята не читается, икляб (малый мим) → «м», идгам танвина/нуна — в следующую букву.
# Особенности кодировки KFGQPC: ۡ — сукун; ْ — немая буква (круглый ноль); ٗ ٞ ٖ — «открытые» танвины; ـٔ — отдельная хамза.
import re
C={'ب':'б','ت':'т','ث':'с','ج':'дж','ح':'х','خ':'х','د':'д','ذ':'з','ر':'р','ز':'з','س':'с','ش':'ш','ص':'с','ض':'д','ط':'т',
   'ظ':'з','ع':'`','غ':'г','ف':'ф','ق':'к','ك':'к','ل':'л','م':'м','ن':'н','ه':'х','ء':"'",'أ':"'",'إ':"'",'ؤ':"'",'ئ':"'",
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
        if L=='ل' and not m and i+1<n and SH in cl[i+1][1] and prev and prev[0] in 'ٱا': continue
        if L in 'اى' and not has_v(m):
            if DAGGER in m: s+='а'
            elif prev and (FA in prev[1] or DAGGER in prev[1]): s+='а'
            elif L=='ى' and prev and KA in prev[1]: s+='и'
            continue
        if L=='و' and not has_v(m) and SH not in m and SUK not in m and prev and DA in prev[1]: s+='у'; continue
        if L in 'يى' and not has_v(m) and SH not in m and SUK not in m and prev and KA in prev[1]: s+='и'; continue
        c=C.get(L,'')
        if L=='آ': s+="'аа"; continue
        if L=='ة': c='х' if (last_in_ayah and i==li) else 'т'
        if L=='ن' and any(x in m for x in SMEEM) and not has_v(m): c='м'
        if L=='ن' and i==li and not m and nxt and nxt[2]: c=C.get(nxt[1],'')      # идгам нуна: звучит следующая буква
        dbl=SH in m and not (skip_double and fr and i==fr[0])
        s+=c*(2 if dbl and c else 1) if c else ''
        vowel=next((VOW[v] for v in VOW if v in m),'')
        if DAGGER in m: vowel='аа'
        tan=next((TAN[t] for t in TAN if t in m),'')
        if tan:
            if last_in_ayah and i==li: vowel='а' if tan=='ан' else ''
            elif nxt and nxt[2]:                                                  # идгам танвина
                vowel=tan[0]+C.get(nxt[1],''); append='skip'
            elif any(x in m for x in SMEEM): vowel=tan[0]+'м'
            else: vowel=tan
        elif last_in_ayah and i==li and vowel in ('а','у','и'): vowel=''          # остановка
        if L=='ن' and i==li and not m and nxt and nxt[2]: append='skip'
        s+=vowel
        if 'ۥ' in m: s+='у'
        if 'ۦ' in m or 'ۧ' in m: s+='и'
        if 'ۨ' in m: s+='н'
    s=re.sub(r"^'", '', s)          # начальная хамза не пишется
    return s, append=='skip'

def ayah_tr(words):
    cls=[cluster(w) for w in words]; out=[]; skip=False
    for j,cl in enumerate(cls):
        nxt=first_readable(cls[j+1]) if j+1<len(cls) else None
        t,skip_next=word_tr(cl, j==0, j==len(cls)-1, nxt, skip)
        out.append(t); skip=skip_next
    return ' '.join(x for x in out if x)
