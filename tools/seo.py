"""Référencement : description et image de partage propres à chaque page, données structurées Schema.org (JSON-LD).

python tools/seo.py
Relançable sans risque : chaque page garde un seul bloc <script type="application/ld+json" id="schema">.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://elielposter.com'
STUDIO = f'{SITE}/#studio'
WEBSITE = f'{SITE}/#website'
DEFAULT_IMAGE = f'{SITE}/assets/img/partage.jpg'

# type de page, description (tirée du texte de la page), image de partage, fil d'Ariane parent
PAGES = {
    'index.html': ('WebPage', 'ELIEL POSTER, studio créatif indépendant à Abidjan : identités, expériences digitales et contenus qui donnent aux marques une présence claire et reconnaissable.', None, None),
    'pages/a-propos.html': ('AboutPage', 'Studio créatif indépendant basé à Abidjan, ELIEL POSTER commence chaque projet par comprendre et le termine par une direction. Le studio et ses valeurs.', None, None),
    'pages/services.html': ('WebPage', 'Dix prestations, un seul studio : logo, charte graphique, direction artistique, affiches, réseaux sociaux, sites, interfaces et motion design à Abidjan.', None, None),
    'pages/portfolio.html': ('CollectionPage', 'Les réalisations d’ELIEL POSTER : identités, campagnes, expériences digitales et contenus pensés pour trouver leur place dans le monde réel.', None, None),
    'pages/contact.html': ('ContactPage', 'Présentez votre projet à ELIEL POSTER, studio créatif à Abidjan. Réponse sous 24h, premier échange sans engagement.', None, None),
    'pages/method.html': ('WebPage', 'Comprendre, donner une direction, créer, décliner, livrer : comment se déroule un projet avec ELIEL POSTER, studio créatif à Abidjan.', None, None),
    'pages/project-abraham.html': ('WebPage', 'Portfolio d’Abraham Dogo, concepteur-rédacteur : une direction artistique et un web design qui font entendre sa voix, les mots avant les effets.', 'assets/img/portfolio/abraham.webp', 'pages/portfolio.html'),
    'pages/project-apa.html': ('WebPage', 'APA Systheme, outil de gestion des présences : une page d’accueil conçue par ELIEL POSTER pour rendre un sujet technique évident en un regard.', 'assets/img/portfolio/apa-systheme.webp', 'pages/portfolio.html'),
    'pages/project-octobre-rose.html': ('WebPage', 'Affiche Octobre Rose pour la filière MIAGE-GI : des étudiants unis, en rose, pour donner envie de rejoindre la lutte contre le cancer du sein.', 'assets/img/portfolio/octobre-rose.webp', 'pages/portfolio.html'),
    'pages/project-masterclass.html': ('WebPage', 'Affiche de la Master Class d’Adoration du 2 avril 2026, organisée par Divine Production : une composition qui hiérarchise chaque information.', 'assets/img/portfolio/masterclass.webp', 'pages/portfolio.html'),
    'pages/project-motion.html': ('WebPage', 'Le film du studio ELIEL POSTER : typographie cinétique, rythme et son. En trente et une secondes, il dit qui nous sommes.', 'assets/video/studio-film.webp', 'pages/portfolio.html'),
    'pages/vision.html': ('WebPage', 'Pourquoi ELIEL POSTER existe : un studio créatif né à Abidjan d’une conviction simple, une idée forte ne devrait jamais être desservie par son image.', None, None),
    'pages/principles.html': ('WebPage', 'Les règles que le studio ELIEL POSTER applique à chaque projet, surtout quand il faut trancher. Pas des valeurs affichées sur un mur.', None, None),
    'pages/ce-que-nous-construisons.html': ('WebPage', 'Identité, communication, digital et motion : quatre métiers pensés ensemble pour que votre image reste la même partout où on la rencontre.', None, None),
    'pages/journal.html': ('WebPage', 'Des notes courtes sur ce que le studio ELIEL POSTER apprend en créant : une idée par note, sur l’identité, l’affiche et le digital.', None, None),
    'pages/centre-information.html': ('WebPage', 'Les questions fréquentes avant de travailler avec ELIEL POSTER, puis les textes légaux du site.', None, None),
}
# Genre affiché sur chaque page projet
GENRES = {'pages/project-abraham.html': 'Direction artistique, web design', 'pages/project-apa.html': 'Design d’interface, site web',
          'pages/project-octobre-rose.html': 'Affiche, campagne de sensibilisation', 'pages/project-masterclass.html': 'Affiche, communication visuelle',
          'pages/project-motion.html': 'Motion design'}


def url(rel):
    return f'{SITE}/' if rel == 'index.html' else f'{SITE}/{rel}'


def name_of(page):
    return html.unescape(re.search(r'<title>(.*?)</title>', page).group(1)).split(' | ')[0]


def studio():
    return {
        '@type': 'ProfessionalService', '@id': STUDIO, 'name': 'ELIEL POSTER', 'url': f'{SITE}/',
        'description': PAGES['index.html'][1],
        'logo': {'@type': 'ImageObject', 'url': f'{SITE}/assets/img/logo.webp', 'width': 556, 'height': 329},
        'image': DEFAULT_IMAGE,
        'email': 'contact@elielposter.com', 'telephone': '+225 05 76 22 46 80',
        'address': {'@type': 'PostalAddress', 'addressLocality': 'Abidjan', 'addressCountry': 'CI'},
        'founder': {'@type': 'Person', 'name': 'Aguia Abhe Paul Eliel'},
        'knowsAbout': ['Identité visuelle', 'Direction artistique', 'Communication visuelle', 'Web design', 'Motion design'],
        'sameAs': ['https://instagram.com/elielposter', 'https://www.linkedin.com/company/eliel-poster/'],
    }


def graph(rel, page):
    kind, desc, image, parent = PAGES[rel]
    here = url(rel); name = name_of(page) if rel != 'index.html' else 'ELIEL POSTER'
    nodes = []
    if rel == 'index.html':
        nodes += [studio(), {'@type': 'WebSite', '@id': WEBSITE, 'url': f'{SITE}/', 'name': 'ELIEL POSTER', 'inLanguage': 'fr', 'publisher': {'@id': STUDIO}}]
    webpage = {'@type': kind, '@id': f'{here}#webpage', 'url': here, 'name': name, 'description': desc, 'inLanguage': 'fr',
               'isPartOf': {'@id': WEBSITE}, 'about': {'@id': STUDIO}}
    if image: webpage['primaryImageOfPage'] = f'{SITE}/{image}'
    if rel != 'index.html':
        crumbs = [('Accueil', f'{SITE}/')] + ([('Réalisations', url(parent))] if parent else []) + [(name, here)]
        webpage['breadcrumb'] = {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(crumbs)]}
    nodes.append(webpage)
    if rel in GENRES:
        nodes.append({'@type': 'CreativeWork', '@id': f'{here}#realisation', 'name': name, 'description': desc, 'genre': GENRES[rel],
                      'image': f'{SITE}/{image}', 'creator': {'@id': STUDIO}, 'mainEntityOfPage': {'@id': f'{here}#webpage'}, 'inLanguage': 'fr'})
    if rel == 'pages/services.html':
        cards = re.findall(r'<div class="svc-body"><h2>(.*?)</h2><p>(.*?)</p>', page)
        assert len(cards) == 10, len(cards)
        nodes.append({'@type': 'ItemList', '@id': f'{here}#services', 'name': 'Nos services', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'item': {'@type': 'Service', 'name': html.unescape(re.sub(r'<[^>]+>', '', t)),
             'description': html.unescape(re.sub(r'<[^>]+>', '', d)), 'provider': {'@id': STUDIO}, 'areaServed': 'Abidjan'}}
            for i, (t, d) in enumerate(cards)]})
    if rel == 'pages/portfolio.html':
        nodes.append({'@type': 'ItemList', '@id': f'{here}#realisations', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'url': url(r)} for i, r in enumerate(GENRES)]})
    return {'@context': 'https://schema.org', '@graph': nodes}


for rel, (kind, desc, image, parent) in PAGES.items():
    for bad in ('—', '–', '·', '↗', '→'):
        assert bad not in desc, (rel, bad)
    assert len(desc) <= 160, (rel, len(desc))
    path = ROOT / rel; page = path.read_text(encoding='utf-8')
    attr = html.escape(desc, quote=True)
    page = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + attr + m.group(2), page, count=1)
    page = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + attr + m.group(2), page, count=1)
    img = f'{SITE}/{image}' if image else DEFAULT_IMAGE
    page = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + img + m.group(2), page, count=1)
    if 'property="og:url"' not in page:
        page = page.replace('<meta property="og:type"', f'<meta property="og:url" content="{url(rel)}"><meta property="og:type"', 1)
    if 'name="twitter:card"' not in page:
        page = page.replace('<meta property="og:type"', '<meta name="twitter:card" content="summary_large_image"><meta property="og:type"', 1)
    block = '<script type="application/ld+json" id="schema">' + json.dumps(graph(rel, page), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>'
    page = re.sub(r'<script type="application/ld\+json" id="schema">.*?</script>', '', page, flags=re.S)
    page = page.replace('</head>', block + '</head>', 1)
    path.write_text(page, encoding='utf-8', newline='\n')
print(f'{len(PAGES)} pages : descriptions, images de partage et données structurées à jour')
