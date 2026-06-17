import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import remarkDirective from "remark-directive"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import { visit } from "unist-util-visit"

import { cn } from "@/lib/utils"
import { gitBookToDirectiveMarkdown } from "@/lib/markdown/gitbook"

type MarkdownContentProps = {
  content: string
  className?: string
}

type DirectiveNode = {
  attributes?: Record<string, string>
  data?: {
    hName?: string
    hProperties?: Record<string, string>
  }
  name?: string
  type: string
}

const gitBookBlocks = new Set(["hint", "stepper", "step", "tabs", "tab"])

const markdownSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div || []),
      ["data-gb-block"],
      ["data-gb-style"],
      ["data-gb-title"],
    ],
    kbd: defaultSchema.attributes?.kbd || [],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "details",
    "summary",
    "kbd",
  ],
}

function remarkGitBookDirectives() {
  return (tree: unknown) => {
    visit(tree as never, (node: DirectiveNode) => {
      if (
        node.type !== "containerDirective" ||
        !node.name ||
        !gitBookBlocks.has(node.name)
      ) {
        return
      }

      const attrs = node.attributes || {}
      node.data ||= {}
      node.data.hName = "div"
      node.data.hProperties = {
        "data-gb-block": node.name,
        "data-gb-style": attrs.style || "",
        "data-gb-title": attrs.title || "",
      }
    })
  }
}

function getDataAttribute(props: Record<string, unknown>, name: string) {
  const value = props[name]

  return typeof value === "string" ? value : ""
}

function MarkdownDiv({
  children,
  node,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  node?: {
    properties?: Record<string, unknown>
  }
}) {
  const properties = node?.properties || {}
  const block = getDataAttribute(properties, "dataGbBlock")
  const style = getDataAttribute(properties, "dataGbStyle")
  const title = getDataAttribute(properties, "dataGbTitle")

  if (block === "hint") {
    return (
      <aside
        className={cn(
          "border-l-2 px-5 py-4 text-sm leading-7",
          style === "danger" && "border-destructive bg-destructive/10 text-foreground",
          style === "warning" && "border-yellow-400 bg-yellow-400/10 text-foreground",
          style === "success" && "border-accent bg-accent/10 text-foreground",
          (!style || style === "info") && "border-gradient-cyan bg-secondary/55 text-muted-foreground",
        )}
      >
        {children}
      </aside>
    )
  }

  if (block === "tabs") {
    return <div className="space-y-4 border border-border bg-card/50 p-4">{children}</div>
  }

  if (block === "tab") {
    return (
      <section className="border-t border-border pt-4 first:border-t-0 first:pt-0">
        {title && (
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">
            {title}
          </p>
        )}
        {children}
      </section>
    )
  }

  if (block === "stepper") {
    return <ol className="space-y-5 border-l border-border pl-5">{children}</ol>
  }

  if (block === "step") {
    return <li className="pl-2 marker:text-accent">{children}</li>
  }

  return <div {...props}>{children}</div>
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content.trim()) {
    return null
  }

  return (
    <div
      className={cn(
        "space-y-7 text-base leading-8 text-muted-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-accent/60 [&_a]:underline-offset-4 hover:[&_a]:text-accent",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-foreground",
        "[&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground",
        "[&_details]:border [&_details]:border-border [&_details]:bg-card/45 [&_details]:p-4",
        "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:uppercase [&_h1]:leading-none [&_h1]:text-foreground",
        "[&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-none [&_h2]:text-foreground",
        "[&_h3]:pt-6 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:uppercase [&_h3]:leading-none [&_h3]:text-foreground",
        "[&_hr]:border-border",
        "[&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-3 [&_th]:border [&_th]:border-border [&_th]:p-3 [&_th]:text-left [&_th]:text-foreground [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkFrontmatter, remarkGfm, remarkDirective, remarkGitBookDirectives]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} rel="noreferrer">
              {children}
            </a>
          ),
          div: MarkdownDiv,
          kbd: ({ children }) => (
            <kbd className="border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.78em] text-foreground">
              {children}
            </kbd>
          ),
        }}
      >
        {gitBookToDirectiveMarkdown(content)}
      </ReactMarkdown>
    </div>
  )
}
