type GitBookTag = {
  attrs: string
  closing: boolean
  name: string
}

const gitBookTagPattern = /^\s*{%\s*(end)?([a-zA-Z][\w-]*)([^%]*)%}\s*$/
const blockTags = new Set(["hint", "stepper", "step", "tabs", "tab"])

function parseTag(line: string): GitBookTag | null {
  const match = line.match(gitBookTagPattern)

  if (!match) {
    return null
  }

  return {
    attrs: match[3]?.trim() || "",
    closing: Boolean(match[1]),
    name: match[2] || "",
  }
}

function toDirectiveAttrs(attrs: string) {
  const pairs = Array.from(attrs.matchAll(/([\w-]+)=["']([^"']*)["']/g))

  if (pairs.length === 0) {
    return ""
  }

  return `{${pairs.map((pair) => `${pair[1]}=${JSON.stringify(pair[2])}`).join(" ")}}`
}

export function gitBookToDirectiveMarkdown(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const tag = parseTag(line)

      if (!tag || !blockTags.has(tag.name)) {
        return line
      }

      if (tag.closing) {
        return ":::"
      }

      return `:::${tag.name}${toDirectiveAttrs(tag.attrs)}`
    })
    .join("\n")
}
