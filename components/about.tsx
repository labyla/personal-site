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
    <section id="about" className="py-24 px-4">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
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
                    className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/30 transition-colors"
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
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-3xl blur-2xl" />
              <div className="relative h-full rounded-3xl overflow-hidden border border-border">
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
