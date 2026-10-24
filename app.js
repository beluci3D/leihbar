// Leihbar – Test-Website mit erfundener Region und erfundenen Beispieldaten.
// Testinserate werden nur im localStorage des eigenen Browsers gespeichert und nirgendwohin gesendet.
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Symbole: einheitliche Linien-Icons (24×24)
  const ICONS = {
    alle: 'M5 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M15 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M5 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z M15 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z',
    ski: 'M12.0 22.0L12.0 2.0 M20.7 17.0L3.3 7.0 M20.7 7.0L3.3 17.0 M14.4 3.0L12.0 5.2L9.6 3.0 M5.4 5.4L6.1 8.6L3.0 9.6 M3.0 14.4L6.1 15.4L5.4 18.6 M9.6 21.0L12.0 18.8L14.4 21.0 M18.6 18.6L17.9 15.4L21.0 14.4 M21.0 9.6L17.9 8.6L18.6 5.4',
    wandern: 'M6 3h4.5v6.5l6.2 2.3c2 .7 3.3 2.4 3.3 4.4V18H4V4a1 1 0 0 1 1-1z M4 21h16 M10.5 6.5H7.5 M10.5 9.5H7.5 M14 12.8l-1.2 2.2',
    camping: 'M12 5 3 19h18L12 5z M12 5l-1.6-2.2 M12 5l1.6-2.2 M12 12l-3 7 M12 12l3 7 M2 19h20',
    wasser: 'M3 13.5c4-2 14-2 18 0-4 2-14 2-18 0z M16.5 3.5 10.8 18 M15.8 2.6l2.6 1-1 2.3-2.5-1z M2 21c1.7-1.2 3.3-1.2 5 0s3.3 1.2 5 0 3.3-1.2 5 0 3.3 1.2 5 0',
    rad: 'M2 16a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0-7.6 0z M14.4 16a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0-7.6 0z M5.8 16l3.5-7h6.2l2.7 7 M9.3 9l3 7h-6.5 M15.5 9l-3.2 7 M8 6h3 M15.5 9l-.8-2.6h2.3',
    klettern: 'M10.5 3h3.2a4.2 4.2 0 0 1 4.1 5l-1.9 9.3A4.5 4.5 0 0 1 11.5 21h-.4a4.2 4.2 0 0 1-4.1-5l1.9-9.3A4.5 4.5 0 0 1 10.5 3z M9.6 7.2l3 6.3'
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
      return '<div class="item-wrap">' + '<button type="button" class="item ' + kind(i) + (state.selected === i.key ? ' hl' : '') + '" data-key="' + i.key + '">' +
        (i.mine && okPhoto(i.photo) ? '<span class="thumb photo"><img src="' + i.photo + '" alt=""></span>' : '<span class="thumb">' + icon(i.cat) + '</span>') +
        '<span class="info"><span class="meta"><span class="badge">' + badge(i) + '</span><span>' + esc(townById(i.town).name) + '</span></span>' +
        '<span class="title">' + esc(i.title) + '</span>' +
        '<span class="owner">' + sub + '</span></span>' +
        '<span class="price"><b>' + Number(i.price) + ' €</b>pro Tag</span></button>' +
        (i.mine ? '<button type="button" class="item-del" data-del-item="' + esc(i.id) + '" aria-label="' + esc(i.title) + ' löschen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>' : '') + '</div>';
    }).join('') : '<div class="empty">Hier gibt es mit diesem Filter nichts. Probier eine andere Kategorie oder einen anderen Ort.</div>';
  }

  // --- Karte ---
  const svg = $('mapSvg');
  const zoomed = () => state.view.w <= 560;
  const k = () => state.view.w / ($('map').clientWidth || 800); // Kartenpixel pro Bildschirmpixel

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
      '<button type="button" class="popup-x" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      (i.mine && okPhoto(i.photo) ? '<img class="pop-img" src="' + i.photo + '" alt="">' : '') +
      '<span class="badge">' + badge(i) + '</span>' +
      '<h4>' + esc(i.title) + '</h4>' +
      (i.mine && i.cond ? '<p class="pop-sub">Zustand: ' + esc(i.cond) + (i.deposit ? ' · Kaution ' + Number(i.deposit) + ' €' : '') + '</p>' : '') +
      '<p class="pop-sub">' + esc(i.owner) + ' · ' + esc(townById(i.town).name) + (i.mine ? '' : ' · ★ ' + i.rating) + '</p>' +
      (i.desc ? '<p>' + esc(i.desc) + '</p>' : '') +
      '<div class="pop-foot"><b>' + Number(i.price) + ' € <small>pro Tag</small></b>' +
      (i.mine
        ? '<button type="button" class="btn pop-del" data-id="' + esc(i.id) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>Löschen</button>'
        : '<button type="button" class="btn btn-accent pop-req">Anfragen</button>') +
      '</div>';
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

  function closePopup() {
    state.selected = null;
    $('popup').hidden = true;
    renderMapLayers();
    renderList();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('popup').hidden) closePopup(); });

  $('popup').addEventListener('click', (e) => {
    if (e.target.closest('.popup-x')) { closePopup(); return; }
    if (e.target.closest('.pop-req')) toast('Das ist nur ein Test – Anfragen und Buchen sind nicht möglich.');
    const del = e.target.closest('.pop-del');
    if (del) {
      if (!del.classList.contains('confirm')) {
        del.classList.add('confirm');
        del.lastChild.textContent = 'Wirklich löschen?';
        clearTimeout(del._t);
        del._t = setTimeout(() => { if (del.isConnected) { del.classList.remove('confirm'); del.lastChild.textContent = 'Löschen'; } }, 3000);
        return;
      }
      deleteMine(del.dataset.id);
    }
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
    else if (!$('popup').hidden) closePopup();
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
    const d = e.target.closest('[data-del-item]');
    if (d) { deleteMine(d.dataset.delItem); return; }
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

  // --- Testinserat (Assistent in 3 Schritten) ---
  const CONDS = ['Wie neu', 'Sehr gut', 'Gut', 'Gebraucht'];
  const CAT_TINT = { ski: ['#DCE7F0', '#2D5470'], wandern: ['#E4EBDF', '#1F3D2B'], camping: ['#F2E3D0', '#7A4B14'], wasser: ['#D6E8EE', '#1D5566'], rad: ['#EDE3F0', '#5B3A6B'], klettern: ['#ECE7DC', '#5C4B2E'] };
  const draft = { step: 1, cat: 'ski', cond: 'Sehr gut', town: 'glitzerhorn', photo: '' };
  const form = $('insertForm');
  let lastPublished = null;

  function radioTiles(name, items, selected, html) {
    return items.map((it) =>
      '<label class="tile-opt"><input type="radio" class="sr-only" name="' + name + '" value="' + esc(it.value) + '"' + (it.value === selected ? ' checked' : '') + '>' +
      '<span>' + html(it) + '</span></label>'
    ).join('');
  }

  $('catPick').innerHTML = radioTiles('cat', CATS.filter((c) => c.id !== 'alle').map((c) => ({ value: c.id, c })), draft.cat,
    (it) => icon(it.c.id) + '<b>' + esc(it.c.label) + '</b>');
  $('condPick').innerHTML = radioTiles('cond', CONDS.map((c) => ({ value: c })), draft.cond, (it) => esc(it.value));
  $('townPick').innerHTML = radioTiles('town', TOWNS.map((t) => ({ value: t.id, t })), draft.town,
    (it) => '<b>' + esc(it.t.name) + '</b><small>' + esc(it.t.info) + '</small>');

  function readDraft() {
    draft.title = form.title.value.trim();
    draft.cat = (form.querySelector('[name=cat]:checked') || {}).value || draft.cat;
    draft.cond = (form.querySelector('[name=cond]:checked') || {}).value || draft.cond;
    draft.town = (form.querySelector('[name=town]:checked') || {}).value || draft.town;
    draft.price = Math.round(Number(form.price.value)) || 0;
    draft.deposit = Math.max(0, Math.round(Number(form.deposit.value)) || 0);
    draft.desc = form.desc.value.trim();
    draft.owner = form.owner.value.trim();
  }

  const okPhoto = (p) => typeof p === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p);

  function photoBlock(i, cls) {
    const tint = CAT_TINT[i.cat] || CAT_TINT.ski;
    if (okPhoto(i.photo)) return '<div class="' + cls + '"><img src="' + i.photo + '" alt=""></div>';
    return '<div class="' + cls + ' ph" style="background:' + tint[0] + ';color:' + tint[1] + '">' + icon(i.cat) + '</div>';
  }

  function renderPreview() {
    readDraft();
    const t = townById(draft.town);
    const title = draft.title || 'Dein Titel erscheint hier';
    $('preview').innerHTML =
      '<article class="pcard' + (draft.title ? '' : ' is-empty') + '">' +
        photoBlock(draft, 'pcard-img') +
        '<div class="pcard-body">' +
          '<div class="pcard-tags"><span class="badge b-mine">Dein Testinserat</span><span class="ptag">' + esc(catLabel(draft.cat)) + '</span><span class="ptag">' + esc(draft.cond) + '</span></div>' +
          '<h3>' + esc(title) + '</h3>' +
          '<p class="pcard-where"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 C12 21 5 14.5 5 9.5 a7 7 0 0 1 14 0 C19 14.5 12 21 12 21 Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>' + esc(t.name) + ', Talbergland</p>' +
          (draft.desc ? '<p class="pcard-desc">' + esc(draft.desc) + '</p>' : '') +
          '<div class="pcard-foot">' +
            '<div class="pcard-owner"><span class="avatar">' + esc((draft.owner || '?').charAt(0).toUpperCase()) + '</span><span>' + esc(draft.owner || 'Dein Spitzname') + '<small>Neu auf Leihbar</small></span></div>' +
            '<div class="pcard-price"><b>' + (draft.price > 0 ? draft.price : '–') + ' €</b><small>pro Tag' + (draft.deposit ? ' · ' + draft.deposit + ' € Kaution' : '') + '</small></div>' +
          '</div>' +
        '</div>' +
      '</article>';
    $('titleCount').textContent = form.title.value.length + '/60';
    $('descCount').textContent = form.desc.value.length + '/300';
    const prices = SAMPLES.filter((s) => s.cat === draft.cat).map((s) => s.price);
    $('priceHint').textContent = prices.length ? 'Ähnliche Angebote: ' + Math.min.apply(null, prices) + '–' + Math.max.apply(null, prices) + ' € pro Tag' : '';
  }

  function validate(step) {
    readDraft();
    if (step === 1 && draft.title.length < 3) return ['Gib deinem Inserat einen Titel (mindestens 3 Zeichen).', form.title];
    if (step === 2 && !(draft.price >= 1 && draft.price <= 500)) return ['Der Preis muss zwischen 1 und 500 € liegen.', form.price];
    if (step === 3 && !draft.owner) return ['Gib einen Spitznamen an.', form.owner];
    if (step === 3 && !form.ok.checked) return ['Bitte bestätige, dass das nur ein Test ist.', form.ok];
    return null;
  }

  function goStep(n) {
    for (let s = 1; s < n; s++) {
      const err = validate(s);
      if (err) { n = s; showErr(err); break; }
    }
    draft.step = n;
    form.querySelectorAll('.step').forEach((f) => { f.hidden = Number(f.dataset.step) !== n; });
    $('stepNav').querySelectorAll('li').forEach((li, idx) => {
      li.className = idx + 1 < n ? 'done' : (idx + 1 === n ? 'current' : '');
      li.querySelector('button').setAttribute('aria-current', idx + 1 === n ? 'step' : 'false');
    });
    $('back').hidden = n === 1;
    $('next').hidden = n === 3;
    $('publish').hidden = n !== 3;
  }

  function showErr(err) {
    $('formError').textContent = err[0];
    err[1].focus();
    err[1].classList.add('shake');
    setTimeout(() => err[1].classList.remove('shake'), 400);
  }

  $('next').addEventListener('click', () => {
    const err = validate(draft.step);
    if (err) return showErr(err);
    $('formError').textContent = '';
    goStep(draft.step + 1);
    form.querySelector('.step:not([hidden]) input, .step:not([hidden]) textarea')?.focus({ preventScroll: true });
  });
  $('back').addEventListener('click', () => { $('formError').textContent = ''; goStep(draft.step - 1); });
  $('stepNav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    $('formError').textContent = '';
    goStep(Number(b.dataset.go));
  });

  form.addEventListener('input', () => { $('formError').textContent = ''; renderPreview(); });
  form.addEventListener('change', renderPreview);
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && draft.step < 3) { e.preventDefault(); $('next').click(); }
  });

  function bumpPrice(d) {
    const v = Math.min(500, Math.max(1, (Math.round(Number(form.price.value)) || 0) + d));
    form.price.value = v;
    renderPreview();
  }
  $('priceDown').addEventListener('click', () => bumpPrice(-1));
  $('priceUp').addEventListener('click', () => bumpPrice(1));

  // Foto: wird im Browser verkleinert (4:3, max. 640 px) und nur lokal gespeichert
  function loadPhoto(file) {
    if (!file || !/^image\//.test(file.type)) { toast('Bitte wähle ein Bild aus.'); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const W = 640, H = 480;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const sc = Math.max(W / img.width, H / img.height);
      const w = img.width * sc, h = img.height * sc;
      c.getContext('2d').drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      URL.revokeObjectURL(url);
      draft.photo = c.toDataURL('image/jpeg', 0.75);
      showPhoto();
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast('Dieses Bild konnte nicht geladen werden.'); };
    img.src = url;
  }
  function showPhoto() {
    const has = okPhoto(draft.photo);
    $('photoPrev').hidden = !has;
    $('dropEmpty').hidden = has;
    $('photoRemove').hidden = !has;
    $('drop').classList.toggle('has', has);
    if (has) $('photoPrev').src = draft.photo; else $('photoPrev').removeAttribute('src');
    renderPreview();
  }
  $('photoInput').addEventListener('change', (e) => { loadPhoto(e.target.files[0]); e.target.value = ''; });
  $('photoRemove').addEventListener('click', () => { draft.photo = ''; showPhoto(); });
  ['dragenter', 'dragover'].forEach((ev) => $('drop').addEventListener(ev, (e) => { e.preventDefault(); $('drop').classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => $('drop').addEventListener(ev, (e) => { e.preventDefault(); $('drop').classList.remove('over'); }));
  $('drop').addEventListener('drop', (e) => loadPhoto(e.dataTransfer.files[0]));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    for (const s of [1, 2, 3]) {
      const err = validate(s);
      if (err) { goStep(s); return showErr(err); }
    }
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: draft.title.slice(0, 60),
      cat: draft.cat,
      cond: CONDS.includes(draft.cond) ? draft.cond : '',
      town: townById(draft.town) ? draft.town : TOWNS[0].id,
      price: draft.price,
      deposit: Math.min(2000, draft.deposit),
      owner: draft.owner.slice(0, 24),
      desc: draft.desc.slice(0, 300),
      photo: okPhoto(draft.photo) ? draft.photo : ''
    };
    mine.unshift(item);
    if (mine.length > 12) mine = mine.slice(0, 12);
    saveMine();
    if (!storageOk && item.photo) { item.photo = ''; saveMine(); toast('Speicher voll: Dein Inserat wurde ohne Foto gespeichert.'); }

    lastPublished = item.id;
    form.hidden = true;
    $('stepNav').hidden = true;
    $('success').hidden = false;
    renderMine();
    refresh();
  });

  $('showOnMap').addEventListener('click', () => {
    state.cat = 'alle'; state.filter = 'alle';
    refresh();
    $('karte').scrollIntoView({ behavior: 'smooth' });
    if (lastPublished) setTimeout(() => selectItem('m-' + lastPublished), 350);
  });
  $('another').addEventListener('click', () => {
    form.reset();
    form.price.value = 10;
    draft.photo = '';
    form.hidden = false;
    $('stepNav').hidden = false;
    $('success').hidden = true;
    showPhoto();
    goStep(1);
    form.title.focus();
  });

  function renderMine() {
    if (!mine.length) { $('mine').innerHTML = ''; return; }
    $('mine').innerHTML = '<div class="mine-list"><span class="side-label">Deine Testinserate (' + mine.length + ')</span>' +
      mine.map((i) =>
        '<div class="mine-row">' + photoBlock(i, 'mine-img') +
        '<span class="mine-txt"><b>' + esc(i.title) + '</b><small>' + esc(townById(i.town).name) + ' · ' + Number(i.price) + ' €/Tag</small></span>' +
        '<button type="button" class="mini" data-view="' + esc(i.id) + '">Ansehen</button>' +
        '<button type="button" class="mini danger" data-del="' + esc(i.id) + '" aria-label="' + esc(i.title) + ' löschen">Löschen</button></div>'
      ).join('') +
      (mine.length > 1 ? '<button type="button" class="linkish" data-del="all">Alle löschen</button>' : '') +
      '</div>';
  }

  $('mine').addEventListener('click', (e) => {
    const v = e.target.closest('[data-view]');
    if (v) {
      state.cat = 'alle'; state.filter = 'alle'; refresh();
      $('karte').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => selectItem('m-' + v.dataset.view), 350);
      return;
    }
    const b = e.target.closest('[data-del]');
    if (b) deleteMine(b.dataset.del);
  });

  function deleteMine(id) {
    mine = id === 'all' ? [] : mine.filter((i) => i.id !== id);
    saveMine();
    if (state.selected && state.selected.startsWith('m-') && !mine.some((i) => 'm-' + i.id === state.selected)) {
      state.selected = null;
      $('popup').hidden = true;
    }
    renderMine();
    refresh();
    toast(id === 'all' ? 'Alle Testinserate gelöscht.' : 'Testinserat gelöscht.');
  }

  goStep(1);
  renderPreview();

  renderMine();
  refresh();
  applyView();
})();
