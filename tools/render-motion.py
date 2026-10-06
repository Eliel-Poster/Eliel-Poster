"""Original 12-second studio motion study. Pillow + FFmpeg; no site dependency.

python tools/render-motion.py --ffmpeg /path/to/ffmpeg --output assets/video
Uses the installed Outfit and Poppins typefaces; output is a silent H.264 film.
"""
import argparse
import math
import os
from pathlib import Path
import subprocess
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DURATION = 1280, 720, 30, 12
RED, INK, PAPER = '#c62828', '#0a0a0a', '#f4f1eb'
parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--output', type=Path, default=Path('assets/video'))
parser.add_argument('--fonts', type=Path, default=Path(os.environ['LOCALAPPDATA']) / 'Microsoft/Windows/Fonts')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)

@lru_cache(maxsize=64)
def font(size, body=False):
    return ImageFont.truetype(str(args.fonts / ('Poppins-Regular.ttf' if body else 'Outfit-SemiBold.ttf')), size)

def ease(v):
    return 1 - (1 - max(0, min(1, v))) ** 4

def text(draw, position, value, size, color, body=False, **kwargs):
    draw.text(position, value, font=font(size, body), fill=color, **kwargs)

def reveal(canvas, value, x, y, size, progress, color):
    layer = Image.new('RGBA', (W, size + 35))
    ImageDraw.Draw(layer).text((0, int((1 - ease(progress)) * (size + 35))), value, font=font(size), fill=color)
    canvas.paste(layer, (x, y), layer)

def chrome(draw, number, color, elapsed):
    text(draw, (56, 35), 'ELIEL POSTER', 17, color, True)
    text(draw, (930, 35), 'MOTION STUDY / 001', 14, color, True)
    draw.line((56, 78, 1224, 78), fill=color, width=1)
    text(draw, (56, 660), f'0{number} / 04', 13, color, True)
    text(draw, (905, 660), 'ABIDJAN / STUDIO CRÉATIF', 13, color, True)
    draw.rectangle((56, 700, 56 + int(1168 * elapsed / DURATION), 702), fill=color)

def scene(index, t, elapsed):
    frame = Image.new('RGB', (W, H), [INK, PAPER, RED, PAPER][index])
    draw = ImageDraw.Draw(frame)
    if index == 0:
        for j in range(4):
            panel = Image.new('RGBA', (450, 450))
            inset = 30 + 34 * j
            ImageDraw.Draw(panel).rectangle((inset, inset, 450-inset, 450-inset), outline=RED, width=3)
            panel = panel.rotate(12 + 9 * t + j * 8, resample=Image.Resampling.BICUBIC)
            frame.paste(panel, (770, 143), panel)
        reveal(frame, 'UNE', 56, 112, 194, t / .7, RED)
        reveal(frame, 'IDÉE.', 56, 302, 220, (t-.2)/.8, PAPER)
        text(draw, (65, 591), 'Tout commence ici.', 20, PAPER, True)
        chrome(draw, 1, PAPER, elapsed)
    elif index == 1:
        radius = int(150 + 55 * ease(t/.9))
        cx, cy = 967, 357
        draw.ellipse((cx-radius,cy-radius,cx+radius,cy+radius),fill=RED)
        for j in range(3):
            panel = Image.new('RGBA', (360, 400))
            ImageDraw.Draw(panel).rectangle((40,30,320,370),outline=INK,width=3)
            panel = panel.rotate(-17 + j*15 + math.sin(t)*6,resample=Image.Resampling.BICUBIC)
            frame.paste(panel,(790 + j*12,145),panel)
        reveal(frame,'PREND',56,137,163,t/.8,INK)
        reveal(frame,'FORME.',56,306,174,(t-.13)/.8,RED)
        text(draw,(65,583),'Du sens. Du caractère. Une identité.',19,INK,True)
        chrome(draw,2,INK,elapsed)
    elif index == 2:
        for row in (-1,0,1):
            offset = int(40 * math.sin(t*1.7 + row))
            text(draw,(-45+offset,133+row*147),'MOUVEMENT.',155,RED,stroke_width=1,stroke_fill=PAPER)
        draw.rectangle((0,280,W,478),fill=RED)
        reveal(frame,'DU MOUVEMENT.',56,291,138,t/.7,PAPER)
        x = int(56 + (W-170)*ease((t-.25)/2.1))
        draw.ellipse((x,538,x+42,580),fill=INK)
        draw.line((56,559,x,559),fill=INK,width=2)
        text(draw,(65,607),'Les idées ne tiennent pas en place.',19,PAPER,True)
        chrome(draw,3,PAPER,elapsed)
    else:
        draw.rectangle((56,118,66,590),fill=RED)
        reveal(frame,'eliel',104,137,178,t/.7,INK)
        reveal(frame,'poster®',385,303,180,(t-.13)/.8,RED)
        text(draw,(110,573),'VOTRE IMAGE. UNE AUTRE DIMENSION.',20,INK,True)
        chrome(draw,4,INK,elapsed)
    return frame

def render(t):
    index = min(3,int(t/3))
    local = t-index*3
    frame = scene(index,local,t)
    if index and local < .42:
        previous = scene(index-1,2.99,t)
        shift = int(W*ease(local/.42))
        frame.paste(previous,(-shift,0))
        ImageDraw.Draw(frame).rectangle((W-shift-10,0,W-shift+10,H),fill=RED)
    return frame

output = args.output/'eliel-poster-motion.mp4'
command = [args.ffmpeg,'-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo',
           '-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-', '-an',
           '-c:v','libx264','-preset','medium','-crf','21','-pix_fmt','yuv420p',
           '-movflags','+faststart',str(output)]
process = subprocess.Popen(command,stdin=subprocess.PIPE)
try:
    for f in range(FPS*DURATION):
        process.stdin.write(render(f/FPS).tobytes())
        if f % 90 == 0: print(f'Rendering {f}/{FPS*DURATION}',flush=True)
finally:
    process.stdin.close()
if process.wait(): raise SystemExit('FFmpeg render failed')
render(7.9).save(args.output/'motion-studio-poster.webp',quality=90)
print(f'Created {output} ({output.stat().st_size} bytes)',flush=True)
