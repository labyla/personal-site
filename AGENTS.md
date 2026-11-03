# Agent instructions

This repository is a Next.js App Router personal site written in TypeScript. The active flow is a full-cycle liquid-glass loader, followed by illuminated fluted-panel assembly with the text retained, a liquid-text morph into an empty fixed glass menu, and cyan hover light. The earlier pink/purple Prisma background is preserved but disabled. Audio has been removed. Use Docker for dependency installation, development, and checks. Use the internal browser for visual verification; do not use Chrome DevTools MCP.

## Start here

1. Read `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/FEATURES.json`, and `docs/PROGRESS.md` as relevant to the task.
2. If this is a fresh copy, follow `docs/INITIALIZATION.md` before implementing product features.
3. Inspect the actual repository and current git state. Do not assume the documentation is current if code or configuration says otherwise; report conflicts and ask when they affect a project decision.
4. Run the documented baseline checks before changing code when the project has been initialized.

## Project decisions

- Treat double-brace template markers as unfilled template fields, not as project requirements.
- Use the user's project description and repository evidence to fill fields that are directly determined.
- Ask the user whenever a material project decision is unclear. This includes product behavior, stack, architecture, data handling, security expectations, deployment, and tradeoffs. Do not silently invent a decision to make progress.
- Record confirmed decisions in `docs/DECISIONS.md` and update the related project document.
- If an answer is needed before implementation can proceed, explain the specific decision and pause that dependent work. Continue independent discovery or documentation that does not depend on it.

## Work rules

- Work on one feature at a time unless the user explicitly asks for parallel work and the tasks are independent.
- Follow existing project conventions. Prefer small, direct changes within the task's scope.
- Do not claim a behavior works unless the relevant verification was run and passed. Record the command and result.
- For changes that cross components, run an integration or end-to-end check when the project provides one.
- Keep tests, documentation, and mechanical architecture checks aligned with the code.
- Do not overwrite user changes or discard uncommitted work.

## Project commands

Run from the repository root using Docker Desktop.

- Setup: `docker compose run --rm app npm ci`
- Run: `docker compose up --build`; open `http://localhost:3000`.
- Focused checks: `docker compose run --rm app npm test` and `docker compose run --rm app npm run typecheck`
- Full verification: `docker compose run --rm app npm run build`, then inspect the active intro animation and responsive composition in the internal browser at desktop and mobile sizes.
- Harness checks: `docker compose --profile checks run --rm harness python scripts/harness_check.py validate-template` and `docker compose --profile checks run --rm harness python scripts/harness_check.py check-handoff`.

## Session handoff

Before ending a work session, follow `docs/SESSION_EXIT.md` and update `docs/PROGRESS.md` and `docs/HANDOFF.md`. Report incomplete verification and blockers plainly. Do not mark a feature passing without recorded evidence.
