import re
C={'ب':'б','ت':'т','ث':'с','ج':'дж','ح':'х','خ':'х','د':'д','ذ':'з','ر':'р','ز':'з','س':'с','ش':'ш','ص':'с','ض':'д','ط':'т','ظ':'з','ع':'ъ','غ':'г','ف':'ф','ق':'к','ك':'к','ل':'л','م':'м','ن':'н','ه':'х','ء':'ъ','ؤ':'ъ','ئ':'ъ'}
V={'َ':'а','ِ':'и','ُ':'у'}
TAN={'ً':'ан','ٍ':'ин','ٌ':'ун'}
SH='ّ';SK='ْ';DA='ٰ'
CONS='дж|[бвгджзйклмнпрстфхцчшщъ]'
def tr(w):
    w=w.replace('ٱ','ا').replace('ـ','')
    if w in('اللَّه','اللَّهِ','اللَّهُ'):return 'Аллах'
    out=''
    if w.startswith('ال') and len(w)>2:
        rest=w[2:].lstrip(SK)
        if rest and (rest[0] in V or rest[0]==SH):out='алл';rest=rest.replace(SH,'',1)   # الَّذِي: лям с шаддой
        elif SH in rest[1:3]:out='а'      # солнечная буква: шадда удвоит её
        else:out='аль-'
        w=rest
    n=len(w);i=0;prev_v=''
    while i<n:
        c=w[i];nx=w[i+1] if i+1<n else ''
        if c==SH:
            m=re.search(r'('+CONS+r')([аиу]?)$',out)
            if m:out=out[:m.start()]+m.group(1)+m.group(1)+m.group(2)
            i+=1;continue
        if c in V:out+=V[c];prev_v=V[c];i+=1;continue
        if c in TAN:out+=TAN[c];i+=1;continue
        if c==SK:i+=1;continue
        if c==DA:
            if not out.endswith('а'):out+='а'
            i+=1;continue
        if c=='ا':
            if i==0:
                if nx and nx not in V:out+='и'   # хамзат аль-васль перед согласной
            i+=1;prev_v='';continue
        if c=='ى':
            if not out.endswith('а'):out+='а'
            i+=1;prev_v='';continue
        if c=='ة':
            if out.endswith('а'):out+='т' if prev_v=='' else ''
            else:out+='а'
            i+=1;continue
        if c in 'أإآ':
            if c=='آ':out+='а' if i==0 else 'ъа'
            elif i>0:out+='ъ'
            i+=1;continue
        if c=='و':
            if prev_v=='у' and (not nx or (nx not in V and nx!=SH)):i+=1;prev_v='';continue
            if prev_v=='а' and (nx==SK or not nx):out+='у';i+=1;prev_v='';continue
            out+='в';i+=1;prev_v='';continue
        if c=='ي':
            if prev_v=='и' and (not nx or (nx not in V and nx!=SH)):i+=1;prev_v='';continue
            out+='й';i+=1;prev_v='';continue
        if c in C:out+=C[c];prev_v='';i+=1;continue
        i+=1
    out=re.sub(r'^йа','я',out);out=re.sub(r'^йу','ю',out)
    out=re.sub(r'(?<=[аиу])йа','я',out);out=re.sub(r'(?<=[аиу])йу','ю',out)
    out=re.sub(r'(?<=[бгджзклмнпрстфхш])йа','ья',out)
    return out
if __name__=='__main__':
    for x in ['مِنْ','اللَّه','فِي','لَا','الَّذِي','إِنَّ','عَلَىٰ','قَالَ','رَبّ','كَانَ','هُوَ','يَوْم','آمَنَ','أَرْض','كُلّ','رَسُول','عَذَاب','سَمَاء','كِتَاب','صَلَاة','رَحْمَٰن','جَنَّة','قُرْآن','إِيمَان','مُسْتَقِيم','اتَّقَىٰ','ذَا','إِلَٰه','شَيْء','عَلِيم','الْ','وَ','سَوْفَ','دُنْيَا','أَحَبَّ','مَاء','نُور','يَذَرُ','رَحْمَة','ثُمَّ','إِذَا','اسْتَغْفَرَ','مُؤْمِن','حَيَاة','زَكَاة','أُمَّة','مُوسَىٰ','الْحَمْدُ']:
        print(x,tr(x))
