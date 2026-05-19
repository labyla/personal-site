"use client"

import { motion } from "framer-motion"

const technologies = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "CSS", "Motion.dev",
  "Sanity CMS", "Figma", "Notion", "Markdown", "Node.js", "Express.js", "Redis"
]

export function TechMarquee() {
  return (
    <div className="relative overflow-hidden py-8 bg-card/30 border-y border-border">
      <div className="flex">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-8 pr-8"
        >
          {[...technologies, ...technologies, ...technologies].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full whitespace-nowrap"
            >
              <span className="text-sm text-muted-foreground">{tech}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
