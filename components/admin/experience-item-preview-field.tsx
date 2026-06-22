"use client"

import { useFormFields } from "@payloadcms/ui"

type FieldValue = {
  value?: unknown
}

type ExperienceItemPreview = {
  company: string
  description: string
  period: string
  role: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

export default function ExperienceItemPreviewField() {
  const item = useFormFields<ExperienceItemPreview>(([fields]) => ({
    company: getStringValue(fields, "company"),
    description: getStringValue(fields, "description"),
    period: getStringValue(fields, "period"),
    role: getStringValue(fields, "role"),
  }))

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
          borderLeft: "1px solid var(--theme-elevation-150)",
          maxWidth: "42rem",
          paddingLeft: "1.25rem",
        }}
      >
        <p
          style={{
            color: "var(--theme-elevation-650)",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            margin: "0 0 0.5rem",
            textTransform: "uppercase",
          }}
        >
          {item.company || "Company"} / {item.period || "Period"}
        </p>
        <h3
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {item.role || "Role"}
        </h3>
        <p
          style={{
            color: "var(--theme-elevation-650)",
            fontSize: "1rem",
            lineHeight: 1.75,
            margin: "1rem 0 0",
          }}
        >
          {item.description || "Experience description"}
        </p>
      </article>
    </div>
  )
}
