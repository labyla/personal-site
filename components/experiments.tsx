"use client"

import { motion } from "framer-motion"
import type { CSSProperties } from "react"

import {
  skillItems,
  toolItems,
  type TechStackItem,
} from "@/components/tech-stack-data"

type TechStackGroupProps = {
  eyebrow: string
  items: TechStackItem[]
  title: string
}

function TechStackCard({ item }: { item: TechStackItem }) {
  const Icon = item.icon

  return (
    <div
      className="group relative flex min-h-24 flex-col items-center justify-center gap-3 overflow-hidden border border-border bg-card/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-secondary/70"
      style={{ "--stack-color": item.color } as CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-4 top-0 h-px bg-[var(--stack-color)]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--stack-color)_22%,transparent),transparent_58%)]" />
      </div>

      <Icon className="relative h-7 w-7 text-muted-foreground transition-colors duration-300 group-hover:text-[var(--stack-color)]" />
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

export function Experiments() {
  return (
    <section id="tools" className="relative overflow-hidden px-4 py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-24 h-64 w-[42rem] -translate-x-1/2 bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_64%)] opacity-80" />
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
            STACK
          </p>
          <h2 className="text-5xl font-bold uppercase leading-none md:text-7xl">
            Tech stack
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            The languages, frameworks, and daily tools I use to build and ship.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <TechStackGroup eyebrow="01" items={skillItems} title="Skills" />
          <TechStackGroup eyebrow="02" items={toolItems} title="Tools" />
        </div>
      </div>
    </section>
  )
}
