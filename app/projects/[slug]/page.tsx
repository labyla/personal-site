import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { MarkdownContent } from "@/components/markdown-content"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getProjectBySlug } from "@/lib/data/projects"
import { getFooter, getHeader } from "@/lib/data/site-settings"

type ProjectPageProps = {
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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project not found",
    }
  }

  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.excerpt || project.description,
    alternates: project.canonicalUrl
      ? {
          canonical: project.canonicalUrl,
        }
      : undefined,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const [header, footer, project] = await Promise.all([
    getHeader(),
    getFooter(),
    getProjectBySlug(slug),
  ])

  if (!project) {
    notFound()
  }

  const publishedAt = formatDate(project.publishedAt)

  return (
    <PublicSiteShell>
      <Header header={header} />

      <article className="px-4 pb-20 pt-32 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <header className="mt-10 border-t border-border pt-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Project</span>
              <span className="h-px w-8 bg-border" />
              {publishedAt && <time dateTime={project.publishedAt || undefined}>{publishedAt}</time>}
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-2.5 py-1 text-[0.68rem] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-7 max-w-5xl text-[clamp(3.25rem,9vw,8rem)] font-bold uppercase leading-[0.88] tracking-normal">
              {project.title}
            </h1>

            <p className="mt-8 max-w-3xl border-l border-border pl-5 text-base leading-8 text-muted-foreground md:text-lg">
              {project.excerpt || project.description}
            </p>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Visit project
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </header>

          {project.imageUrl && (
            <div className="relative mt-12 aspect-video overflow-hidden border border-border bg-card">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/24 to-transparent" />
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl border-t border-border pt-10">
            {project.contentMarkdown ? (
              <MarkdownContent content={project.contentMarkdown} />
            ) : (
              <p className="text-muted-foreground">Project story is being prepared.</p>
            )}
          </div>
        </div>
      </article>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}
