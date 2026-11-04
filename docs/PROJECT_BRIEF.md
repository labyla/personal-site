# Project brief

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
