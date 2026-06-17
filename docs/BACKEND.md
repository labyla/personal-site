# Backend And Admin Context

## Direction

Payload CMS is the backend/admin layer. PostgreSQL is the main database. Next.js remains the public frontend and routing layer.

Payload was chosen because the project needs a multifunctional admin dashboard for content editing. It provides a ready admin panel, content models, auth, media management path, CRUD, and access control for a content-oriented personal site.

Backend/admin work should remain incremental. Prefer one small vertical slice at a time, verify locally, document accepted decisions, then continue.

## Users And Permissions

Do not design admin as a separate admin-only entity. Use normal `users` with permissions; an admin is a user with expanded permissions. Each account/dashboard capability should require its own permission.

Current permissions include:

- `content.read`
- `content.update`
- `feedback.read`
- `feedback.update`

When creating the first local Payload user for early backend work, explicitly assign `content.read` and `content.update`. Permissions are not granted by default to every new user.

Permission management UI is not implemented.

## Collections

### Users

Users are Payload-authenticated accounts with explicit permissions. Future custom account/dashboard capabilities should build on normal users plus permissions.

### Projects

Projects/case studies are CMS-backed public content.

Card/list fields include:

- `title`
- `slug`
- `description`
- `imageUrl`
- `tags`
- `href`
- `featured`
- `sortOrder`
- `status`

Detail-page fields include:

- `contentMarkdown`
- `excerpt`
- `publishedAt`
- `metaTitle`
- `metaDescription`
- `canonicalUrl`
- `externalUrl`

Project detail body content uses `contentMarkdown`. The field stores raw Markdown with GitBook-like extensions and uses a custom Payload Admin field with Preview and Raw modes. Lexical rich text and blocks/page-builder are not used. Media upload remains deferred; `imageUrl` is still a string.

Supported Markdown body features:

- Standard Markdown headings, paragraphs, links, blockquotes, lists, code, and horizontal rules.
- GitHub Flavored Markdown tables and task lists.
- YAML frontmatter is accepted and ignored by the public renderer.
- Limited safe HTML for README-style content, including `details`, `summary`, and `kbd`.
- GitBook-like blocks: `{% hint style="info|warning|success|danger" %}`, `{% tabs %}` / `{% tab title="..." %}`, and `{% stepper %}` / `{% step %}`.

Public fetching uses only `status=published` projects. Ordering is `sortOrder`, then `createdAt`, then `title`.

The canonical public detail route is `/projects/[slug]`. `href` remains for compatibility with older cards but is no longer the primary card destination.

### Testimonials

Testimonials are CMS-backed public content.

Public UI fields:

- `name`
- `role`
- `quote`
- `avatarUrl`
- `rating`

Management fields:

- `slug`
- `featured`
- `sortOrder`
- `status`

`company` is not included because the current UI does not display it.

Public fetching uses only `status=published` testimonials. Ordering is `sortOrder`, then `createdAt`, then `name`.

### Posts

Posts power the Blog section and blog detail pages.

Fields:

- `title`
- `slug`
- `excerpt`
- `contentMarkdown`
- `coverImageUrl`
- `readingTime`
- `publishedAt`
- `featured`
- `sortOrder`
- `status`
- `metaTitle`
- `metaDescription`
- `canonicalUrl`

Tags/categories are not included yet because the current Blog section UI does not display them.

Posts use the same content architecture as Projects: card/list data is separate from detail body content, `contentMarkdown` is the only body source, and public rendering uses `components/markdown-content.tsx`.

Public fetching uses only `status=published` posts. Ordering is `sortOrder`, then `publishedAt`, then `createdAt`, then `title`.

The canonical public detail route is `/blog/[slug]`.

### ContactSubmissions

Contact submissions are stored in the `ContactSubmissions` collection (`contact-submissions`) and viewed through the standard Payload Admin Panel.

Fields:

- `name`
- `email`
- `subject`
- `message`
- `status`
- `source`
- `userAgent`

Access-control conventions:

- Public users cannot directly create/read/update/delete submissions through Payload access rules.
- Collection-level `create` is disabled with `create: () => false`.
- Public creation is allowed only through `submitContactForm` in `lib/actions/contact.ts`, using Payload Local API with `overrideAccess: true`.
- `status` is set to `new` and `source` to `website` by the server action.
- Clients must not submit arbitrary `status` or `source`.
- Deleting submissions is disabled and should only be opened later by explicit decision.
- Users with `feedback.read` or `feedback.update` can read contact submissions in Payload Admin.
- Users with `feedback.update` can update submission status.

Validation uses `zod`: strings are trimmed, required fields are `name`, `email`, and `message`, `subject` is optional, email is validated, lengths are capped, and the `website` honeypot is rejected server-side if filled. The action returns only safe success/error messages and does not expose internal Payload errors.

## Globals

### SiteSettings

`SiteSettings` is the singleton Payload Global for site-wide and singleton homepage content. Read access is public; updates require `content.update`.

Groups currently include:

- `hero`
- `about`
- `cta`
- `footer`
- `header`

Hero, About, CTA, Footer, and Header are singleton settings, not list content.

About fields are nullable/optional at the database schema level to avoid unsafe not-null schema pushes against an existing Global row. The public UI receives complete values through seed/fallback normalization.

CTA fields:

- `isEnabled`
- `avatarLetter`
- `titlePrefix`
- `titleAccent`
- `titleMiddle`
- `titleSuffix`
- `name`
- `availability`
- `description`
- `primaryCtaLabel`
- `primaryCtaHref`

No secondary CTA or email field is included because the current CTA UI does not display them.

Footer and Header fields are documented in `docs/FRONTEND.md` because their constraints are mostly UI-facing.

## Seeds And Source Of Truth

Seed data lives in `lib/data/*-seed.ts`. Seed scripts live in `scripts/*` and are registered as Payload bin scripts in `payload.config.ts`.

Current seed commands:

- `docker compose run --rm app pnpm seed:projects`
- `docker compose run --rm app pnpm seed:testimonials`
- `docker compose run --rm app pnpm seed:posts`
- `docker compose run --rm app pnpm seed:site-settings`

Seed conventions:

- Projects, Testimonials, and Posts use `slug` as the unique identifier.
- Collection seed scripts create only missing records and skip existing records on repeated runs.
- `seed:site-settings` updates the singleton Global but uses a fill-missing policy for editable groups, filling missing scalar values and empty/missing arrays without overwriting Payload Admin edits.
- Payload is the source of truth for projects, testimonials, posts, and site settings.
- Temporary frontend fallbacks exist only to keep pages populated during CMS rollout.

The package is marked with `"type": "module"` so Payload CLI can load TypeScript/ESM config and registered bin scripts consistently.

After adding or changing Payload collections/globals, run:

`docker compose run --rm app pnpm payload generate:types`

This keeps `payload-types.ts` in sync with the collection map used by Payload Local API typing.
