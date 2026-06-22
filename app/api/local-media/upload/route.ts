import config from "@payload-config"
import { mkdir, writeFile } from "fs/promises"
import { NextResponse, type NextRequest } from "next/server"
import path from "path"
import { getPayload } from "payload"

import { hasPermission } from "@/lib/payload/access"

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[/\\]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 })
  }

  const originalFilename = sanitizeFilename(file.name)
  const extension = path.extname(originalFilename)
  const basename = path.basename(originalFilename, extension)
  const storageFilename = `${basename}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`
  const uploadDir = path.resolve(process.cwd(), "public", "media")
  const bytes = Buffer.from(await file.arrayBuffer())
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: request.headers })

  if (!hasPermission(auth.user, "content.update")) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
  }

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, storageFilename), bytes)

  return NextResponse.json({
    filename: originalFilename,
    filesize: file.size,
    kind: "file",
    mimeType: file.type,
    name: formData.get("name")?.toString() || originalFilename,
    storageFilename,
    url: `/media/${encodeURIComponent(storageFilename)}`,
  })
}
