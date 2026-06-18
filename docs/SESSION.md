# Session

## 2026-06-16

What was reorganized:

- Split the accumulated agent context into a short canonical `AGENTS.md` navigation file plus focused `docs/*` context files.
- Kept `LLM.md` as a compatibility wrapper that points future agents to `AGENTS.md`.
- Kept `CLAUDE.md` as a short wrapper that tells Claude agents to read `AGENTS.md` first.
- Moved product context to `docs/PROJECT.md`.
- Moved system structure and data flow to `docs/ARCHITECTURE.md`.
- Moved frontend/design behavior and constraints to `docs/FRONTEND.md`.
- Moved Payload/admin models, seeds, and access-control context to `docs/BACKEND.md`.
- Converted accepted direction and PR history into decision records in `docs/DECISIONS.md`.
- Summarized current implementation state in `docs/STATUS.md`.
- Moved deferred work to `docs/ROADMAP.md`.
- Moved fragile constraints and recurring mistakes to `docs/GOTCHAS.md`.

Files changed:

- `AGENTS.md`
- `CLAUDE.md`
- `LLM.md`
- `docs/PROJECT.md`
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/BACKEND.md`
- `docs/DECISIONS.md`
- `docs/STATUS.md`
- `docs/ROADMAP.md`
- `docs/GOTCHAS.md`
- `docs/SESSION.md`

Recommended next step:

- Review the split for any project-specific nuance that should be expanded, then use `AGENTS.md` as the first-read navigation file for future agents.

## 2026-06-18

What changed:

- Polished the Tech Stack section background glow so it fades smoothly without visible top/bottom clipping.
- Added a scroll-linked green Header accent fill. It starts empty at the top of the page, reaches full progress at the `#contact` anchor position, and remains full through the footer.
- Updated frontend documentation and decision records for those accepted visual behaviors.

Verification:

- `docker compose run --rm app pnpm build` passed after the frontend changes.
- Local visual checks confirmed Header progress at top, Contact, footer, and mobile menu states.

## 2026-06-19

What changed:

- Updated the Contact form validation UI. General submit errors now appear inside the red submit button, with a red form border, instead of a separate message above the button.
- Field-specific errors remain visible after submit errors, but each field's error hides when that field receives focus during the current error cycle.
- The Contact form returns to its normal green active/focus styling when the user focuses any field after a submit error.
- Increased the peak brightness of the Contact form active border pulse slightly while keeping the inner panel dark.
- Updated Header hash navigation so shared Header links point to home page sections from non-home pages and repeated clicks on the current home hash still scroll to the section.

Verification:

- `docker compose run --rm app pnpm build` passed.
- Local browser checks covered empty submit, red button/form error state, focus reset of general error styling, field-specific error hiding on focus, and repeat submit.
- Local browser checks covered repeated `/#contact` clicks after manual scrolling away and `/blog` to `/#contact` navigation.
