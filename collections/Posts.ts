import type { CollectionConfig } from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    defaultColumns: ["title", "status", "featured", "publishedAt", "sortOrder"],
    group: "Content",
    useAsTitle: "title",
  },
  access: {
    create: canUpdateContent,
    delete: canUpdateContent,
    read: canReadContent,
    update: canUpdateContent,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Edit",
          fields: [
            {
              name: "title",
              type: "text",
              admin: {
                description:
                  "Public article title shown on blog cards and at the top of the article page.",
              },
              required: true,
            },
            {
              name: "slug",
              type: "text",
              admin: {
                description:
                  "URL path segment for the article. Example: my-article becomes /blog/my-article.",
              },
              required: true,
              unique: true,
            },
            {
              name: "excerpt",
              type: "textarea",
              admin: {
                description: "Short summary shown on blog cards and under the article title.",
              },
              required: true,
            },
            {
              name: "content",
              type: "textarea",
              admin: {
                components: {
                  Field: "@/components/admin/github-markdown-field#default",
                },
                description:
                  "Article body in GitHub-flavored Markdown. The Preview tab uses the same renderer as the public article page.",
                placeholder: "# Article title\n\nWrite GitHub Markdown...",
                rows: 24,
              },
            },
            {
              name: "coverImageUrl",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/local-media-field#default",
                },
                description:
                  "Public image URL for the blog card and article hero image. Use local: to choose from the local media library.",
              },
              required: true,
            },
            {
              name: "readingTime",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/reading-time-field#default",
                },
                description:
                  "Small reading-time label shown near the article date. Example: 6 min read.",
              },
            },
            {
              name: "publishedAt",
              type: "date",
              admin: {
                description:
                  "Publication date shown on the article page and used for ordering after sort order.",
              },
            },
            {
              name: "featured",
              type: "checkbox",
              admin: {
                description:
                  "Editorial flag for future curation. The current public blog UI does not filter by this yet.",
              },
              defaultValue: false,
            },
            {
              name: "sortOrder",
              type: "number",
              admin: {
                description:
                  "Lower numbers appear first in public article lists. Posts with the same value fall back to publication date.",
              },
              defaultValue: 0,
            },
            {
              name: "status",
              type: "select",
              admin: {
                description:
                  "Draft posts stay hidden. Published posts can appear on /blog and /blog/[slug].",
              },
              defaultValue: "draft",
              options: [
                {
                  label: "Draft",
                  value: "draft",
                },
                {
                  label: "Published",
                  value: "published",
                },
              ],
              required: true,
            },
            {
              name: "metaTitle",
              type: "text",
              admin: {
                description:
                  "Optional SEO/browser title. If empty, the public page uses the article title.",
              },
            },
            {
              name: "metaDescription",
              type: "textarea",
              admin: {
                description:
                  "Optional SEO description for search/share previews. If empty, the public page uses the excerpt.",
              },
            },
            {
              name: "canonicalUrl",
              type: "text",
              admin: {
                description:
                  "Optional canonical URL when this article has another preferred source URL. Usually leave empty.",
              },
            },
          ],
        },
        {
          label: "Preview",
          fields: [
            {
              name: "postPreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/post-preview-field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
