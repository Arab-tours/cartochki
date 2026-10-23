import re,json
s=open('index.html',encoding='utf8').read()
v=int(re.search(r'window\.APPV=(\d+)',s).group(1))
items=re.findall(r'^\{n:(\d+),.*?,t:"([^"]*)",.*?,x:"((?:[^"\\]|\\.)*)"',s,re.M)
items=sorted(items,key=lambda a:-int(a[0]))[:10]
L=[{"n":int(n),"t":t,"x":x.replace('\\"','"')} for n,t,x in items]
json.dump({"v":v,"notes":[{"t":a["t"],"x":a["x"]} for a in L[:2]],"log":L},open('version.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print(open('version.json',encoding='utf8').read())
