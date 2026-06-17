# Gotchas

## Workflow

- Use Docker by default for install, lint, build, dev, seeds, and Payload type generation.
- After changing Payload collections or globals, run `docker compose run --rm app pnpm payload generate:types`.
- Do not change application code during documentation-only tasks.
- Keep changes surgical; do not refactor unrelated files or reformat wholesale.

## Frontend

- Do not reintroduce heavy moving mesh gradients, large blurred animated background layers, or paint-heavy full-screen animation.
- Do not use glossy SaaS cards, rainbow gradients, decorative noise, heavy shadows, or large rounded corners as the dominant visual language.
- Do not use external CDN scripts, Alpine snippets, Tailwind CDN, or third-party runtime scripts for UI effects.
- Do not gate public-site animation on `prefers-reduced-motion`; motion should run consistently across OS/browser settings while staying lightweight.
- Do not revive the tech marquee crossfade between separate auto/manual layers.
- Do not base Testimonials movement on `scrollLeft`; it can hit the physical scroll end and stop.
- Testimonials normal mode should not allow manual horizontal scroll or show a scrollbar.

## Contact

- Do not casually change contact form field names, honeypot behavior, validation, or `submitContactForm` return contract.
- Clients must not be allowed to submit arbitrary contact submission `status` or `source`.
- Public users must not directly create/read/update/delete `ContactSubmissions` through Payload collection access rules.
- Contact form values should survive server validation errors and reset only after successful submission.

## Payload / Data

- Payload is the source of truth for CMS-backed content.
- Do not overwrite Payload-edited content with seed scripts.
- Collection seed scripts should create missing records and skip existing records by `slug`.
- `seed:site-settings` should fill missing values and empty arrays, not overwrite populated Payload Admin edits.
- Keep `imageUrl`, `avatarUrl`, and `coverImageUrl` as strings until media upload work is explicitly approved.
- Public project, testimonial, and post fetching should use only `status=published`.
- Project and Blog detail routes should use `notFound()` for missing/unavailable published records, not seed fallbacks.
