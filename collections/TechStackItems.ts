import type { CollectionConfig } from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

export const TechStackItems: CollectionConfig = {
  slug: "tech-stack-items",
  admin: {
    defaultColumns: ["name", "group", "status", "sortOrder"],
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
                description: "Visible skill/tool label shown on marquee chips and stack cards.",
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
              name: "group",
              type: "select",
              admin: {
                description:
                  "Choose whether this item appears in the Skills group or the Tools group.",
              },
              options: [
                {
                  label: "Skill",
                  value: "skill",
                },
                {
                  label: "Tool",
                  value: "tool",
                },
              ],
              required: true,
            },
            {
              name: "icon",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/local-media-field#default",
                },
                description:
                  "SVG icon URL used on public chips/cards. Use an external SVG URL or local media reference.",
                placeholder: "https://.../icon.svg or local:",
              },
              required: true,
            },
            {
              name: "color",
              type: "text",
              admin: {
                components: {
                  Field: "@/components/admin/color-picker-field#default",
                },
                description:
                  "Accent color used on hover. Pick a color or enter a CSS color manually.",
              },
              defaultValue: "#ffffff",
              required: true,
            },
            {
              name: "sortOrder",
              type: "number",
              admin: {
                description:
                  "Lower numbers appear first inside their Skills or Tools group.",
              },
              defaultValue: 0,
            },
            {
              name: "status",
              type: "select",
              admin: {
                description:
                  "Draft items stay hidden. Published items can appear in the homepage marquee and stack section.",
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
              name: "techStackItemPreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/tech-stack-item-preview-field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
