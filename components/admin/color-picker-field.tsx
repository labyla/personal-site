"use client"

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui"

type ColorPickerFieldProps = {
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

const hexColorPattern = /^#[0-9a-f]{6}$/i

function toPickerValue(value: string) {
  return hexColorPattern.test(value) ? value : "#ffffff"
}

export default function ColorPickerField({
  field,
  path,
  readOnly,
}: ColorPickerFieldProps) {
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const stringValue = typeof value === "string" ? value : ""
  const disabled = readOnly || field.admin?.readOnly

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

      <div style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
        <input
          aria-label={`${field.name} color picker`}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          style={{ height: "2.5rem", padding: 0, width: "3rem" }}
          type="color"
          value={toPickerValue(stringValue)}
        />
        <input
          aria-invalid={showError}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          placeholder="#61dafb"
          style={{ width: "100%" }}
          value={stringValue}
        />
      </div>

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
