#!/usr/bin/env node
/**
 * TIRNX · Premium Digital Store
 * Style: Keychron-inspired clean, product-focused, tech-forward
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DIST_DIR = path.join(__dirname, 'dist');

function loadJSON(name) {
    const fp = path.join(DATA_DIR, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fixImg(url, base) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return base + url;
    return url;
}

// ── SEO ──
function loadRootJSON(name) {
    const fp = path.join(__dirname, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
const SEO = loadRootJSON('seo.json') || {};
const SEO_KEYWORDS = SEO.keywords || '';
const SEO_DESC = SEO.description || '';
const SITE_TITLE = SEO.title || 'TIRNX';
const SEO_TITLE_SUFFIX = SEO.titleSuffix || '';
const SEO_AUTHOR = SEO.author || SITE_TITLE;
const SEO_ROBOTS = SEO.robots || 'index, follow';
const SEO_CANONICAL = SEO.canonical || '';
const SEO_OG = SEO.og || {};
const SEO_TWITTER = SEO.twitter || {};
const SEO_JSON_LD = SEO.jsonLd || {};
const SEO_FAVICON = SEO.favicon || '';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg: #fff;
  --bg-alt: #f7f7f7;
  --bg-dark: #111;
  --bg-hero: #0a0a0a;
  --text: #111;
  --text-light: #555;
  --text-muted: #999;
  --border: #e8e8e8;
  --border-dark: #222;
  --accent: #111;
  --white: #fff;
  --red: #e53935;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --max-w: 1320px;
  --nav-h: 60px;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(16px, 3vw, 40px); }

/* ── Announcement ── */
.announce {
  background: var(--bg-dark);
  color: var(--white);
  text-align: center;
  padding: 9px 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  overflow: hidden;
}
.announce .marquee { display: flex; animation: marquee 35s linear infinite; white-space: nowrap; }
.announce .marquee span { flex-shrink: 0; padding: 0 50px; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ── Nav ── */
.nav {
  position: sticky; top: 0; z-index: 1000;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  height: var(--nav-h);
  transition: box-shadow 0.3s;
}
.nav.scrolled { box-shadow: 0 1px 12px rgba(0,0,0,0.06); }
.nav-inner {
  max-width: var(--max-w); margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px);
  height: 100%; display: flex; align-items: center; justify-content: space-between;
}
.logo { font-size: 18px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
.logo a { display: flex; align-items: center; gap: 10px; }
.logo img { height: 28px; width: auto; border-radius: 4px; }
.nav-center { display: flex; align-items: center; gap: 36px; }
.nav-center a {
  font-size: 12px; font-weight: 600; letter-spacing: 0.8px;
  color: var(--text-light); transition: color 0.2s; position: relative;
}
.nav-center a::after {
  content: ''; position: absolute; bottom: -6px; left: 50%; width: 0; height: 2px;
  background: var(--text); transition: all 0.3s var(--ease-out); transform: translateX(-50%);
}
.nav-center a:hover { color: var(--text); }
.nav-center a:hover::after { width: 100%; }
.nav-right { display: flex; align-items: center; gap: 12px; }
.nav-cta {
  padding: 9px 24px; background: var(--bg-dark); color: var(--white) !important;
  font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  transition: all 0.2s;
}
.nav-cta::after { display: none !important; }
.nav-cta:hover { background: #333; transform: translateY(-1px); color: var(--white) !important; }
.lang-toggle {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 12px; font-size: 11px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-light); background: none;
  border: 1.5px solid var(--border); cursor: pointer;
  transition: all 0.2s; font-family: var(--font);
}
.lang-toggle:hover { border-color: var(--text); color: var(--text); }
.lang-toggle .globe { font-size: 13px; line-height: 1; }

/* ── Hero ── */
.hero {
  position: relative; min-height: 75vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center; overflow: hidden;
  background: var(--bg-hero); color: var(--white);
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center; opacity: 0.3;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%);
}
.hero-content { position: relative; z-index: 1; padding: 80px 24px; }
.hero-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 4px;
  text-transform: uppercase; margin-bottom: 20px; opacity: 0.7;
}
.hero h1 {
  font-size: clamp(42px, 7vw, 88px); font-weight: 900;
  letter-spacing: -2px; line-height: 0.95; margin-bottom: 20px;
}
.hero h1 em { font-style: italic; font-weight: 200; }
.hero-sub {
  font-size: clamp(13px, 1.4vw, 16px); font-weight: 300;
  letter-spacing: 0.5px; opacity: 0.6;
  max-width: 480px; margin: 0 auto 36px; line-height: 1.7;
}
.hero-btn {
  display: inline-block; padding: 14px 44px;
  background: var(--white); color: var(--bg-dark);
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  border: 2px solid var(--white); transition: all 0.3s;
}
.hero-btn:hover { background: transparent; color: var(--white); transform: translateY(-2px); }

/* ── Stats ── */
.stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border);
}
.stat { padding: 28px 20px; text-align: center; border-right: 1px solid var(--border); transition: background 0.2s; }
.stat:last-child { border-right: none; }
.stat:hover { background: var(--bg-alt); }
.stat-num { font-size: 28px; font-weight: 900; letter-spacing: -1px; margin-bottom: 4px; }
.stat-lbl { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }

/* ── Section ── */
.sec-header { text-align: center; padding: 72px 24px 40px; }
.sec-header h2 { font-size: clamp(26px, 3.5vw, 42px); font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; }
.sec-header p { font-size: 13px; color: var(--text-light); max-width: 440px; margin: 0 auto; line-height: 1.7; }
.sec-line { width: 36px; height: 2px; background: var(--text); margin: 18px auto 0; }

/* ── Filter ── */
.filter-bar {
  display: flex; justify-content: center; gap: 0;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  overflow-x: auto; -webkit-overflow-scrolling: touch;
}
.filter-btn {
  padding: 14px 24px; font-size: 10px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--text-muted); cursor: pointer; white-space: nowrap;
  border: none; background: none; border-bottom: 2px solid transparent;
  transition: all 0.2s; user-select: none;
}
.filter-btn:hover { color: var(--text); }
.filter-btn.active { color: var(--text); border-bottom-color: var(--text); }

/* ── Products ── */
.products-section { padding: 0 0 80px; }
.products-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0; border-left: 1px solid var(--border);
}
.product-card {
  display: block; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);
  background: var(--white); transition: all 0.4s var(--ease-out);
  cursor: pointer; text-decoration: none; color: inherit;
  position: relative; overflow: hidden;
}
.product-card:hover { z-index: 2; box-shadow: 0 6px 32px rgba(0,0,0,0.07); }
.card-img {
  position: relative; overflow: hidden; aspect-ratio: 5/4; background: var(--bg-alt);
}
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s var(--ease-out); }
.product-card:hover .card-img img { transform: scale(1.05); }
.card-badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  padding: 4px 12px; font-size: 9px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  background: var(--bg-dark); color: var(--white);
}
.card-body { padding: 18px; }
.card-cat { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; }
.card-title {
  font-size: 13px; font-weight: 600; line-height: 1.5; margin-bottom: 12px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2em;
}
.card-bottom { display: flex; align-items: center; justify-content: space-between; }
.card-price { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; }
.card-price .from { font-size: 10px; font-weight: 400; color: var(--text-muted); margin-right: 2px; }
.card-arrow {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--border); font-size: 13px; color: var(--text-light);
  transition: all 0.3s;
}
.product-card:hover .card-arrow { background: var(--bg-dark); border-color: var(--bg-dark); color: var(--white); }

/* ── Features ── */
.features {
  background: var(--bg-alt); padding: 72px 0;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
.feat {
  padding: 36px 28px; text-align: center;
  border-right: 1px solid var(--border); transition: background 0.2s;
}
.feat:last-child { border-right: none; }
.feat:hover { background: var(--bg); }
.feat-icon { font-size: 24px; margin-bottom: 16px; }
.feat h3 { font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 8px; }
.feat p { font-size: 12px; color: var(--text-light); line-height: 1.6; }

/* ── CTA ── */
.cta {
  padding: 88px 24px; text-align: center;
  background: var(--bg-dark); color: var(--white);
}
.cta h2 { font-size: clamp(26px, 3.5vw, 42px); font-weight: 900; letter-spacing: -1px; margin-bottom: 14px; }
.cta p { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 32px; letter-spacing: 0.3px; }
.cta-btn {
  display: inline-block; padding: 14px 44px;
  background: var(--white); color: var(--bg-dark);
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  transition: all 0.3s;
}
.cta-btn:hover { background: #ddd; transform: translateY(-2px); color: var(--bg-dark); }

/* ── Footer ── */
.footer { background: var(--bg-dark); color: var(--white); padding: 56px 24px 36px; }
.footer-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding-bottom: 36px; border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 28px; flex-wrap: wrap; gap: 28px;
}
.footer-brand .logo { color: var(--white); margin-bottom: 10px; }
.footer-brand p { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.8; max-width: 280px; }
.footer-col h4 {
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; margin-bottom: 14px; color: rgba(255,255,255,0.5);
}
.footer-col a { display: block; font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 9px; transition: color 0.2s; }
.footer-col a:hover { color: var(--white); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.footer-bottom p { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.5px; }
.footer-bottom a { color: rgba(255,255,255,0.25); }
.footer-bottom a:hover { color: var(--white); }

/* ── Anim ── */
.reveal { opacity: 0; transform: translateY(24px); transition: all 0.7s var(--ease-out); }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .feat:nth-child(2) { border-right: none; }
  .feat:nth-child(1), .feat:nth-child(2) { border-bottom: 1px solid var(--border); }
}
@media (max-width: 768px) {
  .nav-center { display: none; }
  .hero { min-height: 65vh; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 1px solid var(--border); }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .card-img { aspect-ratio: 1/1; }
  .card-body { padding: 12px; }
  .card-title { font-size: 11px; }
  .card-price { font-size: 13px; }
  .filter-btn { padding: 12px 16px; font-size: 9px; }
  .sec-header { padding: 56px 16px 28px; }
  .features { padding: 56px 0; }
  .cta { padding: 56px 16px; }
  .footer-top { flex-direction: column; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .card-img { aspect-ratio: 1/1; }
  .card-body { padding: 10px; }
  .card-title { font-size: 10px; min-height: auto; }
  .card-badge { font-size: 7px; padding: 3px 7px; top: 8px; left: 8px; }
  .card-arrow { width: 26px; height: 26px; font-size: 10px; }
  .stat-num { font-size: 22px; }
  .features-grid { grid-template-columns: 1fr; }
  .feat { border-right: none; border-bottom: 1px solid var(--border); }
}
`;

const JS = `
function filterCategory(id, el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.product-card').forEach((c, i) => {
    if (id === 'all' || c.dataset.cat == id) {
      c.style.display = '';
      c.style.opacity = '0'; c.style.transform = 'translateY(16px)';
      setTimeout(() => { c.style.transition = 'all .45s cubic-bezier(0.16,1,0.3,1)'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 45);
    } else { c.style.display = 'none'; }
  });
}
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('scrolled', window.scrollY > 20);
});
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const saved = localStorage.getItem('tirnx_lang');
  if (saved) setLang(saved);
});
const i18n = {
  en: {
    'nav.shop': 'Shop', 'nav.why': 'Why Us', 'nav.store': 'Visit Store',
    'hero.eyebrow': 'Premium Digital Accounts', 'hero.title1': 'Digital', 'hero.title2': 'Essentials',
    'hero.sub': 'Curated selection of premium digital accounts and professional web services. Delivered instantly.',
    'hero.btn': 'Explore Collection',
    'stats.cats': 'Categories', 'stats.prods': 'Products', 'stats.opts': 'Options', 'stats.del': 'Delivery',
    'sec.title': 'The Collection', 'sec.desc': 'Browse our curated selection of premium digital accounts and services',
    'filter.all': 'All', 'filter.gv': 'GV Numbers', 'filter.gmail': 'Gmail', 'filter.apple': 'Apple ID', 'filter.svc': 'Services',
    'cat.gv': 'GV Numbers', 'cat.gmail': 'Gmail', 'cat.apple': 'Apple ID', 'cat.svc': 'Services',
    'feat.deli.t': 'Instant Delivery', 'feat.deli.d': 'Automated system ensures you receive accounts immediately after purchase',
    'feat.qual.t': 'Verified Quality', 'feat.qual.d': 'Every account is verified. Free replacement during warranty period',
    'feat.price.t': 'Best Prices', 'feat.price.d': 'Direct sourcing with no middlemen. Most competitive prices available',
    'feat.custom.t': 'Custom Selection', 'feat.custom.d': 'Choose specific numbers and details to match your requirements',
    'cta.t': 'Ready to Get Started?', 'cta.d': 'Premium digital accounts delivered instantly. Trusted by thousands worldwide.',
    'cta.btn': 'Shop Now',
    'footer.brand': 'Your trusted source for premium digital accounts and professional web services.',
    'footer.links': 'Quick Links', 'footer.store': 'Visit Store', 'footer.browse': 'Browse Products', 'footer.why': 'Why Choose Us',
    'footer.support': 'Support', 'footer.contact': 'Contact Us', 'footer.faq': 'FAQ', 'footer.rights': 'All rights reserved.',
    'announce': '★ Instant Delivery on All Orders ★ Premium Quality Guaranteed ★ 24/7 Support ★ Best Prices Online',
  },
  zh: {
    'nav.shop': '商品', 'nav.why': '优势', 'nav.store': '进入商城',
    'hero.eyebrow': '优质数字账号', 'hero.title1': '精选', 'hero.title2': '数字资源',
    'hero.sub': '严选优质数字账号与专业网站服务，一站式解决，即买即用。',
    'hero.btn': '浏览全部',
    'stats.cats': '分类', 'stats.prods': '商品', 'stats.opts': '规格', 'stats.del': '发货',
    'sec.title': '全部商品', 'sec.desc': '浏览我们严选的优质数字账号与服务',
    'filter.all': '全部', 'filter.gv': 'GV靓号', 'filter.gmail': '谷歌邮箱', 'filter.apple': '苹果ID', 'filter.svc': '服务类',
    'cat.gv': 'GV靓号', 'cat.gmail': '谷歌邮箱', 'cat.apple': '苹果ID', 'cat.svc': '服务类',
    'feat.deli.t': '即时发货', 'feat.deli.d': '付款后自动发货，无需等待人工处理',
    'feat.qual.t': '品质保障', 'feat.qual.d': '每个账号均经过验证，质保期内免费更换',
    'feat.price.t': '源头价格', 'feat.price.d': '一手资源直供，无中间商差价，价格更优',
    'feat.custom.t': '可选靓号', 'feat.custom.d': '支持自选号码和账号详情，精准匹配需求',
    'cta.t': '找到你需要的账号了吗？', 'cta.d': '优质数字账号即买即用，数千用户信赖之选。',
    'cta.btn': '立即购买',
    'footer.brand': '您值得信赖的优质数字账号与专业网站服务平台。',
    'footer.links': '快速链接', 'footer.store': '进入商城', 'footer.browse': '浏览商品', 'footer.why': '为什么选择我们',
    'footer.support': '客户支持', 'footer.contact': '联系我们', 'footer.faq': '常见问题', 'footer.rights': '保留所有权利。',
    'announce': '★ 全场即时发货 ★ 品质保障 ★ 24小时在线客服 ★ 超值优惠价格',
  }
};
let currentLang = 'en';
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('tirnx_lang', lang);
  const t = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('.announce .marquee span').forEach(s => s.textContent = t['announce']);
  const label = document.getElementById('lang-label');
  if (label) label.textContent = lang === 'en' ? '中文' : 'EN';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}
function toggleLang() { setLang(currentLang === 'en' ? 'zh' : 'en'); }
`;

function main() {
    const config = loadJSON('config.json') || {};
    const categories = loadJSON('categories.json') || [];
    const products = loadJSON('products.json') || [];
    const meta = loadJSON('meta.json') || {};

    if (!products.length) { console.error('No product data'); process.exit(1); }

    const siteUrl = meta.siteUrl || process.env.SITE_URL;
    const siteName = SITE_TITLE;
    const GITHUB_PAGES_URL = process.env.GITHUB_PAGES_URL || SEO_CANONICAL;

    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    function shortCatName(name) {
        return name
            .replace(/谷歌美国电话\/?/i, '')
            .replace(/GoogleVoice\s*\/?\s*GV靓号/i, 'GV Numbers')
            .replace(/谷歌邮箱\s*\/?\s*油管\s*\/?\s*Google\s*\/?\s*Gmail/i, 'Gmail')
            .replace(/苹果id\s*\/?\s*Apple\s*id\s*\/?\s*AppStore/i, 'Apple ID')
            .replace(/服务类/i, 'Services')
            .trim() || name;
    }

    const activeCats = categories.filter(c => products.some(p => p.category_id === c.id));
    const catBtns = activeCats
        .sort((a, b) => (b.sort || 0) - (a.sort || 0))
        .map(c => `<button class="filter-btn" onclick="filterCategory(${c.id}, this)">${esc(shortCatName(c.name))}</button>`)
        .join('\n          ');

    const cards = products.filter(p => p.active !== 0).sort((a, b) => (b.sort||0) - (a.sort||0)).map((p, i) => {
        const cat = categories.find(c => c.id === p.category_id);
        const catName = cat ? shortCatName(cat.name) : '';
        const img = p.image_url ? fixImg(p.image_url, siteUrl) : '';
        const variants = p.variants || [];
        const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;
        const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const cleanTag = t => t.replace(/b[12]#[0-9a-fA-F]{3,6}/g, '').replace(/#[0-9a-fA-F]{3,6}$/g, '').replace(/\s+/g, ' ').trim();
        const tagLabel = cleanTag(tags[0] || '');
        return `
          <a class="product-card reveal" href="${siteUrl}/product?id=${p.id}" target="_blank" rel="noopener" data-cat="${p.category_id}">
            <div class="card-img">
              ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy">` : ''}
              ${tagLabel ? `<div class="card-badge">${esc(tagLabel)}</div>` : ''}
            </div>
            <div class="card-body">
              <div class="card-cat">${esc(catName)}</div>
              <div class="card-title">${esc(p.name)}</div>
              <div class="card-bottom">
                <div class="card-price"><span class="from">from </span>¥${minPrice.toFixed(2)}</div>
                <div class="card-arrow">→</div>
              </div>
            </div>
          </a>`;
    }).join('\n');

    const heroImg = products[0]?.image_url ? fixImg(products[0].image_url, siteUrl) : '';
    const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", "name": siteName, "description": SEO_DESC, "url": GITHUB_PAGES_URL, "potentialAction": { "@type": "SearchAction", "target": `${siteUrl}/product?id={search_term_string}`, "query-input": "required name=search_term_string" } };
    const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", "itemListElement": products.filter(p => p.active !== 0).map((p, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Product", "name": p.name, "url": `${siteUrl}/product?id=${p.id}`, "image": p.image_url ? fixImg(p.image_url, siteUrl) : '', "offers": { "@type": "Offer", "price": p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0, "priceCurrency": "CNY" } } })) };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(siteName)}${SEO_TITLE_SUFFIX ? ' — ' + esc(SEO_TITLE_SUFFIX) : ''}</title>
  <meta name="description" content="${esc(SEO_DESC)}">
  <meta name="keywords" content="${esc(SEO_KEYWORDS)}">
  <meta name="author" content="${esc(SEO_AUTHOR)}">
  <meta name="robots" content="${esc(SEO_ROBOTS)}">
  ${SEO_CANONICAL ? `<link rel="canonical" href="${esc(SEO_CANONICAL)}">` : ''}
  <meta property="og:type" content="${esc(SEO_OG.type || 'website')}">
  <meta property="og:url" content="${esc(SEO_OG.url || GITHUB_PAGES_URL)}">
  <meta property="og:title" content="${esc(siteName)}">
  <meta property="og:description" content="${esc(SEO_DESC)}">
  ${heroImg ? `<meta property="og:image" content="${esc(heroImg)}">` : ''}
  <meta property="og:locale" content="${esc(SEO_OG.locale || 'en_US')}">
  <meta property="og:site_name" content="${esc(SEO_OG.siteName || siteName)}">
  <meta name="twitter:card" content="${esc(SEO_TWITTER.card || 'summary_large_image')}">
  <meta name="twitter:title" content="${esc(siteName)}">
  <meta name="twitter:description" content="${esc(SEO_DESC)}">
  ${heroImg ? `<meta name="twitter:image" content="${esc(heroImg)}">` : ''}
  <script type="application/ld+json">${JSON.stringify({...SEO_JSON_LD, ...jsonLd})}</script>
  <script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
  ${SEO_FAVICON ? `<link rel="icon" href="${esc(SEO_FAVICON)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>

<div class="announce">
  <div class="marquee">
    <span>★ Instant Delivery on All Orders</span>
    <span>★ Premium Quality Guaranteed</span>
    <span>★ 24/7 Customer Support</span>
    <span>★ Best Prices Online</span>
    <span>★ Instant Delivery on All Orders</span>
    <span>★ Premium Quality Guaranteed</span>
    <span>★ 24/7 Customer Support</span>
    <span>★ Best Prices Online</span>
  </div>
</div>

<nav class="nav" id="nav">
  <div class="nav-inner">
    <div class="logo">
      <a href="${GITHUB_PAGES_URL || '#'}">
        ${meta.siteLogo ? `<img src="${esc(fixImg(meta.siteLogo, siteUrl))}" alt="${esc(siteName)}">` : ''}
        <span>${esc(siteName)}</span>
      </a>
    </div>
    <div class="nav-center">
      <a href="#products" data-i18n="nav.shop">Shop</a>
      <a href="#features" data-i18n="nav.why">Why Us</a>
    </div>
    <div class="nav-right">
      <button class="lang-toggle" onclick="toggleLang()" aria-label="Switch language"><span class="globe">🌐</span><span id="lang-label">中文</span></button>
      <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-cta" data-i18n="nav.store">Visit Store</a>
    </div>
  </div>
</nav>

<section class="hero">
  ${heroImg ? `<div class="hero-bg" style="background-image:url('${esc(heroImg)}')"></div>` : ''}
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-eyebrow" data-i18n="hero.eyebrow">Premium Digital Accounts</div>
    <h1><span data-i18n="hero.title1">Digital</span><br><em data-i18n="hero.title2">Essentials</em></h1>
    <p class="hero-sub" data-i18n="hero.sub">Curated selection of premium digital accounts and professional web services. Delivered instantly.</p>
    <a href="#products" class="hero-btn" data-i18n="hero.btn">Explore Collection</a>
  </div>
</section>

<div class="stats">
  <div class="stat"><div class="stat-num">${categories.length}</div><div class="stat-lbl" data-i18n="stats.cats">Categories</div></div>
  <div class="stat"><div class="stat-num">${products.filter(p=>p.active!==0).length}</div><div class="stat-lbl" data-i18n="stats.prods">Products</div></div>
  <div class="stat"><div class="stat-num">${products.reduce((s,p) => s + (p.variants?.length||0), 0)}</div><div class="stat-lbl" data-i18n="stats.opts">Options</div></div>
  <div class="stat"><div class="stat-num">24h</div><div class="stat-lbl" data-i18n="stats.del">Delivery</div></div>
</div>

<div id="products">
  <div class="sec-header">
    <h2 data-i18n="sec.title">The Collection</h2>
    <p data-i18n="sec.desc">Browse our curated selection of premium digital accounts and services</p>
    <div class="sec-line"></div>
  </div>
  <div class="filter-bar">
    <button class="filter-btn active" onclick="filterCategory('all', this)" data-i18n="filter.all">All</button>
    ${catBtns}
  </div>
  <section class="products-section">
    <div class="container"><div class="products-grid">${cards}</div></div>
  </section>
</div>

<section class="features" id="features">
  <div class="container">
    <div class="features-grid">
      <div class="feat reveal"><div class="feat-icon">⚡</div><h3 data-i18n="feat.deli.t">Instant Delivery</h3><p data-i18n="feat.deli.d">Automated system ensures you receive accounts immediately after purchase</p></div>
      <div class="feat reveal"><div class="feat-icon">◆</div><h3 data-i18n="feat.qual.t">Verified Quality</h3><p data-i18n="feat.qual.d">Every account is verified. Free replacement during warranty period</p></div>
      <div class="feat reveal"><div class="feat-icon">$</div><h3 data-i18n="feat.price.t">Best Prices</h3><p data-i18n="feat.price.d">Direct sourcing with no middlemen. Most competitive prices available</p></div>
      <div class="feat reveal"><div class="feat-icon">◎</div><h3 data-i18n="feat.custom.t">Custom Selection</h3><p data-i18n="feat.custom.d">Choose specific numbers and details to match your requirements</p></div>
    </div>
  </div>
</section>

<section class="cta">
  <h2 data-i18n="cta.t">Ready to Get Started?</h2>
  <p data-i18n="cta.d">Premium digital accounts delivered instantly. Trusted by thousands worldwide.</p>
  <a href="${siteUrl}" target="_blank" rel="noopener" class="cta-btn" data-i18n="cta.btn">Shop Now</a>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="logo">${esc(siteName)}</div>
        <p data-i18n="footer.brand">Your trusted source for premium digital accounts and professional web services.</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.links">Quick Links</h4>
        <a href="${siteUrl}" target="_blank" rel="noopener" data-i18n="footer.store">Visit Store</a>
        <a href="#products" data-i18n="footer.browse">Browse Products</a>
        <a href="#features" data-i18n="footer.why">Why Choose Us</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.support">Support</h4>
        <a href="${siteUrl}" target="_blank" rel="noopener" data-i18n="footer.contact">Contact Us</a>
        <a href="${siteUrl}" target="_blank" rel="noopener" data-i18n="footer.faq">FAQ</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${esc(siteName)}. <span data-i18n="footer.rights">All rights reserved.</span></p>
      <p><a href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a></p>
    </div>
  </div>
</footer>

<script>${JS}</script>
</body>
</html>`;

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
    console.log(`✅ dist/index.html (${(Buffer.byteLength(html)/1024).toFixed(1)}KB)`);
    console.log(`   Products: ${products.filter(p=>p.active!==0).length}`);
    console.log(`   Categories: ${activeCats.length}`);
    console.log(`   Style: Keychron-inspired clean`);
}

main();
