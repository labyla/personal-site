"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion"

const experienceItems = [
  {
    company: "Independent",
    role: "Full Stack Developer",
    period: "2024 - Present",
    description:
      "Building CMS-backed websites, product interfaces, and fast frontend systems for small teams and founders.",
  },
  {
    company: "Product Teams",
    role: "Frontend Engineer",
    period: "2022 - 2024",
    description:
      "Shipped responsive interfaces, polished interaction patterns, and production-ready React experiences.",
  },
  {
    company: "Client Builds",
    role: "Web Developer",
    period: "2020 - 2022",
    description:
      "Turned early ideas into usable websites with clear structure, practical tooling, and maintainable UI.",
  },
]

function ExperienceItem({
  company,
  role,
  period,
  description,
  index,
}: (typeof experienceItems)[number] & { index: number }) {
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

export function Experience() {
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
            MY EXPERIENCE
          </p>
          <h2 className="mt-4 max-w-xs text-4xl font-bold uppercase leading-none md:text-5xl">
            Scroll through the build record.
          </h2>
        </motion.div>

        <div>
          {experienceItems.map((item, index) => (
            <ExperienceItem key={item.role} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
