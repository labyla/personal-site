import config from "@payload-config"
import { getPayload } from "payload"

import type { Post } from "@/payload-types"

import { postSeedItems } from "./post-seed"

export type BlogPostListItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
  href: string
}

export type BlogPostDetail = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: Post["content"]
  coverImageUrl: string
  readingTime: string
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  canonicalUrl: string | null
}

const fallbackPosts: BlogPostListItem[] = postSeedItems.map((post) => ({
  id: `fallback-${post.slug}`,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  image: post.coverImageUrl,
  date: formatDate(post.publishedAt),
  readTime: post.readingTime,
  href: `/blog/${post.slug}`,
}))

type PayloadPost = {
  id: number | string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  content?: Post["content"]
  coverImageUrl?: string | null
  readingTime?: string | null
  publishedAt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  sortOrder?: number | null
  createdAt?: string | null
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function mapPost(post: PayloadPost): BlogPostListItem {
  const slug = post.slug || ""

  return {
    id: String(post.id),
    slug,
    title: post.title || "",
    excerpt: post.excerpt || "",
    image: post.coverImageUrl || "",
    date: formatDate(post.publishedAt),
    readTime: post.readingTime || "",
    href: slug ? `/blog/${slug}` : "#",
  }
}

function mapPostDetail(post: PayloadPost): BlogPostDetail {
  return {
    id: String(post.id),
    slug: post.slug || "",
    title: post.title || "",
    excerpt: post.excerpt || "",
    content: post.content || null,
    coverImageUrl: post.coverImageUrl || "",
    readingTime: post.readingTime || "",
    publishedAt: post.publishedAt || null,
    metaTitle: post.metaTitle || post.title || "",
    metaDescription: post.metaDescription || post.excerpt || "",
    canonicalUrl: post.canonicalUrl || null,
  }
}

function sortPosts(posts: PayloadPost[]) {
  return posts.toSorted((a, b) => {
    const sortOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)

    if (sortOrder !== 0) {
      return sortOrder
    }

    const publishedAt = (b.publishedAt || "").localeCompare(a.publishedAt || "")

    if (publishedAt !== 0) {
      return publishedAt
    }

    const createdAt = (b.createdAt || "").localeCompare(a.createdAt || "")

    if (createdAt !== 0) {
      return createdAt
    }

    return (a.title || "").localeCompare(b.title || "")
  })
}

export async function getPosts(): Promise<BlogPostListItem[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "posts",
      depth: 0,
      limit: 50,
      overrideAccess: true,
      sort: "sortOrder",
      where: {
        status: {
          equals: "published",
        },
      },
    })

    if (result.docs.length === 0) {
      return fallbackPosts
    }

    return sortPosts(result.docs as PayloadPost[]).map(mapPost)
  } catch (error) {
    console.warn("Falling back to static posts because Payload data is unavailable.", error)

    return fallbackPosts
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "posts",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            status: {
              equals: "published",
            },
          },
        ],
      },
    })

    const post = result.docs[0] as PayloadPost | undefined

    return post ? mapPostDetail(post) : null
  } catch (error) {
    console.warn(`Post "${slug}" is unavailable because Payload data could not be loaded.`, error)

    return null
  }
}
