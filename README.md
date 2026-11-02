# labyla — personal site

Next.js + TypeScript personal site. A silent liquid-glass labyla loader plays at least one full six-line cycle while the page, fonts and background renderer become ready. It finishes the current cycle, including the last delayed line leaving the screen, before continuing.

Twelve illuminated diagonal glass sections fly in from the upper-left while labyla stays on top. After the final panel arrives, all-panel light and the text fade together over 1.2 seconds. The black background then responds to pointer hover with the loader’s cyan-to-deep-teal gradient. The page currently contains only this background; personal content comes later.

The original pink/purple Prisma components remain preserved and unmounted. The active background uses the existing Three.js stack. No audio, visible controls or external runtime media/font requests.

## Local development

Requires Docker Desktop. Run from this repository:

```sh
docker compose run --rm app npm ci
docker compose up --build
```

Open http://localhost:3000. Dependencies and Next.js cache live in Docker volumes.

## Verification

```sh
docker compose run --rm app npm test
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run build
docker compose --profile checks run --rm harness python scripts/harness_check.py validate-template
docker compose --profile checks run --rm harness python scripts/harness_check.py check-handoff
```

Inspect the looping intro and desktop/mobile layout in the internal browser. The intro needs WebGL; its static CSS underlay is black. Hosting and subsequent content are undecided.

See `docs/PROGRESS.md` and `docs/HANDOFF.md` for actual verification and next steps.
