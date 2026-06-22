"use client"

import type { ReactNode } from "react"
import { useFormFields } from "@payloadcms/ui"

type FieldValue = {
  value?: unknown
}

type Row = Record<string, string>

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getStringValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "string" ? value : ""
}

function getBooleanValue(fields: Record<string, FieldValue>, path: string) {
  const value = fields[path]?.value

  return typeof value === "boolean" ? value : false
}

function getRows(fields: Record<string, FieldValue>, prefix: string, keys: string[]) {
  const rows = new Map<number, Row>()
  const pattern = new RegExp(`^${escapeRegExp(prefix)}\\.(\\d+)\\.(${keys.join("|")})$`)

  Object.entries(fields).forEach(([path, field]) => {
    const match = path.match(pattern)
    const value = field.value

    if (!match || typeof value !== "string") {
      return
    }

    const index = Number(match[1])
    const key = match[2]
    const row = rows.get(index) || {}

    row[key] = value
    rows.set(index, row)
  })

  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row)
}

function PreviewSection({
  eyebrow,
  title,
  children,
}: {
  children: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <section style={{ borderTop: "1px solid var(--theme-elevation-150)", padding: "2rem 0" }}>
      <p
        style={{
          color: "var(--theme-elevation-600)",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          margin: "0 0 0.75rem",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
          fontWeight: 700,
          letterSpacing: 0,
          lineHeight: 0.95,
          margin: "0 0 1.25rem",
          textTransform: "uppercase",
        }}
      >
        {title || "Untitled section"}
      </h2>
      {children}
    </section>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        border: "1px solid var(--theme-elevation-150)",
        color: "var(--theme-elevation-650)",
        display: "inline-flex",
        fontSize: "0.72rem",
        fontWeight: 600,
        padding: "0.35rem 0.65rem",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  )
}

export default function HomePagePreviewField() {
  const home = useFormFields(([fields]) => ({
    about: {
      eyebrow: getStringValue(fields, "about.eyebrow"),
      imageUrl: getStringValue(fields, "about.imageUrl"),
      paragraphs: getRows(fields, "about.paragraphs", ["text"]).map((row) => row.text),
      titleMuted: getStringValue(fields, "about.titleMuted"),
      titlePrefix: getStringValue(fields, "about.titlePrefix"),
    },
    bento: {
      buildEyebrow: getStringValue(fields, "bento.buildEyebrow"),
      buildText: getStringValue(fields, "bento.buildText"),
      experienceEyebrow: getStringValue(fields, "bento.experienceEyebrow"),
      experienceValue: getStringValue(fields, "bento.experienceValue"),
      projectsEyebrow: getStringValue(fields, "bento.projectsEyebrow"),
      projectsText: getStringValue(fields, "bento.projectsText"),
      projectsValue: getStringValue(fields, "bento.projectsValue"),
      stackEyebrow: getStringValue(fields, "bento.stackEyebrow"),
      stackHref: getStringValue(fields, "bento.stackHref"),
      stackTags: getRows(fields, "bento.stackTags", ["label"]).map((row) => row.label),
      stackText: getStringValue(fields, "bento.stackText"),
      workflowEyebrow: getStringValue(fields, "bento.workflowEyebrow"),
      workflowText: getStringValue(fields, "bento.workflowText"),
    },
    contact: {
      description: getStringValue(fields, "contact.description"),
      eyebrow: getStringValue(fields, "contact.eyebrow"),
      submitLabel: getStringValue(fields, "contact.submitLabel"),
      title: getStringValue(fields, "contact.title"),
    },
    cta: {
      description: getStringValue(fields, "cta.description"),
      isEnabled: getBooleanValue(fields, "cta.isEnabled"),
      primaryCtaLabel: getStringValue(fields, "cta.primaryCtaLabel"),
      titleAccent: getStringValue(fields, "cta.titleAccent"),
      titleMiddle: getStringValue(fields, "cta.titleMiddle"),
      titlePrefix: getStringValue(fields, "cta.titlePrefix"),
      titleSuffix: getStringValue(fields, "cta.titleSuffix"),
    },
    experience: {
      eyebrow: getStringValue(fields, "experience.eyebrow"),
      title: getStringValue(fields, "experience.title"),
    },
    footer: {
      brandName: getStringValue(fields, "footer.brandName"),
      description: getStringValue(fields, "footer.description"),
      mainLinks: getRows(fields, "footer.mainLinks", ["href", "label"]),
    },
    header: {
      ctaLabel: getStringValue(fields, "header.ctaLabel"),
      logoText: getStringValue(fields, "header.logoText"),
      navLinks: getRows(fields, "header.navLinks", ["href", "label"]),
    },
    hero: {
      availabilityLabel: getStringValue(fields, "hero.availabilityLabel"),
      badgeText: getStringValue(fields, "hero.badgeText"),
      focusLabel: getStringValue(fields, "hero.focusLabel"),
      focusText: getStringValue(fields, "hero.focusText"),
      headlineAccent: getStringValue(fields, "hero.headlineAccent"),
      headlinePrefix: getStringValue(fields, "hero.headlinePrefix"),
      headlineSubline: getStringValue(fields, "hero.headlineSubline"),
      headlineSuffix: getStringValue(fields, "hero.headlineSuffix"),
      name: getStringValue(fields, "hero.name"),
      primaryCtaLabel: getStringValue(fields, "hero.primaryCtaLabel"),
      role: getStringValue(fields, "hero.role"),
      secondaryCtaLabel: getStringValue(fields, "hero.secondaryCtaLabel"),
    },
    homeBlog: {
      description: getStringValue(fields, "homeBlog.description"),
      eyebrow: getStringValue(fields, "homeBlog.eyebrow"),
      title: getStringValue(fields, "homeBlog.title"),
    },
    homeProjects: {
      eyebrow: getStringValue(fields, "homeProjects.eyebrow"),
      title: getStringValue(fields, "homeProjects.title"),
    },
    techStack: {
      description: getStringValue(fields, "techStack.description"),
      skillsEyebrow: getStringValue(fields, "techStack.skillsEyebrow"),
      skillsTitle: getStringValue(fields, "techStack.skillsTitle"),
      title: getStringValue(fields, "techStack.title"),
      toolsEyebrow: getStringValue(fields, "techStack.toolsEyebrow"),
      toolsTitle: getStringValue(fields, "techStack.toolsTitle"),
    },
    testimonialsSection: {
      eyebrow: getStringValue(fields, "testimonialsSection.eyebrow"),
      title: getStringValue(fields, "testimonialsSection.title"),
    },
  }))

  return (
    <article
      style={{
        background: "var(--theme-bg)",
        border: "1px solid var(--theme-elevation-150)",
        color: "var(--theme-text)",
        padding: "1.5rem",
      }}
    >
      <div style={{ marginInline: "auto", maxWidth: "72rem" }}>
        <header
          style={{
            alignItems: "center",
            borderBottom: "1px solid var(--theme-elevation-150)",
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
            paddingBottom: "1rem",
          }}
        >
          <strong style={{ fontSize: "1.1rem" }}>{home.header.logoText || "A"}</strong>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {home.header.navLinks.map((link) => (
              <span key={`${link.label}-${link.href}`} style={{ color: "var(--theme-elevation-650)" }}>
                {link.label}
              </span>
            ))}
          </nav>
          {home.header.ctaLabel && <Pill>{home.header.ctaLabel}</Pill>}
        </header>

        <section style={{ minHeight: "30rem", padding: "4rem 0 3rem" }}>
          <div
            style={{
              color: "var(--theme-elevation-650)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            <span>{home.hero.availabilityLabel}</span>
            <span>{home.hero.badgeText}</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(3.4rem, 9vw, 8rem)",
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 0.86,
              margin: 0,
              maxWidth: "62rem",
              textTransform: "uppercase",
            }}
          >
            {home.hero.headlinePrefix}
            <span style={{ color: "var(--theme-success-500)" }}>{home.hero.headlineAccent}</span>
            {home.hero.headlineSuffix}
            <br />
            {home.hero.headlineSubline}
          </h1>
          <p style={{ color: "var(--theme-elevation-650)", fontSize: "1.2rem", marginTop: "2rem" }}>
            {home.hero.name} / {home.hero.role}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
            {home.hero.primaryCtaLabel && <Pill>{home.hero.primaryCtaLabel}</Pill>}
            {home.hero.secondaryCtaLabel && <Pill>{home.hero.secondaryCtaLabel}</Pill>}
          </div>
          {home.hero.focusText && (
            <p
              style={{
                borderLeft: "1px solid var(--theme-elevation-150)",
                color: "var(--theme-elevation-650)",
                lineHeight: 1.7,
                marginTop: "2rem",
                maxWidth: "36rem",
                paddingLeft: "1rem",
              }}
            >
              <strong style={{ color: "var(--theme-text)" }}>{home.hero.focusLabel}</strong>{" "}
              {home.hero.focusText}
            </p>
          )}
        </section>

        <section
          style={{
            borderTop: "1px solid var(--theme-elevation-150)",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
            padding: "2rem 0",
          }}
        >
          {[
            [home.bento.buildEyebrow, home.bento.buildText],
            [home.bento.stackEyebrow, home.bento.stackText],
            [home.bento.projectsEyebrow, `${home.bento.projectsValue} ${home.bento.projectsText}`],
            [home.bento.workflowEyebrow, home.bento.workflowText],
            [home.bento.experienceEyebrow, home.bento.experienceValue],
          ].map(([eyebrow, text]) => (
            <div key={`${eyebrow}-${text}`} style={{ border: "1px solid var(--theme-elevation-150)", padding: "1rem" }}>
              <p style={{ color: "var(--theme-elevation-600)", fontSize: "0.72rem", margin: "0 0 0.6rem" }}>
                {eyebrow}
              </p>
              <p style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>{text}</p>
            </div>
          ))}
        </section>

        <PreviewSection eyebrow={home.experience.eyebrow} title={home.experience.title}>
          <p style={{ color: "var(--theme-elevation-650)", margin: 0 }}>
            Published experience items from the Experience Items collection appear here.
          </p>
        </PreviewSection>

        <PreviewSection eyebrow={home.homeProjects.eyebrow} title={home.homeProjects.title}>
          <p style={{ color: "var(--theme-elevation-650)", margin: 0 }}>
            Featured project cards from the Projects collection appear here.
          </p>
        </PreviewSection>

        <PreviewSection eyebrow={home.homeBlog.eyebrow} title={home.homeBlog.title}>
          <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7, margin: 0 }}>
            {home.homeBlog.description}
          </p>
        </PreviewSection>

        <PreviewSection eyebrow={home.about.eyebrow} title={`${home.about.titlePrefix} ${home.about.titleMuted}`}>
          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
            <div>
              {home.about.paragraphs.map((paragraph) => (
                <p key={paragraph} style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7 }}>
                  {paragraph}
                </p>
              ))}
            </div>
            {home.about.imageUrl && (
              <img
                alt=""
                src={home.about.imageUrl}
                style={{ aspectRatio: "1 / 1", border: "1px solid var(--theme-elevation-150)", objectFit: "cover", width: "100%" }}
              />
            )}
          </div>
        </PreviewSection>

        <PreviewSection eyebrow={home.testimonialsSection.eyebrow} title={home.testimonialsSection.title}>
          <p style={{ color: "var(--theme-elevation-650)", margin: 0 }}>
            Published testimonial cards appear here.
          </p>
        </PreviewSection>

        <PreviewSection eyebrow="Stack" title={home.techStack.title}>
          <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7 }}>{home.techStack.description}</p>
          <p style={{ color: "var(--theme-elevation-650)", margin: "0 0 1rem" }}>
            Published skills and tools from the Tech Stack Items collection appear here.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Pill>
              {home.techStack.skillsEyebrow} / {home.techStack.skillsTitle}
            </Pill>
            <Pill>
              {home.techStack.toolsEyebrow} / {home.techStack.toolsTitle}
            </Pill>
          </div>
        </PreviewSection>

        {home.cta.isEnabled && (
          <PreviewSection
            eyebrow="CTA"
            title={`${home.cta.titlePrefix} ${home.cta.titleAccent} ${home.cta.titleMiddle} ${home.cta.titleSuffix}`}
          >
            <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7 }}>{home.cta.description}</p>
            {home.cta.primaryCtaLabel && <Pill>{home.cta.primaryCtaLabel}</Pill>}
          </PreviewSection>
        )}

        <PreviewSection eyebrow={home.contact.eyebrow} title={home.contact.title}>
          <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7 }}>{home.contact.description}</p>
          {home.contact.submitLabel && <Pill>{home.contact.submitLabel}</Pill>}
        </PreviewSection>

        <footer style={{ borderTop: "1px solid var(--theme-elevation-150)", paddingTop: "2rem" }}>
          <strong>{home.footer.brandName}</strong>
          <p style={{ color: "var(--theme-elevation-650)", lineHeight: 1.7 }}>{home.footer.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {home.footer.mainLinks.map((link) => (
              <Pill key={`${link.label}-${link.href}`}>{link.label}</Pill>
            ))}
          </div>
        </footer>
      </div>
    </article>
  )
}
