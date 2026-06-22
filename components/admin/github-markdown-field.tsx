"use client"

import type { KeyboardEvent } from "react"
import { useMemo, useRef, useState } from "react"
import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui"

import { RichText } from "@/components/rich-text"

import LocalMediaPicker from "./local-media-picker"

type MarkdownCommand = {
  label: string
  hint: string
  keywords: string[]
  template: string
}

type GitHubMarkdownFieldProps = {
  field: {
    admin?: {
      description?: string
      placeholder?: string
      readOnly?: boolean
      rows?: number
    }
    label?: false | string
    localized?: boolean
    name: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

type SlashState = {
  end: number
  query: string
  start: number
}

type LocalMediaState = {
  end: number
  start: number
}

const commands: MarkdownCommand[] = [
  {
    label: "Heading 1",
    hint: "# Title",
    keywords: ["h1", "title"],
    template: "# Heading\n\n",
  },
  {
    label: "Heading 2",
    hint: "## Section",
    keywords: ["h2", "section"],
    template: "## Heading\n\n",
  },
  {
    label: "Bulleted list",
    hint: "- Item",
    keywords: ["ul", "list"],
    template: "- Item\n- Item\n",
  },
  {
    label: "Numbered list",
    hint: "1. Item",
    keywords: ["ol", "list"],
    template: "1. Item\n2. Item\n",
  },
  {
    label: "Task list",
    hint: "- [ ] Todo",
    keywords: ["todo", "check", "task"],
    template: "- [ ] Task\n- [x] Done\n",
  },
  {
    label: "Quote",
    hint: "> Quote",
    keywords: ["blockquote"],
    template: "> Quote\n\n",
  },
  {
    label: "Code block",
    hint: "```ts",
    keywords: ["code", "fence"],
    template: "```ts\n// code\n```\n\n",
  },
  {
    label: "Link",
    hint: "[Label](url)",
    keywords: ["url", "anchor"],
    template: "[Link label](https://example.com)",
  },
  {
    label: "Image",
    hint: "![Alt](url)",
    keywords: ["media", "screenshot"],
    template: "![Alt text](https://example.com/image.png)\n\n",
  },
  {
    label: "Local media",
    hint: "local:/path/file",
    keywords: ["image", "video", "file", "asset"],
    template: "local:",
  },
  {
    label: "Note alert",
    hint: "> [!NOTE]",
    keywords: ["callout", "alert"],
    template: "> [!NOTE]\n> Helpful context.\n\n",
  },
  {
    label: "Warning alert",
    hint: "> [!WARNING]",
    keywords: ["callout", "alert"],
    template: "> [!WARNING]\n> Important risk.\n\n",
  },
  {
    label: "Table",
    hint: "| Column |",
    keywords: ["grid"],
    template: "| Column | Column |\n| --- | --- |\n| Value | Value |\n\n",
  },
]

function getSlashState(textarea: HTMLTextAreaElement): SlashState | null {
  const end = textarea.selectionStart
  const lineStart = textarea.value.lastIndexOf("\n", end - 1) + 1
  const line = textarea.value.slice(lineStart, end)
  const match = line.match(/^\/([a-z0-9 -]*)$/i)

  if (!match) {
    return null
  }

  return {
    end,
    query: match[1].trim().toLowerCase(),
    start: lineStart,
  }
}

function matchesCommand(command: MarkdownCommand, query: string) {
  if (!query) {
    return true
  }

  return [command.label, command.hint, ...command.keywords]
    .join(" ")
    .toLowerCase()
    .includes(query)
}

function slashStatesMatch(a: SlashState | null, b: SlashState | null) {
  return a?.start === b?.start && a?.end === b?.end && a?.query === b?.query
}

function getLocalMediaState(textarea: HTMLTextAreaElement): LocalMediaState | null {
  const end = textarea.selectionStart
  const beforeCaret = textarea.value.slice(0, end)
  const match = beforeCaret.match(/(^|[\s("'([])(local:[^\s)"'\]]*)$/i)

  if (!match) {
    return null
  }

  return {
    end,
    start: end - match[2].length,
  }
}

export default function GitHubMarkdownField({
  field,
  path,
  readOnly,
}: GitHubMarkdownFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [slashState, setSlashState] = useState<SlashState | null>(null)
  const [localMediaState, setLocalMediaState] = useState<LocalMediaState | null>(null)
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)

  const markdown = typeof value === "string" ? value : ""
  const disabled = readOnly || field.admin?.readOnly
  const filteredCommands = useMemo(
    () => commands.filter((command) => matchesCommand(command, slashState?.query || "")),
    [slashState],
  )

  function updateSlashState() {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    const nextSlashState = getSlashState(textarea)

    setSlashState((previousSlashState) => {
      if (!slashStatesMatch(previousSlashState, nextSlashState)) {
        setActiveCommandIndex(0)
      }

      return nextSlashState
    })
  }

  function updateLocalMediaState() {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    setLocalMediaState(getLocalMediaState(textarea))
  }

  function handleChange(nextValue: string) {
    setValue(nextValue)
    requestAnimationFrame(() => {
      updateSlashState()
      updateLocalMediaState()
    })
  }

  function insertCommand(command: MarkdownCommand) {
    const textarea = textareaRef.current

    if (!textarea || !slashState) {
      return
    }

    const nextValue =
      markdown.slice(0, slashState.start) + command.template + markdown.slice(slashState.end)
    const nextCaretPosition = slashState.start + command.template.length

    setValue(nextValue)
    setSlashState(null)
    textarea.focus()
    requestAnimationFrame(() => {
      textarea.setSelectionRange(nextCaretPosition, nextCaretPosition)
      updateLocalMediaState()
    })
  }

  function insertLocalMediaReference(nextReference: string) {
    const textarea = textareaRef.current
    const targetState = localMediaState || (textarea ? getLocalMediaState(textarea) : null)

    if (!textarea || !targetState) {
      return
    }

    const nextValue =
      markdown.slice(0, targetState.start) + nextReference + markdown.slice(targetState.end)
    const nextCaretPosition = targetState.start + nextReference.length

    setValue(nextValue)
    setLocalMediaState(null)
    textarea.focus()
    requestAnimationFrame(() => {
      textarea.setSelectionRange(nextCaretPosition, nextCaretPosition)
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!slashState || filteredCommands.length === 0) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveCommandIndex((index) => (index + 1) % filteredCommands.length)
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveCommandIndex(
        (index) => (index - 1 + filteredCommands.length) % filteredCommands.length,
      )
    }

    if (event.key === "Enter") {
      event.preventDefault()
      insertCommand(filteredCommands[activeCommandIndex])
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setSlashState(null)
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) {
      return
    }

    updateSlashState()
    updateLocalMediaState()
  }

  return (
    <div className="field-type textarea markdown-field">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "0.75rem",
          justifyContent: "space-between",
        }}
      >
        <FieldLabel
          label={field.label === false ? undefined : field.label || field.name}
          localized={field.localized}
          path={path}
          required={field.required}
        />

        <div
          aria-label="Markdown editor mode"
          role="tablist"
          style={{
            border: "1px solid var(--theme-elevation-150)",
            display: "inline-flex",
          }}
        >
          {(["edit", "preview"] as const).map((nextMode) => (
            <button
              aria-selected={mode === nextMode}
              key={nextMode}
              onClick={() => setMode(nextMode)}
              role="tab"
              style={{
                background:
                  mode === nextMode ? "var(--theme-elevation-150)" : "var(--theme-bg)",
                border: 0,
                color: "var(--theme-text)",
                cursor: "pointer",
                padding: "0.45rem 0.7rem",
                textTransform: "capitalize",
              }}
              type="button"
            >
              {nextMode}
            </button>
          ))}
        </div>
      </div>

      {field.admin?.description && (
        <FieldDescription description={field.admin.description} path={path} />
      )}

      {mode === "edit" ? (
        <div style={{ position: "relative" }}>
          <textarea
            aria-invalid={showError}
            disabled={disabled}
            onBlur={() => setTimeout(() => setSlashState(null), 140)}
            onChange={(event) => handleChange(event.target.value)}
            onClick={() => {
              updateSlashState()
              updateLocalMediaState()
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={field.admin?.placeholder || "Paste a README.md or write GitHub Markdown..."}
            ref={textareaRef}
            rows={field.admin?.rows || 24}
            style={{
              background: "var(--theme-input-bg)",
              border: "1px solid var(--theme-elevation-150)",
              color: "var(--theme-text)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              minHeight: "26rem",
              padding: "1rem",
              resize: "vertical",
              width: "100%",
            }}
            value={markdown}
          />

          <LocalMediaPicker
            onClose={() => setLocalMediaState(null)}
            onSelect={insertLocalMediaReference}
            open={Boolean(localMediaState)}
          />

          {slashState && filteredCommands.length > 0 && (
            <div
              style={{
                background: "var(--theme-bg)",
                border: "1px solid var(--theme-elevation-150)",
                boxShadow: "0 12px 36px rgb(0 0 0 / 0.18)",
                left: 0,
                maxWidth: "34rem",
                padding: "0.35rem",
                position: "absolute",
                top: "2.75rem",
                width: "100%",
                zIndex: 10,
              }}
            >
              {filteredCommands.map((command, index) => (
                <button
                  key={command.label}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    insertCommand(command)
                  }}
                  style={{
                    alignItems: "center",
                    background:
                      index === activeCommandIndex
                        ? "var(--theme-elevation-150)"
                        : "transparent",
                    border: 0,
                    color: "var(--theme-text)",
                    cursor: "pointer",
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.7rem",
                    textAlign: "left",
                    width: "100%",
                  }}
                  type="button"
                >
                  <span>{command.label}</span>
                  <code style={{ color: "var(--theme-elevation-600)" }}>{command.hint}</code>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className="payload-markdown-preview"
          style={{
            border: "1px solid var(--theme-elevation-150)",
            minHeight: "26rem",
            padding: "1rem",
          }}
        >
          {markdown.trim() ? (
            <RichText data={markdown} />
          ) : (
            <p style={{ color: "var(--theme-elevation-500)", margin: 0 }}>
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}

      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
