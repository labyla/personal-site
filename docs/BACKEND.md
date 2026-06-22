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

### Media

Local media is CMS-backed through one `Media` collection.

`Media` represents a Windows Explorer-like tree where entries can be folders or files:

- `name`
- `kind`
- `parent`
- `slug`
- `path`
- file metadata fields such as `filename`, `storageFilename`, `url`, `mimeType`, and `filesize`

`kind=folder` entries create folders. `kind=file` entries are uploaded media assets. Uploading and folder creation happen in the `Media` collection only. The Media collection list view is a custom file-manager surface with `Upload File` and `Create Folder` actions for the currently open folder. It shows only the immediate children of the open folder, and double-clicking a folder navigates into it. `path` is generated from the parent folder hierarchy and the folder slug or uploaded filename. Editable URL fields can store regular external URLs or local references in the form `local:/folder/file.ext`. Public rendering resolves those strings through `lib/media.ts` to `/local-media/...`, and the Next route looks up the media record by `path`.

Payload Admin URL fields that point at images use a custom local media field. Typing `local:` opens a compact file-manager picker where editors can navigate folders and select an already-saved media item. Project and Post Markdown editors use the same picker when `local:` is typed in the textarea.

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

- `content`
- `excerpt`
- `publishedAt`
- `metaTitle`
- `metaDescription`
- `canonicalUrl`
- `externalUrl`

Project detail content uses GitHub-flavored Markdown stored as a Payload `textarea` string. The admin field uses a custom Markdown editor with Edit/Preview modes, a slash helper for common GitHub Markdown snippets, and local media insertion through `local:`. Blocks/page-builder are not used yet. `imageUrl` remains a string so external URLs and local media references share the same field contract.

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

### Experience Items

Experience timeline entries are CMS-backed public content.

Fields:

- `company`
- `slug`
- `role`
- `period`
- `description`
- `sortOrder`
- `status`

Section heading copy remains in `SiteSettings.experience`. Public fetching uses only `status=published` experience items. Ordering is `sortOrder`, then `createdAt`, then `role`.

### Tech Stack Items

Tech Stack Items are CMS-backed public content for skills and tools.

Fields:

- `name`
- `slug`
- `group`
- `icon`
- `color`
- `sortOrder`
- `status`

`group` controls whether the item appears under Skills or Tools. `icon` is an SVG URL field that accepts either an external URL or a local media reference, and `color` is the public hover/accent color with an admin color picker. Section heading copy remains in `SiteSettings.techStack`. Public fetching uses only `status=published` tech stack items. Ordering is `sortOrder`, then `createdAt`, then `name` within each group.

### Posts

Posts power the Blog section and blog detail pages.

Fields:

- `title`
- `slug`
- `excerpt`
- `content`
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

Posts use the same content architecture as Projects: card/list data is separate from detail content, `content` stores GitHub-flavored Markdown, and public rendering uses `components/rich-text.tsx`.

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

- `header`
- `hero`
- `bento`
- `experience`
- `homeProjects`
- `homeBlog`
- `about`
- `testimonialsSection`
- `techStack`
- `cta`
- `contact`
- `footer`
- `projectsPage`
- `blogPage`

These groups are singleton settings, not list content. Projects, Posts, Testimonials, Experience Items, and Tech Stack Items are separate collections for repeated content.

Payload Admin organizes this Global into Edit/Preview tabs for the homepage, `/projects`, and `/blog`. Field descriptions are part of the editor contract so non-obvious copy controls explain where they appear.

Most SiteSettings fields are nullable/optional at the database schema level to avoid unsafe not-null schema pushes against an existing Global row. The public UI receives complete values through seed/fallback normalization.

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

Seed data lives in `lib/data/*-seed.ts`. Shared bootstrap logic lives in `lib/payload/bootstrap-content.ts`. Seed scripts live in `scripts/*` and are registered as Payload bin scripts in `payload.config.ts`.

Payload runs the shared bootstrap on `onInit` unless `PAYLOAD_BOOTSTRAP_CONTENT=false` is set. This keeps a fresh database populated from the backend immediately, without relying on frontend fallback data. The bootstrap is idempotent: collection records are created only when their `slug` is missing, and SiteSettings uses the same fill-missing policy as the manual seed command.

Fresh databases must apply migrations before content can be inserted. `pnpm cms:bootstrap` runs `payload migrate` first and then the seed commands. `pnpm dev` runs `cms:bootstrap` before `next dev`, so Docker Compose local startup creates the schema and fills initial content automatically.

Current seed commands:

- `docker compose run --rm app pnpm cms:bootstrap`
- `docker compose run --rm app pnpm seed:projects`
- `docker compose run --rm app pnpm seed:testimonials`
- `docker compose run --rm app pnpm seed:posts`
- `docker compose run --rm app pnpm seed:experience-items`
- `docker compose run --rm app pnpm seed:tech-stack-items`
- `docker compose run --rm app pnpm seed:site-settings`

Seed conventions:

- Projects, Testimonials, Posts, Experience Items, and Tech Stack Items use `slug` as the unique identifier.
- Collection seed scripts create only missing records and skip existing records on repeated runs.
- `seed:site-settings` updates the singleton Global but uses a fill-missing policy for editable groups, filling missing scalar values and empty/missing arrays without overwriting Payload Admin edits.
- Payload is the source of truth for projects, testimonials, posts, experience items, tech stack items, and site settings.
- Public collection loaders do not substitute seed cards when Payload returns an empty collection. Empty backend content should render as empty public content; fresh databases should be populated by bootstrap.

The package is marked with `"type": "module"` so Payload CLI can load TypeScript/ESM config and registered bin scripts consistently.

After adding or changing Payload collections/globals, run:

`docker compose run --rm app pnpm payload generate:types`

This keeps `payload-types.ts` in sync with the collection map used by Payload Local API typing.
