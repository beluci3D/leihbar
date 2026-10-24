// Leihbar – Test-Website mit erfundenen Beispieldaten.
// Testinserate werden nur im localStorage des eigenen Browsers gespeichert und nirgendwohin gesendet.
(function () {
  const ICONS = {
    ski: 'M4 20 L20 4 M8 20 L20 8 M6 6 L9 9',
    wandern: 'M13 4 a2 2 0 1 0 0.01 0 M10 21 L12 14 L15 16 L15 21 M12 14 L11 9 L15 10 L17 13 M11 9 L8 12',
    camping: 'M3 20 L12 4 L21 20 Z M12 20 L12 13 L9 20',
    wasser: 'M3 16 C6 14 8 18 12 16 C16 14 18 18 21 16 M5 12 L19 8',
    rad: 'M6 17 a3.5 3.5 0 1 0 0.01 0 M18 17 a3.5 3.5 0 1 0 0.01 0 M6 17 L10 9 L15 9 L18 17 M10 9 L13 17 L15 9',
    klettern: 'M8 3 C4 8 4 16 8 21 M16 3 C20 8 20 16 16 21 M8 12 L16 12'
  };

  const CATS = [
    { id: 'ski', label: 'Ski & Snowboard', words: ['ski', 'snowboard', 'skiset', 'winter'] },
    { id: 'wandern', label: 'Wandern', words: ['wandern', 'rucksack', 'stöcke', 'stoecke', 'schuhe'] },
    { id: 'camping', label: 'Camping', words: ['zelt', 'camping', 'schlafsack'] },
    { id: 'wasser', label: 'Wassersport', words: ['sup', 'kajak', 'wasser', 'boot'] },
    { id: 'rad', label: 'Rad & E-Bike', words: ['rad', 'bike', 'fahrrad', 'e-bike'] },
    { id: 'klettern', label: 'Klettern', words: ['klettern', 'klettersteig', 'gurt'] }
  ];

  // Erfundene Beispieldaten
  const SAMPLES = [
    { title: 'Skiset Allmountain (Ski, Schuhe, Stöcke)', owner: 'Demo-Verleih Alpin', biz: true, dist: '1,2 km', rating: '4,8', price: 28, x: 22, y: 30, cat: 'ski' },
    { title: 'Snowboard 154 cm mit Bindung', owner: 'Lena (Beispiel)', biz: false, dist: '2,5 km', rating: '4,9', price: 15, x: 58, y: 22, cat: 'ski' },
    { title: 'Tourenski mit Fellen', owner: 'Demo-Bergsport', biz: true, dist: '3,1 km', rating: '4,7', price: 35, x: 70, y: 55, cat: 'ski' },
    { title: 'Kinderski 110 cm + Helm', owner: 'Tobias (Beispiel)', biz: false, dist: '4,0 km', rating: '5,0', price: 9, x: 35, y: 68, cat: 'ski' },
    { title: 'Trekkingrucksack 50 l', owner: 'Sara (Beispiel)', biz: false, dist: '1,8 km', rating: '4,6', price: 6, x: 45, y: 40, cat: 'wandern' },
    { title: 'Wanderstöcke Carbon', owner: 'Demo-Verleih Alpin', biz: true, dist: '1,2 km', rating: '4,8', price: 4, x: 22, y: 30, cat: 'wandern' },
    { title: 'Wanderschuhe Gr. 42', owner: 'Demo-Outdoorshop', biz: true, dist: '2,9 km', rating: '4,5', price: 7, x: 62, y: 62, cat: 'wandern' },
    { title: '3-Personen-Zelt', owner: 'Demo-Outdoorshop', biz: true, dist: '2,9 km', rating: '4,5', price: 14, x: 62, y: 62, cat: 'camping' },
    { title: 'Schlafsack bis −5 °C', owner: 'Mira (Beispiel)', biz: false, dist: '3,6 km', rating: '4,9', price: 7, x: 30, y: 52, cat: 'camping' },
    { title: 'SUP-Board aufblasbar', owner: 'Demo-Seeverleih', biz: true, dist: '5,4 km', rating: '4,7', price: 25, x: 68, y: 30, cat: 'wasser' },
    { title: 'Kajak Einsitzer', owner: 'Paul (Beispiel)', biz: false, dist: '6,0 km', rating: '4,8', price: 20, x: 75, y: 45, cat: 'wasser' },
    { title: 'E-Mountainbike Größe M', owner: 'Demo-Radverleih', biz: true, dist: '2,2 km', rating: '4,6', price: 45, x: 40, y: 25, cat: 'rad' },
    { title: 'Fahrradanhänger für Kinder', owner: 'Anna (Beispiel)', biz: false, dist: '1,5 km', rating: '5,0', price: 8, x: 28, y: 62, cat: 'rad' },
    { title: 'Klettergurt + Helm Set', owner: 'Demo-Kletterhalle', biz: true, dist: '3,3 km', rating: '4,7', price: 10, x: 55, y: 35, cat: 'klettern' },
    { title: 'Klettersteigset', owner: 'Felix (Beispiel)', biz: false, dist: '4,4 km', rating: '4,8', price: 8, x: 33, y: 70, cat: 'klettern' }
  ];

  const FILTERS = [
    { id: 'alle', label: 'Alle' },
    { id: 'gewerblich', label: 'Gewerblich' },
    { id: 'privat', label: 'Privat' }
  ];

  const KEY = 'leihbar-testinserate';
  const state = { cat: 'ski', filter: 'alle' };
  const $ = (id) => document.getElementById(id);
  const icon = (cat) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[cat] + '"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

  // --- Speicher (nur im eigenen Browser) ---
  function loadMine() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((i) => i && ICONS[i.cat]) : [];
    } catch (e) { return []; }
  }
  let mine = loadMine();
  let storageOk = true;
  function saveMine() {
    try { localStorage.setItem(KEY, JSON.stringify(mine)); storageOk = true; }
    catch (e) { storageOk = false; }
  }

  function allItems() {
    return mine.map((i) => ({ ...i, mine: true, biz: false })).concat(SAMPLES);
  }

  // --- Anzeige ---
  function renderCats() {
    const items = allItems();
    $('cats').innerHTML = CATS.map((c) => {
      const n = items.filter((i) => i.cat === c.id).length;
      return '<button type="button" class="cat" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        icon(c.id) + '<b>' + esc(c.label) + '</b><span>' + plural(n, 'Angebot', 'Angebote') + '</span></button>';
    }).join('');
  }

  function renderFilters() {
    $('filters').innerHTML = FILTERS.map((f) =>
      '<button type="button" data-filter="' + f.id + '" aria-pressed="' + (state.filter === f.id) + '">' + f.label + '</button>'
    ).join('');
  }

  function visible() {
    return allItems()
      .filter((i) => i.cat === state.cat)
      .filter((i) => state.filter === 'alle' || (state.filter === 'gewerblich' ? i.biz : !i.biz));
  }

  function kind(i) { return i.mine ? 'mine' : (i.biz ? 'biz' : 'priv'); }
  function badge(i) { return i.mine ? 'Dein Testinserat' : (i.biz ? 'Gewerblich' : 'Privat'); }

  function renderResults() {
    const list = visible();
    const cat = CATS.find((c) => c.id === state.cat);
    $('resultLine').textContent = plural(list.length, 'Angebot', 'Angebote') + ' für ' + cat.label + ' (Beispieldaten)';

    $('list').innerHTML = list.length ? list.map((i, k) => {
      const meta = i.mine ? (i.place ? esc(i.place) : 'Ort nicht angegeben') : i.dist;
      const sub = i.mine ? esc(i.owner) + ' · noch keine Bewertungen' : esc(i.owner) + ' · ★ ' + i.rating;
      return '<div class="item ' + kind(i) + '" data-k="' + k + '">' +
        '<div class="thumb">' + icon(i.cat) + '</div>' +
        '<div class="info"><div class="meta"><span class="badge">' + badge(i) + '</span><span>' + meta + '</span></div>' +
        '<span class="title">' + esc(i.title) + '</span>' +
        (i.mine && i.desc ? '<span class="desc">' + esc(i.desc) + '</span>' : '') +
        '<span class="owner">' + sub + '</span></div>' +
        '<div class="price"><b>' + Number(i.price) + ' €</b>pro Tag</div></div>';
    }).join('') : '<div class="empty">Keine Angebote mit diesem Filter.</div>';

    $('pins').innerHTML = list.map((i, k) =>
      '<span class="pin ' + kind(i) + '" data-k="' + k + '" style="left:' + Number(i.x) + '%;top:' + Number(i.y) + '%" title="' + esc(i.title) + '">' + Number(i.price) + ' €</span>'
    ).join('');
  }

  function renderMine() {
    if (!mine.length) { $('mine').innerHTML = ''; return; }
    $('mine').innerHTML = '<div class="mine-list"><h3>Deine Testinserate</h3>' +
      mine.map((i) =>
        '<div class="mine-row"><span>' + esc(i.title) + ' · ' + Number(i.price) + ' €/Tag</span>' +
        '<button type="button" data-del="' + esc(i.id) + '" aria-label="' + esc(i.title) + ' löschen">Löschen</button></div>'
      ).join('') +
      (mine.length > 1 ? '<button type="button" class="linkish" data-del="all">Alle löschen</button>' : '') +
      '</div>';
  }

  function render() { renderCats(); renderFilters(); renderResults(); renderMine(); }

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  // --- Interaktion ---
  $('cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
  });

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    renderFilters();
    renderResults();
  });

  function highlight(k, on) {
    document.querySelectorAll('[data-k="' + k + '"]').forEach((el) => el.classList.toggle('hl', on));
  }
  ['list', 'pins'].forEach((id) => {
    $(id).addEventListener('mouseover', (e) => { const el = e.target.closest('[data-k]'); if (el) highlight(el.dataset.k, true); });
    $(id).addEventListener('mouseout', (e) => { const el = e.target.closest('[data-k]'); if (el) highlight(el.dataset.k, false); });
  });

  $('search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('q').value.trim().toLowerCase();
    if (q) {
      const hit = CATS.find((c) => c.words.some((w) => q.includes(w) || w.includes(q)));
      if (hit) state.cat = hit.id;
    }
    render();
    $('karte').scrollIntoView({ behavior: 'smooth' });
  });

  // --- Testinserat ---
  $('catSelect').innerHTML = CATS.map((c) => '<option value="' + c.id + '">' + esc(c.label) + '</option>').join('');

  $('insertForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const title = f.title.value.trim();
    const owner = f.owner.value.trim();
    const price = Math.round(Number(f.price.value));
    const err = $('formError');

    if (!title) { err.textContent = 'Bitte gib an, was du verleihst.'; f.title.focus(); return; }
    if (!(price >= 1 && price <= 500)) { err.textContent = 'Bitte gib einen Preis zwischen 1 und 500 € an.'; f.price.focus(); return; }
    if (!owner) { err.textContent = 'Bitte gib einen Spitznamen an.'; f.owner.focus(); return; }
    if (!f.ok.checked) { err.textContent = 'Bitte bestätige, dass das nur ein Test ist.'; f.ok.focus(); return; }
    err.textContent = '';

    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: title.slice(0, 70),
      cat: ICONS[f.cat.value] ? f.cat.value : 'ski',
      price: price,
      owner: owner.slice(0, 30),
      place: f.place.value.trim().slice(0, 40),
      desc: f.desc.value.trim().slice(0, 300),
      x: 15 + Math.round(Math.random() * 70),
      y: 15 + Math.round(Math.random() * 60)
    };
    mine.unshift(item);
    if (mine.length > 20) mine = mine.slice(0, 20);
    saveMine();

    state.cat = item.cat;
    state.filter = 'alle';
    f.reset();
    render();
    $('karte').scrollIntoView({ behavior: 'smooth' });
    toast(storageOk
      ? 'Dein Testinserat ist online – nur in deinem Browser sichtbar.'
      : 'Testinserat angezeigt. Dein Browser erlaubt kein Speichern, nach dem Neuladen ist es weg.');
  });

  $('mine').addEventListener('click', (e) => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    mine = b.dataset.del === 'all' ? [] : mine.filter((i) => i.id !== b.dataset.del);
    saveMine();
    render();
    toast('Testinserat gelöscht.');
  });

  render();
})();
