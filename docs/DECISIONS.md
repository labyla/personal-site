# Decisions

## Undated — Use Payload CMS As Backend/Admin Layer

Decision: Use Payload CMS with PostgreSQL as the backend/admin layer while keeping Next.js as the public frontend and routing application.

Why: The project needs editable content, auth, CRUD, access control, media-management path, and a ready admin panel for a content-oriented personal site.

Consequences: Public pages load CMS data server-side through Payload Local API. Backend work should fit Payload conventions instead of inventing a separate admin framework.

## Undated — Use Docker As Default Workflow

Decision: Run install, lint, build, dev, Payload type generation, and seed commands through Docker Compose by default.

Why: Agents and machines should share the same Node/pnpm/PostgreSQL environment.

Consequences: Direct `pnpm` is only a fallback for Docker-unavailable or host-specific diagnostics.

## Undated — Incremental Vertical-Slice Backend Rollout

Decision: Implement backend/admin features in small vertical slices.

Why: The project should avoid large speculative backend rewrites and make each slice locally testable.

Consequences: Each new CMS-backed section should add only the needed model, loader, seed/fallback updates, and frontend connection for that slice.

## PR 1 — Payload Foundation Boundary

Decision: PR 1 integrates Payload CMS, PostgreSQL, standard Payload Admin, `Users`, `Projects`, and permission helpers only.

Why: Establish the backend foundation without changing public frontend behavior.

Consequences: PR 1 may touch only backend/config/foundation files and should let a local user open Payload Admin and create/edit projects.

## PR 1 — Normal Users With Explicit Permissions

Decision: Use normal users plus permissions; admin is a user with expanded permissions.

Why: Future account/dashboard features need permission-based capabilities, not a separate admin-only identity model.

Consequences: Permissions must be explicit. Early content permissions are `content.read` and `content.update`; feedback permissions are added later.

## PR 1 — Store Project Image As `imageUrl` String

Decision: Store project images as `imageUrl` strings in the first backend stages.

Why: Media upload workflow is a separate feature and should not block the initial content slice.

Consequences: Media collection/upload remains deferred. Frontend uses string URLs for images.

## PR 2 — Connect Home Projects To Payload

Decision: Load home page Projects server-side from Payload through `lib/data/projects.ts` and pass data into the existing client component as props.

Why: This connects one public vertical slice without replacing the frontend architecture.

Consequences: Public project data uses published records only, ordered by `sortOrder`, then `createdAt`, then `title`. Home page revalidates every 60 seconds.

## PR 2 — Temporary Project Fallback

Decision: Keep the previous static project list as a temporary fallback if Payload has no published projects or is unavailable.

Why: The homepage should remain populated during early CMS rollout.

Consequences: Fallback must be removed once local/dev data is consistently seeded and production content exists in Payload.

## PR 3 — Local Project Seeding

Decision: Add `seed:projects`, with seed data shared between the seed script and temporary fallback.

Why: Avoid divergent project data between seeded CMS records and frontend fallback.

Consequences: The script creates missing records by `slug`, skips existing records, publishes seeded records, and preserves `sortOrder`.

## PR 4 — Connect Testimonials To Payload

Decision: Add a `Testimonials` collection and load home page testimonials server-side through Payload.

Why: Continue the same vertical-slice pattern used for Projects.

Consequences: Public testimonials use published records only and sort by `sortOrder`, `createdAt`, and `name`. Temporary testimonial fallback remains until real CMS data exists.

## Undated — Use Transform-Based Testimonials Marquee

Decision: Testimonials auto movement must be transform-based, not based on `scrollLeft`.

Why: A previous `scrollLeft` implementation could reach the physical scroll end and stop.

Consequences: Use duplicated tracks/cards, an offset ref, modulo wrapping based on one group width, `overflow-hidden`, and no manual scroll container in normal mode.

## PR 5 — SiteSettings Hero Global

Decision: Store Hero content in `SiteSettings.hero`.

Why: Hero is singleton site content, not list content.

Consequences: Public hero data is loaded through `lib/data/site-settings.ts`; seed/fallback data lives in `lib/data/site-settings-seed.ts`.

## PR 6 — SiteSettings About Group

Decision: Store About/profile basics in `SiteSettings.about`.

Why: About is singleton profile/site content.

Consequences: Fields are optional at the database schema level to avoid unsafe not-null schema pushes against existing Global rows.

## PR 6 — Fill-Missing SiteSettings Seed Policy

Decision: `seed:site-settings` fills missing SiteSettings values instead of overwriting existing populated values.

Why: Payload Admin edits must not be overwritten by repeated local/dev seeding.

Consequences: Seed data is safe to re-run for missing scalar fields and empty/missing arrays.

## PR 7 — SiteSettings CTA Group

Decision: Store CTA content in `SiteSettings.cta`.

Why: CTA is singleton homepage/site content.

Consequences: CTA uses only fields displayed by the current UI; secondary CTA/email fields remain deferred.

## PR 8 — SiteSettings Footer Group

Decision: Store Footer settings in `SiteSettings.footer`.

Why: Footer is singleton site settings/content.

Consequences: Email is represented as a social link with platform `email`; no separate email field exists.

## PR 9 — SiteSettings Header Group

Decision: Store Header/navigation in `SiteSettings.header`.

Why: Header navigation is singleton site-wide settings.

Consequences: Header uses compact `logoText`, nav links, and CTA fields only. External/new-tab behavior and header hiding remain unimplemented.

## PR 10 — Prepare Project Detail Content

Decision: Extend `Projects` with detail-page fields while keeping card/list fields separate.

Why: Future detail pages need richer content without breaking existing project cards.

Consequences: Project body content uses Markdown. Blocks/page-builder and media upload remain deferred. `href` remains for compatibility.



## Undated — Markdown Body Content Format

Decision: Project and Post body content should use `contentMarkdown` as the only editable body format.

Why: The authoring workflow needs README-style copy/paste, raw Markdown editing, and a preview mode while retaining support for richer callouts and structured documentation blocks. There is no production project/post content yet, so retaining Lexical fallback would add unused complexity.

Consequences: Public detail pages render `contentMarkdown` through `components/markdown-content.tsx`. The supported format is standard Markdown plus GFM, frontmatter tolerance, limited safe HTML, and GitBook-like `hint`, `tabs`, and `stepper` blocks. Payload Admin uses a custom Markdown field with Preview and Raw modes. Lexical rich text fields, renderers, and dependencies are removed from Projects/Posts.

## PR 11 — Add Project Detail Pages

Decision: Use `/projects/[slug]` as the canonical internal route for project materials.

Why: Project cards need internal detail pages, while `externalUrl` can serve as a detail-page CTA.

Consequences: `getProjectBySlug(slug)` fetches only published projects. Missing/unavailable data returns `notFound()` rather than a seed fallback.

## PR 12 — Add Blog Foundation

Decision: Add the `Posts` collection and connect only the home page Blog section to Payload data.

Why: Establish blog data with the same content architecture as Projects before adding detail routes.

Consequences: `/blog/[slug]` was intentionally deferred to PR 13. Tags/categories remain omitted until the UI needs them.

## PR 13 — Add Blog Detail Pages

Decision: Use `/blog/[slug]` as the canonical internal route for blog articles.

Why: Blog cards should navigate to readable post detail pages.

Consequences: `getPostBySlug(slug)` fetches only published posts. Missing/unavailable data returns `notFound()`. Blog and Project detail pages share `components/markdown-content.tsx`.

## PR 14 — Add Contact Submission Backend

Decision: Store contact submissions in Payload through `ContactSubmissions` and create them only via a controlled server action.

Why: Public users need a safe submission path without direct collection access.

Consequences: Collection-level public create is disabled; `submitContactForm` uses Payload Local API with `overrideAccess: true`. Email notifications, captcha, activity logs, and custom feedback dashboard remain deferred.

## PR 14 — Add Feedback Permissions

Decision: Add `feedback.read` and `feedback.update` permissions.

Why: Contact submissions need separate read/update capabilities in Payload Admin.

Consequences: Users with feedback permissions can view/update submission status. Permission management UI remains deferred.

## PR 15 — Add Public Contact Form UI

Decision: Render `components/contact-form.tsx` on the home page and connect it to `submitContactForm`.

Why: Visitors need a public submission UI using the already-approved backend action contract.

Consequences: The `#contact` anchor points to the form section. Field names, honeypot, validation, and server action contract must remain stable.

## PR 16 — Add Public Archive Pages

Decision: Add `/projects` and `/blog` public archive pages without changing Payload models.

Why: Visitors need archive pages for all published projects and posts.

Consequences: Archive pages use existing `getProjects()` and `getPosts()` loaders. Home page buttons link to the archives.

## PR 16 — Preserve Contact Input Values On Validation Errors

Decision: Make contact form inputs controlled so validation errors do not clear user-entered values.

Why: Failed server validation should not punish users by wiping the form.

Consequences: The form resets only after successful submission.

## Undated — Always-On Public Motion Policy

Decision: Public UI motion intentionally runs regardless of OS/browser reduced-motion settings.

Why: The site's visual identity relies on intro, marquee, scroll-linked, and contact-form motion. When browsers inherit disabled animation settings from the OS, visitors can mistake the site for broken.

Consequences: Do not read `prefers-reduced-motion` in public UI components or globally disable animation/transition through reduced-motion CSS. Keep motion lightweight and content readable while animations run.

## Undated — Avoid Heavy Global Motion

Decision: Do not reintroduce heavy moving mesh gradients or large paint-heavy animated background layers.

Why: A tested moving mesh gradient caused unacceptable performance cost.

Consequences: Keep the global background lightweight/static and prefer local transform/opacity motion.
