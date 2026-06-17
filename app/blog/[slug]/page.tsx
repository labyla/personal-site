import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { MarkdownContent } from "@/components/markdown-content"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getPostBySlug } from "@/lib/data/posts"
import { getFooter, getHeader } from "@/lib/data/site-settings"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60

function formatDate(value: string | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post not found",
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: post.canonicalUrl
      ? {
          canonical: post.canonicalUrl,
        }
      : undefined,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [header, footer, post] = await Promise.all([
    getHeader(),
    getFooter(),
    getPostBySlug(slug),
  ])

  if (!post) {
    notFound()
  }

  const publishedAt = formatDate(post.publishedAt)

  return (
    <PublicSiteShell>
      <Header header={header} />

      <article className="px-4 pb-20 pt-32 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>

          <header className="mt-10 border-t border-border pt-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Article</span>
              <span className="h-px w-8 bg-border" />
              {publishedAt && <time dateTime={post.publishedAt || undefined}>{publishedAt}</time>}
              {publishedAt && post.readingTime && <span className="text-border">/</span>}
              {post.readingTime && <span>{post.readingTime}</span>}
            </div>

            <h1 className="mt-7 max-w-5xl text-[clamp(3.25rem,9vw,8rem)] font-bold uppercase leading-[0.88] tracking-normal">
              {post.title}
            </h1>

            <p className="mt-8 max-w-3xl border-l border-border pl-5 text-base leading-8 text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
          </header>

          {post.coverImageUrl && (
            <div className="relative mt-12 aspect-video overflow-hidden border border-border bg-card">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/24 to-transparent" />
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl border-t border-border pt-10">
            {post.contentMarkdown ? (
              <MarkdownContent content={post.contentMarkdown} />
            ) : (
              <p className="text-muted-foreground">Article is being prepared.</p>
            )}
          </div>
        </div>
      </article>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}
