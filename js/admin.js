/**
 * João Guerra & Filhos, Lda. — admin.js
 * Módulos: Login · Stock · Calculadora · Encomendas · Histórico
 * Dados: localStorage (a migrar para Firebase)
 */

'use strict';

// ── Credenciais (TEMPORÁRIO — será substituído por Firebase Auth) ──────────
// Para alterar: muda os valores abaixo
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'guerra2024';

// ── Mapa: chave do módulo Stock (sn/pb/...) → id do metal no Catálogo ──────
const METAL_KEY_TO_CATALOG_ID = { sn: 'estanho', pb: 'chumbo', sb: 'antimonio', cu: 'cobre', bi: 'bismuto', ni: 'niquel' };

// ── Estado de stock automático a partir do peso (kg) ───────────────────────
// 0kg → Indisponível · 1-99kg → Por Encomenda · 100kg+ → Em Stock
function computeStockStatus(kg) {
  const n = Number(kg) || 0;
  if (n <= 0) return 'Indisponível';
  if (n < 100) return 'Por Encomenda';
  return 'Em Stock';
}

function stockStatusBadgeClass(status) {
  if (status === 'Em Stock') return 'badge--green';
  if (status === 'Por Encomenda') return 'badge--yellow';
  return 'badge--red'; // Indisponível / Esgotado (legado)
}

// Sincroniza o estado de stock do catálogo (site público) a partir dos kg do módulo Stock
function syncCatalogStockFromStock(data) {
  const { metals, products } = getCatalogData();
  let changed = false;
  for (const [key, m] of Object.entries(data.metals)) {
    const catalogId = METAL_KEY_TO_CATALOG_ID[key];
    if (!catalogId) continue;
    const catalogMetal = metals.find(x => x.id === catalogId);
    if (!catalogMetal) continue;
    const newStatus = computeStockStatus(m.stock);
    if (catalogMetal.stockStatus !== newStatus) {
      catalogMetal.stockStatus = newStatus;
      changed = true;
    }
  }
  if (changed) saveCatalogData(metals, products);
}

// ── Estrutura inicial dos metais ──────────────────────────────────────────
const METALS_DEFAULT = {
  sn: { name: 'Estanho',   symbol: 'Sn', stock: 0, buyPrice: 0, supplier: '', notes: '' },
  pb: { name: 'Chumbo',    symbol: 'Pb', stock: 0, buyPrice: 0, supplier: '', notes: '' },
  sb: { name: 'Antimônio', symbol: 'Sb', stock: 0, buyPrice: 0, supplier: '', notes: '' },
  cu: { name: 'Cobre',     symbol: 'Cu', stock: 0, buyPrice: 0, supplier: '', notes: '' },
  bi: { name: 'Bismuto',   symbol: 'Bi', stock: 0, buyPrice: 0, supplier: '', notes: '' },
  ni: { name: 'Níquel',    symbol: 'Ni', stock: 0, buyPrice: 0, supplier: '', notes: '' },
};

// ── Helpers de dados (localStorage) ──────────────────────────────────────
function loadData() {
  try {
    return JSON.parse(localStorage.getItem('jgf_admin_data')) || {};
  } catch { return {}; }
}

function saveData(data) {
  localStorage.setItem('jgf_admin_data', JSON.stringify(data));
}

function getData() {
  const d = loadData();
  if (!d.metals) d.metals = structuredClone(METALS_DEFAULT);
  if (!d.margin) d.margin = 15;
  if (!d.priceHistory) d.priceHistory = {};
  if (!d.recipes) d.recipes = [];
  if (!d.orders) d.orders = [];
  if (!d.lastUpdate) d.lastUpdate = null;
  return d;
}

// ── ID generator ──────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Toast ─────────────────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer;

function showToast(msg = 'Guardado!', duration = 3000) {
  toastMsg.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}

// ── Formatar valores ──────────────────────────────────────────────────────
function fmt(n, decimals = 2) {
  if (!n && n !== 0) return '—';
  return Number(n).toLocaleString('pt-PT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtEur(n) { return fmt(n) + ' €'; }

// Escapa HTML nos campos de texto livre antes de os inserir nas tabelas do
// admin (defesa em profundidade — evita que um valor guardado com HTML/JS
// seja interpretado como marcação ao ser mostrado de novo).
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================================================
// LOGIN
// ==========================================================================

const loginScreen = document.getElementById('login-screen');
const adminLayout  = document.getElementById('admin-layout');
const loginForm    = document.getElementById('login-form');
const loginError   = document.getElementById('login-error');
const logoutBtn    = document.getElementById('logout-btn');
const userAvatar   = document.getElementById('user-avatar');
const userName     = document.getElementById('user-name');

function checkSession() {
  const u = sessionStorage.getItem('jgf_user');
  if (u) {
    loginScreen.style.display = 'none';
    adminLayout.classList.add('visible');
    userAvatar.textContent = u[0].toUpperCase();
    userName.textContent = u;
    initModules();
  }
}

// ── Bloqueio de tentativas de login ─────────────────────────────────────
// Trava o formulário após várias tentativas falhadas seguidas, para dificultar
// tentativas automáticas/repetidas. Guardado em localStorage para sobreviver
// a um simples recarregar da página.
const LOGIN_LOCK_KEY       = 'jgf_login_lock';
const LOGIN_ERROR_DEFAULT  = loginError.textContent;
const MAX_LOGIN_ATTEMPTS   = 5;
const LOGIN_LOCKOUT_MS     = 30000;
const loginSubmitBtn       = document.getElementById('login-btn');

function getLoginLockState() {
  try { return JSON.parse(localStorage.getItem(LOGIN_LOCK_KEY)) || { attempts: 0, lockedUntil: 0 }; }
  catch { return { attempts: 0, lockedUntil: 0 }; }
}
function setLoginLockState(state) {
  localStorage.setItem(LOGIN_LOCK_KEY, JSON.stringify(state));
}

function refreshLoginLockUI() {
  const state = getLoginLockState();
  const remainingMs = state.lockedUntil - Date.now();
  if (remainingMs > 0) {
    loginSubmitBtn.disabled = true;
    loginError.textContent = `Demasiadas tentativas. Tenta novamente daqui a ${Math.ceil(remainingMs / 1000)}s.`;
    loginError.classList.add('show');
    setTimeout(refreshLoginLockUI, 1000);
    return true;
  }
  loginSubmitBtn.disabled = false;
  if (loginError.textContent !== LOGIN_ERROR_DEFAULT) loginError.textContent = LOGIN_ERROR_DEFAULT;
  return false;
}
refreshLoginLockUI();

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (refreshLoginLockUI()) return;

  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    setLoginLockState({ attempts: 0, lockedUntil: 0 });
    loginError.classList.remove('show');
    sessionStorage.setItem('jgf_user', u);
    loginScreen.style.display = 'none';
    adminLayout.classList.add('visible');
    userAvatar.textContent = u[0].toUpperCase();
    userName.textContent = u;
    initModules();
  } else {
    const state = getLoginLockState();
    state.attempts += 1;
    if (state.attempts >= MAX_LOGIN_ATTEMPTS) {
      state.lockedUntil = Date.now() + LOGIN_LOCKOUT_MS;
      state.attempts = 0;
    }
    setLoginLockState(state);
    loginError.textContent = LOGIN_ERROR_DEFAULT;
    loginError.classList.add('show');
    document.getElementById('login-pass').value = '';
    document.getElementById('login-pass').focus();
    refreshLoginLockUI();
  }
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('jgf_user');
  adminLayout.classList.remove('visible');
  loginScreen.style.display = 'flex';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
});

// ==========================================================================
// NAVEGAÇÃO
// ==========================================================================

const navItems = document.querySelectorAll('.nav-item[data-module]');
const panels   = document.querySelectorAll('.module-panel');
const topbarTitle    = document.getElementById('topbar-title');
const topbarSubtitle = document.getElementById('topbar-subtitle');

const MODULE_META = {
  stock:   { title: 'Stock & Preços',        subtitle: 'Gestão de matéria-prima' },
  calc:    { title: 'Calculadora de Ligas',  subtitle: 'Custo de produção em tempo real' },
  orders:  { title: 'Encomendas',            subtitle: 'Registo e acompanhamento de pedidos' },
  history: { title: 'Histórico de Preços',   subtitle: 'Evolução dos preços de compra' },
  news:    { title: 'Notícias & Novidades',  subtitle: 'Gere as publicações visíveis no site' },
  catalog: { title: 'Catálogo',              subtitle: 'Edita a matéria-prima e produtos do site' },
  hero:    { title: 'Banner Principal (Hero)', subtitle: 'Personaliza o fundo da secção inicial' },
  whatsapp:{ title: 'WhatsApp Flutuante',    subtitle: 'Gere a visibilidade, número e mensagem' },
};

function switchModule(moduleId) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.module === moduleId));
  panels.forEach(p => p.classList.toggle('active', p.id === `panel-${moduleId}`));

  const meta = MODULE_META[moduleId] || {};
  topbarTitle.textContent    = meta.title    || '';
  topbarSubtitle.textContent = meta.subtitle || '';

  if (moduleId === 'history') renderHistory();
  if (moduleId === 'orders')  renderOrders();
  if (moduleId === 'stock')   renderStock();
  if (moduleId === 'news')    renderNewsAdmin();
  if (moduleId === 'catalog') renderCatalogAdmin();
  if (moduleId === 'hero')    renderHeroAdmin();
  if (moduleId === 'whatsapp') renderWhatsAppAdmin();

  // Close sidebar on mobile
  if (window.innerWidth <= 768) closeSidebarMobile();
}

navItems.forEach(btn => {
  btn.addEventListener('click', () => switchModule(btn.dataset.module));
});

// Mobile sidebar
const sidebar    = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const hamburgerBtn   = document.getElementById('hamburger-btn');

function closeSidebarMobile() {
  sidebar.classList.remove('mobile-open');
  sidebarOverlay.classList.remove('show');
}

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
  sidebarOverlay.classList.toggle('show');
});
sidebarOverlay.addEventListener('click', closeSidebarMobile);

// ==========================================================================
// MÓDULO A — STOCK & PREÇOS
// ==========================================================================

function renderStock() {
  const data = getData();
  const margin = data.margin;
  syncCatalogStockFromStock(data);

  // Atualizar input de margem
  document.getElementById('margin-input').value = margin;

  // Last update label
  const luLabel = document.getElementById('last-update-label');
  luLabel.textContent = data.lastUpdate
    ? new Date(data.lastUpdate).toLocaleString('pt-PT')
    : 'Nunca';

  // Stats rápidas
  const statsEl = document.getElementById('stock-stats');
  const totalStock = Object.values(data.metals).reduce((s, m) => s + (Number(m.stock) || 0), 0);
  const metalsWithPrice = Object.values(data.metals).filter(m => m.buyPrice > 0).length;
  statsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-card__label">Total em Stock</div>
      <div class="stat-card__value">${fmt(totalStock, 0)} <span style="font-size:1rem;font-weight:500;color:var(--text-muted)">kg</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-card__label">Metais c/ Preço</div>
      <div class="stat-card__value green">${metalsWithPrice}<span style="font-size:1rem;font-weight:500;color:var(--text-muted)">/6</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-card__label">Margem Global</div>
      <div class="stat-card__value">${margin}<span style="font-size:1rem;font-weight:500;color:var(--text-muted)">%</span></div>
    </div>
  `;

  // Tabela de metais
  const tbody = document.getElementById('stock-tbody');
  tbody.innerHTML = '';
  for (const [key, m] of Object.entries(data.metals)) {
    const sellPrice = m.buyPrice > 0 ? (m.buyPrice * (1 + margin / 100)) : null;
    const status = computeStockStatus(m.stock);
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>
          <span class="table-metal-symbol">${m.symbol}</span>
          <strong style="color:var(--text-primary)">${m.name}</strong>
        </td>
        <td>
          <input class="table-inline-input" type="number" min="0" step="0.1"
            data-key="${key}" data-field="stock" value="${m.stock || 0}"
            oninput="updateStockStatusBadge('${key}', this.value)" />
        </td>
        <td>
          <span class="badge ${stockStatusBadgeClass(status)}" id="stock-status-badge-${key}">${status}</span>
        </td>
        <td>
          <input class="table-inline-input" type="number" min="0" step="0.01"
            data-key="${key}" data-field="buyPrice" value="${m.buyPrice || 0}" />
        </td>
        <td style="color:${sellPrice ? 'var(--green-400)' : 'var(--text-muted)'}; font-weight:600;">
          ${sellPrice ? fmtEur(sellPrice) + '/kg' : '—'}
        </td>
        <td>
          <input class="table-inline-input" type="text" style="width:180px;"
            data-key="${key}" data-field="supplier" value="${m.supplier || ''}" placeholder="Fornecedor / notas" />
        </td>
      </tr>
    `);
  }
}

function updateStockStatusBadge(key, kg) {
  const status = computeStockStatus(kg);
  const el = document.getElementById(`stock-status-badge-${key}`);
  if (!el) return;
  el.textContent = status;
  el.className = `badge ${stockStatusBadgeClass(status)}`;
}

document.getElementById('save-stock-btn').addEventListener('click', () => {
  const data = getData();

  // Ler todos os inputs da tabela
  document.querySelectorAll('#stock-tbody input[data-key]').forEach(inp => {
    const key   = inp.dataset.key;
    const field = inp.dataset.field;
    const val   = inp.type === 'text' ? inp.value : parseFloat(inp.value) || 0;
    data.metals[key][field] = val;
  });

  // Margem
  const newMargin = parseFloat(document.getElementById('margin-input').value) || 15;
  data.margin = newMargin;

  // Guardar histórico de preços
  const now = new Date().toISOString();
  data.lastUpdate = now;

  for (const [key, m] of Object.entries(data.metals)) {
    if (m.buyPrice > 0) {
      if (!data.priceHistory[key]) data.priceHistory[key] = [];
      // Só guarda se o preço mudou ou ainda não existe entrada para hoje
      const today = now.slice(0, 10);
      const lastEntry = data.priceHistory[key].at(-1);
      if (!lastEntry || lastEntry.date.slice(0, 10) !== today || lastEntry.price !== m.buyPrice) {
        data.priceHistory[key].push({ date: now, price: m.buyPrice });
      }
    }
  }

  saveData(data);
  syncCatalogStockFromStock(data);
  renderStock();
  showToast('Preços e stock guardados!');
});

// ==========================================================================
// MÓDULO B — CALCULADORA
// ==========================================================================

let calcComponents = []; // [{metalKey, pct}]

function getMetalOptions(selectedKey = '') {
  const data = getData();
  return Object.entries(data.metals).map(([k, m]) =>
    `<option value="${k}" ${k === selectedKey ? 'selected' : ''}>${m.name} (${m.symbol})</option>`
  ).join('');
}

function addComponent(metalKey = 'sn', pct = 0) {
  const id = uid();
  calcComponents.push({ id, metalKey, pct });
  renderComponents();
}

function removeComponent(id) {
  calcComponents = calcComponents.filter(c => c.id !== id);
  renderComponents();
}

function renderComponents() {
  const list = document.getElementById('components-list');
  list.innerHTML = '';
  calcComponents.forEach(comp => {
    list.insertAdjacentHTML('beforeend', `
      <div class="component-row" id="comp-${comp.id}">
        <select onchange="updateComponent('${comp.id}','metalKey',this.value)">
          ${getMetalOptions(comp.metalKey)}
        </select>
        <input type="number" min="0" max="100" step="0.1" value="${comp.pct}"
          placeholder="%" onchange="updateComponent('${comp.id}','pct',this.value)" />
        <button class="remove-btn" onclick="removeComponent('${comp.id}')" title="Remover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `);
  });
  updatePctWarning();
}

window.updateComponent = function(id, field, val) {
  const comp = calcComponents.find(c => c.id === id);
  if (comp) {
    comp[field] = field === 'pct' ? parseFloat(val) || 0 : val;
  }
  updatePctWarning();
};

window.removeComponent = removeComponent;

function updatePctWarning() {
  const total = calcComponents.reduce((s, c) => s + (c.pct || 0), 0);
  const warn = document.getElementById('pct-warning');
  const sumSpan = document.getElementById('pct-sum');
  sumSpan.textContent = fmt(total, 1);
  warn.classList.toggle('show', Math.abs(total - 100) > 0.1 && calcComponents.length > 0);
}

document.getElementById('add-component-btn').addEventListener('click', () => addComponent());

document.getElementById('clear-calc-btn').addEventListener('click', () => {
  calcComponents = [];
  renderComponents();
  document.getElementById('calc-name').value = '';
  document.getElementById('calc-qty').value = 100;
  document.getElementById('calc-result-box').style.display = 'none';
  document.getElementById('calc-no-result').style.display = 'block';
  document.getElementById('calc-no-prices').style.display = 'none';
});

document.getElementById('calc-btn').addEventListener('click', () => {
  if (calcComponents.length === 0) { showToast('Adiciona pelo menos um metal.'); return; }

  const data   = getData();
  const qty    = parseFloat(document.getElementById('calc-qty').value) || 100;
  const margin = data.margin;
  let totalCost = 0;
  let missingPrice = false;
  const lines = [];

  calcComponents.forEach(comp => {
    const m    = data.metals[comp.metalKey];
    const kgs  = qty * (comp.pct / 100);
    const cost = m.buyPrice > 0 ? kgs * m.buyPrice : null;

    if (!m.buyPrice || m.buyPrice === 0) missingPrice = true;

    lines.push({
      label: `${m.name} (${comp.pct}% = ${fmt(kgs, 2)} kg)`,
      cost: cost,
      pricePerKg: m.buyPrice
    });

    if (cost) totalCost += cost;
  });

  document.getElementById('calc-no-prices').style.display = missingPrice ? 'block' : 'none';
  document.getElementById('calc-no-result').style.display = 'none';
  document.getElementById('calc-result-box').style.display = 'block';

  // Renderizar linhas
  document.getElementById('result-qty').textContent = fmt(qty, 0) + ' kg';
  const linesEl = document.getElementById('result-lines');
  linesEl.innerHTML = lines.map(l => `
    <div class="calc-result__line">
      <span>${l.label}</span>
      <span>${l.cost !== null ? fmtEur(l.cost) : '⚠️ Sem preço'}</span>
    </div>
  `).join('');

  document.getElementById('result-total').textContent = fmtEur(totalCost);
  document.getElementById('result-perkg').textContent = totalCost > 0
    ? `${fmtEur(totalCost / qty)} / kg`
    : '';

  const selling = totalCost * (1 + margin / 100);
  document.getElementById('result-selling').textContent = totalCost > 0
    ? `${fmtEur(selling)} (${fmtEur(selling / qty)}/kg)`
    : '—';
});

document.getElementById('save-recipe-btn').addEventListener('click', () => {
  if (calcComponents.length === 0) { showToast('Adiciona componentes antes de guardar.'); return; }
  const name = document.getElementById('calc-name').value.trim() || 'Liga sem nome';
  const data = getData();
  data.recipes.push({
    id: uid(),
    name,
    components: calcComponents.map(c => ({ metalKey: c.metalKey, pct: c.pct })),
    createdAt: new Date().toISOString()
  });
  saveData(data);
  renderRecipes();
  showToast(`Receita "${name}" guardada!`);
});

function renderRecipes() {
  const data = getData();
  const emptyEl  = document.getElementById('recipes-empty');
  const itemsEl  = document.getElementById('recipe-items');

  if (data.recipes.length === 0) {
    emptyEl.style.display = 'block';
    itemsEl.innerHTML = '';
    return;
  }
  emptyEl.style.display = 'none';
  itemsEl.innerHTML = data.recipes.map(r => {
    const details = r.components.map(c => {
      const metal = getData().metals[c.metalKey];
      return `${metal ? metal.symbol : c.metalKey} ${c.pct}%`;
    }).join(' · ');
    return `
      <div class="recipe-item">
        <div>
          <div class="recipe-item__name">${r.name}</div>
          <div class="recipe-item__details">${details}</div>
        </div>
        <div class="recipe-item__actions">
          <button class="recipe-load-btn" onclick="loadRecipe('${r.id}')">Carregar</button>
          <button class="btn-danger" onclick="deleteRecipe('${r.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.loadRecipe = function(id) {
  const data = getData();
  const recipe = data.recipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById('calc-name').value = recipe.name;
  calcComponents = recipe.components.map(c => ({ id: uid(), metalKey: c.metalKey, pct: c.pct }));
  renderComponents();
  showToast(`Receita "${recipe.name}" carregada!`);
};

window.deleteRecipe = function(id) {
  if (!confirm('Apagar esta receita?')) return;
  const data = getData();
  data.recipes = data.recipes.filter(r => r.id !== id);
  saveData(data);
  renderRecipes();
  showToast('Receita apagada.');
};

// ==========================================================================
// MÓDULO C — ENCOMENDAS
// ==========================================================================

const STATUS_LABELS = {
  pending:    { label: 'Pendente',      badge: 'badge--yellow' },
  production: { label: 'Em Produção',   badge: 'badge--blue'   },
  sent:       { label: 'Enviado',       badge: 'badge--green'  },
  done:       { label: 'Concluído',     badge: 'badge--grey'   },
};

function renderOrders() {
  const data = getData();
  let orders = [...data.orders];

  // Filtros
  const statusFilter  = document.getElementById('filter-status').value;
  const productFilter = document.getElementById('filter-product').value;
  if (statusFilter)  orders = orders.filter(o => o.status === statusFilter);
  if (productFilter) orders = orders.filter(o => o.product === productFilter);

  // Ordenar por data desc
  orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // Stats
  const all = data.orders;
  const statsEl = document.getElementById('order-stats');
  statsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-card__label">Total</div>
      <div class="stat-card__value">${all.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__label">Pendentes</div>
      <div class="stat-card__value" style="color:#fbbf24;">${all.filter(o=>o.status==='pending').length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__label">Em Produção</div>
      <div class="stat-card__value" style="color:#60a5fa;">${all.filter(o=>o.status==='production').length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__label">Concluídos</div>
      <div class="stat-card__value green">${all.filter(o=>o.status==='done').length}</div>
    </div>
  `;

  // Badge no menu
  const pending = all.filter(o => o.status === 'pending').length;
  const badge = document.getElementById('nav-orders-badge');
  badge.style.display = pending > 0 ? 'inline-flex' : 'none';
  badge.textContent = pending;

  const tbody = document.getElementById('orders-tbody');
  const empty = document.getElementById('orders-empty');

  if (orders.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = orders.map(o => {
    const s = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
    const dateStr = o.date ? new Date(o.date).toLocaleDateString('pt-PT') : '—';
    return `
      <tr>
        <td>
          <div style="font-weight:600;color:var(--text-primary);">${escapeHtml(o.client) || '—'}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(o.company)}</div>
        </td>
        <td>${escapeHtml(o.product) || '—'}</td>
        <td>${escapeHtml(o.qty) || '—'}</td>
        <td>${dateStr}</td>
        <td>
          <select class="status-select badge ${s.badge}" onchange="updateOrderStatus('${o.id}', this.value)">
            ${Object.entries(STATUS_LABELS).map(([k, v]) =>
              `<option value="${k}" ${k === o.status ? 'selected' : ''}>${v.label}</option>`
            ).join('')}
          </select>
        </td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(o.notes)}">
          ${o.notes ? escapeHtml(o.notes) : '<span style="color:var(--text-muted)">—</span>'}
        </td>
        <td style="display:flex;gap:0.4rem;justify-content:flex-end;">
          <button class="btn-secondary" onclick="editOrder('${o.id}')" style="padding:0.35rem 0.6rem;" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-danger" onclick="deleteOrder('${o.id}')" title="Apagar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateOrderStatus = function(id, status) {
  const data = getData();
  const o = data.orders.find(o => o.id === id);
  if (o) {
    o.status = status;
    saveData(data);
    renderOrders();
  }
};

window.editOrder = function(id) {
  const data = getData();
  const o = data.orders.find(o => o.id === id);
  if (!o) return;
  openOrderModal(o);
};

window.deleteOrder = function(id) {
  if (!confirm('Apagar esta encomenda?')) return;
  const data = getData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  renderOrders();
  showToast('Encomenda apagada.');
};

// Filtros
document.getElementById('filter-status').addEventListener('change', renderOrders);
document.getElementById('filter-product').addEventListener('change', renderOrders);

// Modal de Encomenda
const orderModal = document.getElementById('order-modal');
const orderForm  = document.getElementById('order-form');

function openOrderModal(order = null) {
  document.getElementById('order-modal-title').textContent = order ? 'Editar Encomenda' : 'Nova Encomenda';
  document.getElementById('order-id').value      = order ? order.id : '';
  document.getElementById('order-client').value  = order ? (order.client  || '') : '';
  document.getElementById('order-company').value = order ? (order.company || '') : '';
  document.getElementById('order-phone').value   = order ? (order.phone   || '') : '';
  document.getElementById('order-email').value   = order ? (order.email   || '') : '';
  document.getElementById('order-product').value = order ? (order.product || '') : '';
  document.getElementById('order-qty').value     = order ? (order.qty     || '') : '';
  document.getElementById('order-status').value  = order ? (order.status  || 'pending') : 'pending';
  document.getElementById('order-notes').value   = order ? (order.notes   || '') : '';

  // Hoje por defeito
  const todayVal = new Date().toISOString().slice(0, 10);
  document.getElementById('order-date').value = order ? (order.date ? order.date.slice(0,10) : todayVal) : todayVal;

  orderModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.getElementById('order-client').focus();
}

function closeOrderModal() {
  orderModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.getElementById('new-order-btn').addEventListener('click', () => openOrderModal());
document.getElementById('order-modal-close').addEventListener('click', closeOrderModal);
document.getElementById('order-cancel-btn').addEventListener('click', closeOrderModal);
document.querySelector('#order-modal .admin-modal__backdrop').addEventListener('click', closeOrderModal);

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = getData();
  const id = document.getElementById('order-id').value;

  const orderData = {
    id:      id || uid(),
    client:  document.getElementById('order-client').value.trim(),
    company: document.getElementById('order-company').value.trim(),
    phone:   document.getElementById('order-phone').value.trim(),
    email:   document.getElementById('order-email').value.trim(),
    product: document.getElementById('order-product').value,
    qty:     document.getElementById('order-qty').value.trim(),
    status:  document.getElementById('order-status').value,
    date:    document.getElementById('order-date').value,
    notes:   document.getElementById('order-notes').value.trim(),
    createdAt: id ? (data.orders.find(o=>o.id===id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
  };

  if (id) {
    const idx = data.orders.findIndex(o => o.id === id);
    if (idx >= 0) data.orders[idx] = orderData;
  } else {
    data.orders.unshift(orderData);
  }

  saveData(data);
  closeOrderModal();
  renderOrders();
  showToast(id ? 'Encomenda actualizada!' : 'Encomenda criada!');
});

// ==========================================================================
// MÓDULO D — HISTÓRICO DE PREÇOS
// ==========================================================================

let priceChart = null;
let activeChartMetal = 'sn';

function renderHistory() {
  const data = getData();
  const metals = data.metals;
  const history = data.priceHistory;

  // Botões de selecção de metal
  const controlsEl = document.getElementById('chart-controls');
  controlsEl.innerHTML = Object.entries(metals).map(([k, m]) => `
    <button class="chart-metal-btn ${k === activeChartMetal ? 'active' : ''}" onclick="setChartMetal('${k}')">
      ${m.symbol}
    </button>
  `).join('');

  // Tabela de histórico
  const tbody  = document.getElementById('history-tbody');
  const emptyEl = document.getElementById('history-empty');

  // Flatten all history entries
  const allEntries = [];
  for (const [key, entries] of Object.entries(history)) {
    entries.forEach((e, i) => {
      const prev = i > 0 ? entries[i-1].price : null;
      const diff = prev !== null ? e.price - prev : null;
      allEntries.push({ date: e.date, metal: metals[key], key, price: e.price, diff, margin: data.margin });
    });
  }
  allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allEntries.length === 0) {
    tbody.innerHTML = '';
    emptyEl.style.display = 'block';
  } else {
    emptyEl.style.display = 'none';
    tbody.innerHTML = allEntries.slice(0, 50).map(e => {
      const dateStr = new Date(e.date).toLocaleString('pt-PT');
      const sellSug = e.price * (1 + e.margin / 100);
      let diffStr = '—';
      if (e.diff !== null) {
        const sign = e.diff > 0 ? '+' : '';
        const color = e.diff > 0 ? 'var(--green-400)' : e.diff < 0 ? '#f87171' : 'var(--text-muted)';
        diffStr = `<span style="color:${color};font-weight:600;">${sign}${fmt(e.diff)} €/kg</span>`;
      }
      return `
        <tr>
          <td>${dateStr}</td>
          <td><span class="table-metal-symbol">${e.metal.symbol}</span> ${e.metal.name}</td>
          <td style="font-weight:600;color:var(--text-primary);">${fmtEur(e.price)}/kg</td>
          <td style="color:var(--green-400);">${fmtEur(sellSug)}/kg</td>
          <td>${diffStr}</td>
        </tr>
      `;
    }).join('');
  }

  // Gráfico
  renderChart(data);
}

window.setChartMetal = function(key) {
  activeChartMetal = key;
  // Update buttons
  document.querySelectorAll('.chart-metal-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === getData().metals[key]?.symbol);
  });
  renderChart(getData());
};

function renderChart(data) {
  const history = data.priceHistory[activeChartMetal] || [];
  const noHistoryEl = document.getElementById('no-history-msg');
  const canvas = document.getElementById('price-chart');

  if (history.length < 2) {
    noHistoryEl.style.display = 'flex';
    canvas.style.display = 'none';
    if (priceChart) { priceChart.destroy(); priceChart = null; }
    return;
  }

  noHistoryEl.style.display = 'none';
  canvas.style.display = 'block';

  const labels = history.map(e => new Date(e.date).toLocaleDateString('pt-PT'));
  const values = history.map(e => e.price);

  if (priceChart) priceChart.destroy();

  priceChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${data.metals[activeChartMetal]?.name} (€/kg)`,
        data: values,
        borderColor: '#22a648',
        backgroundColor: 'rgba(34,166,72,0.08)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#22a648',
        tension: 0.3,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${fmt(ctx.raw)} €/kg`
          },
          backgroundColor: '#1a1d27',
          borderColor: 'rgba(34,166,72,0.3)',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 11 } },
          grid:  { color: 'rgba(255,255,255,0.05)' },
        },
        y: {
          ticks: {
            color: '#64748b',
            font: { size: 11 },
            callback: val => fmt(val) + ' €'
          },
          grid:  { color: 'rgba(255,255,255,0.05)' },
        }
      }
    }
  });
}

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================

function initModules() {
  renderStock();
  renderRecipes();
  // Adicionar um componente por defeito na calculadora se estiver vazio
  if (calcComponents.length === 0) {
    addComponent('sn', 85);
    addComponent('cu', 6.5);
    addComponent('sb', 8.5);
  }
  renderOrders();
  renderNewsAdmin();
  renderCatalogAdmin();
  renderHeroAdmin();
  renderWhatsAppAdmin();
}


// ==========================================================================
// MÓDULO E — NOTÍCIAS & NOVIDADES
// ==========================================================================

let editingNewsId = null;

function getNews() {
  const d = loadData();
  return d.news || [];
}

function saveNews(news) {
  const d = loadData();
  d.news = news;
  saveData(d);
}

function fmtDatePT(dateStr) {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('pt-PT'); }
  catch { return dateStr; }
}

function renderNewsAdmin() {
  const news   = getNews();
  const tbody  = document.getElementById('news-tbody');
  const empty  = document.getElementById('news-empty');
  if (!tbody) return;

  if (!news.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  const sorted = [...news].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  tbody.innerHTML = sorted.map(n => `
    <tr>
      <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">${escapeHtml(n.title) || '(sem título)'}</td>
      <td>${fmtDatePT(n.date)}</td>
      <td>
        <span class="badge ${n.published ? 'badge--green' : 'badge--grey'}">
          ${n.published ? 'Publicado' : 'Rascunho'}
        </span>
      </td>
      <td>
        ${n.pinned ? '<span class="badge badge--pin">⭐ Destaque</span>' : '—'}
      </td>
      <td style="display:flex;gap:0.4rem;justify-content:flex-end;">
        <button class="btn-secondary" onclick="openNewsModal('${n.id}')" style="padding:0.35rem 0.6rem;" title="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-danger" onclick="deleteNews('${n.id}')" title="Eliminar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </td>
    </tr>`).join('');
}

function openNewsModal(id = null) {
  editingNewsId = id;
  const news = getNews();
  const modal = document.getElementById('news-modal');
  const titleEl = document.getElementById('news-modal-title');

  if (id) {
    const item = news.find(n => n.id === id);
    if (!item) return;
    titleEl.textContent = 'Editar Notícia';
    document.getElementById('news-id').value       = item.id;
    document.getElementById('news-title').value    = item.title || '';
    document.getElementById('news-date').value     = item.date || '';
    document.getElementById('news-summary').value  = item.summary || '';
    document.getElementById('news-content').value  = item.content || '';
    document.getElementById('news-published').checked = !!item.published;
    document.getElementById('news-pinned').checked    = !!item.pinned;
  } else {
    titleEl.textContent = 'Nova Notícia';
    document.getElementById('news-id').value       = '';
    document.getElementById('news-title').value    = '';
    document.getElementById('news-date').value     = new Date().toISOString().slice(0, 10);
    document.getElementById('news-summary').value  = '';
    document.getElementById('news-content').value  = '';
    document.getElementById('news-published').checked = true;
    document.getElementById('news-pinned').checked    = false;
  }
  modal.classList.add('is-open');
}

function closeNewsModal() {
  document.getElementById('news-modal').classList.remove('is-open');
  editingNewsId = null;
}

function saveNewsItem() {
  const title = document.getElementById('news-title').value.trim();
  if (!title) { alert('O título é obrigatório.'); return; }

  const news = getNews();
  const id = editingNewsId || uid();
  const item = {
    id,
    title,
    date:      document.getElementById('news-date').value || new Date().toISOString().slice(0, 10),
    summary:   document.getElementById('news-summary').value.trim(),
    content:   document.getElementById('news-content').value.trim(),
    published: document.getElementById('news-published').checked,
    pinned:    document.getElementById('news-pinned').checked,
  };

  if (editingNewsId) {
    const idx = news.findIndex(n => n.id === editingNewsId);
    if (idx > -1) news[idx] = item;
  } else {
    news.push(item);
  }

  saveNews(news);
  closeNewsModal();
  renderNewsAdmin();
  showToast('Notícia guardada!');
}

function deleteNews(id) {
  if (!confirm('Eliminar esta notícia?')) return;
  const news = getNews().filter(n => n.id !== id);
  saveNews(news);
  renderNewsAdmin();
  showToast('Notícia eliminada.');
}

// Wire up news modal buttons
document.getElementById('new-news-btn')?.addEventListener('click', () => openNewsModal(null));
document.getElementById('news-modal-close')?.addEventListener('click', closeNewsModal);
document.getElementById('news-modal-cancel')?.addEventListener('click', closeNewsModal);
document.getElementById('news-modal-save')?.addEventListener('click', saveNewsItem);
document.getElementById('news-modal')?.querySelector('.admin-modal__backdrop')?.addEventListener('click', closeNewsModal);


// ==========================================================================
// MÓDULO F — CATÁLOGO (Metais + Produtos)
// ==========================================================================

// Default data imported from main.js context is not available here.
// We store custom metals/products under jgf_admin_data.customMetals / customProducts.
// If empty, we fall back to showing a note.

const CATALOG_DEFAULT_METALS = [
  { id: 'estanho',   name: 'Lingotes de Estanho', symbol: 'Sn', teaser: 'Metal nobre e versátil, com baixo ponto de fusão (232°C), maleável e resistente à oxidação.', stockStatus: 'Em Stock', image: 'images/metals/lingotes-estanho.jpg', enabled: true },
  { id: 'chumbo',    name: 'Lingotes de Chumbo',  symbol: 'Pb', teaser: 'Material macio e maleável, altamente resistente à corrosão, com baixo ponto de fusão (~330°C).', stockStatus: 'Em Stock', image: 'images/metals/lingotes-chumbo.jpg', enabled: true },
  { id: 'antimonio', name: 'Antimônio',            symbol: 'Sb', teaser: 'Usado em ligas metálicas com chumbo e estanho, aumentando dureza e resistência.', stockStatus: 'Em Stock', image: 'images/metals/antimonio.jpg', enabled: true },
  { id: 'cobre',     name: 'Cobre',                symbol: 'Cu', teaser: 'Um dos metais mais importantes a nível industrial, excelente condutor de electricidade e calor.', stockStatus: 'Em Stock', image: 'images/metals/cobre.jpg', enabled: true },
  { id: 'bismuto',   name: 'Bismuto',              symbol: 'Bi', teaser: 'Elemento pesado, cristalino e de coloração rosácea. O mais diamagnético de todos os metais.', stockStatus: 'Em Stock', image: 'images/metals/bismuto.jpg', enabled: true },
  { id: 'niquel',    name: 'Níquel',               symbol: 'Ni', teaser: 'Essencial em aço inoxidável, galvanização, baterias e electrónica.', stockStatus: 'Em Stock', image: 'images/metals/niquel.jpg', enabled: true },
];

const CATALOG_DEFAULT_PRODUCTS = [
  { id: 'soldas',      name: 'Soldas de Estanho',    label: 'Produto Principal', teaser: 'Soldas Sn/Pb em várias composições — sempre em stock.', image: 'images/products/solda-em-barra--normal-e-fina.jpg', enabled: true },
  { id: 'anodos',      name: 'Ânodos de Estanho',    label: 'Galvanização',      teaser: 'Ânodos de estanho de alta pureza (Sn 99,9%) para galvanização.', image: 'images/products/anodos-de-estanho.jpg', enabled: true },
  { id: 'antifriction',name: 'Metal Anti-Fricção',   label: 'Ligas Especiais',   teaser: 'Ligas Sn+Cu+Sb em stock.', image: null, enabled: true },
  { id: 'ligas',       name: 'Ligas por Encomenda',  label: 'Prod. Personalizada', teaser: 'Fundição de ligas personalizadas conforme especificações do cliente.', image: null, enabled: true },
];

function getCatalogData() {
  const d = loadData();
  return {
    metals:   (d.customMetals   && d.customMetals.length   > 0) ? d.customMetals   : JSON.parse(JSON.stringify(CATALOG_DEFAULT_METALS)),
    products: (d.customProducts && d.customProducts.length > 0) ? d.customProducts : JSON.parse(JSON.stringify(CATALOG_DEFAULT_PRODUCTS)),
  };
}

function saveCatalogData(metals, products) {
  const d = loadData();
  d.customMetals   = metals;
  d.customProducts = products;
  saveData(d);
}

function renderCatalogAdmin() {
  const { metals, products } = getCatalogData();
  renderMetalsCatalog(metals);
  renderProductsCatalog(products);
}

function renderMetalsCatalog(metals) {
  const tbody = document.getElementById('metals-catalog-tbody');
  if (!tbody) return;
  tbody.innerHTML = metals.map(m => `
    <tr>
      <td style="font-weight:600;">${escapeHtml(m.name)}${m.symbol ? ` <span class="badge badge--green" style="font-size:0.7rem;">${escapeHtml(m.symbol)}</span>` : ''}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted);font-size:0.82rem;">${escapeHtml(m.teaser)}</td>
      <td><span class="badge ${stockStatusBadgeClass(m.stockStatus)}">${m.stockStatus || 'Em Stock'}</span></td>
      <td>
        <label class="form-toggle-label" style="cursor:pointer;">
          <input type="checkbox" ${m.enabled !== false ? 'checked' : ''} onchange="toggleMetalEnabled('${m.id}', this.checked)" />
          <span>${m.enabled !== false ? 'Sim' : 'Não'}</span>
        </label>
      </td>
      <td style="display:flex;gap:0.4rem;justify-content:flex-end;">
        <button class="btn-secondary" onclick="openMetalModal('${m.id}')" style="padding:0.35rem 0.6rem;" title="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-danger" onclick="deleteMetal('${m.id}')" title="Eliminar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </td>
    </tr>`).join('');
}

function renderProductsCatalog(products) {
  const tbody = document.getElementById('products-catalog-tbody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td style="font-weight:600;">${escapeHtml(p.name)}</td>
      <td><span class="badge badge--grey" style="font-size:0.72rem;">${escapeHtml(p.label)}</span></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted);font-size:0.82rem;">${escapeHtml(p.teaser)}</td>
      <td>
        <label class="form-toggle-label" style="cursor:pointer;">
          <input type="checkbox" ${p.enabled !== false ? 'checked' : ''} onchange="toggleProductEnabled('${p.id}', this.checked)" />
          <span>${p.enabled !== false ? 'Sim' : 'Não'}</span>
        </label>
      </td>
      <td style="display:flex;gap:0.4rem;justify-content:flex-end;">
        <button class="btn-secondary" onclick="openProductModal('${p.id}')" style="padding:0.35rem 0.6rem;" title="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-danger" onclick="deleteProduct('${p.id}')" title="Eliminar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </td>
    </tr>`).join('');
}

// ── Catalog Tabs ────────────────────────────────────────────────
document.querySelectorAll('.catalog-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.catalog-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = `tab-${tab.dataset.tab}`;
    document.getElementById(panelId)?.classList.add('active');
  });
});

// ── Metal CRUD ──────────────────────────────────────────────────
let editingMetalId = null;

function openMetalModal(id = null) {
  editingMetalId = id;
  const { metals } = getCatalogData();
  const modal = document.getElementById('metal-modal');
  const titleEl = document.getElementById('metal-modal-title');

  if (id) {
    const m = metals.find(x => x.id === id);
    if (!m) return;
    titleEl.textContent = 'Editar Metal';
    document.getElementById('metal-id').value          = m.id;
    document.getElementById('metal-name').value        = m.name || '';
    document.getElementById('metal-symbol').value      = m.symbol || '';
    document.getElementById('metal-teaser').value      = m.teaser || '';
    document.getElementById('metal-description').value = m.description || '';
    document.getElementById('metal-stock').value       = m.stockStatus || 'Em Stock';
    document.getElementById('metal-image').value       = m.image || '';
    document.getElementById('metal-enabled').checked   = m.enabled !== false;
  } else {
    titleEl.textContent = 'Adicionar Metal';
    document.getElementById('metal-id').value          = '';
    document.getElementById('metal-name').value        = '';
    document.getElementById('metal-symbol').value      = '';
    document.getElementById('metal-teaser').value      = '';
    document.getElementById('metal-description').value = '';
    document.getElementById('metal-stock').value       = 'Em Stock';
    document.getElementById('metal-image').value       = '';
    document.getElementById('metal-enabled').checked   = true;
  }
  modal.classList.add('is-open');
}

function closeMetalModal() {
  document.getElementById('metal-modal').classList.remove('is-open');
  editingMetalId = null;
}

function saveMetalItem() {
  const name = document.getElementById('metal-name').value.trim();
  if (!name) { alert('O nome é obrigatório.'); return; }
  const { metals, products } = getCatalogData();
  const id = editingMetalId || document.getElementById('metal-symbol').value.toLowerCase().replace(/\s+/g, '-') || uid();
  const item = {
    id,
    name,
    symbol:      document.getElementById('metal-symbol').value.trim(),
    teaser:      document.getElementById('metal-teaser').value.trim(),
    description: document.getElementById('metal-description').value.trim(),
    stockStatus: document.getElementById('metal-stock').value,
    image:       document.getElementById('metal-image').value.trim() || null,
    enabled:     document.getElementById('metal-enabled').checked,
    cssModifier: `metal--${id}`,
    ctaSubject:  `Pedido de Cotação — Matéria-Prima (${name})`,
  };
  if (editingMetalId) {
    const idx = metals.findIndex(m => m.id === editingMetalId);
    if (idx > -1) metals[idx] = item;
  } else {
    metals.push(item);
  }
  saveCatalogData(metals, products);
  closeMetalModal();
  renderCatalogAdmin();
  showToast('Metal guardado!');
}

function deleteMetal(id) {
  if (!confirm('Eliminar este metal?')) return;
  const { metals, products } = getCatalogData();
  saveCatalogData(metals.filter(m => m.id !== id), products);
  renderCatalogAdmin();
  showToast('Metal eliminado.');
}

function toggleMetalEnabled(id, enabled) {
  const { metals, products } = getCatalogData();
  const idx = metals.findIndex(m => m.id === id);
  if (idx > -1) metals[idx].enabled = enabled;
  saveCatalogData(metals, products);
  renderCatalogAdmin();
}

document.getElementById('new-metal-btn')?.addEventListener('click', () => openMetalModal(null));
document.getElementById('metal-modal-close')?.addEventListener('click', closeMetalModal);
document.getElementById('metal-modal-cancel')?.addEventListener('click', closeMetalModal);
document.getElementById('metal-modal-save')?.addEventListener('click', saveMetalItem);
document.getElementById('metal-modal')?.querySelector('.admin-modal__backdrop')?.addEventListener('click', closeMetalModal);

// ── Product CRUD ────────────────────────────────────────────────
let editingProductId = null;

function openProductModal(id = null) {
  editingProductId = id;
  const { products } = getCatalogData();
  const modal = document.getElementById('product-modal');
  const titleEl = document.getElementById('product-modal-title');

  if (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    titleEl.textContent = 'Editar Produto';
    document.getElementById('product-id').value          = p.id;
    document.getElementById('product-name').value        = p.name || '';
    document.getElementById('product-label').value       = p.label || '';
    document.getElementById('product-teaser').value      = p.teaser || '';
    document.getElementById('product-description').value = p.description || '';
    document.getElementById('product-image').value       = p.image || '';
    document.getElementById('product-enabled').checked   = p.enabled !== false;
  } else {
    titleEl.textContent = 'Adicionar Produto';
    ['product-id','product-name','product-label','product-teaser','product-description','product-image'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('product-enabled').checked = true;
  }
  modal.classList.add('is-open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('is-open');
  editingProductId = null;
}

function saveProductItem() {
  const name = document.getElementById('product-name').value.trim();
  if (!name) { alert('O nome é obrigatório.'); return; }
  const { metals, products } = getCatalogData();
  const id = editingProductId || uid();
  const item = {
    id,
    name,
    label:       document.getElementById('product-label').value.trim(),
    teaser:      document.getElementById('product-teaser').value.trim(),
    description: document.getElementById('product-description').value.trim(),
    image:       document.getElementById('product-image').value.trim() || null,
    enabled:     document.getElementById('product-enabled').checked,
    cssModifier: `product--${id}`,
    ctaSubject:  `Pedido de Cotação — ${name}`,
  };
  if (editingProductId) {
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx > -1) products[idx] = item;
  } else {
    products.push(item);
  }
  saveCatalogData(metals, products);
  closeProductModal();
  renderCatalogAdmin();
  showToast('Produto guardado!');
}

function deleteProduct(id) {
  if (!confirm('Eliminar este produto?')) return;
  const { metals, products } = getCatalogData();
  saveCatalogData(metals, products.filter(p => p.id !== id));
  renderCatalogAdmin();
  showToast('Produto eliminado.');
}

function toggleProductEnabled(id, enabled) {
  const { metals, products } = getCatalogData();
  const idx = products.findIndex(p => p.id === id);
  if (idx > -1) products[idx].enabled = enabled;
  saveCatalogData(metals, products);
  renderCatalogAdmin();
}

document.getElementById('new-product-btn')?.addEventListener('click', () => openProductModal(null));
document.getElementById('product-modal-close')?.addEventListener('click', closeProductModal);
document.getElementById('product-modal-cancel')?.addEventListener('click', closeProductModal);
document.getElementById('product-modal-save')?.addEventListener('click', saveProductItem);
document.getElementById('product-modal')?.querySelector('.admin-modal__backdrop')?.addEventListener('click', closeProductModal);


// ==========================================================================
// MÓDULO G — BANNER PRINCIPAL (HERO)
// ==========================================================================

function getHeroConfig() {
  const d = loadData();
  return d.heroConfig || { type: 'green', images: [] };
}

function saveHeroConfigData(type, images) {
  const d = loadData();
  d.heroConfig = { type, images };
  saveData(d);
}

function renderHeroAdmin() {
  const config = getHeroConfig();
  
  // Set mode radio
  const modeGreenRadio  = document.getElementById('hero-mode-green');
  const modeSliderRadio = document.getElementById('hero-mode-slider');
  if (config.type === 'slider') {
    if (modeSliderRadio) modeSliderRadio.checked = true;
  } else {
    if (modeGreenRadio) modeGreenRadio.checked = true;
  }

  // Populate URL inputs
  const images = config.images || [];
  for (let i = 0; i < 5; i++) {
    const input = document.getElementById(`hero-url-${i}`);
    if (input) {
      input.value = images[i] || '';
    }
  }

  updateHeroPreviews();
  updateHeroCardVisibility();
}

function updateHeroCardVisibility() {
  const imagesCard = document.getElementById('hero-images-card');
  const isSlider = document.getElementById('hero-mode-slider')?.checked;
  if (imagesCard) {
    imagesCard.style.display = isSlider ? 'block' : 'none';
  }
}

function updateHeroPreviews() {
  let count = 0;
  for (let i = 0; i < 5; i++) {
    const input   = document.getElementById(`hero-url-${i}`);
    const preview = document.getElementById(`hero-prev-${i}`);
    if (!input || !preview) continue;

    const val = input.value.trim();
    if (val) {
      count++;
      preview.innerHTML = `<img src="${val}" alt="Foto ${i+1}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.parentElement.innerHTML='<span style=\\'font-size:0.55rem;color:#ef4444;\\'>Inválida</span>';" />`;
    } else {
      preview.innerHTML = `<span style="font-size:0.65rem;color:var(--text-muted);">Preview</span>`;
    }
  }

  const countBadge = document.getElementById('hero-images-count');
  if (countBadge) {
    countBadge.textContent = `${count} / 5 imagens`;
    countBadge.className = `badge ${count > 0 ? 'badge--green' : 'badge--grey'}`;
  }
}

// Add input event listeners to URL fields for live preview updates
for (let i = 0; i < 5; i++) {
  document.getElementById(`hero-url-${i}`)?.addEventListener('input', updateHeroPreviews);
}

// Event listeners for mode selector
document.getElementById('hero-mode-green')?.addEventListener('change', updateHeroCardVisibility);
document.getElementById('hero-mode-slider')?.addEventListener('change', updateHeroCardVisibility);

// Save hero settings button
document.getElementById('save-hero-btn')?.addEventListener('click', () => {
  const isSlider = document.getElementById('hero-mode-slider')?.checked;
  const mode = isSlider ? 'slider' : 'green';

  const imagesList = [];
  for (let i = 0; i < 5; i++) {
    const val = document.getElementById(`hero-url-${i}`)?.value.trim();
    if (val) imagesList.push(val);
  }

  if (mode === 'slider' && imagesList.length === 0) {
    alert('Por favor, introduza pelo menos 1 URL de imagem para ativar o modo Carrossel de Imagens.');
    return;
  }

  saveHeroConfigData(mode, imagesList);
  showToast('Configuração do Banner guardada!');
});


// ==========================================================================
// MÓDULO H — WHATSAPP FLUTUANTE
// ==========================================================================

const WHATSAPP_DEFAULT = {
  enabled: true,
  phone: '351912572969',
  message: 'Olá! Gostaria de obter mais informações sobre os vossos produtos e cotações.'
};

function getWhatsAppConfig() {
  const d = loadData();
  return d.whatsappConfig || WHATSAPP_DEFAULT;
}

function saveWhatsAppConfigData(config) {
  const d = loadData();
  d.whatsappConfig = config;
  saveData(d);
}

function renderWhatsAppAdmin() {
  const config = getWhatsAppConfig();
  const toggle = document.getElementById('whatsapp-enabled-toggle');
  const phone  = document.getElementById('whatsapp-phone-input');
  const msg    = document.getElementById('whatsapp-message-input');

  if (toggle) toggle.checked = config.enabled !== false;
  if (phone)  phone.value  = config.phone || '351912572969';
  if (msg)    msg.value    = config.message || 'Olá! Gostaria de obter mais informações sobre os vossos produtos e cotações.';

  updateWhatsAppPreview();
}

function updateWhatsAppPreview() {
  const rawPhone = document.getElementById('whatsapp-phone-input')?.value || '';
  const phoneVal = rawPhone.replace(/\D/g, '');
  const msgVal   = document.getElementById('whatsapp-message-input')?.value || '';
  const preview  = document.getElementById('whatsapp-link-preview');

  if (preview) {
    if (phoneVal) {
      preview.textContent = `https://wa.me/${phoneVal}?text=${encodeURIComponent(msgVal)}`;
    } else {
      preview.textContent = 'https://wa.me/...';
    }
  }
}

document.getElementById('whatsapp-phone-input')?.addEventListener('input', updateWhatsAppPreview);
document.getElementById('whatsapp-message-input')?.addEventListener('input', updateWhatsAppPreview);

document.getElementById('save-whatsapp-btn')?.addEventListener('click', () => {
  const enabled = document.getElementById('whatsapp-enabled-toggle')?.checked;
  const rawPhone = document.getElementById('whatsapp-phone-input')?.value || '';
  const phone   = rawPhone.replace(/\D/g, '');
  const message = (document.getElementById('whatsapp-message-input')?.value || '').trim();

  if (enabled && !phone) {
    alert('Por favor, introduza um número de telefone válido.');
    return;
  }

  saveWhatsAppConfigData({ enabled, phone, message });
  showToast('Configuração do WhatsApp guardada!');
});

// ==========================================================================
// INICIALIZAÇÃO — no fim do ficheiro, para que todas as constantes/funções
// dos módulos (catálogo, hero, whatsapp, etc.) já estejam definidas quando
// checkSession() dispara initModules() para uma sessão já autenticada.
// ==========================================================================
checkSession();



