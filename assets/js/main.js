document.addEventListener('DOMContentLoaded', () => {

    // ---- THEME TOGGLE ----
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('ep-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('ep-theme', next);
    }

    document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(btn => {
        btn?.addEventListener('click', toggleTheme);
    });

    // ---- NAVBAR SCROLL ----
    const entete = document.querySelector('.entete');
    window.addEventListener('scroll', () => {
        entete?.classList.toggle('entete--scroll', window.scrollY > 40);
    }, { passive: true });

    // ---- MOBILE MENU ----
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay    = document.getElementById('menuOverlay');
    const mobileLiens = document.querySelectorAll('.mobile-lien');

    function ouvrirMenu() {
        hamburger?.classList.add('ouvert');
        mobileMenu?.classList.add('ouvert');
        overlay?.classList.add('ouvert');
        hamburger?.setAttribute('aria-expanded','true');
        mobileMenu?.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
    }

    function fermerMenu() {
        hamburger?.classList.remove('ouvert');
        mobileMenu?.classList.remove('ouvert');
        overlay?.classList.remove('ouvert');
        hamburger?.setAttribute('aria-expanded','false');
        mobileMenu?.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => hamburger.classList.contains('ouvert') ? fermerMenu() : ouvrirMenu());
    overlay?.addEventListener('click', fermerMenu);
    mobileLiens.forEach(l => l.addEventListener('click', fermerMenu));

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const cible = document.querySelector(this.getAttribute('href'));
            if (cible) {
                e.preventDefault();
                const offset = (entete?.offsetHeight || 70) + 16;
                window.scrollTo({ top: cible.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
            }
        });
    });

    // ---- ACTIVE NAV ----
    const sections = document.querySelectorAll('section[id]');
    const navLiens = document.querySelectorAll('nav ul li a[href^="#"]');

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLiens.forEach(a => a.classList.toggle('nav-actif', a.getAttribute('href') === `#${id}`));
            }
        });
    }, { threshold: 0.35 }).observe && sections.forEach(s => {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLiens.forEach(a => a.classList.toggle('nav-actif', a.getAttribute('href') === `#${id}`));
                }
            });
        }, { threshold: 0.35 }).observe(s);
    });

    // ---- COUNTER ANIMATION ----
    function animerCompteur(el) {
        const cible  = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const steps  = 55;
        let val = 0;
        const inc = Math.ceil(cible / steps);
        const timer = setInterval(() => {
            val = Math.min(val + inc, cible);
            el.textContent = val + suffix;
            if (val >= cible) clearInterval(timer);
        }, 1600 / steps);
    }

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animerCompteur(entry.target);
                // unobserve after triggering
                entry.target.removeAttribute('data-count');
            }
        });
    }, { threshold: 0.5 }).observe && document.querySelectorAll('[data-count]').forEach(el => {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.dataset.count) {
                    animerCompteur(entry.target);
                    entry.target.removeAttribute('data-count');
                }
            });
        }, { threshold: 0.5 }).observe(el);
    });

    // ---- REVEAL ON SCROLL ----
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = [...(entry.target.parentElement?.children || [])].filter(c => c.classList.contains('reveal'));
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('reveal--visible'), idx * 80);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ---- RIPPLE ----
    document.querySelectorAll('.btn-primary, .btn-ghost, .btn-mobile-cta, .nav-cta, .footer-cta-btn').forEach(btn => {
        btn.style.overflow = 'hidden';
        btn.style.position = 'relative';
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ---- EMAIL OBFUSCATION ----
    document.querySelectorAll('.email-link').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const addr = this.dataset.user + '@' + this.dataset.domain;
            if (this.tagName === 'A') this.href = 'mailto:' + addr;
            this.textContent = addr;
        });
    });

    // ---- FOOTER YEAR ----
    const annee = document.querySelector('.footer-annee');
    if (annee) annee.textContent = new Date().getFullYear();

});
