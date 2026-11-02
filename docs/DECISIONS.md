# Decision log

## 2026-11-01 — Restart the personal site from a clean harness

The owner requested rebuilding the personal site from scratch, recreating `codex/site-rebuild` without its previous contents or commit ancestry, and using `https://github.com/labyla/get-that-quick` as the harness. Import source commit `ab1d83ab72e1da97499f9a5bfcc2f8efa4a99c1b` without its Git history. Keep other branches unchanged. No application implementation is part of this step.

## 2026-11-01 — First slice: Prisma background only

The owner requested copying the interactive background from https://tryprisma.xyz/ across the full page, with no other site content. Reuse the public effect composition and parameters through the published `shaders` package: Swirl, orange ChromaFlow, FlutedGlass, and FilmGrain. Do not depend on Prisma's assets or APIs at runtime.

## 2026-11-01 — Next.js + TypeScript

The owner selected Next.js + TypeScript over a minimal HTML/JavaScript page as the foundation for further site development. Use App Router and a client-only shader component. Docker and internal-browser checks follow the supplied repository instructions.

## Open decisions

Future content, CMS, storage, and hosting remain undecided. This step creates a local development baseline.

## 2026-11-01 — Pink and purple palette preview

The owner requested previewing the existing glass background with light pink instead of white and purple instead of orange, using an attached palette reference. Use light pink `#e8b0ff` / `#dba0f5` for the swirl and base, and purple `#8950ff` for all flow directions. Match the static CSS fallback to the pink palette. Keep the motion and glass parameters unchanged.

## 2026-11-01 — Editable glass-X intro, background temporarily disabled

The owner requested recreating the composition at https://liquidglassdesign.com/gallery/x-logo-liquid-glass-animation, looping it indefinitely, and disabling the current background until the intro is refined. After learning that the reference is a rendered video, the owner explicitly chose recreation in code so that form, material, and animation can be changed. Use a procedural Three.js scene, retain the existing background components, and mount only the intro on the home page. No automatic transition is included yet. The source is credited to Dmitry Lepisov; visual fidelity remains subject to owner review.

## 2026-11-02 — Staggered stripe braking, hold, and acceleration

The owner corrected the reference motion: each line approaches at maximum speed, decelerates toward a stop near the centre at a different time, holds, then accelerates away symmetrically. Replace the shared constant-speed shift with individual trajectories. Preserve the existing travel direction and central stripe formation. Initial timing within the existing 2.933333-second loop: 0.34 approach, 0.16 hold, 0.34 departure, 0.16 off-screen reset, with 0.035-cycle delays between adjacent stripes. The current reference video could not be replayed (gallery/media connection failure); this implementation follows the owner's explicit four-stage description rather than claiming a measured timing match.

## 2026-11-02 — Six reversed stripes with soft edges and full-frame travel

The owner requested bottom-left to top-right motion, six lines instead of nine, smoothly blurred edges on both sides, and no disappearance before the screen corners. Mirror both the trajectories and resting order, keep the approved braking/hold/acceleration timing, widen the symmetric lateral edge transition, and remove the fixed diagonal ribbon mask that caused premature fading. Loop resets still occur beyond the viewport.

## 2026-11-02 — Sharp centre, blurred perimeter

The owner clarified that stripe blur should disappear smoothly toward the centre of the screen and increase near its edges. Interpolate the lateral edge softness by distance from the centre in normalized screen coordinates, retaining stripe width, colour, count, motion, and full-frame travel.

## 2026-11-02 — Equal per-stripe sharpness, tighter spacing, steeper speed curve

The owner clarified that every stripe must have the same sharp middle and blurred ends, including the outer stripes. The previous radial screen-distance rule was incorrect. Use only the coordinate along the stripes (`x - y`) for softness; the perpendicular coordinate (`x + y`) controls stripe placement. Reduce resting pitch from 1.25 to 0.95 units. Scale the cubic displacement coefficient by 1.8 for a steeper parabolic speed curve, retaining the existing zero-speed start, holds, staggering, and mirrored approach/departure.

## 2026-11-02 — Responsive liquid-glass pseudonym

The owner approved the stripe work and requested replacing the X with lowercase `labyla`, using https://kube.io/blog/liquid-glass-css-svg/ as the glass reference. Apply refraction and edge highlights in the existing Three.js scene; retain approved stripe geometry, motion, and focus code. Use locally bundled Helvetiker Bold glyph outlines, with their embedded licence, and beveled transmissive lettering. At widths below 640 px stack upright letters top to bottom; otherwise use a horizontal baseline. Fit the wordmark to the viewport on every resize.

## 2026-11-02 — Black serif wordmark beneath frosted glass stripes

The owner changed the concept to a black background with flat labyla lettering like the attached heavy high-contrast serif reference. Move liquid glass to the six foreground stripes with slight frost and subtle glowing rims. Retain approved motion and responsive orientation. Locally bundled OFL Bodoni Moda at weight 900 visually approximates the reference; it is not an exact font identification. Replace physical text geometry with a Canvas2D texture and a fullscreen refraction shader. Remove the now-unused Helvetiker asset created for the superseded text.

## 2026-11-02 — Bencho optics, Prisma font and full glass coverage

The owner requested Bencho glass-bubble styling, Prisma’s font, and glass covering the complete word. Inspected Bencho preview and published optical notes: centre magnification, outward bevel refraction with a 2.4-power profile, chromatic fringe, directional rim and shadow. Adapt these to stripes. Prisma h1 computed font is Arial, Helvetica, sans-serif at weight 500; use system Arial 500 and remove superseded Bodoni assets. Reduce word size and fit its diagonal footprint within the glass band. Increase to ten stripes, with slightly overlapping full glass masks. Retain cubic motion, cycle, pitch, direction and hold duration; reduce adjacent delay to 0.015 cycles so all ten share a central hold. Transparent glass coverage keeps text visible through refraction rather than hiding it opaquely.

## 2026-11-02 — Glass text in front of restored white stripes

The owner requested moving the current liquid-glass style from the stripes to labyla and putting white lines behind it, with their earlier count and spacing. Restore six lines, 0.95 pitch, 0.475 width and original 0.035-cycle stagger. Keep current Arial 500, text size and responsive orientation while removing the superseded full-band word fitting. Apply bevel refraction, slight frost, chromatic fringe and rim light inside a sharp glyph mask, using a softened glyph mask for optical normals. This supersedes ten foreground glass lines and the shared-hold coverage requirement.

## 2026-11-02 — Specified Bencho optics and spectral transmitted light

The owner requested the full Bencho glass-bubble style at Size 230, Bend 100, Fringe 40, Corner 0 and dark theme, plus line colours that produce highlights like the attached multicolour glass image. Inspected the actual published shader and controls in the internal browser. Match its optical equations and normalized values (bend 1.0, fringe 0.4), dark lighting, magnification and shadow. Corner rounds the photo, not the lens or glyphs; no photo is present here. Replace the blurred-mask bevel approximation with packed signed glyph distance and smoothed contour normals. Use saturated along-line spectral gradients. Preserve Arial, responsive word size, six-line geometry and motion. The material is transferred to the existing text silhouette; this is not a claim of pixel-identical round-lens output with a different background.

## 2026-11-02 — Cyan gradient and rounded lettering

The owner requested the line gradient from the attached cyan/deep-blue-green image and rounded edges throughout the glass text. Replace the spectrum palette with a smooth bright-cyan to deep-teal gradient along the lines. Preserve the current glyph proportions and round their contours using a round-join outline plus small blur/threshold mask smoothing, including inner joins. Rebuild signed distance from that rounded silhouette so refraction and rims follow it. Retain Bencho optics, six-line motion and responsive orientation.

## 2026-11-02 — Remove refraction folds and pixel stair steps

The owner reported interior breaks and pixelated rims with close-up screenshots. The normalized signed-distance gradient changes direction at a thin stroke's medial axis, while the 41.4px reference bevel still applies a large displacement there. Separate surface slope from contour distance: use a smooth Gaussian glyph height field, derive a 3D normal with positive Z, and use its XY component for displacement and light. It continuously approaches zero at stroke centres. Keep distance for rim/bevel/shadow; filter it slightly for lighting, rasterize glyph masks at 2x, allow renderer DPR up to 2, and antialias compressed stripe samples via screen derivatives. Preserve silhouette, palette, layout and choreography. This is a necessary adaptation of round-lens optics to thin glyph strokes.

## 2026-11-02 — Synthesized arrival/departure sounds

The owner requested Bencho boot on line arrival and step on departure. The Download Boot action opened a Pro upgrade gate. Asked about source choice; owner explicitly selected similar sounds synthesized in code without Bencho Pro. Author original PCM approximations, not copied WAV or gated code. Sync arrival to each line's stop at local phase 0.34 and departure to 0.5. Add a compact accessible enable/mute toggle, initially off, to satisfy browser gesture requirements and let the visitor silence repeating effects. Generate buffers locally; retain visual timing and composition. Public Step description is 311ms/227Hz and Boot is 360ms/291Hz. Exact timbre fidelity is not claimed.

## 2026-11-02 — Silent resource loader and assembling black background

The owner removed audio entirely and made the intro a real loader: at least one full cycle, repeat while resources load, then finish the current cycle with every line off-screen. Gate readiness on window load, fonts and the main renderer's first frame. Non-wrapping line time handles the final delayed stripe without spawning the next first line.

Interpret the reference blocks as diagonal fluted-glass sections. Twelve panels fly from the upper-left with staggered cubic braking, then remain as a black background with cyan/deep-teal hover light. Use a separate shader in the established Three.js stack for actual panel translation; preserve the old pink/purple shaders-based Prisma components. Initial timings are about 2.977 seconds per full loader cycle and 1.975 seconds for assembly. There is no personal page content yet; no content was invented.

## 2026-11-02 — Retained text, illuminated assembly and shared evaporation

The owner requested keeping labyla until the panel-arrival animation ends, lighting every arriving panel as if hovered everywhere, then fading the light and text out simultaneously. Keep GlassIntro mounted as a transparent glyph-only overlay after its complete loading cycle. Illuminate all panels throughout the 1.975s assembly. Use one shared smoothstep value over the following 1.2s for panel light and text alpha; unmount text only after both reach zero. Enable ordinary local hover light afterward. No content is added in this slice.

## 2026-11-02 — Continuous rendering and retained transition optics

The owner reported loader stalls, a pre-assembly flash and lost text glass. Use one opaque WebGL renderer and clock for all stages. Prewarm panel and glyph paths before the loading clock, skip hidden panel frames during loading, and restrict expensive glyph sampling to its vicinity. During assembly/fade, render panels into a texture and refract that live image inside the unchanged glyph material. Preserve approved choreography and shared light/text fade. This replaces the previous transparent two-canvas overlay.

## 2026-11-02 — Persistent flow and autonomous glass motion

The owner reported an external dotted contour around Chrome text and clarified that panels should retain Prisma's cursor trails and autonomous animation. Remove the glyph shader's hard distance cutoff, filter the immediate contour only, and disable numerical texture mipmaps. Port ChromaFlow's velocity/advection/decay model from the installed shaders 4.0.6 dependency into the existing Three.js renderer (momentum 13/radius 3.5), adapting density visibility for cyan on black. Restore rounded cubic flute refraction and 0.15-cell/s drift after the synchronized fade. Keep assembly, palette, loader timing, one canvas and text optics.
