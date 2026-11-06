/*DIAL: диалектные соответствия (халиджи, египетский, левантийский) мелким шрифтом в карточках и словаре. Показываются только для слов, которые в диалекте звучат иначе. Выбор — при входе и в «Ещё» → «Диалект». */
/* формат: литературная форма | халиджи | египетский | левантийский ; «!» в начале — сопоставлять только по огласовке (омографы); пусто — как в литературном */
const DLRAW=`أَرَادَ|بَغَى · يَبْغِي (أَبْغِي، أَبِي — хочу)|عَايِزْ / عَاوِزْ (хочу)|بِدِّي (хочу), بِدُّه (хочет)
!ذَهَبَ|رَاحْ · يْرُوحْ|رَاحْ · يِرُوحْ|رَاحْ · يْرُوحْ
جَاءَ|جَا · يِجِي|جِهْ · يِيجِي|إِجَا · يِجِي
أَتَى|جَا · يِجِي|جِهْ · يِيجِي|إِجَا · يِجِي
!رَأَى|شَافْ · يْشُوفْ|شَافْ · يِشُوفْ|شَافْ · يْشُوفْ
!نَظَرَ|طَالَعْ · يْطَالِعْ|بَصّْ · يِبُصّْ|اِطَّلَّعْ · يِطَّلَّعْ
!فَعَلَ|سَوَّى · يْسَوِّي|عَمَلْ · يِعْمِلْ|عِمِلْ · يَعْمِلْ
عَمِلَ|اِشْتَغَلْ · يِشْتَغِلْ|اِشْتَغَلْ · يِشْتَغَلْ|اِشْتَغَلْ · يِشْتِغِلْ
!عَمَلٌ|شُغُلْ / دَوَامْ|شُغْلْ|شُغْلْ
أَعْطَى|عَطَى · يَعْطِي|اِدَّى · يِدِّي|عَطَى · يَعْطِي
أَخَذَ|خَذْ · يَاخِذْ|خَدْ · يَاخُدْ|أَخَدْ · يَاخُدْ
!أَكَلَ|كَلْ · يَاكِلْ|كَلْ · يَاكُلْ|أَكَلْ · يَاكُلْ
تَكَلَّمَ|تْكَلَّمْ / سُولَفْ|اِتْكَلِّمْ · يِتْكَلِّمْ|حَكَى · يِحْكِي
اِسْتَطَاعَ|قِدَرْ · يِقْدَرْ|قِدِرْ · يِقْدَرْ|فِيهْ + местоим.: فِينِي — я могу
وَجَدَ|لِقَى · يِلْقَى|لَقَى · يِلَاقِي|لَاقَى · يْلَاقِي
!بَحَثَ|دَوَّرْ عَلَى|دَوَّرْ عَلَى|دَوَّرْ عَلَى
اِنْتَظَرَ|نِطَرْ · يِنْطِرْ|اِسْتَنَّى · يِسْتَنَّى|اِسْتَنَّى · يِسْتَنَّى
جَلَسَ|قَعَدْ · يِقْعِدْ|قَعَدْ · يُقْعُدْ|قَعَدْ · يُقْعُدْ
اِسْتَيْقَظَ|قَعَدْ مِنَ النُّومْ|صِحِي · يِصْحَى|فَاقْ · يْفِيقْ
عَادَ|رِجَعْ · يِرْجَعْ|رِجِعْ · يِرْجَعْ|رِجِعْ · يِرْجَعْ
خَرَجَ|طَلَعْ · يِطْلَعْ|طِلِعْ · يِطْلَعْ|طِلِعْ · يِطْلَعْ
صَعِدَ|طَلَعْ · يِطْلَعْ|طِلِعْ · يِطْلَعْ|طِلِعْ · يِطْلَعْ
أَحَبَّ|حَبّْ · يْحِبّْ|حَبّْ · يِحِبّْ|حَبّْ · يْحِبّْ
اِشْتَرَى|شَرَى · يِشْرِي||
رَكَضَ||جِرِي · يِجْرِي|
أَرْسَلَ|طَرَّشْ / رَسَّلْ|بَعَتْ · يِبْعَتْ|بَعَتْ · يِبْعَتْ
أَغْلَقَ|سَكَّرْ · يْسَكِّرْ|قَفَلْ · يِقْفِلْ|سَكَّرْ · يْسَكِّرْ
تَذَكَّرَ||اِفْتَكَرْ · يِفْتِكِرْ|
بَدَأَ|بَدَا · يِبْدَا|اِبْتَدَى · يِبْتِدِي|بَلَّشْ · يْبَلِّشْ
أَنْهَى|خَلَّصْ · يْخَلِّصْ|خَلَّصْ · يِخَلَّصْ|خَلَّصْ · يْخَلِّصْ
وَضَعَ|حَطّْ · يْحُطّْ (класть)|حَطّْ · يِحُطّْ (класть)|حَطّْ · يْحُطّْ (класть)
حَمَلَ|شَالْ · يْشِيلْ|شَالْ · يِشِيلْ|حَمَلْ / شَالْ
اِتَّصَلَ|دَقّْ · يْدِقّْ (по телефону)|كَلِّمْ · يِكَلِّمْ (по телефону)|دَقّْ · يْدِقّْ (по телефону)
أَجَابَ|رَدّْ · يْرُدّْ|رَدّْ · يِرُدّْ|رَدّْ · يْرُدّْ
بَكَى|صَاحْ · يْصِيحْ|عَيَّطْ · يِعَيَّطْ|
اِسْتَرَاحَ|اِرْتَاحْ · يِرْتَاحْ|اِرْتَاحْ · يِرْتَاحْ|اِرْتَاحْ · يِرْتَاحْ
!حَدَثَ|صَارْ · يْصِيرْ|حَصَلْ · يِحْصَلْ|صَارْ · يْصِيرْ
أَصْبَحَ|صَارْ · يْصِيرْ|بَقَى · يِبْقَى|صَارْ · يْصِيرْ
أَحْضَرَ|يَابْ · يْيِيبْ (جَابْ)|جَابْ · يِجِيبْ|جَابْ · يْجِيبْ
!ظَنَّ|حَسَبْ / ظَنّْ|اِفْتَكَرْ · يِفْتِكِرْ|فَكَّرْ / حَسَبْ
سَوْفَ|بَـ (بَرُوحْ — пойду)|هَـ / حَـ (هَرُوحْ — пойду)|رَحْ (رَحْ رُوحْ — пойду)
مَاذَا|شِنُو / وِشْ|إِيهْ|شُو
لِمَاذَا|لَيْشْ|لِيهْ|لَيْشْ
كَيْفَ|شْلُونْ|إِزَّايْ|كِيفْ
أَيْنَ|وَيْنْ|فِينْ|وَيْنْ
مَتَى||إِمْتَى|إِيمْتَى
كَمْ||كَامْ|قَدِّيشْ
!مَنْ|مِنُو|مِينْ|مِينْ
هٰذَا||دَهْ|هَادَا / هَيْدَا
هٰذِهِ|هٰذِي|دِي|هَادِي / هَيْدِي
هُنَا|هْنِي||هُونْ
هُنَاكَ|||هُونِيكْ (там)
الْآنَ|الْحِينْ|دِلْوَقْتِي|هَلَّقْ
نَعَمْ|إِي / إِيهْ|أَيْوَهْ|إِي
لَيْسَ|مُو|مِشْ|مِشْ
لِأَنَّ|عَشَانْ / لِأَنّْ|عَشَانْ|لِأَنُّو
فَقَطْ|بَسّْ|بَسّْ|بَسّْ
لٰكِنْ|بَسّْ|بَسّْ|بَسّْ
أَيْضًا|بَعَدْ|كَمَانْ|كَمَانْ
هٰكَذَا|جِذِي|كِدَهْ|هَيْكْ
يَجِبُ|لَازِمْ|لَازِمْ|لَازِمْ
عِنْدَمَا|لَمَّا|لَمَّا|لَمَّا
جِدًّا|وَايِدْ|أَوِي|كْتِيرْ
كَثِيرٌ|وَايِدْ|كْتِيرْ|كْتِيرْ
قَلِيلٌ|شْوَيّْ|شْوَيَّةْ|شْوَيّْ
جَيِّدٌ|زِينْ|كْوَيِّسْ|مْنِيحْ
سَيِّئٌ|مُو زِينْ / خَايِسْ|وِحِشْ|عَاطِلْ
صَغِيرٌ|صْغَيِّرْ|صُغَيَّرْ|زْغِيرْ
جَمِيلٌ|حِلْوْ|حِلْوْ|حِلْوْ
جَائِعٌ|يُوعَانْ|جَعَانْ|جُوعَانْ
حَارٌّ||سُخْنْ (горячий); حَرّْ (о погоде)|سُخْنْ (горячий); شُوبْ (о погоде)
بَارِدٌ||سَاقِعْ|
الْيَوْمَ|الْيُومْ|النَّهَارْدَهْ|الْيُومْ
غَدًا|بَاكِرْ|بُكْرَهْ|بُكْرَا
أَمْسِ|أَمْسْ / الْبَارِحَةْ|إِمْبَارِحْ|مْبَارِحْ
سَيَّارَةٌ||عَرَبِيَّةْ|
مَنْزِلٌ|بِيتْ|بِيتْ|بَيْتْ
غُرْفَةٌ|حُجْرَةْ|أُوضَةْ|أُوضَةْ
نُقُودٌ|فْلُوسْ|فْلُوسْ|مَصَارِي
!مَالٌ|فْلُوسْ (деньги)|فْلُوسْ (деньги)|مَصَارِي (деньги)
طَعَامٌ|أَكِلْ|أَكْلْ|أَكِلْ
مَاءٌ|مَايْ|مَيَّهْ|مَيّْ
خُبْزٌ||عِيشْ|
طَاوِلَةٌ|طَاوْلَةْ / مِيزْ|تَرَابِيزَةْ|طَاوْلَةْ
رَجُلٌ|رَيَّالْ|رَاجِلْ|رِجَّالْ
اِمْرَأَةٌ|حُرْمَةْ|سِتّْ|مَرَا
طِفْلٌ|يَاهِلْ|عَيِّلْ|وَلَدْ
صَدِيقٌ|رَبِيعْ / صَدِيجْ|صَاحِبْ|رْفِيقْ
أَبٌ|أُبُويْ (мой отец)|أَبُويَا (мой отец)|بَيِّي (мой отец)
شَيْءٌ|شَيّْ|حَاجَةْ|شِي
طَبِيبٌ|دَخْتَرْ|دُكْتُورْ|حَكِيمْ / دُكْتُورْ
حِذَاءٌ|جُوتِي / نَعَالْ|جَزْمَةْ|صُبَّاطْ / كُنْدَرَةْ
مَلَابِسُ|هْدُومْ|هُدُومْ|تْيَابْ
كَيْفَ حَالُكَ|شْلُونَكْ|إِزَّيَّكْ|كِيفَكْ`;
const DLN={g:"Халиджи",e:"Египетский",l:"Левантийский"},DLK=["g","e","l"];
const dlSk=t=>String(t||"").replace(/[ً-ْٰـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/\s+/g," ").trim();
const dlVk=t=>{t=String(t||"").replace(/ـ/g,"").replace(/ٰ/g,"َ").replace(/^اِ/,"ا").replace(/^(ال)ْ/,"$1").trim();const fin=/َ[اىي]?$|َ$/.test(t.replace(/[ًٌٍْ]$/,"x"))?"V":"N";return t.replace(/[ً-ٍ]/g,"").replace(/[َ-ِْ]+(?=\s|$)/g,"").replace(/ْ/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ")+"#"+fin};
const dlHead=a=>String(a||"").split(/\s[·(،/]|[·(،/…]/)[0].replace(/[«»"]/g,"").trim();
const DLS={},DLV={};DLRAW.split("\n").forEach(l=>{let [h,g,e,v]=l.split("|");const strict=h[0]==="!";if(strict)h=h.slice(1);const o={h,g:(g||"").trim(),e:(e||"").trim(),l:(v||"").trim()};DLV[dlVk(h)]=o;if(!strict)DLS[dlSk(h)]=o});
function dlFind(a){const h=dlHead(a);if(!h)return null;return DLV[dlVk(h)]||null}
function dlGet(){try{if(S&&S.dl!=null)return S.dl}catch(e){}try{const v=localStorage.getItem("dl:"+me);if(v!=null)return v}catch(e){}return null}
function dlSet(v){try{if(S){S.dl=v;save()}}catch(e){}try{localStorage.setItem("dl:"+me,v)}catch(e){}}
function dlHTML(a){const k=dlGet();if(!k||k==="0"||!DLN[k])return"";const o=dlFind(a);if(!o||!o[k])return"";return`<div class="dlx"><span class="dln">${DLN[k]}:</span> <bdi class="ar">${esc(o[k])}</bdi></div>`}
if(!document.getElementById("dlcss")){const st=document.createElement("style");st.id="dlcss";st.textContent=`
.dlx{margin-top:10px;font-size:12px;line-height:1.5;color:var(--mute);font-weight:400}
.dlx .ar{font-size:18px;color:var(--ink);opacity:.8;font-family:"Noto Sans Arabic",serif;unicode-bidi:isolate}
.dln{letter-spacing:.01em}
.dr .dlx{margin-top:4px}
.dlov{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px;padding-top:calc(16px + env(safe-area-inset-top,0px));animation:bgIn .2s ease}
.dlbox{width:min(440px,100%);max-height:100%;overflow:auto;background:var(--card);color:var(--ink);border-radius:22px;padding:18px 16px 14px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.dlbox h3{margin:0 0 6px;font-size:19px}
.dlbox p{margin:0 0 12px;color:var(--mute);font-size:14px;line-height:1.45}
.dlbox .dlex{font-size:13px;margin:-4px 0 12px;padding:8px 10px;border-radius:12px;background:color-mix(in srgb,var(--sea2) 8%,transparent)}
.dlbox .dlex .ar{font-size:18px}
.dlopt{display:flex;flex-direction:column;align-items:flex-start;gap:1px;width:100%;text-align:left;padding:11px 14px;margin:6px 0;border-radius:14px;border:1px solid var(--line);background:transparent;color:var(--ink);font:inherit;cursor:pointer;min-height:48px}
.dlopt small{color:var(--mute);font-size:12px}
.dlopt.on{border-color:var(--sea2);box-shadow:inset 0 0 0 1px var(--sea2)}
.dlopt.no{border-style:dashed}`;document.head.appendChild(st)}
function dlAsk(force){if(!me)return;if(!force&&dlGet()!=null)return;if(document.querySelector(".dlov"))return;
const cur0=dlGet(),ov=document.createElement("div");ov.className="dlov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
const op=(k,t,s)=>`<button class="dlopt${k==="0"?" no":""}${cur0===k?" on":""}" data-k="${k}"><b>${t}</b>${s?`<small>${s}</small>`:""}</button>`;
ov.innerHTML=`<div class="dlbox"><h3>Диалект — по желанию</h3><p>Это дополнительно: в карточках и словаре мелким шрифтом под словом появится, как оно звучит в выбранном диалекте, — только там, где диалект отличается от литературного языка. Учить это не обязательно.</p>
<div class="dlex">Например, <bdi class="ar">الْآنَ</bdi> «сейчас» → халиджи <bdi class="ar">الْحِينْ</bdi>, египетский <bdi class="ar">دِلْوَقْتِي</bdi>, левантийский <bdi class="ar">هَلَّقْ</bdi></div>
${op("g","Халиджи","страны Залива: ОАЭ, Кувейт, Катар, Бахрейн, КСА")}${op("e","Египетский","")}${op("l","Левантийский","Сирия, Ливан, Палестина, Иордания")}${op("0","Не нужно — без диалектов","")}
<p style="margin:10px 0 0;font-size:12px">Изменить выбор можно в меню «Ещё» → «Диалект».</p></div>`;
ov.querySelectorAll(".dlopt").forEach(b=>b.onclick=()=>{dlSet(b.dataset.k);ov.remove();dlRefresh()});
ov.onclick=e=>{if(e.target===ov&&cur0!=null)ov.remove()};document.body.appendChild(ov)}
function dlRefresh(){try{if(deck&&deck[i]&&document.getElementById("face")&&$("face").offsetParent)draw()}catch(e){}try{const b=$("dres");if(b)b.querySelectorAll(".dr").forEach(r=>{delete r.dataset.dl;const x=r.querySelector(".dlx");if(x)x.remove()});dlDict()}catch(e){}try{dlSheet()}catch(e){}}
/* карточки */
{const _draw=draw;draw=function(){_draw.apply(this,arguments);try{const d=deck&&deck[i];if(!d||!flipped||d.fq||(d.f&&fst!==0))return;const h=dlHTML(d.k||d.a)||dlHTML(d.a);if(h)$("face").insertAdjacentHTML("beforeend",h)}catch(e){}}}
/* словарь */
function dlDict(){const b=$("dres");if(!b)return;const k=dlGet();if(!k||k==="0")return;b.querySelectorAll(".dr:not([data-dl])").forEach(r=>{r.dataset.dl=1;const a=r.querySelector(".ar");if(!a)return;const h=dlHTML(a.textContent);if(h)a.insertAdjacentHTML("afterend",h)})}
{let mo=null;const _dsr=dsr;dsr=function(){const r=_dsr.apply(this,arguments);try{const b=$("dres");if(b&&!mo){mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(dlDict,30)});mo.observe(b,{childList:true,subtree:true})}dlDict()}catch(e){}return r}}
/* меню «Ещё» → «Диалект» */
function dlSheet(){const sh=$("sheet");if(!sh||!me)return;let b=sh.querySelector(".dlsb");if(!b){b=document.createElement("button");b.className="dlsb";b.onclick=()=>{closeSheet();dlAsk(true)};const g=[...sh.querySelectorAll("button")].find(x=>/Выйти/.test(x.textContent));g?sh.insertBefore(b,g):sh.appendChild(b)}
const k=dlGet();b.innerHTML=ic("Диалект")+"Диалект: "+(DLN[k]||"нет")+`<small>اللَّهْجَةُ</small>`}
IC["Диалект"]='<path d="M4 5h11v8H9l-4 3v-3H4z"/><path d="M15 9h5v8h-1v3l-3-3h-5v-2"/>';
{const _bt=bt;bt=function(){const r=_bt.apply(this,arguments);try{dlSheet()}catch(e){}return r}}
/* спросить один раз после входа */
{const _login=login;login=async function(){const r=await _login.apply(this,arguments);let n=0;const tr=()=>{if(!me||dlGet()!=null)return;const busy=[...document.querySelectorAll('[id*=tour],[class*=tour],.kuvid,#upd,.updm')].some(e=>e.offsetParent);if(busy&&n++<20){setTimeout(tr,3000);return}dlAsk()};setTimeout(tr,1800);return r}}
