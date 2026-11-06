#!/usr/bin/env python3
"""Тексты 2-й части → srez/t2texts.js (T2X: тексты с огласовкой, паузальными формами, переводом и подсказками к словам)."""
import re,json,os,sys
R=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,R)
from texts import T
H=re.compile(r'[ً-ْٰـ]')
st=lambda w:H.sub('',w).replace('أ','ا').replace('إ','ا').replace('آ','ا').replace('ى','ي').replace('ة','ه')
def pausal(w):
    m=re.match(r'^(.*?)([ً-ْ]+)$',w)
    if not m:return w
    base,marks=m.groups()
    if 'ً' in marks and base.endswith('ا'):return base[:-1]+'َا' if False else base.rstrip('ا')+'َا'
    if marks.endswith('ًا') or marks=='ً':return base+'َا'
    sh='ّ' if 'ّ' in marks else ''
    if base.endswith(('ا','ى','و','ي')) and not sh and not base.endswith(('ة',)):
        return base if base[-1] in 'اى' else base+'ْ'
    return base+sh+'ْ'
def segs(x):
    out=[];bf=''
    for ch in x:
        if ch in '|.؟!':out.append([bf.strip(),ch]);bf=''
        else:bf+=ch
    if bf.strip():out.append([bf.strip(),'.'])
    return out
# лексикон
lex={}
src=open(os.path.join(R,'..','..','index.html'),encoding='utf8').read()
for a,r in re.findall(r'^([^\n|`"]{1,80})\|([^\n`|]{1,200})$',src,re.M):
    if not re.search(r'[؀-ۿ]',a):continue
    head=a.split(' · ')[0].split('،')[0].strip()
    for h in [head]:
        k=st(h)
        if ' ' in k:continue
        lex.setdefault(k,(head,r.strip()))
for n in range(1,7):
    for l in open(os.path.join(R,f'u{n}.txt'),encoding='utf8'):
        if '|' not in l or l.startswith('#'):continue
        a,r=l.rstrip('\n').rsplit('|',1);head=a.split(' · ')[0].split('(')[0].split('،')[0].strip()
        k=st(head)
        if ' ' in k:continue
        lex[k]=(head,r.strip())
for l in open(os.path.join(R,'extra.txt'),encoding='utf8'):
    if '|' not in l:continue
    a,r=l.rstrip('\n').rsplit('|',1);head=a.split(' · ')[0].strip()
    for h in a.split(' · '):
        k=st(h.strip())
        if ' ' not in k:lex[k]=(a.strip(),r.strip())
    k=st(a.strip())
    lex[k]=(a.strip(),r.strip())
form={}
for name in ['TW','TW4','TW6']:
    m=re.search(r'const '+name+r'=(\{.*?\});',src,re.S)
    if m:
        for k,v in json.loads(m.group(1)).items():
            form.setdefault(st(k),v)
            if ' ' not in st(v[0].split(' · ')[0]):lex.setdefault(st(v[0].split(' · ')[0]),(v[0],v[2]))
PRE=['وبال','وسي','سي','ست','وي','فت','وت','في','لن','ني','ي','ت','ن','ا','أ'][::-1]+['وبال','فبال','وال','فال','بال','كال','لل','و','ف','ب','ل','ك','س','ال']
SUF=['هما','هم','هن','ها','نا','كم','ني','ه','ك','ي','ات','ان','ين','ون','تم','تن','ت','وا']
def look(w):
    k=st(w).strip('«»(),:؛،')
    if not k:return None
    cands=[k]
    for p in PRE:
        if k.startswith(p) and len(k)-len(p)>=2:cands.append(k[len(p):])
    more=[]
    for c in cands:
        for s in SUF:
            if c.endswith(s) and len(c)-len(s)>=2:more.append(c[:-len(s)]);more.append(c[:-len(s)]+'ه')
        more.append(c+'ه') if not c.endswith('ه') else None
    for c in cands+more:
        if c in lex:return lex[c]
        if 'ال'+c in lex:return lex['ال'+c]
    return None
out=[];miss=0;tot=0;MS=[]
for t in T:
    S=segs(t['ar'])
    for s in S:
        ws=s[0].split()
        if ws:
            last=ws[-1];tail=''
            mm=re.match(r'^(.*?)([«»"()،:]*)$',last);last,tail=mm.group(1),mm.group(2)
            ws[-1]=pausal(last)+tail
        s[0]=' '.join(ws)
    x=''.join(a+e for a,e in S)
    # предложения
    sent=[];cur=[]
    for i,(a,e) in enumerate(S):
        cur.append(i)
        if e!='|':sent.append(cur);cur=[]
    if cur:sent.append(cur)
    assert len(sent)==len(t['ru']),(t['k'],len(sent),len(t['ru']))
    tr=[[{"s":sg[0],"r":ru,"n":[]}] for sg,ru in zip(sent,t['ru'])]
    tw={}
    for a,e in S:
        for w in a.split():
            c=w.replace('،','').strip('«»():')
            if not c or c in tw:continue
            tot+=1
            F=form.get(st(c))
            if F:tw[c]=[F[0],F[1],F[2],0];continue
            L=look(c)
            if L:tw[c]=[L[0],"",L[1],1]
            else:miss+=1;MS.append(w)
    out.append({"k":t['k'],"y":2,"t":t['t'],"s":t['s'],"x":x,"tw":tw,"tr":tr})
open(os.path.join(R,'..','t2texts.js'),'w',encoding='utf8').write('const T2X='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';')
print('texts',len(out),'words',tot,'no gloss',miss)
print(' '.join(sorted(set(MS))))
