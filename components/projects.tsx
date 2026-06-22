"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { ProjectListItem } from "@/lib/data/projects"
import type { HomeProjectsSettings } from "@/lib/data/site-settings-seed"
import { cn } from "@/lib/utils"

type ProjectsProps = {
  projects: ProjectListItem[]
  section: HomeProjectsSettings
}

export function Projects({ projects, section }: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const activeProject = activeIndex === null ? null : projects[activeIndex]

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!previewRef.current) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const progress = (event.clientY - bounds.top) / bounds.height
    const offset = Math.max(-44, Math.min(44, (progress - 0.5) * 96))

    previewRef.current.style.setProperty("--project-preview-y", `${offset}px`)
  }

  return (
    <section id="work" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 border-t border-border pt-8 md:mb-16"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.eyebrow}
          </p>
          <h2 className="max-w-3xl text-4xl font-bold uppercase leading-none md:text-6xl">
            {section.title}
          </h2>
        </motion.div>

        <div
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="border-t border-border">
            {projects.map((project, index) => {
              const isActive = activeIndex === index
              const hasActiveProject = activeIndex !== null

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="border-b border-border"
                >
                  <Link
                    href={project.href}
                    aria-label={`Open ${project.title} project`}
                    className="group block py-7 outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-9"
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="grid gap-5 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-start">
                      <span
                        className={cn(
                          "pt-1 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors",
                          isActive && "text-accent",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3
                          className={cn(
                            "text-3xl font-bold uppercase leading-none text-muted-foreground transition-colors md:text-6xl",
                            hasActiveProject && !isActive && "text-muted-foreground/45",
                            isActive && "text-accent",
                          )}
                        >
                          {project.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:hidden">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 md:max-w-48 md:justify-end">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "border border-border px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground transition-colors",
                              isActive && "border-accent/35 text-foreground",
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {project.image && (
                      <div className="mt-6 overflow-hidden border border-border md:hidden">
                        <div className="relative aspect-video">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.article>
              )
            })}
          </div>

          <aside className="relative hidden lg:block">
            <div
              ref={previewRef}
              className="sticky top-32 min-h-[32rem] [--project-preview-y:0px]"
            >
              <AnimatePresence mode="wait">
                {activeProject?.image && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: "var(--project-preview-y)" }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute inset-x-0 top-10 overflow-hidden border border-border bg-card"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={activeProject.image}
                        alt={activeProject.title}
                        fill
                        sizes="22rem"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    </div>
                    <div className="flex items-center justify-between border-t border-border p-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Preview
                        </p>
                        <p className="mt-1 font-medium">{activeProject.title}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-accent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link
            href={section.archiveCtaHref}
            className="inline-flex items-center gap-2 border border-border bg-secondary px-5 py-3 text-sm transition-colors hover:border-accent/40 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {section.archiveCtaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
