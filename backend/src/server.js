import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import slugify from 'slugify';
import dotenv from 'dotenv';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, 'backend', '.env') });

const env = {
  port: Number(process.env.PORT || 3333),
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'troque-esta-chave',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 8),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'imec_site'
  }
};

const uploadDir = path.resolve(rootDir, env.uploadDir);
const frontendDistCandidates = [
  path.resolve(rootDir, 'public'),
  path.resolve(rootDir, 'frontend', 'dist'),
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), 'frontend', 'dist'),
  path.resolve(process.cwd(), '..', 'public'),
  path.resolve(process.cwd(), '..', 'frontend', 'dist')
];
const frontendDist = frontendDistCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

const pool = mysql.createPool({ ...env.db, waitForConnections: true, connectionLimit: 10, namedPlaceholders: true });
const query = async (sql, params = {}) => (await pool.execute(sql, params))[0];
const app = express();

['get', 'post', 'put', 'delete'].forEach((method) => {
  const original = app[method].bind(app);
  app[method] = (pathOrRoute, ...handlers) => original(pathOrRoute, ...handlers.map((handler) => (
    handler?.constructor?.name === 'AsyncFunction'
      ? (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
      : handler
  )));
});

fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`)
});
const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(file.mimetype.startsWith('image/') ? null : new Error('Envie apenas imagens.'), true)
});

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Acesso não autorizado.' });
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
}

function slug(value) {
  return slugify(value || '', { lower: true, strict: true });
}

function youtubeId(url = '') {
  return (url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/) || [])[1] || '';
}

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.appUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1 AS ok');
    res.json({ status: 'ok', app: 'IMEC Metalurgica API', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', app: 'IMEC Metalurgica API', database: 'offline', message: 'Banco de dados indisponivel.' });
  }
});

app.post('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), async (req, res) => {
  const users = await query('SELECT id,name,email,password_hash,role FROM users WHERE email=:email LIMIT 1', { email: req.body.email });
  const user = users[0];
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/public/bootstrap', async (_req, res) => {
  const [settings] = await query('SELECT * FROM company_settings WHERE id=1');
  const pages = await query('SELECT * FROM pages WHERE is_active=1');
  const services = await query('SELECT * FROM services WHERE is_active=1 ORDER BY display_order,id');
  const portfolio = await query('SELECT * FROM portfolio_projects WHERE is_active=1 ORDER BY display_order,id');
  const categories = await query('SELECT * FROM gallery_categories WHERE is_active=1 ORDER BY display_order,id');
  const photos = await query('SELECT * FROM gallery_photos WHERE is_active=1 ORDER BY display_order,id');
  const videos = await query('SELECT * FROM videos WHERE is_active=1 ORDER BY display_order,id');
  res.json({ settings, pages: Object.fromEntries(pages.map((p) => [p.slug, p])), services, portfolio, categories, photos, videos: videos.map((v) => ({ ...v, youtube_id: youtubeId(v.youtube_url) })) });
});

app.post('/api/public/quotes', async (req, res) => {
  const { name, company, email, phone, service_interest, message } = req.body;
  if (!name || !email || !phone || !message) return res.status(400).json({ message: 'Preencha nome, e-mail, telefone e mensagem.' });
  await query('INSERT INTO quote_requests (name,company,email,phone,service_interest,message) VALUES (:name,:company,:email,:phone,:service_interest,:message)', { name, company: company || null, email, phone, service_interest: service_interest || null, message });
  res.status(201).json({ message: 'Pedido de orçamento recebido com sucesso.' });
});

app.use('/api/admin', auth);
app.get('/api/admin/settings', async (_req, res) => res.json((await query('SELECT * FROM company_settings WHERE id=1'))[0]));
app.put('/api/admin/settings', async (req, res) => {
  await query(`UPDATE company_settings SET company_name=:company_name,logo_url=:logo_url,phone=:phone,whatsapp=:whatsapp,email=:email,address=:address,city=:city,state=:state,hero_image_url=:hero_image_url,youtube_url=:youtube_url,instagram_url=:instagram_url,linkedin_url=:linkedin_url,facebook_url=:facebook_url WHERE id=1`, req.body);
  res.json({ message: 'Dados atualizados.' });
});
app.post('/api/admin/upload', upload.single('file'), (req, res) => res.status(201).json({ url: `/uploads/${req.file.filename}` }));

const tables = { pages: 'pages', services: 'services', portfolio: 'portfolio_projects', categories: 'gallery_categories', photos: 'gallery_photos', videos: 'videos', quotes: 'quote_requests' };

app.get('/api/admin/:resource', async (req, res) => {
  const table = tables[req.params.resource];
  if (!table) return res.status(404).json({ message: 'Recurso não encontrado.' });
  res.json(await query(`SELECT * FROM ${table} ORDER BY id DESC`));
});

app.post('/api/admin/:resource', async (req, res) => {
  const r = req.params.resource;
  const b = req.body;
  if (r === 'pages') await query('INSERT INTO pages (slug,title,subtitle,content,image_url,is_active) VALUES (:slug,:title,:subtitle,:content,:image_url,:is_active)', { ...b, slug: b.slug || slug(b.title) });
  if (r === 'services') await query('INSERT INTO services (title,slug,short_description,description,icon,image_url,display_order,is_active) VALUES (:title,:slug,:short_description,:description,:icon,:image_url,:display_order,:is_active)', { ...b, slug: b.slug || slug(b.title) });
  if (r === 'portfolio') await query('INSERT INTO portfolio_projects (title,slug,category,location,year,short_description,description,cover_image_url,display_order,is_active) VALUES (:title,:slug,:category,:location,:year,:short_description,:description,:cover_image_url,:display_order,:is_active)', { ...b, slug: b.slug || slug(b.title) });
  if (r === 'categories') await query('INSERT INTO gallery_categories (name,slug,display_order,is_active) VALUES (:name,:slug,:display_order,:is_active)', { ...b, slug: b.slug || slug(b.name) });
  if (r === 'photos') await query('INSERT INTO gallery_photos (category_id,title,image_url,alt_text,display_order,is_active) VALUES (:category_id,:title,:image_url,:alt_text,:display_order,:is_active)', b);
  if (r === 'videos') await query('INSERT INTO videos (title,youtube_url,description,display_order,is_active) VALUES (:title,:youtube_url,:description,:display_order,:is_active)', b);
  res.status(201).json({ message: 'Conteúdo criado.' });
});

app.put('/api/admin/:resource/:id', async (req, res) => {
  const r = req.params.resource;
  const b = { ...req.body, id: req.params.id };
  if (r === 'pages') await query('UPDATE pages SET title=:title,subtitle=:subtitle,content=:content,image_url=:image_url,is_active=:is_active WHERE id=:id', b);
  if (r === 'services') await query('UPDATE services SET title=:title,slug=:slug,short_description=:short_description,description=:description,icon=:icon,image_url=:image_url,display_order=:display_order,is_active=:is_active WHERE id=:id', { ...b, slug: b.slug || slug(b.title) });
  if (r === 'portfolio') await query('UPDATE portfolio_projects SET title=:title,slug=:slug,category=:category,location=:location,year=:year,short_description=:short_description,description=:description,cover_image_url=:cover_image_url,display_order=:display_order,is_active=:is_active WHERE id=:id', { ...b, slug: b.slug || slug(b.title) });
  if (r === 'categories') await query('UPDATE gallery_categories SET name=:name,slug=:slug,display_order=:display_order,is_active=:is_active WHERE id=:id', { ...b, slug: b.slug || slug(b.name) });
  if (r === 'photos') await query('UPDATE gallery_photos SET category_id=:category_id,title=:title,image_url=:image_url,alt_text=:alt_text,display_order=:display_order,is_active=:is_active WHERE id=:id', b);
  if (r === 'videos') await query('UPDATE videos SET title=:title,youtube_url=:youtube_url,description=:description,display_order=:display_order,is_active=:is_active WHERE id=:id', b);
  if (r === 'quotes') await query('UPDATE quote_requests SET status=:status WHERE id=:id', b);
  res.json({ message: 'Conteúdo atualizado.' });
});

app.delete('/api/admin/:resource/:id', async (req, res) => {
  const table = tables[req.params.resource];
  if (!table || req.params.resource === 'quotes') return res.status(404).json({ message: 'Recurso não encontrado.' });
  await query(`DELETE FROM ${table} WHERE id=:id`, { id: req.params.id });
  res.json({ message: 'Registro excluído.' });
});

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Rota de API não encontrada.' });
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.status(503).send('Build do frontend nao encontrado. Rode npm run build.'));
}

app.use((err, _req, res, _next) => res.status(500).json({ message: err.message || 'Erro interno.' }));
app.listen(env.port, () => console.log(`API IMEC rodando na porta ${env.port}`));
