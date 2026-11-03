/* ---------- Звук ---------- */
function kuPlay(key){if(!key)return;const p=key.split("|");if(p[0]==="l")return lzPlay(key,lzSyl(p[1],p[2]));lzPlay(key,p.slice(1).join("|"))}
const kuEl=()=>{let e=$("ku");if(!e){e=document.createElement("div");e.id="ku";e.hidden=true;(document.querySelector("main")||document.body).appendChild(e)}return e};
const kuT=t=>esc(t).replace(/([\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0670]*(?:[ ،]+[\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0670]*)*)/g,'<bdi class="ar kutar">$1</bdi>');
/* ---------- Состояние юнитов ---------- */
const kuM=id=>{const K=kuS();return K&&K.u[id]?K.u[id].m||0:0};
const kuDone=id=>kuM(id)>=80;
function kuModOpen(mi){return mi===0||KU_MOD[mi-1].u.every(x=>kuDone(x.id))}
function kuOpen(u){const K=kuS();if(!K)return false;if(K.u[u.id])return true;if(!kuModOpen(u.mi))return false;if(u.ty==="C"||u.ui===0)return true;return kuDone(KU_MOD[u.mi].u[u.ui-1].id)}
const kuNext=()=>KU_ORD.find(u=>u.ty!=="C"&&!kuDone(u.id)&&kuOpen(u))||KU_ORD.find(u=>!kuDone(u.id));
const kuPct=()=>Math.round(KU_ORD.filter(u=>kuDone(u.id)).length/KU_ORD.length*100);
function kuSetM(id,score){const K=kuS();const u=K.u[id]||(K.u[id]={m:0,n:0});u.n++;u.m=Math.max(u.m,score);u.t=Date.now();
const U=KU_U[id];if(U&&U.ty==="C"&&score>=80){KU_MOD.find(m=>m.id===U.m).u.forEach(x=>{const q=K.u[x.id]||(K.u[x.id]={m:0,n:0});q.m=Math.max(q.m,80)})}}
function kuStreak(){const K=kuS();let n=0;for(let i=0;i<400;i++){const d=new Date(Date.now()-i*864e5),k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");if(K.d[k])n++;else if(i>0)break}return n}
/* ---------- Плеер упражнений ---------- */
let KUR=null;
function kuRun(list,o){list=list.filter(Boolean);if(!list.length){toast("Пока нечего тренировать");return}KUR={l:list,i:0,ok:0,n:0,fo:0,fn:0,o:o||{},re:new Set()};kuShow();kuStep()}
function kuStep(){const R=KUR,g=kuEl();if(R.i>=R.l.length)return kuEnd();const e=R.l[R.i];R.ans=null;R.sel=[];
const top=`<div class="kutop"><button class="lnk" id="kux">✕ Закончить</button><span class="kupg"><i style="width:${Math.round(R.i/R.l.length*100)}%"></i></span><small>${R.i+1}/${R.l.length}</small></div>`;
let h=`${top}<div class="kuex"><p class="kuq">${e.q}</p>${e.qa?`<div class="ar kuqa">${e.qa}</div>`:""}${e.au?`<button class="b kuau" id="kuau" type="button">🔊 Послушать</button>`:""}`;
if(e.o)h+=`<div class="kuo${e.o.some(x=>x.ar)?" ar":""}">${e.o.map((x,i)=>`<button class="b" data-i="${i}" type="button">${x.ar?`<span class="ar">${x.h}</span>`:esc(x.h)}</button>`).join("")}</div>`;
if(e.b||e.d){const tiles=e.b?kuShuf(e.b.w.concat(e.b.x)):kuShuf([...e.d.w].concat(e.d.x));h+=`<div class="kuans ar" id="kuans" dir="rtl"></div><div class="kutl ar" dir="rtl">${tiles.map((t,i)=>`<button class="b" data-t="${i}" type="button">${t}</button>`).join("")}</div><div class="kurow"><button class="b" id="kubk" type="button">⌫ Стереть</button><button class="b ok" id="kuck" type="button">Проверить</button></div>`;R.tiles=tiles}
h+=`<div class="kufb" id="kufb" hidden></div></div>`;g.innerHTML=h;
$("kux").onclick=()=>{if(R.n&&!confirm("Закончить занятие? Ответы уже засчитаны."))return;kuEnd(true)};
if(e.au){$("kuau").onclick=()=>kuPlay(e.au);setTimeout(()=>kuPlay(e.au),250)}
g.querySelectorAll(".kuo [data-i]").forEach(b=>b.onclick=()=>kuAns(!!e.o[+b.dataset.i].ok,b));
if(e.b||e.d){const sep=e.b?" ":"";const upd=()=>{$("kuans").textContent=R.sel.map(i=>R.tiles[i]).join(sep);g.querySelectorAll(".kutl [data-t]").forEach(b=>b.disabled=R.sel.includes(+b.dataset.t))};
g.querySelectorAll(".kutl [data-t]").forEach(b=>b.onclick=()=>{if(R.ans!=null)return;R.sel.push(+b.dataset.t);upd()});$("kubk").onclick=()=>{if(R.ans!=null)return;R.sel.pop();upd()};
$("kuck").onclick=()=>{if(R.ans!=null||!R.sel.length)return;const got=R.sel.map(i=>R.tiles[i]);const ok=e.b?got.join(" ")===e.b.w.join(" "):got.join("")===e.d.w;kuAns(ok,null)}}}
function kuAns(ok,btn){const R=KUR,e=R.l[R.i];if(R.ans!=null)return;R.ans=ok;R.n++;if(ok)R.ok++;
if(!R.re.has(R.i)){kuGrade(e.id,ok);R.fn++;if(ok)R.fo++}const K=kuS(),td=kuToday();K.d[td]=(K.d[td]||0)+1;
const g=kuEl();g.querySelectorAll(".kuo [data-i]").forEach(b=>{const x=e.o[+b.dataset.i];if(x.ok)b.classList.add("kugood");else if(b===btn)b.classList.add("kubad");b.disabled=true});
const right=e.o?(e.o.find(x=>x.ok)||{}).h:e.b?e.b.w.join(" "):e.d?e.d.w:"";
const fb=$("kufb");fb.hidden=false;fb.className="kufb "+(ok?"ok":"no");fb.innerHTML=`<b>${ok?"Верно!":"Не совсем."}</b>${!ok&&!e.o?` Правильно: <span class="ar">${right}</span>.`:""}${e.why?`<div class="kuwhy">${/[؀-ۿ]/.test(e.why)?e.why.replace(/([؀-ۿ][؀-ۿً-ْٰ]*)/g,'<span class="ar">$1</span>'):esc(e.why)}</div>`:""}<button class="b ok" id="kunx" type="button">Дальше</button>`;
if(!ok&&!R.re.has(R.i)){R.l.push(Object.assign({},e));R.re.add(R.l.length-1)}
$("kunx").onclick=()=>{R.i++;kuStep()};if(ok)setTimeout(()=>{if(KUR===R&&R.ans===true&&R.l[R.i]===e){R.i++;kuStep()}},900);kuSave()}
function kuEnd(stop){const R=KUR;if(!R)return;KUR=null;const sc=R.fn?Math.round(R.fo/R.fn*100):0;if(stop&&R.fn<R.l.length-R.re.size)stop=true;else stop=false;
if(R.o.unit&&!stop)kuSetM(R.o.unit,sc);kuSave();if(R.o.onEnd&&!stop)return R.o.onEnd(sc);
const g=kuEl();g.innerHTML=`<div class="kuend"><div class="kubig">${stop?"⏸":sc>=80?"🎉":"💪"}</div><h2>${stop?"Занятие прервано":sc>=80?"Отлично!":"Хорошая тренировка"}</h2><p>Верных ответов: <b>${R.ok}</b> из ${R.n}${R.o.unit&&!stop?` · освоение урока: <b>${kuM(R.o.unit)}%</b>`:""}</p>${R.o.unit&&!stop&&sc<80?'<p class="mu">Чтобы открыть следующий урок, наберите 80% — повторите тренировку.</p>':""}<div class="kurow"><button class="b ok" id="kuh" type="button">К плану на сегодня</button>${R.o.unit?`<button class="b" id="kuag" type="button">Ещё раз</button>`:""}</div></div>`;
$("kuh").onclick=kuHome;if($("kuag"))$("kuag").onclick=()=>kuTrain(KU_U[R.o.unit])}
function kuTrain(u){kuRun(kuGen(u,u.ty==="C"?15:10),{unit:u.id})}
/* ---------- Экраны ---------- */
function kuShow(){show("ku")}
function kuHome(){kuShow();const K=kuS(),g=kuEl();if(!K)return;if(S.nv==null&&!K.nv0){try{S.nv=Math.max(0,...TNEWS.map(x=>x.n))}catch(e){}K.nv0=1;kuSave()}const due=kuDue(),weak=kuWeak(),nx=kuNext(),st=kuStreak(),td=K.d[kuToday()]||0;
const fresh=!K.pl&&!Object.keys(K.u).length;
let h=`<h2>Сегодня<small class="ar2">اليَوْمَ</small></h2>`;
if(fresh)h+=`<div class="kucard kuhi"><h3>С чего начать?</h3><p>Курс ведёт сам: объясняет, тренирует и напоминает повторить. Если вы уже знаете буквы или первые слова, пройдите входной тест — курс пропустит знакомое.</p><div class="kurow"><button class="b ok" id="kupl" type="button">Входной тест (~5 мин)</button><button class="b" id="ku0" type="button">Начать с нуля</button></div></div>`;
h+=`<div class="kuchips"><span class="chip">🔥 Серия: <b>${st}</b> ${st%10===1&&st!==11?"день":st%10>=2&&st%10<=4&&(st<10||st>20)?"дня":"дней"}</span><span class="chip">Сегодня ответов: <b>${td}</b></span><span class="chip">Курс пройден: <b>${kuPct()}%</b></span></div>`;
h+=`<div class="kucard"><h3>План на сегодня</h3><ol class="kuplan">${due.length?`<li>Повторение: <b>${due.length}</b> ${due.length%10===1&&due.length!==11?"карточка":"карт."} — пора освежить</li>`:`<li class="mu">Повторять пока нечего — всё свежее</li>`}${weak.length?`<li>Слабые места: <b>${weak.length}</b></li>`:""}${nx?`<li>Урок: <b>${kuT(nx.t)}</b>${kuM(nx.id)?` · освоено ${kuM(nx.id)}%`:""}</li>`:"<li>Все уроки пройдены 🎓</li>"}</ol>
<button class="b ok kugo" id="kugo" type="button">${due.length||weak.length?"Начать занятие":"Перейти к уроку"}</button></div>`;
if(nx)h+=`<div class="kucard kunx"><small class="mu">${esc(KU_MOD.find(m=>m.id===nx.m).t)}</small><h3>${kuT(nx.t)}</h3><span class="kupg"><i style="width:${kuM(nx.id)}%"></i></span><button class="b" id="kuun" type="button">Открыть урок</button></div>`;
g.innerHTML=h;
if($("kupl"))$("kupl").onclick=()=>kuPlace(0,0);if($("ku0"))$("ku0").onclick=()=>{K.pl=1;kuSave();kuHome()};
$("kugo").onclick=()=>{const ids=[...new Set(due.slice(0,14).concat(weak))];const ex=ids.map(kuExById).filter(Boolean);if(ex.length)kuRun(ex,{onEnd:sc=>{toast("Повторение готово: "+sc+"%");nx?kuUnit(nx):kuHome()}});else if(nx)kuUnit(nx)};
if($("kuun"))$("kuun").onclick=()=>kuUnit(nx)}
function kuMap(){kuShow();const g=kuEl();let h=`<h2>Курс<small class="ar2">الدُّرُوسُ</small></h2><p class="mu">Курс устроен как карта навыков: следующий урок открывается, когда текущий освоен на 80%. Контрольную модуля можно сдать досрочно — тогда весь модуль засчитается.</p>`;
KU_MOD.forEach((m,mi)=>{const d=m.u.filter(u=>kuDone(u.id)).length;h+=`<details class="kumod" ${m.u.some(u=>!kuDone(u.id))&&m.u.some(u=>kuOpen(u))&&(mi===0||KU_MOD[mi-1].u.every(u=>kuDone(u.id)))?"open":""}><summary><span class="kun">${mi+1}</span><span><b>${esc(m.t)}</b><small class="ar2">${m.ar}</small><small class="mu">${d} из ${m.u.length} уроков</small></span></summary><div class="kuus">`+m.u.map(u=>{const op=kuOpen(u),dn=kuDone(u.id),mm=kuM(u.id);return`<button class="kuu${dn?" dn":op?" op":" lk"}${u.ty==="C"?" kuc":""}" data-u="${u.id}" type="button"><span class="kui">${dn?"✓":op?(u.ty==="C"?"★":"▶"):"🔒"}</span><span class="kut">${kuT(u.t)}${mm&&!dn?`<small>${mm}%</small>`:""}</span></button>`}).join("")+`</div></details>`});
g.innerHTML=h;g.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{const u=KU_U[b.dataset.u];if(!kuOpen(u)){toast("Сначала освойте предыдущий урок");return}kuUnit(u)})}
function kuLetterCard(c){const l=KU_LT(c);if(!l)return"";return`<div class="kulc"><div class="kulh"><span class="ar kubl">${c}</span>${KU_RQS[c]?`<span class="kurq">${rqSVG(c,1,{speed:120})}</span>`:""}<div><b>${l[1]}</b><br><small class="mu">звук: ${esc(l[2])}</small></div></div><div class="kufm">${lzForms(l).map(f=>`<span><small>${f[0]}</small><b class="ar">${f[1]}</b></span>`).join("")}</div><p><small>${esc(l[5])}</small></p>${c!=="ا"&&lzSylSrc(c,"a")?`<div class="kurow">${KU_VOW.map(v=>`<button class="b" data-s="l|${c}|${v[0]}" type="button"><span class="ar">${c+v[1]}</span> ${kuSylR(c,v[2])}</button>`).join("")}</div>`:""}</div>`}
function kuUnit(u){kuShow();const g=kuEl(),m=KU_MOD.find(x=>x.id===u.m);let h=`<button class="lnk" id="kubm" type="button">← Курс</button><small class="mu kucr">${esc(m.t)}</small><h2>${kuT(u.t)}</h2>`;const G=u.g&&KU_G[u.g];
const hasVid=u.ty==="L"||(G&&G.sc);if(hasVid)h+=`<button class="kuvbtn" id="kuvid" type="button"><span>▶</span><b>Смотреть ролик</b><small>${u.ty==="L"?"как пишется и звучит каждая буква":"объяснение за 1–2 минуты"}</small></button>`;
if(u.ty==="L")h+=kuLetters(u).map(kuLetterCard).join("")+`<p class="mu">Потренируйте почерк в разделе «Прописи»: напишите буквы в тетради и отправьте фото — ИИ проверит.</p>`;
if(G)h+=`<div class="kucard kuth"><p>${G.th.replace(/([؀-ۿ][؀-ۿً-ْٰ]*(?:\s[؀-ۿ][؀-ۿً-ْٰ]*)*)/g,'<span class="ar">$1</span>')}</p></div>`;
if(u.ty==="V"&&u.g==="vow")h+=kuLetters(u).map(kuLetterCard).join("");if(u.ty==="V"&&u.g==="long")h+=["ا","و"].map(kuLetterCard).join("");
if(u.ty==="W"||u.ty==="R")h+=`<div class="kuwl">`+kuWords(u).map(w=>`<button class="kuw" data-s="${esc(kuAu(w))}" type="button"><span class="ar">${w.a}</span><small>${esc(w.tr)} — ${esc(w.ru)}</small></button>`).join("")+`</div>`;
if(u.ty==="P")h+=`<div class="kucard"><p>Здесь только слух: прозвучит слог, нужно выбрать, какая буква. Пары, которые русскому уху кажутся одинаковыми: ح/ه, ع/ء, س/ص, د/ض, ت/ط, ك/ق, ذ/ز/ظ.</p></div>`;
if(u.ty==="C")h+=`<div class="kucard"><p>15 заданий по всему модулю «${esc(m.t)}». Нужно 80% верных ответов. Если сдадите — весь модуль засчитается, даже если вы пропустили уроки.</p></div>`;
h+=`<div class="kurow kubot"><button class="b ok" id="kutr" type="button">${u.ty==="C"?"Начать контрольную":"Тренировка · 10 заданий"}</button></div>${kuM(u.id)?`<p class="mu">Освоено: ${kuM(u.id)}%</p>`:""}`;
g.innerHTML=h;$("kubm").onclick=kuMap;$("kutr").onclick=()=>kuTrain(u);if($("kuvid"))$("kuvid").onclick=()=>kuVid(u);
g.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>kuPlay(b.dataset.s));const K=kuS();if(!K.u[u.id]){K.u[u.id]={m:0,n:0,t:Date.now()};kuSave()}}
/* ---------- Входной тест: контрольные модулей по порядку ---------- */
function kuPlace(mi){const m=KU_MOD[mi];if(!m){kuS().pl=1;kuSave();return kuHome()}const c=m.u.find(u=>u.ty==="C");
const g=kuEl();kuShow();g.innerHTML=`<h2>Входной тест · часть ${mi+1}</h2><div class="kucard"><p>Модуль «${esc(m.t)}»: 12 заданий. Если наберёте 80%, модуль засчитается и тест перейдёт к следующему. Не знаете ответа — выбирайте наугад, это нормально.</p><div class="kurow"><button class="b ok" id="kups" type="button">Начать</button><button class="b" id="kupx" type="button">Хватит, начать учиться</button></div></div>`;
$("kups").onclick=()=>kuRun(kuGen(c,12),{onEnd:sc=>{kuSetM(c.id,sc);kuSave();if(sc>=80){toast("Модуль засчитан: "+sc+"%");kuPlace(mi+1)}else{kuS().pl=1;kuSave();const g2=kuEl();g2.innerHTML=`<div class="kuend"><div class="kubig">🧭</div><h2>Тест завершён</h2><p>${mi?`Засчитано модулей: <b>${mi}</b>. `:""}Начнём с модуля «${esc(m.t)}» — результат: ${sc}%.</p><button class="b ok" id="kuh" type="button">К плану на сегодня</button></div>`;$("kuh").onclick=kuHome}}});
$("kupx").onclick=()=>{kuS().pl=1;kuSave();kuHome()}}
