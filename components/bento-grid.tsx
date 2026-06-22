"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import type { BentoSettings } from "@/lib/data/site-settings-seed"

type BentoGridProps = {
  bento: BentoSettings
}

export function BentoGrid({ bento }: BentoGridProps) {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main card - Let's Build Together */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 relative group"
          >
            <Link
              href={bento.buildHref}
              className="block h-full border border-accent/30 bg-accent/10 p-6 transition-colors hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <div>
                  <p className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">
                    {bento.buildEyebrow}
                  </p>
                  <p className="text-muted-foreground">
                    {bento.buildText}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 relative group"
          >
            <Link
              href={bento.stackHref}
              className="block h-full border border-border bg-card/80 p-6 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex min-h-[200px] flex-col justify-between gap-5">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider transition-colors group-hover:text-accent">
                    {bento.stackEyebrow}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {bento.stackText}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bento.stackTags.map((tag) => (
                      <span key={tag} className="border border-border bg-secondary px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </motion.div>

          {/* Available for hire card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 relative"
          >
            <div className="flex h-full flex-col justify-between border border-border bg-card/80 p-6">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                  {bento.projectsEyebrow}
                </p>
                <p className="font-semibold text-3xl">{bento.projectsValue}</p>
              </div>
              <p className="text-sm text-muted-foreground">{bento.projectsText}</p>
            </div>
          </motion.div>

          {/* Tools card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 md:col-span-2 relative group"
          >
            <Link
              href={bento.workflowHref}
              className="block h-full border border-border bg-card/80 p-6 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                    {bento.workflowEyebrow}
                  </p>
                  <p className="text-foreground font-medium">{bento.workflowText}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          {/* Experience card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 relative"
          >
            <div className="h-full border border-border bg-card/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                    {bento.experienceEyebrow}
                  </p>
                  <p className="font-semibold text-3xl">{bento.experienceValue}</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 border-2 border-background bg-accent"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
