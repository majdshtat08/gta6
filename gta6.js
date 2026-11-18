
'use strict';

const RELEASE_DATE = new Date('2026-11-19T00:00:00'); 

const PINS = [
  { name: 'Vice City',            u: .68, v: .42, cat: 'city',   color: '#ff2e93', text: 'Neon nights, beaches and long highways.' },
  { name: 'Ambrosia',             u: .30, v: .14, cat: 'city',   color: '#19e3e8', text: 'Quiet streets and open roads up north.' },
  { name: 'Kalaga National Park', u: .50, v: .30, cat: 'nature', color: '#7dff9a', text: 'Dense green, trails and wildlife.' },
  { name: 'Port Gellhorn',        u: .40, v: .48, cat: 'city',   color: '#8a3ffc', text: 'A busy harbour with docks and warehouses.' },
  { name: 'Grassrivers',          u: .55, v: .68, cat: 'nature', color: '#ff8c3c', text: 'Wetlands and winding waterways.' },
  { name: 'Leonida Keys',         u: .62, v: .88, cat: 'coast',  color: '#ffd65a', text: 'A chain of islands, sandbars and sunsets.' }
];
const CAT_LABEL = { city: 'City', nature: 'Nature', coast: 'Coast' };

const ISLAND = [[.18,.05],[.62,.05],[.64,.14],[.80,.22],[.78,.36],[.70,.48],[.72,.60],[.66,.74],[.58,.90],[.50,.82],[.46,.66],[.34,.56],[.26,.40],[.14,.30],[.10,.16]];
const ROADS = [
  [[.30,.20],[.45,.24],[.58,.34],[.68,.42],[.70,.55]],
  [[.46,.24],[.44,.45],[.50,.62],[.58,.80]],
  [[.26,.38],[.40,.46],[.58,.50],[.70,.50]]
];
const KEYS = [[.70,.93,15],[.79,.96,11],[.86,.99,9],[.56,.96,8]];

const CHARACTERS = [
  { name: 'LUCIA', kind: 'l', c1: '#ff2e93', c2: '#8a3ffc', shadow: 'rgba(255,46,147,.35)',
    more: 'One of the two lead characters of GTA VI, first shown in the opening trailer.' },
  { name: 'JASON', kind: 'j', c1: '#19e3e8', c2: '#1e90ff', shadow: 'rgba(25,227,232,.3)',
    more: 'The other lead character. The story follows the pair together.' }
];

const NEWS = [
  { tag: 'Release', icon: '\u2605', color: '#ff2e93', title: 'GTA VI is out now', text: 'Available on PS5 and Xbox Series X|S.', date: 'Nov 19, 2026' },
  { tag: 'Preload', icon: '\u2193', color: '#19e3e8', title: 'Digital preload opened on consoles', text: 'Get everything downloaded before launch day.', date: 'Nov 12, 2026' },
  { tag: 'Trailer', icon: '\u25B6', color: '#ff8c3c', title: 'Launch trailer is out', text: 'Watch the full cut and spot the details.', date: 'Oct 15, 2026' },
  { tag: 'Guide',   icon: '\u2316', color: '#8a3ffc', title: 'Explore Leonida', text: 'A quick tour of the map, from Vice City to the Keys.', date: 'Guide' }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const svgEl = (tag, attrs = {}) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

const nav = $('#nav');
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('a', navLinks).forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const sections = $$('main > section[id]');
const linkFor = id => $(`.links a[href="#${id}"]`);
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      $$('.links a').forEach(a => a.classList.remove('active'));
      const l = linkFor(e.target.id);
      if (l) l.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => secObserver.observe(s));

(function buildSkyline() {
  const box = $('#skyline');
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const count = 28;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('i');
    b.style.height = 30 + Math.round(rnd() * 120) + 'px';
    box.appendChild(b);
  }
})();

(function countdown() {
  const box = $('#countdown');
  const out = $('#outNow');
  const tagline = $('#tagline');
  const parts = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
  let timer;
  function tick() {
    const diff = RELEASE_DATE - new Date();
    if (diff <= 0) {
      box.hidden = true;
      out.hidden = false;
      tagline.textContent = 'Welcome to Vice City';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    parts.d.textContent = pad(Math.floor(s / 86400));
    parts.h.textContent = pad(Math.floor(s % 86400 / 3600));
    parts.m.textContent = pad(Math.floor(s % 3600 / 60));
    parts.s.textContent = pad(s % 60);
  }
  tick();
  timer = setInterval(tick, 1000);
})();

(function buildMap() {
  const svg = $('#mapSvg');
  const W = 600, H = 720;
  const X = u => (u + .04) * W;
  const Y = v => v * H;

  for (let x = 0; x <= W; x += 60) svg.appendChild(svgEl('line', { class: 'grid-line', x1: x, y1: 0, x2: x, y2: H }));
  for (let y = 0; y <= H; y += 60) svg.appendChild(svgEl('line', { class: 'grid-line', x1: 0, y1: y, x2: W, y2: y }));

  KEYS.forEach(([u, v, r]) => svg.appendChild(svgEl('circle', { class: 'keys', cx: X(u), cy: Y(v), r })));
  svg.appendChild(svgEl('polygon', { class: 'island', points: ISLAND.map(([u, v]) => `${X(u)},${Y(v)}`).join(' ') }));
  ROADS.forEach(r => svg.appendChild(svgEl('polyline', { class: 'road', points: r.map(([u, v]) => `${X(u)},${Y(v)}`).join(' ') })));

  const info = $('#mapInfo');
  const iTag = $('#infoTag'), iName = $('#infoName'), iText = $('#infoText');
  const pinEls = [];

  function select(p, el) {
    pinEls.forEach(x => x.el.classList.remove('selected'));
    el.classList.add('selected');
    iTag.textContent = CAT_LABEL[p.cat];
    iName.textContent = p.name;
    iText.textContent = p.text;
    info.classList.remove('swap');
    void info.offsetWidth; 
    info.classList.add('swap');
  }

  PINS.forEach((p, i) => {
    const g = svgEl('g', { class: 'pin', tabindex: 0, role: 'button', 'aria-label': `${p.name}, ${CAT_LABEL[p.cat]}` });
    const cx = X(p.u), cy = Y(p.v);
    g.appendChild(svgEl('circle', { class: 'pulse', cx, cy, r: 12, stroke: p.color, style: `animation-delay:${i * .3}s` }));
    g.appendChild(svgEl('circle', { class: 'ring', cx, cy, r: 14, fill: '#fff' }));
    g.appendChild(svgEl('circle', { class: 'core', cx, cy, r: 9, fill: p.color }));
    const label = svgEl('text', { class: 'map-label', x: cx, y: cy + 36 });
    label.textContent = p.name;
    g.appendChild(label);
    g.addEventListener('click', () => select(p, g));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p, g); }
    });
    svg.appendChild(g);
    pinEls.push({ p, el: g });
  });


  select(PINS[0], pinEls[0].el);


  $('#mapFilters').addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    $$('#mapFilters .chip').forEach(c => c.classList.toggle('active', c === btn));
    const f = btn.dataset.filter;
    pinEls.forEach(({ p, el }) => el.classList.toggle('dim', f !== 'all' && p.cat !== f));
    const current = pinEls.find(x => x.el.classList.contains('selected'));
    if (current && current.el.classList.contains('dim')) {
      const first = pinEls.find(x => !x.el.classList.contains('dim'));
      if (first) select(first.p, first.el);
    }
  });
})();

(function buildCharacters() {
  const box = $('#charCards');
  const art = kind => {
    const hair = kind === 'l'
      ? '<path d="M110 190 Q100 120 160 110 Q235 112 232 190 L240 300 L98 300 Z" fill="#10052a"/>'
      : '<path d="M118 160 Q125 100 175 100 Q222 102 226 160 Q175 135 118 160Z" fill="#10052a"/>';
    return `<svg class="art" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="285" cy="150" r="105" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="182" y="${170 + i * 18}" width="206" height="${3 + i}" fill="#fff" fill-opacity=".3"/>`).join('')}
      <ellipse cx="170" cy="470" rx="170" ry="190" fill="#10052a"/>
      <rect x="148" y="215" width="44" height="80" fill="#10052a"/>
      ${hair}
      <circle cx="170" cy="190" r="52" fill="#10052a"/>
    </svg>`;
  };
  CHARACTERS.forEach((c, i) => {
    const card = document.createElement('article');
    card.className = 'char reveal';
    card.style.setProperty('--g', `linear-gradient(135deg, ${c.c1}, ${c.c2})`);
    card.style.setProperty('--shadow', c.shadow);
    card.innerHTML = `${art(c.kind)}
      <div class="char-body">
        <h3>${c.name}</h3>
        <div class="chips"><span class="chip">Protagonist</span><span class="chip">Vice City</span></div>
        <p class="more" id="more-${i}">${c.more}</p>
        <button class="toggle" aria-expanded="false" aria-controls="more-${i}">Read profile</button>
      </div>`;
    const btn = $('.toggle', card);
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Read profile';
    });
    box.appendChild(card);
  });
})();

(function buildNews() {
  const grid = $('#newsGrid');
  const filters = $('#newsFilters');
  const tags = ['All', ...new Set(NEWS.map(n => n.tag))];

  filters.innerHTML = tags.map((t, i) =>
    `<button class="chip${i === 0 ? ' active' : ''}" data-tag="${t}">${t}</button>`).join('');

  NEWS.forEach(n => {
    const a = document.createElement('article');
    a.className = 'news reveal';
    a.dataset.tag = n.tag;
    a.style.setProperty('--accent', n.color);
    a.innerHTML = `<div class="ico" aria-hidden="true">${n.icon}</div>
      <span class="tag" style="background:${n.color};color:#1b0838">${n.tag}</span>
      <h3>${n.title}</h3>
      <p>${n.text}</p>
      <time>${n.date}</time>`;
    grid.appendChild(a);
  });

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    $$('.chip', filters).forEach(c => c.classList.toggle('active', c === btn));
    const t = btn.dataset.tag;
    $$('.news', grid).forEach(n => n.classList.toggle('hide', t !== 'All' && n.dataset.tag !== t));
  });
})();

(function reveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });
})();