import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award,
  Building2,
  Briefcase,
  Camera,
  ChevronRight,
  Download,
  FileText,
  Factory,
  Gauge,
  HardHat,
  ImagePlus,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PlayCircle,
  Settings,
  ShieldCheck,
  Upload,
  UserCircle,
  Users,
  Wrench,
  X,
  Youtube
} from 'lucide-react';
import heroImage from './assets/imec/hero-premium-welder.jpg';
import footerImage from './assets/imec/footer-industrial.jpg';
import imecLogo from './assets/imec/imec-logo-3d-animated.svg';
import projectShopImage from './assets/imec/project-premium-shop.jpg';
import portfolioVasos from './assets/imec/portfolio-vasos.jpg';
import portfolioTubulacoes from './assets/imec/portfolio-tubulacoes.jpg';
import portfolioEstruturas from './assets/imec/portfolio-estruturas.jpg';
import portfolioTanques from './assets/imec/portfolio-tanques.jpg';
import portfolioCaldeiraria from './assets/imec/portfolio-caldeiraria.jpg';
import portfolioCargas from './assets/imec/portfolio-cargas.jpg';
import './styles.css';
import './polish.css';

const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API = import.meta.env.VITE_API_URL || (isLocalHost ? 'http://localhost:3333/api' : '/api');
const UPLOADS = import.meta.env.VITE_UPLOADS_URL || (isLocalHost ? 'http://localhost:3333/uploads' : '/uploads');
const SITE_VERSION = 'Site institucional premium';
const DEFAULT_PHONE = '(18) 3786-1272';
const DEFAULT_WHATSAPP = '551837861272';
const DEFAULT_EMAIL = 'comercial@imecmetalurgica.com.br';
const DEFAULT_ADDRESS = 'Rua Júlio Ventura, 655 - Sud Mennucci, SP';

function whatsappUrl(settings = {}, message = 'Olá! Gostaria de solicitar um orçamento com a IMEC Metalúrgica.') {
  const raw = settings.whatsapp || settings.phone || DEFAULT_WHATSAPP;
  const phone = String(raw).replace(/\D/g, '') || DEFAULT_WHATSAPP;
  return `https://wa.me/${phone.startsWith('55') ? phone : `55${phone}`}?text=${encodeURIComponent(message)}`;
}

function assetUrl(url) {
  if (!url) return heroImage;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${UPLOADS}${url.replace('/uploads', '')}`;
  return url;
}

async function api(path, options = {}) {
  const token = localStorage.getItem('imec_token');
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Erro na ação.');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function apiHealth() {
  try {
    const response = await fetch(`${API}/health`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`status ${response.status}`);
    return { ok: true, message: 'API conectada.' };
  } catch {
    return { ok: false, message: 'API indisponivel. No Hostinger, confirme se o aplicativo Node.js esta iniciado e se /api/health abre no navegador.' };
  }
}

const iconMap = { Factory, Wrench, Settings, Building2, Gauge, HardHat, Camera };
const fallbackServices = [
  { id: 's1', title: 'Montagem Industrial', short_description: 'Montagem de equipamentos, plantas e conjuntos para usinas de etanol, açúcar e energia.', icon: 'Factory' },
  { id: 's2', title: 'Suporte Técnico', short_description: 'Acompanhamento técnico antes, durante e depois da entrega dos projetos e equipamentos.', icon: 'Wrench' },
  { id: 's3', title: 'Manutenção de Equipamentos', short_description: 'Manutenção e reforma de colunas, pré-evaporadores, tanques e trocadores de calor.', icon: 'Settings' },
  { id: 's4', title: 'Projetos', short_description: 'Soluções completas para fabricação, montagem e melhoria de processos industriais.', icon: 'Building2' },
  { id: 's5', title: 'Locação de Guinchos e Munks', short_description: 'Apoio para movimentação e montagem de equipamentos industriais em campo.', icon: 'Gauge' },
  { id: 's6', title: 'Equipamentos para Usinas', short_description: 'Produtos e serviços para fabricação de etanol, açúcar, energia e indústria alimentícia.', icon: 'HardHat' }
];
const fallbackPortfolio = [
  { title: 'Concentrador de Levedura', category: 'Conder Therm', image_url: portfolioVasos },
  { title: 'Decantador de Fuligem', category: 'Tratamento de fuligem de caldeira', image_url: portfolioTubulacoes },
  { title: 'Colunas de Destilação', category: 'Etanol combustível, neutro e especial', image_url: portfolioEstruturas },
  { title: 'Pré-evaporadores e Tanques', category: 'Fabricação, montagem e manutenção', image_url: portfolioTanques },
  { title: 'Trocadores de Calor', category: 'Equipamentos industriais', image_url: portfolioCaldeiraria },
  { title: 'Plantas para Usinas', category: 'Etanol, açúcar e energia', image_url: portfolioCargas },
].map((item, index) => ({ id: `p${index}`, ...item }));

const sectors = [
  'Usinas de açúcar e álcool',
  'Fabricação de etanol combustível, neutro e especial',
  'Energia e cogeração',
  'Indústria alimentícia',
  'Plantas industriais e utilidades',
  'Tratamento de fuligem de caldeira',
];

const clients = [
  'Mais de 100 usinas de açúcar e álcool atendidas',
  'Indústria alimentícia',
  'Destilarias e plantas de etanol',
  'Projetos industriais com acompanhamento de performance',
];

const timeline = [
  ['1998', 'Início das atividades com fabricação, montagem e manutenção para o setor sucroalcooleiro.'],
  ['2000', 'Diversificação das atividades e entrada em novos clientes industriais.'],
  ['2004', 'Fabricação de aparelho de destilação de álcool hidratado de grande capacidade.'],
  ['2006', 'Marco em serviços completos com caldeiras, transportadores, tratamento de caldo e destilação.'],
  ['2022', 'Investimento em nova fábrica com 5.000 m² de área fabril e equipamentos de ponta.'],
];

const differentials = [
  { icon: Award, title: 'Acompanhamento de Performance', text: 'A IMEC acompanha o desempenho dos produtos e serviços após a entrega, garantindo eficiência e qualidade.' },
  { icon: Users, title: 'Comunicação Direta', text: 'O cliente tem acesso ao responsável pelo projeto, sem intermediários ou demora para atendimento.' },
  { icon: FileText, title: 'Fornecedor BNDES', text: 'Empresa cadastrada como fornecedora de produtos e serviços pelo BNDES.' },
];

const impactMetrics = [
  ['100+', 'usinas atendidas'],
  ['1998', 'início das atividades'],
  ['5.000m²', 'área fabril planejada'],
  ['Brasil', 'atendimento nacional'],
];

const processSteps = [
  { icon: Users, title: 'Diagnóstico', text: 'Entendimento da necessidade, operação e prioridade técnica do cliente.' },
  { icon: FileText, title: 'Engenharia', text: 'Definição da solução, documentação e planejamento para fabricar ou executar.' },
  { icon: Factory, title: 'Fabricação', text: 'Produção industrial com foco em robustez, prazo e aderência ao processo.' },
  { icon: HardHat, title: 'Montagem', text: 'Equipe em campo para instalação, paradas, movimentação e integração.' },
  { icon: Gauge, title: 'Performance', text: 'Acompanhamento após a entrega para qualidade, eficiência e confiança.' }
];

const proofPillars = [
  { icon: ShieldCheck, title: 'Menos risco na parada', text: 'Planejamento técnico, equipes orientadas e documentação para reduzir improvisos em janelas críticas.' },
  { icon: Gauge, title: 'Performance acompanhada', text: 'Entrega com suporte depois da partida, ajudando a manter estabilidade, rendimento e confiabilidade.' },
  { icon: FileText, title: 'Decisão mais segura', text: 'Conteúdo claro para compras, engenharia e operação entenderem escopo, aplicação e próximos passos.' }
];

const serviceSalesNotes = [
  ['Montagem Industrial', 'Quando a planta precisa crescer ou voltar a operar sem perder prazo.', 'Equipe em campo, integração de equipamentos e acompanhamento até a entrega operacional.'],
  ['Suporte Técnico', 'Quando a operação precisa de decisão rápida e orientação especializada.', 'Contato direto com responsáveis técnicos antes, durante e depois da entrega.'],
  ['Manutenção de Equipamentos', 'Quando equipamentos críticos precisam voltar com confiabilidade.', 'Reformas, inspeções, recuperação de componentes e melhorias para reduzir paradas.'],
  ['Projetos', 'Quando a necessidade não cabe em solução pronta.', 'Engenharia aplicada, documentação técnica e fabricação conectadas desde o início.'],
  ['Locação de Guinchos e Munks', 'Quando a movimentação precisa ser segura e planejada.', 'Apoio para içamento, montagem e parada industrial com foco em segurança.'],
  ['Equipamentos para Usinas', 'Quando a usina busca robustez para etanol, açúcar e energia.', 'Produtos para destilação, fuligem, levedura, tanques, trocadores e plantas industriais.']
];

const productTags = ['Etanol', 'Açúcar', 'Energia', 'Utilidades', 'Paradas', 'Processo'];

const capabilityMatrix = [
  { icon: Factory, title: 'Fábrica e campo no mesmo raciocínio', text: 'A solução já nasce pensando em fabricação, montagem, manutenção e operação real da planta.' },
  { icon: ShieldCheck, title: 'Segurança para decisão técnica', text: 'Conteúdo organizado para engenharia, compras e diretoria entenderem escopo, risco e próximo passo.' },
  { icon: Users, title: 'Atendimento sem distância', text: 'Contato direto com a equipe, leitura rápida da necessidade e encaminhamento objetivo para orçamento.' },
  { icon: Gauge, title: 'Foco em continuidade operacional', text: 'Projetos, reformas e equipamentos com foco em reduzir parada, retrabalho e perda de desempenho.' }
];

const problemSolutions = [
  { icon: ShieldCheck, title: 'Paradas com menos improviso', text: 'Planejamento técnico para manutenção, reforma e montagem em janelas críticas de operação.' },
  { icon: Factory, title: 'Equipamentos sob medida', text: 'Fabricação e integração para destilação, fuligem, levedura, tanques, utilidades e processo.' },
  { icon: Wrench, title: 'Ativos críticos recuperados', text: 'Reformas, inspeções e melhorias para devolver confiabilidade a equipamentos industriais.' },
  { icon: Users, title: 'Decisão técnica mais rápida', text: 'Comunicação direta para alinhar escopo, prazo, fotos, documentos e próximo passo comercial.' }
];

const faqItems = [
  ['A IMEC atende fora de Sud Mennucci?', 'Sim. A empresa tem base em Sud Mennucci-SP e experiência nacional com usinas, destilarias, energia e indústria alimentícia.'],
  ['O atendimento é apenas para produtos novos?', 'Não. A IMEC também atua com manutenção, reforma, montagem industrial, suporte técnico e melhorias em equipamentos existentes.'],
  ['Como começar um orçamento?', 'O melhor caminho é enviar pelo WhatsApp a necessidade, local da planta, prazo desejado e fotos ou documentos técnicos disponíveis.'],
  ['A empresa fornece documentação técnica?', 'Sim. A proposta pode envolver engenharia, documentação, orientação técnica e acompanhamento conforme o tipo de solução contratada.']
];

const quoteChecklist = [
  'Tipo de equipamento, serviço ou processo',
  'Local da planta e prazo desejado',
  'Fotos, desenhos ou medidas disponíveis',
  'Contato técnico para alinhamento rápido'
];

const detailNextSteps = [
  ['01', 'Compartilhe a necessidade', 'Envie fotos, desenhos, medidas ou uma breve descrição do problema.'],
  ['02', 'Alinhe o escopo técnico', 'A equipe avalia aplicação, prazo, local de atendimento e melhor caminho de execução.'],
  ['03', 'Avance para proposta', 'Com as informações certas, a conversa vira especificação e orçamento com mais rapidez.']
];

const serviceDetails = {
  'montagem-industrial': {
    description: 'Planejamento, fabricacao e montagem de equipamentos, tubulacoes, estruturas e plantas industriais para operacoes sucroalcooleiras, energia e utilidades.',
    bullets: ['Montagem de equipamentos em campo', 'Integracao com processos existentes', 'Equipe tecnica para paradas e ampliacoes', 'Acompanhamento ate a entrega operacional']
  },
  'suporte-tecnico': {
    description: 'Apoio tecnico proximo ao cliente, com orientacao para instalacao, partida, operacao, ajustes e acompanhamento de performance dos equipamentos.',
    bullets: ['Contato direto com responsaveis tecnicos', 'Suporte antes, durante e depois da entrega', 'Analise de desempenho em operacao', 'Recomendacoes para melhoria do processo']
  },
  'manutencao-de-equipamentos': {
    description: 'Manutencao, reforma e melhoria de equipamentos industriais como colunas, tanques, pre-evaporadores, trocadores de calor e conjuntos para usinas.',
    bullets: ['Reformas programadas', 'Inspecao e recuperacao de componentes', 'Solucoes para reduzir paradas', 'Intervencoes em equipamentos criticos']
  },
  'projetos': {
    description: 'Desenvolvimento de solucoes industriais sob medida, conectando engenharia, fabricacao e montagem para demandas especificas de processo.',
    bullets: ['Estudo da necessidade do cliente', 'Projeto alinhado a fabricacao', 'Documentacao tecnica para execucao', 'Solucoes para ampliacao e modernizacao']
  },
  'locacao-de-guinchos-e-munks': {
    description: 'Apoio para icamento, movimentacao e montagem de equipamentos industriais, com foco em seguranca, planejamento e produtividade em campo.',
    bullets: ['Movimentacao de cargas industriais', 'Apoio em montagens e paradas', 'Planejamento de icamento', 'Operacao voltada a seguranca']
  },
  'equipamentos-para-usinas': {
    description: 'Linha de produtos e equipamentos para usinas de etanol, acucar e energia, com fabricacao, montagem e acompanhamento de desempenho.',
    bullets: ['Equipamentos para destilacao', 'Tratamento de fuligem de caldeira', 'Secagem e concentracao de levedura', 'Tanques, trocadores e plantas industriais']
  }
};

const productDetails = {
  'concentrador-de-levedura': {
    description: 'Equipamento voltado ao processo de concentracao de levedura, desenvolvido para ganho operacional e aplicacao em usinas e destilarias.',
    bullets: ['Aplicado em processos de etanol', 'Projeto industrial robusto', 'Fabricacao e suporte IMEC', 'Acompanhamento tecnico de performance']
  },
  'decantador-de-fuligem': {
    description: 'Solucao para tratamento de fuligem de caldeira, contribuindo para controle operacional, limpeza do processo e melhoria da rotina industrial.',
    bullets: ['Tratamento de residuos de caldeira', 'Projeto para operacao continua', 'Integracao com utilidades industriais', 'Fabricacao sob demanda']
  },
  'colunas-de-destilacao': {
    description: 'Colunas para fabricacao de etanol combustivel, neutro e especial, area em que a IMEC construiu forte historico no setor sucroalcooleiro.',
    bullets: ['Etanol combustivel, neutro e especial', 'Fabricacao de grande porte', 'Montagem e manutencao', 'Experiencia desde o inicio da empresa']
  },
  'pre-evaporadores-e-tanques': {
    description: 'Fabricacao, montagem e manutencao de pre-evaporadores, tanques e conjuntos industriais para processos de usinas e plantas energeticas.',
    bullets: ['Equipamentos para processos industriais', 'Montagem em campo', 'Reforma e manutencao', 'Solucoes sob medida']
  },
  'trocadores-de-calor': {
    description: 'Trocadores de calor para operacoes industriais que exigem confiabilidade, resistencia e atendimento tecnico alinhado ao processo.',
    bullets: ['Equipamentos industriais sob projeto', 'Fabricacao e montagem', 'Manutencao e reforma', 'Suporte para aplicacao em processo']
  },
  'plantas-para-usinas': {
    description: 'Solucoes para plantas industriais de etanol, acucar e energia, reunindo engenharia, fabricacao, montagem e acompanhamento tecnico.',
    bullets: ['Projetos para usinas', 'Equipamentos integrados', 'Montagem industrial', 'Suporte de performance']
  }
};

function slugifyTitle(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function enrichService(item = {}) {
  const slug = item.slug || slugifyTitle(item.title);
  return { ...item, slug, ...(serviceDetails[slug] || {}) };
}

function enrichProduct(item = {}) {
  const slug = item.slug || slugifyTitle(item.title);
  return { ...item, slug, ...(productDetails[slug] || {}) };
}

function mapsUrl(settings = {}) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || DEFAULT_ADDRESS)}`;
}

function officialSettings(settings = {}) {
  const oldPhone = !settings.phone || settings.phone.includes('(47)');
  return oldPhone
    ? { ...settings, phone: DEFAULT_PHONE, whatsapp: DEFAULT_WHATSAPP, email: DEFAULT_EMAIL, address: DEFAULT_ADDRESS, city: 'Sud Mennucci', state: 'São Paulo' }
    : settings;
}

function officialServices(items = []) {
  const hasOldTemplate = items.some((item) => ['Caldeiraria', 'Soldagem Industrial', 'NR-13', 'Rigging'].includes(item.title));
  const source = items.length && !hasOldTemplate ? items : fallbackServices;
  return source.map(enrichService);
}

function officialPortfolio(items = []) {
  const hasOldTemplate = items.some((item) => ['Vasos de Pressão', 'Tubulações Industriais', 'Estruturas Metálicas'].includes(item.title));
  const source = items.length && !hasOldTemplate ? items : fallbackPortfolio;
  return source.map(enrichProduct);
}

function officialPage(page = {}, slug) {
  if (slug === 'home' && (!page.title || page.title.includes('Engenharia, Tecnologia'))) return {};
  if (slug === 'quem-somos' && (!page.title || page.title.includes('Engenharia industrial'))) return {};
  return page;
}

function Logo({ settings = {} }) {
  return <a className="brand logo-brand" href="/" aria-label="IMEC Metalúrgica"><img src={imecLogo} alt="IMEC Metalúrgica" /></a>;
}

function Header({ settings, current }) {
  const [open, setOpen] = useState(false);
  const quoteMessage = 'Olá! Gostaria de falar com a IMEC sobre orçamento para equipamento, manutenção ou montagem industrial.';
  const nav = [
    ['/', 'Home'], ['/quem-somos', 'Empresa'], ['/servicos', 'Serviços'], ['/produtos', 'Produtos'], ['/setores', 'Setores'], ['/clientes', 'Clientes'], ['/contato', 'Contato']
  ];
  const isActive = (href) => href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`);
  return <header className="topbar">
    <Logo settings={settings} />
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'open' : ''}>{nav.map(([href, label]) => <a className={isActive(href) ? 'active' : ''} aria-current={isActive(href) ? 'page' : undefined} href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>
    <div className="top-actions">
      <a className="phone" href={`tel:${settings.phone || DEFAULT_PHONE}`}><Phone size={16} /> {settings.phone || DEFAULT_PHONE}</a>
      <a className="btn primary" href={whatsappUrl(settings, quoteMessage)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Solicitar Orçamento</a>
    </div>
  </header>;
}

function Footer({ settings }) {
  return <footer className="footer">
    <div><Logo settings={settings} /><p>Soluções industriais com engenharia, tecnologia e confiança.</p><small className="version-tag">{SITE_VERSION}</small></div>
    <div><h4>Navegação</h4><a href="/">Home</a><a href="/quem-somos">Empresa</a><a href="/servicos">Serviços</a><a href="/produtos">Produtos</a><a href="/setores">Setores</a><a href="/clientes">Clientes</a><a href="/trabalhe-conosco">Trabalhe conosco</a></div>
    <div><h4>Contato</h4><span>{settings.phone || DEFAULT_PHONE}</span><span>{settings.email || DEFAULT_EMAIL}</span><span>{settings.address || DEFAULT_ADDRESS}</span><a href={whatsappUrl(settings)}>Chamar no WhatsApp</a></div>
    <div><h4>Redes sociais</h4><div className="socials"><a href={settings.linkedin_url || '#'}><Linkedin size={18} /></a><a href={settings.instagram_url || '#'}><Instagram size={18} /></a><a href={settings.youtube_url || '#'}><Youtube size={18} /></a></div></div>
    <a className="admin-link" href="/admin"><Lock size={14} /> Painel administrativo</a>
  </footer>;
}

function PageTitle({ eyebrow, title, text }) {
  return <section className="page-title"><span>{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</section>;
}

function ServiceCard({ item }) {
  const Icon = iconMap[item.icon] || Factory;
  return <article className="service-card"><Icon /><h3>{item.title}</h3><p>{item.short_description}</p><a className="card-link" href={`/servicos/${item.slug || slugifyTitle(item.title)}`}>Ver detalhes <ChevronRight size={15} /></a></article>;
}

function PortfolioCard({ item }) {
  return <article className="portfolio-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.86)), url(${assetUrl(item.cover_image_url || item.image_url)})` }}><strong>{item.title}</strong><span>{item.category || item.short_description || 'Obra industrial'}</span><a href={`/produtos/${item.slug || slugifyTitle(item.title)}`}>Detalhes <ChevronRight size={14} /></a></article>;
}

function InfoCard({ icon: Icon = FileText, title, text }) {
  return <article className="info-card"><Icon /><h3>{title}</h3><p>{text}</p></article>;
}

function AnimatedMetric({ value, label }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const match = String(value).match(/\d[\d.]*/);
    if (!match) return;
    const target = Number(match[0].replace(/\./g, ''));
    const suffix = String(value).replace(match[0], '');
    let frame = 0;
    const total = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / total, 3);
      const current = Math.round(target * eased);
      const formatted = match[0].includes('.') ? current.toLocaleString('pt-BR') : String(current);
      setDisplay(`${formatted}${suffix}`);
      if (frame >= total) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [value]);
  return <article><strong>{display}</strong><span>{label}</span></article>;
}

function ImpactStrip() {
  return <section className="impact-strip">{impactMetrics.map(([value, label]) => <AnimatedMetric key={label} value={value} label={label} />)}</section>;
}

function CatalogCta({ settings }) {
  return <section className="catalog-cta"><div><span>Catálogo técnico</span><h2>Produtos, serviços e aplicações para avaliação interna</h2><p>Abra o material da IMEC para compartilhar com compras, engenharia e operação antes de avançar para especificação, orçamento ou visita técnica.</p></div><div><a className="btn primary" href="/catalogo-imec.html" target="_blank" rel="noreferrer"><Download size={17} /> Abrir catálogo</a><a className="btn outline" href={whatsappUrl(settings, 'Olá! Gostaria de receber o catálogo e falar sobre uma solução da IMEC Metalúrgica.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Receber no WhatsApp</a></div></section>;
}

function ProblemSolutionSection({ settings }) {
  const message = 'Olá! Quero falar com a IMEC sobre uma necessidade industrial da minha operação.';
  return <section className="problem-section">
    <div className="problem-heading"><span>O que resolvemos</span><h2>Resposta técnica quando a operação não pode parar</h2><p>Da parada programada ao equipamento novo, a IMEC transforma necessidade industrial em escopo, fabricação, montagem e suporte com mais clareza para o cliente.</p><a className="btn primary" href={whatsappUrl(settings, message)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Conversar com especialista</a></div>
    <div className="problem-grid">{problemSolutions.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div>
  </section>;
}

function ProcessFlow() {
  return <section className="process-flow"><div className="process-heading"><span>Método IMEC</span><h2>Do diagnóstico ao desempenho em campo</h2><p>Engenharia, fabricação, montagem e suporte técnico trabalham juntos para reduzir improvisos e dar mais previsibilidade à operação.</p></div><div className="process-track">{processSteps.map((step, index) => { const Icon = step.icon; return <article key={step.title}><small>{String(index + 1).padStart(2, '0')}</small><Icon /><h3>{step.title}</h3><p>{step.text}</p></article>; })}</div></section>;
}

function ProjectHighlights() {
  const items = [
    ['Destilacao e etanol', 'Colunas, conjuntos e solucoes para producao de etanol combustivel, neutro e especial.'],
    ['Tratamento de fuligem', 'Equipamentos para rotina de caldeira, utilidades e melhoria operacional.'],
    ['Paradas industriais', 'Manutencao, reforma, montagem e movimentacao de equipamentos em campo.']
  ];
  return <section className="project-highlights" style={{ backgroundImage: `linear-gradient(90deg, rgba(4,13,22,.98), rgba(4,13,22,.9) 42%, rgba(4,13,22,.68)), url(${projectShopImage})` }}><div><span>Projetos executados</span><h2>Obras, equipamentos e manutenções com foco em resultado</h2><p>Atuação voltada a usinas, destilarias e plantas industriais que precisam de prazo, robustez e suporte técnico sem perder clareza de escopo.</p></div><div>{items.map(([title, text], index) => <article key={title}><strong>{String(index + 1).padStart(2, '0')}</strong><h3>{title}</h3><p>{text}</p><a href="/contato">Falar sobre projeto <ChevronRight size={15} /></a></article>)}</div></section>;
}

function ProofSection() {
  return <section className="proof-section">
    <div className="proof-intro"><span>Por que escolher a IMEC</span><h2>Mais clareza para compras, engenharia e operação</h2><p>A proposta chega com foco técnico, comunicação direta e acompanhamento para transformar necessidade industrial em entrega confiável.</p></div>
    <div className="proof-grid">{proofPillars.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div>
  </section>;
}

function CapabilitySection() {
  return <section className="capability-section">
    <div className="capability-heading"><span>Capacidade IMEC</span><h2>Do primeiro contato ao equipamento operando</h2><p>Mais do que listar servicos, esta area mostra como a IMEC ajuda o cliente a tomar decisao com seguranca tecnica e comercial.</p></div>
    <div className="capability-grid">{capabilityMatrix.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div>
  </section>;
}

function FaqSection({ settings }) {
  return <section className="faq-section">
    <div><span>Dúvidas frequentes</span><h2>Antes do orçamento, o cliente já entende o caminho</h2><p>Veja como iniciar a conversa com a equipe técnica e quais informações ajudam a acelerar a análise da necessidade.</p><a className="btn primary" href={whatsappUrl(settings, 'Olá! Tenho uma dúvida e gostaria de falar com a IMEC Metalúrgica.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Tirar dúvida no WhatsApp</a></div>
    <div className="faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
  </section>;
}

function QuoteChecklist() {
  return <div className="quote-checklist"><b>Para agilizar o atendimento</b><ul>{quoteChecklist.map((item) => <li key={item}><ShieldCheck size={15} /> {item}</li>)}</ul></div>;
}

function NextSteps() {
  return <div className="next-steps">{detailNextSteps.map(([number, title, text]) => <article key={title}><strong>{number}</strong><div><b>{title}</b><span>{text}</span></div></article>)}</div>;
}

function FinalCta({ settings }) {
  return <section className="final-cta"><span>Atendimento técnico</span><h2>Precisa fabricar, reformar ou montar um equipamento industrial?</h2><p>Fale com a equipe da IMEC para avaliar sua necessidade com engenharia, prazo e responsabilidade técnica.</p><div><a className="btn primary" href={whatsappUrl(settings, 'Olá! Preciso fabricar, reformar ou montar um equipamento industrial e gostaria de falar com a IMEC.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Solicitar orçamento</a><a className="btn outline" href="/catalogo-imec.html" target="_blank" rel="noreferrer"><Download size={17} /> Ver catálogo</a></div></section>;
}

function Home({ data }) {
  const settings = officialSettings(data.settings || {});
  const home = officialPage(data.pages?.home || {}, 'home');
  const services = officialServices(data.services || []);
  const portfolio = officialPortfolio(data.portfolio || []);
  const quoteMessage = 'Olá! Gostaria de falar com a IMEC sobre uma solução industrial para usina, energia ou processo produtivo.';
  return <>
    <section className="hero-ref" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,10,18,.98), rgba(3,10,18,.72) 44%, rgba(3,10,18,.26) 70%, rgba(3,10,18,.86)), url(${assetUrl(settings.hero_image_url || home.image_url || heroImage)})` }}>
      <div className="hero-copy"><span>IMEC Metalúrgica</span><h1>{home.title || 'Soluções industriais para usinas de etanol, açúcar e energia'}</h1><p>{home.subtitle || 'Fabricação, montagem, manutenção e equipamentos industriais com engenharia aplicada, suporte técnico e experiência em mais de 100 usinas.'}</p><div className="hero-actions"><a className="btn primary" href={whatsappUrl(settings, quoteMessage)} target="_blank" rel="noreferrer">Solicitar orçamento <ChevronRight size={18} /></a><a className="btn outline" href="/produtos">Ver equipamentos <ChevronRight size={18} /></a></div></div>
      <aside className="badges"><article><Award /><b>Mais previsibilidade</b><small>Escopo, prazo e orientação técnica para reduzir improvisos em paradas e ampliações.</small></article><article><ShieldCheck /><b>Execução responsável</b><small>Fabricação, montagem e manutenção com foco em segurança, confiabilidade e continuidade operacional.</small></article><article><Settings /><b>Fornecedor BNDES</b><small>Credibilidade para compras técnicas, projetos industriais e decisões de investimento.</small></article></aside>
    </section>
    <ImpactStrip />
    <CatalogCta settings={settings} />
    <ProblemSolutionSection settings={settings} />
    <section className="home-strip services-strip"><div className="strip-title"><span>Serviços industriais</span><h2>Da parada programada à expansão da planta</h2><a href="/servicos">Ver todos <ChevronRight size={16} /></a></div><div className="service-row">{services.slice(0, 6).map((item) => <ServiceCard item={item} key={item.id} />)}</div></section>
    <ProcessFlow />
    <ProofSection />
    <ProjectHighlights />
    <section className="home-strip portfolio-strip"><div className="strip-title"><span>Produtos</span><h2>Equipamentos para processo, energia e utilidades</h2><a href="/produtos">Ver produtos <ChevronRight size={16} /></a></div><div className="portfolio-row">{portfolio.slice(0, 6).map((item) => <PortfolioCard item={item} key={item.id} />)}</div></section>
    <section className="quick-links" style={{ backgroundImage: `linear-gradient(90deg,rgba(4,14,24,.94),rgba(8,31,52,.92)),url(${footerImage})` }}><a href="/produtos"><Factory /><b>Produtos</b><small>Equipamentos para usinas, destilação e tratamento de fuligem.</small></a><a href="/setores"><Building2 /><b>Setores</b><small>Etanol, açúcar, energia e indústria alimentícia.</small></a><a href={whatsappUrl(settings, quoteMessage)} target="_blank" rel="noreferrer"><UserCircle /><b>Orçamento</b><small>Envie sua necessidade e receba encaminhamento técnico pelo WhatsApp.</small></a></section>
    <section className="overview-band"><div><span>Referência nacional</span><h2>Mais de 100 usinas atendidas</h2><p>A IMEC reúne experiência no setor sucroalcooleiro, comunicação direta com o cliente e acompanhamento de performance após a entrega.</p></div><div className="overview-grid">{differentials.map((item) => <InfoCard key={item.title} {...item} />)}</div></section>
    <CapabilitySection />
    <FaqSection settings={settings} />
    <FinalCta settings={settings} />
  </>;
}

function About({ data }) {
  const about = officialPage(data.pages?.['quem-somos'] || {}, 'quem-somos');
  const settings = officialSettings(data.settings || {});
  const aboutText = about.content || 'A IMEC surgiu da uniao dos diretores Edson Ribeiro e Jose Della Possa, ambos com extensa experiencia no setor sucroalcooleiro. Iniciamos nossas atividades fabricando, montando e mantendo colunas de destilacao, pre-evaporadores, tanques, trocadores de calor e outros equipamentos industriais. Ao longo da trajetoria, consolidamo-nos como referencia nacional, atendendo usinas de acucar e alcool e empresas da industria alimenticia e do setor energetico.';
  const reasons = [[Award, 'Experiencia', 'Mais de 25 anos de atuacao no setor sucroalcooleiro.'], [Users, 'Equipe especializada', 'Profissionais qualificados e em constante treinamento.'], [ShieldCheck, 'Qualidade garantida', 'Processos certificados e padrao de excelencia.'], [HardHat, 'Seguranca em 1o lugar', 'Compromisso com pessoas, meio ambiente e seguranca.'], [Factory, 'Fabricacao propria', 'Estruturas e equipamentos com tecnologia de ponta.'], [Wrench, 'Manutencao industrial', 'Solucoes completas para maxima disponibilidade.']];
  return <><section className="about-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(3,10,18,.98) 0%,rgba(5,18,31,.92) 43%,rgba(6,24,44,.62) 100%),url(${projectShopImage})` }}><div><span>Empresa</span><h1>{about.title || 'Desde 1998 atendendo o setor sucroalcooleiro'}</h1><p>{about.subtitle || 'Sediada em Sud Mennucci-SP, a IMEC Metalurgica e referencia em fabricacao, montagem e manutencao de equipamentos para etanol, acucar e energia.'}</p><div className="about-actions"><a className="btn primary" href={whatsappUrl(settings, 'Ola! Quero falar com um especialista da IMEC Metalurgica.')} target="_blank" rel="noreferrer"><FileText size={17} /> Falar com especialista</a><a className="btn outline" href="/servicos">Conheca nossos servicos <ChevronRight size={16} /></a></div></div></section><section className="about-metrics"><article><Award /><small>Desde</small><b>1998</b><span>Mais de 25 anos de historia</span></article><article><Users /><small>Atendimento</small><b>100+</b><span>Usinas atendidas em todo o Brasil</span></article><article><Factory /><small>Fabricacao</small><b>Propria</b><span>Estruturas e equipamentos</span></article><article><MapPin /><small>Atuacao</small><b>Nacional</b><span>Presenca em todo o pais</span></article></section><section className="about-story"><div className="about-copy"><span>Quem somos</span><h2>IMEC Metalurgica</h2>{aboutText.split('. ').filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph.replace(/\.$/, '')}.</p>)}</div><div className="about-image"><img src={portfolioVasos} alt="Equipamento industrial fabricado pela IMEC" /><aside><ShieldCheck /><b>Qualidade e seguranca</b><span>em cada entrega.</span></aside></div><div className="about-pillars"><article><Gauge /><b>Missao</b><span>Oferecer a melhor e mais completa solucao em produtos e servicos para desenvolver e aprimorar o cenario energetico brasileiro.</span></article><article><Award /><b>Valores</b><span>Superar expectativas, valorizar colaboradores, respeitar clientes e celebrar vitorias com todos que fizeram parte delas.</span></article><article><ShieldCheck /><b>Visao</b><span>Expandir em tamanho e variedade de servicos para ser parte fundamental da transformacao energetica brasileira.</span></article></div></section><section className="about-timeline"><h2>Nossa Historia</h2><div>{timeline.map(([year, text]) => <article key={year}><b>{year}</b><p>{text}</p></article>)}</div></section><section className="about-reasons"><h2>Por que escolher a IMEC?</h2><div>{reasons.map(([Icon, title, text]) => <article key={title}><Icon /><b>{title}</b><span>{text}</span></article>)}</div></section></>;
}
function Services({ data }) {
  const services = officialServices(data.services || []);
  return <><PageTitle eyebrow="Serviços" title="Soluções para usinas, energia e indústria alimentícia" text="Montagem industrial, suporte técnico, manutenção de equipamentos, projetos, locação de guinchos e munks, além de produtos para processos sucroalcooleiros." /><section className="page-grid service-grid">{services.map((item) => <ServiceCard item={item} key={item.id} />)}</section></>;
}

function Portfolio({ data }) {
  const portfolio = officialPortfolio(data.portfolio || []);
  return <><PageTitle eyebrow="Produtos" title="Equipamentos e soluções para o setor sucroalcooleiro" text="Concentrador de levedura, decantador de fuligem, colunas de destilação, pré-evaporadores, tanques, trocadores de calor e plantas industriais." /><section className="page-grid portfolio-grid">{portfolio.map((item) => <PortfolioCard item={item} key={item.id} />)}</section></>;
}

function Products({ data }) {
  const products = officialPortfolio(data.portfolio || []);
  return <><PageTitle eyebrow="Produtos e Equipamentos" title="Soluções para etanol, açúcar e energia" text="Produtos e equipamentos para usinas, processos de destilação, secagem de leveduras, tratamento de fuligem e plantas industriais." /><section className="product-list">{products.map((item) => <article key={item.id}><img src={assetUrl(item.cover_image_url || item.image_url)} alt={item.title} /><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description || item.short_description || 'Solução industrial desenvolvida para atender demandas do setor sucroalcooleiro.'}</p><a href="/contato">Solicitar informações <ChevronRight size={16} /></a></div></article>)}</section></>;
}

function Sectors() {
  const sectorDetails = sectors.map((title, index) => ({
    title,
    icon: [Factory, Gauge, Building2, Settings, Wrench, HardHat][index % 6],
    text: [
      'Equipamentos, montagem e manutencao para operacoes de acucar, alcool e bioenergia.',
      'Solucoes para destilacao, concentracao, utilidades e processos que exigem estabilidade.',
      'Apoio tecnico para plantas industriais, estruturas, tubulacoes e equipamentos sob medida.',
      'Aplicacoes para industria alimenticia com foco em confiabilidade, higiene e disponibilidade.',
      'Projetos e reformas para utilidades, vapor, caldeiras, tanques e trocadores de calor.',
      'Tratamento de fuligem, melhoria de rotina industrial e suporte para reduzir paradas.'
    ][index]
  }));
  return <><PageTitle eyebrow="Setores" title="Mercados atendidos pela IMEC" text="Atuacao voltada ao setor sucroalcooleiro, energia, plantas industriais e industria alimenticia." /><section className="sector-showcase"><div className="sector-lead"><span>Atuacao industrial</span><h2>Do processo sucroalcooleiro a plantas completas</h2><p>A IMEC conecta engenharia, fabricacao e campo para atender operacoes que precisam de prazo, robustez e suporte tecnico depois da entrega.</p><a className="btn primary" href="/contato"><MessageCircle size={17} /> Falar com especialista</a></div><div className="sector-grid">{sectorDetails.map(({ icon: Icon, title, text }, index) => <article key={title}><small>{String(index + 1).padStart(2, '0')}</small><Icon /><h3>{title}</h3><p>{text}</p><a href="/produtos">Ver solucoes <ChevronRight size={15} /></a></article>)}</div></section><section className="sector-proof"><article><b>100+</b><span>usinas atendidas</span></article><article><b>1998</b><span>inicio das atividades</span></article><article><b>BNDES</b><span>fornecedor cadastrado</span></article><article><b>Brasil</b><span>atendimento nacional</span></article></section></>;
}

function Clients({ data = {} }) {
  const settings = officialSettings(data.settings || {});
  const clientCards = [
    [Factory, 'Usinas de açúcar e álcool', 'Manutenção, montagem e fabricação para operações críticas do setor sucroenergético.'],
    [Building2, 'Indústria alimentícia', 'Soluções técnicas para processos industriais que exigem qualidade, segurança e eficiência.'],
    [Settings, 'Destilarias e plantas de etanol', 'Apoio do preparo da cana à destilação, com foco em disponibilidade e continuidade operacional.'],
    [Gauge, 'Projetos com performance acompanhada', 'Gestão técnica com escopo claro, prazos realistas e acompanhamento depois da entrega.']
  ];
  const proof = [
    ['Desde', '1998', 'história industrial'],
    ['Mais de', '100+', 'usinas atendidas'],
    ['Fornecedor', 'BNDES', 'cadastro ativo'],
    ['Atuação', 'Nacional', 'suporte ao Brasil']
  ];
  const whatsapp = whatsappUrl(settings, 'Olá! Quero falar com a IMEC sobre atendimento para usinas, clientes e projetos industriais.');
  return <><section className="clients-hero"><div className="clients-hero-copy"><span className="section-kicker">Confiança em campo</span><h1>Experiência com mais de <strong>100</strong> usinas</h1><p>A IMEC construiu sua trajetória atendendo usinas de açúcar e álcool e empresas da indústria alimentícia em projetos, equipamentos e serviços especializados.</p><div className="clients-hero-actions"><a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar com especialista</a><a className="btn outline" href="/produtos">Ver equipamentos <ChevronRight size={16} /></a></div></div><div className="clients-hero-metrics"><article><Factory /><b>100+</b><span>Usinas atendidas</span></article><article><ShieldCheck /><span>Atuação em</span><b>Projetos</b><em>equipamentos e serviços técnicos</em></article><article><Users /><span>Relacionamento</span><b>Técnico próximo</b><em>do orçamento ao pós-entrega</em></article></div></section><section className="clients-premium compact-clients"><div className="clients-grid">{clientCards.map(([Icon, title, text], index) => <article key={title}><Icon /><small>{String(index + 1).padStart(2, '0')}</small><h3>{title}</h3><p>{text}</p><a className="client-card-link" href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Falar sobre ${title}`}><ChevronRight size={18} /></a></article>)}</div><aside className="clients-highlight"><Users /><h2>Relacionamento técnico</h2><p>O diferencial da IMEC está na proximidade com o cliente: comunicação direta com o responsável pelo projeto e acompanhamento de performance após a entrega.</p><div><span><ShieldCheck size={15} /> Atendimento consultivo</span><span><ShieldCheck size={15} /> Processos transparentes</span><span><ShieldCheck size={15} /> Suporte pós-entrega</span></div><a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer">Falar com a IMEC <ChevronRight size={16} /></a></aside></section><section className="clients-proof">{proof.map(([label, value, text]) => <article key={value}><small>{label}</small><b>{value}</b><span>{text}</span></article>)}</section><section className="clients-final-cta"><div><span>Atendimento para clientes industriais</span><h2>Sua operação precisa de suporte técnico confiável?</h2><p>Fale com a IMEC para avaliar demanda, prazo, escopo e melhor caminho técnico antes da parada ou compra.</p></div><a className="btn primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Solicitar atendimento pelo WhatsApp</a></section></>;
}
function WorkWithUs() {
  return <><PageTitle eyebrow="Trabalhe Conosco" title="Envie seu currículo para a IMEC" text="No momento a empresa pode não ter vagas abertas, mas mantém banco de currículos para futuras oportunidades." /><section className="contact-page work-page"><div><span>Banco de talentos</span><h1>Faça parte da nossa história</h1><p>A IMEC valoriza o tempo e dedicação de seus colaboradores. Envie suas informações para que a equipe possa considerar seu perfil em novas oportunidades.</p><p><Mail size={17} /> {DEFAULT_EMAIL}</p><p><Briefcase size={17} /> Sud Mennucci - SP</p></div><form onSubmit={(event) => { event.preventDefault(); window.location.href = `mailto:${DEFAULT_EMAIL}?subject=${encodeURIComponent('Currículo - Banco de Talentos IMEC')}`; }}><input placeholder="Nome" required /><input placeholder="Telefone / WhatsApp" required /><input placeholder="E-mail" required /><textarea placeholder="Área de interesse ou breve apresentação" required /><button className="btn primary">Enviar por e-mail</button></form></section></>;
}

function DetailPage({ eyebrow, item, settings, backHref }) {
  return <><PageTitle eyebrow={eyebrow} title={item.title} text={item.category || item.short_description} /><section className="detail-page"><div className="detail-media"><img src={assetUrl(item.cover_image_url || item.image_url || heroImage)} alt={item.title} loading="lazy" decoding="async" /></div><div className="detail-copy"><span>Aplicacao IMEC</span><h2>Solucao tecnica para operacao industrial</h2><p>{item.description || item.short_description || 'Solucao industrial desenvolvida para atender demandas do setor sucroalcooleiro, energia e industria alimenticia.'}</p><ul>{(item.bullets || ['Projeto sob medida', 'Fabricacao e montagem', 'Suporte tecnico', 'Acompanhamento de performance']).map((bullet) => <li key={bullet}><ShieldCheck size={17} /> {bullet}</li>)}</ul><div className="detail-actions"><a className="btn primary" href={whatsappUrl(settings, `Ola! Quero falar sobre ${item.title} da IMEC Metalurgica.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Solicitar atendimento</a><a className="btn outline" href={backHref}>Voltar</a></div></div><aside className="detail-aside"><b>Precisa apresentar internamente?</b><p>Use o catalogo digital para compartilhar rapidamente as solucoes, produtos e contatos da IMEC.</p><a href="/catalogo-imec.html" target="_blank" rel="noreferrer"><Download size={16} /> Abrir catalogo</a></aside></section></>;
}

function ServiceDetail({ data, slug }) {
  const settings = officialSettings(data.settings || {});
  const item = officialServices(data.services || []).find((service) => service.slug === slug);
  return item ? <PremiumDetailPage eyebrow="Servico" item={item} settings={settings} backHref="/servicos" /> : <PremiumServices data={data} />;
}

function ProductDetail({ data, slug }) {
  const settings = officialSettings(data.settings || {});
  const item = officialPortfolio(data.portfolio || []).find((product) => product.slug === slug);
  return item ? <PremiumDetailPage eyebrow="Produto" item={item} settings={settings} backHref="/produtos" /> : <PremiumProducts data={data} />;
}

function Gallery({ data }) {
  const photos = data.photos?.length ? data.photos : fallbackServices;
  return <><PageTitle eyebrow="Galeria" title="Estrutura, fabricação e montagem industrial" text="Registros de equipamentos, obras e processos ligados às usinas de açúcar, álcool, energia e indústria alimentícia." /><section className="gallery-grid">{photos.map((photo) => <figure key={photo.id}><img src={assetUrl(photo.image_url)} alt={photo.alt_text || photo.title} /><figcaption>{photo.title}</figcaption></figure>)}</section></>;
}

function PremiumServices({ data }) {
  const services = officialServices(data.services || []);
  return <><PageTitle eyebrow="Serviços" title="Serviços industriais com engenharia, campo e suporte técnico" text="Conheça onde a IMEC atua, qual necessidade resolve e como ajuda a operação a avançar com mais segurança." /><section className="service-commerce-grid">{services.map((item, index) => { const Icon = iconMap[item.icon] || Factory; const note = serviceSalesNotes[index % serviceSalesNotes.length]; return <article className="service-commerce-card" key={item.id}><div><Icon /><span>{String(index + 1).padStart(2, '0')}</span></div><h3>{item.title || note[0]}</h3><p>{item.short_description || note[1]}</p><dl><dt>Cenário</dt><dd>{note[1]}</dd><dt>Entrega</dt><dd>{note[2]}</dd></dl><a href={`/servicos/${item.slug || slugifyTitle(item.title)}`}>Ver detalhes <ChevronRight size={15} /></a></article>; })}</section><CapabilitySection /><FaqSection settings={officialSettings(data.settings || {})} /><FinalCta settings={officialSettings(data.settings || {})} /></>;
}

function PremiumProducts({ data }) {
  const products = officialPortfolio(data.portfolio || []);
  return <><PageTitle eyebrow="Produtos e Equipamentos" title="Catálogo industrial para etanol, açúcar, energia e utilidades" text="Equipamentos com aplicação clara, contexto de uso e caminho direto para conversa técnica com a IMEC." /><section className="catalog-page"><div className="catalog-intro"><span>Catálogo IMEC</span><h2>Escolha o equipamento e avance para a especificação</h2><p>Entenda aplicações, benefícios e próximos passos antes de pedir orçamento ou alinhar uma necessidade com a equipe técnica.</p><ul className="catalog-intro-list"><li><ShieldCheck size={15} /> Aplicação por setor e processo</li><li><MessageCircle size={15} /> Orçamento direto pelo WhatsApp</li><li><FileText size={15} /> Apoio técnico para especificação</li></ul><a className="btn outline" href="/catalogo-imec.html" target="_blank" rel="noreferrer"><Download size={17} /> Abrir catálogo digital</a></div><div className="catalog-grid">{products.map((item, index) => <article className="catalog-card" key={item.id}><img src={assetUrl(item.cover_image_url || item.image_url || heroImage)} alt={item.title} loading="lazy" decoding="async" /><div><span>{item.category || 'Equipamento industrial'}</span><h3>{item.title}</h3><p>{item.description || item.short_description || 'Solução industrial para usinas, energia e processos produtivos que exigem robustez e suporte técnico.'}</p><ul>{productTags.slice(index % 3, index % 3 + 3).map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="catalog-actions"><a href={`/produtos/${item.slug || slugifyTitle(item.title)}`}>Detalhes <ChevronRight size={15} /></a><a href={whatsappUrl(officialSettings(data.settings || {}), `Olá! Quero informações sobre ${item.title} da IMEC Metalúrgica.`)} target="_blank" rel="noreferrer">Orçar</a></div></div></article>)}</div></section><FaqSection settings={officialSettings(data.settings || {})} /></>;
}

function PremiumDetailPage({ eyebrow, item, settings, backHref }) {
  const specs = [
    ['Aplicacao', item.category || 'Usinas, energia e industria alimenticia'],
    ['Entrega', 'Projeto, fabricacao, montagem e suporte tecnico'],
    ['Proximo passo', 'Analise da necessidade e orientacao comercial']
  ];
  return <><PageTitle eyebrow={eyebrow} title={item.title} text={item.category || item.short_description} /><section className="detail-page premium-detail"><div className="detail-media"><img src={assetUrl(item.cover_image_url || item.image_url || heroImage)} alt={item.title} loading="lazy" decoding="async" /></div><div className="detail-copy"><span>Aplicacao IMEC</span><h2>Solucao tecnica com foco em operacao, prazo e confiabilidade</h2><p>{item.description || item.short_description || 'Solucao industrial desenvolvida para demandas do setor sucroalcooleiro, energia e industria alimenticia.'}</p><ul>{(item.bullets || ['Projeto sob medida', 'Fabricacao e montagem', 'Suporte tecnico', 'Acompanhamento de performance']).map((bullet) => <li key={bullet}><ShieldCheck size={17} /> {bullet}</li>)}</ul><div className="detail-specs">{specs.map(([title, text]) => <article key={title}><b>{title}</b><span>{text}</span></article>)}</div><NextSteps /><div className="detail-actions"><a className="btn primary" href={whatsappUrl(settings, `Ola! Quero falar sobre ${item.title} da IMEC Metalurgica.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Solicitar atendimento</a><a className="btn outline" href={backHref}>Voltar</a></div></div><aside className="detail-aside"><b>Material de apoio</b><p>Abra o catalogo digital para compartilhar solucoes, produtos e contatos da IMEC com compras, engenharia ou operacao.</p><a href="/catalogo-imec.html" target="_blank" rel="noreferrer"><Download size={16} /> Abrir catalogo</a></aside></section></>;
}

function PremiumGallery({ data }) {
  const source = data.photos?.length ? data.photos : officialPortfolio(data.portfolio || []);
  const photos = source.length ? source : fallbackPortfolio;
  return <><PageTitle eyebrow="Galeria" title="Estrutura, processos e capacidade industrial da IMEC" text="Registros de fabricação, montagem, manutenção e equipamentos para reforçar confiança técnica antes do contato comercial." /><section className="gallery-showcase"><div className="gallery-lead"><Camera /><h2>Fabricação, montagem e equipamentos em destaque</h2><p>Projetos e imagens ajudam compras, engenharia e operação a visualizar a capacidade industrial da IMEC.</p></div><div className="gallery-mosaic">{photos.slice(0, 8).map((photo, index) => <figure className={index === 0 ? 'featured' : ''} key={photo.id || photo.title}><img src={assetUrl(photo.cover_image_url || photo.image_url || heroImage)} alt={photo.alt_text || photo.title} loading="lazy" decoding="async" /><figcaption><b>{photo.title}</b><span>{photo.category || photo.short_description || 'Projeto industrial IMEC'}</span></figcaption></figure>)}</div></section></>;
}

function PremiumFooter({ settings }) {
  return <footer className="footer-pro">
    <div className="footer-main"><div><Logo settings={settings} /><p>Engenharia, fabricação, montagem e manutenção para operações industriais que exigem confiabilidade.</p><div className="footer-badges"><span>Desde 1998</span><span>100+ usinas</span><span>Fornecedor BNDES</span></div></div><div><h4>Links rápidos</h4><a href="/servicos">Serviços</a><a href="/produtos">Produtos</a><a href="/setores">Setores</a><a href="/clientes">Clientes</a><a href="/contato">Contato</a></div><div><h4>Serviços</h4><a href="/servicos/montagem-industrial">Montagem industrial</a><a href="/servicos/manutencao-de-equipamentos">Manutenção de equipamentos</a><a href="/produtos/colunas-de-destilacao">Colunas de destilação</a><a href="/catalogo-imec.html" target="_blank" rel="noreferrer">Catálogo digital</a></div><div><h4>Contato</h4><span><Phone size={15} /> {settings.phone || DEFAULT_PHONE}</span><span><Mail size={15} /> {settings.email || DEFAULT_EMAIL}</span><span><MapPin size={15} /> {settings.address || DEFAULT_ADDRESS}</span><a className="footer-whatsapp" href={whatsappUrl(settings)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Chamar no WhatsApp</a></div></div>
    <div className="footer-bottom"><span>{SITE_VERSION}</span><a href="/admin"><Lock size={14} /> Painel administrativo</a><div className="socials"><a aria-label="LinkedIn IMEC" href={settings.linkedin_url || '#'}><Linkedin size={18} /></a><a aria-label="Instagram IMEC" href={settings.instagram_url || '#'}><Instagram size={18} /></a><a aria-label="YouTube IMEC" href={settings.youtube_url || '#'}><Youtube size={18} /></a></div></div>
  </footer>;
}

function Videos({ data }) {
  const videos = data.videos?.length ? data.videos : [{ id: 'v1', title: 'Cadastre vídeos pelo painel', description: 'Links do YouTube aparecerão aqui.' }];
  return <><PageTitle eyebrow="Vídeos" title="Projetos e bastidores em vídeo" text="Conteúdos em vídeo dos projetos, processos e operações da IMEC." /><section className="video-grid">{videos.map((video) => <article className="video-card" key={video.id}>{video.youtube_id ? <iframe src={`https://www.youtube.com/embed/${video.youtube_id}`} title={video.title} allowFullScreen /> : <div><PlayCircle size={58} /></div>}<h3>{video.title}</h3><p>{video.description}</p></article>)}</section></>;
}

function Contact({ data }) {
  const settings = officialSettings(data.settings || {});
  const services = officialServices(data.services || []);
  const [sent, setSent] = useState('');
  const [quote, setQuote] = useState({ name: '', company: '', email: '', phone: '', service_interest: '', message: '' });
  const quoteMessage = [
    'Olá! Gostaria de solicitar um orçamento com a IMEC Metalúrgica.',
    quote.name && `Nome: ${quote.name}`,
    quote.company && `Empresa: ${quote.company}`,
    quote.phone && `Telefone: ${quote.phone}`,
    quote.email && `E-mail: ${quote.email}`,
    quote.service_interest && `Serviço: ${quote.service_interest}`,
    quote.message && `Mensagem: ${quote.message}`,
  ].filter(Boolean).join('\n');
  async function submit(event) {
    event.preventDefault();
    try {
      await api('/public/quotes', { method: 'POST', body: JSON.stringify(quote) });
      setSent('Pedido salvo com sucesso. Abrindo WhatsApp para agilizar o atendimento.');
    } catch {
      setSent('Abrindo WhatsApp para enviar seu pedido.');
    }
    window.open(whatsappUrl(settings, quoteMessage), '_blank', 'noopener,noreferrer');
  }
  return <><section className="contact-page premium-contact"><div><span>Engenharia e soluções industriais</span><h1>Solicite seu orçamento industrial com a IMEC</h1><p>Conte o que precisa fabricar, reformar, montar ou movimentar. A equipe direciona o atendimento para engenharia, campo ou comercial conforme a necessidade.</p><div className="contact-actions"><a className="btn primary" href={whatsappUrl(settings)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Solicitar orçamento pelo WhatsApp</a><a className="btn outline" href={`tel:${String(settings.phone || DEFAULT_PHONE).replace(/\D/g, '')}`}><Phone size={17} /> Ligar para atendimento técnico</a></div><div className="contact-channels"><article><Phone /><b>{settings.phone || DEFAULT_PHONE}</b><span>Telefone comercial</span></article><article><Mail /><b>{settings.email || DEFAULT_EMAIL}</b><span>Resposta rápida e atendimento ágil</span></article><article><MapPin /><b>Sud Mennucci - SP</b><span>Atendemos todo o território nacional</span></article></div><div className="contact-stats"><article><Factory /><b>100+</b><small>usinas e indústrias atendidas</small></article><article><ShieldCheck /><b>Desde 1998</b><small>tradição, qualidade e compromisso</small></article><article className="bndes-stat"><strong>BNDES</strong><b>Fornecedor cadastrado</b><small>credibilidade para compras técnicas</small></article></div><QuoteChecklist /></div><form className="quote-form" onSubmit={submit}><div className="form-head"><span>Pedido rápido</span><h2>Descreva sua necessidade</h2><p>Quanto mais contexto, mais objetiva será a primeira conversa técnica.</p></div>{['name', 'company', 'phone', 'email'].map((key) => <input key={key} placeholder={{ name: 'Nome', company: 'Empresa', email: 'E-mail', phone: 'Telefone / WhatsApp' }[key]} value={quote[key]} onChange={(e) => setQuote({ ...quote, [key]: e.target.value })} required={key !== 'company'} />)}<select value={quote.service_interest} onChange={(e) => setQuote({ ...quote, service_interest: e.target.value })}><option value="">Tipo de serviço</option>{services.map((item) => <option key={item.id}>{item.title}</option>)}</select><textarea placeholder="Descreva sua necessidade, prazo, equipamento ou setor da planta" value={quote.message} onChange={(e) => setQuote({ ...quote, message: e.target.value })} required /><button className="btn primary">Enviar solicitação</button>{sent && <p className="ok">{sent}</p>}</form></section></>;
}
function MapLocation({ data }) {
  const settings = officialSettings(data.settings || {});
  return <section className="map-card"><div><span>Localizacao</span><h2>Sud Mennucci - Sao Paulo</h2><p>{settings.address || DEFAULT_ADDRESS}</p><a className="btn outline" href={mapsUrl(settings)} target="_blank" rel="noreferrer"><MapPin size={17} /> Abrir no Google Maps</a></div><aside><MapPin size={48} /><b>Atendimento nacional</b><small>Base industrial em Sud Mennucci-SP e experiencia com mais de 100 usinas de acucar e alcool.</small></aside></section>;
}

function PublicSite() {
  const [data, setData] = useState({ settings: {}, pages: {}, services: [], portfolio: [], photos: [], videos: [] });
  useEffect(() => { api('/public/bootstrap').then(setData).catch(() => {}); }, []);
  const current = window.location.pathname.replace(/\/$/, '') || '/';
  useEffect(() => {
    const targets = document.querySelectorAll('.home-strip,.quick-links,.overview-band,.page-grid,.gallery-grid,.video-grid,.content-split,.timeline-section,.product-list,.client-section,.contact-page,.service-card,.portfolio-card,.info-card,.impact-strip article,.catalog-cta,.problem-section,.problem-grid article,.detail-page,.process-flow,.process-track article,.project-highlights,.project-highlights article,.final-cta,.map-card,.proof-section,.proof-grid article,.service-commerce-card,.catalog-page,.catalog-card,.gallery-showcase,.gallery-mosaic figure,.capability-section,.capability-grid article,.faq-section,.faq-list details,.quote-checklist,.next-steps article,.footer-pro,.about-hero,.about-metrics article,.about-story,.about-pillars article,.about-timeline article,.about-reasons article,.sector-showcase,.sector-grid article,.sector-proof article,.clients-hero,.clients-hero-metrics article,.clients-premium,.clients-grid article,.clients-highlight,.clients-proof article,.clients-final-cta,.contact-channels article,.quote-form');
    targets.forEach((target) => target.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [current, data]);
  useEffect(() => {
    const titles = {
      '/': 'IMEC Metalúrgica - Etanol, açúcar e energia',
      '/quem-somos': 'Empresa - IMEC Metalúrgica',
      '/servicos': 'Serviços - IMEC Metalúrgica',
      '/produtos': 'Produtos e Equipamentos - IMEC Metalúrgica',
      '/portfolio': 'Produtos e Equipamentos - IMEC Metalúrgica',
      '/setores': 'Setores atendidos - IMEC Metalúrgica',
      '/clientes': 'Clientes - IMEC Metalúrgica',
      '/trabalhe-conosco': 'Trabalhe Conosco - IMEC Metalúrgica',
      '/contato': 'Contato - IMEC Metalúrgica',
    };
    document.title = titles[current] || (current.startsWith('/servicos/') ? 'Servico - IMEC Metalurgica' : current.startsWith('/produtos/') ? 'Produto - IMEC Metalurgica' : titles['/']);
    const descriptions = {
      '/': 'IMEC Metalurgica: engenharia, fabricacao, montagem, manutencao e equipamentos para usinas de etanol, acucar, energia e processos industriais.',
      '/quem-somos': 'Conheca a IMEC Metalurgica, empresa de Sud Mennucci-SP com experiencia desde 1998 no setor sucroalcooleiro e industrial.',
      '/servicos': 'Servicos industriais da IMEC: montagem, suporte tecnico, manutencao de equipamentos, projetos e movimentacao para plantas industriais.',
      '/produtos': 'Catalogo de equipamentos IMEC para etanol, acucar, energia, destilacao, tratamento de fuligem, levedura, tanques e trocadores de calor.',
      '/setores': 'Setores atendidos pela IMEC Metalurgica: usinas, destilarias, energia, utilidades, industria alimenticia e plantas industriais.',
      '/clientes': 'Experiencia da IMEC com mais de 100 usinas atendidas, relacionamento tecnico e acompanhamento de performance em campo.',
      '/galeria': 'Galeria IMEC com registros de fabricacao, montagem, manutencao e equipamentos industriais para usinas e plantas de processo.',
      '/videos': 'Videos da IMEC Metalurgica com projetos, bastidores, processos industriais e conteudos tecnicos.',
      '/contato': 'Fale com a IMEC Metalurgica para solicitar orcamento de equipamentos, montagem, manutencao, projetos e suporte tecnico.'
    };
    const description = descriptions[current] || (current.startsWith('/servicos/') ? 'Detalhes de servico industrial da IMEC Metalurgica para operacoes de etanol, acucar, energia e plantas industriais.' : current.startsWith('/produtos/') ? 'Detalhes de produto e equipamento industrial da IMEC Metalurgica para usinas, energia e processos produtivos.' : descriptions['/']);
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${current === '/' ? '/' : current}`);
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', document.title);
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', `${window.location.origin}/og-image.jpg`);
    const settings = officialSettings(data.settings || {});
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          name: 'IMEC Metalurgica',
          description,
          telephone: settings.phone || DEFAULT_PHONE,
          email: settings.email || DEFAULT_EMAIL,
          address: settings.address || DEFAULT_ADDRESS,
          url: window.location.origin,
          areaServed: 'Brasil',
          makesOffer: ['Montagem industrial', 'Manutencao de equipamentos', 'Projetos industriais', 'Equipamentos para usinas']
        },
        {
          '@type': 'WebSite',
          name: 'IMEC Metalurgica',
          url: window.location.origin,
          inLanguage: 'pt-BR'
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqItems.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
        }
      ]
    };
    let script = document.querySelector('script[data-seo="imec"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = 'imec';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [current, data.settings]);
  const page = useMemo(() => {
    if (current.startsWith('/servicos/')) return <ServiceDetail data={data} slug={current.replace('/servicos/', '')} />;
    if (current.startsWith('/produtos/')) return <ProductDetail data={data} slug={current.replace('/produtos/', '')} />;
    if (current === '/quem-somos') return <About data={data} />;
    if (current === '/servicos') return <PremiumServices data={data} />;
    if (current === '/portfolio') return <Portfolio data={data} />;
    if (current === '/produtos') return <PremiumProducts data={data} />;
    if (current === '/setores') return <Sectors />;
    if (current === '/clientes') return <Clients data={data} />;
    if (current === '/trabalhe-conosco') return <WorkWithUs />;
    if (current === '/galeria') return <PremiumGallery data={data} />;
    if (current === '/videos') return <Videos data={data} />;
    if (current === '/contato') return <><Contact data={data} /><MapLocation data={data} /><FaqSection settings={officialSettings(data.settings || {})} /></>;
    return <Home data={data} />;
  }, [current, data]);
  const settings = officialSettings(data.settings || {});
  return <><Header settings={settings} current={current} /><main>{page}</main><a className="floating-whatsapp" href={whatsappUrl(settings, 'Olá! Gostaria de falar com a IMEC sobre uma necessidade industrial.')} target="_blank" rel="noreferrer" aria-label="Chamar IMEC no WhatsApp"><MessageCircle size={24} /><span>Orçamento</span></a><PremiumFooter settings={settings} /></>;
}

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('imec_token') || '');
  const [login, setLogin] = useState({ email: 'admin@imec.com.br', password: 'Admin@123' });
  const [tab, setTab] = useState('settings');
  const [state, setState] = useState({});
  const [msg, setMsg] = useState('');
  const tabs = ['settings', 'pages', 'services', 'portfolio', 'categories', 'photos', 'videos', 'quotes'];
  const labels = { settings: 'Empresa', pages: 'Paginas', services: 'Servicos', portfolio: 'Produtos', categories: 'Categorias', photos: 'Fotos', videos: 'Videos', quotes: 'Orcamentos' };
  async function load() {
    setMsg('');
    try {
      const entries = await Promise.all([api('/admin/settings').then((d) => ['settings', d]), ...tabs.filter((x) => x !== 'settings').map((r) => api('/admin/' + r).then((d) => [r, d]))]);
      setState(Object.fromEntries(entries));
    } catch (e) {
      setMsg(`${e.message} Verifique se a API esta online e se o dominio aponta para /api.`);
    }
  }
  useEffect(() => { if (token) load().catch((e) => setMsg(e.message)); }, [token]);
  async function enter(e) {
    e.preventDefault();
    setMsg('');
    try {
      const health = await apiHealth();
      if (!health.ok) throw new Error(health.message);
      const d = await api('/auth/login', { method: 'POST', body: JSON.stringify(login) });
      localStorage.setItem('imec_token', d.token);
      setToken(d.token);
    } catch (error) {
      if (error.status === 401) {
        setMsg('E-mail ou senha invalidos. No Hostinger, importe database/reset-admin.sql pelo phpMyAdmin ou rode npm run create-admin -- "Administrador" "admin@imec.com.br" "Admin@123" e tente novamente.');
      } else {
        setMsg(`${error.message} Em desenvolvimento, rode tambem o backend na porta 3333. Em producao, o app Node precisa responder em /api.`);
      }
    }
  }
  if (!token) return <main className="login"><form onSubmit={enter}><Logo /><h1>Painel Administrativo</h1><p>Entre para atualizar textos, servicos, produtos, fotos, videos e pedidos de orcamento.</p><input placeholder="E-mail" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /><input placeholder="Senha" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /><button className="btn primary">Entrar</button><a className="btn outline" href="/">Voltar ao site</a>{msg && <p className="admin-warning">{msg}</p>}</form></main>;
  async function saveSettings(e) { e.preventDefault(); await api('/admin/settings', { method: 'PUT', body: JSON.stringify(state.settings) }); setMsg('Salvo.'); }
  async function upload(file, cb) { const fd = new FormData(); fd.append('file', file); const d = await api('/admin/upload', { method: 'POST', body: fd }); cb(d.url); }
  async function save(resource, item) { await api(`/admin/${resource}${item.id ? '/' + item.id : ''}`, { method: item.id ? 'PUT' : 'POST', body: JSON.stringify(item) }); await load(); setMsg('Salvo.'); }
  async function remove(resource, item) { if (!item.id || resource === 'quotes') return; await api(`/admin/${resource}/${item.id}`, { method: 'DELETE' }); await load(); setMsg('Excluido.'); }
  return <main className="admin"><aside><Logo /><a className="admin-site-link" href="/">Ver site</a>{tabs.map((x) => <button className={tab === x ? 'active' : ''} onClick={() => setTab(x)} key={x}>{labels[x]}<small>{Array.isArray(state[x]) ? state[x].length : ''}</small></button>)}<button onClick={load}>Recarregar</button><button onClick={() => { localStorage.clear(); setToken(''); }}>Sair</button></aside><section><div className="admin-head"><span>Painel IMEC</span><h1>{labels[tab]}</h1><p>Gerencie conteudo, imagens, paginas e pedidos do site institucional.</p></div>{msg && <p className={['Salvo.', 'Excluido.'].includes(msg) ? 'ok' : 'admin-warning'}>{msg}</p>}{tab === 'settings' ? <SettingsForm data={state.settings || {}} setData={(d) => setState({ ...state, settings: d })} save={saveSettings} upload={upload} /> : <Crud resource={tab} items={state[tab] || []} save={save} remove={remove} upload={upload} />}</section></main>;
}

function SettingsForm({ data, setData, save, upload }) {
  return <form className="form" onSubmit={save}>{['company_name', 'phone', 'whatsapp', 'email', 'address', 'city', 'state', 'instagram_url', 'linkedin_url', 'youtube_url', 'facebook_url', 'logo_url', 'hero_image_url'].map((field) => <label key={field}>{field}<input value={data[field] || ''} onChange={(e) => setData({ ...data, [field]: e.target.value })} /></label>)}{data.hero_image_url && <img className="admin-preview" src={assetUrl(data.hero_image_url)} alt="Preview do banner" />}<label className="upload"><Upload /> Enviar banner<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0], (url) => setData({ ...data, hero_image_url: url }))} /></label><button className="btn primary">Salvar</button></form>;
}

const fields = { pages: ['slug', 'title', 'subtitle', 'content', 'image_url', 'is_active'], services: ['title', 'slug', 'short_description', 'description', 'icon', 'image_url', 'display_order', 'is_active'], portfolio: ['title', 'slug', 'category', 'location', 'year', 'short_description', 'description', 'cover_image_url', 'display_order', 'is_active'], categories: ['name', 'slug', 'display_order', 'is_active'], photos: ['category_id', 'title', 'image_url', 'alt_text', 'display_order', 'is_active'], videos: ['title', 'youtube_url', 'description', 'display_order', 'is_active'], quotes: ['name', 'company', 'email', 'phone', 'service_interest', 'message', 'status'] };
function Crud({ resource, items, save, remove, upload }) {
  const blank = { is_active: 1, display_order: 0 };
  const [cur, setCur] = useState(blank);
  const preview = cur.image_url || cur.cover_image_url;
  return <div className="crud"><form className="form" onSubmit={(e) => { e.preventDefault(); save(resource, cur); setCur(blank); }}>{fields[resource].filter((f) => !['name', 'company', 'email', 'phone', 'message', 'service_interest'].includes(f) || resource !== 'quotes').map((f) => f.includes('description') || f === 'content' || f === 'message' ? <label key={f}>{f}<textarea value={cur[f] || ''} onChange={(e) => setCur({ ...cur, [f]: e.target.value })} /></label> : <label key={f}>{f}<input value={cur[f] || ''} onChange={(e) => setCur({ ...cur, [f]: e.target.value })} /></label>)}{preview && <img className="admin-preview" src={assetUrl(preview)} alt="Preview" />}{resource !== 'quotes' && <label className="upload"><Upload /> Upload<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0], (url) => setCur({ ...cur, image_url: url, cover_image_url: url }))} /></label>}<div className="admin-form-actions"><button className="btn primary">Salvar</button><button className="btn outline" type="button" onClick={() => setCur(blank)}>Novo</button></div></form><div className="list">{items.map((i) => <article key={i.id}>{(i.image_url || i.cover_image_url) && <img src={assetUrl(i.image_url || i.cover_image_url)} alt="" />}<b>{i.title || i.name || i.email}</b><p>{i.short_description || i.youtube_url || i.message || i.status}</p><div><button onClick={() => setCur(i)}>Editar</button>{resource !== 'quotes' && <button className="danger" onClick={() => remove(resource, i)}>Excluir</button>}</div></article>)}</div></div>;
}

createRoot(document.getElementById('root')).render(location.pathname.startsWith('/admin') ? <Admin /> : <PublicSite />);
