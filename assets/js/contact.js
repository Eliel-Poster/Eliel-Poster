/* ============================================================
   ELIEL POSTER — contact.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. ENTÊTE scroll ── */
    const entete = document.querySelector('.entete');
    if (entete) {
        window.addEventListener('scroll', () => {
            entete.classList.toggle('entete--scroll', window.scrollY > 40);
        });
    }

    /* ── 2. COPIER TÉLÉPHONE au clic (liens tel: uniquement) ── */
    document.querySelectorAll('a.coord-item[href^="tel:"]').forEach(item => {
        item.addEventListener('click', function () {
            const val = this.getAttribute('href').replace('tel:', '');
            navigator.clipboard.writeText(val)
                .then(() => afficherToast(`${val} copié !`))
                .catch(() => {});
        });
    });

    /* ── 3. COPIER EMAIL au clic (div avec data-email) ── */
    document.querySelectorAll('[data-email]').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            const email = this.dataset.email;
            navigator.clipboard.writeText(email)
                .then(() => afficherToast(`${email} copié !`))
                .catch(() => {});
        });
    });

    /* ── 4. BOUTON JE PRENDS RENDEZ-VOUS ── */
    const btnRdv = document.getElementById('btnRdv');
    if (btnRdv) {
        btnRdv.addEventListener('click', function () {
            // Ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${-size/2 + rect.width/2}px;top:${-size/2 + rect.height/2}px;`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            const dest  = ['postereliel', 'gmail.com'].join('@');
            const sujet = encodeURIComponent('Demande de rendez-vous visio — Eliel Poster');
            const corps = encodeURIComponent('Bonjour,\n\nJe souhaite réserver un appel découverte de 10 minutes pour discuter de mon projet.\n\nVoici mes disponibilités :\n\nMerci !');

            // Tentative 1 : client mail natif
            const lien = document.createElement('a');
            lien.href  = `mailto:${dest}?subject=${sujet}&body=${corps}`;
            lien.style.display = 'none';
            document.body.appendChild(lien);
            lien.click();
            setTimeout(() => document.body.removeChild(lien), 100);

            // Tentative 2 : ouvrir Gmail web en fallback après 500ms
            setTimeout(() => {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${dest}&su=${sujet}&body=${corps}`;
                window.open(gmailUrl, '_blank');
            }, 500);
        });
    }

    /* ── 5. TOAST ── */
    function afficherToast(message) {
        document.querySelector('.toast')?.remove();
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast--visible'));
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    /* ── 6. SCROLL REVEAL ── */
    const elemsReveal = document.querySelectorAll(
        '.contact-intro, .coord-item, .contact-dispo, .rdv-card, .contact-rapide'
    );
    elemsReveal.forEach(el => el.classList.add('reveal'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('reveal--visible'), i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elemsReveal.forEach(el => obs.observe(el));

    /* ── 7. DOT DISPONIBILITÉ ── */
    const dot        = document.querySelector('.dispo-dot');
    const dispoTexte = document.querySelector('.contact-dispo p');
    if (dot && dispoTexte) {
        const h   = new Date().getHours();
        const j   = new Date().getDay();
        const ok  = j >= 1 && j <= 5 && h >= 8 && h < 18;
        if (!ok) {
            dot.style.cssText  = 'background:#9e9e9e;box-shadow:0 0 0 3px rgba(158,158,158,0.15);animation:none;';
            dispoTexte.textContent = 'Actuellement hors ligne · Répond sous 24h';
        }
    }

});