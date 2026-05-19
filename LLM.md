# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 personal site using the App Router. Route entry points live in `app/`, with `app/page.tsx` composing the home page and `app/layout.tsx` defining the root shell. Feature sections live in `components/`; reusable shadcn-style primitives are under `components/ui/`. Shared hooks are in `hooks/`, utility helpers in `lib/`, global styles in `app/globals.css` and `styles/globals.css`, and static assets in `public/`.

Use the configured `@/*` TypeScript path alias for local imports, for example `@/components/header` or `@/lib/utils`.

## Build, Test, and Development Commands

- `docker compose up --build`: build the development image and start the Next.js dev server on port `3000`.
- `docker compose run --rm app pnpm install`: refresh container dependencies after changing `package.json` or `pnpm-lock.yaml`.
- `docker compose run --rm app pnpm lint`: run ESLint in the shared project container.
- `docker compose run --rm app pnpm build`: create a production build in the shared project container.
- `docker build --target runner -t personal-site .`: build the production image.
- `docker run --rm -p 3000:3000 personal-site`: run the production image locally.

Use Docker as the default execution path so every agent and machine runs the same Node/pnpm environment. Direct `pnpm` commands are acceptable only as a quick local fallback when Docker is unavailable or when debugging host-specific tooling.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Component files use kebab-case names such as `tech-marquee.tsx`; exported components use PascalCase such as `TechMarquee`.

Follow the existing style: two-space indentation, concise JSX, Tailwind utility classes for styling, and minimal comments. Use `cn()` from `@/lib/utils` when conditionally composing class names. Use lucide icons where icons are needed, matching the existing component library setup.

## Testing Guidelines

No test framework or `test` script is currently configured. For now, verify changes with `docker compose run --rm app pnpm lint` and `docker compose run --rm app pnpm build`. For visual changes, also run `docker compose up --build` and check the affected page at desktop and mobile widths.

If tests are added later, colocate them near the code they cover or in a clearly named test directory, and add a matching `pnpm test` script before relying on them in review.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so use short, imperative commit messages such as `Add project card animation` or `Fix mobile header spacing`. Keep commits focused on one logical change.

Pull requests should include a concise description, screenshots for UI changes, and the verification commands run. Link related issues when available. Call out any follow-up work, especially missing tests or responsive edge cases.

## Agent-Specific Instructions

Make surgical changes. Do not refactor unrelated components, reformat files wholesale, or add speculative abstractions. Match the existing Next.js, Tailwind, shadcn-style, and Docker-based workflow patterns already present in the repository.

## Backend Context Maintenance

Backend/admin implementation is starting with a small MVP vertical slice. Keep this file updated as the project context source for future LLM sessions. Update `LLM.md` whenever an architectural decision is accepted, a backend feature is added, an API contract changes, a database model is introduced, a new environment variable is required, or an important backend convention is established.

## Planned Backend Direction

The accepted backend stack is:

- Next.js 16 App Router
- TypeScript
- Payload CMS
- PostgreSQL
- Payload Postgres adapter
- Docker / Docker Compose

Payload CMS is the chosen backend/admin layer because the project is expected to need a multifunctional admin dashboard for editing most site content. Payload provides a ready admin panel, content models, auth, media management, CRUD, access control, and is a good fit for a content-oriented personal site.

The architectural direction is:

- Next.js remains the main frontend application for public pages, routing, and custom UI.
- Payload CMS will be used as the backend/admin layer.
- PostgreSQL will be the main database.
- Docker / Docker Compose remain the default workflow for local development and future deployment.

Backend and admin dashboard implementation must remain incremental. Do not implement broad backend/dashboard functionality without separate explicit approval.

Future backend planning must account for a permission-based user account area. Do not design the admin dashboard as a separate admin-only entity. Use normal `users` with permissions; an admin is a user with expanded permissions. Each account/dashboard capability should require its own permission.

The planned dashboard is expected to manage editable site content such as projects/case studies, blog posts/notes, skills, experience, education, services, testimonials, site settings, media, and contact form submissions. Backend decisions should therefore consider admin authentication, protected admin routes, a minimal-but-extensible roles/permissions model, CRUD APIs or server actions for content management, database models for editable content, validation and authorization checks for every admin mutation, a scalable module structure for future dashboard sections, and safe handling of uploaded media.

For the first backend/admin MVP, the accepted entity is `projects / case studies`. The first stage must implement only one vertical slice: Payload CMS collection -> fetching data on the frontend -> rendering projects on the home page -> editing projects through the standard Payload Admin Panel.

The first stage dashboard is the standard Payload Admin Panel. A custom user account area/dashboard will be designed later.

The first stage should lay the access-control foundation with normal users plus permissions. Only these content permissions are required for the MVP:

- `content.read`
- `content.update`

Do not implement the following in the first stage: blog, media upload, contact form, feedback dashboard, activity logs, custom user account area, full role/permission management UI, or migration of all hardcoded content.

For projects, keep image handling simple in the first stage: store `imageUrl` as a string. A Media collection and upload workflow belong to a separate future stage.

The first backend/admin MVP is split into two small PRs:

- PR 1: Payload foundation only. Integrate Payload CMS, PostgreSQL, standard Payload Admin, `Users` collection, `Projects` collection, and permission helpers. Do not change the public frontend in PR 1.
- PR 2: Connect only the home page Projects section to Payload data. Do not start PR 2 until PR 1 is complete and separately approved.

PR 1 may only change `package.json`, `pnpm-lock.yaml`, `docker-compose.yml`, `payload.config.ts`, `collections/Users.ts`, `collections/Projects.ts`, `lib/payload/access.ts`, `app/(payload)/...`, `next.config.mjs`, `tsconfig.json`, and `LLM.md`.

PR 1 must not change `app/page.tsx`, `components/projects.tsx`, other frontend sections, blog, media upload, contact form, feedback dashboard, activity logs, custom dashboard, or full permission management UI.

After PR 1, it should be possible to start the project with Docker Compose, open the Payload Admin Panel, create the first user, and create or edit a project in the `Projects` collection.

When creating the first local Payload user for PR 1, explicitly assign `content.read` and `content.update` permissions. Permissions are not granted by default to every new user.

PR 1 local development uses these Docker Compose environment variables for the app service:

- `DATABASE_URL=postgres://personal_site:personal_site@db:5432/personal_site`
- `PAYLOAD_SECRET=local-payload-secret-change-me`

The local PostgreSQL service is named `db` and uses the `postgres:16-alpine` image with a persistent `postgres_data` volume.

PR 2 connects only the home page `Projects` section to Payload. Public project data is loaded server-side in `lib/data/projects.ts` with the Payload Local API, then `app/page.tsx` passes the mapped data into the existing client `Projects` component as props. The public frontend does not fetch the app's own REST API for this slice.

PR 2 uses only published projects: `status` must equal `published`. Project ordering is `sortOrder`, then `createdAt`, then `title`.

The home page exports `revalidate = 60` so Payload project edits can refresh on the public page without requiring a full rebuild for every content change.

The public Projects UI currently uses these Payload fields: `title`, `description`, `imageUrl`, `tags.label`, `href`, `sortOrder`, `status`, and `createdAt`. `imageUrl` remains a string. Presentation gradients are assigned by the frontend from a small fixed palette and are not stored in Payload.

Until real project records are added in Payload, `lib/data/projects.ts` falls back to the previous static project list if there are no published projects or Payload is unavailable. This fallback is temporary and exists only to keep the public homepage populated during the first CMS rollout.

PR 3 adds local project seeding. Seed data lives in `lib/data/project-seed.ts`; both the seed script and the temporary frontend fallback use this file to avoid divergent project data. Run the seed through Docker with `docker compose run --rm app pnpm seed:projects`.

The project seed script lives at `scripts/seed-projects.ts`, is registered as a Payload bin script in `payload.config.ts` with key `seed:projects`, and uses the Payload Local API. It treats `slug` as the unique identifier, creates only missing projects, skips existing projects on repeated runs, sets `status` to `published`, and preserves `sortOrder`.

Payload is the source of truth for projects. The fallback project list is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

The package is marked with `"type": "module"` so Payload CLI can load TypeScript/ESM config and registered bin scripts consistently.

After adding or changing Payload collections, run `docker compose run --rm app pnpm payload generate:types` so `payload-types.ts` stays in sync with the collection map used by Payload Local API typing.

PR 4 connects only the home page `Testimonials` section to Payload, following the Projects pattern. Public testimonial data is loaded server-side in `lib/data/testimonials.ts` with the Payload Local API, then `app/page.tsx` passes the mapped data into the existing client `Testimonials` component as props.

Testimonials are stored in the `Testimonials` collection with these public UI fields: `name`, `role`, `quote`, `avatarUrl`, `rating`, plus `slug`, `featured`, `sortOrder`, and `status` for management. `company` is not included because the current UI does not display it. Public fetching uses only `status=published` testimonials and sorts by `sortOrder`, then `createdAt`, then `name`.

Testimonial seed data lives in `lib/data/testimonial-seed.ts`; both the seed script and temporary frontend fallback use this file. Run the seed through Docker with `docker compose run --rm app pnpm seed:testimonials`. The seed script lives at `scripts/seed-testimonials.ts`, is registered as Payload bin script `seed:testimonials`, uses `slug` as the unique identifier, creates only missing testimonials, and skips existing records on repeated runs.

Payload is the source of truth for testimonials. The fallback testimonial list is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 5 connects only the home page `Hero` section to Payload. Hero settings live in the `SiteSettings` Payload Global under the `hero` group because they are singleton site settings, not list content.

`SiteSettings` read access is public; updates require `content.update`. No new permissions are introduced for PR 5.

Public hero data is loaded server-side in `lib/data/site-settings.ts` with the Payload Local API, then `app/page.tsx` passes the mapped data into the existing client `Hero` component as props. Hero seed/fallback data lives in `lib/data/site-settings-seed.ts`. Run the seed through Docker with `docker compose run --rm app pnpm seed:site-settings`.

The site settings seed script lives at `scripts/seed-site-settings.ts`, is registered as Payload bin script `seed:site-settings`, and updates the `SiteSettings` Global on repeated runs instead of creating duplicate content.

Payload is the source of truth for hero/site settings. The fallback hero data is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 6 connects only the home page `About` section/profile basics to Payload. About settings live in the existing `SiteSettings` Payload Global under the `about` group because they are singleton profile/site settings, not list content.

The About UI uses these `SiteSettings.about` fields: `eyebrow`, `titlePrefix`, `titleMuted`, `paragraphs`, `imageUrl`, `imageAlt`, and `socialLinks` with `platform`, `label`, and `href`. No location or stats fields are included because the current UI does not display them.

New `SiteSettings.about` fields are nullable/optional at the database schema level to avoid unsafe not-null schema pushes against an existing Global row. The public UI still receives complete values through seed/fallback normalization.

`seed:site-settings` uses a fill-missing seed policy. It reads the existing `SiteSettings` Global and only fills missing scalar fields or empty/missing arrays from seed data. It should not overwrite already populated Hero/About values that were edited in Payload Admin.

Payload is the source of truth for About/profile settings. The fallback About data in `lib/data/site-settings-seed.ts` is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 7 connects only the home page `CTA` section to Payload. CTA settings live in the existing `SiteSettings` Payload Global under the `cta` group because they are singleton site content, not list content.

The CTA UI uses these `SiteSettings.cta` fields: `isEnabled`, `avatarLetter`, `titlePrefix`, `titleAccent`, `titleMiddle`, `titleSuffix`, `name`, `availability`, `description`, `primaryCtaLabel`, and `primaryCtaHref`. No secondary CTA or email field is included because the current CTA UI does not display them.

`seed:site-settings` keeps the fill-missing policy for CTA. It fills missing scalar values from `ctaSeed` and should not overwrite values edited in Payload Admin.

Payload is the source of truth for CTA settings. The fallback CTA data in `lib/data/site-settings-seed.ts` is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 8 connects only the home page `Footer` to Payload. Footer settings live in the existing `SiteSettings` Payload Global under the `footer` group because they are singleton site settings, not list content.

The Footer UI uses these `SiteSettings.footer` fields: `brandInitial`, `brandName`, `description`, `copyrightName`, `mainLinks`, `workLinks`, and `socialLinks` with `platform`, `label`, and `href`. Email is represented as a `socialLinks` item with platform `email`; there is no separate email field. `isEnabled` is not included for Footer because the current UI does not support hiding it.

`seed:site-settings` keeps the fill-missing policy for Footer. It fills missing scalar values and empty/missing link arrays from `footerSeed` and should not overwrite values edited in Payload Admin.

Payload is the source of truth for Footer settings. The fallback Footer data in `lib/data/site-settings-seed.ts` is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 9 connects only the home page `Header`/navigation to Payload. Header settings live in the existing `SiteSettings` Payload Global under the `header` group because they are singleton site-wide navigation settings, not list content.

The Header UI uses these `SiteSettings.header` fields: `logoText`, `navLinks` with `label` and `href`, `ctaLabel`, and `ctaHref`. `brandName` is not included because the current Header displays only the compact logo text. `isExternal`, `openInNewTab`, and `isEnabled` are not included because the current Header UI does not support external/new-tab link behavior or hiding the Header.

Public Header data is loaded server-side in `lib/data/site-settings.ts` with the Payload Local API, then `app/page.tsx` passes it into the existing client `Header` component as props. Header visual design and desktop/mobile menu behavior should remain unchanged.

`seed:site-settings` keeps the fill-missing policy for Header. It fills missing scalar values and empty/missing navigation arrays from `headerSeed` and should not overwrite values edited in Payload Admin.

Payload is the source of truth for Header/navigation settings. The fallback Header data in `lib/data/site-settings-seed.ts` is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

PR 10 extends the `Projects` content model for future project detail pages without adding public routes or rich text rendering yet. Projects now distinguish between card data and detail content: existing card fields such as `title`, `slug`, `description`, `imageUrl`, `tags`, `href`, `featured`, `sortOrder`, and `status` remain for the current Projects section, while detail-page fields are prepared separately.

Project detail content uses Payload Lexical Rich Text via `@payloadcms/richtext-lexical` and the root `lexicalEditor({})` Payload config. The `Projects.content` field is a Lexical rich text field. The future Blog implementation should reuse the same rich content and frontend rendering approach introduced for Projects in the next detail-page PR.

The additional optional Project detail fields are `content`, `excerpt`, `publishedAt`, `metaTitle`, `metaDescription`, `canonicalUrl`, and `externalUrl`. `href` is intentionally kept for compatibility with the existing project cards until PR 11 decides how cards link to `/projects/[slug]`. `externalUrl` is reserved for future project detail pages.

Blocks/page-builder are not used for Projects yet. Media upload remains deferred; `imageUrl` is still stored as a string.

Project seed data in `lib/data/project-seed.ts` now includes basic Lexical `content`, `excerpt`, `publishedAt`, SEO fields, and optional external URL data for newly created records. The `seed:projects` policy remains create-only/skip-existing: it finds by `slug`, creates missing projects, skips existing projects, and does not overwrite edits made in Payload Admin.

PR 11 adds public Project detail pages. The canonical internal route for project materials is `/projects/[slug]`. Project cards on the home page should link to the internal detail page when a `slug` is available; the legacy `href` field remains for compatibility but is no longer the primary project-card destination.

Project detail pages fetch a single published project server-side with the Payload Local API through `getProjectBySlug(slug)` in `lib/data/projects.ts`. Only projects with `status=published` are publicly readable through this route. If a published project is not found or Payload data is unavailable, the route uses `notFound()` instead of a seed fallback.

Project detail page metadata uses `metaTitle`/`metaDescription` when present, then falls back to `title`, `excerpt`, and `description`. `canonicalUrl` is used for metadata alternates when present.

Payload Lexical rich text is rendered with a reusable `components/rich-text.tsx` component built on the official `RichText` export from `@payloadcms/richtext-lexical/react`. This renderer should be reused by the future Blog implementation. Blog is still not implemented.

`externalUrl` is reserved for an external CTA inside a project detail page, such as `Visit project`; it should not replace the internal `/projects/[slug]` route.

PR 12 adds the Blog foundation with a `Posts` Payload collection and connects only the home page `Blog` section to Payload data. Blog detail pages are intentionally deferred to PR 13; do not add `/blog/[slug]` in PR 12.

Posts use the same content architecture as Projects: card/list data is separate from detail content, `content` uses Payload Lexical Rich Text, and future public rendering should reuse `components/rich-text.tsx`. Blocks/page-builder are still not used. Media upload remains deferred; `coverImageUrl` is stored as a string.

The `Posts` collection uses these fields for PR 12: `title`, `slug`, `excerpt`, `content`, `coverImageUrl`, `readingTime`, `publishedAt`, `featured`, `sortOrder`, `status`, `metaTitle`, `metaDescription`, and `canonicalUrl`. Tags/categories are not included yet because the current Blog section UI does not display them.

Blog list data is loaded server-side in `lib/data/posts.ts` with the Payload Local API, then `app/page.tsx` passes mapped posts into the client `Blog` component as props. Public fetching uses only `status=published` posts and sorts by `sortOrder`, then `publishedAt`, then `createdAt`, then `title`.

Post seed data lives in `lib/data/post-seed.ts`; both the seed script and temporary frontend fallback use this file. Run the seed through Docker with `docker compose run --rm app pnpm seed:posts`. The seed script lives at `scripts/seed-posts.ts`, is registered as Payload bin script `seed:posts`, uses `slug` as the unique identifier, creates only missing posts, and skips existing records on repeated runs.

Payload is the source of truth for Blog posts. The fallback post list is temporary and should be removed once local/dev data is consistently seeded and production content exists in Payload.

Blog list items already expose future internal hrefs as `/blog/[slug]`, but PR 12 does not render them as clickable links because the detail route does not exist yet. PR 13 should add `/blog/[slug]` and then make Blog cards navigate to the internal detail pages.

PR 13 adds public Blog post detail pages. The canonical internal route for blog articles is `/blog/[slug]`, and Blog cards on the home page now navigate to those internal detail pages.

Blog detail pages fetch a single published post server-side with the Payload Local API through `getPostBySlug(slug)` in `lib/data/posts.ts`. Only posts with `status=published` are publicly readable through this route. If a published post is not found or Payload data is unavailable, the route uses `notFound()` instead of a seed fallback.

Blog detail page metadata uses `metaTitle`/`metaDescription` when present, then falls back to `title` and `excerpt`. `canonicalUrl` is used for metadata alternates when present.

`components/rich-text.tsx` is now shared by both Project detail pages and Blog detail pages. Keep future rich content rendering changes reusable across both content types unless there is a clear content-specific reason to split them.

PR 14 adds the Contact Form backend foundation without adding or connecting a public UI form yet. Contact submissions are stored in the `ContactSubmissions` Payload collection (`contact-submissions`) and are viewed only through the standard Payload Admin Panel for this stage. No custom feedback dashboard is implemented.

Feedback permissions are added to the existing user permission model: `feedback.read` and `feedback.update`. Users with `feedback.read` or `feedback.update` can read contact submissions in Payload Admin. Users with `feedback.update` can update submission status. Permission management UI is still not implemented.

Public users cannot directly create, read, update, or delete `ContactSubmissions` through Payload access rules. Collection-level `create` is disabled with `create: () => false`; public creation is allowed only through the controlled server action in `lib/actions/contact.ts`, which uses the Payload Local API with `overrideAccess: true`.

`ContactSubmissions` fields are `name`, `email`, `subject`, `message`, `status`, `source`, and `userAgent`. `status` is set to `new` and `source` is set to `website` by the server action; clients must not be allowed to submit arbitrary `status` or `source` values. Deleting contact submissions is disabled in PR 14 (`delete: () => false`) and should only be opened later by explicit decision if needed.

Contact form validation uses existing `zod`: strings are trimmed, required fields are `name`, `email`, and `message`, `subject` is optional, email is validated, lengths are capped, and a `website` honeypot field is rejected server-side if filled. The action returns only safe success/error messages and does not expose internal Payload errors to the client.

Email notifications, captcha/external anti-spam services, activity logs, custom feedback dashboard, and UI form integration are intentionally not included in PR 14.

PR 15 adds the public Contact Form UI and connects it to the existing `submitContactForm` server action. The form lives in `components/contact-form.tsx` and is rendered on the home page after the CTA and before the Footer. The `#contact` anchor now belongs to the form section so existing Header/CTA/Footer links lead users to the submission UI.

The contact form fields are `name`, `email`, optional `subject`, `message`, and hidden honeypot `website`. It uses `useActionState` for the server action, shows submitting state, success/error messages, server-returned field errors, and resets the form after a successful submission.

Contact submissions are still viewed through the standard Payload Admin Panel only. Email notifications, captcha/external anti-spam services, activity logs, custom feedback dashboard, and permission management UI remain intentionally unimplemented.

PR 16 adds public index pages for content archives without changing Payload models. `/projects` lists all published projects using `getProjects()`, and project cards link to `/projects/[slug]`. `/blog` lists all published posts using `getPosts()`, and post cards link to `/blog/[slug]`.

The home page Projects section "See more projects" button now links to `/projects`. The home page Blog section has a "Read more articles" button linking to `/blog`.

Contact form inputs are controlled in `components/contact-form.tsx` so server-side validation errors do not clear user-entered values. The form resets only after a successful submission (`state.ok === true`). Honeypot and success behavior remain unchanged.

## Backend Implementation Workflow

When backend/admin work starts, do not implement everything in one step. Work in small, reviewable iterations. After analyzing the current project, propose the first minimal PR/change that can be safely tested locally before making broader changes.

For backend/admin implementation, prefer a vertical-slice approach: implement one small feature end-to-end, verify it locally, update `LLM.md` with any accepted decisions, and only then move to the next slice. Avoid large speculative rewrites, mass content migration, or implementing the full dashboard, permissions system, feedback flow, and logging system all at once.
