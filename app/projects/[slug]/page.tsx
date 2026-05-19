import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { RichText } from "@/components/rich-text"
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
    <main className="min-h-screen">
      <Header header={header} />

      <article className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <header className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {publishedAt && <time dateTime={project.publishedAt || undefined}>{publishedAt}</time>}
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              {project.excerpt || project.description}
            </p>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Visit project
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </header>

          {project.imageUrl && (
            <div className="relative mt-12 aspect-video overflow-hidden rounded-3xl border border-border bg-card">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mx-auto mt-14 max-w-3xl">
            {project.content ? (
              <RichText data={project.content} />
            ) : (
              <p className="text-muted-foreground">Project story is being prepared.</p>
            )}
          </div>
        </div>
      </article>

      <Footer footer={footer} />
    </main>
  )
}
