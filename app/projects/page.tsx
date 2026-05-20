import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getProjects } from "@/lib/data/projects"
import { getFooter, getHeader } from "@/lib/data/site-settings"

export const revalidate = 60

export default async function ProjectsPage() {
  const [header, footer, projects] = await Promise.all([
    getHeader(),
    getFooter(),
    getProjects(),
  ])

  return (
    <PublicSiteShell>
      <Header header={header} />

      <section className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mt-10 mb-14">
            <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
              PROJECTS
            </p>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              All projects
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground leading-8">
              A closer look at selected product, engineering, and interface work.
            </p>
          </div>

          <div className="space-y-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="group block relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/20 to-gradient-blue/10 p-1"
              >
                <div className="relative bg-card rounded-[22px] overflow-hidden">
                  <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                    <div className="flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-secondary text-xs rounded-full text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="relative aspect-video md:aspect-auto rounded-xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}
