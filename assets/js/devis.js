/* ============================================================
   ELIEL POSTER — devis.js
   Formulaire de devis avec EmailJS
   ============================================================ */

/* ══════════════════════════════════════════════
   ⚙️  CONFIGURATION EMAILJS
   Remplace ces 3 valeurs par les tiennes
   sur https://www.emailjs.com
   ══════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'DRSeAEktOdfgfNcbA';
const EMAILJS_SERVICE_ID  = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_eohyi9n';

/* ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // Initialiser EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const form      = document.getElementById('formDevis');
    const msgBox    = document.getElementById('message-devis');
    const btnSubmit = form?.querySelector('.btn-devis');

    if (!form) return;

    /* ── 1. VALIDATION EN TEMPS RÉEL ── */
    const champsRequis = form.querySelectorAll('[required]');

    champsRequis.forEach(champ => {
        champ.addEventListener('blur',  () => validerChamp(champ));
        champ.addEventListener('input', () => {
            if (champ.classList.contains('champ--erreur')) validerChamp(champ);
        });
    });

    function validerChamp(champ) {
        supprimerErreur(champ);

        if (!champ.value.trim()) {
            afficherErreur(champ, 'Ce champ est obligatoire.');
            return false;
        }
        if (champ.type === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value.trim())) {
                afficherErreur(champ, 'Adresse email invalide.');
                return false;
            }
        }
        if (champ.type === 'tel') {
            if (champ.value.replace(/\D/g, '').length < 8) {
                afficherErreur(champ, 'Numéro de téléphone invalide.');
                return false;
            }
        }
        if (champ.tagName === 'TEXTAREA' && champ.value.trim().length < 20) {
            afficherErreur(champ, 'Décrivez votre projet en au moins 20 caractères.');
            return false;
        }

        champ.classList.add('champ--valide');
        return true;
    }

    function afficherErreur(champ, msg) {
        champ.classList.add('champ--erreur');
        champ.classList.remove('champ--valide');
        const span = document.createElement('span');
        span.classList.add('msg-erreur');
        span.textContent = msg;
        champ.closest('.input-box').appendChild(span);
    }

    function supprimerErreur(champ) {
        champ.classList.remove('champ--erreur', 'champ--valide');
        champ.closest('.input-box')?.querySelector('.msg-erreur')?.remove();
    }

    function validerBudget() {
        const choisi = form.querySelector('input[name="budget"]:checked');
        const wrap   = form.querySelector('.budget-group');
        wrap?.parentElement?.querySelector('.msg-erreur')?.remove();
        if (!choisi) {
            const span = document.createElement('span');
            span.classList.add('msg-erreur');
            span.textContent = 'Veuillez sélectionner un budget.';
            wrap?.after(span);
            return false;
        }
        return true;
    }

    /* ── 2. SOUMISSION ── */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let ok = true;
        champsRequis.forEach(c => { if (!validerChamp(c)) ok = false; });
        if (!validerBudget()) ok = false;

        if (!ok) {
            afficherMessage('error', '⚠ Veuillez corriger les erreurs avant d\'envoyer.');
            form.querySelector('.champ--erreur')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setBtnLoading(true);
        afficherMessage('', '');

        // Paramètres envoyés à EmailJS (doivent correspondre aux variables du template)
        const params = {
            nom:         getValue('nom'),
            prenoms:     getValue('prenoms'),
            email:       getValue('email'),
            telephone:   getValue('telephone'),
            entreprise:  getValue('entreprise') || 'Non renseignée',
            service:     getValue('service'),
            budget:      form.querySelector('input[name="budget"]:checked')?.value || 'Non précisé',
            delai:       getValue('delai') || 'Non précisé',
            description: getValue('description'),
            comment:     getValue('comment') || 'Non renseignée',
            date:        new Date().toLocaleString('fr-FR'),
        };

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);

            afficherMessage('success', '✓ Votre demande a bien été envoyée ! Nous vous répondons sous 24h.');
            form.reset();
            form.querySelectorAll('.champ--valide').forEach(c => c.classList.remove('champ--valide'));
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('EmailJS error:', err);

            // Fallback : ouvrir Gmail avec les données pré-remplies
            const sujet = encodeURIComponent(`Devis — ${params.service}`);
            const corps = encodeURIComponent(
`Nom : ${params.nom} ${params.prenoms}
Email : ${params.email}
Téléphone : ${params.telephone}
Entreprise : ${params.entreprise}
Service : ${params.service}
Budget : ${params.budget}
Délai : ${params.delai}
Description : ${params.description}
Source : ${params.comment}
Date : ${params.date}`
            );
            const dest = ['postereliel', 'gmail.com'].join('@');

            afficherMessage('success', '✓ Redirection vers Gmail pour finaliser l\'envoi…');
            setTimeout(() => {
                window.open(`https://mail.google.com/mail/?view=cm&to=${dest}&su=${sujet}&body=${corps}`, '_blank');
            }, 800);
        }

        setBtnLoading(false);
    });

    /* ── 3. HELPERS ── */
    function getValue(id) {
        return document.getElementById(id)?.value.trim() || '';
    }

    function setBtnLoading(loading) {
        if (!btnSubmit) return;
        if (loading) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner"></span> Envoi en cours…';
        } else {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Envoyer ma demande de devis <span class="btn-fleche">→</span>';
        }
    }

    function afficherMessage(type, texte) {
        if (!msgBox) return;
        msgBox.className = '';
        msgBox.textContent = texte;
        if (type) {
            msgBox.classList.add(type);
            msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /* ── 4. BUDGET highlight ── */
    document.querySelectorAll('.budget-item input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.budget-item').forEach(i => i.classList.remove('budget-item--actif'));
            radio.closest('.budget-item').classList.add('budget-item--actif');
        });
    });

    /* ── 5. COMPTEUR CARACTÈRES ── */
    const textarea = document.getElementById('description');
    if (textarea) {
        const cpt = document.createElement('span');
        cpt.classList.add('compteur-chars');
        cpt.textContent = '0 / 500 caractères';
        textarea.closest('.input-box').appendChild(cpt);
        textarea.setAttribute('maxlength', '500');
        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            cpt.textContent = `${len} / 500 caractères`;
            cpt.classList.toggle('compteur--alerte', len > 450);
        });
    }

    /* ── 6. SCROLL REVEAL ── */
    document.querySelectorAll('.form-etape').forEach(el => el.classList.add('reveal'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.form-etape.reveal').forEach(el => obs.observe(el));

});