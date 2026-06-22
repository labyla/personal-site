"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

import type { HeroSettings } from "@/lib/data/site-settings-seed"

type HeroProps = {
  hero: HeroSettings
}

export function Hero({ hero }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-end overflow-hidden px-4 pb-14 pt-32 sm:pb-16 md:pt-40 lg:pb-20"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {hero.availabilityLabel}
            </span>
            <span className="hidden h-px w-10 bg-border sm:block" />
            <a
              href={hero.badgeHref}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {hero.badgeText}
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="max-w-5xl text-[clamp(3.4rem,11vw,9.5rem)] font-bold uppercase leading-[0.86] tracking-normal"
          >
            <span>{hero.headlinePrefix}</span>
            <span className="text-accent">{hero.headlineAccent}</span>
            <span>{hero.headlineSuffix}</span>
            <span className="block text-muted-foreground">{hero.headlineSubline}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-[minmax(0,34rem)_auto] md:items-end"
          >
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {hero.introPrefix} {hero.name}, {hero.role}. I design and build
              fast, thoughtful web products with a bias for clarity, durability,
              and the small details that make software feel sharp.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-none border border-accent bg-accent px-5 text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring"
                asChild
              >
                <a href={hero.primaryCtaHref}>
                  {hero.primaryCtaLabel}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-none border-border bg-transparent px-5 text-foreground hover:border-accent/50 hover:bg-secondary"
                asChild
              >
                <a href={hero.secondaryCtaHref}>
                  <Mail className="mr-1 h-4 w-4" />
                  {hero.secondaryCtaLabel}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="hidden border-l border-border pl-6 text-sm text-muted-foreground lg:block"
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
            {hero.focusLabel}
          </p>
          <p className="leading-7">
            {hero.focusText}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
