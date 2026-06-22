"use client"

import { useState, type ChangeEvent } from "react"
import { FieldDescription, FieldLabel, useField } from "@payloadcms/ui"

type MediaUploadFieldProps = {
  field: {
    admin?: {
      description?: string
    }
    label?: false | string
    localized?: boolean
    name: string
  }
  path: string
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

export default function MediaUploadField({ field, path }: MediaUploadFieldProps) {
  const kind = useField<"file" | "folder">({ path: "kind" })
  const name = useField<string>({ path: "name" })
  const filename = useField<string>({ path: "filename" })
  const storageFilename = useField<string>({ path: "storageFilename" })
  const url = useField<string>({ path: "url" })
  const mimeType = useField<string>({ path: "mimeType" })
  const filesize = useField<number>({ path: "filesize" })
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", file.name)

      const response = await fetch("/api/local-media/upload", {
        body: formData,
        credentials: "same-origin",
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const upload = (await response.json()) as UploadResponse

      kind.setValue(upload.kind)
      name.setValue(name.value || upload.name)
      filename.setValue(upload.filename)
      storageFilename.setValue(upload.storageFilename)
      url.setValue(upload.url)
      mimeType.setValue(upload.mimeType)
      filesize.setValue(upload.filesize)
      setMessage("Uploaded. Save this media item to keep it in the library.")
      event.target.value = ""
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="field-type upload" style={{ display: "grid", gap: "0.5rem" }}>
      <FieldLabel
        label={field.label === false ? undefined : field.label || field.name}
        localized={field.localized}
        path={path}
      />

      <FieldDescription
        description="Upload a file here, then save this Media entry. URL fields elsewhere can only choose already-saved media."
        path={path}
      />

      <label
        style={{
          border: "1px solid var(--theme-elevation-150)",
          cursor: "pointer",
          display: "inline-flex",
          padding: "0.55rem 0.75rem",
          width: "fit-content",
        }}
      >
        {isUploading ? "Uploading..." : "Upload file"}
        <input
          accept="image/*,video/*,audio/*,.gif,.webp,.svg,.pdf"
          disabled={isUploading}
          onChange={(event) => void uploadFile(event)}
          style={{ display: "none" }}
          type="file"
        />
      </label>

      {message && (
        <p style={{ color: "var(--theme-elevation-600)", margin: 0 }}>{message}</p>
      )}

      {url.value && (
        <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>
          Current file: {filename.value || url.value}
        </p>
      )}
    </div>
  )
}
