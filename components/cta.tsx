"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import type { CtaSettings } from "@/lib/data/site-settings-seed"

type CTAProps = {
  cta: CtaSettings
}

export function CTA({ cta }: CTAProps) {
  if (!cta.isEnabled) {
    return null
  }

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-accent/25 bg-card/70 p-8 text-center md:p-14"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center border border-accent bg-accent font-bold text-accent-foreground">
                {cta.avatarLetter}
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold uppercase leading-none md:text-5xl">
              {cta.titlePrefix}<span className="text-accent">{cta.titleAccent}</span>
              <br />
              {cta.titleMiddle} <span className="text-accent">{cta.titleSuffix}</span>
            </h2>

            <p className="text-muted-foreground mb-2">{cta.name}</p>
            <p className="text-sm text-muted-foreground mb-8">{cta.availability}</p>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {cta.description}
            </p>

            <Button
              size="lg"
              className="group rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href={cta.primaryCtaHref}>
                {cta.primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
