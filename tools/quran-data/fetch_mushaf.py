import json,urllib.request,time,sys,os
from concurrent.futures import ThreadPoolExecutor
OUT='mushaf5.json'
res=json.load(open(OUT)) if os.path.exists(OUT) else {}
def get(p):
    if str(p) in res:return
    for t in range(5):
        try:
            u=f"https://api.quran.com/api/v4/verses/by_page/{p}?words=true&word_fields=text_qpc_hafs,line_number,page_number,char_type_name,position&mushaf=5&per_page=300"
            d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30))
            W=[]
            for v in d['verses']:
                s,a=map(int,v['verse_key'].split(':'))
                for w in v['words']:W.append([s,a,w['position'],w['line_number'],w['char_type_name'][0],w['page_number'],w['text_qpc_hafs']])
            res[str(p)]=W;return
        except Exception as e:time.sleep(2+t*2)
    print('fail',p)
with ThreadPoolExecutor(8) as ex:list(ex.map(get,range(1,605)))
json.dump(res,open(OUT,'w'),ensure_ascii=False)
print(len(res))
