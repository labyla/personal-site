# Frontend Context

## Direction

The accepted public frontend direction is dark minimal, modern, technical, and slightly brutalist while remaining clean and readable.

Use a restrained grayscale palette with vivid green as the primary accent. Green should be deliberate: focus states, active states, key highlights, and small technical details. Avoid using green as a broad decorative wash.

Prefer sharp or near-sharp surfaces, subtle borders, strong typography, generous negative space, and clear hierarchy.

## Visual Rules

- Avoid glossy SaaS cards, heavy shadows, rainbow gradients, large rounded corners, decorative noise, and marketing-style excess.
- Avoid heavy moving mesh gradients, large blurred full-screen animated layers, and paint-heavy `background-position` or `background-size` animation.
- Keep the global background lightweight, static, and atmospheric.
- Prefer transform/opacity for local motion.
- Avoid expensive filters on large elements.
- Do not use external CDN scripts, Alpine snippets, Tailwind CDN, or third-party runtime scripts for UI effects.
- If a reference inspires an effect, implement the minimal local CSS/React needed in the project.

Article and project detail pages should use sharp editorial image frames, restrained borders, and typography consistent with the homepage redesign.

## Motion Policy

The public site intentionally runs its motion system regardless of OS/browser reduced-motion settings so key visual behavior does not appear broken for visitors with those settings disabled or inherited from their OS.

Motion must still stay lightweight and content must remain readable while animations are running.

Global animation must stay lightweight. Performance is a design constraint, not a polish pass.

## Header

Header/navigation settings come from `SiteSettings.header`.

The Header uses:

- `logoText`
- `navLinks` with `label` and `href`
- `ctaLabel`
- `ctaHref`

Do not add `brandName`, external/new-tab link behavior, or header hiding unless a future task explicitly changes the UI. Header visual design and desktop/mobile menu behavior should remain stable unless directly asked.

## Hero

Hero settings come from `SiteSettings.hero`.

The public site uses a lightweight static atmospheric background and a short intro animation as part of its visual identity. Keep the intro polished and consistent across OS/browser motion settings.

## About

About/profile settings come from `SiteSettings.about`.

The About UI uses:

- `eyebrow`
- `titlePrefix`
- `titleMuted`
- `paragraphs`
- `imageUrl`
- `imageAlt`
- `socialLinks` with `platform`, `label`, and `href`

No location or stats fields are included because the current UI does not display them.

## Projects

The home page Projects section receives server-loaded Payload data through props. Project cards link to the internal `/projects/[slug]` detail route when a slug is available.

Current public card fields include:

- `title`
- `description`
- `imageUrl`
- `tags.label`
- `href`
- `slug`
- `sortOrder`
- `status`
- `createdAt`

Presentation gradients are assigned by the frontend from a small fixed palette and are not stored in Payload.

Selected-project hover/focus preview is part of the current UI behavior and should keep keyboard/focus support where relevant.

## Blog

The home page Blog section receives server-loaded Payload post data through props. Blog cards link to `/blog/[slug]`.

Blog cards and article/detail pages should stay aligned with the dark editorial style. Blog rich content uses the shared `components/rich-text.tsx` renderer.

## Testimonials

Testimonials should be a full-width horizontal infinite marquee with looped cards and no empty gaps.

Normal behavior:

- No manual horizontal scrolling.
- No visible scrollbar.
- Default direction is left.
- Last vertical page scroll direction controls horizontal direction: scroll down means left, scroll up means right.
- Vertical scroll velocity temporarily increases horizontal marquee speed.
- Speed smoothly returns to base after scrolling stops.
- Hover/focus may slightly slow the marquee but should not enable manual scroll.

The marquee should keep auto-moving regardless of OS/browser reduced-motion settings.

Do not base Testimonials movement on `scrollLeft`; use transform-based movement with duplicated tracks/cards, an offset ref, modulo wrapping based on one group width, and `overflow-hidden`.

## Tech / Skills Marquee

The tech/skills marquee is an interactive infinite marquee.

- Skill icons are muted by default.
- On hover, icons use brand/original color and text becomes white.
- Default state auto-scrolls.
- Hover/focus pauses at the current visual position and allows manual horizontal scrolling on the same list.
- Manual scroll should feel infinite/looped rather than finite.
- The marquee should keep auto-moving regardless of OS/browser reduced-motion settings.

Do not reintroduce a crossfade between separate auto and manual layers; that looked like a second list appearing on top.

## Contact

The contact form visual system is dark minimal/slightly brutalist with underlined fields.

The form lives in `components/contact-form.tsx`, uses `useActionState`, and connects to `submitContactForm` in `lib/actions/contact.ts`.

Fields:

- `name`
- `email`
- optional `subject`
- `message`
- hidden honeypot `website`

Do not change field names, honeypot behavior, validation, or server action contracts when adjusting presentation.

The pending button state shows `Pending` with a lightweight spinner. Animated border effects are allowed only as border effects, not as the panel background. The inner form surface must stay clean/dark without gradient artifacts. A restrained green pulsing border is acceptable for active/focus-within state. If glow creates artifacts inside the form, remove or simplify it.

Contact form inputs are controlled so server-side validation errors do not clear user-entered values. The form resets only after successful submission.

## Footer

Footer settings come from `SiteSettings.footer`.

The Footer UI uses:

- `brandInitial`
- `brandName`
- `description`
- `copyrightName`
- `mainLinks`
- `workLinks`
- `socialLinks` with `platform`, `label`, and `href`

Email is represented as a `socialLinks` item with platform `email`; there is no separate email field. `isEnabled` is not included because the current UI does not support hiding the Footer.

## Historical Frontend Notes

PR 1 established dark tokens, vivid green accent, lightweight static atmospheric background, public shell, and intro overlay. A heavier moving mesh gradient was tested and reverted because it caused unacceptable performance cost.

PR 2 redesigned the homepage direction, hero, header, and baseline section layout toward the current dark minimal/slightly brutalist style. PR 3 added experience scroll reveal and selected-project hover/focus preview. Later polish aligned blog cards, detail pages, tech marquee, contact form, and anchor scrolling with the same design system.
