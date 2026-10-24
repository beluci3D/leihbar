// Leihbar – Test-Website mit erfundener Region und erfundenen Beispieldaten.
// Testinserate werden nur im localStorage des eigenen Browsers gespeichert und nirgendwohin gesendet.
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';

  const ICONS = {
    alle: 'M4 4 H10 V10 H4 Z M14 4 H20 V10 H14 Z M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z',
    ski: 'M4 20 L20 4 M8 20 L20 8 M6 6 L9 9',
    wandern: 'M13 4 a2 2 0 1 0 0.01 0 M10 21 L12 14 L15 16 L15 21 M12 14 L11 9 L15 10 L17 13 M11 9 L8 12',
    camping: 'M3 20 L12 4 L21 20 Z M12 20 L12 13 L9 20',
    wasser: 'M3 16 C6 14 8 18 12 16 C16 14 18 18 21 16 M5 12 L19 8',
    rad: 'M6 17 a3.5 3.5 0 1 0 0.01 0 M18 17 a3.5 3.5 0 1 0 0.01 0 M6 17 L10 9 L15 9 L18 17 M10 9 L13 17 L15 9',
    klettern: 'M8 3 C4 8 4 16 8 21 M16 3 C20 8 20 16 16 21 M8 12 L16 12'
  };

  const CATS = [
    { id: 'alle', label: 'Alles', words: [] },
    { id: 'ski', label: 'Ski & Snowboard', words: ['ski', 'snowboard', 'skiset', 'winter'] },
    { id: 'wandern', label: 'Wandern', words: ['wandern', 'rucksack', 'stöcke', 'stoecke', 'schuhe'] },
    { id: 'camping', label: 'Camping', words: ['zelt', 'camping', 'schlafsack'] },
    { id: 'wasser', label: 'Wassersport', words: ['sup', 'kajak', 'wasser', 'boot'] },
    { id: 'rad', label: 'Rad & E-Bike', words: ['rad', 'bike', 'fahrrad', 'e-bike'] },
    { id: 'klettern', label: 'Klettern', words: ['klettern', 'klettersteig', 'gurt'] }
  ];
  const catLabel = (id) => CATS.find((c) => c.id === id).label;

  // Erfundene Orte in der erfundenen Region "Talbergland"
  const TOWNS = [
    { id: 'glitzerhorn', name: 'Glitzerhorn', x: 250, y: 195, info: 'Skigebiet in den Bergen' },
    { id: 'felsach', name: 'Felsach', x: 850, y: 165, info: 'Kletterfelsen und Klettersteige' },
    { id: 'tannenbuehl', name: 'Tannenbühl', x: 700, y: 280, info: 'Wälder und Wanderwege' },
    { id: 'kieselbach', name: 'Kieselbach', x: 430, y: 365, info: 'Hauptort mit vielen Geschäften' },
    { id: 'spiegelsee', name: 'Spiegelsee', x: 560, y: 505, info: 'Badesee mit Campingplatz' },
    { id: 'mooswiese', name: 'Mooswiese', x: 190, y: 540, info: 'Radwege im Tal' }
  ];
  const townById = (id) => TOWNS.find((t) => t.id === id);

  // Erfundene Beispielangebote
  const SAMPLES = [
    { title: 'Skiset Allmountain (Ski, Schuhe, Stöcke)', owner: 'Demo-Skiverleih Glitzerhorn', biz: true, rating: '4,8', price: 28, cat: 'ski', town: 'glitzerhorn', desc: 'Direkt an der Talstation, Größen 120–190 cm.' },
    { title: 'Snowboard 154 cm mit Bindung', owner: 'Lena (Beispiel)', biz: false, rating: '4,9', price: 15, cat: 'ski', town: 'glitzerhorn', desc: 'Zwei Saisonen gefahren, frisch gewachst.' },
    { title: 'Tourenski mit Fellen', owner: 'Demo-Bergsport', biz: true, rating: '4,7', price: 35, cat: 'ski', town: 'glitzerhorn', desc: 'Inkl. LVS-Gerät auf Anfrage.' },
    { title: 'Kinderski 110 cm + Helm', owner: 'Tobias (Beispiel)', biz: false, rating: '5,0', price: 9, cat: 'ski', town: 'glitzerhorn', desc: 'Für Kinder von ca. 5–7 Jahren.' },
    { title: 'Schneeschuhe Paar', owner: 'Demo-Bergsport', biz: true, rating: '4,6', price: 12, cat: 'wandern', town: 'glitzerhorn', desc: 'Mit Stöcken, für Wintertouren.' },
    { title: 'Rodel aus Holz', owner: 'Hanna (Beispiel)', biz: false, rating: '4,9', price: 5, cat: 'ski', town: 'glitzerhorn', desc: 'Klassische Holzrodel für zwei.' },

    { title: 'Klettergurt + Helm Set', owner: 'Demo-Kletterschule Felsach', biz: true, rating: '4,7', price: 10, cat: 'klettern', town: 'felsach', desc: 'Größen S–XL vorhanden.' },
    { title: 'Klettersteigset', owner: 'Felix (Beispiel)', biz: false, rating: '4,8', price: 8, cat: 'klettern', town: 'felsach', desc: 'Normgeprüft, mit Karabinern.' },
    { title: 'Crashpad zum Bouldern', owner: 'Demo-Kletterschule Felsach', biz: true, rating: '4,5', price: 9, cat: 'klettern', town: 'felsach', desc: 'Groß, faltbar, mit Tragegurten.' },
    { title: 'Wanderstöcke Carbon', owner: 'Jakob (Beispiel)', biz: false, rating: '4,6', price: 4, cat: 'wandern', town: 'felsach', desc: 'Leicht und verstellbar.' },

    { title: 'Trekkingrucksack 50 l', owner: 'Sara (Beispiel)', biz: false, rating: '4,6', price: 6, cat: 'wandern', town: 'tannenbuehl', desc: 'Mit Regenhülle.' },
    { title: 'Wanderschuhe Gr. 42', owner: 'Demo-Outdoorshop', biz: true, rating: '4,5', price: 7, cat: 'wandern', town: 'tannenbuehl', desc: 'Wasserdicht, gut eingelaufen.' },
    { title: 'Kindertrage für Wanderungen', owner: 'Miriam (Beispiel)', biz: false, rating: '5,0', price: 8, cat: 'wandern', town: 'tannenbuehl', desc: 'Für Kinder bis ca. 18 kg.' },
    { title: 'Hängematte mit Moskitonetz', owner: 'Demo-Outdoorshop', biz: true, rating: '4,4', price: 6, cat: 'camping', town: 'tannenbuehl', desc: 'Inkl. Baumgurte.' },

    { title: 'E-Mountainbike Größe M', owner: 'Demo-Radhaus Kieselbach', biz: true, rating: '4,6', price: 45, cat: 'rad', town: 'kieselbach', desc: 'Akku für ca. 80 km.' },
    { title: 'Campingkocher-Set', owner: 'Demo-Sporthaus Kieselbach', biz: true, rating: '4,7', price: 5, cat: 'camping', town: 'kieselbach', desc: 'Kocher, Topf und Gaskartusche.' },
    { title: 'Skihelm mit Visier', owner: 'Demo-Sporthaus Kieselbach', biz: true, rating: '4,6', price: 6, cat: 'ski', town: 'kieselbach', desc: 'Größen S–L.' },
    { title: 'Fahrradanhänger für Kinder', owner: 'Anna (Beispiel)', biz: false, rating: '5,0', price: 8, cat: 'rad', town: 'kieselbach', desc: 'Für bis zu zwei Kinder.' },
    { title: 'Trekkingstöcke + Stirnlampe', owner: 'Demo-Sporthaus Kieselbach', biz: true, rating: '4,5', price: 5, cat: 'wandern', town: 'kieselbach', desc: 'Praktisches Set für Hüttentouren.' },

    { title: 'SUP-Board aufblasbar', owner: 'Demo-Seeverleih Spiegelsee', biz: true, rating: '4,7', price: 25, cat: 'wasser', town: 'spiegelsee', desc: 'Mit Paddel, Pumpe und Leash.' },
    { title: 'Kajak Einsitzer', owner: 'Paul (Beispiel)', biz: false, rating: '4,8', price: 20, cat: 'wasser', town: 'spiegelsee', desc: 'Inkl. Schwimmweste.' },
    { title: 'Tretboot (2 Stunden)', owner: 'Demo-Seeverleih Spiegelsee', biz: true, rating: '4,3', price: 18, cat: 'wasser', town: 'spiegelsee', desc: 'Für bis zu vier Personen.' },
    { title: '3-Personen-Zelt', owner: 'Demo-Campingplatz Spiegelsee', biz: true, rating: '4,5', price: 14, cat: 'camping', town: 'spiegelsee', desc: 'Schnell aufgebaut, mit Vorzelt.' },
    { title: 'Schlafsack bis −5 °C', owner: 'Mira (Beispiel)', biz: false, rating: '4,9', price: 7, cat: 'camping', town: 'spiegelsee', desc: 'Gewaschen und gepackt.' },
    { title: 'Neoprenanzug Gr. M', owner: 'Luca (Beispiel)', biz: false, rating: '4,7', price: 6, cat: 'wasser', town: 'spiegelsee', desc: 'Für kühleres Wasser.' },

    { title: 'Trekkingrad 28 Zoll', owner: 'Demo-Radverleih Mooswiese', biz: true, rating: '4,6', price: 15, cat: 'rad', town: 'mooswiese', desc: 'Mit Gepäckträger und Schloss.' },
    { title: 'Tandem', owner: 'Demo-Radverleih Mooswiese', biz: true, rating: '4,8', price: 22, cat: 'rad', town: 'mooswiese', desc: 'Für gemütliche Touren zu zweit.' },
    { title: 'Kinderfahrrad 20 Zoll', owner: 'Stefan (Beispiel)', biz: false, rating: '4,9', price: 5, cat: 'rad', town: 'mooswiese', desc: 'Für ca. 6–9 Jahre.' },
    { title: 'Familienzelt für 5', owner: 'Julia (Beispiel)', biz: false, rating: '4,6', price: 16, cat: 'camping', town: 'mooswiese', desc: 'Zwei Schlafkabinen.' }
  ];

  const FILTERS = [
    { id: 'alle', label: 'Alle' },
    { id: 'gewerblich', label: 'Gewerblich' },
    { id: 'privat', label: 'Privat' }
  ];

  const KEY = 'leihbar-testinserate';
  const FULL = { x: 0, y: 0, w: 1000, h: 700 };
  const state = { cat: 'alle', filter: 'alle', town: null, selected: null, view: { ...FULL } };

  const $ = (id) => document.getElementById(id);
  const icon = (cat) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[cat] + '"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const svgEl = (tag, attrs) => { const el = document.createElementNS(SVGNS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };

  // --- Speicher (nur im eigenen Browser) ---
  function loadMine() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((i) => i && ICONS[i.cat] && i.cat !== 'alle' && townById(i.town)) : [];
    } catch (e) { return []; }
  }
  let mine = loadMine();
  let storageOk = true;
  function saveMine() {
    try { localStorage.setItem(KEY, JSON.stringify(mine)); storageOk = true; }
    catch (e) { storageOk = false; }
  }

  function allItems() {
    const list = mine.map((i) => ({ ...i, mine: true, biz: false })).concat(SAMPLES);
    return list.map((i, idx) => ({ ...i, key: i.mine ? 'm-' + i.id : 's-' + idx }));
  }

  function matches(i, withTown) {
    if (state.cat !== 'alle' && i.cat !== state.cat) return false;
    if (state.filter === 'gewerblich' && !i.biz) return false;
    if (state.filter === 'privat' && i.biz) return false;
    if (withTown && state.town && i.town !== state.town) return false;
    return true;
  }

  const kind = (i) => i.mine ? 'mine' : (i.biz ? 'biz' : 'priv');
  const badge = (i) => i.mine ? 'Dein Testinserat' : (i.biz ? 'Gewerblich' : 'Privat');

  // --- Kategorien und Filter ---
  function renderCats() {
    const items = allItems();
    $('cats').innerHTML = CATS.map((c) => {
      const n = c.id === 'alle' ? items.length : items.filter((i) => i.cat === c.id).length;
      return '<button type="button" class="cat" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        icon(c.id) + '<b>' + esc(c.label) + '</b><span>' + plural(n, 'Angebot', 'Angebote') + '</span></button>';
    }).join('');
  }

  function renderFilters() {
    $('filters').innerHTML = FILTERS.map((f) =>
      '<button type="button" data-filter="' + f.id + '" aria-pressed="' + (state.filter === f.id) + '">' + f.label + '</button>'
    ).join('');
  }

  // --- Liste rechts ---
  function renderList() {
    const list = allItems().filter((i) => matches(i, true));
    const t = state.town && townById(state.town);
    $('panelTitle').textContent = t ? t.name : 'Ganze Region';
    $('clearTown').hidden = !t;
    $('resultLine').textContent = plural(list.length, 'Angebot', 'Angebote') +
      (state.cat !== 'alle' ? ' · ' + catLabel(state.cat) : '') + (t ? ' · ' + t.info : '');

    $('list').innerHTML = list.length ? list.map((i) => {
      const sub = i.mine ? esc(i.owner) + ' · noch keine Bewertungen' : esc(i.owner) + ' · ★ ' + i.rating;
      return '<button type="button" class="item ' + kind(i) + (state.selected === i.key ? ' hl' : '') + '" data-key="' + i.key + '">' +
        '<span class="thumb">' + icon(i.cat) + '</span>' +
        '<span class="info"><span class="meta"><span class="badge">' + badge(i) + '</span><span>' + esc(townById(i.town).name) + '</span></span>' +
        '<span class="title">' + esc(i.title) + '</span>' +
        '<span class="owner">' + sub + '</span></span>' +
        '<span class="price"><b>' + Number(i.price) + ' €</b>pro Tag</span></button>';
    }).join('') : '<div class="empty">Hier gibt es mit diesem Filter nichts. Probier eine andere Kategorie oder einen anderen Ort.</div>';
  }

  // --- Karte ---
  const svg = $('mapSvg');
  const zoomed = () => state.view.w <= 560;
  const k = () => state.view.w / $('map').clientWidth; // Kartenpixel pro Bildschirmpixel

  function setView(v, animate) {
    const w = Math.min(FULL.w, Math.max(260, v.w));
    const h = w * FULL.h / FULL.w;
    const x = Math.min(FULL.w - w * 0.3, Math.max(-w * 0.7, v.x));
    const y = Math.min(FULL.h - h * 0.3, Math.max(-h * 0.7, v.y));
    const target = { x, y, w, h };
    if (!animate) { state.view = target; applyView(); return; }
    const from = { ...state.view };
    const t0 = performance.now();
    cancelAnimationFrame(setView.raf);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 350);
      const e = 1 - Math.pow(1 - p, 3);
      state.view = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      applyView();
      if (p < 1) setView.raf = requestAnimationFrame(step);
    };
    setView.raf = requestAnimationFrame(step);
  }

  let lastZoomed = null;
  function applyView() {
    const v = state.view;
    svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    if (zoomed() !== lastZoomed) { lastZoomed = zoomed(); }
    renderMapLayers();
    placePopup();
  }

  function focusTown(id) {
    const t = townById(id);
    state.town = id;
    state.selected = null;
    setView({ x: t.x - 210, y: t.y - 147, w: 420 }, true);
    renderList();
  }

  function renderMapLayers() {
    const s = k();
    const items = allItems().filter((i) => matches(i, false));
    const towns = $('layerTowns');
    const layer = $('layerItems');
    towns.textContent = '';
    layer.textContent = '';

    TOWNS.forEach((t) => {
      const n = items.filter((i) => i.town === t.id).length;
      const active = state.town === t.id;
      const g = svgEl('g', { class: 'town' + (active ? ' active' : '') + (n ? '' : ' empty'), transform: 'translate(' + t.x + ' ' + t.y + ') scale(' + s + ')', tabindex: '0', role: 'button', 'data-town': t.id, 'aria-label': t.name + ': ' + plural(n, 'Angebot', 'Angebote') });
      if (!zoomed()) {
        g.appendChild(svgEl('circle', { r: 21, class: 'cluster' }));
        const c = svgEl('text', { class: 'cluster-num', y: 6 }); c.textContent = n; g.appendChild(c);
      } else {
        g.appendChild(svgEl('circle', { r: 7, class: 'dot' }));
      }
      const label = svgEl('text', { class: 'town-label', y: zoomed() ? -14 : 40 });
      label.textContent = t.name;
      g.appendChild(label);
      towns.appendChild(g);
    });

    if (!zoomed()) return;

    // Angebote ringförmig um ihren Ort
    TOWNS.forEach((t) => {
      const here = items.filter((i) => i.town === t.id);
      const r = (here.length > 6 ? 92 : 74) * s;
      here.forEach((i, idx) => {
        const a = -Math.PI / 2 + (idx / here.length) * Math.PI * 2 + 0.35;
        const x = t.x + Math.cos(a) * r;
        const y = t.y + Math.sin(a) * r;
        i.px = x; i.py = y;
        const label = Number(i.price) + ' €';
        const w = 18 + label.length * 8.6;
        const g = svgEl('g', { class: 'mpin ' + kind(i) + (state.selected === i.key ? ' sel' : ''), transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')', tabindex: '0', role: 'button', 'data-key': i.key, 'aria-label': i.title + ', ' + label + ' pro Tag' });
        g.appendChild(svgEl('line', { x1: 0, y1: 0, x2: (t.x - x) / s, y2: (t.y - y) / s, class: 'tether' }));
        g.appendChild(svgEl('rect', { x: -w / 2, y: -15, width: w, height: 30, rx: i.biz ? 7 : 15 }));
        const tx = svgEl('text', { y: 5 }); tx.textContent = label; g.appendChild(tx);
        layer.appendChild(g);
      });
    });
    // gewählte Nadel nach vorne
    const sel = layer.querySelector('.sel');
    if (sel) layer.appendChild(sel);
  }

  // --- Popup ---
  function selectItem(key, fromList) {
    const item = allItems().find((i) => i.key === key);
    if (!item) return;
    state.selected = key;
    if (state.town !== item.town || !zoomed()) {
      const t = townById(item.town);
      state.town = item.town;
      setView({ x: t.x - 210, y: t.y - 147, w: 420 }, true);
    } else {
      renderMapLayers();
    }
    renderList();
    renderPopup();
    if (fromList && window.matchMedia('(max-width: 900px)').matches) $('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderPopup() {
    const p = $('popup');
    const i = allItems().find((x) => x.key === state.selected);
    if (!i) { p.hidden = true; return; }
    p.className = 'popup ' + kind(i);
    p.innerHTML =
      '<button type="button" class="popup-x" aria-label="Schließen">×</button>' +
      '<span class="badge">' + badge(i) + '</span>' +
      '<h4>' + esc(i.title) + '</h4>' +
      '<p class="pop-sub">' + esc(i.owner) + ' · ' + esc(townById(i.town).name) + (i.mine ? '' : ' · ★ ' + i.rating) + '</p>' +
      (i.desc ? '<p>' + esc(i.desc) + '</p>' : '') +
      '<div class="pop-foot"><b>' + Number(i.price) + ' € <small>pro Tag</small></b>' +
      '<button type="button" class="btn btn-accent pop-req">Anfragen</button></div>';
    p.hidden = false;
    placePopup();
  }

  function placePopup() {
    const p = $('popup');
    if (p.hidden) return;
    const i = allItems().find((x) => x.key === state.selected);
    const t = i && townById(i.town);
    if (!i || !t) return;
    // Position der Nadel bestimmen (oder des Ortes, solange herausgezoomt)
    const node = $('layerItems').querySelector('[data-key="' + state.selected + '"]');
    let sx, sy;
    const box = $('map').getBoundingClientRect();
    if (node) { const r = node.getBoundingClientRect(); sx = r.left + r.width / 2 - box.left; sy = r.top - box.top; }
    else { sx = (t.x - state.view.x) / k(); sy = (t.y - state.view.y) / k(); }
    const pw = p.offsetWidth, ph = p.offsetHeight;
    let left = sx - pw / 2;
    let top = sy - ph - 12;
    if (top < 8) top = sy + 40;
    left = Math.max(8, Math.min(box.width - pw - 8, left));
    top = Math.max(8, Math.min(box.height - ph - 8, top));
    p.style.left = left + 'px';
    p.style.top = top + 'px';
  }

  $('popup').addEventListener('click', (e) => {
    if (e.target.closest('.popup-x')) { state.selected = null; $('popup').hidden = true; renderMapLayers(); renderList(); }
    if (e.target.closest('.pop-req')) toast('Das ist nur ein Test – Anfragen und Buchen sind nicht möglich.');
  });

  // --- Ziehen und Zoomen ---
  function clientToMap(cx, cy) {
    const r = svg.getBoundingClientRect();
    return { x: state.view.x + (cx - r.left) * k(), y: state.view.y + (cy - r.top) * k() };
  }
  function zoomAt(factor, cx, cy) {
    const r = svg.getBoundingClientRect();
    if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
    const m = clientToMap(cx, cy);
    const w = Math.min(FULL.w, Math.max(260, state.view.w * factor));
    const s = w / r.width;
    setView({ x: m.x - (cx - r.left) * s, y: m.y - (cy - r.top) * s, w }, false);
  }

  let drag = null;
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, vx: state.view.x, vy: state.view.y, moved: false, id: e.pointerId };
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) { drag.moved = true; svg.setPointerCapture(e.pointerId); svg.classList.add('dragging'); }
    setView({ x: drag.vx - dx * k(), y: drag.vy - dy * k(), w: state.view.w }, false);
  });
  const endDrag = (e) => {
    if (!drag) return;
    const wasMoved = drag.moved;
    svg.classList.remove('dragging');
    drag = null;
    if (wasMoved) return;
    const pin = e.target.closest && e.target.closest('[data-key]');
    const town = e.target.closest && e.target.closest('[data-town]');
    if (pin) selectItem(pin.dataset.key);
    else if (town) focusTown(town.dataset.town);
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', () => { drag = null; svg.classList.remove('dragging'); });
  svg.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); }, { passive: false });
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const pin = e.target.closest('[data-key]');
    const town = e.target.closest('[data-town]');
    if (pin) { e.preventDefault(); selectItem(pin.dataset.key); }
    else if (town) { e.preventDefault(); focusTown(town.dataset.town); }
  });

  $('zoomIn').addEventListener('click', () => zoomAt(1 / 1.4));
  $('zoomOut').addEventListener('click', () => zoomAt(1.4));
  $('zoomAll').addEventListener('click', () => {
    state.town = null; state.selected = null; $('popup').hidden = true;
    setView(FULL, true); renderList();
  });
  $('clearTown').addEventListener('click', () => $('zoomAll').click());
  window.addEventListener('resize', () => applyView());

  // --- Liste, Kategorien, Filter, Suche ---
  $('list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-key]');
    if (b) selectItem(b.dataset.key, true);
  });

  function refresh() {
    const sel = allItems().find((i) => i.key === state.selected);
    if (sel && !matches(sel, false)) { state.selected = null; }
    renderCats(); renderFilters(); renderList(); renderMapLayers(); renderPopup();
  }

  $('cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    refresh();
    $('karte').scrollIntoView({ behavior: 'smooth' });
  });

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    refresh();
  });

  $('townList').innerHTML = TOWNS.map((t) => '<option value="' + t.name + '"></option>').join('');
  $('search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('q').value.trim().toLowerCase();
    const where = $('where').value.trim().toLowerCase();
    if (q) {
      const hit = CATS.find((c) => c.words.some((w) => q.includes(w) || w.includes(q)));
      state.cat = hit ? hit.id : 'alle';
    }
    state.selected = null;
    $('popup').hidden = true;
    refresh();
    $('karte').scrollIntoView({ behavior: 'smooth' });
    const town = where && TOWNS.find((t) => t.name.toLowerCase().startsWith(where) || where.includes(t.name.toLowerCase()));
    if (town) focusTown(town.id);
    else if (where) toast('Diesen Ort gibt es in Talbergland nicht. Probier z. B. Glitzerhorn oder Spiegelsee.');
  });

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 3400);
  }

  // --- Testinserat ---
  $('catSelect').innerHTML = CATS.filter((c) => c.id !== 'alle').map((c) => '<option value="' + c.id + '">' + esc(c.label) + '</option>').join('');
  $('townSelect').innerHTML = TOWNS.map((t) => '<option value="' + t.id + '">' + esc(t.name) + '</option>').join('');

  function renderMine() {
    if (!mine.length) { $('mine').innerHTML = ''; return; }
    $('mine').innerHTML = '<div class="mine-list"><h3>Deine Testinserate</h3>' +
      mine.map((i) =>
        '<div class="mine-row"><span>' + esc(i.title) + ' · ' + esc(townById(i.town).name) + ' · ' + Number(i.price) + ' €/Tag</span>' +
        '<button type="button" data-del="' + esc(i.id) + '" aria-label="' + esc(i.title) + ' löschen">Löschen</button></div>'
      ).join('') +
      (mine.length > 1 ? '<button type="button" class="linkish" data-del="all">Alle löschen</button>' : '') +
      '</div>';
  }

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
      cat: ICONS[f.cat.value] && f.cat.value !== 'alle' ? f.cat.value : 'ski',
      town: townById(f.town.value) ? f.town.value : TOWNS[0].id,
      price: price,
      owner: owner.slice(0, 30),
      desc: f.desc.value.trim().slice(0, 300)
    };
    mine.unshift(item);
    if (mine.length > 20) mine = mine.slice(0, 20);
    saveMine();

    state.cat = 'alle';
    state.filter = 'alle';
    f.reset();
    renderMine();
    refresh();
    $('karte').scrollIntoView({ behavior: 'smooth' });
    selectItem('m-' + item.id);
    toast(storageOk
      ? 'Dein Testinserat ist auf der Karte – nur in deinem Browser sichtbar.'
      : 'Testinserat angezeigt. Dein Browser erlaubt kein Speichern, nach dem Neuladen ist es weg.');
  });

  $('mine').addEventListener('click', (e) => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    mine = b.dataset.del === 'all' ? [] : mine.filter((i) => i.id !== b.dataset.del);
    saveMine();
    if (state.selected && state.selected.startsWith('m-')) state.selected = null;
    renderMine();
    refresh();
    toast('Testinserat gelöscht.');
  });

  renderMine();
  refresh();
  applyView();
})();
