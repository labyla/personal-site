"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Instagram, Mail } from "lucide-react"

import type {
  FooterSettings,
  FooterSocialPlatform,
} from "@/lib/data/site-settings-seed"

const socialIcons: Record<FooterSocialPlatform, typeof Github> = {
  email: Mail,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
}

type FooterProps = {
  footer: FooterSettings
}

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {footer.brandInitial}
              </div>
              <span className="font-semibold">{footer.brandName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {footer.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <ul className="space-y-2">
              {footer.mainLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Work
            </h4>
            <ul className="space-y-2">
              {footer.workLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <ul className="space-y-2">
              {footer.socialLinks.map((link) => {
                const Icon = socialIcons[link.platform]

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {footer.copyrightName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footer.socialLinks
              .filter((link) => link.platform !== "email")
              .map((link) => {
                const Icon = socialIcons[link.platform]

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-pink-500/20 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </footer>
  )
}
