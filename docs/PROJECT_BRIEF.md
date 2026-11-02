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
- After the last panel arrives, fade panel illumination and text together; both reach zero at the same moment.
- Pointer movement leaves persistent cyan/deep-teal fluid trails through slowly drifting flutes; trails advect and decay after the pointer stops.
- Preserve responsive layouts without scrollbars.

## Scope

Included: loading lifecycle, transition and interactive background in Next.js + TypeScript/Docker. The existing pink/purple Prisma components remain preserved and unmounted. Personal content, CMS, backend, analytics and hosting are deferred.

## Constraints

Branch codex/site-rebuild. Use Docker and the internal browser; no Chrome DevTools MCP. No video or external runtime models/media/fonts. No data collection.

## Open questions

Owner review of the block assembly and hover appearance. Content and hosting remain undecided.
