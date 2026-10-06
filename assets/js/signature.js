(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header-links');
  const closeMenu = () => { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold: .08});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  const reel = document.querySelector('#hero-reel');
  const toggle = document.querySelector('[data-reel-toggle]');
  let manualPause = reduced.matches || Boolean(navigator.connection?.saveData);
  const updatePlay = () => { if (toggle && reel) { toggle.textContent = reel.paused ? 'Lire l’aperçu' : 'Mettre en pause'; toggle.setAttribute('aria-label', toggle.textContent); } };
  if (reel) {
    reel.addEventListener('play', updatePlay); reel.addEventListener('pause', updatePlay);
    const play = () => { if (!manualPause && !document.hidden) reel.play().catch(updatePlay); };
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) play(); else reel.pause(); }), {threshold:.2}).observe(reel);
    else play();
    const sound = document.querySelector('[data-reel-sound]');
    sound?.addEventListener('click', () => { reel.muted = !reel.muted; sound.setAttribute('aria-pressed', String(!reel.muted)); sound.textContent = reel.muted ? 'Activer le son' : 'Couper le son'; if (!reel.muted && reel.paused) { manualPause = false; reel.play().catch(updatePlay); } });
    toggle?.addEventListener('click', () => { manualPause = !reel.paused; if (reel.paused) reel.play().catch(updatePlay); else reel.pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) reel.pause(); else play(); });
    reduced.addEventListener('change', () => { manualPause = reduced.matches; if (manualPause) reel.pause(); else play(); });
  }
  const dialog = document.querySelector('#viewer');
  let lastTrigger;
  const media = dialog?.querySelector('.viewer-media');
  const title = dialog?.querySelector('#viewer-title');
  const copy = dialog?.querySelector('.viewer-copy');
  document.querySelectorAll('[data-view]').forEach(trigger => trigger.addEventListener('click', e => {
    if (!dialog?.showModal) return;
    e.preventDefault(); lastTrigger = trigger;
    const film = trigger.dataset.view === 'film';
    const node = document.createElement(film ? 'video' : 'img');
    node.src = trigger.dataset.src || trigger.href;
    if (film) { node.controls = true; node.playsInline = true; node.autoplay = !reduced.matches; node.muted = !('sound' in trigger.dataset); }
    else node.alt = trigger.dataset.title || 'Affiche ELIEL POSTER';
    title.textContent = trigger.dataset.title || 'ELIEL POSTER — Le film';
    media.replaceChildren(node); copy.textContent = trigger.dataset.copy || (film ? 'Une idée. Prend forme. Du mouvement. ELIEL POSTER : votre image, une autre dimension. Film de 12 secondes, sans audio.' : 'Direction artistique & communication visuelle — Divine Production.');
    dialog.showModal(); document.body.classList.add('locked'); reel?.pause();
  }));
  dialog?.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog && (e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right || e.clientY < dialog.getBoundingClientRect().top || e.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  dialog?.addEventListener('close', () => { media.querySelector('video')?.pause(); media.replaceChildren(); document.body.classList.remove('locked'); lastTrigger?.focus(); });
  const poster = document.querySelector('.poster-composition');
  document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    poster.style.background = button.dataset.color; poster.style.color = button.dataset.ink;
    poster.querySelector('.poster-mark').style.filter = button.dataset.ink === '#20201e' ? 'none' : 'invert(1)';
  }));
  document.querySelector('#poster-word')?.addEventListener('input', e => { document.querySelectorAll('[data-poster-word]').forEach(el => { el.textContent = e.target.value.trim() || 'Oser.'; }); });
  const form = document.querySelector('.brief-form');
  form?.addEventListener('submit', e => {
    e.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = `Bonjour ELIEL POSTER,\n\nJe suis ${data.get('name')} (${data.get('email')}).\n\nMon projet : ${data.get('service')}\n\n${data.get('message')}\n\nÀ bientôt !`;
    const href = `mailto:contact@elielposter.com?subject=${encodeURIComponent('Un projet — ' + data.get('name'))}&body=${encodeURIComponent(message)}`;
    const status = document.querySelector('.form-status'); status.replaceChildren();
    const description = document.createElement('p'); description.textContent = 'Votre message est prêt. Choisissez comment l’envoyer :';
    const email = document.createElement('a'); email.href = href; email.textContent = 'Ouvrir mon application email ↗';
    const wa = document.createElement('a'); wa.href = 'https://wa.me/2250576224680?text=' + encodeURIComponent(message); wa.target = '_blank'; wa.rel = 'noopener noreferrer'; wa.textContent = 'Envoyer avec WhatsApp ↗'; wa.style.display = 'block'; wa.style.marginTop = '12px';
    status.append(description,email,wa); status.focus();
  });
})();
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const make = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; };

  // Éléments visuels décoratifs, masqués aux lecteurs d’écran.
  const hero = $('.hero');
  let shift, track;
  if (hero) {
    const marquee = make('div', 'marquee'); marquee.setAttribute('aria-hidden', 'true');
    shift = make('div', 'marquee-shift'); track = make('div', 'marquee-track');
    for (let i = 0; i < 6; i++) ['Identité', 'Affiches', 'Motion', 'Digital'].forEach(word => track.append(make('span', '', word), make('i', '', '✺')));
    shift.append(track); marquee.append(shift);
    const sheet = $('.sheet'); if (sheet) sheet.prepend(marquee); else hero.after(marquee);
  }
  const contact = $('.contact-section');
  let ring;
  if (contact) {
    contact.insertAdjacentHTML('beforeend', '<svg class="badge" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="badge-path" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0"/></defs><g class="ring"><text><textPath href="#badge-path" textLength="496">Faire impression ✺ Eliel Poster ✺ Abidjan ✺</textPath></text></g><text class="arrow" x="100" y="120" text-anchor="middle">↗</text></svg>');
    ring = $('.badge .ring', contact);
  }
  const footer = $('.site-footer');
  if (footer) { const word = make('div', 'footer-word'); word.setAttribute('aria-hidden', 'true'); word.append(make('span', '', 'Eliel Poster')); footer.append(word); }

  if (reduced || !('IntersectionObserver' in window)) return;

  // Titres découpés ligne par ligne, texte de conviction mot par mot.
  $$('.section-heading h2, .rail-intro h2, .play-copy h2, .contact-title, .page-hero h1, .case-copy h2').forEach(el => {
    const groups = [[]];
    [...el.childNodes].forEach(node => { if (node.nodeName === 'BR') groups.push([]); else groups.at(-1).push(node); });
    el.replaceChildren(...groups.filter(group => group.some(node => node.textContent.trim())).map((group, i) => {
      const line = make('span', 'line'), inner = make('span', 'line-in');
      inner.style.setProperty('--i', i); inner.append(...group); line.append(inner); return line;
    }));
    el.classList.add('split');
  });
  const sentence = $('.studio-sentence');
  if (sentence) {
    let count = 0;
    const walker = document.createTreeWalker(sentence, NodeFilter.SHOW_TEXT);
    const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(text => {
      const fragment = document.createDocumentFragment();
      text.data.split(/(\s+)/).forEach(part => {
        if (!part.trim()) { fragment.append(part); return; }
        const word = make('span', 'w', part); word.style.setProperty('--i', count++); fragment.append(word);
      });
      text.replaceWith(fragment);
    });
    sentence.style.setProperty('--n', count); sentence.classList.remove('reveal'); sentence.classList.add('is-visible');
  }
  $$('.section-heading .eyebrow, .section-heading>p, .studio>.eyebrow, .studio-bottom>p, .expertise details, .play-copy>.eyebrow, .play-copy>p, .play-controls, .work-ending, .contact-section>.eyebrow, .contact-bottom, .page-hero .eyebrow, .page-hero .intro, .editorial>*, .archive-grid a, .case-art, .case-copy>:not(h2), .film-description>*, .inquiry>*, .reel-page, .footer-top, .footer-end').forEach(el => el.classList.add('rise'));
  const appear = new IntersectionObserver(entries => entries.filter(entry => entry.isIntersecting).forEach((entry, i) => {
    entry.target.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`); entry.target.classList.add('is-visible'); appear.unobserve(entry.target);
  }), {rootMargin: '0px 0px -7% 0px'});
  $$('.split, .rise').forEach(el => appear.observe(el));

  // Effets liés au défilement : une seule boucle, lectures puis écritures.
  const tracked = new Map();
  let queued = false;
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  const nearby = new IntersectionObserver(entries => { entries.forEach(entry => { tracked.get(entry.target).on = entry.isIntersecting; }); request(); }, {rootMargin: '25% 0px'});
  const follow = (el, mode, prop = '--p') => { if (el) { tracked.set(el, {mode, prop, on: false, last: ''}); nearby.observe(el); } };
  const stage = $('.stage'), rail = $('.rail'), railTrack = $('.rail-track'), railPin = $('.rail-pin');
  follow(stage || hero, stage ? 'pin' : 'exit');
  follow(rail, 'pin');
  const cards = $$('.work-grid .project');
  const root = document.documentElement;
  let lastY = scrollY;
  follow(sentence, 'read');
  follow($('.studio'), 'enter', '--e');
  follow(contact, 'enter', '--e');
  follow($('.poster-composition'), 'through');
  follow(footer, 'enter');
  let setWidth = 0;
  const wide = matchMedia('(min-width: 900px)');
  const measure = () => {
    if (track) setWidth = track.scrollWidth / 6;
    if (rail && wide.matches) railPin.scrollLeft = 0;
    if (rail) rail.style.setProperty('--travel', `${wide.matches ? Math.max(0, railTrack.scrollWidth - railPin.clientWidth) : 0}px`);
    request();
  };
  function frame() {
    queued = false;
    const vh = innerHeight, y = scrollY, writes = [];
    tracked.forEach((item, el) => {
      if (!item.on) return;
      const rect = el.getBoundingClientRect();
      const p = item.mode === 'pin' ? -rect.top / Math.max(1, rect.height - vh)
        : item.mode === 'exit' ? -rect.top / rect.height
        : item.mode === 'enter' ? (vh - rect.top) / Math.min(rect.height, vh * .7)
        : item.mode === 'read' ? (vh * .88 - rect.top) / (rect.height + vh * .38)
        : (vh - rect.top) / (vh + rect.height);
      const value = Math.min(1, Math.max(0, p)).toFixed(4);
      if (value !== item.last) { item.last = value; writes.push([el, item.prop, value]); }
    });
    // Cartes projet : chaque carte recule quand la suivante vient la recouvrir.
    cards.forEach((card, i) => {
      const next = cards[i + 1]; if (!next) return;
      const a = card.getBoundingClientRect(), b = next.getBoundingClientRect();
      if (b.top > vh * 1.5 || a.bottom < -vh) return;
      writes.push([card, '--c', Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height)).toFixed(3)]);
    });
    writes.forEach(([el, prop, value]) => el.style.setProperty(prop, value));
    if (shift && setWidth) shift.style.setProperty('--x', `${-((y * .4) % setWidth).toFixed(1)}px`);
    ring?.style.setProperty('--turn', (y * .12).toFixed(1));
    if (Math.abs(y - lastY) > 6) { root.classList.toggle('nav-hidden', y > lastY && y > 400 && !$('.header-links.open')); lastY = y; }
  }
  addEventListener('scroll', request, {passive: true});
  addEventListener('resize', measure);
  addEventListener('load', measure);
  document.fonts?.ready.then(measure);
  measure();

  // Pastille qui suit le pointeur sur les projets.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && $('.project-image')) {
    const tag = make('div', 'cursor-tag', 'Voir'); tag.setAttribute('aria-hidden', 'true'); document.body.append(tag);
    let x = 0, y = 0, tx = 0, ty = 0, running = false;
    const move = () => {
      x += (tx - x) * .2; y += (ty - y) * .2;
      tag.style.setProperty('--cx', `${x.toFixed(1)}px`); tag.style.setProperty('--cy', `${y.toFixed(1)}px`);
      if (tag.classList.contains('on') || Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) requestAnimationFrame(move); else running = false;
    };
    document.addEventListener('pointermove', e => {
      const over = Boolean(e.target.closest?.('.project-image'));
      tx = e.clientX; ty = e.clientY;
      if (over && !tag.classList.contains('on')) { x = tx; y = ty; }
      tag.classList.toggle('on', over);
      if (over && !running) { running = true; requestAnimationFrame(move); }
    }, {passive: true});
    addEventListener('scroll', () => tag.classList.remove('on'), {passive: true});
  }
})();
