"""Generate the self-hosted Newsreader files used by the site (run after upgrading @fontsource-variable/newsreader).

    pip install fonttools brotli
    python scripts/instance-fonts.py            # from website/

The original design loaded Newsreader from Google Fonts with optical sizes 6..72 and weights 400..600 only
(`Newsreader:ital,opsz,wght@0,6..72,400;…;1,6..72,500`). The fontsource variable files cover weights 200..800, so
this script limits the weight axis to 400..600 (the optical-size axis is kept whole). Every weight the site uses
renders exactly as before; the Latin files shrink by about 30 % (132 -> 92 kB, 147 -> 103 kB).

Writes src/assets/fonts/newsreader-<subset>-opsz-<style>.woff2; src/assets/fonts/newsreader.css declares them.
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules" / "@fontsource-variable" / "newsreader" / "files"
OUT = ROOT / "src" / "assets" / "fonts"
WEIGHTS = (400, 600)

OUT.mkdir(parents=True, exist_ok=True)
for subset in ("latin", "latin-ext", "vietnamese"):
    for style in ("normal", "italic"):
        name = f"newsreader-{subset}-opsz-{style}.woff2"
        font = TTFont(SRC / name)
        font = instancer.instantiateVariableFont(font, {"wght": WEIGHTS})
        font.flavor = "woff2"
        font.save(OUT / name)
        print(f"{name}: {(SRC / name).stat().st_size // 1024} kB -> {(OUT / name).stat().st_size // 1024} kB")
