# Architecture

## Stack

- Next.js 16 with the App Router.
- TypeScript.
- Payload CMS as backend/admin layer.
- PostgreSQL via the Payload Postgres adapter.
- Docker and Docker Compose as the default local workflow.
- Tailwind and shadcn-style primitives for public UI.

## Application Layout

- `app/`: App Router routes and layouts.
- `app/page.tsx`: home page composition.
- `app/layout.tsx`: root shell.
- `app/(payload)/...`: Payload Admin and API route integration.
- `app/projects` and `app/projects/[slug]`: public project archive/detail routes.
- `app/blog` and `app/blog/[slug]`: public blog archive/detail routes.
- `components/`: public page sections and reusable UI components.
- `components/ui/`: shadcn-style primitives.
- `components/rich-text.tsx`: shared GitHub-like Markdown renderer for projects and posts.
- `components/admin/github-markdown-field.tsx`: Payload Admin Markdown editor with Edit/Preview modes and a slash helper.
- `collections/`: Payload collections such as `Users`, `Projects`, `Testimonials`, `Posts`, and `ContactSubmissions`.
- `globals/`: Payload globals such as `SiteSettings`.
- `lib/data/`: server-side public data loaders and seed/fallback source data.
- `lib/actions/`: server actions, including contact submission handling.
- `lib/payload/access.ts`: access-control and permission helpers.
- `scripts/`: Payload bin seed scripts.
- `public/`: static assets.
- `app/globals.css` and `styles/globals.css`: global styles.

Use the configured `@/*` TypeScript path alias for local imports.

## Runtime/Data Flow

Next.js remains the main public frontend application. Payload CMS provides the backend/admin layer and stores editable content in PostgreSQL.

Public pages load CMS-backed data server-side with the Payload Local API through `lib/data/*` modules. `app/page.tsx` and archive/detail routes pass mapped data into existing React components as props. The public frontend should not fetch this app's own REST API for current CMS-backed slices unless a future decision changes that.

The current public CMS data flow is:

- Payload collection/global stores editable content.
- `lib/data/*` reads published/public data through Payload Local API.
- Loaders normalize data into the shape expected by existing components.
- Routes render server-side and pass data to client components where needed.
- Temporary fallbacks keep public pages populated while local/dev/production CMS content is being seeded.

## Caching

The home page exports `revalidate = 60` so Payload edits can refresh on the public page without a full rebuild for every content change.

## Docker

Docker Compose is the default workflow. The local PostgreSQL service is named `db`, uses `postgres:16-alpine`, and persists data in the `postgres_data` volume.

Expected local app environment variables:

- `DATABASE_URL=postgres://personal_site:personal_site@db:5432/personal_site`
- `PAYLOAD_SECRET=local-payload-secret-change-me`

## Verification

For most changes, verify with:

- `docker compose run --rm app pnpm lint`
- `docker compose run --rm app pnpm build`

For visual changes, also run `docker compose up --build` and inspect affected pages at desktop and mobile widths.

For Payload collection/global changes, run:

- `docker compose run --rm app pnpm payload generate:types`
