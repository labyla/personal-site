"use client"

import { useState } from "react"
import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui"

import { MarkdownContent } from "@/components/markdown-content"

type MarkdownEditorFieldProps = {
  field: {
    admin?: {
      description?: string
    }
    label?: string
  }
  path: string
}

export function MarkdownEditorField({ field, path }: MarkdownEditorFieldProps) {
  const [mode, setMode] = useState<"preview" | "raw">("preview")
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const markdown = typeof value === "string" ? value : ""
  const activeButtonStyle = {
    background: "var(--theme-elevation-800)",
    color: "var(--theme-elevation-0)",
  }
  const inactiveButtonStyle = {
    background: "var(--theme-elevation-100)",
    color: "var(--theme-elevation-700)",
  }

  return (
    <div className="field-type textarea">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "0.75rem",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <FieldLabel label={field.label || "Content Markdown"} path={path} />
        <div
          style={{
            border: "1px solid var(--theme-elevation-200)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            style={{
              ...(mode === "preview" ? activeButtonStyle : inactiveButtonStyle),
              border: 0,
              cursor: "pointer",
              fontSize: "0.75rem",
              padding: "0.35rem 0.75rem",
              textTransform: "uppercase",
            }}
            onClick={() => setMode("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            style={{
              ...(mode === "raw" ? activeButtonStyle : inactiveButtonStyle),
              border: 0,
              borderLeft: "1px solid var(--theme-elevation-200)",
              cursor: "pointer",
              fontSize: "0.75rem",
              padding: "0.35rem 0.75rem",
              textTransform: "uppercase",
            }}
            onClick={() => setMode("raw")}
          >
            Raw
          </button>
        </div>
      </div>

      {field.admin?.description && (
        <FieldDescription description={field.admin.description} path={path} />
      )}

      <div
        style={{
          background: "var(--theme-bg)",
          border: "1px solid var(--theme-elevation-200)",
          marginTop: "0.75rem",
          overflow: "hidden",
        }}
      >
        {mode === "raw" ? (
          <textarea
            value={markdown}
            onChange={(event) => setValue(event.target.value)}
            spellCheck={false}
            style={{
              background: "transparent",
              border: 0,
              color: "var(--theme-text)",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              minHeight: "34rem",
              outline: "none",
              padding: "1rem",
              resize: "vertical",
              width: "100%",
            }}
          />
        ) : (
          <div
            style={{
              minHeight: "34rem",
              padding: "1.25rem",
            }}
          >
            {markdown.trim() ? (
              <MarkdownContent content={markdown} />
            ) : (
              <p style={{ color: "var(--theme-elevation-500)" }}>
                Markdown preview will appear here.
              </p>
            )}
          </div>
        )}
      </div>

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
