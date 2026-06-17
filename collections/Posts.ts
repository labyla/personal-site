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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "contentMarkdown",
      type: "textarea",
      admin: {
        components: {
          Field: "@/components/admin/markdown-editor-field#MarkdownEditorField",
        },
        description:
          "Primary body content. Supports standard Markdown, GFM tables, details/summary/kbd HTML, and GitBook-style hint, tabs, and stepper blocks.",
      },
    },
    {
      name: "coverImageUrl",
      type: "text",
      required: true,
    },
    {
      name: "readingTime",
      type: "text",
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "status",
      type: "select",
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
    },
    {
      name: "metaDescription",
      type: "textarea",
    },
    {
      name: "canonicalUrl",
      type: "text",
    },
  ],
}
