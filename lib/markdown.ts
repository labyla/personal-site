import { marked } from "marked"

type Footnote = {
  id: string
  index: number
  text: string
}

const alertLabels = {
  CAUTION: "Caution",
  IMPORTANT: "Important",
  NOTE: "Note",
  TIP: "Tip",
  WARNING: "Warning",
} as const

const allowedHtmlTags = new Set([
  "br",
  "details",
  "ins",
  "kbd",
  "s",
  "sub",
  "summary",
  "sup",
])

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("`", "&#96;")
}

function isSafeUrl(value: string) {
  const trimmed = value.trim()

  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../")
  ) {
    return true
  }

  try {
    const url = new URL(trimmed)

    return ["http:", "https:", "mailto:"].includes(url.protocol)
  } catch {
    return false
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
}

function renderAllowedHtml(value: string) {
  const trimmed = value.trim()
  const tagMatch = trimmed.match(/^<\/?([a-z][a-z0-9-]*)(?:\s*\/?)>$/i)

  if (tagMatch && allowedHtmlTags.has(tagMatch[1].toLowerCase())) {
    return trimmed
  }

  return escapeHtml(value)
}

function extractFootnotes(markdown: string) {
  const footnotes: Footnote[] = []
  const lines = markdown.split(/\r?\n/)
  const bodyLines: string[] = []

  for (const line of lines) {
    const match = line.match(/^\[\^([^\]]+)\]:\s+(.+)$/)

    if (match) {
      footnotes.push({
        id: match[1],
        index: footnotes.length + 1,
        text: match[2],
      })
      continue
    }

    bodyLines.push(line)
  }

  let body = bodyLines.join("\n")

  for (const footnote of footnotes) {
    body = body.replaceAll(`[^${footnote.id}]`, `[[FOOTNOTE_REF_${footnote.index}]]`)
  }

  return {
    body,
    footnotes,
  }
}

const renderer = new marked.Renderer()

renderer.html = ({ text }) => renderAllowedHtml(text)

renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens)
  const id = slugify(text)

  return `<h${depth} id="${escapeAttribute(id)}">${text}</h${depth}>`
}

renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens)

  if (!isSafeUrl(href)) {
    return text
  }

  const titleAttr = title ? ` title="${escapeAttribute(title)}"` : ""

  return `<a href="${escapeAttribute(href)}"${titleAttr}>${text}</a>`
}

renderer.image = ({ href, title, text }) => {
  if (!isSafeUrl(href)) {
    return escapeHtml(text)
  }

  const titleAttr = title ? ` title="${escapeAttribute(title)}"` : ""

  return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(text)}"${titleAttr}>`
}

renderer.blockquote = function ({ tokens }) {
  const body = this.parser.parse(tokens)
  const match = body.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:<br>)?\n?/i)

  if (!match) {
    return `<blockquote>${body}</blockquote>`
  }

  const type = match[1].toUpperCase() as keyof typeof alertLabels
  const className = `markdown-alert markdown-alert-${type.toLowerCase()}`
  const content = body.replace(match[0], "<p>")

  return `<div class="${className}"><p class="markdown-alert-title">${alertLabels[type]}</p>${content}</div>`
}

function renderFootnotes(footnotes: Footnote[]) {
  if (footnotes.length === 0) {
    return ""
  }

  const items = footnotes
    .map((footnote) => {
      const html = marked.parseInline(footnote.text, {
        async: false,
        gfm: true,
        renderer,
      })

      return `<li id="fn-${footnote.index}">${html} <a href="#fnref-${footnote.index}" aria-label="Back to content">Back</a></li>`
    })
    .join("")

  return `<section class="markdown-footnotes"><hr><ol>${items}</ol></section>`
}

function restoreFootnoteRefs(html: string, footnotes: Footnote[]) {
  return footnotes.reduce(
    (result, footnote) =>
      result.replaceAll(
        `[[FOOTNOTE_REF_${footnote.index}]]`,
        `<sup id="fnref-${footnote.index}"><a href="#fn-${footnote.index}">${footnote.index}</a></sup>`,
      ),
    html,
  )
}

export function renderGitHubMarkdown(markdown: string) {
  const { body, footnotes } = extractFootnotes(markdown)
  const html = marked.parse(body, {
    async: false,
    breaks: false,
    gfm: true,
    renderer,
  })

  return `${restoreFootnoteRefs(html, footnotes)}${renderFootnotes(footnotes)}`
}
