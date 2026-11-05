#!/usr/bin/env python3
"""Собирает srez/tom2/u1..u6.txt (лексика 2-й части Яковенко) в srez/t2data.js. Формат: '#S Заголовок раздела' + строки 'араб|рус'."""
import json,os
R=os.path.dirname(os.path.abspath(__file__))
SUB={1:"хамзованные глаголы I породы",2:"شِبْهٌ، لَا سِيَّمَا، سَائِرٌ · Хан эль-Халили",3:"хамзованные глаголы II, V, VII, VIII пород",4:"إِذَا بِـ، مَا، بَعْضٌ، سَوَاءٌ · праздники",5:"хамзованные глаголы III, VI, IV, X пород",6:"كَمْ، глаголы восприятия, جَعَلَ · в гостинице"}
out=[]
for n in range(1,7):
    secs=[];cur=None
    for l in open(os.path.join(R,f'u{n}.txt'),encoding='utf8'):
        l=l.rstrip('\n')
        if not l.strip():continue
        if l.startswith('#S'):cur={'t':l[2:].strip(),'w':[]};secs.append(cur);continue
        i=l.rfind('|');cur['w'].append({'a':l[:i].strip(),'r':l[i+1:].strip()})
    sets=[]
    for s in secs:
        w=s['w'];k=(len(w)+24)//25
        for j in range(k):
            part=w[j*len(w)//k:(j+1)*len(w)//k]
            sets.append({'t':s['t']+(f' ({j+1}/{k})' if k>1 else ''),'s':'','w':part})
    out.append({'n':n,'sub':SUB[n],'sets':sets})
js='const T2D='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';'
open(os.path.join(R,'..','t2data.js'),'w',encoding='utf8').write(js)
print('ok',sum(len(s['w']) for u in out for s in u['sets']),len(js))
