# Project brief

Current behavior (2026-11-08): restored the pre-panorama reference-style six-photo accordion. Separate original images, individual hover zoom/waves, numbered Arial labels, cyan frame/glow and plain black background without mountain contour. Roph Regular ENTER, letter births, responsive layout and controls retained.


## Summary

Build labyla's personal site incrementally. The active experience is a silent glass-text loader, an assembling transition and a black interactive fluted-glass background.

## Users and need

- Owner: labyla, refining loading and transition choreography before adding page content.
- Visitors: watch loading finish cleanly, then see the assembled interactive background.

## Outcomes

- Remove all sound code, synthesis, controls and audio-specific tests.
- Wait for window load, font readiness and the background's first rendered frame.
- Always play at least one entire loading cycle. If resources are late, repeat; once ready, wait until the current cycle ends and all delayed lines are out of view.
- Retain rounded glass labyla and six cyan/deep-teal loading lines.
- Assemble fully illuminated glass sections from the upper-left with staggered braking. Keep labyla above the panels through the whole assembly.
- After assembly, keep original-size glass labyla in front. Panels fade fully to zero over 1.2s without stopping at 50%.
- Only after panels are fully dark, reveal a smoothly antialiased separate ENTER behind labyla, 12% larger in bounds, shimmering in the existing cyan/deep-teal gradient. Illuminated gradient portions have contour glow even when idle; on hover/focus ENTER enlarges slightly and emits a bright diffuse glow; foreground labyla keeps its size.
- On activation, rear ENTER evaporates over 0.55s while the six labyla letters immediately depart last-to-first, 100ms apart, along right/down/left arcs. The first two continue upwards: one unfolds into the restored empty top menu, the other into a wide empty information block beneath it with its icon fixed in the top-left corner. Four controls remain centered at the bottom.
- Retain compact lenses, speed-driven stretch, late opening, muted-gray icons and short settling. Keep the small controls' matte glass styling and weak glow. Bottom-control flights take 2.1s each; the first two take 3.2s, unfold over 0.85s and settle for 0.4s. The complete transition takes 4.55s. No capsule or reverse text morph is rendered.
- Moving letters/buttons leave the same persistent cyan/deep-teal fluid trails as the cursor. Enable cursor interaction and flute drift only after all flights and settling finish; trails advect and decay after movement stops.
- Preserve responsive layouts without scrollbars.

## Scope

Included: loading lifecycle, transition and interactive background in Next.js + TypeScript/Docker. The existing pink/purple Prisma components remain preserved and unmounted. Navigation destinations and links, personal content, CMS, backend, analytics and hosting are deferred.

## Constraints

Branch codex/site-rebuild. Use Docker and the internal browser; no Chrome DevTools MCP. No video or external runtime models/media/fonts. No data collection.

## Open questions

Owner review of extended button flights and menu/information-block unfolding. Content and hosting remain undecided.


## 2026-11-05 — Shared flight into menu only

Owner requested all six buttons flying together on rounded paths and filling only the top menu. All sources now depart simultaneously, sweep right/down/left/up on neighbouring cubic lanes and converge on the menu centre. Arrivals are 60ms apart over 3.2–3.5s; every source unfolds into the same menu bounds over 0.85s, fading its icon. Final settling finishes at 4.75s, enabling cursor flow/drift. Information-block geometry and the bottom row are removed from this active sequence. ENTER, 1.2s panel fade, material and fluid trails remain.


## 2026-11-05 — Sketch trajectory and cumulative right-to-left fill

The owner supplied a sketch and clarified that the moving shapes are letters/liquid, not buttons. Removed procedural icon shader, uniforms and reveal state. All six sources start together, sweep right/below/left, then follow a broad rising curve across the top to an inlet 28px inside the menu right edge. Neighbouring arrivals are 180ms apart (3.2–4.1s). Each letter contributes one sixth of a single shared volume over 0.85s while its droplet radius shrinks. The menu right edge is fixed; its left edge advances left with a subtle settling ripple. A smooth SDF union joins drops into the common fill. No individual rectangle expansion, information block or bottom row is rendered. Final cursor/drift gate is 5.35s after ENTER.


## 2026-11-05 — Sequential liquefaction and uninterrupted acceleration

Owner requested sequential liquefaction, parabolic speed without pauses, a route just below the word and immediate per-letter menu assembly at progressively leftward destinations. Sources now start last-to-first every 0.3s with 2.8s flights. Cubic travelled distance gives quadratic speed; cached 300-segment arc-length tables per source remove control-point-dependent braking. Route floor uses the measured bottom of the word minus 32px, bounded inside the viewport. Each destination advances left by one sixth of the menu width. Deposits take 0.18s, complete before the next arrival, and contribute immediately to the shared right-anchored volume. Final interaction gate is 4.88s.

Baseline Docker tests passed 25/25. Final tests 26/26, typecheck and production build passed. Added actual curved-distance acceleration and raised-route assertions; updated sequential starts, destinations and completed-first-deposit checks. Desktop internal-browser samples verified sequential original glyphs/drops, a first menu segment at 3.0s with five sources still in flight and three segments at 3.62s. Ready completed without captured errors/warnings. Screenshots: /private/tmp/labyla-sequential-first.jpg and /private/tmp/labyla-sequential-growing.jpg. No commit/push.


## 2026-11-06 — Original two-arc motion, vertical reflection, left-to-right menu

Owner clarified direction: right/up/left, with menu assembly left-to-right. Restore the original bottom-control two joined cubic curves and cubic departure/mirrored approach timing from commit 4afe7b2, reflecting Y vertically. Only the final destinations/landing level adapt to the menu. Restore individual flights to 2.1s and starts to 100ms last-to-first. Remove the later arc-length cache and sketch-loop path. Keep per-letter volume deposits, now at progressively rightward menu segments with a fixed left boundary and a rippling right front. Absorption remains 0.18s; final background interaction starts at 3.18s. No icons or information block.

Baseline Docker tests 26/26 and typecheck passed. Final tests 26/26, typecheck and production build passed. Unit checks compare reflected points with the previous two-cubic formulas at 31 points per source across desktop/mobile/landscape layouts, and verify restored speed symmetry, starts, endpoints and accumulation. Browser verification follows. No commit or push.


## 2026-11-07 — Original Labyla Wide typeface

Owner requested a custom font inspired by the supplied heavy, wide P/R/O reference and confirmed uppercase A–Z, true lowercase a–z, digits and basic punctuation. Labyla Wide Black v1 includes all 95 printable ASCII characters as local TTF/WOFF2 assets, editable geometric source and a specimen. ENTER uses it; the foreground wordmark retains Arial. Preserve the custom face's aspect ratio inside the previous 112% maximum envelope instead of independently stretching its width and height. This supersedes the exact Druk asset request and its pending-file blocker.


## 2026-11-07 — ENTER height 150%

Owner requested ENTER about 1.5 times the height of labyla. Set ENTER's rasterized height to 150% of measured foreground bounds while retaining its existing fitted width and shared centre. This supersedes the uniform aspect-ratio fit for the on-site ENTER composition only; the font assets are unchanged. Native hit bounds use the new rasterized size. Gradient, glow, reveal and activation timing remain.


## 2026-11-07 — Proportional ENTER cover

Owner clarified that ENTER stays behind labyla and grows proportionally until the foreground fits inside its bounds. Replace independent X/Y scaling with one cover scale: max(112% foreground width / natural ENTER width, 150% foreground height / natural ENTER height). Retain the shared centre, rear layer, local font and native hit bounds. The 150% height target remains; natural wide proportions intentionally extend ENTER beyond the desktop viewport, where the existing fullscreen canvas clips its sides. This supersedes the height-only stretch.


## 2026-11-07 — Roph ENTER trial

Owner supplied roph-regular_fontlotf145.otf and requested trying it on ENTER. Self-host an unchanged copy as public/fonts/roph-regular.otf, declared as Roph / 400. Explicitly load the face before canvas rasterization. Retain the uniform cover scale (112% width minimum, 150% height target), shared centre, rear layer and existing effects/activation. The original Labyla Wide files and source remain available; the active ENTER face is now Roph.


## 2026-11-07 — Restore original ENTER, retain custom font

Owner requested preserving the custom font and returning the site to its pre-font-experiment state. Restore Arial 500 ENTER, its rounded outline, independent 112% width/height fit, original shader target and matching native hit bounds. Remove the active Roph font-face and explicit font-loading gate. Retain Labyla Wide TTF/WOFF2, geometric source and specimen for future use; the supplied Roph copy is also retained but inactive. Foreground wordmark, gradient, glow, lifecycle and pre-existing menu-flight work remain unchanged.


## 2026-11-07 — Slightly wider ENTER

Owner requested a slightly wider ENTER. Increase its width from 112% to 120% of foreground bounds (about 7.1% wider than before). Keep Arial 500, 112% height, shared centre and existing effects/activation. Update raster width, source bounds, shader target and native hit width together. Custom font deliverables remain preserved.


## 2026-11-07 — Roph Bold ENTER

Owner requested Roph Bold for ENTER. Declare local roph-bold.woff2 as Roph / 700;
use it for canvas measurement and rasterization. Wait for explicit face loading
before observing resize and generating masks; cleanup prevents late observation
after unmount. Preserve 120% width, 112% height, shared centre, rounded outline,
gradient/glow and existing activation/flight timing. Foreground labyla stays Arial.


## 2026-11-07 — Roph Regular ENTER

Owner requested switching ENTER from Roph Bold to Roph Regular. Use local
roph-regular.woff2 / weight 400 for the declared face, canvas measurement,
rasterization and explicit readiness load. Preserve all current sizing,
rounded outline, effects, layout and activation timing. Bold assets remain available.


## 2026-11-07 — Six liquid accordion panels

Owner confirmed replacing the shared empty top menu with six main-content panels,
one for each l-a-b-y-l-a source. The revised request explicitly removes long arcs:
each glyph gathers into a compact drop and moves directly to its own panel centre
with the existing cubic acceleration/braking. Flights last 0.65s with 40ms
last-to-first starts (0.2s total stagger). Each panel stays absent until its drop
arrives, then spreads from the centre over 0.85s with damped liquid-front ripples.
Final settling/interaction gate: 2.1s after activation.

At widths >=640px, six tall panels stand side by side inside a centred maximum
1120px-wide area, 68% viewport height (620px cap). Below 640px, six horizontal
panels stack top-to-bottom, 40px total horizontal inset and 78% viewport height
(800px cap). Gaps remain 10px. Hover/focus/tap expands the active panel using
springs while its neighbours give way; total extent remains fixed. Native buttons
match GPU bounds and support Tab, arrow keys, Return and Escape. Input is gated
until ready. All panels retain the current matte glass material; images, text
and destinations are not yet supplied. Roph Regular ENTER, loader, dark fluted
background and fluid trails remain. No additional dependencies or runtime media.


## 2026-11-07 — Full-viewport accordion

Owner requested panels occupying all available screen space. Remove the previous
outer margins, max-width/height and viewport-percentage limits. The six-panel
accordion now spans the complete viewport on both axes, preserving 10px internal
gaps, rounded corners, responsive orientation, opening springs and liquid births.
Panel destinations and native controls derive from this same full-viewport layout.


## 2026-11-07 — Reference photos and thick glass shoulders

Owner requested comfortable outer spacing, reference imagery, broad liquid-glass
edges blending into the images, dark idle photos and full-colour/wave hover.
Use 40px page insets at >=640px and 20px below; retain 10px internal gaps and
fill all remaining viewport space without dimension caps.

Downloaded the five original 320x480 JPEGs used by Bencho's public Accordion:
bird, cow, house, man, queue; sixth panel repeats bird with owner authorization.
Sources: public/images/accordion/SOURCES.md. Serve all images locally. Decode
images and load Roph before initial glyph construction; prepare one 960x960
CanvasTexture atlas with six native-resolution tiles. Clamp each sample to tile
texel centres to avoid neighbouring-image bleed. Cover-fit the 2:3 originals
without stretching, including responsive accordion resizing. Dispose atlas on
unmount; late readiness completion is guarded by the existing disposed flag.

The photo appears only as its panel spreads, clipped by the same liquid SDF.
A refracting glass shoulder up to 36px wide (scaled down for narrow panels)
blends continuously into the photo with a directional rim highlight. Idle image
brightness is 28%, saturation 35%. The same per-panel spring that opens the
accordion restores brightness/saturation to 100% on hover/focus/click. Reuse the
ENTER two-wave equations (directions 2.8/2.0 and -1.7/2.8, frequencies 0.75/0.48,
amplitudes 0.018/0.012) for image refraction and gentle cyan surface light.
The wave is multiplied by hover, so idle images remain still. Preserve loader,
letter-to-panel births, typography and background. No dependencies added.


## 2026-11-08 — Temporarily disable the fluted background

Owner clarified that only the fluted background and its assembly should be
disabled; retain the loader, ENTER and photo accordion. Set
FLUTED_BACKGROUND_ENABLED=false in components/glass-intro.tsx. Keep the original
panel material, render target, scene and assembly path available for restoration.
Gate fluted render passes and fluid-field updates; post-loader background returns
pure black, and CSS/loading underlays are black. ENTER starts its existing 1.1s
reveal directly after a complete loading cycle, bypassing the now-invisible
assembly/fade delay. entryRevealProgress retains the original default path and
accepts an explicit disabled-background mode. Photo accordion, images, margins,
liquid-glass shoulders and image hover waves remain active.


## 2026-11-08 — Shimmering accordion glow

Owner requested a subtle shifting glow for every panel, stronger on hover like
ENTER. Add a cyan/deep-teal contour and diffuse halo in the existing glass shader.
Use ENTER's spatial sine gradient and 0.75 time rate, with a per-panel phase offset.
Idle halo width is 8px; the existing panel interaction spring increases it to 22px
and strengthens both halo and lit contour on hover/focus/tap. Glow fades in only
at the end of panel spreading, so hidden panels do not reveal their rectangles
early. Decay on both sides of the contour preserves photo centres. Retain black
background, disabled fluted path, image dimming/colour/waves, margins and timing.


## 2026-11-08 — Reference-led editorial accordion redesign

Owner requested matching the supplied numbered glass-card reference using the
existing stack. Preserve six panels, original JPEGs/atlas, loader/ENTER and liquid
letter births, black background and original keyboard/pointer/tap actions.
Owner explicitly named the sixth panel MORE. Titles are ABOUT ME, PROJECTS,
EXPERIENCE, BLOG, CONTACT, MORE. Existing panels had no navigation destinations;
keep their native expansion buttons rather than invent routes.

Add native DOM typography over the existing GPU surfaces: 01–06 at top-left,
SVG northeast arrows at top-right, responsive uppercase Arial headings and cyan
rules beneath them. Chrome fades/rises into view only once ready. Font fitting
measures the longest word to prevent clipping; ABOUT ME may wrap. Frame updates
synchronize bounds, heading size/offset, number colour, arrow movement/glow and
rule growth with the same panel openness value used by the image shader.

Replace only accordion hover bounce with monotonic exponential easing (rate 7),
retaining the existing ENTER spring and liquid birth timing. Active weight 2.6x
versus 1x neighbours; extents and gaps stay fixed. Subtle 4.5% image zoom uses
that same eased state. Preserve image waves at a gentler amplitude; add top/bottom
vignettes for reference contrast, a narrower 17px glass shoulder, thin 0.9–2.6px
cyan/ice contour and broader active neon halo. Idle photos remain darker than
the active image, with original photograph content unchanged.

Desktop panels use reference-proportional page insets (3.125% width, 7.3% height,
minimum 32/40px) and 12–20px gaps. At <960px use horizontal rows with 20px outer
insets and 10px gaps, keeping six labels readable on tablets/phones. Wordmark's
existing 640px breakpoint stays unchanged. Panel corners scale 22–28px. Mobile
chrome positions the heading beside the number in short collapsed rows and
moves it lower-left when opened. Native focus/arrow-key/Return/Escape actions
remain, with focus-visible outlines. Reduced-motion preference makes accordion
interaction state immediate and disables added zoom/waves/shimmer/chrome motion.
No dependencies, image files or navigation routes changed.


## 2026-11-08 — One continuous mountain painting

Owner supplied a full mountain painting plus a separate contour sketch. Use the
unchanged 1672x941 painting as the common source for all six panels. Derive the
actual skyline from that painting (the independent sketch has different peak
positions). scripts/derive_mountain_outline.py uses a source-space ridge guide,
local painted-edge contrast and a median filter to avoid mistaking sky streaks
or blue snow shadows for the silhouette. SVG viewBox exactly matches the image.
Source assets/details: public/images/mountain/.

Both painting and faint background silhouette sample the SAME mountainUv mapping:
centred viewport-wide aspect-preserving cover, independent of panel rectangles.
All panels are windows into this layer; changing their widths simply reveals
different parts without rescaling individual crops. Mobile rows share the same
mapping and crop the panorama to the viewport rather than distorting the artwork.
A shared 2.5% eased zoom moves image and outline together. Per-panel geometric
zoom/refraction/wave offsets are replaced by the shared zoom and existing wave
LIGHT, so no displacement can break ridge alignment at panel boundaries.
Preserve native controls, titles, glyph-to-panel births, colour/brightness changes,
cyan rim/glow and reduced-motion behaviour. Old JPEGs remain retained inactive.

The faint contour is part of background() both during loading/logo and after
ENTER; it stays visible through gaps and outside panel bounds. Image and outline
both decode before the initial glyph frame, use linear-filtered native-resolution
CanvasTextures and are disposed on unmount. No runtime external requests or new
app dependencies. Fluted background remains disabled.


## 2026-11-08 — Revert shared mountain composition

Owner requested returning to the state before the last stage. Removed only the
shared mountain image/projection, contour texture, generator and assets created
for that stage. Restored the 960x960 atlas of bird/cow/house/man/queue/bird,
per-panel cover/zoom/refraction/wave offsets and black background without contour.
Preserved the earlier numbered reference redesign, MORE, Arial labels, cyan
frame/glow, responsive geometry, controls, Roph ENTER and liquid letter births.
This supersedes the shared-mountain decision above; its evidence is historical.
