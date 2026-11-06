#!/usr/bin/env python3
"""Вставляет srez/sz2.js в index.html между /*SZ2-BEGIN*/ и /*SZ2-END*/ (идемпотентно) и правит меню home(). Запуск из корня: python3 srez/apply.py"""
import os,re
R=os.path.dirname(os.path.abspath(__file__));P=os.path.join(R,'..','index.html')
s=open(P,encoding='utf8').read();js=open(os.path.join(R,'sz2.js'),encoding='utf8').read()+'\n'+open(os.path.join(R,'t2data.js'),encoding='utf8').read()+'\n'+open(os.path.join(R,'t2texts.js'),encoding='utf8').read()+'\n'+open(os.path.join(R,'t2audio.js'),encoding='utf8').read()+'\n'+open(os.path.join(R,'tom2.js'),encoding='utf8').read()
assert '</script' not in js.lower() and '</head>' not in js
B,E='/*SZ2-BEGIN*/','/*SZ2-END*/';blk=B+'\n'+js+'\n'+E
if B in s:i=s.index(B);j=s.index(E,i)+len(E);s=s[:i]+blk+s[j:]
else:
    a='/*KURS-BEGIN*/' if '/*KURS-BEGIN*/' in s else '</script><script>__boot'
    assert s.count(a)==1;s=s.replace(a,blk+'\n'+a)
h2='mi("tom1",U("١","1 том Яковенко","уроки 3–6, Срез 1, архив самостоятельных",""),tom1);'
if h2 in s and 'mi("tom2"' not in s:s=s.replace(h2,h2+'\nmi("tom2",U("٢","2 том Яковенко","хамзованные глаголы: слова уроков 1–6",""),tom2);',1)
old_home=re.search(r'mi\("s1",U\("١","Срез 1: 1 и 2 урок","",ownN\(\)\),s1\);\n.*?mk\(U\("٢","Срез 2","","скоро"\),0,"dis"\);',s,re.S)
if old_home:
    blkh=old_home.group(0)
    oud='if(me==="dima")mi("oud",U("♫","Настройка уда","",""),oudv);\n' if 'mi("oud"' in blkh else ''
    s=s.replace(blkh,'mi("sz2",U2("٢","Срез 2: подготовка","причастия, страд. залог, запрещение, كِلَا، أَيٌّ، بِضْعٌ, лексика","",null),srez2,"t1");\nmi("tom1",U("١","1 том Яковенко","уроки 3–6, Срез 1, архив самостоятельных",""),tom1);\n'+oud)
bk='$("back").onclick=$("back2").onclick=()=>{'
if 'cur&&cur.t2' not in s and 'cur&&cur.z2' in s:
    s=s.replace('if(cur&&cur.z2){','if(cur&&cur.t2){t2les(T2L.indexOf(cur));show("menu");return}if(cur&&cur.z2){',1)
if 'cur&&cur.z2' not in s:
    assert s.count(bk)==1;s=s.replace(bk,bk+'if(cur&&cur.z2){cur===Z2W?srez2():z2list(cur);show("menu");return}')
a1='mk(BK(),home);C.forEach'
if a1 in s:s=s.replace(a1,'mk(BK(),()=>T1ON?tom1():home());C.forEach')
open(P,'w',encoding='utf8').write(s);print('ok',len(js),bool(old_home))
