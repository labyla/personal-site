"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { ProjectListItem } from "@/lib/data/projects"

type ProjectsProps = {
  projects: ProjectListItem[]
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="work" className="px-4 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 border-t border-border pt-8 md:mb-16"
        >
          <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
            FEATURED PROJECTS
          </p>
          <h2 className="max-w-3xl text-4xl font-bold uppercase leading-none md:text-6xl">
            Selected work, built to hold up.
          </h2>
        </motion.div>

        <div className="space-y-5">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={project.href}
                className="group block relative overflow-hidden border border-border bg-card/70 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_20rem] md:p-7">
                  <div className="flex flex-col justify-center">
                    <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-border" />
                      <span>{project.tags[0]}</span>
                    </div>
                    <h3 className="mb-4 text-3xl font-bold uppercase leading-none transition-colors group-hover:text-accent md:text-5xl">
                      {project.title}
                    </h3>
                    <p className="mb-6 max-w-2xl text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative aspect-video overflow-hidden border border-border md:aspect-auto">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-border bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border bg-secondary px-5 py-3 text-sm transition-colors hover:border-accent/40 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            See more projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
