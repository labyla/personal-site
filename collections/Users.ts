import type { CollectionConfig } from "payload"

import { USER_PERMISSIONS } from "../lib/payload/access.ts"

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    group: "System",
    useAsTitle: "email",
  },
  fields: [
    {
      name: "permissions",
      type: "select",
      hasMany: true,
      options: USER_PERMISSIONS.map((permission) => ({
        label: permission,
        value: permission,
      })),
    },
  ],
}
