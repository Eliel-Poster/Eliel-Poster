document.addEventListener('DOMContentLoaded', () => {

    // Page entrance
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });

    // Greeting
    const greeting = document.querySelector('.hero-greeting');
    if (greeting) {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            greeting.textContent = 'Bonjour.';
        } else if (hour >= 12 && hour < 18) {
            greeting.textContent = 'Bon après-midi.';
        } else {
            greeting.textContent = 'Bonsoir.';
        }
    }

    // Rotation des mots
    const dynamicWord = document.getElementById('dynamicWord');

    // Respecter prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dynamicWord && !prefersReducedMotion) {
        const wordsList = [
            { text: 'plateformes.', color: '#D32F2F' },
            { text: 'produits.', color: '#B71C1C' },
            { text: 'expériences.', color: '#0F172A' },
            { text: 'outils.', color: '#EF5350' },
            { text: 'idées qui prennent vie.', color: '#D32F2F' }
        ];

        const intervals = [3200, 3800, 3400, 4200];
        let currentIndex = 0;
        let intervalIndex = 0;

        function rotateWord() {
            dynamicWord.classList.add('slide-out');

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % wordsList.length;
                dynamicWord.textContent = wordsList[currentIndex].text;
                dynamicWord.style.color = wordsList[currentIndex].color;

                dynamicWord.classList.remove('slide-out');
                dynamicWord.classList.add('slide-in-prepare');
                dynamicWord.offsetHeight;
                dynamicWord.classList.remove('slide-in-prepare');
            }, 400);

            intervalIndex = (intervalIndex + 1) % intervals.length;
            setTimeout(rotateWord, intervals[intervalIndex]);
        }

        setTimeout(rotateWord, intervals[0]);
    }

    // Scroll arrow
    const scrollArrow = document.getElementById('scrollArrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Header
    const headerNav = document.querySelector('.header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            headerNav?.classList.add('scrolled');
        } else {
            headerNav?.classList.remove('scrolled');
        }
    }, { passive: true });

    // Hero parallax (desktop uniquement, désactivé si reduced motion)
    const heroContainer = document.querySelector('.hero-type-container');
    const isMobile = window.innerWidth < 768;

    if (heroContainer && !prefersReducedMotion && !isMobile) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            if (scrollY < vh) {
                const progress = scrollY / vh;
                heroContainer.style.filter = 'blur(' + (progress * 5) + 'px)';
                heroContainer.style.opacity = 1 - (progress * 0.6);
            }
        }, { passive: true });
    }

    // Scroll reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Transitions entre pages
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => { window.location.href = href; }, 150);
        });
    });

    // Formulaire
    const contactForm = document.getElementById('qualifyingForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
                setTimeout(() => {
                    alert('Merci pour votre message. Eliel AGUIA vous recontactera sous 24h.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Transmettre ma demande';
                }, 900);
            }
        });
    }

    // Filtres du journal
    const categoryButtons = document.querySelectorAll('.journal-filter-btn');
    const journalCards = document.querySelectorAll('.journal-article-card');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            journalCards.forEach(card => {
                card.style.display = (cat === 'all' || card.dataset.category === cat) ? 'block' : 'none';
            });
        });
    });
});
