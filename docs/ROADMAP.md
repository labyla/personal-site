# Roadmap

These are deferred or likely future stages. Do not implement them unless the current task explicitly asks for them or a new decision approves them.

## Cleanup After CMS Content Exists

- Remove temporary frontend fallbacks for Projects after real local/dev and production Payload content is reliable.
- Remove temporary frontend fallbacks for Testimonials after real local/dev and production Payload content is reliable.
- Remove temporary frontend fallbacks for Posts after real local/dev and production Payload content is reliable.
- Remove temporary SiteSettings fallback paths after Hero, About, CTA, Footer, and Header content is seeded and reliable.

## Media

- Add a Media collection and upload workflow later.
- Replace string image fields with media relationships only when that migration is explicitly planned.
- Keep `imageUrl`, `avatarUrl`, and `coverImageUrl` string-based until then.

## Permissions And Accounts

- Build permission management UI later.
- Build a custom user account/dashboard later.
- Keep using normal users with explicit permissions.
- Add each new dashboard/account capability behind its own permission.

## Contact / Feedback

- Add a custom feedback dashboard later if approved.
- Add email notifications later if approved.
- Add captcha or external anti-spam services later if approved.
- Add activity logs later if approved.
- Consider opening contact submission deletion only by explicit decision.

## Content Model Extensions

- Add Post tags/categories only when the public/admin UI needs them.
- Consider blocks/page-builder only when rich text is insufficient for a specific approved use case.
- Add secondary CTA/email fields only if the CTA UI is changed to display them.
- Add Header external/new-tab behavior or `isEnabled` only if the Header UI is changed to support it.

## Implementation Approach

- Continue backend/admin work as vertical slices.
- Keep each slice locally verifiable through Docker.
- Update `docs/DECISIONS.md`, `docs/STATUS.md`, and any relevant frontend/backend docs after accepted decisions.
