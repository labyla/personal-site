const LOCAL_MEDIA_PREFIX = "local:"
const LOCAL_MEDIA_ROUTE = "/local-media"

function normalizeLocalPath(value: string) {
  const trimmed = value.trim()
  const withoutPrefix = trimmed.startsWith(LOCAL_MEDIA_PREFIX)
    ? trimmed.slice(LOCAL_MEDIA_PREFIX.length)
    : trimmed
  const withSlash = withoutPrefix.startsWith("/") ? withoutPrefix : `/${withoutPrefix}`

  return withSlash
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/")
}

export function isLocalMediaReference(value: string | null | undefined) {
  return typeof value === "string" && value.trim().startsWith(LOCAL_MEDIA_PREFIX)
}

export function resolveMediaUrl(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  if (!isLocalMediaReference(value)) {
    return value
  }

  const localPath = normalizeLocalPath(value)

  if (!localPath) {
    return ""
  }

  return `${LOCAL_MEDIA_ROUTE}/${localPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`
}

export function toLocalMediaReference(path: string | null | undefined) {
  if (!path) {
    return ""
  }

  const localPath = normalizeLocalPath(path)

  return localPath ? `${LOCAL_MEDIA_PREFIX}/${localPath}` : ""
}
