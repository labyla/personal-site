# Agent instructions

This repository is a language-neutral project starter. These instructions apply to any coding agent and to the project created from this starter.

## Start here

1. Read `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/FEATURES.json`, and `docs/PROGRESS.md` as relevant to the task.
2. If this is a fresh copy, follow `docs/INITIALIZATION.md` before implementing product features.
3. Inspect the actual repository and current git state. Do not assume the documentation is current if code or configuration says otherwise; report conflicts and ask when they affect a project decision.
4. Run the documented baseline checks before changing code when the project has been initialized.

## Project decisions

- Treat `{{...}}` markers as unfilled template fields, not as project requirements.
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

During initialization, replace this section with the selected project's actual setup, run, and verification commands. Until then, do not guess them.

- Setup: `{{SETUP_COMMAND}}`
- Run: `{{RUN_COMMAND}}`
- Focused checks: `{{FOCUSED_CHECK_COMMAND}}`
- Full verification: `{{FULL_VERIFICATION_COMMAND}}`

## Session handoff

Before ending a work session, follow `docs/SESSION_EXIT.md` and update `docs/PROGRESS.md` and `docs/HANDOFF.md`. Report incomplete verification and blockers plainly. Do not mark a feature passing without recorded evidence.
