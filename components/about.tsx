"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { AboutSettings, SocialPlatform } from "@/lib/data/site-settings-seed"

const socialIcons: Record<SocialPlatform, typeof Github> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
}

type AboutProps = {
  about: AboutSettings
}

export function About({ about }: AboutProps) {
  return (
    <section id="about" className="px-4 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
              {about.eyebrow}
            </p>
            <h2 className="mb-6 text-4xl font-bold uppercase leading-none md:text-6xl">
              {about.titlePrefix}<br />
              <span className="text-muted-foreground">{about.titleMuted}</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-8">
              {about.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform]

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center border border-border bg-secondary transition-colors hover:border-accent/30 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="relative h-full overflow-hidden border border-border">
                <Image
                  src={about.imageUrl}
                  alt={about.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
