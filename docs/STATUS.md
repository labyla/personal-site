# Status

This status reflects the currently accepted project context. Before major changes, verify it against the codebase and update this file if the implementation has drifted.

## Implemented

- Next.js 16 App Router public site.
- Dark minimal/slightly brutalist frontend direction.
- Docker and Docker Compose workflow.
- Payload CMS foundation with PostgreSQL.
- Standard Payload Admin Panel.
- Users with explicit content and feedback permissions.
- Projects collection, seed script, home page connection, archive page, and detail pages.
- Testimonials collection, seed script, and home page connection.
- SiteSettings Global groups for Hero, About, CTA, Footer, and Header.
- Site settings seed script with fill-missing behavior.
- Posts collection, seed script, home page Blog connection, archive page, and detail pages.
- Shared GitHub-like Markdown renderer for Projects and Posts.
- Payload Admin Markdown editor for Project and Post content with Edit/Preview modes and a slash helper.
- ContactSubmissions collection and controlled public server action.
- Public Contact Form UI connected to the server action.
- Contact form preservation of entered values after server validation errors.

## In Progress / Current Direction

- The project is mid-CMS rollout: many public sections are now Payload-backed, but temporary seed/fallback scaffolding remains.
- Payload Admin is the current dashboard. A custom user account/dashboard area is not implemented.
- Content editing should continue slice-by-slice rather than through broad dashboard rewrites.

## Current Source Of Truth

- Payload is the source of truth for Projects, Testimonials, Posts, and SiteSettings-backed homepage/site content.
- `lib/data/*-seed.ts` files provide seed data and temporary fallback data during rollout.
- Contact submissions are stored in Payload and viewed through the standard Payload Admin Panel.

## Temporary Fallbacks Still Present

- Project fallback data remains in the public loader path until real CMS records are consistently seeded and production content exists.
- Testimonial fallback data remains for the same reason.
- Post fallback data remains for the same reason.
- SiteSettings fallback data remains for Hero, About, CTA, Footer, and Header until seeded/production content is reliable.

## Known Incomplete Areas

- Media uploads are deferred; image fields remain strings such as `imageUrl`, `avatarUrl`, and `coverImageUrl`.
- Custom user account/dashboard is deferred.
- Full permission management UI is deferred.
- Contact submissions are viewed in Payload Admin only; no custom feedback dashboard exists.
- Email notifications are not implemented.
- Captcha/external anti-spam services are not implemented.
- Activity logs are not implemented.
- Tags/categories for Posts are not implemented because the current Blog UI does not display them.
- Blocks/page-builder are not used for Projects or Posts.
- Existing Project/Post records that still contain old Lexical JSON content need manual replacement or migration to Markdown.

## Next Likely Work

- Seed real local/dev content and confirm Payload-backed public pages are populated without relying on fallbacks.
- Remove temporary fallbacks once production/local CMS content is reliable.
- Continue any new CMS-backed content area as a small vertical slice.
- Consider media uploads, permission UI, custom dashboard, notifications, captcha, and logs only when explicitly approved.
