import { renderGitHubMarkdown } from "@/lib/markdown"
import { cn } from "@/lib/utils"

import styles from "./rich-text.module.css"

type RichTextProps = {
  data: string | null | undefined
  className?: string
}

export function RichText({ data, className }: RichTextProps) {
  if (!data?.trim()) {
    return null
  }

  return (
    <div
      className={cn(styles.root, className)}
      dangerouslySetInnerHTML={{ __html: renderGitHubMarkdown(data) }}
    />
  )
}
