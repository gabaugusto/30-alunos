
const STORAGE_KEY = "coletivo_turma24b_praxis_v1";
const BUCKETS = {
  unreviewed:{label:"Não analisado",color:"#75808f"},
  act:{label:"Agir agora",color:"#c63d3d"},
  understand:{label:"Entender melhor",color:"#cb8b14"},
  monitor:{label:"Acompanhar",color:"#2c6fbb"},
  none:{label:"Sem ação por enquanto",color:"#2f7a55"}
};

let DATA = null;
let state = {
  organization:{},
  snapshotBeforePraxis:null,
  praxisUnlocked:false,
  praxisUnlockedAt:null
};
let currentView = "cards";

const $ = id => document.getElementById(id);
const els = {
  search:$("search"),sort:$("sort"),attendance:$("attendance"),deliveries:$("deliveries"),
  participation:$("participation"),bucket:$("bucket"),updateFilter:$("updateFilter"),
  updateFilterWrap:$("updateFilterWrap"),container:$("studentContainer"),count:$("resultCount"),
  summary:$("summary"),dialog:$("studentDialog"),dialogContent:$("dialogContent"),
  banner:$("praxisBanner"),unlockSection:$("unlockSection"),unlockCode:$("unlockCode"),
  unlockFeedback:$("unlockFeedback")
};

function loadState(){
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if(saved) state = {...state,...saved};
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function getBucket(id){ return state.organization[id] || "unreviewed"; }
function getBeforeBucket(id){ return state.snapshotBeforePraxis?.[id] || "unreviewed"; }
function isUpdated(student){ return !!student.updates?.some(u=>u.stage==="PRAXIS"); }
function isReprioritized(student){
  if(!state.praxisUnlocked || !state.snapshotBeforePraxis) return false;
  return getBucket(student.id) !== getBeforeBucket(student.id);
}
function updateBucket(id,bucket){
  if(bucket==="unreviewed") delete state.organization[id];
  else state.organization[id]=bucket;
  saveState(); render();
}
function normalizeCode(value){
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
}
function matchesAttendance(v,f){if(!f)return true;if(f==="under80")return v<80;if(f==="80to89")return v>=80&&v<90;return v>=90}
function matchesDeliveries(v,f){if(!f)return true;if(f==="under70")return v<70;if(f==="70to89")return v>=70&&v<90;return v>=90}

function filteredStudents(){
  const q=els.search.value.trim().toLocaleLowerCase("pt-BR");
  let list=DATA.students.filter(s=>{
    const updateText = state.praxisUnlocked ? (s.updates||[]).map(u=>u.evidence).join(" ") : "";
    const hay=[s.id,s.name,s.evidence,s.context,s.participation,updateText].join(" ").toLocaleLowerCase("pt-BR");
    const updateOk = !els.updateFilter.value ||
      (els.updateFilter.value==="updated" && isUpdated(s)) ||
      (els.updateFilter.value==="changed" && isReprioritized(s));
    return (!q||hay.includes(q)) &&
      matchesAttendance(s.attendance,els.attendance.value) &&
      matchesDeliveries(s.deliveries,els.deliveries.value) &&
      (!els.participation.value||s.participation===els.participation.value) &&
      (!els.bucket.value||getBucket(s.id)===els.bucket.value) &&
      updateOk;
  });
  const [field,direction]=els.sort.value.split("-");
  const factor=direction==="asc"?1:-1;
  list.sort((a,b)=>typeof a[field]==="string"?a[field].localeCompare(b[field],"pt-BR")*factor:(a[field]-b[field])*factor);
  return list;
}
function bucketOptions(selected){
  return Object.entries(BUCKETS).map(([v,d])=>`<option value="${v}" ${selected===v?"selected":""}>${d.label}</option>`).join("");
}
function updateMarkup(student){
  if(!state.praxisUnlocked || !isUpdated(student)) return "";
  const update=student.updates.find(u=>u.stage==="PRAXIS");
  return `<div class="update-block"><div class="card-label">PRAXIS · ${update.title}</div><p>${update.evidence}</p></div>`;
}
function historyMarkup(student){
  if(!state.praxisUnlocked || !state.snapshotBeforePraxis) return "";
  const before=getBeforeBucket(student.id), now=getBucket(student.id);
  const changed=before!==now;
  return `<div class="priority-history">
    <span>Antes: <strong>${BUCKETS[before].label}</strong></span>
    <span class="arrow">→</span>
    <span>Agora: <strong>${BUCKETS[now].label}</strong></span>
    ${changed?'<span class="changed-tag">REPRIORIZADO</span>':""}
  </div>`;
}
function cards(list){
  if(!list.length)return `<div class="empty">Nenhum estudante corresponde aos filtros atuais.</div>`;
  return `<div class="cards">${list.map(s=>{
    const bucket=getBucket(s.id),bd=BUCKETS[bucket],updated=state.praxisUnlocked&&isUpdated(s);
    return `<article class="student-card ${updated?"updated":""}" style="--bucket-color:${bd.color}">
      ${updated?'<span class="new-badge">NOVA EVIDÊNCIA</span>':""}
      <div class="card-head"><div><h3 class="card-title">${s.name}, ${s.age}</h3><span class="student-id">${s.id}</span></div>
      <span class="status-pill" style="color:${bd.color}">${bd.label}</span></div>
      <div class="metrics"><div class="metric"><b>Frequência</b><span>${s.attendance}%</span></div>
      <div class="metric"><b>Entregas</b><span>${s.deliveries}%</span></div><div class="metric"><b>Participação</b><span>${s.participation}</span></div></div>
      <div class="card-label">Evidência inicial</div><p class="card-text">${s.evidence}</p>
      ${updateMarkup(s)}${historyMarkup(s)}
      <div class="card-bottom"><label><span class="card-label">${state.praxisUnlocked?"Repriorização":"Organização da squad"}</span>
      <select data-student-bucket="${s.id}">${bucketOptions(bucket)}</select></label>
      <button class="details-btn" data-details="${s.id}">Detalhes</button></div>
    </article>`;
  }).join("")}</div>`;
}
function table(list){
  if(!list.length)return `<div class="empty">Nenhum estudante corresponde aos filtros atuais.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Estudante</th><th>Freq.</th><th>Entregas</th><th>Participação</th><th>Evidência inicial</th>
  ${state.praxisUnlocked?"<th>Nova evidência</th><th>Antes</th>":""}<th>Organização atual</th></tr></thead><tbody>
  ${list.map(s=>`<tr><td><strong>${s.id}</strong></td><td><button class="details-btn" data-details="${s.id}">${s.name}</button></td>
  <td>${s.attendance}%</td><td>${s.deliveries}%</td><td>${s.participation}</td><td>${s.evidence}</td>
  ${state.praxisUnlocked?`<td>${isUpdated(s)?s.updates.find(u=>u.stage==="PRAXIS").evidence:"—"}</td><td>${BUCKETS[getBeforeBucket(s.id)].label}</td>`:""}
  <td><select data-student-bucket="${s.id}">${bucketOptions(getBucket(s.id))}</select>${isReprioritized(s)?'<div class="changed-tag">REPRIORIZADO</div>':""}</td></tr>`).join("")}
  </tbody></table></div>`;
}
function renderSummary(){
  const counts=Object.fromEntries(Object.keys(BUCKETS).map(k=>[k,0]));
  DATA.students.forEach(s=>counts[getBucket(s.id)]++);
  Object.keys(BUCKETS).forEach(k=>$(`count-${k}`).textContent=counts[k]);
  const reviewed=DATA.students.length-counts.unreviewed;
  let html=`<span class="summary-chip"><strong>${reviewed}</strong> analisados</span>
    <span class="summary-chip"><strong>${counts.act}</strong> agir agora</span>
    <span class="summary-chip"><strong>${counts.understand}</strong> entender melhor</span>
    <span class="summary-chip"><strong>${counts.monitor}</strong> acompanhar</span>
    <span class="summary-chip"><strong>${counts.none}</strong> sem ação</span>`;
  if(state.praxisUnlocked){
    const updated=DATA.students.filter(isUpdated).length;
    const changed=DATA.students.filter(isReprioritized).length;
    html+=`<span class="summary-chip praxis"><strong>${updated}</strong> novas evidências</span>
    <span class="summary-chip praxis"><strong>${changed}</strong> repriorizados</span>`;
  }
  els.summary.innerHTML=html;
}
function render(){
  const list=filteredStudents();
  els.count.textContent=`${list.length} ${list.length===1?"resultado":"resultados"}`;
  els.container.innerHTML=currentView==="cards"?cards(list):table(list);
  renderSummary();

  if(state.praxisUnlocked){
    els.banner.classList.remove("hidden");
    els.banner.innerHTML=`<h2>${DATA.meta.unlockTitle}</h2><p>${DATA.meta.unlockMessage} ${DATA.meta.updatedStudents} estudantes possuem novas evidências. Reavaliem a organização anterior.</p>`;
    els.updateFilterWrap.classList.remove("hidden");
    els.unlockSection.classList.add("hidden");
  } else {
    els.banner.classList.add("hidden");
    els.updateFilterWrap.classList.add("hidden");
    els.unlockSection.classList.remove("hidden");
  }
}
function openDetails(id){
  const s=DATA.students.find(x=>x.id===id),bucket=getBucket(id),bd=BUCKETS[bucket];
  els.dialogContent.innerHTML=`<span class="student-id">${s.id}</span><h2>${s.name}, ${s.age}</h2>
  <span class="status-pill" style="color:${bd.color}">${bd.label}</span>
  <div class="metrics"><div class="metric"><b>Frequência</b><span>${s.attendance}%</span></div><div class="metric"><b>Entregas</b><span>${s.deliveries}%</span></div><div class="metric"><b>Participação</b><span>${s.participation}</span></div></div>
  <div class="dialog-block"><h3>Evidência inicial</h3><p>${s.evidence}</p></div>
  <div class="dialog-block"><h3>Contexto conhecido</h3><p>${s.context}</p></div>
  ${state.praxisUnlocked&&isUpdated(s)?`<div class="dialog-block"><h3>PRAXIS · Nova evidência</h3><p>${s.updates.find(u=>u.stage==="PRAXIS").evidence}</p></div>${historyMarkup(s)}`:""}
  <div class="dialog-block"><h3>${state.praxisUnlocked?"Repriorização":"Organização da squad"}</h3><select id="dialogBucket">${bucketOptions(bucket)}</select></div>`;
  els.dialogContent.querySelector("#dialogBucket").addEventListener("change",e=>updateBucket(id,e.target.value));
  els.dialog.showModal();
}
function unlockPraxis(){
  const entered=normalizeCode(els.unlockCode.value),expected=normalizeCode(DATA.meta.unlockCode);
  if(entered!==expected){
    els.unlockFeedback.textContent="Código não reconhecido.";els.unlockFeedback.className="feedback";return;
  }
  if(!state.snapshotBeforePraxis){
    state.snapshotBeforePraxis={};
    DATA.students.forEach(s=>state.snapshotBeforePraxis[s.id]=getBucket(s.id));
  }
  state.praxisUnlocked=true;
  state.praxisUnlockedAt=new Date().toISOString();
  saveState();
  els.unlockFeedback.textContent="Novas evidências liberadas.";
  els.unlockFeedback.className="feedback success";
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}
function exportData(){
  const payload={
    exportedAt:new Date().toISOString(),
    praxisUnlocked:state.praxisUnlocked,
    snapshotBeforePraxis:state.snapshotBeforePraxis,
    students:DATA.students.map(s=>({
      id:s.id,name:s.name,
      beforePraxis:state.snapshotBeforePraxis?getBeforeBucket(s.id):null,
      current:getBucket(s.id),
      reprioritized:isReprioritized(s),
      hasNewEvidence:isUpdated(s)
    }))
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="turma24b-praxis-organizacao.json";a.click();URL.revokeObjectURL(url);
}

async function init(){
  loadState();
  try{
    const response=await fetch("students.json");
    if(!response.ok) throw new Error("Não foi possível carregar students.json");
    DATA=await response.json();
  }catch(err){
    els.container.innerHTML=`<div class="empty"><strong>Não foi possível abrir o arquivo de dados.</strong><br><br>
    Esta versão usa <code>students.json</code>. Execute a pasta por um servidor local (ex.: Live Server ou <code>python -m http.server</code>) em vez de abrir o HTML diretamente.</div>`;
    return;
  }

  ["input","change"].forEach(evt=>[els.search,els.sort,els.attendance,els.deliveries,els.participation,els.bucket,els.updateFilter].forEach(el=>el.addEventListener(evt,render)));
  document.addEventListener("change",e=>{if(e.target.matches("[data-student-bucket]"))updateBucket(e.target.dataset.studentBucket,e.target.value)});
  document.addEventListener("click",e=>{
    const d=e.target.closest("[data-details]");if(d)openDetails(d.dataset.details);
    const bf=e.target.closest("[data-bucket-filter]");if(bf){els.bucket.value=bf.dataset.bucketFilter;render()}
    const v=e.target.closest("[data-view]");if(v){currentView=v.dataset.view;document.querySelectorAll("[data-view]").forEach(b=>{const active=b.dataset.view===currentView;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});render()}
  });
  $("unlockBtn").addEventListener("click",unlockPraxis);
  els.unlockCode.addEventListener("keydown",e=>{if(e.key==="Enter")unlockPraxis()});

  render();
}
init();
