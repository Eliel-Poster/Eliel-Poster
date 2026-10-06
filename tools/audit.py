from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parent.parent
errors=[]
pages=[ROOT/'index.html',*(ROOT/'pages').rglob('*.html')]
for p in pages:
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    if len(soup.find_all('h1'))!=1: errors.append(f'{p.name}: h1 count')
    for el in soup.find_all(['a','img','script','link','source']):
        value=el.get('href') or el.get('src')
        if not value: continue
        url=urlsplit(value)
        if url.scheme or url.netloc: continue
        target=(p.parent/unquote(url.path)).resolve() if url.path else p
        if not target.exists(): errors.append(f'{p.relative_to(ROOT)}: missing {value}')
        elif url.fragment and target.suffix=='.html':
            ts=soup if target==p else BeautifulSoup(target.read_text(encoding='utf-8'),'html.parser')
            if not ts.find(id=url.fragment): errors.append(f'{p.relative_to(ROOT)}: missing anchor {value}')
print(f'Audited {len(pages)} pages')
for e in errors: print(e)
print(f'{len(errors)} issues')
def luminance(color):
    values=[int(color[i:i+2],16)/255 for i in (1,3,5)]
    linear=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values]
    return sum(a*b for a,b in zip(linear,[.2126,.7152,.0722]))
for foreground,background in [('#f1eee7','#ce2923'),('#20201e','#f1eee7'),('#5d5b56','#f1eee7'),('#cfcbc2','#20201e')]:
    a,b=sorted([luminance(foreground),luminance(background)])
    ratio=(b+.05)/(a+.05)
    print(f'Contrast {foreground}/{background}: {ratio:.2f}:1')
    if ratio < 4.5: errors.append('Insufficient body text contrast')
print(f'Assets: CSS {(ROOT/"assets/css/signature.css").stat().st_size/1024:.1f} KB; JS {(ROOT/"assets/js/signature.js").stat().st_size/1024:.1f} KB')
raise SystemExit(bool(errors))
