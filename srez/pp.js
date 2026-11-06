/*PP: «Самостоятельная: полит. перевод» — подчёркнутая лексика уроков 6–7 (фото страниц учебника) */
const PPL=[{t:"Урок 6",s:"с. 45–47",w:[
{a:"نَائِبُ رَئِيسِ الْوُزَرَاءِ",r:"заместитель премьер-министра, вице-премьер"},
{a:"الْمَغْرِبُ",r:"Марокко"},
{a:"شَمَالُ إِفْرِيقِيَا",r:"Северная Африка"},
{a:"اِسْتَهْدَفَ · يَسْتَهْدِفُ · اِسْتِهْدَافًا",r:"иметь целью что-л. (X пор.; вин. п. или إِلَى)"},
{a:"تَحَرُّكٌ عَسْكَرِيٌّ ضِدَّ…",r:"военная акция против…"},
{a:"نَقَلَ · يَنْقُلُ · نَقْلًا",r:"пересказывать; передавать"},
{a:"لَدَى وُصُولِهِ إِلَى…",r:"по прибытии в…"},
{a:"جَدْوَلُ أَعْمَالٍ",r:"повестка дня"},
{a:"عَقَدَ · يَعْقِدُ · عَقْدًا",r:"созывать, проводить (напр., совещание, пресс-конференцию)"},
{a:"رَكَّزَ · يُرَكِّزُ · تَرْكِيزًا عَلَى…",r:"сосредоточивать, концентрировать на…"},
{a:"الْقَضِيَّةُ الْفِلَسْطِينِيَّةُ",r:"палестинская проблема"},
{a:"تَهْدِيدٌ · تَهْدِيدَاتٌ",r:"угроза"},
{a:"هَدَّدَ · يُهَدِّدُ · تَهْدِيدًا بِـ…",r:"угрожать (кому-л.) чем-л."},
{a:"هُجُومٌ · هُجُومَاتٌ",r:"нападение"},
{a:"هَجَمَ · يَهْجُمُ · هُجُومًا عَلَى…",r:"нападать на…"}]},
{t:"Урок 7",s:"с. 56–58",w:[
{a:"مَجْلِسُ التَّنْسِيقِ",r:"координационный совет"},
{a:"بِاتِّخَاذِ خُطُوَاتٍ",r:"предприняв шаги (досл.: принятием шагов)"},
{a:"اِتَّخَذَ · يَتَّخِذُ · اِتِّخَاذًا",r:"предпринимать"},
{a:"شَعْبٌ · شُعُوبٌ",r:"народ"},
{a:"إِجْرَاءَاتُ تَنْفِيذِ الِاتِّفَاقِ",r:"меры по выполнению соглашения"},
{a:"نَفَّذَ · يُنَفِّذُ · تَنْفِيذًا",r:"выполнять"},
{a:"مَوَاعِيدُ مُحَدَّدَةٌ",r:"конкретные сроки"},
{a:"اِخْتَتَمَ · يَخْتَتِمُ · اِخْتِتَامًا",r:"завершать"}]}];
PPL.pp=1;
PPL.forEach(c=>c.w.forEach(w=>{try{IDX[w.a]=IDX[w.a]||w.r}catch(e){}}));
function ppv(){T1ON=false;cur=0;menu.innerHTML="";crumb([{t:"Карточки",f:()=>{home();show("menu")}},{t:"Самостоятельная: полит. перевод"}]);
menu.insertAdjacentHTML("beforeend",`<h2 class="pt">Самостоятельная: полит. перевод<small class="ar2">التَّرْجَمَةُ السِّيَاسِيَّةُ</small></h2><p class="mu" style="margin:0 4px 12px">Только подчёркнутые слова и выражения из словарей уроков 6 и 7.</p>`);
mi("ppcs",U2("☰","Шпаргалка","все слова на одной странице, самопроверка",""),ppcs,"t1");
PPL.forEach((c,i)=>{const pc=c.w.length?Math.round(lrn(S,c)/c.w.length*100):0;mi("pp"+i,U2(String(i+1),c.t,c.s+" · "+c.w.length+" сл.",pc+"%",pc),()=>{cur=PPL;open(i)},"t1")})}

/* шпаргалка: всё на одной странице, поиск, скрыть арабский/русский для самопроверки */
let PPM="all";
function ppcs(){T1ON=false;cur=0;menu.innerHTML="";crumb([{t:"Карточки",f:()=>{home();show("menu")}},{t:"Полит. перевод",f:ppv},{t:"Шпаргалка"}]);
if(!document.getElementById("ppcss")){const st=document.createElement("style");st.id="ppcss";st.textContent=`
.ppbar{position:sticky;top:6px;z-index:5;background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:0 6px 18px rgba(0,0,0,.12);padding:8px;display:flex;flex-direction:column;gap:8px}
.ppbar input{font-size:16px;background:var(--bg)!important;width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink)}
.ppseg{display:flex;gap:4px;padding:3px;border-radius:12px;background:var(--line)}
.ppseg button{flex:1;border:0;border-radius:9px;padding:8px 4px;font:inherit;font-size:14px;background:transparent;color:var(--ink);cursor:pointer}
.ppseg button.on{background:var(--card);box-shadow:0 1px 3px rgba(0,0,0,.15);font-weight:600}
.pph{margin:16px 4px 6px;font-size:15px;font-weight:600;color:var(--ink)}
.ppl{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.ppr{display:grid;grid-template-columns:1fr 1.15fr;gap:12px;align-items:center;padding:10px 14px;border-top:1px solid var(--line);cursor:pointer}
.ppr:first-child{border-top:0}
.ppr .ru{font-size:15px;line-height:1.35}
.ppr .ar{font-size:24px;line-height:1.7;text-align:right;direction:rtl;font-family:"Noto Sans Arabic",serif}
.ppr .hd{color:transparent;background:color-mix(in srgb,var(--sea2,#888) 14%,transparent);border-radius:8px;transition:color .2s}
.ppr .hd::selection{color:transparent}
.ppr .hd.op{color:inherit;background:none}
@media(max-width:420px){.ppr{grid-template-columns:1fr;gap:2px}.ppr .ar{text-align:right}}
@media print{.ppbar,.crumb,nav,#tabs{display:none!important}.ppr{break-inside:avoid}}`;document.head.appendChild(st)}
menu.insertAdjacentHTML("beforeend",`<h2 class="pt">Шпаргалка<small class="ar2">مُذَكِّرَةٌ</small></h2>
<div class="ppbar"><input id="ppq" type="search" placeholder="Поиск: по-русски или по-арабски" autocomplete="off">
<div class="ppseg" role="group" aria-label="Режим"><button data-m="all">Всё видно</button><button data-m="ar">Скрыть арабский</button><button data-m="ru">Скрыть русский</button></div></div><div id="ppout"></div>`);
const strip=t=>String(t||"").replace(/[\u064B-\u0652\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").toLowerCase();
const draw=()=>{const q=strip($("ppq").value.trim());let h="";PPL.forEach(c=>{const ws=c.w.filter(w=>!q||strip(w.a).includes(q)||w.r.toLowerCase().includes(q));if(!ws.length)return;
h+=`<div class="pph">${esc(c.t)} · ${esc(c.s)}</div><div class="ppl">`+ws.map(w=>`<div class="ppr"><span class="ru${PPM==="ru"?" hd":""}">${esc(w.r)}</span><span class="ar${PPM==="ar"?" hd":""}">${esc(w.a)}</span></div>`).join("")+`</div>`});
$("ppout").innerHTML=h||'<p class="mu" style="margin:16px 4px">Ничего не найдено.</p>';
$("ppout").querySelectorAll(".ppr").forEach(r=>r.onclick=()=>r.querySelectorAll(".hd").forEach(x=>x.classList.toggle("op")));
menu.querySelectorAll(".ppseg button").forEach(b=>b.classList.toggle("on",b.dataset.m===PPM))};
menu.querySelectorAll(".ppseg button").forEach(b=>b.onclick=()=>{PPM=b.dataset.m;draw()});$("ppq").oninput=draw;draw()}
