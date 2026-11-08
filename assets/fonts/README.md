# Labyla Wide Black — v1.000

Original geometric display typeface created for labyla from the visual direction
of the owner's reference: broad heavy strokes, rounded bowls and small counters.
P/R/O guide the proportions; the other glyphs are newly designed. No commercial
font files, traced font outlines or third-party font source are included.

Includes all 95 printable ASCII characters: A–Z, true lowercase a–z, 0–9, space
and punctuation. Cyrillic, accented Latin, kerning and additional weights are not
included. This first version is intended for large display text.

- `public/fonts/labyla-wide-black.ttf`: installable TrueType font.
- `public/fonts/labyla-wide-black.woff2`: self-hosted website font.
- `assets/fonts/specimen.png`: proof rendered from the TTF.
- `assets/fonts/glyphs.svg`: vector proof of letters and digits.
- `scripts/build_display_font.py`: editable geometric source and reproducible build.

Rebuild from the repository root (all authoring dependencies stay in Docker):

```sh
docker run --rm -v "$PWD:/work" -w /work python:3.13-alpine sh -c \
  'pip install --target /tmp/font-tools fonttools==4.61.1 brotli==1.2.0 shapely==2.1.2 pillow==12.0.0 && PYTHONPATH=/tmp/font-tools python scripts/build_display_font.py'
```

The custom font is preserved for future use. The active ENTER text uses Roph Regular WOFF2. Labyla Wide and the retained Roph OTF
files are not currently loaded by the site. The foreground labyla wordmark keeps its original
typography.
