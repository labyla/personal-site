# Reference 02 — Gradient Background and Intro Animation

Source:
- personal visual idea
- screenshot: `gradient-example.png`

## Why this reference is relevant

This reference describes two desired visual/interaction ideas for the personal site:

1. A soft animated gradient background.
2. A short intro/loading screen animation before the main site appears.

These ideas should be adapted carefully so the site still feels minimal, clean, and not overloaded.

---

## Idea 01 — Animated gradient background

### What I want

The site background should not be a flat static color.  
Instead, it should use a soft, slowly animated gradient made from a small number of colors.

The gradient should feel:
- smooth;
- calm;
- modern;
- subtle;
- compatible with the rest of the design system.

It should not feel like a bright rainbow or a loud decorative background.

### Visual direction

Possible colors:
- dark charcoal / near-black as the base;
- muted blue;
- muted violet;
- soft pink/red accent;
- optional pale cyan/light blue glow.

The final palette should still work together with the main site direction:
- minimal;
- dark;
- grayscale;
- green accent from the Tajmirul reference.

The gradient should not fight with the green accent.  
Green should remain the main UI accent color, while the gradient should stay atmospheric.

### Implementation direction

The gradient can be implemented as:
- a full-page background layer;
- several large blurred radial gradients;
- a slow animated background-position shift;
- or CSS pseudo-elements with blur and opacity.

The animation should be slow and subtle.

Avoid:
- fast movement;
- strong color flickering;
- noisy gradients;
- gradients behind text that reduce readability.

### Accessibility / readability

Text must remain readable at all times.

Use:
- dark overlay;
- reduced opacity;
- blur;
- muted gradient colors;
- fallback static background.

Respect `prefers-reduced-motion`:
- if reduced motion is enabled, use a static gradient.

---

## Idea 02 — Intro animation

### What I want

When the user opens the site, they first see a short intro screen:

- black/dark full-screen overlay;
- white letters appear with upward motion;
- letters gradually form the site name;
- after the title is formed, the intro smoothly fades or slides away;
- then the main site appears.

Example text:
- site name;
- personal brand name;
- short wordmark.

The exact animation can be changed later.

### Desired feeling

The intro should feel:
- premium;
- minimal;
- smooth;
- not too long;
- not annoying on repeat visits.

It should not feel like a heavy loading screen.

### Animation behavior

Initial state:
- full-screen dark overlay;
- main page is either hidden or slightly dimmed behind it.

Text animation:
- each letter/word appears from below;
- opacity goes from 0 to 1;
- vertical transform goes from `translateY(...)` to `0`;
- slight stagger between letters or word groups.

Exit animation:
- intro fades out;
- or moves upward;
- or uses a soft clip-path reveal;
- main content fades in underneath.

### Timing

Recommended duration:
- total intro duration: around 1.5–2.5 seconds;
- letter animation: around 0.6–1.2 seconds;
- exit animation: around 0.5–0.8 seconds.

Avoid intros longer than 3 seconds.

### Repeat behavior

Later we can decide whether:
- intro plays every visit;
- intro plays only once per session;
- intro is skipped after the first visit using session storage.

Preferred behavior:
- play once per session;
- avoid annoying returning users.

### Accessibility

Respect `prefers-reduced-motion`:
- skip or simplify the intro animation;
- show the main site quickly.

The site should not depend on the intro to load important content.

---

## How to adapt for my site

Use this reference for:
- global background direction;
- first-load intro animation;
- atmospheric visual identity.

Do not use this reference for:
- section layout;
- project list behavior;
- experience scroll behavior;
- backend/CMS/API logic.

This reference should be combined with:
- `01-tajmirul-portfolio` for minimal dark UI, typography, experience, and projects.

---

## Codex implementation notes for later

Frontend/design only.

Do not change:
- backend;
- Payload CMS;
- database;
- API routes;
- permissions;
- form logic.

Potential implementation areas:
- global layout wrapper;
- background component;
- intro/preloader component;
- animation utilities;
- CSS variables;
- Tailwind theme tokens.

Potential techniques:
- CSS radial gradients;
- animated background-position;
- blurred absolutely positioned gradient blobs;
- Framer Motion staggered text animation;
- `AnimatePresence`;
- `prefers-reduced-motion`;
- `sessionStorage` for play-once behavior.

Acceptance criteria:
- site has a soft animated gradient background;
- gradient is subtle and does not hurt readability;
- gradient works with the dark minimal design direction;
- green remains the main accent color;
- intro appears on first page load;
- intro uses dark background and white animated text;
- intro disappears smoothly and reveals the main page;
- intro does not last too long;
- reduced-motion users get a simplified/static version;
- no backend/CMS/API changes are made.