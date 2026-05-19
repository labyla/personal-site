import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { RichText } from "@/components/rich-text"
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
    <main className="min-h-screen">
      <Header header={header} />

      <article className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>

          <header className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {publishedAt && <time dateTime={post.publishedAt || undefined}>{publishedAt}</time>}
              {post.readingTime && <span>{post.readingTime}</span>}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              {post.excerpt}
            </p>
          </header>

          {post.coverImageUrl && (
            <div className="relative mt-12 aspect-video overflow-hidden rounded-3xl border border-border bg-card">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl">
            {post.content ? (
              <RichText data={post.content} />
            ) : (
              <p className="text-muted-foreground">Article is being prepared.</p>
            )}
          </div>
        </div>
      </article>

      <Footer footer={footer} />
    </main>
  )
}
