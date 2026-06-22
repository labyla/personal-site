"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { File, Folder, Info, Pencil, Trash2 } from "lucide-react"

type MediaEntry = {
  id: number | string
  filename?: string | null
  filesize?: number | null
  kind?: "file" | "folder" | null
  mimeType?: string | null
  name?: string | null
  parent?: number | string | { id?: number | string } | null
  path?: string | null
  storageFilename?: string | null
  url?: string | null
}

type UploadResponse = {
  filename: string
  filesize: number
  kind: "file"
  mimeType: string
  name: string
  storageFilename: string
  url: string
}

type ContextMenuState = {
  entry: MediaEntry
  x: number
  y: number
} | null

function getRelationId(value: MediaEntry["parent"]) {
  if (!value) {
    return null
  }

  if (typeof value === "object") {
    return value.id ? String(value.id) : null
  }

  return String(value)
}

function formatBytes(value: number | null | undefined) {
  if (!value) {
    return ""
  }

  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 102.4) / 10} KB`
  }

  return `${Math.round(value / 1024 / 102.4) / 10} MB`
}

function getDisplayName(entry: MediaEntry) {
  return entry.name || entry.filename || "Untitled"
}

function getExtension(value: string | null | undefined) {
  const match = value?.match(/\.([a-z0-9]+)$/i)

  return match ? match[1].toUpperCase() : ""
}

function isImage(entry: MediaEntry) {
  return Boolean(entry.mimeType?.startsWith("image/") || entry.url?.match(/\.(gif|jpe?g|png|svg|webp)$/i))
}

function isVideo(entry: MediaEntry) {
  return Boolean(entry.mimeType?.startsWith("video/") || entry.url?.match(/\.(mp4|mov|webm|m4v)$/i))
}

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._ -]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
}

function renameFilename(entry: MediaEntry, nextName: string) {
  const currentFilename = entry.filename || nextName
  const currentExtension = currentFilename.match(/\.[^.]+$/)?.[0] || ""

  if (nextName.match(/\.[^.]+$/)) {
    return slugifyName(nextName)
  }

  return `${slugifyName(nextName)}${currentExtension}`
}

async function getMediaEntries() {
  const response = await fetch("/api/media?depth=0&limit=500&sort=path", {
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("Failed to load media")
  }

  return (await response.json()) as { docs: MediaEntry[] }
}

export default function MediaManagerView() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentFolder = entries.find((entry) => String(entry.id) === currentFolderId)
  const visibleEntries = entries
    .filter((entry) => getRelationId(entry.parent) === currentFolderId)
    .toSorted((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === "folder" ? -1 : 1
      }

      return (a.name || a.filename || "").localeCompare(b.name || b.filename || "")
    })

  const breadcrumbs = useMemo(() => {
    const items: MediaEntry[] = []
    let nextFolder = currentFolder

    while (nextFolder) {
      items.unshift(nextFolder)
      const parentId = getRelationId(nextFolder.parent)
      nextFolder = entries.find((entry) => String(entry.id) === parentId)
    }

    return items
  }, [currentFolder, entries])

  async function refresh() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getMediaEntries()
      setEntries(result.docs)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to load media")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  useEffect(() => {
    function closeMenu() {
      setContextMenu(null)
    }

    window.addEventListener("click", closeMenu)
    window.addEventListener("keydown", closeMenu)

    return () => {
      window.removeEventListener("click", closeMenu)
      window.removeEventListener("keydown", closeMenu)
    }
  }, [])

  async function createFolder() {
    const name = window.prompt("Folder name")
    const trimmedName = name?.trim()

    if (!trimmedName) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/media", {
        body: JSON.stringify({
          kind: "folder",
          name: trimmedName,
          parent: currentFolderId ? Number(currentFolderId) : undefined,
        }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Folder was not created")
      }

      await refresh()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Folder was not created")
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", file.name)

      const uploadResponse = await fetch("/api/local-media/upload", {
        body: formData,
        credentials: "same-origin",
        method: "POST",
      })

      if (!uploadResponse.ok) {
        throw new Error("File was not uploaded")
      }

      const upload = (await uploadResponse.json()) as UploadResponse
      const mediaResponse = await fetch("/api/media", {
        body: JSON.stringify({
          ...upload,
          parent: currentFolderId ? Number(currentFolderId) : undefined,
        }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      if (!mediaResponse.ok) {
        throw new Error("Media item was not saved")
      }

      event.target.value = ""
      await refresh()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "File was not uploaded")
    } finally {
      setIsLoading(false)
    }
  }

  async function renameEntry(entry: MediaEntry) {
    const nextName = window.prompt("New name", getDisplayName(entry))
    const trimmedName = nextName?.trim()

    if (!trimmedName) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const body = entry.kind === "folder"
        ? {
            kind: "folder",
            name: trimmedName,
            slug: slugifyName(trimmedName),
          }
        : {
            filename: renameFilename(entry, trimmedName),
            kind: "file",
            name: trimmedName,
          }
      const response = await fetch(`/api/media/${entry.id}`, {
        body: JSON.stringify(body),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Item was not renamed")
      }

      await refresh()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Item was not renamed")
    } finally {
      setIsLoading(false)
    }
  }

  function showInfo(entry: MediaEntry) {
    window.alert([
      `Name: ${getDisplayName(entry)}`,
      `Type: ${entry.kind === "folder" ? "Folder" : "File"}`,
      `Path: ${entry.path || "-"}`,
      entry.mimeType ? `MIME: ${entry.mimeType}` : null,
      entry.filesize ? `Size: ${formatBytes(entry.filesize)}` : null,
      entry.url ? `URL: ${entry.url}` : null,
    ].filter(Boolean).join("\n"))
  }

  function getDescendants(entry: MediaEntry) {
    const descendants: MediaEntry[] = []
    const queue = [entry]

    while (queue.length > 0) {
      const nextEntry = queue.shift()

      if (!nextEntry) {
        continue
      }

      const children = entries.filter((candidate) => getRelationId(candidate.parent) === String(nextEntry.id))
      descendants.push(...children)
      queue.push(...children)
    }

    return descendants
  }

  async function deleteEntry(entry: MediaEntry) {
    const descendants = entry.kind === "folder" ? getDescendants(entry) : []
    const message = descendants.length > 0
      ? `Delete "${getDisplayName(entry)}" and ${descendants.length} nested item(s)?`
      : `Delete "${getDisplayName(entry)}"?`

    if (!window.confirm(message)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const itemsToDelete = [...descendants].reverse().concat(entry)

      for (const item of itemsToDelete) {
        const response = await fetch(`/api/media/${item.id}`, {
          credentials: "same-origin",
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Item was not deleted")
        }
      }

      await refresh()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Item was not deleted")
    } finally {
      setIsLoading(false)
    }
  }

  function renderPreview(entry: MediaEntry) {
    if (entry.kind === "folder") {
      return <Folder aria-hidden="true" size={42} strokeWidth={1.6} />
    }

    if (entry.url && isImage(entry)) {
      return (
        <img
          alt=""
          src={entry.url}
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      )
    }

    if (entry.url && isVideo(entry)) {
      return (
        <video
          muted
          playsInline
          preload="metadata"
          src={entry.url}
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      )
    }

    return (
      <span
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          justifyContent: "center",
        }}
      >
        <File aria-hidden="true" size={34} strokeWidth={1.5} />
        <span style={{ color: "var(--theme-elevation-600)", fontSize: "0.75rem" }}>
          {getExtension(entry.filename || entry.url) || "FILE"}
        </span>
      </span>
    )
  }

  return (
    <main style={{ padding: "2rem" }}>
      <header
        style={{
          alignItems: "center",
          borderBottom: "1px solid var(--theme-elevation-150)",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "space-between",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Media</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.6rem" }}>
            <button onClick={() => setCurrentFolderId(null)} type="button">
              Root
            </button>
            {breadcrumbs.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolderId(String(folder.id))}
                type="button"
              >
                {folder.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button disabled={isLoading} onClick={() => fileInputRef.current?.click()} type="button">
            Upload File
          </button>
          <button disabled={isLoading} onClick={() => void createFolder()} type="button">
            Create Folder
          </button>
          <button disabled={isLoading} onClick={() => void refresh()} type="button">
            Refresh
          </button>
          <input
            accept="image/*,video/*,audio/*,.gif,.webp,.svg,.pdf"
            onChange={(event) => void uploadFile(event)}
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
          />
        </div>
      </header>

      {error && (
        <p style={{ color: "var(--theme-error-500)", margin: "1rem 0 0" }}>{error}</p>
      )}

      <section
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
          marginTop: "1rem",
        }}
      >
        {currentFolderId && (
          <button
            onDoubleClick={() => setCurrentFolderId(getRelationId(currentFolder?.parent) || null)}
            onClick={() => setCurrentFolderId(getRelationId(currentFolder?.parent) || null)}
            style={{
              minHeight: "7rem",
              padding: "1rem",
              textAlign: "left",
            }}
            type="button"
          >
            <strong>../</strong>
            <span style={{ display: "block", marginTop: "0.4rem" }}>Parent folder</span>
          </button>
        )}

        {visibleEntries.map((entry) => {
          const isFolder = entry.kind === "folder"
          const isHovered = hoveredEntryId === String(entry.id)

          return (
            <button
              key={entry.id}
              onContextMenu={(event) => {
                event.preventDefault()
                setContextMenu({
                  entry,
                  x: event.clientX,
                  y: event.clientY,
                })
              }}
              onDoubleClick={() => {
                if (isFolder) {
                  setCurrentFolderId(String(entry.id))
                  return
                }

                if (entry.url) {
                  window.open(entry.url, "_blank", "noopener,noreferrer")
                }
              }}
              onMouseEnter={() => setHoveredEntryId(String(entry.id))}
              onMouseLeave={() => setHoveredEntryId(null)}
              style={{
                background: isHovered ? "var(--theme-elevation-100)" : "var(--theme-bg)",
                border: "1px solid var(--theme-elevation-150)",
                color: "var(--theme-text)",
                cursor: "default",
                minHeight: "12rem",
                padding: "1rem",
                textAlign: "left",
                transition: "background 120ms ease, border-color 120ms ease",
              }}
              type="button"
            >
              <span
                style={{
                  alignItems: "center",
                  background: isFolder ? "var(--theme-elevation-100)" : "var(--theme-elevation-50)",
                  border: "1px solid var(--theme-elevation-150)",
                  display: "flex",
                  height: "6.25rem",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                {renderPreview(entry)}
              </span>

              <strong>{getDisplayName(entry)}</strong>
              <span
                style={{
                  color: "var(--theme-elevation-600)",
                  display: "block",
                  marginTop: "0.45rem",
                }}
              >
                {entry.path}
              </span>
              {!isFolder && (
                <span
                  style={{
                    color: "var(--theme-elevation-500)",
                    display: "block",
                    marginTop: "0.45rem",
                  }}
                >
                  {[entry.mimeType, formatBytes(entry.filesize)].filter(Boolean).join(" · ")}
                </span>
              )}
            </button>
          )
        })}

        {!isLoading && visibleEntries.length === 0 && !currentFolderId && (
          <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>
            No media in this folder.
          </p>
        )}

        {isLoading && (
          <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>Loading...</p>
        )}
      </section>

      {contextMenu && (
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            background: "var(--theme-bg)",
            border: "1px solid var(--theme-elevation-150)",
            boxShadow: "0 14px 34px rgb(0 0 0 / 0.22)",
            left: contextMenu.x,
            minWidth: "12rem",
            padding: "0.35rem",
            position: "fixed",
            top: contextMenu.y,
            zIndex: 50,
          }}
        >
          {[
            {
              icon: <Pencil aria-hidden="true" size={16} />,
              label: "Rename",
              onClick: () => void renameEntry(contextMenu.entry),
            },
            {
              icon: <Info aria-hidden="true" size={16} />,
              label: "Info",
              onClick: () => showInfo(contextMenu.entry),
            },
            {
              icon: <Trash2 aria-hidden="true" size={16} />,
              label: "Delete",
              onClick: () => void deleteEntry(contextMenu.entry),
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setContextMenu(null)
                item.onClick()
              }}
              style={{
                alignItems: "center",
                background: "transparent",
                border: 0,
                color: "var(--theme-text)",
                cursor: "pointer",
                display: "flex",
                gap: "0.55rem",
                padding: "0.55rem 0.65rem",
                textAlign: "left",
                width: "100%",
              }}
              type="button"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
