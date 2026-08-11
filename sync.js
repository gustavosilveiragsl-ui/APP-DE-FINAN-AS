/* ==========================================================================
   FATURA · sync.js — sincronização entre celular e computador
   Banco: Supabase (plano gratuito). Funciona offline e sobe quando volta a rede.
   ========================================================================== */
window.FATURA_SYNC = (function () {
"use strict";

const URL_BASE = 'https://rpsjirjhieefobowptas.supabase.co';
const ANON_KEY = 'sb_publishable_u1km4DDtlUqUq7gdRXiJyA_rBK7n5_8';

const SESS_KEY  = 'fatura.session';
const META_KEY  = 'fatura.syncmeta';
const DEV_KEY   = 'fatura.device';

/* ------------------------------------------------------------ estado */
let session = null;            // { access_token, refresh_token, expires_at, user }
let meta    = { version: 0, lastPush: 0, dirty: false };
let listeners = [];
let pushTimer = null, pollTimer = null;
let status = 'off';            // off | ok | syncing | offline | error | conflict
let inFlight = false;

const device = (() => {
  let d = localStorage.getItem(DEV_KEY);
  if (!d) {
    const ua = navigator.userAgent;
    const tipo = /Android|iPhone|iPad|Mobile/i.test(ua) ? 'Celular' : 'Computador';
    d = tipo + ' · ' + Math.random().toString(36).slice(2,6);
    localStorage.setItem(DEV_KEY, d);
  }
  return d;
})();

try { session = JSON.parse(localStorage.getItem(SESS_KEY) || 'null'); } catch(e){}
if (session) status = 'syncing';   // logado: já começa verificando, não "desligado"
try { meta = Object.assign(meta, JSON.parse(localStorage.getItem(META_KEY) || '{}')); } catch(e){}

const saveSess = () => session ? localStorage.setItem(SESS_KEY, JSON.stringify(session))
                               : localStorage.removeItem(SESS_KEY);
const saveMeta = () => localStorage.setItem(META_KEY, JSON.stringify(meta));

function setStatus(s, extra) {
  status = s;
  listeners.forEach(fn => { try { fn(s, extra); } catch(e){} });
}

/* ------------------------------------------------------------ HTTP */
async function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({
    'apikey': ANON_KEY,
    'Content-Type': 'application/json',
  }, opts.headers || {});
  if (session && session.access_token && !opts.noAuth) {
    headers['Authorization'] = 'Bearer ' + session.access_token;
  }
  const res = await fetch(URL_BASE + path, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let json = null;
  const txt = await res.text();
  if (txt) { try { json = JSON.parse(txt); } catch(e){ json = txt; } }
  if (!res.ok) {
    const err = new Error((json && (json.msg || json.message || json.error_description || json.error)) || ('HTTP ' + res.status));
    err.status = res.status; err.body = json;
    throw err;
  }
  return json;
}

async function ensureToken() {
  if (!session) throw new Error('sem sessão');
  const agora = Math.floor(Date.now()/1000);
  if (session.expires_at && session.expires_at - 60 > agora) return;
  const r = await api('/auth/v1/token?grant_type=refresh_token', {
    method:'POST', noAuth:true, body:{ refresh_token: session.refresh_token }
  });
  session = {
    access_token: r.access_token, refresh_token: r.refresh_token,
    expires_at: Math.floor(Date.now()/1000) + (r.expires_in || 3600),
    user: r.user || session.user
  };
  saveSess();
}

/* ------------------------------------------------------------ auth */
async function signUp(email, senha) {
  const r = await api('/auth/v1/signup', { method:'POST', noAuth:true, body:{ email, password: senha } });
  if (r.access_token) { adoptSession(r); return { ok:true, confirmar:false }; }
  return { ok:true, confirmar:true };   // projeto exige confirmar e-mail
}
async function signIn(email, senha) {
  const r = await api('/auth/v1/token?grant_type=password', {
    method:'POST', noAuth:true, body:{ email, password: senha } });
  adoptSession(r);
  return { ok:true };
}
function adoptSession(r) {
  session = {
    access_token: r.access_token, refresh_token: r.refresh_token,
    expires_at: Math.floor(Date.now()/1000) + (r.expires_in || 3600),
    user: r.user
  };
  saveSess();
  meta = { version: 0, lastPush: 0, dirty: false };
  saveMeta();
}
async function signOut() {
  try { if (session) await api('/auth/v1/logout', { method:'POST' }); } catch(e){}
  session = null; saveSess();
  meta = { version:0, lastPush:0, dirty:false }; saveMeta();
  clearInterval(pollTimer); pollTimer = null;
  setStatus('off');
}
async function resetSenha(email) {
  await api('/auth/v1/recover', { method:'POST', noAuth:true, body:{ email } });
  return { ok:true };
}

/* ------------------------------------------------------------ dados */
async function pull() {
  await ensureToken();
  const rows = await api('/rest/v1/fatura_state?select=data,version,updated_at,device', {
    headers: { 'Accept':'application/json' }
  });
  if (!rows || !rows.length) { if (!meta.dirty) setStatus('ok', { quando: Date.now() }); return null; }
  if (!meta.dirty) setStatus('ok', { quando: Date.now() });
  return rows[0];
}

async function push(data, force) {
  if (!session) return { ok:false, motivo:'sem sessão' };
  if (inFlight) { meta.dirty = true; saveMeta(); return { ok:false, motivo:'ocupado' }; }
  inFlight = true;
  setStatus('syncing');
  try {
    await ensureToken();
    const base = force ? null : meta.version;
    const r = await api('/rest/v1/rpc/fatura_push', {
      method:'POST',
      body:{ p_data: data, p_base_version: force ? -1 : base, p_device: device }
    });
    const row = Array.isArray(r) ? r[0] : r;

    if (force && row && !row.ok) {
      // força: regrava usando a versão que veio do servidor
      const r2 = await api('/rest/v1/rpc/fatura_push', {
        method:'POST',
        body:{ p_data: data, p_base_version: row.version, p_device: device }
      });
      const row2 = Array.isArray(r2) ? r2[0] : r2;
      meta.version = row2.version; meta.dirty = false; meta.lastPush = Date.now(); saveMeta();
      setStatus('ok', { quando: Date.now() });
      return { ok:true };
    }

    if (row && row.ok === false) {
      meta.version = row.version; saveMeta();
      setStatus('conflict', { remoto: row.data, version: row.version, quando: row.updated_at });
      return { ok:false, conflito:true, remoto: row.data, version: row.version };
    }

    meta.version = row.version; meta.dirty = false; meta.lastPush = Date.now(); saveMeta();
    setStatus('ok', { quando: Date.now() });
    return { ok:true, version: row.version };

  } catch (e) {
    if (!navigator.onLine || e.message === 'Failed to fetch') {
      meta.dirty = true; saveMeta(); setStatus('offline');
      return { ok:false, offline:true };
    }
    meta.dirty = true; saveMeta();
    setStatus('error', { msg: traduz(e) });
    return { ok:false, erro: traduz(e) };
  } finally {
    inFlight = false;
  }
}

/* Verifica se outro aparelho gravou algo mais novo */
async function checkRemote() {
  if (!session || inFlight) return null;
  try {
    await ensureToken();
    const v = await api('/rest/v1/rpc/fatura_version', { method:'POST', body:{} });
    const remota = typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : 0);
    if (remota > meta.version) return remota;
    if (!meta.dirty) setStatus('ok', { quando: Date.now() });
    return null;
  } catch(e) { return null; }
}

/* ------------------------------------------------------------ agenda */
function schedulePush(getData, ms) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { if (session) push(getData()); }, ms == null ? 1200 : ms);
}
function startPolling(onRemote, ms) {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    const nova = await checkRemote();
    if (nova) { const row = await pull(); if (row) onRemote(row); }
  }, ms || 20000);
}

function traduz(e) {
  const m = String((e && e.message) || e || '').toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Esse e-mail já tem conta. Use "entrar".';
  if (m.includes('password') && m.includes('6')) return 'A senha precisa de pelo menos 6 caracteres.';
  if (m.includes('email') && m.includes('invalid')) return 'E-mail inválido.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Espere um minuto.';
  if (m.includes('failed to fetch')) return 'Sem conexão com o servidor.';
  if (m.includes('not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  return (e && e.message) || 'Erro inesperado.';
}

/* ------------------------------------------------------------ público */
return {
  device,
  get logado()  { return !!session; },
  get email()   { return session && session.user ? session.user.email : null; },
  get status()  { return status; },
  get meta()    { return Object.assign({}, meta); },
  onStatus(fn)  { listeners.push(fn); },
  signUp, signIn, signOut, resetSenha,
  pull, push, checkRemote, schedulePush, startPolling,
  marcarSujo() { meta.dirty = true; saveMeta(); },
  marcarEmDia() { if (session) setStatus('ok', { quando: Date.now() }); },
  setVersion(v){ meta.version = v; saveMeta(); },
  traduz,
};
})();
