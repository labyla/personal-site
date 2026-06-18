export type PostSeedItem = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl: string
  readingTime: string
  publishedAt: string
  featured: boolean
  sortOrder: number
  status: "published"
  metaTitle: string
  metaDescription: string
  canonicalUrl?: string
}

function postContent(intro: string, body: string) {
  return `## Overview

${intro}

## Notes

${body}

> [!NOTE]
> This seed content is a starting point and should be replaced from Payload Admin.
`
}

export const postSeedItems: PostSeedItem[] = [
  {
    slug: "optimize-nextjs-web-app",
    title: "How to Optimize a Next.js Web App",
    excerpt: "Learn the best practices for optimizing your Next.js applications for better performance.",
    content: postContent(
      "Performance work starts with measuring the real user experience, then removing the bottlenecks that matter most.",
      "This article can cover image strategy, server rendering boundaries, caching, bundle size, and the small interface details that make a Next.js application feel faster.",
    ),
    coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    readingTime: "5 min read",
    publishedAt: "2024-04-15T00:00:00.000Z",
    featured: true,
    sortOrder: 0,
    status: "published",
    metaTitle: "How to Optimize a Next.js Web App",
    metaDescription: "Best practices for optimizing Next.js applications for better performance.",
  },
  {
    slug: "terminal-post-dev-setup",
    title: "Every Tool in My Terminal Post Dev Setup",
    excerpt: "A comprehensive guide to my development environment and the tools I use daily.",
    content: postContent(
      "A development setup should make common tasks easier without becoming a project of its own.",
      "This note can walk through terminal choices, shell configuration, package managers, editor integration, and the habits that keep a setup useful over time.",
    ),
    coverImageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop",
    readingTime: "8 min read",
    publishedAt: "2024-03-22T00:00:00.000Z",
    featured: false,
    sortOrder: 10,
    status: "published",
    metaTitle: "Every Tool in My Terminal Post Dev Setup",
    metaDescription: "A guide to a practical development environment and daily terminal tools.",
  },
  {
    slug: "nextjs-mdx-blog-from-scratch",
    title: "Build a Blog with Next.js and MDX from Scratch",
    excerpt: "Step-by-step tutorial for building a modern blog with Next.js and MDX.",
    content: postContent(
      "A blog needs a clear content model, predictable routing, and a writing workflow that stays pleasant after the first few posts.",
      "This article can explain route structure, metadata, content rendering, styling, and the tradeoffs between MDX and CMS-backed rich text.",
    ),
    coverImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
    readingTime: "12 min read",
    publishedAt: "2024-02-10T00:00:00.000Z",
    featured: false,
    sortOrder: 20,
    status: "published",
    metaTitle: "Build a Blog with Next.js and MDX from Scratch",
    metaDescription: "A tutorial for building a modern blog with Next.js and MDX.",
  },
]
