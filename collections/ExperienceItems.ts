import type { CollectionConfig } from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

export const ExperienceItems: CollectionConfig = {
  slug: "experience-items",
  admin: {
    defaultColumns: ["role", "company", "period", "status", "sortOrder"],
    group: "Content",
    useAsTitle: "role",
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
              name: "company",
              type: "text",
              admin: {
                description:
                  "Company, client group, or context shown in the experience timeline.",
              },
              required: true,
            },
            {
              name: "slug",
              type: "text",
              admin: {
                description:
                  "Stable internal identifier used by seed scripts. It is not shown publicly.",
              },
              required: true,
              unique: true,
            },
            {
              name: "role",
              type: "text",
              admin: {
                description: "Role or type of work shown as the main item title.",
              },
              required: true,
            },
            {
              name: "period",
              type: "text",
              admin: {
                description: "Date range shown beside this experience item.",
              },
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              admin: {
                description: "Short explanation of what happened in this experience item.",
              },
              required: true,
            },
            {
              name: "sortOrder",
              type: "number",
              admin: {
                description:
                  "Lower numbers appear first in the homepage experience timeline.",
              },
              defaultValue: 0,
            },
            {
              name: "status",
              type: "select",
              admin: {
                description:
                  "Draft items stay hidden. Published items can appear in the homepage experience timeline.",
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
              name: "experienceItemPreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/experience-item-preview-field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
