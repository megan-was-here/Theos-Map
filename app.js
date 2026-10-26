/* Theo's Sydney: one script for both pages.
   index.html  -> Theo's quest map   (body data-mode="theo")
   coven.html  -> the Coven's page   (body data-mode="coven")
   Data lives in Supabase (see setup/supabase-setup.sql). If Supabase isn't
   set up or can't be reached, Theo's map falls back to the built-in copy in
   mapdata.js and saves progress on her phone. */
(function(){
"use strict";
const CFG = window.THEO_CONFIG || {};
const MODE = document.body.dataset.mode || "theo";
const MAP = window.THEO_MAPDATA;
const COVEN = CFG.covenName || "The Coven & Co.";
const INTRO = CFG.intro || "";
const WHATSAPP = CFG.whatsapp || "";
let sb = null;
if (CFG.supabaseUrl && CFG.supabaseKey && window.supabase) {
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
}

const CATS = {
  cafe:["Cafes","i-cafe"], bar:["Little bars","i-bar"], swim:["Swims","i-swim"], yoga:["Yoga","i-yoga"],
  massage:["Massage","i-massage"], sunset:["Sunsets","i-sunset"], thrift:["Thrift","i-thrift"], gift:["Trinkets","i-gift"],
  crystal:["Crystals","i-crystal"], book:["Books","i-book"], cinema:["Cinemas","i-cinema"], art:["Art","i-art"],
  market:["Markets","i-market"], ferry:["Ferry","i-ferry"], heart:["Other","i-heart"]
};
const SEAS = [["Pacific Ocean",-33.8650,151.3040],["Sydney Harbour",-33.8505,151.2470],["Middle Harbour",-33.8100,151.2330]];
const DECO = [["moon",-33.8420,151.3020,1.1],["star",-33.8800,151.3040,.8],["star",-33.8240,151.3090,.6],["star",-33.9150,151.3000,.7],["star",-33.8960,151.2950,.5],
  ["octopus",-33.9230,151.2900,1.2],["whale",-33.8650,151.3080,1.3],["fish",-33.7880,151.3080,1]];
const LAYERS = window.THEO_LAYERS || {parks:[],beaches:[],ferries:[],suburbs:[]};
const NATURE = [["Royal Botanic Garden",-33.8642,151.2166],["Hyde Park",-33.8731,151.2111],["Centennial Park",-33.8980,151.2340],["Moore Park",-33.8935,151.2205],
  ["Sydney Park",-33.9095,151.1840],["North Head",-33.8170,151.2950],["Callan Park",-33.8650,151.1520],["Bradleys Head",-33.8530,151.2470],
  ["Manly Beach",-33.7935,151.2900],["Shelly Beach",-33.8000,151.2995],["Bondi Beach",-33.8908,151.2770],["Bronte Beach",-33.9035,151.2690],
  ["Tamarama",-33.8990,151.2730],["Coogee Beach",-33.9205,151.2580],["Clovelly",-33.9135,151.2640],["Balmoral Beach",-33.8275,151.2520],
  ["Camp Cove",-33.8395,151.2785],["Freshwater",-33.7805,151.2905]];
const LANDMARKS = [
  ["Harbour Bridge",-33.85212,151.21078,"bridge"],["Opera House",-33.85720,151.21512,"opera"],["Sydney Tower",-33.87050,151.20895,"tower"],
  ["Luna Park",-33.84727,151.20980,"luna"],["Taronga Zoo",-33.84383,151.24137,"giraffe"],["Bondi Icebergs",-33.89505,151.27457,"icebergs"],
  ["Macquarie Lighthouse",-33.85394,151.28519,"lighthouse"],["Fort Denison",-33.85494,151.22551,"fort"]];
const LANDMARK_ART = {
  bridge:"M-22-4h44M-20-4Q0-34 20-4M-14-4v-9M-7-4v-15M0-4v-17M7-4v-15M14-4v-9M-25-14h6v14h-6zM19-14h6v14h-6zM-22 0h44",
  opera:"M-24 0h48M-20 0Q-14-26-4 0M-10 0Q2-34 12 0M4 0Q14-22 22 0M-22-3h46",
  tower:"M0-40v8M-6-32h12l-3 6h-6zM-2-26l-2 26M2-26l2 26M-7 0h14M-3-14h6",
  luna:"M-14-16a14 14 0 1 0 28 0a14 14 0 1 0-28 0M-6-20v-2M6-20v-2M-9-12q9 9 18 0zM-5-12v3M0-12v4M5-12v3M-16-26l-4-4M16-26l4-4M0-31v-5",
  giraffe:"M-4 0l2-22-5-7 2-3 5 4 6-1-1 4-5 2 2 23M-3-36l-1-4M1-35l1-4M-1-14h1M1-8h1M-2-20h1",
  icebergs:"M-20 0h40v-6h-40zM-20-6v-4h40v4M-22-14q6-10 12-2t12-4 12 2 10-6M-12-3h4M2-3h4",
  lighthouse:"M-5 0l2-26h6l2 26zM-6-26h12M-3-26l1-6h4l1 6M0-36v3M-10-33l5 2M10-33l-5 2M-4-18h8M-4.5-9h9",
  fort:"M-20 0q20-8 40 0M-6-3v-16h12v16M-8-19h16M-4-19v-4h8v4M-2-9h4"
};
const SEA_ART = {
  octopus:"M-10-10a10 10 0 1 1 20 0c0 5-2 7-4 9M-10-10c0 5 2 7 4 9M-6-1c-2 6-8 6-9 1M-2 0c-1 7-5 9-7 8M2 0c1 7 5 9 7 8M6-1c2 6 8 6 9 1M-4-12v1M4-12v1M-2-6q2 2 4 0",
  whale:"M-24 0q6-14 26-12 12 1 16 8l8-8v14l-8-4q-8 10-26 8-12-1-16-6zM-14-4v1M-20-14q2-6 0-10M-20-14q-4-4-8-4M-20-14q4-4 8-4",
  fish:"M-10 0q8-8 16 0-8 8-16 0zM6 0l6-5v10zM-5-1v1M-22-6q6-6 10 0-6 6-10 0zM-12-6l4-3v6z"
};
const AREA_GROUPS = [["Manly & nearby",["Manly"]],["The city",["The Rocks","Millers Point","City","The Langham, Millers Point"]],["Inner west",["Glebe","Newtown","St Peters","Rozelle"]],["North shore",["Cremorne Point","Cremorne"]],["Eastern suburbs",["Surry Hills","Bronte","Coogee"]]];

/* projection (same as the coastline data) */
const LON0=151.15, LAT0=-33.77, K=10000, COS=Math.cos(33.855*Math.PI/180);
const proj=(lat,lng)=>[(lng-LON0)*COS*K,(LAT0-lat)*K];
const unproj=(x,y)=>({lat:LAT0-y/K,lng:x/(COS*K)+LON0});

/* ---------- small helpers ---------- */
const store={
  get(k,d){try{const v=localStorage.getItem("theo-sydney-"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem("theo-sydney-"+k,JSON.stringify(v))}catch(e){}}
};
if(location.hash==="#reset"){try{Object.keys(localStorage).filter(k=>k.startsWith("theo-sydney-")).forEach(k=>localStorage.removeItem(k))}catch(e){}}
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const iconSVG=cat=>`<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="#151514" stroke-width="2.4"/><use href="#${(CATS[cat]||CATS.heart)[1]}" x="9" y="9" width="22" height="22"/></svg>`;
const smallIcon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;
const slug=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,30)+"-"+Math.random().toString(36).slice(2,6);
const fmtDate=d=>d?new Date(d).toLocaleDateString(undefined,{day:"numeric",month:"short"}):"";
const toastEl=document.getElementById("toast"); let toastT;
function toast(t){toastEl.textContent=t;toastEl.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>toastEl.hidden=true,3400)}

/* ======================================================================
   DATA
   ====================================================================== */
let spots=[], spells=[], quests=[], progress={}, mine=[];
let online=false;   // true when data came from Supabase

let theoCode=store.get("code","");
class WrongCode extends Error{}
async function loadAll(){
  if(!sb) throw new Error("not set up");
  if(MODE==="theo"){
    const {data,error}=await sb.rpc("theo_load",{p_code:theoCode});
    if(error){ if(/wrong code/i.test(error.message||"")) throw new WrongCode(); throw error; }
    spots=data.spots; spells=data.spells; quests=data.quests;
    progress=Object.fromEntries(data.progress.map(p=>[p.spot_id,p])); mine=data.mine;
    online=true; return;
  }
  const [a,b,c,d,e]=await Promise.all([
    sb.from("spots").select("*").order("created_at"),
    sb.from("spells").select("*").order("created_at"),
    sb.from("quests").select("*").order("created_at"),
    sb.from("progress").select("*"),
    sb.from("theo_spots").select("*").order("created_at")
  ]);
  const err=[a,b,c,d,e].find(r=>r.error); if(err)throw err.error;
  spots=a.data; spells=b.data; quests=c.data;
  progress=Object.fromEntries(d.data.map(p=>[p.spot_id,p])); mine=e.data;
  online=true;
}

async function setProgress(spot_id,patch){
  progress[spot_id]={...(progress[spot_id]||{spot_id}),...patch};
  const {error}=await sb.rpc("theo_save_progress",{p_code:theoCode,p_spot:spot_id,p_patch:patch});
  if(error){console.warn(error);toast("That didn't save. Check your internet and try again.")}
}
async function addMine(s){
  const {data,error}=await sb.rpc("theo_add_spot",{p_code:theoCode,p_name:s.name,p_cat:s.cat,p_note:s.note,p_lat:s.lat,p_lng:s.lng});
  if(error){console.warn(error);toast("Couldn't save that spot. Check your internet and try again.");return null}
  mine.push(data); return data;
}
async function delMine(id){
  const {error}=await sb.rpc("theo_del_spot",{p_code:theoCode,p_id:id}); if(error){toast("Couldn't remove it. Try again.");return false}
  mine=mine.filter(m=>m.id!==id); return true;
}

/* derived */
let ALL=[], byId={};
function rebuildIndex(){
  ALL=[...spots.map(s=>({...s,mine:false})),...mine.map(s=>({...s,mine:true}))];
  ALL.forEach(s=>{[s.x,s.y]=proj(s.lat,s.lng)});
  byId=Object.fromEntries(ALL.map(s=>[s.id,s]));
}
const spellsFor=id=>spells.filter(s=>s.spot_id===id);
const isOpen=id=>!!(progress[id]&&progress[id].unlocked_at);
const isDone=id=>!!(progress[id]&&progress[id].done_at);
const replyOf=id=>(progress[id]&&progress[id].reply)||"";
const questStops=q=>(q.stops||[]).filter(i=>byId[i]);

/* "new" tracking for Theo (kept on her phone) */
let viewedSet=null, announcedSet=null, firstVisit=false;
function initSeen(){
  const ids=[...spots.map(s=>s.id),...quests.map(q=>"q:"+q.id)];
  let v=store.get("viewed",null), a=store.get("announced",null);
  if(v===null){firstVisit=true;v=ids;a=ids;store.set("viewed",v);store.set("announced",a)}
  viewedSet=new Set(v); announcedSet=new Set(a||[]);
}
const isNew=id=>MODE==="theo"&&viewedSet&&!viewedSet.has(id);
function markViewed(id){if(MODE!=="theo"||!viewedSet||viewedSet.has(id))return;viewedSet.add(id);store.set("viewed",[...viewedSet])}

/* ======================================================================
   MAP
   ====================================================================== */
const NS="http://www.w3.org/2000/svg";
const el=(tag,attrs={},parent)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.appendChild(n);return n};
const svg=document.getElementById("map"), world=document.getElementById("world");
const gStroke=el("g",{class:"coast-stroke"},world), gFill=el("g",{class:"coast-fill"},world), gWave=el("g",{class:"coast-wave"},world);
[...MAP.ocean,...MAP.water].forEach(d=>{el("path",{d},gStroke);el("path",{d},gFill);el("path",{d},gWave)});
const defs=svg.querySelector("defs");
defs.insertAdjacentHTML("beforeend",`<pattern id="parkdots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1" fill="#151514" opacity=".55"/><circle cx="10" cy="10" r="1" fill="#151514" opacity=".55"/><path d="M9 4.5a1.8 1.8 0 1 1 3.6 0 1.8 1.8 0 0 1-3.6 0zM10.8 6.3v1.7" fill="none" stroke="#151514" stroke-width=".9" opacity=".6"/></pattern>
  <pattern id="sand" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="#151514" opacity=".6"/><circle cx="4.5" cy="4.5" r=".7" fill="#151514" opacity=".6"/></pattern>`);
const gParks=el("g",{class:"parks"},world), gBeach=el("g",{class:"beaches"},world), gFerry=el("g",{class:"ferries"},world);
LAYERS.parks.forEach(d=>el("path",{d},gParks));
LAYERS.beaches.forEach(d=>el("path",{d},gBeach));
LAYERS.ferries.forEach(f=>el("path",{d:f.d},gFerry));
const gDeco=el("g",{},world), gLabels=el("g",{},world), gMarks=el("g",{class:"marks"},world), gRoute=el("g",{},world), gPins=el("g",{},world), gTop=el("g",{class:"ghost-pin"},world);
const scaledNodes=[];
const doodle=(parent,d,cls)=>el("path",{d,class:cls||"deco"},parent);
DECO.filter(([k])=>SEA_ART[k]).forEach(([k,la,ln,sz])=>{const[x,y]=proj(la,ln);const g=el("g",{class:"deco creature"},gDeco);doodle(g,SEA_ART[k]);scaledNodes.push([g,x,y,sz])});
LAYERS.ferries.forEach(f=>{const g=el("g",{class:"ferrytag"},gLabels);el("use",{href:"#i-ferry",x:-9,y:-20,width:18,height:18},g);
  const t=el("text",{x:0,y:10,class:"area nature"},g);t.textContent=f.name;scaledNodes.push([g,f.x,f.y,1])});
LAYERS.suburbs.forEach(([t,x,y,tier])=>{const n=el("text",{class:`area sub t${tier}`+(tier===1?" big":"")},gLabels);n.textContent=t;scaledNodes.push([n,x,y,1])});
NATURE.forEach(([t,la,ln])=>{const[x,y]=proj(la,ln);const n=el("text",{class:"area nature"},gLabels);n.textContent=t;scaledNodes.push([n,x,y,1])});
LANDMARKS.forEach(([t,la,ln,art])=>{const[x,y]=proj(la,ln);const g=el("g",{class:"landmark"},gMarks);
  el("path",{d:LANDMARK_ART[art],class:"lm-art"},g);
  const tx=el("text",{x:0,y:13,class:"lm-label"},g);tx.textContent=t;scaledNodes.push([g,x,y,"lm"])});
DECO.filter(([k])=>!SEA_ART[k]).forEach(([kind,la,ln,sz])=>{const[x,y]=proj(la,ln);const g=el("g",{class:"deco"},gDeco);
  if(kind==="moon"){el("path",{d:"M6-16a17 17 0 1 0 14 26A14 14 0 0 1 6-16z",fill:"#fcfcfa"},g);el("path",{d:"M24-20l1.6 4.4 4.4 1.6-4.4 1.6L24-8l-1.6-4.4-4.4-1.6 4.4-1.6z"},g)}
  else el("path",{d:"M0-12l3 9 9 3-9 3-3 9-3-9-9-3 9-3z",fill:"#fcfcfa"},g);
  scaledNodes.push([g,x,y,sz])});
SEAS.forEach(([t,la,ln])=>{const[x,y]=proj(la,ln);const n=el("text",{class:"area sea"},gLabels);n.textContent=t;scaledNodes.push([n,x,y,1])});
const route=el("path",{class:"route",d:""},gRoute);
const ghost=el("g",{},gTop); ghost.style.display="none";
el("path",{d:"M0 0c-4-7-15-13-15-23a15 15 0 0 1 30 0C15-13 4-7 0 0z",fill:"#fcfcfa",stroke:"#151514","stroke-width":2.6,"stroke-dasharray":"4 3"},ghost);
el("use",{href:"#i-heart",x:-11,y:-34,width:22,height:22},ghost);

let pinNodes={};
function drawPins(){
  gPins.innerHTML=""; pinNodes={};
  ALL.forEach(s=>{
    const g=el("g",{class:"pin",tabindex:"0",role:"button","aria-label":s.name},gPins);
    g.dataset.id=s.id;
    el("path",{d:"M0 0c-4-7-15-13-15-23a15 15 0 0 1 30 0C15-13 4-7 0 0z",class:"disc"},g);
    el("use",{href:"#"+(CATS[s.cat]||CATS.heart)[1],x:-11,y:-34,width:22,height:22},g);
    el("use",{href:"#i-lock",x:6,y:-44,width:15,height:15,class:"lock"},g);
    el("use",{href:"#i-tick",x:5,y:-45,width:16,height:16,class:"tick"},g);
    const hz=el("g",{class:"heart"},g); el("circle",{cx:13,cy:-37,r:8,fill:"#fcfcfa",stroke:"#151514","stroke-width":2},hz); el("use",{href:"#i-heart",x:7,y:-43,width:12,height:12},hz);
    el("path",{class:"sparkle",d:"M17-38l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM-18-34l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"},g);
    const num=el("g",{class:"num"},g); el("circle",{cx:-14,cy:-38,r:8,fill:"#151514"},num);
    const nt=el("text",{x:-14,y:-34.5,"text-anchor":"middle","font-size":"12",fill:"#fff","font-family":"Patrick Hand, sans-serif"},num);
    const nw=el("g",{class:"newtag"},g); el("rect",{x:-17,y:-60,width:34,height:15,rx:6,fill:"#151514"},nw);
    const nwt=el("text",{x:0,y:-48.5,"text-anchor":"middle","font-size":"12",fill:"#fff","font-family":"Patrick Hand, sans-serif"},nw); nwt.textContent="NEW";
    const lbl=el("text",{class:"lbl",x:18,y:-14},g); lbl.textContent=s.name;
    pinNodes[s.id]={g,nt};
    g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onPin(s.id,true)}});
  });
}

/* pan & zoom (viewBox based, stays crisp) */
const MW=MAP.w, MH=MAP.h, MINW=45, MAXW=MW*1.1;
let view={x:0,y:0,w:MW};
function pxSize(){const r=svg.getBoundingClientRect();return [r.width||1,r.height||1]}
function clampView(v){const[pw,ph]=pxSize(); v.w=Math.max(MINW,Math.min(MAXW,v.w)); const h=v.w*ph/pw;
  v.x=Math.max(-v.w*0.4,Math.min(MW-v.w*0.6,v.x)); v.y=Math.max(-h*0.4,Math.min(MH-h*0.6,v.y)); return v}
const pinK=()=>view.w>700?0.72:view.w>300?0.86:1;
let draft=null, placing=false;
function render(){
  const[pw,ph]=pxSize(); const h=view.w*ph/pw; svg.setAttribute("viewBox",`${view.x} ${view.y} ${view.w} ${h}`);
  const s=view.w/pw;
  document.getElementById("waves").setAttribute("patternTransform",`scale(${s})`);
  document.getElementById("hatch").setAttribute("patternTransform",`scale(${s}) rotate(45)`);
  ALL.forEach(sp=>pinNodes[sp.id]&&pinNodes[sp.id].g.setAttribute("transform",`translate(${sp.x} ${sp.y}) scale(${s*pinK()})`));
  const lmK=view.w>650?0.6:view.w>280?0.8:1;
  scaledNodes.forEach(([n,x,y,k])=>n.setAttribute("transform",`translate(${x} ${y}) scale(${s*(k==="lm"?lmK:k)})`));
  if(draft&&draft.x!=null) ghost.setAttribute("transform",`translate(${draft.x} ${draft.y}) scale(${s*pinK()})`);
  svg.classList.toggle("labels",view.w<170);
  ["parkdots","sand"].forEach(id=>document.getElementById(id).setAttribute("patternTransform",`scale(${s})`));
  svg.dataset.zoom=view.w<280?"3":view.w<650?"2":"1";
  drawScale(pw);
}
const scaleEl=document.getElementById("scalebar");
function drawScale(pw){
  if(!scaleEl)return;
  const mPerPx=view.w*11.1/pw; const steps=[50,100,200,250,500,1000,2000,5000];
  const m=steps.find(v=>v/mPerPx>=55)||5000; const len=Math.round(m/mPerPx);
  scaleEl.innerHTML=`<svg width="${len+4}" height="12" aria-hidden="true"><path d="M2 2v8h${len}V2M${2+len/2} 6v4" fill="none" stroke="#151514" stroke-width="2" stroke-linecap="round"/></svg><span>${m>=1000?m/1000+" km":m+" m"}</span>`;
}
let anim=null;
function flyTo(target,ms=650){
  cancelAnimationFrame(anim); const from={...view}; clampView(target); const t0=performance.now();
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const step=t=>{let k=reduce?1:Math.min(1,(t-t0)/ms); k=1-Math.pow(1-k,3);
    view={x:from.x+(target.x-from.x)*k,y:from.y+(target.y-from.y)*k,w:from.w+(target.w-from.w)*k}; render(); if(k<1)anim=requestAnimationFrame(step)};
  anim=requestAnimationFrame(step);
}
function fitPoints(pts,pad=70){
  if(!pts.length)return {...view};
  const[pw,ph]=pxSize(); const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  let w=Math.max(maxx-minx,(maxy-miny)*pw/ph); w=Math.max(w,MINW*1.6); w=pw*(w/Math.max(40,pw-2*pad));
  const h=w*ph/pw; return {x:(minx+maxx)/2-w/2,y:(miny+maxy)/2-h/2-h*0.05,w};
}
const showAll=()=>flyTo(fitPoints(ALL.map(s=>[s.x,s.y]),36));
function flyToSpot(s){const[pw,ph]=pxSize(); const w=Math.min(view.w,260); flyTo({x:s.x-w/2,y:s.y-(w*ph/pw)/2,w})}
function zoomAt(f,cx,cy){
  const[pw]=pxSize(); const r=svg.getBoundingClientRect(); const s=view.w/pw;
  const ux=view.x+(cx-r.left)*s, uy=view.y+(cy-r.top)*s; const nw=Math.max(MINW,Math.min(MAXW,view.w*f)); const ns=nw/pw;
  view={x:ux-(cx-r.left)*ns,y:uy-(cy-r.top)*ns,w:nw}; clampView(view); render();
}
function screenToMap(cx,cy){const[pw]=pxSize();const r=svg.getBoundingClientRect();const s=view.w/pw;return[view.x+(cx-r.left)*s,view.y+(cy-r.top)*s]}
const ptrs=new Map(); let moved=0, downPin=null, pinch=null;
svg.addEventListener("pointerdown",e=>{
  cancelAnimationFrame(anim); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1){moved=0;downPin=e.target.closest(".pin")} else downPin=null;
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)}}
  svg.setPointerCapture(e.pointerId); svg.classList.add("dragging");
});
svg.addEventListener("pointermove",e=>{
  if(!ptrs.has(e.pointerId))return; const p=ptrs.get(e.pointerId); const dx=e.clientX-p.x, dy=e.clientY-p.y;
  if(ptrs.size===1){moved+=Math.abs(dx)+Math.abs(dy); const[pw]=pxSize(); const s=view.w/pw; view.x-=dx*s; view.y-=dy*s; clampView(view); render()}
  p.x=e.clientX; p.y=e.clientY;
  if(ptrs.size===2&&pinch){const[a,b]=[...ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); if(d>0){zoomAt(pinch.d/d,(a.x+b.x)/2,(a.y+b.y)/2); pinch.d=d} moved+=99}
});
function endPtr(e){
  if(!ptrs.has(e.pointerId))return; ptrs.delete(e.pointerId); if(ptrs.size<2)pinch=null;
  if(ptrs.size===0){svg.classList.remove("dragging");
    if(moved<8){ if(placing){const[x,y]=screenToMap(e.clientX,e.clientY);finishPlacing(x,y)} else if(downPin)onPin(downPin.dataset.id,false) }
    downPin=null}
}
svg.addEventListener("pointerup",endPtr); svg.addEventListener("pointercancel",endPtr);
svg.addEventListener("wheel",e=>{e.preventDefault();zoomAt(Math.exp(e.deltaY*0.0015),e.clientX,e.clientY)},{passive:false});
svg.addEventListener("dblclick",e=>{if(!placing)zoomAt(0.5,e.clientX,e.clientY)});
const center=()=>{const r=svg.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
document.getElementById("zin").onclick=()=>zoomAt(0.6,...center());
document.getElementById("zout").onclick=()=>zoomAt(1/0.6,...center());
document.getElementById("zall").onclick=()=>{selectQuest(null);showAll()};
new ResizeObserver(()=>{clampView(view);render()}).observe(svg);

/* placing a new spot by tapping the map */
const placebar=document.getElementById("placebar");
let afterPlace=null;
function startPlacing(cb){afterPlace=cb;placing=true;svg.classList.add("placing");placebar.hidden=false;
  if(matchMedia("(max-width:859px)").matches)document.getElementById("mapwrap").scrollIntoView({block:"start"})}
function stopPlacing(){placing=false;svg.classList.remove("placing");placebar.hidden=true}
document.getElementById("placecancel").onclick=stopPlacing;
function finishPlacing(x,y){const{lat,lng}=unproj(x,y);stopPlacing();draft.lat=lat;draft.lng=lng;draft.x=x;draft.y=y;ghost.style.display="";render();afterPlace&&afterPlace()}
function clearDraft(){draft=null;ghost.style.display="none"}

/* ======================================================================
   SHARED UI
   ====================================================================== */
const panel=document.getElementById("panel");
const modal=document.getElementById("modal");
let quest=null, current=null, tab=MODE==="theo"?"quests":"theo", filter=null;

function refreshPins(){
  const stops=quest?questStops(quest):[];
  ALL.forEach(s=>{const n=pinNodes[s.id]; if(!n)return; const o=s.mine||isOpen(s.id); const i=stops.indexOf(s.id);
    n.g.classList.toggle("open",o); n.g.classList.toggle("locked",!o); n.g.classList.toggle("done",isDone(s.id));
    n.g.classList.toggle("mine",!!s.mine); n.g.classList.toggle("isnew",!s.mine&&isNew(s.id));
    n.g.classList.toggle("instop",i>=0); if(i>=0)n.nt.textContent=i+1;
    n.g.classList.toggle("dim",(!!quest&&i<0)||(!!filter&&s.cat!==filter&&i<0));
    n.g.classList.toggle("sel",current===s.id);
  });
  route.setAttribute("d",stops.length?"M"+stops.map(id=>`${byId[id].x} ${byId[id].y}`).join(" L"):"");
  const c=document.getElementById("count"); if(c)c.textContent=`${spots.filter(s=>isOpen(s.id)).length} / ${spots.length}`;
}
function selectQuest(id){
  quest=id?quests.find(q=>q.id===id)||null:null; if(quest)markViewed("q:"+quest.id); refreshPins();
  if(quest){const st=questStops(quest); if(st.length)flyTo(fitPoints(st.map(i=>[byId[i].x,byId[i].y]),60))}
}
function onPin(id,fly){ if(MODE==="theo")openSpot(id,fly); else covenSpot(id,fly) }

function covenLink(text,label="Message the Coven",cls="pill"){
  if(!WHATSAPP) return `<button class="${cls}" data-copy="${esc(text)}">${smallIcon("i-chat")}Copy for the Coven chat</button>`;
  return `<a class="${cls}" href="${esc(WHATSAPP)}" target="_blank" rel="noopener" data-copy="${esc(text)}">${smallIcon("i-chat")}${esc(label)}</a>`;
}
function copyText(t,msg){try{navigator.clipboard.writeText(t).then(()=>toast(msg||"Copied! Paste it into the Coven chat."),()=>{})}catch(e){}}
function wireCopy(root){root.querySelectorAll("[data-copy]").forEach(a=>a.addEventListener("click",()=>{if(a.dataset.copy)copyText(a.dataset.copy)}))}

const burst=`<svg class="burst" viewBox="0 0 90 60" aria-hidden="true"><g fill="none" stroke="#151514" stroke-width="2.4" stroke-linecap="round"><path d="M45 6v10M45 44v10M17 30h10M63 30h10M25 12l7 7M58 41l7 7M65 12l-7 7M32 41l-7 7"/><path d="M45 22l2.4 5.6L53 30l-5.6 2.4L45 38l-2.4-5.6L37 30l5.6-2.4z" fill="#151514"/></g></svg>`;
function showModal(inner,onClose){
  modal.innerHTML=`<div class="card pop" role="dialog" aria-modal="true">${inner}</div>`; modal.hidden=false;
  const b=modal.querySelector("[data-close]"); if(b){b.focus();b.onclick=()=>{modal.hidden=true;onClose&&onClose()}}
  wireCopy(modal);
}
modal.addEventListener("click",e=>{if(e.target===modal&&!modal.dataset.locked)modal.hidden=true});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!modal.dataset.locked)modal.hidden=true;if(placing)stopPlacing()}});

const flapSVG=()=>`<svg class="flap" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 50 18 100 0" fill="none" stroke="#151514" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>
  <svg class="seal" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l4 4 5.6-.6.9 5.5 5 2.6-2 5.2 2 5.2-5 2.6-.9 5.5-5.6-.6-4 4-4-4-5.6.6-.9-5.5-5-2.6 2-5.2-2-5.2 5-2.6.9-5.5 5.6.6z" fill="#151514"/><path d="M23 12a8 8 0 1 0 6 12.5A6.5 6.5 0 0 1 23 12z" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
const spellCards=(id,cls="")=>{const list=spellsFor(id).slice(0,1);
  if(!list.length)return `<div class="envelope ${cls}"><p class="note">The Coven is still writing this spell. Check back soon!</p></div>`;
  return `<div class="spells">${list.map(sp=>`<div class="envelope ${cls}"><p class="note">${esc(sp.message)}</p><p class="note-from">love, ${esc(sp.from_name||COVEN)} ♡</p></div>`).join("")}</div>`};
const fromLine=id=>{const sp=spellsFor(id)[0];return (sp&&sp.from_name)||COVEN};
const gmapsUrl=s=>`https://www.google.com/maps/search/?api=1&query=${s.mine?`${s.lat},${s.lng}`:encodeURIComponent(s.name+", "+(s.area||"")+", Sydney")}`;

function spotForm({title,back,withArea,withSpell,fromName,onSave}){
  const cats=Object.entries(CATS).filter(([k])=>withArea||k!=="ferry");
  panel.innerHTML=`<button class="back" id="back">← ${esc(back)}</button>
    <h2 class="group" style="margin-top:4px">${esc(title)}</h2>
    <div class="stack" style="margin-top:6px">
      <label for="sname">What's it called?<input type="text" id="sname" maxlength="70" value="${esc(draft.name)}" placeholder="e.g. Best dumplings ever"></label>
      ${withArea?`<label for="sarea">Suburb<input type="text" id="sarea" maxlength="40" value="${esc(draft.area||"")}" placeholder="e.g. Newtown"></label>`:""}
      <label for="scat">What kind of spot?<select id="scat">${cats.map(([k,[n]])=>`<option value="${k}"${draft.cat===k?" selected":""}>${n}</option>`).join("")}</select></label>
      ${withArea?`<label for="stip">Good to know (address, hours, what to order)<textarea id="stip" maxlength="300" style="font-family:var(--hand);font-size:18px">${esc(draft.tip||"")}</textarea></label>`:""}
      <label for="snote">${withSpell?"Your spell for Theo (the note she unlocks there)":"A little note to yourself (optional)"}<textarea id="snote" maxlength="600" placeholder="${withSpell?"Dear Theo…":"Why it's magic…"}">${esc(draft.note||"")}</textarea></label>
      ${withSpell?`<label for="sfrom">Signed from<input type="text" id="sfrom" maxlength="40" value="${esc(draft.from||fromName||"")}"></label>`:""}
      <div><div style="font-size:16px;margin-bottom:4px">Where is it?</div>
        <div class="where"><button class="pill" id="tapmap">Tap the map to place it</button><span class="set">${draft.lat!=null?"Placed on the map ✓":"Not placed yet"}</span></div></div>
      <button class="big" id="savespot">Save</button>
      <p class="hint" id="formmsg"></p>
    </div>`;
  panel.scrollTop=0;
  const $=q=>panel.querySelector(q);
  const keep=()=>{draft.name=$("#sname").value;draft.cat=$("#scat").value;draft.note=$("#snote").value;
    if(withArea){draft.area=$("#sarea").value;draft.tip=$("#stip").value} if(withSpell)draft.from=$("#sfrom").value};
  $("#back").onclick=()=>{clearDraft();stopPlacing();home()};
  $("#tapmap").onclick=()=>{keep();startPlacing(()=>spotForm({title,back,withArea,withSpell,fromName,onSave}))};
  $("#savespot").onclick=async()=>{keep();
    if(!draft.name.trim()){$("#formmsg").textContent="Give the spot a name first.";$("#sname").focus();return}
    if(draft.lat==null){$("#formmsg").textContent="Pop it on the map first: tap “Tap the map to place it”.";return}
    $("#savespot").disabled=true; $("#formmsg").textContent="Saving…";
    const ok=await onSave(draft); if(!ok){$("#savespot").disabled=false;$("#formmsg").textContent="That didn't save. Check your internet and try again."}
  };
}

/* ======================================================================
   THEO'S MAP
   ====================================================================== */
let confirming=false, completing=false;
const newCount=()=>spots.filter(s=>isNew(s.id)).length+quests.filter(q=>isNew("q:"+q.id)).length;

function home(){
  if(MODE==="coven")return covenHome();
  current=null; confirming=false; completing=false; clearDraft(); refreshPins();
  const nc=newCount();
  let h=`<div class="tabs" role="tablist">
    <button class="tab" role="tab" id="t-quests" aria-selected="${tab==="quests"}">Quests${nc?`<span class="badge">${nc} new</span>`:""}</button>
    <button class="tab" role="tab" id="t-spots" aria-selected="${tab==="spots"}">All spots</button>
    <button class="tab" role="tab" id="t-mine" aria-selected="${tab==="mine"}">My spots</button></div>`;
  if(tab==="quests"){
    h+=`<p class="lede">The Coven has set you ${quests.length} quests. Every stop holds a sealed spell. Break the seal when you get there.</p>
      <div class="rowbtns">${covenLink("Hi Coven! ","Message the Coven","pill")}</div>`;
    quests.forEach((q,qi)=>{
      const st=questStops(q); const dn=st.filter(isDone).length, op=st.filter(isOpen).length;
      h+=`<button class="trail${quest&&quest.id===q.id?" on":""}" data-quest="${esc(q.id)}" aria-pressed="${!!(quest&&quest.id===q.id)}">
        ${isNew("q:"+q.id)?`<span class="newflag">new quest!</span>`:""}
        <div class="kicker">Quest ${qi+1}${st.length&&dn===st.length?" · complete ✓":""}</div>
        <h3>${esc(q.name)}</h3><div class="when">${esc(q.when_text||"")}${q.when_text?" · ":""}${op}/${st.length} spells unlocked</div>
        <ol>${st.map((i,n)=>`<li><span class="dot${isOpen(i)?" open":""}">${isDone(i)?"✓":n+1}</span>${esc(byId[i].name)}</li>`).join("")}</ol></button>`;
    });
  } else if(tab==="spots"){
    const cats=[...new Set(spots.map(s=>s.cat))];
    h+=`<div class="chips">${cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="${filter===c}">${iconSVG(c)}${(CATS[c]||CATS.heart)[0]}</button>`).join("")}</div>`;
    h+=groupedRows(s=>!filter||s.cat===filter, s=>isDone(s.id)?"complete ✓":isOpen(s.id)?"unlocked":"sealed");
  } else {
    h+=`<p class="lede">Found somewhere magic? Add it to your map${online?" and the Coven will see it too":""}.</p>
      <div class="rowbtns"><button class="pill dark" id="addspot">${smallIcon("i-heart")}Add my own spot</button></div>`;
    if(!mine.length) h+=`<div class="empty">No spots of your own yet. Your favourite coffee, a secret beach, the best dumplings: add them here and they'll show up on the map with a little heart.</div>`;
    else h+=mine.map(s=>`<button class="spotrow" data-spot="${esc(s.id)}">${iconSVG(s.cat)}<span class="nm">${esc(s.name)}<small>${(CATS[s.cat]||CATS.heart)[0]}</small></span><span class="st">yours ♡</span></button>`).join("");
  }
  panel.innerHTML=h; panel.scrollTop=0;
  panel.querySelector("#t-quests").onclick=()=>{tab="quests";filter=null;home()};
  panel.querySelector("#t-spots").onclick=()=>{tab="spots";home()};
  panel.querySelector("#t-mine").onclick=()=>{tab="mine";filter=null;selectQuest(null);home();if(mine.length)flyTo(fitPoints(mine.map(s=>proj(s.lat,s.lng)),60))};
  wireCommon();
  const add=panel.querySelector("#addspot");
  if(add)add.onclick=()=>{draft={name:"",cat:"cafe",note:""};spotForm({title:"Add my own spot",back:"back to my spots",onSave:async d=>{
    const row=await addMine({name:d.name.trim(),cat:d.cat,note:d.note.trim(),lat:d.lat,lng:d.lng}); if(!row)return false;
    clearDraft();rebuildIndex();drawPins();render();tab="mine";openSpot(row.id,true);toast("Added to your map ♡");return true}})};
}
function groupedRows(pred,statusOf){
  const known=new Set(AREA_GROUPS.flatMap(a=>a[1]));
  const groups=[...AREA_GROUPS,["Elsewhere",[...new Set(spots.map(s=>s.area).filter(a=>!known.has(a)))]]];
  let h="";
  groups.forEach(([title,list])=>{
    const items=spots.filter(s=>list.includes(s.area)&&pred(s)); if(!items.length)return;
    h+=`<h3 class="group">${title}</h3>`+items.map(s=>`<button class="spotrow" data-spot="${esc(s.id)}">${iconSVG(s.cat)}<span class="nm">${esc(s.name)}${isNew(s.id)?" · <b style='font-weight:400;text-decoration:underline'>new!</b>":""}<small>${(CATS[s.cat]||CATS.heart)[0]} · ${esc(s.area||"")}</small></span><span class="st">${statusOf(s)}</span></button>`).join("");
  });
  return h;
}
function wireCommon(){
  panel.querySelectorAll("[data-quest]").forEach(b=>b.onclick=()=>{const id=b.dataset.quest;selectQuest(quest&&quest.id===id?null:id);if(!quest)showAll();home()});
  panel.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{filter=filter===b.dataset.cat?null:b.dataset.cat;refreshPins();home();
    if(filter)flyTo(fitPoints(spots.filter(s=>s.cat===filter).map(s=>proj(s.lat,s.lng)),50))});
  panel.querySelectorAll("[data-spot]").forEach(b=>b.onclick=()=>onPin(b.dataset.spot,true));
  wireCopy(panel);
}

function openSpot(id,fly){
  const s=byId[id]; if(!s)return; current=id; confirming=false; completing=false; clearDraft();
  if(!s.mine)markViewed(id);
  if(fly)flyToSpot(s);
  drawSpot();
}
function drawSpot(){
  const s=byId[current]; if(!s)return home();
  const o=s.mine||isOpen(s.id); const dn=isDone(s.id); const reply=replyOf(s.id);
  const qi=quest?questStops(quest).indexOf(s.id):-1;
  const backTo={quests:"quests",spots:"all spots",mine:"my spots"}[tab];
  let h=`<button class="back" id="back">← back to ${backTo}</button>
    <div class="spot-head">${iconSVG(s.cat)}<div><h2>${esc(s.name)}</h2><div class="sub">${(CATS[s.cat]||CATS.heart)[0]}${s.area?` · ${esc(s.area)}`:""}${s.mine?" · your spot":""}</div></div></div>`;
  if(s.tip) h+=`<p class="tip"><b>Good to know:</b> ${esc(s.tip)} Check opening hours before you go.</p>`;
  h+=`<div class="links"><a href="${gmapsUrl(s)}" target="_blank" rel="noopener">Directions in Google Maps ↗</a></div>`;

  if(s.mine){
    if(s.note) h+=`<div class="envelope"><p class="note">${esc(s.note)}</p></div>`;
    h+=`<div class="stack">${covenLink(`I found a new spot: ${s.name}! ${s.note||""}`.trim(),"Tell the Coven about it","big ghost")}
      <button class="big ghost" id="delmine">Remove this spot</button></div><div id="delconfirm"></div>`;
  } else if(o){
    h+=spellCards(s.id,"pop");
    if(dn){
      h+=`<div class="stack"><div class="done-stamp">${smallIcon("i-tick")}Quest complete!</div>`;
      if(reply) h+=`<div class="reply"><h3>Your note back</h3><p class="mine-note">${esc(reply)}</p>${covenLink(`${s.name}: ${reply}`,"Send it to the Coven","pill")}</div>`;
      h+=`<button class="big ghost" id="editreply">${reply?"Change your note back":"Leave the Coven a note back"}</button></div>`;
    } else if(!completing){
      h+=`<div class="stack"><button class="big" id="complete">Mark this quest complete</button></div>`;
    }
    if(completing){
      h+=`<div class="stack"><div class="reply"><h3>A note back to the Coven</h3>
        <label for="replytext">How was it? What did you find?</label>
        <textarea id="replytext" maxlength="1000" placeholder="Dear Coven…">${esc(reply)}</textarea>
        <p class="hint">${online?"The Coven can read this on their page. You can also send it to the group chat.":"Saved on this phone. You can also send it to the group chat."}</p>
        <div class="row2"><button class="big" id="savereply">Save</button>${WHATSAPP?`<a class="big ghost" id="sendreply" href="${esc(WHATSAPP)}" target="_blank" rel="noopener">Save &amp; send</a>`:`<button class="big ghost" id="sendreply">Save &amp; copy</button>`}</div>
        <button class="back" id="skipreply" style="margin:0">${dn?"Cancel":"Skip the note, just mark it done"}</button></div></div>`;
    }
  } else if(!confirming){
    h+=`<div class="envelope closed">${flapSVG()}<p class="msg">A sealed spell from ${esc(fromLine(s.id))} is waiting here.<small>Tap the button when you get there.</small></p>
      <button class="big" id="here">I'm here! Break the seal</button></div>`;
  } else {
    h+=`<div class="envelope closed">${flapSVG()}<div class="confirm"><p>Pinky swear on the Coven you're at <b style="font-weight:400;text-decoration:underline">${esc(s.name)}</b> right now?</p>
      <div class="row2"><button class="big" id="yes">I swear</button><button class="big ghost" id="no">Not yet</button></div></div></div>`;
  }
  const st=quest?questStops(quest):[];
  if(qi>=0&&qi<st.length-1){const nx=byId[st[qi+1]]; h+=`<button class="big ghost" id="next" style="margin-top:14px">Next stop: ${esc(nx.name)} →</button>`}
  panel.innerHTML=h; panel.scrollTop=0;
  const $=q=>panel.querySelector(q);
  $("#back").onclick=home;
  if($("#here"))$("#here").onclick=()=>{confirming=true;drawSpot()};
  if($("#yes"))$("#yes").onclick=()=>unlock(s.id);
  if($("#no"))$("#no").onclick=()=>{confirming=false;drawSpot()};
  if($("#next"))$("#next").onclick=()=>openSpot(st[qi+1],true);
  if($("#complete"))$("#complete").onclick=()=>{completing=true;drawSpot();setTimeout(()=>{const t=$("#replytext");if(t)t.focus()},50)};
  if($("#editreply"))$("#editreply").onclick=()=>{completing=true;drawSpot()};
  const saveReply=async()=>{const t=$("#replytext").value.trim(); const was=dn; completing=false;
    await setProgress(s.id,{reply:t||null,done_at:(progress[s.id]&&progress[s.id].done_at)||new Date().toISOString()}); return {t,was}};
  if($("#savereply"))$("#savereply").onclick=async()=>{const {was}=await saveReply();drawSpot();if(!was)questDone(s.id);else toast("Saved!")};
  if($("#sendreply"))$("#sendreply").addEventListener("click",async()=>{const t=$("#replytext").value.trim();
    copyText(t?`${s.name}: ${t}`:`Quest complete: ${s.name}!`);
    const {was}=await saveReply(); drawSpot(); if(!was)questDone(s.id,true)});
  if($("#skipreply"))$("#skipreply").onclick=async()=>{if(dn){completing=false;drawSpot();return}
    completing=false; await setProgress(s.id,{done_at:new Date().toISOString()}); drawSpot(); questDone(s.id)};
  if($("#delmine"))$("#delmine").onclick=()=>{$("#delconfirm").innerHTML=`<div class="stack"><p style="margin:0;text-align:center">Remove ${esc(s.name)} from your map?</p><div class="row2"><button class="big" id="delyes">Remove</button><button class="big ghost" id="delno">Keep it</button></div></div>`;
    $("#delyes").onclick=async()=>{if(await delMine(s.id)){rebuildIndex();drawPins();render();tab="mine";home();toast("Spot removed")}};
    $("#delno").onclick=()=>{$("#delconfirm").innerHTML=""}};
  wireCopy(panel);
  refreshPins();
}
async function unlock(id){
  await setProgress(id,{unlocked_at:new Date().toISOString()});
  current=id; drawSpot();
  const s=byId[id];
  showModal(`${burst}<h2>Magic unlocked!</h2><p style="text-align:center;margin:0 0 14px;color:var(--ink-soft)">${esc(s.name)}</p>
    ${spellCards(id)}<button class="big" data-close style="margin-top:14px">Keep exploring</button>`);
}
function questDone(id,sent){
  const s=byId[id];
  const q=quests.find(q=>questStops(q).includes(id)&&questStops(q).every(isDone));
  showModal(`${burst}<h2>${q?`${esc(q.name)}: quest complete!`:"Quest complete!"}</h2>
    <p style="text-align:center;margin:0 0 12px">${q?"Every spell on this quest is done. The Coven is very proud.":`${esc(s.name)} ticked off. One step closer to Sydney being home.`}</p>
    ${sent?"":covenLink(replyOf(id)?`${s.name}: ${replyOf(id)}`:`Quest complete: ${s.name}!`,"Tell the Coven","big ghost")}
    <button class="big" data-close style="margin-top:10px">Keep exploring</button>`);
}
function intro(){
  showModal(`<h2>Dear Theo,</h2><p class="note">${esc(INTRO)}</p><p class="note-from">love, ${esc(COVEN)} ♡</p>
    <button class="big" data-close style="margin-top:14px">Accept the quest</button>`);
}
function announceNew(){
  const ns=spots.filter(s=>!announcedSet.has(s.id)), nq=quests.filter(q=>!announcedSet.has("q:"+q.id));
  if(!ns.length&&!nq.length)return;
  showModal(`${burst}<h2>New magic has appeared!</h2><p style="text-align:center;margin:0 0 6px">The Coven has been busy. Look for the NEW tags on your map.</p>
    <ul>${nq.map(q=>`<li>New quest: ${esc(q.name)}</li>`).join("")}${ns.map(s=>`<li>${esc(s.name)} <span style="color:var(--ink-soft)">(${esc(s.area||"")})</span></li>`).join("")}</ul>
    <button class="big" data-close style="margin-top:14px">Show me</button>`,()=>{
      [...ns.map(s=>s.id),...nq.map(q=>"q:"+q.id)].forEach(i=>announcedSet.add(i)); store.set("announced",[...announcedSet]);
      if(nq.length){tab="quests";selectQuest(nq[0].id);home()} else flyTo(fitPoints(ns.map(s=>proj(s.lat,s.lng)),60));
    });
}

/* ======================================================================
   THE COVEN'S PAGE
   ====================================================================== */
let member=null, session=null;
async function covenBoot(){
  if(!sb){panel.innerHTML=`<p class="err">The Coven page needs Supabase. Add the project address and key to config.js.</p>`;return}
  sb.auth.onAuthStateChange((ev,sess)=>{if(ev==="SIGNED_IN"&&!member){session=sess;checkMember()}});
  const {data}=await sb.auth.getSession(); session=data.session;
  if(!session)return drawLogin();
  await checkMember();
}
function drawLogin(msg){
  panel.innerHTML=`<h2 class="group" style="margin-top:0">Coven sign-in</h2>
    <p class="lede">Pop in your email and we'll send you a magic sign-in link. No password needed.</p>
    <form id="loginf" class="stack" style="margin-top:0"><label for="lemail">Your email<input type="text" id="lemail" inputmode="email" autocomplete="email" placeholder="you@example.com"></label>
    <button class="big" type="submit">Send my magic link</button><p class="hint" id="lmsg">${esc(msg||"")}</p></form>`;
  panel.querySelector("#loginf").addEventListener("submit",async e=>{e.preventDefault();
    const email=panel.querySelector("#lemail").value.trim(); const m=panel.querySelector("#lmsg");
    if(!/^\S+@\S+\.\S+$/.test(email)){m.textContent="That email doesn't look quite right.";return}
    m.textContent="Sending…";
    const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.href.split("#")[0]}});
    m.textContent=error?`That didn't work: ${error.message}`:"Check your email and tap the link. You can close this tab.";
  });
}
async function checkMember(){
  const email=(session.user.email||"").toLowerCase();
  const {data,error}=await sb.from("coven_members").select("name,email").ilike("email",email).maybeSingle();
  if(error||!data){panel.innerHTML=`<p class="lede">You're signed in as ${esc(email)}, but that email isn't on the Coven list yet. Ask Megs to add you.</p><button class="big ghost" id="out">Sign out</button>`;
    panel.querySelector("#out").onclick=async()=>{await sb.auth.signOut();member=null;drawLogin()};return}
  member=data;
  document.getElementById("who").textContent=`signed in as ${member.name}`;
  try{await loadAll()}catch(e){panel.innerHTML=`<p class="err">Couldn't load the spellbook: ${esc(e.message||e)}. Has the setup script been run in Supabase?</p>`;return}
  rebuildIndex(); drawPins(); render(); view=fitPoints(ALL.map(s=>[s.x,s.y]),36); clampView(view); render(); covenHome();
}
async function reloadCoven(){await loadAll();rebuildIndex();drawPins();render();refreshPins()}

function covenHome(){
  current=null; clearDraft(); refreshPins();
  let h=`<div class="tabs" role="tablist">
    <button class="tab" role="tab" id="t-theo" aria-selected="${tab==="theo"}">Theo</button>
    <button class="tab" role="tab" id="t-spells" aria-selected="${tab==="spells"}">Spots</button>
    <button class="tab" role="tab" id="t-quests" aria-selected="${tab==="quests"}">Quests</button></div>`;
  if(tab==="theo"){
    const opened=spots.filter(s=>isOpen(s.id)), dn=spots.filter(s=>isDone(s.id));
    const notes=Object.values(progress).filter(p=>p.reply&&byId[p.spot_id]).sort((a,b)=>String(b.updated_at||"").localeCompare(String(a.updated_at||"")));
    h+=`<div class="stat"><div><b>${opened.length}</b>unlocked</div><div><b>${dn.length}</b>complete</div><div><b>${mine.length}</b>her spots</div></div>`;
    h+=`<h3 class="group">Notes back from Theo</h3>`;
    h+=notes.length?`<div class="card-list">${notes.map(p=>`<button class="item spotrow" style="border-bottom:2.5px solid var(--ink)" data-spot="${esc(p.spot_id)}"><span class="nm"><span class="t">${esc(byId[p.spot_id].name)}</span><span class="q" style="display:block">${esc(p.reply)}</span><small>${fmtDate(p.updated_at||p.done_at)}</small></span></button>`).join("")}</div>`
      :`<div class="empty">No notes back yet. They'll show up here when Theo finishes a quest.</div>`;
    h+=`<h3 class="group">Her own spots</h3>`;
    h+=mine.length?mine.map(s=>`<button class="spotrow" data-spot="${esc(s.id)}">${iconSVG(s.cat)}<span class="nm">${esc(s.name)}<small>${esc(s.note||"")}</small></span><span class="st">${fmtDate(s.created_at)}</span></button>`).join("")
      :`<div class="empty">She hasn't added any yet.</div>`;
    h+=`<h3 class="group">Spells she's unlocked</h3>`;
    h+=opened.length?opened.sort((a,b)=>String(progress[b.id].unlocked_at).localeCompare(String(progress[a.id].unlocked_at))).map(s=>`<button class="spotrow" data-spot="${esc(s.id)}">${iconSVG(s.cat)}<span class="nm">${esc(s.name)}<small>${esc(s.area||"")}</small></span><span class="st">${isDone(s.id)?"complete ✓":"unlocked"} · ${fmtDate(progress[s.id].unlocked_at)}</span></button>`).join("")
      :`<div class="empty">Nothing unlocked yet.</div>`;
  } else if(tab==="spells"){
    h+=`<p class="lede">Every spot holds one sealed note for Theo. Tap a spot to write or change its note.</p>
      <div class="rowbtns"><button class="pill dark" id="newspot">${smallIcon("i-moon")}Add a new spot</button></div>`;
    h+=groupedRows(()=>true,s=>{const n=spellsFor(s.id).length;return n?"note written ✓":"needs a note"});
  } else {
    h+=`<p class="lede">Quests are little routes of 3–4 spots for a free few hours.</p>
      <div class="rowbtns"><button class="pill dark" id="newquest">${smallIcon("i-moon")}Make a new quest</button></div>`;
    quests.forEach((q,qi)=>{const st=questStops(q);
      h+=`<div class="trail" style="cursor:default"><div class="kicker">Quest ${qi+1}</div><h3>${esc(q.name)}</h3><div class="when">${esc(q.when_text||"")}</div>
        <ol>${st.map((i,n)=>`<li><span class="dot${isOpen(i)?" open":""}">${isDone(i)?"✓":n+1}</span>${esc(byId[i].name)}</li>`).join("")}</ol>
        <div class="item acts" style="border:0;padding:8px 0 0"><button class="linkbtn" data-show="${esc(q.id)}">Show on map</button><button class="linkbtn" data-delq="${esc(q.id)}">Delete quest</button></div><div data-delbox="${esc(q.id)}"></div></div>`});
  }
  h+=`<p class="hint" style="margin-top:20px"><button class="linkbtn" id="signout">Sign out</button></p>`;
  panel.innerHTML=h; panel.scrollTop=0;
  const $=q=>panel.querySelector(q);
  $("#t-theo").onclick=()=>{tab="theo";selectQuest(null);covenHome()};
  $("#t-spells").onclick=()=>{tab="spells";selectQuest(null);covenHome()};
  $("#t-quests").onclick=()=>{tab="quests";covenHome()};
  $("#signout").onclick=async()=>{await sb.auth.signOut();member=null;document.getElementById("who").textContent="";drawLogin()};
  wireCommon();
  panel.querySelectorAll("[data-show]").forEach(b=>b.onclick=()=>selectQuest(b.dataset.show));
  panel.querySelectorAll("[data-delq]").forEach(b=>b.onclick=()=>{const id=b.dataset.delq;const box=panel.querySelector(`[data-delbox="${CSS.escape(id)}"]`);
    box.innerHTML=`<div class="row2" style="margin-top:8px"><button class="big" data-yes>Delete it</button><button class="big ghost" data-no>Keep it</button></div>`;
    box.querySelector("[data-no]").onclick=()=>{box.innerHTML=""};
    box.querySelector("[data-yes]").onclick=async()=>{const {error}=await sb.from("quests").delete().eq("id",id);
      if(error){toast("Couldn't delete: "+error.message);return} if(quest&&quest.id===id)selectQuest(null); await reloadCoven(); covenHome(); toast("Quest deleted")}});
  if($("#newspot"))$("#newspot").onclick=()=>{draft={name:"",area:"",cat:"cafe",tip:"",note:"",from:member.name};
    spotForm({title:"Add a new spot",back:"back to spots",withArea:true,withSpell:true,fromName:member.name,onSave:async d=>{
      const id=slug(d.name);
      const {error}=await sb.from("spots").insert({id,name:d.name.trim(),area:d.area.trim()||null,cat:d.cat,tip:d.tip.trim()||null,lat:d.lat,lng:d.lng});
      if(error){console.warn(error);return false}
      if(d.note.trim()){const r=await sb.from("spells").insert({spot_id:id,from_name:(d.from||member.name).trim(),message:d.note.trim()}); if(r.error)toast("Spot saved, but the note didn't: "+r.error.message)}
      clearDraft(); await reloadCoven(); tab="spells"; covenSpot(id,true); toast("New spot added. Theo will see it next time she opens her map."); return true}})};
  if($("#newquest"))$("#newquest").onclick=()=>questForm({name:"",when:"",stops:[]});
}

function covenSpot(id,fly){
  const s=byId[id]; if(!s)return; current=id; clearDraft(); if(fly)flyToSpot(s);
  if(s.mine){
    panel.innerHTML=`<button class="back" id="back">← back</button><div class="spot-head">${iconSVG(s.cat)}<div><h2>${esc(s.name)}</h2><div class="sub">Theo's own spot · added ${fmtDate(s.created_at)}</div></div></div>
      ${s.note?`<div class="envelope" style="margin-top:12px"><p class="note">${esc(s.note)}</p></div>`:""}
      <div class="links" style="margin-top:12px"><a href="${gmapsUrl(s)}" target="_blank" rel="noopener">See it in Google Maps ↗</a></div>`;
    panel.querySelector("#back").onclick=covenHome; refreshPins(); return;
  }
  const list=spellsFor(id); const p=progress[id];
  let h=`<button class="back" id="back">← back to ${tab}</button>
    <div class="spot-head">${iconSVG(s.cat)}<div><h2>${esc(s.name)}</h2><div class="sub">${(CATS[s.cat]||CATS.heart)[0]} · ${esc(s.area||"")} · ${isDone(id)?"Theo completed it ✓":isOpen(id)?"Theo has unlocked it":"still sealed"}</div></div></div>`;
  if(s.tip)h+=`<p class="tip"><b>Good to know:</b> ${esc(s.tip)}</p>`;
  if(p&&p.reply)h+=`<div class="reply" style="margin-bottom:14px"><h3>Theo's note back</h3><p class="mine-note">${esc(p.reply)}</p></div>`;
  const note=list[0];
  h+=`<div class="reply"><h3>${note?"The note for Theo":"Write the note for Theo"}</h3>
      <label for="smsg">What she'll read when she breaks the seal<textarea id="smsg" maxlength="600" placeholder="Dear Theo…">${esc(note?note.message:"")}</textarea></label>
      <label for="sfrom">Signed from<input type="text" id="sfrom" maxlength="40" value="${esc(note?(note.from_name||""):member.name)}"></label>
      <button class="big" id="savenote">${note?"Save changes":"Save note"}</button><p class="hint" id="smsgx">${note?`Last saved ${fmtDate(note.created_at)}.`:""}</p></div>
    <div class="stack"><button class="big ghost" id="delspot">Delete this whole spot</button><div id="delspotbox"></div></div>`;
  panel.innerHTML=h; panel.scrollTop=0;
  const $=q=>panel.querySelector(q);
  $("#back").onclick=covenHome;
  $("#savenote").onclick=async()=>{const m=$("#smsg").value.trim(), f=$("#sfrom").value.trim()||member.name;
    if(!m){$("#smsgx").textContent="Write the note first.";return}
    $("#savenote").disabled=true;
    const {error}=note
      ? await sb.from("spells").update({message:m,from_name:f}).eq("id",note.id)
      : await sb.from("spells").insert({spot_id:id,from_name:f,message:m});
    if(error){$("#savenote").disabled=false;$("#smsgx").textContent="That didn't save: "+error.message;return}
    await reloadCoven(); covenSpot(id,false); toast("Note saved ✦")};
  $("#delspot").onclick=()=>{const box=$("#delspotbox");
    box.innerHTML=`<p style="margin:0;text-align:center">Delete ${esc(s.name)} and its note? Theo will lose it from her map.</p><div class="row2"><button class="big" data-yes>Delete it</button><button class="big ghost" data-no>Keep it</button></div>`;
    box.querySelector("[data-no]").onclick=()=>{box.innerHTML=""};
    box.querySelector("[data-yes]").onclick=async()=>{const {error}=await sb.from("spots").delete().eq("id",id); if(error){toast("Couldn't delete: "+error.message);return}
      await reloadCoven(); tab="spells"; covenHome(); toast("Spot deleted")}};
  refreshPins();
}

function questForm(f){
  current=null; refreshPins();
  const picked=f.stops;
  let h=`<button class="back" id="back">← back to quests</button><h2 class="group" style="margin-top:4px">Make a new quest</h2>
    <div class="stack" style="margin-top:6px">
      <label for="qname">Quest name<input type="text" id="qname" maxlength="50" value="${esc(f.name)}" placeholder="e.g. Rainy Day Witchery"></label>
      <label for="qwhen">When and how long<input type="text" id="qwhen" maxlength="80" value="${esc(f.when)}" placeholder="e.g. Sunday afternoon · about 3 hours"></label>
      <div><div style="font-size:16px;margin-bottom:4px">Stops, in order (tap to add or remove)</div>
        <div class="picklist">${spots.map(s=>{const i=picked.indexOf(s.id);return `<button class="pick" data-pick="${esc(s.id)}"><span class="dot${i>=0?" open":""}">${i>=0?i+1:""}</span>${esc(s.name)} <span style="color:var(--ink-soft);font-size:14px">${esc(s.area||"")}</span></button>`}).join("")}</div></div>
      <button class="big" id="saveq">Save quest</button><p class="hint" id="qmsg"></p></div>`;
  panel.innerHTML=h;
  const $=q=>panel.querySelector(q);
  const keep=()=>{f.name=$("#qname").value;f.when=$("#qwhen").value};
  $("#back").onclick=()=>{selectQuest(null);covenHome()};
  panel.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{keep();const id=b.dataset.pick;const i=picked.indexOf(id);if(i>=0)picked.splice(i,1);else picked.push(id);
    const sc=panel.scrollTop; quest={id:"_draft",stops:picked}; refreshPins(); questForm(f); panel.scrollTop=sc});
  $("#saveq").onclick=async()=>{keep();
    if(!f.name.trim()){$("#qmsg").textContent="Give the quest a name.";return}
    if(picked.length<2){$("#qmsg").textContent="Pick at least 2 stops.";return}
    $("#saveq").disabled=true;
    const id=slug(f.name);
    const {error}=await sb.from("quests").insert({id,name:f.name.trim(),when_text:f.when.trim()||null,stops:picked});
    if(error){$("#saveq").disabled=false;$("#qmsg").textContent="That didn't save: "+error.message;return}
    quest=null; await reloadCoven(); tab="quests"; selectQuest(id); covenHome(); toast("New quest made! Theo will see it next time she opens her map.")};
}

/* ---------- the secret word ---------- */
function askCode(msg){
  modal.innerHTML=`<div class="card pop" role="dialog" aria-modal="true" aria-labelledby="lockt">
    <svg class="burst" viewBox="0 0 90 60" aria-hidden="true"><g fill="none" stroke="#151514" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M50 8a20 20 0 1 0 16 32A16 16 0 0 1 50 8z"/><path d="M68 10l1.6 4.4 4.4 1.6-4.4 1.6L68 22l-1.6-4.4-4.4-1.6 4.4-1.6zM22 14l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/></g></svg>
    <h2 id="lockt">Speak the secret word</h2>
    <p style="text-align:center;margin:0 0 14px">This map is sealed by the Coven. Only Theo knows the word.</p>
    <form id="codef" class="stack" style="margin-top:0">
      <label for="codein" style="text-align:center">Secret word<input type="password" id="codein" autocomplete="off" autocapitalize="off" spellcheck="false" style="text-align:center;font-size:24px;letter-spacing:4px"></label>
      <button class="big" type="submit">Break the seal</button>
      <p class="hint" id="codemsg" style="text-align:center">${esc(msg||"")}</p>
    </form></div>`;
  modal.hidden=false; modal.dataset.locked="1";
  const inp=modal.querySelector("#codein"); setTimeout(()=>inp.focus(),50);
  modal.querySelector("#codef").addEventListener("submit",e=>{e.preventDefault();
    const v=inp.value.trim(); if(!v){modal.querySelector("#codemsg").textContent="Type the secret word first.";return}
    theoCode=v; modal.querySelector("#codemsg").textContent="Checking…"; openBook(true);
  });
}
async function openBook(fromForm){
  try{ await loadAll(); }
  catch(err){
    if(err instanceof WrongCode){ theoCode=""; store.set("code",""); return askCode(fromForm?"That's not it. Try again!":"The secret word has changed. Ask the Coven for the new one."); }
    console.warn(err);
    if(fromForm){ const m=modal.querySelector("#codemsg"); if(m)m.textContent="Can't reach the spellbook. Check your internet and try again."; return; }
    panel.innerHTML=`<div class="empty">Can't reach the spellbook right now. Check your internet, then <button class="linkbtn" id="retry">try again</button>.</div>`;
    panel.querySelector("#retry").onclick=()=>openBook(); return;
  }
  store.set("code",theoCode);
  delete modal.dataset.locked; modal.hidden=true;
  rebuildIndex(); initSeen(); drawPins();
  view=fitPoints(ALL.map(s=>[s.x,s.y]),36); clampView(view); render(); home();
  if(firstVisit||!store.get("intro",false)){intro();store.set("intro",true)} else announceNew();
}

/* ======================================================================
   START
   ====================================================================== */
(async function start(){
  rebuildIndex(); drawPins(); render(); view=fitPoints(ALL.map(s=>[s.x,s.y]),36); clampView(view); render();
  if(MODE==="coven"){panel.innerHTML=`<div class="loading">Opening the spellbook…</div>`;return covenBoot()}
  panel.innerHTML=`<div class="loading">The spellbook is sealed…</div>`;
  if(theoCode) openBook(); else askCode();
})();
})();
