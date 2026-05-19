"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
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
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-pink-500/30 p-12 md:p-16 text-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {cta.avatarLetter}
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {cta.titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{cta.titleAccent}</span>
              <br />
              {cta.titleMiddle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{cta.titleSuffix}</span>
            </h2>

            <p className="text-muted-foreground mb-2">{cta.name}</p>
            <p className="text-sm text-muted-foreground mb-8">{cta.availability}</p>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {cta.description}
            </p>

            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 group"
              asChild
            >
              <a href={cta.primaryCtaHref}>
                {cta.primaryCtaLabel}
                <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
