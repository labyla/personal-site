"use client"

import { motion } from "framer-motion"
import { ArrowRight, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import type { HeroSettings } from "@/lib/data/site-settings-seed"

type HeroProps = {
  hero: HeroSettings
}

export function Hero({ hero }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* New badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={hero.badgeHref}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all mb-8"
          >
            <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded-full text-xs font-medium">
              {hero.badgeLabel}
            </span>
            <span>{hero.badgeText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span>{hero.headlinePrefix}</span>
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {hero.headlineAccent}
          </span>
          <span>{hero.headlineSuffix}</span>
          <br />
          <span className="text-muted-foreground">{hero.headlineSubline}</span>
        </motion.h1>

        {/* Subtitle with avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground mb-10"
        >
          <span>{`${hero.introPrefix} ${hero.name}`}</span>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400/50">
            <Image
              src={hero.avatarUrl}
              alt={hero.name}
              fill
              className="object-cover"
            />
          </div>
          <span>{hero.role}</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 group"
            asChild
          >
            <a href={hero.primaryCtaHref}>
              {hero.primaryCtaLabel}
              <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-border hover:bg-secondary"
            asChild
          >
            <a href={hero.secondaryCtaHref}>
              <Mail className="w-4 h-4 mr-2" />
              {hero.secondaryCtaLabel}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
