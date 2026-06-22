import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getProjects } from "@/lib/data/projects"
import { getFooter, getHeader, getProjectsPage } from "@/lib/data/site-settings"

export const revalidate = 60

export default async function ProjectsPage() {
  const [header, footer, page, projects] = await Promise.all([
    getHeader(),
    getFooter(),
    getProjectsPage(),
    getProjects(),
  ])

  return (
    <PublicSiteShell>
      <Header header={header} />

      <section className="px-4 pb-20 pt-32 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Link
            href={page.backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" />
            {page.backLabel}
          </Link>

          <div className="mb-14 mt-10 border-t border-border pt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {page.eyebrow}
            </p>
            <h1 className="max-w-4xl text-[clamp(3.25rem,9vw,8rem)] font-bold uppercase leading-[0.88] tracking-normal">
              {page.title}
            </h1>
            <p className="mt-8 max-w-2xl border-l border-border pl-5 leading-8 text-muted-foreground">
              {page.description}
            </p>
          </div>

          <div className="border-t border-border">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={project.href}
                className="group block border-b border-border py-7 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-9"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:items-stretch">
                  <div className="flex flex-col justify-center">
                    <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-border" />
                      <span>{project.tags[0]}</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold uppercase leading-none text-muted-foreground transition-colors group-hover:text-accent md:text-5xl">
                      {project.title}
                    </h2>
                    <p className="mb-6 max-w-2xl text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.image && (
                    <div className="relative aspect-video overflow-hidden border border-border md:aspect-auto">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 20rem, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-transparent" />
                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-border bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Link
            href={page.footerCtaHref}
            className="mt-10 inline-flex items-center gap-2 border border-border bg-secondary px-5 py-3 text-sm transition-colors hover:border-accent/40 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {page.footerCtaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}
