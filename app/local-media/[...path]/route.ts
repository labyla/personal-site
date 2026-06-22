import config from "@payload-config"
import { NextResponse, type NextRequest } from "next/server"
import { getPayload } from "payload"

type RouteContext = {
  params: Promise<{
    path?: string[]
  }>
}

type LocalMediaDocument = {
  filename?: string | null
  storageFilename?: string | null
  url?: string | null
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const localPath = `/${(params.path || []).join("/")}`

  if (localPath === "/") {
    return NextResponse.json({ message: "Media path is required." }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      path: {
        equals: localPath,
      },
    },
  })
  const media = result.docs[0] as LocalMediaDocument | undefined

  if (!media?.filename && !media?.url) {
    return NextResponse.json({ message: "Media not found." }, { status: 404 })
  }

  const publicUrl = media.url || (
    media.storageFilename ? `/media/${encodeURIComponent(media.storageFilename)}` : null
  )

  return NextResponse.redirect(new URL(publicUrl || "/", request.url))
}
