/**
 * João Guerra & Filhos, Lda. — main.js v2.1
 * Renderização dinâmica de metais, produtos e notícias a partir do localStorage.
 * Navbar scroll, hamburger menu, animações, modals, formulário de contacto.
 */

'use strict';

// ══════════════════════════════════════════════════════════════
//  DEFAULT SITE DATA (usado se não houver dados do admin)
// ══════════════════════════════════════════════════════════════

const DEFAULT_METALS = [
  {
    id: 'estanho', name: 'Lingotes de Estanho', symbol: 'Sn', cssModifier: 'metal--sn',
    teaser: 'Metal nobre e versátil, com baixo ponto de fusão (232°C), maleável e resistente à oxidação.',
    description: 'O Estanho é um metal nobre conhecido e utilizado há milhares de anos, muito versátil, com baixo ponto de fusão (232°C), maleável e resistente à oxidação. Liga facilmente com outros metais como por exemplo o Cobre, dando origem ao Bronze. É amplamente utilizado na indústria electrónica (soldas), na produção de folha de flandres para embalagens, e como componente principal em diversas ligas metálicas.',
    image: 'images/metals/lingotes-estanho.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'232 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'50'},{label:'Forma',value:'Lingote'}],
    tags: ['Em Stock','Lingote','Alta Pureza'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Estanho)', enabled: true,
  },
  {
    id: 'chumbo', name: 'Lingotes de Chumbo', symbol: 'Pb', cssModifier: 'metal--pb',
    teaser: 'Material macio e maleável, altamente resistente à corrosão, com baixo ponto de fusão (~330°C).',
    description: 'O Chumbo (símbolo químico Pb) é um minério que se pode encontrar em muitas regiões do globo, associado a outros metais formando a galenite. É um material muito macio e maleável, altamente resistente à corrosão, e tem baixo ponto de fusão (cerca de 330°C). É usado na produção de baterias de chumbo-ácido, como componente em ligas de soldagem, na indústria de radiologia e em revestimentos de proteção contra radiação.',
    image: 'images/metals/lingotes-chumbo.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'~330 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'82'},{label:'Forma',value:'Lingote'}],
    tags: ['Em Stock','Lingote','Resistente à Corrosão'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Chumbo)', enabled: true,
  },
  {
    id: 'antimonio', name: 'Antimônio', symbol: 'Sb', cssModifier: 'metal--sb',
    teaser: 'Usado em ligas metálicas com chumbo e estanho, aumentando dureza e resistência. Cada vez mais procurado na electrónica.',
    description: 'O Antimônio na sua forma metálica é muito utilizado na produção de ligas metálicas, juntamente com o chumbo e o estanho, aumentando significativamente a sua dureza e resistência — como é o caso do Metal Anti-Fricção e de diversas soldas. Devido às suas propriedades semicondutoras, é também cada vez mais procurado para aplicação em componentes electrónicos, retardadores de chama e células solares de nova geração.',
    image: 'images/metals/antimonio.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'630 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'51'},{label:'Forma',value:'Lingote'}],
    tags: ['Em Stock','Endurecedor de Ligas','Electrónica'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Antimônio)', enabled: true,
  },
  {
    id: 'cobre', name: 'Cobre', symbol: 'Cu', cssModifier: 'metal--cu',
    teaser: 'Um dos metais mais importantes a nível industrial, excelente condutor de electricidade e calor.',
    description: 'O Cobre é um dos metais mais importantes a nível industrial, de cor avermelhada, maleável e excelente condutor de electricidade e de calor. É amplamente usado em cabos eléctricos, condutores, motores, geradores e transformadores. Como componente de ligas, origina o bronze (com estanho) e o latão (com zinco). Também é essencial nos sectores de construção, electrónica e energias renováveis.',
    image: 'images/metals/cobre.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'1085 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'29'},{label:'Cor',value:'Avermelhada'}],
    tags: ['Em Stock','Condutor Eléctrico','Ligas (Bronze/Latão)'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Cobre)', enabled: true,
  },
  {
    id: 'bismuto', name: 'Bismuto', symbol: 'Bi', cssModifier: 'metal--bi',
    teaser: 'Elemento pesado, cristalino e de coloração rosácea. O mais diamagnético de todos os metais.',
    description: 'O Bismuto é um elemento pesado, cristalino, de coloração rosácea, e é o mais diamagnético de todos os metais. Ligas metálicas com bismuto são utilizadas em soldas livres de chumbo (alternativa ecológica ao chumbo), termopares e dispositivos de detecção de fogo (sprinklers). Os compostos de bismuto têm aplicações em cosméticos (sombras, esmaltes) e em procedimentos médicos (gastroenterologia).',
    image: 'images/metals/bismuto.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'271 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'83'},{label:'Propriedade',value:'Diamagnético'}],
    tags: ['Em Stock','Soldas Sem Chumbo','Aplicações Médicas'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Bismuto)', enabled: true,
  },
  {
    id: 'niquel', name: 'Níquel', symbol: 'Ni', cssModifier: 'metal--ni',
    teaser: 'Essencial em aço inoxidável, galvanização, baterias e electrónica. Presente em inúmeras indústrias.',
    description: 'O Níquel é utilizado em diversas ligas como o aço inoxidável (conferindo resistência à corrosão), em processos de galvanização, fundições, catalisadores industriais, baterias recarregáveis e eléctrodos. Está presente em equipamentos de transporte, electrónica de consumo, produtos químicos, equipamentos médico-hospitalares, aeroespaciais e bens de consumo duráveis. É um metal estratégico na transição energética (baterias de veículos eléctricos).',
    image: 'images/metals/niquel.jpg', stockStatus: 'Em Stock',
    specs: [{label:'Ponto de Fusão',value:'1455 °C'},{label:'Disponibilidade',value:'Em Stock'},{label:'N.º Atómico',value:'28'},{label:'Forma',value:'Lingote / Pellet'}],
    tags: ['Em Stock','Aço Inoxidável','Galvanização'], ctaSubject: 'Pedido de Cotação — Matéria-Prima (Níquel)', enabled: true,
  },
];

const ICON_GEAR = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.36.07-.73.07-1.08s-.03-.73-.07-1.08l2.24-1.75c.2-.16.25-.44.12-.67l-2.12-3.68c-.12-.22-.39-.3-.61-.22l-2.65 1.07c-.56-.43-1.16-.78-1.82-1.05l-.4-2.83c-.04-.24-.24-.42-.5-.42H9.31c-.26 0-.46.18-.5.42l-.4 2.83c-.66.27-1.26.62-1.82 1.05L3.94 6.55c-.22-.08-.49 0-.61.22L1.21 10.45c-.13.23-.07.51.12.67l2.24 1.75c-.04.35-.07.73-.07 1.08s.03.73.07 1.08l-2.24 1.75c-.2.16-.25.44-.12.67l2.12 3.68c.12.22.39.3.61.22l2.65-1.07c.56.43 1.16.78 1.82 1.05l.4 2.83c.04.24.24.42.5.42h4.24c.26 0 .46-.18.5-.42l.4-2.83c.66-.27 1.26-.62 1.82-1.05l2.65 1.07c.22.08.49 0 .61-.22l2.12-3.68c.12-.22.07-.51-.12-.67l-2.24-1.75z"/></svg>';
const ICON_LEAF = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 018 20c4 0 4-2 8-2s4 2 8 2v-2c-4 0-4-2-8-2-1.17 0-2.04.19-2.83.42C14.17 11.86 16.06 8.96 17 8z"/></svg>';

const DEFAULT_PRODUCTS = [
  {
    id: 'soldas', name: 'Soldas de Estanho', label: 'Produto Principal', cssModifier: 'product--soldas', badge: 'Sn/Pb',
    teaser: 'Soldas Sn/Pb em várias composições — sempre em stock. Disponíveis em fio, barra ou lingote.',
    description: 'Soldas de Estanho com Chumbo, sempre em stock, nas seguintes composições: <strong>20%, 33%, 35%, 40%, 50%, 60%, 63%, 67%, 70% e 80% Sn</strong>. Disponíveis em várias apresentações: fio, barra, lingote ou formatos especiais por encomenda. A solda 60/40 e a 63/37 são as mais usadas em electrónica; as de menor teor de estanho são preferidas na canalizaria e chaparia.',
    image: 'images/products/solda-em-barra--normal-e-fina.jpg',
    specs: [{label:'Tipo',value:'Com Chumbo'},{label:'Disponibilidade',value:'Em Stock'},{label:'Apresentações',value:'Fio, Barra, Lingote'},{label:'Por Encomenda',value:'Sim'}],
    tags: ['Com Chumbo','Em Stock','Fio & Barra','Por Encomenda'], ctaSubject: 'Pedido de Cotação — Soldas de Estanho', enabled: true,
  },
  {
    id: 'anodos', name: 'Ânodos de Estanho', label: 'Galvanização', cssModifier: 'product--anodos', badge: 'Sn',
    teaser: 'Ânodos de estanho de alta pureza (Sn 99,9%) para processos de galvanização, produzidos por encomenda.',
    description: 'Ânodos de Estanho — ideais para o processo de galvanização electrolítica, revestindo outros metais para melhorar a aparência ou proteger da corrosão. Produzimos ânodos nas geometrias e pureza exigidas pelo processo de cada cliente. A elevada pureza (Sn 99,9%) garante um depósito electrolítico uniforme, brilhante e sem impurezas, essencial na indústria electrónica e de embalagem.',
    image: 'images/products/anodos-de-estanho.jpg',
    specs: [{label:'Pureza',value:'Sn 99,9%'},{label:'Aplicação',value:'Galvanização'},{label:'Disponibilidade',value:'Por Encomenda'},{label:'Geometria',value:'Personalizada'}],
    tags: ['Pureza Sn 99,9%','Galvanização','Por Encomenda','Geometria Personalizada'], ctaSubject: 'Pedido de Cotação — Ânodos de Estanho', enabled: true,
  },
  {
    id: 'antifriction', name: 'Metal Anti-Fricção', label: 'Ligas Especiais', cssModifier: 'product--antifriction', badge: 'Sn+Cu+Sb',
    teaser: 'Ligas Sn+Cu+Sb em stock (85/6,5/8,5 e 90/3/7). Outras composições por encomenda.',
    description: 'O Metal Anti-Fricção (também conhecido como metal branco ou Babbitt) é uma liga de estanho, cobre e antimônio usada em mancais de deslizamento, chumaceiras e outras superfícies sujeitas a atrito. A sua excelente capacidade de suportar cargas e reduzir o desgaste torna-o indispensável na indústria pesada, maquinaria industrial e aplicações ferroviárias.',
    image: null, iconSvg: ICON_GEAR,
    specs: [{label:'Liga 1 (stock)',value:'85% Sn · 6,5% Cu · 8,5% Sb'},{label:'Liga 2 (stock)',value:'90% Sn · 3% Cu · 7% Sb'},{label:'Disponibilidade',value:'Em Stock'},{label:'Outras composições',value:'Por Encomenda'}],
    tags: ['Sn+Cu+Sb','Em Stock','Por Encomenda','Mancais / Chumaceiras'], ctaSubject: 'Pedido de Cotação — Metal Anti-Fricção', enabled: true,
  },
  {
    id: 'ligas', name: 'Ligas por Encomenda', label: 'Produção Personalizada', cssModifier: 'product--ligas', badge: 'Custom',
    teaser: 'Fundição de ligas personalizadas conforme especificações técnicas do cliente — estanho, chumbo e mais.',
    description: 'Além dos produtos em stock, produzimos ligas de metais não ferrosos conforme as especificações técnicas e composições definidas pelo cliente. Dispomos de capacidade técnica para desenvolver e fundir ligas personalizadas: estanho laminado em barrinha e em placa, chumbo laminado em barrinha e em placa, e outras ligas conforme especificação do cliente. Contacte-nos com os requisitos técnicos e fornecemos uma proposta adequada.',
    image: null, iconSvg: ICON_LEAF,
    specs: [{label:'Sn Laminado',value:'Barrinha / Placa'},{label:'Pb Laminado',value:'Barrinha / Placa'},{label:'Ligas Especiais',value:'Conforme spec.'},{label:'Modo',value:'Por Encomenda'}],
    tags: ['Sn Laminado','Pb Laminado','Ligas Especiais','Especificação Cliente'], ctaSubject: 'Pedido de Cotação — Ligas por Encomenda', enabled: true,
  },
];


// ══════════════════════════════════════════════════════════════
//  DATA LOADING — lê do localStorage (admin panel)
// ══════════════════════════════════════════════════════════════

function getSiteData() {
  try {
    const raw  = localStorage.getItem('jgf_admin_data');
    const data = raw ? JSON.parse(raw) : {};
    return {
      metals:   (data.customMetals   && data.customMetals.length   > 0) ? data.customMetals   : DEFAULT_METALS,
      products: (data.customProducts && data.customProducts.length > 0) ? data.customProducts : DEFAULT_PRODUCTS,
      news: (data.news || [])
        .filter(n => n.published)
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return  1;
          return new Date(b.date || 0) - new Date(a.date || 0);
        }),
      heroConfig: data.heroConfig || { type: 'green', images: [] },
      whatsappConfig: data.whatsappConfig || {
        enabled: true,
        phone: '351912572969',
        message: 'Olá! Gostaria de obter mais informações sobre os vossos produtos e cotações.'
      },
    };
  } catch {
    return {
      metals: DEFAULT_METALS,
      products: DEFAULT_PRODUCTS,
      news: [],
      heroConfig: { type: 'green', images: [] },
      whatsappConfig: {
        enabled: true,
        phone: '351912572969',
        message: 'Olá! Gostaria de obter mais informações sobre os vossos produtos e cotações.'
      }
    };
  }
}


// ══════════════════════════════════════════════════════════════
//  SVG helpers reutilizáveis
// ══════════════════════════════════════════════════════════════

const SVG_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
const SVG_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .98h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
const SVG_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const SVG_PIN   = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>`;


// ══════════════════════════════════════════════════════════════
//  SEGURANÇA — escapar/sanitizar conteúdo vindo do admin antes de
//  o inserir no HTML da página pública (evita XSS armazenado caso
//  o painel de administração seja acedido por alguém não autorizado).
// ══════════════════════════════════════════════════════════════

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Permite apenas formatação básica (negrito, itálico, parágrafos, links) —
// usado nos campos de texto "rico" (descrições, notícias). Baseia-se num
// <template>, que o browser nunca executa (scripts/onerror ficam inertes),
// e depois remove tudo o que não estiver na lista de tags/atributos permitidos.
const SANITIZE_ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'P', 'UL', 'OL', 'LI', 'A', 'SPAN']);
const SANITIZE_ALLOWED_ATTRS = { A: ['href', 'target', 'rel'] };

function sanitizeHtml(html) {
  if (!html) return '';
  const template = document.createElement('template');
  template.innerHTML = String(html);

  const clean = (node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 1) { // Element
        if (!SANITIZE_ALLOWED_TAGS.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent));
          return;
        }
        const allowed = SANITIZE_ALLOWED_ATTRS[child.tagName] || [];
        [...child.attributes].forEach(attr => {
          const name = attr.name.toLowerCase();
          if (!allowed.includes(name) || (name === 'href' && /^\s*javascript:/i.test(attr.value))) {
            child.removeAttribute(attr.name);
          }
        });
        clean(child);
      } else if (child.nodeType !== 3) { // não é elemento nem texto (comentários, etc.)
        child.remove();
      }
    });
  };
  clean(template.content);
  return template.innerHTML;
}

// ══════════════════════════════════════════════════════════════
//  RENDER HELPERS
// ══════════════════════════════════════════════════════════════

function stockStatusDotClass(status) {
  if (status === 'Em Stock') return 'stock-dot--green';
  if (status === 'Por Encomenda') return 'stock-dot--yellow';
  return 'stock-dot--red'; // Indisponível / Esgotado (legado)
}

function specsHtml(specs) {
  return (specs || []).map(s =>
    `<div class="modal-box__spec"><div class="modal-box__spec-label">${escapeHtml(s.label)}</div><div class="modal-box__spec-value">${escapeHtml(s.value)}</div></div>`
  ).join('');
}

function tagsHtml(tags) {
  return (tags || []).map(tag => `<span class="product-tag">${escapeHtml(tag)}</span>`).join('');
}

function makeModal(id, imageHtml, title, badge, specs, desc, tags, ctaSubject, extraClass = '') {
  const container = document.getElementById('modals-container');
  if (!container) return;
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'modal-overlay';
  el.id = id;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', `${id}-title`);
  el.innerHTML = `
    <div class="modal-overlay__backdrop"></div>
    <div class="modal-box ${extraClass}">
      <div class="modal-box__image">${imageHtml}</div>
      <div class="modal-box__body">
        <button class="modal-box__close" aria-label="${t('modal.close')}">${SVG_CLOSE}</button>
        <div class="modal-box__header">
          <h3 class="modal-box__title" id="${id}-title">${escapeHtml(title)}</h3>
          ${badge ? `<span class="modal-box__badge">${escapeHtml(badge)}</span>` : ''}
        </div>
        ${specs ? `<div class="modal-box__specs">${specs}</div>` : ''}
        <p class="modal-box__desc">${sanitizeHtml(desc)}</p>
        ${tags ? `<div class="modal-box__tags">${tags}</div>` : ''}
        <a href="#contactos" class="modal-box__cta" data-subject="${escapeHtml(ctaSubject)}">
          ${SVG_PHONE} ${t('modal.cta')}
        </a>
      </div>
    </div>`;
  container.appendChild(el);
}


// ══════════════════════════════════════════════════════════════
//  RENDER: MATÉRIA-PRIMA (metals)
// ══════════════════════════════════════════════════════════════

function renderMetals(metals) {
  const grid = document.getElementById('materia-grid');
  if (!grid) return;
  const enabled = metals.filter(m => m.enabled !== false).map(localizeMetal);

  grid.innerHTML = enabled.map((m, i) => {
    const delay   = (i % 3) + 1;
    const modalId = `modal-metal-${m.id}`;
    const imgHtml = m.image
      ? `<img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.name)}" loading="lazy" />`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--green-100);font-family:var(--font-display);font-size:2.5rem;font-weight:900;color:var(--green-700);">${escapeHtml(m.symbol || '?')}</div>`;
    return `
      <article class="metal-card ${m.cssModifier || ''} reveal delay-${delay}" id="metal-${m.id}">
        <div class="metal-card__image">${imgHtml}</div>
        <div class="metal-card__body">
          <h3 class="metal-card__name">${escapeHtml(m.name)}${m.symbol ? `<span class="metal-card__name-badge">${escapeHtml(m.symbol)}</span>` : ''}</h3>
          <p class="metal-card__teaser">${escapeHtml(m.teaser)}</p>
        </div>
        <div class="metal-card__footer">
          <span class="metal-card__footer-stock ${stockStatusDotClass(m.stockStatus)}">${translateStockStatus(m.stockStatus)}</span>
          <button class="detail-btn" data-modal="${modalId}">${t('btn.details')} ${SVG_ARROW}</button>
        </div>
      </article>`;
  }).join('');

  // Criar modais
  enabled.forEach(m => {
    const imgHtml = m.image
      ? `<img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.name)}" />`
      : `<div class="modal-box__image-placeholder"><div style="font-family:var(--font-display);font-size:3rem;font-weight:900;color:var(--green-500);">${escapeHtml(m.symbol)}</div><span class="modal-box__image-placeholder-label">${escapeHtml(m.name)}</span></div>`;
    makeModal(`modal-metal-${m.id}`, imgHtml, m.name, m.symbol, specsHtml(m.specs), m.description, tagsHtml(m.tags), m.ctaSubject);
  });
}


// ══════════════════════════════════════════════════════════════
//  RENDER: PRODUTOS
// ══════════════════════════════════════════════════════════════

function renderProducts(products) {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;
  const enabled = products.filter(p => p.enabled !== false).map(localizeProduct);

  grid.innerHTML = enabled.map((p, i) => {
    const delay   = (i % 4) + 1;
    const modalId = `modal-product-${p.id}`;
    let headerHtml;
    if (p.image) {
      headerHtml = `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />`;
    } else {
      headerHtml = `<div class="product-card__header-placeholder" aria-hidden="true">
        <div class="product-card__icon">${p.iconSvg || ''}</div>
        <div class="product-card__header-title">${escapeHtml(p.name)}</div>
      </div>`;
    }
    return `
      <article class="product-card ${p.cssModifier || ''} reveal delay-${delay}" id="produto-${p.id}">
        <div class="product-card__header">${headerHtml}</div>
        <div class="product-card__body">
          <div class="product-card__label">${escapeHtml(p.label)}</div>
          <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
          <p class="product-card__teaser">${escapeHtml(p.teaser)}</p>
          <button class="detail-btn" data-modal="${modalId}">${t('btn.details')} ${SVG_ARROW}</button>
        </div>
      </article>`;
  }).join('');

  enabled.forEach(p => {
    let imgHtml;
    if (p.image) {
      imgHtml = `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />`;
    } else {
      imgHtml = `<div class="modal-box__image-placeholder"><div class="product-card__icon" style="transform:scale(1.6)">${p.iconSvg || ''}</div><span class="modal-box__image-placeholder-label">${escapeHtml(p.name)}</span></div>`;
    }
    makeModal(`modal-product-${p.id}`, imgHtml, p.name, p.badge, specsHtml(p.specs), p.description, tagsHtml(p.tags), p.ctaSubject);
  });
}


// ══════════════════════════════════════════════════════════════
//  RENDER: NOTÍCIAS
// ══════════════════════════════════════════════════════════════

const DATE_LOCALES = { pt: 'pt-PT', es: 'es-ES', en: 'en-GB' };

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const locale = DATE_LOCALES[getCurrentLang()] || 'pt-PT';
  try { return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return dateStr; }
}

function renderNews(news) {
  const section = document.getElementById('noticias');
  const grid    = document.getElementById('news-grid');
  if (!section || !grid) return;

  if (!news || news.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  grid.innerHTML = news.map((n, i) => {
    const delay   = (i % 3) + 1;
    const modalId = `modal-news-${n.id}`;
    const accentOrImg = n.image
      ? `<div class="news-card__image"><img src="${escapeHtml(n.image)}" alt="${escapeHtml(n.title)}" loading="lazy" /></div>`
      : `<div class="news-card__accent"></div>`;
    return `
      <article class="news-card reveal delay-${delay}">
        ${accentOrImg}
        <div class="news-card__body">
          <div class="news-card__meta">
            ${n.pinned ? `<span class="news-card__pinned">${SVG_PIN} ${t('news.pinned')}</span>` : ''}
            <span class="news-card__date">${fmtDate(n.date)}</span>
          </div>
          <h3 class="news-card__title">${escapeHtml(n.title)}</h3>
          <p class="news-card__summary">${escapeHtml(n.summary)}</p>
          <div class="news-card__footer">
            <button class="news-read-btn" data-modal="${modalId}">${t('news.readmore')} ${SVG_ARROW}</button>
          </div>
        </div>
      </article>`;
  }).join('');

  // Criar modais das notícias
  const container = document.getElementById('modals-container');
  if (!container) return;
  container.querySelectorAll('[id^="modal-news-"]').forEach(el => el.remove());

  news.forEach(n => {
    const modalId = `modal-news-${n.id}`;
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = modalId;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', `${modalId}-title`);
    el.innerHTML = `
      <div class="modal-overlay__backdrop"></div>
      <div class="modal-box modal-box--news">
        ${n.image ? `<div class="modal-box__image"><img src="${escapeHtml(n.image)}" alt="${escapeHtml(n.title)}" /></div>` : ''}
        <div class="modal-box__body" style="grid-column:1/-1">
          <button class="modal-box__close" aria-label="${t('modal.close')}">${SVG_CLOSE}</button>
          <div class="news-modal-date">${fmtDate(n.date)}</div>
          <h3 class="modal-box__title" id="${modalId}-title" style="margin-bottom:1rem">${escapeHtml(n.title)}</h3>
          <div class="news-modal-content">${sanitizeHtml((n.content || n.summary || '').replace(/\n/g, '<br>'))}</div>
        </div>
      </div>`;
    container.appendChild(el);
  });
}


// ══════════════════════════════════════════════════════════════
//  RENDER: HERO BANNER (SLIDER vs GREEN)
// ══════════════════════════════════════════════════════════════

let heroSliderTimer = null;
let currentSlideIndex = 0;

function renderHeroBanner(heroConfig) {
  const sliderContainer = document.getElementById('hero-slider');
  const slidesWrapper    = document.getElementById('hero-slides');
  const dotsWrapper      = document.getElementById('hero-dots');
  const prevBtn          = document.getElementById('hero-prev');
  const nextBtn          = document.getElementById('hero-next');
  const defaultBg        = document.getElementById('hero-default-bg');
  const defaultGrid      = document.getElementById('hero-default-grid');
  const circles          = document.querySelectorAll('.hero__circle');

  if (!sliderContainer || !slidesWrapper) return;

  const isSliderMode = heroConfig && heroConfig.type === 'slider' && heroConfig.images && heroConfig.images.length > 0;

  if (!isSliderMode) {
    sliderContainer.style.display = 'none';
    if (defaultBg) defaultBg.style.display = '';
    if (defaultGrid) defaultGrid.style.display = '';
    circles.forEach(c => c.style.display = '');
    if (heroSliderTimer) clearInterval(heroSliderTimer);
    return;
  }

  // Active slider mode
  if (defaultBg) defaultBg.style.display = 'none';
  if (defaultGrid) defaultGrid.style.display = 'none';
  circles.forEach(c => c.style.display = 'none');
  sliderContainer.style.display = 'block';

  const images = heroConfig.images;
  currentSlideIndex = 0;

  // Render slides
  slidesWrapper.innerHTML = images.map((imgUrl, i) => `
    <div class="hero__slide ${i === 0 ? 'active' : ''}" style="background-image: url('${escapeHtml(imgUrl)}');"></div>
  `).join('');

  // Render dots if > 1 image
  if (images.length > 1) {
    if (dotsWrapper) {
      dotsWrapper.style.display = 'flex';
      dotsWrapper.innerHTML = images.map((_, i) => `
        <button class="hero__dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir para imagem ${i + 1}"></button>
      `).join('');
    }
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  } else {
    if (dotsWrapper) dotsWrapper.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  function goToSlide(index) {
    const slides = slidesWrapper.querySelectorAll('.hero__slide');
    const dots   = dotsWrapper ? dotsWrapper.querySelectorAll('.hero__dot') : [];

    if (!slides.length) return;
    currentSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((s, idx) => s.classList.toggle('active', idx === currentSlideIndex));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === currentSlideIndex));
  }

  function startAutoPlay() {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
    if (images.length > 1) {
      heroSliderTimer = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, 5000);
    }
  }

  // Event listeners for prev/next
  if (prevBtn) {
    prevBtn.onclick = () => {
      goToSlide(currentSlideIndex - 1);
      startAutoPlay();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = () => {
      goToSlide(currentSlideIndex + 1);
      startAutoPlay();
    };
  }

  // Event listeners for dots
  if (dotsWrapper) {
    dotsWrapper.onclick = (e) => {
      const dot = e.target.closest('.hero__dot');
      if (dot && dot.dataset.index !== undefined) {
        goToSlide(parseInt(dot.dataset.index, 10));
        startAutoPlay();
      }
    };
  }

  startAutoPlay();
}


// ══════════════════════════════════════════════════════════════
//  RENDER: WHATSAPP FLOATING BUTTON
// ══════════════════════════════════════════════════════════════

function renderWhatsAppButton(whatsappConfig) {
  const btn = document.getElementById('whatsapp-float-btn');
  if (!btn) return;

  const isEnabled = whatsappConfig && whatsappConfig.enabled !== false;
  const phone     = whatsappConfig && whatsappConfig.phone ? whatsappConfig.phone.replace(/\D/g, '') : '351912572969';
  const message   = whatsappConfig && whatsappConfig.message ? whatsappConfig.message : 'Olá! Gostaria de obter mais informações sobre os vossos produtos e cotações.';

  if (!isEnabled || !phone) {
    btn.style.display = 'none';
    return;
  }

  const encodedMsg = encodeURIComponent(message);
  const waUrl      = `https://wa.me/${phone}?text=${encodedMsg}`;

  btn.setAttribute('href', waUrl);
  btn.style.display = 'flex';
}


// ══════════════════════════════════════════════════════════════
//  INIT: Renderizar todo o conteúdo dinâmico do site
// ══════════════════════════════════════════════════════════════

function renderDynamicSiteContent() {
  const { metals, products, news, heroConfig, whatsappConfig } = getSiteData();
  renderHeroBanner(heroConfig);
  renderWhatsAppButton(whatsappConfig);
  renderMetals(metals);
  renderProducts(products);
  renderNews(news);
}

renderDynamicSiteContent();


// ══════════════════════════════════════════════════════════════
//  DOM References
// ══════════════════════════════════════════════════════════════

const navbar       = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav    = document.getElementById('mobile-nav');
const backToTop    = document.getElementById('back-to-top');
const footerYear   = document.getElementById('footer-year');

// Footer year
if (footerYear) footerYear.textContent = new Date().getFullYear();


// ── Navbar: scroll effect ────────────────────────────────────

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


// ── Navbar: active link on scroll ───────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link:not(.navbar__cta)');

function updateActiveLink() {
  let currentSection = '';
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) currentSection = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


// ── Hamburger menu ───────────────────────────────────────────

if (hamburgerBtn && mobileNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('menu-open');
    });
  });
}


// ── Smooth scroll ────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // O CTA dos modais ("Solicitar Cotação") já tem o seu próprio scroll
    // tratado pelo delegation handler abaixo (que também fecha o modal e
    // pré-seleciona o assunto) — evita dois scrolls a competir entre si.
    if (this.classList.contains('modal-box__cta')) return;
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 76;
    const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});


// ── Back-to-top ──────────────────────────────────────────────

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


// ── Scroll Reveal (IntersectionObserver) ─────────────────────

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  // Observar elementos já no DOM
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // MutationObserver para observar elementos injetados pelo JS (cards dinâmicos)
  const mutObs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.classList.contains('reveal')) observer.observe(node);
          node.querySelectorAll && node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }
      });
    });
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}


// ── Contact Form ──────────────────────────────────────────────

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykrlopp';
const contactForm  = document.getElementById('contact-form');
const fieldSubject = document.getElementById('field-subject');
const submitBtn    = document.getElementById('form-submit-btn');
const formSuccess  = document.getElementById('form-success');
const formAlertErr = document.getElementById('form-alert-error');

if (contactForm && submitBtn) {
  const requiredFields = contactForm.querySelectorAll('[required]');

  function validateForm() {
    let ok = true;
    requiredFields.forEach(field => {
      const group   = field.closest('.form-group');
      const invalid = !field.value.trim();
      if (group) group.classList.toggle('has-error', invalid);
      if (invalid) ok = false;
    });
    return ok;
  }

  requiredFields.forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formAlertErr && formAlertErr.classList.remove('visible');
    if (!validateForm()) return;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Demo mode (enquanto FORMSPREE não está configurado)
    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      await new Promise(r => setTimeout(r, 1500));
      submitBtn.classList.remove('loading');
      contactForm.style.display = 'none';
      formSuccess && formSuccess.classList.add('visible');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccess && formSuccess.classList.add('visible');
      } else {
        formAlertErr && formAlertErr.classList.add('visible');
      }
    } catch {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      formAlertErr && formAlertErr.classList.add('visible');
    }
  });
}


// ══════════════════════════════════════════════════════════════
//  MODAIS — event delegation (funciona com conteúdo dinâmico)
// ══════════════════════════════════════════════════════════════

let currentModal = null;

function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  currentModal = overlay;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const closeBtn = overlay.querySelector('.modal-box__close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  currentModal = null;
}

// Fechar com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal(currentModal);
});

// Click delegation no body inteiro
document.body.addEventListener('click', e => {
  // Abrir modal via [data-modal] (ignora cliques dentro do painel admin)
  const triggerBtn = e.target.closest('[data-modal]');
  if (triggerBtn && !triggerBtn.closest('.admin-modal, .admin-layout')) {
    openModal(triggerBtn.dataset.modal);
    return;
  }

  // Fechar via botão X
  const closeBtn = e.target.closest('.modal-box__close');
  if (closeBtn) {
    closeModal(closeBtn.closest('.modal-overlay'));
    return;
  }

  // Fechar via backdrop
  const backdrop = e.target.closest('.modal-overlay__backdrop');
  if (backdrop) {
    closeModal(backdrop.closest('.modal-overlay'));
    return;
  }

  // CTA "Solicitar Cotação": fechar modal + scroll para contactos + pré-selecionar assunto
  const cta = e.target.closest('.modal-box__cta');
  if (cta) {
    e.preventDefault();
    const subject = cta.getAttribute('data-subject');
    const overlay = cta.closest('.modal-overlay');
    closeModal(overlay);

    if (subject && fieldSubject) {
      const match = Array.from(fieldSubject.options).find(o =>
        o.value === subject || o.value.includes((subject.split('—')[1] || '').trim())
      );
      if (match) fieldSubject.value = match.value;
      else {
        const fb = Array.from(fieldSubject.options).find(o => o.value.startsWith('Pedido'));
        if (fb) fieldSubject.value = fb.value;
      }
    }

    const contactsSection = document.getElementById('contactos');
    if (contactsSection) {
      const navH = navbar ? navbar.offsetHeight : 76;
      window.scrollTo({
        top: contactsSection.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    }
  }
});
