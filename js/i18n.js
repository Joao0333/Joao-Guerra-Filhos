/**
 * João Guerra & Filhos, Lda. — i18n.js
 * Tradutor do site (PT / ES / EN).
 * - Textos estáticos: I18N[lang][key], aplicados a elementos com data-i18n / data-i18n-html / data-i18n-placeholder
 * - Conteúdo dinâmico (metais/produtos por defeito): METALS_I18N / PRODUCTS_I18N
 * - Conteúdo adicionado pelo admin (customMetals/customProducts/notícias) não é traduzido automaticamente
 *   — fica sempre no idioma em que foi escrito.
 */

'use strict';

const LANG_STORAGE_KEY = 'jgf_lang';
const DEFAULT_LANG = 'pt';
const SUPPORTED_LANGS = ['pt', 'es', 'en'];
const LANG_LABELS = { pt: 'PT', es: 'ES', en: 'EN' };

function getCurrentLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;
}

function setCurrentLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

// ══════════════════════════════════════════════════════════════
//  TEXTOS ESTÁTICOS DA INTERFACE
// ══════════════════════════════════════════════════════════════

const I18N = {

  pt: {
    'nav.home': 'Início', 'nav.company': 'Empresa', 'nav.rawmaterial': 'Matéria-Prima',
    'nav.products': 'Produtos', 'nav.contact': 'Contactos',

    'hero.badge': 'Fundada em 2006 · Nelas, Viseu',
    'hero.title': 'Metais <span class="hero__title-green">Não&nbsp;Ferrosos</span><br />de Qualidade',
    'hero.description': 'Mais de <strong>40 anos de experiência</strong> no sector, na continuidade de um legado familiar de excelência na importação, comercialização e fundição de metais não ferrosos.',
    'hero.cta.contact': 'Contacte-nos',
    'hero.cta.products': 'Ver Produtos',
    'hero.stat1.label': 'Anos de<br/>Experiência',
    'hero.stat2.label': 'Metais<br/>em Stock',
    'hero.stat3.label': 'Mercado<br/>Industrial',
    'hero.scroll': 'Scroll',

    'news.label': 'Novidades',
    'news.title': 'Notícias &amp; Novidades',
    'news.pinned': 'Destaque',
    'news.readmore': 'Ler mais',

    'empresa.label': 'A Nossa Empresa',
    'empresa.title': 'Uma história de<br/>confiança e qualidade',
    'empresa.p1': 'A <strong>João Guerra &amp; Filhos, Lda.</strong>, fundada em 2006, vem na continuidade de um negócio em nome individual do seu Sócio Gerente - António João Diniz Guerra - que conta já com mais de 40 anos de experiência no sector.',
    'empresa.p2': 'A &ldquo;João Guerra &amp; Filhos, Lda.&rdquo; é uma empresa de Nelas, Viseu, cujo principal objecto de negócio é a importação e comercialização de metais não ferrosos como estanho, chumbo e antimónio. Assim como a fundição de metais não ferrosos como são exemplo as várias ligas que temos à sua disposição no separador &ldquo;produtos&rdquo; e outras que podem ser feitas por encomenda.',
    'empresa.cta': 'Fale Connosco',
    'empresa.icon2': 'Comércio B2B',
    'empresa.icon3': 'Certificado de qualidade',
    'empresa.highlight1.label': 'Anos de Experiência',
    'empresa.highlight2.label': 'Metais em Stock',
    'empresa.highlight3.label': 'Linhas de Produto',
    'empresa.highlight4.label': 'Especialistas em Estanho',

    'materia.label': 'O Que Comercializamos',
    'materia.title': 'Matéria-Prima',
    'materia.subtitle': 'Importamos e comercializamos metais não ferrosos de elevada pureza, disponíveis em stock para entrega imediata ou por encomenda.',

    'produtos.label': 'O Que Produzimos',
    'produtos.title': 'Os Nossos Produtos',
    'produtos.subtitle': 'Além da comercialização de matéria-prima, produzimos soldas, ligas e ânodos de estanho, com stock disponível e capacidade para encomendas por medida.',

    'contactos.label': 'Fale Connosco',
    'contactos.title': 'Contactos',
    'contactos.subtitle': 'Estamos disponíveis para responder a todas as suas questões e pedidos de cotação.',
    'contact.address.label': 'Morada',
    'contact.phone.label': 'Telefone',
    'contact.phone.suffix1': '(fixo)',
    'contact.phone.suffix2': '(telemóvel)',
    'contact.email.label': 'Email',
    'contact.hours.label': 'Horário',
    'contact.hours.value': 'Segunda a Sexta: 09h &ndash; 18h<br/>Sábado e Domingo: Encerrado',
    'contact.litigio': '<strong>Resolução de Litígios de Consumo:</strong> Em caso de litígio o consumidor pode recorrer a uma entidade de resolução alternativa de litígios de consumo: CNIACC &ndash; Centro Nacional de Informação e Arbitragem de Conflitos de Consumo. Para mais informações consultar: <a href="http://www.arbitragemdeconsumo.org/" target="_blank" rel="noopener noreferrer">www.arbitragemdeconsumo.org</a>',

    'form.title': 'Envie-nos uma mensagem',
    'form.subtitle': 'Preencha o formulário e entraremos em contacto consigo. Para pedidos de cotação, inclua os detalhes do produto e quantidade.',
    'form.alertError': 'Ocorreu um erro ao enviar a mensagem. Por favor tente novamente ou contacte-nos por email.',
    'form.name.label': 'Nome', 'form.name.placeholder': 'O seu nome', 'form.name.error': 'Por favor indique o seu nome.',
    'form.email.label': 'Email', 'form.email.placeholder': 'email@empresa.com', 'form.email.error': 'Por favor indique um email válido.',
    'form.company.label': 'Empresa', 'form.company.placeholder': 'Nome da empresa',
    'form.phone.label': 'Telefone', 'form.phone.placeholder': '+351 000 000 000',
    'form.subject.label': 'Assunto', 'form.subject.placeholder': 'Seleccione um assunto…',
    'form.subject.opt1': 'Pedido de Cotação — Matéria-Prima',
    'form.subject.opt2': 'Pedido de Cotação — Soldas de Estanho',
    'form.subject.opt3': 'Pedido de Cotação — Ânodos de Estanho',
    'form.subject.opt4': 'Pedido de Cotação — Metal Anti-Fricção',
    'form.subject.opt5': 'Pedido de Cotação — Ligas por Encomenda',
    'form.subject.opt6': 'Informação Geral',
    'form.subject.opt7': 'Outro Assunto',
    'form.subject.error': 'Por favor seleccione um assunto.',
    'form.message.label': 'Mensagem', 'form.message.placeholder': 'Descreva o seu pedido, produto e quantidade desejada…', 'form.message.error': 'Por favor escreva a sua mensagem.',
    'form.submit': 'Enviar Mensagem',
    'form.success.title': 'Mensagem Enviada!',
    'form.success.text': 'Obrigado pelo contacto. Responderemos o mais brevemente possível, normalmente no próximo dia útil.',

    'footer.tagline': 'Mais de 40 anos de experiência no comércio e fundição de metais não ferrosos. Qualidade, fiabilidade e rigor técnico ao serviço da indústria.',
    'footer.nav.title': 'Navegação',
    'footer.contact.title': 'Contactos',
    'footer.bottom.rights': 'Todos os direitos reservados.',
    'footer.bottom.tagline': 'Comércio de Metais Não Ferrosos · Est. 2006',

    'whatsapp.tooltip': 'Fale connosco no WhatsApp',

    'modal.cta': 'Solicitar Cotação',
    'btn.details': 'Ver Detalhes',
    'modal.close': 'Fechar',
  },

  es: {
    'nav.home': 'Inicio', 'nav.company': 'Empresa', 'nav.rawmaterial': 'Materia Prima',
    'nav.products': 'Productos', 'nav.contact': 'Contacto',

    'hero.badge': 'Fundada en 2006 · Nelas, Viseu',
    'hero.title': 'Metales <span class="hero__title-green">No&nbsp;Ferrosos</span><br />de Calidad',
    'hero.description': 'Más de <strong>40 años de experiencia</strong> en el sector, dando continuidad a un legado familiar de excelencia en la importación, comercialización y fundición de metales no ferrosos.',
    'hero.cta.contact': 'Contáctenos',
    'hero.cta.products': 'Ver Productos',
    'hero.stat1.label': 'Años de<br/>Experiencia',
    'hero.stat2.label': 'Metales<br/>en Stock',
    'hero.stat3.label': 'Mercado<br/>Industrial',
    'hero.scroll': 'Scroll',

    'news.label': 'Novedades',
    'news.title': 'Noticias y Novedades',
    'news.pinned': 'Destacado',
    'news.readmore': 'Leer más',

    'empresa.label': 'Nuestra Empresa',
    'empresa.title': 'Una historia de<br/>confianza y calidad',
    'empresa.p1': '<strong>João Guerra &amp; Filhos, Lda.</strong>, fundada en 2006, da continuidad a un negocio en nombre individual de su Socio Gerente - António João Diniz Guerra - que cuenta ya con más de 40 años de experiencia en el sector.',
    'empresa.p2': '&ldquo;João Guerra &amp; Filhos, Lda.&rdquo; es una empresa de Nelas, Viseu, cuyo principal objeto de negocio es la importación y comercialización de metales no ferrosos como estaño, plomo y antimonio. Así como la fundición de metales no ferrosos, de lo que son ejemplo las diversas aleaciones que tenemos a su disposición en la pestaña &ldquo;productos&rdquo; y otras que pueden hacerse por encargo.',
    'empresa.cta': 'Hable con Nosotros',
    'empresa.icon2': 'Comercio B2B',
    'empresa.icon3': 'Certificado de calidad',
    'empresa.highlight1.label': 'Años de Experiencia',
    'empresa.highlight2.label': 'Metales en Stock',
    'empresa.highlight3.label': 'Líneas de Producto',
    'empresa.highlight4.label': 'Especialistas en Estaño',

    'materia.label': 'Lo Que Comercializamos',
    'materia.title': 'Materia Prima',
    'materia.subtitle': 'Importamos y comercializamos metales no ferrosos de alta pureza, disponibles en stock para entrega inmediata o bajo pedido.',

    'produtos.label': 'Lo Que Producimos',
    'produtos.title': 'Nuestros Productos',
    'produtos.subtitle': 'Además de la comercialización de materia prima, producimos soldaduras, aleaciones y ánodos de estaño, con stock disponible y capacidad para pedidos a medida.',

    'contactos.label': 'Hable con Nosotros',
    'contactos.title': 'Contacto',
    'contactos.subtitle': 'Estamos disponibles para responder a todas sus preguntas y solicitudes de cotización.',
    'contact.address.label': 'Dirección',
    'contact.phone.label': 'Teléfono',
    'contact.phone.suffix1': '(fijo)',
    'contact.phone.suffix2': '(móvil)',
    'contact.email.label': 'Email',
    'contact.hours.label': 'Horario',
    'contact.hours.value': 'Lunes a Viernes: 09h &ndash; 18h<br/>Sábado y Domingo: Cerrado',
    'contact.litigio': '<strong>Resolución de Litigios de Consumo:</strong> En caso de litigio, el consumidor puede recurrir a una entidad de resolución alternativa de litigios de consumo: CNIACC &ndash; Centro Nacional de Información y Arbitraje de Conflictos de Consumo. Para más información consulte: <a href="http://www.arbitragemdeconsumo.org/" target="_blank" rel="noopener noreferrer">www.arbitragemdeconsumo.org</a>',

    'form.title': 'Envíenos un mensaje',
    'form.subtitle': 'Complete el formulario y nos pondremos en contacto con usted. Para solicitudes de cotización, incluya los detalles del producto y la cantidad.',
    'form.alertError': 'Se produjo un error al enviar el mensaje. Por favor, inténtelo de nuevo o contáctenos por email.',
    'form.name.label': 'Nombre', 'form.name.placeholder': 'Su nombre', 'form.name.error': 'Por favor indique su nombre.',
    'form.email.label': 'Email', 'form.email.placeholder': 'email@empresa.com', 'form.email.error': 'Por favor indique un email válido.',
    'form.company.label': 'Empresa', 'form.company.placeholder': 'Nombre de la empresa',
    'form.phone.label': 'Teléfono', 'form.phone.placeholder': '+351 000 000 000',
    'form.subject.label': 'Asunto', 'form.subject.placeholder': 'Seleccione un asunto…',
    'form.subject.opt1': 'Solicitud de Cotización — Materia Prima',
    'form.subject.opt2': 'Solicitud de Cotización — Soldaduras de Estaño',
    'form.subject.opt3': 'Solicitud de Cotización — Ánodos de Estaño',
    'form.subject.opt4': 'Solicitud de Cotización — Metal Antifricción',
    'form.subject.opt5': 'Solicitud de Cotización — Aleaciones a Medida',
    'form.subject.opt6': 'Información General',
    'form.subject.opt7': 'Otro Asunto',
    'form.subject.error': 'Por favor seleccione un asunto.',
    'form.message.label': 'Mensaje', 'form.message.placeholder': 'Describa su solicitud, producto y cantidad deseada…', 'form.message.error': 'Por favor escriba su mensaje.',
    'form.submit': 'Enviar Mensaje',
    'form.success.title': '¡Mensaje Enviado!',
    'form.success.text': 'Gracias por contactarnos. Responderemos lo antes posible, normalmente al siguiente día hábil.',

    'footer.tagline': 'Más de 40 años de experiencia en el comercio y la fundición de metales no ferrosos. Calidad, fiabilidad y rigor técnico al servicio de la industria.',
    'footer.nav.title': 'Navegación',
    'footer.contact.title': 'Contacto',
    'footer.bottom.rights': 'Todos los derechos reservados.',
    'footer.bottom.tagline': 'Comercio de Metales No Ferrosos · Est. 2006',

    'whatsapp.tooltip': 'Hable con nosotros por WhatsApp',

    'modal.cta': 'Solicitar Cotización',
    'btn.details': 'Ver Detalles',
    'modal.close': 'Cerrar',
  },

  en: {
    'nav.home': 'Home', 'nav.company': 'Company', 'nav.rawmaterial': 'Raw Materials',
    'nav.products': 'Products', 'nav.contact': 'Contact',

    'hero.badge': 'Founded in 2006 · Nelas, Viseu',
    'hero.title': 'Quality <span class="hero__title-green">Non-Ferrous</span><br />Metals',
    'hero.description': 'Over <strong>40 years of experience</strong> in the sector, continuing a family legacy of excellence in the import, trading and smelting of non-ferrous metals.',
    'hero.cta.contact': 'Contact Us',
    'hero.cta.products': 'View Products',
    'hero.stat1.label': 'Years of<br/>Experience',
    'hero.stat2.label': 'Metals<br/>in Stock',
    'hero.stat3.label': 'Industrial<br/>Market',
    'hero.scroll': 'Scroll',

    'news.label': 'News',
    'news.title': 'News &amp; Updates',
    'news.pinned': 'Featured',
    'news.readmore': 'Read more',

    'empresa.label': 'Our Company',
    'empresa.title': 'A history of<br/>trust and quality',
    'empresa.p1': '<strong>João Guerra &amp; Filhos, Lda.</strong>, founded in 2006, continues the sole-trader business of its Managing Partner - António João Diniz Guerra - who already has over 40 years of experience in the sector.',
    'empresa.p2': '&ldquo;João Guerra &amp; Filhos, Lda.&rdquo; is a company based in Nelas, Viseu, whose main business is the import and trading of non-ferrous metals such as tin, lead and antimony, as well as the smelting of non-ferrous metals — such as the various alloys available in the &ldquo;products&rdquo; tab, and others that can be made to order.',
    'empresa.cta': 'Talk to Us',
    'empresa.icon2': 'B2B Trade',
    'empresa.icon3': 'Quality certified',
    'empresa.highlight1.label': 'Years of Experience',
    'empresa.highlight2.label': 'Metals in Stock',
    'empresa.highlight3.label': 'Product Lines',
    'empresa.highlight4.label': 'Tin Specialists',

    'materia.label': 'What We Trade',
    'materia.title': 'Raw Materials',
    'materia.subtitle': 'We import and trade high-purity non-ferrous metals, available in stock for immediate delivery or made to order.',

    'produtos.label': 'What We Produce',
    'produtos.title': 'Our Products',
    'produtos.subtitle': 'Besides trading raw materials, we produce tin solders, alloys and anodes, with stock available and capacity for custom orders.',

    'contactos.label': 'Talk to Us',
    'contactos.title': 'Contact',
    'contactos.subtitle': 'We are available to answer all your questions and quote requests.',
    'contact.address.label': 'Address',
    'contact.phone.label': 'Phone',
    'contact.phone.suffix1': '(landline)',
    'contact.phone.suffix2': '(mobile)',
    'contact.email.label': 'Email',
    'contact.hours.label': 'Business Hours',
    'contact.hours.value': 'Monday to Friday: 9am &ndash; 6pm<br/>Saturday and Sunday: Closed',
    'contact.litigio': '<strong>Consumer Dispute Resolution:</strong> In the event of a dispute, the consumer may resort to an alternative consumer dispute resolution entity: CNIACC &ndash; National Centre for Information and Arbitration of Consumer Conflicts. For more information visit: <a href="http://www.arbitragemdeconsumo.org/" target="_blank" rel="noopener noreferrer">www.arbitragemdeconsumo.org</a>',

    'form.title': 'Send us a message',
    'form.subtitle': 'Fill in the form and we will get in touch with you. For quote requests, please include the product details and quantity.',
    'form.alertError': 'An error occurred while sending the message. Please try again or contact us by email.',
    'form.name.label': 'Name', 'form.name.placeholder': 'Your name', 'form.name.error': 'Please provide your name.',
    'form.email.label': 'Email', 'form.email.placeholder': 'email@company.com', 'form.email.error': 'Please provide a valid email.',
    'form.company.label': 'Company', 'form.company.placeholder': 'Company name',
    'form.phone.label': 'Phone', 'form.phone.placeholder': '+351 000 000 000',
    'form.subject.label': 'Subject', 'form.subject.placeholder': 'Select a subject…',
    'form.subject.opt1': 'Quote Request — Raw Materials',
    'form.subject.opt2': 'Quote Request — Tin Solders',
    'form.subject.opt3': 'Quote Request — Tin Anodes',
    'form.subject.opt4': 'Quote Request — Anti-Friction Metal',
    'form.subject.opt5': 'Quote Request — Custom Alloys',
    'form.subject.opt6': 'General Information',
    'form.subject.opt7': 'Other Subject',
    'form.subject.error': 'Please select a subject.',
    'form.message.label': 'Message', 'form.message.placeholder': 'Describe your request, product and desired quantity…', 'form.message.error': 'Please write your message.',
    'form.submit': 'Send Message',
    'form.success.title': 'Message Sent!',
    'form.success.text': 'Thank you for reaching out. We will reply as soon as possible, usually the next business day.',

    'footer.tagline': 'Over 40 years of experience in the trading and smelting of non-ferrous metals. Quality, reliability and technical rigour at the service of industry.',
    'footer.nav.title': 'Navigation',
    'footer.contact.title': 'Contact',
    'footer.bottom.rights': 'All rights reserved.',
    'footer.bottom.tagline': 'Non-Ferrous Metals Trading · Est. 2006',

    'whatsapp.tooltip': 'Chat with us on WhatsApp',

    'modal.cta': 'Request a Quote',
    'btn.details': 'View Details',
    'modal.close': 'Close',
  },
};

function t(key) {
  const lang = getCurrentLang();
  return (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : (I18N.pt[key] !== undefined ? I18N.pt[key] : key);
}

// ══════════════════════════════════════════════════════════════
//  ESTADO DE STOCK (badge dos cards de metal)
// ══════════════════════════════════════════════════════════════

const STOCK_STATUS_I18N = {
  'Em Stock':      { pt: 'Em Stock',      es: 'En Stock',      en: 'In Stock' },
  'Por Encomenda': { pt: 'Por Encomenda', es: 'Bajo Pedido',   en: 'Made to Order' },
  'Indisponível':  { pt: 'Indisponível',  es: 'No Disponible', en: 'Unavailable' },
  'Esgotado':      { pt: 'Indisponível',  es: 'No Disponible', en: 'Unavailable' }, // valor legado
};

function translateStockStatus(status) {
  const lang = getCurrentLang();
  const entry = STOCK_STATUS_I18N[status] || STOCK_STATUS_I18N['Em Stock'];
  return entry[lang] || entry.pt;
}

// ══════════════════════════════════════════════════════════════
//  MATÉRIA-PRIMA (metais por defeito) — nome/teaser/descrição/specs/tags
// ══════════════════════════════════════════════════════════════

const METALS_I18N = {

  estanho: {
    es: {
      name: 'Lingotes de Estaño',
      teaser: 'Metal noble y versátil, con bajo punto de fusión (232°C), maleable y resistente a la oxidación.',
      description: 'El Estaño es un metal noble conocido y utilizado desde hace miles de años, muy versátil, con bajo punto de fusión (232°C), maleable y resistente a la oxidación. Se alea fácilmente con otros metales, como el Cobre, dando origen al Bronce. Es ampliamente utilizado en la industria electrónica (soldaduras), en la producción de hojalata para envases, y como componente principal en diversas aleaciones metálicas.',
      specs: [{ label: 'Punto de Fusión', value: '232 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '50' }, { label: 'Forma', value: 'Lingote' }],
      tags: ['En Stock', 'Lingote', 'Alta Pureza'],
    },
    en: {
      name: 'Tin Ingots',
      teaser: 'Noble, versatile metal with a low melting point (232°C), malleable and oxidation-resistant.',
      description: 'Tin is a noble metal known and used for thousands of years, highly versatile, with a low melting point (232°C), malleable and resistant to oxidation. It easily alloys with other metals such as Copper, giving rise to Bronze. It is widely used in the electronics industry (solders), in the production of tinplate for packaging, and as a main component in various metal alloys.',
      specs: [{ label: 'Melting Point', value: '232 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '50' }, { label: 'Form', value: 'Ingot' }],
      tags: ['In Stock', 'Ingot', 'High Purity'],
    },
  },

  chumbo: {
    es: {
      name: 'Lingotes de Plomo',
      teaser: 'Material blando y maleable, altamente resistente a la corrosión, con bajo punto de fusión (~330°C).',
      description: 'El Plomo (símbolo químico Pb) es un mineral que se puede encontrar en muchas regiones del mundo, asociado a otros metales formando la galena. Es un material muy blando y maleable, altamente resistente a la corrosión, y tiene un bajo punto de fusión (alrededor de 330°C). Se usa en la producción de baterías de plomo-ácido, como componente en aleaciones de soldadura, en la industria de radiología y en revestimientos de protección contra radiación.',
      specs: [{ label: 'Punto de Fusión', value: '~330 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '82' }, { label: 'Forma', value: 'Lingote' }],
      tags: ['En Stock', 'Lingote', 'Resistente a la Corrosión'],
    },
    en: {
      name: 'Lead Ingots',
      teaser: 'Soft, malleable material, highly corrosion-resistant, with a low melting point (~330°C).',
      description: 'Lead (chemical symbol Pb) is an ore found in many regions of the world, associated with other metals forming galena. It is a very soft and malleable material, highly resistant to corrosion, with a low melting point (around 330°C). It is used in the production of lead-acid batteries, as a component in soldering alloys, in the radiology industry and in radiation-shielding coatings.',
      specs: [{ label: 'Melting Point', value: '~330 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '82' }, { label: 'Form', value: 'Ingot' }],
      tags: ['In Stock', 'Ingot', 'Corrosion Resistant'],
    },
  },

  antimonio: {
    es: {
      name: 'Antimonio',
      teaser: 'Usado en aleaciones metálicas con plomo y estaño, aumentando dureza y resistencia. Cada vez más demandado en electrónica.',
      description: 'El Antimonio en su forma metálica se utiliza mucho en la producción de aleaciones metálicas, junto con el plomo y el estaño, aumentando significativamente su dureza y resistencia — como es el caso del Metal Antifricción y de diversas soldaduras. Debido a sus propiedades semiconductoras, también es cada vez más demandado para aplicaciones en componentes electrónicos, retardantes de llama y células solares de nueva generación.',
      specs: [{ label: 'Punto de Fusión', value: '630 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '51' }, { label: 'Forma', value: 'Lingote' }],
      tags: ['En Stock', 'Endurecedor de Aleaciones', 'Electrónica'],
    },
    en: {
      name: 'Antimony',
      teaser: 'Used in metal alloys with lead and tin, increasing hardness and strength. Increasingly sought after in electronics.',
      description: 'Antimony in its metallic form is widely used in the production of metal alloys together with lead and tin, significantly increasing their hardness and strength — as is the case with Anti-Friction Metal and various solders. Due to its semiconductor properties, it is also increasingly sought after for applications in electronic components, flame retardants and new-generation solar cells.',
      specs: [{ label: 'Melting Point', value: '630 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '51' }, { label: 'Form', value: 'Ingot' }],
      tags: ['In Stock', 'Alloy Hardener', 'Electronics'],
    },
  },

  cobre: {
    es: {
      name: 'Cobre',
      teaser: 'Uno de los metales más importantes a nivel industrial, excelente conductor de electricidad y calor.',
      description: 'El Cobre es uno de los metales más importantes a nivel industrial, de color rojizo, maleable y excelente conductor de electricidad y calor. Se usa ampliamente en cables eléctricos, conductores, motores, generadores y transformadores. Como componente de aleaciones, da origen al bronce (con estaño) y al latón (con zinc). También es esencial en los sectores de construcción, electrónica y energías renovables.',
      specs: [{ label: 'Punto de Fusión', value: '1085 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '29' }, { label: 'Color', value: 'Rojizo' }],
      tags: ['En Stock', 'Conductor Eléctrico', 'Aleaciones (Bronce/Latón)'],
    },
    en: {
      name: 'Copper',
      teaser: 'One of the most important metals industrially, an excellent conductor of electricity and heat.',
      description: 'Copper is one of the most important metals industrially, reddish in colour, malleable and an excellent conductor of electricity and heat. It is widely used in electrical cables, conductors, motors, generators and transformers. As an alloy component, it gives rise to bronze (with tin) and brass (with zinc). It is also essential in the construction, electronics and renewable energy sectors.',
      specs: [{ label: 'Melting Point', value: '1085 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '29' }, { label: 'Colour', value: 'Reddish' }],
      tags: ['In Stock', 'Electrical Conductor', 'Alloys (Bronze/Brass)'],
    },
  },

  bismuto: {
    es: {
      name: 'Bismuto',
      teaser: 'Elemento pesado, cristalino y de coloración rosácea. El más diamagnético de todos los metales.',
      description: 'El Bismuto es un elemento pesado, cristalino, de coloración rosácea, y es el más diamagnético de todos los metales. Las aleaciones metálicas con bismuto se utilizan en soldaduras libres de plomo (alternativa ecológica al plomo), termopares y dispositivos de detección de incendios (sprinklers). Los compuestos de bismuto tienen aplicaciones en cosmética (sombras, esmaltes) y en procedimientos médicos (gastroenterología).',
      specs: [{ label: 'Punto de Fusión', value: '271 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '83' }, { label: 'Propiedad', value: 'Diamagnético' }],
      tags: ['En Stock', 'Soldaduras Sin Plomo', 'Aplicaciones Médicas'],
    },
    en: {
      name: 'Bismuth',
      teaser: 'A heavy, crystalline element with a pinkish tint. The most diamagnetic of all metals.',
      description: 'Bismuth is a heavy, crystalline element with a pinkish tint, and it is the most diamagnetic of all metals. Metal alloys with bismuth are used in lead-free solders (an eco-friendly alternative to lead), thermocouples and fire-detection devices (sprinklers). Bismuth compounds have applications in cosmetics (eyeshadows, glazes) and in medical procedures (gastroenterology).',
      specs: [{ label: 'Melting Point', value: '271 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '83' }, { label: 'Property', value: 'Diamagnetic' }],
      tags: ['In Stock', 'Lead-Free Solders', 'Medical Applications'],
    },
  },

  niquel: {
    es: {
      name: 'Níquel',
      teaser: 'Esencial en acero inoxidable, galvanoplastia, baterías y electrónica. Presente en innumerables industrias.',
      description: 'El Níquel se utiliza en diversas aleaciones como el acero inoxidable (aportando resistencia a la corrosión), en procesos de galvanoplastia, fundiciones, catalizadores industriales, baterías recargables y electrodos. Está presente en equipos de transporte, electrónica de consumo, productos químicos, equipos médico-hospitalarios, aeroespaciales y bienes de consumo duraderos. Es un metal estratégico en la transición energética (baterías de vehículos eléctricos).',
      specs: [{ label: 'Punto de Fusión', value: '1455 °C' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'N.º Atómico', value: '28' }, { label: 'Forma', value: 'Lingote / Pellet' }],
      tags: ['En Stock', 'Acero Inoxidable', 'Galvanoplastia'],
    },
    en: {
      name: 'Nickel',
      teaser: 'Essential in stainless steel, electroplating, batteries and electronics. Present in countless industries.',
      description: 'Nickel is used in various alloys such as stainless steel (providing corrosion resistance), in electroplating processes, foundries, industrial catalysts, rechargeable batteries and electrodes. It is present in transport equipment, consumer electronics, chemical products, medical-hospital equipment, aerospace and durable consumer goods. It is a strategic metal in the energy transition (electric vehicle batteries).',
      specs: [{ label: 'Melting Point', value: '1455 °C' }, { label: 'Availability', value: 'In Stock' }, { label: 'Atomic Number', value: '28' }, { label: 'Form', value: 'Ingot / Pellet' }],
      tags: ['In Stock', 'Stainless Steel', 'Electroplating'],
    },
  },
};

// ══════════════════════════════════════════════════════════════
//  PRODUTOS — nome/label/teaser/descrição/specs/tags
// ══════════════════════════════════════════════════════════════

const PRODUCTS_I18N = {

  soldas: {
    es: {
      name: 'Soldaduras de Estaño', label: 'Producto Principal',
      teaser: 'Soldaduras Sn/Pb en varias composiciones — siempre en stock. Disponibles en hilo, barra o lingote.',
      description: 'Soldaduras de Estaño con Plomo, siempre en stock, en las siguientes composiciones: <strong>20%, 33%, 35%, 40%, 50%, 60%, 63%, 67%, 70% y 80% Sn</strong>. Disponibles en varias presentaciones: hilo, barra, lingote o formatos especiales bajo pedido. La soldadura 60/40 y la 63/37 son las más usadas en electrónica; las de menor contenido de estaño se prefieren en fontanería y chapistería.',
      specs: [{ label: 'Tipo', value: 'Con Plomo' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'Presentaciones', value: 'Hilo, Barra, Lingote' }, { label: 'Bajo Pedido', value: 'Sí' }],
      tags: ['Con Plomo', 'En Stock', 'Hilo y Barra', 'Bajo Pedido'],
    },
    en: {
      name: 'Tin Solders', label: 'Main Product',
      teaser: 'Sn/Pb solders in various compositions — always in stock. Available in wire, bar or ingot.',
      description: 'Tin-Lead Solders, always in stock, in the following compositions: <strong>20%, 33%, 35%, 40%, 50%, 60%, 63%, 67%, 70% and 80% Sn</strong>. Available in several presentations: wire, bar, ingot or special formats made to order. The 60/40 and 63/37 solders are the most used in electronics; those with a lower tin content are preferred in plumbing and sheet-metal work.',
      specs: [{ label: 'Type', value: 'Leaded' }, { label: 'Availability', value: 'In Stock' }, { label: 'Presentations', value: 'Wire, Bar, Ingot' }, { label: 'Made to Order', value: 'Yes' }],
      tags: ['Leaded', 'In Stock', 'Wire & Bar', 'Made to Order'],
    },
  },

  anodos: {
    es: {
      name: 'Ánodos de Estaño', label: 'Galvanoplastia',
      teaser: 'Ánodos de estaño de alta pureza (Sn 99,9%) para procesos de galvanoplastia, producidos bajo pedido.',
      description: 'Ánodos de Estaño — ideales para el proceso de galvanoplastia electrolítica, recubriendo otros metales para mejorar su apariencia o protegerlos de la corrosión. Producimos ánodos en las geometrías y purezas exigidas por el proceso de cada cliente. La elevada pureza (Sn 99,9%) garantiza un depósito electrolítico uniforme, brillante y sin impurezas, esencial en la industria electrónica y del envasado.',
      specs: [{ label: 'Pureza', value: 'Sn 99,9%' }, { label: 'Aplicación', value: 'Galvanoplastia' }, { label: 'Disponibilidad', value: 'Bajo Pedido' }, { label: 'Geometría', value: 'Personalizada' }],
      tags: ['Pureza Sn 99,9%', 'Galvanoplastia', 'Bajo Pedido', 'Geometría Personalizada'],
    },
    en: {
      name: 'Tin Anodes', label: 'Electroplating',
      teaser: 'High-purity tin anodes (Sn 99.9%) for electroplating processes, made to order.',
      description: 'Tin Anodes — ideal for the electrolytic electroplating process, coating other metals to improve their appearance or protect them from corrosion. We produce anodes in the geometries and purity required by each customer\'s process. The high purity (Sn 99.9%) ensures a uniform, bright, impurity-free electrolytic deposit, essential in the electronics and packaging industries.',
      specs: [{ label: 'Purity', value: 'Sn 99.9%' }, { label: 'Application', value: 'Electroplating' }, { label: 'Availability', value: 'Made to Order' }, { label: 'Geometry', value: 'Custom' }],
      tags: ['Sn 99.9% Purity', 'Electroplating', 'Made to Order', 'Custom Geometry'],
    },
  },

  antifriction: {
    es: {
      name: 'Metal Antifricción', label: 'Aleaciones Especiales',
      teaser: 'Aleaciones Sn+Cu+Sb en stock (85/6,5/8,5 y 90/3/7). Otras composiciones bajo pedido.',
      description: 'El Metal Antifricción (también conocido como metal blanco o Babbitt) es una aleación de estaño, cobre y antimonio usada en cojinetes de deslizamiento, chumaceras y otras superficies sometidas a fricción. Su excelente capacidad para soportar cargas y reducir el desgaste lo hace indispensable en la industria pesada, maquinaria industrial y aplicaciones ferroviarias.',
      specs: [{ label: 'Aleación 1 (stock)', value: '85% Sn · 6,5% Cu · 8,5% Sb' }, { label: 'Aleación 2 (stock)', value: '90% Sn · 3% Cu · 7% Sb' }, { label: 'Disponibilidad', value: 'En Stock' }, { label: 'Otras composiciones', value: 'Bajo Pedido' }],
      tags: ['Sn+Cu+Sb', 'En Stock', 'Bajo Pedido', 'Cojinetes / Chumaceras'],
    },
    en: {
      name: 'Anti-Friction Metal', label: 'Special Alloys',
      teaser: 'Sn+Cu+Sb alloys in stock (85/6.5/8.5 and 90/3/7). Other compositions made to order.',
      description: 'Anti-Friction Metal (also known as white metal or Babbitt) is a tin, copper and antimony alloy used in plain bearings, bushings and other surfaces subject to friction. Its excellent load-bearing capacity and wear reduction make it indispensable in heavy industry, industrial machinery and railway applications.',
      specs: [{ label: 'Alloy 1 (stock)', value: '85% Sn · 6.5% Cu · 8.5% Sb' }, { label: 'Alloy 2 (stock)', value: '90% Sn · 3% Cu · 7% Sb' }, { label: 'Availability', value: 'In Stock' }, { label: 'Other compositions', value: 'Made to Order' }],
      tags: ['Sn+Cu+Sb', 'In Stock', 'Made to Order', 'Bearings / Bushings'],
    },
  },

  ligas: {
    es: {
      name: 'Aleaciones a Medida', label: 'Producción Personalizada',
      teaser: 'Fundición de aleaciones personalizadas según las especificaciones técnicas del cliente — estaño, plomo y más.',
      description: 'Además de los productos en stock, producimos aleaciones de metales no ferrosos según las especificaciones técnicas y composiciones definidas por el cliente. Disponemos de capacidad técnica para desarrollar y fundir aleaciones personalizadas: estaño laminado en barrita y en placa, plomo laminado en barrita y en placa, y otras aleaciones según especificación del cliente. Contáctenos con los requisitos técnicos y le ofreceremos una propuesta adecuada.',
      specs: [{ label: 'Sn Laminado', value: 'Barrita / Placa' }, { label: 'Pb Laminado', value: 'Barrita / Placa' }, { label: 'Aleaciones Especiales', value: 'Según especificación' }, { label: 'Modo', value: 'Bajo Pedido' }],
      tags: ['Sn Laminado', 'Pb Laminado', 'Aleaciones Especiales', 'Especificación del Cliente'],
    },
    en: {
      name: 'Custom Alloys', label: 'Custom Production',
      teaser: 'Casting of custom alloys according to customer technical specifications — tin, lead and more.',
      description: 'Besides our in-stock products, we produce non-ferrous metal alloys according to the technical specifications and compositions defined by the customer. We have the technical capacity to develop and cast custom alloys: rolled tin in strip and sheet form, rolled lead in strip and sheet form, and other alloys per customer specification. Contact us with your technical requirements and we will provide a suitable proposal.',
      specs: [{ label: 'Rolled Sn', value: 'Strip / Sheet' }, { label: 'Rolled Pb', value: 'Strip / Sheet' }, { label: 'Special Alloys', value: 'Per specification' }, { label: 'Mode', value: 'Made to Order' }],
      tags: ['Rolled Sn', 'Rolled Pb', 'Special Alloys', 'Customer Specification'],
    },
  },
};

function localizeMetal(m) {
  const lang = getCurrentLang();
  if (lang === 'pt') return m;
  const tr = METALS_I18N[m.id];
  if (!tr || !tr[lang]) return m; // metal adicionado pelo admin, sem tradução — mantém como escrito
  const L = tr[lang];
  return Object.assign({}, m, {
    name: L.name || m.name,
    teaser: L.teaser || m.teaser,
    description: L.description || m.description,
    specs: L.specs || m.specs,
    tags: L.tags || m.tags,
  });
}

function localizeProduct(p) {
  const lang = getCurrentLang();
  if (lang === 'pt') return p;
  const tr = PRODUCTS_I18N[p.id];
  if (!tr || !tr[lang]) return p; // produto adicionado pelo admin, sem tradução — mantém como escrito
  const L = tr[lang];
  return Object.assign({}, p, {
    name: L.name || p.name,
    label: L.label || p.label,
    teaser: L.teaser || p.teaser,
    description: L.description || p.description,
    specs: L.specs || p.specs,
    tags: L.tags || p.tags,
  });
}

// ══════════════════════════════════════════════════════════════
//  APLICAR TRADUÇÃO AO DOM
// ══════════════════════════════════════════════════════════════

function applyTranslations() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-title')));
  });

  document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function switchLanguage(lang) {
  setCurrentLang(lang);
  applyTranslations();
  if (typeof renderDynamicSiteContent === 'function') renderDynamicSiteContent();
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
});
