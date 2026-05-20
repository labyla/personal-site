"use client"

import { motion } from "framer-motion"

const technologies = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "CSS", "Motion.dev",
  "Sanity CMS", "Figma", "Notion", "Markdown", "Node.js", "Express.js", "Redis"
]

export function TechMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-background/60 py-5">
      <div className="flex">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-3 pr-3"
        >
          {[...technologies, ...technologies, ...technologies].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 whitespace-nowrap border border-border bg-secondary/40 px-3 py-2"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{tech}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
