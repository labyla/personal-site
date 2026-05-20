"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeaderSettings } from "@/lib/data/site-settings-seed"

type HeaderProps = {
  header: HeaderSettings
}

export function Header({ header }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 px-4 py-4"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-b border-border bg-background/70 px-0 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-8 w-8 items-center justify-center border border-accent bg-accent text-sm font-bold text-accent-foreground">
            {header.logoText}
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            Aayush Bharti
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {header.navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-none border border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground md:flex"
          >
            <Link href={header.ctaHref}>{header.ctaLabel}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-2 max-w-6xl border border-border bg-card/95 p-4 backdrop-blur-xl md:hidden"
          >
            {header.navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-4 w-full rounded-none">
              <Link href={header.ctaHref} onClick={() => setIsOpen(false)}>
                {header.ctaLabel}
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
