"use client"

import { useMemo } from "react"
import { useFormFields } from "@payloadcms/ui"

import { RichText } from "@/components/rich-text"

type FieldValue = {
  value?: unknown
}

type PostPreview = {
  content: string
  coverImageUrl: string
  excerpt: string
  publishedAt: string
  readingTime: string
  title: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
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

export default function PostPreviewField() {
  const post = useFormFields<PostPreview>(([fields]) => ({
    content: getStringValue(fields, "content"),
    coverImageUrl: getStringValue(fields, "coverImageUrl"),
    excerpt: getStringValue(fields, "excerpt"),
    publishedAt: getStringValue(fields, "publishedAt"),
    readingTime: getStringValue(fields, "readingTime"),
    title: getStringValue(fields, "title"),
  }))

  const publishedAt = useMemo(() => formatDate(post.publishedAt), [post.publishedAt])

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
            <span>Article</span>
            <span
              aria-hidden="true"
              style={{ background: "var(--theme-elevation-150)", height: 1, width: "2rem" }}
            />
            {publishedAt && <time dateTime={post.publishedAt}>{publishedAt}</time>}
            {publishedAt && post.readingTime && <span style={{ opacity: 0.6 }}>/</span>}
            {post.readingTime && <span>{post.readingTime}</span>}
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
            {post.title || "Untitled article"}
          </h1>

          {post.excerpt && (
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
              {post.excerpt}
            </p>
          )}
        </header>

        {post.coverImageUrl && (
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
              src={post.coverImageUrl}
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
          {post.content ? (
            <RichText data={post.content} />
          ) : (
            <p style={{ color: "var(--theme-elevation-600)", margin: 0 }}>
              Article is being prepared.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
