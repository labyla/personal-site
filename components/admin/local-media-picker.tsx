"use client"

import { useEffect, useMemo, useState } from "react"

import { toLocalMediaReference } from "@/lib/media"

type MediaEntry = {
  id: number | string
  filename?: string | null
  kind?: "file" | "folder" | null
  mimeType?: string | null
  name?: string | null
  parent?: number | string | { id?: number | string } | null
  path?: string | null
}

type LocalMediaPickerProps = {
  onClose: () => void
  onSelect: (value: string) => void
  open: boolean
}

function getRelationId(value: MediaEntry["parent"]) {
  if (!value) {
    return null
  }

  if (typeof value === "object") {
    return value.id ? String(value.id) : null
  }

  return String(value)
}

async function getMediaEntries() {
  const response = await fetch("/api/media?depth=0&limit=300&sort=path", {
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("Failed to load media")
  }

  return (await response.json()) as { docs: MediaEntry[] }
}

export default function LocalMediaPicker({
  onClose,
  onSelect,
  open,
}: LocalMediaPickerProps) {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentFolder = entries.find((entry) => String(entry.id) === currentFolderId)
  const childEntries = entries.filter((entry) => getRelationId(entry.parent) === currentFolderId)
  const childFolders = childEntries.filter((entry) => entry.kind === "folder")
  const childFiles = childEntries.filter((entry) => entry.kind !== "folder")

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
    if (open) {
      void refresh()
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div
      style={{
        background: "var(--theme-bg)",
        border: "1px solid var(--theme-elevation-150)",
        boxShadow: "0 16px 42px rgb(0 0 0 / 0.24)",
        left: 0,
        marginTop: "0.35rem",
        maxWidth: "46rem",
        padding: "0.75rem",
        position: "absolute",
        right: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "0.5rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
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

        <button onClick={onClose} type="button">
          Close
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "0.75rem",
        }}
      >
        <button disabled={isLoading} onClick={() => void refresh()} type="button">
          Refresh
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--theme-error-500)", margin: "0.7rem 0 0" }}>{error}</p>
      )}

      <div
        style={{
          border: "1px solid var(--theme-elevation-100)",
          display: "grid",
          gap: "0.35rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
          marginTop: "0.75rem",
          maxHeight: "18rem",
          overflow: "auto",
          padding: "0.5rem",
        }}
      >
        {currentFolderId && (
          <button
            onClick={() => setCurrentFolderId(getRelationId(currentFolder?.parent) || null)}
            style={{ textAlign: "left" }}
            type="button"
          >
            ../
          </button>
        )}

        {childFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setCurrentFolderId(String(folder.id))}
            style={{ textAlign: "left" }}
            type="button"
          >
            [Folder] {folder.name}
          </button>
        ))}

        {childFiles.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(toLocalMediaReference(item.path))}
            style={{ textAlign: "left" }}
            type="button"
          >
            <span style={{ display: "block" }}>{item.name || item.filename}</span>
            <small style={{ color: "var(--theme-elevation-600)" }}>{item.path}</small>
          </button>
        ))}

        {!isLoading && childEntries.length === 0 && (
          <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>Empty folder.</p>
        )}

        {isLoading && (
          <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>Loading...</p>
        )}
      </div>
    </div>
  )
}
