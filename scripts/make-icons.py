# Generator ikon strony z logo (kostka „S”). Użycie: python scripts/make-icons.py public/logo.png <katalog-wyjściowy>
"""Ikony strony z logo: kostka „S” wycięta z logo.png (ściana + czarny obrys, bez sąsiedniej kostki)."""
import sys
from PIL import Image, ImageFilter, ImageChops, ImageDraw

SRC, OUT = sys.argv[1], sys.argv[2]
logo = Image.open(SRC).convert('RGBA')
reg = logo.crop((0, 0, 200, 230))
px = reg.load(); W, H = reg.size

# maska czerwonej ściany i żółtej kostki obok
red = Image.new('L', reg.size, 0); yel = Image.new('L', reg.size, 0)
rp, yp = red.load(), yel.load()
for y in range(H):
    for x in range(W):
        r, g, b, a = px[x, y]
        if a > 200 and x < 145 and r > 200 and g < 120 and b < 110: rp[x, y] = 255  # tylko czerwień kostki „S”
        if a > 150 and x > 105 and r > 150 and g > 85 and b < 130 and r - g < 105: yp[x, y] = 255  # żółć i pomarańczowy cień kostki „I” (czerwień S: r−g ≈ 145)
# Kształt kostki podąża za prawdziwym obrysem z logo (zaokrąglone rogi, przechył):
# 1) ściana = czerwień z wypełnioną literą (wypełnienie dziur od zewnątrz),
# 2) obrys = ściana rozszerzona dyskiem o grubość obrysu (rozmycie + próg — gładko, bez kwadratów),
# 3) sąsiednia żółta kostka (z literą) z małym marginesem odjęta — wspólny obrys dzielony między kostki.
def solid(mask, r_close):
    m = mask.filter(ImageFilter.GaussianBlur(r_close)).point(lambda v: 255 if v > 60 else 0)
    holes = m.copy(); ImageDraw.floodfill(holes, (0, 0), 128)             # zewnętrze = 128
    return holes.point(lambda v: 0 if v == 128 else 255)                  # wszystko, co nie zewnętrze
def grow(mask, r, t=30):
    return mask.filter(ImageFilter.GaussianBlur(r)).point(lambda v: 255 if v > t else 0)
face = solid(red, 2)
yface = solid(yel, 2)
OUTLINE = 9
die = grow(face, OUTLINE * 0.9)
die = ImageChops.subtract(die, grow(yface, 2.2, 40))
die = die.filter(ImageFilter.GaussianBlur(0.6))                           # antyaliasing krawędzi wycięcia
alpha = ImageChops.multiply(die, reg.split()[3])
cut = reg.copy(); cut.putalpha(alpha)
bb = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
cut = cut.crop(bb)
print('kostka S:', bb, cut.size)

def fit(img, size, scale):
    """Kostka wyśrodkowana w kwadracie size×size, zajmuje `scale` boku (dłuższy wymiar)."""
    w, h = img.size; k = size * scale / max(w, h)
    big = img.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    if k > 1.2: big = big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.alpha_composite(big, ((size - big.width) // 2, (size - big.height) // 2))
    return out

def on_bg(img, size, scale, radius=0):
    """Na ciemnym tle marki (iOS i Android nie pokazują przezroczystości) z delikatną poświatą."""
    bg = Image.new('RGBA', (size, size), (6, 8, 7, 255))
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow); r = size * 0.36
    d.ellipse((size / 2 - r, size / 2 - r, size / 2 + r, size / 2 + r), fill=(239, 91, 76, 70))
    bg.alpha_composite(glow.filter(ImageFilter.GaussianBlur(size * 0.12)))
    bg.alpha_composite(fit(img, size, scale))
    return bg

# favicon.ico: 16/32/48 (przezroczyste tło, kostka prawie na całą ikonę)
ico = [fit(cut, s, 0.98) for s in (16, 32, 48)]
ico[2].save(f'{OUT}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:2])
# icon.png (przeglądarki, zakładki) — przezroczyste, 192 px (bliskie natywnej rozdzielczości kostki)
fit(cut, 192, 0.96).save(f'{OUT}/icon.png')
# apple-icon.png 180 — tło marki (iOS zaokrągla rogi sam)
on_bg(cut, 180, 0.74).convert('RGB').save(f'{OUT}/apple-icon.png')
# manifest: 192 i 512 („any”), 512 maskable — kostka w bezpiecznej strefie (80% → 0.62 z zapasem)
on_bg(cut, 192, 0.74).save(f'{OUT}/icon-192.png')
on_bg(cut, 512, 0.74).save(f'{OUT}/icon-512.png')
on_bg(cut, 512, 0.58).save(f'{OUT}/icon-maskable-512.png')
