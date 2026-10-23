import re,json
s=open('index.html',encoding='utf8').read()
v=int(re.search(r'window\.APPV=(\d+)',s).group(1))
items=re.findall(r'\{n:(\d+),a:"[^"]*",d:"[^"]*",t:"([^"]*)",w:"[^"]*",x:"((?:[^"\\]|\\.)*)"',s)
items=sorted(items,key=lambda a:-int(a[0]))[:2]
json.dump({"v":v,"notes":[{"t":t,"x":x.replace('\\"','"')} for _,t,x in items]},open('version.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print(open('version.json',encoding='utf8').read())
