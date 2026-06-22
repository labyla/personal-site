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

The Header has a scroll-linked green accent fill. It starts at 0% at the top of
the page and reaches 100% when the `#contact` section reaches its anchor
position, then stays full through the footer. Keep this motion transform/opacity
based and subtle; the green layer is an accent wash, not a fully solid header
theme.

Header hash links are global home-page section links. Render `#section` values
from `SiteSettings.header` as `/#section` so the same Header works from archive
and detail pages. On the home page, repeated clicks on the current hash must
still scroll to the section, even when the URL already contains that hash.

Do not add `brandName`, external/new-tab link behavior, or header hiding unless a future task explicitly changes the UI. Header visual design and desktop/mobile menu behavior should remain stable unless directly asked.

## Hero

Hero settings come from `SiteSettings.hero`.

The public site uses a lightweight static atmospheric background and an intro loading overlay as part of its visual identity. The overlay shows the intro text with a text-width accent progress bar, waits for the mounted page's required content to be ready, then exits so the page appears in its final usable state. Keep the intro polished and consistent across OS/browser motion settings.

## Homepage Section Settings

Homepage singleton copy comes from `SiteSettings` groups rather than hard-coded component constants:

- `bento`
- `experience`
- `homeProjects`
- `homeBlog`
- `testimonialsSection`
- `techStack`
- `contact`

Repeated content still comes from collections where applicable: Projects, Posts, Testimonials, and Tech Stack Items.

The bento stack card uses `SiteSettings.bento.stackHref` and links to the Tech Stack section by default.

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

The home page Projects section receives its heading/link copy from `SiteSettings.homeProjects` and server-loaded Payload data through props. Project cards link to the internal `/projects/[slug]` detail route when a slug is available.

The `/projects` archive intro/back/footer CTA copy comes from `SiteSettings.projectsPage`.

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

The home page Blog section receives its heading/link copy from `SiteSettings.homeBlog` and server-loaded Payload post data through props. Blog cards link to `/blog/[slug]`.

The `/blog` archive intro/back/footer CTA copy comes from `SiteSettings.blogPage`.

Blog cards and article/detail pages should stay aligned with the dark editorial style. Blog Markdown content uses the shared `components/rich-text.tsx` renderer.

## Testimonials

The Testimonials section heading comes from `SiteSettings.testimonialsSection`; testimonial cards come from the Testimonials collection.

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

## Tech / Skills And Tools Marquee

The tech/skills and tools/apps marquee is an interactive infinite marquee immediately after the Hero.

- Skill icons are muted by default.
- Skill and tool icons are SVG images from either external URLs or local media references.
- On hover, icons use brand/original color and text becomes white.
- Default state auto-scrolls. Skills move left, tools/apps move right.
- Hover/focus slows at the current visual position.
- Dragging with the left mouse button pauses the track and allows manual horizontal movement on the same list.
- Manual scroll should feel infinite/looped rather than finite.
- The marquee should keep auto-moving regardless of OS/browser reduced-motion settings.

Use transform-based movement with duplicated groups, like Testimonials. Do not reintroduce a crossfade between separate auto and manual layers; that looked like a second list appearing on top.

## Tech Stack

The former LAB/Experiments homepage block is now a Tech Stack section linked by `#tools`.

- Section heading/group copy comes from `SiteSettings.techStack`.
- The section is split into Skills and Tools.
- Cards should stay compact, sharp, and grid-based.
- Card icons use the same SVG image behavior as the marquee: white/muted by default, original SVG color on hover.
- Hover states may reveal the item brand color, border emphasis, and a restrained glow.
- The large section background glow should fade smoothly inside its own bounds.
  Avoid short gradient boxes that create visible horizontal clipping at the top
  or bottom of the glow.
- Keep the section in the public site's dark technical style, not the purple/glass-heavy reference style.

## Contact

The contact form visual system is dark minimal/slightly brutalist with underlined fields.

The form lives in `components/contact-form.tsx`, receives heading/button copy from `SiteSettings.contact`, uses `useActionState`, and connects to `submitContactForm` in `lib/actions/contact.ts`.

Fields:

- `name`
- `email`
- optional `subject`
- `message`
- hidden honeypot `website`

Do not change field names, honeypot behavior, validation, or server action contracts when adjusting presentation.

The pending button state shows `Pending` with a lightweight spinner. Animated border effects are allowed only as border effects, not as the panel background. The inner form surface must stay clean/dark without gradient artifacts. A restrained green pulsing border is acceptable for active/focus-within state and may peak slightly brighter while a field is active. If glow creates artifacts inside the form, remove or simplify it.

Contact form inputs are controlled so server-side validation errors do not clear user-entered values. The form resets only after successful submission.

On server validation errors, do not show a separate general error message above
the submit button. The submit button itself should turn red and display a short
actionable error prompt, while the form border turns red. Keep the button text
short enough to fit narrow mobile widths. When the user focuses any field after
that error state, the form and button return to their normal visual state.
Field-specific errors remain visible until their own field receives focus, then
that field error is hidden for the current error cycle. Keep these state changes
quick but animated rather than abrupt.

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
