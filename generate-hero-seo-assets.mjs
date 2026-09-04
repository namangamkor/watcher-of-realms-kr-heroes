#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://watcher-of-realms-kr-heroes.pages.dev";
const LASTMOD = "2026-09-04";

const heroesPath = path.join(ROOT, "heroes.json");
const workerPath = path.join(ROOT, "_worker.js");
const sitemapPath = path.join(ROOT, "sitemap.xml");
const indexPath = path.join(ROOT, "index.html");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getTopicParticle(word = "") {
  const trimmed = String(word).trim();
  if (!trimmed) return "는";
  const code = trimmed.charCodeAt(trimmed.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "는";
  return ((code - 0xac00) % 28) === 0 ? "는" : "은";
}

function buildWorkerData(heroes) {
  const out = {};
  for (const hero of heroes) {
    const memberships = hero.memberships || [];
    const primary = memberships[0] || {};
    out[hero.id] = {
      id: hero.id,
      nameKr: hero.nameKr || "",
      nameEn: hero.nameEn || "",
      rarity: hero.rarity || "",
      class: hero.class || "",
      portrait: (primary.portrait || "").replace(/^\.\//, "/"),
      memberships: memberships.map((m) => ({
        kr: m.factionKr || "",
        en: m.factionEn || "",
        lord: Boolean(m.lord),
      })),
      contentTags: hero.contentTags || [],
      details: hero.details || null,
    };
  }
  return out;
}

function buildFactionTotals(heroes) {
  const totals = { all: heroes.length };
  for (const hero of heroes) {
    for (const membership of hero.memberships || []) {
      const id = membership.faction;
      if (!id) continue;
      totals[id] = (totals[id] || 0) + 1;
    }
  }
  return totals;
}

function rebuildWorker(currentWorker, heroes) {
  const heroJsonText = JSON.stringify(buildWorkerData(heroes));
  const pattern = /const HEROES = .*?;\n\nconst CONTENT_META/s;
  assert(pattern.test(currentWorker), "failed to locate HEROES data block in _worker.js");
  return currentWorker.replace(
    pattern,
    `const HEROES = ${heroJsonText};\n\nconst CONTENT_META`
  );
}

function buildSitemap(heroes) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${SITE}/</loc>`,
    `    <lastmod>${LASTMOD}</lastmod>`,
    '  </url>',
  ];

  const sorted = [...heroes].sort((a, b) => a.id.localeCompare(b.id));
  for (const hero of sorted) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE}/hero/${hero.id}/</loc>`);
    lines.push(`    <lastmod>${LASTMOD}</lastmod>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

function syncIndexHtml(indexHtml, heroCount, totals) {
  let html = indexHtml;
  html = html.replace(/(<strong id="visibleCount">)\d+(<\/strong>)/, `$1${heroCount}$2`);
  html = html.replace(/(<span id="totalCount">)\d+(<\/span>)/, `$1${heroCount}$2`);
  html = html.replace(/(<p id="resultSummary">)[\s\S]*?(<\/p>)/, `$1고유 영웅 ${heroCount}명 등록 완료$2`);
  html = html.replace(
    /(<div id="dataNote" class="data-note">)[\s\S]*?(<\/div>)/,
    `$1\n        고유 영웅 ${heroCount}명 등록 완료 · 한국명과 영문명을 함께 검색할 수 있습니다.\n      $2`
  );

  for (const [factionId, total] of Object.entries(totals)) {
    const escapedFactionId = factionId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(<button[^>]*data-faction="${escapedFactionId}"[^>]*>[\\s\\S]*?<span(?: id="allHeroesOptionCount")? class="faction-option-count">)\\d+명(<\\/span>)`
    );
    html = html.replace(pattern, `$1${total}명$2`);
  }

  return html;
}

function main() {
  const heroes = readJson(heroesPath);
  assert(Array.isArray(heroes), "heroes.json must be an array");
  assert(heroes.length > 0, "heroes.json is empty");

  const ids = heroes.map((hero) => hero.id);
  const uniqueIds = new Set(ids);
  assert(ids.length === uniqueIds.size, "duplicate hero ids found");

  for (const hero of heroes) {
    assert(hero.id && hero.nameKr && hero.nameEn, `missing core fields: ${JSON.stringify(hero)}`);
  }

  const currentWorker = fs.readFileSync(workerPath, "utf8");
  const totals = buildFactionTotals(heroes);
  const indexHtml = fs.readFileSync(indexPath, "utf8");

  fs.writeFileSync(workerPath, rebuildWorker(currentWorker, heroes), "utf8");
  fs.writeFileSync(sitemapPath, buildSitemap(heroes), "utf8");
  fs.writeFileSync(indexPath, syncIndexHtml(indexHtml, heroes.length, totals), "utf8");

  const sitemapUrlCount = (fs.readFileSync(sitemapPath, "utf8").match(/<url>/g) || []).length;
  assert(sitemapUrlCount === heroes.length + 1, "sitemap url count mismatch");

  console.log(`synced OK · heroes=${heroes.length} · sitemapUrls=${sitemapUrlCount} · particleSample=${getTopicParticle("초선")}`);
}

main();
