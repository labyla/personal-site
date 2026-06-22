import type { CollectionConfig } from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    defaultColumns: ["title", "status", "featured", "sortOrder"],
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
                  "Public project title shown in project lists and at the top of the project page.",
              },
              required: true,
            },
            {
              name: "slug",
              type: "text",
              admin: {
                description:
                  "URL path segment for the project. Example: my-project becomes /projects/my-project.",
              },
              required: true,
              unique: true,
            },
            {
              name: "description",
              type: "textarea",
              admin: {
                description:
                  "Short project summary shown on project cards and used as fallback intro text on the detail page.",
              },
              required: true,
            },
            {
              name: "excerpt",
              type: "textarea",
              admin: {
                description:
                  "Optional detail-page intro. If empty, the public page uses the description.",
              },
            },
            {
              name: "content",
              type: "textarea",
              admin: {
                components: {
                  Field: "@/components/admin/github-markdown-field#default",
                },
                description:
                  "Project body in GitHub-flavored Markdown. The Preview tab uses the same renderer as the public project page.",
                placeholder: "# Project title\n\nPaste a README.md or write GitHub Markdown...",
                rows: 24,
              },
            },
            {
              name: "imageUrl",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/local-media-field#default",
                },
                description:
                  "Public image URL for the project card and project hero image. Use local: to choose from the local media library.",
              },
              required: true,
            },
            {
              name: "tags",
              type: "array",
              admin: {
                description:
                  "Short technology or category labels shown beside the project title.",
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  admin: {
                    description: "One visible tag label, such as Next.js or Payload.",
                  },
                  required: true,
                },
              ],
            },
            {
              name: "href",
              type: "text",
              admin: {
                description:
                  "Legacy card link fallback. Internal cards now prefer /projects/[slug]. Usually leave as #.",
              },
              defaultValue: "#",
            },
            {
              name: "externalUrl",
              type: "text",
              admin: {
                description:
                  "Optional live project URL. When filled, the project page shows a Visit project button.",
              },
            },
            {
              name: "publishedAt",
              type: "date",
              admin: {
                description: "Optional date shown near the project label on the detail page.",
              },
            },
            {
              name: "metaTitle",
              type: "text",
              admin: {
                description:
                  "Optional SEO/browser title. If empty, the public page uses the project title.",
              },
            },
            {
              name: "metaDescription",
              type: "textarea",
              admin: {
                description:
                  "Optional SEO description. If empty, the public page uses the excerpt or description.",
              },
            },
            {
              name: "canonicalUrl",
              type: "text",
              admin: {
                description:
                  "Optional canonical URL when this project has another preferred source URL. Usually leave empty.",
              },
            },
            {
              name: "featured",
              type: "checkbox",
              admin: {
                description:
                  "Editorial flag for highlighted project curation. Public fetching may use it for selected work.",
              },
              defaultValue: false,
            },
            {
              name: "sortOrder",
              type: "number",
              admin: {
                description:
                  "Lower numbers appear first in public project lists. Projects with the same value fall back to creation date.",
              },
              defaultValue: 0,
            },
            {
              name: "status",
              type: "select",
              admin: {
                description:
                  "Draft projects stay hidden. Published projects can appear on /projects and /projects/[slug].",
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
          ],
        },
        {
          label: "Preview",
          fields: [
            {
              name: "projectPreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/project-preview-field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
