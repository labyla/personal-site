"use client"

import { useMemo } from "react"
import { useFormFields } from "@payloadcms/ui"

import { RichText } from "@/components/rich-text"

type FieldValue = {
  value?: unknown
}

type ProjectPreview = {
  content: string
  description: string
  excerpt: string
  externalUrl: string
  imageUrl: string
  publishedAt: string
  tags: string[]
  title: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

function getTagValues(fields: Record<string, FieldValue>) {
  const tags = Object.entries(fields)
    .map(([path, field]) => {
      const match = path.match(/^tags\.(\d+)\.label$/)
      const value = field.value

      if (!match || typeof value !== "string" || !value.trim()) {
        return null
      }

      return {
        index: Number(match[1]),
        label: value,
      }
    })
    .filter((tag): tag is { index: number; label: string } => Boolean(tag))

  return tags.toSorted((a, b) => a.index - b.index).map((tag) => tag.label)
}

function formatDate(value: string) {
  if (!value) {
    return ""
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default function ProjectPreviewField() {
  const project = useFormFields<ProjectPreview>(([fields]) => ({
    content: getStringValue(fields, "content"),
    description: getStringValue(fields, "description"),
    excerpt: getStringValue(fields, "excerpt"),
    externalUrl: getStringValue(fields, "externalUrl"),
    imageUrl: getStringValue(fields, "imageUrl"),
    publishedAt: getStringValue(fields, "publishedAt"),
    tags: getTagValues(fields),
    title: getStringValue(fields, "title"),
  }))

  const publishedAt = useMemo(() => formatDate(project.publishedAt), [project.publishedAt])
  const intro = project.excerpt || project.description

  return (
    <article
      style={{
        background: "var(--theme-bg)",
        border: "1px solid var(--theme-elevation-150)",
        color: "var(--theme-text)",
        padding: "2rem",
      }}
    >
      <div style={{ marginInline: "auto", maxWidth: "72rem" }}>
        <header
          style={{
            borderTop: "1px solid var(--theme-elevation-150)",
            paddingTop: "2rem",
          }}
        >
          <div
            style={{
              alignItems: "center",
              color: "var(--theme-elevation-600)",
              display: "flex",
              flexWrap: "wrap",
              fontSize: "0.75rem",
              fontWeight: 600,
              gap: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Project</span>
            <span
              aria-hidden="true"
              style={{ background: "var(--theme-elevation-150)", height: 1, width: "2rem" }}
            />
            {publishedAt && <time dateTime={project.publishedAt}>{publishedAt}</time>}
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid var(--theme-elevation-150)",
                  color: "var(--theme-elevation-600)",
                  fontSize: "0.68rem",
                  padding: "0.25rem 0.625rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 700,
              letterSpacing: 0,
              lineHeight: 0.88,
              margin: "1.75rem 0 0",
              maxWidth: "64rem",
              textTransform: "uppercase",
            }}
          >
            {project.title || "Untitled project"}
          </h1>

          {intro && (
            <p
              style={{
                borderLeft: "1px solid var(--theme-elevation-150)",
                color: "var(--theme-elevation-650)",
                fontSize: "1.125rem",
                lineHeight: 1.8,
                margin: "2rem 0 0",
                maxWidth: "48rem",
                paddingLeft: "1.25rem",
              }}
            >
              {intro}
            </p>
          )}

          {project.externalUrl && (
            <span
              style={{
                background: "var(--theme-success-500)",
                border: "1px solid var(--theme-success-500)",
                color: "var(--theme-bg)",
                display: "inline-flex",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginTop: "2rem",
                padding: "0.75rem 1.25rem",
              }}
            >
              Visit project
            </span>
          )}
        </header>

        {project.imageUrl && (
          <div
            style={{
              aspectRatio: "16 / 9",
              background: "var(--theme-elevation-100)",
              border: "1px solid var(--theme-elevation-150)",
              marginTop: "3rem",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              alt=""
              src={project.imageUrl}
              style={{ height: "100%", objectFit: "cover", width: "100%" }}
            />
          </div>
        )}

        <div
          style={{
            borderTop: "1px solid var(--theme-elevation-150)",
            margin: "3.5rem auto 0",
            maxWidth: "48rem",
            paddingTop: "2.5rem",
          }}
        >
          {project.content ? (
            <RichText data={project.content} />
          ) : (
            <p style={{ color: "var(--theme-elevation-600)", margin: 0 }}>
              Project story is being prepared.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
