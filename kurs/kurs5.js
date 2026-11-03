/* ---------- Ролики: анимированное объяснение с озвучкой и субтитрами ---------- */
let KUV2=null;
function kuRuVoice(){try{const v=speechSynthesis.getVoices().filter(x=>/^ru/i.test(x.lang));return v.find(x=>/natural|neural|enhanced|premium|milena|google/i.test(x.name))||v[0]||null}catch(e){return null}}
function kuSayRu(t,cb){let done=false;const fin=()=>{if(done)return;done=true;cb()};const lim=setTimeout(fin,Math.max(2200,t.length*85));
try{const v=kuRuVoice();if(!v||(KUV2&&KUV2.mute))throw 0;const u=new SpeechSynthesisUtterance(t);u.voice=v;u.lang=v.lang;u.rate=1;u.onend=()=>{clearTimeout(lim);setTimeout(fin,250)};u.onerror=()=>{};speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function kuScenes(u){if(u.ty==="L")return kuLetters(u).flatMap(c=>{const l=KU_LT(c),f=lzForms(l);return[{r:`Новая буква. Её звук — ${kuSnd(c).replace(/[«»]/g,"")}.`,a:c,n:l[1]},
...(KU_RQS[c]?[{r:"Вот как её пишут от руки, почерком рука’а.",rq:c}]:[]),
{r:f.length>2?"У буквы четыре формы: отдельно, в начале, в середине и в конце слова.":"Эта буква не соединяется со следующей, поэтому у неё две формы.",a:f.map(x=>x[1]).join(" · "),n:f.map(x=>x[0]).join(" · ")},
...(c!=="ا"&&lzSylSrc(c,"a")?[{r:"Послушайте слоги: а, и, у.",a:KU_VOW.map(v=>c+v[1]).join(" · "),seq:c,n:KU_VOW.map(v=>kuSylR(c,v[2])).join(" · ")}]:[])]});
return(KU_G[u.g]||{}).sc||[]}
function kuVid(u){const sc=kuScenes(u);if(!sc.length)return;kuVidClose();const o=document.createElement("div");o.className="kuvid";o.innerHTML=`<div class="kuvb"><div class="kuvh"><b>${kuT(u.t)}</b><button class="lnk" id="kuvx" type="button" aria-label="Закрыть">✕</button></div><div class="kuvst" id="kuvst"></div><div class="kuvcap" id="kuvcap"></div><div class="kuvdots">${sc.map((_,i)=>`<i data-i="${i}"></i>`).join("")}</div><div class="kurow"><button class="b" id="kuvp" type="button">⏮</button><button class="b ok" id="kuvpl" type="button">⏸ Пауза</button><button class="b" id="kuvn" type="button">⏭</button><button class="b" id="kuvm" type="button">🔊 Голос</button></div></div>`;document.body.appendChild(o);
KUV2={u,sc,i:0,tok:0,play:true,mute:false,o};$("kuvx").onclick=kuVidClose;o.addEventListener("click",e=>{if(e.target===o)kuVidClose()});
$("kuvpl").onclick=()=>{KUV2.play=!KUV2.play;$("kuvpl").textContent=KUV2.play?"⏸ Пауза":"▶ Смотреть";if(KUV2.play){if(KUV2.i>=sc.length)KUV2.i=0;kuVidGo()}else{KUV2.tok++;try{speechSynthesis.cancel()}catch(e){}}};
$("kuvp").onclick=()=>{KUV2.i=Math.max(0,KUV2.i-1);kuVidGo()};$("kuvn").onclick=()=>{KUV2.i=Math.min(sc.length-1,KUV2.i+1);kuVidGo()};
$("kuvm").onclick=()=>{KUV2.mute=!KUV2.mute;$("kuvm").textContent=KUV2.mute?"🔇 Без голоса":"🔊 Голос";if(KUV2.mute)try{speechSynthesis.cancel()}catch(e){}};
o.querySelectorAll(".kuvdots i").forEach(d=>d.onclick=()=>{KUV2.i=+d.dataset.i;kuVidGo()});kuVidGo()}
function kuVidClose(){if(KUV2){KUV2.tok++;try{speechSynthesis.cancel()}catch(e){}try{if(lzAu)lzAu.pause()}catch(e){}if(KUV2.o)KUV2.o.remove();KUV2=null}}
function kuVidGo(){const V=KUV2;if(!V)return;const t=++V.tok,s=V.sc[V.i],st=$("kuvst");try{speechSynthesis.cancel()}catch(e){}
st.innerHTML=`<div class="kuvs">${s.rq?rqSVG(s.rq,1,{speed:110}):`<div class="ar kuva">${s.a||""}</div>`}${s.n?`<div class="kuvn">${/[؀-ۿ]/.test(s.n)?`<span class="ar">${s.n}</span>`:esc(s.n)}</div>`:""}</div>`;
$("kuvcap").textContent=s.r;V.o.querySelectorAll(".kuvdots i").forEach((d,i)=>d.className=i<V.i?"p":i===V.i?"on":"");
if(!V.play)return;const next=()=>{if(!KUV2||t!==KUV2.tok||!KUV2.play)return;if(KUV2.i<KUV2.sc.length-1){KUV2.i++;kuVidGo()}else{KUV2.play=false;$("kuvpl").textContent="▶ Ещё раз";KUV2.i=KUV2.sc.length}};
const after=()=>{if(!KUV2||t!==KUV2.tok)return;if(s.s){kuPlay(s.s);setTimeout(next,1900)}else if(s.seq){lzSeq(s.seq);setTimeout(next,3600)}else setTimeout(next,s.rq?Math.max(700,rqDur(s.rq,1,110)*1000-1500):900)};
setTimeout(()=>{if(KUV2&&t===KUV2.tok)kuSayRu(s.r,after)},450)}
/* ---------- Навигация и вход ---------- */
let KUT="h";
function kuNav(id){window.__rv=0;const r=document.documentElement;r.dataset.acc=me||"";r.dataset.year=1;r.dataset.role="";const n=$("nav"),w=$("wel");w.hidden=false;w.innerHTML=`Добро пожаловать!<small class="ar2">أَهْلًا وَسَهْلًا</small>`;n.hidden=false;$("hd").classList.remove("hero");$("lgg").hidden=true;n.innerHTML="";const IT=[];
const b=(l,f,on)=>{const e=document.createElement("button");e.innerHTML=l+`<small class="ar2">${D[l]||""}</small>`;if(on)e.className="on";e.onclick=f;n.appendChild(e);IT.push({l,f,on})};
b("Сегодня",kuHome,id==="ku"&&KUT==="h");b("Курс",kuMap,id==="ku"&&KUT==="m");b("Алфавит",()=>lzShow("al"),id==="bg"&&lzTab==="al");b("Рука’а",()=>lzShow("wr"),id==="bg"&&lzTab==="wr");b("Слова",()=>lzShow("wd"),id==="bg"&&lzTab==="wd");b("Логин",lgv,id==="lgn");b("Выйти",logout);bt(IT);appBar()}
{const _h=kuHome,_m=kuMap,_u=kuUnit;kuHome=function(){KUT="h";_h();kuNav("ku")};kuMap=function(){KUT="m";_m();kuNav("ku")};kuUnit=function(u){KUT="m";_u(u);kuNav("ku")}}
{const _show=show;show=function(id){const k=kuEl();if(isKU(me)&&id==="menu"){id="ku";setTimeout(()=>{if(isKU(me))kuHome()},0)}if(id==="ku"){_show("ku");k.hidden=false;try{window.scrollTo(0,0)}catch(e){}return}k.hidden=true;if(KUR&&id!=="ku")KUR=null;kuVidClose();return _show(id)}}
{const _navr=navr;navr=function(id){if(isKU(me))return kuNav(id);return _navr(id)}}
{const _login=login;login=function(k){if(isKU(k))try{localStorage.setItem("tour_"+k,"1")}catch(e){}return _login(k)}}
if(typeof tchInit==="function"){const _ti=tchInit;tchInit=function(){if(isKU(me)){try{tchOff()}catch(e){}return}return _ti()}}
