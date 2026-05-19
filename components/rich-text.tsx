import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react"

import type { Project } from "@/payload-types"
import { cn } from "@/lib/utils"

type RichTextProps = {
  data: Project["content"]
  className?: string
}

export function RichText({ data, className }: RichTextProps) {
  if (!data) {
    return null
  }

  return (
    <PayloadRichText
      data={data}
      disableIndent
      className={cn(
        "space-y-6 text-base leading-8 text-muted-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-pink-400 [&_blockquote]:pl-5 [&_blockquote]:text-foreground",
        "[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground",
        "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-foreground",
        "[&_h2]:pt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground",
        "[&_h3]:pt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
    />
  )
}
