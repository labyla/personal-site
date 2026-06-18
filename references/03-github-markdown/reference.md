# Reference 03 - GitHub Markdown

Source:
- GitHub Docs: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax

## Why this reference is relevant

This reference describes how Markdown works on GitHub and which GitHub-specific extensions are useful when writing repository documentation, README files, issues, pull requests, discussions, and comments.

GitHub Markdown is mostly regular Markdown, but GitHub adds extra behavior around:
- automatic links and references;
- task lists;
- mentions;
- generated anchors for headings;
- alerts/callouts;
- footnotes;
- emoji shortcodes;
- uploaded assets;
- color previews in supported discussion surfaces.

Use this reference when writing project docs, README content, issue templates, pull request descriptions, technical notes, and reference files in this repository.

---

## Core model

GitHub renders Markdown in two main contexts:

1. `.md` files in repositories.
2. Rich text fields in GitHub UI, such as issues, pull requests, comments, and discussions.

Most syntax works in both contexts, but some behavior is context-specific:
- line breaks are stricter in `.md` files than in issue/PR/discussion text;
- color previews work in issues, pull requests, and discussions;
- mentions and issue references are most useful in interactive GitHub surfaces;
- uploaded assets can be used in comments and `.md` files;
- footnotes are not supported in wikis.

GitHub also supports some safe inline HTML, such as `<sub>`, `<sup>`, `<ins>`, `<br/>`, `<picture>`, and custom anchors.

---

## Headings

Headings use one to six `#` characters. More `#` characters mean a deeper heading level.

```md
# First-level heading
## Second-level heading
### Third-level heading
#### Fourth-level heading
##### Fifth-level heading
###### Sixth-level heading
```

Guidelines:
- Use a single `#` heading for the document title.
- Use `##` for major sections.
- Use `###` and deeper levels only when the document really needs nested structure.
- Keep headings stable if other documents link to them.

GitHub automatically creates an outline/table of contents for rendered Markdown files when there are two or more headings.

---

## Text styling

Basic emphasis:

```md
**Bold text**
__Bold text__

*Italic text*
_Italic text_

~~Strikethrough text~~

**Bold with _nested italic_ text**

***Bold and italic text***
```

GitHub also supports a few HTML tags for text styling:

```md
This is <sub>subscript</sub>.
This is <sup>superscript</sup>.
This is <ins>underlined</ins>.
```

Notes:
- Prefer normal Markdown for bold, italic, and strikethrough.
- Use HTML styling only when Markdown has no equivalent.
- Avoid underline for ordinary emphasis because it can look like a link.

---

## Blockquotes

Use `>` to quote text.

```md
Normal paragraph.

> Quoted paragraph.
```

Blockquotes can contain multiple lines:

```md
> First quoted line.
> Second quoted line.
```

Use blockquotes for quoted material, previous comments, or clearly separated context. Do not use them as a generic visual card replacement.

---

## Inline code and code blocks

Use single backticks for inline code:

```md
Run `git status` before committing.
```

Use triple backticks for code blocks:

````md
```bash
git status
git add .
git commit -m "Update docs"
```
````

Guidelines:
- Add a language after the opening fence when possible, such as `ts`, `tsx`, `js`, `bash`, `json`, `md`, or `diff`.
- Use inline code for commands, paths, package names, symbols, field names, and short literals.
- Use fenced blocks for multi-line code or examples.

---

## Supported color previews

In issues, pull requests, and discussions, GitHub can render a small color preview when a supported color value is written inside backticks.

```md
Primary color: `#0969DA`
Overlay color: `rgb(9, 105, 218)`
Accent color: `hsl(212, 92%, 45%)`
```

Supported formats:
- HEX: `#RRGGBB`
- RGB: `rgb(R,G,B)`
- HSL: `hsl(H,S,L)`

Important constraints:
- The color value must be inside backticks.
- Do not add leading or trailing spaces inside the backticks.
- The visual preview is not a general Markdown-file feature; it is intended for issues, PRs, and discussions.

---

## Links

Inline links use `[label](url)`.

```md
[GitHub Docs](https://docs.github.com/)
```

Plain URLs in comments often become links automatically:

```md
https://docs.github.com/
```

Guidelines:
- Prefer descriptive link text over raw URLs in long-form docs.
- Keep link text on one line.
- Use relative links for files inside the same repository.

---

## Section links and generated anchors

Every heading gets an automatic anchor. You can link to a section with `#anchor-name`.

```md
[Go to usage](#usage)

## Usage
```

Basic anchor generation rules:
- heading text is lowercased;
- spaces become hyphens;
- most punctuation is removed;
- leading and trailing whitespace is ignored;
- Markdown styling is removed before the anchor is generated;
- duplicate headings get an incrementing suffix such as `-1`, `-2`, and so on.

Example:

```md
## Install and run

[Jump to install section](#install-and-run)
```

If a heading changes, links to that heading may need to be updated.

---

## Relative links

Relative links are the preferred way to reference repository files.

```md
[Architecture notes](docs/ARCHITECTURE.md)
[Frontend guide](./docs/FRONTEND.md)
[Parent document](../README.md)
```

Rules:
- a path without a leading slash is relative to the current file;
- a path starting with `/` is relative to the repository root;
- `./` and `../` work as expected;
- GitHub adjusts relative links for the current branch.

Prefer relative links because they continue to work in cloned repositories and across branches.

---

## Custom anchors

GitHub supports HTML anchors for link targets that are not headings.

```md
<a name="reference-custom-anchor"></a>

Some paragraph that should have a direct link target.

[Jump to custom anchor](#reference-custom-anchor)
```

Guidelines:
- Use custom anchors sparingly.
- Make anchor names unique.
- Consider prefixing custom anchors, for example `reference-`, `section-`, or `note-`.
- Custom anchors do not appear in GitHub's generated document outline.

---

## Line breaks and paragraphs

A new paragraph is created by leaving a blank line between text blocks.

```md
First paragraph.

Second paragraph.
```

In `.md` files, a simple newline inside a paragraph usually renders as a space. To force a line break, use one of these:

```md
Line one with two trailing spaces.  
Line two.

Line one with a backslash.\
Line two.

Line one with HTML.<br/>
Line two.
```

Guidelines:
- Prefer normal paragraphs with blank lines.
- Use forced line breaks only when the line structure matters.
- Avoid relying on trailing spaces when readability in source form matters.

---

## Images

Images use `![alt text](image-url-or-path)`.

```md
![Screenshot of the homepage hero](./assets/homepage-hero.png)
```

Guidelines:
- Always write meaningful alt text.
- Use relative paths for images stored in the repository.
- Use uploaded assets when writing issues, pull requests, comments, or discussions.
- Avoid absolute GitHub blob URLs for repository-local images unless there is a specific reason.

GitHub also supports the HTML `<picture>` element, which is useful when serving different images for light and dark themes or responsive variants.

```md
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshot-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshot-light.png">
  <img alt="Screenshot of the interface" src="./assets/screenshot-light.png">
</picture>
```

---

## Lists

Unordered lists can use `-`, `*`, or `+`.

```md
- First item
- Second item
- Third item
```

Ordered lists use numbers.

```md
1. First item
2. Second item
3. Third item
```

Nested lists are created by indentation.

```md
1. First item
   - Nested item
     - Deeper nested item
2. Second item
```

Guidelines:
- Use `-` consistently for unordered lists in project docs.
- Use ordered lists only when order matters.
- Align nested markers under the text of the parent list item for predictable rendering.

---

## Task lists

Task lists use `- [ ]` for incomplete tasks and `- [x]` for completed tasks.

```md
- [x] Write the draft
- [ ] Review the examples
- [ ] Update the README
```

Task items can include issue references, URLs, and emoji shortcodes:

```md
- [x] #739
- [ ] https://github.com/octo-org/octo-repo/issues/740
- [ ] Add final polish :sparkles:
```

If a task starts with a parenthesis, escape it:

```md
- [ ] \(Optional) Add screenshots
```

Use task lists for checklists in issues, PRs, planning docs, and implementation notes.

---

## Mentions

GitHub mentions use `@username` or `@organization/team-name`.

```md
@octocat can you review this?
@github/support what do you think?
```

Behavior:
- mentions can notify people or teams;
- notification depends on repository access and organization membership;
- GitHub autocomplete helps select users and teams;
- autocomplete is scoped to relevant collaborators and participants.

Guidelines:
- Mention people intentionally.
- Avoid unnecessary mentions in documentation files.
- Use team mentions when responsibility belongs to a team rather than one person.

---

## Issues, pull requests, and autolinks

Inside a repository, typing `#` can reference issues and pull requests.

```md
Fixes #123
Related to #456
See #789 for context
```

GitHub can also autolink:
- issue and pull request numbers;
- full GitHub issue/PR URLs;
- commit SHAs;
- configured external references.

External autolinks are repository settings. For example, a repository admin can configure patterns for JIRA or Zendesk ticket IDs so those references become short links automatically.

---

## Uploading assets

GitHub supports uploading assets by:
- dragging and dropping files;
- selecting files from a file browser;
- pasting files or images from the clipboard.

This works in issues, pull requests, discussions, comments, and `.md` files in a repository.

Use uploaded assets when the image or file is part of a conversation. Use committed repository files when the asset belongs to long-lived documentation.

---

## Emojis

GitHub supports emoji shortcodes in the form `:name:`.

```md
:+1:
:tada:
:shipit:
```

Typing `:` in GitHub's editor opens emoji autocomplete.

Guidelines:
- Use emojis sparingly in project documentation.
- Emojis can be useful in task lists, release notes, and friendly comments.
- Prefer words over emoji when the meaning must be precise.

---

## Footnotes

Footnotes use a reference marker and a matching definition.

```md
This sentence has a footnote.[^1]

This sentence has another footnote.[^details]

[^1]: A short note.
[^details]: A longer note with more context.
```

Notes:
- The footnote definition can appear near the text or later in the document.
- GitHub renders footnotes at the bottom of the rendered Markdown.
- The source position of the definition does not control the rendered position.
- Footnotes are not supported in GitHub wikis.

Use footnotes for supporting detail that would interrupt the main flow.

---

## Alerts

GitHub alerts are special blockquotes. They are useful for important notes, warnings, and callouts.

```md
> [!NOTE]
> Helpful context that readers should know.

> [!TIP]
> A practical suggestion.

> [!IMPORTANT]
> Information required for success.

> [!WARNING]
> A risk that needs attention.

> [!CAUTION]
> A high-risk or negative outcome to avoid.
```

Available alert types:
- `NOTE`
- `TIP`
- `IMPORTANT`
- `WARNING`
- `CAUTION`

Guidelines:
- Use alerts only when the information genuinely needs emphasis.
- Do not stack many alerts back to back.
- Do not nest alerts inside other elements.
- Keep alert text short and actionable.

---

## Hidden comments

HTML comments are hidden in rendered Markdown.

```md
<!-- This note is visible in source form but hidden in rendered Markdown. -->
```

Use comments for authoring notes, temporary reminders, or template instructions that should not appear in the rendered page.

Do not use hidden comments for secrets. They remain visible in the Markdown source.

---

## Escaping Markdown formatting

Use a backslash to prevent Markdown syntax from rendering.

```md
\*This text is not italic.\*
\# This is not a heading.
\[This is not a link label\]
```

This is useful when documenting Markdown syntax itself.

Markdown escaping does not apply to issue and pull request titles in the same way it applies to Markdown bodies.

---

## Disabling rendered view

When viewing a Markdown file on GitHub, the `Code` view shows the source instead of the rendered Markdown.

This is useful for:
- copying exact Markdown syntax;
- linking to specific source lines;
- reviewing hidden comments;
- debugging formatting problems.

---

## Practical writing rules for this repository

Use GitHub Markdown like this:

- Use one `#` title per reference document.
- Use `##` for major sections.
- Use fenced code blocks with language names.
- Use relative links for local files.
- Use meaningful alt text for images.
- Use task lists only for actual checklist state.
- Use alerts rarely and only for high-signal notes.
- Keep headings stable when other docs link to them.
- Prefer simple Markdown over inline HTML unless GitHub-specific HTML support solves a real formatting need.
- Keep examples small and copyable.

Avoid:
- decorative alerts;
- raw absolute links to files in the same repository;
- too many nested list levels;
- vague link text like `click here`;
- hidden comments containing sensitive information;
- relying on GitHub-only behavior in Markdown intended to render outside GitHub.

---

## Quick syntax index

````md
# Heading 1
## Heading 2

**bold**
_italic_
~~strikethrough~~
<sub>subscript</sub>
<sup>superscript</sup>
<ins>underline</ins>

> Quote

`inline code`

```text
code block
```

[Link label](https://example.com)
[Relative link](docs/PROJECT.md)
[Section link](#section-link)

![Alt text](./image.png)

- Unordered item
1. Ordered item

- [ ] Incomplete task
- [x] Complete task

@username
#123
:tada:

Footnote reference.[^1]
[^1]: Footnote text.

> [!NOTE]
> Alert body.

<!-- Hidden comment -->

\*Escaped formatting\*
````

---

## Codex implementation notes for later

Documentation/reference only.

Do not change:
- frontend components;
- backend;
- Payload CMS;
- database;
- API routes;
- styling;
- build configuration.

Use this reference when generating or editing:
- README files;
- docs in `docs/`;
- reference notes in `references/`;
- issue/PR templates;
- GitHub-oriented changelog or release notes.

Acceptance criteria:
- Markdown guidance is based on GitHub's official documentation;
- GitHub-specific extensions are called out clearly;
- examples are copyable;
- context-specific behavior is documented;
- no application behavior changes are made.
