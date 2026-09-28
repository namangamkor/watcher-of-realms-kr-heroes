#!/usr/bin/env node
// Synchronize the hero views from heroes.json. Run from any directory.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const check = process.argv.includes('--check');
const versionIndex = process.argv.indexOf('--version');
const version = versionIndex >= 0 ? process.argv[versionIndex + 1] : '2.14.75';
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('usage: node generate-hero-seo-assets.mjs [--version 2.14.76] [--check]');
const files = Object.fromEntries(['heroes.json', '_worker.js', 'app.js', 'index.html', 'sitemap.xml'].map(n => [n, fs.readFileSync(path.join(root, n), 'utf8')]));
const heroes = JSON.parse(files['heroes.json']);
function need(ok, message) { if (!ok) throw new Error(message); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function replaceOnce(text, pattern, replacement, label) {
  const matches = [...text.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'))];
  need(matches.length === 1, `${label}: expected one block, found ${matches.length}`);
  return text.replace(pattern, replacement);
}
need(Array.isArray(heroes) && heroes.length > 0, 'heroes.json must contain heroes');
const ids = new Set(), updates = [], updateIds = new Set();
for (const hero of heroes) {
  need(/^[a-z0-9-]+$/.test(hero.id || '') && !ids.has(hero.id), `invalid or duplicate hero id: ${hero.id}`);
  ids.add(hero.id);
  need(hero.nameKr && hero.nameEn && hero.class && hero.rarity && Array.isArray(hero.memberships) && hero.memberships.length, `missing hero fields: ${hero.id}`);
  need(Array.isArray(hero.factions) && hero.memberships.every(m => (hero.factions.includes(m.faction) || (m.faction === "" && hero.factions.length === 0)) && Number.isFinite(m.sortOrder) && m.factionKr && m.portrait), `invalid membership: ${hero.id}`);
  for (const membership of hero.memberships) {
    const image = membership.portrait.replace(/^\.\//, '');
    need(!image.includes('..') && fs.existsSync(path.join(root, image)), `missing image: ${hero.id} ${image}`);
  }
  for (const item of hero.wikiUpdates || []) {
    need(item.id && !updateIds.has(item.id) && Number.isInteger(item.timestamp) && item.timestamp > 0 && item.message && item.kind && item.kindLabel, `invalid/duplicate wiki update: ${hero.id}`);
    updateIds.add(item.id);
    updates.push({id:item.id,kind:item.kind,kindLabel:item.kindLabel,heroId:hero.id,heroName:hero.nameKr,message:item.message,timestamp:item.timestamp});
  }
}
let worker = files['_worker.js'];
worker = replaceOnce(worker, /const HEROES = [^\n]*;\n\nconst CONTENT_META/, `const HEROES = ${JSON.stringify(Object.fromEntries(heroes.map(h => [h.id, h])))};\n\nconst CONTENT_META`, 'Worker heroes');
worker = replaceOnce(worker, /const WW_HERO_EDITORIAL_UPDATES = \[[\s\S]*?\];\n\nconst WW_SITE_UPDATES/, `const WW_HERO_EDITORIAL_UPDATES = ${JSON.stringify(updates, null, 2)};\n\nconst WW_SITE_UPDATES`, 'Worker updates');
// Keep established card markup for existing heroes; add a matching minimal card for each new hero.
const htmlMatch = worker.match(/const HOME_INDEX_HTML = ("[\s\S]*?");\nconst HEROES =/);
need(htmlMatch, 'Worker home HTML block missing');
let html = JSON.parse(htmlMatch[1]);
const startMarker = '<div id="heroGrid" class="hero-grid" aria-live="polite">';
const endMarker = html.includes('id="loadMoreHeroes"') ? '\n</div>\n      <button id="loadMoreHeroes"' : '\n</div>\n\n      <div id="emptyState"';
const start = html.indexOf(startMarker), end = html.indexOf(endMarker, start);
need(start >= 0 && end > start, 'home hero grid markers missing');
const before = html.slice(0, start + startMarker.length), after = html.slice(end);
let cards = html.slice(start + startMarker.length, end).match(/<a class="hero-card-link" href="\/hero\/[a-z0-9-]+\/"[\s\S]*?<\/a>/g) || [];
const cardIds = cards.map(c => c.match(/href="\/hero\/([^/]+)\/"/)[1]);
need(new Set(cardIds).size === cards.length && cardIds.every(id => ids.has(id)), 'home contains duplicate or unknown hero cards');
const cardMap = new Map(cards.map((card, i) => [cardIds[i], card]));
function newCard(hero) {
  const m = hero.memberships[0];
  const title = `${escapeHtml(hero.nameKr)} (${escapeHtml(hero.nameEn)})`;
  const tag = hero.rarity === '전설' ? 'legendary' : hero.rarity === '에픽' ? 'epic' : 'rare';
  const lord = m.lord ? '<span class="tag lord">영주</span>' : '';
  const dual = hero.memberships.length > 1 ? '<span class="tag dual">이중 진영</span>' : '';
  return `<a class="hero-card-link" href="/hero/${hero.id}/" aria-label="${title} 상세 보기">\n  <article class="hero-card"><div class="card-visual"><img src="${escapeHtml(m.portrait)}" alt="${title} 영웅 카드" loading="lazy"></div><div class="card-body"><div class="card-topline">${lord}<span class="tag ${tag}">${escapeHtml(hero.rarity)}</span>${dual}</div><h3>${escapeHtml(hero.nameKr)}</h3><p class="en">${escapeHtml(hero.nameEn)}</p><p class="meta">${escapeHtml(hero.class)} · ${escapeHtml(m.factionKr)}</p></div></article>\n</a>`;
}
for (const hero of heroes) if (!cardMap.has(hero.id)) cardMap.set(hero.id, newCard(hero));
// Existing visual details are preserved, but the image/name fields follow heroes.json.
for (const hero of heroes) {
  let card = cardMap.get(hero.id);
  const m = hero.memberships[0], title = `${escapeHtml(hero.nameKr)} (${escapeHtml(hero.nameEn)})`;
  need(/<img src="[^"]+" alt="[^"]+" loading="lazy">/.test(card), `unrecognized portrait markup: ${hero.id}`);
  card = card.replace(/<img src="[^"]+" alt="[^"]+" loading="lazy">/, `<img src="${escapeHtml(m.portrait)}" alt="${title} 영웅 카드" loading="lazy">`);
  card = card.replace(/aria-label="[^"]* 상세 보기"/, `aria-label="${title} 상세 보기"`);
  card = card.replace(/<h3>[^<]*<\/h3>/, `<h3>${escapeHtml(hero.nameKr)}</h3>`).replace(/<p class="en">[^<]*<\/p>/, `<p class="en">${escapeHtml(hero.nameEn)}</p>`);
  cardMap.set(hero.id, card);
}
// The full rank is stored in app.js; the server sends only the first page.
const rankMatch = files['app.js'].match(/const heroDisplayOrder = (\[[^;]*\]);/);
need(rankMatch, 'full hero order missing');
const savedOrder = JSON.parse(rankMatch[1]);
need(new Set(savedOrder).size === savedOrder.length && savedOrder.every(id => ids.has(id)), 'invalid hero order');
const orderedIds = [...heroes.filter(h => !savedOrder.includes(h.id)).map(h => h.id), ...savedOrder];
html = before + '\n' + orderedIds.slice(0, 20).map(id => cardMap.get(id)).join('\n') + after;
if (!html.includes('id="loadMoreHeroes"')) {
  html = html.replace(endMarker, `\n</div>\n      <button id="loadMoreHeroes" class="load-more-heroes" type="button">더 보기 · 20/${heroes.length}명</button>\n\n      <div id="emptyState"`);
}
if (!html.includes('.load-more-heroes{')) {
  html = html.replace('</style>', '.load-more-heroes{display:block;margin:28px auto 12px;padding:13px 28px;border:1px solid #b8a46c;border-radius:10px;background:#1d1a2d;color:#f5ebce;font:inherit;font-weight:700;cursor:pointer}\n.load-more-heroes:hover{background:#302845}\n.load-more-heroes[hidden]{display:none}\n</style>');
}
html = html.replace(/<meta name="worwiki-patch-version" content="[^"]+">/, `<meta name="worwiki-patch-version" content="${version}">`);
worker = worker.replace(htmlMatch[0], `const HOME_INDEX_HTML = ${JSON.stringify(html)};\nconst HEROES =`);
need(JSON.parse(worker.match(/const HOME_INDEX_HTML = ("[\s\S]*?");\nconst HEROES =/)[1]) === html, 'home serialization mismatch');
const counts = {all: heroes.length};
for (const hero of heroes) for (const m of hero.memberships) counts[m.faction] = (counts[m.faction] || 0) + 1;
function syncCounts(input) {
  let result = input.replace(/(<strong id="visibleCount">)\d+(<\/strong>)/, `$1${Math.min(20, heroes.length)}$2`).replace(/(<span id="totalCount">)\d+(<\/span>)/, `$1${heroes.length}$2`);
  result = result.replace(/(<p id="resultSummary">)[\s\S]*?(<\/p>)/, `$1고유 영웅 ${heroes.length}명 등록 완료$2`);
  result = result.replace(/(고유 영웅 )\d+(명 등록 완료)/g, `$1${heroes.length}$2`);
  for (const [id, count] of Object.entries(counts)) {
    const pattern = new RegExp(`(<button[^>]*data-faction="${id}"[^>]*>[\\s\\S]*?<span(?: id="allHeroesOptionCount")? class="faction-option-count">)\\d+명(<\\/span>)`);
    result = result.replace(pattern, `$1${count}명$2`);
  }
  return result;
}
// The Worker home is the deployed home. Publish the same HTML as index.html to remove stale fallback markup.
html = syncCounts(html).replace(/\/app\.js\?v=[^"\s]+/g, `/app.js?v=${version}`);
need(html.includes(`/app.js?v=${version}`), "home app.js cache version not found");
worker = worker.replace(/const HOME_INDEX_HTML = ("[\s\S]*?");\nconst HEROES =/, `const HOME_INDEX_HTML = ${JSON.stringify(html)};\nconst HEROES =`);
let app = files['app.js'].replace(/const heroDisplayOrder = \[[^;]*\];/, `const heroDisplayOrder = ${JSON.stringify(orderedIds)};`).replace(/(fetch\("(?:\.\/heroes\.json|\/api\/recent-updates)\?v=)[^" ]+/g, `$1${version}`);
need(app.includes(`heroes.json?v=${version}`) && app.includes(`recent-updates?v=${version}`), 'app fetch versions not updated');
const oldEntries = [...files['sitemap.xml'].matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)];
const oldDates = new Map(oldEntries.map(x => [x[1], x[2]]));
const oldUrls = [...oldDates.keys()];
const staticUrls = oldUrls.filter(url => !url.startsWith('https://worwiki.kr/hero/'));
need(staticUrls.includes('https://worwiki.kr/') && new Set(staticUrls).size === staticUrls.length, 'sitemap static pages invalid');
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = [...staticUrls, ...heroes.map(h => `https://worwiki.kr/hero/${h.id}/`).sort()];
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...sitemapUrls.flatMap(url => ['  <url>', `    <loc>${url}</loc>`, `    <lastmod>${oldDates.get(url) || today}</lastmod>`, '  </url>']), '</urlset>', ''].join('\n');
const outputs = {'_worker.js':worker,'app.js':app,'index.html':html,'sitemap.xml':sitemap};
const changed = Object.entries(outputs).filter(([name, content]) => content !== files[name]).map(([name]) => name);
if (check) { need(changed.length === 0, `out of sync: ${changed.join(', ')}`); }
else for (const name of changed) fs.writeFileSync(path.join(root, name), outputs[name]);
console.log(`${check ? 'checked' : 'generated'}: ${heroes.length} heroes, ${updates.length} hero updates, ${sitemapUrls.length} URLs; changed: ${changed.join(', ') || 'none'}`);
