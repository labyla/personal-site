import type { CollectionConfig } from "payload"

import { canReadFeedback, canUpdateFeedback } from "../lib/payload/access.ts"

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  admin: {
    defaultColumns: ["name", "email", "status", "source", "createdAt"],
    group: "Feedback",
    useAsTitle: "email",
  },
  access: {
    create: () => false,
    delete: () => false,
    read: canReadFeedback,
    update: canUpdateFeedback,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "subject",
      type: "text",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        {
          label: "New",
          value: "new",
        },
        {
          label: "Read",
          value: "read",
        },
        {
          label: "Replied",
          value: "replied",
        },
        {
          label: "Archived",
          value: "archived",
        },
      ],
      required: true,
    },
    {
      name: "source",
      type: "text",
      defaultValue: "website",
    },
    {
      name: "userAgent",
      type: "text",
    },
  ],
}
