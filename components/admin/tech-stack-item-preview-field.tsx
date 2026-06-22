"use client"

import { useFormFields } from "@payloadcms/ui"

import { resolveTechStackIconUrl } from "@/lib/tech-stack-icons"

type FieldValue = {
  value?: unknown
}

type TechStackItemPreview = {
  color: string
  group: string
  icon: string
  name: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

export default function TechStackItemPreviewField() {
  const item = useFormFields<TechStackItemPreview>(([fields]) => ({
    color: getStringValue(fields, "color"),
    group: getStringValue(fields, "group"),
    icon: getStringValue(fields, "icon"),
    name: getStringValue(fields, "name"),
  }))
  const color = item.color || "#ffffff"
  const iconUrl = resolveTechStackIconUrl(item.icon)

  return (
    <div
      style={{
        background: "var(--theme-bg)",
        border: "1px solid var(--theme-elevation-150)",
        color: "var(--theme-text)",
        padding: "2rem",
      }}
    >
      <article
        style={{
          background: "var(--theme-elevation-50)",
          border: "1px solid var(--theme-elevation-150)",
          maxWidth: "18rem",
          padding: "1.25rem",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            background: color,
            height: "2px",
            marginBottom: "1.25rem",
            width: "100%",
          }}
        />
        {iconUrl && (
          <img
            alt=""
            src={iconUrl}
            style={{
              filter: "brightness(0) invert(1)",
              height: "2rem",
              marginBottom: "1rem",
              objectFit: "contain",
              opacity: 0.72,
              width: "2rem",
            }}
          />
        )}
        <p
          style={{
            color: "var(--theme-elevation-600)",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            margin: "0 0 0.5rem",
            textTransform: "uppercase",
          }}
        >
          {item.group || "group"} / {item.icon || "icon"}
        </p>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: 0,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {item.name || "Stack item"}
        </h3>
      </article>
    </div>
  )
}
