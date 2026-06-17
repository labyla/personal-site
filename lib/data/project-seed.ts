export type ProjectSeedItem = {
  slug: string
  title: string
  description: string
  excerpt: string
  contentMarkdown: string
  imageUrl: string
  tags: string[]
  href: string
  externalUrl?: string
  publishedAt: string
  metaTitle: string
  metaDescription: string
  canonicalUrl?: string
  featured: boolean
  sortOrder: number
  status: "published"
}

function projectMarkdown(summary: string, result: string) {
  return `## Overview

${summary}

## Approach

The work focused on product clarity, responsive interaction patterns, and a frontend foundation that can evolve without fighting the content model.

{% hint style="success" %}
The goal was to make the experience feel intentional, useful, and ready to ship.
{% endhint %}

## Outcome

${result}
`
}

export const projectSeedItems: ProjectSeedItem[] = [
  {
    slug: "keythm",
    title: "Keythm",
    description: "Experience music typing that — every key has its own personality. The site responds to your fingers like a musical instrument.",
    excerpt: "A playful music typing experience where each keystroke becomes part of an expressive interface.",
    contentMarkdown: projectMarkdown(
      "Keythm explores how typing can feel more tactile, rhythmic, and expressive. The interface treats the keyboard like an instrument and turns familiar input into a small performance.",
      "The result is a polished interactive prototype with a distinctive concept, strong motion language, and a memorable product feel.",
    ),
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "#",
    publishedAt: "2025-01-10T00:00:00.000Z",
    metaTitle: "Keythm Case Study",
    metaDescription: "A case study for Keythm, a playful music typing experience built with Next.js, TypeScript, and Tailwind CSS.",
    featured: true,
    sortOrder: 0,
    status: "published",
  },
  {
    slug: "learning-platform",
    title: "Learning Platform",
    description: "A immersive, gamified learning platform with real payments, real stuff, and real content delivery.",
    excerpt: "A gamified learning product combining progress, payments, and structured content delivery.",
    contentMarkdown: projectMarkdown(
      "The learning platform brings together lessons, motivation loops, and commercial flows into one cohesive product experience.",
      "The project established a scalable product structure for course content, checkout, and learner engagement.",
    ),
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "Stripe"],
    href: "#",
    publishedAt: "2025-02-14T00:00:00.000Z",
    metaTitle: "Learning Platform Case Study",
    metaDescription: "A case study for a gamified learning platform with payments and structured content delivery.",
    featured: false,
    sortOrder: 10,
    status: "published",
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    description: "A space for self-expression in a digital chaos, explore drafts, and gain exposure with clean design.",
    excerpt: "A personal publishing and portfolio space designed for clarity, expression, and discovery.",
    contentMarkdown: projectMarkdown(
      "The portfolio website balances editorial presentation with practical navigation, giving projects and personal writing enough room to breathe.",
      "The result is a flexible frontend that can grow into a CMS-driven personal site without losing its visual identity.",
    ),
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["Next.js", "Framer Motion", "Sanity"],
    href: "#",
    publishedAt: "2025-03-05T00:00:00.000Z",
    metaTitle: "Portfolio Website Case Study",
    metaDescription: "A case study for a clean personal portfolio website with expressive motion and content-focused structure.",
    featured: false,
    sortOrder: 20,
    status: "published",
  },
  {
    slug: "finance-tracker",
    title: "Finance Tracker",
    description: "An intuitive mobile experience for organizing your digital wallet and analyzing your financial health.",
    excerpt: "A mobile finance experience for tracking wallet activity and understanding personal financial health.",
    contentMarkdown: projectMarkdown(
      "The finance tracker focuses on making money movement easier to scan, categorize, and understand from a mobile-first interface.",
      "The final experience emphasizes quick comprehension, clear charts, and a calmer way to review financial activity.",
    ),
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    tags: ["React Native", "Firebase", "Charts"],
    href: "#",
    publishedAt: "2025-04-18T00:00:00.000Z",
    metaTitle: "Finance Tracker Case Study",
    metaDescription: "A case study for a mobile finance tracker focused on wallet organization and financial insights.",
    featured: false,
    sortOrder: 30,
    status: "published",
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    description: "A sleek SaaS landing page with a user-friendly design that enhances engagement.",
    excerpt: "A SaaS dashboard and landing experience designed for clearer product communication and engagement.",
    contentMarkdown: projectMarkdown(
      "The SaaS dashboard combines product storytelling with operational clarity, helping users understand value quickly and move through the experience with confidence.",
      "The work produced a focused interface direction with reusable UI patterns and a stronger conversion path.",
    ),
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["Next.js", "Tailwind", "Recharts"],
    href: "#",
    publishedAt: "2025-05-22T00:00:00.000Z",
    metaTitle: "SaaS Dashboard Case Study",
    metaDescription: "A case study for a SaaS dashboard and landing experience built with Next.js, Tailwind, and Recharts.",
    featured: false,
    sortOrder: 40,
    status: "published",
  },
]
