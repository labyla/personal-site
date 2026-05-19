# Reference 01 — Tajmirul Portfolio

Source: https://www.tajmirul.site/

Screenshots:
- `hero.png`
- `experience-scroll.png`
- `projects-list.png`
- `projects-hover-preview.png`

## Why this reference is relevant

This reference is useful for:
- dark minimal portfolio aesthetic;
- restrained grayscale palette with one green accent;
- oversized condensed typography;
- scroll-based experience animations;
- interactive project list behavior.

The goal is not to copy the site directly, but to reuse selected visual and interaction patterns.

## What to extract

### Color palette

Use a minimal dark palette:
- near-black / dark charcoal background;
- off-white primary text;
- muted gray secondary text;
- vivid green accent.

Green should be used sparingly for:
- hero emphasis;
- active project title;
- important numbers;
- CTA and hover/focus states.

### Experience section

Desired behavior:
- each experience item starts with low opacity;
- opacity increases gradually based on scroll position;
- item should become fully visible only after the user scrolls far enough;
- section label, for example “MY EXPERIENCE”, subtly moves downward while scrolling;
- no heavy cards, only clean text hierarchy.

### Projects section

Default state:
- all projects are visible at once;
- titles are large and muted/dark gray;
- no project image is visible initially;
- each item has number, title, tech tags, and thin separator.

Hover/focus state:
- active project title turns green;
- preview image appears on the right side;
- preview image moves vertically based on mouse Y position;
- non-active projects remain subdued.

## How to adapt for my site

Use this reference for:
- global dark visual direction;
- experience scroll reveal behavior;
- selected projects interaction pattern.

Do not use it for:
- exact page structure;
- exact content;
- exact project names;
- exact spacing/proportions;
- direct visual clone.

## Responsive notes

Desktop:
- use hover preview image;
- large typography;
- scroll-linked animations.

Tablet:
- reduce type scale;
- keep list-based layout.

Mobile:
- do not rely on hover;
- show project image inline or on tap;
- keep scroll reveal subtle and readable.

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
- color tokens;
- typography scale;
- hero section;
- experience section;
- projects section;
- animation utilities;
- responsive behavior.

Potential techniques:
- Framer Motion `useScroll`;
- Framer Motion `useTransform`;
- pointer tracking for preview image;
- CSS variables;
- Tailwind utilities;
- `prefers-reduced-motion`.

Acceptance criteria:
- dark grayscale + green accent direction is preserved;
- experience items reveal smoothly based on scroll;
- experience label moves subtly downward while scrolling;
- projects are displayed as a minimal list;
- hovered/focused project becomes green;
- project preview image appears and tracks cursor vertically on desktop;
- mobile behavior works without hover;
- no backend/CMS/API changes.