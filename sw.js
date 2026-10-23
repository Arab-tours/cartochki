const V="arabic-v1",SHELL=["./","index.html","manifest.webmanifest","app-192.png","app-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
const own=u.origin===location.origin,font=/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);
if(!own&&!font)return;
if(own&&(r.mode==="navigate"||/\/(index\.html|news\.json)?$/.test(u.pathname)||u.pathname.endsWith("news.json"))){
e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r.mode==="navigate"?"index.html":r,c))}return x}).catch(()=>caches.match(r.mode==="navigate"?"index.html":r).then(x=>x||caches.match("index.html"))));return}
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>hit);return hit||net}))});
