/* ============================================================
   ELIEL POSTER — main.js
   Page d'accueil : navigation, animations, scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. ENTÊTE : ombre au scroll ── */
    const entete = document.querySelector('.entete');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            entete.classList.add('entete--scroll');
        } else {
            entete.classList.remove('entete--scroll');
        }
    });

    /* ── 2. NAV : lien actif selon la section visible ── */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('nav ul li a[href^="#"]');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('nav-actif');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav-actif');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observerNav.observe(section));

    /* ── 3. MENU MOBILE : hamburger toggle ── */
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('nav');

    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('nav--ouvert');
            burger.classList.toggle('burger--actif');
        });

        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav--ouvert');
                burger.classList.remove('burger--actif');
            });
        });
    }

    /* ── 4. SCROLL ANIMÉ : liens ancres ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const cible = document.querySelector(this.getAttribute('href'));
            if (cible) {
                e.preventDefault();
                const offset = entete.offsetHeight + 16;
                const top = cible.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ── 5. REVEAL AU SCROLL : apparition des éléments ── */
    const elementsReveal = document.querySelectorAll(
        '.service-card, .apropos-box, .approche-box, .hero-content, .hero-visual, #realisations h2, #realisations p, #temoignages h2, #temoignages p, .cta h2, .cta p'
    );

    elementsReveal.forEach(el => el.classList.add('reveal'));

    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // délai progressif pour les cartes de service
                const delay = entry.target.closest('.services-grid')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 120
                    : 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal--visible');
                }, delay);
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    elementsReveal.forEach(el => observerReveal.observe(el));

    /* ── 6. COMPTEUR STATISTIQUES (si section stats présente) ── */
    function animerCompteur(el) {
        const cible  = parseInt(el.dataset.count, 10);
        const duree  = 1800;
        const pas    = Math.ceil(duree / cible);
        let compteur = 0;

        const timer = setInterval(() => {
            compteur += Math.ceil(cible / 60);
            if (compteur >= cible) {
                compteur = cible;
                clearInterval(timer);
            }
            el.textContent = compteur + (el.dataset.suffix || '');
        }, pas);
    }

    const stats = document.querySelectorAll('[data-count]');
    if (stats.length) {
        const observerStats = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animerCompteur(entry.target);
                    observerStats.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        stats.forEach(stat => observerStats.observe(stat));
    }

    /* ── 7. HERO : animation de la virgule de soulignement du h1 ── */
    const heroH1 = document.querySelector('.hero-content h1');
    if (heroH1) {
        heroH1.classList.add('hero-titre-anime');
    }

    /* ── 8. POINTS CLÉS : activation hover clavier (accessibilité) ── */
    document.querySelectorAll('.points-cles li').forEach(li => {
        li.setAttribute('tabindex', '0');
        li.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                li.classList.toggle('actif');
            }
        });
    });

    /* ── 9. BOUTONS : effet ripple au clic ── */
    document.querySelectorAll('.btn-hero, .btn-hero-outline, .btn-primary, .btn-submit').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width  = ripple.style.height = `${size}px`;
            ripple.style.left   = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top    = `${e.clientY - rect.top  - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ── 10. FOOTER : année automatique ── */
    const annee = document.querySelector('.footer-annee');
    if (annee) {
        annee.textContent = new Date().getFullYear();
    }

});
