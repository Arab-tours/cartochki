#!/usr/bin/env python3
"""Собирает отдельное приложение «Уд» (oud/index.html) из кода вкладки «Уд» в index.html.
Запускайте после любых правок вкладки «Уд»:  python3 oud/build.py
Код вкладки живёт ТОЛЬКО в index.html (между /*OUD tuner*/ и function oudv(){); здесь его не правят."""
import os, re, shutil, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "oud")
s = open(os.path.join(ROOT, "index.html"), encoding="utf8").read()
a = s.index("/*OUD tuner*/"); b = s.index("function oudv(){", a)
block = s[a:b]
m = re.search(r"window\.APPV=(\d+)", s); ver = m.group(1) if m else "0"
hw = re.search(r"async function hwFetch\(prompt,blob,ref,maxTokens\)\{.*?return JSON\.parse\(t\.slice\(i,k\+1\)\)\}", s, re.S)
hwfetch = hw.group(0) if hw else ""
assert "</script" not in block and hwfetch, "не найден код вкладки или hwFetch"
shim = r"""
const D={};let me="oud";let DB=null;let HWAPI="";
const ld=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const blobURL=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
async function loadHwApi(){HWAPI=(ld("hwapi")||{}).url||HWAPI}
""" + hwfetch + "\n"
boot = r"""
/* мелодии и настройки: копия в IndexedDB (переживает обновления и чистку localStorage), постоянное хранилище */
(function(){const RX=/^(oud|hwapi)/,snap=()=>{const m={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(RX.test(k))m[k]=localStorage.getItem(k)}}catch(e){}return m};let tm=0;
const save=()=>{clearTimeout(tm);tm=setTimeout(()=>otaDB().then(db=>{db.transaction("kv","readwrite").objectStore("kv").put({at:Date.now(),map:snap()},"data")}).catch(()=>{}),300)};
const si=Storage.prototype.setItem,ri=Storage.prototype.removeItem;Storage.prototype.setItem=function(k,v){si.call(this,k,v);if(this===localStorage&&RX.test(k))save()};Storage.prototype.removeItem=function(k){ri.call(this,k);if(this===localStorage&&RX.test(k))save()};
try{const site=JSON.parse(localStorage.getItem("oudUM_dima")||"[]"),mine=JSON.parse(localStorage.getItem("oudUM_oud")||"[]");if(site.length&&!localStorage.getItem("oudUMsite")){site.forEach(x=>{if(x&&x.id&&!mine.some(y=>y.id===x.id))mine.push(x)});localStorage.setItem("oudUM_oud",JSON.stringify(mine));localStorage.setItem("oudUMsite","1")}}catch(e){}
save();document.addEventListener("visibilitychange",()=>{if(document.hidden)save()});try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}})();
loadHwApi();OUD.open(true);
["pointerdown","touchend","keydown"].forEach(ev=>document.addEventListener(ev,()=>OUD.wake(),{passive:true}));
function oudToast(msg,btn,fn){const t=document.createElement("div");t.className="otoast";t.setAttribute("role","status");t.innerHTML='<span></span>'+(btn?'<button type="button"></button>':"");t.firstChild.textContent=msg;if(btn){const b=t.querySelector("button");b.textContent=btn;b.onclick=e=>{e.stopPropagation();fn()}}document.body.appendChild(t);requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("on")));const rm=()=>{t.classList.remove("on");setTimeout(()=>t.remove(),400)};return rm}
setTimeout(()=>{if(OUD.asleep()){const rm=oudToast("Коснитесь экрана, чтобы включить звук и микрофон");const h=()=>{rm();document.removeEventListener("pointerdown",h)};document.addEventListener("pointerdown",h)}},1200);
const IS_APP=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
if("serviceWorker" in navigator&&!IS_APP&&location.hostname!=="localhost"){navigator.serviceWorker.register("sw.js").catch(()=>{});let had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(had)oudToast("Уд обновлён","Перезапустить",()=>location.reload());had=true})}
/* OTA для приложения: при запуске с сетью скачиваем свежую версию с сайта, применяем при следующем запуске или по кнопке */
async function otaCheck(){if(!IS_APP||navigator.onLine===false)return;const B="https://arab-tours.github.io/cartochki/oud/";try{
const j=await (await fetch(B+"version.json?t="+Date.now(),{cache:"no-store"})).json();const nv=+j.v;if(!(nv>OUDV))return;
const have=await otaGet();if(have&&have.v>=nv){oudToast("Готова новая версия Уда","Обновить",()=>location.reload());return}
const h=await (await fetch(B+"index.html?t="+Date.now(),{cache:"no-store"})).text(),m=h.match(/<script type="text\/plain" id="app">([\s\S]*?)<\/script>/);
if(!m||!h.includes("window.OUDV="+nv+";"))return;new Function(m[1]);
await otaPut({v:nv,html:h,at:Date.now()});oudToast("Готова новая версия Уда","Обновить",()=>location.reload())}catch(e){}}
setTimeout(otaCheck,2500);window.addEventListener("online",()=>setTimeout(otaCheck,1500));
"""
idb = r"""
function otaDB(){return new Promise((res,rej)=>{const r=indexedDB.open("oud-ota",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function otaGet(){return otaDB().then(db=>new Promise(res=>{const q=db.transaction("kv").objectStore("kv").get("app");q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})).catch(()=>null)}
function otaPut(v){return otaDB().then(db=>new Promise((res,rej)=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").put(v,"app");t.oncomplete=res;t.onerror=()=>rej(t.error)}))}
"""
loader = r"""(function(){var V=__V__;
function run(){var s=document.createElement("script");s.textContent=document.getElementById("app").textContent;document.body.appendChild(s)}
var app=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
if(!window.indexedDB){run();return}
var done=false,go=function(rec,data){if(done)return;done=true;
try{if(data&&data.map)for(var k in data.map)if(localStorage.getItem(k)==null)localStorage.setItem(k,data.map[k])}catch(e){}
if(app&&rec&&rec.v>V&&rec.html&&rec.html.indexOf("window.OUDV="+rec.v+";")>0){var h=rec.html;if(document.querySelector('link[href="fonts/manrope.css"]'))h=h.replace("</head>",'<link rel="stylesheet" href="fonts/manrope.css"><link rel="stylesheet" href="fonts/noto-sans-arabic.css"><link rel="stylesheet" href="fonts/cormorant.css"></head>');document.open();document.write(h);document.close()}else run()};
setTimeout(function(){go(null,null)},1500);
try{var r=indexedDB.open("oud-ota",1);r.onupgradeneeded=function(){r.result.createObjectStore("kv")};r.onerror=function(){go(null,null)};r.onsuccess=function(){try{var os=r.result.transaction("kv").objectStore("kv"),a=os.get("app"),d=os.get("data");d.onsuccess=function(){go(a.result,d.result)};d.onerror=function(){go(null,null)}}catch(e){go(null,null)}}}catch(e){go(null,null)}})();"""
css = r""".otoast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));z-index:99999;display:flex;align-items:center;gap:12px;max-width:calc(100vw - 32px);box-sizing:border-box;background:#10c98a;color:#05251a;font:700 15px Manrope,sans-serif;padding:10px 10px 10px 18px;border-radius:24px;box-shadow:0 8px 24px rgba(0,0,0,.4);opacity:0;transform:translate(-50%,100%);transition:opacity .4s ease,transform .4s ease}.otoast.on{opacity:1;transform:translate(-50%,0)}.otoast span{padding:4px 8px 4px 0}.otoast button{min-height:40px;padding:0 16px;border:0;border-radius:20px;background:#05251a;color:#fff;font:700 14px Manrope,sans-serif;-webkit-tap-highlight-color:transparent;transition:transform .16s cubic-bezier(.23,1,.32,1)}.otoast button:active{transform:scale(.97)}@media (prefers-reduced-motion:reduce){.otoast{transform:translate(-50%,0);transition:opacity .2s ease}}"""
html = f"""<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<title>Уд — тюнер и мелодии</title><meta name="theme-color" content="#15110d">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Уд">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Noto+Sans+Arabic:wght@400;600&display=swap" rel="stylesheet">
<style>html,body{{margin:0;height:100%;background:#15110d;overscroll-behavior:none;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}}body{{font-family:Manrope,-apple-system,system-ui,sans-serif}}{css}</style>
</head><body>
<script type="text/plain" id="app">/* Уд v{ver} — собрано из index.html скриптом oud/build.py, не правьте вручную */
window.OUDV={ver};
{shim}{idb}{block}{boot}</script>
<script>{loader.replace("__V__", ver)}</script></body></html>
"""
open(os.path.join(OUT, "index.html"), "w", encoding="utf8").write(html)
# sounds
os.makedirs(os.path.join(OUT, "snd"), exist_ok=True)
for f in os.listdir(os.path.join(ROOT, "snd")):
    shutil.copy2(os.path.join(ROOT, "snd", f), os.path.join(OUT, "snd", f))
files = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "snd/oud.json", "snd/ney.json", "snd/perc.json"]
sw = f"""const V="oud-v{ver}",F={json.dumps(files)};
self.addEventListener("install",e=>{{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{{}})))).then(()=>self.skipWaiting()))}});
self.addEventListener("activate",e=>{{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))}});
self.addEventListener("fetch",e=>{{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin&&!/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname))return;
if(r.mode==="navigate"){{e.respondWith(new Promise(ok=>{{let fin=false;const fb=()=>caches.match("index.html").then(h=>{{if(h&&!fin){{fin=true;ok(h)}}}});const tm=setTimeout(fb,3500);fetch(r).then(x=>{{clearTimeout(tm);if(x.ok){{const c=x.clone();caches.open(V).then(h=>h.put("index.html",c))}}if(!fin){{fin=true;ok(x)}}}}).catch(()=>{{clearTimeout(tm);caches.match("index.html").then(h=>{{if(!fin){{fin=true;ok(h||Response.error())}}}})}})}}));return}}
e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{{if(x.ok||x.type==="opaque"){{const c=x.clone();caches.open(V).then(k=>k.put(r,c))}}return x}})))}});
"""
open(os.path.join(OUT, "sw.js"), "w", encoding="utf8").write(sw)
open(os.path.join(OUT, "version.json"), "w").write(json.dumps({"v": int(ver)}))
print("oud/index.html собран, версия", ver, "размер", len(html))
