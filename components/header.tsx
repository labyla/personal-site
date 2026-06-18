"use client"

import { type MouseEvent, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeaderSettings } from "@/lib/data/site-settings-seed"

type HeaderProps = {
  header: HeaderSettings
}

export function Header({ header }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const contactProgress = useMotionValue(0)
  const headerProgress = useSpring(contactProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.2,
  })
  const borderOpacity = useTransform(headerProgress, [0, 1], [0, 0.6])
  const surfaceOpacity = useTransform(headerProgress, [0, 1], [0, 0.16])
  const ctaFillOpacity = useTransform(headerProgress, [0, 1], [0.08, 0.22])

  useEffect(() => {
    let frame = 0

    function getContactScrollTarget() {
      const contact = document.getElementById("contact")
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      if (!contact) {
        return Math.max(maxScroll, 1)
      }

      const scrollMarginTop =
        Number.parseFloat(getComputedStyle(contact).scrollMarginTop) || 0
      const contactTop = contact.getBoundingClientRect().top + window.scrollY

      return Math.max(Math.min(contactTop - scrollMarginTop, maxScroll), 1)
    }

    function updateProgress() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const progress = window.scrollY / getContactScrollTarget()
        contactProgress.set(Math.min(Math.max(progress, 0), 1))
      })
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [contactProgress])

  function hrefForPage(href: string) {
    return href.startsWith("#") ? `/${href}` : href
  }

  function handleSectionLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!href.startsWith("#")) {
      setIsOpen(false)
      return
    }

    if (pathname !== "/") {
      setIsOpen(false)
      return
    }

    const target = document.getElementById(href.slice(1))

    if (!target) {
      setIsOpen(false)
      return
    }

    event.preventDefault()
    target.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.pushState(null, "", href)
    setIsOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 px-3 py-3 sm:px-5"
    >
      <motion.nav className="relative isolate mx-auto flex w-full max-w-none items-center justify-between overflow-hidden border border-border/70 bg-background/75 px-4 py-3 backdrop-blur-md sm:px-5 lg:px-6">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-left bg-accent"
          style={{ opacity: surfaceOpacity, scaleX: headerProgress }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-accent"
          style={{ opacity: borderOpacity }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
          style={{ opacity: borderOpacity, scaleX: headerProgress }}
        />
        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-8 w-8 items-center justify-center border border-accent bg-accent text-sm font-bold text-accent-foreground">
            {header.logoText}
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            Aayush Bharti
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="relative z-10 hidden items-center gap-1 md:flex">
          {header.navLinks.map((item) => (
            <Link
              key={item.href}
              href={hrefForPage(item.href)}
              className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={(event) => handleSectionLinkClick(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Button
            asChild
            className="relative hidden overflow-hidden rounded-none border border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground md:flex"
          >
            <Link
              href={hrefForPage(header.ctaHref)}
              onClick={(event) => handleSectionLinkClick(event, header.ctaHref)}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left bg-accent"
                style={{ opacity: ctaFillOpacity, scaleX: headerProgress }}
              />
              <span className="relative">{header.ctaLabel}</span>
            </Link>
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
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-2 w-full border border-border bg-card/95 p-4 backdrop-blur-xl md:hidden"
          >
            {header.navLinks.map((item) => (
              <Link
                key={item.href}
                href={hrefForPage(item.href)}
                className="block px-4 py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={(event) => handleSectionLinkClick(event, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-4 w-full rounded-none">
              <Link
                href={hrefForPage(header.ctaHref)}
                onClick={(event) => handleSectionLinkClick(event, header.ctaHref)}
              >
                {header.ctaLabel}
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
