"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion"

import type { ExperienceListItem } from "@/lib/data/experience"
import type { ExperienceSettings } from "@/lib/data/site-settings-seed"

function ExperienceItem({
  company,
  role,
  period,
  description,
  index,
}: ExperienceListItem & { index: number }) {
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 82%", "center 48%"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.62, 1], [0.24, 0.58, 1])
  const y = useTransform(scrollYProgress, [0, 1], [22, 0])

  return (
    <motion.article
      ref={itemRef}
      style={{ opacity, y }}
      className="border-t border-border py-10 md:py-12"
    >
      <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-border" />
        <span>{company}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem] md:items-start">
        <div>
          <h3 className="max-w-3xl text-3xl font-bold uppercase leading-none md:text-5xl">
            {role}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
        <p className="text-sm uppercase tracking-wider text-muted-foreground md:text-right">
          {period}
        </p>
      </div>
    </motion.article>
  )
}

type ExperienceProps = {
  items: ExperienceListItem[]
  section: ExperienceSettings
}

export function Experience({ items, section }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "end 55%"],
  })
  const labelY = useTransform(scrollYProgress, [0, 1], [0, 72])

  return (
    <section ref={sectionRef} id="experience" className="px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <motion.div
          style={{ y: labelY }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.eyebrow}
          </p>
          <h2 className="mt-4 max-w-xs text-4xl font-bold uppercase leading-none md:text-5xl">
            {section.title}
          </h2>
        </motion.div>

        <div>
          {items.map((item, index) => (
            <ExperienceItem key={item.id} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
