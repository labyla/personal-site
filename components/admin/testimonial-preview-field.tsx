"use client"

import { Quote, Star } from "lucide-react"
import { useFormFields } from "@payloadcms/ui"

type FieldValue = {
  value?: unknown
}

type TestimonialPreview = {
  avatarUrl: string
  name: string
  quote: string
  rating: number
  role: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

function getNumberValue(fields: Record<string, FieldValue>, path: string, fallback: number) {
  const value = fields[path]?.value

  return typeof value === "number" ? value : fallback
}

export default function TestimonialPreviewField() {
  const testimonial = useFormFields<TestimonialPreview>(([fields]) => ({
    avatarUrl: getStringValue(fields, "avatarUrl"),
    name: getStringValue(fields, "name"),
    quote: getStringValue(fields, "quote"),
    rating: getNumberValue(fields, "rating", 5),
    role: getStringValue(fields, "role"),
  }))
  const rating = Math.max(1, Math.min(5, Math.round(testimonial.rating || 5)))

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
          maxWidth: "25rem",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: rating }).map((_, index) => (
              <Star
                aria-hidden="true"
                fill="var(--theme-success-500)"
                key={index}
                size={14}
                stroke="var(--theme-success-500)"
              />
            ))}
          </div>
          <Quote aria-hidden="true" color="var(--theme-elevation-300)" size={28} />
        </div>

        <p
          style={{
            color: "var(--theme-elevation-650)",
            fontSize: "1rem",
            lineHeight: 1.75,
            margin: 0,
            minHeight: "8rem",
          }}
        >
          {testimonial.quote || "Testimonial quote"}
        </p>

        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid var(--theme-elevation-150)",
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
          }}
        >
          <div
            style={{
              background: "var(--theme-elevation-100)",
              border: "1px solid var(--theme-elevation-150)",
              flexShrink: 0,
              height: "2.5rem",
              overflow: "hidden",
              width: "2.5rem",
            }}
          >
            {testimonial.avatarUrl && (
              <img
                alt=""
                src={testimonial.avatarUrl}
                style={{ height: "100%", objectFit: "cover", width: "100%" }}
              />
            )}
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>
              {testimonial.name || "Name"}
            </p>
            <p
              style={{
                color: "var(--theme-elevation-600)",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                margin: "0.25rem 0 0",
                textTransform: "uppercase",
              }}
            >
              {testimonial.role || "Role"}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
