document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    document.body.classList.add('loaded');
    let theme = 'light';
    try { theme = localStorage.getItem('ep-theme') || 'light'; } catch (_) {}
    root.dataset.theme = theme;
    const themeToggle = document.querySelector('.theme-toggle');
    function syncTheme() {
        themeToggle?.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
        themeToggle?.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    }
    syncTheme();
    themeToggle?.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('ep-theme', root.dataset.theme); } catch (_) {}
        syncTheme();
    });
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    function closeMenu(restoreFocus = false) {
        menu?.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
        if (restoreFocus) toggle?.focus();
    }
    toggle?.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu(true); });
    document.addEventListener('click', event => { if (!event.target.closest('.header-nav')) closeMenu(); });
    matchMedia('(max-width: 767px)').addEventListener('change', () => closeMenu());
    const reveals = document.querySelectorAll('.reveal, .project-link, .process-step, .inner-page .solution-card, .inner-page .lab-card');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px 30px 0px' });
        reveals.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
        root.classList.toggle('motion-ready', !reduced.matches);
    }
    reduced.addEventListener('change', () => root.classList.toggle('motion-ready', !reduced.matches));
    const progress = document.createElement('div');
    progress.className = 'progress-line';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    const header = document.querySelector('.header-nav');
    const parallax = document.querySelector('[data-parallax]');
    let frame = 0;
    function paintScroll() {
        const scrollRange = root.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${scrollRange > 0 ? scrollY / scrollRange : 0})`;
        header?.classList.toggle('scrolled', scrollY > 30);
        if (parallax && !reduced.matches && innerWidth > 767) {
            const rect = parallax.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < innerHeight) parallax.style.setProperty('--parallax', `${Math.max(-20, Math.min(20, (rect.top - innerHeight / 2) * .045))}px`);
        }
        frame = 0;
    }
    addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(paintScroll); }, { passive: true });
    addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(paintScroll); });
    paintScroll();
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        let pointerFrame = 0;
        el.addEventListener('pointermove', event => {
            if (reduced.matches || !finePointer.matches) return;
            cancelAnimationFrame(pointerFrame);
            pointerFrame = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                const x = (event.clientX - r.left - r.width / 2) * .12;
                const y = (event.clientY - r.top - r.height / 2) * .16;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
        el.addEventListener('pointerleave', () => { cancelAnimationFrame(pointerFrame); el.style.transform = ''; });
    });
    const curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.append(curtain);
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download') || reduced.matches) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !/^https?:$/.test(url.protocol) || url.pathname === location.pathname || !url.pathname.endsWith('.html')) return;
        event.preventDefault();
        curtain.classList.add('is-leaving');
        setTimeout(() => location.assign(url.href), 350);
    });
    addEventListener('pageshow', () => curtain.classList.remove('is-leaving'));
    document.querySelectorAll('.journal-filter-btn').forEach(button => {
        button.setAttribute('aria-pressed', String(button.classList.contains('active')));
        button.addEventListener('click', () => {
            document.querySelectorAll('.journal-filter-btn').forEach(other => { other.classList.toggle('active', other === button); other.setAttribute('aria-pressed', String(other === button)); });
            document.querySelectorAll('.journal-article-card').forEach(card => { card.hidden = button.dataset.category !== 'all' && card.dataset.category !== button.dataset.category; });
        });
    });
    document.querySelectorAll('.filtre-btn').forEach(button => {
        const cards = [...document.querySelectorAll('.projet-card')];
        const count = cards.filter(card => button.dataset.filtre === 'tous' || card.dataset.categorie === button.dataset.filtre).length;
        const badge = button.querySelector('.filtre-badge');
        if (badge) badge.textContent = count;
        button.setAttribute('aria-pressed', String(button.classList.contains('filtre-actif')));
        button.addEventListener('click', () => {
            document.querySelectorAll('.filtre-btn').forEach(other => { other.classList.toggle('filtre-actif', other === button); other.setAttribute('aria-pressed', String(other === button)); });
            cards.forEach(card => { card.hidden = button.dataset.filtre !== 'tous' && card.dataset.categorie !== button.dataset.filtre; });
        });
    });
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    const marquee = document.querySelector('.expertise-marquee');
    const pause = document.querySelector('.marquee-pause');
    pause?.addEventListener('click', () => {
        const paused = marquee.classList.toggle('is-paused');
        pause.setAttribute('aria-pressed', String(paused));
        pause.setAttribute('aria-label', paused ? 'Reprendre le bandeau animé' : 'Mettre en pause le bandeau animé');
        pause.textContent = paused ? 'Reprendre ↗' : 'Pause Ⅱ';
    });
});
