# Roph Regular and Bold

Source: https://typebae.com/product/roph/ (2026-11-07).
The public preview loads base64-encoded OTF data from:
- https://typebae.com/wp-content/uploads/tplfp/tplfp4654.js (Regular)
- https://typebae.com/wp-content/uploads/tplfp/tplfp4651.js (Bold)

Decoded the complete data without tracing or rebuilding outlines. Each OTF
contains 247 glyphs and 245 Unicode mappings, including the preview data's
GSUB/GPOS tables. This is the complete preview font; completeness relative to
the purchased distribution has not been established.

Files in public/fonts:
- roph-regular.otf: preview OTF; replaces the previous owner-supplied file at the owner's explicit request.
- roph-bold.otf: preview OTF.
- roph-regular.woff2 and roph-bold.woff2: lossless web conversions.

Regular weight: 400. Bold weight: 700. The active ENTER text loads Roph Regular WOFF2; Bold remains available.
Authoring used Docker python:3.13-alpine, fonttools==4.61.1, brotli==1.2.0.
Reopened WOFF2 files and compared glyph order, Unicode mappings, horizontal
metrics and compiled CFF outlines with the OTF sources; all matched.
All four files loaded successfully through FontFace in the internal browser;
Latin uppercase/lowercase, digits and ENTER were visually inspected.

OTF SHA-256:
- Regular: 8c6ecfa29224a53c7978cd9acd1574a4bc5e17c5750001a85522e6bdb240e9eb
- Bold: 468d7135ad01213eeba73ac2d765e893a2d43e62a10c289f5ff0dd4b2a125c60

Typebae offers a separate Web Font License on the product page. Extracting
preview data does not establish a license for publication; no license was
purchased or verified in this session.
