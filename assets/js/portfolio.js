document.addEventListener('DOMContentLoaded', () => {

    const entete = document.querySelector('.entete');
    if (entete) {
        window.addEventListener('scroll', () => {
            entete.classList.toggle('entete--scroll', window.scrollY > 40);
        });
    }

    function animerCompteur(el) {
        const cible   = parseInt(el.dataset.count, 10);
        const suffix  = el.dataset.suffix || '';
        const duree   = 1600;
        const steps   = 60;
        const pas     = Math.ceil(cible / steps);
        let   val     = 0;

        const timer = setInterval(() => {
            val += pas;
            if (val >= cible) {
                val = cible;
                clearInterval(timer);
            }
            el.textContent = val + suffix;
        }, duree / steps);
    }

    const statsEl = document.querySelectorAll('[data-count]');
    const obsStats = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animerCompteur(entry.target);
                obsStats.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });

    statsEl.forEach(el => obsStats.observe(el));


    const filtresBtns = document.querySelectorAll('.filtre-btn');
    const cartes      = document.querySelectorAll('.projet-card');
    const noResult    = document.getElementById('noResult');
    const grid        = document.getElementById('projetsGrid');

    filtresBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            filtresBtns.forEach(b => b.classList.remove('filtre-btn--actif'));
            btn.classList.add('filtre-btn--actif');

            const filtre = btn.dataset.filtre;
            filtrerProjets(filtre);
        });
    });

    function filtrerProjets(filtre) {
        let visible = 0;

        cartes.forEach((carte, i) => {
            carte.classList.remove('filtre-anim');

            if (filtre === 'tous' || carte.dataset.categorie === filtre) {
                carte.classList.remove('masque');
                setTimeout(() => {
                    carte.classList.add('filtre-anim');
                }, i * 60);
                visible++;
            } else {
                carte.classList.add('masque');
            }
        });

       
        if (noResult) {
            noResult.style.display = visible === 0 ? 'block' : 'none';
        }

        // Réajuster les cartes larges si une seule colonne visible
        ajusterLarges(filtre);
    }


    function ajusterLarges(filtre) {
        const visibles = [...cartes].filter(c => !c.classList.contains('masque'));
        cartes.forEach(c => {
            if (c.classList.contains('projet-card--large')) {
                c.style.gridColumn = visibles.length <= 2 ? 'span 1' : '';
            }
        });
    }

 
    window.resetFiltre = function () {
        filtresBtns.forEach(b => b.classList.remove('filtre-btn--actif'));
        document.querySelector('[data-filtre="tous"]')?.classList.add('filtre-btn--actif');
        filtrerProjets('tous');
    };


    const elemsReveal = document.querySelectorAll(
        '.projet-card, .portfolio-hero-inner, .portfolio-stats, .portfolio-cta-inner'
    );

    elemsReveal.forEach(el => el.classList.add('reveal'));

    const obsReveal = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.classList.contains('projet-card') ? i * 80 : 0;
                setTimeout(() => entry.target.classList.add('reveal--visible'), delay);
                obsReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elemsReveal.forEach(el => obsReveal.observe(el));

    /* ── 6. HOVER TACTILE (mobile) : tap = ouvre l'overlay ── */
    cartes.forEach(carte => {
        carte.addEventListener('touchstart', function () {
            cartes.forEach(c => c.classList.remove('touch-actif'));
            this.classList.toggle('touch-actif');
        }, { passive: true });
    });

    /* ── 7. RIPPLE boutons ── */
    document.querySelectorAll('.btn-hero, .btn-hero-outline').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width  = ripple.style.height = `${size}px`;
            ripple.style.left   = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top    = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    const filtresSection = document.querySelector('.portfolio-filtres-section');
    if (filtresSection && entete) {
        const updateFiltresTop = () => {
            filtresSection.style.top = entete.offsetHeight + 'px';
        };
        updateFiltresTop();
        window.addEventListener('resize', updateFiltresTop);
    }

});
