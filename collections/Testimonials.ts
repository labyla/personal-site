import type { CollectionConfig } from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    defaultColumns: ["name", "role", "status", "featured", "sortOrder"],
    group: "Content",
    useAsTitle: "name",
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
              name: "name",
              type: "text",
              admin: {
                description: "Person name shown in the public testimonial card.",
              },
              required: true,
            },
            {
              name: "slug",
              type: "text",
              admin: {
                description:
                  "Stable internal identifier for this testimonial. It is used by seed scripts, not shown publicly.",
              },
              required: true,
              unique: true,
            },
            {
              name: "role",
              type: "text",
              admin: {
                description: "Short role or context line shown under the person's name.",
              },
              required: true,
            },
            {
              name: "quote",
              type: "textarea",
              admin: {
                description: "The testimonial text shown in the public card.",
              },
              required: true,
            },
            {
              name: "avatarUrl",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/local-media-field#default",
                },
                description:
                  "Public avatar image URL shown beside the person's name. Use local: to choose from the local media library.",
              },
              required: true,
            },
            {
              name: "rating",
              type: "number",
              admin: {
                description: "Number of accent stars shown in the testimonial card, from 1 to 5.",
              },
              defaultValue: 5,
              max: 5,
              min: 1,
              required: true,
            },
            {
              name: "featured",
              type: "checkbox",
              admin: {
                description:
                  "Editorial flag for future curation. The current public testimonials UI does not filter by this yet.",
              },
              defaultValue: false,
            },
            {
              name: "sortOrder",
              type: "number",
              admin: {
                description:
                  "Lower numbers appear first in the testimonials marquee. Items with the same value fall back to creation date.",
              },
              defaultValue: 0,
            },
            {
              name: "status",
              type: "select",
              admin: {
                description: "Draft testimonials stay hidden. Published testimonials can appear on the site.",
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
              name: "testimonialPreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/testimonial-preview-field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
