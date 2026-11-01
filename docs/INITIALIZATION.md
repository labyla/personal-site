# Project initialization

Use this procedure after copying the starter into a new project. Initialization produces a project that a fresh agent can operate; it does not require implementing the first product feature.

## 1. Understand the request

Read the user's description and inspect the repository. Fill `PROJECT_BRIEF.md` with known facts. Ask the user about material unknowns before deciding them. Examples include target users, essential workflows, data sensitivity, integrations, supported platforms, deployment, and constraints.

## 2. Agree on the technical direction

Propose a stack and high-level architecture that fit the confirmed requirements. Explain relevant tradeoffs and ask the user to resolve unclear or consequential choices. Record confirmed choices and rationale in `DECISIONS.md`; summarize the structure and boundaries in `ARCHITECTURE.md`.

## 3. Establish a runnable baseline

Only after the stack is agreed, scaffold or adapt the project. Document exact dependency installation, start, focused-check, and full-verification commands in the root `AGENTS.md` and project README. Pin tool/runtime versions where the chosen ecosystem supports it. Configure the project's standard test and quality checks, then run at least one representative check to prove the setup works.

## 4. Define initial work

Translate the agreed requirements into small, user-observable entries in `FEATURES.json`. Each entry should be independently verifiable where practical. Capture dependencies and ordering in `PLANS.md` when the work spans multiple features. Ask about ambiguous acceptance criteria rather than filling them with guesses.

## 5. Record the baseline

Update `PROGRESS.md` and `HANDOFF.md` with the actual repository state, checks run, results, blockers, and next action. Ensure template markers in project-specific documents have been resolved or that the user has explicitly agreed to leave a field open. Commit or otherwise checkpoint the initialized baseline if the user workflow uses version control.

## Ready to implement

Initialization is complete when a fresh agent can identify the project's purpose, find the relevant architecture and decisions, install and run the project, execute its verification commands, and select the next agreed feature without relying on undocumented chat history.
