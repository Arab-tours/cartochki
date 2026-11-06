/*TOM2: «2 том Яковенко» — лексика 2-й части (хамзованные глаголы), уроки 1–6. Данные: srez/t2data.js (python3 srez/tom2/build.py) */
const T2L=T2D.map(u=>{const L=u.sets.map(s=>({t:s.t,s:s.s,w:s.w.map(x=>({a:x.a,r:x.r}))}));L.t2=1;L.n=u.n;L.sub=u.sub;return L});
const T2ALL=()=>T2L.flat();
T2ALL().forEach(c=>c.w.forEach(w=>{try{IDX[w.a]=IDX[w.a]||w.r}catch(e){}}));
function tom2(){T1ON=false;cur=0;menu.innerHTML="";crumb([{t:"Карточки",f:()=>{home();show("menu")}},{t:"2 том Яковенко"}]);
menu.insertAdjacentHTML("beforeend",`<h2 class="pt">2 том Яковенко<small class="ar2">الْجُزْءُ الثَّانِي</small></h2><p class="mu" style="margin:0 4px 12px">«Учебник арабского языка для продолжающих», часть II «Хамзованные глаголы»: слова и выражения уроков 1–6. Все слова есть и в «Словаре».</p>`);
T2L.forEach((L,k)=>{const ws=L.reduce((a,c)=>a+c.w.length,0),pc=pcOf(L);mi("t2u"+k,U2(String(L.n),"Урок "+L.n,L.sub+" · "+ws+" сл.",pc+"%",pc),()=>t2les(k),"t1")})}
function t2les(k){T1ON=false;const L=T2L[k];cur=L;menu.innerHTML="";crumb([{t:"Карточки",f:()=>{home();show("menu")}},{t:"2 том Яковенко",f:tom2},{t:"Урок "+L.n}]);
menu.insertAdjacentHTML("beforeend",`<h2 class="pt">Урок ${L.n}</h2><p class="mu" style="margin:0 4px 12px">${L.sub.replace(/([\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0670،\s]*[\u0600-\u06FF\u064B-\u0652\u0670])/g,'<span class="ar">$1</span>')}</p>`);
L.forEach((c,i)=>{const pc=c.w.length?Math.round(lrn(S,c)/c.w.length*100):0;mi("t2s"+i,U2(String(i+1),c.t,c.w.length+" сл.",pc+"%",pc),()=>{cur=L;open(i)})})}
/* словарь: добавить 2 том */
{const _dictv=dictv;dictv=function(){_dictv();if(yr(me)!==1){const g=$("dg");T2L.forEach((L,k)=>g.insertAdjacentHTML("beforeend",`<option value="t2_${k}">2 том · урок ${L.n}</option>`));g.insertAdjacentHTML("beforeend",'<option value="t2_all">2 том · все уроки</option>')}$("dg").onchange=dsel}}
{const _dsel=dsel;dsel=function(){const g=$("dg").value;if(!/^t2_/.test(g))return _dsel();const l=g==="t2_all"?[]:T2L[+g.slice(3)];$("ds").hidden=!l.length;$("ds").innerHTML='<option value="">Все подгруппы</option>'+l.map((c,k)=>`<option value="${k}">${esc(c.t)}</option>`).join("");dsr()}}
{const _dlist=dlist;dlist=function(){const g=$("dg").value,k=$("ds").value;if(!/^t2_/.test(g)){const r=_dlist();if(g||yr(me)===1)return r;const seen={};r.forEach(w=>seen[w.a]=1);const q=nz($("dq").value.trim());T2ALL().forEach(c=>c.w.forEach(w=>{if(!seen[w.a]&&(!q||nzc(w.a).includes(q)||rlc(w.r).includes(q))){seen[w.a]=1;r.push(w)}}));return r}
let sets=g==="t2_all"?T2ALL():T2L[+g.slice(3)];if(g!=="t2_all"&&k!=="")sets=[sets[+k]];const seen={},r=[];sets.forEach(c=>c.w.forEach(w=>{if(!seen[w.a]){seen[w.a]=1;r.push(w)}}));const q=nz($("dq").value.trim());return q?r.filter(w=>nzc(w.a).includes(q)||rlc(w.r).includes(q)):r}}

/* Тексты 2 тома (srez/t2texts.js → T2X) в разделе «Тексты» 2 курса */
if(typeof AU!=="undefined"&&typeof T2AU!=="undefined")Object.keys(T2AU).forEach(k=>{if(!AU[k])AU[k]=T2AU[k]});
if(typeof TX!=="undefined"&&typeof T2X!=="undefined"){T2X.forEach(t=>{if(!TX.some(x=>x.k===t.k))TX.push(t)});
if(typeof txtv==="function"){const _t2txtv=txtv;txtv=function(){_t2txtv.apply(this,arguments);try{const l=$("tml");if(!l)return;const tt=new Set(T2X.map(t=>t.t));const f=[...l.children].find(b=>{const x=b.querySelector("b");return x&&tt.has(x.textContent)});if(f){const h=document.createElement("h3");h.className="t2xh";h.innerHTML='2 том Яковенко <small class="ar2">الْجُزْءُ الثَّانِي</small>';h.style.margin="18px 4px 6px";l.insertBefore(h,f)}}catch(e){}}}}
