(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les pages intérieures laissent une trace : en revenant à l’accueil, l’ouverture rejoue.
  if (!document.querySelector('.hero')) { try { sessionStorage.setItem('ep-last', 'inner'); } catch (e) { /* sans stockage, l’ouverture ne joue qu’à la première visite */ } }

  // Thème : sombre par défaut, clair au choix, mémorisé.
  const toggle = $('.switch');
  const syncTheme = () => {
    const light = root.dataset.theme === 'light';
    toggle?.setAttribute('aria-checked', String(light));
    toggle?.setAttribute('aria-label', light ? 'Passer en mode sombre' : 'Passer en mode clair');
    $('meta[name=theme-color]')?.setAttribute('content', light ? '#ffffff' : '#000000');
  };
  toggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('ep-theme', root.dataset.theme); } catch (e) { /* stockage indisponible : le choix vaut pour la page */ }
    syncTheme();
  });
  syncTheme();

  // Fond : deux halos fixes derrière la page (sans flou ni animation : ils ne coûtent rien au défilement).
  const aurora = document.createElement('div'); aurora.className = 'aurora'; aurora.setAttribute('aria-hidden', 'true');
  aurora.append(document.createElement('i'), document.createElement('i'));
  document.body.prepend(aurora);

  // Menu mobile.
  const burger = $('.burger'), nav = $('.top-nav');
  const setMenu = open => { nav.classList.toggle('open', open); $('.top').classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger?.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Atelier : le mot et l’encre de l’affiche dans l’éditeur.
  const poster = $('[data-poster]'), type = $('.po-type');
  const fit = word => type?.style.setProperty('--fit', `${Math.min(96, Math.floor(300 / (Math.max(3, word.length) * .46)))}px`);
  $('#poster-word')?.addEventListener('input', e => {
    const word = e.target.value.trim() || 'Oser.';
    $$('[data-word]').forEach(el => { el.textContent = word; }); fit(word);
  });
  fit('Oser.');
  $$('.inks button').forEach(button => button.addEventListener('click', () => {
    $$('.inks button').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    poster.dataset.ink = button.dataset.ink;
  }));

  // Mur de projets : chaque rangée est construite puis doublée pour défiler sans couture.
  const shots = {abraham: 'assets/img/portfolio/abraham-sm.webp', apa: 'assets/img/portfolio/apa-systheme-sm.webp', masterclass: 'assets/img/portfolio/masterclass-sm.webp', octobre: 'assets/img/portfolio/octobre-rose-sm.webp', film: 'assets/video/studio-film.webp'};
  $$('[data-wall]').forEach(track => {
    const names = track.dataset.wall.split(',');
    for (let pass = 0; pass < 2; pass++) names.forEach(name => {
      const tile = document.createElement('div');
      if (!shots[name]) return;
      tile.className = `tile tile-${name}`; const img = new Image(); img.src = shots[name]; img.alt = ''; img.decoding = 'async'; tile.append(img);
      track.append(tile);
    });
  });

  // Barres lumineuses derrière les titres d’ouverture (accueil et pages intérieures).
  const heights = [94, 80, 64, 48, 33, 20, 10, 4, 4, 10, 20, 33, 48, 64, 80, 94];
  $$('.hero, .page-hero').forEach(section => {
    const bars = document.createElement('div'); bars.className = 'bars'; bars.setAttribute('aria-hidden', 'true');
    heights.forEach((h, i) => { const bar = document.createElement('i'); bar.style.setProperty('--h', `${h}%`); bar.style.setProperty('--d', `${-(i * 37 % 26) / 10}s`); bars.append(bar); });
    section.prepend(bars);
  });

  // Halo qui suit le pointeur sur les cartes.
  if (matchMedia('(hover: hover)').matches) document.addEventListener('pointermove', e => {
    const card = e.target.closest?.('.project-image, .cells li, .bento article, .faq details, .stats li');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(0)}px`); card.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(0)}px`);
  }, {passive: true});

  // Page projets : filtres par domaine.
  const filters = $$('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    $$('.project').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.domain !== button.dataset.filter; });
  }));

  // Section projets : des lignes de lumière dessinées sur un canevas en demi-résolution.
  // Elles ondulent seules et se courbent vers le pointeur ; rien ne tourne quand la section est hors écran.
  const flow = $('.flow'), stageEl = $('.works-pin'), spot = $('.works-spot');
  if (flow && stageEl && !reduced) {
    const ctx = flow.getContext('2d');
    const lines = Array.from({length: 6}, (_, i) => ({y: .1 + i * .16, amp: .05 + (i * 37 % 5) * .014, speed: .9 + i * .23, phase: i * 1.7}));
    let w = 0, h = 0, on = false, raf = 0, mx = .5, my = .5, tx = .5, ty = .5, last = 0;
    const size = () => { const rect = flow.getBoundingClientRect(); w = flow.width = Math.max(1, Math.round(rect.width / 2)); h = flow.height = Math.max(1, Math.round(rect.height / 2)); };
    const draw = now => {
      raf = 0; if (!on) return;
      raf = requestAnimationFrame(draw);
      if (now - last < 30) return; last = now;
      mx += (tx - mx) * .08; my += (ty - my) * .08;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const line of lines) {
        const y0 = h * line.y;
        ctx.beginPath();
        for (let i = 0; i <= 36; i++) {
          const u = i / 36, d = u - mx;
          const wave = (Math.sin(u * 5 + t * line.speed * .5 + line.phase) + Math.sin(u * 2.3 - t * line.speed * .32) * .6) * line.amp * h;
          const y = y0 + wave + Math.exp(-d * d * 16) * (my * h - y0) * .6;
          if (i) ctx.lineTo(u * w, y); else ctx.moveTo(0, y);
        }
        ctx.strokeStyle = 'rgba(255,59,47,.09)'; ctx.lineWidth = 9; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,59,47,.26)'; ctx.lineWidth = 3.4; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,150,132,.85)'; ctx.lineWidth = 1; ctx.stroke();
      }
    };
    stageEl.addEventListener('pointermove', e => {
      const rect = stageEl.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width; ty = (e.clientY - rect.top) / rect.height;
      if (spot) spot.style.transform = `translate3d(${(e.clientX - rect.left).toFixed(0)}px,${(e.clientY - rect.top).toFixed(0)}px,0)`;
    }, {passive: true});
    stageEl.addEventListener('pointerleave', () => { tx = .5; ty = .5; });
    new IntersectionObserver(entries => entries.forEach(entry => { on = entry.isIntersecting; if (on && !raf) { size(); raf = requestAnimationFrame(draw); } })).observe(stageEl);
    addEventListener('resize', () => { if (on) size(); });
  }

  // Les animations en boucle se mettent en pause dès que leur bloc sort de l’écran.
  if ('IntersectionObserver' in window) {
    const rest = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-off', !entry.isIntersecting)), {rootMargin: '120px'});
    $$('.bars, .wall, .ticker, .tools, .editor, .bigmark').forEach(el => rest.observe(el));
  }

  // Éditeur du hero : un vrai plan de travail. On glisse pour parcourir, on clique pour sélectionner,
  // les outils zooment et déplacent, les calques font défiler la page, les fonds changent le thème.
  const ed = $('.editor');
  if (ed) {
    const canvas = $('.ed-canvas', ed), boards = $('[data-boards]', ed), outW = $('[data-ed-w]', ed), outZ = $('[data-ed-z]', ed);
    const selName = $('[data-sel-name]', ed), selDomain = $('[data-sel-domain]', ed), selLink = $('[data-sel-link]', ed), selHint = $('[data-sel-hint]', ed);
    let x = 0, z = 1, drag = null, visible = false, hover = false, dir = -1, raf = 0, idleUntil = 0, glideTimer = 0;
    const limit = () => Math.min(0, canvas.clientWidth - boards.scrollWidth * z);
    const place = () => { boards.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scale(${z})`; };
    const apply = () => { x = clamp(x, limit(), 0); place(); outZ.textContent = `${Math.round(z * 100)}%`; };
    // Les sauts programmés (zoom, remise à zéro, clavier) glissent ; le défilement continu, lui, n’a pas de transition.
    const glide = () => { boards.classList.add('glide'); clearTimeout(glideTimer); glideTimer = setTimeout(() => boards.classList.remove('glide'), 560); };
    const touch = () => { idleUntil = performance.now() + 6000; };
    // Défilement d’ambiance : lent, aller-retour, en pause au survol, pendant un geste et quelques secondes après.
    const drift = now => {
      raf = 0; if (!visible) return;
      raf = requestAnimationFrame(drift);
      if (reduced || drag || hover || now < idleUntil) return;
      const min = limit(); if (min >= 0) return;
      x += dir * .32;
      if (x <= min) { x = min; dir = 1; } else if (x >= 0) { x = 0; dir = -1; }
      place();
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => {
      visible = entry.isIntersecting;
      if (visible) { canvas.classList.add('seen'); if (!raf) raf = requestAnimationFrame(drift); }
    }), {threshold: .15}).observe(canvas); else canvas.classList.add('seen');
    setTimeout(() => canvas.classList.add('seen'), 6000); // filet de sécurité : les plans ne restent jamais masqués
    canvas.addEventListener('pointerenter', () => { hover = true; });
    canvas.addEventListener('pointerleave', () => { hover = false; });

    const select = board => {
      $$('.board', ed).forEach(el => el.classList.toggle('sel', el === board));
      selName.textContent = board ? board.dataset.name : 'Aucune'; selDomain.textContent = board ? board.dataset.domain : '—';
      selLink.hidden = !board?.dataset.href; if (board?.dataset.href) selLink.href = board.dataset.href;
      selHint.hidden = Boolean(board?.dataset.href);
      selHint.textContent = board ? 'Modifiez son mot et son encre juste en dessous.' : 'Cliquez une réalisation sur le plan de travail.';
      const panel = selName.closest('.ed-prop'); panel.classList.remove('flash'); void panel.offsetWidth; panel.classList.add('flash');
    };
    const zoomTo = value => { touch(); glide(); z = clamp(value, .6, 1.75); apply(); };
    canvas.addEventListener('pointerdown', e => {
      if (e.target.closest('.ed-tools') || e.button) return;
      touch(); boards.classList.remove('glide');
      drag = {id: e.pointerId, start: e.clientX, from: x, moved: false, target: e.target.closest('.board')};
    });
    canvas.addEventListener('pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const d = e.clientX - drag.start;
      if (!drag.moved && Math.abs(d) > 5) { drag.moved = true; canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging'); }
      if (drag.moved) { x = drag.from + d; apply(); }
    });
    const finish = e => {
      if (!drag) return;
      const was = drag; drag = null; canvas.classList.remove('dragging'); touch();
      if (was.moved || e.type === 'pointercancel') return;
      if (canvas.dataset.tool === 'zoom') { zoomTo(e.shiftKey ? z - .25 : (z >= 1.75 ? 1 : z + .25)); return; }
      select(was.target || null);
    };
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { touch(); glide(); x += e.key === 'ArrowLeft' ? 140 : -140; apply(); e.preventDefault(); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('board')) { select(e.target); e.preventDefault(); }
      else if (e.key === '+' || e.key === '=') zoomTo(z + .25); else if (e.key === '-') zoomTo(z - .25);
    });
    $$('[data-tool]', $('.ed-tools', ed)).forEach(button => button.addEventListener('click', () => {
      canvas.dataset.tool = button.dataset.tool;
      $$('[data-tool]', $('.ed-tools', ed)).forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    }));
    $('[data-zoom]', ed).addEventListener('click', () => { touch(); glide(); z = 1; x = 0; apply(); });
    $$('[data-ed="panel"]', ed).forEach(button => button.addEventListener('click', () => { const closed = ed.classList.toggle('no-left'); $$('[data-ed="panel"]', ed).forEach(el => el.setAttribute('aria-expanded', String(!closed))); requestAnimationFrame(apply); setTimeout(apply, 700); }));
    $('[data-ed="theme"]', ed).addEventListener('click', () => toggle?.click());
    $$('[data-device]', ed).forEach(button => button.addEventListener('click', () => {
      const mobile = button.dataset.device === 'mobile';
      $$('[data-device]', ed).forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      ed.classList.toggle('is-mobile', mobile); outW.textContent = mobile ? '390px' : '1440px';
      touch(); glide(); x = 0; setTimeout(apply, 650);
    }));
    $$('[data-tab]', ed).forEach(button => button.addEventListener('click', () => {
      $$('[data-tab]', ed).forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      $$('[data-pane]', ed).forEach(pane => { pane.hidden = pane.dataset.pane !== button.dataset.tab; });
    }));
    // Calques : un clic fait défiler la page, et le calque actif suit la section à l’écran.
    const gotos = $$('[data-goto]', ed);
    const setLayer = button => gotos.forEach(el => el.classList.toggle('on', el === button));
    gotos.forEach(button => button.addEventListener('click', () => { setLayer(button); $(button.dataset.goto)?.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'start'}); }));
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setLayer(gotos.find(el => $(el.dataset.goto) === entry.target)); }), {rootMargin: '-45% 0px -45% 0px'});
      gotos.forEach(button => { const section = $(button.dataset.goto); if (section) spy.observe(section); });
    }
    const fonds = $$('[data-theme-set]', ed);
    const syncFonds = () => fonds.forEach(el => el.setAttribute('aria-pressed', String(el.dataset.themeSet === (root.dataset.theme || 'dark'))));
    fonds.forEach(button => button.addEventListener('click', () => { if ((root.dataset.theme || 'dark') !== button.dataset.themeSet) toggle?.click(); syncFonds(); }));
    toggle?.addEventListener('click', () => setTimeout(syncFonds));
    syncFonds();
    addEventListener('resize', apply);

    if (!reduced) {
      // Deux pointeurs de collaborateurs se promènent sur le plan de travail (ils s’effacent dès que vous y entrez).
      [['c1', 'Eliel'], ['c2', 'Studio']].forEach(([cls, name]) => {
        const cursor = document.createElement('i'); cursor.className = `ed-cursor ${cls}`; cursor.setAttribute('aria-hidden', 'true');
        const label = document.createElement('b'); label.textContent = name; cursor.append(label); canvas.append(cursor);
      });
      // L’affiche de l’atelier écrit toute seule quelques mots, jusqu’à ce que vous preniez la main.
      const input = $('#poster-word'), cycle = ['Oser.', 'Dire.', 'Créer.', 'Rester.'];
      let auto = true, word = 'Oser.', index = 0, erasing = true;
      const show = value => { $$('[data-word]').forEach(el => { el.textContent = value || '\u00a0'; }); fit(value || 'Oser.'); if (document.activeElement !== input) input.value = value; };
      const stop = () => { auto = false; };
      input.addEventListener('focus', stop); input.addEventListener('input', stop);
      $$('.inks button').forEach(button => button.addEventListener('click', stop));
      const type = () => {
        if (!auto) return;
        let wait = 110;
        if (!visible || document.hidden) wait = 900;
        else if (erasing) { word = word.slice(0, -1); show(word); if (!word) { erasing = false; index = (index + 1) % cycle.length; wait = 320; } else wait = 60; }
        else { word = cycle[index].slice(0, word.length + 1); show(word); if (word === cycle[index]) { erasing = true; wait = 2600; } }
        setTimeout(type, wait);
      };
      setTimeout(type, 3200);
    }
  }

  // Outils : la liste est doublée pour défiler sans couture sur mobile (les copies restent masquées ailleurs).
  const toolList = $('.tools ul');
  if (toolList && !reduced) {
    [...toolList.children].forEach(item => { const copy = item.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); toolList.append(copy); });
    toolList.parentElement.classList.add('run');
  }

  // Section projets : un double-clic n’importe où mène à la page projets.
  // Un clic simple sur un panneau ouvre toujours son projet, après un court délai qui laisse le temps au second clic.
  const worksEl = $('#projets');
  if (worksEl) {
    const all = 'pages/portfolio.html';
    let pending = 0;
    worksEl.addEventListener('click', e => {
      const panel = e.target.closest('a.panel');
      if (!panel || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); clearTimeout(pending);
      pending = setTimeout(() => { location.href = panel.href; }, 280);
    });
    worksEl.addEventListener('dblclick', e => {
      if (e.target.closest('.works-foot')) return;
      e.preventDefault(); clearTimeout(pending); location.href = all;
    });
  }

  // Section « Ce que nous construisons » : un double-clic ouvre la page services.
  $('.services')?.addEventListener('dblclick', e => {
    if (e.target.closest('a, button')) return;
    e.preventDefault(); location.href = 'pages/services.html';
  });

  // Bandeau.
  const ticker = $('.ticker-track');
  if (ticker) for (let i = 0; i < 4; i++) ['Identité visuelle', 'Direction artistique', 'Digital', 'Motion', 'Communication'].forEach(text => {
    const word = document.createElement('span'); word.textContent = text;
    const dot = document.createElement('i'); dot.textContent = '•';
    ticker.append(word, dot);
  });

  // Anneau : les trois projets sont répétés pour remplir neuf panneaux.
  const ring = $('[data-ring]');
  if (ring) {
    const originals = $$('.panel', ring);
    for (let i = originals.length; i < 9; i++) { const copy = originals[i % originals.length].cloneNode(true); copy.tabIndex = -1; copy.setAttribute('aria-hidden', 'true'); ring.append(copy); }
    $$('.panel', ring).forEach((panel, i) => panel.style.setProperty('--i', i));
    // Le film ne tourne que lorsque la section est à l’écran.
    const ringFilm = $('video', ring);
    if (ringFilm && !reduced && 'IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) ringFilm.play().catch(() => {}); else ringFilm.pause(); })).observe(ring);
  }

  const top = $('.top'), works = $('.works'), cta = $('.cta'), big = $('.bigmark svg');
  const values = $('.values');
  let queued = false;
  const started = performance.now();
  function frame(now = performance.now()) {
    queued = false;
    const vh = innerHeight;
    top.classList.toggle('stuck', scrollY > 80);
    if (reduced) return;
    if (ring) {
      const rect = works.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const p = clamp(-rect.top / Math.max(1, rect.height - vh));
        ring.style.setProperty('--spin', `${(-(p * 330)).toFixed(2)}deg`);
        // Fin du défilement : l’anneau se floute et « Voir plus » apparaît.
        works.classList.toggle('more-on', p > .93);
      }
    }
    // Page à propos : la ligne des valeurs se remplit à mesure qu’on descend.
    if (values) { const rect = values.getBoundingClientRect(); values.style.setProperty('--p', clamp((vh * .7 - rect.top) / rect.height).toFixed(3)); }
    if (big) { const rect = cta.getBoundingClientRect(); if (rect.top < vh) big.style.setProperty('--e', clamp((vh - rect.top) / rect.height).toFixed(3)); }
  }
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, {passive: true});
  addEventListener('resize', request);
  frame();

  if (reduced || !('IntersectionObserver' in window)) { root.classList.remove('opening-on'); return; }
  root.classList.add('motion');

  // Écran d’ouverture : il joue à chaque arrivée sur l’accueil, puis se retire.
  if (root.classList.contains('opening-on')) setTimeout(() => {
    root.classList.remove('opening-on'); $('.opening')?.remove();
  }, 3400);

  // Titres d’ouverture découpés lettre par lettre, mots insécables.
  $$('.hero h1, .page-hero h1').forEach(title => {
    if (!title.hasAttribute('aria-label')) title.setAttribute('aria-label', (title.innerText || title.textContent).replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT), texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    let n = 0;
    texts.forEach(text => {
      const out = document.createDocumentFragment();
      text.data.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (!part.trim()) { out.append(' '); return; }
        const word = document.createElement('span'); word.className = 'wd'; word.setAttribute('aria-hidden', 'true');
        [...part].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; s.style.setProperty('--n', n++); word.append(s); });
        out.append(word);
      });
      text.replaceWith(out);
    });
  });
  // Chiffres : ils comptent quand ils entrent à l’écran.
  const counts = $$('[data-count]');
  if (counts.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const node = entry.target.firstChild, target = Number(entry.target.dataset.count), t0 = performance.now();
      const step = now => { const p = clamp((now - t0) / 1400), eased = 1 - Math.pow(1 - p, 3); node.data = String(Math.round(target * eased)); if (p < 1) requestAnimationFrame(step); };
      node.data = '0'; requestAnimationFrame(step); setTimeout(() => { node.data = String(target); }, 1700);
    }), {threshold: .5});
    counts.forEach(el => io.observe(el));
  }
  const bigmark = $('.bigmark');
  if (bigmark) new IntersectionObserver((entries, io) => entries.forEach(entry => { if (entry.isIntersecting) { bigmark.classList.add('in'); io.disconnect(); } }), {threshold: .3}).observe(bigmark);
  const appear = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); appear.unobserve(entry.target); } }), {rootMargin: '0px 0px -8% 0px'});
  $$('[data-reveal]').forEach(el => appear.observe(el));
})();
