# Сводка трекера для разбора Джарвисом: читает ветку data (что пишет сервер) и печатает дни и привычки.
#   git fetch origin data && python3 tools/analytics.py [дней=60]
# Разбор потом дописывается в web/analysis.json ({at, title, period, text}) — он виден во вкладке «Аналитика».
import json,re,subprocess,sys,datetime as dt
N=int(sys.argv[1]) if len(sys.argv)>1 else 60
D=json.loads(subprocess.check_output(['git','show','origin/data:habits/days.json']))['days']
html=open(__file__.rsplit('/',2)[0]+'/web/index.html',encoding='utf8').read()
blocks=html[html.index('const BLOCKS=['):html.index('const ALL=')]
NAME=dict(re.findall(r"\{id:'(\w+)',n:'([^']+)'",blocks))
order=list(NAME)
days=sorted(k for k in D if re.fullmatch(r'\d{4}-\d{2}-\d{2}',k))[-N:]
WD='пн вт ср чт пт сб вс'.split()
for k in days:
    v=D[k]['v'];y=[NAME[i] for i in order if v.get(i) is True];n=[NAME[i] for i in order if v.get(i) is False]
    qp=sum(1 for x in (v.get('_qp') or {}).values() if x and x[0])
    print(f"{k} ({WD[dt.date.fromisoformat(k).weekday()]}) {D[k].get('pct')}% | работа {v.get('work',0)} ч | джамаат {','.join(v.get('jamaat',[])) or '—'} | Коран {qp} стр")
    print('  ✓',', '.join(y) or '—');print('  ✗',', '.join(n) or '—')
print('\nПо пунктам (✓/✗/дней):')
for i in order:
    a=sum(D[k]['v'].get(i) is True for k in days);b=sum(D[k]['v'].get(i) is False for k in days)
    print(f'  {NAME[i]} ({i}): ✓{a} ✗{b} /{len(days)}')
