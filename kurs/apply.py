#!/usr/bin/env python3
"""Вставляет автономный курс (kurs/*.js, kurs/kurs.css, kurs/rqs.json) в index.html.
Идемпотентно: блоки между маркерами заменяются. Запускать из корня репозитория:  python3 kurs/apply.py"""
import json, re, sys, os
R = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(R, '..', 'index.html')
s = open(P, encoding='utf8').read()
js = 'const KU_RQS=' + json.dumps(json.load(open(os.path.join(R, 'rqs.json'), encoding='utf8')), ensure_ascii=False, separators=(',', ':')) + ';\n'
js += '\n'.join(open(os.path.join(R, f'kurs{i}.js'), encoding='utf8').read() for i in range(1, 6))
css = open(os.path.join(R, 'kurs.css'), encoding='utf8').read()
assert '</head>' not in js and '</script' not in js.lower(), 'запрещённые литералы в JS'
JB, JE = '/*KURS-BEGIN*/', '/*KURS-END*/'
CB, CE = '/*KURS-CSS-BEGIN*/', '/*KURS-CSS-END*/'
def put(s, b, e, body, anchor):
    blk = b + '\n' + body + '\n' + e
    if b in s:
        i = s.index(b); j = s.index(e, i) + len(e)
        return s[:i] + blk + s[j:]
    assert s.count(anchor) == 1, 'якорь не найден: ' + anchor
    return s.replace(anchor, blk + '\n' + anchor)
s = put(s, JB, JE, js, '</script><script>__boot')
s = put(s, CB, CE, css, '</style></head>')
open(P, 'w', encoding='utf8').write(s)
print('ok', len(js), len(css))
