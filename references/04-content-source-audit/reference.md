# Reference 04 - Public Content Source Audit

Source:
- current public Next.js routes and components
- current Payload collections/globals
- current seed/fallback data

## Why this reference is relevant

This reference audits the information a public visitor can see on the site and
classifies where each kind of information should live.

The goal is to avoid two opposite mistakes:
- putting every label and microcopy field into Payload, which makes the admin noisy;
- leaving owner-editable portfolio content in React components, which forces code changes for normal site updates.

Assumption: "backend" means Payload-editable content loaded through the existing server-side `lib/data/*` pattern. Stable UI labels and interaction text can remain in code when they are part of the interface contract rather than owner-managed content.

---

## Current source map

Already Payload-backed:
- Header navigation and CTA fields through `SiteSettings.header`.
- Hero core copy through `SiteSettings.hero`.
- About/profile content through `SiteSettings.about`.
- CTA content through `SiteSettings.cta`.
- Footer brand, links, and social links through `SiteSettings.footer`.
- Projects through the `Projects` collection.
- Blog posts through the `Posts` collection.
- Testimonials through the `Testimonials` collection.
- Contact submissions through `ContactSubmissions`.

Still code-backed public content:
- Tech skills and tools/apps in `components/tech-stack-data.ts`.
- Tech marquee and Tech Stack section labels and descriptions.
- Bento/stat cards such as "20+ Projects" and "4+ Years".
- Experience items, roles, dates, and descriptions.
- Contact section heading, intro copy, field labels, placeholders, and submit-state labels.
- Archive page headings and intro copy for `/projects` and `/blog`.
- Detail-page fallback/status labels such as "Project story is being prepared."
- Intro overlay wordmark text.
- Root metadata title/description.
- Small UI labels such as "Read", "Preview", "Back home", "Visit project", "Navigate", "Work", and "Connect".

---

## Backend content

These should be editable from Payload because they are public content, change over time, or are list-like.

### Skills and tools

Make skills and tools/apps backend-backed. This is the most obvious missing CMS slice.

Suggested model:
- one `TechStack` or `Capabilities` collection with `name`, `kind` (`skill` or `tool`), `color`, `iconKey`, `sortOrder`, `featured`, and `status`;
- or two collections, `Skills` and `Tools`, if the admin should keep them visually separate.

Prefer one collection unless the two types need different fields later. Keep icon rendering in frontend through a safe `iconKey` map rather than storing arbitrary icon components or SVG.

Public surfaces using this data:
- the marquee after Hero;
- the Tech Stack grid;
- the small Bento stack card, if it should mirror featured skills.

### Projects

Keep projects in Payload. This is already implemented correctly as a collection.

Fields that belong in backend:
- title, slug, description, excerpt, Markdown content;
- image URL, tags, published date, external URL;
- SEO fields, status, featured, sort order.

Fields that should stay frontend-only:
- card hover behavior;
- preview placement;
- presentation gradients;
- route structure.

### Blog

Keep posts in Payload. This is already implemented correctly as a collection.

Fields that belong in backend:
- title, slug, excerpt, Markdown content;
- cover image URL, reading time, published date;
- SEO fields, status, featured, sort order.

Fields that should stay frontend-only:
- card hover animation;
- "Read" action label unless the site needs localization;
- article layout and Markdown rendering rules.

### Testimonials

Keep testimonials in Payload. This is already implemented correctly as a collection.

Fields that belong in backend:
- name, role, quote, avatar URL, rating;
- status, featured, sort order.

Fields that should stay frontend-only:
- marquee mechanics;
- star icon rendering;
- duplicated track behavior.

### Experience

Move experience to backend if it is intended to behave like a public resume.

Suggested model:
- `Experience` collection with `company`, `role`, `period`, `description`, `sortOrder`, `status`.

Alternative:
- keep it in `SiteSettings.experience` as an array if it will always be a short fixed list and does not need individual drafts.

Recommendation: use a collection if the owner expects to add/remove roles over time. Use a `SiteSettings` array only if this is closer to static positioning copy than a real resume.

### Bento/profile metrics

Move the card text and numbers to a singleton settings group only if the owner wants no-code editing of claims like "20+" or "4+ Years".

Suggested home settings group:
- build CTA eyebrow, line, href;
- stack card eyebrow, description, featured skill labels;
- project metric label, value, caption;
- workflow card label, title, href;
- experience metric label, value, avatar/count motif setting.

Do not make this a collection. These cards are layout-specific homepage copy.

### Contact section intro

The form submission data is already backend-backed. The form contract should stay in code.

Good backend candidates:
- contact section eyebrow;
- heading;
- introductory paragraph.

Keep in code:
- input names: `name`, `email`, `subject`, `message`, `website`;
- honeypot behavior;
- validation rules and error messages;
- pending/success/error state behavior;
- button state labels, unless localization becomes a requirement.

### Archive and page SEO copy

Consider a `SiteSettings.seo` or `SiteSettings.pages` group for:
- root metadata title and description;
- `/projects` archive heading and intro;
- `/blog` archive heading and intro;
- social/default SEO metadata later.

This is not urgent, but it removes remaining owner-facing copy from route files.

---

## Set once / keep in code

These are stable enough to define once in code, or they are structural UI text that should not create admin fields.

### Interface structure

Keep these in code:
- route paths: `/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`;
- section IDs: `home`, `about`, `work`, `blog`, `tools`, `contact`;
- fallback UI labels such as "Article", "Project", "Preview", "Read", "ITEMS";
- navigation helper labels such as "Back home", "Back to projects", "Back to articles";
- footer column headings such as "Navigate", "Work", and "Connect";
- detail-page empty-content messages.

Reason: these are interface affordances, not content the owner is likely to manage.

### Visual and interaction constants

Keep these in code:
- marquee speeds, direction, duplicated group counts;
- animation timings;
- color/gradient assignment;
- hover/focus behavior;
- icon mappings and Lucide component choices;
- image frame behavior and responsive layout.

Reason: changing these through Payload would blur content editing with frontend design implementation.

### Contact form contract

Keep these in code:
- field names and validation schema;
- honeypot field;
- safe public error messages;
- submit button state behavior;
- server action return shape.

Reason: this is application behavior and security surface, not editorial content.

### Stable identity

The owner name, brand initial, and copyright name can be set once in seed/fallback settings and edited through `SiteSettings` only when needed.

Do not duplicate these as hardcoded strings in unrelated components. The intro overlay currently hardcodes `Aayush Bharti`; if that text should stay aligned with the rest of the site identity, derive it from `SiteSettings` in a future small slice.

---

## Section-by-section recommendation

### Home / Header

Current state is mostly good. Header content is already in `SiteSettings.header`.

Keep header behavior and hash-link normalization in code. Do not add admin fields for scroll progress, mobile-menu behavior, or external-link behavior unless a future UI decision requires it.

### Home / Hero

Keep main Hero copy in `SiteSettings.hero`, but there is still hardcoded copy in the component:
- "Available for selected builds";
- the long intro sentence after `name` and `role`;
- "Email";
- "Focus";
- the Focus paragraph.

Recommendation: either move these into `SiteSettings.hero` as a small follow-up, or deliberately mark them as fixed editorial UI. The first option is better if the owner expects to tune positioning without code.

### Home / Tech marquee and Tech Stack

Move item data to Payload. Keep the marquee/grid behavior in code.

Good first slice:
- add a collection for tech stack items;
- add a loader with temporary fallback from `tech-stack-data.ts`;
- feed both `TechMarquee` and `Experiments` from the same server-loaded data;
- keep `iconKey` mapped to local Lucide icons in the frontend.

### Home / Bento

This section currently mixes evergreen UI structure with editable claims. Keep layout in code, but consider a `SiteSettings.homeHighlights` group for text, metrics, and links.

Do not create a collection unless cards become repeatable admin-managed modules.

### Home / Experience

If accuracy matters, move it to backend. Experience dates and descriptions can become stale and are public credibility claims.

Use either:
- `Experience` collection for resume-like entries;
- `SiteSettings.experience` array for a short fixed story block.

### Home / Projects

Already backend-backed. The next content task is not a new model; it is replacing fallback/seed content with real CMS content and eventually removing temporary fallback.

### Home / Blog

Already backend-backed. Tags/categories are still intentionally omitted because the UI does not display them.

### Home / About

Already backend-backed through `SiteSettings.about`.

Potential cleanup: keep social platform options constrained in Payload and frontend icon maps. Do not store arbitrary icon data.

### Home / Testimonials

Already backend-backed. Keep the transform marquee in code.

### Home / Contact

Store submissions in Payload, keep form mechanics in code.

Optional future settings:
- contact section heading and intro paragraph;
- success message if the owner wants to change tone without code.

Avoid admin fields for validation messages unless localization is added.

### Home / CTA

Already backend-backed through `SiteSettings.cta`.

This is the right model: singleton content, not a collection.

### Footer

Already backend-backed through `SiteSettings.footer`.

Keep column labels and icon rendering in code. Keep email as a social link with platform `email`, matching the existing decision.

### Archive and detail pages

Collection data should stay in Projects and Posts. Archive headings can stay in code for now, or move to a `SiteSettings.pages` group if no-code editing of page intros becomes important.

Detail empty-state messages should stay in code.

---

## Suggested priority order

1. Add backend-backed Skills/Tools because the user already identified them and they are shared by two public surfaces.
2. Add Experience if the section should be accurate resume content rather than fixed positioning copy.
3. Add `SiteSettings` fields for remaining Hero hardcoded profile copy.
4. Add `SiteSettings.homeHighlights` for Bento metrics only if those claims will be edited from admin.
5. Add archive/SEO settings only after core content is stable.
6. Remove temporary fallbacks once production CMS data is reliable.

---

## Codex implementation notes for later

Use the existing vertical-slice pattern:
- add the smallest Payload collection/global fields needed;
- add seed/fallback data only for the new slice;
- add a `lib/data/*` loader that normalizes Payload records into component props;
- pass data from server routes into client components;
- run `docker compose run --rm app pnpm payload generate:types` after collection/global changes;
- verify with `docker compose run --rm app pnpm lint` and `docker compose run --rm app pnpm build`.

Avoid:
- making a generic page-builder for these changes;
- moving UI behavior, animation constants, or icon components into Payload;
- adding media uploads as part of the skills/tools slice;
- changing contact form contracts while editing contact copy;
- replacing current collections that already work.

Acceptance criteria for the next content-source slice:
- the public surface renders the same visual design;
- the selected content can be edited in Payload;
- seed scripts do not overwrite admin edits;
- fallback data remains temporary and documented;
- no unrelated frontend behavior changes are introduced.
