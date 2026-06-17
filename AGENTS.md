# Codex Agent Guide

This is the canonical first-read file for Codex and other coding agents working on this repository. Read this first, then open the relevant `docs/*` files before changing anything.

## Project Snapshot

This is a Next.js 16 personal site with the App Router. The public frontend is a dark, minimal, technical portfolio/content site. Payload CMS with PostgreSQL is the backend/admin layer and the source of truth for editable content.

Primary app code lives in `app/`, public sections in `components/`, Payload collections in `collections/`, globals in `globals/`, data loaders in `lib/data/`, server actions in `lib/actions/`, and seed scripts in `scripts/`.

## What To Read

- `docs/PROJECT.md` before product, UX, or scope decisions.
- `docs/ARCHITECTURE.md` before routing, data flow, Payload, or Docker work.
- `docs/FRONTEND.md` before UI, styling, animation, layout, or component behavior work.
- `docs/BACKEND.md` before Payload collections, globals, seeds, access control, or server actions.
- `docs/DECISIONS.md` before changing an established direction or reviving deferred ideas.
- `docs/STATUS.md` to understand what is implemented, temporary, or incomplete.
- `docs/ROADMAP.md` for approved later work.
- `docs/GOTCHAS.md` before touching fragile behavior or known constraints.
- `docs/SESSION.md` for the latest documentation/session state.

## Docker Commands

Use Docker by default so agents and machines share the same Node/pnpm environment.

- Install/update dependencies: `docker compose run --rm app pnpm install`
- Lint: `docker compose run --rm app pnpm lint`
- Build: `docker compose run --rm app pnpm build`
- Dev server: `docker compose up --build`
- Production image: `docker build --target runner -t personal-site .`
- Run production image: `docker run --rm -p 3000:3000 personal-site`

Direct `pnpm` commands are acceptable only as a quick local fallback when Docker is unavailable or for host-specific tooling diagnostics.

## Working Rules

- Make surgical changes. Touch only files required by the task.
- Do not refactor unrelated components, reformat files wholesale, or add speculative abstractions.
- Match the existing Next.js, TypeScript, Tailwind, shadcn-style, Payload, and Docker workflow patterns.
- Do not change app behavior while editing documentation-only context.
- For backend/admin work, prefer small vertical slices that can be verified locally.
- Payload is the source of truth for CMS-backed content; seed/fallback files are temporary scaffolding, not the long-term source.
- After changing Payload collections or globals, run `docker compose run --rm app pnpm payload generate:types`.
- After accepted architectural, backend, frontend, or workflow decisions, update the relevant `docs/*` file and keep this file short.
- Do not add ordinary PR history, changelog entries, or session logs to this file. Put ongoing status, decisions, session notes, and fragile constraints in `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/SESSION.md`, and `docs/GOTCHAS.md`.

## Frontend / Backend Pointers

Frontend direction is dark minimal, technical, slightly brutalist, grayscale with vivid green accents, lightweight motion, and strong reduced-motion support. See `docs/FRONTEND.md`.

Backend direction is Payload CMS as the admin/backend layer, PostgreSQL for persistence, normal users with permissions, and incremental content slices. See `docs/BACKEND.md` and `docs/ARCHITECTURE.md`.
