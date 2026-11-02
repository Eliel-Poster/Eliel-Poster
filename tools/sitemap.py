"""Génère sitemap.xml : toutes les pages publiques, leur date de dernière modification et leurs images.

python tools/sitemap.py
"""
import re
import subprocess
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://elielposter.com'
# Ordre d'importance : accueil, pages principales, projets, pages éditoriales.
PAGES = ['index.html', 'pages/a-propos.html', 'pages/services.html', 'pages/portfolio.html', 'pages/contact.html', 'pages/method.html',
         'pages/project-abraham.html', 'pages/project-apa.html', 'pages/project-octobre-rose.html', 'pages/project-masterclass.html', 'pages/project-motion.html',
         'pages/vision.html', 'pages/principles.html', 'pages/ce-que-nous-construisons.html', 'pages/journal.html', 'pages/centre-information.html']


def lastmod(path):
    """Date du dernier commit qui touche la page, ou d'aujourd'hui si elle a des changements non commités."""
    rel = path.relative_to(ROOT).as_posix()
    dirty = subprocess.run(['git', 'status', '--porcelain', '--', rel], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if dirty:
        return date.today().isoformat()
    return subprocess.run(['git', 'log', '-1', '--format=%cs', '--', rel], cwd=ROOT, capture_output=True, text=True).stdout.strip() or date.today().isoformat()


def images(path, html):
    """Images de contenu de la page (réalisations et film), en pleine taille, sans doublon."""
    found = []
    for src in re.findall(r'<img[^>]+src="([^"]+)"', html):
        if '/portfolio/' not in src and '/video/' not in src:
            continue
        url = (path.parent / src).resolve().relative_to(ROOT).as_posix()
        url = re.sub(r'-(sm|md)\.webp$', '.webp', url)
        if (ROOT / url).exists() and url not in found:
            found.append(url)
    return found[:8]


def loc(rel):
    return f'{SITE}/' if rel == 'index.html' else f'{SITE}/{rel}'


rows = []
for rel in PAGES:
    path = ROOT / rel
    html = path.read_text(encoding='utf-8')
    assert 'name="robots" content="noindex"' not in html, rel
    pics = ''.join(f'\n    <image:image><image:loc>{escape(SITE + "/" + url)}</image:loc></image:image>' for url in images(path, html))
    rows.append(f'  <url>\n    <loc>{escape(loc(rel))}</loc>\n    <lastmod>{lastmod(path)}</lastmod>{pics}\n  </url>')

xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
       + '\n'.join(rows) + '\n</urlset>\n')
(ROOT / 'sitemap.xml').write_text(xml, encoding='utf-8', newline='\n')
print(f'sitemap.xml : {len(rows)} pages, {xml.count("<image:image>")} images')
