/* ==========================================================================
   FATURA — Controle Financeiro  ·  app.js
   Dados 100% no aparelho (localStorage). Sem servidor, sem custo.
   ========================================================================== */
(function () {
"use strict";

/* ---------------------------------------------------------------- ÍCONES */
const ICON = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
  bag:'<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.4a3.2 3.2 0 0 1 0 5.2"/><path d="M18 14.8c2 .8 3 2.6 3 5.2"/>',
  food:'<path d="M5 3v8a2.5 2.5 0 0 0 5 0V3"/><path d="M7.5 11v10"/><path d="M17 3c-1.6 1.2-2.5 3-2.5 5.2 0 1.7.9 2.8 2.5 2.8s2.5-1.1 2.5-2.8C19.5 6 18.6 4.2 17 3z"/><path d="M17 11v10"/>',
  car:'<path d="M4 16v-3.2L5.8 8h12.4L20 12.8V16"/><path d="M3 16h18v3h-3v-3M6 19v-3H3"/><circle cx="7.5" cy="16.5" r="1.3"/><circle cx="16.5" cy="16.5" r="1.3"/>',
  heart:'<path d="M12 20s-7-4.5-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6c0 4.9-7 9.4-7 9.4z"/>',
  fun:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5s1.3 1.6 3.5 1.6 3.5-1.6 3.5-1.6"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  book:'<path d="M4 5.5A2 2 0 0 1 6 3.5h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 18.5A2 2 0 0 0 6 20.5h13"/>',
  cart:'<circle cx="9.5" cy="19" r="1.4"/><circle cx="17.5" cy="19" r="1.4"/><path d="M3 4h2.2l2.4 11h11l2.2-8H6"/>',
  wifi:'<path d="M4 9.5a13 13 0 0 1 16 0"/><path d="M7 13a8.5 8.5 0 0 1 10 0"/><path d="M10 16.4a4 4 0 0 1 4 0"/><path d="M12 19.6h.01"/>',
  plane:'<path d="M11 3.5 20.5 13l-2 2-5-1.5-3 3 .8 3.3-1.6 1.6-2.2-4-4-2.2 1.6-1.6 3.3.8 3-3L9.5 5.5z"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2"/>',
  chart:'<path d="M4 19V9M10 19V4M16 19v-7M22 19H2"/>',
  dots:'<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  card:'<rect x="2.5" y="5.5" width="19" height="13.5" rx="2.6"/><path d="M2.5 10h19"/><path d="M6.5 15h4"/>',
  list:'<path d="M4 7h16M4 12h11M4 17h14"/>',
  trend:'<path d="M4 17.5 9.5 11l4 3.2L20 6"/><path d="M14.5 6H20v5.5"/>',
  bulb:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.1 1 1.6h5c.1-.5.4-1.1 1-1.6A6 6 0 0 0 12 3z"/>',
  alert:'<path d="M12 4 2.8 20h18.4L12 4z"/><path d="M12 10v4.5M12 17.4h.01"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  trash:'<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l1 13h8l1-13"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  left:'<path d="M15 5l-7 7 7 7"/>', right:'<path d="M9 5l7 7-7 7"/>',
  wa:'<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 8.4c.3-.1.6 0 .8.4l.7 1.4c.1.3 0 .6-.2.8l-.5.5c.6 1.2 1.5 2 2.7 2.6l.5-.5c.2-.2.5-.3.8-.2l1.4.7c.4.2.5.5.4.8-.3.9-1.2 1.4-2.1 1.2-2.8-.6-5-2.8-5.6-5.6-.2-.9.3-1.8 1.1-2.1z"/>',
  down:'<path d="M12 4v12M7 11.5l5 5 5-5"/><path d="M4 20h16"/>',
  up:'<path d="M12 20V8M7 12.5l5-5 5 5"/><path d="M4 4h16"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.8M12 18.7v2.8M4.2 7.2l2.4 1.4M17.4 15.4l2.4 1.4M4.2 16.8l2.4-1.4M17.4 8.6l2.4-1.4"/>',
  pig:'<path d="M4 12.5c0-3.3 3.1-6 7-6 1.3 0 2.5.3 3.6.8L18 5.5l-.5 3.2c.9.9 1.5 2 1.5 3.3 0 .6.9.6.9 1.5 0 1-.9 1.3-1.6 1.4-.5 1.2-1.5 2.2-2.8 2.8V20h-2.6v-1.6a9 9 0 0 1-2 .2 9 9 0 0 1-2-.2V20H6.3v-2.3c-1.4-1.1-2.3-2.8-2.3-4.7z"/><path d="M15 11.6h.01"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>',
};
const svg = (n, sw) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw||2}" stroke-linecap="round" stroke-linejoin="round">${ICON[n]||''}</svg>`;

/* ------------------------------------------------------------ CONFIG BASE */
const DEF_CARDS = [
  { id:'NUBANK',    name:'Nubank',    c1:'#9B2AE0', c2:'#4A0680', brand:'Mastercard', close:3,  due:10, limit:0 },
  { id:'SANTANDER', name:'Santander', c1:'#F02A2A', c2:'#8A0000', brand:'Visa',       close:25, due:5,  limit:0 },
  { id:'ITAU',      name:'Itaú',      c1:'#F58220', c2:'#003399', brand:'Visa',       close:20, due:1,  limit:0 },
  { id:'PIX',       name:'Pix',       c1:'#3FD1C0', c2:'#0E6B60', brand:'Pix',        close:0,  due:0,  limit:0 },
  { id:'DINHEIRO',  name:'Dinheiro',  c1:'#4FBF7C', c2:'#1D5637', brand:'Cash',       close:0,  due:0,  limit:0 },
];
const DEF_PEOPLE = [
  { id:'GUSTAVO',    name:'Gustavo',    phone:'', color:'#8B5CF6', owner:true },
  { id:'ALESSANDRO', name:'Alessandro', phone:'', color:'#5AA9F0' },
  { id:'ALINE',      name:'Aline',      phone:'', color:'#FF5C7A' },
  { id:'CRISTINA',   name:'Cristina',   phone:'', color:'#FFB020' },
  { id:'HEITOR',     name:'Heitor',     phone:'', color:'#2ED3B7' },
  { id:'LUIZ',       name:'Luiz',       phone:'', color:'#E0705A' },
  { id:'MICHELE',    name:'Michele',    phone:'', color:'#C77DFF' },
  { id:'OUTROS',     name:'Outros',     phone:'', color:'#8E86A8' },
];
const DEF_CATS = [
  { id:'FIXOS',      name:'Fixos',      color:'#5AA9F0', icon:'home'  },
  { id:'DIVERSOS',   name:'Diversos',   color:'#8B5CF6', icon:'bag'   },
  { id:'TERCEIROS',  name:'Terceiros',  color:'#FFB020', icon:'users' },
  { id:'COMIDA',     name:'Comida',     color:'#FF5C7A', icon:'food'  },
  { id:'CARRO',      name:'Carro',      color:'#2ED3B7', icon:'car'   },
  { id:'MERCADO',    name:'Mercado',    color:'#4FBF7C', icon:'cart'  },
  { id:'SAUDE',      name:'Saúde',      color:'#F27DA5', icon:'heart' },
  { id:'LAZER',      name:'Lazer',      color:'#C77DFF', icon:'fun'   },
  { id:'ASSINATURAS',name:'Assinaturas',color:'#7DD3E0', icon:'wifi'  },
  { id:'VIAGEM',     name:'Viagem',     color:'#E0A45A', icon:'plane' },
];

/* ------------------------------------------------------------- ARMAZENAMENTO */
const KEY = 'fatura.v1';
let DB = null;

function blank() {
  return { tx: [], cards: DEF_CARDS.map(o=>({...o})), people: DEF_PEOPLE.map(o=>({...o})),
           cats: DEF_CATS.map(o=>({...o})), settings: { seeded:false, meta:0 } };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { DB = Object.assign(blank(), JSON.parse(raw)); return; }
  } catch(e){}
  DB = blank();
  if (window.SEED_DATA) importSeed();
  save();
}
let st = null;
function save() {
  clearTimeout(st);
  st = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(DB)); }
    catch(e){ toast('Sem espaço para salvar. Exporte um backup em Ajustes.'); }
  }, 200);
}

/* Importa a planilha original uma única vez */
function importSeed() {
  const S = window.SEED_DATA;
  const knownCat = new Set(DEF_CATS.map(c=>c.id));
  const knownPer = new Set(DEF_PEOPLE.map(p=>p.id));
  const knownCard= new Set(DEF_CARDS.map(c=>c.id));
  const norm = s => String(s||'').trim().toUpperCase().replace(/\s+/g,'');
  (S.despesas||[]).forEach(d => {
    let cat = norm(d.cat); if(!knownCat.has(cat)) cat='DIVERSOS';
    let per = norm(d.person); if(!knownPer.has(per)) per='OUTROS';
    let card= norm(d.card); if(!knownCard.has(card)) card='PIX';
    const m = /\((\d+)\s*\/\s*(\d+)\)\s*$/.exec(d.desc);
    DB.tx.push({ id:uid(), kind:'out', date:d.date, desc:d.desc, amount:+d.amount||0,
      card, person:per, cat, status:(norm(d.status)==='PENDENTE'?'PENDENTE':'PAGO'),
      tipo:(norm(d.tipo)==='DIGITAL'?'DIGITAL':'FISICA'),
      n: m?+m[1]:(d.parcelas>1?1:null), of: m?+m[2]:(d.parcelas>1?d.parcelas:null), grp:null });
  });
  (S.receitas||[]).forEach(r => {
    DB.tx.push({ id:uid(), kind:'in', date:r.date, desc:r.source, amount:+r.amount||0,
      card:'PIX', person:'GUSTAVO', cat:'RECEITA', status:'PAGO', fixed:false, method:r.method||'' });
  });
  DB.settings.seeded = true;
}

/* ------------------------------------------------------------------- UTILS */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const BRL = v => (v<0?'-':'') + 'R$ ' + Math.abs(+v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const BRLk = v => { const n=Math.abs(+v||0); const s=v<0?'-':'';
  return n>=1000 ? s+'R$ '+(n/1000).toFixed(n>=10000?0:1).replace('.',',')+'k' : s+'R$ '+n.toFixed(0); };
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const mk = d => (d||'').slice(0,7);
const nowMK = () => { const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); };
const todayISO = () => { const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
function mkAdd(k, n) { const [y,m]=k.split('-').map(Number); const d=new Date(y, m-1+n, 1);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
function mkLabel(k, long) { const [y,m]=k.split('-').map(Number);
  const s = new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:long?'long':'short',year:'numeric'});
  return s.charAt(0).toUpperCase()+s.slice(1).replace('.',''); }
function dLabel(iso) { const [y,m,d]=iso.split('-').map(Number);
  return new Date(y,m-1,d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.',''); }
const card = id => DB.cards.find(c=>c.id===id) || {id, name:id, c1:'#6F6688', c2:'#3A3550', brand:''};
const person = id => DB.people.find(p=>p.id===id) || {id, name:id, color:'#8E86A8'};
const cat = id => DB.cats.find(c=>c.id===id) || {id, name:id, color:'#8E86A8', icon:'bag'};

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), 2600);
}

/* ------------------------------------------------------------------ ESTADO */
let MK = nowMK();
let TAB = 'inicio';
let F = { card:'ALL', person:'ALL', cat:'ALL', status:'ALL', q:'' };

/* -------------------------------------------------------------- SELETORES */
const outOf   = k => DB.tx.filter(t=>t.kind==='out' && mk(t.date)===k);
const inOf    = k => DB.tx.filter(t=>t.kind==='in'  && mk(t.date)===k);
const sum     = a => a.reduce((s,t)=>s+(+t.amount||0),0);
function groupBy(list, key) { const m={}; list.forEach(t=>{ m[t[key]]=(m[t[key]]||0)+(+t.amount||0); }); return m; }
function sorted(m) { return Object.entries(m).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]); }

function monthStats(k) {
  const o = outOf(k), i = inOf(k);
  const desp = sum(o), rec = sum(i);
  const pend = sum(o.filter(t=>t.status==='PENDENTE'));
  const meus = sum(o.filter(t=>t.person==='GUSTAVO'));
  const outros = desp - meus;
  return { desp, rec, pend, meus, outros, saldo: rec-desp, n:o.length };
}
function availableToSpend(k) {
  const s = monthStats(k);
  const meta = +DB.settings.meta || 0;
  if (meta > 0) return { limit: meta, used: s.desp, left: meta - s.desp, mode:'meta' };
  return { limit: s.rec, used: s.desp, left: s.rec - s.desp, mode:'receita' };
}
function futureMonths(n) {
  const out = [];
  for (let i=1; i<=n; i++) { const k = mkAdd(nowMK(), i); out.push({ k, total: sum(outOf(k)), rec: sum(inOf(k)) }); }
  return out;
}
function lastMonths(n, endK) {
  const out = []; const base = endK || MK;
  for (let i=n-1; i>=0; i--) { const k = mkAdd(base, -i);
    out.push({ k, desp: sum(outOf(k)), rec: sum(inOf(k)) }); }
  return out;
}
/* Fatura: o que cai na fatura que fecha no mês k, para o cartão c */
function faturaOf(cardId, k) {
  const c = card(cardId);
  const list = DB.tx.filter(t => t.kind==='out' && t.card===cardId && mk(t.date)===k);
  return { total: sum(list), list, close:c.close, due:c.due };
}

/* --------------------------------------------------------------- GRÁFICOS */
function donut(entries, size, colorOf, centerTop, centerBot) {
  const total = entries.reduce((s,[,v])=>s+v,0);
  if (!total) return `<div class="empty"><span class="e">◔</span>Sem dados no período.</div>`;
  const R = size/2 - 11, C = 2*Math.PI*R; let acc = 0;
  const arcs = entries.map(([k,v]) => {
    const frac = v/total, dash = frac*C;
    const el = `<circle cx="${size/2}" cy="${size/2}" r="${R}" fill="none" stroke="${colorOf(k)}"
      stroke-width="15" stroke-dasharray="${dash-2.2} ${C-dash+2.2}" stroke-dashoffset="${-acc}" stroke-linecap="round"/>`;
    acc += dash; return el;
  }).join('');
  return `<div style="position:relative;width:${size}px;height:${size}px;flex-shrink:0">
    <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${R}" fill="none" stroke="#29223F" stroke-width="15"/>${arcs}
    </svg>
    <div style="position:absolute;inset:0;display:grid;place-content:center;text-align:center">
      <div class="num" style="font-size:${size>150?18:16}px;font-weight:800">${centerTop}</div>
      <div style="font-size:9.5px;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-top:2px">${centerBot}</div>
    </div></div>`;
}
function miniBars(series, colorA, colorB) {
  const max = Math.max(1, ...series.map(s=>Math.max(s.desp||0, s.rec||0)));
  return `<div style="display:flex;align-items:flex-end;gap:8px;height:150px;padding-top:6px">
    ${series.map(s=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0">
      <div style="flex:1;display:flex;align-items:flex-end;gap:3px;width:100%;justify-content:center">
        <div title="Receita ${BRL(s.rec)}" style="width:38%;max-width:15px;height:${Math.max(2,(s.rec/max)*100)}%;background:${colorB};border-radius:4px 4px 0 0;opacity:.92"></div>
        <div title="Despesa ${BRL(s.desp)}" style="width:38%;max-width:15px;height:${Math.max(2,(s.desp/max)*100)}%;background:${colorA};border-radius:4px 4px 0 0"></div>
      </div>
      <div style="font-size:9.5px;color:var(--dim);white-space:nowrap">${mkLabel(s.k).split(' ')[0]}</div>
    </div>`).join('')}
  </div>
  <div style="display:flex;gap:16px;justify-content:center;margin-top:10px;font-size:11px;color:var(--muted)">
    <span><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${colorB};margin-right:5px"></i>Receitas</span>
    <span><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${colorA};margin-right:5px"></i>Despesas</span>
  </div>`;
}

/* ------------------------------------------------------------- NAVEGAÇÃO */
const NAV = [
  { id:'inicio',   label:'Início',    icon:'home',  bottom:true },
  { id:'extrato',  label:'Extrato',   icon:'list',  bottom:true },
  { id:'cartoes',  label:'Cartões',   icon:'card',  bottom:true },
  { id:'pessoas',  label:'Pessoas',   icon:'users', bottom:true },
  { id:'previsao', label:'Previsão',  icon:'trend' },
  { id:'receitas', label:'Receitas',  icon:'up'    },
  { id:'config',   label:'Ajustes',   icon:'gear'  },
];
function drawNav() {
  document.getElementById('sidenav').innerHTML = NAV.map(n =>
    `<button class="nav-item ${n.id===TAB?'active':''}" data-go="${n.id}">${svg(n.icon)}${n.label}</button>`).join('');
  const bot = NAV.filter(n=>n.bottom);
  document.getElementById('bnav').innerHTML = bot.map(n =>
    `<button class="${n.id===TAB?'active':''}" data-go="${n.id}">${svg(n.icon,2.1)}${n.label}</button>`).join('')
    + `<button class="${['previsao','receitas','config'].includes(TAB)?'active':''}" data-more="1">${svg('dots',2.1)}Mais</button>`;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  const mb = document.querySelector('[data-more]'); if (mb) mb.onclick = moreSheet;
  document.getElementById('sideFoot').innerHTML =
    `<strong style="color:var(--muted)">${DB.tx.length}</strong> lançamentos salvos neste aparelho.<br>
     Faça backup em Ajustes de vez em quando.`;
}
function go(tab) {
  TAB = tab;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
  document.getElementById('v-'+tab).classList.add('on');
  drawNav(); render();
  window.scrollTo(0,0);
}
function moreSheet() {
  openModal(`<div class="mhead"><h2>Mais</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${['previsao','receitas','config'].map(id=>{const n=NAV.find(x=>x.id===id);
        return `<button class="btn" style="justify-content:flex-start;padding:14px 16px" data-goc="${id}">${svg(n.icon)}${n.label}</button>`;}).join('')}
    </div>`);
  document.querySelectorAll('[data-goc]').forEach(b=>b.onclick=()=>{closeModal();go(b.dataset.goc);});
}

/* ------------------------------------------------------------ MONTH BAR */
function monthbar() {
  return `<div class="monthbar">
    <button data-mv="-1">${svg('left')}</button>
    <span class="lbl">${mkLabel(MK, true)}</span>
    <button data-mv="1">${svg('right')}</button>
  </div>`;
}
function bindMonth(scope) {
  scope.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{ MK = mkAdd(MK, +b.dataset.mv); render(); });
}

/* =========================================================== VIEW: INÍCIO */
function vInicio() {
  const s = monthStats(MK);
  const av = availableToSpend(MK);
  const pct = av.limit>0 ? Math.min(100, Math.round(av.used/av.limit*100)) : 0;
  const byCat = sorted(groupBy(outOf(MK), 'cat'));
  const byPer = sorted(groupBy(outOf(MK), 'person'));
  const rec = DB.tx.filter(t=>mk(t.date)===MK).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  const isNow = MK===nowMK();
  const ring = 2*Math.PI*52;
  const leftColor = av.left<0 ? 'var(--coral)' : av.left < av.limit*0.2 ? 'var(--amber)' : 'var(--teal)';

  return `
  <div class="phead">
    <div><h1>Olá, Gustavo</h1><div class="sub">${isNow?'Seu mês até agora':'Visão de '+mkLabel(MK,true)}</div></div>
    ${monthbar()}
  </div>

  <div class="grid" style="grid-template-columns:1.25fr .9fr" id="topgrid">
    <div class="hero">
      <div class="hero-in">
        <div class="lab">Saldo do mês</div>
        <div class="big ${s.saldo<0?'neg':'pos'}">${BRL(s.saldo)}</div>
        <div class="hero-split">
          <div><div class="l">Receitas</div><div class="v t-in">${BRL(s.rec)}</div></div>
          <div><div class="l">Despesas</div><div class="v t-out">${BRL(s.desp)}</div></div>
          <div><div class="l">Meus gastos</div><div class="v">${BRL(s.meus)}</div></div>
          <div><div class="l">De terceiros</div><div class="v t-sk">${BRL(s.outros)}</div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="clab">Disponível para gastar</div>
      <div class="gauge-wrap">
        <div class="gauge">
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r="52" fill="none" stroke="#29223F" stroke-width="13"/>
            <circle cx="66" cy="66" r="52" fill="none" stroke="${leftColor}" stroke-width="13" stroke-linecap="round"
              stroke-dasharray="${ring}" stroke-dashoffset="${ring - ring*pct/100}"/>
          </svg>
          <div class="mid"><div class="v" style="color:${leftColor}">${BRLk(av.left)}</div><div class="l">restam</div></div>
        </div>
        <ul class="gauge-info">
          <li><span class="k">${av.mode==='meta'?'Meta do mês':'Receita do mês'}</span><span class="n">${BRL(av.limit)}</span></li>
          <li><span class="k">Já gasto</span><span class="n t-out">${BRL(av.used)}</span></li>
          <li><span class="k">Pendente</span><span class="n t-am">${BRL(s.pend)}</span></li>
          <li><span class="k">Comprometido</span><span class="n">${pct}%</span></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card sec">
    <div class="row-between" style="margin-bottom:12px"><h3>Seus cartões em ${mkLabel(MK)}</h3>
      <button class="link" data-go2="cartoes">detalhes</button></div>
    <div class="cardstack">${DB.cards.map(c=>cardTile(c)).join('')}</div>
  </div>

  <div class="two sec">
    <div class="card">
      <div class="row-between" style="margin-bottom:14px"><h3>Por categoria</h3></div>
      <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        ${donut(byCat.slice(0,7), 150, k=>cat(k).color, BRLk(s.desp), 'no mês')}
        <div style="flex:1;min-width:170px">
          ${byCat.length ? byCat.slice(0,6).map(([k,v])=>{const c=cat(k);const p=Math.round(v/s.desp*100);
            return `<div class="brow"><div class="t"><span class="nm">
              <span class="ico sm" style="background:${c.color}22;color:${c.color}">${svg(c.icon)}</span><span>${esc(c.name)}</span></span>
              <span class="vl">${BRL(v)} · ${p}%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${c.color}"></div></div></div>`;}).join('')
            : `<div class="empty"><span class="e">◔</span>Nada lançado ainda.</div>`}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="row-between" style="margin-bottom:14px"><h3>Por pessoa</h3>
        <button class="link" data-go2="pessoas">cobrar</button></div>
      ${byPer.length ? byPer.map(([k,v])=>{const p=person(k);const pc=Math.round(v/s.desp*100);
        return `<div class="brow"><div class="t"><span class="nm">
          <span class="pbadge" style="width:24px;height:24px;border-radius:8px;font-size:11px;background:${p.color}">${esc(p.name[0])}</span>
          <span>${esc(p.name)}</span></span><span class="vl">${BRL(v)} · ${pc}%</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pc}%;background:${p.color}"></div></div></div>`;}).join('')
        : `<div class="empty"><span class="e">👥</span>Nada lançado ainda.</div>`}
    </div>
  </div>

  <div class="two sec">
    <div class="card desk">
      <div class="clab">Receitas × Despesas — 6 meses</div>
      ${miniBars(lastMonths(6), '#FF5C7A', '#2ED3B7')}
    </div>
    <div class="card">
      <div class="row-between" style="margin-bottom:8px"><h3>Últimos lançamentos</h3>
        <button class="link" data-go2="extrato">ver tudo</button></div>
      ${rec.length ? rec.map(txRow).join('') : `<div class="empty"><span class="e">📄</span>Nenhum lançamento em ${mkLabel(MK)}.<br>Toque no + para começar.</div>`}
    </div>
  </div>

  <div class="card sec">
    <div class="row-between" style="margin-bottom:13px"><h3>${svg('bulb')} Dicas pra você economizar</h3></div>
    ${tips().map(t=>`<div class="tip"><div class="ti" style="background:${t.c}22;color:${t.c}">${svg(t.i)}</div>
      <div><h4>${t.t}</h4><p>${t.p}</p></div></div>`).join('')}
  </div>`;
}

function cardTile(c) {
  const f = faturaOf(c.id, MK);
  const isCard = c.close > 0;
  const pctLimit = c.limit>0 ? Math.min(100, Math.round(f.total/c.limit*100)) : null;
  return `<button class="ctile" data-card="${c.id}" style="background:linear-gradient(140deg,${c.c1},${c.c2})">
    <div class="ct-top">
      <div><div class="ct-name">${esc(c.name)}</div>
        <div class="ct-lab" style="margin-top:5px">${isCard?'Fatura':'Movimentado'}</div>
        <div class="ct-val">${BRLk(f.total)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="brand-badge">${esc((c.brand||'').toUpperCase())}</div>
        <div class="ct-chip"></div></div>
    </div>
    <div class="ct-foot">${isCard ? `Fecha dia ${c.close} · vence dia ${c.due}` : 'Débito imediato'}${pctLimit!=null?` · ${pctLimit}% do limite`:''}</div>
  </button>`;
}

function txRow(t) {
  const c = cat(t.cat), p = person(t.person), cd = card(t.card);
  const isIn = t.kind==='in';
  return `<div class="lrow" data-tx="${t.id}">
    <div class="l">
      <span class="ico" style="background:${isIn?'#2ED3B722':c.color+'22'};color:${isIn?'#2ED3B7':c.color}">${svg(isIn?'up':c.icon)}</span>
      <div style="min-width:0">
        <div class="tt">${esc(t.desc||c.name)}</div>
        <div class="ss">
          <span class="dot" style="background:${cd.c1}"></span>${esc(cd.name)}
          ${!isIn?`· ${esc(p.name)}`:''} · ${dLabel(t.date)}
          ${t.of?`<span class="tag parc">${t.n}/${t.of}</span>`:''}
          ${t.status==='PENDENTE'?`<span class="tag pend">pendente</span>`:''}
        </div>
      </div>
    </div>
    <div class="amt" style="color:${isIn?'var(--teal)':'var(--text)'}">${isIn?'+':'−'} ${BRL(t.amount)}</div>
  </div>`;
}

/* --------------------------------------------------------------- DICAS */
function tips() {
  const out = [];
  const s = monthStats(MK);
  const av = availableToSpend(MK);
  const prev3 = lastMonths(4).slice(0,3);
  const avg = prev3.length ? prev3.reduce((a,b)=>a+b.desp,0)/prev3.length : 0;

  if (av.left < 0)
    out.push({ i:'alert', c:'#FF5C7A', t:'Você passou do que entrou este mês',
      p:`Suas despesas de ${mkLabel(MK)} superam as receitas em <strong>${BRL(-av.left)}</strong>. Antes de qualquer corte novo, vale olhar as parcelas: elas continuam caindo mesmo em meses magros.` });
  else if (av.limit>0 && av.left < av.limit*0.15)
    out.push({ i:'alert', c:'#FFB020', t:'Reta final do orçamento',
      p:`Sobram <strong>${BRL(av.left)}</strong> de ${BRL(av.limit)}. Dá pra fechar no azul segurando os gastos por impulso até a virada do mês.` });

  const byCat = sorted(groupBy(outOf(MK),'cat'));
  if (byCat.length) {
    const [topId, topV] = byCat[0];
    const share = Math.round(topV/s.desp*100);
    if (share >= 35)
      out.push({ i:'chart', c:cat(topId).color, t:`${cat(topId).name} come ${share}% do seu mês`,
        p:`São <strong>${BRL(topV)}</strong> só nessa categoria. Uma redução de 10% aqui devolveria ${BRL(topV*0.1)} ao seu bolso — mais do que cortar três categorias pequenas.` });
  }
  if (avg > 0 && s.desp > avg*1.15)
    out.push({ i:'trend', c:'#FF5C7A', t:'Mês acima da sua média',
      p:`Você gastou <strong>${BRL(s.desp)}</strong> contra uma média de ${BRL(avg)} nos 3 meses anteriores. Diferença de ${BRL(s.desp-avg)}.` });
  if (avg > 0 && s.desp < avg*0.9)
    out.push({ i:'check', c:'#2ED3B7', t:'Mês mais leve que o normal',
      p:`Ficou ${BRL(avg-s.desp)} abaixo da sua média. Se esse valor for pra uma reserva agora, ele não vira gasto depois.` });

  if (s.pend > 0)
    out.push({ i:'alert', c:'#FFB020', t:`${BRL(s.pend)} ainda em aberto`,
      p:`Há lançamentos marcados como pendentes em ${mkLabel(MK)}. Confirme os que já foram pagos para o saldo refletir a realidade.` });

  const fut = futureMonths(6);
  const futTotal = fut.reduce((a,b)=>a+b.total,0);
  if (futTotal > 0) {
    const worst = fut.reduce((a,b)=> b.total>a.total?b:a, fut[0]);
    out.push({ i:'calendar', c:'#5AA9F0', t:'Seus próximos 6 meses já têm dono',
      p:`Existem <strong>${BRL(futTotal)}</strong> em parcelas e fixos já lançados. O mês mais pesado é ${mkLabel(worst.k,true)}, com ${BRL(worst.total)}. Vale evitar novos parcelamentos que caiam nele.` });
  }
  const terc = sum(outOf(MK).filter(t=>t.person!=='GUSTAVO'));
  if (terc > 0)
    out.push({ i:'users', c:'#8B5CF6', t:`${BRL(terc)} são de outras pessoas`,
      p:`Esse valor passa no seu cartão mas não é seu gasto. Cobre em Pessoas antes do fechamento — cada dia de atraso é dinheiro seu financiando o de outro.` });

  if (!out.length)
    out.push({ i:'check', c:'#2ED3B7', t:'Tudo tranquilo por aqui',
      p:'Nenhum sinal de alerta em ' + mkLabel(MK,true) + '. Continue lançando as compras no dia em que acontecem — é o que mantém a previsão confiável.' });

  return out.slice(0,4);
}

/* ========================================================== VIEW: EXTRATO */
function vExtrato() {
  let list = DB.tx.filter(t => mk(t.date)===MK);
  if (F.card!=='ALL')   list = list.filter(t=>t.card===F.card);
  if (F.person!=='ALL') list = list.filter(t=>t.person===F.person);
  if (F.cat!=='ALL')    list = list.filter(t=>t.cat===F.cat);
  if (F.status!=='ALL') list = list.filter(t=>t.status===F.status);
  if (F.q) { const q=F.q.toLowerCase(); list = list.filter(t=>(t.desc||'').toLowerCase().includes(q)); }
  list.sort((a,b)=> b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const d = sum(list.filter(t=>t.kind==='out')), r = sum(list.filter(t=>t.kind==='in'));

  return `
  <div class="phead"><div><h1>Extrato</h1><div class="sub">${list.length} lançamentos no filtro</div></div>${monthbar()}</div>

  <div class="three keep">
    <div class="card tight kpi"><div class="clab">Saídas</div><div class="v t-out">${BRL(d)}</div></div>
    <div class="card tight kpi"><div class="clab">Entradas</div><div class="v t-in">${BRL(r)}</div></div>
    <div class="card tight kpi desk"><div class="clab">Resultado</div><div class="v" style="color:${r-d>=0?'var(--teal)':'var(--coral)'}">${BRL(r-d)}</div></div>
  </div>

  <div class="filters sec">
    <input type="search" id="fq" placeholder="Buscar descrição…" value="${esc(F.q)}" style="flex:1;min-width:150px">
    <select id="fcard"><option value="ALL">Todos os cartões</option>${DB.cards.map(c=>`<option value="${c.id}" ${F.card===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
    <select id="fper"><option value="ALL">Todas as pessoas</option>${DB.people.map(p=>`<option value="${p.id}" ${F.person===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
    <select id="fcat"><option value="ALL">Todas as categorias</option>${DB.cats.map(c=>`<option value="${c.id}" ${F.cat===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
    <select id="fst"><option value="ALL">Todos</option><option value="PAGO" ${F.status==='PAGO'?'selected':''}>Pagos</option><option value="PENDENTE" ${F.status==='PENDENTE'?'selected':''}>Pendentes</option></select>
    <button class="btn btn-p btn-sm desk" id="addTop">${svg('plus')}Lançar</button>
  </div>

  <div class="card">
    <table class="dt">
      <thead><tr><th>Descrição</th><th>Categoria</th><th>Cartão</th><th>Pessoa</th><th>Data</th><th>Status</th><th style="text-align:right">Valor</th><th></th></tr></thead>
      <tbody>${list.length ? list.map(txTable).join('') : `<tr><td colspan="8"><div class="empty"><span class="e">🔍</span>Nada encontrado com esses filtros.</div></td></tr>`}</tbody>
    </table>
    <div class="mcards">${list.length ? list.map(txRow).join('') : `<div class="empty"><span class="e">🔍</span>Nada encontrado com esses filtros.</div>`}</div>
  </div>`;
}
function txTable(t) {
  const c = cat(t.cat), p = person(t.person), cd = card(t.card), isIn = t.kind==='in';
  return `<tr>
    <td><div style="display:flex;align-items:center;gap:9px">
      <span class="ico sm" style="background:${isIn?'#2ED3B722':c.color+'22'};color:${isIn?'#2ED3B7':c.color}">${svg(isIn?'up':c.icon,2.1)}</span>
      <span>${esc(t.desc)} ${t.of?`<span class="tag parc">${t.n}/${t.of}</span>`:''}</span></div></td>
    <td>${isIn?'<span style="color:var(--teal)">Receita</span>':esc(c.name)}</td>
    <td><span class="dot" style="background:${cd.c1};margin-right:6px"></span>${esc(cd.name)}</td>
    <td>${isIn?'—':esc(p.name)}</td>
    <td>${dLabel(t.date)}</td>
    <td><span class="tag ${t.status==='PENDENTE'?'pend':'pago'}">${t.status==='PENDENTE'?'pendente':'pago'}</span></td>
    <td class="n" style="color:${isIn?'var(--teal)':'var(--text)'}">${isIn?'+':'−'} ${BRL(t.amount)}</td>
    <td style="text-align:right;white-space:nowrap">
      <button class="ibtn" data-toggle="${t.id}" title="Alternar pago/pendente">${svg('check')}</button>
      <button class="ibtn" data-del="${t.id}" title="Excluir" style="margin-left:5px">${svg('trash')}</button></td>
  </tr>`;
}

/* ========================================================== VIEW: CARTÕES */
function vCartoes() {
  const total = sum(outOf(MK));
  return `
  <div class="phead"><div><h1>Cartões</h1><div class="sub">Faturas de ${mkLabel(MK,true)}</div></div>${monthbar()}</div>
  <div class="card"><div class="cardstack">${DB.cards.map(c=>cardTile(c)).join('')}</div></div>

  <div class="sec" style="display:flex;flex-direction:column;gap:16px">
  ${DB.cards.map(c => {
    const f = faturaOf(c.id, MK);
    if (!f.total && !f.list.length) return '';
    const byCat = sorted(groupBy(f.list,'cat'));
    const byPer = sorted(groupBy(f.list,'person'));
    const share = total>0 ? Math.round(f.total/total*100) : 0;
    return `<div class="card">
      <div class="row-between" style="margin-bottom:14px;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:30px;border-radius:7px;background:linear-gradient(140deg,${c.c1},${c.c2});
            display:grid;place-items:center;font-size:9px;font-weight:800;color:#fff">${esc((c.brand||'').slice(0,4).toUpperCase())}</div>
          <div><h3>${esc(c.name)}</h3>
            <div style="font-size:11.5px;color:var(--dim);margin-top:2px">
              ${c.close>0?`Fecha dia ${c.close} · vence dia ${c.due}`:'Débito imediato'} · ${f.list.length} lançamentos</div></div>
        </div>
        <div style="text-align:right"><div class="num" style="font-size:21px;font-weight:800">${BRL(f.total)}</div>
          <div style="font-size:11px;color:var(--dim)">${share}% do mês</div></div>
      </div>
      <div class="two">
        <div>${byCat.slice(0,5).map(([k,v])=>{const cc=cat(k);const p=Math.round(v/f.total*100);
          return `<div class="brow"><div class="t"><span class="nm">
            <span class="ico sm" style="background:${cc.color}22;color:${cc.color}">${svg(cc.icon)}</span><span>${esc(cc.name)}</span></span>
            <span class="vl">${BRL(v)}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${cc.color}"></div></div></div>`;}).join('')}</div>
        <div>${byPer.slice(0,5).map(([k,v])=>{const pp=person(k);const p=Math.round(v/f.total*100);
          return `<div class="brow"><div class="t"><span class="nm">
            <span class="pbadge" style="width:22px;height:22px;border-radius:7px;font-size:10px;background:${pp.color}">${esc(pp.name[0])}</span>
            <span>${esc(pp.name)}</span></span><span class="vl">${BRL(v)}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${pp.color}"></div></div></div>`;}).join('')}</div>
      </div>
    </div>`;
  }).join('') || `<div class="card"><div class="empty"><span class="e">💳</span>Nenhum gasto em ${mkLabel(MK)}.</div></div>`}
  </div>`;
}

/* ========================================================== VIEW: PESSOAS */
function vPessoas() {
  const list = outOf(MK);
  const byPer = groupBy(list, 'person');
  const total = sum(list);
  const rows = DB.people.map(p => {
    const v = byPer[p.id]||0;
    const items = list.filter(t=>t.person===p.id);
    const pend = sum(items.filter(t=>t.status==='PENDENTE'));
    return { p, v, items, pend };
  }).filter(r=>r.v>0).sort((a,b)=>b.v-a.v);

  return `
  <div class="phead"><div><h1>Pessoas</h1><div class="sub">Quem usou seus cartões em ${mkLabel(MK,true)}</div></div>${monthbar()}</div>

  <div class="card">
    <div class="row-between" style="margin-bottom:6px"><h3>Divisão do mês</h3>
      <span class="num" style="font-size:15px;font-weight:700">${BRL(total)}</span></div>
    <div style="display:flex;height:12px;border-radius:8px;overflow:hidden;background:var(--panel2);margin:12px 0 6px">
      ${rows.map(r=>`<div title="${esc(r.p.name)}" style="width:${(r.v/total*100)}%;background:${r.p.color}"></div>`).join('')}
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:11.5px;color:var(--muted);margin-top:10px">
      ${rows.map(r=>`<span><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${r.p.color};margin-right:5px"></i>${esc(r.p.name)} ${Math.round(r.v/total*100)}%</span>`).join('')}
    </div>
  </div>

  <div class="sec" style="display:flex;flex-direction:column;gap:14px">
  ${rows.length ? rows.map(r => {
    const cards = sorted(groupBy(r.items,'card'));
    const mainCard = cards.length ? card(cards[0][0]) : null;
    return `<div class="card">
      <div class="row-between" style="flex-wrap:wrap;gap:12px">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <div class="pbadge" style="background:${r.p.color};width:40px;height:40px;border-radius:13px;font-size:16px">${esc(r.p.name[0])}</div>
          <div style="min-width:0"><h3>${esc(r.p.name)}</h3>
            <div style="font-size:11.5px;color:var(--dim);margin-top:2px">${r.items.length} compras${r.pend>0?` · ${BRL(r.pend)} pendente`:''}${(r.p.owner||r.p.phone)?'':' · sem WhatsApp cadastrado'}</div></div>
        </div>
        <div style="text-align:right"><div class="num" style="font-size:20px;font-weight:800">${BRL(r.v)}</div>
          <div style="font-size:11px;color:var(--dim)">${mainCard?'via '+esc(mainCard.name):''}</div></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        ${r.p.owner ? '' : `<button class="btn btn-wa btn-sm" data-wa="${r.p.id}">${svg('wa')}Cobrar no WhatsApp</button>`}
        <button class="btn btn-sm" data-pdet="${r.p.id}">Ver compras</button>
        ${r.p.owner ? '' : `<button class="btn btn-sm btn-g" data-pphone="${r.p.id}">${r.p.phone?'Editar número':'Cadastrar número'}</button>`}
      </div>
    </div>`;
  }).join('') : `<div class="card"><div class="empty"><span class="e">👥</span>Ninguém usou seus cartões em ${mkLabel(MK)}.</div></div>`}
  </div>`;
}

/* ------------------------------------------------------------- WHATSAPP */
function waMessage(pid) {
  const p = person(pid);
  const items = outOf(MK).filter(t=>t.person===pid);
  const total = sum(items);
  if (!total) { toast('Nada para cobrar dessa pessoa em ' + mkLabel(MK)); return; }
  const byCard = sorted(groupBy(items,'card'));
  const cardLines = byCard.map(([cid,v]) => {
    const c = card(cid);
    const venc = c.due>0 ? ` (vence dia ${c.due})` : '';
    return `• ${c.name}: ${BRL(v)}${venc}`;
  }).join('\n');
  const parcelas = items.filter(t=>t.of>1);
  const topItems = [...items].sort((a,b)=>b.amount-a.amount).slice(0,5)
    .map(t=>`  - ${t.desc} — ${BRL(t.amount)}`).join('\n');
  const firstCard = byCard.length ? card(byCard[0][0]) : null;

  const msg =
`Oi, ${p.name}! Tudo bem?

Fechamento de ${mkLabel(MK, true)} 👇

*Total no meu cartão: ${BRL(total)}*

${cardLines}
${firstCard && firstCard.close>0 ? `\nA fatura fecha dia ${firstCard.close} e vence dia ${firstCard.due}.` : ''}
Principais compras:
${topItems}
${parcelas.length ? `\nObs: ${parcelas.length} desses lançamentos são parcelas que seguem nos próximos meses.` : ''}
Qualquer dúvida é só chamar. Valeu! 🙏`;

  openModal(`
    <div class="mhead"><h2>Cobrar ${esc(p.name)}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div class="fld"><label>Mensagem (pode editar)</label>
      <textarea id="waTxt" rows="13" style="font-size:13.5px;line-height:1.55;resize:vertical">${esc(msg)}</textarea></div>
    <div class="fld"><label>WhatsApp de ${esc(p.name)}</label>
      <input id="waPhone" inputmode="tel" placeholder="Ex: 22999998888" value="${esc(p.phone||'')}"></div>
    <p style="font-size:11.5px;color:var(--dim);margin:0 0 4px;line-height:1.5">
      Abre o WhatsApp já com a mensagem escrita. Você só confere e toca em enviar.</p>
    <div class="macts">
      <button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-wa" id="waGo">${svg('wa')}Abrir WhatsApp</button>
    </div>`);
  document.getElementById('waGo').onclick = () => {
    const raw = document.getElementById('waPhone').value.replace(/\D/g,'');
    const txt = encodeURIComponent(document.getElementById('waTxt').value);
    if (raw) { const pp = DB.people.find(x=>x.id===pid); if (pp) { pp.phone = raw; save(); } }
    const num = raw ? (raw.length<=11 ? '55'+raw : raw) : '';
    window.open(`https://wa.me/${num}?text=${txt}`, '_blank');
    closeModal();
  };
}

/* ========================================================= VIEW: PREVISÃO */
function vPrevisao() {
  const fut = futureMonths(12);
  const max = Math.max(1, ...fut.map(f=>f.total));
  const total12 = fut.reduce((a,b)=>a+b.total,0);
  const parcelasAbertas = DB.tx.filter(t=>t.kind==='out' && t.of>1 && t.date > todayISO());
  const grupos = {};
  parcelasAbertas.forEach(t => { const base=(t.desc||'').replace(/\s*\(\d+\/\d+\)\s*$/,'');
    if(!grupos[base]) grupos[base]={desc:base, rest:0, count:0, next:t.date, cat:t.cat, person:t.person, card:t.card, of:t.of};
    grupos[base].rest += t.amount; grupos[base].count++;
    if (t.date < grupos[base].next) grupos[base].next = t.date; });
  const gl = Object.values(grupos).sort((a,b)=>b.rest-a.rest);
  const mediaRec = (()=>{ const l=lastMonths(6).filter(m=>m.rec>0); return l.length? l.reduce((a,b)=>a+b.rec,0)/l.length : 0; })();

  return `
  <div class="phead"><div><h1>Previsão</h1><div class="sub">O que já está comprometido nos próximos 12 meses</div></div></div>

  <div class="three keep">
    <div class="card tight kpi"><div class="clab">Comprometido 12 meses</div><div class="v t-out">${BRL(total12)}</div>
      <div class="d">parcelas e fixos já lançados</div></div>
    <div class="card tight kpi"><div class="clab">Média mensal</div><div class="v">${BRL(total12/12)}</div>
      <div class="d">dos próximos 12 meses</div></div>
    <div class="card tight kpi"><div class="clab">Sua receita média</div><div class="v t-in">${BRL(mediaRec)}</div>
      <div class="d">últimos 6 meses</div></div>
  </div>

  <div class="card sec">
    <div class="clab">Compromissos mês a mês</div>
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:6px">
      ${fut.map(f => {
        const w = Math.max(2, f.total/max*100);
        const over = mediaRec>0 && f.total>mediaRec;
        return `<div style="display:flex;align-items:center;gap:12px">
          <div style="width:74px;font-size:12px;color:var(--muted);flex-shrink:0">${mkLabel(f.k)}</div>
          <div class="bar-track" style="flex:1;height:22px;border-radius:8px;position:relative">
            <div class="bar-fill" style="width:${w}%;border-radius:8px;background:${over?'linear-gradient(90deg,#FF7A94,#FF5C7A)':'linear-gradient(90deg,#8B5CF6,#6D45E0)'}"></div>
            ${mediaRec>0 && mediaRec<max ? `<div style="position:absolute;top:-3px;bottom:-3px;left:${mediaRec/max*100}%;width:2px;background:#2ED3B7;opacity:.85"></div>`:''}
          </div>
          <div class="num" style="width:96px;text-align:right;font-size:13px;font-weight:700;flex-shrink:0;color:${over?'var(--coral)':'var(--text)'}">${BRL(f.total)}</div>
        </div>`;
      }).join('')}
    </div>
    ${mediaRec>0?`<p style="font-size:11.5px;color:var(--dim);margin:14px 0 0">A linha verde marca sua receita média. Barras que a ultrapassam são meses em que o que já está comprometido supera o que costuma entrar.</p>`:''}
  </div>

  <div class="card sec">
    <div class="row-between" style="margin-bottom:12px"><h3>Parcelamentos em aberto</h3>
      <span style="font-size:12px;color:var(--dim)">${gl.length} compras</span></div>
    ${gl.length ? gl.slice(0,15).map(g=>{const c=cat(g.cat),p=person(g.person),cd=card(g.card);
      return `<div class="lrow"><div class="l">
        <span class="ico" style="background:${c.color}22;color:${c.color}">${svg(c.icon)}</span>
        <div style="min-width:0"><div class="tt">${esc(g.desc)}</div>
        <div class="ss"><span class="dot" style="background:${cd.c1}"></span>${esc(cd.name)} · ${esc(p.name)} · faltam ${g.count} de ${g.of}</div></div></div>
        <div class="amt">${BRL(g.rest)}</div></div>`;}).join('')
      : `<div class="empty"><span class="e">🎉</span>Nenhuma parcela em aberto. Seus próximos meses estão livres.</div>`}
  </div>`;
}

/* ========================================================= VIEW: RECEITAS */
function vReceitas() {
  const list = inOf(MK).sort((a,b)=>b.date.localeCompare(a.date));
  const total = sum(list);
  const fixas = list.filter(t=>t.fixed), vars = list.filter(t=>!t.fixed);
  const hist = lastMonths(6);
  return `
  <div class="phead"><div><h1>Receitas</h1><div class="sub">${mkLabel(MK,true)}</div></div>${monthbar()}</div>

  <div class="three keep">
    <div class="card tight kpi"><div class="clab">Total do mês</div><div class="v t-in">${BRL(total)}</div></div>
    <div class="card tight kpi"><div class="clab">Fixas</div><div class="v">${BRL(sum(fixas))}</div><div class="d">${fixas.length} fontes</div></div>
    <div class="card tight kpi"><div class="clab">Variáveis</div><div class="v">${BRL(sum(vars))}</div><div class="d">${vars.length} entradas</div></div>
  </div>

  <div class="card sec desk"><div class="clab">Histórico de 6 meses</div>${miniBars(hist,'#FF5C7A','#2ED3B7')}</div>

  <div class="card sec">
    <div class="row-between" style="margin-bottom:8px"><h3>Entradas</h3>
      <button class="btn btn-p btn-sm" id="addInc">${svg('plus')}Nova receita</button></div>
    ${list.length ? list.map(txRow).join('') : `<div class="empty"><span class="e">💰</span>Nenhuma receita lançada em ${mkLabel(MK)}.</div>`}
  </div>`;
}

/* ========================================================== VIEW: AJUSTES */
function vConfig() {
  return `
  <div class="phead"><div><h1>Ajustes</h1><div class="sub">Cartões, pessoas, categorias e backup</div></div></div>

  <div class="card">
    <h3 style="margin-bottom:6px">Meta de gastos do mês</h3>
    <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.5">
      Se você definir uma meta, o painel "disponível para gastar" passa a usá-la. Deixe em 0 para usar sua receita do mês.</p>
    <div class="frow" style="align-items:flex-end">
      <div class="fld" style="margin:0"><label>Meta mensal (R$)</label>
        <input type="number" step="0.01" min="0" id="metaIn" value="${DB.settings.meta||0}"></div>
      <button class="btn btn-p" id="metaSave" style="height:46px">Salvar</button>
    </div>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:12px">Cartões</h3>
    ${DB.cards.map(c=>`<div class="lrow">
      <div class="l"><div style="width:38px;height:26px;border-radius:6px;background:linear-gradient(140deg,${c.c1},${c.c2});
        display:grid;place-items:center;font-size:8px;font-weight:800;color:#fff">${esc((c.brand||'').slice(0,4).toUpperCase())}</div>
        <div><div class="tt">${esc(c.name)}</div>
        <div class="ss">${c.close>0?`fecha ${c.close} · vence ${c.due}`:'débito imediato'}${c.limit>0?` · limite ${BRL(c.limit)}`:''}</div></div></div>
      <button class="ibtn" data-ecard="${c.id}">${svg('gear')}</button></div>`).join('')}
    <button class="btn btn-sm sec" id="addCard">${svg('plus')}Adicionar cartão</button>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:12px">Pessoas</h3>
    ${DB.people.map(p=>`<div class="lrow">
      <div class="l"><div class="pbadge" style="background:${p.color}">${esc(p.name[0])}</div>
        <div><div class="tt">${esc(p.name)}</div><div class="ss">${p.phone?esc(p.phone):'sem WhatsApp cadastrado'}${p.owner?' · você':''}</div></div></div>
      <button class="ibtn" data-pphone="${p.id}">${svg('wa')}</button></div>`).join('')}
    <button class="btn btn-sm sec" id="addPerson">${svg('plus')}Adicionar pessoa</button>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:12px">Categorias</h3>
    <div class="chips">${DB.cats.map(c=>`<span class="chip" style="color:${c.color};border-color:${c.color}44">
      <span class="cdot" style="background:${c.color}"></span>${esc(c.name)}</span>`).join('')}</div>
    <button class="btn btn-sm sec" id="addCat">${svg('plus')}Adicionar categoria</button>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:6px">Backup dos seus dados</h3>
    <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.5">
      Tudo fica salvo apenas neste aparelho. Exporte um arquivo para levar seus lançamentos para o celular ou para o computador — e para não perder nada se limpar o navegador.</p>
    <div style="display:flex;gap:9px;flex-wrap:wrap">
      <button class="btn" id="expJson">${svg('down')}Exportar backup</button>
      <button class="btn" id="impJson">${svg('up')}Importar backup</button>
      <button class="btn" id="expCsv">${svg('list')}Exportar CSV</button>
      <button class="btn btn-g" id="wipe" style="color:var(--coral)">${svg('trash')}Apagar tudo</button>
    </div>
    <input type="file" id="fileIn" accept="application/json" style="display:none">
    <p style="font-size:11.5px;color:var(--dim);margin:14px 0 0">
      ${DB.tx.length} lançamentos · ${DB.cards.length} cartões · ${DB.people.length} pessoas</p>
  </div>`;
}

/* ================================================== LANÇAMENTO (MODAL) */
function txModal(kind) {
  let K = kind || 'out';
  let sel = { cat:'DIVERSOS', card:'NUBANK', person:'GUSTAVO', parc:1, mode:'total' };

  const body = () => `
    <div class="mhead"><h2>${K==='in'?'Nova receita':'Novo lançamento'}</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>

    <div class="seg" style="margin-bottom:16px">
      <button type="button" data-k="out" class="${K==='out'?'on exp':''}">Despesa</button>
      <button type="button" data-k="in" class="${K==='in'?'on inc':''}">Receita</button>
    </div>

    <div class="fld"><label>Valor</label>
      <input type="number" inputmode="decimal" step="0.01" min="0" id="tAmt" class="amount-in" placeholder="0,00" autofocus></div>

    <div class="fld"><label>Descrição</label>
      <input type="text" id="tDesc" placeholder="${K==='in'?'Ex: Salário, venda, reembolso':'Ex: Mercado, farmácia, uber'}"></div>

    ${K==='out' ? `
    <div class="fld"><label>Categoria</label>
      <div class="chips" id="catChips">${DB.cats.map(c=>`<button type="button" class="chip ${sel.cat===c.id?'on':''}" data-c="${c.id}">
        <span class="cdot" style="background:${c.color}"></span>${esc(c.name)}</button>`).join('')}</div></div>` : ''}

    <div class="fld"><label>${K==='in'?'Entrou em':'Pago com'}</label>
      <div class="chips" id="cardChips">${DB.cards.map(c=>`<button type="button" class="chip ${sel.card===c.id?'on':''}" data-cd="${c.id}">
        <span class="cdot" style="background:${c.c1}"></span>${esc(c.name)}</button>`).join('')}</div></div>

    ${K==='out' ? `
    <div class="fld"><label>Quem comprou</label>
      <div class="chips" id="perChips">${DB.people.map(p=>`<button type="button" class="chip ${sel.person===p.id?'on':''}" data-p="${p.id}">
        <span class="cdot" style="background:${p.color}"></span>${esc(p.name)}</button>`).join('')}</div></div>

    <div class="fld"><label>Parcelas</label>
      <div class="chips" id="parcChips">${[1,2,3,4,5,6,8,10,12,18,24].map(n=>`<button type="button" class="chip ${sel.parc===n?'on':''}" data-pc="${n}">${n}x</button>`).join('')}</div></div>

    <div id="parcMode" style="display:${sel.parc>1?'block':'none'}">
      <div class="seg" style="margin-bottom:14px">
        <button type="button" data-pm="total" class="${sel.mode==='total'?'on':''}">Valor é o total</button>
        <button type="button" data-pm="parcela" class="${sel.mode==='parcela'?'on':''}">Valor é de cada parcela</button>
      </div>
      <p id="parcPrev" style="font-size:12.5px;color:var(--muted);margin:-4px 0 14px;text-align:center"></p>
    </div>` : `
    <div class="fld"><label>Tipo</label>
      <div class="seg"><button type="button" data-fx="0" class="on">Variável</button><button type="button" data-fx="1">Fixa (todo mês)</button></div></div>
    <div class="fld" id="repWrap" style="display:none"><label>Repetir por quantos meses</label>
      <input type="number" min="1" max="36" id="tRep" value="12"></div>`}

    <div class="frow">
      <div class="fld"><label>Data</label><input type="date" id="tDate" value="${todayISO()}"></div>
      ${K==='out'?`<div class="fld"><label>Status</label><select id="tSt"><option value="PAGO">Pago</option><option value="PENDENTE">Pendente</option></select></div>`:''}
    </div>

    <div class="macts">
      <button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-p" id="tSave">Salvar</button>
    </div>`;

  const paint = () => { document.getElementById('mbody').innerHTML = body(); bind(); };

  function bind() {
    const M = document.getElementById('mbody');
    M.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);
    M.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ K=b.dataset.k; paint(); });
    M.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ sel.cat=b.dataset.c;
      M.querySelectorAll('[data-c]').forEach(x=>x.classList.toggle('on', x.dataset.c===sel.cat)); });
    M.querySelectorAll('[data-cd]').forEach(b=>b.onclick=()=>{ sel.card=b.dataset.cd;
      M.querySelectorAll('[data-cd]').forEach(x=>x.classList.toggle('on', x.dataset.cd===sel.card)); });
    M.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ sel.person=b.dataset.p;
      M.querySelectorAll('[data-p]').forEach(x=>x.classList.toggle('on', x.dataset.p===sel.person)); });
    M.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{ sel.parc=+b.dataset.pc;
      M.querySelectorAll('[data-pc]').forEach(x=>x.classList.toggle('on', +x.dataset.pc===sel.parc));
      const pm=document.getElementById('parcMode'); if(pm) pm.style.display = sel.parc>1?'block':'none'; prev(); });
    M.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>{ sel.mode=b.dataset.pm;
      M.querySelectorAll('[data-pm]').forEach(x=>x.classList.toggle('on', x.dataset.pm===sel.mode)); prev(); });
    M.querySelectorAll('[data-fx]').forEach(b=>b.onclick=()=>{
      M.querySelectorAll('[data-fx]').forEach(x=>x.classList.toggle('on', x===b));
      const rw=document.getElementById('repWrap'); if(rw) rw.style.display = b.dataset.fx==='1'?'block':'none'; });
    const amt = document.getElementById('tAmt'); if (amt) amt.oninput = prev;
    document.getElementById('tSave').onclick = commit;
  }
  function prev() {
    const el = document.getElementById('parcPrev'); if (!el) return;
    const v = parseFloat(document.getElementById('tAmt').value)||0;
    if (sel.parc<2 || !v) { el.textContent=''; return; }
    const each = sel.mode==='total' ? v/sel.parc : v;
    const tot  = sel.mode==='total' ? v : v*sel.parc;
    el.innerHTML = `<strong>${sel.parc}x de ${BRL(each)}</strong> · total ${BRL(tot)} · última em ${mkLabel(mkAdd(mk(document.getElementById('tDate').value||todayISO()), sel.parc-1), true)}`;
  }
  function commit() {
    const v = parseFloat(document.getElementById('tAmt').value);
    if (!v || v<=0) { toast('Informe um valor'); return; }
    const desc = (document.getElementById('tDesc').value||'').trim();
    const date = document.getElementById('tDate').value || todayISO();

    if (K==='in') {
      const isFix = document.querySelector('[data-fx="1"]').classList.contains('on');
      const rep = isFix ? Math.max(1, Math.min(36, +document.getElementById('tRep').value||12)) : 1;
      const [y,m,d] = date.split('-').map(Number);
      for (let i=0;i<rep;i++) {
        const k = mkAdd(mk(date), i);
        DB.tx.push({ id:uid(), kind:'in', date:k+'-'+String(Math.min(d,28)).padStart(2,'0'),
          desc:desc||'Receita', amount:v, card:sel.card, person:'GUSTAVO', cat:'RECEITA', status:'PAGO', fixed:isFix });
      }
      save(); closeModal(); render();
      toast(rep>1 ? `Receita fixa lançada por ${rep} meses` : 'Receita lançada');
      return;
    }

    const status = document.getElementById('tSt').value;
    const n = sel.parc;
    const each = n>1 ? (sel.mode==='total' ? +(v/n).toFixed(2) : v) : v;
    const grp = n>1 ? uid() : null;
    const [y,m,d] = date.split('-').map(Number);
    for (let i=0;i<n;i++) {
      const k = mkAdd(mk(date), i);
      DB.tx.push({ id:uid(), kind:'out', date:k+'-'+String(Math.min(d,28)).padStart(2,'0'),
        desc: n>1 ? `${desc||cat(sel.cat).name} (${i+1}/${n})` : (desc||cat(sel.cat).name),
        amount:each, card:sel.card, person:sel.person, cat:sel.cat,
        status: i===0 ? status : 'PENDENTE', tipo:'FISICA', n:n>1?i+1:null, of:n>1?n:null, grp });
    }
    save(); closeModal(); render();
    toast(n>1 ? `${n} parcelas de ${BRL(each)} lançadas` : 'Lançamento salvo');
  }

  openModal(''); paint();
}

/* -------------------------------------------------------- MODAIS AUXILIARES */
function openModal(html) {
  document.getElementById('mbody').innerHTML = html;
  document.getElementById('ov').classList.add('on');
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);
}
function closeModal(){ document.getElementById('ov').classList.remove('on'); }

function phoneModal(pid) {
  const p = person(pid);
  openModal(`<div class="mhead"><h2>WhatsApp de ${esc(p.name)}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div class="fld"><label>Número com DDD</label>
      <input id="phIn" inputmode="tel" placeholder="22999998888" value="${esc(p.phone||'')}"></div>
    <p style="font-size:12px;color:var(--dim);margin:0;line-height:1.5">Só dígitos. O código do Brasil (55) é adicionado sozinho.</p>
    <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-p" id="phSave">Salvar</button></div>`);
  document.getElementById('phSave').onclick = () => {
    const pp = DB.people.find(x=>x.id===pid);
    pp.phone = document.getElementById('phIn').value.replace(/\D/g,'');
    save(); closeModal(); render(); toast('Número salvo');
  };
}

function cardModal(cid) {
  const c = card(cid);
  openModal(`<div class="mhead"><h2>${esc(c.name)}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div class="fld"><label>Nome</label><input id="cN" value="${esc(c.name)}"></div>
    <div class="frow">
      <div class="fld"><label>Bandeira</label><select id="cB">
        ${['Visa','Mastercard','Elo','Amex','Hipercard','Pix','Cash'].map(b=>`<option ${c.brand===b?'selected':''}>${b}</option>`).join('')}</select></div>
      <div class="fld"><label>Limite (R$)</label><input type="number" min="0" step="0.01" id="cL" value="${c.limit||0}"></div>
    </div>
    <div class="frow">
      <div class="fld"><label>Fecha dia</label><input type="number" min="0" max="31" id="cC" value="${c.close||0}"></div>
      <div class="fld"><label>Vence dia</label><input type="number" min="0" max="31" id="cD" value="${c.due||0}"></div>
    </div>
    <div class="frow">
      <div class="fld"><label>Cor principal</label><input type="color" id="c1" value="${c.c1}" style="height:46px;padding:4px"></div>
      <div class="fld"><label>Cor secundária</label><input type="color" id="c2" value="${c.c2}" style="height:46px;padding:4px"></div>
    </div>
    <p style="font-size:11.5px;color:var(--dim);margin:0;line-height:1.5">Deixe "fecha" e "vence" em 0 para meios de pagamento à vista (Pix, dinheiro, débito).</p>
    <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-p" id="cSave">Salvar</button></div>`);
  document.getElementById('cSave').onclick = () => {
    const o = DB.cards.find(x=>x.id===cid);
    o.name = document.getElementById('cN').value.trim()||o.name;
    o.brand = document.getElementById('cB').value;
    o.limit = +document.getElementById('cL').value||0;
    o.close = +document.getElementById('cC').value||0;
    o.due   = +document.getElementById('cD').value||0;
    o.c1 = document.getElementById('c1').value; o.c2 = document.getElementById('c2').value;
    save(); closeModal(); render(); toast('Cartão atualizado');
  };
}

function addSimple(type) {
  const T = { card:'cartão', person:'pessoa', cat:'categoria' }[type];
  const icons = Object.keys(ICON).slice(0,14);
  openModal(`<div class="mhead"><h2>Nova ${T}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div class="fld"><label>Nome</label><input id="nN" placeholder="Ex: ${type==='card'?'Inter':type==='person'?'João':'Pets'}"></div>
    <div class="fld"><label>Cor</label><input type="color" id="nC" value="#8B5CF6" style="height:46px;padding:4px"></div>
    ${type==='cat'?`<div class="fld"><label>Ícone</label><div class="chips" id="icChips">
      ${icons.map((i,ix)=>`<button type="button" class="chip ${ix===0?'on':''}" data-ic="${i}">${svg(i)}</button>`).join('')}</div></div>`:''}
    <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-p" id="nSave">Adicionar</button></div>`);
  let ic = icons[0];
  document.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>{ ic=b.dataset.ic;
    document.querySelectorAll('[data-ic]').forEach(x=>x.classList.toggle('on',x===b)); });
  document.getElementById('nSave').onclick = () => {
    const name = document.getElementById('nN').value.trim();
    if (!name) { toast('Informe um nome'); return; }
    const id = name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'');
    const color = document.getElementById('nC').value;
    if (type==='card')   DB.cards.push({ id, name, c1:color, c2:shade(color,-45), brand:'Visa', close:0, due:0, limit:0 });
    if (type==='person') DB.people.push({ id, name, phone:'', color });
    if (type==='cat')    DB.cats.push({ id, name, color, icon:ic });
    save(); closeModal(); render(); toast(`${name} adicionado`);
  };
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1),16);
  const cl = v => Math.max(0,Math.min(255,v));
  return '#'+[(n>>16)+amt,((n>>8)&255)+amt,(n&255)+amt].map(v=>cl(v).toString(16).padStart(2,'0')).join('');
}

function personDetail(pid) {
  const p = person(pid);
  const items = outOf(MK).filter(t=>t.person===pid).sort((a,b)=>b.amount-a.amount);
  openModal(`<div class="mhead"><h2>${esc(p.name)} · ${mkLabel(MK)}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div style="max-height:56vh;overflow-y:auto">${items.map(txRow).join('')||'<div class="empty">Nada aqui.</div>'}</div>
    <div class="macts"><button class="btn btn-p" data-close>Fechar</button></div>`);
}

/* ------------------------------------------------------------ BACKUP */
function download(name, content, type) {
  const b = new Blob([content], {type:type||'application/json'});
  const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href=u; a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(u), 1500);
}
function exportJson() {
  download(`fatura-backup-${todayISO()}.json`, JSON.stringify(DB));
  toast('Backup exportado');
}
function exportCsv() {
  const head = 'tipo,data,descricao,valor,cartao,pessoa,categoria,status,parcela\n';
  const rows = DB.tx.map(t=>[t.kind==='in'?'RECEITA':'DESPESA', t.date, '"'+(t.desc||'').replace(/"/g,'""')+'"',
    String(t.amount).replace('.',','), card(t.card).name, person(t.person).name,
    t.kind==='in'?'RECEITA':cat(t.cat).name, t.status, t.of?`${t.n}/${t.of}`:''].join(',')).join('\n');
  download(`fatura-${todayISO()}.csv`, '\ufeff'+head+rows, 'text/csv;charset=utf-8');
  toast('CSV exportado');
}
function importJson(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = JSON.parse(r.result);
      if (!o || !Array.isArray(o.tx)) throw 0;
      DB = Object.assign(blank(), o); save(); render(); drawNav();
      toast(`${DB.tx.length} lançamentos restaurados`);
    } catch(e){ toast('Arquivo inválido. Use um backup exportado pelo app.'); }
  };
  r.readAsText(file);
}

/* ---------------------------------------------------------------- RENDER */
function render() {
  const el = document.getElementById('v-'+TAB);
  if (TAB==='inicio')        el.innerHTML = vInicio();
  else if (TAB==='extrato')  el.innerHTML = vExtrato();
  else if (TAB==='cartoes')  el.innerHTML = vCartoes();
  else if (TAB==='pessoas')  el.innerHTML = vPessoas();
  else if (TAB==='previsao') el.innerHTML = vPrevisao();
  else if (TAB==='receitas') el.innerHTML = vReceitas();
  else if (TAB==='config')   el.innerHTML = vConfig();
  wire(el);
}
function wire(el) {
  bindMonth(el);
  el.querySelectorAll('[data-go2]').forEach(b=>b.onclick=()=>go(b.dataset.go2));
  el.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{ F.card=b.dataset.card; go('extrato'); });
  el.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>waMessage(b.dataset.wa));
  el.querySelectorAll('[data-pdet]').forEach(b=>b.onclick=()=>personDetail(b.dataset.pdet));
  el.querySelectorAll('[data-pphone]').forEach(b=>b.onclick=()=>phoneModal(b.dataset.pphone));
  el.querySelectorAll('[data-ecard]').forEach(b=>b.onclick=()=>cardModal(b.dataset.ecard));
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    DB.tx = DB.tx.filter(t=>t.id!==b.dataset.del); save(); render(); toast('Lançamento excluído'); });
  el.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{
    const t = DB.tx.find(x=>x.id===b.dataset.toggle);
    if (t) { t.status = t.status==='PAGO'?'PENDENTE':'PAGO'; save(); render(); } });

  const q = el.querySelector('#fq');
  if (q) { q.oninput = e => { F.q = e.target.value; const p=e.target.selectionStart; render();
    const n = document.querySelector('#fq'); if(n){ n.focus(); n.setSelectionRange(p,p);} }; }
  const bindSel = (id, key) => { const s = el.querySelector(id); if (s) s.onchange = e => { F[key]=e.target.value; render(); }; };
  bindSel('#fcard','card'); bindSel('#fper','person'); bindSel('#fcat','cat'); bindSel('#fst','status');

  const at = el.querySelector('#addTop'); if (at) at.onclick = ()=>txModal('out');
  const ai = el.querySelector('#addInc'); if (ai) ai.onclick = ()=>txModal('in');
  const ac = el.querySelector('#addCard'); if (ac) ac.onclick = ()=>addSimple('card');
  const ap = el.querySelector('#addPerson'); if (ap) ap.onclick = ()=>addSimple('person');
  const ag = el.querySelector('#addCat'); if (ag) ag.onclick = ()=>addSimple('cat');
  const ms = el.querySelector('#metaSave');
  if (ms) ms.onclick = ()=>{ DB.settings.meta = +document.getElementById('metaIn').value||0; save(); render(); toast('Meta salva'); };
  const ej = el.querySelector('#expJson'); if (ej) ej.onclick = exportJson;
  const ec = el.querySelector('#expCsv'); if (ec) ec.onclick = exportCsv;
  const ij = el.querySelector('#impJson');
  if (ij) ij.onclick = ()=>document.getElementById('fileIn').click();
  const fi = el.querySelector('#fileIn');
  if (fi) fi.onchange = e => { if (e.target.files[0]) importJson(e.target.files[0]); };
  const wp = el.querySelector('#wipe');
  if (wp) wp.onclick = ()=>{
    openModal(`<div class="mhead"><h2>Apagar tudo?</h2><button class="ibtn" data-close>${svg('x')}</button></div>
      <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0">
      Isso remove os ${DB.tx.length} lançamentos deste aparelho e não tem como desfazer.
      Exporte um backup antes se tiver qualquer dúvida.</p>
      <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
        <button class="btn" id="wipeYes" style="background:var(--coral);color:#fff;border:none">Apagar tudo</button></div>`);
    document.getElementById('wipeYes').onclick = ()=>{
      DB = blank(); save(); closeModal(); render(); drawNav(); toast('Tudo apagado'); };
  };
}

/* ------------------------------------------------------------------ BOOT */
document.getElementById('fab').onclick = ()=>txModal(TAB==='receitas'?'in':'out');
document.getElementById('ov').onclick = e => { if (e.target.id==='ov') closeModal(); };
document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

load();
drawNav();
document.getElementById('v-inicio').classList.add('on');
render();

})();
