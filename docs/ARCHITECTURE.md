# Architecture

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
