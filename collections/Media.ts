import { unlink } from "node:fs/promises"
import { basename, join } from "node:path"

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  PayloadRequest,
} from "payload"

import { canReadContent, canUpdateContent } from "../lib/payload/access.ts"

type MediaData = {
  filename?: string | null
  filesize?: number | null
  kind?: "file" | "folder" | null
  mimeType?: string | null
  name?: string | null
  parent?: number | string | { id?: number | string; path?: string | null } | null
  path?: string | null
  slug?: string | null
  storageFilename?: string | null
  url?: string | null
}

type MediaDocument = MediaData & {
  id?: number | string
}

function getRelationId(value: MediaData["parent"]) {
  if (!value) {
    return null
  }

  if (typeof value === "object") {
    return value.id ? String(value.id) : null
  }

  return String(value)
}

function slugifyFolderName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._ -]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[/\\]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function joinPath(parentPath: string | null | undefined, segment: string) {
  const cleanParent = parentPath?.replace(/^\/+|\/+$/g, "")

  return `/${[cleanParent, segment].filter(Boolean).join("/")}`
}

async function getParentPath({
  id,
  req,
}: {
  id: string | null
  req: PayloadRequest
}) {
  if (!id) {
    return null
  }

  const parent = await req.payload.findByID({
    collection: "media",
    depth: 0,
    id,
    overrideAccess: true,
  }) as MediaDocument

  return parent.path || null
}

const updateChildPaths: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!previousDoc || previousDoc.path === doc.path) {
    return
  }

  const children = await req.payload.find({
    collection: "media",
    depth: 0,
    limit: 200,
    overrideAccess: true,
    where: {
      parent: {
        equals: doc.id,
      },
    },
  })

  for (const child of children.docs as MediaDocument[]) {
    await req.payload.update({
      collection: "media",
      data: {
        kind: child.kind || "file",
        name: child.name || "",
      },
      depth: 0,
      id: child.id as number | string,
      overrideAccess: true,
    })
  }
}

const deleteStoredFile: CollectionAfterDeleteHook = async ({ doc }) => {
  const media = doc as MediaDocument

  if (media.kind !== "file" || !media.storageFilename) {
    return
  }

  try {
    await unlink(join(process.cwd(), "public", "media", basename(media.storageFilename)))
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "ENOENT") {
      return
    }

    throw error
  }
}

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    components: {
      views: {
        list: {
          Component: "@/components/admin/media-manager-view#default",
        },
      },
    },
    defaultColumns: ["name", "kind", "path", "mimeType", "updatedAt"],
    group: "Media",
    useAsTitle: "path",
  },
  access: {
    create: canUpdateContent,
    delete: canUpdateContent,
    read: canReadContent,
    update: canUpdateContent,
  },
  fields: [
    {
      name: "kind",
      type: "select",
      admin: {
        description: "Folder entries group files. File entries are uploaded media assets.",
      },
      defaultValue: "file",
      options: [
        {
          label: "File",
          value: "file",
        },
        {
          label: "Folder",
          value: "folder",
        },
      ],
      required: true,
    },
    {
      name: "name",
      type: "text",
      admin: {
        description: "Visible name shown in the local media manager.",
      },
    },
    {
      name: "parent",
      type: "relationship",
      admin: {
        description: "Parent folder. Leave empty for the media root.",
      },
      relationTo: "media",
    },
    {
      name: "uploadControl",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/media-upload-field#default",
        },
      },
    },
    {
      name: "slug",
      type: "text",
      admin: {
        description: "URL-safe folder segment. Leave empty to generate from the folder name.",
      },
    },
    {
      name: "path",
      type: "text",
      admin: {
        description: "Unique local path. Use this as local:/path/to/file.ext in URL fields or Markdown.",
        readOnly: true,
      },
      unique: true,
    },
    {
      name: "filename",
      type: "text",
      admin: {
        description: "Original uploaded filename.",
        readOnly: true,
      },
    },
    {
      name: "storageFilename",
      type: "text",
      admin: {
        description: "Stored filename under public/media.",
        readOnly: true,
      },
    },
    {
      name: "url",
      type: "text",
      admin: {
        description: "Public URL for the stored media file.",
        readOnly: true,
      },
    },
    {
      name: "mimeType",
      type: "text",
      admin: {
        description: "Uploaded file MIME type.",
        readOnly: true,
      },
    },
    {
      name: "filesize",
      type: "number",
      admin: {
        description: "Uploaded file size in bytes.",
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [updateChildPaths],
    afterDelete: [deleteStoredFile],
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        const nextData = data as MediaData
        const original = originalDoc as MediaData | undefined
        const kind = nextData.kind || original?.kind || "file"
        const parentId = getRelationId(nextData.parent ?? original?.parent)
        const parentPath = await getParentPath({ id: parentId, req })

        nextData.kind = kind

        if (kind === "folder") {
          const name = nextData.name || original?.name || ""
          const slug = nextData.slug || original?.slug || slugifyFolderName(name)

          nextData.slug = slugifyFolderName(slug)
          nextData.path = joinPath(parentPath, nextData.slug)

          return nextData
        }

        const filename = sanitizeFilename(nextData.filename || original?.filename || "")

        if (filename) {
          nextData.path = joinPath(parentPath, filename)
          nextData.name ||= original?.name || filename.replace(/\.[^.]+$/, "")
        }

        return nextData
      },
    ],
  },
}
