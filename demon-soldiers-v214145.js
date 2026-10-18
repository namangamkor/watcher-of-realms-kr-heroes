(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  function matches(item, state) {
    if (state.rarity && item.rarity !== state.rarity) return false;
    if (state.family && item.family !== state.family) return false;
    if (state.armor && item.armor !== state.armor) return false;
    if (state.role && !item.roles.includes(state.role)) return false;
    const terms = String(state.q || '').trim().split(/\s+/).map(normalize).filter(Boolean);
    const haystack = normalize([item.nameKr, item.nameEn, ...(item.aliasesEn || []), item.familyKr, item.armorKr, ...item.roles, item.introductionKr, item.featuredSkill.nameKr].join(' '));
    return terms.every(term => haystack.includes(term));
  }
  function compare(a, b, sort) {
    if (sort === 'energy') return a.energy - b.energy || a.nameKr.localeCompare(b.nameKr, 'ko');
    if (sort === 'kr') return a.nameKr.localeCompare(b.nameKr, 'ko');
    if (sort === 'en') {
      if (!a.nameEn || !b.nameEn) return Number(!a.nameEn) - Number(!b.nameEn);
      return a.nameEn.localeCompare(b.nameEn, 'en');
    }
    return a.order - b.order;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { normalize, matches, compare };
  if (typeof document === 'undefined') return;
  const dataNode = document.getElementById('demonData');
  const form = document.getElementById('demonFilters');
  if (!dataNode || !form) return;
  let items;
  try { items = JSON.parse(dataNode.textContent).map((item, order) => ({ ...item, order })); } catch (_) { return; }
  const cards = new Map(items.map(item => [item.id, document.getElementById(item.id)]));
  const groups = [...document.querySelectorAll('[data-demon-group]')];
  const buttons = [...form.querySelectorAll('[data-rarity]')];
  const resultCount = document.getElementById('resultCount');
  const empty = document.getElementById('emptyState');
  const controls = { q: form.elements.namedItem('q'), family: form.elements.namedItem('family'), armor: form.elements.namedItem('armor'), role: form.elements.namedItem('role'), sort: form.elements.namedItem('sort') };
  let rarity = '';
  function state() { return Object.fromEntries([['rarity', rarity], ...Object.entries(controls).map(([key, el]) => [key, el.value])]); }
  function setRarity(value) {
    rarity = ['captain', 'legendary', 'epic'].includes(value) ? value : '';
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.rarity === rarity)));
  }
  function syncUrl(current) {
    const url = new URL(location.href);
    for (const key of ['q', 'rarity', 'family', 'armor', 'role', 'sort']) {
      const value = current[key];
      if (value && !(key === 'sort' && value === 'default')) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    const selected = cards.get(decodeHash(url.hash));
    if (selected && selected.hidden) url.hash = '';
    try { history.replaceState(null, '', url); } catch (_) {}
  }
  function render(updateUrl = true) {
    const current = state();
    const visible = items.filter(item => matches(item, current));
    const ids = new Set(visible.map(item => item.id));
    for (const [id, card] of cards) if (card) card.hidden = !ids.has(id);
    groups.forEach(group => {
      const members = visible.filter(item => item.rarity === group.dataset.demonGroup).sort((a, b) => compare(a, b, current.sort));
      group.hidden = members.length === 0;
      group.querySelector('[data-group-count]').textContent = String(members.length);
      const grid = group.querySelector('.demon-grid');
      members.forEach(item => { const card = cards.get(item.id); if (card) grid.appendChild(card); });
    });
    resultCount.textContent = visible.length + '종 / 전체 ' + items.length + '종';
    empty.hidden = visible.length !== 0;
    if (updateUrl) syncUrl(current);
  }
  function reset() {
    form.reset();
    setRarity('');
    render();
  }
  function decodeHash(hash) { try { return decodeURIComponent(hash.replace(/^#/, '')); } catch (_) { return ''; } }
  function revealHash() {
    const card = cards.get(decodeHash(location.hash));
    if (!card) return;
    if (card.hidden) { form.reset(); setRarity(''); render(); }
    const details = card.querySelector('details');
    if (details) details.open = true;
    requestAnimationFrame(() => card.scrollIntoView({ block: 'start', behavior: 'auto' }));
  }
  function restore() {
    const params = new URL(location.href).searchParams;
    setRarity(params.get('rarity'));
    for (const [key, control] of Object.entries(controls)) {
      const value = params.get(key) || (key === 'sort' ? 'default' : '');
      control.value = key === 'q' ? value : [...control.options].some(option => option.value === value) ? value : (key === 'sort' ? 'default' : '');
    }
    render(false);
    revealHash();
  }
  buttons.forEach(button => button.addEventListener('click', () => { setRarity(button.dataset.rarity); render(); }));
  form.addEventListener('input', event => { if (event.target === controls.q) render(); });
  form.addEventListener('change', () => render());
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  document.querySelectorAll('[data-reset-demons]').forEach(button => button.addEventListener('click', reset));
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('popstate', restore);
  form.hidden = false;
  restore();
})(typeof globalThis === 'undefined' ? this : globalThis);
