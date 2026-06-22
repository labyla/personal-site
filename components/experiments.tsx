"use client"

import { motion } from "framer-motion"
import type { CSSProperties } from "react"

import type { TechStackItem } from "@/components/tech-stack-data"
import type { TechStackSettings } from "@/lib/data/site-settings-seed"

type TechStackGroupProps = {
  eyebrow: string
  items: TechStackItem[]
  title: string
}

function TechStackCard({ item }: { item: TechStackItem }) {
  return (
    <div
      className="group relative flex min-h-24 flex-col items-center justify-center gap-3 overflow-hidden border border-border bg-card/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-secondary/70"
      style={{ "--stack-color": item.color } as CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-4 top-0 h-px bg-[var(--stack-color)]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--stack-color)_22%,transparent),transparent_58%)]" />
      </div>

      {item.icon && (
        <img
          alt=""
          className="relative h-7 w-7 object-contain opacity-70 brightness-0 invert transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
          src={item.icon}
        />
      )}
      <span className="relative text-center text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {item.name}
      </span>
    </div>
  )
}

function TechStackGroup({ eyebrow, items, title }: TechStackGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="border border-border bg-background/45 p-4 md:p-5"
    >
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
          <h3 className="text-2xl font-bold uppercase leading-none md:text-3xl">{title}</h3>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{items.length} ITEMS</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <TechStackCard key={item.name} item={item} />
        ))}
      </div>
    </motion.div>
  )
}

type ExperimentsProps = {
  skills: TechStackItem[]
  techStack: TechStackSettings
  tools: TechStackItem[]
}

export function Experiments({ skills, techStack, tools }: ExperimentsProps) {
  return (
    <section id="tools" className="relative overflow-hidden px-4 py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[56rem] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,color-mix(in_oklch,var(--accent)_18%,transparent)_0%,transparent_72%)] opacity-80" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {techStack.eyebrow}
          </p>
          <h2 className="text-5xl font-bold uppercase leading-none md:text-7xl">
            {techStack.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            {techStack.description}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <TechStackGroup
            eyebrow={techStack.skillsEyebrow}
            items={skills}
            title={techStack.skillsTitle}
          />
          <TechStackGroup
            eyebrow={techStack.toolsEyebrow}
            items={tools}
            title={techStack.toolsTitle}
          />
        </div>
      </div>
    </section>
  )
}
