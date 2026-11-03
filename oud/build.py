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
loadHwApi();OUD.open(true);
["pointerdown","touchend","keydown"].forEach(ev=>document.addEventListener(ev,()=>OUD.wake(),{passive:true}));
setTimeout(()=>{if(OUD.asleep()){const t=document.createElement("div");t.textContent="Коснитесь экрана, чтобы включить звук и микрофон";t.style.cssText="position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:99999;background:#10c98a;color:#05251a;font:700 15px Manrope,sans-serif;padding:12px 18px;border-radius:22px;box-shadow:0 8px 24px rgba(0,0,0,.4)";document.body.appendChild(t);const rm=()=>{t.remove();document.removeEventListener("pointerdown",rm)};document.addEventListener("pointerdown",rm)}},1200);
if("serviceWorker" in navigator&&!/^(capacitor|ionic):/.test(location.protocol)&&location.hostname!=="localhost")navigator.serviceWorker.register("sw.js").catch(()=>{});
"""
html = f"""<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<title>Уд — тюнер и мелодии</title><meta name="theme-color" content="#1d1e21">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Уд">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Noto+Sans+Arabic:wght@400;600&display=swap" rel="stylesheet">
<style>html,body{{margin:0;height:100%;background:#1d1e21;overscroll-behavior:none;-webkit-text-size-adjust:100%}}body{{font-family:Manrope,-apple-system,system-ui,sans-serif}}</style>
</head><body>
<script>/* Уд v{ver} — собрано из index.html скриптом oud/build.py, не правьте вручную */
{shim}{block}{boot}</script></body></html>
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
if(r.mode==="navigate"){{e.respondWith(fetch(r).then(x=>{{const c=x.clone();caches.open(V).then(h=>h.put("index.html",c));return x}}).catch(()=>caches.match("index.html")));return}}
e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{{if(x.ok||x.type==="opaque"){{const c=x.clone();caches.open(V).then(k=>k.put(r,c))}}return x}})))}});
"""
open(os.path.join(OUT, "sw.js"), "w", encoding="utf8").write(sw)
print("oud/index.html собран, версия", ver, "размер", len(html))
