"use client"

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui"

type ReadingTimeFieldProps = {
  field: {
    admin?: {
      description?: string
      readOnly?: boolean
    }
    label?: false | string
    localized?: boolean
    name: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

function parseMinutes(value: string) {
  const match = value.match(/\d+/)

  return match ? match[0] : ""
}

function formatReadingTime(minutes: string) {
  if (!minutes) {
    return ""
  }

  return `${Number(minutes)} min read`
}

export default function ReadingTimeField({ field, path, readOnly }: ReadingTimeFieldProps) {
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const savedValue = typeof value === "string" ? value : ""
  const minutes = parseMinutes(savedValue)
  const previewValue = formatReadingTime(minutes)
  const disabled = readOnly || field.admin?.readOnly

  function handleChange(nextValue: string) {
    setValue(formatReadingTime(nextValue))
  }

  return (
    <div className="field-type text">
      <FieldLabel
        label={field.label === false ? undefined : field.label || field.name}
        localized={field.localized}
        path={path}
        required={field.required}
      />

      {field.admin?.description && (
        <FieldDescription description={field.admin.description} path={path} />
      )}

      <div style={{ display: "grid", gap: "0.5rem", maxWidth: "22rem" }}>
        <input
          aria-invalid={showError}
          disabled={disabled}
          inputMode="numeric"
          min="1"
          onChange={(event) => handleChange(event.target.value)}
          placeholder="6"
          style={{
            background: "var(--theme-input-bg)",
            border: "1px solid var(--theme-elevation-150)",
            color: "var(--theme-text)",
            padding: "0.75rem",
            width: "100%",
          }}
          type="number"
          value={minutes}
        />

        <p style={{ color: "var(--theme-elevation-600)", fontSize: "0.875rem", margin: 0 }}>
          Site display: {previewValue || "not shown"}
        </p>
      </div>

      {savedValue && savedValue !== previewValue && (
        <p
          style={{
            color: "var(--theme-elevation-500)",
            fontSize: "0.875rem",
            margin: "0.5rem 0 0",
          }}
        >
          Current saved value: {savedValue}
        </p>
      )}

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
