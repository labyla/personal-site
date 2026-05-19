import type { GlobalConfig } from "payload"

import { canUpdateContent } from "../lib/payload/access.ts"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: canUpdateContent,
  },
  admin: {
    group: "Content",
  },
  fields: [
    {
      name: "header",
      type: "group",
      fields: [
        {
          name: "logoText",
          type: "text",
        },
        {
          name: "navLinks",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            },
          ],
        },
        {
          name: "ctaLabel",
          type: "text",
        },
        {
          name: "ctaHref",
          type: "text",
        },
      ],
    },
    {
      name: "hero",
      type: "group",
      fields: [
        {
          name: "badgeLabel",
          type: "text",
          required: true,
        },
        {
          name: "badgeText",
          type: "text",
          required: true,
        },
        {
          name: "badgeHref",
          type: "text",
          required: true,
        },
        {
          name: "headlinePrefix",
          type: "text",
          required: true,
        },
        {
          name: "headlineAccent",
          type: "text",
          required: true,
        },
        {
          name: "headlineSuffix",
          type: "text",
          required: true,
        },
        {
          name: "headlineSubline",
          type: "text",
          required: true,
        },
        {
          name: "introPrefix",
          type: "text",
          required: true,
        },
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "role",
          type: "text",
          required: true,
        },
        {
          name: "email",
          type: "email",
          required: true,
        },
        {
          name: "avatarUrl",
          type: "text",
          required: true,
        },
        {
          name: "primaryCtaLabel",
          type: "text",
          required: true,
        },
        {
          name: "primaryCtaHref",
          type: "text",
          required: true,
        },
        {
          name: "secondaryCtaLabel",
          type: "text",
          required: true,
        },
        {
          name: "secondaryCtaHref",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "about",
      type: "group",
      fields: [
        {
          name: "eyebrow",
          type: "text",
        },
        {
          name: "titlePrefix",
          type: "text",
        },
        {
          name: "titleMuted",
          type: "text",
        },
        {
          name: "paragraphs",
          type: "array",
          fields: [
            {
              name: "text",
              type: "textarea",
            },
          ],
        },
        {
          name: "imageUrl",
          type: "text",
        },
        {
          name: "imageAlt",
          type: "text",
        },
        {
          name: "socialLinks",
          type: "array",
          fields: [
            {
              name: "platform",
              type: "select",
              options: [
                {
                  label: "GitHub",
                  value: "github",
                },
                {
                  label: "Twitter",
                  value: "twitter",
                },
                {
                  label: "LinkedIn",
                  value: "linkedin",
                },
                {
                  label: "Instagram",
                  value: "instagram",
                },
              ],
            },
            {
              name: "label",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        {
          name: "isEnabled",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "avatarLetter",
          type: "text",
        },
        {
          name: "titlePrefix",
          type: "text",
        },
        {
          name: "titleAccent",
          type: "text",
        },
        {
          name: "titleMiddle",
          type: "text",
        },
        {
          name: "titleSuffix",
          type: "text",
        },
        {
          name: "name",
          type: "text",
        },
        {
          name: "availability",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "primaryCtaLabel",
          type: "text",
        },
        {
          name: "primaryCtaHref",
          type: "text",
        },
      ],
    },
    {
      name: "footer",
      type: "group",
      fields: [
        {
          name: "brandInitial",
          type: "text",
        },
        {
          name: "brandName",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "copyrightName",
          type: "text",
        },
        {
          name: "mainLinks",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            },
          ],
        },
        {
          name: "workLinks",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            },
          ],
        },
        {
          name: "socialLinks",
          type: "array",
          fields: [
            {
              name: "platform",
              type: "select",
              options: [
                {
                  label: "Email",
                  value: "email",
                },
                {
                  label: "GitHub",
                  value: "github",
                },
                {
                  label: "Twitter",
                  value: "twitter",
                },
                {
                  label: "LinkedIn",
                  value: "linkedin",
                },
                {
                  label: "Instagram",
                  value: "instagram",
                },
              ],
            },
            {
              name: "label",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
}
