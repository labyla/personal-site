# Architecture

Current behavior (2026-11-08): restored the pre-panorama reference-style six-photo accordion. Separate original images, individual hover zoom/waves, numbered Arial labels, cyan frame/glow and plain black background without mountain contour. Roph Regular ENTER, letter births, responsive layout and controls retained.


## Overview

Next.js App Router, TypeScript, React and Three.js. app/page.tsx mounts SiteExperience, which owns loading -> assembling -> entering -> waiting -> melting -> ready. The earlier shaders-based Prisma background remains intact but unmounted.

## Components and responsibilities

- components/glass-intro.tsx: Canvas2D glyph masks and packed signed distances, responsive layout, fullscreen glass-text shader, six cyan-to-deep-teal gradient background stripes, resize and renderer lifecycle.
- components/site-experience.tsx: resource readiness and phase orchestration.
- components/panel-material.ts: black-panel shader, staggered assembly and cyan pointer response; rendered by GlassIntro in the same WebGL context.
- components/loading-timeline.ts: full loading-cycle boundary and assembly duration.
- components/stripe-motion.ts: six-stripe motion with optional non-wrapping tail.
- components/pointer-flow.ts: 128x128 CPU velocity/liquid field shared by one cursor and six independently moving buttons, with advected persistent trails and decay.
- Tests: four stripe motion, two distance, sixteen loader/morph timeline and four persistent-flow checks.
- app/globals.css: black intro underlay and inactive background styles.
- components/background.tsx and components/prisma-background.tsx: preserved pink/purple background.
- Docker: Node 24 runtime/cache volumes and optional Python harness-check service.

## Dependency and data flows

Canvas2D rasterizes lowercase Arial 500 with a rounded outline stroke (5.5% of font size). A 1.2%-of-font-size mask blur followed by a smooth coverage threshold rounds both external corners and internal joins before distance encoding. From 640 px the letters share a horizontal baseline; below they stack upright. Measured ink bounds centre them. The old constraint fitting the word inside the foreground stripe band is removed because glass now belongs to the text.

The glyph mask is rasterized at 2x logical resolution regardless of device pixel ratio. The texture stores sharp glyph coverage in R and packed signed distance in G/B. components/glyph-distance.ts computes a separable squared Euclidean distance to raster contour seeds, preserves holes and coverage, converts device pixels to logical pixels, and packs 1/256px precision over a +/-127px range. It runs only on resize. Two focused tests cover signs, contour distances, holes, symmetry and pixel-ratio scaling. The texture is numerical data without sRGB decoding. Disposal before redraw recreates GPU storage at changed dimensions.

The fullscreen shader draws six spectral lines on black. A smooth along-stripe gradient fades from display RGB (0, 0.92, 0.95) to (0.005, 0.055, 0.10), matching the latest cyan/deep-teal image. Inside glyph coverage the shader applies the inspected Bencho dark preset: size 230 gives radius 115 and bevel 41.4, bend=1, fringe=0.4, edge exponent 2.4, magnification 1.1, inner rim thresholds 1.6/4.5px, dark gain 1.08, directional near/far rim light and edge glow 0.08, plus a 9px shifted soft shadow. Corner affects the reference photograph, not glyph shape. The centre is the wordmark centre; the original circular SDF is replaced by raster glyph distance. The distance field controls rim placement, shadow and bevel depth. A separate Gaussian height texture (blur radius 4.5% of font size) supplies smooth surface slopes. Sobel differences feed a 3D normal with positive Z; its XY projection tends continuously to zero at stroke centres. This replaces normalized distance gradients, whose discontinuous medial-axis direction caused refraction folds in thin strokes. A five-tap 0.75px distance filter smooths rim shading. Display RGB is output directly as in the reference shader, avoiding an additional sRGB conversion. This preserves the material equations, but the source image and glyph geometry necessarily differ from the round photo lens.


The 2.933333-second loop restores six stripes, 0.95 pitch, 0.475 width and 0.035-cycle adjacent delay. It retains bottom-left to top-right cubic motion, 1.8 excursion, 0.34 approach, 0.16 hold, 0.34 departure and 0.16 off-screen reset. Derivative-based antialiasing widens line edges where refracted coordinates compress them. All stripes share crisp middles and blurred ends via abs(x - y), with no interior fade mask.

ResizeObserver updates one canvas; renderer pixel ratio is capped at 2. Cleanup stops the loop and disposes geometry, shader, both textures and renderer.

## Boundaries and invariants

No video, external model, runtime font or reference-site requests. Glass is a shader approximation rather than physical 3D geometry or SVG filters. No audio or visible controls. The loader now transitions automatically after resource readiness and a complete cycle. Preserve the inactive Prisma background.

## Runtime and deployment

Local Docker Desktop at http://localhost:3000. WebGL required; CSS underlay black. Physical-device performance and GPU-failure behavior unverified. Hosting undecided.

## Related references

- https://bencho.dev/blocks/glass-bubble?c=glass-bubble&size=230&bend=100&fringe=40&corner=0&theme=dark — bubble-glass principles now applied to the text.
- https://tryprisma.xyz/ — retained Arial 500 typography.
- https://kube.io/blog/liquid-glass-css-svg/ — earlier optical reference.
- https://liquidglassdesign.com/gallery/x-logo-liquid-glass-animation — historical composition and motion reference.

## Loading and transition lifecycle

SiteExperience waits for window load and document.fonts.ready. GlassIntro prepares both shader paths and uploads glyph textures before starting its visible clock. No hidden panel renderer runs during loading. Future page resources should join this readiness gate.

The complete loading cycle is about 2.977 seconds, including the last stripe delay. Non-wrapping stripe motion prevents respawning during the exit tail. Readiness still waits for a complete boundary and at least one cycle.

All stages use one opaque WebGL canvas, renderer and frame clock. At the boundary the panel shader renders into a render target; the text shader samples that current image for magnification, refraction and chromatic fringe. There is no transparent canvas handoff or CSS layer switch. The unoccupied background colour is identical on both paths. Glyph-distance filtering is restricted to the immediate glyph contour. Shadow sampling remains continuous without an early-return boundary; numerical glyph textures use linear filtering without mipmaps to avoid packed-distance contour artifacts.

Twelve panels translate from the upper-left with cubic braking (1.15s plus 0.075s stagger). transitionLight(buildTime) starts the existing 1.2s fade immediately after assembly and reaches zero, without waiting for activation or stopping at half illumination.

The original labyla distance field remains the foreground geometry until activation. A second packed ENTER field is sampled separately by rearEnter() at 112% of the original wordmark bounds. It has animated cyan/deep-teal gradient color and a diffuse halo, and is included in background() so the foreground glass can refract it. ENTER follows the horizontal/vertical responsive layout. Only after the 1.2s panel fade reaches zero does the rear layer reveal over 1.1s. ENTER is rasterized directly at its final display bounds with retained antialiased coverage; a five-tap filtered distance field smooths the narrow glow instead of stretching a thresholded mask. No interpolation of labyla into another word occurs.

One native transparent entry target covers the rear layer's bounds. Hover/focus spring scales rear ENTER and the native hit area by roughly 4.5%; foreground labyla and its glyph origins remain fixed. The hover scalar brightens ENTER and strongly increases its diffuse cyan glow. A narrow contour glow follows the illuminated gradient regions in both idle and hover states. Native keyboard focus and guarded activation remain. Waiting is not marked busy.

Activation immediately starts the six measured glyph flights; there is no returning stage or reverse morph. entryVaporProgress() drives rear text evaporation over 0.55s: slight upward drift, softer edges, a soft blurred fade and alpha decay. Only ENTER evaporates; labyla supplies the six animation sources in the same frame. Source order [5,4,3,2,1,0] and 100ms starts remain. Indices 5 and 4 have 3.2s flights continuing through the lower-left and up to the menu centre and information-block corner. Other flights retain 2.1s duration. Original glyph size, contour and positions are preserved before flight.

letterShape() supplies gathering (2–26% local flight), opening (66–100%), size correction and icon visibility. Path speed drives tangent-aligned stretch capped at 24%. Each arrival has 0.4s of bounded size overshoot/smaller rebound and gentle squash. Muted-gray icons resolve independently at 86–100%. The first two circles become analytic rounded rectangles through sectionLayout()/sectionReveal(): the menu expands around its centre; the block expands right/down from its top-left while its icon remains at letterMotion[4].yz. The home icon fades out during menu expansion. Shared glass shading/refraction stays in the same canvas. Each section unfolds for 0.85s, then settles for 0.4s. Ready starts 4.55s after activation; only then do cursor injection and autonomous flute drift start. During flight each moving letter/button supplies its own position and velocity to the same fluid simulation, using the cursor brush behavior. Button trails continue to advect and decay after landing; inactive cursor positions are tracked to avoid a jump on enabling. Resize recomputes responsive source/destination bounds; cleanup removes native button listeners and disposes the single renderer's resources.

The four remaining controls form a centered bottom row with 24px bottom clearance, minimum 16px side margins, diameter up to 84px and responsive gaps up to 16px. Ball radius shrinks on narrow screens so all six fit horizontally. The restored menu uses its previous 720px maximum width, 56px height, 22px corners and 20px top gap. The information block starts 104px down, is up to 960x420px and shrinks to preserve bottom-control clearance. Its icon inset equals the button radius. Shared refraction, frost, soft shadow and cyan rim remain. Ready rendering still samples live panels in the same WebGL context.

No audio context is created. The earlier pink/purple background remains preserved and unmounted.

## Persistent Prisma-style panel motion

The original shaders 4.0.6 ChromaFlow source supplies the simulation model: 128x128 velocity/liquid state, bilinear advection, momentum 13, radius 3.5, speed-dependent injection and one-second exponential-style decay. PointerFlow adapts it to the existing Three.js context; it does not mount a second shaders renderer. A byte texture publishes the liquid density, with five-tap smoothing and a lower visibility threshold appropriate to the black/cyan palette. Stationary cursors stop injecting; trails continue moving/fading after leaving.

The flutes retain the approved assembly, pitch and illumination. After the shared fade, a smooth-start 0.15-cell/s drift restores autonomous movement. Two offscreen guard flutes prevent gaps when the repeated pattern wraps. The rounded refraction profile uses exponent 3, refraction 4 and aberration 0.61 from the preserved Prisma settings. A subtle moving dark pattern adds variation beneath the glass. This is a port/adaptation into the assembled-panel shader, not pixel-identical output from the original pink/purple stack.


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


## 2026-11-07 — Local custom ENTER font

`public/fonts/labyla-wide-black.woff2` is declared as Labyla Wide / 900 by globals.css. GlassIntro explicitly loads this face before starting ResizeObserver and building canvas glyph masks; its existing glyphsReady gate prevents visible fallback text. Cleanup prevents a late font promise from observing an unmounted host. ENTER uses filled original contours without the previous Arial outline inflation. Both rasterization and rearEnter shader preserve a uniform fit inside the previous 112% maximum envelope; native hit bounds use the fitted size. Foreground labyla, glow and animation timing are retained.

`public/fonts/labyla-wide-black.ttf` is the installable version. `scripts/build_display_font.py` builds original geometric glyphs with temporary Docker-only fontTools/Shapely/Pillow dependencies, validates all 95 printable ASCII characters after reopening both font formats, and renders `assets/fonts/specimen.png` plus the vector glyph proof. See `assets/fonts/README.md` for the pinned build command and scope. No third-party font source or external runtime font requests are used.


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
