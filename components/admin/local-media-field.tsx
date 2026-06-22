"use client"

import { useState } from "react"
import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui"

import { isLocalMediaReference } from "@/lib/media"

import LocalMediaPicker from "./local-media-picker"

type LocalMediaFieldProps = {
  field: {
    admin?: {
      description?: string
      placeholder?: string
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

export default function LocalMediaField({
  field,
  path,
  readOnly,
}: LocalMediaFieldProps) {
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const [pickerOpen, setPickerOpen] = useState(false)
  const stringValue = typeof value === "string" ? value : ""
  const disabled = readOnly || field.admin?.readOnly

  function handleValueChange(nextValue: string) {
    setValue(nextValue)

    if (isLocalMediaReference(nextValue)) {
      setPickerOpen(true)
    }
  }

  return (
    <div className="field-type text" style={{ position: "relative" }}>
      <FieldLabel
        label={field.label === false ? undefined : field.label || field.name}
        localized={field.localized}
        path={path}
        required={field.required}
      />

      {field.admin?.description && (
        <FieldDescription description={field.admin.description} path={path} />
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          aria-invalid={showError}
          disabled={disabled}
          onChange={(event) => handleValueChange(event.target.value)}
          onFocus={() => {
            if (isLocalMediaReference(stringValue)) {
              setPickerOpen(true)
            }
          }}
          placeholder={field.admin?.placeholder || "https://... or local:"}
          style={{ width: "100%" }}
          value={stringValue}
        />
        <button disabled={disabled} onClick={() => setPickerOpen(true)} type="button">
          Browse
        </button>
      </div>

      <LocalMediaPicker
        onClose={() => setPickerOpen(false)}
        onSelect={(nextValue) => {
          setValue(nextValue)
          setPickerOpen(false)
        }}
        open={pickerOpen}
      />

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
