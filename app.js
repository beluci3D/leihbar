// Leihbar – Vorschau mit Beispieldaten
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
    { id: 'wandern', label: 'Wandern', words: ['wandern', 'rucksack', 'stöcke', 'stoecke'] },
    { id: 'camping', label: 'Camping', words: ['zelt', 'camping', 'schlafsack'] },
    { id: 'wasser', label: 'Wassersport', words: ['sup', 'kajak', 'wasser', 'boot'] },
    { id: 'rad', label: 'Rad & E-Bike', words: ['rad', 'bike', 'fahrrad', 'e-bike'] },
    { id: 'klettern', label: 'Klettern', words: ['klettern', 'klettersteig', 'gurt'] }
  ];

  const ITEMS = [
    { title: 'Skiset Allmountain (Ski, Schuhe, Stöcke)', owner: 'Sport Alpin Verleih', biz: true, dist: '1,2 km', rating: '4,8', price: 28, x: 22, y: 30, cat: 'ski' },
    { title: 'Snowboard 154 cm mit Bindung', owner: 'Lena M.', biz: false, dist: '2,5 km', rating: '4,9', price: 15, x: 58, y: 22, cat: 'ski' },
    { title: 'Tourenski mit Fellen', owner: 'Bergsport Huber', biz: true, dist: '3,1 km', rating: '4,7', price: 35, x: 70, y: 55, cat: 'ski' },
    { title: 'Kinderski 110 cm + Helm', owner: 'Tobias K.', biz: false, dist: '4,0 km', rating: '5,0', price: 9, x: 35, y: 68, cat: 'ski' },
    { title: 'Trekkingrucksack 50 l', owner: 'Jonas R.', biz: false, dist: '1,8 km', rating: '4,6', price: 6, x: 45, y: 40, cat: 'wandern' },
    { title: 'Wanderstöcke Carbon', owner: 'Sport Alpin Verleih', biz: true, dist: '1,2 km', rating: '4,8', price: 4, x: 22, y: 30, cat: 'wandern' },
    { title: 'Wanderschuhe Gr. 42', owner: 'Outdoor Base', biz: true, dist: '2,9 km', rating: '4,5', price: 7, x: 62, y: 62, cat: 'wandern' },
    { title: '3-Personen-Zelt', owner: 'Outdoor Base', biz: true, dist: '2,9 km', rating: '4,5', price: 14, x: 62, y: 62, cat: 'camping' },
    { title: 'Schlafsack bis −5 °C', owner: 'Mira S.', biz: false, dist: '3,6 km', rating: '4,9', price: 7, x: 30, y: 52, cat: 'camping' },
    { title: 'SUP-Board aufblasbar', owner: 'Seeverleih Mayr', biz: true, dist: '5,4 km', rating: '4,7', price: 25, x: 68, y: 30, cat: 'wasser' },
    { title: 'Kajak Einsitzer', owner: 'Paul W.', biz: false, dist: '6,0 km', rating: '4,8', price: 20, x: 75, y: 45, cat: 'wasser' },
    { title: 'E-Mountainbike Größe M', owner: 'Radhaus Berger', biz: true, dist: '2,2 km', rating: '4,6', price: 45, x: 40, y: 25, cat: 'rad' },
    { title: 'Fahrradanhänger für Kinder', owner: 'Anna L.', biz: false, dist: '1,5 km', rating: '5,0', price: 8, x: 28, y: 62, cat: 'rad' },
    { title: 'Klettergurt + Helm Set', owner: 'Kletterhalle Nord', biz: true, dist: '3,3 km', rating: '4,7', price: 10, x: 55, y: 35, cat: 'klettern' },
    { title: 'Klettersteigset', owner: 'Felix B.', biz: false, dist: '4,4 km', rating: '4,8', price: 8, x: 33, y: 70, cat: 'klettern' }
  ];

  const FILTERS = [
    { id: 'alle', label: 'Alle' },
    { id: 'gewerblich', label: 'Gewerblich' },
    { id: 'privat', label: 'Privat' }
  ];

  const state = { cat: 'ski', filter: 'alle' };
  const $ = (id) => document.getElementById(id);
  const icon = (cat) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[cat] + '"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderCats() {
    $('cats').innerHTML = CATS.map((c) => {
      const n = ITEMS.filter((i) => i.cat === c.id).length;
      return '<button type="button" class="cat" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        icon(c.id) + '<b>' + esc(c.label) + '</b><span>' + n + (n === 1 ? ' Angebot' : ' Angebote') + '</span></button>';
    }).join('');
  }

  function renderFilters() {
    $('filters').innerHTML = FILTERS.map((f) =>
      '<button type="button" data-filter="' + f.id + '" aria-pressed="' + (state.filter === f.id) + '">' + f.label + '</button>'
    ).join('');
  }

  function visible() {
    return ITEMS
      .filter((i) => i.cat === state.cat)
      .filter((i) => state.filter === 'alle' || (state.filter === 'gewerblich' ? i.biz : !i.biz));
  }

  function renderResults() {
    const list = visible();
    const cat = CATS.find((c) => c.id === state.cat);
    $('resultLine').textContent = list.length + (list.length === 1 ? ' Angebot für ' : ' Angebote für ') + cat.label + ' in deiner Nähe';

    $('list').innerHTML = list.length ? list.map((i, k) => {
      const cls = i.biz ? 'biz' : 'priv';
      return '<a href="#karte" class="item ' + cls + '" data-k="' + k + '">' +
        '<div class="thumb">' + icon(i.cat) + '</div>' +
        '<div class="info"><div class="meta"><span class="badge">' + (i.biz ? 'Gewerblich' : 'Privat') + '</span><span>' + i.dist + '</span></div>' +
        '<span class="title">' + esc(i.title) + '</span>' +
        '<span class="owner">' + esc(i.owner) + ' · ★ ' + i.rating + '</span></div>' +
        '<div class="price"><b>' + i.price + ' €</b>pro Tag</div></a>';
    }).join('') : '<div class="empty">Keine Angebote mit diesem Filter.</div>';

    $('pins').innerHTML = list.map((i, k) =>
      '<a href="#karte" class="pin ' + (i.biz ? 'biz' : 'priv') + '" data-k="' + k + '" style="left:' + i.x + '%;top:' + i.y + '%" aria-label="' + esc(i.title) + '">' + i.price + ' €</a>'
    ).join('');
  }

  function render() { renderCats(); renderFilters(); renderResults(); }

  // Kategorie wählen
  $('cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    render();
  });

  // Filter
  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    renderFilters();
    renderResults();
  });

  // Liste und Karte gegenseitig hervorheben
  function highlight(k, on) {
    document.querySelectorAll('[data-k="' + k + '"]').forEach((el) => el.classList.toggle('hl', on));
  }
  ['list', 'pins'].forEach((id) => {
    $(id).addEventListener('mouseover', (e) => { const el = e.target.closest('[data-k]'); if (el) highlight(el.dataset.k, true); });
    $(id).addEventListener('mouseout', (e) => { const el = e.target.closest('[data-k]'); if (el) highlight(el.dataset.k, false); });
  });

  // Suche: springt zur passenden Kategorie
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

  render();
})();
