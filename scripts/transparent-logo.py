"""Remove the white matte without resizing or redrawing the original logos.

Opaque artwork colors stay unchanged. Antialiased edge pixels are uncomposited
from white so they retain coverage without a white halo on beige/dark surfaces.
Original files are retained alongside the website assets.
"""
from pathlib import Path
from collections import Counter
from PIL import Image
import shutil

root = Path(__file__).resolve().parents[1] / 'public' / 'images'
for name in ('wordmark', 'logo'):
    original = root / f'{name}-original.png'
    target = root / f'{name}.png'
    if not original.exists():
        shutil.copy2(target, original)
    source = Image.open(original).convert('RGB')
    pixels = list(source.getdata())
    green = Counter(p for p in pixels if p[1] > p[0] and p[1] > p[2]).most_common(1)[0][0]
    result = []
    for rgb in pixels:
        if rgb == (255, 255, 255):
            result.append((0, 0, 0, 0))
            continue
        is_green = rgb[1] > rgb[0] and rgb[1] > rgb[2]
        floor = min(green) if is_green else 0
        alpha = min(1.0, (255 - min(rgb)) / (255 - floor))
        if alpha == 1:
            result.append((*rgb, 255))
        else:
            foreground = tuple(max(0, min(255, round((c - 255 * (1 - alpha)) / alpha))) for c in rgb)
            result.append((*foreground, round(255 * alpha)))
    image = Image.new('RGBA', source.size)
    image.putdata(result)
    image.save(target)
    # A composite on the original white matte must reconstruct the input.
    composite = Image.alpha_composite(Image.new('RGBA', source.size, 'white'), image).convert('RGB')
    maximum_error = max(abs(a - b) for p, q in zip(pixels, composite.getdata()) for a, b in zip(p, q))
    assert maximum_error <= 1, maximum_error
    assert image.size == source.size
    assert all(tuple(out[:3]) == rgb for rgb, out in zip(pixels, result) if out[3] == 255)
    assert all(out[3] == 0 for rgb, out in zip(pixels, result) if rgb == (255, 255, 255))
    print(f'{name}: {source.size}, RGBA, unchanged opaque colors, white matte reconstruction error <= {maximum_error}/255')
