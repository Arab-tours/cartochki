/* ---------- Генераторы упражнений ----------
 упражнение: {id, q (вопрос, html), qa (арабский крупно), au (ключ звука), o:[{h,ok,ar}], b:{w,x} (сборка), d:{w} (диктант по буквам), why} */
const KU_LET=Object.keys(KU_CONF).concat(["ا"]);
const kuLetters=u=>[...(u.L||"")].filter(c=>KU_LT(c));
const kuOpts=(right,wrong,ar)=>kuShuf([{h:right,ok:1,ar},...wrong.filter(w=>w!==right).slice(0,3).map(h=>({h,ar}))]);
const kuSnd=c=>c==="ا"?"долгое «аа»":c==="ء"?"хамза (смычка)":c==="ة"?"«а» / «ат» на конце слова":(LZRC[c]||c);
const kuNear=(c,pool)=>{const a=[...(KU_CONF[c]||"")].filter(x=>x!==c&&KU_LT(x));const b=kuShuf(pool.filter(x=>x!==c&&!a.includes(x)));return a.concat(b)};
const KU_POOL="بتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
function kuExLetter(c,pool){const out=[],l=KU_LT(c);if(!l)return out;const near=kuNear(c,pool.length>3?pool:KU_POOL);
out.push({id:"L:"+c,qa:c,q:"Какой звук передаёт эта буква?",o:kuOpts(kuSnd(c),near.map(kuSnd)),why:`Буква ${c} (${l[1]}) — ${l[2]}`});
if(c!=="ا"&&lzSylSrc(c,"a")){const v=KU_VOW[Math.floor(Math.random()*3)];out.push({id:"S:"+c+"|"+v[0],au:"l|"+c+"|"+v[0],q:"Послушай и выбери слог",o:kuOpts(c+v[1],near.filter(x=>lzSylSrc(x,"a")).map(x=>x+v[1]),1),why:`Это ${c+v[1]} — «${kuSylR(c,v[2])}»`})}
const fm=lzForms(l);if(fm.length>2){const f=fm[1+Math.floor(Math.random()*(fm.length-1))];out.push({id:"L:"+c,qa:f[1],q:`Какая это буква? (форма «${f[0]}»)`,o:kuOpts(c,near,1),why:`Это ${c} в форме «${f[0]}»`})}
return out}
function kuGenL(u,n){const L=kuLetters(u),pool=KU_POOL;let ex=[];L.forEach(c=>ex=ex.concat(kuExLetter(c,pool)));return kuShuf(ex).slice(0,n||10)}
function kuGenV(u,n){const L=kuLetters(u).filter(c=>c!=="ا"&&c!=="و"),ex=[];const g=u.g;
if(g==="vow")L.forEach(c=>{KU_VOW.forEach(v=>{ex.push({id:"S:"+c+"|"+v[0],au:"l|"+c+"|"+v[0],q:"Какая огласовка прозвучала?",o:kuOpts(c+v[1],KU_VOW.map(x=>c+x[1]),1),why:`${v[3]} — «${kuSylR(c,v[2])}»`});ex.push({id:"S:"+c+"|"+v[0],qa:c+v[1],q:"Как читается?",o:kuOpts(kuSylR(c,v[2]),KU_VOW.map(x=>kuSylR(c,x[2]))),why:`${v[3]} — звук «${v[2]}»`})})});
if(g==="long")L.concat(["ب","ت","ن"]).slice(0,5).forEach(c=>{const V=[["َا","аа"],["ُو","уу"],["ِي","ии"],["َ","а"],["ُ","у"],["ِ","и"]];V.slice(0,3).forEach(v=>{ex.push({id:"V:"+c+v[0],qa:c+v[0],q:"Как читается?",o:kuOpts(kuSylR(c,v[1]),V.map(x=>kuSylR(c,x[1]))),why:`${c+v[0]} — «${kuSylR(c,v[1])}»: долгий гласный`})})});
(KU_G[g]&&KU_G[g].ex||[]).forEach((e,i)=>ex.push(kuExG(g,e,i)));
return kuShuf(ex).slice(0,n||10)}
function kuExG(g,e,i){const id="G:"+g+":"+i;if(Array.isArray(e)){const ar=/[؀-ۿ]/.test(e[1][0]);return{id,q:esc(e[0]).replace(/([؀-ۿ][؀-ۿً-ْٰ\s،؟]*)/g,'<span class="ar kuqa2">$1</span>'),o:kuOpts(e[1][0],e[1].slice(1),ar)}}
return{id,q:"Собери по-арабски: «"+esc(e.b)+"»",b:{w:e.w,x:e.x||[]}}}
function kuGenG(u,n){const G=KU_G[u.g];return kuShuf((G.ex||[]).map((e,i)=>kuExG(u.g,e,i))).slice(0,n||10)}
function kuGenP(u,n){const L=kuLetters(u),pairs=[];L.forEach(c=>{[...(KU_CONF[c]||"")].forEach(d=>{if(L.includes(d)&&lzSylSrc(c,"a")&&lzSylSrc(d,"a")&&!pairs.some(p=>p.includes(c)&&p.includes(d)))pairs.push([c,d])})});
return kuShuf(pairs).slice(0,n||10).map(([c,d])=>{const [x,y]=Math.random()<.5?[c,d]:[d,c],v=KU_VOW[Math.floor(Math.random()*3)];return{id:"P:"+[c,d].sort().join(""),au:"l|"+x+"|"+v[0],q:"Послушай внимательно: какой слог?",o:kuShuf([{h:x+v[1],ok:1,ar:1},{h:y+v[1],ar:1}]),why:`Прозвучало ${x+v[1]} («${kuSylR(x,v[2])}»), а не ${y+v[1]} («${kuSylR(y,v[2])}»)`}})}
const kuWords=u=>(u.W||[]).flatMap(KU_WG).map(w=>({a:w[0].replace(/^[٠-٩]+ · /,""),full:w[0],tr:w[1],ru:w[2]}));
const kuAllWords=()=>KU_ORD.filter(u=>u.W).flatMap(kuWords);
function kuAu(w){return LZA["w|"+w.full]?"w|"+w.full:"t|"+w.a}
function kuGenR(u,n){const W=kuWords(u),ex=[];W.forEach(w=>{ex.push({id:"R:"+w.a,qa:w.a,q:"Как читается это слово?",o:kuOpts(w.tr,kuPick(W.map(x=>x.tr),4)),why:`${w.a} — «${w.tr}», ${w.ru}`})});return kuShuf(ex).slice(0,n||10)}
function kuExW(w,W,kind){const others=kuPick(W.filter(x=>x.a!==w.a),6);const id="W:"+w.a;
if(kind===0)return{id,qa:w.a,au:kuAu(w),q:"Что это значит?",o:kuOpts(w.ru,others.map(x=>x.ru)),why:`${w.a} (${w.tr}) — ${w.ru}`};
if(kind===1)return{id,q:`Как сказать по-арабски: «${esc(w.ru)}»?`,o:kuOpts(w.a,others.map(x=>x.a),1),why:`${w.ru} — ${w.a} (${w.tr})`};
if(kind===2)return{id,au:kuAu(w),q:"Послушай и выбери, что прозвучало",o:kuOpts(w.a,others.map(x=>x.a),1),why:`${w.a} — ${w.ru}`};
const sk=KU_STRIP(w.a).replace(/[؟?\s]/g,"");if(kind===3&&sk.length<=6&&!/\s/.test(w.a))return{id,au:kuAu(w),q:`Диктант: собери слово «${esc(w.ru)}» по буквам`,d:{w:sk,x:kuPick(KU_POOL.filter(c=>!sk.includes(c)),3)},why:`${w.a} — ${w.ru}`};
const ws=w.a.replace(/[؟?]/g,"").split(/\s+/);if(ws.length>1)return{id,q:`Собери фразу: «${esc(w.ru)}»`,au:kuAu(w),b:{w:ws,x:kuPick(W.filter(x=>x.a!==w.a).flatMap(x=>x.a.replace(/[؟?]/g,"").split(/\s+/)),2)},why:`${w.a} — ${w.ru}`};
return kuExW(w,W,kind%3)}
function kuGenW(u,n){const W=kuWords(u),ex=[];W.forEach(w=>{const ks=u.ph?[0,1,4,2]:[0,1,2,3];kuPick(ks,2).forEach(k=>ex.push(kuExW(w,W,k)))});return kuShuf(ex).slice(0,n||12)}
function kuGen(u,n){if(!u)return[];if(u.ty==="L")return kuGenL(u,n);if(u.ty==="V")return kuGenV(u,n);if(u.ty==="P")return kuGenP(u,n);if(u.ty==="R")return kuGenR(u,n);if(u.ty==="W")return kuGenW(u,n);if(u.ty==="G")return kuGenG(u,n);
if(u.ty==="C"){const m=KU_MOD.find(x=>x.id===u.m),us=m.u.filter(x=>x.ty!=="C");let ex=[];us.forEach(x=>ex=ex.concat(kuGen(x,3)));return kuShuf(ex).slice(0,n||15)}return[]}
/* упражнение по id карточки повторения */
function kuExById(id){const [t,rest]=[id.slice(0,1),id.slice(2)];try{
if(t==="L"){const ex=kuExLetter(rest,KU_POOL);return ex[Math.floor(Math.random()*ex.length)]}
if(t==="S"){const [c,v]=rest.split("|"),V=KU_VOW.find(x=>x[0]===v);if(!V)return null;return Math.random()<.5?{id,au:"l|"+c+"|"+v,q:"Послушай и выбери слог",o:kuOpts(c+V[1],kuNear(c,KU_POOL).filter(x=>lzSylSrc(x,"a")).map(x=>x+V[1]),1),why:`${c+V[1]} — «${kuSylR(c,V[2])}»`}:{id,au:"l|"+c+"|"+v,q:"Какая огласовка прозвучала?",o:kuOpts(c+V[1],KU_VOW.map(x=>c+x[1]),1),why:`${V[3]} — «${kuSylR(c,V[2])}»`}}
if(t==="P"){const L=[...rest];return kuGenP({L:rest},1)[0]||null}
if(t==="V"){const c=rest[0],m=rest.slice(1),V=[["َا","аа"],["ُو","уу"],["ِي","ии"],["َ","а"],["ُ","у"],["ِ","и"]],r=V.find(x=>x[0]===m);if(!r)return null;return{id,qa:rest,q:"Как читается?",o:kuOpts(kuSylR(c,r[1]),V.map(x=>kuSylR(c,x[1]))),why:`«${kuSylR(c,r[1])}»`}}
if(t==="W"||t==="R"){const all=kuAllWords(),w=all.find(x=>x.a===rest);if(!w)return null;if(t==="R")return{id,qa:w.a,q:"Как читается это слово?",o:kuOpts(w.tr,kuPick(all.map(x=>x.tr),5)),why:`${w.a} — «${w.tr}», ${w.ru}`};return kuExW(w,all,Math.floor(Math.random()*4))}
if(t==="G"){const [g,i]=rest.split(":"),e=KU_G[g]&&KU_G[g].ex&&KU_G[g].ex[+i];return e?kuExG(g,e,+i):null}}catch(e){}return null}
