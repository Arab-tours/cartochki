/*KURS: автономный курс для начинающих (учётки kurs1…kurs3). Источник: kurs/*.js, вставляется kurs/apply.py */
const KU_ACC={kurs1:"Курс 1",kurs2:"Курс 2",kurs3:"Курс 3"};
Object.assign(NAMES,KU_ACC);Object.keys(KU_ACC).forEach(k=>{YEAR[k]=1});
const isKU=k=>!!k&&Object.prototype.hasOwnProperty.call(KU_ACC,k);
D["Сегодня"]="اليَوْمَ";D["Курс"]="الدُّرُوسُ";
IC["Сегодня"]='<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>';
IC["Курс"]='<path d="M4 19V8l8-4 8 4v11"/><path d="M9 19v-6h6v6"/>';
const KU_STRIP=t=>String(t||"").replace(/[ً-ْٰـ]/g,"");
const kuShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const kuPick=(a,n)=>kuShuf(a).slice(0,n);
const kuToday=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
function kuS(){if(!S)return null;S.ku=S.ku||{};const k=S.ku;k.u=k.u||{};k.it=k.it||{};k.d=k.d||{};return k}
function kuSave(){try{save()}catch(e){}}

/* ---------- FSRS (упрощённый FSRS-4.5, оценки: 1 — забыл, 3 — помню) ---------- */
const KU_W=[0.4,0.6,2.4,5.8,4.93,0.94,0.86,0.01,1.49,0.14,0.94,2.18,0.05,0.34,1.26,0.29,2.61];
const kuD0=g=>Math.min(10,Math.max(1,KU_W[4]-(g-3)*KU_W[5]));
function kuGrade(id,ok){const K=kuS();if(!K)return;const now=Date.now(),g=ok?3:1;let c=K.it[id];
if(!c){c={s:KU_W[g-1],d:kuD0(g),r:1,l:ok?0:1,t:now}}else{const el=Math.max(0,(now-c.t)/864e5),R=Math.pow(1+el/(9*c.s),-1);
if(ok)c.s=c.s*(Math.exp(KU_W[8])*(11-c.d)*Math.pow(c.s,-KU_W[9])*(Math.exp(KU_W[10]*(1-R))-1)+1);
else{c.s=KU_W[11]*Math.pow(c.d,-KU_W[12])*(Math.pow(c.s+1,KU_W[13])-1)*Math.exp(KU_W[14]*(1-R));c.l=(c.l||0)+1}
let d=c.d-KU_W[6]*(g-3);d=KU_W[7]*kuD0(4)+(1-KU_W[7])*d;c.d=Math.min(10,Math.max(1,d));c.r=(c.r||0)+1;c.t=now}
c.s=Math.max(0.1,Math.min(c.s,3650));c.due=now+Math.max(ok?1:0.007,c.s)*864e5;K.it[id]=c}
const kuDue=()=>{const K=kuS();if(!K)return[];const now=Date.now();return Object.keys(K.it).filter(i=>K.it[i].due<=now).sort((a,b)=>K.it[a].due-K.it[b].due)};
const kuWeak=()=>{const K=kuS();if(!K)return[];return Object.keys(K.it).filter(i=>(K.it[i].l||0)>=2&&K.it[i].s<4).slice(0,6)};

/* ---------- Почерк рука'а «от руки»: штрихи из таблицы МГИМО ---------- */
function rqLen(d){const p=d.slice(1).split(" L").map(x=>x.split(" ").map(Number));let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return Math.max(L,2)}
function rqSVG(c,k,opt){opt=opt||{};const f=(KU_RQS[c]||{})[k],i=LZRQR.indexOf(c);if(!f||i<0)return"";const sp=opt.speed||140;let t=opt.delay||0;
const ps=f.map(([w,d])=>{const L=rqLen(d),du=Math.max(.12,L/sp);const s=`<path d="${d}" stroke-width="${w}" pathLength="1" style="animation-delay:${t.toFixed(2)}s;animation-duration:${du.toFixed(2)}s"/>`;t+=du+.12;return s}).join("");
const px=((5*LZRQX[k]-.5)/4*100).toFixed(2),py=(i/27*100).toFixed(3);
return`<span class="rqx rqm" style="-webkit-mask-position:${px}% ${py}%;mask-position:${px}% ${py}%"><svg class="rqa" viewBox="0 0 192.6 168" preserveAspectRatio="none" aria-label="рука’а: ${c}" role="img">${ps}</svg></span>`}
const rqDur=(c,k,sp)=>{const f=(KU_RQS[c]||{})[k];if(!f)return 0;return f.reduce((a,[w,d])=>a+Math.max(.12,rqLen(d)/(sp||140))+.12,0)};
function rqReplay(svg){if(!svg)return;const n=svg.cloneNode(true);svg.replaceWith(n);return n}
document.addEventListener("click",e=>{const s=e.target.closest&&e.target.closest(".rqm");if(s&&!s.closest(".kuvid"))rqReplay(s.querySelector("svg.rqa"))});
/* алфавит: большая буква и формы пишутся «от руки» */
if(typeof lzDet==="function"){const _lzDet=lzDet;lzDet=function(c){_lzDet(c);try{const d=$("lzd");if(!d||!KU_RQS[c])return;const hb=d.querySelector(".lzh .lzhb");if(hb){hb.innerHTML=rqSVG(c,1,{speed:120})+`<button class="lnk rqbtn" type="button">✍ Написать ещё раз</button>`;hb.classList.add("rqon");hb.querySelector(".rqbtn").onclick=ev=>{ev.stopPropagation();rqReplay(hb.querySelector("svg.rqa"))}}
const T0=rqDur(c,1,120)+.3;const cols=c==="ا"?[1,4]:"ادذرزو".includes(c)?[1,4]:[1,2,3,4];let t=T0;d.querySelectorAll(".lzfms .lzhw").forEach((w,n)=>{const k=cols[n];if(k==null||!KU_RQS[c][k])return;w.innerHTML=rqSVG(c,k,{delay:t,speed:160});w.classList.add("rqon");t+=rqDur(c,k,160)+.15})}catch(e){}}}
