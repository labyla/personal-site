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
