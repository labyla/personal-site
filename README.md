# Agent-ready project starter

A reusable, language-neutral harness for building and maintaining software with coding agents. Copy this repository when starting a project, describe the desired project to your agent, and have it initialize the documents and project stack with you.

## First use

1. Read `AGENTS.md` and `docs/PROJECT_BRIEF.md`.
2. Describe the project, its users, intended behavior, and constraints. The agent should inspect the copied repository and ask about every material project decision it cannot determine from your description or the existing files. It must not silently choose a language, framework, architecture, deployment target, or product behavior.
3. Have the agent complete the project brief and propose the stack and architecture. Review unresolved decisions together before it scaffolds application code.
4. Have the agent adapt the setup and verification commands to the selected stack, make the project runnable, and prove the baseline checks work.
5. Break the agreed work into small features in `docs/FEATURES.json`. Each feature needs observable acceptance criteria and a way to verify them.

The `{{...}}` markers in the starter documents are intentional. Replace them with confirmed project-specific information during initialization. If a decision is unclear, ask the user and leave it unresolved until answered.

## Harness checks

The checks use only Python 3's standard library; Python is a requirement for these starter-maintenance checks, not a requirement for the application being built.

```sh
python3 scripts/harness_check.py validate-template
python3 scripts/harness_check.py check-handoff
```

`validate-template` reports remaining `{{...}}` markers in project documents. It will report failures on a fresh copy until project initialization fills them. `check-handoff` checks that the latest session recorded its outcome, verification, blockers, and next action before handing work over.

## Contents

- `AGENTS.md`: shared agent workflow and links into project documentation.
- `docs/`: project brief, architecture, decisions, feature tracker, progress, handoff, and session-exit checklist.
- `scripts/harness_check.py`: lightweight template and handoff checks.

Keep the root instructions concise. Add focused documents when a domain needs more detail, and update them alongside the code they describe.
