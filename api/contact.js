// Fonction Vercel : reçoit le formulaire « Parler de mon projet » et l’envoie par e-mail via Resend.
// La clé RESEND_API_KEY est fournie par l’intégration Resend du projet ; elle ne figure jamais dans le code.
// CONTACT_TO et CONTACT_FROM permettent de changer les adresses sans toucher au code.

const TO = process.env.CONTACT_TO || 'contact@elielposter.com';
const FROM = process.env.CONTACT_FROM || 'ELIEL POSTER <contact@elielposter.com>';
const ALLOWED_HOSTS = /^(?:(?:www\.)?elielposter\.com|[a-z0-9-]+\.vercel\.app|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/i;
const SERVICES = ['Identité', 'Communication & affiches', 'Digital', 'Motion', 'À définir ensemble'];

const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const oneLine = (value, max) => clean(value, max).replace(/[\r\n]+/g, ' ');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ok: false, error: 'method'}); }

  // Le formulaire n’est accepté que depuis le site lui-même.
  const origin = req.headers.origin;
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch (e) { host = ''; }
    if (!ALLOWED_HOSTS.test(host)) return res.status(403).json({ok: false, error: 'origin'});
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  // Champ piège invisible : seul un robot le remplit. On répond « ok » sans rien envoyer.
  if (clean(body.website, 200)) return res.status(200).json({ok: true});

  const name = oneLine(body.name, 100);
  const email = oneLine(body.email, 150);
  const service = SERVICES.includes(body.service) ? body.service : 'À définir ensemble';
  const message = clean(body.message, 4000);
  if (!name || !message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) return res.status(400).json({ok: false, error: 'invalid'});

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ok: false, error: 'not_configured'});

  const text = `Nouveau message depuis elielposter.com\n\nNom : ${name}\nEmail : ${email}\nProjet : ${service}\n\n${message}\n`;
  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from: FROM, to: [TO], reply_to: email, subject: `Un projet — ${name}`, text}),
    });
    if (!sent.ok) {
      // Le détail reste dans les journaux Vercel ; le visiteur ne voit qu’un échec générique.
      console.error('Resend a refusé l’envoi', sent.status, await sent.text());
      return res.status(502).json({ok: false, error: 'send_failed'});
    }
    return res.status(200).json({ok: true});
  } catch (error) {
    console.error('Envoi impossible', error);
    return res.status(502).json({ok: false, error: 'send_failed'});
  }
};
