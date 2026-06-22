"use client"

import type { ReactNode } from "react"
import { useFormFields } from "@payloadcms/ui"

type FieldValue = {
  value?: unknown
}

type ArchivePreviewValues = {
  backHref: string
  backLabel: string
  description: string
  eyebrow: string
  footerCtaHref: string
  footerCtaLabel: string
  title: string
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

function useArchiveValues(prefix: "blogPage" | "projectsPage") {
  return useFormFields<ArchivePreviewValues>(([fields]) => ({
    backHref: getStringValue(fields, `${prefix}.backHref`),
    backLabel: getStringValue(fields, `${prefix}.backLabel`),
    description: getStringValue(fields, `${prefix}.description`),
    eyebrow: getStringValue(fields, `${prefix}.eyebrow`),
    footerCtaHref: getStringValue(fields, `${prefix}.footerCtaHref`),
    footerCtaLabel: getStringValue(fields, `${prefix}.footerCtaLabel`),
    title: getStringValue(fields, `${prefix}.title`),
  }))
}

function ArchiveShell({
  children,
  page,
}: {
  children: ReactNode
  page: ArchivePreviewValues
}) {
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
          <span style={{ color: "var(--theme-elevation-650)", fontSize: "0.875rem" }}>
            {page.backLabel || "Back"} {page.backHref ? `-> ${page.backHref}` : ""}
          </span>
          <p
            style={{
              color: "var(--theme-elevation-600)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              margin: "2.5rem 0 1rem",
              textTransform: "uppercase",
            }}
          >
            {page.eyebrow}
          </p>
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 0.88,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {page.title || "Untitled archive"}
          </h1>
          {page.description && (
            <p
              style={{
                borderLeft: "1px solid var(--theme-elevation-150)",
                color: "var(--theme-elevation-650)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                margin: "2rem 0 0",
                maxWidth: "44rem",
                paddingLeft: "1rem",
              }}
            >
              {page.description}
            </p>
          )}
        </header>

        {children}

        {page.footerCtaLabel && (
          <footer
            style={{
              borderTop: "1px solid var(--theme-elevation-150)",
              marginTop: "3rem",
              paddingTop: "1.5rem",
            }}
          >
            <span
              style={{
                border: "1px solid var(--theme-elevation-150)",
                display: "inline-flex",
                fontWeight: 700,
                padding: "0.75rem 1rem",
              }}
            >
              {page.footerCtaLabel}
              {page.footerCtaHref ? ` -> ${page.footerCtaHref}` : ""}
            </span>
          </footer>
        )}
      </div>
    </article>
  )
}

export function ProjectsPreview() {
  const page = useArchiveValues("projectsPage")

  return (
    <ArchiveShell page={page}>
      <section style={{ display: "grid", gap: "0", marginTop: "4rem" }}>
        {["Selected interface system", "CMS-backed launch", "Product workflow"].map((title, index) => (
          <article
            key={title}
            style={{
              borderTop: "1px solid var(--theme-elevation-150)",
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "4rem minmax(0, 1fr) auto",
              padding: "1.25rem 0",
            }}
          >
            <span style={{ color: "var(--theme-elevation-600)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 style={{ fontSize: "1.45rem", margin: 0, textTransform: "uppercase" }}>
                {title}
              </h2>
              <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7, margin: "0.5rem 0 0" }}>
                Project card content from the Projects collection appears in this list.
              </p>
            </div>
            <span style={{ color: "var(--theme-success-500)", fontWeight: 700 }}>View</span>
          </article>
        ))}
      </section>
    </ArchiveShell>
  )
}

export function BlogPreview() {
  const page = useArchiveValues("blogPage")

  return (
    <ArchiveShell page={page}>
      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          marginTop: "4rem",
        }}
      >
        {["Designing durable UI", "Notes from a migration", "Shipping with a CMS"].map((title) => (
          <article
            key={title}
            style={{
              border: "1px solid var(--theme-elevation-150)",
              display: "grid",
              gap: "1rem",
              minHeight: "16rem",
              padding: "1rem",
            }}
          >
            <div style={{ background: "var(--theme-elevation-100)", minHeight: "7rem" }} />
            <div>
              <p
                style={{
                  color: "var(--theme-elevation-600)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Article / 6 min read
              </p>
              <h2 style={{ fontSize: "1.35rem", margin: "0.75rem 0 0", textTransform: "uppercase" }}>
                {title}
              </h2>
            </div>
          </article>
        ))}
      </section>
    </ArchiveShell>
  )
}
