# Project Context

## What This Is

This repository is a personal portfolio/content site built with Next.js 16. It presents the owner, selected projects/case studies, writing, testimonials, and a contact path.

The site is also evolving into a CMS-backed product surface: Payload CMS lets the owner edit most public content through an admin panel without changing source code.

## Users

- Public visitors evaluating the owner for technical work, collaboration, writing, or project credibility.
- The site owner, who needs to maintain projects, posts, testimonials, profile/site settings, and contact submissions through Payload Admin.
- Future AI/code agents, who need stable project context and should avoid re-litigating accepted architecture and design decisions.

## Main Scenarios

- Visitors land on the home page and quickly understand the owner's positioning.
- Visitors scan projects, open project detail pages, and inspect technical/product work.
- Visitors scan recent writing, open blog post detail pages, and read long-form content.
- Visitors read testimonials/social proof.
- Visitors submit a contact form.
- The owner edits public content through Payload Admin.
- The owner seeds local/dev content through Docker-backed Payload scripts.

## Non-Goals

- Do not turn the public site into a glossy SaaS landing page.
- Do not build a full custom dashboard until it is explicitly approved.
- Do not implement broad backend/admin functionality in one pass.
- Do not migrate all content or add media uploads unless the current task explicitly includes that stage.
- Do not add external runtime scripts, CDN snippets, or third-party UI effects for the public frontend.
- Do not make speculative roles, logging, email, captcha, or workflow systems before approval.

## Quality Criteria

- The public site should feel dark, minimal, technical, fast, readable, and intentional.
- UI should work at desktop and mobile widths, with keyboard/focus behavior where relevant.
- Motion must be lightweight and run consistently regardless of OS/browser reduced-motion settings.
- CMS-backed public data should be loaded server-side through Payload Local API patterns already used in the repo.
- Admin/backend work should be incremental, reviewable, and locally verifiable with Docker.
- Seed scripts should be repeatable and must not overwrite content edited in Payload Admin unless a decision explicitly says otherwise.
- Documentation should keep future agents oriented without duplicating long context blocks.
