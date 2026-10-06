document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qualifyingForm');
    if (!form) return;
    const byId = id => document.getElementById(id);
    const fields = ['contactMessage', 'contactName', 'contactPhone', 'contactEmail'];
    const key = 'eliel_contact_draft_v1';
    const pref = byId('prefWhatsapp');
    function update() {
        if (pref) {
            byId('whatsappField').style.display = pref.checked ? 'block' : 'none';
            byId('emailField').style.display = pref.checked ? 'none' : 'block';
            byId('contactPhone').required = pref.checked;
            byId('contactEmail').required = !pref.checked;
        }
        const counter = byId('charCounter');
        if (counter) counter.textContent = `${byId('contactMessage').value.length} caractères`;
    }
    try {
        const draft = JSON.parse(localStorage.getItem(key) || '{}');
        fields.forEach(id => { if (draft[id]) byId(id).value = draft[id]; });
        if (pref && draft.pref === 'email') byId('prefEmail').checked = true;
    } catch (_) {}
    update();
    form.addEventListener('input', () => {
        update();
        const draft = Object.fromEntries(fields.map(id => [id, byId(id)?.value || '']));
        draft.pref = pref?.checked ? 'whatsapp' : 'email';
        try {
            localStorage.setItem(key, JSON.stringify(draft));
            const status = byId('draftStatus');
            if (status) status.style.display = 'inline-block';
        } catch (_) {}
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const goal = form.querySelector('[name="goal"]:checked');
        const stage = form.querySelector('[name="stage"]:checked');
        const message = ['Bonjour Eliel Poster,', `Je suis ${byId('contactName').value}.`, goal ? `Mon besoin : ${goal.nextElementSibling.textContent}` : '', stage ? `Avancement : ${stage.nextElementSibling.textContent}` : '', byId('contactMessage').value, `Téléphone : ${byId('contactPhone').value}`, `Email : ${byId('contactEmail').value}`].filter(Boolean).join('\n\n');
        const whatsapp = !pref || pref.checked;
        const href = whatsapp ? `https://wa.me/2250576224680?text=${encodeURIComponent(message)}` : `mailto:postereliel@gmail.com?subject=${encodeURIComponent('Nouveau projet · Eliel Poster')}&body=${encodeURIComponent(message)}`;
        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
            feedback = document.createElement('p');
            feedback.className = 'form-feedback';
            feedback.setAttribute('role', 'status');
            form.append(feedback);
        }
        feedback.replaceChildren(document.createTextNode('Votre message est prêt. Validez son envoi dans ' + (whatsapp ? 'WhatsApp.' : 'votre application email.') + ' '));
        const link = document.createElement('a');
        link.href = href;
        link.textContent = whatsapp ? 'Ouvrir WhatsApp ↗' : 'Ouvrir mon email ↗';
        if (whatsapp) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
        feedback.append(link);
        link.click();
    });
});
