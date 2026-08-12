/* ==========================================================================
   FATURA — Controle Financeiro  ·  app.js
   Dados 100% no aparelho (localStorage). Sem servidor, sem custo.
   ========================================================================== */
(function () {
"use strict";

/* Se o sync.js não carregar, o app segue funcionando só neste aparelho. */
if (!window.FATURA_SYNC) {
  window.FATURA_SYNC = {
    indisponivel: true, device: 'Este aparelho',
    logado: false, email: null, status: 'off', meta: { version:0, dirty:false },
    onStatus(){}, marcarSujo(){}, marcarEmDia(){}, setVersion(){}, schedulePush(){}, startPolling(){},
    pull: () => Promise.resolve(null),
    push: () => Promise.resolve({ ok:false }),
    checkRemote: () => Promise.resolve(null),
    signUp: () => Promise.reject(new Error('Sincronização indisponível')),
    signIn: () => Promise.reject(new Error('Sincronização indisponível')),
    signOut: () => Promise.resolve(),
    resetSenha: () => Promise.reject(new Error('Sincronização indisponível')),
    traduz: e => (e && e.message) || 'Erro',
  };
}

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
  { id:'GUSTAVO',    name:'Gustavo',    phone:'', color:'#8B5CF6', owner:true, reembolsa:false },
  { id:'ALESSANDRO', name:'Alessandro', phone:'', color:'#5AA9F0', reembolsa:true },
  { id:'ALINE',      name:'Aline',      phone:'', color:'#FF5C7A', reembolsa:true },
  { id:'CRISTINA',   name:'Cristina',   phone:'', color:'#FFB020', reembolsa:true },
  { id:'HEITOR',     name:'Heitor',     phone:'', color:'#2ED3B7', reembolsa:true },
  { id:'LUIZ',       name:'Luiz',       phone:'', color:'#E0705A', reembolsa:true },
  { id:'MICHELE',    name:'Michele',    phone:'', color:'#C77DFF', reembolsa:true },
  { id:'OUTROS',     name:'Outros',     phone:'', color:'#8E86A8', reembolsa:true },
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
  const S = window.SEED_DATA;
  const temSeed = S && ((S.despesas && S.despesas.length) || (S.receitas && S.receitas.length));
  if (temSeed) importSeed();
  save();
}
let st = null;
function save() {
  DB.settings.touched = Date.now();
  clearTimeout(st);
  st = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(DB)); }
    catch(e){ toast('Sem espaço para salvar. Exporte um backup em Ajustes.'); }
    if (window.FATURA_SYNC && FATURA_SYNC.logado) {
      FATURA_SYNC.marcarSujo();
      FATURA_SYNC.schedulePush(()=>DB, 1500);
    }
  }, 200);
}

/* ============================ SINCRONIZAÇÃO ============================ */
function aplicarRemoto(row, silencioso) {
  if (!row || !row.data || !Array.isArray(row.data.tx)) return;
  DB = Object.assign(blank(), row.data);
  FATURA_SYNC.setVersion(row.version);
  try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch(e){}
  render(); drawNav(); pintarSync();
  if (!silencioso) toast(`Atualizado de ${row.device || 'outro aparelho'}`);
}

async function sincronizarAgora(inicial) {
  if (!window.FATURA_SYNC || !FATURA_SYNC.logado) return;
  try {
    const row = await FATURA_SYNC.pull();
    const localTem = DB.tx.length > 0;

    if (!row) {                                  // nuvem vazia: sobe o que tem aqui
      await FATURA_SYNC.push(DB, true);
      pintarSync(); return;
    }
    if (row.version > FATURA_SYNC.meta.version) {
      const remotoTem = row.data && Array.isArray(row.data.tx) ? row.data.tx.length : 0;
      if (inicial && localTem && remotoTem && FATURA_SYNC.meta.version === 0) {
        escolherVersao(row); return;             // primeiro login com dados dos dois lados
      }
      aplicarRemoto(row, inicial);
    } else if (FATURA_SYNC.meta.dirty) {
      await FATURA_SYNC.push(DB);
    } else {
      FATURA_SYNC.marcarEmDia();
    }
    pintarSync();
  } catch(e) { pintarSync(); }
}

/* Primeiro login com dados no aparelho E na nuvem: quem manda? */
function escolherVersao(row) {
  const rt = (row.data && row.data.tx) ? row.data.tx.length : 0;
  const veioDeImport = !!(DB.settings && DB.settings.seeded);
  openModal(`<div class="mhead"><h2>Dois conjuntos de dados</h2></div>
    <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0 0 ${veioDeImport?'12':'16'}px">
      Este aparelho tem <strong style="color:var(--text)">${DB.tx.length} lançamentos</strong> e a
      sua conta na nuvem tem <strong style="color:var(--text)">${rt}</strong>
      (gravados por ${esc(row.device||'outro aparelho')}). Qual você quer manter?</p>
    ${veioDeImport?`<div style="background:rgba(255,176,32,.12);border:1px solid rgba(255,176,32,.35);
      border-radius:12px;padding:12px 14px;margin-bottom:16px">
      <p style="font-size:12.5px;color:var(--amber);margin:0;line-height:1.55">
        <strong>Atenção:</strong> os lançamentos deste aparelho vieram de uma importação automática,
        não foram digitados por você. Quase sempre o certo aqui é <strong>usar os da nuvem</strong>.</p></div>`:''}
    <div style="display:flex;flex-direction:column;gap:9px">
      <button class="btn" id="vNuvem" style="justify-content:flex-start;padding:14px 16px">
        ${svg('down')}Usar os ${rt} da nuvem <span style="color:var(--dim);margin-left:4px">(descarta os daqui)</span></button>
      <button class="btn" id="vLocal" style="justify-content:flex-start;padding:14px 16px">
        ${svg('up')}Enviar os ${DB.tx.length} deste aparelho <span style="color:var(--dim);margin-left:4px">(substitui a nuvem)</span></button>
      <button class="btn" id="vJuntar" style="justify-content:flex-start;padding:14px 16px;
        ${veioDeImport?'':'background:rgba(139,92,246,.16);border-color:rgba(139,92,246,.4)'}">
        ${svg('plus')}Juntar os dois <span style="color:var(--dim);margin-left:4px">${veioDeImport?'(não recomendado aqui)':'(sem duplicar)'}</span></button>
    </div>
    <p style="font-size:11.5px;color:var(--dim);margin:14px 0 0;line-height:1.5">
      ${veioDeImport
        ? 'Juntar aqui traria a importação antiga junto com seus dados reais — por isso ela não é a opção recomendada.'
        : 'Na dúvida, escolha juntar. Exporte um backup em Ajustes antes, se quiser garantia.'}</p>`);
  document.getElementById('vNuvem').onclick = ()=>{ aplicarRemoto(row,true); closeModal(); toast('Dados da nuvem carregados'); };
  document.getElementById('vLocal').onclick = async ()=>{ closeModal();
    await FATURA_SYNC.push(DB, true); pintarSync(); toast('Enviado para a nuvem'); };
  document.getElementById('vJuntar').onclick = async ()=>{ closeModal();
    const antes = DB.tx.length;
    DB = juntar(DB, row.data);
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch(e){}
    FATURA_SYNC.setVersion(row.version);
    await FATURA_SYNC.push(DB, true);
    render(); drawNav(); pintarSync();
    toast(`${DB.tx.length - antes} lançamentos vieram da nuvem`); };
}

/* Junta sem duplicar: id igual é o mesmo lançamento.
   Dados que vieram de importação automática (seed) nunca são levados para a nuvem. */
function juntar(a, b) {
  const out = Object.assign(blank(), a);
  if (a.settings && a.settings.seeded && !a.settings.confirmouSeed) out.tx = [];
  const ids = new Set(out.tx.map(t=>t.id));
  const assinatura = new Set(out.tx.map(t=>[t.kind,t.date,t.amount,(t.desc||'').trim(),t.card,t.person].join('|')));
  (b.tx||[]).forEach(t => {
    const sig = [t.kind,t.date,t.amount,(t.desc||'').trim(),t.card,t.person].join('|');
    if (!ids.has(t.id) && !assinatura.has(sig)) { out.tx.push(t); ids.add(t.id); assinatura.add(sig); }
  });
  ['cards','people','cats'].forEach(k => {
    const vistos = new Set(out[k].map(x=>x.id));
    (b[k]||[]).forEach(x => { if (!vistos.has(x.id)) { out[k].push(x); vistos.add(x.id); } });
  });
  return out;
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
const BRLk = v => BRL(v);   // valores sempre por extenso, sem abreviar
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
let F = { kind:'ALL', card:'ALL', person:'ALL', cat:'ALL', status:'ALL', q:'' };

/* -------------------------------------------------------------- SELETORES */
const outOf   = k => DB.tx.filter(t=>t.kind==='out' && mk(t.date)===k);
const inOf    = k => DB.tx.filter(t=>t.kind==='in'  && mk(t.date)===k);
const sum     = a => a.reduce((s,t)=>s+(+t.amount||0),0);
function groupBy(list, key) { const m={}; list.forEach(t=>{ m[t[key]]=(m[t[key]]||0)+(+t.amount||0); }); return m; }
function sorted(m) { return Object.entries(m).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]); }

/* Gasto que é seu de fato — exclui quem te reembolsa */
const ehMeuGasto = t => { const p = person(t.person); return p.owner || p.reembolsa === false; };
const outMeus  = k => outOf(k).filter(ehMeuGasto);
const outTerc  = k => outOf(k).filter(t => !ehMeuGasto(t));

function monthStats(k) {
  const o = outOf(k), i = inOf(k);
  const desp = sum(o), rec = sum(i);
  const pend = sum(o.filter(t=>t.status==='PENDENTE'));
  const meus = sum(o.filter(ehMeuGasto));
  const outros = desp - meus;
  const ar = contasAReceber(k);
  return { desp, rec, pend, meus, outros, saldo: rec-desp,
           aReceber: ar.falta, saldoPrev: rec - desp + ar.falta, n:o.length };
}
/* Quanto cada pessoa deve reembolsar no mês, descontando o que já pagou */
function recebidoDe(pid, k) {
  return sum(DB.tx.filter(t => t.kind==='in' && t.from===pid && mk(t.date)===k));
}
function aReceberDe(pid, k) {
  const p = person(pid);
  if (p.owner || p.reembolsa === false) return { gasto:0, recebido:0, falta:0 };
  const gasto = sum(outOf(k).filter(t=>t.person===pid));
  const recebido = recebidoDe(pid, k);
  return { gasto, recebido, falta: gasto - recebido };
}
function contasAReceber(k) {
  const rows = DB.people.map(p => ({ p, ...aReceberDe(p.id, k) }))
    .filter(r => r.gasto > 0 || r.recebido > 0);
  const falta = rows.reduce((a,b)=>a + Math.max(0, b.falta), 0);
  return { rows: rows.sort((a,b)=>b.falta-a.falta),
           total: rows.reduce((a,b)=>a+b.gasto,0),
           recebido: rows.reduce((a,b)=>a+b.recebido,0),
           falta };
}
/* Receita que é realmente sua (exclui reembolso de terceiros) */
function receitaPropria(k) {
  return sum(inOf(k).filter(t => !t.from));
}

function availableToSpend(k) {
  const s = monthStats(k);
  const ar = contasAReceber(k);
  const meta = +DB.settings.meta || 0;
  if (meta > 0) return { limit: meta, used: s.desp, left: meta - s.desp, mode:'meta', aReceber: ar.falta };
  const limit = s.rec + ar.falta;   // o que já entrou + o que ainda vai entrar de terceiros
  return { limit, used: s.desp, left: limit - s.desp, mode:'receita', aReceber: ar.falta };
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
      <div class="num" style="font-size:${size>=150?13:12}px;font-weight:800;letter-spacing:-.04em;white-space:nowrap">${centerTop}</div>
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
  const S = window.FATURA_SYNC;
  const L = SYNC_LABEL[S && S.logado ? S.status : 'off'] || SYNC_LABEL.off;
  document.getElementById('sideFoot').innerHTML =
    `<span class="syncchip" data-syncchip><span class="syncdot" style="background:${L.c}"></span>
      <span style="color:${L.c}">${L.t}</span></span>
     <div style="margin-top:8px"><strong style="color:var(--muted)">${DB.tx.length}</strong> lançamentos
     ${S&&S.logado?`· ${esc(S.email||'')}`:'neste aparelho'}</div>`;
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

  <div class="grid g-hero" id="topgrid">
    <div class="hero">
      <div class="hero-in">
        <div class="lab">Saldo real do mês${s.aReceber>0?' · já contando o que têm a te pagar':''}</div>
        <div class="big ${s.saldoPrev<0?'neg':'pos'}">${BRL(s.saldoPrev)}</div>
        ${s.aReceber>0?`<div class="hero-eq">
          <span>${BRL(s.rec)} recebido</span><b>+</b>
          <span class="t-sk">${BRL(s.aReceber)} a receber</span><b>−</b>
          <span class="t-out">${BRL(s.desp)} gasto</span>
          <em>caixa hoje: ${BRL(s.saldo)}</em>
        </div>`:''}
        <div class="hero-split">
          <div><div class="l">Receitas</div><div class="v t-in">${BRL(s.rec)}</div></div>
          <div><div class="l">Despesas</div><div class="v t-out">${BRL(s.desp)}</div></div>
          <div><div class="l">Meus gastos</div><div class="v">${BRL(s.meus)}</div></div>
          <div><div class="l">A receber</div><div class="v t-sk">${BRL(s.aReceber)}</div></div>
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
          <div class="mid"><div class="v" style="color:${leftColor}">${BRL(av.left)}</div><div class="l">restam</div></div>
        </div>
        <ul class="gauge-info">
          <li><span class="k">${av.mode==='meta'?'Meta do mês':'Entradas previstas'}</span><span class="n">${BRL(av.limit)}</span></li>
          ${av.aReceber>0&&av.mode!=='meta'?`<li><span class="k" style="padding-left:10px;font-size:12px">↳ ainda a receber</span><span class="n t-sk" style="font-size:12.5px">${BRL(av.aReceber)}</span></li>`:''}
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
    ${cardStack()}
  </div>

  <div class="two sec">
    <div class="card">
      <div class="row-between" style="margin-bottom:14px"><h3>Por categoria</h3></div>
      <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        ${donut(byCat.slice(0,7), 150, k=>cat(k).color, BRL(s.desp), 'no mês')}
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

  ${(()=>{ const ar = contasAReceber(MK); if (!ar.total) return '';
    return `<div class="card sec">
      <div class="row-between" style="margin-bottom:12px">
        <h3>A receber de terceiros</h3>
        <span class="num" style="font-size:16px;font-weight:800;color:${ar.falta>0?'var(--sky)':'var(--teal)'}">${BRL(ar.falta)}</span></div>
      ${ar.rows.map(r=>{ const pc = r.gasto>0 ? Math.min(100, Math.round(r.recebido/r.gasto*100)) : 100;
        return `<div class="brow"><div class="t"><span class="nm">
          <span class="pbadge" style="width:24px;height:24px;border-radius:8px;font-size:11px;background:${r.p.color}">${esc(r.p.name[0])}</span>
          <span>${esc(r.p.name)}</span></span>
          <span class="vl">${r.falta>0.005?`falta <strong style="color:var(--sky)">${BRL(r.falta)}</strong> de ${BRL(r.gasto)}`
            :`<strong style="color:var(--teal)">quitado</strong> · ${BRL(r.gasto)}`}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pc}%;background:${pc>=100?'var(--teal)':r.p.color}"></div></div></div>`;}).join('')}
      <p style="font-size:11.5px;color:var(--dim);margin:12px 0 0;line-height:1.5">
        Esses gastos passam no seu cartão mas não são seus. Já entram no saldo real acima como entrada prevista —
        você não precisa lançar a receita antes da pessoa pagar.</p>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-sm" data-go2="pessoas">${svg('users')}Ver e cobrar</button></div>
    </div>`; })()}

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

function cardStack() {
  return `<div class="stackwrap">
    <button class="stackbtn l" data-scroll="-1" aria-label="Cartões anteriores" hidden>${svg('left',2.4)}</button>
    <div class="cardstack">${DB.cards.map(c=>cardTile(c)).join('')}</div>
    <button class="stackbtn r" data-scroll="1" aria-label="Próximos cartões" hidden>${svg('right',2.4)}</button>
    <div class="stackdots"></div>
  </div>`;
}

/* arrastar com o mouse, setas e indicador de posição */
function bindStack(scope) {
  scope.querySelectorAll('.stackwrap').forEach(wrap => {
    const box = wrap.querySelector('.cardstack');
    const L = wrap.querySelector('[data-scroll="-1"]');
    const R = wrap.querySelector('[data-scroll="1"]');
    const dots = wrap.querySelector('.stackdots');
    const step = () => (box.querySelector('.ctile')?.offsetWidth || 220) + 13;

    const refresh = () => {
      const over = box.scrollWidth - box.clientWidth;
      if (L) L.hidden = over < 8 || box.scrollLeft < 8;
      if (R) R.hidden = over < 8 || box.scrollLeft > over - 8;
      if (dots) {
        const per = Math.max(1, Math.round(box.clientWidth / step()));
        const pages = Math.max(1, Math.ceil(box.children.length / per));
        const cur = over > 0 ? Math.round(box.scrollLeft / over * (pages-1)) : 0;
        dots.innerHTML = pages > 1 ? Array.from({length:pages},(_,i)=>`<i class="${i===cur?'on':''}"></i>`).join('') : '';
      }
    };
    box.addEventListener('scroll', refresh, { passive:true });
    if (L) L.onclick = () => box.scrollBy({ left:-step()*2, behavior:'smooth' });
    if (R) R.onclick = () => box.scrollBy({ left: step()*2, behavior:'smooth' });

    /* arrastar segurando o mouse */
    let down=false, sx=0, sl=0, moved=0;
    box.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;      // no toque o scroll nativo já funciona
      down=true; moved=0; sx=e.clientX; sl=box.scrollLeft;
      box.classList.add('dragging'); box.setPointerCapture(e.pointerId);
    });
    box.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      box.scrollLeft = sl - dx;
    });
    const end = e => { if (!down) return; down=false; box.classList.remove('dragging');
      try { box.releasePointerCapture(e.pointerId); } catch(_){} refresh(); };
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    box.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved=0; } }, true);

    /* roda do mouse na vertical rola o carrossel na horizontal */
    box.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && box.scrollWidth > box.clientWidth) {
        e.preventDefault(); box.scrollLeft += e.deltaY;
      }
    }, { passive:false });

    requestAnimationFrame(refresh);
  });
}

function cardTile(c) {
  const idx = DB.cards.findIndex(x=>x.id===c.id);
  const f = faturaOf(c.id, MK);
  const isCard = c.close > 0;
  const pctLimit = c.limit>0 ? Math.min(100, Math.round(f.total/c.limit*100)) : null;
  return `<button class="ctile" data-card="${c.id}" style="background:linear-gradient(140deg,${c.c1},${c.c2})">
    <div class="ct-top">
      <div><div class="ct-name">${esc(c.name)}</div>
        <div class="ct-lab" style="margin-top:5px">${isCard?'Fatura':'Movimentado'}</div>
        <div class="ct-val">${BRL(f.total)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="brand-badge">${esc((c.brand||'').toUpperCase())}</div>
        <div class="ct-chip"></div></div>
    </div>
    <div class="ct-foot">${isCard ? `Fecha dia ${c.close} · vence dia ${c.due}` : 'Débito imediato'}${pctLimit!=null?` · ${pctLimit}% do limite`:''}</div>
    <span class="ctmove">
      <span role="button" tabindex="0" data-mvcard="${c.id}|-1" aria-label="Mover para a esquerda" ${idx===0?'hidden':''}>${svg('left',2.6)}</span>
      <span role="button" tabindex="0" data-mvcard="${c.id}|1" aria-label="Mover para a direita" ${idx===DB.cards.length-1?'hidden':''}>${svg('right',2.6)}</span>
    </span>
  </button>`;
}

function txRow(t, act) {
  const c = cat(t.cat), p = person(t.person), cd = card(t.card);
  const isIn = t.kind==='in';
  const pend = t.status==='PENDENTE';
  return `<div class="lrow" data-tx="${t.id}">
    <div class="l">
      <span class="ico" style="background:${isIn?'#2ED3B722':c.color+'22'};color:${isIn?'#2ED3B7':c.color}">${svg(isIn?'up':c.icon)}</span>
      <div style="min-width:0">
        <div class="tt">${esc(t.desc||c.name)}</div>
        <div class="ss">
          <span class="dot" style="background:${cd.c1}"></span>${esc(cd.name)}
          ${!isIn?`· ${esc(p.name)}`:''} · ${dLabel(t.date)}
          ${t.of?`<span class="tag parc">${t.n}/${t.of}</span>`:''}
          <span class="tag ${pend?'pend':'pago'}">${pend?'pendente':'pago'}</span>
        </div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:9px;flex-shrink:0">
      <div class="amt" style="color:${isIn?'var(--teal)':'var(--text)'}">${isIn?'+':'−'} ${BRL(t.amount)}</div>
      ${act?`<button class="paybtn ${pend?'':'done'}" data-toggle="${t.id}"
        title="${pend?'Marcar como pago':'Voltar para pendente'}" aria-label="${pend?'Marcar como pago':'Voltar para pendente'}">${svg('check',2.6)}</button>
      <button class="ibtn" data-del="${t.id}" aria-label="Excluir">${svg('trash')}</button>`:''}
    </div>
  </div>`;
}

/* --------------------------------------------------------------- DICAS */
function tips() {
  const out = [];
  const s   = monthStats(MK);
  const av  = availableToSpend(MK);
  const ar  = contasAReceber(MK);

  /* Tudo abaixo olha SÓ o que é seu de fato — gasto de quem te reembolsa não conta. */
  const meus     = outMeus(MK);
  const gastoMeu = sum(meus);
  const prev3    = [1,2,3].map(i => sum(outMeus(mkAdd(MK,-i))));
  const comHist  = prev3.filter(v => v > 0);
  const media    = comHist.length ? comHist.reduce((a,b)=>a+b,0)/comHist.length : 0;

  /* --- Saldo --- */
  if (av.left < 0) {
    out.push({ i:'alert', c:'#FF5C7A', t:'Seu mês fecha no vermelho',
      p:`Mesmo contando os <strong>${BRL(ar.falta)}</strong> que ainda têm a te pagar, faltam
         <strong>${BRL(-av.left)}</strong>. Seus gastos próprios somam ${BRL(gastoMeu)} —
         é aí que dá para mexer, o resto volta.` });
  } else if (ar.falta > 0 && s.saldo < 0 && av.left >= 0) {
    out.push({ i:'users', c:'#5AA9F0', t:'No papel você está negativo, na real não',
      p:`Seu caixa hoje é ${BRL(s.saldo)}, mas <strong>${BRL(ar.falta)}</strong> ainda vão entrar de terceiros.
         Descontando isso, seu mês fecha em <strong>${BRL(av.left)}</strong>. O aperto é de prazo, não de dinheiro —
         cobrar antes do vencimento resolve.` });
  } else if (av.limit > 0 && av.left < av.limit * 0.15) {
    out.push({ i:'alert', c:'#FFB020', t:'Reta final do orçamento',
      p:`Sobram <strong>${BRL(av.left)}</strong>. Como ${BRL(s.outros)} do que passou no cartão
         não é gasto seu, o espaço real para cortar está nos ${BRL(gastoMeu)} que são seus.` });
  }

  /* --- Categoria pesada (só sobre gasto próprio) --- */
  const catMeus = sorted(groupBy(meus, 'cat'));
  if (catMeus.length && gastoMeu > 0) {
    const [id, v] = catMeus[0];
    const share = Math.round(v / gastoMeu * 100);
    if (share >= 35)
      out.push({ i:'chart', c:cat(id).color, t:`${cat(id).name} é ${share}% do que você gasta`,
        p:`<strong>${BRL(v)}</strong> dos ${BRL(gastoMeu)} que saem do seu bolso.
           Cortar 10% aqui devolve ${BRL(v*0.1)} por mês — mais do que mexer em três categorias pequenas.` });
  }

  /* --- Comparação com a média (só gasto próprio) --- */
  if (media > 0 && gastoMeu > media * 1.15)
    out.push({ i:'trend', c:'#FF5C7A', t:'Você gastou acima da sua média',
      p:`<strong>${BRL(gastoMeu)}</strong> contra ${BRL(media)} de média nos meses anteriores —
         ${BRL(gastoMeu-media)} a mais. Comparação feita só com gastos seus, sem os de terceiros.` });
  if (media > 0 && gastoMeu < media * 0.9 && gastoMeu > 0)
    out.push({ i:'check', c:'#2ED3B7', t:'Mês mais leve que o seu normal',
      p:`Seus gastos ficaram <strong>${BRL(media-gastoMeu)}</strong> abaixo da média.
         Se esse valor virar reserva agora, ele não vira gasto depois.` });

  /* --- Terceiros --- */
  if (ar.falta > 0) {
    const maior = ar.rows.filter(r=>r.falta>0.005).sort((a,b)=>b.falta-a.falta)[0];
    const pesoRenda = s.rec > 0 ? Math.round(ar.falta / s.rec * 100) : 0;
    out.push({ i:'users', c:'#8B5CF6', t:`${BRL(ar.falta)} estão na mão de terceiros`,
      p:`${maior ? `<strong>${esc(maior.p.name)}</strong> responde por ${BRL(maior.falta)}. ` : ''}
         É dinheiro seu financiando o consumo de outra pessoa sem juros
         ${pesoRenda>0 ? `— equivale a ${pesoRenda}% da sua receita do mês` : ''}.
         Cobre antes do fechamento da fatura.` });
  }
  if (ar.total > 0 && ar.falta <= 0.005)
    out.push({ i:'check', c:'#2ED3B7', t:'Terceiros em dia',
      p:`Todo mundo já acertou o que usou do seu cartão neste mês. Os ${BRL(s.desp)}
         da fatura incluem ${BRL(s.outros)} que já voltaram para você.` });

  /* --- Pendências --- */
  const pendMeu = sum(meus.filter(t=>t.status==='PENDENTE'));
  if (pendMeu > 0)
    out.push({ i:'alert', c:'#FFB020', t:`${BRL(pendMeu)} seus ainda em aberto`,
      p:`Lançamentos marcados como pendentes em ${mkLabel(MK)}. Confirme os que já pagou
         para o saldo refletir a realidade.` });

  /* --- Futuro: separa o que é seu do que volta --- */
  const keys = [1,2,3,4,5,6].map(i => mkAdd(nowMK(), i));
  const futMeu  = keys.reduce((a,k)=> a + sum(outMeus(k)), 0);
  const futTerc = keys.reduce((a,k)=> a + sum(outTerc(k)), 0);
  if (futMeu > 0) {
    const porMes = keys.map(k => ({ k, v: sum(outMeus(k)) }));
    const pior = porMes.reduce((a,b)=> b.v>a.v?b:a, porMes[0]);
    out.push({ i:'calendar', c:'#5AA9F0', t:'Seus próximos 6 meses já têm dono',
      p:`<strong>${BRL(futMeu)}</strong> em parcelas e fixos que são seus de fato.
         ${futTerc>0 ? `Fora esses, ${BRL(futTerc)} são de terceiros e devem voltar como reembolso. ` : ''}
         O mês mais pesado é ${mkLabel(pior.k,true)}, com ${BRL(pior.v)} — evite novos parcelamentos que caiam nele.` });
  }

  /* --- Comprometimento da renda --- */
  const rendaMedia = (()=>{ const l = [0,1,2,3,4,5].map(i=>receitaPropria(mkAdd(MK,-i))).filter(v=>v>0);
    return l.length ? l.reduce((a,b)=>a+b,0)/l.length : 0; })();
  if (rendaMedia > 0 && futMeu > 0) {
    const mensal = futMeu / 6;
    const pct = Math.round(mensal / rendaMedia * 100);
    if (pct >= 60)
      out.push({ i:'alert', c:'#FF5C7A', t:`${pct}% da sua renda já está comprometida`,
        p:`Seus compromissos próprios somam ${BRL(mensal)} por mês contra uma receita média de
           ${BRL(rendaMedia)}. Acima de 60% sobra pouco para imprevisto — vale segurar novos parcelamentos.` });
  }

  if (!out.length)
    out.push({ i:'check', c:'#2ED3B7', t:'Tudo tranquilo por aqui',
      p:`Nenhum sinal de alerta em ${mkLabel(MK,true)}. Continue lançando as compras no dia em que
         acontecem — é o que mantém a previsão confiável.` });

  return out.slice(0,4);
}

/* ========================================================== VIEW: EXTRATO */
function vExtrato() {
  let list = DB.tx.filter(t => mk(t.date)===MK);
  if (F.kind!=='ALL')   list = list.filter(t=>t.kind===F.kind);
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

  <div class="seg sec" style="max-width:420px">
    <button type="button" data-kd="ALL" class="${F.kind==='ALL'?'on':''}">Tudo</button>
    <button type="button" data-kd="out" class="${F.kind==='out'?'on exp':''}">Só despesas</button>
    <button type="button" data-kd="in"  class="${F.kind==='in'?'on inc':''}">Só receitas</button>
  </div>

  <div class="filters sec">
    <input type="search" id="fq" placeholder="Buscar descrição…" value="${esc(F.q)}" style="flex:1;min-width:150px">
    <select id="fcard"><option value="ALL">Todos os cartões</option>${DB.cards.map(c=>`<option value="${c.id}" ${F.card===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
    <select id="fper" ${F.kind==='in'?'style="display:none"':''}><option value="ALL">Todas as pessoas</option>${DB.people.map(p=>`<option value="${p.id}" ${F.person===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
    <select id="fcat" ${F.kind==='in'?'style="display:none"':''}><option value="ALL">Todas as categorias</option>${DB.cats.map(c=>`<option value="${c.id}" ${F.cat===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
    <select id="fst"><option value="ALL">Todos</option><option value="PAGO" ${F.status==='PAGO'?'selected':''}>Pagos</option><option value="PENDENTE" ${F.status==='PENDENTE'?'selected':''}>Pendentes</option></select>
    <button class="btn btn-p btn-sm desk" id="addTop">${svg('plus')}Lançar</button>
  </div>

  ${(()=>{ const pend = list.filter(t=>t.status==='PENDENTE'), pagos = list.filter(t=>t.status==='PAGO');
    if (!list.length) return '';
    const alvo = filterLabel();
    return `<div class="batchbar">
      <div class="bb-txt">${svg('check')}
        <span><strong>${pend.length}</strong> pendente${pend.length===1?'':'s'}${alvo?` em ${alvo}`:''}
        ${pend.length?`· <span class="num t-am">${BRL(sum(pend))}</span>`:''}</span></div>
      <div class="bb-acts">
        ${pend.length?`<button class="btn btn-sm btn-p" id="markAllPaid">Marcar ${pend.length} como pago</button>`:''}
        ${pagos.length?`<button class="btn btn-sm btn-g" id="markAllPend">Reabrir ${pagos.length}</button>`:''}
      </div></div>`; })()}

  <div class="card">
    <table class="dt">
      <thead><tr><th>Descrição</th><th>Categoria</th><th>Cartão</th><th>Pessoa</th><th>Data</th><th>Status</th><th style="text-align:right">Valor</th><th></th></tr></thead>
      <tbody>${list.length ? list.map(txTable).join('') : `<tr><td colspan="8"><div class="empty"><span class="e">🔍</span>Nada encontrado com esses filtros.</div></td></tr>`}</tbody>
    </table>
    <div class="mcards">${list.length ? list.map(t=>txRow(t,true)).join('') : `<div class="empty"><span class="e">🔍</span>Nada encontrado com esses filtros.</div>`}</div>
  </div>`;
}
function filterLabel() {
  const p = [];
  if (F.card!=='ALL')   p.push(card(F.card).name);
  if (F.person!=='ALL') p.push(person(F.person).name);
  if (F.cat!=='ALL')    p.push(cat(F.cat).name);
  if (F.kind==='in')    p.push('receitas');
  if (F.kind==='out' && !p.length) p.push('despesas');
  return p.join(' · ');
}

function txTable(t) {
  const c = cat(t.cat), p = person(t.person), cd = card(t.card), isIn = t.kind==='in';
  return `<tr data-open="${t.id}">
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
      <button class="ibtn" data-open2="${t.id}" title="Editar / excluir" style="margin-left:5px">${svg('dots')}</button></td>
  </tr>`;
}

/* ========================================================== VIEW: CARTÕES */
function vCartoes() {
  const total = sum(outOf(MK));
  return `
  <div class="phead"><div><h1>Cartões</h1><div class="sub">Faturas de ${mkLabel(MK,true)}</div></div>${monthbar()}</div>
  <div class="card">${cardStack()}</div>

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
    const ar = aReceberDe(p.id, MK);
    return { p, v, items, pend, ...ar };
  }).filter(r=>r.v>0 || r.recebido>0).sort((a,b)=>b.v-a.v);
  const ar = contasAReceber(MK);

  return `
  <div class="phead"><div><h1>Pessoas</h1><div class="sub">Quem usou seus cartões em ${mkLabel(MK,true)}</div></div>${monthbar()}</div>

  ${ar.total>0?`<div class="three keep">
    <div class="card tight kpi"><div class="clab">Gastaram no seu cartão</div><div class="v">${BRL(ar.total)}</div></div>
    <div class="card tight kpi"><div class="clab">Já te pagaram</div><div class="v t-in">${BRL(ar.recebido)}</div></div>
    <div class="card tight kpi"><div class="clab">Falta receber</div><div class="v t-sk">${BRL(ar.falta)}</div></div>
  </div>`:''}

  <div class="card sec">
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
      ${(!r.p.owner && r.p.reembolsa!==false) ? `
        <div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:var(--panel2);border:1px solid var(--line-soft)">
          <div class="row-between" style="font-size:12.5px;margin-bottom:8px">
            <span style="color:var(--muted)">Já pagou <strong class="num t-in">${BRL(r.recebido)}</strong></span>
            <span style="color:var(--muted)">${r.falta>0.005?`falta <strong class="num t-sk">${BRL(r.falta)}</strong>`
              :`<strong class="t-in">quitado ✓</strong>`}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${r.gasto>0?Math.min(100,r.recebido/r.gasto*100):100}%;
            background:${r.falta>0.005?r.p.color:'var(--teal)'}"></div></div>
        </div>` : ''}
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        ${(r.p.owner || r.p.reembolsa===false || r.falta<=0.005) ? '' :
          `<button class="btn btn-p btn-sm" data-recv="${r.p.id}|${r.falta.toFixed(2)}">${svg('down')}Recebi ${BRL(r.falta)}</button>`}
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
  const jaPagou = recebidoDe(pid, MK);
  const falta = total - jaPagou;
  const byCard = sorted(groupBy(items,'card'));
  const parcelas = items.filter(t=>t.of>1);
  const firstCard = byCard.length ? card(byCard[0][0]) : null;

  /* lista COMPLETA, agrupada por cartão e em ordem de data */
  const blocos = byCard.map(([cid, v]) => {
    const c = card(cid);
    const linhas = items.filter(t=>t.card===cid)
      .sort((a,b)=>a.date.localeCompare(b.date))
      .map(t=>`${dLabel(t.date)} · ${t.desc} — ${BRL(t.amount)}`)
      .join('\n');
    return `*${c.name}* — ${BRL(v)}${c.due>0?` (vence dia ${c.due})`:''}\n${linhas}`;
  }).join('\n\n');

  const msg =
`Oi, ${p.name}! Tudo bem?

Fechamento de ${mkLabel(MK, true)} 👇

*Total no meu cartão: ${BRL(total)}*${jaPagou>0 ? `
Já recebi: ${BRL(jaPagou)}
*Falta: ${BRL(falta)}*` : ''}
${items.length} ${items.length===1?'compra':'compras'}${firstCard && firstCard.close>0 ? ` · fatura fecha dia ${firstCard.close}` : ''}

${blocos}
${parcelas.length ? `\nObs: ${parcelas.length} ${parcelas.length===1?'lançamento é uma parcela que segue':'lançamentos são parcelas que seguem'} nos próximos meses.` : ''}
Qualquer dúvida é só chamar. Valeu! 🙏`;

  openModal(`
    <div class="mhead"><h2>Cobrar ${esc(p.name)}</h2><button class="ibtn" data-close>${svg('x')}</button></div>
    <div class="fld"><label>Mensagem — ${items.length} ${items.length===1?'compra':'compras'} (pode editar)</label>
      <textarea id="waTxt" rows="12" style="font-size:13px;line-height:1.5;resize:vertical">${esc(msg)}</textarea></div>
    ${msg.length>1400?`<p style="font-size:12px;color:var(--amber);margin:-6px 0 12px;line-height:1.5">
      A lista está longa (${msg.length} caracteres). Se o WhatsApp cortar, use o comprovante em imagem abaixo.</p>`:''}
    <div class="fld"><label>WhatsApp de ${esc(p.name)}</label>
      <input id="waPhone" inputmode="tel" placeholder="Ex: 22999998888" value="${esc(p.phone||'')}"></div>
    <p style="font-size:11.5px;color:var(--dim);margin:0 0 4px;line-height:1.5">
      Abre o WhatsApp já com a mensagem escrita. Você só confere e toca em enviar.</p>
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-sm" id="waImg" style="flex:1;justify-content:center">${svg('down')}Comprovante em imagem</button>
      <button class="btn btn-sm" id="waCopy" style="flex:1;justify-content:center">${svg('list')}Copiar texto</button>
    </div>
    <div class="macts">
      <button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-wa" id="waGo">${svg('wa')}Abrir WhatsApp</button>
    </div>`);
  document.getElementById('waCopy').onclick = ()=>{
    const txt = document.getElementById('waTxt').value;
    const ta = document.createElement('textarea'); ta.value = txt;
    ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
    ta.select();
    try { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
      .then(()=>toast('Texto copiado')).catch(()=>{ document.execCommand('copy'); toast('Texto copiado'); }); }
    catch(e){ document.execCommand('copy'); toast('Texto copiado'); }
    document.body.removeChild(ta);
  };
  document.getElementById('waImg').onclick = ()=>reciboImagem(pid, items, total, jaPagou, falta);
  document.getElementById('waGo').onclick = () => {
    const raw = document.getElementById('waPhone').value.replace(/\D/g,'');
    const txt = encodeURIComponent(document.getElementById('waTxt').value);
    if (raw) { const pp = DB.people.find(x=>x.id===pid); if (pp) { pp.phone = raw; save(); } }
    const num = raw ? (raw.length<=11 ? '55'+raw : raw) : '';
    window.open(`https://wa.me/${num}?text=${txt}`, '_blank');
    closeModal();
  };
}

/* ------------------------------------------- COMPROVANTE EM IMAGEM (PNG) */
function reciboImagem(pid, items, total, jaPagou, falta) {
  const p = person(pid);
  const W = 980, PAD = 44, ROW = 40;
  const HEAD = 214;                 // até a régua do cabeçalho de colunas
  const CARD_TOP = 30;              // respiro ANTES do nome do cartão
  const CARD_GAP = 26;              // respiro entre o cartão e a primeira linha
  const CARD_END = 22;              // respiro depois do último item do cartão
  const FOOT = 96;

  const byCard = sorted(groupBy(items,'card'));
  let alturaLinhas = 0;
  byCard.forEach(([cid], i) => {
    alturaLinhas += (i === 0 ? 0 : CARD_TOP) + CARD_GAP
                  + items.filter(t=>t.card===cid).length * ROW + CARD_END;
  });
  const H = HEAD + alturaLinhas + FOOT + (jaPagou>0 ? 54 : 0);

  const cv = document.createElement('canvas');
  const dpr = 2; cv.width = W*dpr; cv.height = H*dpr;
  const x = cv.getContext('2d'); x.scale(dpr,dpr);
  const F = (w,sz,fam) => `${w} ${sz}px ${fam||'Inter, Helvetica, Arial, sans-serif'}`;
  const MONO = 'ui-monospace, Menlo, Consolas, monospace';
  const rr = (a,b,c,d,r) => { if (x.roundRect) { x.beginPath(); x.roundRect(a,b,c,d,r); x.fill(); }
                              else x.fillRect(a,b,c,d); };

  /* colunas */
  const C_DATA = PAD;
  const C_DESC = PAD + 88;
  const C_CAT  = W - PAD - 300;     // categoria
  const C_VAL  = W - PAD;           // valor (alinhado à direita)

  /* fundo */
  const bg = x.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#1C1730'); bg.addColorStop(1,'#14111F');
  x.fillStyle = bg; x.fillRect(0,0,W,H);
  x.fillStyle = 'rgba(139,92,246,.13)';
  x.beginPath(); x.arc(W-60,-40,260,0,7); x.fill();

  /* cabeçalho */
  x.fillStyle = '#9C93B8'; x.font = F(600,15);
  x.fillText('COMPROVANTE DE GASTOS', PAD, 54);
  x.fillStyle = '#F1EDFA'; x.font = F(700,40);
  x.fillText(p.name, PAD, 100);
  x.fillStyle = '#9C93B8'; x.font = F(500,19);
  x.fillText(mkLabel(MK, true) + '  ·  ' + items.length + (items.length===1?' compra':' compras'), PAD, 130);

  x.textAlign = 'right';
  x.fillStyle = '#9C93B8'; x.font = F(600,14);
  x.fillText(falta>0.005 && jaPagou>0 ? 'FALTA PAGAR' : 'TOTAL', W-PAD, 60);
  x.fillStyle = falta>0.005 ? '#FF8FA6' : '#2ED3B7'; x.font = F(700,42,MONO);
  x.fillText(BRL(falta>0.005?falta:total), W-PAD, 104);
  if (jaPagou > 0) { x.fillStyle='#9C93B8'; x.font=F(500,15);
    x.fillText(`total ${BRL(total)} · já pago ${BRL(jaPagou)}`, W-PAD, 130); }
  x.textAlign = 'left';

  x.strokeStyle = '#372D54'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(PAD,164); x.lineTo(W-PAD,164); x.stroke();

  x.fillStyle = '#6F6688'; x.font = F(700,12);
  x.fillText('DATA', C_DATA, 192);
  x.fillText('DESCRIÇÃO', C_DESC, 192);
  x.fillText('CATEGORIA', C_CAT, 192);
  x.textAlign='right'; x.fillText('VALOR', C_VAL, 192); x.textAlign='left';

  /* linhas */
  let y = HEAD;
  byCard.forEach(([cid, v], idx) => {
    const c = card(cid);
    const lista = items.filter(t=>t.card===cid).sort((a,b)=>a.date.localeCompare(b.date));

    if (idx > 0) {
      y += CARD_TOP;
      x.strokeStyle = '#2A2340'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(PAD, y-14); x.lineTo(W-PAD, y-14); x.stroke();
    }

    /* faixa do cartão */
    x.fillStyle = 'rgba(255,255,255,.045)';
    rr(PAD-10, y-4, W-2*PAD+20, 38, 9);
    x.fillStyle = c.c1; rr(PAD-2, y+3, 5, 22, 3);

    x.font = F(700,17);
    const larguraNome = x.measureText(c.name).width;
    x.fillStyle = '#F1EDFA';
    x.fillText(c.name, PAD+14, y+20);
    x.fillStyle = '#8E86A8'; x.font = F(500,13);
    x.fillText(`${lista.length} ${lista.length===1?'compra':'compras'}`,
               PAD + 14 + larguraNome + 12, y+20);
    x.textAlign='right'; x.fillStyle = '#C3B9DE'; x.font = F(700,17,MONO);
    x.fillText(BRL(v), W-PAD, y+20); x.textAlign='left';

    y += CARD_GAP;

    lista.forEach((t,i) => {
      y += ROW;
      if (i%2===0) { x.fillStyle='rgba(255,255,255,.028)'; rr(PAD-10, y-26, W-2*PAD+20, ROW-4, 6); }

      x.fillStyle = '#8E86A8'; x.font = F(500,15,MONO);
      x.fillText(dLabel(t.date), C_DATA, y);

      x.fillStyle = '#EDE9F7'; x.font = F(500,16);
      let d = t.desc || '';
      const maxD = C_CAT - C_DESC - 18;
      while (x.measureText(d).width > maxD && d.length > 4) d = d.slice(0,-2);
      if (d !== (t.desc||'')) d += '…';
      x.fillText(d, C_DESC, y);

      /* categoria com etiqueta colorida */
      const cc = cat(t.cat);
      let nome = cc.name;
      x.font = F(600,13);
      const maxC = C_VAL - C_CAT - 150;
      while (x.measureText(nome).width > maxC && nome.length > 3) nome = nome.slice(0,-2);
      const larg = x.measureText(nome).width + 26;
      x.fillStyle = cc.color + '2E'; rr(C_CAT, y-16, larg, 23, 11);
      x.fillStyle = cc.color; x.beginPath(); x.arc(C_CAT+12, y-4.5, 3.6, 0, 7); x.fill();
      x.fillStyle = cc.color; x.font = F(600,13);
      x.fillText(nome, C_CAT+21, y);

      x.textAlign='right'; x.fillStyle='#F1EDFA'; x.font=F(600,16,MONO);
      x.fillText(BRL(t.amount), C_VAL, y); x.textAlign='left';
    });

    y += CARD_END;
  });

  /* resumo por categoria */
  const porCat = sorted(groupBy(items,'cat')).slice(0,6);
  x.strokeStyle = '#372D54'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(PAD,y+6); x.lineTo(W-PAD,y+6); x.stroke();
  if (porCat.length > 1) {
    x.fillStyle = '#6F6688'; x.font = F(700,11);
    x.fillText('POR CATEGORIA', PAD, y+30);
    let cx = PAD;
    x.font = F(600,13);
    porCat.forEach(([id, val]) => {
      const cc = cat(id);
      const txt = `${cc.name} ${BRL(val)}`;
      const larg = x.measureText(txt).width + 28;
      if (cx + larg > W - PAD) return;
      x.fillStyle = cc.color + '22'; rr(cx, y+42, larg, 26, 13);
      x.fillStyle = cc.color; x.beginPath(); x.arc(cx+13, y+55, 3.6, 0, 7); x.fill();
      x.fillStyle = cc.color; x.font = F(600,13);
      x.fillText(txt, cx+22, y+59.5);
      cx += larg + 8;
    });
    y += 52;
  }

  /* rodapé */
  x.fillStyle = '#6F6688'; x.font = F(500,14);
  const hoje = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
  x.fillText('Gerado em ' + hoje, PAD, y+38);
  x.textAlign='right'; x.fillText('Fatura · controle financeiro', W-PAD, y+38); x.textAlign='left';

  cv.toBlob(b => {
    const nome = `cobranca-${p.name.toLowerCase().replace(/\s+/g,'-')}-${MK}.png`;
    const f = new File([b], nome, { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[f] })) {
      navigator.share({ files:[f], title:`Gastos ${p.name}` })
        .then(()=>toast('Comprovante compartilhado')).catch(()=>{});
    } else {
      const u = URL.createObjectURL(b);
      const a = document.createElement('a'); a.href=u; a.download=nome; a.click();
      setTimeout(()=>URL.revokeObjectURL(u),1500);
      toast('Imagem baixada — anexe no WhatsApp');
    }
  }, 'image/png');
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

  ${(()=>{
    const keys = fut.map(f=>f.k);
    const pessoas = DB.people.map(p => {
      const vals = keys.map(k => sum(outOf(k).filter(t=>t.person===p.id)));
      return { p, vals, tot: vals.reduce((a,b)=>a+b,0) };
    }).filter(r=>r.tot>0).sort((a,b)=>b.tot-a.tot);
    if (!pessoas.length) return '';
    const maxP = Math.max(1, ...pessoas.flatMap(r=>r.vals));
    return `<div class="card sec">
      <div class="row-between" style="margin-bottom:6px"><h3>Previsão por pessoa</h3>
        <span style="font-size:12px;color:var(--dim)">próximos 12 meses</span></div>
      <p style="font-size:12px;color:var(--dim);margin:0 0 16px;line-height:1.5">
        Quanto de cada mês futuro já está comprometido por quem — útil pra saber o que vai
        cair no seu bolso e o que vai voltar como reembolso.</p>

      ${pessoas.map(r=>`
        <div style="margin-bottom:18px">
          <div class="row-between" style="margin-bottom:9px">
            <span style="display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:600">
              <span class="pbadge" style="width:24px;height:24px;border-radius:8px;font-size:11px;background:${r.p.color}">${esc(r.p.name[0])}</span>
              ${esc(r.p.name)}
              ${(r.p.owner||r.p.reembolsa===false)?'<span class="tag">gasto seu</span>':'<span class="tag parc">reembolsa</span>'}
            </span>
            <span class="num" style="font-size:14px;font-weight:700">${BRL(r.tot)}</span></div>
          <div class="sparkrow">
            ${r.vals.map((v,i)=>`<div class="sparkcol" title="${mkLabel(keys[i],true)}: ${BRL(v)}">
              <div class="sparkbar" style="height:${v>0?Math.max(4,v/maxP*100):2}%;background:${v>0?r.p.color:'var(--panel3)'}"></div>
              <span>${mkLabel(keys[i]).split(' ')[0]}</span></div>`).join('')}
          </div>
        </div>`).join('')}

      <div class="row-between" style="padding-top:14px;border-top:1px solid var(--line-soft);font-size:13px">
        <span style="color:var(--muted)">Seu, de fato (sem os reembolsáveis)</span>
        <span class="num" style="font-weight:700">${BRL(pessoas.filter(r=>r.p.owner||r.p.reembolsa===false).reduce((a,b)=>a+b.tot,0))}</span></div>
      <div class="row-between" style="font-size:13px;margin-top:8px">
        <span style="color:var(--muted)">Deve voltar como reembolso</span>
        <span class="num t-sk" style="font-weight:700">${BRL(pessoas.filter(r=>!r.p.owner&&r.p.reembolsa!==false).reduce((a,b)=>a+b.tot,0))}</span></div>
    </div>`; })()}

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
    ${list.length ? list.map(t=>txRow(t,true)).join('') : `<div class="empty"><span class="e">💰</span>Nenhuma receita lançada em ${mkLabel(MK)}.</div>`}
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
    <div class="row-between" style="margin-bottom:12px"><h3>Cartões</h3>
      <span style="font-size:11.5px;color:var(--dim)">a ordem aqui é a ordem no início</span></div>
    ${DB.cards.map((c,i)=>`<div class="lrow">
      <div class="l"><div style="width:38px;height:26px;border-radius:6px;background:linear-gradient(140deg,${c.c1},${c.c2});
        display:grid;place-items:center;font-size:8px;font-weight:800;color:#fff">${esc((c.brand||'').slice(0,4).toUpperCase())}</div>
        <div><div class="tt">${esc(c.name)}</div>
        <div class="ss">${c.close>0?`fecha ${c.close} · vence ${c.due}`:'débito imediato'}${c.limit>0?` · limite ${BRL(c.limit)}`:''}</div></div></div>
      <div style="display:flex;gap:6px">
        <button class="ibtn" data-mvcard="${c.id}|-1" title="Subir" ${i===0?'disabled style="opacity:.3"':''}>${svg('up')}</button>
        <button class="ibtn" data-mvcard="${c.id}|1" title="Descer" ${i===DB.cards.length-1?'disabled style="opacity:.3"':''}>${svg('down')}</button>
        <button class="ibtn" data-ecard="${c.id}" title="Editar">${svg('gear')}</button>
        <button class="ibtn" data-rmcard="${c.id}" title="Excluir" style="color:var(--coral)">${svg('trash')}</button>
      </div></div>`).join('')}
    <button class="btn btn-sm sec" id="addCard">${svg('plus')}Adicionar cartão</button>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:12px">Pessoas</h3>
    ${DB.people.map(p=>`<div class="lrow">
      <div class="l"><div class="pbadge" style="background:${p.color}">${esc(p.name[0])}</div>
        <div><div class="tt">${esc(p.name)}</div><div class="ss">${p.phone?esc(p.phone):'sem WhatsApp cadastrado'}${p.owner?' · você':''}
          ${p.owner?'':`· <span class="tag ${p.reembolsa===false?'':'parc'}">${p.reembolsa===false?'gasto seu':'te reembolsa'}</span>`}</div></div></div>
      <div style="display:flex;gap:6px">
        ${p.owner?'':`<button class="ibtn" data-reemb="${p.id}" title="${p.reembolsa===false?'Marcar que te reembolsa':'Marcar que NÃO te reembolsa'}"
          style="color:${p.reembolsa===false?'var(--dim)':'var(--sky)'}">${svg('down')}</button>`}
        <button class="ibtn" data-pphone="${p.id}" title="WhatsApp">${svg('wa')}</button>
        ${p.owner?'':`<button class="ibtn" data-rmper="${p.id}" title="Excluir" style="color:var(--coral)">${svg('trash')}</button>`}
      </div></div>`).join('')}
    <button class="btn btn-sm sec" id="addPerson">${svg('plus')}Adicionar pessoa</button>
  </div>

  <div class="card sec">
    <h3 style="margin-bottom:12px">Categorias</h3>
    <div class="chips">${DB.cats.map(c=>`<span class="chip" style="color:${c.color};border-color:${c.color}44;padding-right:5px">
      <span class="cdot" style="background:${c.color}"></span>${esc(c.name)}
      <button data-rmcat="${c.id}" title="Excluir" style="width:22px;height:22px;border-radius:7px;display:grid;
        place-items:center;color:var(--dim);margin-left:2px">${svg('x',2.4)}</button></span>`).join('')}</div>
    <button class="btn btn-sm sec" id="addCat">${svg('plus')}Adicionar categoria</button>
  </div>

  <div class="card sec">
    <div class="row-between" style="margin-bottom:6px"><h3>Sincronização entre aparelhos</h3>
      <span class="syncchip" data-syncchip></span></div>
    ${FATURA_SYNC.logado ? `
      <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.55">
        Conectado como <strong style="color:var(--text)">${esc(FATURA_SYNC.email||'')}</strong>.
        Este aparelho aparece como <strong style="color:var(--text)">${esc(FATURA_SYNC.device)}</strong>.
        Entre com a mesma conta no outro aparelho e os dois passam a conversar.</p>
      <div style="display:flex;gap:9px;flex-wrap:wrap">
        <button class="btn btn-sm" id="syncNow">${svg('wifi')}Sincronizar agora</button>
        <button class="btn btn-sm btn-g" id="syncOut">Sair da conta</button>
      </div>`
    : FATURA_SYNC.indisponivel ? `
      <p style="font-size:12.5px;color:var(--amber);margin:0 0 6px;line-height:1.55">
        O arquivo <strong>sync.js</strong> não foi carregado, então a sincronização está desligada.</p>
      <p style="font-size:12.5px;color:var(--muted);margin:0;line-height:1.55">
        Confira se ele foi publicado junto com os outros arquivos. Seus lançamentos continuam
        salvos normalmente neste aparelho.</p>`
    : `
      <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.55">
        Hoje seus lançamentos ficam só neste aparelho. Crie uma conta para o celular e o
        computador enxergarem os mesmos dados. Continua funcionando sem internet — sobe sozinho
        quando a conexão volta.</p>
      <div style="display:flex;gap:9px;flex-wrap:wrap">
        <button class="btn btn-p btn-sm" id="syncUp">${svg('up')}Criar conta</button>
        <button class="btn btn-sm" id="syncIn">Já tenho conta</button>
      </div>`}
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
function txModal(kind, opts) {
  let K = kind || 'out';
  let sel = { cat:'DIVERSOS', card:'NUBANK', person:'GUSTAVO', parc:1, mode:'total', from: (opts&&opts.from)||'' };

  const body = () => `
    <div class="mhead"><h2>${K==='in'?'Nova receita':'Novo lançamento'}</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>

    <div class="seg" style="margin-bottom:16px">
      <button type="button" data-k="out" class="${K==='out'?'on exp':''}">Despesa</button>
      <button type="button" data-k="in" class="${K==='in'?'on inc':''}">Receita</button>
    </div>

    <div class="fld"><label>Valor</label>
      <input type="number" inputmode="decimal" step="0.01" min="0" id="tAmt" class="amount-in" placeholder="0,00"
        value="${opts&&opts.amount?opts.amount:''}" autofocus></div>

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
      <div class="chips" id="parcChips">${[1,2,3,4,5,6,10,12].map(n=>`<button type="button" class="chip ${sel.parc===n?'on':''}" data-pc="${n}">${n}x</button>`).join('')}
        <span class="chip" style="padding:4px 6px 4px 12px;gap:6px;${![1,2,3,4,5,6,10,12].includes(sel.parc)?'background:rgba(139,92,246,.2);border-color:var(--violet);color:#D6CAFF':''}">
          outro
          <input type="number" min="1" max="120" id="parcFree" placeholder="13"
            value="${![1,2,3,4,5,6,10,12].includes(sel.parc)?sel.parc:''}"
            style="width:56px;background:var(--ink);border:1px solid var(--line);color:var(--text);
            padding:5px 7px;border-radius:8px;font-size:13px;font-weight:700;text-align:center;outline:none;
            font-family:'JetBrains Mono',monospace">
          <span style="font-size:12px;opacity:.7">x</span>
        </span>
      </div></div>

    <div id="parcMode" style="display:${sel.parc>1?'block':'none'}">
      <div class="seg" style="margin-bottom:14px">
        <button type="button" data-pm="total" class="${sel.mode==='total'?'on':''}">Valor é o total</button>
        <button type="button" data-pm="parcela" class="${sel.mode==='parcela'?'on':''}">Valor é de cada parcela</button>
      </div>
      <p id="parcPrev" style="font-size:12.5px;color:var(--muted);margin:-4px 0 14px;text-align:center"></p>
    </div>` : `
    <div class="fld"><label>De quem veio</label>
      <div class="chips" id="fromChips">
        <button type="button" class="chip ${!sel.from?'on':''}" data-fr="">${svg('wallet')}Receita própria</button>
        ${DB.people.filter(p=>!p.owner && p.reembolsa!==false).map(p=>`<button type="button" class="chip ${sel.from===p.id?'on':''}" data-fr="${p.id}">
          <span class="cdot" style="background:${p.color}"></span>${esc(p.name)}</button>`).join('')}
      </div>
      <p style="font-size:11.5px;color:var(--dim);margin:8px 0 0;line-height:1.5">
        Reembolso de terceiro abate o que a pessoa te deve. Receita própria soma normal.</p></div>

    <div class="fld"><label>Tipo</label>
      <div class="seg"><button type="button" data-fx="0" class="on">Variável</button><button type="button" data-fx="1">Fixa (todo mês)</button></div></div>
    <div class="fld" id="repWrap" style="display:none"><label>Repetir por quantos meses</label>
      <input type="number" min="1" max="36" id="tRep" value="12"></div>`}

    <div class="frow">
      <div class="fld"><label>Data</label><input type="date" id="tDate" value="${todayISO()}"></div>
      ${K==='out'?`<div class="fld"><label>Status</label>
        <div style="display:flex;align-items:center;gap:9px;background:var(--ink);border:1px solid var(--line);
          padding:12px 13px;border-radius:11px;font-size:14px;color:var(--amber);font-weight:600">
          <span class="tag pend">pendente</span>
          <span style="color:var(--dim);font-size:12px;font-weight:500">marque como pago depois, no extrato</span>
        </div></div>`:''}
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
      const pfx = document.getElementById('parcFree'); if (pfx) pfx.value='';
      const pm=document.getElementById('parcMode'); if(pm) pm.style.display = sel.parc>1?'block':'none'; prev(); });
    const pf = document.getElementById('parcFree');
    if (pf) pf.oninput = () => {
      const n = Math.max(1, Math.min(120, parseInt(pf.value,10)||0));
      if (!pf.value) return;
      sel.parc = n;
      M.querySelectorAll('[data-pc]').forEach(x=>x.classList.remove('on'));
      const pm = document.getElementById('parcMode'); if (pm) pm.style.display = sel.parc>1?'block':'none';
      prev();
    };
    M.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>{ sel.mode=b.dataset.pm;
      M.querySelectorAll('[data-pm]').forEach(x=>x.classList.toggle('on', x.dataset.pm===sel.mode)); prev(); });
    M.querySelectorAll('[data-fr]').forEach(b=>b.onclick=()=>{ sel.from=b.dataset.fr;
      M.querySelectorAll('[data-fr]').forEach(x=>x.classList.toggle('on',x===b)); });
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
          desc:desc||(sel.from?('Reembolso '+person(sel.from).name):'Receita'), amount:v, card:sel.card,
          person:'GUSTAVO', from:sel.from||'', cat:'RECEITA', status:'PENDENTE', fixed:isFix });
      }
      save(); closeModal(); render();
      toast(rep>1 ? `Receita fixa lançada por ${rep} meses` : 'Receita lançada');
      return;
    }

    const status = 'PENDENTE';   // todo lançamento nasce pendente
    const n = sel.parc;
    const each = n>1 ? (sel.mode==='total' ? +(v/n).toFixed(2) : v) : v;
    const grp = n>1 ? uid() : null;
    const [y,m,d] = date.split('-').map(Number);
    for (let i=0;i<n;i++) {
      const k = mkAdd(mk(date), i);
      DB.tx.push({ id:uid(), kind:'out', date:k+'-'+String(Math.min(d,28)).padStart(2,'0'),
        desc: n>1 ? `${desc||cat(sel.cat).name} (${i+1}/${n})` : (desc||cat(sel.cat).name),
        amount:each, card:sel.card, person:sel.person, cat:sel.cat,
        status: status, tipo:'FISICA', n:n>1?i+1:null, of:n>1?n:null, grp });
    }
    save(); closeModal(); render();
    toast(n>1 ? `${n} parcelas de ${BRL(each)} lançadas` : 'Lançamento salvo');
  }

  openModal(''); paint();
}

/* ------------------------------------------------- GRUPOS DE PARCELAS */
const baseDesc = d => String(d||'').replace(/\s*\(\d+\s*\/\s*\d+\)\s*$/,'').trim();
function groupOf(t) {
  if (!t) return [];
  if (t.grp) { const g = DB.tx.filter(x=>x.grp===t.grp); if (g.length>1) return g; }
  if (t.of>1) {
    const b = baseDesc(t.desc);
    return DB.tx.filter(x => x.kind===t.kind && x.of===t.of && baseDesc(x.desc)===b
      && x.card===t.card && x.person===t.person);
  }
  return [t];
}

/* ------------------------------------------- DETALHE / EDITAR / EXCLUIR */
function txDetail(id) {
  const t = DB.tx.find(x=>x.id===id); if (!t) return;
  const g = groupOf(t), multi = g.length>1;
  const c = cat(t.cat), p = person(t.person), cd = card(t.card);
  const isIn = t.kind==='in';
  const totalG = sum(g);
  openModal(`
    <div class="mhead"><h2>${esc(baseDesc(t.desc)||c.name)}</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>

    <div style="display:flex;align-items:center;gap:13px;margin-bottom:16px">
      <span class="ico" style="width:44px;height:44px;border-radius:14px;background:${isIn?'#2ED3B722':c.color+'22'};color:${isIn?'#2ED3B7':c.color}">${svg(isIn?'up':c.icon)}</span>
      <div><div class="num" style="font-size:24px;font-weight:800">${isIn?'+':'−'} ${BRL(t.amount)}</div>
        <div style="font-size:12px;color:var(--dim);margin-top:2px">
          ${t.of?`parcela ${t.n} de ${t.of}`:'lançamento único'} · ${dLabel(t.date)}</div></div>
    </div>

    <ul class="gauge-info" style="margin-bottom:16px">
      <li><span class="k">Cartão</span><span class="n">${esc(cd.name)}</span></li>
      ${isIn?'':`<li><span class="k">Pessoa</span><span class="n">${esc(p.name)}</span></li>
      <li><span class="k">Categoria</span><span class="n">${esc(c.name)}</span></li>`}
      <li><span class="k">Status</span><span class="n" style="color:${t.status==='PAGO'?'var(--teal)':'var(--amber)'}">${t.status==='PAGO'?'pago':'pendente'}</span></li>
      ${multi?`<li><span class="k">Total do parcelamento</span><span class="n">${BRL(totalG)} em ${g.length}x</span></li>`:''}
    </ul>

    <div style="display:flex;flex-direction:column;gap:9px">
      <button class="btn" id="dEdit" style="justify-content:flex-start;padding:14px 16px">${svg('gear')}
        Editar${multi?' — dá pra aplicar em todas as parcelas':''}</button>
      <button class="btn" id="dPay" style="justify-content:flex-start;padding:14px 16px">${svg('check')}
        Marcar como ${t.status==='PAGO'?'pendente':'pago'}</button>
      <button class="btn" id="dDel1" style="justify-content:flex-start;padding:14px 16px;color:var(--coral)">${svg('trash')}
        Excluir ${multi?'só esta parcela':'este lançamento'}</button>
      ${multi?`<button class="btn" id="dDelAll" style="justify-content:flex-start;padding:14px 16px;
        background:rgba(255,92,122,.14);border-color:rgba(255,92,122,.4);color:var(--coral)">${svg('trash')}
        Excluir as ${g.length} parcelas — ${BRL(totalG)}</button>`:''}
    </div>`);

  document.getElementById('dEdit').onclick = ()=>txEdit(id);
  document.getElementById('dPay').onclick = ()=>{
    t.status = t.status==='PAGO'?'PENDENTE':'PAGO'; save(); closeModal(); render(); };
  document.getElementById('dDel1').onclick = ()=>{
    DB.tx = DB.tx.filter(x=>x.id!==id); save(); closeModal(); render();
    toast('Lançamento excluído'); };
  const da = document.getElementById('dDelAll');
  if (da) da.onclick = ()=>confirmDelGroup(g);
}

function confirmDelGroup(g) {
  const ids = new Set(g.map(x=>x.id));
  const pagos = g.filter(x=>x.status==='PAGO').length;
  openModal(`<div class="mhead"><h2>Excluir ${g.length} parcelas?</h2>
    <button class="ibtn" data-close>${svg('x')}</button></div>
    <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0 0 6px">
      Isso apaga <strong style="color:var(--text)">${esc(baseDesc(g[0].desc))}</strong> por completo —
      as ${g.length} parcelas, somando <strong style="color:var(--text)">${BRL(sum(g))}</strong>,
      de ${mkLabel(mk(g.map(x=>x.date).sort()[0]),true)} até ${mkLabel(mk(g.map(x=>x.date).sort().slice(-1)[0]),true)}.</p>
    ${pagos?`<p style="font-size:13px;color:var(--amber);margin:0 0 6px">${pagos} ${pagos===1?'parcela já está marcada':'parcelas já estão marcadas'} como paga.</p>`:''}
    <p style="font-size:12.5px;color:var(--dim);margin:0">Não tem como desfazer.</p>
    <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn" id="gYes" style="background:var(--coral);color:#fff;border:none">Excluir tudo</button></div>`);
  document.getElementById('gYes').onclick = ()=>{
    DB.tx = DB.tx.filter(x=>!ids.has(x.id)); save(); closeModal(); render();
    toast(`${g.length} parcelas excluídas`); };
}

function txEdit(id) {
  const t = DB.tx.find(x=>x.id===id); if (!t) return;
  const g = groupOf(t), multi = g.length>1;
  const isIn = t.kind==='in';
  let all = multi;
  openModal(`<div class="mhead"><h2>Editar lançamento</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>

    ${multi?`<div class="seg" style="margin-bottom:16px">
      <button type="button" data-sc="all" class="on">Todas as ${g.length} parcelas</button>
      <button type="button" data-sc="one">Só esta (${t.n}/${t.of})</button></div>`:''}

    <div class="fld"><label>Descrição</label>
      <input id="eDesc" value="${esc(multi?baseDesc(t.desc):t.desc)}"></div>

    <div class="fld"><label>Valor ${multi?'de cada parcela':''}</label>
      <input type="number" step="0.01" min="0" id="eAmt" value="${t.amount}"></div>

    <div class="fld"><label>${isIn?'Entrou em':'Pago com'}</label>
      <div class="chips" id="eCardChips">${DB.cards.map(c=>`<button type="button" class="chip ${t.card===c.id?'on':''}" data-ecd="${c.id}">
        <span class="cdot" style="background:${c.c1}"></span>${esc(c.name)}</button>`).join('')}</div></div>

    ${isIn?'':`
    <div class="fld"><label>Quem comprou</label>
      <div class="chips" id="ePerChips">${DB.people.map(p=>`<button type="button" class="chip ${t.person===p.id?'on':''}" data-epr="${p.id}">
        <span class="cdot" style="background:${p.color}"></span>${esc(p.name)}</button>`).join('')}</div></div>

    <div class="fld"><label>Categoria</label>
      <div class="chips" id="eCatChips">${DB.cats.map(c=>`<button type="button" class="chip ${t.cat===c.id?'on':''}" data-ect="${c.id}">
        <span class="cdot" style="background:${c.color}"></span>${esc(c.name)}</button>`).join('')}</div></div>`}

    <div class="fld"><label>Data${multi?' da parcela atual (as outras acompanham o mês)':''}</label>
      <input type="date" id="eDate" value="${t.date}"></div>

    <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
      <button class="btn btn-p" id="eSave">Salvar</button></div>`);

  let nc = t.card, np = t.person, ng = t.cat;
  const M = document.getElementById('mbody');
  M.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{ all = b.dataset.sc==='all';
    M.querySelectorAll('[data-sc]').forEach(x=>x.classList.toggle('on',x===b)); });
  M.querySelectorAll('[data-ecd]').forEach(b=>b.onclick=()=>{ nc=b.dataset.ecd;
    M.querySelectorAll('[data-ecd]').forEach(x=>x.classList.toggle('on',x===b)); });
  M.querySelectorAll('[data-epr]').forEach(b=>b.onclick=()=>{ np=b.dataset.epr;
    M.querySelectorAll('[data-epr]').forEach(x=>x.classList.toggle('on',x===b)); });
  M.querySelectorAll('[data-ect]').forEach(b=>b.onclick=()=>{ ng=b.dataset.ect;
    M.querySelectorAll('[data-ect]').forEach(x=>x.classList.toggle('on',x===b)); });

  document.getElementById('eSave').onclick = ()=>{
    const nd = document.getElementById('eDesc').value.trim();
    const na = parseFloat(document.getElementById('eAmt').value);
    const ndt= document.getElementById('eDate').value || t.date;
    if (!na || na<=0) { toast('Informe um valor'); return; }
    const targets = all ? g : [t];
    const day = ndt.slice(8);
    const shift = all ? mDiff(mk(t.date), mk(ndt)) : 0;
    targets.forEach(x => {
      x.card = nc; if (!isIn) { x.person = np; x.cat = ng; }
      x.amount = na;
      if (nd) x.desc = x.of>1 ? `${nd} (${x.n}/${x.of})` : nd;
      if (all) { x.date = mkAdd(mk(x.date), shift)+'-'+day; }
      else x.date = ndt;
    });
    save(); closeModal(); render();
    toast(all && multi ? `${targets.length} parcelas atualizadas` : 'Lançamento atualizado');
  };
}
function mDiff(a,b){ const [y1,m1]=a.split('-').map(Number), [y2,m2]=b.split('-').map(Number);
  return (y2-y1)*12 + (m2-m1); }

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
    <div style="max-height:56vh;overflow-y:auto">${items.map(t=>txRow(t,true)).join('')||'<div class="empty">Nada aqui.</div>'}</div>
    <div class="macts"><button class="btn btn-p" data-close>Fechar</button></div>`);
  document.querySelectorAll('#mbody [data-toggle]').forEach(b=>b.onclick=()=>{
    const t = DB.tx.find(x=>x.id===b.dataset.toggle);
    if (t) { t.status = t.status==='PAGO'?'PENDENTE':'PAGO'; save(); render(); personDetail(pid); } });
  document.querySelectorAll('#mbody [data-del]').forEach(b=>b.onclick=()=>{
    DB.tx = DB.tx.filter(t=>t.id!==b.dataset.del); save(); render(); personDetail(pid); toast('Lançamento excluído'); });
}

/* --------------------------------------------- EXCLUIR PESSOA/CARTÃO/CATEGORIA */
function removeEntity(kind, id) {
  const meta = {
    person: { list:'people', label:'pessoa', field:'person', fb:'OUTROS',   fbName:'Outros'   },
    card:   { list:'cards',  label:'cartão', field:'card',   fb:'PIX',      fbName:'Pix'      },
    cat:    { list:'cats',   label:'categoria', field:'cat', fb:'DIVERSOS', fbName:'Diversos' },
  }[kind];
  const arr = DB[meta.list];
  const obj = arr.find(x=>x.id===id); if (!obj) return;
  if (arr.length<=1) { toast(`Você precisa de pelo menos ${meta.label==='pessoa'?'uma pessoa':'um '+meta.label}`); return; }
  const used = DB.tx.filter(t=>t[meta.field]===id);
  const fb = arr.find(x=>x.id===meta.fb && x.id!==id) || arr.find(x=>x.id!==id);

  openModal(`<div class="mhead"><h2>Excluir ${esc(obj.name)}?</h2>
    <button class="ibtn" data-close>${svg('x')}</button></div>
    ${used.length ? `
      <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0 0 16px">
        Existem <strong style="color:var(--text)">${used.length} lançamentos</strong>
        (${BRL(sum(used))}) usando ${esc(obj.name)}. O que fazer com eles?</p>
      <div style="display:flex;flex-direction:column;gap:9px">
        <button class="btn" id="rMove" style="justify-content:flex-start;padding:14px 16px">
          ${svg('check')}Mover para <strong style="margin-left:4px">${esc(fb.name)}</strong> e excluir</button>
        <button class="btn" id="rKill" style="justify-content:flex-start;padding:14px 16px;
          background:rgba(255,92,122,.14);border-color:rgba(255,92,122,.4);color:var(--coral)">
          ${svg('trash')}Excluir os ${used.length} lançamentos também</button>
        <button class="btn btn-g" data-close style="justify-content:flex-start;padding:14px 16px">Cancelar</button>
      </div>`
    : `<p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0">
        Nenhum lançamento usa ${esc(obj.name)}. Pode excluir tranquilo.</p>
      <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
        <button class="btn" id="rMove" style="background:var(--coral);color:#fff;border:none">Excluir</button></div>`}`);

  const drop = () => { DB[meta.list] = arr.filter(x=>x.id!==id); save(); closeModal(); render(); drawNav(); };
  document.getElementById('rMove').onclick = ()=>{
    used.forEach(t=>{ t[meta.field] = fb.id; });
    drop(); toast(used.length?`${esc(obj.name)} excluído · ${used.length} movidos para ${fb.name}`:`${obj.name} excluído`); };
  const rk = document.getElementById('rKill');
  if (rk) rk.onclick = ()=>{
    const ids = new Set(used.map(t=>t.id));
    DB.tx = DB.tx.filter(t=>!ids.has(t.id));
    drop(); toast(`${obj.name} e ${used.length} lançamentos excluídos`); };
}

/* ------------------------------------------------------ UI DE SINCRONIA */
const SYNC_LABEL = {
  off:     { t:'Não sincronizado', c:'var(--dim)',   i:'wifi'  },
  ok:      { t:'Sincronizado',     c:'var(--teal)',  i:'check' },
  syncing: { t:'Verificando…',     c:'var(--sky)',   i:'wifi'  },
  offline: { t:'Offline · salvo aqui', c:'var(--amber)', i:'wifi' },
  error:   { t:'Erro ao sincronizar', c:'var(--coral)', i:'alert' },
  conflict:{ t:'Conflito entre aparelhos', c:'var(--amber)', i:'alert' },
};
function pintarSync() {
  const S = window.FATURA_SYNC;
  document.querySelectorAll('[data-syncchip]').forEach(el => {
    const k = S && S.logado ? S.status : 'off';
    const L = SYNC_LABEL[k] || SYNC_LABEL.off;
    el.innerHTML = `<span class="syncdot" style="background:${L.c}"></span>
      <span style="color:${L.c}">${L.t}</span>`;
  });
  const f = document.getElementById('sideFoot');
  if (f) drawNav();
}

function contaModal(modo) {
  const S = FATURA_SYNC;
  let M = modo || 'in';
  const paint = () => {
    openModal(`<div class="mhead"><h2>${M==='up'?'Criar conta':'Entrar'}</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>
      <p style="font-size:13px;color:var(--muted);line-height:1.55;margin:0 0 16px">
        ${M==='up'
          ? 'Uma conta só sua, para os lançamentos aparecerem no celular e no computador.'
          : 'Entre com a mesma conta nos dois aparelhos para eles conversarem.'}</p>
      <div class="fld"><label>E-mail</label>
        <input type="email" id="acEmail" inputmode="email" autocomplete="email" placeholder="voce@email.com"></div>
      <div class="fld"><label>Senha</label>
        <input type="password" id="acSenha" autocomplete="${M==='up'?'new-password':'current-password'}" placeholder="mínimo 6 caracteres"></div>
      <p id="acErro" style="font-size:12.5px;color:var(--coral);margin:-6px 0 12px;display:none"></p>
      <div class="macts">
        <button class="btn btn-g" id="acAlt">${M==='up'?'Já tenho conta':'Criar conta'}</button>
        <button class="btn btn-p" id="acGo">${M==='up'?'Criar':'Entrar'}</button>
      </div>
      ${M==='in'?`<button class="muted-link" id="acEsq" style="display:block;margin:14px auto 0">Esqueci a senha</button>`:''}`);

    document.getElementById('acAlt').onclick = ()=>{ M = M==='up'?'in':'up'; paint(); };
    const erro = m => { const e=document.getElementById('acErro'); e.textContent=m; e.style.display='block'; };
    const esq = document.getElementById('acEsq');
    if (esq) esq.onclick = async ()=>{
      const em = document.getElementById('acEmail').value.trim();
      if (!em) { erro('Escreva seu e-mail primeiro.'); return; }
      try { await S.resetSenha(em); toast('Link de recuperação enviado'); }
      catch(e){ erro(S.traduz(e)); }
    };
    document.getElementById('acGo').onclick = async ()=>{
      const em = document.getElementById('acEmail').value.trim();
      const sn = document.getElementById('acSenha').value;
      if (!em || !sn) { erro('Preencha e-mail e senha.'); return; }
      if (sn.length < 6) { erro('A senha precisa de pelo menos 6 caracteres.'); return; }
      const btn = document.getElementById('acGo'); btn.textContent='Aguarde…'; btn.disabled=true;
      try {
        if (M==='up') {
          const r = await S.signUp(em, sn);
          if (r.confirmar) { closeModal();
            toast('Confirme o e-mail que enviamos e depois entre'); return; }
        } else {
          await S.signIn(em, sn);
        }
        closeModal();
        toast('Conectado como ' + S.email);
        await sincronizarAgora(true);
        S.startPolling(row => aplicarRemoto(row), 20000);
        render(); drawNav();
      } catch(e) {
        btn.textContent = M==='up'?'Criar':'Entrar'; btn.disabled=false;
        erro(S.traduz(e));
      }
    };
  };
  paint();
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
  bindStack(el);
  el.querySelectorAll('[data-go2]').forEach(b=>b.onclick=()=>go(b.dataset.go2));
  el.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{ F.card=b.dataset.card; go('extrato'); });
  el.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>waMessage(b.dataset.wa));
  el.querySelectorAll('[data-recv]').forEach(b=>b.onclick=()=>{
    const [pid, amt] = b.dataset.recv.split('|');
    txModal('in', { from: pid, amount: amt }); });
  el.querySelectorAll('[data-reemb]').forEach(b=>b.onclick=()=>{
    const p = DB.people.find(x=>x.id===b.dataset.reemb);
    if (p) { p.reembolsa = p.reembolsa===false; save(); render(); } });
  el.querySelectorAll('[data-pdet]').forEach(b=>b.onclick=()=>personDetail(b.dataset.pdet));
  el.querySelectorAll('[data-pphone]').forEach(b=>b.onclick=()=>phoneModal(b.dataset.pphone));
  el.querySelectorAll('[data-ecard]').forEach(b=>b.onclick=()=>cardModal(b.dataset.ecard));
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=e=>{ e.stopPropagation();
    const t = DB.tx.find(x=>x.id===b.dataset.del); const g = groupOf(t);
    if (g.length>1) { confirmDelGroup(g); return; }
    DB.tx = DB.tx.filter(x=>x.id!==b.dataset.del); save(); render(); toast('Lançamento excluído'); });
  el.querySelectorAll('[data-open2]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); txDetail(b.dataset.open2); });
  el.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=e=>{ e.stopPropagation();
    const t = DB.tx.find(x=>x.id===b.dataset.toggle);
    if (t) { t.status = t.status==='PAGO'?'PENDENTE':'PAGO'; save(); render(); } });
  el.querySelectorAll('[data-tx]').forEach(r=>{ r.style.cursor='pointer';
    r.onclick = e => { if (e.target.closest('button')) return; txDetail(r.dataset.tx); }; });
  el.querySelectorAll('[data-open]').forEach(r=>{ r.style.cursor='pointer';
    r.onclick = e => { if (e.target.closest('button')) return; txDetail(r.dataset.open); }; });

  const q = el.querySelector('#fq');
  if (q) { q.oninput = e => { F.q = e.target.value; const p=e.target.selectionStart; render();
    const n = document.querySelector('#fq'); if(n){ n.focus(); n.setSelectionRange(p,p);} }; }
  el.querySelectorAll('[data-kd]').forEach(b=>b.onclick=()=>{ F.kind=b.dataset.kd;
    if (F.kind==='in') { F.person='ALL'; F.cat='ALL'; } render(); });

  const batch = (to) => {
    let list = DB.tx.filter(t => mk(t.date)===MK);
    if (F.kind!=='ALL')   list = list.filter(t=>t.kind===F.kind);
    if (F.card!=='ALL')   list = list.filter(t=>t.card===F.card);
    if (F.person!=='ALL') list = list.filter(t=>t.person===F.person);
    if (F.cat!=='ALL')    list = list.filter(t=>t.cat===F.cat);
    if (F.status!=='ALL') list = list.filter(t=>t.status===F.status);
    if (F.q) { const q=F.q.toLowerCase(); list = list.filter(t=>(t.desc||'').toLowerCase().includes(q)); }
    const alvo = list.filter(t=>t.status!==to);
    if (!alvo.length) return;
    const nome = filterLabel();
    openModal(`<div class="mhead"><h2>${to==='PAGO'?'Marcar como pago':'Reabrir lançamentos'}</h2>
      <button class="ibtn" data-close>${svg('x')}</button></div>
      <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0 0 6px">
        ${to==='PAGO'?'Vão ser marcados como pagos':'Voltam a ficar pendentes'}
        <strong style="color:var(--text)">${alvo.length} lançamentos</strong>${nome?` de <strong style="color:var(--text)">${esc(nome)}</strong>`:''}
        em ${mkLabel(MK,true)}, somando <strong style="color:var(--text)">${BRL(sum(alvo))}</strong>.</p>
      <p style="font-size:12.5px;color:var(--dim);margin:0">Dá pra desfazer depois, um a um ou em lote.</p>
      <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
        <button class="btn btn-p" id="bYes">Confirmar</button></div>`);
    document.getElementById('bYes').onclick = ()=>{
      alvo.forEach(t=>{ t.status = to; }); save(); closeModal(); render();
      toast(`${alvo.length} lançamentos marcados como ${to==='PAGO'?'pagos':'pendentes'}`); };
  };
  const mp = el.querySelector('#markAllPaid'); if (mp) mp.onclick = ()=>batch('PAGO');
  const mr = el.querySelector('#markAllPend'); if (mr) mr.onclick = ()=>batch('PENDENTE');

  const bindSel = (id, key) => { const s = el.querySelector(id); if (s) s.onchange = e => { F[key]=e.target.value; render(); }; };
  bindSel('#fcard','card'); bindSel('#fper','person'); bindSel('#fcat','cat'); bindSel('#fst','status');

  const at = el.querySelector('#addTop'); if (at) at.onclick = ()=>txModal('out');
  const ai = el.querySelector('#addInc'); if (ai) ai.onclick = ()=>txModal('in');
  el.querySelectorAll('[data-mvcard]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); e.preventDefault();
    const [id, dir] = b.dataset.mvcard.split('|');
    const i = DB.cards.findIndex(x=>x.id===id), j = i + (+dir);
    if (i<0 || j<0 || j>=DB.cards.length) return;
    [DB.cards[i], DB.cards[j]] = [DB.cards[j], DB.cards[i]];
    save(); render(); });
  el.querySelectorAll('[data-rmper]').forEach(b=>b.onclick=()=>removeEntity('person', b.dataset.rmper));
  el.querySelectorAll('[data-rmcard]').forEach(b=>b.onclick=()=>removeEntity('card', b.dataset.rmcard));
  el.querySelectorAll('[data-rmcat]').forEach(b=>b.onclick=()=>removeEntity('cat', b.dataset.rmcat));
  const ac = el.querySelector('#addCard'); if (ac) ac.onclick = ()=>addSimple('card');
  const ap = el.querySelector('#addPerson'); if (ap) ap.onclick = ()=>addSimple('person');
  const ag = el.querySelector('#addCat'); if (ag) ag.onclick = ()=>addSimple('cat');
  const ms = el.querySelector('#metaSave');
  if (ms) ms.onclick = ()=>{ DB.settings.meta = +document.getElementById('metaIn').value||0; save(); render(); toast('Meta salva'); };
  const su = el.querySelector('#syncUp'); if (su) su.onclick = ()=>contaModal('up');
  const si = el.querySelector('#syncIn'); if (si) si.onclick = ()=>contaModal('in');
  const sn = el.querySelector('#syncNow');
  if (sn) sn.onclick = async ()=>{ toast('Sincronizando…'); await sincronizarAgora(false); toast('Tudo em dia'); };
  const so = el.querySelector('#syncOut');
  if (so) so.onclick = ()=>{
    openModal(`<div class="mhead"><h2>Sair da conta?</h2><button class="ibtn" data-close>${svg('x')}</button></div>
      <p style="font-size:14px;color:var(--muted);line-height:1.6;margin:0">
        Seus lançamentos continuam salvos neste aparelho e na nuvem. Você pode entrar de novo quando quiser.</p>
      <div class="macts"><button class="btn btn-g" data-close>Cancelar</button>
        <button class="btn btn-p" id="outYes">Sair</button></div>`);
    document.getElementById('outYes').onclick = async ()=>{
      await FATURA_SYNC.signOut(); closeModal(); render(); drawNav(); toast('Você saiu da conta'); };
  };
  pintarSync();
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

/* liga a sincronização */
if (window.FATURA_SYNC) {
  FATURA_SYNC.onStatus(()=>pintarSync());
  if (FATURA_SYNC.logado) {
    sincronizarAgora(true);
    FATURA_SYNC.startPolling(row => aplicarRemoto(row), 20000);
  }
  window.addEventListener('online',  ()=>{ if (FATURA_SYNC.logado) sincronizarAgora(false); });
  window.addEventListener('offline', ()=>pintarSync());
  document.addEventListener('visibilitychange', ()=>{
    if (!document.hidden && FATURA_SYNC.logado) sincronizarAgora(false); });
  window.addEventListener('beforeunload', ()=>{
    if (FATURA_SYNC.logado && FATURA_SYNC.meta.dirty) FATURA_SYNC.push(DB); });
}

})();
